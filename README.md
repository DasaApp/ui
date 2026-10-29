# Dasa Design System

CSS-only design system for **PT Dasa Aprilindo Sentosa** (daas.co.id) — a
system integration & data technology company in Indonesia. Tokens and
class-based components only, no React, no build step (one optional ~2 KB
vanilla script, `dasa-ui.js`, adds behaviour to dismissible alerts). Derived from the
computed styles of the live site and refined with the brand's official
color/type/spacing specification (Aug 2026).

## Versi (v1 & v2)

| Versi | Folder | Keterangan |
|---|---|---|
| v1 | `v1/` | Ukuran tetap (fokus desktop). Stabil, tidak diubah. |
| v2 | `v2/` | Responsif penuh (mobile, tablet, desktop, layar besar). **Direkomendasikan.** |

Pilih versi di `index.html` (ui.dasa.my.id), atau langsung pada path stylesheet: `v1/styles.css` atau `v2/styles.css`.

**Perbedaan v2:** token tipografi dan spasi fluid (`clamp()`), grid mobile-first, breakpoint 480/768/1024/1440/1920, container melebar di layar besar (1320px di 1440+, 1600px di 1920+), navbar membungkus, modal menjadi bottom-sheet di mobile, target sentuh 44px (`pointer: coarse`), dan dukungan safe-area. Penyesuaian otomatis lewat media query, tanpa deteksi device. Pastikan halaman memiliki `<meta name="viewport" content="width=device-width, initial-scale=1">`.

Komponen tambahan v2 (navbar hamburger, accordion, switch, dropdown, avatar, empty state, skeleton, toast, utilitas layout, fokus keyboard & kontras) dijelaskan di [`docs/KOMPONEN.md`](docs/KOMPONEN.md).

Di v2, `.card--accent` (garis oranye di atas kartu) **dihapus**; kartu memakai `.card` biasa.
## Setup

```html
<link rel="stylesheet" href="styles.css" />
```

`styles.css` is the single entry point: it `@import`s Google Fonts, then
`tokens.css`, then `components.css`, in that order (components read the
custom properties tokens defines). Load it once; don't link the three files
separately unless you need to omit the font import.

`components.css` sets `body` defaults (background `var(--color-bg)`, text
`var(--color-text-primary)`, base font `var(--font-copy)`). If your root
isn't a real `<body>`, apply those three declarations to your top-level
container explicitly.

## Optional script: `dasa-ui.js`

The system is CSS-only; the script is needed **only** for dismissible/auto-closing
alerts. Load it once (`<script src="dasa-ui.js" defer></script>`). Alerts inserted later
(HTMX, fetch) are picked up automatically. Events on the alert: `dasa:alert-close`
(cancelable, before closing) and `dasa:alert-removed` (on `document`, after removal —
useful to re-measure layout). API: `DasaUI.dismissAlert(el)`, `DasaUI.initAlerts(root)`.
Without the script alerts render normally; the close button is inert.

## Light & dark mode

Every semantic surface/text token is redefined per theme, not duplicated
into separate components. Default is light; add `data-theme="dark"` to
`<html>` (or any ancestor) to switch:

```html
<html data-theme="dark">
```

Brand accent colors (navy heading, blue, orange) and `--color-brand-ink`
(the fixed decorative navy panel color) stay constant across both themes —
only backgrounds, surfaces, borders, and body/heading text adapt. See
`guidelines/style-guide.html` for a live toggle demo.

## Styling idiom: real classes and tokens, nothing invented

Three font roles — pick the right one per role:

| Token | Font | Use for |
|---|---|---|
| `var(--font-display)` | Montserrat (500–800) | headings, buttons, brand/logo |
| `var(--font-body)` | DM Sans (400–700) | nav links, form labels, UI microcopy, badges |
| `var(--font-copy)` | Roboto (400–700) | paragraph body copy (also the `body` default) |

Component classes defined in `components.css`:

| Class | Notes |
|---|---|
| `.btn`, `.btn--primary`, `.btn--secondary`, `.btn--outline`, `.btn--ghost` | primary = orange brand accent (main CTA); secondary = blue accent; outline/ghost = adaptive heading color, no fill |
| `.btn--sm`, `.btn--lg` | size modifiers, combine with a color variant |
| `.card`, `.card--accent` | accent adds a 3px top border in the orange brand accent |
| `.card__icon` | 48px badge-square inside a card, blue fill |
| `.badge`, `.badge--primary`, `.badge--secondary` | default is neutral surface-muted; primary=blue-tinted, secondary=orange-tinted (tint mixes toward the current theme's surface, so it adapts automatically) |
| `.navbar`, `.navbar__brand`, `.navbar__links` | flex row nav; links is a `<ul>` |
| `.field` | label + input/textarea/select wrapper, use inside `.grid` for multi-column forms |
| `.fieldset`, `.fieldset--plain`, `.fieldset--muted`, `.fieldset__hint` | groups related fields: `<fieldset class="fieldset"><legend>…</legend>…</fieldset>`. Real `<fieldset>`/`<legend>` so screen readers announce the group; `--plain` = no box, orange rule under the legend; `--muted` = soft filled panel; the `disabled` attribute disables every field inside (dimmed automatically). Put `.field`/`.grid` inside as usual |
| `.form`, `.form--narrow`, `.form--wide`, `.form--full`, `.card--form`, `.card--wide` | **form tidak melebar penuh**: `.form` membatasi lebar (36rem; narrow 24, wide 52, full tanpa batas); `.card--form` membatasi kartu berisi satu form (40rem; `.card--wide` 56rem) |
| `.field--xs`, `.field--sm`, `.field--md` | lebar satu field menurut isinya: 6rem (kode/angka), 12rem (tanggal/pilihan pendek), 20rem (email/nama); tanpa modifier = selebar form |
| `.form-row`, `.form__actions` | field berkaitan sejajar (grid otomatis, turun baris di layar sempit); baris tombol di bawah form |
| `.field__checkbox` | kotak centang/radio berlabel: `<label class="field__checkbox"><input type="checkbox"><span>Teks</span></label>` |
| `.stat`, `.stat__value`, `.stat__label` | centered stat block, put 2–4 inside `.grid grid--N` |
| `.eyebrow` | small uppercase kicker line above a heading, orange |
| `.section`, `.section--lg`, `.section--dark` | page-section padding rhythm; `--dark` is a fixed decorative navy panel that intentionally does NOT follow the light/dark theme — use for highlight content, not as a default surface |
| `.container` | centers content, `max-width: var(--container-max)` (1140px) |
| `.grid`, `.grid--2`, `.grid--3`, `.grid--4` | responsive grid, collapses at 900px/600px |
| `.alert`, `.alert--info/success/warning/danger` | tinted notice block, `.alert__dot` + `.alert__title` |
| `.alert--dismissible`, `.alert__close` | adds a close button: `<button type="button" class="alert__close" data-alert-close aria-label="Tutup">&times;</button>` (needs `dasa-ui.js`) |
| `data-autoclose="ms"` on `.alert` | closes itself after `ms` milliseconds (`true` = 5000) with a countdown bar (`.alert__progress`, added automatically); pauses while hovered/focused. Combine with `.alert--dismissible` for both. Don't auto-close error messages |
| `.table-wrap`, `.table` | bordered data table with header row and row hover |
| `.tabs`, `.tabs__link`, `.tabs__link--active` | underline tab row |
| `.pagination`, `.pagination__item`, `--active`, `--disabled` | pill page controls |
| `.breadcrumb` | `<ul>` trail with auto `/` separators |
| `.tooltip` | pure-CSS hover tooltip, set `data-tooltip="…"` |
| `.modal__overlay`, `.modal`, `.modal__header/body/footer/title/close` | dialog surface, static preview markup |

For anything not covered by a class, use tokens directly — never a raw hex/px:

- Color: `var(--color-brand-primary)` (blue), `var(--color-brand-secondary)`
  (orange, main CTA color), `var(--color-heading)` (adaptive heading/wordmark
  color), `var(--color-brand-ink)` (fixed brand navy, decorative surfaces
  only), `var(--color-text-primary|secondary|tertiary)`, `var(--color-surface)`,
  `var(--color-surface-muted)`, `var(--color-border)`
- Spacing: `var(--space-1)` (4px) through `var(--space-10)` (128px), 4px base scale
- Radius: `var(--radius-sm|md|lg|xl|pill)` — inputs/small cards 8px, buttons 10px, large cards 16px
- Shadow: `var(--shadow-sm|md|lg)`, plus `var(--shadow-nav)` for overlays/drawers
- Type scale: `var(--text-xs)` through `var(--text-4xl)` — H1 48px/800, H2
  32px/700, H3 24px/700, body 16px/400, UI label 14px/600. Headings use
  `text-wrap: balance`.

## Where the truth lives

Read `tokens.css` (every custom property) and `components.css` (every class,
plus responsive breakpoints and the dark-theme override block) before
styling anything non-trivial. `guidelines/style-guide.html` renders every
token and component together with a light/dark toggle.

## Example

```html
<section class="section">
  <div class="container">
    <span class="eyebrow">Services</span>
    <h2>Deliver the best solution</h2>
    <div class="grid grid--3">
      <div class="card card--accent">
        <div class="card__icon">B</div>
        <h4>Build</h4>
        <p>End-to-end system integration and technology implementation.</p>
        <span class="badge badge--secondary">Core Service</span>
      </div>
    </div>
    <button class="btn btn--primary">Let's Connect</button>
  </div>
</section>
```

## Content fundamentals

Copy on daas.co.id is short, declarative, service-oriented: capability
statements ("Build", "Research", "Develop") paired with one plain sentence
of explanation, plus a stat block (years, projects, clients) for credibility.
No emoji. Bilingual ID/EN is common in this system's examples; pick one
language per surface and keep it consistent.

## Package contents

| File | Contents |
|---|---|
| `styles.css` | Entry point — `@import`s Google Fonts, then `tokens.css`, then `components.css` |
| `tokens.css` | Custom properties: raw brand/neutral colors, semantic aliases (light + dark theme), typography, spacing, radius, shadow, motion |
| `components.css` | Class-based components: button, card, badge, nav, form, stat, layout section/grid — dark-theme aware |
| `dasa-ui.js` | Optional vanilla script for alert close button and auto-close |
| `guidelines/style-guide.html` | Live reference page with a light/dark toggle, rendering every class and token |
| `SKILL.md` | Portable skill file for use in Claude Code |

Source: extracted from computed styles of [daas.co.id](https://daas.co.id/),
refined against PT Dasa Aprilindo Sentosa's brand color/type/spacing spec
(August 2026).
