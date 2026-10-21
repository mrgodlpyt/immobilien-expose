/* 360°-Rundgang (Vollbild-Overlay) auf Basis von Pannellum.
   - Szenen und Verbindungen kommen aus PROPERTY.szenen
   - kleiner Grundriss unten links zeigt Position und Blickrichtung
   - Chips unten rechts springen direkt in einen Raum */
window.Expose = window.Expose || {};

(function () {
  const { $, $$, esc, floorOfScene, orderedScenes } = Expose.util;
  let P, overlay, viewer = null, current = null, raf = null, lastFocus = null, hintTimer = null;
  let mapFloorId = null;

  function pannellumConfig(startScene) {
    const scenes = {};
    for (const [id, s] of Object.entries(P.szenen || {})) {
      scenes[id] = {
        type: "equirectangular",
        panorama: s.bild,
        yaw: s.yaw || 0,
        pitch: s.pitch || 0,
        hfov: s.hfov || 100,
        hotSpots: (s.verbindungen || []).map(v => {
          const hs = {
            pitch: v.pitch || 0, yaw: v.yaw || 0, type: "scene",
            sceneId: v.ziel, cssClass: "hs-link",
            createTooltipFunc: (el, args) => { el.innerHTML = `<i></i><span>${esc(args.text)}</span>`; },
            createTooltipArgs: { text: v.text || (P.szenen[v.ziel] || {}).titel || v.ziel }
          };
          if (v.zielYaw != null) hs.targetYaw = v.zielYaw;
          if (v.zielPitch != null) hs.targetPitch = v.zielPitch;
          return hs;
        })
      };
    }
    const r = P.rundgang || {};
    return {
      default: {
        firstScene: startScene,
        sceneFadeDuration: 900,
        autoLoad: true,
        showControls: false,
        compass: false,
        minHfov: 50, maxHfov: 120,
        autoRotate: r.autoRotate || 0,
        autoRotateInactivityDelay: 10000,
        friction: 0.12,
        hotSpotDebug: Expose.plan && Expose.plan.picking,
        strings: {
          loadButtonLabel: "Laden", loadingLabel: "Lädt …",
          noPanoramaError: "Kein Panorama angegeben.",
          fileAccessError: "Die Datei %s konnte nicht geladen werden.",
          malformedURLError: "Fehlerhafte Bildadresse.",
          iOS8WebGLError: "WebGL wird nicht unterstützt.",
          genericWebGLError: "WebGL wird in diesem Browser nicht unterstützt.",
          textureSizeError: "Das Panorama ist für dieses Gerät zu groß (%spx, erlaubt %spx).",
          unknownError: "Unbekannter Fehler."
        }
      },
      scenes
    };
  }


  function renderMap(sceneId) {
    const hit = floorOfScene(P, sceneId);
    const canvas = $("#tour-map-canvas");
    const map = $("#tour-map");
    if (!hit) { map.hidden = true; return; }
    map.hidden = false;
    const { floor, pin } = hit;
    if (mapFloorId !== floor.id) {
      canvas.innerHTML = `<img src="${esc(floor.bild)}" alt="Grundriss ${esc(floor.name)}">`;
      mapFloorId = floor.id;
    }
    $("#tour-map-floor").textContent = floor.name;
    $$(".pin, .cone", canvas).forEach(n => n.remove());
    canvas.insertAdjacentHTML("beforeend",
      `<div class="cone" id="tour-cone" style="--x:${Number(pin.x)}%; --y:${Number(pin.y)}%"></div>` +
      Expose.plan.pinsHTML(floor, { current: sceneId }));
    $$(".pin", canvas).forEach(b => b.addEventListener("click", () => go(b.dataset.scene)));
  }

  function renderChips(sceneId) {
    const nav = $("#tour-scenes");
    nav.innerHTML = orderedScenes(P).map(id => `
      <button class="chip ${id === sceneId ? "is-active" : ""}" type="button" data-scene="${esc(id)}">${esc(P.szenen[id].titel || id)}</button>`).join("");
    $$(".chip", nav).forEach(b => b.addEventListener("click", () => go(b.dataset.scene)));
  }

  function setScene(id) {
    if (!P.szenen[id]) return;
    current = id;
    $("#tour-title").textContent = P.szenen[id].titel || id;
    renderMap(id);
    renderChips(id);
  }

  function go(id) {
    if (!viewer || id === current) return;
    viewer.loadScene(id);
  }

  // Sichtkegel im Mini-Grundriss dreht sich mit dem Blick
  function loop() {
    const cone = $("#tour-cone");
    if (cone && viewer) {
      const hit = floorOfScene(P, current);
      const base = hit ? Number(hit.pin.blickrichtung || 0) : 0;
      cone.style.setProperty("--rot", `${base + viewer.getYaw()}deg`);
    }
    raf = requestAnimationFrame(loop);
  }

  function open(sceneId) {
    const start = sceneId || (P.rundgang || {}).start || orderedScenes(P)[0];
    if (!start || !P.szenen[start]) { console.warn("Szene nicht gefunden:", sceneId); return; }
    lastFocus = document.activeElement;
    overlay.hidden = false;
    document.body.classList.add("no-scroll");
    requestAnimationFrame(() => overlay.classList.add("is-open"));

    if (!viewer) {
      viewer = pannellum.viewer("tour-pano", pannellumConfig(start));
      viewer.on("scenechange", id => setScene(id));
      viewer.on("load", () => setScene(viewer.getScene()));
      setScene(start);
    } else if (viewer.getScene() !== start) {
      viewer.loadScene(start);
    } else {
      setScene(start);
    }
    setTimeout(() => viewer && viewer.resize(), 60);

    if (!raf) loop();
    const hint = $("#tour-hint");
    hint.classList.remove("is-hidden");
    clearTimeout(hintTimer);
    hintTimer = setTimeout(() => hint.classList.add("is-hidden"), 5000);
    $("#tour-close").focus();
  }

  function close() {
    overlay.classList.remove("is-open");
    document.body.classList.remove("no-scroll");
    cancelAnimationFrame(raf); raf = null;
    if (viewer && viewer.stopAutoRotate) viewer.stopAutoRotate();
    setTimeout(() => { overlay.hidden = true; }, 450);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  Expose.tour = {
    init(data) {
      P = data; overlay = $("#tour");
      if (!overlay) return;
      $("#tour-close").addEventListener("click", close);
      document.addEventListener("keydown", e => { if (!overlay.hidden && e.key === "Escape") close(); });
      document.addEventListener("click", e => {
        const b = e.target.closest && e.target.closest("[data-open-tour]");
        if (b) { e.preventDefault(); open(); }
      });
      // erste Interaktion blendet den Hinweis aus
      overlay.addEventListener("pointerdown", () => $("#tour-hint").classList.add("is-hidden"), { passive: true });
    },
    open, close,
    get viewer() { return viewer; }
  };
})();
