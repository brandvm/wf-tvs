# Import pack — Services template (`/services/{slug}`)

Prepared 2026-11-13 by a read-only prep session. Nothing here has been
written to Webflow. Source: `prototype/services/diagnostics/index.html`
(+ `partials/sections/reviews.html`, `partials/sections/locations.html`),
classes `prototype/src/css/new-classes-service.css`, variables
`prototype/src/css/proposed.css` (P23). Figma 684:10562.

Read from Webflow (site `6af4e2d97d259cb3efb2af71`, `webflow-wf-tvs`) for
this pack: every class selector, the variables the CSS uses, all
components with props, the Services / Service Items / FAQs / Locations
schemas, and the 10 Services items + 65 Service Items.

- Template page: **Services Template** `6af7416e0fddcc8540377132`
  (collection Services `6af7416d0fddcc85403770d5`). It is empty and its
  SEO is blank.
- Page order (prototype): Service Hero → Hero bar (marquee) → How we can
  help → When to book → FAQ → Reviews → Locations. **No CTA on this
  template** (the prototype has none).

## 0. Blockers and decisions found while preparing

| # | What | Why it matters | Proposed |
| --- | --- | --- | --- |
| B1 | **When to book image is empty on all 10 Services items.** The source copy (`Assets/content/tvs-service-pages/`) has one photo per service (the hero). Only Diagnostics has a When-to-book photo, in the prototype (`prototype/public/images/services/diagnostics-when.webp`, from Figma). | The left column image is missing on every page until filled. | Bind it anyway with visibility "When to book image is set". Upload `diagnostics-when.webp` to the Diagnostics item (CMS write: the person's OK). Ask the person for the other nine photos. |
| B2 | **Travel layout (no steps, image on the right) is not built in the prototype.** HANDOFF describes it (Figma 684:16335) but there is no CSS or markup. Travel also has no When-to-book image (B1). | Without a design, the Travel page shows the intro alone, left-aligned. | §3.4b proposes a minimal Travel block (one new class, Book Media). Confirm with the person before building it; until then the steps card just hides. |
| B3 | **Phone card label.** The prototype binds `Area label`, but shows "Parliament"; the CMS has Area label = "Cabbagetown" and Nav label = "Downtown Toronto". No field holds "Parliament". | The hero shows "CABBAGETOWN" (Area label) or "DOWNTOWN TORONTO" (Nav label), not the prototype's "PARLIAMENT". | Bind **Nav label** (the "Downtown Toronto" rule covers the nav and Contact, which phone lists are closest to). Ask the person. |
| B4 | **Reviews and Locations are not components yet.** HANDOFF says "one Webflow component each", but `get_all_components` lists neither. They exist only as sections on Home (bound CMS lists). | They must become components before the template can reuse them. | Transform them on Home first (§2). |
| B5 | Diagnostics hero photo: the prototype uses the Figma photo (Yorkie blood sample); the CMS item has the service-page photo (small dog held, from the copy source). | The page looks different from the prototype screenshot. | Keep the CMS photo (the copy source is the content authority). Note it in the compare. |
| B6 | Repo CSS the template needs is not ported to `wf-tvs/src/styles.css` (counters, live dot pulse, phone-card well animation; §1.4). | Item numbers 01, 02… and the animations are missing on staging. | Port it in the repo (not a Webflow step). |

## 1. Classes and variables to create first

### 1.1 Variables (P23, missing in Webflow)

All seven are missing (`query_variables` returned nothing). Collection
**Layout** (`d7e7593e…`; query by name for the full id). Base value only;
no breakpoint modes (project rule). Check every create result's `name`
for a suffix (GOTCHAS).

| Name | CSS name | Value |
| --- | --- | --- |
| Service Hero/Min Height | `--_layout---service-hero--min-height` | 43.75em |
| Service Hero/Photo Width | `--_layout---service-hero--photo-width` | 33.75em |
| Service Hero/Photo Height | `--_layout---service-hero--photo-height` | 24em |
| Service Hero/Lead Width | `--_layout---service-hero--lead-width` | 40.8125em |
| Phone Card/Width | `--_layout---phone-card--width` | 21.25em |
| Help/Intro Width | `--_layout---help--intro-width` | 30em |
| Book/Intro Width | `--_layout---book--intro-width` | 32.25em |

(P23's eighth, `location--form-width`, belongs to the Locations template.)

Everything else the CSS reads exists: Spacing 2/4/8/10/12/16/20/24/28/32/40/48/56/64/80/96 and Hairline; Radius 12/16/24/Pill; Service Tint Green/Pink/Yellow/Violet; Blue Tint/Blue 8; Ink Tint 12/24/48/64; Brand Accent/Ink/Paper; Colors Semantic Text/Secondary and Status/Success; Size 12/14/16/20/22/28; Role Size Body/Body Small; Line Height Compact/Comfortable/Snug; Letter Spacing Snug/Tight/Wide; Weight Medium/Semibold; Family Body; Layout Section/Padding H, Eyebrow/Dot Size, Service Icon/Size.

### 1.2 Classes

Write each value as `var(--<css name>)` (binds the variable, GOTCHAS
2026-11-12). Shorthands are split into longhands. Breakpoint ids:
`main` (desktop), `medium` (991), `small` (767), `tiny` (479).
**API?** column: ✓ = style API; ⚠ = API with a literal, then a MANUAL row;
✗ = Designer only.

Existing classes reused (no change): Section, Is Tint, Is Dark, S Wrapper,
Faq (combo), Eyebrow, Eyebrow Dot, Eyebrow Text, D1, D2, Section Head
Text, Hero Bar (+ Item, Icon, Text, Divider), Draggable Marquee
(+ __collection, __list), Phone Well, Phone Well Icon, Faq Head, Faq Head
Action, Faq List, Faq Item, Faq Question, Faq Question Text, Faq Toggle,
Faq Toggle Icon, Faq Answer, Faq Answer Inner, Button stack (component).

**Create combos with their parents first** (`parent_style_names`), then
the globals. 3-class chains need the exact chain (lessons/mcp.md).

#### Combos

| Class (parents) | Breakpoint | Properties | API? |
| --- | --- | --- | --- |
| **Service Hero** (Section › Is Tint) | main | flex-direction row; align-items stretch; min-height `var(--_layout---service-hero--min-height)`; padding-top/right/bottom/left 0 | ✓ |
| | medium | flex-direction column-reverse; min-height 0 | ✓ |
| **Service Bar Section** (Section) | main | padding-top/right/bottom/left 0 | ✓ |
| **Help** (S Wrapper) | main | row-gap, column-gap `var(--_spacing---48)` | ✓ |
| **Book** (S Wrapper) | main | flex-direction row; align-items flex-start; row-gap, column-gap `var(--_spacing---80)` | ✓ |
| | medium | flex-direction column; row-gap, column-gap `var(--_spacing---48)` | ✓ |
| **Is 2** (Help Group) | main | background-color `var(--_colors---service-tint--green)` | ✓ |
| **Is 3** (Help Group) | main | background-color `var(--_colors---service-tint--yellow)` | ✓ |
| **Is Green** (Book Step Icon) | main | background-color `var(--_colors---service-tint--green)` | ✓ |
| **Is Violet** (Book Step Icon) | main | background-color `var(--_colors---service-tint--violet)` | ✓ |
| **Is Pink** (Book Step Icon) | main | background-color `var(--_colors---service-tint--pink)` | ✓ |

The prototype's `breadcrumb-link is-home` has no styles: dropped (no class).

#### Globals — Service Hero

| Class | Breakpoint | Properties | API? |
| --- | --- | --- | --- |
| **Service Hero Panel** | main | position relative; display flex; flex-grow 1; flex-shrink 1; flex-basis 0%; flex-direction column; justify-content center; min-width 0; padding-top `var(--_spacing---96)`; padding-right `var(--_spacing---64)`; padding-bottom `var(--_spacing---64)`; padding-left `var(--_layout---section--padding-h)` | ✓ |
| | medium | padding-top `var(--_spacing---80)`; padding-right `var(--_layout---section--padding-h)`; padding-bottom `var(--_spacing---56)`; padding-left `var(--_layout---section--padding-h)` | ✓ |
| **Service Hero Copy** | main | display flex; flex-direction column; row-gap, column-gap `var(--_spacing---48)` | ✓ |
| **Service Hero Text** | main | display flex; flex-direction column; row-gap, column-gap `var(--_spacing---24)` | ✓ |
| **Service Hero Lead Box** | main | max-width `var(--_layout---service-hero--lead-width)` | ✓ |
| **Service Hero Lead** (on a Rich Text) | main | margin 0 (4 sides); color `var(--_colors-semantic---text--secondary)`; font-family `var(--_typography-scale---family--body)`; font-size `var(--_typography-role---size--body-small)`; line-height `var(--_typography-scale---line-height--comfortable)` | ✓ |
| | tiny | font-size `var(--_typography-role---size--body)` | ✓ |
| **Service Hero Contact** | main | display flex; flex-direction column; row-gap, column-gap `var(--_spacing---16)` | ✓ |
| **Service Hero Note** | main | margin 0; color `var(--_colors-semantic---text--secondary)`; font-size `var(--_typography-scale---size--14)`; line-height `var(--_typography-scale---line-height--compact)` | ✓ |
| **Service Hero Media** | main | position relative; flex-grow 0; flex-shrink 0; flex-basis `var(--_layout---service-hero--photo-width)`; overflow hidden | ✓ |
| | medium | flex-grow 0; flex-shrink 0; flex-basis auto; height `var(--_layout---service-hero--photo-height)` | ✓ |
| **Service Hero Photo** | main | position absolute; top 0; left 0; width 100%; height 100%; object-fit cover | ✓ |

#### Globals — Breadcrumb

| Class | Breakpoint | Properties | API? |
| --- | --- | --- | --- |
| **Breadcrumb** | main | position absolute; top `var(--_spacing---40)`; left `var(--_layout---section--padding-h)`; display flex; align-items center; row-gap, column-gap `var(--_spacing---8)` | ✓ |
| | medium | top `var(--_spacing---32)` | ✓ |
| **Breadcrumb Link** | main | display flex; align-items center; color `var(--_colors---brand--accent)`; font-size `var(--_typography-scale---size--14)`; line-height `var(--_typography-scale---line-height--compact)`; text-decoration none | ✓ |
| | main · hover | color `var(--_colors---brand--ink)` | ✓ |
| | main · active | color `var(--_colors---ink-tint--ink-64)` | ✓ |
| **Breadcrumb Icon** | main | font-size `var(--_typography-scale---size--16)`; line-height 1 | ✓ |
| **Breadcrumb Sep** | main | color `var(--_colors---ink-tint--ink-48)`; font-size `var(--_typography-scale---size--14)`; line-height 1 | ✓ |
| **Breadcrumb Current** | main | color `var(--_colors---ink-tint--ink-64)`; font-size `var(--_typography-scale---size--14)`; line-height `var(--_typography-scale---line-height--compact)` | ✓ |

#### Globals — Phone cards

The prototype's card is the flex child of `.phone-cards`. In a Collection
List the link sits inside a Collection Item, so the flex sizing moves to
a **new item class, Phone Cards Item** (not in the prototype; same
result). Add it to the prototype CSS later so the class check passes.

| Class | Breakpoint | Properties | API? |
| --- | --- | --- | --- |
| **Phone Cards** (Collection List) | main | display flex; flex-wrap wrap; row-gap, column-gap `var(--_spacing---12)` | ✓ |
| **Phone Cards Item** (Collection Item, NEW) | main | display flex; flex-grow 0; flex-shrink 1; flex-basis `var(--_layout---phone-card--width)` | ✓ |
| | tiny | flex-grow 1; flex-shrink 1; flex-basis 100% | ✓ |
| **Phone Card** (Link Block) | main | display flex; flex-grow 1; flex-shrink 1; flex-basis auto; align-items center; row-gap, column-gap `var(--_spacing---12)`; padding-top `var(--_spacing---16)`; padding-right `var(--_spacing---12)`; padding-bottom `var(--_spacing---16)`; padding-left `var(--_spacing---20)`; border radius (4 corners) `var(--_radius---16)`; background-color `var(--_colors---brand--paper)`; color `var(--_colors---brand--ink)`; text-decoration none | ✓ |
| | main | transition: box-shadow 200ms ease | ✗ Designer (Effects › Transitions; `transition` is refused under custom properties) |
| | main · hover | box-shadow `0 0 0 0.0625em #0808293d` (Hairline, Ink 24) | ⚠ literal, MANUAL TBD-6 |
| | main · active | box-shadow `0 0 0 0.125em #0808293d` (Spacing/2, Ink 24) | ⚠ literal, MANUAL TBD-6 |
| **Phone Card Text** | main | display flex; flex-grow 1; flex-shrink 1; flex-basis auto; flex-direction column; row-gap, column-gap `var(--_spacing---2)`; min-width 0 | ✓ |
| **Phone Card Label** | main | color `var(--_colors---ink-tint--ink-64)`; font-size `var(--_typography-scale---size--12)`; font-weight `var(--_typography-scale---weight--semibold)`; letter-spacing `var(--_typography-scale---letter-spacing--wide)`; line-height `var(--_typography-scale---line-height--compact)`; text-transform uppercase | ✓ |
| **Phone Card Number** | main | font-size `var(--_typography-scale---size--22)`; font-weight `var(--_typography-scale---weight--medium)`; letter-spacing `var(--_typography-scale---letter-spacing--snug)`; line-height `var(--_typography-scale---line-height--compact)`; white-space nowrap | ✓ |
| **Live Dot** | main | flex-grow 0; flex-shrink 0; flex-basis auto; width, height `var(--_layout---eyebrow--dot-size)`; margin-left `var(--_spacing---4)`; border radius `var(--_radius---pill)`; background-color `var(--_colors-semantic---status--success)` | ✓ |

#### Globals — How we can help

| Class | Breakpoint | Properties | API? |
| --- | --- | --- | --- |
| **Help Head** | main | display flex; flex-wrap wrap; align-items flex-end; justify-content space-between; row-gap `var(--_spacing---32)`; column-gap `var(--_spacing---64)`; align-self stretch | ✓ |
| **Help Head Intro** | main | display flex; flex-direction column; align-items flex-start; row-gap, column-gap `var(--_spacing---20)` | ✓ |
| **Help Head Text** (on a Rich Text) | main | flex-grow 0; flex-shrink 1; flex-basis `var(--_layout---help--intro-width)`; margin 0; color `var(--_colors-semantic---text--secondary)`; font-family `var(--_typography-scale---family--body)`; line-height `var(--_typography-scale---line-height--comfortable)` | ✓ |
| **Help Groups** | main | display flex; flex-direction column; row-gap, column-gap `var(--_spacing---40)`; align-self stretch | ✓ |
| **Help Group** | main | display flex; flex-direction column; row-gap, column-gap `var(--_spacing---24)`; padding-top `var(--_spacing---48)`; padding-right `var(--_spacing---48)`; padding-bottom `var(--_spacing---20)`; padding-left `var(--_spacing---48)`; border width (4 sides) `var(--_spacing---hairline)`, style solid, color `var(--_colors---ink-tint--ink-12)`; border radius `var(--_radius---24)`; background-color `var(--_colors---blue-tint--blue-8)` | ✓ |
| | small | padding-top `var(--_spacing---32)`; padding-right `var(--_spacing---24)`; padding-bottom `var(--_spacing---8)`; padding-left `var(--_spacing---24)` | ✓ |
| **Help Group Title** | main | margin 0; font-size `var(--_typography-scale---size--28)`; font-weight `var(--_typography-scale---weight--semibold)`; letter-spacing `var(--_typography-scale---letter-spacing--tight)`; line-height `var(--_typography-scale---line-height--snug)` | ✓ |
| **Help Items** (Collection List) | main | display grid; grid-template-columns `repeat(2, minmax(0, 1fr))`; column-gap `var(--_spacing---64)`; row-gap 0 | ✓ (set row-gap 0 or `.w-layout-grid`-style defaults leak in) |
| | small | grid-template-columns `minmax(0, 1fr)` | ✓ |
| **Help Item** (Collection Item) | main | display flex; flex-direction column; row-gap, column-gap `var(--_spacing---10)`; padding-top, padding-bottom `var(--_spacing---28)`; padding-left, padding-right 0; border-top width `var(--_spacing---hairline)`, style solid, color `var(--_colors---ink-tint--ink-12)` | ✓ |
| **Help Item Title** | main | margin 0; font-size `var(--_typography-scale---size--20)`; font-weight `var(--_typography-scale---weight--medium)`; letter-spacing `var(--_typography-scale---letter-spacing--snug)`; line-height `var(--_typography-scale---line-height--compact)`; display flex; align-items baseline; row-gap, column-gap `var(--_spacing---16)` | ✓ (the display/align/gap come from the prototype's counter rule; they belong in the Designer, the `::before` stays in the repo) |
| **Help Item Body** (on a Rich Text) | main | padding-left `var(--_spacing---40)`; color `var(--_colors-semantic---text--secondary)`; font-family `var(--_typography-scale---family--body)`; line-height `var(--_typography-scale---line-height--comfortable)` | ✓ |
| | small | padding-left 0 | ✓ |
| Help Item Body › All Links (nested) | main | color `var(--_colors---brand--accent)`; text-decoration underline; hover: color `var(--_colors---brand--ink)` | ✗ Designer, MANUAL TBD-7 |

#### Globals — When to book

| Class | Breakpoint | Properties | API? |
| --- | --- | --- | --- |
| **Book Intro** | main | display flex; flex-grow 0; flex-shrink 1; flex-basis `var(--_layout---book--intro-width)`; flex-direction column; align-items flex-start; row-gap, column-gap `var(--_spacing---20)` | ✓ |
| | medium | flex-grow 0; flex-shrink 0; flex-basis auto; align-self stretch | ✓ |
| **Book Image** | main | display block; width 100%; height auto; aspect-ratio 4 / 3; margin-top `var(--_spacing---4)`; border radius `var(--_radius---24)`; object-fit cover | ✓ (if `aspect-ratio` is refused: Designer Size › Ratio 4:3) |
| **Book Card** | main | display flex; flex-grow 1; flex-shrink 1; flex-basis 0%; flex-direction column; row-gap, column-gap `var(--_spacing---32)`; min-width 0; padding (4) `var(--_spacing---48)`; border radius `var(--_radius---24)`; background-color `var(--_colors---brand--paper)` | ✓ |
| | medium | flex-grow 0; flex-shrink 0; flex-basis auto; align-self stretch | ✓ |
| | tiny | padding (4) `var(--_spacing---24)` | ✓ |
| **Book Step** | main | display flex; align-items flex-start; row-gap, column-gap `var(--_spacing---24)` | ✓ |
| | tiny | row-gap, column-gap `var(--_spacing---16)` | ✓ |
| **Book Step Icon** | main | flex-grow 0; flex-shrink 0; flex-basis auto; display flex; align-items center; justify-content center; width, height `var(--_layout---service-icon--size)`; border width `var(--_spacing---hairline)` solid `var(--_colors---ink-tint--ink-12)`; border radius `var(--_radius---12)`; background-color `var(--_colors---service-tint--yellow)`; color `var(--_colors---brand--ink)` | ✓ |
| **Book Step Glyph** | main | font-size `var(--_typography-scale---size--20)`; line-height 1 | ✓ |
| **Book Step Text** | main | display flex; flex-grow 1; flex-shrink 1; flex-basis 0%; flex-direction column; row-gap, column-gap `var(--_spacing---8)`; min-width 0; padding-top `var(--_spacing---8)` | ✓ |
| **Book Step Title** | main | margin 0; font-size `var(--_typography-scale---size--20)`; font-weight `var(--_typography-scale---weight--medium)`; letter-spacing `var(--_typography-scale---letter-spacing--snug)`; line-height `var(--_typography-scale---line-height--compact)` | ✓ |
| **Book Step Body** (on a Rich Text) | main | margin 0; color `var(--_colors-semantic---text--secondary)`; line-height `var(--_typography-scale---line-height--comfortable)` | ✓ |
| **Book Media** (NEW, proposal B2 — only if approved) | main | display flex; flex-grow 1; flex-shrink 1; flex-basis 0%; min-width 0 | ✓ |
| | medium | flex-grow 0; flex-shrink 0; flex-basis auto; align-self stretch | ✓ |

After creating, re-check `styleNames` on a test import before the real
one: the importer drops a whole class list when one class is missing.

### 1.3 Classes the template does NOT need from the prototype

`is-loading` (html class, script-set), `skip-link`, `g-*` (shell
component), `w-variant-*`, `w-richtext`, `breadcrumb is-static` and
`page-head*` (Services index, a different page).

### 1.4 Repo CSS (not Webflow; for the repo session) — B6

Port from `prototype/src/css/new-classes-service.css` into
`wf-tvs/src/styles.css` with raw fallbacks (GOTCHAS 2026-11-12 "Repo CSS
reads Webflow variable names"), then `pnpm build` and commit `dist/`:

```css
/* repo-css: designer-cant — CSS counters and ::before. Each Service Item is
   numbered 01, 02… within its group (a CMS list can't number its items). */
.help-items { counter-reset: help-item; }
.help-item { counter-increment: help-item; }
.help-item-title::before { content: counter(help-item, decimal-leading-zero); flex: none; color: var(--_colors---brand--accent, #1c1ce6); font-size: var(--_typography-scale---size--14, .875em); letter-spacing: 0; }

/* repo-css: designer-cant — @keyframes; descendant hover. */
@keyframes live-pulse { 0% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--_colors-semantic---status--success, #1a7f4b) 60%, transparent); } 100% { box-shadow: 0 0 0 var(--_spacing---8, .5em) color-mix(in srgb, var(--_colors-semantic---status--success, #1a7f4b) 0%, transparent); } }
@media (prefers-reduced-motion: no-preference) {
  .live-dot { animation: live-pulse 1.6s ease-out infinite; }
  .phone-card:hover .phone-well, .phone-card:focus-visible .phone-well { animation: phone-ripple 1.1s ease-out infinite; }
  .phone-card:hover .phone-well-icon, .phone-card:focus-visible .phone-well-icon { animation: phone-shake 0.7s ease-in-out; transform-origin: 50% 50%; }
}
```

(Fallbacks are the values already used elsewhere in `src/styles.css`;
`phone-ripple` / `phone-shake` already exist there.)
The display/align/gap of `.help-item-title` go in the Designer (§1.2),
not here.

## 2. Components

### 2.1 Make from Home first (B4)

On **Home** (`6af4e2d97d259cb3efb2af6c`), `transform_element_to_component`
with `replace: true`:

| New component | Source element on Home | Group | Props |
| --- | --- | --- | --- |
| **Reviews** | `section#reviews` (Section Is Dark, with the slider, the Reviews Collection List and the review `<dialog>`) | Sections | none (same content everywhere) |
| **Locations** | `section#locations` (Section, S Wrapper Locations, the Locations Collection List) | Sections | none |

After the transform, read back on Home: both lists keep source, sort
(Sort order) and bindings; Home still publishes the same HTML (lessons:
"Collection List writes fail inside a slot or a component" — the lists are
already configured, so no writes are needed inside the component). The
review modal module finds its images by class (GOTCHAS), so the dialog
moving into a component is fine.

### 2.2 Instances on the template

| Where | Component | Props |
| --- | --- | --- |
| body, first child | **G \| Components** | — |
| body | **G \| Page W** (holds G \| Nav W, main slot, G \| Footer W) | Slot: the page sections (see MANUAL TBD-1) |
| How we can help › Help Head Intro, after the H2 | **C \| Button** | Label "Contact Us"; Link URL `/contact-us` (page link to Contact once that page exists); Color `base` (Primary); Size `base`; Icon After as on Home |
| FAQ › Faq Head Action | **C \| Button** | Label "Get in Touch"; Link URL `/contact-us`; Color `e13de0db-430f-b667-aee3-d545b7e6faea` (Secondary); Size `base` |
| after the FAQ section | **Reviews** (new) | — |
| after Reviews | **Locations** (new) | — |

C | Button prop ids: Label `8d3fce21…`, Link `67b926ae…`, Color
`a86542c6-5252-d5d3-c097-8375248c135b`, Size
`06aa6257-5dae-3b7b-75dd-7cae37a04c88` (set with
`set_component_instance_prop_values`, `type: "string"`, the variant id).
`insert_component_instance` can't anchor on an instance: append to the
parent.

No other new component. The FAQ section is built in-page (its list
filter differs from Home's Show on home); copy Home's FAQ item structure
(§3.5). Hero, How we can help and When to book appear on this template
only.

## 3. WHTML markup

Rules applied: no `style`, no `w-*`, no `data-field`/`data-collection`
(see §4), buttons as `<i data-wftag="button">`, `<span>` only where
nothing binds, Remix icons imported **with their Webflow class only**
(add the `ri-…` class after the import, table below), one root element
per action, max 5 actions per call.

**Icons — after the import,** `set_attributes` `class` on each DOM `<i>`
(document order), then remove any stray `ri-*` combo the import made
(`remove_style`, deepest first; lessons 2026-10-28):

| Element | class to set |
| --- | --- |
| Breadcrumb Icon | `breadcrumb-icon ri-home-2-line` |
| Breadcrumb Sep ×2 | `breadcrumb-sep ri-arrow-right-s-line` |
| Phone Well Icon (in the phone card) | `phone-well-icon ri-phone-fill` |
| Hero Bar Icon 1–4 | `hero-bar-icon ri-footprint-line` · `ri-file-list-3-line` · `ri-time-line` · `ri-heart-line` |
| Book Step Glyph 1–4 | `book-step-glyph ri-stethoscope-line` · `ri-syringe-line` · `ri-calendar-check-line` · `ri-pulse-line` |
| Faq Toggle Icon | `faq-toggle-icon ri-add-line` |

**Rich Text placeholders** carry `data-pack-rt="<field slug>"`. For each:
build a `RichText` with `data_element_builder` beside it with the same
class, bind `richText` to the field (the binding replaces the sample
content on publish), remove the placeholder (lessons 2026-10-15).

**Images** come in without an asset and lose every attribute. All four on
this page are CMS-bound (§4), so no static asset is needed. Set Load:
Eager on the hero photo; Lazy elsewhere.

Content below is Diagnostics, so the canvas reads like the prototype
before binding.

### 3.0 Shell

The template body is empty. Insert G | Components and G | Page W, then
get one plain element into the slot (MANUAL TBD-1, or the helper-component
trick in lessons/mcp.md 2026-10-29), and import every section below
`before`/`after` that anchor, in page order. Remove the anchor last.

### 3.1 Service Hero

```html
<section class="section is-tint service-hero">
  <div class="service-hero-panel">
    <nav class="breadcrumb" aria-label="Breadcrumb">
      <a class="breadcrumb-link" href="/" aria-label="Home"><i class="breadcrumb-icon" aria-hidden="true"></i></a>
      <i class="breadcrumb-sep" aria-hidden="true"></i>
      <a class="breadcrumb-link" href="/services">Services</a>
      <i class="breadcrumb-sep" aria-hidden="true"></i>
      <div class="breadcrumb-current" aria-current="page">Diagnostics</div>
    </nav>
    <div class="service-hero-copy">
      <div class="service-hero-text">
        <h1 class="d1">Pet bloodwork, X-rays &amp; ultrasound in Toronto</h1>
        <div class="service-hero-lead-box">
          <div class="service-hero-lead" data-pack-rt="hero-intro-2"><p>When your pet is unwell or due for a health check, diagnostic testing can help guide their care. TVS offers bloodwork, X-rays, ultrasound and other tests, with recommendations based on your pet’s symptoms, medical history and examination.</p></div>
        </div>
      </div>
      <div class="service-hero-contact">
        <p class="service-hero-note">Call or text your preferred hospital to arrange a visit.</p>
        <div class="phone-cards">
          <a class="phone-card" href="tel:+14165467493">
            <div class="phone-card-text">
              <div class="phone-card-label">North York</div>
              <div class="phone-card-number">(416) 546-7493</div>
            </div>
            <div class="phone-well"><i class="phone-well-icon" aria-hidden="true"></i></div>
          </a>
        </div>
      </div>
    </div>
  </div>
  <div class="service-hero-media"><img class="service-hero-photo" src="" alt=""></div>
</section>
```

Then: turn `.phone-cards` into a Locations Collection List (§4.2), and
remove the custom `href` attribute the importer leaves on every link
(GOTCHAS 2026-11-13). The Home link: set a page link to Home (so it can
be Current). `/services`: keep a URL link until the Services index page
exists.

### 3.2 Hero bar (marquee)

```html
<section class="section service-bar-section" aria-label="At a glance">
  <div class="hero-bar">
    <div class="draggable-marquee" data-draggable-marquee-init="" data-direction="left" data-duration="30" data-multiplier="35" data-sensitivity="0.01">
      <div class="draggable-marquee__collection" data-draggable-marquee-collection="">
        <div class="draggable-marquee__list" data-draggable-marquee-list="">
          <div class="hero-bar-item"><i class="hero-bar-icon" aria-hidden="true"></i><div class="hero-bar-text">Cats &amp; Dogs</div></div>
          <div class="hero-bar-divider"></div>
          <div class="hero-bar-item"><i class="hero-bar-icon" aria-hidden="true"></i><div class="hero-bar-text">Tailored testing plans</div></div>
          <div class="hero-bar-divider"></div>
          <div class="hero-bar-item"><i class="hero-bar-icon" aria-hidden="true"></i><div class="hero-bar-text">Open 7 days a week</div><div class="live-dot" aria-hidden="true"></div></div>
          <div class="hero-bar-divider"></div>
          <div class="hero-bar-item"><i class="hero-bar-icon" aria-hidden="true"></i><div class="hero-bar-text">Caring for pets since 2009</div></div>
          <div class="hero-bar-divider"></div>
        </div>
      </div>
    </div>
  </div>
</section>
```

Empty `data-*=""` values: check they publish (Webflow strips empty
booleans on DOM elements, lessons 2026-10-06); if any is gone, compare
with the Home hero bar's attributes and copy what Home has.

### 3.3 How we can help

```html
<section class="section" id="how-we-can-help">
  <div class="s-wrapper help">
    <div class="help-head">
      <div class="help-head-intro">
        <div class="eyebrow"><div class="eyebrow-dot"></div><div class="eyebrow-text">Diagnostics at TVS Animal Hospitals</div></div>
        <h2 class="d2">How we can help</h2>
      </div>
      <div class="help-head-text" data-pack-rt="how-we-can-help-intro-2"><p>Pet diagnostics help us investigate symptoms, check health before anesthesia and monitor ongoing conditions. Your veterinarian will explain what bloodwork, imaging or other tests may tell us, what preparation is needed and whether samples or images need outside laboratory analysis or review.</p></div>
    </div>
    <div class="help-groups">
      <div class="help-group">
        <h3 class="help-group-title">Laboratory testing</h3>
        <div class="help-items" data-reveal-stagger="">
          <div class="help-item">
            <h4 class="help-item-title">Pet bloodwork</h4>
            <div class="help-item-body" data-pack-rt="body-2"><p>Pet bloodwork assesses blood cells, organ function, blood sugar and electrolytes.</p></div>
          </div>
        </div>
      </div>
      <div class="help-group is-2">
        <h3 class="help-group-title">Diagnostic imaging</h3>
        <div class="help-items" data-reveal-stagger="">
          <div class="help-item">
            <h4 class="help-item-title">Pet X-rays</h4>
            <div class="help-item-body" data-pack-rt="body-2"><p>Pet X-rays use digital imaging to assess bones, joints, the chest and parts of the abdomen.</p></div>
          </div>
        </div>
      </div>
      <div class="help-group is-3">
        <h3 class="help-group-title">Group 3 title</h3>
        <div class="help-items" data-reveal-stagger="">
          <div class="help-item">
            <h4 class="help-item-title">Service item</h4>
            <div class="help-item-body" data-pack-rt="body-2"><p>Body.</p></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
```

Then: insert the C | Button "Contact Us" into Help Head Intro (§2.2);
turn each `.help-items` into a Service Items Collection List (§4.3). The
eyebrow's "Diagnostics" becomes the Name field inline (MANUAL TBD-2).

### 3.4 When to book

```html
<section class="section is-tint" id="when-to-book">
  <div class="s-wrapper book">
    <div class="book-intro">
      <div class="eyebrow"><div class="eyebrow-dot"></div><div class="eyebrow-text">Diagnostics at TVS Animal Hospitals</div></div>
      <h2 class="d2">When your pet may need diagnostic testing</h2>
      <div class="section-head-text" data-pack-rt="when-to-book-intro"><p>Diagnostic testing may be recommended for new symptoms, before a planned procedure or to track health changes over time. The choice of blood tests, pet X-rays or ultrasound depends on the question we need to answer; not every pet needs every test.</p></div>
      <img class="book-image" src="" alt="">
    </div>
    <div class="book-card" data-reveal-stagger="">
      <div class="book-step">
        <div class="book-step-icon"><i class="book-step-glyph" aria-hidden="true"></i></div>
        <div class="book-step-text">
          <h3 class="book-step-title">New symptoms or an unexplained lump</h3>
          <div class="book-step-body" data-pack-rt="step-1-body-2"><p>Changes in appetite, thirst, weight or energy may need investigation. Testing can also help assess vomiting, limping or a lump found during an examination.</p></div>
        </div>
      </div>
      <div class="book-step">
        <div class="book-step-icon is-green"><i class="book-step-glyph" aria-hidden="true"></i></div>
        <div class="book-step-text">
          <h3 class="book-step-title">Before surgery or dental treatment</h3>
          <div class="book-step-body" data-pack-rt="step-2-body-2"><p>Bloodwork and other tests before pet surgery or dental treatment help identify health concerns that may affect anesthesia or care.</p></div>
        </div>
      </div>
      <div class="book-step">
        <div class="book-step-icon is-violet"><i class="book-step-glyph" aria-hidden="true"></i></div>
        <div class="book-step-text">
          <h3 class="book-step-title">Routine screening as your pet ages</h3>
          <div class="book-step-body" data-pack-rt="step-3-body-2"><p>Screening during a pet wellness exam can establish a health baseline and help identify changes over time.</p></div>
        </div>
      </div>
      <div class="book-step">
        <div class="book-step-icon is-pink"><i class="book-step-glyph" aria-hidden="true"></i></div>
        <div class="book-step-text">
          <h3 class="book-step-title">Monitoring a condition or medication</h3>
          <div class="book-step-body" data-pack-rt="step-4-body-2"><p>Follow-up tests help assess how a condition is progressing, how treatment is working and whether medication-related changes mean your pet’s care plan needs adjustment.</p></div>
        </div>
      </div>
    </div>
  </div>
</section>
```

`section-head-text` is the existing class (the prototype's
`<p class="section-head-text">`), now on a Rich Text; its paragraph margin
is 0 from the tag style.

#### 3.4b Travel variant — PROPOSAL, build only after the person approves (B2)

One extra block inside `.s-wrapper.book`, after `.book-card`, shown only
when Step 1 title is empty **and** When to book image is set; the
`.book-image` inside `.book-intro` then hides on that condition (it shows
only when Step 1 title is set). Result: intro left, image right.

```html
<div class="book-media"><img class="book-image" src="" alt=""></div>
```

### 3.5 FAQ

Before importing, read Home's FAQ (`query_elements` on Home, class Faq
Item) and mirror its exact element types and attributes (button tag,
`data-accordion-*`, which element holds `data-accordion`). The markup
below is the fallback, written from the prototype.

```html
<section class="section" id="faq">
  <div class="s-wrapper faq">
    <div class="faq-head">
      <div class="eyebrow"><div class="eyebrow-dot"></div><div class="eyebrow-text">FAQ</div></div>
      <h2 class="d2">Questions about diagnostic testing</h2>
      <div class="faq-head-action"></div>
    </div>
    <div class="faq-list" data-accordion="">
      <div class="faq-item" data-accordion-item="">
        <i data-wftag="button" class="faq-question" type="button" data-accordion-toggle=""><div class="faq-question-text">How do you decide which tests my pet needs?</div><div class="faq-toggle"><i class="faq-toggle-icon" aria-hidden="true"></i></div></i>
        <div class="faq-answer" data-accordion-panel="">
          <div class="faq-answer-inner" data-pack-rt="answer"><p>We start with your pet’s symptoms, medical history and examination.</p></div>
        </div>
      </div>
    </div>
  </div>
</section>
```

Then: `set_tag` button on the stand-in and `remove_attribute
data-wftag`; insert the C | Button "Get in Touch" (Secondary) into Faq
Head Action; turn the list into an FAQs Collection List (§4.4).
`data-accordion-open` (first item open in the prototype) can't sit on one
CMS item; do what Home does.

### 3.6 Reviews, Locations

Component instances (§2), appended after the FAQ section in that order.

## 4. CMS bindings

Template page item = the current Service. Keys: text `text`, image
`assetId` + `altText` (from the image field's alt), rich text
`richText`, link `link`.

### 4.1 Page fields (Services, current item)

| Element | Field slug | Notes |
| --- | --- | --- |
| Breadcrumb Current | `name` | Text Block (`div`), so it binds |
| H1 `.d1` | `hero-h1` | |
| Service Hero Lead (RichText) | `hero-intro-2` | |
| Service Hero Photo | `hero-photo` | alt from the field (all 10 have alt) |
| Hero Bar Text 1–4 | `marquee-1` … `marquee-4` | the module clones the list, so clones read the bound text |
| Eyebrow Text (×2, How we can help and When to book) | `name` inline + static " at TVS Animal Hospitals" | MANUAL TBD-2 |
| H2 in How we can help | `how-we-can-help-heading` | |
| Help Head Text (RichText) | `how-we-can-help-intro-2` | |
| Help Group Title 1/2/3 | `group-1-title` / `group-2-title` / `group-3-title` | |
| H2 in When to book | `when-to-book-heading` | |
| Section Head Text (RichText) in Book Intro | `when-to-book-intro` | |
| Book Image (and Book Media's image, B2) | `when-to-book-image` | empty on all items (B1) |
| Book Step Title 1–4 | `step-1-title` … `step-4-title` | |
| Book Step Body 1–4 (RichText) | `step-1-body-2` … `step-4-body-2` | |
| FAQ H2 | `faq-heading` | |
| Page SEO title / description / OG image | `meta-title` / `meta-description` / `open-graph-image` | MANUAL TBD-8 |

### 4.2 Hero phone cards — Collection List of **Locations** (`6af7416f18d49df547956a48`)

- Wrapper/list/item: list class Phone Cards, item class Phone Cards Item;
  the Link Block Phone Card inside the item.
- Sort: `[{"fieldSlug": "sort-order", "direction": "ascending"}]`. No filter (both clinics).
- Phone Card link → `phone` (tel:). Then `remove_attribute href`.
- Phone Card Label → `nav-label` (B3; prototype used `area-label`).
- Phone Card Number → `phone` as text: the API binds a Phone field only
  to a link → MANUAL TBD-3 (as Home row R).
- Build with the Home pattern (lessons/mcp.md › Home Collection Lists):
  list at body, `source` → sort (one key per call) → classes/hooks → move
  the static card into the item → bind → move into `.service-hero-contact`
  → remove the static `.phone-cards`.

### 4.3 How we can help — three Collection Lists of **Service Items** (`6af7416fcdd3cc05a0937bc5`)

One per Help Group, replacing each static `.help-items`:

| List | Filter | Sort |
| --- | --- | --- |
| Group 1 | `service` = Current Service **and** `group` equals option `83c81beb73e5ee37f304d2a84a07cb66` (Group 1) | `sort-order` ascending |
| Group 2 | `service` = Current Service **and** `group` = `9935a37614aec31427f073dac6ba7b43` | `sort-order` ascending |
| Group 3 | `service` = Current Service **and** `group` = `fdc17d68db3bfc3c3f11df13566d2c3d` | `sort-order` ascending |

- DynamoList class Help Items + `data-reveal-stagger` (attribute, empty or
  as on Home); DynamoItem class Help Item.
- Help Item Title → `name`; Help Item Body (RichText) → `body-2`.
- The Option filter shape the API takes: `{"fieldSlug": "group",
  "operator": "equals", "value": "<option id>"}`. "Service = Current
  Service" on a Reference: try it by API; if it is refused or reads back
  `[]`, it is MANUAL TBD-4. Write `source` → `sort` → filters, one key per
  call, filters last (lessons 2026-10-29).
- Empty states: remove the "No items found" block or hide it (the group
  hides by its own condition below).

Data check (2026-11-13): Group 1 is used by all 10 services, Group 2 by
Surgery, Vaccinations, Parasite Prevention, Diagnostics; Group 3 by
Surgery only. Group 2/3 always have a title when they have items; Group 1
title is empty on 6 services (Urgent Care, Dental, Spay & Neuter,
Wellness, Travel, Allergy).

### 4.4 FAQ — Collection List of **FAQs** (`6af7417157d20297cd3ddbd7`)

- Filter `service` = Current Service (MANUAL TBD-4 if the API refuses);
  sort `sort-order` ascending.
- Classes/hooks as Home's FAQ (Faq List + `data-accordion` on the
  wrapper per the 2026-11-13 Home notes; Faq Item on the item with
  `data-accordion-item`).
- Faq Question Text → `name` (the Question); Faq Answer Inner (RichText)
  → `answer`.

### 4.5 Conditional visibility (all Designer, MANUAL TBD-5)

| Element | Show when |
| --- | --- |
| Help Group Title (group 1) | `group-1-title` is set |
| Help Group Is 2 (whole group) | `group-2-title` is set |
| Help Group Is 3 (whole group) | `group-3-title` is set |
| Book Card | `step-1-title` is set |
| Book Step 2 / 3 / 4 | `step-2/3/4-title` is set |
| Book Image (in Book Intro) | `when-to-book-image` is set (and, with B2, `step-1-title` is set) |
| Book Media (B2 only) | `step-1-title` is not set **and** `when-to-book-image` is set |

## 5. Manual Designer steps (new MANUAL-TODO rows; the builder assigns letters from T)

| ID | Where | Breakpoint | Set | Why the API can't |
| --- | --- | --- | --- | --- |
| TBD-1 | Services Template › G \| Page W › main slot | — | Drop one plain element into the empty slot (or the builder uses the helper-component trick, lessons 2026-10-29); the API imports the sections after it | The API can't start a slot's content (as row K) |
| TBD-2 | Services Template › both Eyebrow Text ("… at TVS Animal Hospitals") | — | Edit the text, replace "Diagnostics" with the inline field Name (Insert field), keep " at TVS Animal Hospitals" | Inline field in mixed text; a Span can't take a text binding (GOTCHAS) |
| TBD-3 | Services Template › Phone Cards › Phone Card Number | — | Bind the text to Locations › Phone | A Phone field binds only to a link through the API (as row R) |
| TBD-4 | Services Template › Help Items lists ×3 and the FAQs list › Filters | — | Service = Current Service (plus Group = Group 1/2/3 on the three help lists if the API refused that too) | Only if the API refuses or reads back `[]`; "current item" filters are Designer-only so far |
| TBD-5 | Services Template › Help Group Title (1), Help Group Is 2, Help Group Is 3, Book Card, Book Steps 2–4, Book Image (+ Book Media) | — | Conditional visibility per §4.5 | The API has no conditional visibility |
| TBD-6 | Phone Card › Hover and Pressed › Box shadow; Phone Card › Transitions | Desktop | Bind the shadow to Hairline / Spacing/2 and Ink Tint 24 (literals are in); add Transition box-shadow 200ms ease | A shadow with variables is stored as one binding; `transition` is Designer-only |
| TBD-7 | Help Item Body (Rich Text) › All Links, nested | Desktop | Colour Brand/Accent, underline; hover Brand/Ink (temporary unbound Rich Text trick, lessons 2026-10-15) | Nested rich-text link styles aren't in the API |
| TBD-8 | Services Template › Page settings › SEO and Open Graph | — | Title = Meta title, Description = Meta description, OG image = Open Graph image (fall back to the site default); OG title/description copy SEO | Template SEO field bindings are Designer-only |
| TBD-9 | Breadcrumb Link (Home link) | — | If the API can't set a page link: Link settings › Page › Home | Only if `set_settings link` with a page is refused |

## 6. Check list (after the import)

Compare staging `/services/diagnostics` with the prototype
`http://localhost:5955/services/diagnostics/` at **1440, 991, 767, 479**
(`pnpm wf:compare` / screenshots), then spot-check the variants:

1. **Classes:** every imported element has its full class list
   (`styleNames`); no `inline-div-*`, no stray empty `ri-*` combos, no
   `w-variant` leftovers. Run the style-guide class check (new classes
   need specimens: Service Hero, Phone Card, Help Group, Book Step,
   Breadcrumb, Live Dot, Phone Cards Item).
2. **Variables:** the seven P23 variables exist with the exact CSS names;
   computed values at 1440: hero min-height 700px, photo column 540px,
   phone card 340px, help intro 480px, book intro 516px.
3. **Hero (1440):** breadcrumb 40px from the top and aligned with the
   section padding; H1 / lead / note / two phone cards; photo fills the
   right column; tint background. **991:** photo above (384px high), copy
   below, breadcrumb at 32px. **479:** phone cards full width, lead 16px.
4. **Phone cards:** two cards (North York first), numbers as text, `tel:`
   hrefs with no leftover custom `href` attribute; label shows the field
   chosen in B3; hover ring and well animation (after the repo CSS, B6).
5. **Marquee:** four bound texts, icons, live dot pulsing (repo CSS),
   drag works, it loops without a gap.
6. **How we can help:** Diagnostics shows Group 1 "Laboratory testing" (4
   items, blue tint) and Group 2 "Diagnostic imaging" (2 items, green);
   Group 3 hidden. Items numbered 01–04 and 01–02 (restart per group).
   Two columns at 1440/991, one at 767/479; body indent 40px, none at
   767. Inline links in bodies (e.g. "intestinal parasites") are blue,
   underlined. Contact Us button is Primary.
7. **Variants:** `/services/surgery` shows 3 titled groups (Is 2 green,
   Is 3 yellow); `/services/urgent-care` one untitled group (no empty
   heading gap); `/services/allergy-testing` one untitled group.
8. **When to book:** four steps with fixed icons and tints (yellow,
   green, violet, pink); step bodies' links work; image shows on
   Diagnostics once B1 is filled, and is hidden (no empty box) elsewhere.
   991: card under the intro, full width. 479: card padding 24px.
   `/services/travel-certificate`: no steps card; layout per B2.
9. **FAQ:** only Diagnostics' FAQs (7), sorted; accordion opens/closes,
   answers' paragraphs and links render; "Get in Touch" is Secondary.
10. **Reviews / Locations:** instances render as on Home (slider arrows,
    review modal opens and closes, clinic cards bound); Home unchanged
    after the transform.
11. **SEO:** `<title>` = Meta title ("Pet Diagnostics: Bloodwork, X-Rays
    & Ultrasound | TVS Animal Hospitals" on Diagnostics), meta
    description and OG image per item.
12. **Published HTML:** no `data-pack-rt`, no `data-wftag`, no
    `data-manual-todo` left; one `<h1>`; heading order h1 → h2 → h3 → h4;
    breadcrumb `aria-current="page"` kept.
13. Console: no module errors (marquee, reveal, accordion, slider,
    review-modal).
