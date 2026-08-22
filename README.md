# Dasa Design System

CSS-only design system for **PT Dasa Aprilindo Sentosa** (daas.co.id) — a
system integration & data technology company in Indonesia. Tokens and
class-based components only, no React/JS, no build step. Derived from the
computed styles of the live site and refined with the brand's official
color/type/spacing specification (Aug 2026).

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
| `.stat`, `.stat__value`, `.stat__label` | centered stat block, put 2–4 inside `.grid grid--N` |
| `.eyebrow` | small uppercase kicker line above a heading, orange |
| `.section`, `.section--lg`, `.section--dark` | page-section padding rhythm; `--dark` is a fixed decorative navy panel that intentionally does NOT follow the light/dark theme — use for highlight content, not as a default surface |
| `.container` | centers content, `max-width: var(--container-max)` (1140px) |
| `.grid`, `.grid--2`, `.grid--3`, `.grid--4` | responsive grid, collapses at 900px/600px |
| `.alert`, `.alert--info/success/warning/danger` | tinted notice block, `.alert__dot` + `.alert__title` |
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
| `guidelines/style-guide.html` | Live reference page with a light/dark toggle, rendering every class and token |
| `SKILL.md` | Portable skill file for use in Claude Code |

Source: extracted from computed styles of [daas.co.id](https://daas.co.id/),
refined against PT Dasa Aprilindo Sentosa's brand color/type/spacing spec
(August 2026).
