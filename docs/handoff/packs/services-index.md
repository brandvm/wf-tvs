# Import pack — Services index (`/services`)

Prepared 2026-11-13 by a read-only prep session. Nothing here has been
written to Webflow. For the Webflow build session (the only writer).

- Prototype: `prototype/services/index.html` (http://localhost:5955/services/).
  No Figma frame: a Page Head plus four shared sections.
- Live: a **static page** `Services` (slug `services`) sits beside the
  Services collection (`/services/{slug}`) on the live Webflow site, so the
  same pair works here: a static page at `/services`, the collection
  template keeps `/services/<item>`.
- New build (read 2026-11-13): no `services` static page yet; pages Home
  `6af4e2d97d259cb3efb2af6c`, Services Template `6af7416e0fddcc8540377132`.

Page order (inside G | Page W's slot, as on Home):

| # | Section | How |
| --- | --- | --- |
| 1 | Page Head (breadcrumb, H1, intro) | **WHTML import** (§3) — new classes (§1) |
| 2 | Services (tiles + "We have more to offer" banner) | **new component `Services`**, made from Home's `#services` section (§2) |
| 3 | Why Choose | existing component `Why Choose`, no props |
| 4 | Reviews (slider + review modal) | **new component `Reviews`**, made from Home's `#reviews` section (§2) |
| 5 | CTA | existing component `CTA`, props at their defaults (§2) |

---

## 1. Classes to create first

Read back 2026-11-13 (`query_styles`): **none of these exist.** Present
already: Section, Is Tint (`.section.is-tint`), S Wrapper, D1, Section Head
Text, Skip Link; the name "Is Static" exists as a combo on Nav Panel and
Call Chooser (a new combo on Breadcrumb is fine).

> **Breadcrumb classes are shared with the Services template pack**
> (`pack-services-tpl`, `new-classes-service.css` lines 18–25, 98) and the
> blog post pack (`.post-head-text .breadcrumb.is-static`). Create them
> once, in whichever import runs first; before creating, `query_styles
> name_path ["breadcrumb"]` and skip any that exist.

Values are `var(--…)` strings: the style API stores a value that is exactly
`var(--name)` as a variable binding (GOTCHAS 2026-11-12). All variables
below exist (P1–P22). Breakpoints: `main` = desktop, `medium` = 991.

| Class (Webflow name) | Kind / parents | Breakpoint · state | Properties |
| --- | --- | --- | --- |
| Page Head | combo on **Section › Is Tint** (selector `.section.is-tint.page-head`; prototype writes `.section.page-head`) | main | `padding-top: var(--_spacing---48)` · `padding-bottom: var(--_spacing---64)` |
| Page Head Inner | combo on **S Wrapper** (`.s-wrapper.page-head-inner`) | main | `align-items: flex-start` · `grid-row-gap: var(--_spacing---20)` · `grid-column-gap: var(--_spacing---20)` |
| Breadcrumb | global | main | `position: absolute` · `top: var(--_spacing---40)` · `left: var(--_layout---section--padding-h)` · `display: flex` · `align-items: center` · `grid-row-gap` / `grid-column-gap: var(--_spacing---8)` |
| Breadcrumb | global | medium (991) | `top: var(--_spacing---32)` |
| Is Static | combo on **Breadcrumb** (`.breadcrumb.is-static`) | main | `position: static` · `margin-bottom: var(--_spacing---24)` |
| Breadcrumb Link | global | main | `display: flex` · `align-items: center` · `color: var(--_colors---brand--accent)` · `font-size: var(--_typography-scale---size--14)` · `line-height: var(--_typography-scale---line-height--compact)` · `text-decoration: none` |
| Breadcrumb Link | global | main · hover | `color: var(--_colors---brand--ink)` |
| Breadcrumb Link | global | main · active | `color: var(--_colors---ink-tint--ink-64)` |
| Breadcrumb Icon | global | main | `font-size: var(--_typography-scale---size--16)` · `line-height: 1` |
| Breadcrumb Sep | global | main | `color: var(--_colors---ink-tint--ink-48)` · `font-size: var(--_typography-scale---size--14)` · `line-height: 1` |
| Breadcrumb Current | global | main | `color: var(--_colors---ink-tint--ink-64)` · `font-size: var(--_typography-scale---size--14)` · `line-height: var(--_typography-scale---line-height--compact)` |

Notes:
- Create Page Head with `parent_style_names: ["Section", "Is Tint"]`, Page
  Head Inner with `["S Wrapper"]`, Is Static with `["Breadcrumb"]`.
- Breadcrumb's absolute base (top/left) is for the Service and Location
  heroes; on this page Is Static turns it off. Include the base anyway so
  the class is right for every page.
- The prototype has **no** 767/479 rules for Page Head or the breadcrumb;
  the Section/S Wrapper paddings and the D1/Section Head Text type already
  step down through the breakpoint modes.
- `is-home` in the prototype markup has no styles anywhere: it is left out
  of the import (a missing class would drop the link's whole class list).
- Font sizes sit on text elements only (Breadcrumb Link/Icon/Sep/Current),
  per the HANDOFF rule.

## 2. Components

| Component | Exists? | Props on this page | Notes |
| --- | --- | --- | --- |
| G \| Components | yes `de3173b4…` | — | directly under body, as on Home |
| G \| Page W | yes `280bc82e…` | Slot ← the five sections | as on Home (MANUAL-TODO K: a slot's content can't be started by API — see TBD-1) |
| Services | **no — make it** | none | Home's `#services` section (`Section` + `Is Tint`, element `8eb47158-d716-df54-67fc-8a81d11f205d` on 2026-11-13; re-query by `attribute id=services`): `transform_element_to_component`, name `Services`, group `Sections`, `replace: true`, description "Ten service tiles from the Services collection (sorted by Sort order) and the 'We have more to offer' banner with the dog cut-out. Used on Home and the Services index." |
| Why Choose | yes `d7aa4dec…` | none | |
| Reviews | **no — make it** | none | Home's `#reviews` section (`Section` + `Is Dark`, element `7388943e-1508-4d3f-8986-2418c927fb43`; re-query by `attribute id=reviews`), including the Review Modal `<dialog>` inside it. Name `Reviews`, group `Sections`, description "Reviews slider (module slider) with the review modal (module review-modal); Reviews collection by Sort order. Used on Home, the Services index and the service and location templates." **Shared with pack-services-tpl and pack-locations-tpl: make it once.** |
| CTA | yes `25dab600…` | Heading "Ready when your pet needs you" · Text "A routine checkup or something that can’t wait: book online, or call or text the clinic nearest you. Both are open seven days a week." · Button label "Get in Touch" · Button link `/contact-us` | all = the defaults; leave them unset |

Order for the two new components: transform on **Home** first (Home then
holds an instance in place of the section), check Home renders the same,
then insert instances on the new page. The Services list keeps its sort
and the tile conditions/bindings from MANUAL-TODO N–R (they live inside
the section that becomes the component). The Services section's
`id="services"` and Reviews' `id="reviews"` attributes travel with the
component; each appears once per page, so no duplicate ids.

Not used here: Section Head (component, 0 instances) — the Page Head is
an H1 block of its own, not a section head.

## 3. WHTML markup (Page Head only)

Importer-safe: no `<span>`, `<button>`, `<img>` or `style` attributes;
every class exists after §1; the Remix glyphs are plain `<i>` inside a
div that carries the Webflow class (so Breadcrumb Icon / Sep count as
used — a Webflow class written inside an `<i>`'s literal class attribute
does not, GOTCHAS 2026-11-12). The breadcrumb is imported as a `div` and
its tag set to `nav` afterwards.

```html
<section class="section is-tint page-head">
  <div class="s-wrapper page-head-inner">
    <div class="breadcrumb is-static" aria-label="Breadcrumb">
      <a class="breadcrumb-link" href="/" aria-label="Home"><div class="breadcrumb-icon"><i class="ri-home-2-line" aria-hidden="true"></i></div></a>
      <div class="breadcrumb-sep"><i class="ri-arrow-right-s-line" aria-hidden="true"></i></div>
      <div class="breadcrumb-current" aria-current="page">Services</div>
    </div>
    <h1 class="d1">Pet care services in Toronto</h1>
    <p class="section-head-text">Urgent care, surgery, dental, spay and neuter, wellness, vaccinations and more, at both our North York and Parliament animal hospitals. Open 7 days.</p>
  </div>
</section>
```

After the import:
1. Breadcrumb block → tag `nav` (Block setting `tag`). If the API refuses,
   Designer step TBD-2.
2. Breadcrumb Link → `set_link` linkType `page`, link = Home
   `6af4e2d97d259cb3efb2af6c`; then `remove_attribute href` (GOTCHAS
   2026-11-13: the importer keeps the source href as a custom attribute).
3. Read back `aria-label` on the nav and the link, `aria-current` on
   Breadcrumb Current, `aria-hidden` on both `<i>`; re-add with
   `set_attributes` if dropped.
4. `styleNames` on every element: Section/Is Tint/Page Head, S Wrapper/
   Page Head Inner, Breadcrumb/Is Static, Breadcrumb Link, Breadcrumb
   Icon, Breadcrumb Sep, Breadcrumb Current, D1, Section Head Text. A
   missing list means a class was missing at import: create it, re-import.
5. Heading level is 1 (only H1 on the page: Services, Why Choose, Reviews
   and CTA use h2/h3).

Differs from the prototype DOM only by the two icon wrapper divs; the
look is the same (the glyph inherits the wrapper's size and colour).

## 4. CMS lists

No new lists. Both live inside the new components and are already set on
Home:

| List | Collection | Filter | Sort | Limit |
| --- | --- | --- | --- | --- |
| Service tiles (in Services) | Services `6af7416d0fddcc85403770d5` | — | Sort order, lowest first | none (all ten) |
| Review slider (in Reviews) | Reviews `6af7417257d20297cd3ddc5a` | — | Sort order (as on Home) | as on Home |

If a list loses its sort or source in the transform, or a sort write
returns "[Conflict] … component map", see GOTCHAS 2026-11-13 (all-draft
collections) and do it in the Designer (TBD-3).

## 5. SEO (from live, read only)

Live page `6a299fb18ca11e004bbbebeb`, read 2026-11-13:

| Field | Value |
| --- | --- |
| Page title (name) | `Services` |
| Slug | `services` (site root, no folder) |
| SEO title | `Pet Care Services in Toronto | TVS Animal Hospitals` |
| Meta description | `Explore veterinary services at TVS Animal Hospitals: urgent care, surgery, dental, spay and neuter, wellness, vaccinations and more. Open 7 days in Toronto.` |
| Open Graph | live: title/description **not copied and empty**, no image (the published page has no `og:` tags) |
| JSON-LD | none |
| Indexing | indexed (no robots meta); keep in the sitemap |

`create_page` with `site_id 6af4e2d97d259cb3efb2af71`, title `Services`,
slug `services`, `seo` as above. Open Graph: recommended
`titleCopied: true, descriptionCopied: true` (live leaves it empty, which
looks like an oversight); no image (falls back to the site default).
Change from live, by design: the H1 was "Services", now "Pet care
services in Toronto" (prototype, approved).

## 6. Manual Designer steps (new MANUAL-TODO rows)

Give them the next free letters when adding them (next free is **T** as
of MANUAL-TODO on 2026-11-13, unless another pack took it).

| ID | Where | Breakpoint | Set | Why the API can't | Done |
| --- | --- | --- | --- | --- | --- |
| TBD-1 | Services (new page) › G \| Page W › slot | — | Drag the imported Page Head and the Services, Why Choose, Reviews, CTA instances into G \| Page W's main slot, in that order (as K on Home). Skip if the builder can insert straight into the slot by API | The API can't start a slot's content (row K) | ☐ |
| TBD-2 | Services › Page Head › Breadcrumb block | — | Only if `tag: nav` is refused by the API: Element settings › Tag › `nav` | Conditional | ☐ |
| TBD-3 | Services component › Service tiles list; Reviews component › list | — | Only if the transform drops them: sort by Sort order (lowest first) | Sort writes can conflict on lists (GOTCHAS 2026-11-13) | ☐ |

No `data-manual-todo` markers needed: none of these rows changes how the
page looks once it is built.

## 7. Check list for the builder

After the import and publish to staging (`https://wf-tvs.webflow.io/services`):

- [ ] Home still renders as before with the Services and Reviews
      instances (tiles, icons in their Service colour, Learn more links,
      tags, slider buttons, review modal opens).
- [ ] Component list shows `Services` and `Reviews` (group Sections), 2
      instances each after this page.
- [ ] `/services` and `/services/<item>` both resolve (static page and
      collection template coexist).
- [ ] SEO title and description match §5; one `<h1>` ("Pet care services
      in Toronto"); page in the sitemap.
- [ ] Breadcrumb: `<nav aria-label="Breadcrumb">`, Home link goes to `/`
      with `aria-label="Home"`, no custom `href` attribute left, Services
      text has `aria-current="page"`; hover → ink, pressed → Ink 64.
- [ ] Page Head on the pale blue: 48px top / 64px bottom padding at
      1440, 20px between breadcrumb row, H1 and intro; breadcrumb static
      (not absolute) with 24px below it.
- [ ] Ten service tiles in Sort order; the banner's "View all Services"
      button links to `/services` (this page — as in the prototype).
- [ ] Why Choose, Reviews (Is Dark) and CTA as on Home; CTA marquee
      drags and reveals.
- [ ] `pnpm wf:compare /services` (or the side-by-side check) against
      http://localhost:5955/services/ at 1440, 991, 767, 479; no
      horizontal overflow (`wf:overflow`).
- [ ] Nav and footer links to `/services` ("All services", "View all
      services", footer "Services") point at the new page; switch any
      URL link to a page link so Current works (as row G).
- [ ] Breadcrumb Icon / Sep / Current / Link and Page Head classes get a
      row on the style guide's Class index (style guide rule), or are
      already covered by the Services template pack.
- [ ] No `data-manual-todo` left on the page.
