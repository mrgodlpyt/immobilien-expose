# Exposé-Website

Statische Website für den Verkauf einer Immobilie: Eckdaten, Bildergalerie,
Grundriss mit anklickbaren 360°-Punkten und ein zusammenhängender
360°-Rundgang. Kein Build-Schritt, keine Abhängigkeiten – die Seite läuft
direkt von jedem Webspace oder über GitHub Pages.

> Die enthaltenen Bilder und Daten sind **Beispiele** und werden vor der
> Veröffentlichung durch die echten ersetzt.

## Inhalte ändern

Alle Texte, Zahlen, Bilder und 360°-Szenen stehen in **einer** Datei:

```
content/property.js
```

Die Datei ist ausführlich kommentiert. Die Website baut sich beim Laden
daraus auf – es reicht, die Datei zu speichern und die Seite neu zu laden.

| Abschnitt in `property.js` | Was er steuert |
| --- | --- |
| `titel`, `untertitel`, `kurzzeile`, `preis` | Titelbereich |
| `kennzahlen` | die vier großen Zahlen unter dem Titelbild |
| `beschreibung` | Fließtext (erster Absatz wird groß gesetzt) |
| `fakten` | Daten-Tabellen, beliebig viele Gruppen |
| `galerie` | Bilder mit Bildunterschrift, `format: "breit"` für ein großes Bild |
| `grundrisse` | Etagen mit Plan-Bild und 360°-Punkten (`pins`) |
| `szenen` | 360°-Bilder und die Pfeile (`verbindungen`) zwischen ihnen |
| `rundgang` | Start-Szene, automatische Drehung |
| `kontakt`, `rechtliches` | Kontaktblock und Fußzeile |

## Bilder

| Ordner | Inhalt | Empfehlung |
| --- | --- | --- |
| `assets/images/` | normale Fotos | JPG, längste Kante 2000–2400 px, Qualität ~80 |
| `assets/panoramas/` | 360°-Bilder | equirektangular (Seitenverhältnis exakt 2:1), 4096–8192 px breit, JPG |
| `assets/floorplans/` | Grundrisse | JPG/PNG, ca. 1500–2500 px breit, möglichst ohne Rand |

360°-Bilder breiter als 8192 px laden auf vielen Handys nicht.

## 360°-Punkte im Grundriss setzen

1. Seite mit `?pins` aufrufen, z. B. `http://localhost:4173/?pins`
2. In den Grundriss klicken – die Koordinaten (`x: …, y: …`) erscheinen
   unten und liegen in der Zwischenablage.
3. Werte in `grundrisse[].pins` eintragen und `szene` auf den Schlüssel der
   passenden 360°-Szene setzen.

Im selben Modus loggt ein Klick **im 360°-Bild** `pitch` und `yaw` in die
Browser-Konsole – das sind die Werte für `verbindungen` (die Pfeile von
Raum zu Raum).

`blickrichtung` an einem Pin dreht nur den kleinen Sichtkegel im Rundgang:
0 = das 360°-Bild schaut in seiner Startstellung nach oben im Plan,
90 = nach rechts, 180 = nach unten, 270 = nach links.

## Lokal ansehen

Die Seite braucht einen kleinen Webserver (360°-Bilder laden nicht per
Doppelklick auf die Datei):

```bash
python3 -m http.server 4173
```

Dann `http://localhost:4173` im Browser öffnen.

## Veröffentlichen

**GitHub Pages:** Im Repository unter *Settings → Pages* als Quelle
„Deploy from a branch“, Branch `main`, Ordner `/ (root)` wählen. Die Seite
ist danach unter `https://<benutzer>.github.io/<repo>/` erreichbar.

Alternativ den gesamten Ordner auf einen beliebigen Webspace kopieren
(Netlify, Vercel, Hoster per FTP) – es sind nur statische Dateien.

## Vor der Veröffentlichung

- Impressum und Datenschutzerklärung verlinken (`rechtliches` in
  `property.js`) – in Deutschland Pflicht, auch bei Privatverkauf.
- Pflichtangaben aus dem Energieausweis in `fakten` eintragen.
- `<meta name="robots" content="noindex">` in `index.html` entfernen, wenn
  die Seite von Suchmaschinen gefunden werden soll.

## Technik

- `index.html` – Grundgerüst der Seite
- `css/styles.css` – Gestaltung; Farben und Schriften oben als Variablen
- `js/render.js` – baut Titel, Fakten, Galerie, Kontakt aus den Inhalten
- `js/plan.js` – Grundriss, Tabs, Pins, Pin-Modus
- `js/tour.js` – 360°-Rundgang mit [Pannellum](https://pannellum.org), lokal unter `vendor/pannellum/` (leicht gepatcht, siehe README dort)
- `js/lightbox.js` – Bildansicht der Galerie
- Schriften: Fraunces, Instrument Sans, DM Mono (Google Fonts)
