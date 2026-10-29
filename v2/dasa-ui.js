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
 * API: window.DasaUI.dismissAlert(el), window.DasaUI.initAlerts(root), window.DasaUI.toast(msg, opts)
 *
 * v2 menambah: DasaUI.toast, tutup dropdown saat klik luar/Escape, dan tutup menu navbar
 * collapsible saat link diklik/Escape. Komponen lain (accordion, switch, navbar) tetap CSS-only.
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

  /* -- v2: dropdown & navbar collapsible -------------------------------------- */
  function closeMenus(except) {
    document.querySelectorAll("details.dropdown[open]").forEach(function (d) {
      if (!except || !d.contains(except)) d.removeAttribute("open");
    });
  }
  document.addEventListener("click", function (event) {
    closeMenus(event.target);
    var link = event.target.closest && event.target.closest(".navbar--collapsible .navbar__links a");
    if (link) {
      var toggle = link.closest(".navbar").querySelector(".navbar__toggle-input");
      if (toggle) toggle.checked = false;
    }
  });
  document.addEventListener("keydown", function (event) {
    if (event.key !== "Escape") return;
    closeMenus(null);
    document.querySelectorAll(".navbar__toggle-input:checked").forEach(function (t) { t.checked = false; });
  });

  /* -- v2: toast --------------------------------------------------------------
   * DasaUI.toast("Pesan", { type: "success|info|warning|danger", title: "Judul", duration: 5000 })
   * duration 0 = tidak tertutup otomatis. Teks disisipkan via textContent (aman dari XSS). */
  function toast(message, options) {
    options = options || {};
    var type = options.type || "info";
    var duration = options.duration === undefined ? DEFAULT_AUTOCLOSE_MS : options.duration;
    var region = document.querySelector(".toast-region");
    if (!region) {
      region = document.createElement("div");
      region.className = "toast-region";
      region.setAttribute("role", "status");
      region.setAttribute("aria-live", "polite");
      document.body.appendChild(region);
    }
    var el = document.createElement("div");
    el.className = "alert alert--" + type + " alert--dismissible";
    if (duration > 0) el.setAttribute("data-autoclose", String(duration));
    var dot = document.createElement("span");
    dot.className = "alert__dot";
    var body = document.createElement("div");
    if (options.title) {
      var title = document.createElement("p");
      title.className = "alert__title";
      title.textContent = options.title;
      body.appendChild(title);
    }
    var text = document.createElement("p");
    text.textContent = message;
    body.appendChild(text);
    var close = document.createElement("button");
    close.type = "button";
    close.className = "alert__close";
    close.setAttribute("data-alert-close", "");
    close.setAttribute("aria-label", "Tutup");
    close.textContent = "\u00d7";
    el.appendChild(dot);
    el.appendChild(body);
    el.appendChild(close);
    region.appendChild(el);
    return el;
  }
  document.addEventListener("dasa:alert-removed", function () {
    var region = document.querySelector(".toast-region");
    if (region && !region.children.length) region.remove();
  });
  window.DasaUI = { dismissAlert: dismissAlert, initAlerts: initAlerts, toast: toast };
})();
