// Leichte Rauschminderung + JPEG mit gewünschter Qualität
// Aufruf: recompress <in> <out> <quality 0..1> [noiseLevel] [sharpness]
import Foundation
import CoreImage
import ImageIO

let a = CommandLine.arguments
let input = URL(fileURLWithPath: a[1]), output = URL(fileURLWithPath: a[2])
let q = Double(a[3]) ?? 0.72, noise = a.count > 4 ? Double(a[4])! : 0.02, sharp = a.count > 5 ? Double(a[5])! : 0.4
guard var img = CIImage(contentsOf: input) else { FileHandle.standardError.write("cannot read\n".data(using: .utf8)!); exit(1) }
let nr = CIFilter(name: "CINoiseReduction")!
nr.setValue(img, forKey: kCIInputImageKey); nr.setValue(noise, forKey: "inputNoiseLevel"); nr.setValue(sharp, forKey: "inputSharpness")
img = nr.outputImage!.cropped(to: img.extent)
let ctx = CIContext()
let cs = CGColorSpace(name: CGColorSpace.sRGB)!
let opts: [CIImageRepresentationOption: Any] = [CIImageRepresentationOption(rawValue: kCGImageDestinationLossyCompressionQuality as String): q]
do { try ctx.writeJPEGRepresentation(of: img, to: output, colorSpace: cs, options: opts) } catch { print("write failed: \(error)"); exit(1) }
print("ok", Int(img.extent.width), Int(img.extent.height))
