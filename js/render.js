/* Baut die statischen Abschnitte der Seite aus window.PROPERTY auf. */
window.Expose = window.Expose || {};

(function () {
  const { esc, euro, pad, $ } = Expose.util;

  function hero(P) {
    const img = P.heroBild || {};
    const pr = P.preis || {};
    return `
      <div class="wrap hero__grid">
        <div class="hero__text reveal">
          <p class="eyebrow">
            ${P.status ? `<span class="status">${esc(P.status)}</span>` : ""}
            ${P.kurzzeile ? `<span>${esc(P.kurzzeile)}</span>` : ""}
          </p>
          <h1 class="hero__title">${P.titel || ""}</h1>
          ${P.untertitel ? `<p class="hero__sub">${esc(P.untertitel)}</p>` : ""}
          ${pr.betrag != null ? `
          <div class="hero__price">
            <span class="label mono">Kaufpreis</span>
            <span class="value">${esc(euro(pr.betrag))}</span>
            ${pr.hinweis ? `<span class="note">${esc(pr.hinweis)}</span>` : ""}
          </div>` : ""}
          <div class="hero__actions">
            <button class="btn btn--primary" type="button" data-open-tour>360°-Rundgang starten</button>
            <a class="btn" href="#kontakt">Besichtigung anfragen</a>
          </div>
        </div>
        <figure class="hero__media reveal">
          <img src="${esc(img.src)}" alt="${esc(img.alt || "")}" fetchpriority="high">
          <figcaption class="mono">
            <span>${esc(img.bildunterschrift || "")}</span>
            <span>${esc((P.adresse || {}).plz || "")} ${esc((P.adresse || {}).ort || "")}</span>
          </figcaption>
        </figure>
      </div>
      ${(P.kennzahlen || []).length ? `
      <div class="wrap">
        <ul class="keyfigs reveal">
          ${P.kennzahlen.map(k => `
            <li>
              <span class="value">${esc(k.wert)}${k.einheit ? `<span class="unit">${esc(k.einheit)}</span>` : ""}</span>
              <span class="label mono">${esc(k.label)}</span>
            </li>`).join("")}
        </ul>
      </div>` : ""}`;
  }

  function objekt(P) {
    const prose = (P.beschreibung || []).map(p => `<p>${esc(p)}</p>`).join("");
    const facts = (P.fakten || []).map(g => `
      <div class="facts__group reveal">
        <h3 class="mono">${esc(g.gruppe)}</h3>
        <dl>
          ${(g.eintraege || []).map(e => `
            <div class="row"><dt>${esc(e.label)}</dt><dd>${esc(e.wert)}</dd></div>`).join("")}
        </dl>
      </div>`).join("");
    return `<div class="prose reveal">${prose}</div><div class="facts">${facts}</div>`;
  }

  function gallery(P) {
    return (P.galerie || []).map((g, i) => `
      <figure class="reveal ${g.format === "breit" ? "is-breit" : g.format === "hoch" ? "is-hoch" : ""}"
              style="--i:${i}" data-index="${i}" tabindex="0" role="button"
              aria-label="Bild ${i + 1} vergrößern: ${esc(g.titel || "")}">
        <div class="img"><img src="${esc(g.src)}" alt="${esc(g.titel || "")}" loading="lazy"></div>
        <figcaption class="mono"><span class="n">${pad(i + 1)}</span><span>${esc(g.titel || "")}</span></figcaption>
      </figure>`).join("");
  }

  function kontakt(P) {
    const k = P.kontakt || {}; const a = P.adresse || {};
    const tel = (k.telefon || "").replace(/[^+\d]/g, "");
    return `
      <div>
        <h3 class="kontakt__title">Interesse? <em>Dann melden Sie sich.</em></h3>
        <p class="kontakt__text">${esc(k.hinweis || "")}</p>
        <div class="kontakt__actions">
          ${k.email ? `<a class="btn btn--primary" href="mailto:${esc(k.email)}?subject=${encodeURIComponent("Anfrage " + (P.objektnummer || ""))}">E-Mail schreiben</a>` : ""}
          ${k.telefon ? `<a class="btn" href="tel:${esc(tel)}">Anrufen</a>` : ""}
        </div>
      </div>
      <div class="kontakt__card">
        ${k.name ? `<div class="row"><span class="k mono">Ansprechpartner</span><span class="v">${esc(k.name)}${k.rolle ? `, ${esc(k.rolle)}` : ""}</span></div>` : ""}
        ${k.telefon ? `<div class="row"><span class="k mono">Telefon</span><span class="v"><a href="tel:${esc(tel)}">${esc(k.telefon)}</a></span></div>` : ""}
        ${k.email ? `<div class="row"><span class="k mono">E-Mail</span><span class="v"><a href="mailto:${esc(k.email)}">${esc(k.email)}</a></span></div>` : ""}
        <div class="row"><span class="k mono">Adresse</span><span class="v">${esc(a.strasse || "")}${a.strasse ? ", " : ""}${esc(a.plz || "")} ${esc(a.ort || "")}</span></div>
        ${P.objektnummer ? `<div class="row"><span class="k mono">Objekt-Nr.</span><span class="v">${esc(P.objektnummer)}</span></div>` : ""}
      </div>`;
  }

  function footer(P) {
    const r = P.rechtliches || {};
    const year = new Date().getFullYear();
    return `
      <span class="mono">© ${year} · ${esc(P.objektnummer || "Exposé")} · Alle Angaben ohne Gewähr</span>
      <nav class="mono">
        <a href="${esc(r.impressumUrl || "#")}">Impressum</a>
        <a href="${esc(r.datenschutzUrl || "#")}">Datenschutz</a>
      </nav>`;
  }

  Expose.render = {
    all(P) {
      const a = P.adresse || {};
      const plain = (P.titel || "Exposé").replace(/<[^>]+>/g, "");
      document.title = `${plain} – ${a.ort || "Exposé"}`;
      $("#topbar-brand").innerHTML = `<b>${esc(P.objektnummer || "Exposé")}</b> · ${esc(a.kurz || a.ort || "")}`;
      $("#hero").innerHTML = hero(P);
      $("#objekt-body").innerHTML = objekt(P);
      $("#gallery").innerHTML = gallery(P);
      $("#kontakt-body").innerHTML = kontakt(P);
      $("#footer").innerHTML = footer(P);
    }
  };
})();
