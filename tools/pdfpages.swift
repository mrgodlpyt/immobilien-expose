import Foundation
import PDFKit
import AppKit

let a = CommandLine.arguments
let doc = PDFDocument(url: URL(fileURLWithPath: a[1]))!
let outDir = a[2]; let scale = CGFloat(Double(a[3]) ?? 2.0)
print("pages:", doc.pageCount)
for i in 0..<doc.pageCount {
  let page = doc.page(at: i)!
  let bounds = page.bounds(for: .mediaBox)
  let size = NSSize(width: bounds.width * scale, height: bounds.height * scale)
  let img = NSImage(size: size)
  img.lockFocus()
  NSColor.white.setFill(); NSRect(origin: .zero, size: size).fill()
  let ctx = NSGraphicsContext.current!.cgContext
  ctx.saveGState(); ctx.scaleBy(x: scale, y: scale)
  page.draw(with: .mediaBox, to: ctx)
  ctx.restoreGState()
  img.unlockFocus()
  let rep = NSBitmapImageRep(data: img.tiffRepresentation!)!
  let data = rep.representation(using: .jpeg, properties: [.compressionFactor: 0.85])!
  try! data.write(to: URL(fileURLWithPath: "\(outDir)/page-\(String(format: "%02d", i + 1)).jpg"))
  let text = (page.string ?? "").replacingOccurrences(of: "\n", with: " ").prefix(400)
  print("page \(i + 1): \(Int(bounds.width))x\(Int(bounds.height)) pt | \(text)")
}
