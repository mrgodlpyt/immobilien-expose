/* Startpunkt: Seite aufbauen und Verhalten aktivieren. */
(function () {
  const P = window.PROPERTY;
  if (!P) { console.error("content/property.js fehlt oder ist fehlerhaft."); return; }
  const { $, $$ } = Expose.util;

  Expose.render.all(P);
  Expose.lightbox.init(P.galerie);
  Expose.plan.init(P);
  Expose.tour.init(P);

  // Höhe der Kopfzeile messen (auf dem Handy zweizeilig), damit Sprungmarken
  // nicht unter der Leiste verschwinden
  const header = $("#topbar");
  const setHeaderH = () => document.documentElement.style.setProperty("--header-h", header.offsetHeight + "px");
  window.addEventListener("resize", setHeaderH); setHeaderH();

  // Aktiver Abschnitt in der Navigation: der letzte Abschnitt, dessen
  // Oberkante über 40 % der Fensterhöhe liegt
  const links = $$(".menu a");
  const sections = $$("main .section");
  let ticking = false;
  function updateNav() {
    ticking = false;
    const line = window.innerHeight * 0.4;
    let active = null;
    for (const s of sections) if (s.getBoundingClientRect().top <= line) active = s.id;
    links.forEach(a => a.classList.toggle("is-active", active != null && a.getAttribute("href") === "#" + active));
  }
  window.addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(updateNav); } }, { passive: true });
  updateNav();

})();
