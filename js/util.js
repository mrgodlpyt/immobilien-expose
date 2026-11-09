/* Kleine Helfer, die alle Module nutzen. */
window.Expose = window.Expose || {};

Expose.util = {
  // HTML-Sonderzeichen entschärfen (für Texte aus der Inhaltsdatei)
  esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  },
  // 489000 -> "489.000 €"
  euro(n) {
    if (typeof n !== "number") return String(n);
    return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
  },
  pad(n) { return String(n).padStart(2, "0"); },
  $(sel, root) { return (root || document).querySelector(sel); },
  $$(sel, root) { return Array.from((root || document).querySelectorAll(sel)); },
  // Kurze Einblendung unten (z. B. im Pin-Modus)
  toast(msg, ms) {
    const t = document.getElementById("toast");
    if (!t) return;
    t.textContent = msg; t.hidden = false;
    clearTimeout(t._timer);
    t._timer = setTimeout(() => { t.hidden = true; }, ms || 2500);
  },
  // Welcher Grundriss enthält den Pin zu einer Szene?
  floorOfScene(P, sceneId) {
    for (const f of P.grundrisse || []) {
      const pin = (f.pins || []).find(p => p.szene === sceneId);
      if (pin) return { floor: f, pin };
    }
    return null;
  },
  // Etage, zu der eine Szene gehört (Pin oder Eintrag unter "weitere")
  floorGroupOfScene(P, sceneId) {
    for (const f of P.grundrisse || []) {
      if ((f.pins || []).some(p => p.szene === sceneId) || (f.weitere || []).includes(sceneId)) return f;
    }
    return null;
  },
  // Alle Szenen in der Reihenfolge der Grundrisse (Pins, dann "weitere"), danach die übrigen
  orderedScenes(P) {
    const seen = new Set(); const out = [];
    const add = id => { if (P.szenen[id] && !seen.has(id)) { seen.add(id); out.push(id); } };
    for (const f of P.grundrisse || []) {
      for (const p of f.pins || []) add(p.szene);
      for (const id of f.weitere || []) add(id);
    }
    for (const id of Object.keys(P.szenen || {})) add(id);
    return out;
  }
};
