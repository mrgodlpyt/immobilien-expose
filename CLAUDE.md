# Projektnotizen

Statische Exposé-Website (Immobilienverkauf), kein Build, keine npm-Abhängigkeiten.

- **Inhalte**: ausschließlich in `content/property.js` (`window.PROPERTY`, deutsche Schlüssel, kommentiert). Bei Änderungswünschen an Texten/Bildern/Pins zuerst dort ansetzen, nicht im Markup.
- **Aufbau**: `index.html` ist nur ein Gerüst; `js/render.js` füllt Hero/Fakten/Galerie/Kontakt, `js/plan.js` den Grundriss, `js/tour.js` den 360°-Rundgang (Pannellum 2.5.6 lokal unter `vendor/pannellum/`, mit Patch – siehe dortige README; kein CDN, weil Hoster-CSPs `blob:` blocken können), `js/lightbox.js` die Galerie-Ansicht. Klassische Scripts (kein ESM), damit auch ohne Server-Konfiguration alles läuft.
- **Design**: „gedrucktes Exposé“. Tokens oben in `css/styles.css` (Papier `--paper`, Tinte `--ink`, Akzent Ziegelrot `--accent`; Schriften Fraunces/Instrument Sans/DM Mono). Hairlines statt Karten, keine Verläufe, keine abgerundeten Karten – bitte beim Erweitern beibehalten.
- **Pins/Hotspots**: `?pins` in der URL → Klick im Plan kopiert x/y in %, Klick im Panorama loggt pitch/yaw (Pannellum `hotSpotDebug`).
- **Lokal testen**: `python3 -m http.server 4173` (siehe `.claude/launch.json`, Name `expose`).
- **Deploy**: GitHub Pages aus `main` / root. `.nojekyll` liegt bei.
