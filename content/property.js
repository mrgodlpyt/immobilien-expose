/* =====================================================================
   INHALTE DER EXPOSÉ-WEBSITE
   ---------------------------------------------------------------------
   Alles, was auf der Seite zu sehen ist, wird in dieser einen Datei
   gepflegt. Die Website liest sie beim Laden und baut sich daraus auf.

   Bildpfade sind relativ zur index.html, z. B. "assets/images/foto.jpg".
   Zeilen, die mit // beginnen, sind Kommentare und werden ignoriert.

   ACHTUNG: Die aktuellen Werte sind BEISPIELDATEN und müssen vor der
   Veröffentlichung ersetzt werden.
   ===================================================================== */

window.PROPERTY = {

  // ------------------------------------------------------------------
  // 1. GRUNDDATEN
  // ------------------------------------------------------------------
  objektnummer: "EFH-2026-01",

  // Wortmarke oben links (z. B. Hausname oder Anbieter) und Zusatzzeile
  marke: { name: "Haus am Musterweg", zusatz: "Verkauf von privat" },
  status: "Verfügbar",                       // z. B. "Verfügbar", "Reserviert", "Verkauft"

  titel: "Freistehendes Einfamilienhaus mit Garten und Garage",
  untertitel:
    "Zwei Etagen, 142 m² Wohnfläche und ein 520 m² großes Grundstück " +
    "in ruhiger Wohnlage – bezugsfrei nach Vereinbarung.",

  // Kurze Zeile über der Überschrift
  kurzzeile: "Einfamilienhaus · Baujahr 1998 · Musterstadt-Südstadt",

  adresse: {
    strasse: "Musterweg 7",
    plz: "12345",
    ort: "Musterstadt",
    ortsteil: "Südstadt",
    // Für die Kopfzeile, z. B. nur der Ort, wenn die Straße nicht
    // öffentlich gezeigt werden soll:
    kurz: "Musterstadt-Südstadt"
  },

  preis: {
    betrag: 489000,                          // Zahl ohne Punkte
    hinweis: "Provisionsfrei – Verkauf von privat"
  },

  // Großes Bild oben auf der Seite
  heroBild: {
    src: "assets/images/01-aussen-eingang.jpg",
    alt: "Straßenansicht des Hauses mit Garage",
    bildunterschrift: "Ansicht von der Straße"
  },

  // Vier große Kennzahlen unter dem Titelbild
  kennzahlen: [
    { wert: "142", einheit: "m²", label: "Wohnfläche" },
    { wert: "520", einheit: "m²", label: "Grundstück" },
    { wert: "5",   einheit: "",   label: "Zimmer" },
    { wert: "1998", einheit: "",  label: "Baujahr" }
  ],

  // ------------------------------------------------------------------
  // 2. BESCHREIBUNG  (erster Absatz wird groß hervorgehoben)
  // ------------------------------------------------------------------
  beschreibung: [
    "Lichtdurchflutetes Einfamilienhaus in ruhiger Wohnlage: 142 m² Wohnfläche " +
    "auf zwei Etagen, ein 520 m² großes Grundstück mit Südterrasse und eine " +
    "Einzelgarage direkt am Haus.",

    "Das Erdgeschoss öffnet sich zu einem großzügigen Wohn- und Essbereich von " +
    "38 m², an den sich die offene Küche anschließt. Bodentiefe Fenster führen " +
    "auf die 22 m² große Terrasse und in den Garten.",

    "Im Obergeschoss liegen drei Schlafzimmer, ein Familienbad mit Wanne und " +
    "Dusche sowie eine Galerie, die sich gut als Arbeitsplatz nutzen lässt. " +
    "Der 55 m² große Keller bietet Platz für Hauswirtschaft und Stauraum.",

    "Die Gasheizung wurde 2018 erneuert, das Satteldach ist mit Ziegeln gedeckt. " +
    "Einkaufsmöglichkeiten, Schule und Kita liegen fußläufig, die Innenstadt ist " +
    "in zehn Minuten erreichbar."
  ],

  // ------------------------------------------------------------------
  // 3. DATEN & FAKTEN  (beliebig viele Gruppen und Einträge)
  // ------------------------------------------------------------------
  fakten: [
    {
      gruppe: "Objekt",
      eintraege: [
        { label: "Haustyp",       wert: "Freistehendes Einfamilienhaus" },
        { label: "Baujahr",       wert: "1998" },
        { label: "Etagen",        wert: "2" },
        { label: "Zimmer",        wert: "5" },
        { label: "Schlafzimmer",  wert: "3" },
        { label: "Badezimmer",    wert: "2" },
        { label: "Keller",        wert: "Ja, 55 m²" },
        { label: "Garage",        wert: "Einzelgarage" },
        { label: "Verfügbar ab",  wert: "nach Vereinbarung" }
      ]
    },
    {
      gruppe: "Flächen",
      eintraege: [
        { label: "Wohnfläche",          wert: "142 m²" },
        { label: "Grundstück",          wert: "520 m²" },
        { label: "Wohn- und Esszimmer", wert: "38 m²" },
        { label: "Küche",               wert: "14 m², offen zum Essbereich" },
        { label: "Flur",                wert: "12 m²" },
        { label: "Terrasse",            wert: "22 m²" },
        { label: "Keller",              wert: "55 m²" }
      ]
    },
    {
      gruppe: "Technik & Bauweise",
      eintraege: [
        { label: "Heizung",  wert: "Gasheizung, Baujahr 2018" },
        { label: "Fenster",  wert: "Zweifachverglasung" },
        { label: "Dach",     wert: "Satteldach mit Ziegeln" },
        { label: "Energieausweis", wert: "wird nachgereicht" }
      ]
    },
    {
      gruppe: "Kosten",
      eintraege: [
        { label: "Kaufpreis",  wert: "489.000 €" },
        { label: "Provision",  wert: "keine (Privatverkauf)" },
        { label: "Grundsteuer", wert: "auf Anfrage" }
      ]
    }
  ],

  // ------------------------------------------------------------------
  // 4. BILDERGALERIE
  //    format: "normal" (Standard), "breit" (doppelt breit und hoch)
  //            oder "hoch" (doppelt hoch)
  // ------------------------------------------------------------------
  galerie: [
    { src: "assets/images/01-aussen-eingang.jpg",  titel: "Straßenansicht mit Garage", format: "breit" },
    { src: "assets/images/02-garten-terrasse.jpg", titel: "Terrasse und Garten" },
    { src: "assets/images/03-garten-seite.jpg",    titel: "Garten, Blick zur Südseite" },
    { src: "assets/images/04-wohnen.jpg",          titel: "Wohn- und Essbereich" },
    { src: "assets/images/05-kueche.jpg",          titel: "Offene Küche" },
    { src: "assets/images/06-schlafen.jpg",        titel: "Schlafzimmer" },
    { src: "assets/images/07-bad.jpg",             titel: "Bad mit Dusche" },
    { src: "assets/images/08-arbeiten.jpg",        titel: "Arbeitszimmer" },
    { src: "assets/images/09-flur.jpg",            titel: "Flur und Treppe" },
    // Erstes Originalfoto vom Objekt (Insta360 X4 Air, Testaufnahme)
    { src: "assets/images/10-flur-original.jpg",   titel: "Flur mit Treppenaufgang (Originalfoto)" }
  ],

  // ------------------------------------------------------------------
  // 5. GRUNDRISSE MIT 360°-PUNKTEN
  //    x / y: Position des Punktes in Prozent der Bildbreite/-höhe.
  //    Tipp: Seite mit "?pins" aufrufen (index.html?pins) und in den
  //    Plan klicken – die Koordinaten werden angezeigt und kopiert.
  //    szene: Schlüssel aus dem Abschnitt "szenen" unten.
  //    blickrichtung: Richtung in Grad, in die das 360°-Bild in seiner
  //    Ausgangsstellung schaut (0 = nach oben im Plan, 90 = rechts …).
  //    Steuert nur den kleinen Sichtkegel im Rundgang.
  // ------------------------------------------------------------------
  grundrisse: [
    {
      id: "eg",
      name: "Erdgeschoss",
      bild: "assets/floorplans/erdgeschoss.jpg",
      pins: [
        { label: "Wohn- und Essbereich", x: 33, y: 32, szene: "wohnzimmer", blickrichtung: 0 },
        { label: "Küche",                x: 76, y: 32, szene: "essbereich", blickrichtung: 270 },
        { label: "Flur und Treppe",      x: 44, y: 70, szene: "flur",       blickrichtung: 180 }
      ]
    },
    {
      id: "og",
      name: "Obergeschoss",
      bild: "assets/floorplans/obergeschoss.jpg",
      pins: [
        { label: "Schlafzimmer", x: 74, y: 44, szene: "schlafzimmer", blickrichtung: 0 }
      ]
    }
  ],

  // ------------------------------------------------------------------
  // 6. 360°-SZENEN
  //    bild: Equirektangulares Panorama (Seitenverhältnis 2:1).
  //    yaw / pitch: Startblick (Grad). hfov: Sichtfeld beim Start.
  //    verbindungen: Pfeile im Bild, die in eine andere Szene führen.
  //      Tipp: Mit "?pins" in der Adresse loggt ein Klick ins 360°-Bild
  //      die Werte für pitch und yaw in der Browser-Konsole.
  // ------------------------------------------------------------------
  szenen: {
    wohnzimmer: {
      titel: "Wohnzimmer",
      bild: "assets/panoramas/wohnzimmer.webp",
      yaw: 0, pitch: 0, hfov: 100,
      verbindungen: [
        { ziel: "essbereich", yaw: 95, pitch: -8, text: "Zum Essbereich" },
        { ziel: "flur",       yaw: -150, pitch: -8, text: "Zum Flur" }
      ]
    },
    essbereich: {
      titel: "Essbereich & Küche",
      bild: "assets/panoramas/essbereich.webp",
      yaw: 10, pitch: 0, hfov: 100,
      verbindungen: [
        { ziel: "wohnzimmer",  yaw: -100, pitch: -8, text: "Zum Wohnzimmer" },
        { ziel: "schlafzimmer", yaw: 135, pitch: -5, text: "Nach oben ins Schlafzimmer" }
      ]
    },
    // Erstes echtes 360°-Bild vom Objekt (Insta360, 6144 × 3072, aufgehellt)
    flur: {
      titel: "Flur und Treppe",
      bild: "assets/panoramas/flur-treppenhaus.jpg",
      yaw: -20, pitch: 0, hfov: 95,
      verbindungen: [
        { ziel: "wohnzimmer", yaw: 140, pitch: -10, text: "Zum Wohnzimmer" }
      ]
    },
    schlafzimmer: {
      titel: "Schlafzimmer",
      bild: "assets/panoramas/schlafzimmer.webp",
      yaw: 0, pitch: 0, hfov: 100,
      verbindungen: [
        { ziel: "wohnzimmer", yaw: -120, pitch: -10, text: "Zurück nach unten" }
      ]
    }
  },

  // ------------------------------------------------------------------
  // 6b. ENERGIEAUSWEIS  (eigener Block unter den Daten; Pflichtangaben)
  // ------------------------------------------------------------------
  energie: {
    titel: "Energieausweis",
    eintraege: [
      { label: "Art des Ausweises",       wert: "Bedarfsausweis" },
      { label: "Endenergiebedarf",        wert: "wird nachgereicht" },
      { label: "Energieeffizienzklasse",  wert: "wird nachgereicht" },
      { label: "Wesentlicher Energieträger", wert: "Gas" },
      { label: "Baujahr Heizung",         wert: "2018" },
      { label: "Ausstellungsdatum",       wert: "wird nachgereicht" }
    ],
    hinweis: "Die Angaben aus dem Energieausweis werden vor Veröffentlichung ergänzt."
  },

  // ------------------------------------------------------------------
  // 6c. LAGE  (Text, Entfernungen, optional Karte)
  //     karte: { lat, lon, zoom, einbetten } – einbetten: true zeigt eine
  //     OpenStreetMap-Karte direkt auf der Seite, false nur einen Link.
  //     karte: null blendet beides aus.
  // ------------------------------------------------------------------
  lage: {
    text: [
      "Das Haus liegt in einer ruhigen Wohnstraße der Südstadt, umgeben von Einfamilienhäusern " +
      "und gewachsenen Gärten. Die Straße ist verkehrsberuhigt, Durchgangsverkehr gibt es nicht.",
      "Einkaufsmöglichkeiten des täglichen Bedarfs, Grundschule und Kita sind in wenigen Minuten " +
      "zu Fuß erreichbar. Die Innenstadt liegt etwa zehn Minuten mit dem Rad oder Bus entfernt, " +
      "die Autobahnanschlussstelle erreichen Sie in rund acht Minuten."
    ],
    entfernungen: [
      { label: "Supermarkt",      wert: "450 m" },
      { label: "Grundschule",     wert: "600 m" },
      { label: "Kita",            wert: "350 m" },
      { label: "Bushaltestelle",  wert: "200 m" },
      { label: "Bahnhof",         wert: "2,5 km" },
      { label: "Autobahn A 7",    wert: "6 km" }
    ],
    karte: null   // z. B. { lat: 52.5200, lon: 13.4050, zoom: 16, einbetten: false }
  },

  rundgang: {
    start: "wohnzimmer",   // Szene, mit der "Rundgang starten" beginnt
    autoRotate: -2         // Langsame Drehung bis zur ersten Interaktion; 0 = aus
  },

  // ------------------------------------------------------------------
  // 7. KONTAKT
  // ------------------------------------------------------------------
  kontakt: {
    name: "Max Mustermann",
    rolle: "Eigentümer",
    telefon: "+49 170 0000000",
    email: "verkauf@example.com",
    hinweis: "Besichtigungen nach Terminvereinbarung, auch am Wochenende.",
    // Anfrageformular: ohne "endpoint" öffnet sich das E-Mail-Programm mit
    // vorbereitetem Text. Mit einem Formular-Dienst (z. B. Formspree) hier
    // die Adresse eintragen, dann wird direkt von der Seite aus gesendet.
    formular: {
      endpoint: "",
      betreff: "Besichtigungsanfrage {objekt}",
      danke: "Vielen Dank, Ihre Anfrage ist eingegangen. Wir melden uns zeitnah.",
      einwilligungstext: "Ich bin einverstanden, dass meine Angaben zur Beantwortung der Anfrage gespeichert und verwendet werden. Weitere Informationen in der Datenschutzerklärung."
    }
  },

  // ------------------------------------------------------------------
  // 8. RECHTLICHES  (Links in der Fußzeile; "#" = noch nicht vorhanden)
  // ------------------------------------------------------------------
  rechtliches: {
    impressumUrl: "#",
    datenschutzUrl: "#"
  }
};
