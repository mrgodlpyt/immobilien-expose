// Panorama mit Gradskala: senkrechte Linien alle 15°, beschriftet alle 30° (yaw wie im Rundgang:
// 0 = Bildmitte, positiv nach rechts). Hilft beim Bestimmen von Blickrichtung und Pfeilen.
// Aufruf: yawgrid <pano.jpg> <out.jpg> [breite=2000]
import Foundation
import AppKit

let a = CommandLine.arguments
guard a.count >= 3, let src = NSImage(contentsOfFile: a[1]) else { print("usage: yawgrid pano out [breite]"); exit(2) }
let W = CGFloat(a.count > 3 ? Double(a[3])! : 2000), H = W / 2
let img = NSImage(size: NSSize(width: W, height: H))
img.lockFocus()
src.draw(in: NSRect(x: 0, y: 0, width: W, height: H))
let attrs: [NSAttributedString.Key: Any] = [.font: NSFont.boldSystemFont(ofSize: 20), .foregroundColor: NSColor.yellow,
                                             .backgroundColor: NSColor.black.withAlphaComponent(0.6)]
for deg in stride(from: -180, through: 180, by: 15) {
  let x = (CGFloat(deg) / 360 + 0.5) * W
  let major = deg % 30 == 0
  (major ? NSColor.yellow.withAlphaComponent(0.9) : NSColor.yellow.withAlphaComponent(0.45)).setStroke()
  let p = NSBezierPath(); p.lineWidth = major ? 2 : 1
  p.move(to: NSPoint(x: x, y: 0)); p.line(to: NSPoint(x: x, y: H)); p.stroke()
  if major {
    let s = NSAttributedString(string: " \(deg) ", attributes: attrs)
    s.draw(at: NSPoint(x: min(max(x - s.size().width / 2, 0), W - s.size().width), y: H - 30))
    s.draw(at: NSPoint(x: min(max(x - s.size().width / 2, 0), W - s.size().width), y: 6))
  }
}
NSColor.cyan.withAlphaComponent(0.5).setStroke()
let hz = NSBezierPath(); hz.lineWidth = 1; hz.move(to: NSPoint(x: 0, y: H / 2)); hz.line(to: NSPoint(x: W, y: H / 2)); hz.stroke()
img.unlockFocus()
let rep = NSBitmapImageRep(data: img.tiffRepresentation!)!
try! rep.representation(using: .jpeg, properties: [.compressionFactor: 0.82])!.write(to: URL(fileURLWithPath: a[2]))
print("ok")
