# Bildwerkzeuge (macOS, Swift)

Kleine Kommandozeilenprogramme, mit denen die Bilder dieser Website aus den
Insta360-DNGs und dem Bauantrags-PDF erzeugt wurden. Kompilieren mit

```bash
swiftc -O tools/brighten.swift -o /tmp/brighten
```

| Werkzeug | Zweck | Aufruf |
| --- | --- | --- |
| `develop.swift` | DNG direkt entwickeln: Schatten anheben, Fensterlichter schützen (lokale Tonwertkompression) | `develop in.dng out.jpg 5120 0.72 0 0.50 0.64 0.06` |
| `recompress.swift` | Rauschminderung + stärkere JPEG-Kompression | `recompress in.jpg out.jpg 0.66 0.05 0.35` |
| `reframe.swift` | Kugelbild (2:1) → perspektivische Ansicht für Galeriefotos | `reframe pano.jpg foto.jpg <yaw> <pitch> <hfov> 1800 1200 0.8` |
| `yawgrid.swift` | Gradskala über ein Panorama legen (yaw ablesen) | `yawgrid pano.jpg skala.jpg 2000` |
| `ausrichtung.py` | Standort und Blickrichtung der Szenen aus Messpunkten berechnen | `python3 tools/ausrichtung.py` |
| `pdfpages.swift` | PDF-Seiten als JPEG rendern (Grundrisse) | `pdfpages plan.pdf ausgabeordner 3` |
| `contact.swift` | Kontaktabzug mehrerer Bilder zur Sichtkontrolle | `contact blatt.jpg 4 420 bild1.jpg bild2.jpg …` |
| `brighten.swift` | einfache Aufhellung eines JPEGs (nur für Sonderfälle, frisst Lichter aus) | `brighten in.jpg out.jpg 0.5 0.4 0` |

Ablauf für eine neue 360°-Aufnahme (DNG):

```bash
/tmp/develop aufnahme.dng assets/panoramas/NAME.jpg 5120 0.72 0 0.50 0.64 0.06
/tmp/recompress assets/panoramas/NAME.jpg /tmp/rc.jpg 0.66 0.05 0.35 && mv /tmp/rc.jpg assets/panoramas/NAME.jpg
sips -Z 1024 -s format jpeg -s formatOptions 70 assets/panoramas/NAME.jpg --out assets/panoramas/NAME-vorschau.jpg
/tmp/reframe assets/panoramas/NAME.jpg assets/images/NAME.jpg 0 -3 95 1800 1200 0.8
sips -Z 800 -s format jpeg -s formatOptions 74 assets/images/NAME.jpg --out assets/images/NAME-klein.jpg
```

Die Parameter von `develop` nach Breite und Qualität: Korrektur in Blendenstufen (0), Zielhelligkeit der
hellen Wandflächen (0.50), Sättigung (0.64), Mindesthelligkeit der Bildmitte (0.06).

Ausrichtung im Grundriss: mit `yawgrid` das Panorama mit Skala erzeugen, die yaw-Werte von zwei bis sechs
Fenster- oder Türkanten ablesen, zusammen mit deren Pixelposition im Plan (2000 px breit) in
`ausrichtung.py` eintragen und das Skript ausführen. Es gibt `x`, `y` und `blickrichtung` für den Pin aus.

`yaw` ist die Blickrichtung in Grad: 0 = Bildmitte des Panoramas, positiv nach rechts.
Als Faustregel: Position des Motivs im Panorama als Anteil der Breite `f` → `yaw = (f − 0,5) · 360`.
