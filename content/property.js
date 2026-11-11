/* =====================================================================
   INHALTE DER EXPOSÉ-WEBSITE – Einfamilienhaus Wiesenweg 4, Raumbach
   ---------------------------------------------------------------------
   Alles, was auf der Seite zu sehen ist, wird in dieser einen Datei
   gepflegt. Die Website liest sie beim Laden und baut sich daraus auf.

   Bildpfade sind relativ zur index.html. Zeilen mit // sind Kommentare.

   Quellen: Bauantragspläne (einraum, Kaiserslautern, Januar 2026) und
   360°-Aufnahmen vom 29.10.2026. Werte mit "–" sind noch offen.
   ===================================================================== */

window.PROPERTY = {

  // ------------------------------------------------------------------
  // 1. GRUNDDATEN
  // ------------------------------------------------------------------
  marke: { name: "Wiesenweg 4", zusatz: "Einfamilienhaus in Raumbach" },
  status: "Zum Verkauf",

  titel: "Einfamilienhaus mit Garage, Garten und überdachter Terrasse",
  untertitel:
    "Freistehendes Haus am Hang mit drei Ebenen: Wohnebene mit Küche, Bad und " +
    "Wohn-/Esszimmer, Gartengeschoss mit vier weiteren Räumen und Terrasse, " +
    "Dachgeschoss mit Flur und Zimmer.",
  kurzzeile: "Einfamilienhaus · 3 Ebenen · Wiesenweg 4, 55592 Raumbach",

  adresse: {
    strasse: "Wiesenweg 4",
    plz: "55592",
    ort: "Raumbach",
    ortsteil: "",
    kurz: "Raumbach"
  },

  // betrag: Zahl ohne Punkte, oder null und stattdessen text
  preis: { betrag: null, text: "auf Anfrage", hinweis: "" },

  // Titelbild (wird aus dem Terrassen-Panorama gerendert)
  heroBild: {
    src: "assets/images/hero.jpg",
    alt: "Gartenseite des Hauses mit überdachter Terrasse",
    bildunterschrift: "Gartenseite mit überdachter Terrasse"
  },

  // Vier Kennzahlen unter dem Titelbild
  kennzahlen: [
    { wert: "3", einheit: "", label: "Ebenen" },
    { wert: "6", einheit: "", label: "Zimmer und Räume" },
    { wert: "1", einheit: "", label: "Bad" },
    { wert: "1", einheit: "", label: "Garage" }
  ],

  // ------------------------------------------------------------------
  // 2. BESCHREIBUNG  (erster Absatz wird groß gesetzt)
  // ------------------------------------------------------------------
  beschreibung: [
    "Freistehendes Einfamilienhaus am Wiesenweg in Raumbach: drei Ebenen am Hang, " +
    "Garage am Haus, überdachte Terrasse und ein Garten mit Nebengebäude.",

    "Die Wohnebene im Erdgeschoss liegt auf Straßenniveau. Hier finden sich das " +
    "Wohn- und Esszimmer, die Küche, das Bad mit Dusche und der Eingangsflur mit " +
    "der Treppe. Direkt daneben liegt die Garage mit eigener Einfahrt.",

    "Eine Ebene tiefer, auf Gartenniveau, liegen vier weitere Räume, darunter einer " +
    "mit Kochnische und zwei mit direktem Ausgang zur überdachten Terrasse und in den " +
    "Garten. Dazu kommen ein Vorraum mit Waschmaschinenanschluss, Heizungsraum und Keller.",

    "Das Dachgeschoss ist über die Treppe erschlossen und bietet einen Flur sowie ein " +
    "Zimmer. Für den Ausbau des Dachgeschosses liegt ein Bauantrag vom Januar 2026 vor. " +
    "Die genauen Raumgrößen stehen in den Grundrissen weiter unten."
  ],

  // ------------------------------------------------------------------
  // 3. DATEN & FAKTEN  (bewusst knapp; Raumgrößen stehen in den Plänen)
  // ------------------------------------------------------------------
  fakten: [
    {
      gruppe: "Objekt",
      eintraege: [
        { label: "Haustyp",      wert: "Freistehendes Einfamilienhaus" },
        { label: "Adresse",      wert: "Wiesenweg 4, 55592 Raumbach" },
        { label: "Baujahr",      wert: "–" },
        { label: "Wohnfläche",   wert: "–" },
        { label: "Grundstück",   wert: "–" },
        { label: "Verfügbar ab", wert: "–" }
      ]
    },
    {
      gruppe: "Aufteilung",
      eintraege: [
        { label: "Erdgeschoss",   wert: "Wohn-/Esszimmer, Küche, Bad, Flur" },
        { label: "Untergeschoss", wert: "4 Räume, Vorraum, Keller, Heizung" },
        { label: "Dachgeschoss",  wert: "Zimmer und Flur" },
        { label: "Garage",        wert: "Einzelgarage am Haus" },
        { label: "Außenbereich",  wert: "Überdachte Terrasse, Garten" },
        { label: "Nebengebäude",  wert: "Werkstatt und Lagerraum" }
      ]
    },
    {
      gruppe: "Technik & Bauweise",
      eintraege: [
        { label: "Heizung",        wert: "Ölzentralheizung" },
        { label: "Dach",           wert: "Satteldach" },
        { label: "Fenster",        wert: "–" },
        { label: "Energieausweis", wert: "–" }
      ]
    },
    {
      gruppe: "Kosten",
      eintraege: [
        { label: "Kaufpreis", wert: "auf Anfrage" },
        { label: "Provision", wert: "–" }
      ]
    }
  ],

  // ------------------------------------------------------------------
  // 4. BILDERGALERIE  (gerenderte Ansichten aus den 360°-Aufnahmen)
  //    klein: Kachelbild für die Übersicht, src: Vollbild in der Lightbox
  //    format: "breit" für die große Kachel
  // ------------------------------------------------------------------
  galerie: [
    { src: "assets/images/131847.jpg", klein: "assets/images/131847-klein.jpg", titel: "Überdachte Terrasse und Gartenseite", format: "breit" },
    { src: "assets/images/132741.jpg", klein: "assets/images/132741-klein.jpg", titel: "Gartenseite mit Nebengebäude" },
    { src: "assets/images/132642.jpg", klein: "assets/images/132642-klein.jpg", titel: "Hof an der Giebelseite" },
    { src: "assets/images/130043.jpg", klein: "assets/images/130043-klein.jpg", titel: "Wohn- und Esszimmer" },
    { src: "assets/images/133314.jpg", klein: "assets/images/133314-klein.jpg", titel: "Küche" },
    { src: "assets/images/125816.jpg", klein: "assets/images/125816-klein.jpg", titel: "Bad mit Dusche" },
    { src: "assets/images/125353.jpg", klein: "assets/images/125353-klein.jpg", titel: "Eingangsflur mit Treppe" },
    { src: "assets/images/135222.jpg", klein: "assets/images/135222-klein.jpg", titel: "Garage" },
    { src: "assets/images/131119.jpg", klein: "assets/images/131119-klein.jpg", titel: "Raum 4 mit Terrassenzugang" },
    { src: "assets/images/131302.jpg", klein: "assets/images/131302-klein.jpg", titel: "Raum 3 mit Kochnische" },
    { src: "assets/images/131600.jpg", klein: "assets/images/131600-klein.jpg", titel: "Raum 2 mit Gartenausgang" },
    { src: "assets/images/130329.jpg", klein: "assets/images/130329-klein.jpg", titel: "Zimmer im Dachgeschoss" },
    { src: "assets/images/130222.jpg", klein: "assets/images/130222-klein.jpg", titel: "Flur im Dachgeschoss" },
    { src: "assets/images/134709.jpg", klein: "assets/images/134709-klein.jpg", titel: "Vorraum mit Waschmaschinenanschluss" },
    { src: "assets/images/134600.jpg", klein: "assets/images/134600-klein.jpg", titel: "Raum 1 im Untergeschoss" },
    { src: "assets/images/130719.jpg", klein: "assets/images/130719-klein.jpg", titel: "Heizungsraum" },
    { src: "assets/images/132101.jpg", klein: "assets/images/132101-klein.jpg", titel: "Werkstatt im Nebengebäude" },
    { src: "assets/images/132200.jpg", klein: "assets/images/132200-klein.jpg", titel: "Lagerraum" }
  ],

  // ------------------------------------------------------------------
  // 5. GRUNDRISSE MIT 360°-PUNKTEN
  //    x / y: Standort der Kamera in Prozent der Planbreite/-höhe.
  //    blickrichtung: Richtung (Grad im Uhrzeigersinn, 0 = oben im Plan),
  //    in die das Panorama bei yaw 0 schaut. Daraus ergibt sich der
  //    Sichtkegel im kleinen Plan des Rundgangs.
  //    Die Werte sind aus Fenster- und Türkanten berechnet:
  //    siehe tools/ausrichtung.py (Messpunkte je Szene) und tools/yawgrid.swift.
  //    weitere: Szenen ohne Punkt im Plan (Nebengebäude)
  // ------------------------------------------------------------------
  grundrisse: [
    {
      id: "eg", name: "Erdgeschoss", kurz: "EG",
      bild: "assets/floorplans/erdgeschoss.jpg",
      pins: [
        { label: "Eingangsflur mit Treppe", x: 85.8, y: 71.1, szene: "flur-eg",  blickrichtung: 358 },
        { label: "Küche",                   x: 87.0, y: 30.8, szene: "kueche",   blickrichtung: 182 },
        { label: "Wohn- und Esszimmer",     x: 55.8, y: 37.9, szene: "wohnen",   blickrichtung: 97 },
        { label: "Bad",                     x: 73.4, y: 72.0, szene: "bad",      blickrichtung: 97 },
        { label: "Garage",                  x: 22.8, y: 53.2, szene: "garage",   blickrichtung: 2 },
        { label: "Einfahrt",                x: 22.5, y: 80.8, szene: "einfahrt", blickrichtung: 4 }
      ]
    },
    {
      id: "ug", name: "Untergeschoss", kurz: "UG",
      bild: "assets/floorplans/untergeschoss.jpg",
      pins: [
        { label: "Flur an der Treppe",          x: 72.5, y: 84.6, szene: "flur-ug",     blickrichtung: 268 },
        { label: "Raum 4 mit Terrassenzugang",  x: 80.3, y: 43.2, szene: "raum-4",      blickrichtung: 267 },
        { label: "Raum 3 mit Kochnische",       x: 54.4, y: 42.5, szene: "raum-3",      blickrichtung: 91 },
        { label: "Raum 2 mit Gartenausgang",    x: 22.8, y: 44.1, szene: "raum-2",      blickrichtung: 264 },
        { label: "Vorraum",                     x: 33.9, y: 74.4, szene: "vorraum",     blickrichtung: 356 },
        { label: "Raum 1",                      x: 15.8, y: 72.8, szene: "raum-1",      blickrichtung: 92 },
        { label: "Kellerraum",                  x: 59.7, y: 80.6, szene: "keller",      blickrichtung: 9 },
        { label: "Heizungsraum",                x: 82.5, y: 72.0, szene: "heizung",     blickrichtung: 197 },
        { label: "Überdachte Terrasse",         x: 68.1, y: 5.5,  szene: "terrasse",    blickrichtung: 269 },
        { label: "Gartenseite",                 x: 20.0, y: 15.0, szene: "gartenseite", blickrichtung: 93 },
        { label: "Hof an der Giebelseite",      x: 0.8,  y: 57.0, szene: "hof",         blickrichtung: 176 }
      ],
      weitere: ["werkstatt", "lager"]
    },
    {
      id: "dg", name: "Dachgeschoss", kurz: "DG",
      bild: "assets/floorplans/dachgeschoss.jpg",
      pins: [
        { label: "Flur und Treppe", x: 85.2, y: 41.7, szene: "dg-flur",   blickrichtung: 112 },
        { label: "Zimmer",          x: 53.2, y: 44.4, szene: "dg-zimmer", blickrichtung: 265 }
      ]
    }
  ],

  // ------------------------------------------------------------------
  // 6. 360°-SZENEN  (Insta360, 29.10.2026; aus den DNGs entwickelt, 5120 px)
  //    vorschau: kleines Bild, das sofort erscheint, bis das Panorama
  //    geladen ist. yaw/pitch: Startblick, hfov: Sichtfeld (max. 120).
  //    verbindungen: Pfeile zu Nachbarszenen. yaw = Lage der Tür im
  //    Panorama (mit tools/yawgrid.swift abgelesen), pitch = Höhe.
  // ------------------------------------------------------------------
  szenen: {
    // Erdgeschoss
    "flur-eg": {
      titel: "Eingangsflur mit Treppe",
      bild: "assets/panoramas/125353.jpg", vorschau: "assets/panoramas/125353-vorschau.jpg",
      yaw: 60, pitch: 0, hfov: 110,
      verbindungen: [
        { ziel: "kueche",  yaw: 1,   pitch: -6,  text: "Zur Küche" },
        { ziel: "bad",     yaw: -80, pitch: -6,  text: "Zum Bad" },
        { ziel: "dg-flur", yaw: 150, pitch: -12, text: "Treppe ins Dachgeschoss" },
        { ziel: "flur-ug", yaw: 50,  pitch: -20, text: "Treppe ins Untergeschoss" }
      ]
    },
    "kueche": {
      titel: "Küche",
      bild: "assets/panoramas/133314.jpg", vorschau: "assets/panoramas/133314-vorschau.jpg",
      yaw: 100, pitch: 0, hfov: 110,
      verbindungen: [
        { ziel: "flur-eg", yaw: 5,  pitch: -6, text: "Zum Flur" },
        { ziel: "wohnen",  yaw: 63, pitch: -6, text: "Zum Wohn- und Esszimmer" }
      ]
    },
    "wohnen": {
      titel: "Wohn- und Esszimmer",
      bild: "assets/panoramas/130043.jpg", vorschau: "assets/panoramas/130043-vorschau.jpg",
      yaw: -60, pitch: 0, hfov: 110,
      verbindungen: [
        { ziel: "kueche", yaw: -9, pitch: -6, text: "Zur Küche" }
      ]
    },
    "bad": {
      titel: "Bad",
      bild: "assets/panoramas/125816.jpg", vorschau: "assets/panoramas/125816-vorschau.jpg",
      yaw: -70, pitch: 0, hfov: 110,
      verbindungen: [
        { ziel: "flur-eg", yaw: -15, pitch: -6, text: "Zum Flur" }
      ]
    },
    "garage": {
      titel: "Garage",
      bild: "assets/panoramas/135222.jpg", vorschau: "assets/panoramas/135222-vorschau.jpg",
      yaw: 0, pitch: 0, hfov: 110,
      verbindungen: [
        { ziel: "einfahrt", yaw: 180, pitch: -6, text: "Zur Einfahrt" }
      ]
    },
    "einfahrt": {
      titel: "Garage von der Einfahrt",
      bild: "assets/panoramas/135617.jpg", vorschau: "assets/panoramas/135617-vorschau.jpg",
      yaw: 0, pitch: 0, hfov: 110,
      verbindungen: [
        { ziel: "garage", yaw: -3, pitch: -6, text: "In die Garage" }
      ]
    },

    // Untergeschoss / Gartenebene
    "flur-ug": {
      titel: "Flur im Untergeschoss",
      bild: "assets/panoramas/130607.jpg", vorschau: "assets/panoramas/130607-vorschau.jpg",
      yaw: -110, pitch: 0, hfov: 110,
      verbindungen: [
        { ziel: "flur-eg", yaw: -175, pitch: 0,  text: "Treppe ins Erdgeschoss" },
        { ziel: "raum-4",  yaw: 84,   pitch: -6, text: "Zu Raum 4" },
        { ziel: "raum-3",  yaw: 60,   pitch: -6, text: "Zu Raum 3" },
        { ziel: "heizung", yaw: 130,  pitch: -6, text: "Zum Heizungsraum" }
      ]
    },
    "raum-4": {
      titel: "Raum 4 mit Terrassenzugang",
      bild: "assets/panoramas/131119.jpg", vorschau: "assets/panoramas/131119-vorschau.jpg",
      yaw: 105, pitch: 0, hfov: 110,
      verbindungen: [
        { ziel: "terrasse", yaw: 75,  pitch: -6, text: "Auf die Terrasse" },
        { ziel: "flur-ug",  yaw: -50, pitch: -6, text: "Zum Flur" }
      ]
    },
    "raum-3": {
      titel: "Raum 3 mit Kochnische",
      bild: "assets/panoramas/131302.jpg", vorschau: "assets/panoramas/131302-vorschau.jpg",
      yaw: -80, pitch: 0, hfov: 110,
      verbindungen: [
        { ziel: "flur-ug", yaw: 60,  pitch: -6, text: "Zum Flur" },
        { ziel: "raum-2",  yaw: 157, pitch: -6, text: "Zu Raum 2" }
      ]
    },
    "raum-2": {
      titel: "Raum 2 mit Gartenausgang",
      bild: "assets/panoramas/131600.jpg", vorschau: "assets/panoramas/131600-vorschau.jpg",
      yaw: 95, pitch: 0, hfov: 110,
      verbindungen: [
        { ziel: "gartenseite", yaw: 66,   pitch: -6, text: "In den Garten" },
        { ziel: "raum-3",      yaw: -170, pitch: -6, text: "Zu Raum 3" },
        { ziel: "vorraum",     yaw: -140, pitch: -6, text: "Zum Vorraum" }
      ]
    },
    "vorraum": {
      titel: "Vorraum mit Waschmaschinenanschluss",
      bild: "assets/panoramas/134709.jpg", vorschau: "assets/panoramas/134709-vorschau.jpg",
      yaw: 60, pitch: 0, hfov: 110,
      verbindungen: [
        { ziel: "raum-1", yaw: -87, pitch: -6, text: "Zu Raum 1" },
        { ziel: "raum-2", yaw: 14,  pitch: -6, text: "Zu Raum 2" }
      ]
    },
    "raum-1": {
      titel: "Raum 1",
      bild: "assets/panoramas/134600.jpg", vorschau: "assets/panoramas/134600-vorschau.jpg",
      yaw: 180, pitch: 0, hfov: 110,
      verbindungen: [
        { ziel: "vorraum", yaw: -2, pitch: -6, text: "Zum Vorraum" }
      ]
    },
    "keller": {
      titel: "Kellerraum",
      bild: "assets/panoramas/130859.jpg", vorschau: "assets/panoramas/130859-vorschau.jpg",
      yaw: 60, pitch: 0, hfov: 110,
      verbindungen: [
        { ziel: "flur-ug", yaw: 10, pitch: -6, text: "Zum Flur" }
      ]
    },
    "heizung": {
      titel: "Heizungsraum",
      bild: "assets/panoramas/130719.jpg", vorschau: "assets/panoramas/130719-vorschau.jpg",
      yaw: 140, pitch: 0, hfov: 110,
      verbindungen: [
        { ziel: "flur-ug", yaw: 73, pitch: -6, text: "Zum Flur" }
      ]
    },

    // Außenbereich und Nebengebäude
    "terrasse": {
      titel: "Überdachte Terrasse",
      bild: "assets/panoramas/131847.jpg", vorschau: "assets/panoramas/131847-vorschau.jpg",
      yaw: -55, pitch: 0, hfov: 110,
      verbindungen: [
        { ziel: "raum-4",      yaw: -131, pitch: -6, text: "In Raum 4" },
        { ziel: "gartenseite", yaw: -4,   pitch: -4, text: "Weiter zur Gartenseite" },
        { ziel: "werkstatt",   yaw: -167, pitch: -4, text: "Zur Werkstatt" }
      ]
    },
    "gartenseite": {
      titel: "Gartenseite",
      bild: "assets/panoramas/132741.jpg", vorschau: "assets/panoramas/132741-vorschau.jpg",
      yaw: -15, pitch: 0, hfov: 110,
      verbindungen: [
        { ziel: "raum-2",   yaw: 130, pitch: -6, text: "In Raum 2" },
        { ziel: "terrasse", yaw: -7,  pitch: -4, text: "Zur Terrasse" },
        { ziel: "hof",      yaw: 175, pitch: -4, text: "Zum Hof" }
      ]
    },
    "hof": {
      titel: "Hof an der Giebelseite",
      bild: "assets/panoramas/132642.jpg", vorschau: "assets/panoramas/132642-vorschau.jpg",
      yaw: -60, pitch: 0, hfov: 110,
      verbindungen: [
        { ziel: "gartenseite", yaw: -150, pitch: -8, text: "Zur Gartenseite" }
      ]
    },
    "werkstatt": {
      titel: "Werkstatt im Nebengebäude",
      bild: "assets/panoramas/132101.jpg", vorschau: "assets/panoramas/132101-vorschau.jpg",
      yaw: 60, pitch: 0, hfov: 110,
      verbindungen: [
        { ziel: "terrasse", yaw: 91, pitch: -6, text: "Zur Terrasse" }
      ]
    },
    "lager": {
      titel: "Lagerraum",
      bild: "assets/panoramas/132200.jpg", vorschau: "assets/panoramas/132200-vorschau.jpg",
      yaw: -72, pitch: 0, hfov: 110,
      verbindungen: []
    },

    // Dachgeschoss
    "dg-flur": {
      titel: "Flur im Dachgeschoss",
      bild: "assets/panoramas/130222.jpg", vorschau: "assets/panoramas/130222-vorschau.jpg",
      yaw: 20, pitch: 0, hfov: 110,
      verbindungen: [
        { ziel: "dg-zimmer", yaw: 174, pitch: -6,  text: "Zum Zimmer" },
        { ziel: "flur-eg",   yaw: 52,  pitch: -25, text: "Treppe ins Erdgeschoss" }
      ]
    },
    "dg-zimmer": {
      titel: "Zimmer im Dachgeschoss",
      bild: "assets/panoramas/130329.jpg", vorschau: "assets/panoramas/130329-vorschau.jpg",
      yaw: 30, pitch: 0, hfov: 110,
      verbindungen: [
        { ziel: "dg-flur", yaw: 178, pitch: -6, text: "Zum Flur" }
      ]
    }
  },

  rundgang: { start: "flur-eg", autoRotate: 0 },

  // ------------------------------------------------------------------
  // 7. ENERGIEAUSWEIS
  // ------------------------------------------------------------------
  energie: {
    titel: "Energieausweis",
    eintraege: [
      { label: "Art des Ausweises",          wert: "–" },
      { label: "Endenergiebedarf/-verbrauch", wert: "–" },
      { label: "Energieeffizienzklasse",     wert: "–" },
      { label: "Wesentlicher Energieträger", wert: "Heizöl" },
      { label: "Baujahr Heizung",            wert: "–" },
      { label: "Ausstellungsdatum",          wert: "–" }
    ],
    hinweis: "Die Angaben aus dem Energieausweis werden vor Veröffentlichung ergänzt."
  },

  // ------------------------------------------------------------------
  // 8. LAGE
  // ------------------------------------------------------------------
  lage: {
    text: [
      "Das Haus steht am Wiesenweg in Raumbach (Rheinland-Pfalz), einer kleinen " +
      "Wohnstraße abseits der Hauptstraße. Das Grundstück grenzt an den Bachlauf des " +
      "Raumbachs, die Nachbarschaft besteht aus Ein- und Zweifamilienhäusern.",
      "Angaben zu Entfernungen, Einkaufsmöglichkeiten und Verkehrsanbindung werden ergänzt."
    ],
    entfernungen: [],
    karte: null   // z. B. { lat: 49.71, lon: 7.66, zoom: 16, einbetten: false }
  },

  // ------------------------------------------------------------------
  // 9. KONTAKT  (leere Felder blenden den jeweiligen Button aus)
  // ------------------------------------------------------------------
  kontakt: {
    name: "–",
    rolle: "",
    telefon: "",
    email: "",
    hinweis: "Besichtigungen nach Terminvereinbarung. Kontaktdaten folgen."
  },

  rechtliches: { impressumUrl: "#", datenschutzUrl: "#" }
};
