# Import pack — Locations template (`/locations/{slug}`)

Prepared 2026-11-13 by a read-only prep session for the Webflow build
session (the only session that writes to Webflow). Nothing in Webflow was
changed while preparing it; everything below was read through
`webflow-wf-tvs` on 2026-11-13.

- Design: prototype `prototype/locations/north-york/index.html` (with
  `partials/sections/services-location.html`, `why-choose.html`,
  `reviews.html`, `cta.html`, `partials/forms/lead-north-york.html`,
  `partials/forms/location-parliament.html`), Figma 684:11995.
- Webflow page: **Locations Template** `6af7417018d49df547956a4e`
  (collection Locations `6af7416f18d49df547956a48`). It is empty today:
  only Body.
- Items: North York `6af744f3018c1fa9ca7ff334` (slug `north-york`),
  Parliament `6af744f3018c1fa9ca7ff336` (slug `parliament`). Both Ready to
  publish (`isDraft: false`), so the canvas renders them.
- Classes: 208 class chains on the North York page, 85 missing in
  Webflow, plus 3 used only by the Parliament success panel. §1 lists all
  of them (85 created from rules, three combo chains rewritten, one token
  dropped).

## 0. Read before starting — decisions and blockers

Things this pack had to decide or could not settle. Items marked **ASK**
need the person before the step that depends on them; the rest are the
pack's default, which the builder can follow.

1. **The clinic forms must be native Form Blocks, not `<i data-wftag>`
   stand-ins.** The stand-in route (GOTCHAS 2026-11-12) makes DOM
   `<form>`/`<input>` elements, as on the Forms docs page (`list_forms`
   returns 0 forms on the site). A DOM form never registers with Webflow,
   so it can't submit, can't be named "Lead North York" and can't notify
   TorontoNorth@ / Parliament@. So: `<form>`, `<input>`, `<select>`,
   `<option>`, `<label>` and the submit `<input>` are imported as real
   tags (the importer makes FormWrapper › FormForm and native fields when
   they sit inside a `<form>`, `lessons/mcp.md` 2026-10-05). Only the
   `<button>`s (the custom select toggles, the date picker has none) use
   `<i data-wftag="button">`. If the importer refuses native fields, stop
   and ask; do not fall back to stand-ins for these two forms.
2. **Phone, text and email can't all come from the CMS.** A Phone field
   binds only to a link and publishes `tel:`; `sms:` and labels like
   "Call (416) 546-7493" can't be built from it, and a C | Button Label
   prop can't mix static text with a field. Default: the **Call or text
   card is built twice, one per clinic, static** (labels, `tel:`, `sms:`),
   each shown only on its item — the same per-item pattern as the forms.
   The numbers are already static in Top Bar, CTA and Call Chooser.
3. **Per-item visibility (forms, reach cards).** Try, in the Designer,
   `Current Location is any [Toronto North Animal Hospital]` (works in
   Collection Lists, GOTCHAS 2026-11-13; check that the template page
   offers it). If it isn't offered, try `Slug` / `Name` conditions. If
   none works: **ASK** the person for an Option field "Clinic" (North
   York / Parliament) on Locations, group "Filters & sort", help text
   "Used for conditional visibility in the template: which clinic form
   and call card show." Don't add it without the OK.
4. **Hours.** The CMS field Hours is Rich text, one paragraph per row
   ("10AM – 11PM Mon to Sat"). The prototype splits each row into a time
   and a days pill, which a rich text can't do. Default: bind a Rich Text
   (class Location Hours) and style its `p` as the time text; no pill.
   **ASK** whether the pill matters enough for four new Plain text fields
   (Hours 1 time/days, Hours 2 time/days); only then create Location
   Hours Row / Time / Days and use them.
5. **"Open today" status.** The prototype's static "Open today · until
   11PM" is wrong for Parliament (closes 7 or 8 PM). Default: the pill
   says "Open today" only, static (HANDOFF: no live open-hours module
   yet). **ASK** if it should be hidden instead.
6. **CTA props.** Locations has CTA heading / CTA text fields, empty on
   both items. Default: the CTA instance keeps its default props (as the
   prototype). Bind the props to the fields only once both items have
   text, or the heading publishes empty.
7. **Video.** Video and Poster are empty on both items, so the video
   block is hidden by its condition. There is no play module yet; the
   play button is inert. The North York poster file is ready at
   `prototype/public/images/locations/north-york-poster.webp` for when a
   video exists.
8. **Template SEO.** Both items have Meta title / Meta description; Open
   Graph image is empty on both (falls back to nothing on a template —
   set the site default share image or fill the field).
9. **Reviews component.** HANDOFF says shared Reviews is one component;
   none exists yet (components today: G | *, Icon*, Button*, C | Video,
   Section Head, Why Choose, CTA, Top Bar, Nav Callout, Call Chooser). If
   the Services template pack's build has created "Reviews" by the time
   this runs, insert it; otherwise transform Home's Reviews section into
   component "Reviews" (§2) — coordinate so it's done once.

## Build order

1. §1 classes (create, read back).
2. Page shell: G | Components + G | Page W instances, import into a
   "To Slot" wrapper, person drags it into the slot (TBD-1).
3. §3.1 hero shell → §3.2 C | Button instances → §3.3 forms → §3.4 hours.
4. §3.5 Services (duplicate Home's, restructure), §3.6 Why Choose,
   §3.7 Reviews, §3.8 FAQ (duplicate Home's), §3.9 CTA.
5. §4 bindings (API part), then hand the TBD rows to the person.
6. Repo CSS (§1.4) in the repo, push, check staging.
7. §6 check list at 1440 / 991 / 767 / 479 on both items.

## 1. Classes to create first

Create every class below **before** any import: the importer drops an
element's whole class list when one class is missing (GOTCHAS). Values
come from `prototype/src/css/new-classes-location.css` and the "Service
Tile Is Accordion" block of `new-classes-home.css`, already split into
the longhands the style API stores.

How to write them (all confirmed on this site, GOTCHAS 2026-11-12):

- A value that is exactly `var(--<css name>)` binds that variable; no id
  lookup needed. Every variable used here exists in Webflow (checked:
  59 names, including `--_layout---location--form-width` 30em,
  `--_colors---yellow-tint--yellow-20`, `--_colors---paper-tint--paper-12`
  and `-48`, `--_typography-scale---size--13`/`15`,
  `--_typography-scale---line-height--tight`, `--_radius---4`).
- Gaps are written as `grid-row-gap` / `grid-column-gap` (the API refuses
  variables on `row-gap` / `column-gap`).
- Breakpoint ids: Tablet 991 = `medium`, Mobile landscape 767 = `small`,
  Mobile 479 = `tiny`. Nothing on this page has a 767 rule.
- Read every class back after creating it; a dropped property gives no
  error.
- Raw values left on purpose: `line-height: 1` on glyph classes (as the
  Home glyphs), `0` margins/paddings, `none`, `inherit`, the
  `repeat(2, minmax(0, 1fr))` tracks, and the Form Success navy `#1d2b5d`,
  `#fef5d3` and `rgba(255, 255, 255, 0.1)` (the person's OK 2026-11-13:
  the success panel keeps the live design with raw values).

⚠ = a value the API may refuse or store differently; read it back and, if
it's missing, set it in the Designer (none of them need a MANUAL-TODO row
unless the Designer can't either).

### 1.1 Combo chains whose order differs from the prototype

Webflow combos are ordered chains. The prototype writes
`form-input is-panel select-toggle` and `form-input is-panel date-input`;
Webflow already has `Form Input › Select Toggle` and
`Form Input › Date Input`. The markup in §3 is rewritten to
`form-input select-toggle is-panel` and `form-input date-input is-panel`,
so create **three** Is Panel combos with the same three properties
(`border-*-color: transparent` ×4, the four `border-*-radius:
var(--_radius---12)`, `background-color: var(--_colors---brand--paper)`):

- Is Panel on Form Input (`.form-input.is-panel`) — listed in §1.2.
- Is Panel on Form Input › Select Toggle (`.form-input.select-toggle.is-panel`).
- Is Panel on Form Input › Date Input (`.form-input.date-input.is-panel`).
  Its explicit background also beats Webflow's grey
  `.w-input[readonly]` (the date field is read-only).

Form Success is a combo on Form Message (`.form-message.form-success`):
`padding-*: 0` ×4, `border-*-radius: 0` ×4, `background-color:
transparent`, `color: var(--_colors---brand--ink)`, plus
`text-align: left` (Webflow's `.w-form-done` centres its text and paints
it `#dddddd`).

`is-place` on the success box title has no rule anywhere; it is dropped
from the markup, no class needed.

### 1.2 New classes and combos, per breakpoint

Location Hours Row, Location Hours Time and Location Hours Days are only
needed if the person picks split hours fields (§0 item 4); skip them
otherwise. For the default, give Location Hours (on the Rich Text) a
child style `p` (`style_name: "p"`, `parent_style_names: ["Location
Hours"]`, lessons/mcp.md 2026-10-28): `margin-*: 0` ×4, `font-size:
var(--_typography-scale---size--14)`, `font-weight:
var(--_typography-scale---weight--medium)`, `line-height:
var(--_typography-scale---line-height--compact)`, `white-space: nowrap`.

#### Location Top — combo on Section  `.section.location-top`
- Desktop: `padding-top: var(--_spacing---48)`

#### Location Hero — combo on S Wrapper  `.s-wrapper.location-hero`
- Desktop: `flex-direction: row`; `align-items: flex-start`; `grid-row-gap: var(--_spacing---64)`; `grid-column-gap: var(--_spacing---64)`
- Tablet (991, `medium`): `flex-direction: column`; `grid-row-gap: var(--_spacing---48)`; `grid-column-gap: var(--_spacing---48)`

#### Location Main  `.location-main`
- Desktop: `display: flex`; `flex-grow: 1`; `flex-shrink: 1`; `flex-basis: 0%`; `flex-direction: column`; `grid-row-gap: var(--_spacing---40)`; `grid-column-gap: var(--_spacing---40)`; `min-width: 0`
- Tablet (991, `medium`): `flex-grow: 0`; `flex-shrink: 0`; `flex-basis: auto`; `align-self: stretch`

#### Location Head  `.location-head`
- Desktop: `display: flex`; `flex-direction: column`; `align-items: flex-start`; `grid-row-gap: var(--_spacing---20)`; `grid-column-gap: var(--_spacing---20)`

#### Location Highlights  `.location-highlights`
- Desktop: `display: grid`; `grid-template-columns: repeat(2, minmax(0, 1fr))`; `grid-row-gap: var(--_spacing---12)`; `grid-column-gap: var(--_spacing---12)`
- Mobile (479, `tiny`): `grid-template-columns: minmax(0, 1fr)`

#### Location Highlight  `.location-highlight`
- Desktop: `display: flex`; `align-items: center`; `grid-row-gap: var(--_spacing---12)`; `grid-column-gap: var(--_spacing---12)`; `padding-top: var(--_spacing---12)`; `padding-right: var(--_spacing---16)`; `padding-bottom: var(--_spacing---12)`; `padding-left: var(--_spacing---12)`; `border-top-left-radius: var(--_radius---16)`; `border-top-right-radius: var(--_radius---16)`; `border-bottom-right-radius: var(--_radius---16)`; `border-bottom-left-radius: var(--_radius---16)`; `background-color: var(--_colors---blue-tint--blue-8)`

#### Location Highlight Icon  `.location-highlight-icon`
- Desktop: `flex-grow: 0`; `flex-shrink: 0`; `flex-basis: auto`; `display: flex`; `align-items: center`; `justify-content: center`; `width: var(--_layout---service-icon--size)`; `height: var(--_layout---service-icon--size)`; `border-top-left-radius: var(--_radius---8)`; `border-top-right-radius: var(--_radius---8)`; `border-bottom-right-radius: var(--_radius---8)`; `border-bottom-left-radius: var(--_radius---8)`; `background-color: var(--_colors---brand--yellow)`; `color: var(--_colors---brand--ink)`

#### Location Highlight Glyph  `.location-highlight-glyph`
- Desktop: `font-size: var(--_typography-scale---size--20)`; `line-height: 1`

#### Location Highlight Text  `.location-highlight-text`
- Desktop: `font-size: var(--_typography-scale---size--15)`; `font-weight: var(--_typography-scale---weight--medium)`; `line-height: var(--_typography-scale---line-height--compact)`

#### Location Info  `.location-info`
- Desktop: `display: grid`; `grid-template-columns: repeat(2, minmax(0, 1fr))`; `grid-row-gap: var(--_spacing---24)`; `grid-column-gap: var(--_spacing---48)`
- Mobile (479, `tiny`): `grid-template-columns: minmax(0, 1fr)`

#### Location Info Col  `.location-info-col`
- Desktop: `display: flex`; `flex-direction: column`; `align-items: flex-start`; `grid-row-gap: var(--_spacing---12)`; `grid-column-gap: var(--_spacing---12)`

#### Location Info Row  `.location-info-row`
- Desktop: `display: flex`; `align-items: flex-start`; `grid-row-gap: var(--_spacing---10)`; `grid-column-gap: var(--_spacing---10)`; `color: inherit`; `text-decoration: none`

#### Is Link — combo on Location Info Row  `.location-info-row.is-link`
- Desktop :hover: `color: var(--_colors---brand--accent)`

#### Location Info Icon  `.location-info-icon`
- Desktop: `flex-grow: 0`; `flex-shrink: 0`; `flex-basis: auto`; `color: var(--_colors---brand--accent)`; `font-size: var(--_typography-scale---size--18)`; `line-height: 1`

#### Location Info Text  `.location-info-text`
- Desktop: `font-size: var(--_typography-scale---size--15)`; `font-weight: var(--_typography-scale---weight--medium)`; `line-height: var(--_typography-scale---line-height--compact)`

#### Location Info Note  `.location-info-note`
- Desktop: `margin-top: 0`; `margin-right: 0`; `margin-bottom: 0`; `margin-left: 0`; `color: var(--_colors-semantic---text--secondary)`; `font-size: var(--_typography-scale---size--14)`; `line-height: var(--_typography-scale---line-height--normal)`

#### Location Info Address  `.location-info-address`
- Desktop: `display: flex`; `flex-direction: column`; `align-items: flex-start`; `grid-row-gap: var(--_spacing---8)`; `grid-column-gap: var(--_spacing---8)`

#### Location Hours  `.location-hours`
- Desktop: `display: flex`; `flex-direction: column`; `grid-row-gap: var(--_spacing---8)`; `grid-column-gap: var(--_spacing---8)`; `padding-left: var(--_spacing---28)`

#### Location Hours Row  `.location-hours-row`
- Desktop: `display: flex`; `align-items: center`; `grid-row-gap: var(--_spacing---10)`; `grid-column-gap: var(--_spacing---10)`

#### Location Hours Time  `.location-hours-time`
- Desktop: `font-size: var(--_typography-scale---size--14)`; `font-weight: var(--_typography-scale---weight--medium)`; `line-height: var(--_typography-scale---line-height--compact)`; `white-space: nowrap`

#### Location Hours Days  `.location-hours-days`
- Desktop: `padding-top: var(--_spacing---2)`; `padding-right: var(--_spacing---8)`; `padding-bottom: var(--_spacing---2)`; `padding-left: var(--_spacing---8)`; `border-top-width: var(--_spacing---hairline)`; `border-top-style: solid`; `border-top-color: var(--_colors---ink-tint--ink-12)`; `border-right-width: var(--_spacing---hairline)`; `border-right-style: solid`; `border-right-color: var(--_colors---ink-tint--ink-12)`; `border-bottom-width: var(--_spacing---hairline)`; `border-bottom-style: solid`; `border-bottom-color: var(--_colors---ink-tint--ink-12)`; `border-left-width: var(--_spacing---hairline)`; `border-left-style: solid`; `border-left-color: var(--_colors---ink-tint--ink-12)`; `border-top-left-radius: var(--_radius---pill)`; `border-top-right-radius: var(--_radius---pill)`; `border-bottom-right-radius: var(--_radius---pill)`; `border-bottom-left-radius: var(--_radius---pill)`; `background-color: var(--_colors---brand--paper)`; `color: var(--_colors---ink-tint--ink-64)`; `font-size: var(--_typography-scale---size--12)`; `font-weight: var(--_typography-scale---weight--medium)`; `line-height: var(--_typography-scale---line-height--compact)`

#### Location Status  `.location-status`
- Desktop: `display: inline-flex`; `align-items: center`; `grid-row-gap: var(--_spacing---8)`; `grid-column-gap: var(--_spacing---8)`; `padding-top: var(--_spacing---6)`; `padding-right: var(--_spacing---12)`; `padding-bottom: var(--_spacing---6)`; `padding-left: var(--_spacing---10)`; `border-top-left-radius: var(--_radius---pill)`; `border-top-right-radius: var(--_radius---pill)`; `border-bottom-right-radius: var(--_radius---pill)`; `border-bottom-left-radius: var(--_radius---pill)`; `background-color: var(--_colors---yellow-tint--yellow-20)`

#### Location Status Dot  `.location-status-dot`
- Desktop: `flex-grow: 0`; `flex-shrink: 0`; `flex-basis: auto`; `width: var(--_layout---eyebrow--dot-size)`; `height: var(--_layout---eyebrow--dot-size)`; `border-top-left-radius: var(--_radius---pill)`; `border-top-right-radius: var(--_radius---pill)`; `border-bottom-right-radius: var(--_radius---pill)`; `border-bottom-left-radius: var(--_radius---pill)`; `background-color: var(--_colors---brand--yellow)`

#### Location Status Text  `.location-status-text`
- Desktop: `font-size: var(--_typography-scale---size--13)`; `font-weight: var(--_typography-scale---weight--medium)`; `line-height: var(--_typography-scale---line-height--compact)`

#### Reach Card  `.reach-card`
- Desktop: `display: flex`; `flex-direction: column`; `align-items: flex-start`; `grid-row-gap: var(--_spacing---20)`; `grid-column-gap: var(--_spacing---20)`; `padding-top: var(--_spacing---32)`; `padding-right: var(--_spacing---32)`; `padding-bottom: var(--_spacing---32)`; `padding-left: var(--_spacing---32)`; `border-top-left-radius: var(--_radius---24)`; `border-top-right-radius: var(--_radius---24)`; `border-bottom-right-radius: var(--_radius---24)`; `border-bottom-left-radius: var(--_radius---24)`; `background-color: var(--_colors---blue-tint--blue-8)`
- Mobile (479, `tiny`): `padding-top: var(--_spacing---24)`; `padding-right: var(--_spacing---24)`; `padding-bottom: var(--_spacing---24)`; `padding-left: var(--_spacing---24)`

#### Reach Card Text  `.reach-card-text`
- Desktop: `display: flex`; `flex-direction: column`; `grid-row-gap: var(--_spacing---8)`; `grid-column-gap: var(--_spacing---8)`

#### Reach Card Title  `.reach-card-title`
- Desktop: `margin-top: 0`; `margin-right: 0`; `margin-bottom: 0`; `margin-left: 0`; `font-size: var(--_typography-scale---size--24)`; `font-weight: var(--_typography-scale---weight--regular)`; `letter-spacing: var(--_typography-scale---letter-spacing--snug)`; `line-height: var(--_typography-scale---line-height--snug)`

#### Reach Card Lead  `.reach-card-lead`
- Desktop: `margin-top: 0`; `margin-right: 0`; `margin-bottom: 0`; `margin-left: 0`; `color: var(--_colors-semantic---text--secondary)`; `font-size: var(--_typography-scale---size--15)`; `line-height: var(--_typography-scale---line-height--normal)`

#### Reach Card Actions  `.reach-card-actions`
- Desktop: `display: flex`; `flex-wrap: wrap`; `grid-row-gap: var(--_spacing---10)`; `grid-column-gap: var(--_spacing---10)`

#### Location Video  `.location-video`
- Desktop: `position: relative`; `overflow: hidden`; `aspect-ratio: 656 / 380`; `border-top-left-radius: var(--_radius---20)`; `border-top-right-radius: var(--_radius---20)`; `border-bottom-right-radius: var(--_radius---20)`; `border-bottom-left-radius: var(--_radius---20)`; `background-color: var(--_colors---blue-tint--blue-16)`
  - ⚠ aspect-ratio: 656 / 380 — read back; if refused, set it in the Designer

#### Location Video Poster  `.location-video-poster`
- Desktop: `display: block`; `width: 100%`; `height: 100%`; `object-fit: cover`

#### Location Video Play  `.location-video-play`
- Desktop: `position: absolute`; `bottom: var(--_spacing---24)`; `left: var(--_spacing---24)`; `display: flex`; `align-items: center`; `justify-content: center`; `width: var(--_spacing---64)`; `height: var(--_spacing---64)`; `padding-top: 0`; `padding-right: 0`; `padding-bottom: 0`; `padding-left: 0`; `border-top-style: none`; `border-right-style: none`; `border-bottom-style: none`; `border-left-style: none`; `border-top-left-radius: var(--_radius---pill)`; `border-top-right-radius: var(--_radius---pill)`; `border-bottom-right-radius: var(--_radius---pill)`; `border-bottom-left-radius: var(--_radius---pill)`; `background-color: var(--_colors---brand--yellow)`; `color: var(--_colors---brand--ink)`; `cursor: pointer`; `transition: transform 200ms ease`
  - ⚠ transition: transform 200ms ease — read back; if refused, set it in the Designer
- Desktop :hover: `transform: scale(1.06)`
- Desktop :active: `transform: scale(0.96)`

#### Location Video Play Icon  `.location-video-play-icon`
- Desktop: `font-size: var(--_typography-scale---size--28)`; `line-height: 1`

#### Location Aside  `.location-aside`
- Desktop: `flex-grow: 0`; `flex-shrink: 0`; `flex-basis: var(--_layout---location--form-width)`; `min-width: 0`
- Tablet (991, `medium`): `flex-grow: 0`; `flex-shrink: 0`; `flex-basis: auto`; `align-self: stretch`

#### Clinic Form  `.clinic-form`
- Desktop: `padding-top: var(--_spacing---32)`; `padding-right: var(--_spacing---32)`; `padding-bottom: var(--_spacing---32)`; `padding-left: var(--_spacing---32)`; `border-top-left-radius: var(--_radius---24)`; `border-top-right-radius: var(--_radius---24)`; `border-bottom-right-radius: var(--_radius---24)`; `border-bottom-left-radius: var(--_radius---24)`; `background-color: var(--_colors---blue-tint--blue-8)`
- Mobile (479, `tiny`): `padding-top: var(--_spacing---24)`; `padding-right: var(--_spacing---16)`; `padding-bottom: var(--_spacing---24)`; `padding-left: var(--_spacing---16)`

#### Clinic Form Body  `.clinic-form-body`
- Desktop: `display: flex`; `flex-direction: column`; `grid-row-gap: var(--_spacing---24)`; `grid-column-gap: var(--_spacing---24)`; `margin-top: 0`; `margin-right: 0`; `margin-bottom: 0`; `margin-left: 0`

#### Clinic Form Head  `.clinic-form-head`
- Desktop: `display: flex`; `flex-direction: column`; `grid-row-gap: var(--_spacing---16)`; `grid-column-gap: var(--_spacing---16)`

#### Clinic Form Line  `.clinic-form-line`
- Desktop: `width: 100%`; `height: var(--_spacing---hairline)`; `background-color: var(--_colors---ink-tint--ink-12)`

#### Clinic Form Title  `.clinic-form-title`
- Desktop: `margin-top: 0`; `margin-right: 0`; `margin-bottom: 0`; `margin-left: 0`; `font-size: var(--_typography-scale---size--28)`; `font-weight: var(--_typography-scale---weight--regular)`; `letter-spacing: var(--_typography-scale---letter-spacing--snug)`; `line-height: var(--_typography-scale---line-height--snug)`

#### Form Group  `.form-group`
- Desktop: `display: flex`; `flex-direction: column`; `grid-row-gap: var(--_spacing---10)`; `grid-column-gap: var(--_spacing---10)`

#### Form Group Label  `.form-group-label`
- Desktop: `color: var(--_colors---ink-tint--ink-64)`; `font-size: var(--_typography-scale---size--12)`; `font-weight: var(--_typography-scale---weight--medium)`; `letter-spacing: var(--_typography-scale---letter-spacing--wide)`; `line-height: var(--_typography-scale---line-height--compact)`; `text-transform: uppercase`

#### Form Grid  `.form-grid`
- Desktop: `display: grid`; `grid-template-columns: repeat(2, minmax(0, 1fr))`; `grid-row-gap: var(--_spacing---10)`; `grid-column-gap: var(--_spacing---10)`
- Mobile (479, `tiny`): `grid-template-columns: minmax(0, 1fr)`

#### Form Cell  `.form-cell`
- Desktop: `display: flex`; `flex-direction: column`; `grid-row-gap: var(--_spacing---10)`; `grid-column-gap: var(--_spacing---10)`; `min-width: 0`

#### Is Full — combo on Form Cell  `.form-cell.is-full`
- Desktop: `grid-column-start: 1`; `grid-column-end: -1`
  - ⚠ grid-column 1 / -1: check it reads back as start 1, end -1 (Designer: span full row)

#### Is Labelled — combo on Form Grid  `.form-grid.is-labelled`
- Desktop: `align-items: center`

#### Form Row Label  `.form-row-label`
- Desktop: `font-size: var(--_typography-scale---size--14)`; `font-weight: var(--_typography-scale---weight--medium)`; `line-height: var(--_typography-scale---line-height--compact)`

#### Is Panel — combo on Form Input  `.form-input.is-panel`
- Desktop: `border-top-color: transparent`; `border-right-color: transparent`; `border-bottom-color: transparent`; `border-left-color: transparent`; `border-top-left-radius: var(--_radius---12)`; `border-top-right-radius: var(--_radius---12)`; `border-bottom-right-radius: var(--_radius---12)`; `border-bottom-left-radius: var(--_radius---12)`; `background-color: var(--_colors---brand--paper)`

#### Form Actions  `.form-actions`
- Desktop: `display: flex`

#### Form Submit  `.form-submit`
- Desktop: `height: var(--_layout---button--height)`; `padding-top: 0`; `padding-right: var(--_spacing---24)`; `padding-bottom: 0`; `padding-left: var(--_spacing---24)`; `border-top-style: none`; `border-right-style: none`; `border-bottom-style: none`; `border-left-style: none`; `border-top-left-radius: var(--_radius---pill)`; `border-top-right-radius: var(--_radius---pill)`; `border-bottom-right-radius: var(--_radius---pill)`; `border-bottom-left-radius: var(--_radius---pill)`; `background-color: var(--_colors---brand--accent)`; `color: var(--_colors---brand--paper)`; `font-family: inherit`; `font-size: var(--_typography-role---size--button)`; `font-weight: var(--_typography-scale---weight--medium)`; `cursor: pointer`; `transition: background-color 200ms ease`
  - ⚠ transition: background-color 200ms ease — read back; if refused, set it in the Designer
- Desktop :hover: `background-color: var(--_colors---brand--ink)`
- Desktop :active: `background-color: var(--_colors---ink-tint--ink-90)`

#### Form Success Panel  `.form-success-panel`
- Desktop: `display: flex`; `flex-direction: column`; `grid-row-gap: var(--_spacing---24)`; `grid-column-gap: var(--_spacing---24)`; `padding-top: var(--_spacing---24)`; `padding-right: var(--_spacing---24)`; `padding-bottom: var(--_spacing---24)`; `padding-left: var(--_spacing---24)`; `border-top-left-radius: var(--_radius---12)`; `border-top-right-radius: var(--_radius---12)`; `border-bottom-right-radius: var(--_radius---12)`; `border-bottom-left-radius: var(--_radius---12)`; `background-color: #1d2b5d`; `color: var(--_colors---brand--paper)`
  - ⚠ background-color: raw #1d2b5d (approved by the person 2026-11-13, keep literal)
- Mobile (479, `tiny`): `padding-top: var(--_spacing---16)`; `padding-right: var(--_spacing---16)`; `padding-bottom: var(--_spacing---16)`; `padding-left: var(--_spacing---16)`

#### Form Success Head  `.form-success-head`
- Desktop: `display: flex`; `flex-direction: column`; `align-items: center`; `grid-row-gap: var(--_spacing---8)`; `grid-column-gap: var(--_spacing---8)`; `text-align: center`

#### Form Success Title  `.form-success-title`
- Desktop: `margin-top: 0`; `margin-right: 0`; `margin-bottom: 0`; `margin-left: 0`; `color: var(--_colors---brand--paper)`; `font-size: var(--_typography-scale---size--24)`; `font-weight: var(--_typography-scale---weight--semibold)`; `line-height: var(--_typography-scale---line-height--compact)`

#### Form Success Lead  `.form-success-lead`
- Desktop: `margin-top: 0`; `margin-right: 0`; `margin-bottom: 0`; `margin-left: 0`; `text-wrap: balance`; `color: var(--_colors---brand--paper)`; `font-size: var(--_typography-scale---size--14)`; `line-height: var(--_typography-scale---line-height--normal)`
  - ⚠ text-wrap: balance — read back; if refused, set it in the Designer

#### Form Success Box  `.form-success-box`
- Desktop: `display: flex`; `align-items: flex-start`; `grid-row-gap: var(--_spacing---20)`; `grid-column-gap: var(--_spacing---20)`; `padding-top: var(--_spacing---16)`; `padding-right: var(--_spacing---16)`; `padding-bottom: var(--_spacing---16)`; `padding-left: var(--_spacing---16)`; `border-top-width: var(--_spacing---hairline)`; `border-top-style: solid`; `border-top-color: var(--_colors---paper-tint--paper-12)`; `border-right-width: var(--_spacing---hairline)`; `border-right-style: solid`; `border-right-color: var(--_colors---paper-tint--paper-12)`; `border-bottom-width: var(--_spacing---hairline)`; `border-bottom-style: solid`; `border-bottom-color: var(--_colors---paper-tint--paper-12)`; `border-left-width: var(--_spacing---hairline)`; `border-left-style: solid`; `border-left-color: var(--_colors---paper-tint--paper-12)`; `border-top-left-radius: var(--_radius---8)`; `border-top-right-radius: var(--_radius---8)`; `border-bottom-right-radius: var(--_radius---8)`; `border-bottom-left-radius: var(--_radius---8)`; `background-color: rgba(255, 255, 255, 0.1)`
  - ⚠ background-color: raw rgba(255, 255, 255, 0.1) (approved by the person 2026-11-13, keep literal)
- Mobile (479, `tiny`): `grid-row-gap: var(--_spacing---12)`; `grid-column-gap: var(--_spacing---12)`

#### Is Accent — combo on Form Success Box  `.form-success-box.is-accent`
- Desktop: `border-top-width: var(--_spacing---2)`; `border-top-style: solid`; `border-top-color: var(--_colors---brand--yellow)`; `border-right-width: var(--_spacing---2)`; `border-right-style: solid`; `border-right-color: var(--_colors---brand--yellow)`; `border-bottom-width: var(--_spacing---2)`; `border-bottom-style: solid`; `border-bottom-color: var(--_colors---brand--yellow)`; `border-left-width: var(--_spacing---2)`; `border-left-style: solid`; `border-left-color: var(--_colors---brand--yellow)`; `background-color: var(--_colors---yellow-tint--yellow-20)`

#### Form Success Box Icon  `.form-success-box-icon`
- Desktop: `flex-grow: 0`; `flex-shrink: 0`; `flex-basis: auto`; `display: flex`; `align-items: center`; `justify-content: center`; `width: var(--_spacing---48)`; `height: var(--_spacing---48)`; `border-top-left-radius: var(--_radius---4)`; `border-top-right-radius: var(--_radius---4)`; `border-bottom-right-radius: var(--_radius---4)`; `border-bottom-left-radius: var(--_radius---4)`; `background-color: #fef5d3`; `color: var(--_colors---brand--ink)`
  - ⚠ background-color: raw #fef5d3 (approved by the person 2026-11-13, keep literal)
- Mobile (479, `tiny`): `width: var(--_spacing---40)`; `height: var(--_spacing---40)`

#### Form Success Box Glyph  `.form-success-box-glyph`
- Desktop: `font-size: var(--_typography-scale---size--24)`; `line-height: 1`

#### Form Success Box Text  `.form-success-box-text`
- Desktop: `display: flex`; `flex-direction: column`; `align-items: flex-start`; `grid-row-gap: var(--_spacing---10)`; `grid-column-gap: var(--_spacing---10)`; `min-width: 0`

#### Form Success Box Title  `.form-success-box-title`
- Desktop: `text-wrap: balance`; `color: var(--_colors---brand--paper)`; `font-size: var(--_typography-scale---size--20)`; `font-weight: var(--_typography-scale---weight--semibold)`; `line-height: var(--_typography-scale---line-height--tight)`
  - ⚠ text-wrap: balance — read back; if refused, set it in the Designer
- Mobile (479, `tiny`): `font-size: var(--_typography-scale---size--18)`

#### Is Accent — combo on Form Success Box Title  `.form-success-box-title.is-accent`
- Desktop: `color: var(--_colors---brand--yellow)`

#### Form Success Box Body  `.form-success-box-body`
- Desktop: `margin-top: 0`; `margin-right: 0`; `margin-bottom: 0`; `margin-left: 0`; `color: var(--_colors---brand--paper)`; `font-size: var(--_typography-scale---size--14)`; `line-height: var(--_typography-scale---line-height--normal)`

#### Form Success Box Link  `.form-success-box-link`
- Desktop: `display: flex`; `align-items: flex-start`; `grid-row-gap: var(--_spacing---6)`; `grid-column-gap: var(--_spacing---6)`; `color: var(--_colors---brand--paper)`; `text-decoration: underline`; `text-decoration-color: var(--_colors---paper-tint--paper-48)`; `text-underline-offset: 0.25em`
- Desktop :hover: `text-decoration-color: var(--_colors---brand--yellow)`

#### Form Success Box Link Icon  `.form-success-box-link-icon`
- Desktop: `flex-grow: 0`; `flex-shrink: 0`; `flex-basis: auto`; `color: var(--_colors---brand--yellow)`; `font-size: var(--_typography-scale---size--16)`; `line-height: var(--_typography-scale---line-height--normal)`

#### Form Success Box Link Text  `.form-success-box-link-text`
- Desktop: `font-size: var(--_typography-scale---size--14)`; `line-height: var(--_typography-scale---line-height--normal)`

#### Form Success Next  `.form-success-next`
- Desktop: `display: flex`; `flex-direction: column`; `grid-row-gap: var(--_spacing---20)`; `grid-column-gap: var(--_spacing---20)`; `margin-top: var(--_spacing---32)`

#### Form Success Next Title  `.form-success-next-title`
- Desktop: `font-size: var(--_typography-scale---size--18)`; `font-weight: var(--_typography-scale---weight--bold)`; `line-height: var(--_typography-scale---line-height--compact)`

#### Form Success Step  `.form-success-step`
- Desktop: `display: flex`; `align-items: flex-start`; `grid-row-gap: var(--_spacing---16)`; `grid-column-gap: var(--_spacing---16)`

#### Form Success Step Icon  `.form-success-step-icon`
- Desktop: `flex-grow: 0`; `flex-shrink: 0`; `flex-basis: auto`; `display: flex`; `align-items: center`; `justify-content: center`; `width: var(--_spacing---40)`; `height: var(--_spacing---40)`; `border-top-left-radius: var(--_radius---pill)`; `border-top-right-radius: var(--_radius---pill)`; `border-bottom-right-radius: var(--_radius---pill)`; `border-bottom-left-radius: var(--_radius---pill)`; `background-color: var(--_colors---brand--yellow)`; `color: var(--_colors---brand--ink)`

#### Form Success Step Glyph  `.form-success-step-glyph`
- Desktop: `font-size: var(--_typography-scale---size--18)`; `line-height: 1`

#### Form Success Step Text  `.form-success-step-text`
- Desktop: `display: flex`; `flex-direction: column`; `grid-row-gap: var(--_spacing---6)`; `grid-column-gap: var(--_spacing---6)`; `min-width: 0`; `padding-top: var(--_spacing---10)`

#### Form Success Step Title  `.form-success-step-title`
- Desktop: `font-size: var(--_typography-scale---size--14)`; `font-weight: var(--_typography-scale---weight--bold)`; `line-height: var(--_typography-scale---line-height--compact)`

#### Form Success Step Body  `.form-success-step-body`
- Desktop: `margin-top: 0`; `margin-right: 0`; `margin-bottom: 0`; `margin-left: 0`; `font-size: var(--_typography-scale---size--14)`; `line-height: var(--_typography-scale---line-height--normal)`

#### Form Success Foot  `.form-success-foot`
- Desktop: `display: flex`; `flex-wrap: wrap`; `align-items: center`; `justify-content: space-between`; `grid-row-gap: var(--_spacing---8)`; `grid-column-gap: var(--_spacing---16)`; `margin-top: var(--_spacing---24)`; `padding-top: var(--_spacing---24)`; `border-top-width: var(--_spacing---hairline)`; `border-top-style: solid`; `border-top-color: var(--_colors---ink-tint--ink-12)`

#### Form Success Foot Text  `.form-success-foot-text`
- Desktop: `margin-top: 0`; `margin-right: 0`; `margin-bottom: 0`; `margin-left: 0`; `font-size: var(--_typography-scale---size--14)`; `line-height: var(--_typography-scale---line-height--normal)`

#### Form Success Foot Link  `.form-success-foot-link`
- Desktop: `display: inline-flex`; `align-items: center`; `grid-row-gap: var(--_spacing---4)`; `grid-column-gap: var(--_spacing---4)`; `color: var(--_colors---brand--accent)`; `text-decoration: none`
- Desktop :hover: `color: var(--_colors---brand--ink)`

#### Form Success Foot Icon  `.form-success-foot-icon`
- Desktop: `font-size: var(--_typography-scale---size--16)`; `line-height: 1`

#### Form Success Foot Link Text  `.form-success-foot-link-text`
- Desktop: `font-size: var(--_typography-scale---size--16)`; `font-weight: var(--_typography-scale---weight--medium)`; `line-height: var(--_typography-scale---line-height--compact)`

#### Is Accordion — combo on Service Tiles  `.service-tiles.is-accordion`
- Desktop: `align-items: start`

#### Is Accordion — combo on Service Tile  `.service-tile.is-accordion`
- Desktop: `grid-row-gap: var(--_spacing---16)`; `grid-column-gap: var(--_spacing---16)`

#### Service Tile Toggle  `.service-tile-toggle`
- Desktop: `display: flex`; `align-items: center`; `justify-content: space-between`; `grid-row-gap: var(--_spacing---16)`; `grid-column-gap: var(--_spacing---16)`; `width: 100%`; `padding-top: 0`; `padding-right: 0`; `padding-bottom: 0`; `padding-left: 0`; `border-top-style: none`; `border-right-style: none`; `border-bottom-style: none`; `border-left-style: none`; `background-color: transparent`; `color: inherit`; `font-family: inherit`; `text-align: left`; `cursor: pointer`

#### Service Tile Panel  `.service-tile-panel`
- Desktop: `transition: height 350ms cubic-bezier(0.4, 0, 0.2, 1)`
  - ⚠ transition: height 350ms cubic-bezier(0.4, 0, 0.2, 1) — read back; if refused, set it in the Designer

#### Service Tile Panel Inner  `.service-tile-panel-inner`
- Desktop: `display: flex`; `flex-direction: column`; `align-items: flex-start`; `grid-row-gap: var(--_spacing---16)`; `grid-column-gap: var(--_spacing---16)`; `padding-top: var(--_spacing---8)`

Used only in the Parliament success panel (its "Call" button):

#### Form Success Call  `.form-success-call`
- Desktop: `display: inline-flex`; `align-items: center`; `grid-row-gap: var(--_spacing---4)`; `grid-column-gap: var(--_spacing---4)`; `height: var(--_spacing---40)`; `padding-top: 0`; `padding-right: var(--_spacing---16)`; `padding-bottom: 0`; `padding-left: var(--_spacing---16)`; `border-top-left-radius: var(--_radius---8)`; `border-top-right-radius: var(--_radius---8)`; `border-bottom-right-radius: var(--_radius---8)`; `border-bottom-left-radius: var(--_radius---8)`; `background-color: var(--_colors---brand--paper)`; `color: var(--_colors---brand--accent)`; `text-decoration: none`; `transition: background-color 200ms ease`
  - ⚠ transition: background-color 200ms ease — read back; if refused, set it in the Designer
- Desktop :hover: `background-color: var(--_colors---blue-tint--blue-8)`
- Desktop :active: `background-color: var(--_colors---blue-tint--blue-16)`

#### Form Success Call Icon  `.form-success-call-icon`
- Desktop: `font-size: var(--_typography-scale---size--16)`; `line-height: 1`

#### Form Success Call Text  `.form-success-call-text`
- Desktop: `font-size: var(--_typography-scale---size--16)`; `font-weight: var(--_typography-scale---weight--medium)`; `line-height: var(--_typography-scale---line-height--compact)`

### 1.3 Native form resets (add to the classes above)

The forms are native Form Blocks (§0 item 1), so Webflow's own form
styles apply under these classes (`reference/webflow-default.css`):

| Class | Add | Why |
| --- | --- | --- |
| Clinic Form (on the FormWrapper) | `margin-bottom: 0` | `.w-form` has `margin: 0 0 15px` |
| Form Row Label | `margin-bottom: 0`, `display: block` | webflow.css `label { font-weight: bold; margin-bottom: 5px; display: block }` (the weight is already set by the class) |
| Form Check (existing class, the N/A label) | `margin-bottom: 0`, `padding-left: 0`, `font-weight: var(--_typography-scale---weight--regular)` | if the importer makes it a `.w-checkbox` (`padding-left: 20px; margin-bottom: 5px`) or a plain bold label. Changing an existing class touches the Forms docs page: check it there too |
| Form Check Input (existing) | `float: none` ⚠ only if it renders as `.w-checkbox-input` (float left, margin-left −20px) | |
| Form Input (existing) | only if the 1440 comparison shows a difference: `padding-top/bottom: 0`, `line-height: inherit` | `.w-input` adds 8px vertical padding and line-height 1.42857 (height is already fixed by Form Input) |
| Form Submit | nothing extra: its padding-top/bottom 0, `border: none` and radius cover `.w-button` | |

Error message: the Form Block's Error block takes Form Message + Is Error
(existing). `.w-form-fail` adds `margin-top: 10px`, fine as is.

### 1.4 Repo CSS (the builder adds it in the repo; not Designer-expressible)

Add to `src/styles.css`, in the section with the other `js-state` and
`designer-cant` accordion rules (around the `.faq-item.is-open` rules),
with raw fallbacks (GOTCHAS 2026-11-12, approved):

```css
/* repo-css: js-state — the location pages' service accordion (module accordion sets .is-open on the tile). */
.service-tile.is-open .faq-toggle {
  background-color: var(--_colors---brand--ink, #080829);
  color: var(--_colors---brand--paper, #fff);
}

.service-tile.is-open .faq-toggle-icon {
  transform: rotate(45deg);
}

/* repo-css: designer-cant — descendant states of the service tile toggle. */
.service-tile-toggle:hover .service-tile-name {
  color: var(--_colors---brand--accent, #1c1ce6);
}

.service-tile-toggle:active .faq-toggle {
  background-color: var(--_colors---blue-tint--blue-16, #dde2fc);
}
```

Nothing else on this page needs repo CSS: the select, date picker,
accordion, reveal and call-chooser rules are already there.

## 2. Components

| Component | Id | Where | Props / variants |
| --- | --- | --- | --- |
| G \| Components | `de3173b4-35b5-a109-fce0-5193b9bebdd9` | first child of Body | none |
| G \| Page W | `280bc82e-29bf-4fe9-0e6c-feb86b116bc6` | after G \| Components; its slot (G \| Main) takes the sections | Slot `1981457c-…` |
| C \| Button | `e6bbfb98-a077-7e52-8a94-f86f22d3c82c` | five instances in the hero (table below) | Label, Link, Icon, Icon Before, Icon After, Color `a86542c6-5252-d5d3-c097-8375248c135b` (Secondary = `e13de0db-430f-b667-aee3-d545b7e6faea`), Size `06aa6257-5dae-3b7b-75dd-7cae37a04c88` (Small = `59642798-b49d-486d-53fd-1f7e1042710d`) |
| Why Choose | `d7aa4dec-4239-16eb-b0aa-81cbfc6df4ef` | after Services | none (its "Contact Us" button is already set) |
| CTA | `25dab600-c3f8-6f46-adaf-1487aa16c392` | last section | defaults: Heading "Ready when your pet needs you", Text "A routine checkup or something that can’t wait: book online, or call or text the clinic nearest you. Both are open seven days a week.", Button label "Get in Touch", Button link `/contact-us` (§0 item 6) |
| Reviews | (to make) | after Why Choose | none; see §3.7 |

Not components: the Services section (location variant) and the FAQ
section are page sections duplicated from Home and changed (§3.5, §3.8),
because their structure or list filter differs.

### 2.1 C | Button instances in the hero

Insert each instance `before` its `data-pack-anchor` div, set the props,
then remove the anchor div. Set Color/Size with
`set_component_instance_prop_values`, `type: "string"`, the variant id
(GOTCHAS 2026-11-12).

| Anchor | Label | Link | Color | Size | Icon | Icon Before | Icon After | Visible on |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `button-1` | Get directions | Map link field (Designer, TBD-5); static fallback until then: the North York map URL; open in new tab | Secondary | Small | — | off | off | both (bound, TBD-5) |
| `button-2` | Call (416) 546-7493 | `tel:+14165467493` | Primary | Small | ri-phone-fill | on | off | North York card |
| `button-3` | Text (416) 546-7493 | `sms:+14165467493` | Secondary | Small | — | off | off | North York card |
| `button-4` | Call (647) 347-3300 | `tel:+16473473300` | Primary | Small | ri-phone-fill | on | off | Parliament card |
| `button-5` | Text (647) 347-3300 | `sms:+16473473300` | Secondary | Small | — | off | off | Parliament card |

## 3. WHTML markup, per section

Importer rules applied to all markup below (GOTCHAS, `lessons/mcp.md`):
no `<span>` (all `<div>`, so text can be bound), no `style=""`, no
`w-variant-*`/`w-*` tokens, buttons as `<i data-wftag="button">` with
`<div>` children (then `set_tag` → `button`, `remove_attribute
data-wftag`, check `type="button"` is kept), `<img>` kept only for the
class and alt (the importer drops the rest; set the asset or binding
after), Remix icons as `<i class="<class> ri-…">` (expect empty `ri-*`
combos as on Home; leave them). Comments are stripped. Every action stays
under 15 KB; sizes are given.

Section ids: the importer sometimes drops them (`lessons/mcp.md`
2026-10-13); read back `clinic` on the hero after import and set it with
`set_dom_id` if missing.

### 3.0 Shell

1. `insert_component_instance` G | Components (`append` to Body), then
   G | Page W (`append` to Body).
2. Import a plain `<div></div>` (no class) after G | Page W and use it as
   the parent for every section below; name it "To Slot" with
   `set_display_name`.
3. TBD-1: the person drags "To Slot" into G | Main and ungroups it (as
   Home's row K).

### 3.1 Location hero (one action, 4637 bytes; parent: To Slot, `append`)

Text is North York's, as placeholders; every bound text is listed in §4.
The two reach cards are North York's, then Parliament's (static on
purpose, §0 item 2). Anchors: `hours` (§3.4), `forms` (§3.3),
`button-1…5` (§2.1).

```html
<section class="section location-top" id="clinic">
        <div class="s-wrapper location-hero">
          <div class="location-main">
            <div class="location-head">
              <div class="eyebrow"><div class="eyebrow-dot"></div><div class="eyebrow-text">North York · Open late, 7 days</div></div>
              <h1 class="d2">Toronto North Animal Hospital. Your vet in North York.</h1>
              <p class="section-head-text">Toronto North Animal Hospital is a full-service, independent animal hospital on Sheppard Avenue, caring for North York’s dogs and cats since 2009. We’re open late, until 11pm Monday to Saturday and Sunday until 10pm, with same-day urgent care, in-house surgery and dental, and a team that treats your pet like family. Whether it’s a checkup or something that can’t wait, we’re easy to reach and close to home.</p>
            </div>
            <div class="location-highlights"><div class="location-highlight"><div class="location-highlight-icon"><i class="location-highlight-glyph ri-time-line" aria-hidden="true"></i></div><div class="location-highlight-text">Open late, 7 days a week</div></div><div class="location-highlight"><div class="location-highlight-icon"><i class="location-highlight-glyph ri-hospital-line" aria-hidden="true"></i></div><div class="location-highlight-text">Surgery and dental in-house</div></div><div class="location-highlight"><div class="location-highlight-icon"><i class="location-highlight-glyph ri-flashlight-line" aria-hidden="true"></i></div><div class="location-highlight-text">Same-day urgent care</div></div><div class="location-highlight"><div class="location-highlight-icon"><i class="location-highlight-glyph ri-building-2-line" aria-hidden="true"></i></div><div class="location-highlight-text">Caring for North York since 2009</div></div></div>
            <div class="location-info">
              <div class="location-info-col">
                <a class="location-info-row is-link" href="mailto:TorontoNorth@tvshospitals.com"><i class="location-info-icon ri-mail-line" aria-hidden="true"></i><div class="location-info-text">TorontoNorth@tvshospitals.com</div></a>
                <div class="location-info-row"><i class="location-info-icon ri-time-line" aria-hidden="true"></i><div class="location-info-text">Open 7 days a week</div></div>
                <div data-pack-anchor="hours"></div>
                <div class="location-status"><div class="location-status-dot"></div><div class="location-status-text">Open today</div></div>
              </div>
              <div class="location-info-col">
                <div class="location-info-row"><i class="location-info-icon ri-map-pin-2-line" aria-hidden="true"></i><div class="location-info-address"><div class="location-info-text">223 Sheppard Ave W, North York, ON M2N 1N2</div><p class="location-info-note">Getting here: just west of Yonge Street, steps from Sheppard-Yonge station.</p><div data-pack-anchor="button-1"></div></div></div>
              </div>
            </div>
            <div class="reach-card">
              <div class="reach-card-text">
                <h2 class="reach-card-title">Call or text us directly</h2>
                <p class="reach-card-lead">Prefer a quick conversation? Call or text our team at (416) 546-7493 for immediate assistance.</p>
              </div>
              <div class="reach-card-actions">
                <div data-pack-anchor="button-2"></div>
                <div data-pack-anchor="button-3"></div>
              </div>
            </div>
<div class="reach-card">
              <div class="reach-card-text">
                <h2 class="reach-card-title">Call or text us directly</h2>
                <p class="reach-card-lead">Prefer a quick conversation? Call or text our team at (647) 347-3300 for immediate assistance.</p>
              </div>
              <div class="reach-card-actions">
                <div data-pack-anchor="button-4"></div>
                <div data-pack-anchor="button-5"></div>
              </div>
            </div>
            <div class="location-video">
              <img class="location-video-poster" src="/images/locations/north-york-poster.webp" alt="A client holding a puppy in a carrier in the North York waiting room">
              <i data-wftag="button" class="location-video-play" type="button" aria-label="Play the clinic video"><div class="location-video-play-icon ri-play-fill" aria-hidden="true"></div></i>
            </div>
          </div>
          <div class="location-aside">
            <div data-pack-anchor="forms"></div>
          </div>
        </div>
      </section>
```

After the import:
- `location-video-play`: set_tag `button`, remove `data-wftag`, read back
  `type="button"` and `aria-label`.
- Email row (`Location Info Row Is Link`, a Link Block): bind its link to
  Email (mailto), then `remove_attribute href` (the importer keeps the
  static `href` as a custom attribute, GOTCHAS 2026-11-13).
- `location-video-poster`: bind the image to Poster (alt from the
  field); no static asset.

### 3.2 C | Button instances

As §2.1, five instances, then remove the five anchors.

### 3.3 Clinic forms (native Form Blocks)

Parent: the `forms` anchor's parent (`location-aside`). Import each form
`before` the anchor, then remove the anchor. Two Form Blocks, North York
first.

Per form:
1. Import the `<form>` (one action). The importer puts the form's class on
   the FormWrapper: that gives FormWrapper = Clinic Form (correct). Then
   `set_style` the FormForm to `["Clinic Form Body"]`.
2. Read back: FormForm `data-name`/name = the form name; each field's
   name (Webflow's Name setting = the `data-name` value; the published
   `name` becomes e.g. `First-Name`), `required`, `placeholder`,
   `aria-label`, `maxlength`, the `id`s (`lead-north-york-…` /
   `location-parliament-…`), every `<option>` with its value (Province 10 +
   placeholder, Type of Pet 2, the rest as in the partial), the checkbox
   `No Date of Visit`, the submit's value "Send Message" and its waiting
   text "Please wait...". `for` on the two `form-row-label`s is dropped by
   the importer: `set_attributes for=<input id>` (`lessons/mcp.md`
   2026-10-29). Fix anything else in the Designer (TBD-4).
3. Every `<i data-wftag="button">` (the 7 select toggles per form):
   `set_tag` `button`, `remove_attribute data-wftag`. Count: 7 `button`
   elements per form, 0 `data-wftag` left.
4. Success block: the Form Block's own Success element. Clear its default
   text, give it classes Form Message + Form Success, set attributes
   `tabindex="-1"`, `role="region"`, `aria-label="Form sent"`, then import
   the success roots below into it (`append`, in order).
5. Error block: classes Form Message + Is Error, `tabindex="-1"`,
   `role="region"`, `aria-label` as given, text as given.
6. If the importer did not create Success/Error blocks, stop: add the
   Form Block's states in the Designer (TBD-4) and continue from step 4.

#### Form "Lead North York" — notify TorontoNorth@tvshospitals.com

Form markup (12160 bytes):

```html
<form class="clinic-form" id="wf-form-Lead-North-York" name="wf-form-Lead-North-York" data-name="Lead North York" method="get">
    <div class="clinic-form-head"><h2 class="clinic-form-title">Contact Us</h2><div class="clinic-form-line"></div></div>
    <div class="form-group"><div class="form-group-label">Client details *</div><div class="form-grid"><div class="form-cell"><input class="form-input is-panel" type="text" maxlength="256" name="First-Name" data-name="First Name" placeholder="First Name" aria-label="First Name" id="lead-north-york-First-Name" required=""></div><div class="form-cell"><input class="form-input is-panel" type="text" maxlength="256" name="Last-Name" data-name="Last Name" placeholder="Last Name" aria-label="Last Name" id="lead-north-york-Last-Name" required=""></div><div class="form-cell is-full"><input class="form-input is-panel" type="email" maxlength="256" name="Email-Address" data-name="Email Address" placeholder="Email Address" aria-label="Email Address" id="lead-north-york-Email-Address" required=""></div><div class="form-cell is-full"><input class="form-input is-panel" type="text" maxlength="256" name="Address-Line" data-name="Address Line" placeholder="Address Line" aria-label="Address Line" id="lead-north-york-Address-Line" required=""></div><div class="form-cell is-full"><input class="form-input is-panel" type="text" maxlength="256" name="City" data-name="City" placeholder="City" aria-label="City" id="lead-north-york-City" required=""></div><div class="form-cell is-full"><div class="form-grid"><div class="form-cell"><div class="select" data-select><select class="select-native" id="lead-north-york-Province" name="Province" data-name="Province" aria-label="Province" required=""><option value="">Province</option><option value="Alberta">Alberta</option><option value="British Columbia">British Columbia</option><option value="Manitoba">Manitoba</option><option value="New Brunswick">New Brunswick</option><option value="Newfoundland and Labrador">Newfoundland and Labrador</option><option value="Nova Scotia">Nova Scotia</option><option value="Ontario">Ontario</option><option value="Prince Edward Island">Prince Edward Island</option><option value="Quebec">Quebec</option><option value="Saskatchewan">Saskatchewan</option></select><i data-wftag="button" class="form-input select-toggle is-panel" type="button" data-select-toggle><div class="select-value" data-select-value>Province</div><div class="select-icon ri-arrow-down-s-line" aria-hidden="true"></div></i><div class="select-list" data-select-list></div></div></div><div class="form-cell"><input class="form-input is-panel" type="text" maxlength="256" name="Postal-Code" data-name="Postal Code" placeholder="Postal Code" aria-label="Postal Code" id="lead-north-york-Postal-Code" required=""></div></div></div><div class="form-cell"><input class="form-input is-panel" type="tel" maxlength="256" name="Phone" data-name="Phone" placeholder="+1 ( 000) 000-00-00" aria-label="+1 ( 000) 000-00-00" id="lead-north-york-Phone" required=""></div></div></div><div class="form-group"><div class="form-group-label">Emergency contact (optional)</div><div class="form-grid"><div class="form-cell"><input class="form-input is-panel" type="text" maxlength="256" name="Emergency-Contact-Name" data-name="Emergency Contact / Name" placeholder="Name" aria-label="Name" id="lead-north-york-Emergency-Contact-Name"></div><div class="form-cell"><input class="form-input is-panel" type="tel" maxlength="256" name="Emergency-Contact-Phone" data-name="Emergency Contact / Phone" placeholder="+1 ( 000) 000-00-00" aria-label="+1 ( 000) 000-00-00" id="lead-north-york-Emergency-Contact-Phone"></div></div></div><div class="form-group"><div class="form-group-label">Patient details *</div><div class="form-grid"><div class="form-cell"><input class="form-input is-panel" type="text" maxlength="256" name="Pet-s-Name" data-name="Pet’s Name" placeholder="Pet’s Name" aria-label="Pet’s Name" id="lead-north-york-Pet-s-Name" required=""></div><div class="form-cell"><div class="select" data-select><select class="select-native" id="lead-north-york-Type-of-Pet" name="Type-of-Pet" data-name="Type of Pet" aria-label="Type of Pet" required=""><option value="">Type of Pet</option><option value="Dog">Dog</option><option value="Cat">Cat</option></select><i data-wftag="button" class="form-input select-toggle is-panel" type="button" data-select-toggle><div class="select-value" data-select-value>Type of Pet</div><div class="select-icon ri-arrow-down-s-line" aria-hidden="true"></div></i><div class="select-list" data-select-list></div></div></div><div class="form-cell"><input class="form-input is-panel" type="text" maxlength="256" name="Pet-s-Breed" data-name="Pet’s Breed" placeholder="Pet’s Breed" aria-label="Pet’s Breed" id="lead-north-york-Pet-s-Breed" required=""></div><div class="form-cell"><input class="form-input is-panel" type="text" maxlength="256" name="Pet-s-Color" data-name="Pet’s Color" placeholder="Pet’s Color" aria-label="Pet’s Color" id="lead-north-york-Pet-s-Color" required=""></div><div class="form-cell"><div class="select" data-select><select class="select-native" id="lead-north-york-Pet-s-Gender" name="Pet-s-Gender" data-name="Pet’s Gender" aria-label="Pet’s Gender" required=""><option value="">Pet’s Gender</option><option value="Male">Male</option><option value="Female">Female</option></select><i data-wftag="button" class="form-input select-toggle is-panel" type="button" data-select-toggle><div class="select-value" data-select-value>Pet’s Gender</div><div class="select-icon ri-arrow-down-s-line" aria-hidden="true"></div></i><div class="select-list" data-select-list></div></div></div><div class="form-cell"><div class="select" data-select><select class="select-native" id="lead-north-york-Neutered-or-Spayed" name="Neutered-or-Spayed" data-name="Neutered or Spayed" aria-label="Neutered or Spayed" required=""><option value="">Neutered or Spayed</option><option value="Yes">Yes</option><option value="No">No</option></select><i data-wftag="button" class="form-input select-toggle is-panel" type="button" data-select-toggle><div class="select-value" data-select-value>Neutered or Spayed</div><div class="select-icon ri-arrow-down-s-line" aria-hidden="true"></div></i><div class="select-list" data-select-list></div></div></div><div class="form-cell is-full"><input class="form-input is-panel" type="text" maxlength="256" name="Microchip-Number" data-name="Microchip Number" placeholder="Microchip Number (optional)" aria-label="Microchip Number (optional)" id="lead-north-york-Microchip-Number"></div><div class="form-cell is-full"><div class="form-grid"><div class="form-cell"><div class="select" data-select><select class="select-native" id="lead-north-york-Do-you-have-insurance" name="Do-you-have-insurance" data-name="Do you have insurance?" aria-label="Do you have insurance?" required=""><option value="">Do you have insurance?</option><option value="Yes">Yes</option><option value="No">No</option></select><i data-wftag="button" class="form-input select-toggle is-panel" type="button" data-select-toggle><div class="select-value" data-select-value>Do you have insurance?</div><div class="select-icon ri-arrow-down-s-line" aria-hidden="true"></div></i><div class="select-list" data-select-list></div></div></div><div class="form-cell"><input class="form-input is-panel" type="text" maxlength="256" name="Insurance-Provider" data-name="Insurance Provider" placeholder="(If Yes) Insurance Provider" aria-label="Insurance Provider" id="lead-north-york-Insurance-Provider"></div><div class="form-cell is-full"><input class="form-input is-panel" type="text" maxlength="256" name="Insurance-Policy-Number" data-name="Insurance Policy Number" placeholder="(If Yes) Insurance Policy Number" aria-label="Insurance Policy Number" id="lead-north-york-Insurance-Policy-Number"></div></div></div><div class="form-cell is-full"><input class="form-input is-panel" type="text" maxlength="256" name="Any-Medical-Information-optional" data-name="Any Medical Information (optional)" placeholder="Any Medical Information (optional)" aria-label="Any Medical Information (optional)" id="lead-north-york-Any-Medical-Information-optional"></div><div class="form-cell is-full"><div class="form-grid is-labelled"><label class="form-row-label" for="lead-north-york-Pet-s-Date-of-Birth">Pet’s Date of Birth *</label><div class="form-cell"><div class="date" data-date data-date-max="today"><input class="form-input date-input is-panel" type="text" maxlength="256" id="lead-north-york-Pet-s-Date-of-Birth" name="Pet-s-Date-of-Birth" data-name="Pet&#x27;s Date of Birth" placeholder="yyyy-mm-dd" readonly="readonly" data-date-input required=""><i class="date-icon ri-calendar-line" aria-hidden="true"></i><div class="datepicker" data-date-panel></div></div></div></div></div><div class="form-cell is-full"><div class="select" data-select><select class="select-native" id="lead-north-york-Other-Pets-in-the-household" name="Other-Pets-in-the-household" data-name="Other Pets in the household?" aria-label="Other Pets in the household? (optional)"><option value="">Other Pets in the household? (optional)</option><option value="Yes">Yes</option><option value="No">No</option></select><i data-wftag="button" class="form-input select-toggle is-panel" type="button" data-select-toggle><div class="select-value" data-select-value>Other Pets in the household? (optional)</div><div class="select-icon ri-arrow-down-s-line" aria-hidden="true"></div></i><div class="select-list" data-select-list></div></div></div></div></div><div class="form-group"><div class="form-group-label">Appointment *</div><div class="form-grid"><div class="form-cell is-full"><div class="select" data-select><select class="select-native" id="lead-north-york-Reason-for-Visit" name="Reason-for-Visit" data-name="Reason for Visit" aria-label="Reason for Visit (Optional)"><option value="">Reason for Visit (Optional)</option><option value="Vaccinations">Vaccinations</option><option value="Diagnostic">Diagnostic</option><option value="Wellness care">Wellness care</option><option value="Surgery">Surgery</option><option value="Spay and neuter services">Spay and neuter services</option><option value="Dental Care">Dental Care</option><option value="Nutrition counseling">Nutrition counseling</option><option value="Microchipping">Microchipping</option><option value="End-of-Life Care">End-of-Life Care</option><option value="Parasite prevention">Parasite prevention</option><option value="Allergy testing">Allergy testing</option><option value="Rehabilitation services">Rehabilitation services</option><option value="Preventive care">Preventive care</option><option value="Emergency care">Emergency care</option><option value="Surgical procedures">Surgical procedures</option><option value="Pharmacy">Pharmacy</option></select><i data-wftag="button" class="form-input select-toggle is-panel" type="button" data-select-toggle><div class="select-value" data-select-value>Reason for Visit (Optional)</div><div class="select-icon ri-arrow-down-s-line" aria-hidden="true"></div></i><div class="select-list" data-select-list></div></div></div><div class="form-cell is-full"><div class="form-grid is-labelled"><label class="form-row-label" for="lead-north-york-Appointment-Date">Choose a Date of Visit *</label><div class="form-cell"><div class="date" data-date data-date-min="today"><input class="form-input date-input is-panel" type="text" maxlength="256" id="lead-north-york-Appointment-Date" name="Appointment-Date" data-name="Appointment Date" placeholder="yyyy-mm-dd" readonly="readonly" data-date-input><i class="date-icon ri-calendar-line" aria-hidden="true"></i><div class="datepicker" data-date-panel></div></div><label class="form-check"><input class="form-check-input" type="checkbox" id="lead-north-york-No-Date-of-Visit" name="No-Date-of-Visit" data-name="No Date of Visit"><div>N/A</div></label></div></div></div></div></div>
    <div class="form-actions"><input class="form-submit" type="submit" value="Send Message" data-wait="Please wait..."></div>
  </form>
```

Success root 1 (1211 bytes; parent: this form's Success block, `append`):

```html
<div class="form-success-panel"><div class="form-success-head"><h3 class="form-success-title">We received your request!</h3><p class="form-success-lead">A member of our team will be contacting you soon to get your appointment set up.</p></div><div class="form-success-box is-accent"><div class="form-success-box-icon"><i class="form-success-box-glyph ri-checkbox-circle-line" aria-hidden="true"></i></div><div class="form-success-box-text"><div class="form-success-box-title is-accent">YOU ARE NOT BOOKED YET</div><p class="form-success-box-body">We’ll <strong>text/call</strong> you within 1 business day to confirm your date and time.</p></div></div><div class="form-success-box"><div class="form-success-box-icon"><i class="form-success-box-glyph ri-map-pin-2-line" aria-hidden="true"></i></div><div class="form-success-box-text"><div class="form-success-box-title">Toronto North LOCATION - North York</div><a class="form-success-box-link" href="https://share.google/ulI7h2uVlY2PpVva0" target="_blank" rel="noopener"><i class="form-success-box-link-icon ri-map-pin-2-fill" aria-hidden="true"></i><div class="form-success-box-link-text">223 Sheppard Ave W, North York, ON M2N 1N2</div></a></div></div></div>
```

Success root 2 (1320 bytes; parent: this form's Success block, `append`):

```html
<div class="form-success-next"><div class="form-success-next-title">What happens next</div><div class="form-success-step"><div class="form-success-step-icon"><i class="form-success-step-glyph ri-phone-line" aria-hidden="true"></i></div><div class="form-success-step-text"><div class="form-success-step-title">WE’LL TEXT YOU OR GIVE YOU A CALL</div><p class="form-success-step-body">A TVS team member will reach out to the phone number you provided, usually within 1 business day.</p></div></div><div class="form-success-step"><div class="form-success-step-icon"><i class="form-success-step-glyph ri-question-answer-line" aria-hidden="true"></i></div><div class="form-success-step-text"><div class="form-success-step-title">WE CONFIRM THE DETAILS</div><p class="form-success-step-body">We’ll go over your pet’s needs, answer any questions, and find the best time.</p></div></div><div class="form-success-step"><div class="form-success-step-icon"><i class="form-success-step-glyph ri-calendar-check-line" aria-hidden="true"></i></div><div class="form-success-step-text"><div class="form-success-step-title">YOUR APPOINTMENT IS BOOKED</div><p class="form-success-step-body">Once everything is confirmed, you’re officially scheduled. We’ll send you the registration form and the confirmation.</p></div></div></div>
```

Success root 3 (348 bytes; parent: this form's Success block, `append`):

```html
<div class="form-success-foot"><p class="form-success-foot-text"><strong>Need to reach us sooner?</strong> Give us a call directly.</p><a class="form-success-foot-link" href="tel:+14165467493"><i class="form-success-foot-icon ri-phone-line" aria-hidden="true"></i><div class="form-success-foot-link-text">Call or text (416) 546-7493</div></a></div>
```

Error block text: "Oops! Something went wrong while submitting the form." · `aria-label="Lead North York failure"`

#### Form "Registration - Parliament" — notify Parliament@tvshospitals.com

Form markup (12302 bytes):

```html
<form class="clinic-form" id="wf-form-Registration---Parliament" name="wf-form-Registration---Parliament" data-name="Registration - Parliament" method="get">
    <div class="clinic-form-head"><h2 class="clinic-form-title">Contact Us</h2><div class="clinic-form-line"></div></div>
    <div class="form-group"><div class="form-group-label">Client details *</div><div class="form-grid"><div class="form-cell"><input class="form-input is-panel" type="text" maxlength="256" name="First-Name" data-name="First Name" placeholder="First Name" aria-label="First Name" id="location-parliament-First-Name" required=""></div><div class="form-cell"><input class="form-input is-panel" type="text" maxlength="256" name="Last-Name" data-name="Last Name" placeholder="Last Name" aria-label="Last Name" id="location-parliament-Last-Name" required=""></div><div class="form-cell is-full"><input class="form-input is-panel" type="email" maxlength="256" name="Email-Address" data-name="Email Address" placeholder="Email Address" aria-label="Email Address" id="location-parliament-Email-Address" required=""></div><div class="form-cell is-full"><input class="form-input is-panel" type="text" maxlength="256" name="Address-Line" data-name="Address Line" placeholder="Address Line" aria-label="Address Line" id="location-parliament-Address-Line" required=""></div><div class="form-cell is-full"><input class="form-input is-panel" type="text" maxlength="256" name="City" data-name="City" placeholder="City" aria-label="City" id="location-parliament-City" required=""></div><div class="form-cell is-full"><div class="form-grid"><div class="form-cell"><div class="select" data-select><select class="select-native" id="location-parliament-Province" name="Province" data-name="Province" aria-label="Province" required=""><option value="">Province</option><option value="Alberta">Alberta</option><option value="British Columbia">British Columbia</option><option value="Manitoba">Manitoba</option><option value="New Brunswick">New Brunswick</option><option value="Newfoundland and Labrador">Newfoundland and Labrador</option><option value="Nova Scotia">Nova Scotia</option><option value="Ontario">Ontario</option><option value="Prince Edward Island">Prince Edward Island</option><option value="Quebec">Quebec</option><option value="Saskatchewan">Saskatchewan</option></select><i data-wftag="button" class="form-input select-toggle is-panel" type="button" data-select-toggle><div class="select-value" data-select-value>Province</div><div class="select-icon ri-arrow-down-s-line" aria-hidden="true"></div></i><div class="select-list" data-select-list></div></div></div><div class="form-cell"><input class="form-input is-panel" type="text" maxlength="256" name="Postal-Code" data-name="Postal Code" placeholder="Postal Code" aria-label="Postal Code" id="location-parliament-Postal-Code" required=""></div></div></div><div class="form-cell"><input class="form-input is-panel" type="tel" maxlength="256" name="Phone" data-name="Phone" placeholder="+1 ( 000) 000-00-00" aria-label="+1 ( 000) 000-00-00" id="location-parliament-Phone" required=""></div></div></div><div class="form-group"><div class="form-group-label">Emergency contact (optional)</div><div class="form-grid"><div class="form-cell"><input class="form-input is-panel" type="text" maxlength="256" name="Emergency-Contact-Name" data-name="Emergency Contact / Name" placeholder="Name" aria-label="Name" id="location-parliament-Emergency-Contact-Name"></div><div class="form-cell"><input class="form-input is-panel" type="tel" maxlength="256" name="Emergency-Contact-Phone" data-name="Emergency Contact / Phone" placeholder="+1 ( 000) 000-00-00" aria-label="+1 ( 000) 000-00-00" id="location-parliament-Emergency-Contact-Phone"></div></div></div><div class="form-group"><div class="form-group-label">Patient details *</div><div class="form-grid"><div class="form-cell"><input class="form-input is-panel" type="text" maxlength="256" name="Pet-s-Name" data-name="Pet’s Name" placeholder="Pet’s Name" aria-label="Pet’s Name" id="location-parliament-Pet-s-Name" required=""></div><div class="form-cell"><div class="select" data-select><select class="select-native" id="location-parliament-Type-of-Pet" name="Type-of-Pet" data-name="Type of Pet" aria-label="Type of Pet" required=""><option value="">Type of Pet</option><option value="Dog">Dog</option><option value="Cat">Cat</option></select><i data-wftag="button" class="form-input select-toggle is-panel" type="button" data-select-toggle><div class="select-value" data-select-value>Type of Pet</div><div class="select-icon ri-arrow-down-s-line" aria-hidden="true"></div></i><div class="select-list" data-select-list></div></div></div><div class="form-cell"><input class="form-input is-panel" type="text" maxlength="256" name="Pet-s-Breed" data-name="Pet’s Breed" placeholder="Pet’s Breed" aria-label="Pet’s Breed" id="location-parliament-Pet-s-Breed" required=""></div><div class="form-cell"><input class="form-input is-panel" type="text" maxlength="256" name="Pet-s-Color" data-name="Pet’s Color" placeholder="Pet’s Color" aria-label="Pet’s Color" id="location-parliament-Pet-s-Color" required=""></div><div class="form-cell"><div class="select" data-select><select class="select-native" id="location-parliament-Pet-s-Gender" name="Pet-s-Gender" data-name="Pet’s Gender" aria-label="Pet’s Gender" required=""><option value="">Pet’s Gender</option><option value="Male">Male</option><option value="Female">Female</option></select><i data-wftag="button" class="form-input select-toggle is-panel" type="button" data-select-toggle><div class="select-value" data-select-value>Pet’s Gender</div><div class="select-icon ri-arrow-down-s-line" aria-hidden="true"></div></i><div class="select-list" data-select-list></div></div></div><div class="form-cell"><div class="select" data-select><select class="select-native" id="location-parliament-Neutered-or-Spayed" name="Neutered-or-Spayed" data-name="Neutered or Spayed" aria-label="Neutered or Spayed" required=""><option value="">Neutered or Spayed</option><option value="Yes">Yes</option><option value="No">No</option></select><i data-wftag="button" class="form-input select-toggle is-panel" type="button" data-select-toggle><div class="select-value" data-select-value>Neutered or Spayed</div><div class="select-icon ri-arrow-down-s-line" aria-hidden="true"></div></i><div class="select-list" data-select-list></div></div></div><div class="form-cell is-full"><input class="form-input is-panel" type="text" maxlength="256" name="Microchip-Number" data-name="Microchip Number" placeholder="Microchip Number (optional)" aria-label="Microchip Number (optional)" id="location-parliament-Microchip-Number"></div><div class="form-cell is-full"><div class="form-grid"><div class="form-cell"><div class="select" data-select><select class="select-native" id="location-parliament-Do-you-have-insurance" name="Do-you-have-insurance" data-name="Do you have insurance?" aria-label="Do you have insurance?" required=""><option value="">Do you have insurance?</option><option value="Yes">Yes</option><option value="No">No</option></select><i data-wftag="button" class="form-input select-toggle is-panel" type="button" data-select-toggle><div class="select-value" data-select-value>Do you have insurance?</div><div class="select-icon ri-arrow-down-s-line" aria-hidden="true"></div></i><div class="select-list" data-select-list></div></div></div><div class="form-cell"><input class="form-input is-panel" type="text" maxlength="256" name="Insurance-Provider" data-name="Insurance Provider" placeholder="(If Yes) Insurance Provider" aria-label="Insurance Provider" id="location-parliament-Insurance-Provider"></div><div class="form-cell is-full"><input class="form-input is-panel" type="text" maxlength="256" name="Insurance-Policy-Number" data-name="Insurance Policy Number" placeholder="(If Yes) Insurance Policy Number" aria-label="Insurance Policy Number" id="location-parliament-Insurance-Policy-Number"></div></div></div><div class="form-cell is-full"><input class="form-input is-panel" type="text" maxlength="256" name="Any-Medical-Information-optional" data-name="Any Medical Information (optional)" placeholder="Any Medical Information (optional)" aria-label="Any Medical Information (optional)" id="location-parliament-Any-Medical-Information-optional"></div><div class="form-cell is-full"><div class="form-grid is-labelled"><label class="form-row-label" for="location-parliament-Pet-s-Date-of-Birth">Pet’s Date of Birth *</label><div class="form-cell"><div class="date" data-date data-date-max="today"><input class="form-input date-input is-panel" type="text" maxlength="256" id="location-parliament-Pet-s-Date-of-Birth" name="Pet-s-Date-of-Birth" data-name="Pet&#x27;s Date of Birth" placeholder="yyyy-mm-dd" readonly="readonly" data-date-input required=""><i class="date-icon ri-calendar-line" aria-hidden="true"></i><div class="datepicker" data-date-panel></div></div></div></div></div><div class="form-cell is-full"><div class="select" data-select><select class="select-native" id="location-parliament-Other-Pets-in-the-household" name="Other-Pets-in-the-household" data-name="Other Pets in the household?" aria-label="Other Pets in the household? (optional)"><option value="">Other Pets in the household? (optional)</option><option value="Yes">Yes</option><option value="No">No</option></select><i data-wftag="button" class="form-input select-toggle is-panel" type="button" data-select-toggle><div class="select-value" data-select-value>Other Pets in the household? (optional)</div><div class="select-icon ri-arrow-down-s-line" aria-hidden="true"></div></i><div class="select-list" data-select-list></div></div></div></div></div><div class="form-group"><div class="form-group-label">Appointment *</div><div class="form-grid"><div class="form-cell is-full"><div class="select" data-select><select class="select-native" id="location-parliament-Reason-for-Visit" name="Reason-for-Visit" data-name="Reason for Visit" aria-label="Reason for Visit (Optional)"><option value="">Reason for Visit (Optional)</option><option value="Vaccinations">Vaccinations</option><option value="Diagnostic">Diagnostic</option><option value="Wellness care">Wellness care</option><option value="Surgery">Surgery</option><option value="Spay and neuter services">Spay and neuter services</option><option value="Dental Care">Dental Care</option><option value="Nutrition counseling">Nutrition counseling</option><option value="Microchipping">Microchipping</option><option value="End-of-Life Care">End-of-Life Care</option><option value="Parasite prevention">Parasite prevention</option><option value="Allergy testing">Allergy testing</option><option value="Rehabilitation services">Rehabilitation services</option><option value="Preventive care">Preventive care</option><option value="Emergency care">Emergency care</option><option value="Surgical procedures">Surgical procedures</option><option value="Pharmacy">Pharmacy</option></select><i data-wftag="button" class="form-input select-toggle is-panel" type="button" data-select-toggle><div class="select-value" data-select-value>Reason for Visit (Optional)</div><div class="select-icon ri-arrow-down-s-line" aria-hidden="true"></div></i><div class="select-list" data-select-list></div></div></div><div class="form-cell is-full"><div class="form-grid is-labelled"><label class="form-row-label" for="location-parliament-Appointment-Date">Choose a Date of Visit *</label><div class="form-cell"><div class="date" data-date data-date-min="today"><input class="form-input date-input is-panel" type="text" maxlength="256" id="location-parliament-Appointment-Date" name="Appointment-Date" data-name="Appointment Date" placeholder="yyyy-mm-dd" readonly="readonly" data-date-input><i class="date-icon ri-calendar-line" aria-hidden="true"></i><div class="datepicker" data-date-panel></div></div><label class="form-check"><input class="form-check-input" type="checkbox" id="location-parliament-No-Date-of-Visit" name="No-Date-of-Visit" data-name="No Date of Visit"><div>N/A</div></label></div></div></div></div></div>
    <div class="form-actions"><input class="form-submit" type="submit" value="Send Message" data-wait="Please wait..."></div>
  </form>
```

Success root 1 (1566 bytes; parent: this form's Success block, `append`):

```html
<div class="form-success-panel"><div class="form-success-head"><h3 class="form-success-title">We received your registration form!</h3><p class="form-success-lead">Please call, text, or email us after submitting this form to book your appointment. Our team will not contact you automatically.</p></div><div class="form-success-box is-accent"><div class="form-success-box-icon"><i class="form-success-box-glyph ri-checkbox-circle-line" aria-hidden="true"></i></div><div class="form-success-box-text"><div class="form-success-box-title is-accent">YOU ARE NOT BOOKED YET, CONTACT US TO BOOK YOUR APPOINTMENT</div><p class="form-success-box-body">Please <strong>call, text, or email us after submitting this form</strong> to book your appointment.</p><a class="form-success-call" href="tel:+16473473300"><i class="form-success-call-icon ri-phone-line" aria-hidden="true"></i><div class="form-success-call-text">Call or text (647) 347-3300</div></a></div></div><div class="form-success-box"><div class="form-success-box-icon"><i class="form-success-box-glyph ri-map-pin-2-line" aria-hidden="true"></i></div><div class="form-success-box-text"><div class="form-success-box-title">Parliament LOCATION - Downtown Toronto</div><a class="form-success-box-link" href="https://www.google.com/maps/dir/?api=1&amp;destination=584+Parliament+St,+Toronto,+ON+M4X+1P8" target="_blank" rel="noopener"><i class="form-success-box-link-icon ri-map-pin-2-fill" aria-hidden="true"></i><div class="form-success-box-link-text">584 Parliament St, Toronto, ON M4X 1P8</div></a></div></div></div>
```

Success root 2 (1382 bytes; parent: this form's Success block, `append`):

```html
<div class="form-success-next"><div class="form-success-next-title">What happens next</div><div class="form-success-step"><div class="form-success-step-icon"><i class="form-success-step-glyph ri-phone-line" aria-hidden="true"></i></div><div class="form-success-step-text"><div class="form-success-step-title">CALL, TEXT, OR EMAIL US</div><p class="form-success-step-body">Call, text, or email our team to let us know you’ve completed the registration form and would like to book or confirm an appointment.</p></div></div><div class="form-success-step"><div class="form-success-step-icon"><i class="form-success-step-glyph ri-question-answer-line" aria-hidden="true"></i></div><div class="form-success-step-text"><div class="form-success-step-title">WE’LL REVIEW THE DETAILS WITH YOU</div><p class="form-success-step-body">Our team will discuss your pet’s needs, answer your questions, and help find an appropriate appointment time on the call.</p></div></div><div class="form-success-step"><div class="form-success-step-icon"><i class="form-success-step-glyph ri-calendar-check-line" aria-hidden="true"></i></div><div class="form-success-step-text"><div class="form-success-step-title">WE CONFIRM YOUR APPOINTMENT</div><p class="form-success-step-body">Your appointment is only booked once a TVS Hospitals team member confirms the date and time with you.</p></div></div></div>
```

Error block text: "Oops! Something went wrong while submitting the form." · `aria-label="Registration - Parliament failure"`

### 3.4 Hours (Rich Text)

Build a Rich Text with `data_element_builder` `before` the `hours` anchor
(the importer's rich-text handling is untested here), class Location
Hours, bind it to Hours (`7411c83e25d69da4fc0246017b0d4ddb`), then remove
the anchor. The new Rich Text comes with sample content; the binding
replaces it (check the canvas). Child style `p` as in §1.2.

### 3.5 Services, location variant (duplicate Home's, then restructure)

Home's section already has the ten "Icon · <service>" SVG blocks with
their `Current Service is any […]` conditions, the Service colour text
colour and the Tile tags condition, all Designer work (MANUAL-TODO O, P).
Rebuilding them would repeat 20 Designer steps, so duplicate:

- API route (try first): `transform_element_to_component` on Home's
  Services `section` with `replace: false` and a temporary name
  "TMP Services"; `insert_component_instance` on the template (append to
  To Slot); `unlink_component_instance`; `unregister_component` TMP
  Services. Check Home is unchanged (still a plain section, list bound,
  icons' conditions present).
- If any step fails or the conditions don't survive: TBD-7 (the person
  copies Home's Services section and pastes it into To Slot).

Then, on the copy (Collection List source Services, sort Sort order as on
Home, MANUAL-TODO N):

1. Service Tiles (the DynamoList, Home id `…256a`): add combo Is Accordion;
   `set_attributes` `data-accordion=""` (keep `data-reveal-stagger`).
2. Service Tile (DynamoItem): combo Is Accordion; `data-accordion-item=""`.
3. Import into the item (`prepend`):
   ```html
   <i data-wftag="button" class="service-tile-toggle" type="button" data-accordion-toggle><div class="faq-toggle"><div class="faq-toggle-icon ri-add-line" aria-hidden="true"></div></div></i>
   ```
   `set_tag` `button`, `remove_attribute data-wftag`.
4. `move_element` Service Tile Name Row into the toggle (`prepend`).
5. Service Tile Name is an `h3` on Home; a heading inside a `<button>` is
   invalid and loses its role. Import
   `<div class="service-tile-name">Diagnostics</div>` `after` the h3, bind
   its text to Name, remove the h3.
6. `move_element` Service Tags `after` the toggle.
7. Import `after` Service Tags:
   ```html
   <div class="service-tile-panel" data-accordion-panel><div class="service-tile-panel-inner"></div></div>
   ```
8. `move_element` Service Tile Text, then the "Learn more" C | Button
   instance (it keeps its Link → Services URL Path binding, Secondary,
   Small, Icon After `ri-arrow-right-s-line`) into Service Tile Panel
   Inner, in that order.
9. Remove the now-empty Service Tile Head.
10. The section head ("Our Services" / "Veterinary services for dogs and
    cats" / intro) and the "We have more to offer" banner stay as Home's
    (same text in the prototype).

Resulting item: Service Tile Is Accordion › [button Service Tile Toggle ›
Name Row (Icon ×10, Name) + Faq Toggle] + Service Tags + Service Tile
Panel › Inner › (Text, Learn more). The Name Row and Icons are `div`s
inside the `<button>`: valid enough for browsers, but `wf:html` may flag
it; leave it unless the person wants spans.

Without JS (Designer canvas, no-JS visitors) every panel stays open: the
module sets `overflow: hidden` and the height only when it runs.

### 3.6 Why Choose

`insert_component_instance` Why Choose, `append` to To Slot.

### 3.7 Reviews

If a component "Reviews" exists (Services template build), insert it.
Otherwise `transform_element_to_component` on Home's Reviews `section`
(`section.is-dark` holding `S Wrapper Reviews` `7388943e-…fb42`) with
`replace: true`, name "Reviews", group "Sections", description "What pet
owners say: the review cards slider (modules slider, review-modal). Used
on Home, the service and location pages." Check Home still renders and the
slider and modal work on staging, then insert an instance here. The review
modal images are found by class (GOTCHAS 2026-11-13), so a second copy on
the page isn't an issue; a component keeps one copy per page anyway.

### 3.8 FAQ (duplicate Home's, then change the list)

Same duplication route as §3.5 (TMP FAQ), or TBD-7. Then:

1. Section head: eyebrow "FAQ", H2 "Common questions" (as Home), text
   "About visiting " + the item's Name (TBD-5; until then the static
   North York text with a `data-manual-todo` Caption, see §5), button
   "Get in Touch" Secondary → `/contact-us` (as Home).
2. Collection List (Faq List, `data-accordion` on the DynamoWrapper as on
   Home): remove the `Show on home = On` filter, add `Location = Current
   Location` (TBD-6; a reference filter to the current item is
   Designer-only), sort Sort order ascending.
3. Locations have 12 location FAQs between them (cms-batch); check each
   item shows only its own.

### 3.9 CTA

`insert_component_instance` CTA, `append` to To Slot; props as §2.

## 4. CMS bindings

Collection Locations `6af7416f18d49df547956a48`. Bind text with
`set_settings` key `text` and a `cms` binding (field ids from
`get_bindable_sources`; ids below from `get_collection_details`). After
binding any imported link, remove its static `href` custom attribute
(GOTCHAS 2026-11-13).

| Element (class) | Field (slug · id) | How |
| --- | --- | --- |
| Eyebrow Text (hero) | Hero eyebrow `hero-eyebrow` · `ffe34e2f…` | API |
| H1 (D2) | Hero H1 `hero-h1` · `4e5b88a0…` | API |
| Section Head Text (hero) | Hero intro `hero-intro` · `03976907…` | API |
| Location Highlight Text ×4 | Highlight 1–4 `highlight-1`…`highlight-4` · `ebf7ad50…`, `b7a67f17…`, `c9f9e2e3…`, `66718e51…` | API |
| Location Info Row Is Link (email link) | Email `email` · `ad4250e0…` (mailto) | API link binding; if refused, Designer (TBD-5) |
| Location Info Text in the email row | Email | Designer only: a text can't take an Email/Phone field through the API (as MANUAL-TODO R) — TBD-5 |
| Location Info Text (address) | Address `address` · `06772833…` | API |
| Location Info Note | Directions note `directions-note` · `6ca2e04d…` | API |
| Location Hours (Rich Text) | Hours `hours` · `7411c83e…` | API |
| C \| Button `button-1` Link prop | Map link `map-link` · `9962fbe1…`, new tab | Designer (link prop to a field, as MANUAL-TODO Q) — TBD-5 |
| Location Video Poster (Image) | Poster `poster` · `315e40ae…` | API (`assetId`-style CMS binding) or Designer |
| FAQ head text | "About visiting " + Name | Designer (inline field) — TBD-5; fallback: "About visiting this clinic." |
| Page settings: title, description, OG | Meta title `meta-title`, Meta description `meta-description`, Open Graph image `open-graph-image` | Designer — TBD-2 |

Static on purpose (no field): "Open 7 days a week" row, "Open today"
status, the four highlight icons (`ri-time-line`, `ri-hospital-line`,
`ri-flashlight-line`, `ri-building-2-line` — position, not item, decides
them), the two reach cards, both forms and their success panels.

Not bound: Name (only in the FAQ head), Area/Nav label, Card fields,
Illustration, Card photo, Sort order (used on Home, nav, Contact), Phone
and Text number (static reach cards, §0 item 2), Video (visibility only),
CTA heading/text (§0 item 6).

Lists on this page:

| List | Source | Filter | Sort | Limit |
| --- | --- | --- | --- | --- |
| Services (Service Tiles Is Accordion) | Services | none | Sort order, ascending | none (10) |
| FAQ (Faq List) | FAQs | Location = Current Location | Sort order, ascending | none |
| Reviews (inside the component) | Reviews | as Home | as Home | as Home |
| CTA gallery (inside CTA) | Gallery | as Home | as Home | as Home |

Conditional visibility (all Designer; TBD-3):

| Element | Condition |
| --- | --- |
| Location Video | Video is set (hidden on both items today) |
| Reach Card (first, North York numbers) | the North York item only (§0 item 3) |
| Reach Card (second, Parliament numbers) | the Parliament item only |
| Form Block "Lead North York" | the North York item only |
| Form Block "Registration - Parliament" | the Parliament item only |
| Service Tags (inside the copied list) | Tile tags is set (comes with Home's copy) |
| Icon · <service> ×10 | Current Service is any [service] (comes with Home's copy) |

A hidden element still publishes with `w-condition-invisible`
(display: none): both forms are in the HTML on each page. Their ids
differ (`lead-north-york-…`, `location-parliament-…`) and a hidden form
is never submitted, so `required` fields don't interfere.

## 5. Manual Designer steps (new MANUAL-TODO rows)

Letters are TBD: the builder gives them the next free letters (after S)
when adding them to `MANUAL-TODO.md`. Each row that leaves something
visibly unfinished also gets a `data-manual-todo` Caption next to the
element (MANUAL-TODO's marker rule), removed when the row is done.

| ID | Where (page › element or class) | Breakpoint | Set | Why the API can't | Done |
| --- | --- | --- | --- | --- | --- |
| TBD-1 | Locations Template › the "To Slot" wrapper | — | Drag it into G \| Page W's G \| Main slot and ungroup it (as K) | The API can't start a slot's content | ☐ |
| TBD-2 | Locations Template › Page settings | — | SEO title ← Meta title, Meta description ← Meta description; Open Graph title/description copied from SEO; Open Graph image ← Open Graph image (both empty today: fill them or rely on the site default share image) | Template SEO and OG bindings are Designer settings | ☐ |
| TBD-3 | Locations Template › Location Video; both Reach Cards; both Form Blocks | — | Conditional visibility per §4 (forms and cards: per item, §0 item 3) | The API has no conditional visibility | ☐ |
| TBD-4 | Locations Template › Form "Lead North York", Form "Registration - Parliament" › Form settings | — | Form name exactly "Lead North York" / "Registration - Parliament"; notification "Send to" TorontoNorth@tvshospitals.com / Parliament@tvshospitals.com (site Forms settings or the form's settings, as the plan allows); check field names, required, select options, the checkbox, the submit's waiting text "Please wait..."; Success and Error states present | Form names, notification addresses and native field settings are not writable through the API | ☐ |
| TBD-5 | Locations Template › email row text; C \| Button `button-1` Link; FAQ head text | — | Email text ← Email; Get directions Link prop ← Map link (open in new tab); FAQ head "About visiting " + Name inline (fallback text in §4) | Email/Phone fields bind to text, and link props bind to fields, only in the Designer | ☐ |
| TBD-6 | Locations Template › FAQ Collection List › Settings | — | Filter: Location equals Current Location; remove Show on home; sort Sort order ascending | A reference filter to the current item is Designer-only | ☐ |
| TBD-7 | Home › Services section and FAQ section (only if the API duplication in §3.5/§3.8 fails) | — | Copy each section on Home, paste into To Slot on the Locations Template | The API can't copy elements | ☐ |

## 6. Check list (after the import, before telling the person it's done)

Classes and markup
- [ ] All §1 classes exist, read back with their breakpoint values
      (`include_breakpoints: ["medium","tiny"]`); the ⚠ values present or
      set in the Designer.
- [ ] No element with an empty class list where the markup had classes
      (the importer drops the whole list when one is missing): query by
      style for Location Hero, Location Highlight, Form Cell, Form Success
      Box, Service Tile Panel.
- [ ] `data-wftag`: 0 left on the page; `button` DOM elements: 7 per form
      (14) + 1 video play + 1 Service Tile Toggle (list template), all
      with `type="button"`.
- [ ] No stray `inline-div-*` combos; empty `ri-*` combos are expected.
- [ ] Section id `clinic` on the hero.

Forms
- [ ] After the first publish, `list_forms` shows "Lead North York" and
      "Registration - Parliament" with the live field names (26 fields
      each, as `scripts/build-forms.py`), in order.
- [ ] Each form's notification address is right (TBD-4). Submit one test
      per clinic on staging only with the person's OK, and check the
      success panel matches the prototype (`prototype` form-preview).
- [ ] Select toggles open their lists (module select), the date field
      opens the picker and writes `yyyy-mm-dd`, N/A checkbox works,
      labels' `for` point at the inputs.
- [ ] Only one form shows on each item; Turnstile loading is expected
      with a Form Block (note it for `wf:perf`).

CMS
- [ ] Both items (`/locations/north-york`, `/locations/parliament`)
      render their own eyebrow, H1, intro, highlights, email, hours,
      address, note, map link; Parliament shows its own hero copy, reach card
      and form.
- [ ] The video block is hidden on both (Video empty).
- [ ] FAQ: North York shows only North York's FAQs, Parliament only its
      own; sorted by Sort order.
- [ ] Services: 10 tiles, icons in their Service colour, tags hidden when
      empty, one tile open at a time, + turns to × and the toggle goes
      navy (repo CSS §1.4 on staging), Learn more links to
      `/services/<slug>`.
- [ ] No static `href` custom attributes left on bound links
      (`query_elements` `attribute_name: href`).
- [ ] Page title and meta description per item in the published HTML.

Layout (`pnpm wf:compare` / `wf:pass` against the prototype page)
- [ ] 1440: hero two columns, form column 30em, 64px gap; highlights and
      info in two columns.
- [ ] 991: hero stacks (form under the main column), 48px gap.
- [ ] 767: as 991.
- [ ] 479: highlights, info and form grid one column; form padding
      24/16; reach card padding 24.
- [ ] Why Choose, Reviews, CTA identical to Home.
- [ ] No `data-manual-todo` left once TBD rows are done; MANUAL-TODO rows
      added with real letters; HANDOFF Status updated.
