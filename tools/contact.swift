// Kontaktabzug: mehrere Bilder in ein Raster mit Dateinamen-Beschriftung
// Aufruf: contact <out.jpg> <spalten> <zellbreite> <bild1> <bild2> ...
import Foundation
import AppKit

let a = CommandLine.arguments
let outURL = URL(fileURLWithPath: a[1]); let cols = Int(a[2])!; let cellW = CGFloat(Double(a[3])!)
let files = Array(a[4...])
let cellH = cellW * 2 / 3, labelH: CGFloat = 22
let rows = Int(ceil(Double(files.count) / Double(cols)))
let size = NSSize(width: cellW * CGFloat(cols), height: (cellH + labelH) * CGFloat(rows))
let img = NSImage(size: size)
img.lockFocus()
NSColor.white.setFill(); NSRect(origin: .zero, size: size).fill()
let attrs: [NSAttributedString.Key: Any] = [.font: NSFont.systemFont(ofSize: 13, weight: .medium), .foregroundColor: NSColor.black]
for (i, f) in files.enumerated() {
  let c = i % cols, r = i / cols
  let x = CGFloat(c) * cellW
  let yTop = size.height - CGFloat(r) * (cellH + labelH)   // NSImage: Ursprung unten links
  if let im = NSImage(contentsOfFile: f) {
    let s = im.size; let scale = min(cellW / s.width, cellH / s.height)
    let w = s.width * scale, h = s.height * scale
    im.draw(in: NSRect(x: x + (cellW - w) / 2, y: yTop - labelH - cellH + (cellH - h) / 2, width: w, height: h))
  }
  let name = (f as NSString).lastPathComponent
  NSAttributedString(string: name, attributes: attrs).draw(at: NSPoint(x: x + 6, y: yTop - labelH + 3))
}
img.unlockFocus()
let rep = NSBitmapImageRep(data: img.tiffRepresentation!)!
try! rep.representation(using: .jpeg, properties: [.compressionFactor: 0.8])!.write(to: outURL)
print("ok", Int(size.width), Int(size.height), files.count)
