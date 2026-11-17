# Bildwerkzeuge (macOS, Swift)

Kleine Kommandozeilenprogramme, mit denen die Bilder dieser Website aus den
Insta360-DNGs und dem Bauantrags-PDF erzeugt wurden. Kompilieren mit

```bash
swiftc -O tools/brighten.swift -o /tmp/brighten
```

| Werkzeug | Zweck | Aufruf |
| --- | --- | --- |
| `alle-bilder.sh` | alles neu erzeugen: Panoramen, Vorschauen, Galeriefotos, Titelbild | `tools/alle-bilder.sh "<DNG-Ordner>"` |
| `develop.swift` | DNG direkt lesen, entrauschen, Schatten anheben, Fensterlichter schützen (lokale Tonwertkompression) | `develop in.dng out.jpg 5120 0.80` |
| `recompress.swift` | Rauschminderung + stärkere JPEG-Kompression für fertige JPEGs (nur Sonderfälle) | `recompress in.jpg out.jpg 0.66 0.05 0.35` |
| `reframe.swift` | Kugelbild (2:1) → perspektivische Ansicht für Galeriefotos | `reframe pano.jpg foto.jpg <yaw> <pitch> <hfov> 1800 1200 0.8` |
| `yawgrid.swift` | Gradskala über ein Panorama legen (yaw ablesen) | `yawgrid pano.jpg skala.jpg 2000` |
| `ausrichtung.py` | Standort und Blickrichtung der Szenen aus Messpunkten berechnen | `python3 tools/ausrichtung.py` |
| `pdfpages.swift` | PDF-Seiten als JPEG rendern (Grundrisse) | `pdfpages plan.pdf ausgabeordner 3` |
| `contact.swift` | Kontaktabzug mehrerer Bilder zur Sichtkontrolle | `contact blatt.jpg 4 420 bild1.jpg bild2.jpg …` |
| `brighten.swift` | einfache Aufhellung eines JPEGs (nur für Sonderfälle, frisst Lichter aus) | `brighten in.jpg out.jpg 0.5 0.4 0` |

Alle Bilder neu erzeugen (Stick mit den DNGs anschließen; nach „Kopieren fertig“ kann er wieder ab):

```bash
tools/alle-bilder.sh "/Volumes/MARKUS NAU/Ben Bilder Raumbach"
```

Einzelne Aufnahmen: Aufnahmezeiten anhängen, z. B. `tools/alle-bilder.sh "<Ordner>" /tmp/expose-bilder 130043 131302`.
Nur Vorschauen, Galeriefotos und Titelbild aus den vorhandenen Panoramen: `tools/alle-bilder.sh -`.
Eine neue Aufnahme bekommt im Skript eine Zeile `Aufnahme:yaw:pitch:Bildwinkel` für ihr Galeriefoto.

Von Hand für eine einzelne Aufnahme:

```bash
/tmp/develop aufnahme.dng assets/panoramas/NAME.jpg 5120 0.80
sips -Z 1024 -s format jpeg -s formatOptions 70 assets/panoramas/NAME.jpg --out assets/panoramas/NAME-vorschau.jpg
/tmp/reframe assets/panoramas/NAME.jpg assets/images/NAME.jpg 0 -3 95 1800 1200 0.8
sips -Z 800 -s format jpeg -s formatOptions 74 assets/images/NAME.jpg --out assets/images/NAME-klein.jpg
```

`develop` liest die Insta360-DNGs selbst (unkomprimiertes lineares 16-Bit-RGB) und umgeht damit den
RAW-Konverter von macOS, der bei diesen Dateien die dunklen Tonwerte farblich verfälscht (Gelbstich und
Farbrauschen nach dem Aufhellen). Danach: entrauschen, Tonwerte zusammenschieben, Weißabgleich örtlich
nachführen (Lampen- und Mischlicht), Detailkontrast, leichte S-Kurve, Nachschärfen.
Weitere Parameter nach Breite und Qualität, alle optional: Korrektur in Blendenstufen (0),
Zielhelligkeit der hellen Wandflächen (0.60), Sättigung (0.90), Mindesthelligkeit der Bildmitte (0.09),
Stärke der Rauschminderung (0.6; 1 = kräftig, 0 = aus), Stärke des nachgeführten Weißabgleichs
(0.8; 0 = nur Kamerawert, 1 = Wände ganz neutral).
Nach einem Bildtausch `bildVersion` in `content/property.js` ändern, sonst zeigen Browser alte Bilder.
`recompress` wird dafür nicht mehr gebraucht.

Ausrichtung im Grundriss: mit `yawgrid` das Panorama mit Skala erzeugen, die yaw-Werte von zwei bis sechs
Fenster- oder Türkanten ablesen, zusammen mit deren Pixelposition im Plan (2000 px breit) in
`ausrichtung.py` eintragen und das Skript ausführen. Es gibt `x`, `y` und `blickrichtung` für den Pin aus.

`yaw` ist die Blickrichtung in Grad: 0 = Bildmitte des Panoramas, positiv nach rechts.
Als Faustregel: Position des Motivs im Panorama als Anteil der Breite `f` → `yaw = (f − 0,5) · 360`.
