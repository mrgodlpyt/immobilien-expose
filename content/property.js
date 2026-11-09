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
    { wert: "3",     einheit: "",   label: "Ebenen" },
    { wert: "14,5",  einheit: "m",  label: "× 6,5 m Gebäude" },
    { wert: "33",    einheit: "m²", label: "Terrasse" },
    { wert: "33",    einheit: "m²", label: "Garage" }
  ],

  // ------------------------------------------------------------------
  // 2. BESCHREIBUNG  (erster Absatz wird groß gesetzt)
  // ------------------------------------------------------------------
  beschreibung: [
    "Freistehendes Einfamilienhaus am Wiesenweg in Raumbach: drei Ebenen am Hang, " +
    "Garage am Haus, überdachte Terrasse und ein Garten mit Nebengebäude.",

    "Die Wohnebene im Erdgeschoss liegt auf Straßenniveau. Hier finden sich das " +
    "Wohn- und Esszimmer mit knapp 27 m², die Küche, das Bad mit Dusche und der " +
    "Eingangsflur mit der Treppe. Direkt daneben liegt die 33 m² große Garage mit " +
    "eigener Einfahrt.",

    "Eine Ebene tiefer, auf Gartenniveau, liegen vier weitere Räume, darunter einer " +
    "mit Kochnische und zwei mit direktem Ausgang zur überdachten Terrasse und in den " +
    "Garten. Dazu kommen Flur mit Waschmaschinenanschluss, Heizungsraum und Kellerräume.",

    "Das Dachgeschoss ist über die Treppe erschlossen und bietet einen Flur sowie ein " +
    "Zimmer mit gut 17 m². Für den Ausbau des Dachgeschosses liegt ein Bauantrag vom " +
    "Januar 2026 vor. Angaben zu Baujahr, Wohnfläche, Grundstücksgröße und Energiewerten " +
    "werden ergänzt."
  ],

  // ------------------------------------------------------------------
  // 3. DATEN & FAKTEN  (Flächen laut Bauantragsplänen, Maßstab 1:100)
  // ------------------------------------------------------------------
  fakten: [
    {
      gruppe: "Objekt",
      eintraege: [
        { label: "Haustyp",        wert: "Freistehendes Einfamilienhaus" },
        { label: "Adresse",        wert: "Wiesenweg 4, 55592 Raumbach" },
        { label: "Baujahr",        wert: "–" },
        { label: "Grundstück",     wert: "– (Flurstück 96/2)" },
        { label: "Wohnfläche",     wert: "–" },
        { label: "Ebenen",         wert: "Untergeschoss, Erdgeschoss, Dachgeschoss" },
        { label: "Gebäudemaße",    wert: "14,53 × 6,51 m" },
        { label: "Garage",         wert: "Einzelgarage am Haus, 33,34 m²" },
        { label: "Terrasse",       wert: "33,04 m², überdacht" },
        { label: "Nebengebäude",   wert: "Werkstatt und Lagerraum im Garten" },
        { label: "Verfügbar ab",   wert: "–" }
      ]
    },
    {
      gruppe: "Erdgeschoss (Straßenebene)",
      eintraege: [
        { label: "Wohnen / Essen", wert: "26,98 m²" },
        { label: "Küche",          wert: "8,16 m²" },
        { label: "Bad",            wert: "5,74 m²" },
        { label: "Flur",           wert: "2,71 m²" },
        { label: "Garage",         wert: "33,34 m²" },
        { label: "Raumhöhe",       wert: "2,64 m" }
      ]
    },
    {
      gruppe: "Untergeschoss (Gartenebene)",
      eintraege: [
        { label: "Raum 1",         wert: "8,80 m²" },
        { label: "Raum 2",         wert: "16,98 m²" },
        { label: "Raum 3",         wert: "9,82 m²" },
        { label: "Raum 4",         wert: "13,31 m²" },
        { label: "Flur",           wert: "6,44 m²" },
        { label: "Vorraum",        wert: "3,90 m²" },
        { label: "Keller",         wert: "2,53 m²" },
        { label: "Heizung",        wert: "2,67 m²" },
        { label: "Tankraum",       wert: "5,60 m²" },
        { label: "Terrasse",       wert: "33,04 m²" },
        { label: "Raumhöhe",       wert: "2,45 m" }
      ]
    },
    {
      gruppe: "Dachgeschoss",
      eintraege: [
        { label: "Zimmer",         wert: "17,25 m²" },
        { label: "Flur",           wert: "8,09 m²" },
        { label: "Raumhöhe",       wert: "2,20 m im Firstbereich" },
        { label: "Dachneigung",    wert: "43°" },
        { label: "Bauantrag Ausbau", wert: "Januar 2026" }
      ]
    },
    {
      gruppe: "Technik & Bauweise",
      eintraege: [
        { label: "Heizung",        wert: "Ölzentralheizung, Baujahr –" },
        { label: "Fenster",        wert: "–" },
        { label: "Dach",           wert: "Satteldach, 43°" },
        { label: "Energieausweis", wert: "–" }
      ]
    },
    {
      gruppe: "Kosten",
      eintraege: [
        { label: "Kaufpreis",      wert: "auf Anfrage" },
        { label: "Provision",      wert: "–" }
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
    { src: "assets/images/132642.jpg", klein: "assets/images/132642-klein.jpg", titel: "Hof und Garten an der Seite" },
    { src: "assets/images/130043.jpg", klein: "assets/images/130043-klein.jpg", titel: "Wohn- und Esszimmer" },
    { src: "assets/images/133314.jpg", klein: "assets/images/133314-klein.jpg", titel: "Küche" },
    { src: "assets/images/125816.jpg", klein: "assets/images/125816-klein.jpg", titel: "Bad mit Dusche" },
    { src: "assets/images/125353.jpg", klein: "assets/images/125353-klein.jpg", titel: "Eingangsflur mit Treppe" },
    { src: "assets/images/135222.jpg", klein: "assets/images/135222-klein.jpg", titel: "Garage" },
    { src: "assets/images/131119.jpg", klein: "assets/images/131119-klein.jpg", titel: "Raum mit Terrassenzugang (Gartenebene)" },
    { src: "assets/images/131302.jpg", klein: "assets/images/131302-klein.jpg", titel: "Raum mit Kochnische (Gartenebene)" },
    { src: "assets/images/131600.jpg", klein: "assets/images/131600-klein.jpg", titel: "Raum mit Gartenausgang (Gartenebene)" },
    { src: "assets/images/130329.jpg", klein: "assets/images/130329-klein.jpg", titel: "Zimmer im Dachgeschoss" },
    { src: "assets/images/130222.jpg", klein: "assets/images/130222-klein.jpg", titel: "Dachgeschoss, Treppenankunft" },
    { src: "assets/images/134709.jpg", klein: "assets/images/134709-klein.jpg", titel: "Flur im Untergeschoss" },
    { src: "assets/images/134600.jpg", klein: "assets/images/134600-klein.jpg", titel: "Kellerraum mit Fliesenboden" },
    { src: "assets/images/130719.jpg", klein: "assets/images/130719-klein.jpg", titel: "Heizungsraum" },
    { src: "assets/images/132101.jpg", klein: "assets/images/132101-klein.jpg", titel: "Werkstatt im Nebengebäude" },
    { src: "assets/images/132200.jpg", klein: "assets/images/132200-klein.jpg", titel: "Lagerraum" }
  ],

  // ------------------------------------------------------------------
  // 5. GRUNDRISSE MIT 360°-PUNKTEN
  //    x / y in Prozent der Planbreite/-höhe. Tipp: index.html?pins
  //    aufrufen und in den Plan klicken, die Werte werden kopiert.
  //    weitere: Szenen ohne Punkt im Plan (Außenbereich, Nebengebäude)
  // ------------------------------------------------------------------
  grundrisse: [
    {
      id: "eg", name: "Erdgeschoss", kurz: "EG",
      bild: "assets/floorplans/erdgeschoss.jpg",
      pins: [
        { label: "Wohn- und Esszimmer", x: 57.9, y: 38.1, szene: "wohnen" },
        { label: "Küche",               x: 86.1, y: 26.5, szene: "kueche" },
        { label: "Bad",                 x: 73.0, y: 72.8, szene: "bad" },
        { label: "Flur mit Treppe",     x: 85.7, y: 66.2, szene: "flur-eg" },
        { label: "Garage",              x: 23.0, y: 49.0, szene: "garage" },
        { label: "Einfahrt",            x: 23.0, y: 96.0, szene: "einfahrt" }
      ]
    },
    {
      id: "ug", name: "Untergeschoss", kurz: "UG",
      bild: "assets/floorplans/untergeschoss.jpg",
      pins: [
        { label: "Raum 2 mit Gartenausgang",    x: 22.1, y: 41.2, szene: "raum-garten" },
        { label: "Raum 3 mit Kochnische",       x: 53.3, y: 41.2, szene: "raum-kochnische" },
        { label: "Raum 4 mit Terrassenzugang",  x: 87.7, y: 42.6, szene: "raum-terrasse" },
        { label: "Raum 1",                      x: 16.4, y: 74.8, szene: "keller-gefliest" },
        { label: "Kellerraum",                  x: 49.2, y: 74.8, szene: "keller" },
        { label: "Flur",                        x: 74.0, y: 82.0, szene: "flur-ug" },
        { label: "Heizung",                     x: 87.0, y: 66.0, szene: "heizung" },
        { label: "Treppe",                      x: 93.0, y: 81.0, szene: "treppe-ug" },
        { label: "Terrasse",                    x: 50.0, y: 9.5,  szene: "terrasse" }
      ],
      weitere: ["gartenseite", "hof", "werkstatt", "lager"]
    },
    {
      id: "dg", name: "Dachgeschoss", kurz: "DG",
      bild: "assets/floorplans/dachgeschoss.jpg",
      pins: [
        { label: "Zimmer",           x: 59.8, y: 50, szene: "dg-zimmer" },
        { label: "Flur und Treppe",  x: 86.9, y: 50, szene: "dg-flur" }
      ]
    }
  ],

  // ------------------------------------------------------------------
  // 6. 360°-SZENEN  (Insta360, 29.10.2026; auf 5120 px verkleinert)
  //    vorschau: kleines Bild, das sofort erscheint, bis das Panorama
  //    geladen ist. hfov: Sichtfeld beim Start (max. 120).
  //    verbindungen: Pfeile zu anderen Szenen (pitch/yaw per ?pins ermitteln)
  // ------------------------------------------------------------------
  szenen: {
    // Erdgeschoss
    "wohnen": {
      titel: "Wohn- und Esszimmer",
      bild: "assets/panoramas/130043.jpg",
      vorschau: "assets/panoramas/130043-vorschau.jpg",
      yaw: -72, pitch: 0, hfov: 110,
      verbindungen: []
    },
    "kueche": {
      titel: "Küche",
      bild: "assets/panoramas/133314.jpg",
      vorschau: "assets/panoramas/133314-vorschau.jpg",
      yaw: 108, pitch: 0, hfov: 110,
      verbindungen: []
    },
    "bad": {
      titel: "Bad",
      bild: "assets/panoramas/125816.jpg",
      vorschau: "assets/panoramas/125816-vorschau.jpg",
      yaw: -72, pitch: 0, hfov: 110,
      verbindungen: []
    },
    "flur-eg": {
      titel: "Eingangsflur mit Treppe",
      bild: "assets/panoramas/125353.jpg",
      vorschau: "assets/panoramas/125353-vorschau.jpg",
      yaw: -40, pitch: 0, hfov: 110,
      verbindungen: []
    },
    "garage": {
      titel: "Garage",
      bild: "assets/panoramas/135222.jpg",
      vorschau: "assets/panoramas/135222-vorschau.jpg",
      yaw: 0, pitch: 0, hfov: 110,
      verbindungen: []
    },
    "einfahrt": {
      titel: "Garage von der Einfahrt",
      bild: "assets/panoramas/135617.jpg",
      vorschau: "assets/panoramas/135617-vorschau.jpg",
      yaw: 0, pitch: 0, hfov: 110,
      verbindungen: []
    },
    // Untergeschoss / Gartenebene
    "raum-garten": {
      titel: "Raum 2 mit Gartenausgang",
      bild: "assets/panoramas/131600.jpg",
      vorschau: "assets/panoramas/131600-vorschau.jpg",
      yaw: 90, pitch: 0, hfov: 110,
      verbindungen: []
    },
    "raum-kochnische": {
      titel: "Raum 3 mit Kochnische",
      bild: "assets/panoramas/131302.jpg",
      vorschau: "assets/panoramas/131302-vorschau.jpg",
      yaw: -90, pitch: 0, hfov: 110,
      verbindungen: []
    },
    "raum-terrasse": {
      titel: "Raum 4 mit Terrassenzugang",
      bild: "assets/panoramas/131119.jpg",
      vorschau: "assets/panoramas/131119-vorschau.jpg",
      yaw: 100, pitch: 0, hfov: 110,
      verbindungen: []
    },
    "keller-gefliest": {
      titel: "Raum 1 (Kellerraum, gefliest)",
      bild: "assets/panoramas/134600.jpg",
      vorschau: "assets/panoramas/134600-vorschau.jpg",
      yaw: 0, pitch: 0, hfov: 110,
      verbindungen: []
    },
    "keller": {
      titel: "Kellerraum",
      bild: "assets/panoramas/130859.jpg",
      vorschau: "assets/panoramas/130859-vorschau.jpg",
      yaw: 40, pitch: 0, hfov: 110,
      verbindungen: []
    },
    "flur-ug": {
      titel: "Flur im Untergeschoss",
      bild: "assets/panoramas/134709.jpg",
      vorschau: "assets/panoramas/134709-vorschau.jpg",
      yaw: -90, pitch: 0, hfov: 110,
      verbindungen: []
    },
    "heizung": {
      titel: "Heizungsraum",
      bild: "assets/panoramas/130719.jpg",
      vorschau: "assets/panoramas/130719-vorschau.jpg",
      yaw: 144, pitch: 0, hfov: 110,
      verbindungen: []
    },
    "treppe-ug": {
      titel: "Treppenhaus zum Untergeschoss",
      bild: "assets/panoramas/130607.jpg",
      vorschau: "assets/panoramas/130607-vorschau.jpg",
      yaw: 70, pitch: 0, hfov: 110,
      verbindungen: []
    },
    // Außenbereich und Nebengebäude
    "terrasse": {
      titel: "Überdachte Terrasse",
      bild: "assets/panoramas/131847.jpg",
      vorschau: "assets/panoramas/131847-vorschau.jpg",
      yaw: -20, pitch: 0, hfov: 110,
      verbindungen: []
    },
    "gartenseite": {
      titel: "Gartenseite mit Nebengebäude",
      bild: "assets/panoramas/132741.jpg",
      vorschau: "assets/panoramas/132741-vorschau.jpg",
      yaw: 54, pitch: 0, hfov: 110,
      verbindungen: []
    },
    "hof": {
      titel: "Hof und Garten an der Seite",
      bild: "assets/panoramas/132642.jpg",
      vorschau: "assets/panoramas/132642-vorschau.jpg",
      yaw: -90, pitch: 0, hfov: 110,
      verbindungen: []
    },
    "werkstatt": {
      titel: "Werkstatt im Nebengebäude",
      bild: "assets/panoramas/132101.jpg",
      vorschau: "assets/panoramas/132101-vorschau.jpg",
      yaw: 80, pitch: 0, hfov: 110,
      verbindungen: []
    },
    "lager": {
      titel: "Lagerraum",
      bild: "assets/panoramas/132200.jpg",
      vorschau: "assets/panoramas/132200-vorschau.jpg",
      yaw: -72, pitch: 0, hfov: 110,
      verbindungen: []
    },
    // Dachgeschoss
    "dg-zimmer": {
      titel: "Zimmer im Dachgeschoss",
      bild: "assets/panoramas/130329.jpg",
      vorschau: "assets/panoramas/130329-vorschau.jpg",
      yaw: 30, pitch: 0, hfov: 110,
      verbindungen: []
    },
    "dg-flur": {
      titel: "Dachgeschoss, Treppenankunft",
      bild: "assets/panoramas/130222.jpg",
      vorschau: "assets/panoramas/130222-vorschau.jpg",
      yaw: 0, pitch: 0, hfov: 110,
      verbindungen: []
    }
  },

  rundgang: { start: "wohnen", autoRotate: -2 },

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
