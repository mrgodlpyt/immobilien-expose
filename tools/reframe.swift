// Equirektangulares Panorama -> perspektivische Ansicht (rectilinear)
// Aufruf: reframe <in.jpg> <out.jpg> <yaw> <pitch> <hfov> <width> <height> [quality]
import Foundation
import CoreGraphics
import ImageIO
import UniformTypeIdentifiers

let a = CommandLine.arguments
guard a.count >= 8 else { print("usage"); exit(2) }
let inURL = URL(fileURLWithPath: a[1]), outURL = URL(fileURLWithPath: a[2])
let yaw = Double(a[3])! * .pi / 180, pitch = Double(a[4])! * .pi / 180, hfov = Double(a[5])! * .pi / 180
let W = Int(a[6])!, H = Int(a[7])!, q = a.count > 8 ? Double(a[8])! : 0.82

guard let src = CGImageSourceCreateWithURL(inURL as CFURL, nil), let img = CGImageSourceCreateImageAtIndex(src, 0, nil) else { print("read failed"); exit(1) }
let sw = img.width, sh = img.height
let cs = CGColorSpaceCreateDeviceRGB()
let inCtx = CGContext(data: nil, width: sw, height: sh, bitsPerComponent: 8, bytesPerRow: sw * 4, space: cs, bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue)!
inCtx.draw(img, in: CGRect(x: 0, y: 0, width: sw, height: sh))
let inPx = inCtx.data!.bindMemory(to: UInt8.self, capacity: sw * sh * 4)
let outCtx = CGContext(data: nil, width: W, height: H, bitsPerComponent: 8, bytesPerRow: W * 4, space: cs, bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue)!
let outPx = outCtx.data!.bindMemory(to: UInt8.self, capacity: W * H * 4)

let tanH = tan(hfov / 2), tanV = tanH * Double(H) / Double(W)
let cy = cos(yaw), sy = sin(yaw), cp = cos(pitch), sp = sin(pitch)
@inline(__always) func sample(_ x: Double, _ y: Double, _ c: Int) -> Double {
  let x0 = Int(floor(x)), y0 = Int(floor(y)); let fx = x - Double(x0), fy = y - Double(y0)
  func px(_ xi: Int, _ yi: Int) -> Double {
    let xx = ((xi % sw) + sw) % sw, yy = min(max(yi, 0), sh - 1)
    return Double(inPx[(yy * sw + xx) * 4 + c])
  }
  let v0 = px(x0, y0) * (1 - fx) + px(x0 + 1, y0) * fx
  let v1 = px(x0, y0 + 1) * (1 - fx) + px(x0 + 1, y0 + 1) * fx
  return v0 * (1 - fy) + v1 * fy
}
for j in 0..<H {
  let v = -(2 * (Double(j) + 0.5) / Double(H) - 1) * tanV   // oben positiv
  for i in 0..<W {
    let u = (2 * (Double(i) + 0.5) / Double(W) - 1) * tanH
    // Kamerastrahl (x rechts, y oben, z vorwärts), erst Pitch (um x), dann Yaw (um y)
    var x = u, y = v, z = 1.0
    let y1 = y * cp - z * sp, z1 = y * sp + z * cp; y = y1; z = z1
    let x2 = x * cy + z * sy, z2 = -x * sy + z * cy; x = x2; z = z2
    let r = (x * x + y * y + z * z).squareRoot()
    let lon = atan2(x, z), lat = asin(y / r)
    let sx = (lon / (2 * .pi) + 0.5) * Double(sw) - 0.5
    let syy = (0.5 - lat / .pi) * Double(sh) - 0.5
    let o = (j * W + i) * 4   // Zeile 0 im Speicher = oberste Bildzeile
    for c in 0..<3 { outPx[o + c] = UInt8(min(255, max(0, sample(sx, syy, c).rounded()))) }
    outPx[o + 3] = 255
  }
}
let outImg = outCtx.makeImage()!
let dest = CGImageDestinationCreateWithURL(outURL as CFURL, UTType.jpeg.identifier as CFString, 1, nil)!
CGImageDestinationAddImage(dest, outImg, [kCGImageDestinationLossyCompressionQuality: q] as CFDictionary)
guard CGImageDestinationFinalize(dest) else { print("write failed"); exit(1) }
print("ok \(W)x\(H)")
