/* Grundriss-Abschnitt: Etagen-Tabs, Punkte im Plan, Raumliste.
   Mit "?pins" in der Adresse liefert ein Klick in den Plan die
   Prozent-Koordinaten für die Inhaltsdatei. */
window.Expose = window.Expose || {};

(function () {
  const { $, $$, esc, pad, toast } = Expose.util;
  let P, root, activeFloor;
  const picking = /[?&]pins\b/.test(location.search);

  // Erzeugt die Pin-Elemente für einen Grundriss (auch vom Rundgang genutzt)
  function pinsHTML(floor, opts) {
    const o = opts || {};
    return (floor.pins || []).map((p, i) => `
      <button class="pin ${o.current === p.szene ? "is-current" : ""}" type="button"
              style="--x:${Number(p.x)}%; --y:${Number(p.y)}%"
              data-scene="${esc(p.szene)}" data-floor="${esc(floor.id)}"
              aria-label="${esc(p.label)} in 360° ansehen">
        <span class="pin__dot">${i + 1}</span>
        <span class="pin__label">${esc(p.label)}</span>
      </button>`).join("");
  }

  function render() {
    const floors = P.grundrisse || [];
    if (!floors.length) { root.innerHTML = `<p>Noch kein Grundriss hinterlegt.</p>`; return; }
    activeFloor = activeFloor || floors[0];

    root.innerHTML = `
      <div class="plan__left">
        ${floors.length > 1 ? `
        <div class="segmented" role="tablist">
          ${floors.map(f => `<button class="segmented__btn ${f.id === activeFloor.id ? "is-active" : ""}" role="tab"
              aria-selected="${f.id === activeFloor.id}" data-floor="${esc(f.id)}">${esc(f.name)}</button>`).join("")}
        </div>` : ""}
        <div class="plan__stage">
          ${floors.length > 1 ? "" : ""}<div class="plan__canvas ${picking ? "is-picking" : ""}" id="plan-canvas">
            <img src="${esc(activeFloor.bild)}" alt="Grundriss ${esc(activeFloor.name)}">
            ${pinsHTML(activeFloor)}
          </div>
        </div>
        <p class="plan__hint caption">${picking
          ? "Pin-Modus: In den Plan klicken, um Koordinaten zu erhalten"
          : "Nummerierte Punkte öffnen den 360°-Blick in diesem Raum"}</p>
      </div>
      <div class="plan__right">
        <div class="group">
          <h3 class="group__header">${esc(activeFloor.name)} · ${activeFloor.pins.length} ${activeFloor.pins.length === 1 ? "Rundumblick" : "Rundumblicke"}</h3>
          <ol class="rooms group__body">
            ${(activeFloor.pins || []).map((p, i) => `
              <li><button type="button" data-scene="${esc(p.szene)}">
                <span class="num">${i + 1}</span>
                <span class="name">${esc(p.label)}</span>
                <span class="badge">360°</span>
                <svg class="chevron" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 3l5 5-5 5"/></svg>
              </button></li>`).join("")}
          </ol>
        </div>
        <div class="plan__cta">
          <p>Oder den kompletten Rundgang starten und sich mit den Pfeilen von Raum zu Raum bewegen.</p>
          <div><button class="btn btn--primary" type="button" data-open-tour>Rundgang starten</button></div>
        </div>
      </div>`;

    // Tabs
    $$(".segmented__btn", root).forEach(b => b.addEventListener("click", () => {
      activeFloor = floors.find(f => f.id === b.dataset.floor); render();
    }));

    // Pins und Raumliste öffnen den Rundgang
    $$("[data-scene]", root).forEach(b => b.addEventListener("click", e => {
      if (picking && b.classList.contains("pin")) return; // im Pin-Modus nur Koordinaten
      Expose.tour.open(b.dataset.scene);
    }));

    // Hover in der Liste hebt den Punkt hervor
    $$(".rooms [data-scene]", root).forEach(b => {
      const pin = () => $(`.pin[data-scene="${CSS.escape(b.dataset.scene)}"]`, root);
      b.addEventListener("mouseenter", () => pin() && pin().classList.add("is-hot"));
      b.addEventListener("mouseleave", () => pin() && pin().classList.remove("is-hot"));
    });

    // Pin-Modus: Koordinaten ermitteln
    if (picking) {
      const canvas = $("#plan-canvas", root);
      canvas.addEventListener("click", e => {
        const r = canvas.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width * 100).toFixed(1);
        const y = ((e.clientY - r.top) / r.height * 100).toFixed(1);
        const txt = `x: ${x}, y: ${y}`;
        console.log(`[Pin] ${activeFloor.id}: ${txt}`);
        if (navigator.clipboard) navigator.clipboard.writeText(txt).catch(() => {});
        toast(`${activeFloor.name} · ${txt} (kopiert)`, 4000);
      });
    }
  }

  Expose.plan = {
    init(data) { P = data; root = $("#plan"); if (root) render(); },
    pinsHTML,
    picking
  };
})();
