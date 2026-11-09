# Bildwerkzeuge (macOS, Swift)

Kleine Kommandozeilenprogramme, mit denen die Bilder dieser Website aus den
Insta360-DNGs und dem Bauantrags-PDF erzeugt wurden. Kompilieren mit

```bash
swiftc -O tools/brighten.swift -o /tmp/brighten
```

| Werkzeug | Zweck | Aufruf |
| --- | --- | --- |
| `brighten.swift` | Belichtung (+EV) und Schatten anheben, verkleinern, JPEG q0,78 | `brighten in.jpg out.jpg 1.0 0.6 5120` |
| `recompress.swift` | Rauschminderung + stärkere JPEG-Kompression | `recompress in.jpg out.jpg 0.70 0.04 0.35` |
| `reframe.swift` | Kugelbild (2:1) → perspektivische Ansicht für Galeriefotos | `reframe pano.jpg foto.jpg <yaw> <pitch> <hfov> 1800 1200 0.8` |
| `pdfpages.swift` | PDF-Seiten als JPEG rendern (Grundrisse) | `pdfpages plan.pdf ausgabeordner 3` |
| `contact.swift` | Kontaktabzug mehrerer Bilder zur Sichtkontrolle | `contact blatt.jpg 4 420 bild1.jpg bild2.jpg …` |

Ablauf für eine neue 360°-Aufnahme (DNG):

```bash
sips -s format jpeg -s formatOptions 92 aufnahme.dng --out /tmp/full.jpg
/tmp/brighten /tmp/full.jpg assets/panoramas/NAME.jpg 1.0 0.6 5120
/tmp/recompress assets/panoramas/NAME.jpg /tmp/rc.jpg 0.70 0.04 0.35 && mv /tmp/rc.jpg assets/panoramas/NAME.jpg
sips -Z 1024 -s format jpeg -s formatOptions 70 assets/panoramas/NAME.jpg --out assets/panoramas/NAME-vorschau.jpg
/tmp/reframe assets/panoramas/NAME.jpg assets/images/NAME.jpg 0 -3 95 1800 1200 0.8
sips -Z 800 -s format jpeg -s formatOptions 74 assets/images/NAME.jpg --out assets/images/NAME-klein.jpg
```

`yaw` ist die Blickrichtung in Grad: 0 = Bildmitte des Panoramas, positiv nach rechts.
Als Faustregel: Position des Motivs im Panorama als Anteil der Breite `f` → `yaw = (f − 0,5) · 360`.
