/* Baut die statischen Abschnitte der Seite aus window.PROPERTY auf. */
window.Expose = window.Expose || {};

(function () {
  const { esc, euro, pad, $ } = Expose.util;

  function hero(P) {
    const img = P.heroBild || {};
    const pr = P.preis || {};
    const a = P.adresse || {};
    const ort = [a.ortsteil ? `${a.ort}-${a.ortsteil}` : a.ort, a.plz ? `${a.plz} ${a.ort}` : ""].filter(Boolean)[0] || "";
    return `
      <div class="wrap">
        <figure class="hero__media">
          <img src="${esc(img.src)}" alt="${esc(img.alt || "")}" fetchpriority="high">
          <figcaption class="caption">
            <span>${esc(img.bildunterschrift || "")}</span>
            <span>${esc(P.objektnummer ? "Objekt-Nr. " + P.objektnummer : "")}</span>
          </figcaption>
        </figure>
        <div class="hero__intro">
          <div>
            <p class="eyebrow">${P.status ? `<span class="status">${esc(P.status)}</span> · ` : ""}${esc(P.kurzzeile || "")}</p>
            <h1 class="hero__title">${esc((P.titel || "").replace(/<[^>]+>/g, ""))}</h1>
            <p class="hero__loc">${esc(a.strasse ? a.strasse + ", " : "")}${esc(a.plz || "")} ${esc(ort)}</p>
            ${P.untertitel ? `<p class="hero__sub">${esc(P.untertitel)}</p>` : ""}
          </div>
          <aside class="hero__aside">
            ${pr.betrag != null ? `
            <div class="hero__price">
              <span class="eyebrow">Kaufpreis</span>
              <span class="value">${esc(euro(pr.betrag))}</span>
              ${pr.hinweis ? `<span class="note">${esc(pr.hinweis)}</span>` : ""}
            </div>` : ""}
            <div class="hero__actions">
              <a class="btn btn--primary" href="#kontakt">Besichtigung anfragen</a>
              <button class="btn" type="button" data-open-tour>360°-Rundgang</button>
            </div>
          </aside>
        </div>
        ${(P.kennzahlen || []).length ? `
        <ul class="keyfigs">
          ${P.kennzahlen.map(k => `
            <li>
              <span class="value">${esc(k.wert)}${k.einheit ? `<span class="unit">${esc(k.einheit)}</span>` : ""}</span>
              <span class="label eyebrow">${esc(k.label)}</span>
            </li>`).join("")}
        </ul>` : ""}
      </div>`;
  }

  function objekt(P) {
    const prose = (P.beschreibung || []).map(p => `<p>${esc(p)}</p>`).join("");
    const facts = (P.fakten || []).map(g => `
      <section class="facts__group">
        <h3>${esc(g.gruppe)}</h3>
        <dl class="dl">
          ${(g.eintraege || []).map(e => `
            <div class="row"><dt>${esc(e.label)}</dt><dd>${esc(e.wert)}</dd></div>`).join("")}
        </dl>
      </section>`).join("");
    return `<div class="prose">${prose}</div><div class="facts">${facts}</div>`;
  }

  function energie(P) {
    const e = P.energie || {};
    if (!(e.eintraege || []).length) return "";
    const half = Math.ceil(e.eintraege.length / 2);
    const col = items => `<dl class="dl">${items.map(x => `<div class="row"><dt>${esc(x.label)}</dt><dd>${esc(x.wert)}</dd></div>`).join("")}</dl>`;
    return `
      <section class="subsection">
        <p class="eyebrow">Energie</p>
        <h3 class="subsection__title">${esc(e.titel || "Energieausweis")}</h3>
        <div class="energie">${col(e.eintraege.slice(0, half))}${col(e.eintraege.slice(half))}</div>
        ${e.hinweis ? `<p class="energie__note caption">${esc(e.hinweis)}</p>` : ""}
      </section>`;
  }

  function gallery(P) {
    return (P.galerie || []).map((g, i) => `
      <figure class="${g.format === "breit" ? "is-breit" : ""}"
              data-index="${i}" tabindex="0" role="button"
              aria-label="Bild ${i + 1} vergrößern: ${esc(g.titel || "")}">
        <div class="img"><img src="${esc(g.src)}" alt="${esc(g.titel || "")}" loading="lazy"></div>
        <figcaption class="caption"><span class="n">${pad(i + 1)}</span><span>${esc(g.titel || "")}</span></figcaption>
      </figure>`).join("");
  }

  function lage(P) {
    const l = P.lage || {};
    const text = (l.text || []).map(t => `<p>${esc(t)}</p>`).join("");
    const k = l.karte;
    let map = "";
    if (k && k.lat != null && k.lon != null) {
      const d = 0.006;
      const bbox = `${k.lon - d}%2C${k.lat - d * 0.6}%2C${k.lon + d}%2C${k.lat + d * 0.6}`;
      const link = `https://www.openstreetmap.org/?mlat=${k.lat}&mlon=${k.lon}#map=${k.zoom || 16}/${k.lat}/${k.lon}`;
      map = k.einbetten
        ? `<div class="lage__map"><iframe title="Karte" loading="lazy" src="https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${k.lat}%2C${k.lon}"></iframe></div>
           <p class="caption" style="margin-top:8px">Karte: OpenStreetMap-Mitwirkende</p>`
        : `<p class="lage__maplink"><a class="btn" href="${link}" target="_blank" rel="noopener">Karte öffnen</a></p>`;
    }
    const dist = (l.entfernungen || []).length ? `
      <section class="lage__aside">
        <h3>Entfernungen</h3>
        <dl class="dl">${l.entfernungen.map(x => `<div class="row"><dt>${esc(x.label)}</dt><dd>${esc(x.wert)}</dd></div>`).join("")}</dl>
      </section>` : "";
    return `<div class="lage__text">${text}${map}</div><div>${dist}</div>`;
  }

  function kontakt(P) {
    const k = P.kontakt || {}; const a = P.adresse || {};
    const tel = (k.telefon || "").replace(/[^+\d]/g, "");
    const f = k.formular || {};
    return `
      <div>
        ${k.hinweis ? `<p class="kontakt__text">${esc(k.hinweis)}</p>` : ""}
        <section class="kontakt__card">
          <h3>Ansprechpartner</h3>
          <dl class="dl">
            ${k.name ? `<div class="row"><dt>Name</dt><dd>${esc(k.name)}${k.rolle ? `, ${esc(k.rolle)}` : ""}</dd></div>` : ""}
            ${k.telefon ? `<div class="row"><dt>Telefon</dt><dd class="v"><a href="tel:${esc(tel)}">${esc(k.telefon)}</a></dd></div>` : ""}
            ${k.email ? `<div class="row"><dt>E-Mail</dt><dd class="v"><a href="mailto:${esc(k.email)}">${esc(k.email)}</a></dd></div>` : ""}
            <div class="row"><dt>Objekt</dt><dd>${esc(a.strasse || "")}${a.strasse ? ", " : ""}${esc(a.plz || "")} ${esc(a.ort || "")}</dd></div>
            ${P.objektnummer ? `<div class="row"><dt>Objekt-Nr.</dt><dd>${esc(P.objektnummer)}</dd></div>` : ""}
          </dl>
        </section>
      </div>
      <form class="form" id="anfrage" novalidate>
        <div class="field"><label for="f-name">Name *</label><input id="f-name" name="name" type="text" autocomplete="name" required></div>
        <div class="field"><label for="f-email">E-Mail *</label><input id="f-email" name="email" type="email" autocomplete="email" required></div>
        <div class="field"><label for="f-tel">Telefon</label><input id="f-tel" name="telefon" type="tel" autocomplete="tel"></div>
        <div class="field"><label for="f-termin">Wunschtermin</label><input id="f-termin" name="termin" type="text" placeholder="z. B. Samstagvormittag"></div>
        <div class="field full"><label for="f-msg">Nachricht</label><textarea id="f-msg" name="nachricht" rows="5"></textarea></div>
        <div class="hp" aria-hidden="true"><label>Website<input name="website" type="text" tabindex="-1" autocomplete="off"></label></div>
        <label class="form__consent full">
          <input type="checkbox" name="einwilligung" required>
          <span>${esc(f.einwilligungstext || "Ich bin einverstanden, dass meine Angaben zur Bearbeitung der Anfrage verwendet werden.")}</span>
        </label>
        <div class="form__footer full">
          <button class="btn btn--primary" type="submit">Anfrage senden</button>
          <span class="form__status" id="form-status" aria-live="polite"></span>
        </div>
      </form>`;
  }

  function footer(P) {
    const r = P.rechtliches || {};
    const year = new Date().getFullYear();
    return `
      <span class="caption">© ${year} · ${esc(P.objektnummer || "Exposé")} · Alle Angaben ohne Gewähr</span>
      <nav class="caption">
        <a href="${esc(r.impressumUrl || "#")}">Impressum</a>
        <a href="${esc(r.datenschutzUrl || "#")}">Datenschutz</a>
      </nav>`;
  }

  Expose.render = {
    all(P) {
      const a = P.adresse || {};
      const plain = (P.titel || "Exposé").replace(/<[^>]+>/g, "");
      document.title = `${plain} – ${a.ort || "Exposé"}`;
      const m = P.marke || {};
      $("#brand-name").textContent = m.name || plain;
      $("#brand-sub").textContent = m.zusatz || a.kurz || a.ort || "";
      $("#energie").innerHTML = energie(P);
      $("#lage-body").innerHTML = lage(P);
      $("#hero").innerHTML = hero(P);
      $("#objekt-body").innerHTML = objekt(P);
      $("#gallery").innerHTML = gallery(P);
      $("#kontakt-body").innerHTML = kontakt(P);
      $("#footer").innerHTML = footer(P);
    }
  };
})();
