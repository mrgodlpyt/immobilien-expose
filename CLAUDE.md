# Projektnotizen

Statische Exposé-Website (Immobilienverkauf), kein Build, keine npm-Abhängigkeiten.

- **Inhalte**: ausschließlich in `content/property.js` (`window.PROPERTY`, deutsche Schlüssel, kommentiert). Bei Änderungswünschen an Texten/Bildern/Pins zuerst dort ansetzen, nicht im Markup.
- **Aufbau**: `index.html` ist nur ein Gerüst; `js/render.js` füllt Hero/Fakten/Galerie/Kontakt, `js/plan.js` den Grundriss, `js/tour.js` den 360°-Rundgang (Pannellum 2.5.6 lokal unter `vendor/pannellum/`, mit Patch – siehe dortige README; kein CDN, weil Hoster-CSPs `blob:` blocken können), `js/lightbox.js` die Galerie-Ansicht. Klassische Scripts (kein ESM), damit auch ohne Server-Konfiguration alles läuft.
- **Design**: nach den Apple Human Interface Guidelines (Skill `apple-design`, liegt bei Ben unter `~/Downloads/apple-design-swiftui-skills`), aufs Web übertragen: Systemschrift (keine Webfonts, keine Drittanbieter-Anfragen), Hierarchie nur über Größe/Gewicht, gruppierte Listen (`.group`, `.row`) für Fakten/Kontakt/Räume, Segmented Control für Etagen, Bedienflächen ≥ 44 px, Textkontrast ≥ 4,5:1, eine Akzentfarbe `--tint` (Grün), automatischer Dark Mode über `prefers-color-scheme`, keine Scroll-Animationen, keine Dekoration (kein Grain, keine Ziffern-Outlines, keine Kursiv-Akzente). Tokens oben in `css/styles.css`. Bitte beim Erweitern beibehalten.
- **Pins/Hotspots**: `?pins` in der URL → Klick im Plan kopiert x/y in %, Klick im Panorama loggt pitch/yaw (Pannellum `hotSpotDebug`).
- **Lokal testen**: `python3 -m http.server 4173` (siehe `.claude/launch.json`, Name `expose`).
- **Deploy**: GitHub Pages aus `main` / root. `.nojekyll` liegt bei.
