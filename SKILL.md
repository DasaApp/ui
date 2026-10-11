---
name: dasa-design
description: Use this skill to generate well-branded interfaces and assets for PT Dasa Aprilindo Sentosa (daas.co.id), either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, and CSS components (light + dark theme) for prototyping.
user-invocable: true
---

Read the README.md file within this skill, and explore the other available files (tokens.css, components.css, guidelines/style-guide.html).

This is a CSS-only design system (plus one optional script, `dasa-ui.js`, used only for dismissible/auto-closing alerts; group related form fields with `<fieldset class="fieldset">` + `<legend>`): plain custom-property tokens plus a class-based component layer. Load `styles.css` (or `tokens.css` then `components.css`), then style markup with the real classes and tokens documented in README.md — never invent new class names or hardcode colors/spacing that already have a token. The same tokens support light and dark mode via `data-theme="dark"` on an ancestor element; only semantic aliases change, brand accent colors stay constant.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), link the stylesheet and build with its classes. If working on production code, copy the CSS files in and read the rules in README.md to become an expert in designing with this brand.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts or production code, depending on the need.
