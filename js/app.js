/* Startpunkt: Seite aufbauen und Verhalten aktivieren. */
(function () {
  const P = window.PROPERTY;
  if (!P) { console.error("content/property.js fehlt oder ist fehlerhaft."); return; }
  const { $, $$ } = Expose.util;

  Expose.render.all(P);
  Expose.lightbox.init(P.galerie);
  Expose.plan.init(P);
  Expose.tour.init(P);

  // Kopfzeile bekommt beim Scrollen einen Hintergrund
  const topbar = $("#topbar");
  const onScroll = () => topbar.classList.toggle("is-scrolled", window.scrollY > 24);
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();

  // Aktiver Abschnitt in der Navigation: der letzte Abschnitt, dessen
  // Oberkante über 40 % der Fensterhöhe liegt
  const links = $$(".topbar__nav a");
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

  // Sanftes Einblenden beim Scrollen
  const revObs = new IntersectionObserver(entries => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add("is-in"); revObs.unobserve(en.target); } });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
  $$(".reveal").forEach(el => revObs.observe(el));
})();
