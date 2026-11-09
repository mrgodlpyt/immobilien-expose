// Belichtung anheben, Schatten aufhellen, optional verkleinern, als JPEG schreiben
// Aufruf: brighten <in> <out> <ev> <shadows> <maxWidth|0>
import Foundation
import CoreImage
import ImageIO

let a = CommandLine.arguments
let input = URL(fileURLWithPath: a[1]), output = URL(fileURLWithPath: a[2])
let ev = Double(a[3]) ?? 0.8, shadows = Double(a[4]) ?? 0.4, maxW = Int(a[5]) ?? 0
guard var img = CIImage(contentsOf: input) else { FileHandle.standardError.write("cannot read\n".data(using: .utf8)!); exit(1) }
let exp = CIFilter(name: "CIExposureAdjust")!
exp.setValue(img, forKey: kCIInputImageKey); exp.setValue(ev, forKey: kCIInputEVKey); img = exp.outputImage!
let hs = CIFilter(name: "CIHighlightShadowAdjust")!
hs.setValue(img, forKey: kCIInputImageKey); hs.setValue(shadows, forKey: "inputShadowAmount"); hs.setValue(1.0, forKey: "inputHighlightAmount"); img = hs.outputImage!
if maxW > 0 && img.extent.width > CGFloat(maxW) {
  let s = CGFloat(maxW) / img.extent.width
  img = img.transformed(by: CGAffineTransform(scaleX: s, y: s))
}
let ctx = CIContext()
let cs = CGColorSpace(name: CGColorSpace.sRGB)!
let opts: [CIImageRepresentationOption: Any] = [CIImageRepresentationOption(rawValue: kCGImageDestinationLossyCompressionQuality as String): 0.78]
do { try ctx.writeJPEGRepresentation(of: img, to: output, colorSpace: cs, options: opts) } catch { print("write failed: \(error)"); exit(1) }
print("ok", Int(img.extent.width), Int(img.extent.height))
