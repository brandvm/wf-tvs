# Import pack — Blog post template (`/blog/{slug}`)

Prepared 2026-11-13 by a read-only prep session (nothing was written to
Webflow). Source: prototype `prototype/blog/spaying-a-cat-age-and-recovery/index.html`
and `prototype/src/css/new-classes-blog.css` (sections "Post Top", "Post
Main", "Post Body", "Post Rail"); Figma 684:14697 (header 684:14722, body
684:14751, latest posts 684:15001).

Target page: **Blogs Template** `6af7417034f822e0c17f6906` (collection
Blogs `6af7417034f822e0c17f6900`, published path `/blog`). Site
`6af4e2d97d259cb3efb2af71`.

Read back from Webflow while preparing (2026-11-13):

- No `Post …` class exists. No `Breadcrumb …` class exists yet (shared
  with the Services index / Services template packs, see §1.1).
- Existing and reused: Section, S Wrapper, D2, D2 + Weight Regular,
  Eyebrow, Eyebrow Dot, Eyebrow Text, Theme Dark, Blog, S Wrapper + Blog,
  Blog Head, Blog Head Text, Blog Cards, Blog Card (+ Image, Meta,
  Category, Dot, Date, Title, Excerpt).
- Variables missing: Layout `Post/Body Width`, `Post/Rail Width`,
  `Post/Cover Width` and Radius `32` (prototype proposal P27,
  `prototype/src/css/proposed.css`). Every other variable the classes read
  exists (Spacing 2–96, Hairline, Radius 8/16/24/Pill, Size 10–28, Line
  Height Compact/Snug/Normal/Relaxed, Ink Tint 12/24/48/64, Blue 8, Mist,
  Text Primary/Secondary, Calc/FAQ Head Top, Phone Well/Size,
  Button/Height).
- CMS data (27 Blogs items): every item has Meta title, Meta description,
  Cover, Category, Date posted; **none** has Open Graph image, Cover alt,
  Author or Related service (the Authors collection is empty). 26 posts
  have H2s, 14 H3s, 15 body images, 7 numbered lists; none has a block
  quote or figcaption.

## 0. Order of work

| # | Part | How |
| --- | --- | --- |
| 1 | Variables P27 (if the Blog index pack hasn't made them) | API (§1.0) |
| 2 | Classes and combos | API (§1.1–1.4) |
| 3 | G \| Page W on the template (if absent) | `insert_component_instance` |
| 4 | Post Header + Post Main (rail) + Latest Blog Posts head | WHTML import (§3), then fix-ups (§3.4) |
| 5 | Content Rich Text (Post Body) | `data_element_builder` RichText, bind (§4) |
| 6 | Latest Blog Posts Collection List | build like Home's (§4.6) |
| 7 | CTA instance | `insert_component_instance` after the blog section |
| 8 | Bindings, page SEO | API where possible (§4, §5) |
| 9 | Designer steps | MANUAL-TODO rows TBD-1…TBD-9 (§7) |
| 10 | Repo CSS block | `src/styles.css`, a repo change (§1.5) |

## 1. Classes to create first

Breakpoint ids: `main` = desktop, `medium` = 991, `small` = 767,
`tiny` = 479. Values are written as `var(--<css name>)`, which binds the
variable (GOTCHAS 2026-11-12). Gaps are written as `grid-row-gap` and
`grid-column-gap` (the style API refuses variables on `row-gap` /
`column-gap`, `lessons/mcp.md` 2026-10-02). Font sizes sit on text
elements only (HANDOFF › Decisions 2026-11-12).

### 1.0 Variables (P27) — create only if missing

Check with `query_variables css_name: "post--"` and `"radius---32"` first;
the Blog index pack (`pack-blog-index`) needs the same P27 batch.

| Collection | Name | CSS name | Value (Base, every mode) |
| --- | --- | --- | --- |
| Layout | Post/Body Width | `--_layout---post--body-width` | 46.25em (740px) |
| Layout | Post/Rail Width | `--_layout---post--rail-width` | 18.75em (300px) |
| Layout | Post/Cover Width | `--_layout---post--cover-width` | 27.5625em (441px) |
| Radius | 32 | `--_radius---32` | 2em |

Check each create result's `name` for a suffix (GOTCHAS 2026-11-12).

### 1.1 Breadcrumb (shared; skip any that exist)

Defined in `packs/services-index.md` §1 with the same values (Breadcrumb,
Breadcrumb + Is Static, Breadcrumb Link with hover/active, Breadcrumb
Icon, Breadcrumb Sep, Breadcrumb Current). Whichever pack is imported
first creates them; `query_styles name_path ["breadcrumb"]` before
creating. The prototype's `is-home` combo has no styles and is dropped.
The post header needs one difference — the Is Static breadcrumb has no
bottom margin here — which is the repo rule in §1.5 (a descendant rule,
the Designer can't scope it).

### 1.2 Post Header (Figma 684:14722)

| Class | Kind | Breakpoint | Properties |
| --- | --- | --- | --- |
| Post Top | combo on **Section** | main | `padding-top: var(--_spacing---64)` · `padding-bottom: var(--_spacing---none)` |
| Post Top | combo on Section | small | `padding-top: var(--_spacing---40)` |
| Post Head | combo on **S Wrapper** | main | `flex-direction: row` · `align-items: stretch` · gap 24 (`grid-row-gap` / `grid-column-gap: var(--_spacing---24)`) · `padding-bottom: var(--_spacing---64)` · `border-bottom: var(--_spacing---hairline) solid` + `border-bottom-color: var(--_colors---ink-tint--ink-12)` |
| Post Head | combo on S Wrapper | medium | `flex-direction: column` · `align-items: flex-start` · gap 32 · `padding-bottom: var(--_spacing---48)` |
| Post Head | combo on S Wrapper | small | gap 24 |
| Post Head Text | global | main | `display: flex` · `flex-direction: column` · `justify-content: space-between` · gap 32 · `flex: 1 1 0` (grow 1, shrink 1, basis 0) · `min-width: 0` |
| Post Title Block | global | main | `display: flex` · `flex-direction: column` · `align-items: flex-start` · gap 24 |
| Post Chip | global | main | `display: flex` · `padding: var(--_spacing---8) var(--_spacing---16)` · `border-radius: var(--_radius---pill)` · `background-color: var(--_colors---blue-tint--blue-8)` · `color: var(--_colors---neutral--slate)` |
| Post Chip Text | global | main | `font-size: var(--_typography-scale---size--12)` · `font-weight: var(--_typography-scale---weight--medium)` · `letter-spacing: var(--_typography-scale---letter-spacing--wide)` · `line-height: var(--_typography-scale---line-height--compact)` · `text-transform: uppercase` |
| Post Meta | global | main | `display: flex` · `flex-wrap: wrap` · `align-items: center` · gap 16 |
| Post Author | global | main | `display: flex` · `align-items: center` · gap 16 |
| Post Avatar | global | main | `flex: none` (0 0 auto) · `display: flex` · `align-items: center` · `justify-content: center` · `overflow: hidden` · `width` / `height: var(--_layout---phone-well--size)` · `border-radius: var(--_radius---pill)` · `background-color: var(--_colors---brand--yellow)` · `color: var(--_colors---brand--ink)` |
| Post Avatar Image | global (**new**, not in the prototype: the Author Photo) | main | `display: block` · `width: 100%` · `height: 100%` · `object-fit: cover` |
| Post Avatar Text | global | main | `font-size: var(--_typography-scale---size--10)` · `font-weight: var(--_typography-scale---weight--medium)` · `line-height: 1` |
| Post Author Name | global | main | `font-size: var(--_typography-scale---size--15)` · `font-weight: var(--_typography-scale---weight--medium)` · `line-height: var(--_typography-scale---line-height--compact)` |
| Post Meta Dot | global | main | `flex: none` · `width` / `height: var(--_spacing---4)` · `border-radius: var(--_radius---pill)` · `background-color: var(--_colors---ink-tint--ink-24)` |
| Post Meta Text | global | main | `color: var(--_colors---ink-tint--ink-64)` · `font-size: var(--_typography-scale---size--15)` · `line-height: var(--_typography-scale---line-height--compact)` |
| Post Cover | global | main | `display: block` · `flex: none` · `width: var(--_layout---post--cover-width)` · `height: auto` · `aspect-ratio: 441 / 311` · `border-radius: var(--_radius---32)` · `object-fit: cover` |
| Post Cover | global | medium | `order: -1` · `width: 100%` · `max-width: var(--_layout---post--body-width)` |
| Post Cover | global | small | `border-radius: var(--_radius---24)` |

Notes:
- `aspect-ratio: 441 / 311` is a raw ratio, as the prototype; there is no
  ratio variable. If the style API refuses `aspect-ratio`, set it in the
  Designer (Size › Ratio › custom 441:311) — TBD-9.
- At 991 the prototype flattens Post Head Text with `display: contents`
  so the breadcrumb, cover and title can be reordered (breadcrumb, cover,
  title). The Designer has no `display: contents`: that part is repo CSS
  (§1.5).

### 1.3 Post Main and rail (Figma 684:14751)

| Class | Kind | Breakpoint | Properties |
| --- | --- | --- | --- |
| Post Main | combo on **Section** | main | `padding-top: var(--_spacing---80)` · `padding-bottom: var(--_spacing---96)` |
| Post Main | combo on Section | medium | `padding-top: var(--_spacing---64)` |
| Post Layout | combo on **S Wrapper** | main | `flex-direction: row` · `align-items: flex-start` · `justify-content: space-between` · gap 64 |
| Post Layout | combo on S Wrapper | medium | `flex-direction: column` · gap 48 |
| Post Rail | global | main | `position: sticky` · `top: var(--_layout---calc--faq-head-top)` · `display: flex` · `flex-direction: column` · gap 24 · `flex: 0 0 var(--_layout---post--rail-width)` (grow 0, shrink 0, basis Post/Rail Width) · `min-width: 0` |
| Post Rail | global | medium | `position: static` · `flex: none` · `width: 100%` · `max-width: var(--_layout---post--body-width)` |
| Post Rail Box | global | main | `display: flex` · `flex-direction: column` · gap 16 · `padding: var(--_spacing---24)` · `border: var(--_spacing---hairline) solid var(--_colors---ink-tint--ink-12)` · `border-radius: var(--_radius---16)` · `background-color: var(--_colors---neutral--mist)` |
| Post Rail Label | global | main | `color: var(--_colors---ink-tint--ink-64)` · `font-size: var(--_typography-scale---size--12)` · `font-weight: var(--_typography-scale---weight--medium)` · `letter-spacing: var(--_typography-scale---letter-spacing--wide)` · `line-height: var(--_typography-scale---line-height--compact)` · `text-transform: uppercase` |
| Post Share | global | main | `display: flex` · `flex-direction: column` · gap 12 |
| Post Share Buttons | global | main | `display: flex` · gap 8 |
| Post Share Button | global | main | `display: flex` · `align-items: center` · `justify-content: center` · `width` / `height: var(--_layout---button--height)` · `padding: 0` · `border: var(--_spacing---hairline) solid var(--_colors---ink-tint--ink-12)` · `border-radius: var(--_radius---pill)` · `background-color: transparent` · `color: var(--_colors---brand--accent)` · `text-decoration: none` · `cursor: pointer` · transition background-color, border-color, color 200ms ease (Designer › Effects, TBD-8) |
| Post Share Button | global | main · hover | `border-color: var(--_colors---brand--accent)` · `background-color: var(--_colors---brand--accent)` · `color: var(--_colors---brand--paper)` |
| Post Share Button | global | main · active | `background-color: var(--_colors---brand--ink)` |
| Post Share Icon | global | main | `font-size: var(--_typography-scale---size--20)` · `line-height: 1` |
| Post Rail Card | global | main | `display: flex` · `flex-direction: column` · `align-items: flex-start` · gap 16 · `padding: var(--_spacing---24)` · `border-radius: var(--_radius---16)` (navy comes from the Theme Dark combo: `post-rail-card theme-dark` makes the combo Post Rail Card + Theme Dark on import; Theme Dark's own styles carry over) |
| Post Rail Card Text | global | main | `display: flex` · `flex-direction: column` · gap 10 |
| Post Rail Card Lead | global | main | `margin: 0` · `color: var(--_colors-semantic---text--secondary)` · `font-size: var(--_typography-scale---size--14)` · `line-height: var(--_typography-scale---line-height--normal)` |
| Post Rail Service | global (**new**, see §4.5) | main | `display: flex` · `flex-direction: column` · gap 4 · `align-self: stretch` · `padding-bottom: var(--_spacing---16)` · `border-bottom: var(--_spacing---hairline) solid` + `border-bottom-color: var(--_colors---ink-tint--ink-24)` · `color: var(--_colors-semantic---text--primary)` · `text-decoration: none` |
| Post Rail Service | global | main · hover | `color: var(--_colors---brand--yellow)` |
| Post Rail Service Name | global (**new**) | main | `font-size: var(--_typography-scale---size--18)` · `font-weight: var(--_typography-scale---weight--medium)` · `line-height: var(--_typography-scale---line-height--compact)` |

The rail's Post Rail Label is reused as the "Related service" label.
Check the Theme Dark combo reads right on Post Rail Card (navy fill,
Text/Secondary light); if the import publishes it as a bare class, see
`lessons/mcp.md` 2026-10-14 "An imported combo can publish as a bare
class".

Not created now (their markup waits for modules, §6): Post Toc, Post Toc
List, Post Toc Link (+ hover, + Is Current), Post Toc Text, Post Rail
Divider.

### 1.4 Post Body — the Content rich text

The class on the RichText element:

| Class | Breakpoint | Properties |
| --- | --- | --- |
| Post Body | main | `display: flex` · `flex-direction: column` · `flex: 0 1 var(--_layout---post--body-width)` (grow 0, shrink 1, basis Post/Body Width) · `min-width: 0` · `color: var(--_colors-semantic---text--secondary)` · `font-family: var(--_typography-scale---family--body)` · `font-size: var(--_typography-scale---size--16)` · `line-height: var(--_typography-scale---line-height--relaxed)` |
| Post Body | medium | `flex: none` · `width: 100%` · `max-width: var(--_layout---post--body-width)` |

Child styles (nested "inside Post Body"). **They don't exist for the
API until a property is set in the Designer** — the same as tag styles
(`lessons/mcp.md` 2026-10-02 / 2026-10-15). Plan: in the Designer
(TBD-2), with a temporary unbound RichText that carries Post Body (the
sample content has h2…blockquote, links, a list; add an image), select
each child, "Nest selector inside of" › Post Body, set **one** property
(e.g. margin 0). Then the API finishes the rest with `update_style
style_name: "h2", parent_style_names: ["Post Body"]` (`lessons/mcp.md`
2026-10-28). Remove the temporary block afterwards; the nested styles
stay. Bind colours with the variable dot, never typed (`@var_` bug,
2026-10-15); grep the published CSS for `@var_`.

| Child | Breakpoint | Properties |
| --- | --- | --- |
| p | main | `margin: 0 0 var(--_spacing---20)` (bottom 20, others 0) |
| h2 | main | `margin: 0` · `color: var(--_colors-semantic---text--primary)` · `font-family: var(--_typography-scale---family--base)` · `font-size: var(--_typography-scale---size--28)` · `font-weight: var(--_typography-scale---weight--medium)` · `letter-spacing: var(--_typography-scale---letter-spacing--snug)` · `line-height: var(--_typography-scale---line-height--snug)` |
| h2 | small | `font-size: var(--_typography-scale---size--24)` |
| h3 | main | `margin: 0` · `color: var(--_colors-semantic---text--primary)` · `font-family: var(--_typography-scale---family--base)` · `font-size: var(--_typography-scale---size--20)` · `font-weight: var(--_typography-scale---weight--medium)` · `letter-spacing: var(--_typography-scale---letter-spacing--snug)` · `line-height: var(--_typography-scale---line-height--compact)` |
| h4 | main | `margin: 0` · `color: var(--_colors-semantic---text--primary)` · `font-family: var(--_typography-scale---family--base)` · `font-size: var(--_typography-scale---size--18)` · `font-weight: var(--_typography-scale---weight--medium)` · `line-height: var(--_typography-scale---line-height--compact)` |
| ul **and** ol (two nested styles, same values) | main | `display: flex` · `flex-direction: column` · gap 8 · `margin: 0 0 var(--_spacing---20)` · `padding-left: var(--_spacing---28)` |
| li | main | `padding-left: var(--_spacing---2)` |
| strong (All Bold Text) | main | `color: var(--_colors-semantic---text--primary)` · `font-family: var(--_typography-scale---family--base)` · `font-weight: var(--_typography-scale---weight--medium)` |
| a (All Links) | main | `color: var(--_colors---brand--accent)` · `text-decoration: underline` · `text-underline-offset: var(--_spacing---2)` · transition color 200ms ease (Designer) |
| a | main · hover | `color: var(--_colors---brand--ink)` |
| figure | main | `display: flex` · `flex-direction: column` · gap 12 · `max-width: 100%` · `margin: 0 0 var(--_spacing---24)` |
| img | main | `display: block` · `width: 100%` · `height: auto` · `border-radius: var(--_radius---24)` |
| figcaption | main | `margin: 0` · `color: var(--_colors---ink-tint--ink-64)` · `font-size: var(--_typography-scale---size--14)` · `line-height: var(--_typography-scale---line-height--normal)` · `text-align: left` |
| blockquote | main | `margin: 0` · `padding: var(--_spacing---4) 0 var(--_spacing---4) var(--_spacing---24)` · `border-left: var(--_spacing---4) solid` + `border-left-color: var(--_colors---brand--yellow)` · `color: var(--_colors-semantic---text--primary)` · `font-family: var(--_typography-scale---family--base)` · `font-size: var(--_typography-scale---size--20)` · `line-height: var(--_typography-scale---line-height--normal)` |
| blockquote | small | `font-size: var(--_typography-scale---size--18)` |

Webflow's own `.w-richtext figure` defaults (centered, `max-width: 60%`
for some alignments, figcaption centred) are why figure/figcaption carry
explicit values; check a full-width body image on staging.

Minimum for launch: p, h2, h3, ul, ol, li, strong, a, img (all in the
current content). figure, figcaption, h4, blockquote are for future posts.

### 1.5 Repo CSS (not the Designer; a repo change in `src/styles.css`)

These can't be Designer styles. Add them as one block in the section of
`src/styles.css` that holds page rules, with raw fallbacks on every
variable read (GOTCHAS 2026-11-12 "Repo CSS reads Webflow variable
names (approved)"). Ported from `new-classes-blog.css` (the
`repo-css: designer-cant` block and the 991 rules):

```css
/* repo-css: designer-cant — Post Body: combinators inside the rich text
   (:has(), +, child), the heading <strong> the live content wraps every
   H2 in, and the post header's 991 reorder (display: contents). */
.post-body h2 strong, .post-body h3 strong { font-weight: inherit; }
.post-body > :has(+ h2) { margin-bottom: var(--_spacing---48, 3em); }
.post-body > :has(+ h3), .post-body > :has(+ h4), .post-body > :has(+ blockquote) { margin-bottom: var(--_spacing---28, 1.75em); }
.post-body > figure:has(+ h3), .post-body > figure:has(+ h4) { margin-bottom: var(--_spacing---32, 2em); }
.post-body > h2 + * { margin-top: var(--_spacing---16, 1em); }
.post-body > h3 + *, .post-body > h4 + * { margin-top: var(--_spacing---10, 0.625em); }
.post-body > blockquote + * { margin-top: var(--_spacing---28, 1.75em); }
.post-body > :first-child { margin-top: 0; }
.post-body > :last-child { margin-bottom: 0; }
.post-head-text .breadcrumb.is-static { margin-bottom: 0; }
@media screen and (max-width: 991px) {
  .post-head-text { display: contents; }
  .post-head .breadcrumb { order: -2; }
}
```

Run `pnpm build` and commit `dist/` with it (AGENTS.md). The canvas shows
the repo rules only after the staging deploy and a Designer reload.

## 2. Components

| Component | Id | Use | Props / notes |
| --- | --- | --- | --- |
| G \| Page W | `280bc82e-29bf-4fe9-0e6c-feb86b116bc6` | wraps the template (nav, main, footer) | Slot ← the three imported sections + CTA. A slot's first content can't be placed by API (MANUAL-TODO K) → TBD-1. Insert it first if the template is empty |
| G \| Components | `de3173b4-35b5-a109-fce0-5193b9bebdd9` | directly under body | check it is on the template (every page has one) |
| C \| Button | `e6bbfb98-a077-7e52-8a94-f86f22d3c82c` | (a) rail card "Request an Appointment" → `/contact-us`, Color **Secondary** (`e13de0db-430f-b667-aee3-d545b7e6faea`), Size **Small** (`59642798-b49d-486d-53fd-1f7e1042710d`), Icon `ri-arrow-right-s-line`, icon after on; (b) Latest posts head "All Articles" → `/blog`, Color Secondary, Size Default (`base`), no icon (copy the props of Home's "All Articles" instance) | insert after `.post-rail-card-text` and as the last child of `.blog-head`; props by `set_component_instance_prop_values` (Color prop `a86542c6…`, Size prop `06aa6257…`) |
| CTA | `25dab600-c3f8-6f46-adaf-1487aa16c392` | the closing section, after Latest Blog Posts | defaults (as Home). The CTA section must stay a direct child of the slot |
| Icon / Icon Size | — | not used: the breadcrumb and share icons are bare `<i class="ri-…">` inside a classed div (same pattern as `services-index.md` §3) | — |

No new component. Post Header and Post Main hold CMS bindings to the
template's own item, so they stay page elements, not components.

## 3. WHTML markup (importer-safe)

Import rules applied (GOTCHAS, `lessons/mcp.md`):
- every class in the markup exists before import (§1), or the element
  loses its whole class list; verify `styleNames` after import;
- no `<span>` (→ text Span, which takes no text binding): all text leaves
  are `div`s; no `<time>` (unknown tag, unwrapped);
- no `<button>`, no `style` attribute, no `width`/`height`/`loading` on
  `<img>` (dropped);
- icons: a `div` with the Webflow class around a bare `<i class="ri-…">`,
  so the Webflow class counts as used;
- the breadcrumb is a `div`, switched to `nav` after import (as in the
  Services index pack); the article column's RichText is **not** in the
  import (built in §4.1); a `div` marks its place;
- no `target`/`rel` (they become custom attributes) — new-tab is set
  with `set_settings link` afterwards;
- `section` ids are imported but read back (the importer drops some).

### 3.1 Markup — import into the template, then move into the slot (TBD-1)

```html
<div data-import="blog-post">
  <section class="section post-top" id="post">
    <div class="s-wrapper post-head">
      <div class="post-head-text">
        <div class="breadcrumb is-static" aria-label="Breadcrumb">
          <a class="breadcrumb-link" href="/" aria-label="Home"><div class="breadcrumb-icon"><i class="ri-home-2-line" aria-hidden="true"></i></div></a>
          <div class="breadcrumb-sep"><i class="ri-arrow-right-s-line" aria-hidden="true"></i></div>
          <a class="breadcrumb-link" href="/blog">Blog</a>
          <div class="breadcrumb-sep"><i class="ri-arrow-right-s-line" aria-hidden="true"></i></div>
          <div class="breadcrumb-current" aria-current="page">Spay &amp; Neuter</div>
        </div>
        <div class="post-title-block">
          <div class="post-chip"><div class="post-chip-text">Spay &amp; Neuter</div></div>
          <h1 class="d2">Spaying Your Cat, the Right Age and What the First Week at Home Looks Like</h1>
          <div class="post-meta">
            <div class="post-author">
              <div class="post-avatar"><img class="post-avatar-image" src="https://placehold.co/72x72" alt=""><div class="post-avatar-text">TVS</div></div>
              <div class="post-author-name">TVS Veterinary Team</div>
            </div>
            <div class="post-meta-dot" aria-hidden="true"></div>
            <div class="post-meta-text">November 3, 2026</div>
          </div>
        </div>
      </div>
      <img class="post-cover" src="https://placehold.co/882x622" alt="">
    </div>
  </section>

  <section class="section post-main" id="article">
    <div class="s-wrapper post-layout">
      <div data-replace="post-body">Content rich text goes here (§4.1)</div>
      <aside class="post-rail" aria-label="About this article">
        <div class="post-rail-box">
          <div class="post-share">
            <div class="post-rail-label">Share</div>
            <div class="post-share-buttons">
              <a class="post-share-button" href="https://www.facebook.com/sharer/sharer.php" aria-label="Share on Facebook"><div class="post-share-icon"><i class="ri-facebook-fill" aria-hidden="true"></i></div></a>
              <a class="post-share-button" href="mailto:" aria-label="Share by email"><div class="post-share-icon"><i class="ri-mail-fill" aria-hidden="true"></i></div></a>
            </div>
          </div>
        </div>
        <div class="post-rail-card theme-dark">
          <a class="post-rail-service" href="/services">
            <div class="post-rail-label">Related service</div>
            <div class="post-rail-service-name">Surgery</div>
          </a>
          <div class="post-rail-card-text">
            <div class="eyebrow"><div class="eyebrow-dot"></div><div class="eyebrow-text">Contact us</div></div>
            <p class="post-rail-card-lead">Book your appointment at either clinic, open 7 days a week.</p>
          </div>
        </div>
      </aside>
    </div>
  </section>

  <section class="section" id="blog">
    <div class="s-wrapper blog">
      <div class="blog-head">
        <div class="blog-head-text">
          <div class="eyebrow"><div class="eyebrow-dot"></div><div class="eyebrow-text">From the Blog</div></div>
          <h2 class="d2 weight-regular">Latest blog posts</h2>
        </div>
      </div>
      <div data-replace="blog-list">Latest posts Collection List goes here (§4.6)</div>
    </div>
  </section>
</div>
```

The `placehold.co` sources only give the importer an image to create;
the Image elements get their CMS binding in §4, which replaces them.
(If the importer refuses an external `src`, drop `src` entirely and set
the binding; the Image element is what matters.)

### 3.2 Before import

1. `query_styles` every class in §1 (incl. combos Section + Post Top,
   Section + Post Main, S Wrapper + Post Head, S Wrapper + Post Layout,
   Breadcrumb + Is Static, Post Rail Card + Theme Dark, D2 + Weight
   Regular, S Wrapper + Blog).
2. Read the template's tree: is G | Page W there? Insert it first if not.

### 3.3 Import

`data_whtml_builder` into the template body (beside G | Page W, not inside
the slot: the API can't start a slot). Then TBD-1: drag `[data-import]`
into G | Page W's slot and ungroup it, as Home's "To Slot" (MANUAL-TODO K).

### 3.4 Fix-ups after import

1. Breadcrumb block → tag `nav` (`set_tag`; Designer if refused, TBD-7).
2. Breadcrumb Home link → page link Home; "Blog" link → the Blog page
   once it exists (until then URL `/blog`); remove every custom `href`
   attribute the importer left on links (GOTCHAS 2026-11-13).
3. Read back `id` on the three sections (`post`, `article`, `blog`);
   set missing ones with `set_dom_id`.
4. Check `aria-label`, `aria-current`, `aria-hidden` survived; re-add
   with `set_attributes` where missing.
5. Share links: Facebook link → `open_in_new_tab` via `set_settings key
   link`; remove the custom `href` attributes (the real per-item hrefs are
   TBD-6).
6. Insert C | Button (a) after `.post-rail-card-text` and (b) at the end
   of `.blog-head` (§2).
7. Replace `[data-replace="post-body"]` (§4.1) and
   `[data-replace="blog-list"]` (§4.6); then remove both placeholders and
   the `data-import` attribute (or the wrapper, after TBD-1's ungroup).
8. Insert the CTA instance after `section#blog`, inside the slot.
9. Cover image: `set_attributes loading = eager` (imported images publish
   lazy, `lessons/mcp.md` 2026-10-30; the cover is the LCP image). Add
   `fetchpriority="high"` if the API accepts it.
10. Count tags: one `h1`, one `nav` (breadcrumb), one `aside`, three
    `section`s plus CTA; no `inline-div-N` combo created.

## 4. CMS bindings

Field ids (Blogs `6af7417034f822e0c17f6900`):

| Field | Slug | Id |
| --- | --- | --- |
| Title (Name) | `name` | `03628d1d398d177e5ba6c83def4ae6a1` |
| Category → Blog Categories | `category` | `d5d7e72164114738e8e54a2d44fe63bf` |
| Author → Authors | `author` | `a247ec241dd1b3b2947e892132854231` |
| Date posted | `date-posted` | `162d1e97a407fbb04a199683d1bd38f6` |
| Cover | `cover` | `afd6240cc6697ba9fbe98f6a13799e09` |
| Cover alt | `cover-alt` | `23307d9667df3157817f0d116d783ce6` |
| Content | `content` | `b9e7611134fcc93e294cec04ceafa1ae` |
| Related service → Services | `related-service` | `9affb54c590c734e54f6311b1f4aefde` |
| Meta title / Meta description / Open Graph image | `meta-title` / `meta-description` / `open-graph-image` | `65fc67bf…` / `060e8d58…` / `9801b46c…` |

Referenced: Blog Categories Name `79f6cd56742a41ccd51e1651ac42c7ef`;
Authors Name `de5110e05b4870945b0e9a27cbae34fb`, Photo
`ab28a3ca06ddad08549b9105e8218a56`, Role `f35222892cbc62b1e4baec2722dc84dd`.
A referenced field binds as `"<refFieldId>:::<fieldId>"` (GOTCHAS
2026-11-13); confirm the exact path with `get_bindable_sources`.

| # | Element | Binding | API / Designer |
| --- | --- | --- | --- |
| 4.1 | **Content**: build a `RichText` with class Post Body in place of `[data-replace="post-body"]` (`data_element_builder`), `set_settings richText` → Content; add attribute `data-post-body` (for the TOC module later). A new RichText starts with sample content; the binding replaces it on publish (`lessons/mcp.md` 2026-10-15) | Content | API |
| 4.2 | H1 `.d2` | Name | API (`set_settings text`) |
| 4.2 | Post Chip Text; Breadcrumb Current | Category › Name | API |
| 4.3 | Post Cover (Image) | Cover | API (image binding as on Home's Blog Card Image) |
| 4.3 | Post Cover alt | Cover alt | Designer (Image settings › Alt text › Get alt from "Cover alt") — TBD-3. Cover alt is empty on all 27 posts: content task (§6) |
| 4.4 | Post Author Name | Author › Name | API |
| 4.4 | Post Avatar Image | Author › Photo | API; visibility "Author: Photo is set" — TBD-4 |
| 4.4 | Post Avatar Text "TVS" | — (static fallback) | visibility "Author: Photo is not set" — TBD-4 |
| 4.4 | Post Author + the Post Meta Dot after it | — | visibility "Author is set" on both — TBD-4. With no Author item today, the header shows the date only; see §6 |
| 4.4 | Post Meta Text (date) | Date posted | API (`set_settings key text`, cms binding). Default format "MMMM D, YYYY" = the design ("November 3, 2026"); no Designer step. **Check the day**: dates are stored `…T00:00:00.000Z`, which a site time zone behind UTC shows as the previous day (`lessons/mcp.md` 2026-10-07) — if staging shows "November 2, 2026", the dates move to `T12:00:00Z` (a CMS write; ask the person) |
| 4.5 | Post Rail Service (Link Block) | link → the Related service's page | Designer ("Get URL from Related service") — TBD-5 |
| 4.5 | Post Rail Service Name | Related service › Name | API |
| 4.5 | Post Rail Service | visibility "Related service is set" | Designer — TBD-5. Empty on all 27 posts today, so it is hidden everywhere until editors fill it |
| 4.6 | Latest posts list | see below | API + Designer |

### 4.5 Related service — a choice to confirm

Figma and the prototype show the navy card with static "Contact us"
copy, marked `data-field="Related service"` but not reading the
reference. The Blogs field exists ("the related-service block hides when
empty"). This pack keeps the designed card as it is and adds one small
link at its top (label "Related service", the service's name, links to
the service page), hidden when the field is empty. It is not drawn in
Figma: **the person to confirm** before import, or drop the
`post-rail-service` link from §3.1 and the two new classes.

### 4.6 Latest Blog Posts list (Figma 684:15001)

Build it exactly as Home's Latest Blog Posts list (read Home's element
types and classes with `get_all_elements` and mirror them): Collection
List wrapper sourced `static_json {"collectionId":
"6af7417034f822e0c17f6900"}`, the list with class Blog Cards and
attribute `data-reveal-stagger`, each item a Blog Card Link Block
(link to the current item: Designer — TBD-5) holding Blog Card Image
(Cover; alt Cover alt), Blog Card Meta (Blog Card Category ← Category ›
Name, Blog Card Dot "·", Blog Card Date ← Date posted), Blog Card Title
(Name) and Blog Card Excerpt (Excerpt). Remove the custom `href`
attributes (GOTCHAS 2026-11-13).

Settings:
- sort Date posted, descending; limit 3 — API (`sort: [{"fieldSlug":
  "date-posted", "direction": "descending"}]`, a static `limit`); if
  "[Conflict] … component map" comes back, Designer (GOTCHAS 2026-11-13);
- filter **Category equals Current Blog's Category** and **exclude the
  current item** — Designer only (`lessons/mcp.md` 2026-10-07) — TBD-5.

Category counts (cms-batch, after the Figma categories): Wellness 10,
Vaccinations 4, Parasites 4, Spay & Neuter 2, Dental Care 2, Allergies &
Skin 2, New Pets 2, Travel 1. With "same category, not this post", 4 of 8
categories show one card and Travel shows **none** (the list's Empty
State). The heading "Latest blog posts" then reads wrong. Open: keep the
category filter and set Empty State to hidden (and perhaps the heading to
"More on this topic"), or show the latest three without the category
filter. The person to decide (listed in §6).

## 5. SEO bindings (Blogs Template page settings)

Every item has Meta title and Meta description (checked); the meta
titles already end in "| TVS Animal Hospitals", so no suffix.

| Setting | Value | How |
| --- | --- | --- |
| Title tag | `{{wf {"path":"meta-title","type":"PlainText"\} }}` | API `update_page_settings` on `6af7417034f822e0c17f6906` (tokens render per item, `lessons/mcp.md` 2026-10-08) |
| Meta description | `{{wf {"path":"meta-description","type":"PlainText"\} }}` | API |
| Open Graph title / description | same as SEO (`titleCopied` / `descriptionCopied: true`) | API |
| Open Graph image | **Cover** (Open Graph image is empty on all 27 posts) | Designer page settings › Open Graph image › Cover — TBD-6. API alternative: head code `<meta property="og:image" content="{{wf {&quot;path&quot;:&quot;cover&quot;,&quot;type&quot;:&quot;ImageRef&quot;\} }}">` with `set_page_freeform_code` (read the block first). When editors fill Open Graph image, switch the binding to it |
| Sitemap / search | included (a real page) | — |

Live check: the live post URLs are `/blog/<slug>` with the same slugs;
nothing to redirect.

## 6. Not built (noted, not imported)

- **"On this page" (table of contents) and its current-section
  highlight.** The prototype list is hand-written for one post; on a CMS
  template it must be generated from the Content H2s, which needs a repo
  module (none exists in the prototype or the repo; `post-toc` to write:
  give each `[data-post-body] h2` an id, build the links, set
  `.is-current` on scroll). Its markup and classes (Post Toc, Post Toc
  List, Post Toc Link + Is Current with the accent bar `::before`, Post
  Toc Text, Post Rail Divider) are in the prototype
  (`new-classes-blog.css` › Post Rail) and come in with that module.
- **Copy-link share button** (`data-share-copy`): needs a module
  (clipboard + feedback). Not imported; Share has Facebook and email only.
- **Read time** ("5 min read"): static in the prototype; no CMS field.
  Options: a Number field "Read time (minutes)" in Blogs, or computed by
  the TOC module. Not imported, with its dot.
- **Authors**: the collection is empty and no post has an Author. Until
  the person adds one (e.g. "TVS Veterinary Team", photo the TVS mark)
  and sets it on the posts, the author block stays hidden (TBD-4). A CMS
  write: needs the person's OK.
- **Cover alt** empty on all 27 posts (content task).
- Two posts (`arthritis-in-dogs-early-signs`,
  `spaying-a-cat-age-and-recovery`) carry two empty links to a claude.ai
  URL copied from live (cms-batch › Open): clean in the Content.
- Open decisions: §4.5 (Related service link), §4.6 (same-category list
  and its heading).

## 7. Manual Designer steps (new MANUAL-TODO rows, letters TBD)

| ID | Where (page › element or class) | Breakpoint | Set | Why the API can't | Done |
| --- | --- | --- | --- | --- | --- |
| TBD-1 | Blogs Template › the imported `[data-import="blog-post"]` wrapper | — | Drag it into G \| Page W's slot and ungroup; then CTA instance after `#blog` | The API can't start a slot's content (as K) | ☐ |
| TBD-2 | Blogs Template › Post Body › nested h2, h3, h4, p, ul, ol, li, All Bold Text, All Links (+ hover), figure, img, figcaption, blockquote | Desktop (h2, blockquote also 767) | With a temporary unbound RichText carrying Post Body: "Nest selector inside of Post Body", set one property per child; the API then writes the values in §1.4; remove the temporary block. Link transition in Effects | Nested rich-text styles don't exist for the API until set in the Designer | ☐ |
| TBD-3 | Blogs Template › Post Cover; Blog Card Image in the latest list | — | Alt text › from Cover alt | Image alt binding is Designer-only | ☐ |
| TBD-4 | Blogs Template › Post Author, the Post Meta Dot after it, Post Avatar Image, Post Avatar Text | — | Conditional visibility: Author is set (author, dot); Author: Photo is set (image) / is not set ("TVS") | No conditional visibility in the API. If refused with "[Conflict] … component map", rebuild the div with the element builder first (`lessons/mcp.md` 2026-10-16) | ☐ |
| TBD-5 | Blogs Template › latest posts Collection List; Blog Card link; Post Rail Service | — | List: filter Category = Current Blog's Category, exclude current item (or as decided in §4.6), Empty State hidden. Blog Card link → Current Blog. Post Rail Service link → Related service; visibility Related service is set | "Exclude current item", links to an item and conditional visibility are Designer-only | ☐ |
| TBD-6 | Blogs Template › Page settings › Open Graph image; Post Share Button (Facebook, email) › custom attribute `href` | — | OG image → Cover. Share hrefs with the Slug inserted: `https://www.facebook.com/sharer/sharer.php?u=https://www.tvshospitals.com/blog/{Slug}` and `mailto:?subject={Name}&body=https://www.tvshospitals.com/blog/{Slug}` | `openGraph.imageUrl` takes only a URL; CMS tokens in an attribute value are inserted in the Designer | ☐ |
| TBD-7 | Blogs Template › Breadcrumb block | — | Tag → nav (only if `set_tag` refused) | Fallback | ☐ |
| TBD-8 | Post Share Button; Post Rail Service | Desktop | Effects › Transitions: background-color, border-color, color 200ms ease | `transition` can't be written through the API (`lessons/mcp.md` 2026-10-15) | ☐ |
| TBD-9 | Post Cover | Desktop | Size › aspect ratio 441:311 (only if the style API refused `aspect-ratio`) | Fallback | ☐ |

Each row that changes something visible gets a `data-manual-todo`
marker caption per MANUAL-TODO's rules when it lands on the page.

## 8. Check list (builder, after the import)

Structure and classes
- [ ] Every element has its class list (`styleNames`), combos included:
      Section + Post Top / Post Main, S Wrapper + Post Head / Post
      Layout / Blog, Breadcrumb + Is Static, Post Rail Card + Theme Dark,
      D2 + Weight Regular. No `inline-div-N`.
- [ ] Template sits in G | Page W's slot; G | Components under body; nav
      and footer render; CTA last in main.
- [ ] Tags: one `h1` (the Name), `nav` breadcrumb with `aria-current`
      on the last crumb, `aside` rail with its label, section ids
      `post`, `article`, `blog`.
- [ ] No custom `href`/`target`/`rel` attributes left on links
      (`query attribute_name: href`).

Bindings (open 2–3 posts on staging: `spaying-a-cat-age-and-recovery`
with images and an `ol`, a Wellness post, the Travel post)
- [ ] H1, chip and breadcrumb show each post's own Name and Category.
- [ ] Date reads "November 3, 2026" for the spaying post (not the 2nd).
- [ ] Cover is the post's own, eager (no `loading="lazy"`), alt from
      Cover alt (empty today).
- [ ] Content renders with the Post Body styles: H2 28px/medium, H3
      20px, lists with 8px gaps, links blue + underline, body images
      full width with 24px corners; 48px above each H2, 16px under
      (repo CSS live after deploy).
- [ ] Author block hidden (no Author) without a stray dot before the
      date.
- [ ] Related service link hidden on every post (field empty).
- [ ] Latest posts: up to three, never the current post, newest first,
      as decided in §4.6; Travel post's list empty state hidden.
- [ ] Facebook / email share links carry the post's own URL; Facebook
      opens in a new tab.

SEO
- [ ] `<title>` and meta description are the item's Meta title /
      description; og:image is the cover (view source on two posts).

Layout (1440, 991, 767, 479 against the prototype at
http://localhost:5955/blog/spaying-a-cat-age-and-recovery/ —
`pnpm wf:compare` / `wf:overflow` / `wf:a11y`)
- [ ] 1440: cover 441px right of the title; article 740px, rail 300px
      sticky under the nav; hairline under the header.
- [ ] 991: order breadcrumb → cover → chip/title/meta; rail below the
      article, static.
- [ ] 767/479: H2 24px, cover radius 24px, no sideways scroll.
- [ ] Published CSS has no `@var_` and no duplicate `.post-body` rules
      from the repo and the Designer.
