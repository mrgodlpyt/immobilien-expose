// DNG (oder JPEG) -> JPEG mit lokaler Tonwertkompression.
// Dunkle Innenräume mit hellen Fenstern: Die großflächige Helligkeit ("Basis") wird
// zusammengeschoben, feine Details bleiben erhalten. So werden Schatten angehoben,
// ohne dass Fenster und weiße Wände ausfressen (Durand/Dorsey-Prinzip, Basis per
// Guided Filter auf log2-Luminanz). Farbrauschen in den Schatten wird geglättet,
// die Sättigung beim Anheben zurückgenommen, Lichter laufen weich aus.
//
// Aufruf: develop <in.dng> <out.jpg> <maxBreite> <qualität 0..1> [biasEV=0] [wandHell=0.42] [sättigung=0.70] [mitteHell=0.045]
//   wandHell:  Zielhelligkeit (linear) der hellen Flächen (90. Perzentil, meist die Wände)
//   mitteHell: Mindesthelligkeit (linear) des mittleren Bildbereichs nach dem Anheben
import Foundation
import CoreImage
import CoreGraphics
import ImageIO
import UniformTypeIdentifiers

let a = CommandLine.arguments
guard a.count >= 5 else { print("usage: develop in out maxW q [biasEV] [wandHell] [sat] [mitteHell]"); exit(2) }
let inURL = URL(fileURLWithPath: a[1]), outURL = URL(fileURLWithPath: a[2])
let maxW = Double(a[3])!, quality = Double(a[4])!
let biasEV = Float(a.count > 5 ? Double(a[5])! : 0)
let anchorOut = Float(a.count > 6 ? Double(a[6])! : 0.42)
let satBase = Float(a.count > 7 ? Double(a[7])! : 0.70)
let medOut = Float(a.count > 8 ? Double(a[8])! : 0.045)
let maxLift: Float = 5.0            // höchstens so viele Blendenstufen anheben
let wrapX = true                    // Kugelbild: linker und rechter Rand gehören zusammen

// ---------- 1. Dekodieren (linear, mit Lichterreserve) ----------
let linear = CGColorSpace(name: CGColorSpace.extendedLinearSRGB)!
var img: CIImage
if let raw = CIRAWFilter(imageURL: inURL) {
  raw.scaleFactor = Float(min(1.0, maxW / Double(raw.nativeSize.width)))
  raw.exposure = 0
  raw.extendedDynamicRangeAmount = 2
  if raw.isLuminanceNoiseReductionSupported { raw.luminanceNoiseReductionAmount = 0.8 }
  if raw.isColorNoiseReductionSupported { raw.colorNoiseReductionAmount = 1.0 }
  if raw.isSharpnessSupported { raw.sharpnessAmount = 0.2 }
  guard let out = raw.outputImage else { print("raw decode failed"); exit(1) }
  img = out
} else if let plain = CIImage(contentsOf: inURL) {
  let s = min(1.0, maxW / Double(plain.extent.width))
  img = plain.transformed(by: CGAffineTransform(scaleX: s, y: s))
} else { print("cannot read input"); exit(1) }

let ext = img.extent.integral
let w = Int(ext.width), h = Int(ext.height), n = w * h
let ctx = CIContext(options: [.workingFormat: CIFormat.RGBAh, .workingColorSpace: linear])
var buf = [Float](repeating: 0, count: n * 4)
buf.withUnsafeMutableBytes { p in
  ctx.render(img, toBitmap: p.baseAddress!, rowBytes: w * 4 * MemoryLayout<Float>.size, bounds: ext, format: .RGBAf, colorSpace: linear)
}

// ---------- 2. Luminanz ----------
var L = [Float](repeating: 0, count: n)          // log2-Luminanz
var Ylin = [Float](repeating: 0, count: n)
for i in 0..<n {
  let o = i * 4
  let y = max(0.2126 * max(buf[o], 0) + 0.7152 * max(buf[o + 1], 0) + 0.0722 * max(buf[o + 2], 0), 1e-5)
  Ylin[i] = y; L[i] = log2f(y)
}

// ---------- 3. Basis per Guided Filter auf verkleinertem Raster ----------
let ds = max(1, w / 640)
let lw = w / ds, lh = h / ds
var I = [Float](repeating: 0, count: lw * lh)
for ly in 0..<lh { for lx in 0..<lw {
  var s: Float = 0
  for yy in 0..<ds { let row = (ly * ds + yy) * w + lx * ds; for xx in 0..<ds { s += Ylin[row + xx] } }
  I[ly * lw + lx] = log2f(max(s / Float(ds * ds), 1e-5))
} }
func box(_ src: [Float], _ r: Int) -> [Float] {
  var tmp = [Float](repeating: 0, count: lw * lh), dst = tmp
  let cnt = Float(2 * r + 1)
  for y in 0..<lh { for x in 0..<lw {
    var s: Float = 0
    for k in -r...r { var xx = x + k; if wrapX { xx = (xx % lw + lw) % lw } else { xx = min(max(xx, 0), lw - 1) }; s += src[y * lw + xx] }
    tmp[y * lw + x] = s / cnt
  } }
  for y in 0..<lh { for x in 0..<lw {
    var s: Float = 0
    for k in -r...r { let yy = min(max(y + k, 0), lh - 1); s += tmp[yy * lw + x] }
    dst[y * lw + x] = s / cnt
  } }
  return dst
}
let r = max(4, lw / 36)
let eps: Float = 0.5                              // (Blendenstufen)²: größere Kanten bleiben scharf
let mI = box(I, r)
let mII = box(I.map { $0 * $0 }, r)
var ga = [Float](repeating: 0, count: lw * lh), gb = ga
for i in 0..<(lw * lh) { let v = max(mII[i] - mI[i] * mI[i], 0); ga[i] = v / (v + eps); gb[i] = mI[i] * (1 - ga[i]) }
let ma = box(ga, r), mb = box(gb, r)

// Kennwerte der Basis
var baseLow = [Float](repeating: 0, count: lw * lh)
for i in 0..<(lw * lh) { baseLow[i] = ma[i] * I[i] + mb[i] }
let sorted = baseLow.sorted()
func pct(_ p: Double) -> Float { sorted[min(sorted.count - 1, Int(Double(sorted.count) * p))] }
let bMed = pct(0.5), bHi = pct(0.99), bLo = pct(0.02), bA = pct(0.90)
// Anker: helle Flächen (Wände) auf wandHell; darunter Schatten moderat anheben,
// darüber (Fenster, Himmel) zusammenschieben.
let TA = log2f(anchorOut) + biasEV
var cS = (TA - (log2f(medOut) + biasEV)) / max(bA - bMed, 0.5)
cS = min(max(cS, 0.45), 0.95)
var cH = (log2f(0.93) - TA) / max(bHi - bA, 0.3)
cH = min(max(cH, 0.3), 1.0)
print(String(format: "size %dx%d  Basis log2: p2 %.2f  p50 %.2f  p90 %.2f  p99 %.2f  -> Anker %+.2f EV, Schatten x%.2f, Lichter x%.2f",
             w, h, bLo, bMed, bA, bHi, TA - bA, cS, cH))

// ---------- 4. Farbe: geglättete Farbverhältnisse für dunkle Pixel ----------
let cs = max(1, w / 1280)
let cw = w / cs, ch = h / cs
var cr = [Float](repeating: 1, count: cw * ch), cg = cr, cb = cr
for cy in 0..<ch { for cx in 0..<cw {
  var sr: Float = 0, sg: Float = 0, sb: Float = 0
  for yy in 0..<cs { let row = (cy * cs + yy) * w + cx * cs; for xx in 0..<cs { let o = (row + xx) * 4; sr += max(buf[o], 0); sg += max(buf[o + 1], 0); sb += max(buf[o + 2], 0) } }
  let sy = max(0.2126 * sr + 0.7152 * sg + 0.0722 * sb, 1e-6)
  cr[cy * cw + cx] = sr / sy; cg[cy * cw + cx] = sg / sy; cb[cy * cw + cx] = sb / sy
} }
@inline(__always) func bilin(_ g: [Float], _ gw: Int, _ gh: Int, _ fx: Float, _ fy: Float) -> Float {
  let x0f = floorf(fx), y0f = floorf(fy)
  let tx = fx - x0f, ty = fy - y0f
  var x0 = Int(x0f), x1 = x0 + 1
  if wrapX { x0 = (x0 % gw + gw) % gw; x1 = (x1 % gw + gw) % gw } else { x0 = min(max(x0, 0), gw - 1); x1 = min(max(x1, 0), gw - 1) }
  let y0 = min(max(Int(y0f), 0), gh - 1), y1 = min(max(Int(y0f) + 1, 0), gh - 1)
  let top = g[y0 * gw + x0] * (1 - tx) + g[y0 * gw + x1] * tx
  let bot = g[y1 * gw + x0] * (1 - tx) + g[y1 * gw + x1] * tx
  return top * (1 - ty) + bot * ty
}
@inline(__always) func smooth(_ e0: Float, _ e1: Float, _ x: Float) -> Float { let t = min(max((x - e0) / (e1 - e0), 0), 1); return t * t * (3 - 2 * t) }

// ---------- 5. Tonwerte anwenden ----------
@inline(__always) func enc(_ v: Float) -> UInt8 {
  let cl = min(max(v, 0), 1)
  let s = cl <= 0.0031308 ? 12.92 * cl : 1.055 * powf(cl, 1 / 2.4) - 0.055
  return UInt8(min(255, max(0, (s * 255).rounded())))
}
var out8 = [UInt8](repeating: 255, count: n * 4)
var white = 0, sumLift: Double = 0
let knee: Float = 0.72
for y in 0..<h {
  let fyL = (Float(y) + 0.5) / Float(ds) - 0.5, fyC = (Float(y) + 0.5) / Float(cs) - 0.5
  for x in 0..<w {
    let i = y * w + x, o = i * 4
    let fxL = (Float(x) + 0.5) / Float(ds) - 0.5
    let base = bilin(ma, lw, lh, fxL, fyL) * L[i] + bilin(mb, lw, lh, fxL, fyL)
    let detail = L[i] - base
    let d = base - bA
    var Lo = TA + (d >= 0 ? cH : cS) * d + detail
    Lo = min(Lo, L[i] + maxLift)
    let lift = Lo - L[i]
    sumLift += Double(lift)
    var Yt = exp2f(Lo)
    if Yt > knee { Yt = knee + (1 - knee) * (1 - expf(-(Yt - knee) / (1 - knee))) }   // weiche Schulter
    if Yt > 0.985 { white += 1 }

    // Farbverhältnisse: in den Schatten aus dem geglätteten Raster (entfernt Farbrauschen)
    let yl = Ylin[i]
    var rr = max(buf[o], 0) / yl, rg = max(buf[o + 1], 0) / yl, rb = max(buf[o + 2], 0) / yl
    let wDark = 1 - smooth(0.004, 0.05, yl)
    if wDark > 0 {
      let fxC = (Float(x) + 0.5) / Float(cs) - 0.5
      rr += (bilin(cr, cw, ch, fxC, fyC) - rr) * wDark
      rg += (bilin(cg, cw, ch, fxC, fyC) - rg) * wDark
      rb += (bilin(cb, cw, ch, fxC, fyC) - rb) * wDark
    }
    // Sättigung: Grundwert, weniger bei starkem Anheben und in den Lichtern
    let s = satBase * (1 - 0.40 * smooth(1.5, 5.0, lift)) * (1 - 0.55 * smooth(0.6, 1.0, Yt))
    rr = powf(max(rr, 1e-4), s); rg = powf(max(rg, 1e-4), s); rb = powf(max(rb, 1e-4), s)
    let yn = 0.2126 * rr + 0.7152 * rg + 0.0722 * rb
    var R = Yt * rr / yn, G = Yt * rg / yn, B = Yt * rb / yn
    let m = max(R, max(G, B))
    if m > 1 { let t = min(max((1 - Yt) / max(m - Yt, 1e-6), 0), 1); R = Yt + (R - Yt) * t; G = Yt + (G - Yt) * t; B = Yt + (B - Yt) * t }
    out8[o] = enc(R); out8[o + 1] = enc(G); out8[o + 2] = enc(B)
  }
}
print(String(format: "mittlere Anhebung %.2f EV, reines Weiß %.2f%%", sumLift / Double(n), Double(white) * 100 / Double(n)))

// ---------- 6. Schreiben ----------
let provider = CGDataProvider(data: Data(out8) as CFData)!
let cgimg = CGImage(width: w, height: h, bitsPerComponent: 8, bitsPerPixel: 32, bytesPerRow: w * 4,
                    space: CGColorSpace(name: CGColorSpace.sRGB)!, bitmapInfo: CGBitmapInfo(rawValue: CGImageAlphaInfo.noneSkipLast.rawValue),
                    provider: provider, decode: nil, shouldInterpolate: false, intent: .defaultIntent)!
let dest = CGImageDestinationCreateWithURL(outURL as CFURL, UTType.jpeg.identifier as CFString, 1, nil)!
CGImageDestinationAddImage(dest, cgimg, [kCGImageDestinationLossyCompressionQuality: quality] as CFDictionary)
guard CGImageDestinationFinalize(dest) else { print("write failed"); exit(1) }
print("ok")
