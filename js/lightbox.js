/* Lightbox für die Bildergalerie: Klick, Pfeiltasten, Wischen, Esc. */
window.Expose = window.Expose || {};

(function () {
  const { $, $$, esc, pad } = Expose.util;
  let items = [], index = 0, lastFocus = null;
  let box, img, cap, counter;

  function show(i) {
    index = (i + items.length) % items.length;
    const it = items[index];
    img.src = it.src; img.alt = it.titel || "";
    cap.textContent = `${pad(index + 1)} — ${it.titel || ""}`;
    counter.textContent = `${index + 1} / ${items.length}`;
    // nächstes Bild vorladen
    const n = new Image(); n.src = items[(index + 1) % items.length].src;
  }
  function open(i) {
    lastFocus = document.activeElement;
    box.hidden = false;
    requestAnimationFrame(() => box.classList.add("is-open"));
    document.body.classList.add("no-scroll");
    show(i);
    $("#lightbox-close").focus();
  }
  function close() {
    box.classList.remove("is-open");
    document.body.classList.remove("no-scroll");
    setTimeout(() => { box.hidden = true; img.src = ""; }, 350);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  Expose.lightbox = {
    init(list) {
      items = list || [];
      box = $("#lightbox"); img = $("#lightbox-img"); cap = $("#lightbox-caption"); counter = $("#lightbox-counter");
      if (!box || !items.length) return;

      $$("#gallery figure").forEach(f => {
        const i = Number(f.dataset.index);
        f.addEventListener("click", () => open(i));
        f.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(i); } });
      });
      $("#lightbox-close").addEventListener("click", close);
      $("#lightbox-prev").addEventListener("click", () => show(index - 1));
      $("#lightbox-next").addEventListener("click", () => show(index + 1));
      box.addEventListener("click", e => { if (e.target === box || e.target.classList.contains("lightbox__stage")) close(); });

      document.addEventListener("keydown", e => {
        if (box.hidden) return;
        if (e.key === "Escape") close();
        else if (e.key === "ArrowLeft") show(index - 1);
        else if (e.key === "ArrowRight") show(index + 1);
      });

      // Wischen auf Touch-Geräten
      let x0 = null;
      box.addEventListener("touchstart", e => { x0 = e.touches[0].clientX; }, { passive: true });
      box.addEventListener("touchend", e => {
        if (x0 == null) return;
        const dx = e.changedTouches[0].clientX - x0; x0 = null;
        if (Math.abs(dx) > 50) show(index + (dx < 0 ? 1 : -1));
      });
    },
    open
  };
})();
