# Pack · Contact (`/contact-us`)

Ready-to-import pack for the Webflow build session. Prepared 2026-11-13 by a
read-only prep session (nothing was written to Webflow). Source: prototype
`prototype/contact-us/index.html`, `partials/forms/contact-north-york.html`,
`partials/forms/contact-parliament.html`, CSS `src/css/new-classes-contact.css`
and the form part of `src/css/new-classes-location.css`; Figma 684:13978
(Contact – Option B 684:16606, submitted state 684:14635).

State of the new build when this was written (read through `webflow-wf-tvs`):
no Contact page, no Form Block anywhere on the site (the style guide's Forms
page uses DOM `form` elements, which never submit to Webflow), no `contact-*`
classes, no Layout/Contact variables.

## 0. Before you start — decisions and blockers

1. **The forms must be real Form Blocks** (FormWrapper › FormForm with its
   Success and Error blocks), not a DOM `form`: the notification email, the
   form name in Form submissions and the `w-form-done` / `w-form-fail`
   switch only exist on a Form Block. The controls inside it are DOM
   elements from `<i data-wftag>` stand-ins (GOTCHAS 2026-11-12). A DOM
   `<input name>` inside a Form Block's form is sent with the submission
   (webflow.js serialises every named control in the form), but **the
   staging test in §7 must prove all 26 fields arrive** before this is
   called done. Fallback if they don't: import the controls without the
   stand-in (inside `<form>` the importer makes native Webflow fields), then
   restore `for`, classes and data attributes by hand (`lessons/mcp.md`
   2026-10-29 "Imported form controls").
2. **On live these two forms are components**, shared between Contact and
   the location pages (live forms API: "Lead North York" on Contact and
   North York, "Registration - Parliament" on Contact and Parliament, same
   form element id, `componentId` set). Recommended: make each imported form
   a component (group *Forms*, names `Form · Lead North York` and
   `Form · Registration - Parliament`, one text prop **Title**: "Contact
   North York location" here, "Contact Us" on the location pages) and reuse
   it on the Locations template, so the notification address is set once.
   The fields and success panels in `contact-*.html` and `lead-north-york.html`
   / `location-parliament.html` are identical apart from the title and the
   id prefix (diffed). Coordinate with the Locations template pack: whichever
   is imported first defines the component; ids keep the prefix of the page
   imported first.
3. **Clinic column: static for now.** The prototype marks it as a Locations
   list, but Parliament's area label here is "Downtown Toronto" while the
   Locations field Area label holds "Cabbagetown" (HANDOFF open item: a
   second label). Import it static (below); bind to a Locations list only
   once that field exists. Not a blocker for the import.
4. **Module `contact-tabs` is not in the repo yet** (`wf-tvs/src/modules/`
   has no `contact-tabs.ts`). Repo step, see §5. Until it ships, both forms
   show stacked on staging (by design: nothing is hidden without JS).
5. Notification addresses can't be read through the API (live
   `responseSettings` has no recipient); they come from HANDOFF Decisions
   2026-11-11. The Designer is the only place to set them (§6).

## 1. Classes to create first

Create every class before any import: the importer drops an element's whole
class list when one class is missing. Values are written as
`var(--<css name>)`: as `property_value` that binds the variable
(GOTCHAS 2026-11-12). Breakpoints by API id: `medium` 991, `small` 767,
`tiny` 479. Hover / pressed = pseudo `hover` / `active`.

**Already in Webflow (reuse, don't create):** Section, S Wrapper, Eyebrow,
Eyebrow Dot, Eyebrow Text, D2, Section Head Text, Form Input (+ Select
Toggle, Date Input combos), Form Check, Form Check Input, Form Message
(+ Is Error), Select, Select Native, Select Toggle, Select Value, Select Icon,
Select List, Select Option, Date, Date Input, Date Icon, Datepicker (and its
parts).

**Shared with the Locations template pack** (the clinic form and success
panel): Clinic Form … Form Success Foot Link Text below. Create them once;
if the Locations pack already did, only check them against these values.

### 1a. Variables (proposal P29, approved with the prototype)

Collection Layout, no per-mode values:

| Name | CSS name | Value |
| --- | --- | --- |
| Contact/Intro Width | `--_layout---contact--intro-width` | 28.75em (460px) |
| Contact/Switch Label Width | `--_layout---contact--switch-label-width` | 7.5em (120px) |
| Contact/Radio Size | `--_layout---contact--radio-size` | 1.375em (22px) |

Check each create result's `name` (a suffix like "-2" means rename).
Everything else used below exists (checked: spacing 2–80 and hairline,
radius 4–24 and pill, Blue 8/16, Ink 12/24/64/90, Paper 12/48, Yellow 20,
Brand Ink/Paper/Accent/Yellow, type sizes 12–28, weights, line heights,
letter spacings, Check/Size, Button/Height, role H4 and Button).

### 1b. Contact classes (page-only)

```css
/* Section › Contact Top (combo) */
padding-top: var(--_spacing---48);

/* S Wrapper › Contact (combo) */
flex-direction: row; align-items: flex-start;
column-gap / row-gap: var(--_spacing---80);
@medium: flex-direction: column; gap: var(--_spacing---48);

/* Contact Intro */
display: flex; flex-direction: column; flex: 0 0 var(--_layout---contact--intro-width)
  (grow 0, shrink 0, basis var); gap: var(--_spacing---28); min-width: 0;
@medium: flex: none (0 0 auto); align-self: stretch;

/* Contact Title */
display: flex; flex-direction: column; align-items: flex-start; gap: var(--_spacing---20);

/* Contact Divider */
width: 100%; height: var(--_spacing---hairline); background-color: var(--_colors---ink-tint--ink-12);

/* Contact Clinics */  display: flex; flex-direction: column; gap: var(--_spacing---28);
/* Contact Clinic */   display: flex; flex-direction: column; gap: var(--_spacing---12);
/* Contact Clinic Top */ display: flex; flex-direction: column; align-items: flex-start; gap: var(--_spacing---8);

/* Contact Clinic Name (h2) */
margin: 0; font-size: var(--_typography-role---size--h4); font-weight: var(--_typography-role---weight--h4);
letter-spacing: var(--_typography-role---letter-spacing--h4); line-height: var(--_typography-scale---line-height--compact);

/* Contact Rows */ display: flex; flex-direction: column; align-items: flex-start; gap: var(--_spacing---10);

/* Contact Row */
display: flex; align-items: center; gap: var(--_spacing---12); color: var(--_colors---brand--ink); text-decoration: none;
/* Contact Row › Is Top (combo) */  align-items: flex-start;
/* Contact Row › Is Link (combo) */ transition: color 200ms ease;  :hover color: var(--_colors---brand--accent);

/* Contact Row Icon (Remix <i>) */
flex: none (0 0 auto); width: var(--_spacing---16); color: var(--_colors---brand--ink);
font-size: var(--_typography-scale---size--16); line-height: 1; text-align: center;
/* Contact Row Icon › Is Large (combo) */  width: var(--_layout---check--size); font-size: var(--_typography-scale---size--18);
/* Contact Row Icon › Is Accent (combo) */ color: var(--_colors---brand--accent);

/* Contact Row Stack */ display: flex; flex-direction: column; align-items: flex-start; gap: var(--_spacing---4);
/* Contact Row Text */  font-size: var(--_typography-scale---size--16); line-height: var(--_typography-scale---line-height--compact);

/* Contact Row Link */
display: inline-flex; align-items: center; gap: var(--_spacing---8); color: var(--_colors---brand--accent);
font-size: var(--_typography-scale---size--15); font-weight: var(--_typography-scale---weight--medium);
line-height: var(--_typography-scale---line-height--compact); text-decoration: none;
:hover color: var(--_colors---brand--ink);
/* Contact Row Link Icon */
font-size: var(--_typography-scale---size--16); line-height: 1; transition: transform 200ms ease;
  (the nudge on the link's hover is repo CSS, §5)

/* Contact Row Social */
padding-left: var(--_spacing---28); color: var(--_colors---ink-tint--ink-64);
font-size: var(--_typography-scale---size--15); font-weight: var(--_typography-scale---weight--medium);
line-height: var(--_typography-scale---line-height--compact); text-decoration: none;
:hover color: var(--_colors---brand--accent);

/* Contact Forms */
display: flex; flex-direction: column; flex: 1 1 0%; gap: var(--_spacing---16); min-width: 0;
@medium: flex: none (0 0 auto); align-self: stretch;

/* Contact Switch */
display: flex; align-items: center; gap: var(--_spacing---16); padding: var(--_spacing---16) (all four);
border-radius: var(--_radius---20); background-color: var(--_colors---blue-tint--blue-8);
@small: flex-direction: column; align-items: stretch; gap: var(--_spacing---12);
@tiny:  padding: var(--_spacing---12) (all four);

/* Contact Switch Head */
flex: none (0 0 auto); width: var(--_layout---contact--switch-label-width);
@small: width: auto; padding: var(--_spacing---4) var(--_spacing---8) 0 (top 4, right 8, bottom 0, left 8);

/* Contact Switch Label */
color: var(--_colors---ink-tint--ink-64); font-size: var(--_typography-scale---size--12);
font-weight: var(--_typography-scale---weight--medium); letter-spacing: var(--_typography-scale---letter-spacing--wide);
line-height: var(--_typography-scale---line-height--compact); text-transform: uppercase;

/* Contact Options */
display: flex; flex: 1 1 0%; gap: var(--_spacing---16); min-width: 0;
@tiny: flex-direction: column; gap: var(--_spacing---10);

/* Contact Option (DOM <button>) */
display: flex; flex: 1 1 0%; align-items: center; gap: var(--_spacing---12); min-width: 0;
padding: var(--_spacing---20) (all four);
border (all sides): width var(--_spacing---2), style solid, color transparent;
border-radius: var(--_radius---20); background-color: var(--_colors---brand--paper);
color: var(--_colors---brand--ink); font-family: inherit; text-align: left; cursor: pointer;
transition: border-color 200ms ease;
:hover  border-color: var(--_colors---blue-tint--blue-16);
:active background-color: var(--_colors---blue-tint--blue-8);
@tiny: flex: none (0 0 auto); padding: var(--_spacing---16) (all four);
/* Contact Option › Is Active (combo; module contact-tabs toggles it) */
border-color (all sides): var(--_colors---brand--accent);

/* Contact Option Radio */
flex: none; display: flex; align-items: center; justify-content: center;
width / height: var(--_layout---contact--radio-size);
border (all sides): width var(--_spacing---2), style solid, color var(--_colors---ink-tint--ink-24);
border-radius: var(--_radius---pill); background-color: var(--_colors---brand--paper); transition: border-color 200ms ease;

/* Contact Option Dot */
width / height: var(--_spacing---10); border-radius: var(--_radius---pill);
background-color: var(--_colors---brand--accent); transform: scale(0); transition: transform 200ms ease;

/* Contact Option Text */ display: flex; flex-direction: column; gap: var(--_spacing---2); min-width: 0;
/* Contact Option Name */ font-size: var(--_typography-scale---size--18); font-weight: var(--_typography-scale---weight--medium); line-height: var(--_typography-scale---line-height--compact);
/* Contact Option Address */ color: var(--_colors---ink-tint--ink-64); font-size: var(--_typography-scale---size--14); line-height: var(--_typography-scale---line-height--compact);

/* Contact Panel */ min-width: 0;
```

Two more existing-class fixes (Webflow's `label` tag default is bold,
block, margin-bottom 5px; the style guide never showed it inside a real
form row):

```css
/* Form Check (existing) — add */ margin-bottom: 0; font-weight: inherit;
```

### 1c. Clinic form classes (shared with the Locations template pack)

```css
/* Clinic Form — goes on the FormWrapper (.w-form) */
margin-bottom: 0;   /* Webflow's .w-form has margin 0 0 15px */
padding: var(--_spacing---32) (all four); border-radius: var(--_radius---24);
background-color: var(--_colors---blue-tint--blue-8);
@tiny: padding: var(--_spacing---24) var(--_spacing---16) (top/bottom 24, left/right 16);

/* Clinic Form Body — goes on the FormForm (<form>) */
display: flex; flex-direction: column; gap: var(--_spacing---24); margin: 0;

/* Clinic Form Head */  display: flex; flex-direction: column; gap: var(--_spacing---16);
/* Clinic Form Line */  width: 100%; height: var(--_spacing---hairline); background-color: var(--_colors---ink-tint--ink-12);
/* Clinic Form Title (h2) */
margin: 0; font-size: var(--_typography-scale---size--28); font-weight: var(--_typography-scale---weight--regular);
letter-spacing: var(--_typography-scale---letter-spacing--snug); line-height: var(--_typography-scale---line-height--snug);

/* Form Group */ display: flex; flex-direction: column; gap: var(--_spacing---10);
/* Form Group Label */
color: var(--_colors---ink-tint--ink-64); font-size: var(--_typography-scale---size--12);
font-weight: var(--_typography-scale---weight--medium); letter-spacing: var(--_typography-scale---letter-spacing--wide);
line-height: var(--_typography-scale---line-height--compact); text-transform: uppercase;

/* Form Grid */
display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) (two columns, minmax 0/1fr);
gap: var(--_spacing---10);
@tiny: grid-template-columns: minmax(0, 1fr) (one column);
/* Form Grid › Is Labelled (combo) */ align-items: center;

/* Form Cell */ display: flex; flex-direction: column; gap: var(--_spacing---10); min-width: 0;
/* Form Cell › Is Full (combo) */ grid-column: 1 / -1 (grid child: column start 1, end -1);

/* Form Row Label (DOM <label>) */
margin-bottom: 0;   /* Webflow label default 5px */
font-size: var(--_typography-scale---size--14); font-weight: var(--_typography-scale---weight--medium);
line-height: var(--_typography-scale---line-height--compact);

/* Form Input › Is Panel (combo) */
border-color (all sides): transparent; border-radius: var(--_radius---12); background-color: var(--_colors---brand--paper);

/* Form Actions */ display: flex;
/* Form Submit (DOM <input type=submit>) */
height: var(--_layout---button--height); padding: 0 var(--_spacing---24) (left/right 24, top/bottom 0);
border: 0 (all sides, width 0); border-radius: var(--_radius---pill);
background-color: var(--_colors---brand--accent); color: var(--_colors---brand--paper); font-family: inherit;
font-size: var(--_typography-role---size--button); font-weight: var(--_typography-scale---weight--medium);
cursor: pointer; transition: background-color 200ms ease;
:hover  background-color: var(--_colors---brand--ink);
:active background-color: var(--_colors---ink-tint--ink-90);
```

### 1d. Success panel classes (shared with the Locations template pack)

Webflow shows the Success block with an inline `display: block`, so the
block itself never gets flex/gap; spacing between the panel, "What happens
next" and the foot is **margin** on the parts (as in the prototype). Flex
and gap *inside* the panel's children are fine. Raw colours #1d2b5d,
#fef5d3 and white at 10% were approved by the person on 2026-11-13 (keep
the live design).

```css
/* Form Message › Form Success (combo; on the Success block) */
padding: 0 (all four); border-radius: 0; background-color: transparent;
color: var(--_colors---brand--ink);
text-align: left;   /* Webflow's .w-form-done centres text */

/* Form Success Panel */
display: flex; flex-direction: column; gap: var(--_spacing---24); padding: var(--_spacing---24) (all four);
border-radius: var(--_radius---12); background-color: #1d2b5d; color: var(--_colors---brand--paper);
@tiny: padding: var(--_spacing---16) (all four);

/* Form Success Head */ display: flex; flex-direction: column; align-items: center; gap: var(--_spacing---8); text-align: center;
/* Form Success Title (h3) */
margin: 0; color: var(--_colors---brand--paper); font-size: var(--_typography-scale---size--24);
font-weight: var(--_typography-scale---weight--semibold); line-height: var(--_typography-scale---line-height--compact);
/* Form Success Lead (p) */
margin: 0; text-wrap: balance; color: var(--_colors---brand--paper); font-size: var(--_typography-scale---size--14);
line-height: var(--_typography-scale---line-height--normal);

/* Form Success Box */
display: flex; align-items: flex-start; gap: var(--_spacing---20); padding: var(--_spacing---16) (all four);
border (all sides): width var(--_spacing---hairline), solid, color var(--_colors---paper-tint--paper-12);
border-radius: var(--_radius---8); background-color: rgba(255, 255, 255, 0.1);
@tiny: gap: var(--_spacing---12);
/* Form Success Box › Is Accent (combo) */
border-width (all sides): var(--_spacing---2); border-color: var(--_colors---brand--yellow);
background-color: var(--_colors---yellow-tint--yellow-20);

/* Form Success Box Icon */
flex: none; display: flex; align-items: center; justify-content: center;
width / height: var(--_spacing---48); border-radius: var(--_radius---4); background-color: #fef5d3; color: var(--_colors---brand--ink);
@tiny: width / height: var(--_spacing---40);
/* Form Success Box Glyph (Remix <i>) */ font-size: var(--_typography-scale---size--24); line-height: 1;
/* Form Success Box Text */ display: flex; flex-direction: column; align-items: flex-start; gap: var(--_spacing---10); min-width: 0;
/* Form Success Box Title */
text-wrap: balance; color: var(--_colors---brand--paper); font-size: var(--_typography-scale---size--20);
font-weight: var(--_typography-scale---weight--semibold); line-height: var(--_typography-scale---line-height--tight);
@tiny: font-size: var(--_typography-scale---size--18);
/* Form Success Box Title › Is Accent (combo) */ color: var(--_colors---brand--yellow);
/* Form Success Box Body (p) */
margin: 0; color: var(--_colors---brand--paper); font-size: var(--_typography-scale---size--14);
line-height: var(--_typography-scale---line-height--normal);   /* its <strong> is bold by default (700 = Weight/Bold) */

/* Form Success Call (Parliament only; link) */
display: inline-flex; align-items: center; gap: var(--_spacing---4); height: var(--_spacing---40);
padding: 0 var(--_spacing---16); border-radius: var(--_radius---8); background-color: var(--_colors---brand--paper);
color: var(--_colors---brand--accent); text-decoration: none; transition: background-color 200ms ease;
:hover  background-color: var(--_colors---blue-tint--blue-8);
:active background-color: var(--_colors---blue-tint--blue-16);
/* Form Success Call Icon */ font-size: var(--_typography-scale---size--16); line-height: 1;
/* Form Success Call Text */
font-size: var(--_typography-scale---size--16); font-weight: var(--_typography-scale---weight--medium);
line-height: var(--_typography-scale---line-height--compact);

/* Form Success Box Link */
display: flex; align-items: flex-start; gap: var(--_spacing---6); color: var(--_colors---brand--paper);
text-decoration: underline; text-decoration-color: var(--_colors---paper-tint--paper-48); text-underline-offset: 0.25em;
:hover text-decoration-color: var(--_colors---brand--yellow);
/* Form Success Box Link Icon */
flex: none; color: var(--_colors---brand--yellow); font-size: var(--_typography-scale---size--16);
line-height: var(--_typography-scale---line-height--normal);
/* Form Success Box Link Text */ font-size: var(--_typography-scale---size--14); line-height: var(--_typography-scale---line-height--normal);

/* Form Success Next */
display: flex; flex-direction: column; gap: var(--_spacing---20); margin-top: var(--_spacing---32);
/* Form Success Next Title */
font-size: var(--_typography-scale---size--18); font-weight: var(--_typography-scale---weight--bold);
line-height: var(--_typography-scale---line-height--compact);
/* Form Success Step */ display: flex; align-items: flex-start; gap: var(--_spacing---16);
/* Form Success Step Icon */
flex: none; display: flex; align-items: center; justify-content: center; width / height: var(--_spacing---40);
border-radius: var(--_radius---pill); background-color: var(--_colors---brand--yellow); color: var(--_colors---brand--ink);
/* Form Success Step Glyph (Remix <i>) */ font-size: var(--_typography-scale---size--18); line-height: 1;
/* Form Success Step Text */
display: flex; flex-direction: column; gap: var(--_spacing---6); min-width: 0; padding-top: var(--_spacing---10);
/* Form Success Step Title */
font-size: var(--_typography-scale---size--14); font-weight: var(--_typography-scale---weight--bold);
line-height: var(--_typography-scale---line-height--compact);
/* Form Success Step Body (p) */
margin: 0; font-size: var(--_typography-scale---size--14); line-height: var(--_typography-scale---line-height--normal);

/* Form Success Foot (North York only) */
display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between;
row-gap: var(--_spacing---8); column-gap: var(--_spacing---16);
margin-top: var(--_spacing---24); padding-top: var(--_spacing---24);
border-top: width var(--_spacing---hairline), solid, color var(--_colors---ink-tint--ink-12);
/* Form Success Foot Text (p) */ margin: 0; font-size: var(--_typography-scale---size--14); line-height: var(--_typography-scale---line-height--normal);
/* Form Success Foot Link */
display: inline-flex; align-items: center; gap: var(--_spacing---4); color: var(--_colors---brand--accent); text-decoration: none;
:hover color: var(--_colors---brand--ink);
/* Form Success Foot Icon */ font-size: var(--_typography-scale---size--16); line-height: 1;
/* Form Success Foot Link Text */
font-size: var(--_typography-scale---size--16); font-weight: var(--_typography-scale---weight--medium);
line-height: var(--_typography-scale---line-height--compact);
```

Notes on the class list:
- `is-place` (on the clinic box title in the prototype) has no style and
  nothing reads it; it is **left out** of the markup below, so no class is
  needed for it.
- Remix icon `<i>` elements keep `ri-*` as a literal class attribute (GOTCHAS
  2026-11-12); the Webflow class written next to it (Contact Row Icon, Form
  Success Box Glyph, Select Icon…) renders but doesn't count as used.
  Contact Row Icon, Contact Row Link Icon, Form Success Box Glyph, Box Link
  Icon, Call Icon, Step Glyph and Foot Icon must keep one real use each
  (the class index page, or one icon set by class in the Designer) before
  anyone runs "Clean up unused styles".
- The descendant hovers and the active-tab radio are repo CSS (§5), not
  classes.

## 2. Components

| Component | Where | Notes |
| --- | --- | --- |
| G \| Page W | page shell | new page from it like Home: G \| Nav W, the G \| Main slot, G \| Footer W |
| *Locations section* | after the contact section | the shared `partials/sections/locations.html` (two clinic cards). Reuse the component the Home/Services packs make from Home's Locations section (none exists in Webflow yet: only Why Choose, CTA and Section Head are section components). If it still doesn't exist at import time, copy Home's Locations section and make it the component then. |
| Form · Lead North York (new, recommended) | North York panel | §0.2; prop Title |
| Form · Registration - Parliament (new, recommended) | Parliament panel | §0.2; prop Title |

The Contact page has no CTA section and no FAQ (prototype order: contact
section, Locations, footer).

## 3. WHTML markup

Importer-safe: every `<button>`, `<input>`, `<select>`, `<option>` and
`<label>` is an `<i data-wftag="…">` stand-in; inputs are emitted as
`<i data-wftag="input" …></i>` (void); `<span>`s are `<div>`s; the
prototype-only `data-field` and `data-collection` attributes are dropped;
`required=""` is written `required="required"` (valueless attributes do
survive — the Forms page kept `data-select=""` and `value=""` — but this
reads unambiguously). Field names, data-names, required flags, options and
their order, placeholders, ids, `maxlength`, `readonly`, the date limits and
`data-wait` are exactly the partials'. The **`<form>` stays a real `<form>`**
so the importer makes a Form Block; its class `clinic-form` lands on the
FormWrapper (`lessons/mcp.md` 2026-10-05).

Contact page, create first: `create_page` title **Contact**, slug
**contact-us** (live URL), SEO title "Contact & Book Online | TVS Animal
Hospitals Toronto", description "Book an appointment at TVS Animal
Hospitals by phone, text or online. Vet clinics in North York and
Cabbagetown, Toronto, with evening and weekend hours." (live, read
2026-11-13; Open Graph copies both, as live). Put G | Page W on it and import
into its G | Main slot (as Home, MANUAL-TODO K if the slot can't be started
by API).

### Action 1 — the section (into G | Main, first child)

The two panels are empty; the forms go into them in actions 2 and 3.

```html
<section class="section contact-top" id="contact"><div class="s-wrapper contact"><div class="contact-intro"><div class="contact-title"><div class="eyebrow"><div class="eyebrow-dot"></div><div class="eyebrow-text">Get in Touch</div></div><h1 class="d2">Contact us</h1></div><p class="section-head-text">We’d love to hear from you. Register your pet online, or contact either clinic by phone, text, or email. Both are open 7 days a week.</p><div class="contact-divider"></div><div class="contact-clinics"><div class="contact-clinic"><div class="contact-clinic-top"><div class="eyebrow"><div class="eyebrow-dot"></div><div class="eyebrow-text">North York</div></div><h2 class="contact-clinic-name">Toronto North Animal Hospital</h2></div><div class="contact-rows"><div class="contact-row is-top"><i class="contact-row-icon is-large ri-map-pin-2-fill" aria-hidden="true"></i><div class="contact-row-stack"><div class="contact-row-text">223 Sheppard Ave W, North York, ON M2N 1N2</div><a class="contact-row-link" href="https://www.google.com/maps/dir/?api=1&amp;destination=223+Sheppard+Ave+W,+North+York,+ON+M2N+1N2" target="_blank" rel="noopener">Get directions<i class="contact-row-link-icon ri-arrow-right-line" aria-hidden="true"></i></a></div></div><a class="contact-row is-link" href="tel:+14165467493"><i class="contact-row-icon is-accent ri-phone-fill" aria-hidden="true"></i><div class="contact-row-text">Call or text (416) 546-7493</div></a><a class="contact-row is-link" href="mailto:TorontoNorth@tvshospitals.com"><i class="contact-row-icon ri-mail-fill" aria-hidden="true"></i><div class="contact-row-text">TorontoNorth@tvshospitals.com</div></a><a class="contact-row-social" href="https://www.instagram.com/tvshospitals/" target="_blank" rel="noopener">@tvshospitals</a></div></div><div class="contact-clinic"><div class="contact-clinic-top"><div class="eyebrow"><div class="eyebrow-dot"></div><div class="eyebrow-text">Downtown Toronto</div></div><h2 class="contact-clinic-name">Parliament Animal Hospital</h2></div><div class="contact-rows"><div class="contact-row is-top"><i class="contact-row-icon is-large ri-map-pin-2-fill" aria-hidden="true"></i><div class="contact-row-stack"><div class="contact-row-text">584 Parliament St, Toronto, ON M4X 1P8</div><a class="contact-row-link" href="https://www.google.com/maps/dir/?api=1&amp;destination=584+Parliament+St,+Toronto,+ON+M4X+1P8" target="_blank" rel="noopener">Get directions<i class="contact-row-link-icon ri-arrow-right-line" aria-hidden="true"></i></a></div></div><a class="contact-row is-link" href="tel:+16473473300"><i class="contact-row-icon is-accent ri-phone-fill" aria-hidden="true"></i><div class="contact-row-text">Call or text (647) 347-3300</div></a><a class="contact-row is-link" href="mailto:Parliament@tvshospitals.com"><i class="contact-row-icon ri-mail-fill" aria-hidden="true"></i><div class="contact-row-text">Parliament@tvshospitals.com</div></a><a class="contact-row-social" href="https://www.instagram.com/tvshospitals/" target="_blank" rel="noopener">@tvshospitals</a></div></div></div></div><div class="contact-forms" data-contact-tabs><div class="contact-switch"><div class="contact-switch-head"><div class="contact-switch-label" id="contact-switch-label">Please select your location</div></div><div class="contact-options" data-contact-tabs-list aria-labelledby="contact-switch-label"><i data-wftag="button" class="contact-option is-active" type="button" data-contact-tab="north-york" data-contact-tab-active><div class="contact-option-radio"><div class="contact-option-dot"></div></div><div class="contact-option-text"><div class="contact-option-name">North York</div><div class="contact-option-address">223 Sheppard Ave W</div></div></i><i data-wftag="button" class="contact-option" type="button" data-contact-tab="parliament"><div class="contact-option-radio"><div class="contact-option-dot"></div></div><div class="contact-option-text"><div class="contact-option-name">Parliament</div><div class="contact-option-address">584 Parliament St</div></div></i></div></div><div class="contact-panel" id="north-york" data-contact-tab-panel="north-york"></div><div class="contact-panel" id="parliament" data-contact-tab-panel="parliament"></div></div></div></section>
```

### Action 2 — form "Lead North York" (append into `#north-york` panel)

```html
<form class="clinic-form" id="wf-form-Lead-North-York" name="wf-form-Lead-North-York" data-name="Lead North York" method="get"><div class="clinic-form-head"><h2 class="clinic-form-title">Contact North York location</h2><div class="clinic-form-line"></div></div><div class="form-group"><div class="form-group-label">Client details *</div><div class="form-grid"><div class="form-cell"><i data-wftag="input" class="form-input is-panel" type="text" maxlength="256" name="First-Name" data-name="First Name" placeholder="First Name" aria-label="First Name" id="contact-north-york-First-Name" required="required"></i></div><div class="form-cell"><i data-wftag="input" class="form-input is-panel" type="text" maxlength="256" name="Last-Name" data-name="Last Name" placeholder="Last Name" aria-label="Last Name" id="contact-north-york-Last-Name" required="required"></i></div><div class="form-cell is-full"><i data-wftag="input" class="form-input is-panel" type="email" maxlength="256" name="Email-Address" data-name="Email Address" placeholder="Email Address" aria-label="Email Address" id="contact-north-york-Email-Address" required="required"></i></div><div class="form-cell is-full"><i data-wftag="input" class="form-input is-panel" type="text" maxlength="256" name="Address-Line" data-name="Address Line" placeholder="Address Line" aria-label="Address Line" id="contact-north-york-Address-Line" required="required"></i></div><div class="form-cell is-full"><i data-wftag="input" class="form-input is-panel" type="text" maxlength="256" name="City" data-name="City" placeholder="City" aria-label="City" id="contact-north-york-City" required="required"></i></div><div class="form-cell is-full"><div class="form-grid"><div class="form-cell"><div class="select" data-select><i data-wftag="select" class="select-native" id="contact-north-york-Province" name="Province" data-name="Province" aria-label="Province" required="required"><i data-wftag="option" value="">Province</i><i data-wftag="option" value="Alberta">Alberta</i><i data-wftag="option" value="British Columbia">British Columbia</i><i data-wftag="option" value="Manitoba">Manitoba</i><i data-wftag="option" value="New Brunswick">New Brunswick</i><i data-wftag="option" value="Newfoundland and Labrador">Newfoundland and Labrador</i><i data-wftag="option" value="Nova Scotia">Nova Scotia</i><i data-wftag="option" value="Ontario">Ontario</i><i data-wftag="option" value="Prince Edward Island">Prince Edward Island</i><i data-wftag="option" value="Quebec">Quebec</i><i data-wftag="option" value="Saskatchewan">Saskatchewan</i></i><i data-wftag="button" class="form-input is-panel select-toggle" type="button" data-select-toggle><div class="select-value" data-select-value>Province</div><i class="select-icon ri-arrow-down-s-line" aria-hidden="true"></i></i><div class="select-list" data-select-list></div></div></div><div class="form-cell"><i data-wftag="input" class="form-input is-panel" type="text" maxlength="256" name="Postal-Code" data-name="Postal Code" placeholder="Postal Code" aria-label="Postal Code" id="contact-north-york-Postal-Code" required="required"></i></div></div></div><div class="form-cell"><i data-wftag="input" class="form-input is-panel" type="tel" maxlength="256" name="Phone" data-name="Phone" placeholder="+1 ( 000) 000-00-00" aria-label="+1 ( 000) 000-00-00" id="contact-north-york-Phone" required="required"></i></div></div></div><div class="form-group"><div class="form-group-label">Emergency contact (optional)</div><div class="form-grid"><div class="form-cell"><i data-wftag="input" class="form-input is-panel" type="text" maxlength="256" name="Emergency-Contact-Name" data-name="Emergency Contact / Name" placeholder="Name" aria-label="Name" id="contact-north-york-Emergency-Contact-Name"></i></div><div class="form-cell"><i data-wftag="input" class="form-input is-panel" type="tel" maxlength="256" name="Emergency-Contact-Phone" data-name="Emergency Contact / Phone" placeholder="+1 ( 000) 000-00-00" aria-label="+1 ( 000) 000-00-00" id="contact-north-york-Emergency-Contact-Phone"></i></div></div></div><div class="form-group"><div class="form-group-label">Patient details *</div><div class="form-grid"><div class="form-cell"><i data-wftag="input" class="form-input is-panel" type="text" maxlength="256" name="Pet-s-Name" data-name="Pet’s Name" placeholder="Pet’s Name" aria-label="Pet’s Name" id="contact-north-york-Pet-s-Name" required="required"></i></div><div class="form-cell"><div class="select" data-select><i data-wftag="select" class="select-native" id="contact-north-york-Type-of-Pet" name="Type-of-Pet" data-name="Type of Pet" aria-label="Type of Pet" required="required"><i data-wftag="option" value="">Type of Pet</i><i data-wftag="option" value="Dog">Dog</i><i data-wftag="option" value="Cat">Cat</i></i><i data-wftag="button" class="form-input is-panel select-toggle" type="button" data-select-toggle><div class="select-value" data-select-value>Type of Pet</div><i class="select-icon ri-arrow-down-s-line" aria-hidden="true"></i></i><div class="select-list" data-select-list></div></div></div><div class="form-cell"><i data-wftag="input" class="form-input is-panel" type="text" maxlength="256" name="Pet-s-Breed" data-name="Pet’s Breed" placeholder="Pet’s Breed" aria-label="Pet’s Breed" id="contact-north-york-Pet-s-Breed" required="required"></i></div><div class="form-cell"><i data-wftag="input" class="form-input is-panel" type="text" maxlength="256" name="Pet-s-Color" data-name="Pet’s Color" placeholder="Pet’s Color" aria-label="Pet’s Color" id="contact-north-york-Pet-s-Color" required="required"></i></div><div class="form-cell"><div class="select" data-select><i data-wftag="select" class="select-native" id="contact-north-york-Pet-s-Gender" name="Pet-s-Gender" data-name="Pet’s Gender" aria-label="Pet’s Gender" required="required"><i data-wftag="option" value="">Pet’s Gender</i><i data-wftag="option" value="Male">Male</i><i data-wftag="option" value="Female">Female</i></i><i data-wftag="button" class="form-input is-panel select-toggle" type="button" data-select-toggle><div class="select-value" data-select-value>Pet’s Gender</div><i class="select-icon ri-arrow-down-s-line" aria-hidden="true"></i></i><div class="select-list" data-select-list></div></div></div><div class="form-cell"><div class="select" data-select><i data-wftag="select" class="select-native" id="contact-north-york-Neutered-or-Spayed" name="Neutered-or-Spayed" data-name="Neutered or Spayed" aria-label="Neutered or Spayed" required="required"><i data-wftag="option" value="">Neutered or Spayed</i><i data-wftag="option" value="Yes">Yes</i><i data-wftag="option" value="No">No</i></i><i data-wftag="button" class="form-input is-panel select-toggle" type="button" data-select-toggle><div class="select-value" data-select-value>Neutered or Spayed</div><i class="select-icon ri-arrow-down-s-line" aria-hidden="true"></i></i><div class="select-list" data-select-list></div></div></div><div class="form-cell is-full"><i data-wftag="input" class="form-input is-panel" type="text" maxlength="256" name="Microchip-Number" data-name="Microchip Number" placeholder="Microchip Number (optional)" aria-label="Microchip Number (optional)" id="contact-north-york-Microchip-Number"></i></div><div class="form-cell is-full"><div class="form-grid"><div class="form-cell"><div class="select" data-select><i data-wftag="select" class="select-native" id="contact-north-york-Do-you-have-insurance" name="Do-you-have-insurance" data-name="Do you have insurance?" aria-label="Do you have insurance?" required="required"><i data-wftag="option" value="">Do you have insurance?</i><i data-wftag="option" value="Yes">Yes</i><i data-wftag="option" value="No">No</i></i><i data-wftag="button" class="form-input is-panel select-toggle" type="button" data-select-toggle><div class="select-value" data-select-value>Do you have insurance?</div><i class="select-icon ri-arrow-down-s-line" aria-hidden="true"></i></i><div class="select-list" data-select-list></div></div></div><div class="form-cell"><i data-wftag="input" class="form-input is-panel" type="text" maxlength="256" name="Insurance-Provider" data-name="Insurance Provider" placeholder="(If Yes) Insurance Provider" aria-label="Insurance Provider" id="contact-north-york-Insurance-Provider"></i></div><div class="form-cell is-full"><i data-wftag="input" class="form-input is-panel" type="text" maxlength="256" name="Insurance-Policy-Number" data-name="Insurance Policy Number" placeholder="(If Yes) Insurance Policy Number" aria-label="Insurance Policy Number" id="contact-north-york-Insurance-Policy-Number"></i></div></div></div><div class="form-cell is-full"><i data-wftag="input" class="form-input is-panel" type="text" maxlength="256" name="Any-Medical-Information-optional" data-name="Any Medical Information (optional)" placeholder="Any Medical Information (optional)" aria-label="Any Medical Information (optional)" id="contact-north-york-Any-Medical-Information-optional"></i></div><div class="form-cell is-full"><div class="form-grid is-labelled"><i data-wftag="label" class="form-row-label" for="contact-north-york-Pet-s-Date-of-Birth">Pet’s Date of Birth *</i><div class="form-cell"><div class="date" data-date data-date-max="today"><i data-wftag="input" class="form-input is-panel date-input" type="text" maxlength="256" id="contact-north-york-Pet-s-Date-of-Birth" name="Pet-s-Date-of-Birth" data-name="Pet&#x27;s Date of Birth" placeholder="yyyy-mm-dd" readonly="readonly" data-date-input required="required"></i><i class="date-icon ri-calendar-line" aria-hidden="true"></i><div class="datepicker" data-date-panel></div></div></div></div></div><div class="form-cell is-full"><div class="select" data-select><i data-wftag="select" class="select-native" id="contact-north-york-Other-Pets-in-the-household" name="Other-Pets-in-the-household" data-name="Other Pets in the household?" aria-label="Other Pets in the household? (optional)"><i data-wftag="option" value="">Other Pets in the household? (optional)</i><i data-wftag="option" value="Yes">Yes</i><i data-wftag="option" value="No">No</i></i><i data-wftag="button" class="form-input is-panel select-toggle" type="button" data-select-toggle><div class="select-value" data-select-value>Other Pets in the household? (optional)</div><i class="select-icon ri-arrow-down-s-line" aria-hidden="true"></i></i><div class="select-list" data-select-list></div></div></div></div></div><div class="form-group"><div class="form-group-label">Appointment *</div><div class="form-grid"><div class="form-cell is-full"><div class="select" data-select><i data-wftag="select" class="select-native" id="contact-north-york-Reason-for-Visit" name="Reason-for-Visit" data-name="Reason for Visit" aria-label="Reason for Visit (Optional)"><i data-wftag="option" value="">Reason for Visit (Optional)</i><i data-wftag="option" value="Vaccinations">Vaccinations</i><i data-wftag="option" value="Diagnostic">Diagnostic</i><i data-wftag="option" value="Wellness care">Wellness care</i><i data-wftag="option" value="Surgery">Surgery</i><i data-wftag="option" value="Spay and neuter services">Spay and neuter services</i><i data-wftag="option" value="Dental Care">Dental Care</i><i data-wftag="option" value="Nutrition counseling">Nutrition counseling</i><i data-wftag="option" value="Microchipping">Microchipping</i><i data-wftag="option" value="End-of-Life Care">End-of-Life Care</i><i data-wftag="option" value="Parasite prevention">Parasite prevention</i><i data-wftag="option" value="Allergy testing">Allergy testing</i><i data-wftag="option" value="Rehabilitation services">Rehabilitation services</i><i data-wftag="option" value="Preventive care">Preventive care</i><i data-wftag="option" value="Emergency care">Emergency care</i><i data-wftag="option" value="Surgical procedures">Surgical procedures</i><i data-wftag="option" value="Pharmacy">Pharmacy</i></i><i data-wftag="button" class="form-input is-panel select-toggle" type="button" data-select-toggle><div class="select-value" data-select-value>Reason for Visit (Optional)</div><i class="select-icon ri-arrow-down-s-line" aria-hidden="true"></i></i><div class="select-list" data-select-list></div></div></div><div class="form-cell is-full"><div class="form-grid is-labelled"><i data-wftag="label" class="form-row-label" for="contact-north-york-Appointment-Date">Choose a Date of Visit *</i><div class="form-cell"><div class="date" data-date data-date-min="today"><i data-wftag="input" class="form-input is-panel date-input" type="text" maxlength="256" id="contact-north-york-Appointment-Date" name="Appointment-Date" data-name="Appointment Date" placeholder="yyyy-mm-dd" readonly="readonly" data-date-input></i><i class="date-icon ri-calendar-line" aria-hidden="true"></i><div class="datepicker" data-date-panel></div></div><i data-wftag="label" class="form-check"><i data-wftag="input" class="form-check-input" type="checkbox" id="contact-north-york-No-Date-of-Visit" name="No-Date-of-Visit" data-name="No Date of Visit"></i><div>N/A</div></i></div></div></div></div></div><div class="form-actions"><i data-wftag="input" class="form-submit" type="submit" value="Send Message" data-wait="Please wait..."></i></div></form>
```

### Action 3 — form "Registration - Parliament" (append into `#parliament` panel)

```html
<form class="clinic-form" id="wf-form-Registration---Parliament" name="wf-form-Registration---Parliament" data-name="Registration - Parliament" method="get"><div class="clinic-form-head"><h2 class="clinic-form-title">Contact Parliament location</h2><div class="clinic-form-line"></div></div><div class="form-group"><div class="form-group-label">Client details *</div><div class="form-grid"><div class="form-cell"><i data-wftag="input" class="form-input is-panel" type="text" maxlength="256" name="First-Name" data-name="First Name" placeholder="First Name" aria-label="First Name" id="contact-parliament-First-Name" required="required"></i></div><div class="form-cell"><i data-wftag="input" class="form-input is-panel" type="text" maxlength="256" name="Last-Name" data-name="Last Name" placeholder="Last Name" aria-label="Last Name" id="contact-parliament-Last-Name" required="required"></i></div><div class="form-cell is-full"><i data-wftag="input" class="form-input is-panel" type="email" maxlength="256" name="Email-Address" data-name="Email Address" placeholder="Email Address" aria-label="Email Address" id="contact-parliament-Email-Address" required="required"></i></div><div class="form-cell is-full"><i data-wftag="input" class="form-input is-panel" type="text" maxlength="256" name="Address-Line" data-name="Address Line" placeholder="Address Line" aria-label="Address Line" id="contact-parliament-Address-Line" required="required"></i></div><div class="form-cell is-full"><i data-wftag="input" class="form-input is-panel" type="text" maxlength="256" name="City" data-name="City" placeholder="City" aria-label="City" id="contact-parliament-City" required="required"></i></div><div class="form-cell is-full"><div class="form-grid"><div class="form-cell"><div class="select" data-select><i data-wftag="select" class="select-native" id="contact-parliament-Province" name="Province" data-name="Province" aria-label="Province" required="required"><i data-wftag="option" value="">Province</i><i data-wftag="option" value="Alberta">Alberta</i><i data-wftag="option" value="British Columbia">British Columbia</i><i data-wftag="option" value="Manitoba">Manitoba</i><i data-wftag="option" value="New Brunswick">New Brunswick</i><i data-wftag="option" value="Newfoundland and Labrador">Newfoundland and Labrador</i><i data-wftag="option" value="Nova Scotia">Nova Scotia</i><i data-wftag="option" value="Ontario">Ontario</i><i data-wftag="option" value="Prince Edward Island">Prince Edward Island</i><i data-wftag="option" value="Quebec">Quebec</i><i data-wftag="option" value="Saskatchewan">Saskatchewan</i></i><i data-wftag="button" class="form-input is-panel select-toggle" type="button" data-select-toggle><div class="select-value" data-select-value>Province</div><i class="select-icon ri-arrow-down-s-line" aria-hidden="true"></i></i><div class="select-list" data-select-list></div></div></div><div class="form-cell"><i data-wftag="input" class="form-input is-panel" type="text" maxlength="256" name="Postal-Code" data-name="Postal Code" placeholder="Postal Code" aria-label="Postal Code" id="contact-parliament-Postal-Code" required="required"></i></div></div></div><div class="form-cell"><i data-wftag="input" class="form-input is-panel" type="tel" maxlength="256" name="Phone" data-name="Phone" placeholder="+1 ( 000) 000-00-00" aria-label="+1 ( 000) 000-00-00" id="contact-parliament-Phone" required="required"></i></div></div></div><div class="form-group"><div class="form-group-label">Emergency contact (optional)</div><div class="form-grid"><div class="form-cell"><i data-wftag="input" class="form-input is-panel" type="text" maxlength="256" name="Emergency-Contact-Name" data-name="Emergency Contact / Name" placeholder="Name" aria-label="Name" id="contact-parliament-Emergency-Contact-Name"></i></div><div class="form-cell"><i data-wftag="input" class="form-input is-panel" type="tel" maxlength="256" name="Emergency-Contact-Phone" data-name="Emergency Contact / Phone" placeholder="+1 ( 000) 000-00-00" aria-label="+1 ( 000) 000-00-00" id="contact-parliament-Emergency-Contact-Phone"></i></div></div></div><div class="form-group"><div class="form-group-label">Patient details *</div><div class="form-grid"><div class="form-cell"><i data-wftag="input" class="form-input is-panel" type="text" maxlength="256" name="Pet-s-Name" data-name="Pet’s Name" placeholder="Pet’s Name" aria-label="Pet’s Name" id="contact-parliament-Pet-s-Name" required="required"></i></div><div class="form-cell"><div class="select" data-select><i data-wftag="select" class="select-native" id="contact-parliament-Type-of-Pet" name="Type-of-Pet" data-name="Type of Pet" aria-label="Type of Pet" required="required"><i data-wftag="option" value="">Type of Pet</i><i data-wftag="option" value="Dog">Dog</i><i data-wftag="option" value="Cat">Cat</i></i><i data-wftag="button" class="form-input is-panel select-toggle" type="button" data-select-toggle><div class="select-value" data-select-value>Type of Pet</div><i class="select-icon ri-arrow-down-s-line" aria-hidden="true"></i></i><div class="select-list" data-select-list></div></div></div><div class="form-cell"><i data-wftag="input" class="form-input is-panel" type="text" maxlength="256" name="Pet-s-Breed" data-name="Pet’s Breed" placeholder="Pet’s Breed" aria-label="Pet’s Breed" id="contact-parliament-Pet-s-Breed" required="required"></i></div><div class="form-cell"><i data-wftag="input" class="form-input is-panel" type="text" maxlength="256" name="Pet-s-Color" data-name="Pet’s Color" placeholder="Pet’s Color" aria-label="Pet’s Color" id="contact-parliament-Pet-s-Color" required="required"></i></div><div class="form-cell"><div class="select" data-select><i data-wftag="select" class="select-native" id="contact-parliament-Pet-s-Gender" name="Pet-s-Gender" data-name="Pet’s Gender" aria-label="Pet’s Gender" required="required"><i data-wftag="option" value="">Pet’s Gender</i><i data-wftag="option" value="Male">Male</i><i data-wftag="option" value="Female">Female</i></i><i data-wftag="button" class="form-input is-panel select-toggle" type="button" data-select-toggle><div class="select-value" data-select-value>Pet’s Gender</div><i class="select-icon ri-arrow-down-s-line" aria-hidden="true"></i></i><div class="select-list" data-select-list></div></div></div><div class="form-cell"><div class="select" data-select><i data-wftag="select" class="select-native" id="contact-parliament-Neutered-or-Spayed" name="Neutered-or-Spayed" data-name="Neutered or Spayed" aria-label="Neutered or Spayed" required="required"><i data-wftag="option" value="">Neutered or Spayed</i><i data-wftag="option" value="Yes">Yes</i><i data-wftag="option" value="No">No</i></i><i data-wftag="button" class="form-input is-panel select-toggle" type="button" data-select-toggle><div class="select-value" data-select-value>Neutered or Spayed</div><i class="select-icon ri-arrow-down-s-line" aria-hidden="true"></i></i><div class="select-list" data-select-list></div></div></div><div class="form-cell is-full"><i data-wftag="input" class="form-input is-panel" type="text" maxlength="256" name="Microchip-Number" data-name="Microchip Number" placeholder="Microchip Number (optional)" aria-label="Microchip Number (optional)" id="contact-parliament-Microchip-Number"></i></div><div class="form-cell is-full"><div class="form-grid"><div class="form-cell"><div class="select" data-select><i data-wftag="select" class="select-native" id="contact-parliament-Do-you-have-insurance" name="Do-you-have-insurance" data-name="Do you have insurance?" aria-label="Do you have insurance?" required="required"><i data-wftag="option" value="">Do you have insurance?</i><i data-wftag="option" value="Yes">Yes</i><i data-wftag="option" value="No">No</i></i><i data-wftag="button" class="form-input is-panel select-toggle" type="button" data-select-toggle><div class="select-value" data-select-value>Do you have insurance?</div><i class="select-icon ri-arrow-down-s-line" aria-hidden="true"></i></i><div class="select-list" data-select-list></div></div></div><div class="form-cell"><i data-wftag="input" class="form-input is-panel" type="text" maxlength="256" name="Insurance-Provider" data-name="Insurance Provider" placeholder="(If Yes) Insurance Provider" aria-label="Insurance Provider" id="contact-parliament-Insurance-Provider"></i></div><div class="form-cell is-full"><i data-wftag="input" class="form-input is-panel" type="text" maxlength="256" name="Insurance-Policy-Number" data-name="Insurance Policy Number" placeholder="(If Yes) Insurance Policy Number" aria-label="Insurance Policy Number" id="contact-parliament-Insurance-Policy-Number"></i></div></div></div><div class="form-cell is-full"><i data-wftag="input" class="form-input is-panel" type="text" maxlength="256" name="Any-Medical-Information-optional" data-name="Any Medical Information (optional)" placeholder="Any Medical Information (optional)" aria-label="Any Medical Information (optional)" id="contact-parliament-Any-Medical-Information-optional"></i></div><div class="form-cell is-full"><div class="form-grid is-labelled"><i data-wftag="label" class="form-row-label" for="contact-parliament-Pet-s-Date-of-Birth">Pet’s Date of Birth *</i><div class="form-cell"><div class="date" data-date data-date-max="today"><i data-wftag="input" class="form-input is-panel date-input" type="text" maxlength="256" id="contact-parliament-Pet-s-Date-of-Birth" name="Pet-s-Date-of-Birth" data-name="Pet&#x27;s Date of Birth" placeholder="yyyy-mm-dd" readonly="readonly" data-date-input required="required"></i><i class="date-icon ri-calendar-line" aria-hidden="true"></i><div class="datepicker" data-date-panel></div></div></div></div></div><div class="form-cell is-full"><div class="select" data-select><i data-wftag="select" class="select-native" id="contact-parliament-Other-Pets-in-the-household" name="Other-Pets-in-the-household" data-name="Other Pets in the household?" aria-label="Other Pets in the household? (optional)"><i data-wftag="option" value="">Other Pets in the household? (optional)</i><i data-wftag="option" value="Yes">Yes</i><i data-wftag="option" value="No">No</i></i><i data-wftag="button" class="form-input is-panel select-toggle" type="button" data-select-toggle><div class="select-value" data-select-value>Other Pets in the household? (optional)</div><i class="select-icon ri-arrow-down-s-line" aria-hidden="true"></i></i><div class="select-list" data-select-list></div></div></div></div></div><div class="form-group"><div class="form-group-label">Appointment *</div><div class="form-grid"><div class="form-cell is-full"><div class="select" data-select><i data-wftag="select" class="select-native" id="contact-parliament-Reason-for-Visit" name="Reason-for-Visit" data-name="Reason for Visit" aria-label="Reason for Visit (Optional)"><i data-wftag="option" value="">Reason for Visit (Optional)</i><i data-wftag="option" value="Vaccinations">Vaccinations</i><i data-wftag="option" value="Diagnostic">Diagnostic</i><i data-wftag="option" value="Wellness care">Wellness care</i><i data-wftag="option" value="Surgery">Surgery</i><i data-wftag="option" value="Spay and neuter services">Spay and neuter services</i><i data-wftag="option" value="Dental Care">Dental Care</i><i data-wftag="option" value="Nutrition counseling">Nutrition counseling</i><i data-wftag="option" value="Microchipping">Microchipping</i><i data-wftag="option" value="End-of-Life Care">End-of-Life Care</i><i data-wftag="option" value="Parasite prevention">Parasite prevention</i><i data-wftag="option" value="Allergy testing">Allergy testing</i><i data-wftag="option" value="Rehabilitation services">Rehabilitation services</i><i data-wftag="option" value="Preventive care">Preventive care</i><i data-wftag="option" value="Emergency care">Emergency care</i><i data-wftag="option" value="Surgical procedures">Surgical procedures</i><i data-wftag="option" value="Pharmacy">Pharmacy</i></i><i data-wftag="button" class="form-input is-panel select-toggle" type="button" data-select-toggle><div class="select-value" data-select-value>Reason for Visit (Optional)</div><i class="select-icon ri-arrow-down-s-line" aria-hidden="true"></i></i><div class="select-list" data-select-list></div></div></div><div class="form-cell is-full"><div class="form-grid is-labelled"><i data-wftag="label" class="form-row-label" for="contact-parliament-Appointment-Date">Choose a Date of Visit *</i><div class="form-cell"><div class="date" data-date data-date-min="today"><i data-wftag="input" class="form-input is-panel date-input" type="text" maxlength="256" id="contact-parliament-Appointment-Date" name="Appointment-Date" data-name="Appointment Date" placeholder="yyyy-mm-dd" readonly="readonly" data-date-input></i><i class="date-icon ri-calendar-line" aria-hidden="true"></i><div class="datepicker" data-date-panel></div></div><i data-wftag="label" class="form-check"><i data-wftag="input" class="form-check-input" type="checkbox" id="contact-parliament-No-Date-of-Visit" name="No-Date-of-Visit" data-name="No Date of Visit"></i><div>N/A</div></i></div></div></div></div></div><div class="form-actions"><i data-wftag="input" class="form-submit" type="submit" value="Send Message" data-wait="Please wait..."></i></div></form>
```

Sizes: section 4.3 KB, each form 13.3 KB, each success panel ~3 KB: one
action each stays under the ~15 KB the importer takes.

### After actions 2 and 3, per form

1. Query the new FormWrapper (`type` FormForm's parent). Class check:
   FormWrapper = **Clinic Form**, FormForm = none → `set_style` FormForm
   **Clinic Form Body** (clear any class the importer put on it).
2. Check the FormWrapper has a Success block and an Error block. If the
   importer made none, see MANUAL-TODO row TBD-B.
3. **Success block:** `set_style` [Form Message, Form Success]; remove its
   default "Thank you!" text child; import Action 4a/4b into it.
4. **Error block:** `set_style` [Form Message, Is Error]; its text exactly
   `Oops! Something went wrong while submitting the form.` (one text child, no wrapper class).
5. Form name: Form settings must read **Lead North York** /
   **Registration - Parliament** (the `data-name` above). If the importer
   named it "Email Form", rename (TBD-A covers it if the API can't).

### Action 4a — success panel, Lead North York (into its Success block)

```html
<div class="form-success-panel"><div class="form-success-head"><h3 class="form-success-title">We received your request!</h3><p class="form-success-lead">A member of our team will be contacting you soon to get your appointment set up.</p></div><div class="form-success-box is-accent"><div class="form-success-box-icon"><i class="form-success-box-glyph ri-checkbox-circle-line" aria-hidden="true"></i></div><div class="form-success-box-text"><div class="form-success-box-title is-accent">YOU ARE NOT BOOKED YET</div><p class="form-success-box-body">We’ll <strong>text/call</strong> you within 1 business day to confirm your date and time.</p></div></div><div class="form-success-box"><div class="form-success-box-icon"><i class="form-success-box-glyph ri-map-pin-2-line" aria-hidden="true"></i></div><div class="form-success-box-text"><div class="form-success-box-title">Toronto North LOCATION - North York</div><a class="form-success-box-link" href="https://share.google/ulI7h2uVlY2PpVva0" target="_blank" rel="noopener"><i class="form-success-box-link-icon ri-map-pin-2-fill" aria-hidden="true"></i><div class="form-success-box-link-text">223 Sheppard Ave W, North York, ON M2N 1N2</div></a></div></div></div><div class="form-success-next"><div class="form-success-next-title">What happens next</div><div class="form-success-step"><div class="form-success-step-icon"><i class="form-success-step-glyph ri-phone-line" aria-hidden="true"></i></div><div class="form-success-step-text"><div class="form-success-step-title">WE’LL TEXT YOU OR GIVE YOU A CALL</div><p class="form-success-step-body">A TVS team member will reach out to the phone number you provided, usually within 1 business day.</p></div></div><div class="form-success-step"><div class="form-success-step-icon"><i class="form-success-step-glyph ri-question-answer-line" aria-hidden="true"></i></div><div class="form-success-step-text"><div class="form-success-step-title">WE CONFIRM THE DETAILS</div><p class="form-success-step-body">We’ll go over your pet’s needs, answer any questions, and find the best time.</p></div></div><div class="form-success-step"><div class="form-success-step-icon"><i class="form-success-step-glyph ri-calendar-check-line" aria-hidden="true"></i></div><div class="form-success-step-text"><div class="form-success-step-title">YOUR APPOINTMENT IS BOOKED</div><p class="form-success-step-body">Once everything is confirmed, you’re officially scheduled. We’ll send you the registration form and the confirmation.</p></div></div></div><div class="form-success-foot"><p class="form-success-foot-text"><strong>Need to reach us sooner?</strong> Give us a call directly.</p><a class="form-success-foot-link" href="tel:+14165467493"><i class="form-success-foot-icon ri-phone-line" aria-hidden="true"></i><div class="form-success-foot-link-text">Call or text (416) 546-7493</div></a></div>
```

### Action 4b — success panel, Registration - Parliament (into its Success block)

```html
<div class="form-success-panel"><div class="form-success-head"><h3 class="form-success-title">We received your registration form!</h3><p class="form-success-lead">Please call, text, or email us after submitting this form to book your appointment. Our team will not contact you automatically.</p></div><div class="form-success-box is-accent"><div class="form-success-box-icon"><i class="form-success-box-glyph ri-checkbox-circle-line" aria-hidden="true"></i></div><div class="form-success-box-text"><div class="form-success-box-title is-accent">YOU ARE NOT BOOKED YET, CONTACT US TO BOOK YOUR APPOINTMENT</div><p class="form-success-box-body">Please <strong>call, text, or email us after submitting this form</strong> to book your appointment.</p><a class="form-success-call" href="tel:+16473473300"><i class="form-success-call-icon ri-phone-line" aria-hidden="true"></i><div class="form-success-call-text">Call or text (647) 347-3300</div></a></div></div><div class="form-success-box"><div class="form-success-box-icon"><i class="form-success-box-glyph ri-map-pin-2-line" aria-hidden="true"></i></div><div class="form-success-box-text"><div class="form-success-box-title">Parliament LOCATION - Downtown Toronto</div><a class="form-success-box-link" href="https://www.google.com/maps/dir/?api=1&amp;destination=584+Parliament+St,+Toronto,+ON+M4X+1P8" target="_blank" rel="noopener"><i class="form-success-box-link-icon ri-map-pin-2-fill" aria-hidden="true"></i><div class="form-success-box-link-text">584 Parliament St, Toronto, ON M4X 1P8</div></a></div></div></div><div class="form-success-next"><div class="form-success-next-title">What happens next</div><div class="form-success-step"><div class="form-success-step-icon"><i class="form-success-step-glyph ri-phone-line" aria-hidden="true"></i></div><div class="form-success-step-text"><div class="form-success-step-title">CALL, TEXT, OR EMAIL US</div><p class="form-success-step-body">Call, text, or email our team to let us know you’ve completed the registration form and would like to book or confirm an appointment.</p></div></div><div class="form-success-step"><div class="form-success-step-icon"><i class="form-success-step-glyph ri-question-answer-line" aria-hidden="true"></i></div><div class="form-success-step-text"><div class="form-success-step-title">WE’LL REVIEW THE DETAILS WITH YOU</div><p class="form-success-step-body">Our team will discuss your pet’s needs, answer your questions, and help find an appropriate appointment time on the call.</p></div></div><div class="form-success-step"><div class="form-success-step-icon"><i class="form-success-step-glyph ri-calendar-check-line" aria-hidden="true"></i></div><div class="form-success-step-text"><div class="form-success-step-title">WE CONFIRM YOUR APPOINTMENT</div><p class="form-success-step-body">Your appointment is only booked once a TVS Hospitals team member confirms the date and time with you.</p></div></div></div>
```

### Restoring the tags (both forms and the switch)

Stand-ins in this pack: per form 20 `input`, 7 `select`, 43 `option`,
7 `button` (select toggles), 3 `label` = **80**; the switch adds 2
`button` = **162** in all.

1. `query_elements` `attribute_name: data-wftag` on the Contact page (limit
   200; paginate by `attribute_value` `input`, `select`, `option`, `button`,
   `label` if it truncates).
2. For each element: set its tag to the `data-wftag` value (element
   settings: `tag`), then `remove_attribute data-wftag`. Do `option`s before
   their `select` only if a tag change re-creates children; otherwise any
   order.
3. Count afterwards, per form: 20 `input` (15 `type=text` incl. the two
   dates, 1 `email`, 2 `tel`, 1 `checkbox`, 1 `submit`), 7 `select`,
   43 `option`, 7 `button type=button`, 3 `label`; on the page also the
   2 switch `button type=button`. No `data-wftag` left on the page.
4. Read back on a sample per kind: `name`, `data-name`, `required`,
   `placeholder`, `id`, `for` on the two row labels, `value` on options
   (the first option of each select has `value=""`), `readonly` and
   `data-date-*` on the dates, `type=submit`, `value="Send Message"` and
   `data-wait="Please wait..."` on the submit. `set_attributes` anything
   dropped.

### 3a. Field table (both forms, identical; order = DOM order)

| # | name | data-name | type | required | notes |
| --- | --- | --- | --- | --- | --- |
| 1 | `First-Name` | First Name | text | yes | placeholder "First Name" |
| 2 | `Last-Name` | Last Name | text | yes | placeholder "Last Name" |
| 3 | `Email-Address` | Email Address | email | yes | placeholder "Email Address" |
| 4 | `Address-Line` | Address Line | text | yes | placeholder "Address Line" |
| 5 | `City` | City | text | yes | placeholder "City" |
| 6 | `Province` | Province | select | yes |  |
| 7 | `Postal-Code` | Postal Code | text | yes | placeholder "Postal Code" |
| 8 | `Phone` | Phone | tel | yes | placeholder "+1 ( 000) 000-00-00" |
| 9 | `Emergency-Contact-Name` | Emergency Contact / Name | text | no | placeholder "Name" |
| 10 | `Emergency-Contact-Phone` | Emergency Contact / Phone | tel | no | placeholder "+1 ( 000) 000-00-00" |
| 11 | `Pet-s-Name` | Pet’s Name | text | yes | placeholder "Pet’s Name" |
| 12 | `Type-of-Pet` | Type of Pet | select | yes |  |
| 13 | `Pet-s-Breed` | Pet’s Breed | text | yes | placeholder "Pet’s Breed" |
| 14 | `Pet-s-Color` | Pet’s Color | text | yes | placeholder "Pet’s Color" |
| 15 | `Pet-s-Gender` | Pet’s Gender | select | yes |  |
| 16 | `Neutered-or-Spayed` | Neutered or Spayed | select | yes |  |
| 17 | `Microchip-Number` | Microchip Number | text | no | placeholder "Microchip Number (optional)" |
| 18 | `Do-you-have-insurance` | Do you have insurance? | select | yes |  |
| 19 | `Insurance-Provider` | Insurance Provider | text | no | placeholder "(If Yes) Insurance Provider" |
| 20 | `Insurance-Policy-Number` | Insurance Policy Number | text | no | placeholder "(If Yes) Insurance Policy Number" |
| 21 | `Any-Medical-Information-optional` | Any Medical Information (optional) | text | no | placeholder "Any Medical Information (optional)" |
| 22 | `Pet-s-Date-of-Birth` | Pet's Date of Birth | text | yes | placeholder "yyyy-mm-dd" |
| 23 | `Other-Pets-in-the-household` | Other Pets in the household? | select | no |  |
| 24 | `Reason-for-Visit` | Reason for Visit | select | no |  |
| 25 | `Appointment-Date` | Appointment Date | text | no | placeholder "yyyy-mm-dd" |
| 26 | `No-Date-of-Visit` | No Date of Visit | checkbox | no |  |

Options (each select's first option is the placeholder with `value=""`):
- `Province` — placeholder "Province"; Alberta, British Columbia, Manitoba, New Brunswick, Newfoundland and Labrador, Nova Scotia, Ontario, Prince Edward Island, Quebec, Saskatchewan
- `Type-of-Pet` — placeholder "Type of Pet"; Dog, Cat
- `Pet-s-Gender` — placeholder "Pet’s Gender"; Male, Female
- `Neutered-or-Spayed` — placeholder "Neutered or Spayed"; Yes, No
- `Do-you-have-insurance` — placeholder "Do you have insurance?"; Yes, No
- `Other-Pets-in-the-household` — placeholder "Other Pets in the household? (optional)"; Yes, No
- `Reason-for-Visit` — placeholder "Reason for Visit (Optional)"; Vaccinations, Diagnostic, Wellness care, Surgery, Spay and neuter services, Dental Care, Nutrition counseling, Microchipping, End-of-Life Care, Parasite prevention, Allergy testing, Rehabilitation services, Preventive care, Emergency care, Surgical procedures, Pharmacy

Live differences, kept on purpose: live's placeholders "Postal Code " and
"(If Yes) Insurance Provider " end in a space; the partials trim it.
Field display names in Form submissions come from `data-name`, which match
live exactly (live forms API, read 2026-11-13).

## 4. Form settings per form

| | Lead North York | Registration - Parliament |
| --- | --- | --- |
| Form name (`data-name`) | Lead North York | Registration - Parliament |
| Panel / tab | `#north-york`, tab "North York" | `#parliament`, tab "Parliament" |
| Title (h2) | Contact North York location | Contact Parliament location |
| Send notifications to | TorontoNorth@tvshospitals.com | Parliament@tvshospitals.com |
| Redirect URL | none (live `redirectUrl: null`) | none |
| Method / action | GET, Webflow default (live `redirectMethod: GET`, no custom action) | same |
| Confirmation email to submitter | off (live `sendEmailConfirmation: false`) | off |
| Submit label / waiting text | Send Message / Please wait... | same |
| Error text | Oops! Something went wrong while submitting the form. | same |
| Success | Action 4a: "We received your request!" · "A member of our team will be contacting you soon to get your appointment set up." · box "YOU ARE NOT BOOKED YET" / "We’ll **text/call** you within 1 business day to confirm your date and time." · box "Toronto North LOCATION - North York", 223 Sheppard Ave W… (link `https://share.google/ulI7h2uVlY2PpVva0`) · What happens next ×3 · foot "Need to reach us sooner? Give us a call directly." + "Call or text (416) 546-7493" | Action 4b: "We received your registration form!" · "Please call, text, or email us after submitting this form to book your appointment. Our team will not contact you automatically." · box "YOU ARE NOT BOOKED YET, CONTACT US TO BOOK YOUR APPOINTMENT" / "Please **call, text, or email us after submitting this form** to book your appointment." + call button (647) 347-3300 · box "Parliament LOCATION - Downtown Toronto", 584 Parliament St… · What happens next ×3 · no foot |

Live has one Form Block element per form, shared by component across pages;
the new build should do the same (§0.2), so these settings are entered
once per form. Spam protection: keep the site default (no reCAPTCHA field
on live's forms).

## 5. Module hooks

Set by the markup above; check after the import (`query_elements` by
attribute).

| Module | Element | Attribute |
| --- | --- | --- |
| contact-tabs | Contact Forms | `data-contact-tabs` |
| | Contact Options | `data-contact-tabs-list`, `aria-labelledby="contact-switch-label"` |
| | Contact Switch Label | `id="contact-switch-label"` |
| | each Contact Option (`<button type="button">`) | `data-contact-tab="north-york"` / `"parliament"`; North York also `data-contact-tab-active` and combo Is Active |
| | each Contact Panel | `id="north-york"` / `id="parliament"`, `data-contact-tab-panel="north-york"` / `"parliament"` (a `/contact-us#parliament` link opens Parliament) |
| select (×7 per form) | Select | `data-select`; toggle `data-select-toggle`; value `data-select-value`; list `data-select-list` |
| date-picker (×2 per form) | Date | `data-date` + `data-date-max="today"` (Pet's Date of Birth) or `data-date-min="today"` (Appointment Date); input `data-date-input`; panel Datepicker `data-date-panel` |
| Webflow forms | submit input | `data-wait="Please wait..."` |
| unique-form-ids | — | nothing to set; it de-duplicates ids if a form component appears twice on a page |

Repo work (not Webflow; the repo session does it, push → staging):
- Port `prototype/src/modules/contact-tabs.ts` to
  `wf-tvs/src/modules/contact-tabs.ts` unchanged, add
  `run('contact-tabs', initContactTabs);` to `src/index.ts`, `pnpm build`,
  commit `dist/`.
- `src/styles.css`, in the js-state / designer-cant sections (not the end of
  the file), with raw fallbacks (GOTCHAS 2026-11-12, approved):

```css
/* repo-css: js-state — contact-tabs marks the open clinic; the radio follows it. */
.contact-option.is-active .contact-option-radio { border-color: var(--_colors---brand--accent, #1c1ce6); }
.contact-option.is-active .contact-option-dot { transform: scale(1); }
/* repo-css: designer-cant — a child moving on its parent link's hover. */
.contact-row-link:hover .contact-row-link-icon { transform: translateX(3px); }
```

## 6. Manual Designer steps (new MANUAL-TODO rows; give them letters)

| ID | Where | Breakpoint | Set | Why the API can't | Done |
| --- | --- | --- | --- | --- | --- |
| TBD-A | Contact › both Form Blocks › Form settings (or the two form components) | — | Name "Lead North York" / "Registration - Parliament" if the import didn't set it; **Send to**: TorontoNorth@tvshospitals.com / Parliament@tvshospitals.com (replace the default site-owner address); Redirect URL empty; Action empty | Form notification and redirect settings have no API (the forms API is read-only) | ☐ |
| TBD-B | Contact › each panel | — | Only if the importer produced a `form` without Success/Error blocks: Add › Form Block into the panel, delete its default fields, move the imported form's children into its form, set classes as in §3, delete the imported form | The API can't create a Form Block's Success/Error states | ☐ |
| TBD-D | Contact › clinic column | — | When Locations gets its second label (HANDOFF open item), replace the two static Contact Clinic blocks with a Locations Collection List (sort by Sort order): Eyebrow Text ← contact label, Contact Clinic Name ← Name, Contact Row Text ← Address, Get directions ← Map link, tel ← Phone, mailto ← Email; remove the imported `href` custom attributes after binding (GOTCHAS 2026-11-13) | Links to CMS phone/email fields and the list settings are Designer work on this project (MANUAL-TODO N, R) | ☐ |

The Designer canvas runs no scripts, so both forms show stacked there; that is expected, not a manual step.

## 7. Check list (after the import, before ticking the page)

Structure and classes
- [ ] Contact page exists at `/contact-us`, SEO title and description as §3,
      in G | Page W; Locations section component after the contact section.
- [ ] Every element has its full class list (spot-check: Contact Row Is Link,
      Contact Row Icon Is Large/Is Accent, Form Cell Is Full, Form Grid Is
      Labelled, Form Input Is Panel (+ Select Toggle / Date Input), Form
      Success Box Is Accent, Form Success Box Title Is Accent). No class list
      dropped, no `inline-div-N` combos.
- [ ] FormWrapper = Clinic Form, FormForm = Clinic Form Body, Success =
      Form Message + Form Success, Error = Form Message + Is Error.
- [ ] No `<span>` text Spans and no `##INLINE0##` anywhere in the section.

Fields (both forms)
- [ ] Zero `data-wftag` left; per form 20 input, 7 select, 43 option,
      7 button, 3 label (§3 restore step 3).
- [ ] Names, data-names, required flags, option values and order match §3a
      (compare published HTML with the partial: `diff` the field list).
- [ ] Row labels' `for` point at the date input ids; clicking "N/A"
      toggles the checkbox.
- [ ] No grey `readonly` background on the date inputs (webflow.css
      `.w-input[readonly]` only hits `.w-input`; these are DOM inputs, so it
      should not, but check).

Behaviour on staging (after the repo push in §5)
- [ ] North York selected at load; clicking/arrow keys switch; the other
      panel is `hidden`; `/contact-us#parliament` opens Parliament; without
      JS both forms show.
- [ ] Custom selects open in the top layer and set the native select; date
      pickers block future birth dates and past visit dates and write
      yyyy-mm-dd.
- [ ] Submitting with an empty required field is blocked by the browser.
- [ ] **One test submission per form** (test data, e.g. "Test" names and a
      test address of the team's): the Success panel shows (navy panel,
      left-aligned steps, margins between panel / next / foot), the form
      hides, and **Form submissions in Webflow list all 26 fields** under
      the right form name. If fields are missing, stop: §0.1 fallback.
      Notification arrives at the clinic address (ask the person to confirm
      with the clinic, or set a team address temporarily and switch back).
      Delete the test submissions only with the person's OK.
- [ ] Error block text exact (§4).

Layout at 1440, 991, 767, 479 against the prototype (`localhost:5955/contact-us`)
- [ ] 1440: intro column 460px, gap 80px, forms column fills; switch label
      120px.
- [ ] 991: columns stack, gap 48px. 767: switch label above the options.
      479: options stack, one form column, form padding 24/16.
- [ ] Success panel at 479: padding 16px, box icons 40px.
- [ ] `pnpm wf:compare /contact-us` (or wf:pass) with the prototype.

Housekeeping
- [ ] HANDOFF Pages table row for `/contact-us`; MANUAL-TODO rows TBD-A…
      with real letters; GOTCHAS entry if the Form Block import or the DOM
      field submission behaved unexpectedly.
