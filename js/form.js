/* Anfrageformular: sendet an einen Formular-Endpunkt (z. B. Formspree),
   wenn in content/property.js unter kontakt.formular.endpoint einer
   eingetragen ist – sonst öffnet es eine vorbereitete E-Mail. */
window.Expose = window.Expose || {};

(function () {
  const { $ } = Expose.util;

  Expose.form = {
    init(P) {
      const form = $("#anfrage");
      if (!form) return;
      const status = $("#form-status");
      const k = P.kontakt || {}; const f = k.formular || {};

      form.addEventListener("submit", async e => {
        e.preventDefault();
        status.className = "form__status";
        if (form.website && form.website.value) return; // Spam-Falle
        if (!form.checkValidity()) {
          status.textContent = "Bitte Name, E-Mail und Einwilligung ausfüllen.";
          status.classList.add("is-error");
          form.reportValidity();
          return;
        }
        const data = Object.fromEntries(new FormData(form).entries());
        delete data.website;
        const betreff = (f.betreff || "Anfrage {objekt}").replace("{objekt}", P.objektnummer || "");

        if (f.endpoint) {
          const btn = form.querySelector("[type=submit]"); btn.disabled = true;
          status.textContent = "Wird gesendet …";
          try {
            const res = await fetch(f.endpoint, {
              method: "POST", headers: { "Accept": "application/json", "Content-Type": "application/json" },
              body: JSON.stringify({ ...data, _subject: betreff })
            });
            if (!res.ok) throw new Error(res.status);
            form.reset();
            status.textContent = f.danke || "Vielen Dank, Ihre Anfrage ist eingegangen.";
            status.classList.add("is-ok");
          } catch (err) {
            status.textContent = "Senden fehlgeschlagen. Bitte per E-Mail oder Telefon melden.";
            status.classList.add("is-error");
          } finally { btn.disabled = false; }
          return;
        }

        // Ohne Endpunkt: E-Mail-Programm mit vorbereitetem Text öffnen
        const body = [
          `Name: ${data.name}`, `E-Mail: ${data.email}`,
          data.telefon ? `Telefon: ${data.telefon}` : "", data.termin ? `Wunschtermin: ${data.termin}` : "",
          "", data.nachricht || ""
        ].filter(x => x !== "").join("\n");
        window.location.href = `mailto:${encodeURIComponent(k.email || "")}?subject=${encodeURIComponent(betreff)}&body=${encodeURIComponent(body)}`;
        status.textContent = "Ihr E-Mail-Programm öffnet sich mit der vorbereiteten Anfrage.";
        status.classList.add("is-ok");
      });
    }
  };
})();
