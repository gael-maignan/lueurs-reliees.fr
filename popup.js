// === popup.js (responsive) ===
(function () {
  const CONFIG = {
    message: `
Chères lectrices, chers lecteurs,
Chères autrices, chers auteurs,

C’est avec beaucoup d’émotion que je vous informe que la maison d’édition Les Lueurs Reliées suspend ses activités jusqu’à nouvel ordre.

Malgré l’enthousiasme, l’engagement et les beaux projets portés au fil des mois, des difficultés financières persistantes ne nous permettent plus, à ce jour, de poursuivre l’aventure dans des conditions viables.

Cette décision n’a pas été facile à prendre. Elle reflète cependant une réalité que je ne peux ignorer, et je choisis aujourd’hui d’y répondre avec lucidité et responsabilité.

Je tiens à exprimer ma profonde gratitude à toutes celles et ceux qui ont cru en Les Lueurs Reliées, aux auteur·ices qui nous ont fait confiance.

Merci, du fond du cœur, pour votre soutien.

Avec toute ma reconnaissance,


Jeanne Lefevre, Directrice Éditoriale
    `.trim(),
    showAfterSeconds: 0,
    persist: "session", // "session", "local", "always"
    maxWidthPx: 840,
    zIndex: 99999,
    closeOnOverlayClick: true
  };

  // stockage / décision d'afficher
  function shouldShow() {
    try {
      if (CONFIG.persist === "always") return true;
      if (CONFIG.persist === "session") return !sessionStorage.getItem("popup_shown_v2");
      if (CONFIG.persist === "local") return !localStorage.getItem("popup_shown_v2");
      return true;
    } catch (e) {
      return true;
    }
  }
  function markShown() {
    try {
      if (CONFIG.persist === "session") sessionStorage.setItem("popup_shown_v2", "1");
      if (CONFIG.persist === "local") localStorage.setItem("popup_shown_v2", "1");
    } catch (e) {}
  }

  // création du popup
  function createPopup() {
    if (document.querySelector(".llr-popup-overlay-v2")) return;

    const previousActive = document.activeElement;

    // overlay
    const overlay = document.createElement("div");
    overlay.className = "llr-popup-overlay-v2";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.tabIndex = -1;

    // container
    const container = document.createElement("div");
    container.className = "llr-popup-container-v2";

    // header (optionnel : on laisse espace pour titre si besoin)
    const header = document.createElement("div");
    header.className = "llr-popup-header-v2";
    // titre (désactivé par défaut, tu peux le personnaliser)
    // const h = document.createElement("h2");
    // h.textContent = "Annonce importante";
    // header.appendChild(h);

    // message (avec pre-wrap)
    const message = document.createElement("div");
    message.className = "llr-popup-message-v2";
    message.style.whiteSpace = "pre-wrap";
    message.textContent = CONFIG.message;

    // footer / actions
    const footer = document.createElement("div");
    footer.className = "llr-popup-footer-v2";

    const closeBtn = document.createElement("button");
    closeBtn.className = "llr-popup-closebtn-v2";
    closeBtn.type = "button";
    closeBtn.innerText = "Fermer";
    closeBtn.setAttribute("aria-label", "Fermer le message");

    footer.appendChild(closeBtn);

    container.appendChild(header);
    container.appendChild(message);
    container.appendChild(footer);
    overlay.appendChild(container);

    // style injecté (responsive)
    const style = document.createElement("style");
    style.setAttribute("data-llr-popup-v2", "true");
    style.textContent = `
.llr-popup-overlay-v2{
  position:fixed;inset:0;display:flex;align-items:center;justify-content:center;
  padding:env(safe-area-inset);background:rgba(0,0,0,0.48);backdrop-filter:blur(3px);
  z-index:${CONFIG.zIndex};box-sizing:border-box;
}
.llr-popup-container-v2{
  background: #fff;
  width: calc(100% - 40px);
  max-width: ${CONFIG.maxWidthPx}px;
  border-radius: 12px;
  box-shadow: 0 12px 40px rgba(0,0,0,0.28);
  padding: 22px 24px;
  box-sizing: border-box;
  color: #111;
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
  max-height: 80vh;
  display:flex;
  flex-direction:column;
  gap: 14px;
  outline: none;
}

/* header (silencieux par défaut) */
.llr-popup-header-v2 h2{margin:0;font-size:20px;font-weight:600}

/* message area: scrollable if long */
.llr-popup-message-v2{
  font-size:16px;
  line-height:1.5;
  overflow:auto;
  -webkit-overflow-scrolling: touch;
  padding-right:6px; /* pour éviter overlap scrollbar */
}

/* footer aligné */
.llr-popup-footer-v2{
  display:flex;
  justify-content:center;
  align-items:center;
  gap:10px;
}

/* bouton */
.llr-popup-closebtn-v2{
  appearance:none;border:0;padding:10px 18px;border-radius:9px;
  background:#111;color:#fff;cursor:pointer;font-size:15px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.12);
}

/* small screen adjustments */
@media (max-width: 600px) {
  .llr-popup-container-v2{ padding:16px; border-radius:10px; width: calc(100% - 32px); }
  .llr-popup-message-v2{ font-size:15px; }
  .llr-popup-closebtn-v2{ padding:10px 14px; font-size:14px; border-radius:8px; }
}

/* very small devices */
@media (max-width: 380px) {
  .llr-popup-container-v2{ padding:12px; border-radius:8px; width: calc(100% - 20px); }
  .llr-popup-message-v2{ font-size:14px; }
  .llr-popup-closebtn-v2{ padding:9px 12px; font-size:13px; }
}

/* make scrollbar subtle on webkit */
.llr-popup-message-v2::-webkit-scrollbar{ width:8px; }
.llr-popup-message-v2::-webkit-scrollbar-thumb{ background: rgba(0,0,0,0.12); border-radius:8px; }

@media (prefers-reduced-motion: reduce) {
  .llr-popup-container-v2 { transition: none !important; animation: none !important; }
}
`;

    // events: close function
    function close(reason) {
      try {
        if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
        if (style && style.parentNode) style.parentNode.removeChild(style);
        markShown();
        if (previousActive && typeof previousActive.focus === "function") previousActive.focus();
        document.removeEventListener("keydown", onKey);
      } catch (e) {
        // ignore
      }
    }

    closeBtn.addEventListener("click", () => close("button"));

    if (CONFIG.closeOnOverlayClick) {
      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) close("overlay");
      });
    }

    function onKey(e) {
      if (e.key === "Escape" || e.key === "Esc") {
        close("escape");
      }
      // tab trap minimal: keep focus inside popup
      if (e.key === "Tab") {
        const focusable = container.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    document.addEventListener("keydown", onKey);

    // insertion
    (document.body || document.documentElement).appendChild(style);
    (document.body || document.documentElement).appendChild(overlay);

    // set focus to close button for accessibility
    closeBtn.focus();

    // ensure message area has sensible max-height (calc for header/footer)
    // small delay for accurate measurements
    requestAnimationFrame(() => {
      const headerHeight = header ? header.getBoundingClientRect().height : 0;
      const footerHeight = footer ? footer.getBoundingClientRect().height : 0;
      const containerHeight = container.getBoundingClientRect().height || window.innerHeight * 0.8;
      const maxMessage = Math.max(80, (window.innerHeight * 0.8) - headerHeight - footerHeight - 60);
      message.style.maxHeight = maxMessage + "px";
    });
  }

  // ready helper
  function ready(cb) {
    if (document.body) return cb();
    document.addEventListener("DOMContentLoaded", cb, { once: true });
    if (document.readyState === "interactive" || document.readyState === "complete") cb();
  }

  try {
    if (!shouldShow()) return;
    ready(() => {
      setTimeout(createPopup, Math.max(0, Number(CONFIG.showAfterSeconds) || 0) * 1000);
    });
  } catch (err) {
    if (console && console.error) console.error("llr-popup error:", err);
  }
})();
