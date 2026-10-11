/* Dasa Design System — skrip opsional (vanilla, tanpa dependensi, ~2 KB).
 *
 * Seluruh sistem tetap CSS-only; skrip ini HANYA diperlukan untuk perilaku alert:
 *   - tombol tutup:        <button class="alert__close" data-alert-close aria-label="Tutup">×</button>
 *   - tutup otomatis:      <div class="alert alert--success alert--dismissible" data-autoclose="5000">
 *     (data-autoclose="true" = 5000 ms; hitung mundur berhenti selagi kursor/fokus ada di alert,
 *      dan indikator waktu .alert__progress ditambahkan otomatis)
 *
 * Tanpa skrip ini, alert tampil normal dan tombol tutup tidak berfungsi. Sertakan sekali:
 *   <script src="dasa-ui.js" defer></script>
 *
 * Alert yang ditambahkan belakangan (HTMX, fetch, dsb.) diinisialisasi otomatis.
 * Peristiwa (bubbles pada .alert):
 *   dasa:alert-close   — sebelum ditutup; `event.preventDefault()` membatalkan
 *   dasa:alert-removed — di `document`, setelah alert dilepas dari DOM (tata letak bergeser)
 * API: window.DasaUI.dismissAlert(el), window.DasaUI.initAlerts(root)
 */
(function () {
  "use strict";

  var DEFAULT_AUTOCLOSE_MS = 5000;
  var LEAVE_MS = 250;

  function reducedMotion() {
    return !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }

  function dismissAlert(alert) {
    if (!alert || alert.dataset.dasaLeaving) return;
    var event = new CustomEvent("dasa:alert-close", { bubbles: true, cancelable: true });
    if (!alert.dispatchEvent(event)) return;
    alert.dataset.dasaLeaving = "1";
    window.clearTimeout(alert._dasaTimer);
    // max-height awal diperlukan agar transisi ke 0 berjalan (CSS: .alert--leaving).
    alert.style.maxHeight = alert.offsetHeight + "px";
    void alert.offsetHeight; // paksa reflow
    alert.classList.add("alert--leaving");
    window.setTimeout(
      function () {
        alert.remove();
        document.dispatchEvent(new CustomEvent("dasa:alert-removed"));
      },
      reducedMotion() ? 0 : LEAVE_MS
    );
  }

  function autocloseMs(alert) {
    var raw = alert.getAttribute("data-autoclose");
    if (raw === null || raw === "false" || raw === "0") return 0;
    var ms = parseInt(raw, 10);
    return ms > 0 ? ms : DEFAULT_AUTOCLOSE_MS;
  }

  function initAlert(alert) {
    if (alert.dataset.dasaReady) return;
    alert.dataset.dasaReady = "1";

    var total = autocloseMs(alert);
    if (!total) return;

    var remaining = total;
    var startedAt = 0;

    alert.style.setProperty("--alert-duration", total + "ms");
    if (!alert.querySelector(".alert__progress")) {
      var bar = document.createElement("span");
      bar.className = "alert__progress";
      bar.setAttribute("aria-hidden", "true");
      alert.appendChild(bar);
    }

    function start() {
      startedAt = Date.now();
      alert._dasaTimer = window.setTimeout(function () {
        dismissAlert(alert);
      }, remaining);
    }
    function pause() {
      window.clearTimeout(alert._dasaTimer);
      remaining = Math.max(remaining - (Date.now() - startedAt), 0);
    }

    // Selaras dengan CSS (.alert:hover/:focus-within menjeda animasi indikator waktu).
    alert.addEventListener("mouseenter", pause);
    alert.addEventListener("mouseleave", start);
    alert.addEventListener("focusin", pause);
    alert.addEventListener("focusout", function (e) {
      if (!alert.contains(e.relatedTarget)) start();
    });
    start();
  }

  function initAlerts(root) {
    (root || document)
      .querySelectorAll(".alert[data-autoclose], .alert--dismissible")
      .forEach(initAlert);
  }

  document.addEventListener("click", function (event) {
    var button = event.target.closest && event.target.closest("[data-alert-close]");
    if (!button) return;
    dismissAlert(button.closest(".alert"));
  });

  function boot() {
    initAlerts(document);
    if (!window.MutationObserver) return;
    new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        mutation.addedNodes.forEach(function (node) {
          if (node.nodeType !== 1) return;
          if (node.matches && node.matches(".alert[data-autoclose], .alert--dismissible")) initAlert(node);
          if (node.querySelectorAll) initAlerts(node);
        });
      });
    }).observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  window.DasaUI = { dismissAlert: dismissAlert, initAlerts: initAlerts };
})();
