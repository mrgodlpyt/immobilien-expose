// DNG -> JPEG: entrauschen, dann lokale Tonwertkompression.
//
// Die Aufnahmen sind stark unterbelichtet (dunkle Räume, helle Fenster). Hebt man die Schatten
// einfach an, wird das Sensorrauschen mit angehoben: grobes gelb-grünes Farbrauschen, das wie
// ein Gelbstich wirkt, und Grieseln. Deshalb in dieser Reihenfolge:
//
//  1. Dekodieren: das lineare DNG wird direkt gelesen (nicht über den RAW-Konverter von macOS,
//     der die dunklen Tonwerte dieser Dateien farblich verfälscht – siehe unten).
//  2. Rauschprofil messen (Rauschen je Helligkeitsstufe).
//  3. Helligkeit entrauschen (kantenerhaltender Guided Filter, Stärke nach Rauschprofil).
//  4. Farbe entrauschen (an der Helligkeit geführter Filter, großflächig). Wo das Signal im
//     Rauschen untergeht, wird die Farbe neutral – dort gibt es keine verlässliche Farbinformation.
//  5. Tonwerte: großflächige Helligkeit zusammenschieben (Schatten hoch, Fenster runter),
//     Details bleiben; Lichter laufen weich aus.
//
// Aufruf: develop <in.dng> <out.jpg> <maxBreite> <qualität 0..1> [biasEV=0] [wandHell=0.50] [sättigung=0.85] [mitteHell=0.06] [rausch=0.6]
//   wandHell:  Zielhelligkeit (linear) der hellen Flächen (90. Perzentil, meist die Wände)
//   mitteHell: Mindesthelligkeit (linear) des mittleren Bildbereichs nach dem Anheben
//   rausch:    Stärke der Rauschminderung (0.6 = Standard, 1 = kräftig, 0 = aus)
import Foundation
import CoreImage
import CoreGraphics
import ImageIO
import UniformTypeIdentifiers

let a = CommandLine.arguments
guard a.count >= 5 else { print("usage: develop in out maxW q [biasEV] [wandHell] [sat] [mitteHell] [rausch]"); exit(2) }
let inURL = URL(fileURLWithPath: a[1]), outURL = URL(fileURLWithPath: a[2])
let maxW = Double(a[3])!, quality = Double(a[4])!
let biasEV = Float(a.count > 5 ? Double(a[5])! : 0)
let anchorOut = Float(a.count > 6 ? Double(a[6])! : 0.50)
let satBase = Float(a.count > 7 ? Double(a[7])! : 0.85)
let medOut = Float(a.count > 8 ? Double(a[8])! : 0.06)
let nrStrength = Float(a.count > 9 ? Double(a[9])! : 0.6)
let maxLift: Float = 5.0
let t0 = Date()
func lap(_ s: String) { FileHandle.standardError.write(String(format: "  [%.1fs] %@\n", Date().timeIntervalSince(t0), s).data(using: .utf8)!) }

// ---------- 1. Dekodieren ----------
// Die Insta360-DNGs (Export aus Insta360 Studio) sind unkomprimierte lineare 16-Bit-RGB-TIFFs.
// Sie werden hier direkt gelesen: Weißabgleich (AsShotNeutral), Farbmatrix (ColorMatrix1),
// Belichtungsausgleich (BaselineExposure). NICHT über den RAW-Konverter von macOS (CIRAWFilter):
// der verfälscht bei diesen Dateien die dunklen Tonwerte – unterhalb von etwa 0,4 % Helligkeit
// fällt Blau fast auf null, Rot steigt. Im dunklen Original fällt das nicht auf, nach dem
// Aufhellen ist es ein kräftiger Gelbstich mit fleckigem Farbrauschen.
@inline(__always) func smooth(_ e0: Float, _ e1: Float, _ x: Float) -> Float { let t = min(max((x - e0) / (e1 - e0), 0), 1); return t * t * (3 - 2 * t) }
typealias M3 = [Double]   // 3x3, zeilenweise
func mul(_ a: M3, _ b: M3) -> M3 { var r = M3(repeating: 0, count: 9); for i in 0..<3 { for j in 0..<3 { for k in 0..<3 { r[i * 3 + j] += a[i * 3 + k] * b[k * 3 + j] } } }; return r }
func mulv(_ a: M3, _ v: [Double]) -> [Double] {
  var r = [Double](repeating: 0, count: 3)
  for i in 0..<3 { let x: Double = a[i * 3] * v[0]; let y: Double = a[i * 3 + 1] * v[1]; let z: Double = a[i * 3 + 2] * v[2]; r[i] = x + y + z }
  return r
}
func inv(_ m: M3) -> M3 {
  let c00: Double = m[4] * m[8] - m[5] * m[7]
  let c01: Double = m[5] * m[6] - m[3] * m[8]
  let c02: Double = m[3] * m[7] - m[4] * m[6]
  let det: Double = m[0] * c00 + m[1] * c01 + m[2] * c02
  var r = M3(repeating: 0, count: 9)
  r[0] = c00; r[1] = m[2] * m[7] - m[1] * m[8]; r[2] = m[1] * m[5] - m[2] * m[4]
  r[3] = c01; r[4] = m[0] * m[8] - m[2] * m[6]; r[5] = m[2] * m[3] - m[0] * m[5]
  r[6] = c02; r[7] = m[1] * m[6] - m[0] * m[7]; r[8] = m[0] * m[4] - m[1] * m[3]
  for i in 0..<9 { r[i] /= det }
  return r
}
func diag(_ v: [Double]) -> M3 { [v[0], 0, 0, 0, v[1], 0, 0, 0, v[2]] }

/// Flächenmittel-Gewichte für das Verkleinern von nIn auf nOut Werte
func taps(_ nIn: Int, _ nOut: Int) -> (i0: [Int], k: Int, wt: [Float]) {
  let s = Double(nIn) / Double(nOut); let k = Int(s.rounded(.up)) + 1
  var i0 = [Int](repeating: 0, count: nOut), wt = [Float](repeating: 0, count: nOut * k)
  for o in 0..<nOut {
    let a = Double(o) * s, b = Double(o + 1) * s
    let first = Int(a); i0[o] = first
    for j in 0..<k { let i = first + j; if i >= nIn { break }
      let ov = min(b, Double(i + 1)) - max(a, Double(i)); if ov > 0 { wt[o * k + j] = Float(ov / s) } }
  }
  return (i0, k, wt)
}

func decodeLinearDNG(_ url: URL, maxW: Int) -> (Int, Int, [Float])? {
  guard let data = try? Data(contentsOf: url, options: .alwaysMapped), data.count > 16 else { return nil }
  return data.withUnsafeBytes { (raw: UnsafeRawBufferPointer) -> (Int, Int, [Float])? in
    let le: Bool
    if raw[0] == 0x49 && raw[1] == 0x49 { le = true } else if raw[0] == 0x4D && raw[1] == 0x4D { le = false } else { return nil }
    func u16(_ o: Int) -> Int { let v = raw.loadUnaligned(fromByteOffset: o, as: UInt16.self); return Int(le ? UInt16(littleEndian: v) : UInt16(bigEndian: v)) }
    func u32(_ o: Int) -> Int { let v = raw.loadUnaligned(fromByteOffset: o, as: UInt32.self); return Int(le ? UInt32(littleEndian: v) : UInt32(bigEndian: v)) }
    func i32(_ o: Int) -> Int { Int(Int32(truncatingIfNeeded: u32(o))) }
    guard u16(2) == 42 else { return nil }
    let ifd = u32(4); let cnt = u16(ifd)
    let size: [Int: Int] = [1: 1, 3: 2, 4: 4, 5: 8, 10: 8]
    var tags = [Int: [Double]]()
    for k in 0..<cnt {
      let e = ifd + 2 + k * 12
      let tag = u16(e), typ = u16(e + 2), nv = u32(e + 4)
      guard let sz = size[typ], nv <= 64 || tag == 273 || tag == 279 else { continue }
      let p = sz * nv <= 4 ? e + 8 : u32(e + 8)
      var v = [Double](); v.reserveCapacity(nv)
      for j in 0..<nv {
        switch typ {
        case 1: v.append(Double(raw[p + j]))
        case 3: v.append(Double(u16(p + 2 * j)))
        case 4: v.append(Double(u32(p + 4 * j)))
        case 5: v.append(Double(u32(p + 8 * j)) / Double(max(u32(p + 8 * j + 4), 1)))
        default: let d = i32(p + 8 * j + 4); v.append(Double(i32(p + 8 * j)) / Double(d == 0 ? 1 : d))
        }
      }
      tags[tag] = v
    }
    guard tags[259]?.first == 1, tags[262]?.first == 34892, tags[277]?.first == 3, tags[258] == [16, 16, 16],
          (tags[284]?.first ?? 1) == 1, let offs = tags[273]?.map({ Int($0) }),
          let cm = tags[50721], cm.count == 9, let neutral = tags[50728], neutral.count == 3,
          let W = tags[256].map({ Int($0[0]) }), let H = tags[257].map({ Int($0[0]) }) else { return nil }
    let rps = Int(tags[278]?.first ?? Double(H))
    let white = Float(tags[50717]?.first ?? 65535), black = Float(tags[50714]?.first ?? 0)
    let be = tags[50730]?.first ?? 0
    guard offs.count * rps >= H, offs.allSatisfy({ $0 + 6 <= raw.count }) else { return nil }

    // Kamera-RGB (weißabgeglichen) -> lineares sRGB: sRGB <- XYZ(D65) <- Bradford <- XYZ(Aufnahmeweiß) <- Kamera
    let camToXYZ = mul(inv(cm), diag(neutral))
    let xyzW = mulv(camToXYZ, [1, 1, 1])
    let bradford: M3 = [0.8951, 0.2664, -0.1614, -0.7502, 1.7135, 0.0367, 0.0389, -0.0685, 1.0296]
    let s = mulv(bradford, xyzW), d = mulv(bradford, [0.95047, 1.0, 1.08883])
    let adapt = mul(inv(bradford), mul(diag([d[0] / s[0], d[1] / s[1], d[2] / s[2]]), bradford))
    let xyzToSRGB: M3 = [3.2404542, -1.5371385, -0.4985314, -0.9692660, 1.8760108, 0.0415560, 0.0556434, -0.2040259, 1.0572252]
    let gain = pow(2.0, be)
    let M = mul(xyzToSRGB, mul(adapt, camToXYZ)).map { Float($0 * gain) }
    FileHandle.standardError.write(String(format: "  DNG direkt: %dx%d, Weißabgleich %.3f/1/%.3f, Belichtungsausgleich %+.2f EV\n", W, H, neutral[0], neutral[2], be).data(using: .utf8)!)

    let w = min(maxW, W), h = max(1, Int((Double(H) * Double(w) / Double(W)).rounded()))
    let tx = taps(W, w), ty = taps(H, h)
    var vy = [[(Int, Float)]](repeating: [], count: H)
    for y in 0..<h { for j in 0..<ty.k { let wgt = ty.wt[y * ty.k + j]; if wgt > 0 { vy[ty.i0[y] + j].append((y, wgt)) } } }
    let norm = 1 / (white - black)
    let wbR = Float(1 / neutral[0]), wbG = Float(1 / neutral[1]), wbB = Float(1 / neutral[2])
    var row = [Float](repeating: 0, count: W * 3), rowH = [Float](repeating: 0, count: w * 3)
    var acc = [Float](repeating: 0, count: w * h * 3)
    for Y in 0..<H {
      let base = offs[Y / rps] + (Y % rps) * W * 6
      guard base + W * 6 <= raw.count else { return nil }
      for x in 0..<W {
        let p = base + x * 6
        let v0 = raw.loadUnaligned(fromByteOffset: p, as: UInt16.self), v1 = raw.loadUnaligned(fromByteOffset: p + 2, as: UInt16.self), v2 = raw.loadUnaligned(fromByteOffset: p + 4, as: UInt16.self)
        let cr = max(Float(le ? UInt16(littleEndian: v0) : UInt16(bigEndian: v0)) - black, 0) * norm
        let cg = max(Float(le ? UInt16(littleEndian: v1) : UInt16(bigEndian: v1)) - black, 0) * norm
        let cb = max(Float(le ? UInt16(littleEndian: v2) : UInt16(bigEndian: v2)) - black, 0) * norm
        var r = cr * wbR, g = cg * wbG, b = cb * wbB
        // Kurz vor der Sättigung laufen die Kanäle im Rohbild zusammen (R = G = B); nach dem Weißabgleich
        // wäre das Magenta. Deshalb dort gleitend auf Neutral (hellster Kanal) ziehen.
        let m = max(cr, max(cg, cb))
        if m > 0.6 {
          let t = smooth(0.6, 0.9, m), L = max(r, max(g, b))
          r += t * (L - r); g += t * (L - g); b += t * (L - b)
        }
        let o = x * 3
        row[o] = r; row[o + 1] = g; row[o + 2] = b
      }
      for x in 0..<w {
        var r: Float = 0, g: Float = 0, b: Float = 0
        for j in 0..<tx.k { let wgt = tx.wt[x * tx.k + j]; if wgt > 0 { let o = (tx.i0[x] + j) * 3; r += wgt * row[o]; g += wgt * row[o + 1]; b += wgt * row[o + 2] } }
        rowH[x * 3] = r; rowH[x * 3 + 1] = g; rowH[x * 3 + 2] = b
      }
      for (y, wgt) in vy[Y] { let o = y * w * 3; for i in 0..<(w * 3) { acc[o + i] += wgt * rowH[i] } }
    }
    for i in 0..<(w * h) {
      let o = i * 3; let r = acc[o], g = acc[o + 1], b = acc[o + 2]
      acc[o] = M[0] * r + M[1] * g + M[2] * b; acc[o + 1] = M[3] * r + M[4] * g + M[5] * b; acc[o + 2] = M[6] * r + M[7] * g + M[8] * b
    }
    return (w, h, acc)
  }
}

/// Ersatzweg für alles andere (JPEG, fremde RAW-Formate): Core Image
func decodeCoreImage(_ url: URL, maxW: Double) -> (Int, Int, [Float])? {
  let linear = CGColorSpace(name: CGColorSpace.extendedLinearSRGB)!
  var img: CIImage
  if let raw = CIRAWFilter(imageURL: url) {
    raw.scaleFactor = Float(min(1.0, maxW / Double(raw.nativeSize.width)))
    raw.exposure = 0
    raw.extendedDynamicRangeAmount = 2
    guard let out = raw.outputImage else { return nil }
    img = out
  } else if let plain = CIImage(contentsOf: url) {
    let s = min(1.0, maxW / Double(plain.extent.width))
    img = plain.transformed(by: CGAffineTransform(scaleX: s, y: s))
  } else { return nil }
  let ext = img.extent.integral
  let w = Int(ext.width), h = Int(ext.height)
  let ctx = CIContext(options: [.workingFormat: CIFormat.RGBAf, .workingColorSpace: linear])
  var b4 = [Float](repeating: 0, count: w * h * 4)
  b4.withUnsafeMutableBytes { p in
    ctx.render(img, toBitmap: p.baseAddress!, rowBytes: w * 4 * MemoryLayout<Float>.size, bounds: ext, format: .RGBAf, colorSpace: linear)
  }
  var b3 = [Float](repeating: 0, count: w * h * 3)
  for i in 0..<(w * h) { b3[i * 3] = b4[i * 4]; b3[i * 3 + 1] = b4[i * 4 + 1]; b3[i * 3 + 2] = b4[i * 4 + 2] }
  return (w, h, b3)
}

guard let (w, h, decoded) = decodeLinearDNG(inURL, maxW: Int(maxW)) ?? decodeCoreImage(inURL, maxW: maxW) else { print("cannot read input"); exit(1) }
let n = w * h
var buf = decoded
lap("dekodiert \(w)x\(h)")

// ---------- Hilfen ----------
/// Box-Mittel (2r+1)², waagerecht mit Umlauf (Kugelbild), senkrecht mit Randwiederholung.
/// Die Laufsummen sind Double: mit Float bleibt nach einem sehr hellen Fenster ein Rundungsfehler
/// in der Summe hängen, der in dunklen Bereichen derselben Spalte als Streifen sichtbar wird.
func box(_ src: [Float], _ r: Int) -> [Float] {
  var tmp = [Float](repeating: 0, count: n), dst = tmp
  let inv = 1 / Double(2 * r + 1)
  src.withUnsafeBufferPointer { s in tmp.withUnsafeMutableBufferPointer { t in
    for y in 0..<h {
      let row = y * w; var acc: Double = 0
      for k in -r...r { acc += Double(s[row + ((k % w) + w) % w]) }
      for x in 0..<w {
        t[row + x] = Float(acc * inv)
        acc += Double(s[row + (x + r + 1) % w]) - Double(s[row + ((x - r) % w + w) % w])
      }
    }
  } }
  tmp.withUnsafeBufferPointer { t in dst.withUnsafeMutableBufferPointer { d in
    for x in 0..<w {
      var acc: Double = 0
      for k in -r...r { acc += Double(t[min(max(k, 0), h - 1) * w + x]) }
      for y in 0..<h {
        d[y * w + x] = Float(acc * inv)
        acc += Double(t[min(y + r + 1, h - 1) * w + x]) - Double(t[max(y - r, 0) * w + x])
      }
    }
  } }
  return dst
}
/// Guided Filter: Eingabe C, geführt von G, je Pixel eigenes eps (Rauschvarianz)
func guided(_ G: [Float], _ C: [Float]?, _ r: Int, _ eps: [Float]) -> [Float] {
  let mG = box(G, r)
  var t = [Float](repeating: 0, count: n)
  for i in 0..<n { t[i] = G[i] * G[i] }
  let mGG = box(t, r)
  let mC: [Float], mGC: [Float]
  if let C = C { mC = box(C, r); for i in 0..<n { t[i] = G[i] * C[i] }; mGC = box(t, r) } else { mC = mG; mGC = mGG }
  var ga = [Float](repeating: 0, count: n), gb = ga
  for i in 0..<n {
    let v = Float(max(Double(mGG[i]) - Double(mG[i]) * Double(mG[i]), 0))
    let cov = Float(Double(mGC[i]) - Double(mG[i]) * Double(mC[i]))
    let aa = cov / (v + eps[i])
    ga[i] = aa; gb[i] = mC[i] - aa * mG[i]
  }
  let ma = box(ga, r), mb = box(gb, r)
  for i in 0..<n { t[i] = ma[i] * G[i] + mb[i] }
  return t
}

// ---------- 2. Helligkeit (vorzeichenbehaftet) und Rauschprofil ----------
var Ys = [Float](repeating: 0, count: n)
for i in 0..<n { let o = i * 3; Ys[i] = 0.2126 * buf[o] + 0.7152 * buf[o + 1] + 0.0722 * buf[o + 2] }
let Ym = box(Ys, 2)
var sig = [Float](repeating: 0, count: n)          // erwartete Rausch-Standardabweichung je Pixel
do {
  let m1 = box(Ys, 1)
  let lo: Float = -14, step: Float = 0.5; let nb = 36
  var bins = [[Float]](repeating: [], count: nb)
  var i = 0
  while i < n {
    let b = min(nb - 1, max(0, Int((log2f(max(Ym[i], 6e-5)) - lo) / step)))
    bins[b].append(abs(Ys[i] - m1[i])); i += 13
  }
  var s = [Float](repeating: -1, count: nb)
  for b in 0..<nb where bins[b].count > 400 { bins[b].sort(); s[b] = 1.4826 * bins[b][bins[b].count / 2] / 0.943 }
  // Lücken füllen, dann monoton steigend (Rauschen nimmt mit dem Signal zu; Textur würde es verfälschen)
  var last: Float = -1
  for b in 0..<nb { if s[b] >= 0 { last = s[b] } else if last >= 0 { s[b] = last } }
  if let f = s.first(where: { $0 >= 0 }) { for b in 0..<nb where s[b] < 0 { s[b] = f } }
  // dunkelste Stufen bestimmen das Grundrauschen; nach oben höchstens sqrt-förmig wachsen lassen
  let floorS = s[0...min(6, nb - 1)].filter { $0 > 0 }.min() ?? 1e-4
  for b in 0..<nb {
    let level = exp2f(lo + (Float(b) + 0.5) * step)
    let cap = (floorS * floorS + 0.012 * level * floorS * 40).squareRoot() * 1.6     // großzügige Obergrenze
    s[b] = min(max(s[b], floorS), max(cap, floorS))
  }
  for b in 1..<nb { s[b] = max(s[b], s[b - 1]) }
  for i in 0..<n {
    let t = min(max((log2f(max(Ym[i], 6e-5)) - lo) / step - 0.5, 0), Float(nb - 1)); let k = Int(t), k1 = min(k + 1, nb - 1)
    sig[i] = s[k] + (s[k1] - s[k]) * (t - Float(k))
  }
  print(String(format: "Rauschen: Grundrauschen %.5f, bei 0.01: %.5f, bei 0.1: %.5f, bei 1.0: %.5f",
               floorS, s[min(nb - 1, Int((log2f(0.01) - lo) / step))], s[min(nb - 1, Int((log2f(0.1) - lo) / step))], s[min(nb - 1, Int((0 - lo) / step))]))
}
lap("Rauschprofil")

// ---------- 3. Helligkeit entrauschen ----------
var Yd = Ys
if nrStrength > 0 {
  var eps = [Float](repeating: 0, count: n)
  for i in 0..<n { let e = 3.0 * nrStrength * sig[i]; eps[i] = e * e }
  Yd = guided(Ys, nil, 2, eps)
  for i in 0..<n { let e = 1.2 * nrStrength * sig[i]; eps[i] = e * e }
  Yd = guided(Yd, nil, 6, eps)
}
lap("Helligkeit entrauscht")

// ---------- 4. Farbe entrauschen (geführt von der entrauschten Helligkeit) ----------
var Cu = [Float](repeating: 0, count: n), Cv = Cu
for i in 0..<n { let o = i * 3; Cu[i] = buf[o] - Ys[i]; Cv[i] = buf[o + 2] - Ys[i] }
buf = []                                           // Speicher freigeben
if nrStrength > 0 {
  var eps = [Float](repeating: 0, count: n)
  for i in 0..<n { let e = 0.6 * sig[i], g = 0.04 * max(Yd[i], 0); eps[i] = e * e + g * g }
  let rc = max(4, w / 512)                         // ~10 px bei 5120 Breite
  Cu = guided(Yd, Cu, rc, eps); Cv = guided(Yd, Cv, rc, eps)
}
lap("Farbe entrauscht")

// ---------- 5. Basis der Tonwertkompression (verkleinertes Raster) ----------
let ds = max(1, w / 640)
let lw = w / ds, lh = h / ds
var I = [Float](repeating: 0, count: lw * lh)
for ly in 0..<lh { for lx in 0..<lw {
  var s: Float = 0
  for yy in 0..<ds { let row = (ly * ds + yy) * w + lx * ds; for xx in 0..<ds { s += Yd[row + xx] } }
  I[ly * lw + lx] = log2f(max(s / Float(ds * ds), 1e-5))
} }
func boxL(_ src: [Float], _ r: Int) -> [Float] {
  var tmp = [Float](repeating: 0, count: lw * lh), dst = tmp
  let cnt = Float(2 * r + 1)
  for y in 0..<lh { for x in 0..<lw { var s: Float = 0; for k in -r...r { s += src[y * lw + ((x + k) % lw + lw) % lw] }; tmp[y * lw + x] = s / cnt } }
  for y in 0..<lh { for x in 0..<lw { var s: Float = 0; for k in -r...r { s += tmp[min(max(y + k, 0), lh - 1) * lw + x] }; dst[y * lw + x] = s / cnt } }
  return dst
}
let rL = max(4, lw / 36)
let epsL: Float = 0.5
let mI = boxL(I, rL), mII = boxL(I.map { $0 * $0 }, rL)
var la = [Float](repeating: 0, count: lw * lh), lb = la
for i in 0..<(lw * lh) { let v = max(mII[i] - mI[i] * mI[i], 0); la[i] = v / (v + epsL); lb[i] = mI[i] * (1 - la[i]) }
let ma = boxL(la, rL), mb = boxL(lb, rL)
var baseLow = [Float](repeating: 0, count: lw * lh)
for i in 0..<(lw * lh) { baseLow[i] = ma[i] * I[i] + mb[i] }
let sorted = baseLow.sorted()
func pct(_ p: Double) -> Float { sorted[min(sorted.count - 1, Int(Double(sorted.count) * p))] }
let bMed = pct(0.5), bHi = pct(0.99), bA = pct(0.90)
let TA = log2f(anchorOut) + biasEV
var cS = (TA - (log2f(medOut) + biasEV)) / max(bA - bMed, 0.5); cS = min(max(cS, 0.45), 0.95)
var cH = (log2f(0.93) - TA) / max(bHi - bA, 0.3); cH = min(max(cH, 0.3), 1.0)
print(String(format: "Basis log2: p50 %.2f  p90 %.2f  p99 %.2f  -> Anker %+.2f EV, Schatten x%.2f, Lichter x%.2f", bMed, bA, bHi, TA - bA, cS, cH))
@inline(__always) func bilin(_ g: [Float], _ fx: Float, _ fy: Float) -> Float {
  let x0f = floorf(fx), y0f = floorf(fy); let tx = fx - x0f, ty = fy - y0f
  let x0 = ((Int(x0f) % lw) + lw) % lw, x1 = (x0 + 1) % lw
  let y0 = min(max(Int(y0f), 0), lh - 1), y1 = min(max(Int(y0f) + 1, 0), lh - 1)
  return (g[y0 * lw + x0] * (1 - tx) + g[y0 * lw + x1] * tx) * (1 - ty) + (g[y1 * lw + x0] * (1 - tx) + g[y1 * lw + x1] * tx) * ty
}

// ---------- Farbsäume: Umgebung sehr heller Flächen (Fenster, Gegenlicht) ----------
// Die Insta360-Linsen zeichnen um überstrahlte Flächen violette Säume und Schleier. In deren Nähe
// wird der Magenta-Anteil herausgenommen (Grün auf das Niveau des schwächeren von Rot/Blau angehoben).
var halo = [Float](repeating: 0, count: n)
do {
  for i in 0..<n { halo[i] = smooth(bA + 2.0, bA + 3.5, log2f(max(Yd[i], 1e-6))) }
  let rF = max(3, w / 512)
  halo = box(box(halo, rF), rF)
}
lap("Farbsäume")

// ---------- 6. Tonwerte anwenden ----------
@inline(__always) func enc(_ v: Float) -> UInt8 {
  let cl = min(max(v, 0), 1)
  let s = cl <= 0.0031308 ? 12.92 * cl : 1.055 * powf(cl, 1 / 2.4) - 0.055
  return UInt8(min(255, max(0, (s * 255).rounded())))
}
var out8 = [UInt8](repeating: 255, count: n * 4)
var white = 0, sumLift: Double = 0
let knee: Float = 0.72
for y in 0..<h {
  let fyL = (Float(y) + 0.5) / Float(ds) - 0.5
  for x in 0..<w {
    let i = y * w + x, o = i * 4          // out8 ist RGBA
    let s0 = sig[i]
    let yl = max(Yd[i], 0.25 * s0, 1e-5)                      // unterhalb des Rauschens nicht weiter aufziehen
    let L = log2f(yl)
    let fxL = (Float(x) + 0.5) / Float(ds) - 0.5
    let base = bilin(ma, fxL, fyL) * L + bilin(mb, fxL, fyL)
    let d = base - bA
    var Lo = TA + (d >= 0 ? cH : cS) * d + (L - base)
    Lo = min(Lo, L + maxLift)
    let lift = Lo - L
    sumLift += Double(lift)
    var Yt = exp2f(Lo)
    if Yt > knee { Yt = knee + (1 - knee) * (1 - expf(-(Yt - knee) / (1 - knee))) }
    if Yt > 0.985 { white += 1 }

    // Farbe: Verhältnis zur Helligkeit; wo das Signal im Rauschen liegt -> neutral
    let rel = smooth(1.0, 5.0, yl / max(s0, 1e-7))            // 0 = im Rauschen, 1 = verlässlich
    var rr = 1 + (Cu[i] / yl) * rel, rb = 1 + (Cv[i] / yl) * rel
    var rg = (1 - 0.2126 * rr - 0.0722 * rb) / 0.7152
    let hk = smooth(0.02, 0.2, halo[i])
    if hk > 0 { let mn = min(rr, rb); if rg < mn { rg += 0.9 * hk * (mn - rg) } }
    rr = max(rr, 0.02); rg = max(rg, 0.02); rb = max(rb, 0.02)
    let s = satBase * (1 - 0.30 * smooth(2.0, 5.0, lift)) * (1 - 0.70 * smooth(0.55, 1.0, Yt))
    rr = powf(rr, s); rg = powf(rg, s); rb = powf(rb, s)
    let yn = 0.2126 * rr + 0.7152 * rg + 0.0722 * rb
    var R = Yt * rr / yn, G = Yt * rg / yn, B = Yt * rb / yn
    let m = max(R, max(G, B))
    if m > 1 { let t = min(max((1 - Yt) / max(m - Yt, 1e-6), 0), 1); R = Yt + (R - Yt) * t; G = Yt + (G - Yt) * t; B = Yt + (B - Yt) * t }
    out8[o] = enc(R); out8[o + 1] = enc(G); out8[o + 2] = enc(B)
  }
}
print(String(format: "mittlere Anhebung %.2f EV, reines Weiß %.2f%%", sumLift / Double(n), Double(white) * 100 / Double(n)))
lap("Tonwerte")

// ---------- 7. Schreiben ----------
let provider = CGDataProvider(data: Data(out8) as CFData)!
let cgimg = CGImage(width: w, height: h, bitsPerComponent: 8, bitsPerPixel: 32, bytesPerRow: w * 4,
                    space: CGColorSpace(name: CGColorSpace.sRGB)!, bitmapInfo: CGBitmapInfo(rawValue: CGImageAlphaInfo.noneSkipLast.rawValue),
                    provider: provider, decode: nil, shouldInterpolate: false, intent: .defaultIntent)!
let dest = CGImageDestinationCreateWithURL(outURL as CFURL, UTType.jpeg.identifier as CFString, 1, nil)!
CGImageDestinationAddImage(dest, cgimg, [kCGImageDestinationLossyCompressionQuality: quality] as CFDictionary)
guard CGImageDestinationFinalize(dest) else { print("write failed"); exit(1) }
print("ok")
