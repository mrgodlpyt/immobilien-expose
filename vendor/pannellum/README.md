# Pannellum 2.5.6 (lokal eingebunden, mit Patch)

Quelle: https://github.com/mpetroff/pannellum (MIT-Lizenz, siehe LICENSE).

- `libpannellum.js` und `pannellum.css` sind unverändert (Original aus Tag 2.5.6).
- `pannellum.js` enthält **einen Patch**, gekennzeichnet mit `PATCH (Exposé-Website)`
  im Abschnitt zum Laden von Equirektangular-Bildern:
  Das Bild wird direkt per `img.src` geladen statt per XMLHttpRequest + `blob:`-URL.
  Grund: Hoster, die eine Content-Security-Policy ohne `blob:` in `img-src` setzen
  (z. B. teral.run), blockieren sonst jedes Panorama.
  Nebenwirkung: GPano-XMP-Metadaten werden nicht mehr ausgelesen. Für normale
  360°×180°-Panoramen irrelevant; Teilpanoramen brauchen `haov`/`vaov`/`vOffset`
  in der Szenen-Konfiguration.

Beim Aktualisieren auf eine neuere Pannellum-Version den Patch erneut anwenden.
