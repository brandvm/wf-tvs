# Pack · Landing pages (`/north-york-vet`, `/parliament-vet`, `/north-york-pet-dental`)

A ready-to-import pack for the Webflow build session, the only session that
writes to Webflow. It was written read-only on 2026-11-13 from:

- the prototype: `prototype/<slug>/index.html`, `partials/nav-landing/*.html`,
  `partials/forms/landing-*.html`, `src/css/new-classes-landing.css`,
  `new-classes-location.css` and `proposed.css` P28;
- the new build, read through `webflow-wf-tvs`;
- live (`webflow-tvs-live`, read only), plus the public pages, for page settings,
  head code and forms.

All three pages are paid-search landing pages, noindex as on live, with no
Figma frame. Each page rebuilds its live page in the TVS system.

**Snapshot warning.** The builder was creating variables and classes while
this pack was written: the P28 variables and the Form Success group showed
up between two reads. Before any create, run `query_styles` /
`query_variables` and create only what is still missing.

## 0 · Order of work

1. **Prerequisites** from other packs (§1.1): the Location Hero group, the
   form classes and the About proof-pill combos. Landing reuses them.
2. **Variables** (§1.2): already in Webflow. Check only.
3. **New classes and combos** (§1.3), including the combo chains the
   importer needs.
4. **Assets** (§6): four images and the poster through `create_asset`; the
   video on `/design/media` (a manual row).
5. **Pages** (§5): create the three pages as drafts, with SEO and head code.
6. **Page shell, then G | Nav Landing** (§2 and §3.1), built on North York
   and turned into a component.
7. **Sections per page** (§3), then the **Form Blocks** (§4).
8. **Instances and props:** G | Nav Landing, C | Button slots, Reviews,
   CTA and G | Footer W.
9. **After-import fixes** (§3.8), **manual rows** (§7), **check list** (§8).
   Set the pages live (`draft: false`) only after the check list passes.

## 1 · Variables and classes

### 1.1 Prerequisites (other packs own them)

On 2026-11-13 none of these existed in Webflow except the Form Success
group, which the builder was creating at the time. They come from the
Locations template pack (`new-classes-location.css`) and the About pack
(`new-classes-about.css`). If those packs haven't been imported first,
create these from those files before importing the landing pages.

| Class (Webflow name) | Source |
| --- | --- |
| Location Hero (combo on S Wrapper), Location Main, Location Head, Location Aside | `new-classes-location.css` lines 9–11, 43, 65–67 |
| Clinic Form (+ Is Card), Clinic Form Body (+ Is Compact), Clinic Form Head, Clinic Form Title, Clinic Form Line | `new-classes-location.css` (`clinic-form*`) |
| Form Group, Form Group Label, Form Grid, Form Cell (+ Is Full), Form Chip, Form Chip Input, Form Chip Text, Form Actions, Form Submit, Form Note | same file |
| Form Input › Is Soft; Form Input › Is Soft › Is Textarea › Is Short; Form Input › Is Soft › Select Toggle | same file (Form Input, Is Textarea, Select Toggle already exist) |
| Form Message › Form Success, and the Form Success … group (all 30 seen on 2026-11-13) | lines 91–138; check the combos Form Success Title › Is Capitalized, Form Success Box › Is Accent, Form Success Box Title › Is Accent, Form Success Box Title › Is Upper |
| Proof Pill › Is Label, Proof Pill Text › Is Light | `new-classes-about.css` lines 15, 17, 30–31 |
| Variable Layout › Location/Form Width (30em) | exists |

**Success spacing is margins.** Webflow shows `.w-form-done` with an inline
`display: block`, so Form Message, Form Success and Form Success Panel must
set no `display`. The panel's inner rhythm is margins: Form Success Next
`margin-top` Spacing/32, Form Success Foot `margin-top` Spacing/24. Check
the existing Form Message class (`56552040…`) for a `display` property
before using it on the Success block.

### 1.2 Variables (P28): already in Webflow

All five were read back on 2026-11-13 in collection **Layout**
(`collection-d7e7593e-789e-d7e8-8691-268f429221b0`). Each has one value for
every mode. The tablet and phone changes live on the classes (§1.3), not in
modes, so nothing needs a breakpoint mode.

| Variable | CSS name | Value | Id |
| --- | --- | --- | --- |
| Landing/Container Width | `--_layout---landing--container-width` | 83.5em (1336px) | `variable-8cac86c2-842a-ea68-7fe5-29514a7db0b5` |
| Landing/Padding H | `--_layout---landing--padding-h` | 3.25em (52px) | `variable-d0b06534-d02d-0dcd-07c2-c8ecddacb2ee` |
| Landing/Copy Width | `--_layout---landing--copy-width` | 36.5em (584px) | `variable-fe407ac9-c76d-7d36-d7ea-521fb9190300` |
| Landing/Form Width | `--_layout---landing--form-width` | 33.1875em (531px) | `variable-0f908201-5f9a-7a77-07eb-79fbb4b20d08` |
| Calc/Landing Hero Min Height | `--_layout---calc--landing-hero-min-height` | `calc(100dvh - var(--_layout---nav--height))` | `variable-c195c13f-7850-f5be-0e5e-fc3db194e812` |

Nav/Height is 5.125em (82px) on desktop, 4.5em on Tablet and 4em on the
two phone modes. `--_layout---registration--form-width` belongs to the
registration pack.

Variables the classes read, all existing: Spacing 4/6/8/12/16/32/40/48/64,
Hairline; Radius 16/20/Pill; Brand Paper/Ink/Yellow/Accent; Ink Tint
12/64/90; Paper Tint 48/85; Typography Scale sizes 12/13/24/28, weights
Medium/Semibold/Bold, line height Compact, letter spacing Snug/Wide;
Layout Rating/Height (`variable-e7492ee7…`), Nav/Padding H, Section/Padding H.

### 1.3 New classes and combos

Breakpoint ids: `main` = desktop, `medium` = 991, `small` = 767, `tiny` =
479. Write each value as `var(--…)` (GOTCHAS 2026-11-12: it binds the
variable). Never mix a variable with other text: gradients go literal and
then to a manual row.

**Combo chains to create before the import.** The importer maps classes by
slug and creates an empty combo when a chain is missing. Create each chain
first with `parent_style_names`, so the import lands on the styled one.

| Element | Chain (Webflow names) | Desktop | 991 | 767 | 479 |
| --- | --- | --- | --- | --- | --- |
| Hero section | Section › Is Hero › Is Photo › **Landing Hero** | min-height Calc/Landing Hero Min Height; justify-content center; padding-top/bottom Spacing/32; padding-left/right Landing/Padding H | min-height 0; padding-top/bottom Spacing/64; padding-left/right Section/Padding H | — | padding-top/bottom Spacing/40 |
| Hero inner | S Wrapper › Location Hero › **Landing Hero Inner** | position relative; z-index 1; max-width Landing/Container Width; align-items center; gap Spacing/40 | — | — | — |
| Video | S Bg Media › **Landing Hero Video** | object-fit cover | — | — | — |
| Shade | S Bg Overlay › **Landing Hero Shade** | background-color transparent; background-image `linear-gradient(90deg, #080829e6 0%, #080829a3 50%, #0808291f 100%)` as literals, then manual row TBD-B | `linear-gradient(180deg, #080829a3 0%, #080829e6 60%, #080829 100%)` (literal, TBD-B) | — | — |
| H1 | D1 › **Landing Hero Title** | color Brand/Paper | — | — | — |
| Copy column | Location Head › **Is Landing** | max-width Landing/Copy Width (on the wrapper, never on the H1: an em max-width would resolve against the H1's type size) | — | — | — |
| Form column | Location Aside › **Is Landing** | flex-basis Landing/Form Width | flex-basis auto | — | — |
| Bar section | Section › **Landing Bar** | padding 0 on all four sides | — | — | — |
| About wrapper | S Wrapper › **Landing About** | align-items center; gap Spacing/48 | gap Spacing/40 | — | — |
| About photo | Landing About Photo › **Is Wide** | aspect-ratio 960 / 816 | — | grid-column 1 / -1 (spans the row); order −1 | — |
| Header wrapper | G \| Nav W › **Is Landing** | top 0 (no top bar, so it sticks at 0) | — | — | — |
| Header bar | Nav Bar › **Is Landing** | padding-left/right Landing/Padding H | padding-left/right Nav/Padding H | — | — |
| Header inner | Shell Inner › Nav Inner › **Is Landing** | max-width Landing/Container Width | — | — | — |
| Text button | Button Color › **Is Yellow** | background Brand/Yellow; color Brand/Ink; transition background-color 200ms ease, color 200ms ease. **Hover:** background Brand/Ink, color Brand/Paper | — | — | — |

The hex values in the shade are Ink (#080829) at 90 %, 64 % and 12 %.
Check them against Ink Tint/Ink 90, 64 and 12 before entering them.

**Button Color › Is Yellow vs the Yellow variant.** On 2026-11-13 Button
Color already had a variant **Yellow** (`e07b9956-c885-e3c8-c511-34b9d0fc6b37`).
G | Nav Landing (§2) uses raw button markup with the combo, because its
label must hide at 479px and C | Button's label can't. Give both the same
values. If the variant's styles differ from the table, ask the person
which one is right.

**New global classes** (no parent):

| Class | Desktop | 991 | 767 | 479 |
| --- | --- | --- | --- | --- |
| Landing Proof | display flex; flex-wrap wrap; gap Spacing/12 | | | |
| Landing Proof Item | display flex; align-items center; gap Spacing/12; padding Spacing/12 Spacing/16; border-radius Radius/16; background Brand/Paper; color Brand/Ink | | | flex 1 1 100% |
| Landing Proof Score | font-size Size/28; weight Semibold; letter-spacing Snug; line-height Compact | | | font-size Size/24 |
| Landing Proof Detail | display flex; flex-direction column; gap Spacing/4 | | | |
| Landing Proof Stars (on the DOM `<svg>`) | display block; width auto; height Rating/Height; color Brand/Yellow | | | |
| Landing Proof Text | color Ink Tint/Ink 64; font-size Size/13; line-height Compact | | | |
| Landing Proof Stat | color Brand/Ink; weight Bold | | | |
| Landing Proof Pets | display block; flex 0 0 auto; width auto; height Spacing/40 | | | |
| Landing Services | display flex; flex-direction column; gap Spacing/12 | | | |
| Landing Services Title | color Paper Tint/Paper 85; font-size Size/12; weight Medium; letter-spacing Wide; line-height Compact; text-transform uppercase | | | |
| Landing Services List | display flex; flex-wrap wrap; gap Spacing/8; margin 0; padding 0; list-style none | | | |
| Landing Services Item | display flex; align-items center; padding Spacing/6 Spacing/12; border Hairline solid Paper Tint/Paper 48; border-radius Radius/Pill | | | |
| Landing Services Text | color Brand/Paper; font-size Size/13; weight Medium; line-height Compact | | | |
| Landing About Photos | display grid; columns `minmax(0,1fr) minmax(0,2fr) minmax(0,1fr)`; gap Spacing/16; align-self stretch | | columns 2 × `minmax(0,1fr)`; gap Spacing/12 | |
| Landing About Photo | display block; width 100%; height auto; aspect-ratio 480 / 816; border-radius Radius/20; object-fit cover | | | |
| Landing Nav Actions | display flex; flex 0 0 auto; align-items center; gap Spacing/12 | | | |
| Landing Nav Label | (nothing on desktop) | | | display none |

Classes left out on purpose:
- Landing Hero Lead, Landing Nav Button and Is Place have no rules in the
  prototype, so the markup drops them.
- Landing Services Icon is defined in the CSS but used on no page.
- The 479px `grid-template-columns` on Landing Services List does nothing
  in the prototype, because the list is flex.

## 2 · G | Nav Landing

The slim header: logo, then Call and Text for the page's clinic. It is
sticky at the top, with no top bar. Below 480px the logo becomes the mark
and both buttons drop their labels. It has no menu (live shows a menu
button there that opens nothing). The landing pages don't use G | Page W,
because G | Page W carries the full G | Nav W.

**Build:** import the markup below into the North York page shell's
`data-pack-slot="nav"` position (§3.1), then
`transform_element_to_component`. Use name `G | Nav Landing`, group
`Global`, and this description: "Slim header of the paid-search landing
pages: logo, Call and Text for one clinic. Props: Call label, Call link,
Text label, Text link." After the import:

- `set_image_asset` the two logos: `nav-logo` → logo-full
  `6af62d919b9b8d192706d814`; `nav-logo is-small` → logo-mark
  `6af6266a4a98e2c0ba7ce277`. Both get empty alt (decorative; the link has
  the name).
- Point the logo link at the Home page (link mode `page`).
- Re-add the two links' `aria-label` attributes if the import dropped them.

```html
<div class="g-nav-w is-landing"><nav class="g-nav" aria-label="Main"><div class="nav-bar is-landing"><div class="shell-inner nav-inner is-landing"><a class="nav-logo-link" href="/" aria-label="TVS Animal Hospitals, home"><img class="nav-logo" src="https://s3.amazonaws.com/webflow-prod-assets/6af4e2d97d259cb3efb2af71/6af62d919b9b8d192706d814_logo-full.svg" alt=""><img class="nav-logo is-small" src="https://s3.amazonaws.com/webflow-prod-assets/6af4e2d97d259cb3efb2af71/6af6266a4a98e2c0ba7ce277_logo-mark.svg" alt=""></a><div class="landing-nav-actions"><a class="button" href="tel:+14165467493" aria-label="Call (416) 546-7493"><div class="button-color"><div class="button-size"><div class="button-content"><div class="button-icon"><div class="icon"><i class="icon-glyph ri-phone-line" aria-hidden="true"></i></div></div><div class="landing-nav-label">Call (416) 546-7493</div></div></div></div></a><a class="button" href="sms:+14165467493" aria-label="Text (416) 546-7493"><div class="button-color is-yellow"><div class="button-size"><div class="button-content"><div class="button-icon"><div class="icon"><i class="icon-glyph ri-chat-3-line" aria-hidden="true"></i></div></div><div class="landing-nav-label">Text (416) 546-7493</div></div></div></div></a></div></div></div></nav></div>
```


**Props.** The brief asked for one "Phone label". This pack uses two
labels instead:
- the visible text differs by verb ("Call …" / "Text …");
- the label is hidden at 479px, so each link needs an `aria-label` that
  carries the same words. A Span can't take a text binding (GOTCHAS), so
  the verb can't sit in a separate span.

| Prop | Type | Default | Bound to |
| --- | --- | --- | --- |
| Call label | textContent (text) | `Call (416) 546-7493` | Call link's Landing Nav Label text, and the Call link's `aria-label` value (attribute value binding) |
| Call link | link | url `tel:+14165467493` | Call link's href |
| Text label | textContent (text) | `Text (416) 546-7493` | Text link's Landing Nav Label text, and the Text link's `aria-label` value |
| Text link | link | url `sms:+14165467493` | Text link's href |

Use link mode `url` for both (`tel:` and `sms:` as typed). If Webflow
rejects `sms:` in a url prop, set mode `phone` for Call and write it to
MANUAL-TODO.

**Per page:**

| Page | Call label | Call link | Text label | Text link |
| --- | --- | --- | --- | --- |
| North York (`/north-york-vet`) | Call (416) 546-7493 | tel:+14165467493 | Text (416) 546-7493 | sms:+14165467493 |
| Parliament (`/parliament-vet`) | Call (647) 347-3300 | tel:+16473473300 | Text (647) 347-3300 | sms:+16473473300 |
| North York Pet Dental (`/north-york-pet-dental`) | as North York | | | |

Defaults equal North York, so North York and Dental set nothing.

## 3 · WHTML markup per page

Importer rules this markup already follows (GOTCHAS, `lessons/mcp.md`):

- **Form controls:** every control is `<i data-wftag="…">`, inputs are
  written void as `<i …></i>`, and spans inside stand-ins are `<div>`.
  After the import, run `set_tag` to the `data-wftag` value on each one,
  then `remove_attribute data-wftag`. Count the tags afterwards.
- **Boolean attributes** carry `="true"`, because Webflow strips empty
  ones on publish.
- **Classes:** every class in the markup exists after §1, except Remix
  `ri-*` on `<i>` and the classes on `<svg>`, which stay literal.
- **Prototype markers removed:** `data-field`, `data-prop`,
  `data-collection`, `data-component` and `w-richtext`.
- **Service icon colours:** each icon's `currentColor` is replaced by its
  Service colour as a raw hex inside the SVG. These are static tiles, so
  there is no CMS binding, and no class or style attribute is needed.
- **Buttons:** every C | Button sits in a `<div data-pack-button="N">`
  slot (§3.5). The Light "View all Services" button stays raw markup with
  Button Color › Is Light.
- **Images:** they import unlinked and without attributes. §3.8 lists
  the fixes.
- **Size:** at most 5 actions per call and about 15 KB per action. Import
  the services shell first, then the tiles into Service Tiles one action
  each. T4 is 16.7 KB: import it alone.

### 3.1 Page shell (all three pages)

Import into Body (prepend). Then:
- insert **G | Components** as Body's first child;
- insert **G | Nav Landing** before `data-pack-slot="nav"` and remove the
  slot;
- insert **G | Footer W** before `data-pack-slot="footer"` and remove the
  slot.

If `<main>` arrives as a div, `set_tag` it to `main` and keep id `main`.
The sections below go into `main.g-main` in this order: hero, bar,
services, about, Reviews, FAQ, CTA.

```html
<div class="g-page-w"><a class="skip-link" href="#main">Skip to content</a><div data-pack-slot="nav"></div><div class="g-main-w"><main class="g-main" id="main"></main><div data-pack-slot="footer"></div></div></div>
```


### 3.2 Hero

The `data-pack-form="here"` marker is where the Form Block goes (§4).
Placeholders:
- `{{MP4_URL}}` / `{{POSTER_URL}}`: §6;
- `{{ASSET landing-pets.webp}}`: the uploaded asset's hostedUrl (it
  imports unlinked either way).

The `<video>` imports as a DOM element. If its attributes or `<source>`
don't survive, build it with `data_element_builder` type DOM
(`dom_tag: video`, then a child `source`) and `set_attributes`:

- on the video: class Landing Hero Video under S Bg Media; `autoplay`,
  `muted`, `loop` and `playsinline` all `="true"`; `preload="auto"`;
  `poster`;
- on the source: `src`, `type="video/mp4"`.

**North York** (`/north-york-vet`):

```html
<section class="section is-hero is-photo landing-hero" id="hero"><div class="s-bg" aria-hidden="true"><video class="s-bg-media landing-hero-video" autoplay="true" muted="true" loop="true" playsinline="true" preload="auto" poster="{{POSTER_URL}}"><source src="{{MP4_URL}}" type="video/mp4"></video><div class="s-bg-overlay landing-hero-shade"></div></div><div class="s-wrapper location-hero landing-hero-inner"><div class="location-main"><div class="location-head is-landing"><div class="proof-pill is-label"><svg class="proof-pill-leaf" aria-hidden="true" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15.2013 8.06563L14.601 7.83257C14.0841 7.43283 14.8009 5.96607 14.9174 5.06557C14.9174 5.06557 12.9004 5.78237 12.7337 5.38197L12.2168 4.3989L10.3503 6.4159C10.1504 6.4491 10.0671 6.4159 10.0339 6.21603L10.9004 1.98303L9.55017 2.73303C9.43363 2.76623 9.3171 2.73303 9.26697 2.6165L7.96683 0L6.61657 2.733C6.50003 2.81633 6.4167 2.84953 6.33337 2.7662L5.03323 2.0494L5.81643 6.24923C5.7331 6.39898 5.61657 6.4491 5.4167 6.36577L3.63353 4.34877C3.40047 4.69903 3.2338 5.33183 2.91673 5.44903C2.60033 5.56558 1.56647 5.21597 0.899733 5.0493C1.1328 5.88263 1.8496 7.2993 1.41667 7.7823L0.666667 8.01537L4.14967 11.0987C4.43287 11.8819 4.06633 12.1319 3.83327 12.5154L7.63343 12.0486L7.5501 15.8487H8.3333L8.18357 12.0486L11.9837 12.4822C11.7507 11.9652 11.5501 11.7322 11.7507 10.932L15.2337 8.04853H15.1503L15.2013 8.06563Z" fill="currentColor"/></svg><div class="proof-pill-text is-light"><span class="proof-pill-stat">Proudly Canadian</span></div></div><h1 class="d1 landing-hero-title">Toronto North Animal Hospital. Your Vet in North York.</h1><p class="home-hero-lead">Urgent care, in-house surgery and dental, and a team that treats your pet like family. Request a visit and we'll call to confirm a time.</p></div><div class="landing-proof"><div class="landing-proof-item"><div class="landing-proof-score">4.8/5</div><div class="landing-proof-detail"><svg class="landing-proof-stars" aria-hidden="true" viewBox="0 0 78 14" fill="none" xmlns="http://www.w3.org/2000/svg"><g><path d="M7 0L8.73632 4.61016L13.6574 4.83688L9.80942 7.91284L11.1145 12.6631L7 9.954L2.8855 12.6631L4.19058 7.91284L0.342604 4.83688L5.26368 4.61016L7 0Z" fill="currentColor"/><path d="M23 0L24.7363 4.61016L29.6574 4.83688L25.8094 7.91284L27.1145 12.6631L23 9.954L18.8855 12.6631L20.1906 7.91284L16.3426 4.83688L21.2637 4.61016L23 0Z" fill="currentColor"/><path d="M39 0L40.7363 4.61016L45.6574 4.83688L41.8094 7.91284L43.1145 12.6631L39 9.954L34.8855 12.6631L36.1906 7.91284L32.3426 4.83688L37.2637 4.61016L39 0Z" fill="currentColor"/><path d="M55 0L56.7363 4.61016L61.6574 4.83688L57.8094 7.91284L59.1145 12.6631L55 9.954L50.8855 12.6631L52.1906 7.91284L48.3426 4.83688L53.2637 4.61016L55 0Z" fill="currentColor"/><path d="M71 0L72.7363 4.61016L77.6574 4.83688L73.8094 7.91284L75.1145 12.6631L71 9.954L66.8855 12.6631L68.1906 7.91284L64.3426 4.83688L69.2637 4.61016L71 0Z" fill="currentColor"/></g></svg><div class="landing-proof-text">Stars across <span class="landing-proof-stat">1,000+</span> Reviews</div></div></div><div class="landing-proof-item"><img class="landing-proof-pets" src="{{ASSET landing-pets.webp}}" alt="Portraits of two dogs and two cats."><div class="landing-proof-text">Cared for over <span class="landing-proof-stat">10,000+</span> pets</div></div></div><div class="landing-services"><div class="landing-services-title">Services</div><ul class="landing-services-list" role="list"><li class="landing-services-item"><div class="landing-services-text">Diagnostics</div></li><li class="landing-services-item"><div class="landing-services-text">Allergy Testing</div></li><li class="landing-services-item"><div class="landing-services-text">Travel Certificate</div></li><li class="landing-services-item"><div class="landing-services-text">Flea, Tick, Heartworm &amp; Deworming</div></li><li class="landing-services-item"><div class="landing-services-text">Pet Wellness &amp; Checkups</div></li><li class="landing-services-item"><div class="landing-services-text">Dog &amp; Cat Vaccinations</div></li><li class="landing-services-item"><div class="landing-services-text">Spay and Neuter</div></li><li class="landing-services-item"><div class="landing-services-text">Dog and Cat Teeth Cleaning</div></li><li class="landing-services-item"><div class="landing-services-text">Urgent Vet Care</div></li><li class="landing-services-item"><div class="landing-services-text">Pet Surgery</div></li></ul></div></div><div class="location-aside is-landing" id="request"><div data-pack-form="here"></div></div></div></section>
```


**Parliament** (`/parliament-vet`): same as North York except the H1
(below), the services checklist (identical) and the form. Full markup:

```html
<section class="section is-hero is-photo landing-hero" id="hero"><div class="s-bg" aria-hidden="true"><video class="s-bg-media landing-hero-video" autoplay="true" muted="true" loop="true" playsinline="true" preload="auto" poster="{{POSTER_URL}}"><source src="{{MP4_URL}}" type="video/mp4"></video><div class="s-bg-overlay landing-hero-shade"></div></div><div class="s-wrapper location-hero landing-hero-inner"><div class="location-main"><div class="location-head is-landing"><div class="proof-pill is-label"><svg class="proof-pill-leaf" aria-hidden="true" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15.2013 8.06563L14.601 7.83257C14.0841 7.43283 14.8009 5.96607 14.9174 5.06557C14.9174 5.06557 12.9004 5.78237 12.7337 5.38197L12.2168 4.3989L10.3503 6.4159C10.1504 6.4491 10.0671 6.4159 10.0339 6.21603L10.9004 1.98303L9.55017 2.73303C9.43363 2.76623 9.3171 2.73303 9.26697 2.6165L7.96683 0L6.61657 2.733C6.50003 2.81633 6.4167 2.84953 6.33337 2.7662L5.03323 2.0494L5.81643 6.24923C5.7331 6.39898 5.61657 6.4491 5.4167 6.36577L3.63353 4.34877C3.40047 4.69903 3.2338 5.33183 2.91673 5.44903C2.60033 5.56558 1.56647 5.21597 0.899733 5.0493C1.1328 5.88263 1.8496 7.2993 1.41667 7.7823L0.666667 8.01537L4.14967 11.0987C4.43287 11.8819 4.06633 12.1319 3.83327 12.5154L7.63343 12.0486L7.5501 15.8487H8.3333L8.18357 12.0486L11.9837 12.4822C11.7507 11.9652 11.5501 11.7322 11.7507 10.932L15.2337 8.04853H15.1503L15.2013 8.06563Z" fill="currentColor"/></svg><div class="proof-pill-text is-light"><span class="proof-pill-stat">Proudly Canadian</span></div></div><h1 class="d1 landing-hero-title">Parliament Animal Hospital. Your Vet in Downtown Toronto.</h1><p class="home-hero-lead">Urgent care, in-house surgery and dental, and a team that treats your pet like family. Request a visit and we'll call to confirm a time.</p></div><div class="landing-proof"><div class="landing-proof-item"><div class="landing-proof-score">4.8/5</div><div class="landing-proof-detail"><svg class="landing-proof-stars" aria-hidden="true" viewBox="0 0 78 14" fill="none" xmlns="http://www.w3.org/2000/svg"><g><path d="M7 0L8.73632 4.61016L13.6574 4.83688L9.80942 7.91284L11.1145 12.6631L7 9.954L2.8855 12.6631L4.19058 7.91284L0.342604 4.83688L5.26368 4.61016L7 0Z" fill="currentColor"/><path d="M23 0L24.7363 4.61016L29.6574 4.83688L25.8094 7.91284L27.1145 12.6631L23 9.954L18.8855 12.6631L20.1906 7.91284L16.3426 4.83688L21.2637 4.61016L23 0Z" fill="currentColor"/><path d="M39 0L40.7363 4.61016L45.6574 4.83688L41.8094 7.91284L43.1145 12.6631L39 9.954L34.8855 12.6631L36.1906 7.91284L32.3426 4.83688L37.2637 4.61016L39 0Z" fill="currentColor"/><path d="M55 0L56.7363 4.61016L61.6574 4.83688L57.8094 7.91284L59.1145 12.6631L55 9.954L50.8855 12.6631L52.1906 7.91284L48.3426 4.83688L53.2637 4.61016L55 0Z" fill="currentColor"/><path d="M71 0L72.7363 4.61016L77.6574 4.83688L73.8094 7.91284L75.1145 12.6631L71 9.954L66.8855 12.6631L68.1906 7.91284L64.3426 4.83688L69.2637 4.61016L71 0Z" fill="currentColor"/></g></svg><div class="landing-proof-text">Stars across <span class="landing-proof-stat">1,000+</span> Reviews</div></div></div><div class="landing-proof-item"><img class="landing-proof-pets" src="{{ASSET landing-pets.webp}}" alt="Portraits of two dogs and two cats."><div class="landing-proof-text">Cared for over <span class="landing-proof-stat">10,000+</span> pets</div></div></div><div class="landing-services"><div class="landing-services-title">Services</div><ul class="landing-services-list" role="list"><li class="landing-services-item"><div class="landing-services-text">Diagnostics</div></li><li class="landing-services-item"><div class="landing-services-text">Allergy Testing</div></li><li class="landing-services-item"><div class="landing-services-text">Travel Certificate</div></li><li class="landing-services-item"><div class="landing-services-text">Flea, Tick, Heartworm &amp; Deworming</div></li><li class="landing-services-item"><div class="landing-services-text">Pet Wellness &amp; Checkups</div></li><li class="landing-services-item"><div class="landing-services-text">Dog &amp; Cat Vaccinations</div></li><li class="landing-services-item"><div class="landing-services-text">Spay and Neuter</div></li><li class="landing-services-item"><div class="landing-services-text">Dog and Cat Teeth Cleaning</div></li><li class="landing-services-item"><div class="landing-services-text">Urgent Vet Care</div></li><li class="landing-services-item"><div class="landing-services-text">Pet Surgery</div></li></ul></div></div><div class="location-aside is-landing" id="request"><div data-pack-form="here"></div></div></div></section>
```


**North York Pet Dental** (`/north-york-pet-dental`): its own H1, lead and
services checklist.

```html
<section class="section is-hero is-photo landing-hero" id="hero"><div class="s-bg" aria-hidden="true"><video class="s-bg-media landing-hero-video" autoplay="true" muted="true" loop="true" playsinline="true" preload="auto" poster="{{POSTER_URL}}"><source src="{{MP4_URL}}" type="video/mp4"></video><div class="s-bg-overlay landing-hero-shade"></div></div><div class="s-wrapper location-hero landing-hero-inner"><div class="location-main"><div class="location-head is-landing"><div class="proof-pill is-label"><svg class="proof-pill-leaf" aria-hidden="true" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15.2013 8.06563L14.601 7.83257C14.0841 7.43283 14.8009 5.96607 14.9174 5.06557C14.9174 5.06557 12.9004 5.78237 12.7337 5.38197L12.2168 4.3989L10.3503 6.4159C10.1504 6.4491 10.0671 6.4159 10.0339 6.21603L10.9004 1.98303L9.55017 2.73303C9.43363 2.76623 9.3171 2.73303 9.26697 2.6165L7.96683 0L6.61657 2.733C6.50003 2.81633 6.4167 2.84953 6.33337 2.7662L5.03323 2.0494L5.81643 6.24923C5.7331 6.39898 5.61657 6.4491 5.4167 6.36577L3.63353 4.34877C3.40047 4.69903 3.2338 5.33183 2.91673 5.44903C2.60033 5.56558 1.56647 5.21597 0.899733 5.0493C1.1328 5.88263 1.8496 7.2993 1.41667 7.7823L0.666667 8.01537L4.14967 11.0987C4.43287 11.8819 4.06633 12.1319 3.83327 12.5154L7.63343 12.0486L7.5501 15.8487H8.3333L8.18357 12.0486L11.9837 12.4822C11.7507 11.9652 11.5501 11.7322 11.7507 10.932L15.2337 8.04853H15.1503L15.2013 8.06563Z" fill="currentColor"/></svg><div class="proof-pill-text is-light"><span class="proof-pill-stat">Proudly Canadian</span></div></div><h1 class="d1 landing-hero-title">Toronto North Animal Hospital. Dog and Cat Dental Care.</h1><p class="home-hero-lead">Complete dental care for dogs and cats, from routine cleanings to extractions, gum disease treatment, and oral surgery. Request a visit and we'll call to confirm a time.</p></div><div class="landing-proof"><div class="landing-proof-item"><div class="landing-proof-score">4.8/5</div><div class="landing-proof-detail"><svg class="landing-proof-stars" aria-hidden="true" viewBox="0 0 78 14" fill="none" xmlns="http://www.w3.org/2000/svg"><g><path d="M7 0L8.73632 4.61016L13.6574 4.83688L9.80942 7.91284L11.1145 12.6631L7 9.954L2.8855 12.6631L4.19058 7.91284L0.342604 4.83688L5.26368 4.61016L7 0Z" fill="currentColor"/><path d="M23 0L24.7363 4.61016L29.6574 4.83688L25.8094 7.91284L27.1145 12.6631L23 9.954L18.8855 12.6631L20.1906 7.91284L16.3426 4.83688L21.2637 4.61016L23 0Z" fill="currentColor"/><path d="M39 0L40.7363 4.61016L45.6574 4.83688L41.8094 7.91284L43.1145 12.6631L39 9.954L34.8855 12.6631L36.1906 7.91284L32.3426 4.83688L37.2637 4.61016L39 0Z" fill="currentColor"/><path d="M55 0L56.7363 4.61016L61.6574 4.83688L57.8094 7.91284L59.1145 12.6631L55 9.954L50.8855 12.6631L52.1906 7.91284L48.3426 4.83688L53.2637 4.61016L55 0Z" fill="currentColor"/><path d="M71 0L72.7363 4.61016L77.6574 4.83688L73.8094 7.91284L75.1145 12.6631L71 9.954L66.8855 12.6631L68.1906 7.91284L64.3426 4.83688L69.2637 4.61016L71 0Z" fill="currentColor"/></g></svg><div class="landing-proof-text">Stars across <span class="landing-proof-stat">1,000+</span> Reviews</div></div></div><div class="landing-proof-item"><img class="landing-proof-pets" src="{{ASSET landing-pets.webp}}" alt="Portraits of two dogs and two cats."><div class="landing-proof-text">Cared for over <span class="landing-proof-stat">10,000+</span> pets</div></div></div><div class="landing-services"><div class="landing-services-title">Services</div><ul class="landing-services-list" role="list"><li class="landing-services-item"><div class="landing-services-text">Full mouth exam</div></li><li class="landing-services-item"><div class="landing-services-text">Scaling above and below the gumline</div></li><li class="landing-services-item"><div class="landing-services-text">Polishing</div></li><li class="landing-services-item"><div class="landing-services-text">Tooth extractions</div></li><li class="landing-services-item"><div class="landing-services-text">Dental x-rays</div></li><li class="landing-services-item"><div class="landing-services-text">Oral surgery</div></li><li class="landing-services-item"><div class="landing-services-text">Gum disease treatment</div></li><li class="landing-services-item"><div class="landing-services-text">Bad breath</div></li><li class="landing-services-item"><div class="landing-services-text">Pyometa Surgery</div></li></ul></div></div><div class="location-aside is-landing" id="request"><div data-pack-form="here"></div></div></div></section>
```


### 3.3 Landing Bar (Hero Bar marquee)

North York (Parliament: the same, with "Caring for **Parliament** since
2009"):

```html
<section class="section landing-bar" aria-label="Why visit us"><div class="hero-bar"><div data-draggable-marquee-init="true" data-direction="left" data-duration="30" data-multiplier="35" data-sensitivity="0.01" class="draggable-marquee"><div data-draggable-marquee-collection="true" class="draggable-marquee__collection"><div data-draggable-marquee-list="true" class="draggable-marquee__list"><div class="hero-bar-item"><i class="hero-bar-icon ri-add-line" aria-hidden="true"></i><div class="hero-bar-text">Same-day urgent care</div></div><div class="hero-bar-divider"></div><div class="hero-bar-item"><i class="hero-bar-icon ri-heart-line" aria-hidden="true"></i><div class="hero-bar-text">Caring for North York since 2009</div></div><div class="hero-bar-divider"></div><div class="hero-bar-item"><i class="hero-bar-icon ri-time-line" aria-hidden="true"></i><div class="hero-bar-text">Open late, 7 days a week</div></div><div class="hero-bar-divider"></div><div class="hero-bar-item"><i class="hero-bar-icon ri-hospital-line" aria-hidden="true"></i><div class="hero-bar-text">Surgery and dental in-house</div></div><div class="hero-bar-divider"></div></div></div></div></div></section>
```


North York Pet Dental:

```html
<section class="section landing-bar" aria-label="Why visit us"><div class="hero-bar"><div data-draggable-marquee-init="true" data-direction="left" data-duration="30" data-multiplier="35" data-sensitivity="0.01" class="draggable-marquee"><div data-draggable-marquee-collection="true" class="draggable-marquee__collection"><div data-draggable-marquee-list="true" class="draggable-marquee__list"><div class="hero-bar-item"><i class="hero-bar-icon ri-search-eye-line" aria-hidden="true"></i><div class="hero-bar-text">Full mouth exam every visit</div></div><div class="hero-bar-divider"></div><div class="hero-bar-item"><i class="hero-bar-icon ri-price-tag-3-line" aria-hidden="true"></i><div class="hero-bar-text">Pricing quoted upfront</div></div><div class="hero-bar-divider"></div><div class="hero-bar-item"><i class="hero-bar-icon ri-heart-line" aria-hidden="true"></i><div class="hero-bar-text">Caring for North York since 2009</div></div><div class="hero-bar-divider"></div><div class="hero-bar-item"><i class="hero-bar-icon ri-time-line" aria-hidden="true"></i><div class="hero-bar-text">Open late, 7 days a week</div></div><div class="hero-bar-divider"></div></div></div></div></div></section>
```


### 3.4 Services (static tiles with each page's live copy)

The tiles carry landing copy that differs from the Services CMS
(Home tiles), so they are static.

Order of work:
1. Import the shell. The shell is identical on all three pages except the
   head text:
   - North York and Dental: "Services at our North York clinic" /
     "Everything your pet needs, in one place. Here’s what each service
     covers:"
   - Parliament: "Services at our Parliament clinic" / "Everything your
     pet needs, close to home. Here’s what each service covers:"
2. Append the tiles into `.service-tiles`, in this order:
   - North York and Parliament: T1, T2, T3, T4, T5, T6, T7.
   - Dental: T8, T1, T2, T4, T5, T6, T7.

The banner's dog image (`services-toller.webp`, asset
`6af72db20160e00377754991`) and its `data-rise="18"` need §3.8.

Shell (North York):

```html
<section class="section is-tint" id="services"><div class="s-wrapper services"><div class="section-head is-center is-tight"><div class="eyebrow"><div class="eyebrow-dot"></div><div class="eyebrow-text">Services</div></div><h2 class="d2">Services at our North York clinic</h2><p class="section-head-text">Everything your pet needs, in one place. Here’s what each service covers:</p></div><div class="service-tiles" data-reveal-stagger="true"></div><div class="services-banner-wrap" data-rise-scope="true"><div class="services-banner"><div class="services-banner-text"><h3 class="services-banner-title">We have more to offer</h3><p class="services-banner-lead">We offer a full range of services.</p></div><div class="services-banner-actions"><a class="button" href="/services"><div class="button-color is-light"><div class="button-size"><div class="button-content"><div>View all Services</div></div></div></div></a><div data-pack-button="8"></div></div></div><div class="services-banner-dog-mask" aria-hidden="true"><img class="services-banner-dog" src="https://s3.amazonaws.com/webflow-prod-assets/6af4e2d97d259cb3efb2af71/6af72db20160e00377754991_services-toller.webp" alt="" data-rise="18"></div></div></div></section>
```


Tiles (each tile's button slot is `data-pack-button="N"`; §3.5 says what
goes there):

#### T1 · Urgent Care

```html
<div class="service-tile"><div class="service-tile-head"><div class="service-tile-name-row"><div class="service-tile-icon"><svg aria-hidden="true" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg"><rect rx="8" fill="#ffdb54" fill-opacity="0.14"/><rect rx="8" fill="#ffdb54" fill-opacity="0.14"/><rect x="0.5" y="0.5" rx="7.5" stroke="#080829" stroke-opacity="0.12"/><g clip-path="url(#clip0_684_9860-tile)"><path d="M12.7972 9.77903V8.2703C12.7972 5.77057 14.8236 3.74414 17.3234 3.74414H20.3408C22.8405 3.74414 24.867 5.77057 24.867 8.2703V9.77903M9.77975 33.9186H27.8844C31.2174 33.9186 33.9193 31.2167 33.9193 27.8837V15.8139C33.9193 12.481 31.2174 9.77903 27.8844 9.77903H9.77976C6.44678 9.77903 3.74487 12.481 3.74487 15.8139V27.8837C3.74487 31.2167 6.44678 33.9186 9.77975 33.9186Z" stroke="#080829" stroke-width="1.46" stroke-linecap="round"/><path d="M18.8304 29.1642C22.8415 29.1642 26.0932 25.9126 26.0932 21.9015C26.0932 17.8903 22.8415 14.6387 18.8304 14.6387C14.8193 14.6387 11.5676 17.8903 11.5676 21.9015C11.5676 25.9126 14.8193 29.1642 18.8304 29.1642Z" fill="#ffdb54" stroke="#080829" stroke-width="1.46"/><path d="M18.8411 19.1904V24.6119" stroke="#080829" stroke-width="1.46" stroke-linecap="round"/><path d="M21.5492 21.9014H16.1277" stroke="#080829" stroke-width="1.46" stroke-linecap="round"/></g><defs><clipPath id="clip0_684_9860-tile"><rect fill="white" transform="translate(3 3)"/></clipPath></defs></svg></div><h3 class="service-tile-name">Urgent Care</h3></div><div data-pack-button="N"></div></div><p class="service-tile-text">When your pet is hurt or suddenly unwell, you shouldn’t have to wait days for help. Our urgent care team handles same-day injuries and illness during opening hours, seven days a week and late into the evening in North York. We assess your pet quickly, explain what’s happening in plain language, and tell you honestly what needs treatment now and what can safely wait.</p><div class="service-tags"><div class="service-tag"><div class="service-tag-text">Same-day appointments</div></div><div class="service-tag"><div class="service-tag-text">Sick visits</div></div><div class="service-tag"><div class="service-tag-text">Wounds &amp; injuries</div></div><div class="service-tag"><div class="service-tag-text">Vomiting &amp; diarrhea</div></div><div class="service-tag"><div class="service-tag-text">Limping</div></div><div class="service-tag"><div class="service-tag-text">Eye &amp; ear problems</div></div><div class="service-tag"><div class="service-tag-text">Allergic reactions</div></div><div class="service-tag"><div class="service-tag-text">Open late, 7 days</div></div></div></div>
```

#### T2 · Pet Surgery

```html
<div class="service-tile"><div class="service-tile-head"><div class="service-tile-name-row"><div class="service-tile-icon"><svg aria-hidden="true" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg"><rect rx="8" fill="#b689fd" fill-opacity="0.14"/><rect x="0.5" y="0.5" rx="7.5" stroke="#080829" stroke-opacity="0.12"/><g clip-path="url(#clip0_684_9879-tile)"><path d="M13.7988 23.3916C14.6059 23.3916 15.2602 22.7372 15.2602 21.9302C15.2602 21.123 14.6059 20.4688 13.7988 20.4688C12.9917 20.4688 12.3374 21.123 12.3374 21.9302C12.3374 22.7372 12.9917 23.3916 13.7988 23.3916Z" fill="#080829"/><path d="M24.3198 23.3916C25.1269 23.3916 25.7812 22.7372 25.7812 21.9302C25.7812 21.123 25.1269 20.4688 24.3198 20.4688C23.5127 20.4688 22.8584 21.123 22.8584 21.9302C22.8584 22.7372 23.5127 23.3916 24.3198 23.3916Z" fill="#080829"/><path d="M19.0625 29.5283V33.0357" stroke="#080829" stroke-width="1.46" stroke-linecap="round" stroke-linejoin="round"/><path d="M21.4016 27.1904L19.0633 29.5287L16.7251 27.1904" stroke="#080829" stroke-width="1.46" stroke-linecap="round" stroke-linejoin="round"/><path d="M15.5581 8.48438H22.5729" stroke="#080829" stroke-width="1.46" stroke-linecap="round" stroke-linejoin="round"/><path d="M15.5564 8.48445L7.71882 6.18126C7.56418 6.14268 7.40328 6.13612 7.24601 6.16199C7.08874 6.18787 6.93843 6.24563 6.80429 6.33171C6.67016 6.4178 6.55505 6.53041 6.46603 6.66262C6.37701 6.79482 6.31595 6.94383 6.28663 7.10049L3.88698 19.961C3.66192 21.1637 5.20226 21.8608 5.95634 20.8992L15.5564 8.48445Z" fill="#b689fd" stroke="#080829" stroke-width="1.46" stroke-linecap="round" stroke-linejoin="round"/><path d="M22.5728 8.48445L30.4103 6.18126C30.565 6.14268 30.7259 6.13612 30.8831 6.16199C31.0404 6.18787 31.1907 6.24563 31.3249 6.33171C31.459 6.4178 31.5741 6.53041 31.6632 6.66262C31.7522 6.79482 31.8132 6.94383 31.8425 7.10049L34.2422 19.961C34.4672 21.1637 32.9269 21.8608 32.1728 20.8992L22.5728 8.48445Z" fill="#b689fd" stroke="#080829" stroke-width="1.46" stroke-linecap="round" stroke-linejoin="round"/><path d="M30.7533 19.0625V28.3601C30.7533 29.6004 30.2606 30.7898 29.3836 31.6669C28.5066 32.5439 27.3171 33.0366 26.0767 33.0366H12.0472C10.8069 33.0366 9.61736 32.5439 8.74034 31.6669C7.86331 30.7898 7.37061 29.6004 7.37061 28.3601V19.0625" stroke="#080829" stroke-width="1.46" stroke-linecap="round" stroke-linejoin="round"/></g><defs><clipPath id="clip0_684_9879-tile"><rect fill="white" transform="translate(3.15625 5.43848)"/></clipPath></defs></svg></div><h3 class="service-tile-name">Pet Surgery</h3></div><div data-pack-button="N"></div></div><p class="service-tile-text">From routine procedures to more complex operations, our veterinarians perform a wide range of surgeries in-house, with clear communication before, during, and after. Many cases that other clinics refer out, we can handle here.</p><div class="service-tags"><div class="service-tag"><div class="service-tag-text">Spay &amp; neuter</div></div><div class="service-tag"><div class="service-tag-text">Orthopedic surgery</div></div><div class="service-tag"><div class="service-tag-text">Soft-tissue surgery</div></div><div class="service-tag"><div class="service-tag-text">Bladder stone removal</div></div><div class="service-tag"><div class="service-tag-text">Eye surgery</div></div><div class="service-tag"><div class="service-tag-text">Foreign body removal</div></div><div class="service-tag"><div class="service-tag-text">Pyometra surgery</div></div><div class="service-tag"><div class="service-tag-text">Mass &amp; lump removal</div></div></div></div>
```

#### T3 · Dental care (vet pages)

```html
<div class="service-tile"><div class="service-tile-head"><div class="service-tile-name-row"><div class="service-tile-icon"><svg aria-hidden="true" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg"><rect rx="8" fill="#fc74c6" fill-opacity="0.14"/><rect x="0.5" y="0.5" rx="7.5" stroke="#080829" stroke-opacity="0.12"/><path d="M19.6665 16.8333L28.9998 8.16667L31.6665 7.5L32.9998 9.5L7.6665 34.1667L5.6665 31.5L19.6665 16.8333Z" fill="#fc74c6"/><path d="M23.834 3.80957C24.5046 3.27232 25.4971 3.31085 26.123 3.9248L29.2119 6.95508C30.0908 6.32321 31.3342 6.39454 32.1289 7.17383L32.4629 7.50098L32.4863 7.52441L32.4854 7.52734C33.342 8.39253 33.3354 9.77367 32.4629 10.6279L9.05664 33.5879C8.61677 34.0178 8.04044 34.2333 7.46484 34.2334C6.88782 34.2334 6.31152 34.0178 5.87305 33.5879L5.53906 33.2607C5.11305 32.8429 4.87891 32.2874 4.87891 31.6973C4.87891 31.1057 5.11296 30.5502 5.53906 30.1338L19.3262 16.6104L16.2588 13.6025C15.5905 12.9483 15.5905 11.8821 16.2588 11.2266L23.7041 3.9248L23.834 3.80957ZM31.3066 7.9834C30.8832 7.56695 30.1931 7.56896 29.7695 7.98438L6.36133 30.9443C5.93867 31.359 5.93867 32.0336 6.36133 32.4482L6.69531 32.7754C7.11883 33.1908 7.80891 33.1908 8.23242 32.7754L31.6201 9.83789V9.83496L31.6406 9.81543C32.0631 9.40082 32.0631 8.72617 31.6406 8.31152L31.3066 7.98438V7.9834ZM17.0801 12.0381C16.8677 12.2464 16.8677 12.5857 17.0801 12.7939L17.0996 12.8135L20.1484 15.8047L21.585 14.3965L18.1299 11.0078L17.0801 12.0381ZM18.9541 10.1973L22.4092 13.5859L23.8467 12.1777L20.3906 8.78906L18.9541 10.1973ZM21.2148 7.97949L24.6699 11.3682L26.1064 9.95996L22.6514 6.57129L21.2148 7.97949ZM25.3008 4.73535C25.0937 4.53359 24.7309 4.53323 24.5254 4.73438L23.4756 5.7627L26.9307 9.15137L28.3672 7.74316L25.3008 4.73535Z" fill="#080829" stroke="#080829" stroke-width="0.133333"/></svg></div><h3 class="service-tile-name">Dental care</h3></div><div data-pack-button="N"></div></div><p class="service-tile-text">Dental disease is one of the most common and most overlooked health problems in pets. We provide full dental care, from cleanings to oral surgery, to protect your pet’s teeth, comfort, and overall health.</p><div class="service-tags"><div class="service-tag"><div class="service-tag-text">Dental cleaning</div></div><div class="service-tag"><div class="service-tag-text">Scaling &amp; polishing</div></div><div class="service-tag"><div class="service-tag-text">Tooth extractions</div></div><div class="service-tag"><div class="service-tag-text">Oral surgery</div></div><div class="service-tag"><div class="service-tag-text">Bad breath</div></div><div class="service-tag"><div class="service-tag-text">Gum disease</div></div></div></div>
```

#### T4 · Spay and neuter (16.7 KB: import alone)

```html
<div class="service-tile"><div class="service-tile-head"><div class="service-tile-name-row"><div class="service-tile-icon"><svg aria-hidden="true" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg"><rect rx="8" fill="#7abafe" fill-opacity="0.14"/><rect x="0.5" y="0.5" rx="7.5" stroke="#080829" stroke-opacity="0.12"/><path d="M22.999 22.833C25.1324 18.033 24.7768 10.1663 24.3324 6.83301L31.6657 13.4997C32.1101 14.1663 32.999 16.433 32.999 20.1663C32.999 23.8997 31.2212 27.9441 30.3324 29.4997L16.999 32.833C18.1101 31.4997 20.8657 27.633 22.999 22.833Z" fill="#7abafe"/><path d="M4.99902 20.1663V15.4997L10.3324 14.833C10.1101 15.9441 9.53236 18.433 8.99902 19.4997C8.46569 20.5663 6.11013 20.3886 4.99902 20.1663Z" fill="#7abafe"/><mask id="path-5-outside-1_684_9821-tile" maskUnits="userSpaceOnUse" x="3.33203" y="2.5" fill="black"><rect fill="white" x="3.33203" y="2.5"/><path d="M32.0553 13.4302L28.0286 9.50438L23.4436 5.03322C23.1031 4.51689 22.6366 4.0933 22.0884 3.80537L22.0829 3.8026C22.0275 3.77492 21.9722 3.75 21.9154 3.72647C21.9085 3.7237 21.9016 3.72093 21.8946 3.71678C21.8448 3.69602 21.7936 3.67664 21.7424 3.65864C21.7313 3.65449 21.7202 3.65034 21.7091 3.64757C21.6524 3.62819 21.5942 3.61158 21.5361 3.59635C21.5333 3.59635 21.5319 3.59496 21.5292 3.59358C21.496 3.58527 21.4627 3.57835 21.4295 3.57005C21.4074 3.56451 21.3866 3.55897 21.3645 3.55482C21.3561 3.55344 21.3478 3.55205 21.3382 3.55067C20.0452 3.30565 18.607 3.95349 17.1671 5.40285C17.1602 5.40977 17.1519 5.41808 17.145 5.425C17.1076 5.46238 17.0702 5.50113 17.0329 5.5399C16.9969 5.57727 16.9609 5.61603 16.9249 5.65341C16.9152 5.66448 16.9041 5.67555 16.8944 5.68663C15.0741 7.63985 13.3397 10.778 12.0522 14.618L10.8424 14.6111C10.787 14.5848 10.7261 14.5695 10.6652 14.5695L6.42647 14.5737C5.26922 14.5765 4.33203 15.515 4.33203 16.6723L4.33342 18.6919C4.33618 21.4813 5.03388 23.8761 6.34893 25.6175H6.35032C7.31238 26.9118 8.68559 27.8407 10.2442 28.2532C10.3217 28.9149 10.4449 29.571 10.6138 30.2147C10.6207 30.2438 10.629 30.2715 10.636 30.3006C10.6457 30.3352 10.6553 30.3698 10.665 30.403C11.2423 32.4462 12.2431 33.7266 13.5748 34.074H13.5734C13.8143 34.1363 14.0607 34.1667 14.3085 34.1667C14.3181 34.1667 14.3292 34.1653 14.3403 34.1653H14.3666C14.3707 34.1653 14.3735 34.164 14.3777 34.164C14.9203 34.1418 15.4533 34.002 15.9377 33.7556L19.5091 32.7977L27.7236 30.5925C29.5079 30.108 30.9656 28.8165 31.6618 27.1027C32.2321 25.6838 32.7111 24.2303 33.0945 22.752C33.5181 21.156 33.7645 19.517 33.8296 17.867C33.8877 16.2044 33.2431 14.5945 32.0553 13.4302ZM17.1744 6.62649C17.2117 6.58358 17.2477 6.53928 17.2851 6.49776C17.3073 6.47145 17.3308 6.44654 17.3529 6.42024C18.567 5.06365 19.7699 4.33275 20.804 4.33275C20.9784 4.33275 21.1514 4.35489 21.3189 4.39781C21.3604 4.40888 21.4033 4.42134 21.4435 4.43518C21.4587 4.44072 21.4739 4.44626 21.4892 4.45179C21.5155 4.46148 21.5404 4.46979 21.5667 4.48086C21.5819 4.4864 21.5971 4.49471 21.611 4.50024C21.6373 4.51132 21.6636 4.52378 21.6899 4.53623C21.6968 4.539 21.7024 4.54315 21.7093 4.54592C21.7411 4.56115 21.773 4.57776 21.8034 4.59576L22.7932 5.56062C23.376 6.42579 23.7968 7.72288 24.0072 9.35776L24.01 9.35914C22.2976 9.00062 20.523 9.09752 18.8591 9.63739C18.6805 9.69137 16.4449 10.3877 15.0843 11.7692C14.2662 12.6205 13.5699 13.5826 13.0148 14.6236H12.9331C14.089 11.2874 15.6114 8.46606 17.1744 6.62649ZM5.16419 18.692L5.1628 16.6833C5.16142 16.3456 5.29569 16.0217 5.53518 15.7849C5.77328 15.5441 6.09857 15.4112 6.43636 15.4167L10.2583 15.4388L10.2597 15.4845H10.2583C10.2943 17.6731 8.54873 19.4783 6.35875 19.5141L5.20565 19.5335C5.17935 19.247 5.16557 18.9646 5.16419 18.692ZM5.26386 20.3628L6.37267 20.3448V20.3434C9.02081 20.3005 11.1319 18.1189 11.0891 15.4707V15.443L13.2651 15.4555C13.4257 15.4569 13.5725 15.3655 13.6417 15.2202C14.1774 14.1709 14.8626 13.2046 15.6752 12.3519C16.9127 11.0963 19.0819 10.4375 19.1041 10.4305C19.1096 10.4291 19.1151 10.4277 19.1193 10.425H19.1207C20.732 9.89893 22.4582 9.82972 24.1068 10.227C24.1386 10.6285 24.158 11.0424 24.1663 11.4701C24.0403 11.4549 23.913 11.4466 23.7856 11.4452L22.8678 11.4383H22.8512C21.813 11.4355 20.9409 12.219 20.8316 13.2517L19.6259 24.3965H19.6273C19.5207 25.3849 19.8224 26.3732 20.462 27.1346C20.3609 27.3339 20.2599 27.5277 20.1561 27.7187C20.1312 27.7132 20.1048 27.7091 20.0799 27.7077L12.5218 27.7104L12.5121 27.7118C7.79181 27.7118 5.71781 24.1638 5.26386 20.3628ZM24.1663 12.3088C24.0957 14.9944 23.7095 17.6631 23.0146 20.2589C22.4802 22.3298 21.7632 24.3481 20.8703 26.2904C20.5326 25.7533 20.3844 25.1165 20.4523 24.4853L21.658 13.3405C21.7216 12.73 22.238 12.2677 22.8512 12.2691H22.8609L23.7787 12.276C23.9088 12.2788 24.0375 12.2881 24.1663 12.3088ZM15.6404 32.9761L14.3059 33.3346C14.2685 33.3346 14.2312 33.3332 14.1938 33.3318H14.1786C14.1481 33.3305 14.1163 33.3263 14.0858 33.3235C14.072 33.3221 14.0567 33.3208 14.0429 33.3194C14.0166 33.3166 13.9903 33.3111 13.964 33.3069C13.9474 33.3042 13.9294 33.3014 13.9128 33.2986C13.874 33.2917 13.8366 33.282 13.7993 33.2723C13.7951 33.2709 13.791 33.2709 13.7868 33.2695C13.7425 33.2585 13.6996 33.2446 13.6581 33.2308C12.6088 32.8778 11.7976 31.6278 11.3449 29.7023C11.2536 29.3063 11.1774 28.8828 11.1179 28.437H11.1152C11.5775 28.5076 12.044 28.5422 12.5119 28.5422H12.5216L19.6881 28.5395C19.3448 29.1195 18.9904 29.6635 18.625 30.1632C17.62 31.5364 16.5941 32.4943 15.6404 32.9761ZM33.0006 17.8389C32.9369 19.4281 32.7002 21.0048 32.2918 22.5415C31.9167 23.9867 31.4488 25.4055 30.8923 26.7912C30.2943 28.264 29.0415 29.3729 27.5077 29.7909L17.7943 32.3975C20.1904 30.0608 22.4731 25.6186 23.8172 20.4692C25.1614 15.3197 25.34 10.3294 24.3917 7.11911L31.475 14.0252C32.4966 15.026 33.0504 16.4088 33.0006 17.8389Z"/></mask><path d="M32.0553 13.4302L28.0286 9.50438L23.4436 5.03322C23.1031 4.51689 22.6366 4.0933 22.0884 3.80537L22.0829 3.8026C22.0275 3.77492 21.9722 3.75 21.9154 3.72647C21.9085 3.7237 21.9016 3.72093 21.8946 3.71678C21.8448 3.69602 21.7936 3.67664 21.7424 3.65864C21.7313 3.65449 21.7202 3.65034 21.7091 3.64757C21.6524 3.62819 21.5942 3.61158 21.5361 3.59635C21.5333 3.59635 21.5319 3.59496 21.5292 3.59358C21.496 3.58527 21.4627 3.57835 21.4295 3.57005C21.4074 3.56451 21.3866 3.55897 21.3645 3.55482C21.3561 3.55344 21.3478 3.55205 21.3382 3.55067C20.0452 3.30565 18.607 3.95349 17.1671 5.40285C17.1602 5.40977 17.1519 5.41808 17.145 5.425C17.1076 5.46238 17.0702 5.50113 17.0329 5.5399C16.9969 5.57727 16.9609 5.61603 16.9249 5.65341C16.9152 5.66448 16.9041 5.67555 16.8944 5.68663C15.0741 7.63985 13.3397 10.778 12.0522 14.618L10.8424 14.6111C10.787 14.5848 10.7261 14.5695 10.6652 14.5695L6.42647 14.5737C5.26922 14.5765 4.33203 15.515 4.33203 16.6723L4.33342 18.6919C4.33618 21.4813 5.03388 23.8761 6.34893 25.6175H6.35032C7.31238 26.9118 8.68559 27.8407 10.2442 28.2532C10.3217 28.9149 10.4449 29.571 10.6138 30.2147C10.6207 30.2438 10.629 30.2715 10.636 30.3006C10.6457 30.3352 10.6553 30.3698 10.665 30.403C11.2423 32.4462 12.2431 33.7266 13.5748 34.074H13.5734C13.8143 34.1363 14.0607 34.1667 14.3085 34.1667C14.3181 34.1667 14.3292 34.1653 14.3403 34.1653H14.3666C14.3707 34.1653 14.3735 34.164 14.3777 34.164C14.9203 34.1418 15.4533 34.002 15.9377 33.7556L19.5091 32.7977L27.7236 30.5925C29.5079 30.108 30.9656 28.8165 31.6618 27.1027C32.2321 25.6838 32.7111 24.2303 33.0945 22.752C33.5181 21.156 33.7645 19.517 33.8296 17.867C33.8877 16.2044 33.2431 14.5945 32.0553 13.4302ZM17.1744 6.62649C17.2117 6.58358 17.2477 6.53928 17.2851 6.49776C17.3073 6.47145 17.3308 6.44654 17.3529 6.42024C18.567 5.06365 19.7699 4.33275 20.804 4.33275C20.9784 4.33275 21.1514 4.35489 21.3189 4.39781C21.3604 4.40888 21.4033 4.42134 21.4435 4.43518C21.4587 4.44072 21.4739 4.44626 21.4892 4.45179C21.5155 4.46148 21.5404 4.46979 21.5667 4.48086C21.5819 4.4864 21.5971 4.49471 21.611 4.50024C21.6373 4.51132 21.6636 4.52378 21.6899 4.53623C21.6968 4.539 21.7024 4.54315 21.7093 4.54592C21.7411 4.56115 21.773 4.57776 21.8034 4.59576L22.7932 5.56062C23.376 6.42579 23.7968 7.72288 24.0072 9.35776L24.01 9.35914C22.2976 9.00062 20.523 9.09752 18.8591 9.63739C18.6805 9.69137 16.4449 10.3877 15.0843 11.7692C14.2662 12.6205 13.5699 13.5826 13.0148 14.6236H12.9331C14.089 11.2874 15.6114 8.46606 17.1744 6.62649ZM5.16419 18.692L5.1628 16.6833C5.16142 16.3456 5.29569 16.0217 5.53518 15.7849C5.77328 15.5441 6.09857 15.4112 6.43636 15.4167L10.2583 15.4388L10.2597 15.4845H10.2583C10.2943 17.6731 8.54873 19.4783 6.35875 19.5141L5.20565 19.5335C5.17935 19.247 5.16557 18.9646 5.16419 18.692ZM5.26386 20.3628L6.37267 20.3448V20.3434C9.02081 20.3005 11.1319 18.1189 11.0891 15.4707V15.443L13.2651 15.4555C13.4257 15.4569 13.5725 15.3655 13.6417 15.2202C14.1774 14.1709 14.8626 13.2046 15.6752 12.3519C16.9127 11.0963 19.0819 10.4375 19.1041 10.4305C19.1096 10.4291 19.1151 10.4277 19.1193 10.425H19.1207C20.732 9.89893 22.4582 9.82972 24.1068 10.227C24.1386 10.6285 24.158 11.0424 24.1663 11.4701C24.0403 11.4549 23.913 11.4466 23.7856 11.4452L22.8678 11.4383H22.8512C21.813 11.4355 20.9409 12.219 20.8316 13.2517L19.6259 24.3965H19.6273C19.5207 25.3849 19.8224 26.3732 20.462 27.1346C20.3609 27.3339 20.2599 27.5277 20.1561 27.7187C20.1312 27.7132 20.1048 27.7091 20.0799 27.7077L12.5218 27.7104L12.5121 27.7118C7.79181 27.7118 5.71781 24.1638 5.26386 20.3628ZM24.1663 12.3088C24.0957 14.9944 23.7095 17.6631 23.0146 20.2589C22.4802 22.3298 21.7632 24.3481 20.8703 26.2904C20.5326 25.7533 20.3844 25.1165 20.4523 24.4853L21.658 13.3405C21.7216 12.73 22.238 12.2677 22.8512 12.2691H22.8609L23.7787 12.276C23.9088 12.2788 24.0375 12.2881 24.1663 12.3088ZM15.6404 32.9761L14.3059 33.3346C14.2685 33.3346 14.2312 33.3332 14.1938 33.3318H14.1786C14.1481 33.3305 14.1163 33.3263 14.0858 33.3235C14.072 33.3221 14.0567 33.3208 14.0429 33.3194C14.0166 33.3166 13.9903 33.3111 13.964 33.3069C13.9474 33.3042 13.9294 33.3014 13.9128 33.2986C13.874 33.2917 13.8366 33.282 13.7993 33.2723C13.7951 33.2709 13.791 33.2709 13.7868 33.2695C13.7425 33.2585 13.6996 33.2446 13.6581 33.2308C12.6088 32.8778 11.7976 31.6278 11.3449 29.7023C11.2536 29.3063 11.1774 28.8828 11.1179 28.437H11.1152C11.5775 28.5076 12.044 28.5422 12.5119 28.5422H12.5216L19.6881 28.5395C19.3448 29.1195 18.9904 29.6635 18.625 30.1632C17.62 31.5364 16.5941 32.4943 15.6404 32.9761ZM33.0006 17.8389C32.9369 19.4281 32.7002 21.0048 32.2918 22.5415C31.9167 23.9867 31.4488 25.4055 30.8923 26.7912C30.2943 28.264 29.0415 29.3729 27.5077 29.7909L17.7943 32.3975C20.1904 30.0608 22.4731 25.6186 23.8172 20.4692C25.1614 15.3197 25.34 10.3294 24.3917 7.11911L31.475 14.0252C32.4966 15.026 33.0504 16.4088 33.0006 17.8389Z" fill="#080829"/><path d="M32.0553 13.4302L28.0286 9.50438L23.4436 5.03322C23.1031 4.51689 22.6366 4.0933 22.0884 3.80537L22.0829 3.8026C22.0275 3.77492 21.9722 3.75 21.9154 3.72647C21.9085 3.7237 21.9016 3.72093 21.8946 3.71678C21.8448 3.69602 21.7936 3.67664 21.7424 3.65864C21.7313 3.65449 21.7202 3.65034 21.7091 3.64757C21.6524 3.62819 21.5942 3.61158 21.5361 3.59635C21.5333 3.59635 21.5319 3.59496 21.5292 3.59358C21.496 3.58527 21.4627 3.57835 21.4295 3.57005C21.4074 3.56451 21.3866 3.55897 21.3645 3.55482C21.3561 3.55344 21.3478 3.55205 21.3382 3.55067C20.0452 3.30565 18.607 3.95349 17.1671 5.40285C17.1602 5.40977 17.1519 5.41808 17.145 5.425C17.1076 5.46238 17.0702 5.50113 17.0329 5.5399C16.9969 5.57727 16.9609 5.61603 16.9249 5.65341C16.9152 5.66448 16.9041 5.67555 16.8944 5.68663C15.0741 7.63985 13.3397 10.778 12.0522 14.618L10.8424 14.6111C10.787 14.5848 10.7261 14.5695 10.6652 14.5695L6.42647 14.5737C5.26922 14.5765 4.33203 15.515 4.33203 16.6723L4.33342 18.6919C4.33618 21.4813 5.03388 23.8761 6.34893 25.6175H6.35032C7.31238 26.9118 8.68559 27.8407 10.2442 28.2532C10.3217 28.9149 10.4449 29.571 10.6138 30.2147C10.6207 30.2438 10.629 30.2715 10.636 30.3006C10.6457 30.3352 10.6553 30.3698 10.665 30.403C11.2423 32.4462 12.2431 33.7266 13.5748 34.074H13.5734C13.8143 34.1363 14.0607 34.1667 14.3085 34.1667C14.3181 34.1667 14.3292 34.1653 14.3403 34.1653H14.3666C14.3707 34.1653 14.3735 34.164 14.3777 34.164C14.9203 34.1418 15.4533 34.002 15.9377 33.7556L19.5091 32.7977L27.7236 30.5925C29.5079 30.108 30.9656 28.8165 31.6618 27.1027C32.2321 25.6838 32.7111 24.2303 33.0945 22.752C33.5181 21.156 33.7645 19.517 33.8296 17.867C33.8877 16.2044 33.2431 14.5945 32.0553 13.4302ZM17.1744 6.62649C17.2117 6.58358 17.2477 6.53928 17.2851 6.49776C17.3073 6.47145 17.3308 6.44654 17.3529 6.42024C18.567 5.06365 19.7699 4.33275 20.804 4.33275C20.9784 4.33275 21.1514 4.35489 21.3189 4.39781C21.3604 4.40888 21.4033 4.42134 21.4435 4.43518C21.4587 4.44072 21.4739 4.44626 21.4892 4.45179C21.5155 4.46148 21.5404 4.46979 21.5667 4.48086C21.5819 4.4864 21.5971 4.49471 21.611 4.50024C21.6373 4.51132 21.6636 4.52378 21.6899 4.53623C21.6968 4.539 21.7024 4.54315 21.7093 4.54592C21.7411 4.56115 21.773 4.57776 21.8034 4.59576L22.7932 5.56062C23.376 6.42579 23.7968 7.72288 24.0072 9.35776L24.01 9.35914C22.2976 9.00062 20.523 9.09752 18.8591 9.63739C18.6805 9.69137 16.4449 10.3877 15.0843 11.7692C14.2662 12.6205 13.5699 13.5826 13.0148 14.6236H12.9331C14.089 11.2874 15.6114 8.46606 17.1744 6.62649ZM5.16419 18.692L5.1628 16.6833C5.16142 16.3456 5.29569 16.0217 5.53518 15.7849C5.77328 15.5441 6.09857 15.4112 6.43636 15.4167L10.2583 15.4388L10.2597 15.4845H10.2583C10.2943 17.6731 8.54873 19.4783 6.35875 19.5141L5.20565 19.5335C5.17935 19.247 5.16557 18.9646 5.16419 18.692ZM5.26386 20.3628L6.37267 20.3448V20.3434C9.02081 20.3005 11.1319 18.1189 11.0891 15.4707V15.443L13.2651 15.4555C13.4257 15.4569 13.5725 15.3655 13.6417 15.2202C14.1774 14.1709 14.8626 13.2046 15.6752 12.3519C16.9127 11.0963 19.0819 10.4375 19.1041 10.4305C19.1096 10.4291 19.1151 10.4277 19.1193 10.425H19.1207C20.732 9.89893 22.4582 9.82972 24.1068 10.227C24.1386 10.6285 24.158 11.0424 24.1663 11.4701C24.0403 11.4549 23.913 11.4466 23.7856 11.4452L22.8678 11.4383H22.8512C21.813 11.4355 20.9409 12.219 20.8316 13.2517L19.6259 24.3965H19.6273C19.5207 25.3849 19.8224 26.3732 20.462 27.1346C20.3609 27.3339 20.2599 27.5277 20.1561 27.7187C20.1312 27.7132 20.1048 27.7091 20.0799 27.7077L12.5218 27.7104L12.5121 27.7118C7.79181 27.7118 5.71781 24.1638 5.26386 20.3628ZM24.1663 12.3088C24.0957 14.9944 23.7095 17.6631 23.0146 20.2589C22.4802 22.3298 21.7632 24.3481 20.8703 26.2904C20.5326 25.7533 20.3844 25.1165 20.4523 24.4853L21.658 13.3405C21.7216 12.73 22.238 12.2677 22.8512 12.2691H22.8609L23.7787 12.276C23.9088 12.2788 24.0375 12.2881 24.1663 12.3088ZM15.6404 32.9761L14.3059 33.3346C14.2685 33.3346 14.2312 33.3332 14.1938 33.3318H14.1786C14.1481 33.3305 14.1163 33.3263 14.0858 33.3235C14.072 33.3221 14.0567 33.3208 14.0429 33.3194C14.0166 33.3166 13.9903 33.3111 13.964 33.3069C13.9474 33.3042 13.9294 33.3014 13.9128 33.2986C13.874 33.2917 13.8366 33.282 13.7993 33.2723C13.7951 33.2709 13.791 33.2709 13.7868 33.2695C13.7425 33.2585 13.6996 33.2446 13.6581 33.2308C12.6088 32.8778 11.7976 31.6278 11.3449 29.7023C11.2536 29.3063 11.1774 28.8828 11.1179 28.437H11.1152C11.5775 28.5076 12.044 28.5422 12.5119 28.5422H12.5216L19.6881 28.5395C19.3448 29.1195 18.9904 29.6635 18.625 30.1632C17.62 31.5364 16.5941 32.4943 15.6404 32.9761ZM33.0006 17.8389C32.9369 19.4281 32.7002 21.0048 32.2918 22.5415C31.9167 23.9867 31.4488 25.4055 30.8923 26.7912C30.2943 28.264 29.0415 29.3729 27.5077 29.7909L17.7943 32.3975C20.1904 30.0608 22.4731 25.6186 23.8172 20.4692C25.1614 15.3197 25.34 10.3294 24.3917 7.11911L31.475 14.0252C32.4966 15.026 33.0504 16.4088 33.0006 17.8389Z" stroke="#080829" stroke-width="0.64" mask="url(#path-5-outside-1_684_9821-tile)"/><path d="M16.3325 18.2949C17.1396 18.2949 17.7939 17.6405 17.7939 16.8335C17.7939 16.0264 17.1396 15.3721 16.3325 15.3721C15.5254 15.3721 14.8711 16.0264 14.8711 16.8335C14.8711 17.6405 15.5254 18.2949 16.3325 18.2949Z" fill="#080829"/></svg></div><h3 class="service-tile-name">Spay and neuter</h3></div><div data-pack-button="N"></div></div><p class="service-tile-text">Spaying or neutering protects your pet’s long-term health and helps prevent unwanted litters. We perform safe, routine spay and neuter surgery for dogs and cats, with upfront pricing and careful aftercare.</p><div class="service-tags"><div class="service-tag"><div class="service-tag-text">Dog spay</div></div><div class="service-tag"><div class="service-tag-text">Cat spay</div></div><div class="service-tag"><div class="service-tag-text">Dog neuter</div></div><div class="service-tag"><div class="service-tag-text">Cat neuter</div></div><div class="service-tag"><div class="service-tag-text">Pre-surgical bloodwork</div></div><div class="service-tag"><div class="service-tag-text">Pain management</div></div><div class="service-tag"><div class="service-tag-text">Aftercare</div></div></div></div>
```

#### T5 · Wellness exams

```html
<div class="service-tile"><div class="service-tile-head"><div class="service-tile-name-row"><div class="service-tile-icon"><svg aria-hidden="true" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg"><rect rx="8" fill="#a3a3a3" fill-opacity="0.14"/><rect x="0.5" y="0.5" rx="7.5" stroke="#080829" stroke-opacity="0.12"/><g clip-path="url(#clip0_684_9776-tile)"><g clip-path="url(#clip1_684_9776-tile)"><path d="M13.0815 17.6191V26.5875" stroke="#080829" stroke-width="1.45827" stroke-linecap="round"/><path d="M17.5706 22.1035H8.60229" stroke="#080829" stroke-width="1.45827" stroke-linecap="round"/><path d="M29.5263 19.1143H22.0527" stroke="#080829" stroke-width="1.45827" stroke-linecap="round"/><path d="M26.5369 25.0928H22.0527" stroke="#080829" stroke-width="1.45827" stroke-linecap="round"/><path d="M16.1465 7.15644C16.1465 5.50541 17.4849 4.16699 19.1359 4.16699C20.787 4.16699 22.1254 5.50541 22.1254 7.15644V10.1459C22.1254 11.7969 20.787 13.1353 19.1359 13.1353C17.4849 13.1353 16.1465 11.7969 16.1465 10.1459V7.15644Z" fill="#a3a3a3"/><path d="M22.0546 10.1459H28.0335C31.3355 10.1459 34.0124 12.8227 34.0124 16.1248V28.0826C34.0124 31.3846 31.3355 34.0614 28.0335 34.0614H10.0968C6.79476 34.0614 4.11792 31.3846 4.11792 28.0826V16.1248C4.11792 12.8227 6.79476 10.1459 10.0968 10.1459H16.0757M22.0546 10.1459V7.15644C22.0546 5.50541 20.7162 4.16699 19.0651 4.16699C17.4141 4.16699 16.0757 5.50541 16.0757 7.15644V10.1459M22.0546 10.1459C22.0546 11.7969 20.7162 13.1353 19.0651 13.1353C17.4141 13.1353 16.0757 11.7969 16.0757 10.1459" stroke="#080829" stroke-width="1.45827"/></g></g><defs><clipPath id="clip0_684_9776-tile"><rect fill="white" transform="translate(3 3)"/></clipPath><clipPath id="clip1_684_9776-tile"><rect fill="white" transform="translate(1.31519 3.5)"/></clipPath></defs></svg></div><h3 class="service-tile-name">Wellness exams</h3></div><div data-pack-button="N"></div></div><p class="service-tile-text">A yearly checkup is the simplest way to keep your pet healthy and catch small problems before they become serious. Our nose-to-tail wellness exams cover every life stage, from first puppy and kitten visits to senior care.</p><div class="service-tags"><div class="service-tag"><div class="service-tag-text">Annual checkups</div></div><div class="service-tag"><div class="service-tag-text">Puppy &amp; kitten visits</div></div><div class="service-tag"><div class="service-tag-text">Senior pet exams</div></div><div class="service-tag"><div class="service-tag-text">Preventive care</div></div><div class="service-tag"><div class="service-tag-text">Health screening</div></div><div class="service-tag"><div class="service-tag-text">Nutrition advice</div></div></div></div>
```

#### T6 · Vaccinations

```html
<div class="service-tile"><div class="service-tile-head"><div class="service-tile-name-row"><div class="service-tile-icon"><svg aria-hidden="true" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg"><rect rx="8" fill="#97e68a" fill-opacity="0.14"/><rect x="0.5" y="0.5" rx="7.5" stroke="#080829" stroke-opacity="0.12"/><g clip-path="url(#clip0_684_9798-tile)"><g clip-path="url(#clip1_684_9798-tile)"><path d="M14.3448 17.5928L25.1543 19.7357L19.1543 26.4976L16.2019 27.3548H13.2495L11.7257 26.4976L11.1543 24.5452L11.7257 20.2594L14.3448 17.5928Z" fill="#97e68a"/><path d="M20.9523 10.6031L12.4499 19.1055C11.9482 19.6072 11.6227 20.2581 11.5224 20.9605L11.1359 23.6658C10.8267 25.8301 12.6818 27.6851 14.8461 27.3759L17.5514 26.9895C18.2538 26.8892 18.9047 26.5637 19.4064 26.0619L27.9088 17.5596C29.1894 16.2789 29.1894 14.2026 27.9088 12.9219L25.59 10.6031C24.3093 9.32241 22.233 9.32241 20.9523 10.6031Z" stroke="#080829" stroke-width="1.46" stroke-linecap="round"/><path d="M31.3897 7.125L26.752 11.7627" stroke="#080829" stroke-width="1.46" stroke-linecap="round" stroke-linejoin="round"/><path d="M29.0752 4.80664L33.7128 9.44431" stroke="#080829" stroke-width="1.46" stroke-linecap="round" stroke-linejoin="round"/><path d="M13.998 17.5596L25.5923 19.8784" stroke="#080829" stroke-width="1.46" stroke-linecap="round" stroke-linejoin="round"/><path d="M11.68 26.835L3.7627 34.32" stroke="#080829" stroke-width="1.46" stroke-linecap="round" stroke-linejoin="round"/></g></g><defs><clipPath id="clip0_684_9798-tile"><rect fill="white" transform="translate(3 3)"/></clipPath><clipPath id="clip1_684_9798-tile"><rect fill="white" transform="translate(3 3)"/></clipPath></defs></svg></div><h3 class="service-tile-name">Vaccinations</h3></div><div data-pack-button="N"></div></div><p class="service-tile-text">Core and lifestyle vaccines protect your pet from preventable disease. We build a clear vaccination schedule around your pet’s age, lifestyle, and risk, with no guesswork.</p><div class="service-tags"><div class="service-tag"><div class="service-tag-text">Puppy shots</div></div><div class="service-tag"><div class="service-tag-text">Kitten shots</div></div><div class="service-tag"><div class="service-tag-text">Adult boosters</div></div><div class="service-tag"><div class="service-tag-text">Rabies</div></div><div class="service-tag"><div class="service-tag-text">DHPP</div></div><div class="service-tag"><div class="service-tag-text">Bordetella (kennel cough)</div></div><div class="service-tag"><div class="service-tag-text">FVRCP</div></div></div></div>
```

#### T7 · Parasite prevention and deworming

```html
<div class="service-tile"><div class="service-tile-head"><div class="service-tile-name-row"><div class="service-tile-icon"><svg aria-hidden="true" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg"><rect rx="8" fill="#ff9b6e" fill-opacity="0.14"/><rect x="0.5" y="0.5" rx="7.5" stroke="#080829" stroke-opacity="0.12"/><path d="M8.71094 16.3956C8.71094 13.1239 11.3632 10.4717 14.6349 10.4717H23.5208C26.7924 10.4717 29.4447 13.1239 29.4447 16.3956V28.2435C29.4447 31.5151 26.7924 34.1674 23.5208 34.1674H14.6349C11.3632 34.1674 8.71094 31.5151 8.71094 28.2435V16.3956Z" stroke="#080829" stroke-width="1.46"/><path d="M8.71094 7.50981C8.71094 5.87396 10.037 4.54785 11.6729 4.54785H26.4827C28.1186 4.54785 29.4447 5.87396 29.4447 7.50981C29.4447 9.14566 28.1186 10.4718 26.4827 10.4718H11.6729C10.037 10.4718 8.71094 9.14566 8.71094 7.50981Z" fill="#ff9b6e"/><path d="M23.5212 22.3199C23.5212 24.7736 21.5319 26.7628 19.0782 26.7628C16.6244 26.7628 14.6353 24.7736 14.6353 22.3199C14.6353 19.8661 16.6244 17.877 19.0782 17.877C21.5319 17.877 23.5212 19.8661 23.5212 22.3199Z" fill="#ff9b6e"/><path d="M8.71094 7.50981C8.71094 5.87396 10.037 4.54785 11.6729 4.54785H26.4827C28.1186 4.54785 29.4447 5.87396 29.4447 7.50981C29.4447 9.14566 28.1186 10.4718 26.4827 10.4718H11.6729C10.037 10.4718 8.71094 9.14566 8.71094 7.50981Z" stroke="#080829" stroke-width="1.46"/><path d="M23.5212 22.3199C23.5212 24.7736 21.5319 26.7628 19.0782 26.7628C16.6244 26.7628 14.6353 24.7736 14.6353 22.3199C14.6353 19.8661 16.6244 17.877 19.0782 17.877C21.5319 17.877 23.5212 19.8661 23.5212 22.3199Z" stroke="#080829" stroke-width="1.46"/></svg></div><h3 class="service-tile-name">Parasite prevention and deworming</h3></div><div data-pack-button="N"></div></div><p class="service-tile-text">Fleas, ticks, heartworm, and intestinal worms are easy to prevent and far harder to treat once they take hold. We recommend simple, year-round prevention matched to your pet and your neighbourhood.</p><div class="service-tags"><div class="service-tag"><div class="service-tag-text">Flea prevention</div></div><div class="service-tag"><div class="service-tag-text">Tick prevention</div></div><div class="service-tag"><div class="service-tag-text">Heartworm prevention</div></div><div class="service-tag"><div class="service-tag-text">Deworming</div></div><div class="service-tag"><div class="service-tag-text">Fecal testing</div></div><div class="service-tag"><div class="service-tag-text">Year-round plans</div></div></div></div>
```

#### T8 · Dental Care (dental page, longer copy)

```html
<div class="service-tile"><div class="service-tile-head"><div class="service-tile-name-row"><div class="service-tile-icon"><svg aria-hidden="true" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg"><rect rx="8" fill="#fc74c6" fill-opacity="0.14"/><rect x="0.5" y="0.5" rx="7.5" stroke="#080829" stroke-opacity="0.12"/><path d="M19.6665 16.8333L28.9998 8.16667L31.6665 7.5L32.9998 9.5L7.6665 34.1667L5.6665 31.5L19.6665 16.8333Z" fill="#fc74c6"/><path d="M23.834 3.80957C24.5046 3.27232 25.4971 3.31085 26.123 3.9248L29.2119 6.95508C30.0908 6.32321 31.3342 6.39454 32.1289 7.17383L32.4629 7.50098L32.4863 7.52441L32.4854 7.52734C33.342 8.39253 33.3354 9.77367 32.4629 10.6279L9.05664 33.5879C8.61677 34.0178 8.04044 34.2333 7.46484 34.2334C6.88782 34.2334 6.31152 34.0178 5.87305 33.5879L5.53906 33.2607C5.11305 32.8429 4.87891 32.2874 4.87891 31.6973C4.87891 31.1057 5.11296 30.5502 5.53906 30.1338L19.3262 16.6104L16.2588 13.6025C15.5905 12.9483 15.5905 11.8821 16.2588 11.2266L23.7041 3.9248L23.834 3.80957ZM31.3066 7.9834C30.8832 7.56695 30.1931 7.56896 29.7695 7.98438L6.36133 30.9443C5.93867 31.359 5.93867 32.0336 6.36133 32.4482L6.69531 32.7754C7.11883 33.1908 7.80891 33.1908 8.23242 32.7754L31.6201 9.83789V9.83496L31.6406 9.81543C32.0631 9.40082 32.0631 8.72617 31.6406 8.31152L31.3066 7.98438V7.9834ZM17.0801 12.0381C16.8677 12.2464 16.8677 12.5857 17.0801 12.7939L17.0996 12.8135L20.1484 15.8047L21.585 14.3965L18.1299 11.0078L17.0801 12.0381ZM18.9541 10.1973L22.4092 13.5859L23.8467 12.1777L20.3906 8.78906L18.9541 10.1973ZM21.2148 7.97949L24.6699 11.3682L26.1064 9.95996L22.6514 6.57129L21.2148 7.97949ZM25.3008 4.73535C25.0937 4.53359 24.7309 4.53323 24.5254 4.73438L23.4756 5.7627L26.9307 9.15137L28.3672 7.74316L25.3008 4.73535Z" fill="#080829" stroke="#080829" stroke-width="0.133333"/></svg></div><h3 class="service-tile-name">Dental Care</h3></div><div data-pack-button="N"></div></div><p class="service-tile-text">From routine cleanings to more advanced dental procedures, our veterinary team provides comprehensive oral care to support your pet’s comfort and overall health. Services may include a full-mouth exam, dental X-rays, scaling above and below the gumline, and polishing. When needed, we also perform tooth extractions, oral surgery, and treatment for gum disease and persistent bad breath.</p><div class="service-tags"><div class="service-tag"><div class="service-tag-text">Full mouth exam</div></div><div class="service-tag"><div class="service-tag-text">Scaling &amp; Polishing</div></div><div class="service-tag"><div class="service-tag-text">Tooth extractions</div></div><div class="service-tag"><div class="service-tag-text">Dental x-rays</div></div><div class="service-tag"><div class="service-tag-text">Oral surgery</div></div><div class="service-tag"><div class="service-tag-text">Gum disease treatment</div></div><div class="service-tag"><div class="service-tag-text">Bad breath</div></div><div class="service-tag"><div class="service-tag-text">Pyometa Surgery</div></div></div></div>
```



### 3.5 C | Button slots

Insert a **C | Button** instance before each `data-pack-button` div, then
remove the div. Props on C | Button (`e6bbfb98…`):

| Prop | Id |
| --- | --- |
| Label | `8d3fce21…` |
| Link | `67b926ae…` |
| Icon | `2e7ee61b…` |
| Icon Before | `95a262ac…` |
| Icon After | `319ed850…` |
| Color | `a86542c6…` |
| Size | `06aa6257…` |

Variant ids:
- Color: Secondary `e13de0db-430f-b667-aee3-d545b7e6faea`; Primary `base`;
- Size: Small `59642798-b49d-486d-53fd-1f7e1042710d`; Default `base`.

| Slot | Label | Link | Icon (After on) | Color | Size |
| --- | --- | --- | --- | --- | --- |
| Tile T1 | Explore Details | `/services/urgent-care` | ri-arrow-right-s-line | Secondary | Small |
| Tile T2 | Explore Details | `/services/surgery` | ri-arrow-right-s-line | Secondary | Small |
| Tile T3 / T8 | Explore Details | `/services/dental-care` | ri-arrow-right-s-line | Secondary | Small |
| Tile T4 | Explore Details | `/services/spay-and-neuter` | ri-arrow-right-s-line | Secondary | Small |
| Tile T5 | Explore Details | `/services/wellness-care` | ri-arrow-right-s-line | Secondary | Small |
| Tile T6 | Explore Details | `/services/vaccinations` | ri-arrow-right-s-line | Secondary | Small |
| Tile T7 | Explore Details | `/services/parasite-prevention` | ri-arrow-right-s-line | Secondary | Small |
| Banner `9` | Get in Touch | page section → the hero section (`#hero`) | Icon After off | Primary | Default |

The banner's first button, "View all Services" (Light), is raw markup in
the shell. If Home's banner uses something else by now, match Home.

### 3.6 About (identical on all three pages)

Three image placeholders; §3.8 links them.

```html
<section class="section" id="about"><div class="s-wrapper landing-about"><div class="section-head is-center is-tight"><div class="eyebrow"><div class="eyebrow-dot"></div><div class="eyebrow-text">About</div></div><h2 class="d2">About TVS Animal Hospitals</h2><p class="section-head-text">We’re TVS Animal Hospitals, an independent, Canadian-owned veterinary practice caring for dogs, cats, and the people who love them across Toronto. We’re not part of a corporate chain, which means every decision we make is about your pet and nothing else. To us, your pets are family, and we look after them the way we’d want our own to be looked after.</p></div><div class="landing-about-photos" data-reveal-stagger="true"><img class="landing-about-photo" src="{{ASSET landing-about-cat.webp}}" alt="A TVS Animal Hospitals team member holding a tabby cat in front of the clinic’s wall of patient photos."><img class="landing-about-photo is-wide" src="{{ASSET landing-about-cockapoo.webp}}" alt="A TVS Animal Hospitals team member holding a brown cockapoo with bandaged paws."><img class="landing-about-photo" src="{{ASSET landing-about-white-dog.webp}}" alt="A TVS Animal Hospitals team member holding a small white dog in front of the clinic’s wall of patient photos."></div></div></section>
```


### 3.7 Reviews, FAQ, CTA, footer

**Reviews:** the shared Reviews section (prototype
`partials/sections/reviews.html`, the same heading and text as live). On
2026-11-13 there was no Reviews component. If the Services template pack
has made one, insert an instance. If not, turn Home's Reviews section into
a component first: `transform_element_to_component`, name `Reviews`, group
`Sections`. That edit touches Home, so coordinate it. Don't import a
second copy of the markup.

**FAQ:** the five live questions per page, static. They are
landing-specific, not in the FAQs CMS. North York and Dental share this
markup:

```html
<section class="section" id="faq"><div class="s-wrapper faq"><div class="faq-head"><div class="eyebrow"><div class="eyebrow-dot"></div><div class="eyebrow-text">FAQ</div></div><h2 class="d2">Common Questions</h2><p class="section-head-text">Owners trust us with the animals they love, and we don’t take that lightly.</p></div><div class="faq-list" data-accordion="true"><div class="faq-item" data-accordion-item="true" data-accordion-open="true"><i data-wftag="button" class="faq-question" type="button" data-accordion-toggle="true"><div class="faq-question-text">Can I get a same-day appointment?</div><div class="faq-toggle"><i class="faq-toggle-icon ri-add-line" aria-hidden="true"></i></div></i><div class="faq-answer" data-accordion-panel="true"><div class="faq-answer-inner"><p>Often, yes. We keep room for same-day urgent visits when your pet is suddenly sick or hurt, 7 days a week, with in-house diagnostics for fast answers. Submit the form or call us and we'll find the soonest time — the same day wherever possible.</p></div></div></div><div class="faq-item" data-accordion-item="true"><i data-wftag="button" class="faq-question" type="button" data-accordion-toggle="true"><div class="faq-question-text">Do I need an appointment, or can I walk in?</div><div class="faq-toggle"><i class="faq-toggle-icon ri-add-line" aria-hidden="true"></i></div></i><div class="faq-answer" data-accordion-panel="true"><div class="faq-answer-inner"><p>Booking ahead is best and gives you the shortest wait, including for same-day urgent visits. Walk-ins are welcome during opening hours when we have capacity, so it's worth a quick call first.</p></div></div></div><div class="faq-item" data-accordion-item="true"><i data-wftag="button" class="faq-question" type="button" data-accordion-toggle="true"><div class="faq-question-text">How late are you open?</div><div class="faq-toggle"><i class="faq-toggle-icon ri-add-line" aria-hidden="true"></i></div></i><div class="faq-answer" data-accordion-panel="true"><div class="faq-answer-inner"><p>We're open until 11PM Monday to Saturday and until 10PM on Sunday — 7 days a week. Evening and weekend visits are no problem.</p></div></div></div><div class="faq-item" data-accordion-item="true"><i data-wftag="button" class="faq-question" type="button" data-accordion-toggle="true"><div class="faq-question-text">Are you open 24 hours?</div><div class="faq-toggle"><i class="faq-toggle-icon ri-add-line" aria-hidden="true"></i></div></i><div class="faq-answer" data-accordion-panel="true"><div class="faq-answer-inner"><p>No — we're an urgent care hospital, not a 24-hour ER. We treat same-day injuries and illness during opening hours, late into the evening. If your pet needs care overnight while we're closed, a 24-hour hospital is the right place.</p></div></div></div><div class="faq-item" data-accordion-item="true"><i data-wftag="button" class="faq-question" type="button" data-accordion-toggle="true"><div class="faq-question-text">How much will my visit cost?</div><div class="faq-toggle"><i class="faq-toggle-icon ri-add-line" aria-hidden="true"></i></div></i><div class="faq-answer" data-accordion-panel="true"><div class="faq-answer-inner"><p>It depends on what your pet needs, so we explain all costs upfront, before any treatment goes ahead — no surprises. We work with all pet insurance providers, and as an education-first practice we won't push services your pet doesn't need. Call us for an estimate.</p></div></div></div></div></div></section>
```


Parliament:

```html
<section class="section" id="faq"><div class="s-wrapper faq"><div class="faq-head"><div class="eyebrow"><div class="eyebrow-dot"></div><div class="eyebrow-text">FAQ</div></div><h2 class="d2">Common Questions</h2><p class="section-head-text">Owners trust us with the animals they love, and we don’t take that lightly.</p></div><div class="faq-list" data-accordion="true"><div class="faq-item" data-accordion-item="true" data-accordion-open="true"><i data-wftag="button" class="faq-question" type="button" data-accordion-toggle="true"><div class="faq-question-text">Can I get a same-day appointment?</div><div class="faq-toggle"><i class="faq-toggle-icon ri-add-line" aria-hidden="true"></i></div></i><div class="faq-answer" data-accordion-panel="true"><div class="faq-answer-inner"><p>Often, yes. We keep room for same-day urgent visits when your pet is suddenly sick or hurt, 6 days a week, with in-house diagnostics for fast answers. Submit the form or call us and we'll find the soonest time, the same day wherever possible.</p></div></div></div><div class="faq-item" data-accordion-item="true"><i data-wftag="button" class="faq-question" type="button" data-accordion-toggle="true"><div class="faq-question-text">Do I need an appointment, or can I walk in?</div><div class="faq-toggle"><i class="faq-toggle-icon ri-add-line" aria-hidden="true"></i></div></i><div class="faq-answer" data-accordion-panel="true"><div class="faq-answer-inner"><p>Booking ahead is best and gives you the shortest wait, including for same-day urgent visits. Walk-ins are welcome during opening hours when we have capacity, so it's worth a quick call first.</p></div></div></div><div class="faq-item" data-accordion-item="true"><i data-wftag="button" class="faq-question" type="button" data-accordion-toggle="true"><div class="faq-question-text">What are your hours?</div><div class="faq-toggle"><i class="faq-toggle-icon ri-add-line" aria-hidden="true"></i></div></i><div class="faq-answer" data-accordion-panel="true"><div class="faq-answer-inner"><p>Parliament Animal Hospital is open seven days a week, from 10am–8pm on Monday, Wednesday and Friday, and 10am–7pm on Tuesday, Thursday, Saturday and Sunday.</p></div></div></div><div class="faq-item" data-accordion-item="true"><i data-wftag="button" class="faq-question" type="button" data-accordion-toggle="true"><div class="faq-question-text">Are you open 24 hours?</div><div class="faq-toggle"><i class="faq-toggle-icon ri-add-line" aria-hidden="true"></i></div></i><div class="faq-answer" data-accordion-panel="true"><div class="faq-answer-inner"><p>No, we're an urgent care clinic, not a 24-hour ER. We treat same-day injuries and illness during opening hours, 6 days a week. If your pet needs care overnight while we're closed, a 24-hour hospital is the right place.</p></div></div></div><div class="faq-item" data-accordion-item="true"><i data-wftag="button" class="faq-question" type="button" data-accordion-toggle="true"><div class="faq-question-text">How much will my visit cost?</div><div class="faq-toggle"><i class="faq-toggle-icon ri-add-line" aria-hidden="true"></i></div></i><div class="faq-answer" data-accordion-panel="true"><div class="faq-answer-inner"><p>It depends on what your pet needs, so we explain all costs upfront, before any treatment goes ahead, with no surprises. We work with all pet insurance providers, and as an education-first practice we won't push services your pet doesn't need. Call us for an estimate.</p></div></div></div></div></div></section>
```


**CTA:** a CTA component instance (`25dab600…`) after the FAQ:

| Page | Heading | Text | Button label | Button link |
| --- | --- | --- | --- | --- |
| North York | Book at our North York clinic | Ready to see us? Book online, or call (416) 546-7493. You can also reach us by text or email, whatever’s easiest. We’ll find a time that works, often the same day. | Get in Touch | page section → hero |
| Parliament | Book at our Parliament Clinic | Ready to see us? Book online, or call (416) 546-7493. You can also reach us by text or email, whatever’s easiest. We’ll find a time that works, often the same day. *(North York's number, as on live; open question 3)* | Get in Touch | page section → hero |
| Dental | Book at our North York clinic | as North York | Get in Touch | page section → hero |

The prototype shows only the page's clinic in the CTA phones; the
component shows both (open question 4 and row TBD-E).

**Footer:** G | Footer W, unchanged (§3.1).

### 3.8 After the import

| Element | Fix |
| --- | --- |
| Landing Proof Pets | `set_image_asset` landing-pets.webp; alt "Portraits of two dogs and two cats." |
| Landing About Photo (cat) | asset landing-about-cat.webp; alt "A TVS Animal Hospitals team member holding a tabby cat in front of the clinic’s wall of patient photos." |
| Landing About Photo › Is Wide (cockapoo) | asset landing-about-cockapoo.webp; alt "A TVS Animal Hospitals team member holding a brown cockapoo with bandaged paws." |
| Landing About Photo (white dog) | asset landing-about-white-dog.webp; alt "A TVS Animal Hospitals team member holding a small white dog in front of the clinic’s wall of patient photos." |
| Services Banner Dog | asset `6af72db20160e00377754991`; alt "" (decorative); `set_attributes data-rise="18"` |
| About photos and the dog | Lazy loading (the Webflow default); the hero's pets image eager |
| Every `data-wftag` | `set_tag`, then `remove_attribute data-wftag` (§3, §4) |
| Section ids | `hero`, `services`, `about`, `faq` and the aside's `request` must be on the published page. If the importer refused them, set them (lessons: import the id) |
| `href` custom attributes | Remove any `href` left as a custom attribute on links (GOTCHAS 2026-11-13) |

## 4 · Forms

### 4.1 Settings per form (live, read 2026-11-13)

The live API exposes each form's name, fields and response settings. It
does not expose notification addresses or message texts. The texts below
come from the live published pages; the addresses come from HANDOFF
Decisions 2026-11-11.

| Page | Form name (data-name) | `name` / live `id` | Fields (live order) | Notify | Redirect | Live form id(s) |
| --- | --- | --- | --- | --- | --- | --- |
| `/north-york-vet` | **North York New** | wf-form-North-York-New / `lead-north-york` | 10 (below) | TorontoNorth@tvshospitals.com | none (GET, no redirect; email confirmation off) | `6a5170101c324e91ab92138f` (+ `…129d`, `…11ab` per domain); element `9b420502-de87-753f-6053-b7ec483abd0d` |
| `/parliament-vet` | **Parliament New** | wf-form-Parliament-New / `lead-parliament` | 10 | Parliament@tvshospitals.com | none | `6a5170101c324e91ab92139a`; element `288054aa-85ec-2aaf-b1c2-4a58b7e59661` |
| `/north-york-pet-dental` | **North York Dental** | wf-form-North-York-Dental / same | 10 | TorontoNorth@tvshospitals.com | none | `6a5fbc17b70750e2f75d8ae8`; element `c2a7a8f0-2e42-f2f8-9fa6-f08dbbdd3338` |

The fields in live order, with `name` / `data-name`, type and required:

1. First-Name / First Name, text, required
2. Last-Name / Last Name, text, required
3. Phone / Phone, tel, required, placeholder `+1 ( 000) 000-00-00`
4. Email-address / Email address, email, required
5. Pet-s-Name / Pet's Name, text, required
6. Type-of-Pet / Type of Pet, select (Dog, Cat), required
7. Age / Age, number, required
8. Pet-s-Gender / Pet’s Gender (curly apostrophe, as live), select (Male, Female), required
9. Visited-Before / Visited Before, radio: "Yes, we're clients", "New here"
10. Message / Message, textarea, maxlength 5000, optional

The Message placeholder differs by form:
- North York New and Parliament New: "e.g. Routine checkup, vaccination,
  not feeling well..."
- North York Dental: **"e.g. Bad breath, tartar buildup, due for a
  cleaning..."** (live). The prototype partial has the generic text. This
  pack uses live's (open question 2).

Messages (live):
- Wait text: "Please wait...".
- Error: "Oops! Something went wrong while submitting the form."
- Success: the panel in §4.4. North York New and North York Dental use
  the Toronto North version; Parliament New uses the Parliament version.

### 4.2 Building each Form Block

The WHTML importer can't make a working Form Block from stand-ins: a
stand-in `<form>` is a plain DOM form with no Webflow handling and no
success or error states. So:

1. Make the Form Block: `data_element_builder` type **Form**, appended to
   the hero's `.location-aside.is-landing`, then remove
   `data-pack-form="here"`. This gives the wrapper, form, Success and
   Error blocks.
2. Classes:
   - wrapper: **Clinic Form** › **Is Card** (plus the project's Form Block
     reset if Clinic Form doesn't set margin-bottom 0 and align-self
     stretch: lessons/designer.md 2026-10-06);
   - form: **Clinic Form Body** › **Is Compact**;
   - Success block: **Form Message** › **Form Success**;
   - Error block: **Form Message** › **Is Error**.
   None of them may set `display`.
3. Form settings:
   - name = the data-name in §4.1 (`get_settings` on the form element
     to find the key; Designer if the API refuses);
   - id = live's id (`lead-north-york`, `lead-parliament`,
     `wf-form-North-York-Dental`);
   - method GET, no redirect.
4. Delete the Form Block's default children (label, input, submit) and
   the default texts in Success and Error.
5. Import §4.3 into the form, one action per block, in this order: head,
   group 1, group 2, group 3, group 4, actions + note. Then run `set_tag`
   on every `data-wftag` and remove the attribute. Count afterwards:

   | Tag | Count |
   | --- | --- |
   | input | 8 (6 fields + 2 radios), plus 1 submit = 9 |
   | select | 2 |
   | option | 6 |
   | button | 2 (select toggles, `type="button"`) |
   | label | 2 |
   | textarea | 1 |
6. Import §4.4 into the Success block, and
   `<div>Oops! Something went wrong while submitting the form.</div>` into
   the Error block. On the Success block, `set_attributes` `tabindex="-1"`,
   `role="region"` and `aria-label="Form sent"`. On the Error block,
   `tabindex="-1"`, `role="region"` and `aria-label="<form name> failure"`.

Submission risk: the controls are DOM elements made by `set_tag`, not
Webflow Form Input elements. webflow.js serializes every named
`input`/`select`/`textarea` in the form. However, Webflow's form schema
(Forms panel, `list_forms`) is built from the elements, so check it after
publishing. Send one test submission per form from a real browser
(Turnstile disables the submit until it has a token; lessons/designer.md).
Then compare `list_forms` on the new site with §4.1: the same 10 field
names and types. If the schema comes out empty or wrong, swap the
text/email/tel/number/textarea controls for native Form elements
(`data_element_builder` FormTextInput / FormTextarea, with `name` and
`data-name` set) and keep the custom select and radio chips.

### 4.3 Form markup (North York New; the others by replacement)

To make the other two forms from this markup:
- **Parliament New:** replace the id prefix `landing-north-york-new-` with
  `landing-parliament-new-`.
- **North York Dental:** replace it with `landing-north-york-dental-`, and
  use the dental Message placeholder.

Head:

```html
<div class="clinic-form-head"><h2 class="clinic-form-title">Request an Appointment</h2><div class="clinic-form-line"></div></div>
```


Group 1 · Your Information:

```html
<div class="form-group"><div class="form-group-label">Your Information *</div><div class="form-grid"><div class="form-cell"><i data-wftag="input" class="form-input is-soft" type="text" maxlength="256" name="First-Name" data-name="First Name" placeholder="First Name" aria-label="First Name" id="landing-north-york-new-First-Name" required="true"></i></div><div class="form-cell"><i data-wftag="input" class="form-input is-soft" type="text" maxlength="256" name="Last-Name" data-name="Last Name" placeholder="Last Name" aria-label="Last Name" id="landing-north-york-new-Last-Name" required="true"></i></div><div class="form-cell"><i data-wftag="input" class="form-input is-soft" type="tel" maxlength="256" name="Phone" data-name="Phone" placeholder="+1 ( 000) 000-00-00" aria-label="+1 ( 000) 000-00-00" id="landing-north-york-new-Phone" required="true"></i></div><div class="form-cell"><i data-wftag="input" class="form-input is-soft" type="email" maxlength="256" name="Email-address" data-name="Email address" placeholder="Email address" aria-label="Email address" id="landing-north-york-new-Email-address" required="true"></i></div></div></div>
```


Group 2 · Your Pet (custom select, module `select`):

```html
<div class="form-group"><div class="form-group-label">Your Pet *</div><div class="form-grid"><div class="form-cell"><i data-wftag="input" class="form-input is-soft" type="text" maxlength="256" name="Pet-s-Name" data-name="Pet&#x27;s Name" placeholder="Pet&#x27;s Name" aria-label="Pet&#x27;s Name" id="landing-north-york-new-Pet-s-Name" required="true"></i></div><div class="form-cell"><div class="select" data-select="true"><i data-wftag="select" class="select-native" id="landing-north-york-new-Type-of-Pet" name="Type-of-Pet" data-name="Type of Pet" aria-label="Type of Pet" required="true"><i data-wftag="option" value="">Type of Pet</i><i data-wftag="option" value="Dog">Dog</i><i data-wftag="option" value="Cat">Cat</i></i><i data-wftag="button" class="form-input is-soft select-toggle" type="button" data-select-toggle="true"><div class="select-value" data-select-value="true">Type of Pet</div><i class="select-icon ri-arrow-down-s-line" aria-hidden="true"></i></i><div class="select-list" data-select-list="true"></div></div></div><div class="form-cell"><i data-wftag="input" class="form-input is-soft" type="number" maxlength="256" name="Age" data-name="Age" placeholder="Age" aria-label="Age" id="landing-north-york-new-Age" required="true"></i></div><div class="form-cell"><div class="select" data-select="true"><i data-wftag="select" class="select-native" id="landing-north-york-new-Pet-s-Gender" name="Pet-s-Gender" data-name="Pet’s Gender" aria-label="Gender" required="true"><i data-wftag="option" value="">Gender</i><i data-wftag="option" value="Male">Male</i><i data-wftag="option" value="Female">Female</i></i><i data-wftag="button" class="form-input is-soft select-toggle" type="button" data-select-toggle="true"><div class="select-value" data-select-value="true">Gender</div><i class="select-icon ri-arrow-down-s-line" aria-hidden="true"></i></i><div class="select-list" data-select-list="true"></div></div></div></div></div>
```


Group 3 · Visited before (radio chips):

```html
<div class="form-group"><div class="form-group-label">Have You Visited Before?</div><div class="form-grid" role="radiogroup" aria-label="Have you visited before?"><i data-wftag="label" class="form-chip"><i data-wftag="input" class="form-chip-input" type="radio" name="Visited-Before" data-name="Visited Before" value="Yes, we&#x27;re clients" id="landing-north-york-new-Yes-we-re-clients"></i><div class="form-chip-text">✓ Yes, we’re clients</div></i><i data-wftag="label" class="form-chip"><i data-wftag="input" class="form-chip-input" type="radio" name="Visited-Before" data-name="Visited Before" value="New here" id="landing-north-york-new-New-here"></i><div class="form-chip-text">👋 New here</div></i></div></div>
```


Group 4 · Message:

```html
<div class="form-group"><div class="form-group-label">What’s Going On? (Optional)</div><div class="form-grid"><div class="form-cell is-full"><i data-wftag="textarea" class="form-input is-soft is-textarea is-short" id="landing-north-york-new-Message" name="Message" maxlength="5000" data-name="Message" placeholder="e.g. Routine checkup, vaccination, not feeling well..." aria-label="What’s going on?"></i></div></div></div>
```


Actions and note (submit label: open question 1):

```html
<div class="form-actions"><i data-wftag="input" class="form-submit" type="submit" value="Request Appointment" data-wait="Please wait..."></i></div><p class="form-note">Your details are private and will never be shared.</p>
```


### 4.4 Success panels

**Toronto North** (North York New and North York Dental):

```html
<div class="form-success-panel"><div class="form-success-head"><h3 class="form-success-title is-capitalized">We received your request!</h3><p class="form-success-lead">A member of our team will be contacting you soon to get your appointment set up.</p></div><div class="form-success-box is-accent"><div class="form-success-box-icon"><i class="form-success-box-glyph ri-checkbox-circle-line" aria-hidden="true"></i></div><div class="form-success-box-text"><div class="form-success-box-title is-accent">YOU ARE NOT BOOKED YET</div><p class="form-success-box-body">We’ll <strong>text/call</strong> you within 1 business day to confirm your date and time.</p></div></div><div class="form-success-box"><div class="form-success-box-icon"><i class="form-success-box-glyph ri-map-pin-2-line" aria-hidden="true"></i></div><div class="form-success-box-text"><div class="form-success-box-title is-upper">Toronto North LOCATION - North York</div><a class="form-success-box-link" href="https://share.google/ulI7h2uVlY2PpVva0" target="_blank" rel="noopener"><i class="form-success-box-link-icon ri-map-pin-2-fill" aria-hidden="true"></i><span class="form-success-box-link-text">223 Sheppard Ave W, North York, ON M2N 1N2</span></a></div></div></div><div class="form-success-next"><div class="form-success-next-title">What happens next</div><div class="form-success-step"><div class="form-success-step-icon"><i class="form-success-step-glyph ri-phone-line" aria-hidden="true"></i></div><div class="form-success-step-text"><div class="form-success-step-title">WE’LL TEXT YOU OR GIVE YOU A CALL</div><p class="form-success-step-body">A TVS team member will reach out to the phone number you provided, usually within 1 business day.</p></div></div><div class="form-success-step"><div class="form-success-step-icon"><i class="form-success-step-glyph ri-question-answer-line" aria-hidden="true"></i></div><div class="form-success-step-text"><div class="form-success-step-title">WE CONFIRM THE DETAILS</div><p class="form-success-step-body">We’ll go over your pet’s needs, answer any questions, and find the best time.</p></div></div><div class="form-success-step"><div class="form-success-step-icon"><i class="form-success-step-glyph ri-calendar-check-line" aria-hidden="true"></i></div><div class="form-success-step-text"><div class="form-success-step-title">YOUR APPOINTMENT IS BOOKED</div><p class="form-success-step-body">Once everything is confirmed, you’re officially scheduled. We’ll send you the registration form and the confirmation.</p></div></div></div><div class="form-success-foot"><p class="form-success-foot-text"><strong>Need to reach us sooner?</strong> Give us a call directly.</p><a class="form-success-foot-link" href="tel:+14165467493"><i class="form-success-foot-icon ri-phone-line" aria-hidden="true"></i><span class="form-success-foot-link-text">Call or text (416) 546-7493</span></a></div>
```


**Parliament** (Parliament New):

```html
<div class="form-success-panel"><div class="form-success-head"><h3 class="form-success-title is-capitalized">We received your request!</h3><p class="form-success-lead">A member of our team will be contacting you soon to get your appointment set up.</p></div><div class="form-success-box is-accent"><div class="form-success-box-icon"><i class="form-success-box-glyph ri-checkbox-circle-line" aria-hidden="true"></i></div><div class="form-success-box-text"><div class="form-success-box-title is-accent">YOU ARE NOT BOOKED YET</div><p class="form-success-box-body">We’ll <strong>text/call</strong> you within 1 business day to confirm your date and time.</p></div></div><div class="form-success-box"><div class="form-success-box-icon"><i class="form-success-box-glyph ri-map-pin-2-line" aria-hidden="true"></i></div><div class="form-success-box-text"><div class="form-success-box-title is-upper">Parliament LOCATION - Downtown Toronto</div><a class="form-success-box-link" href="https://www.google.com/maps/dir/?api=1&amp;destination=584+Parliament+St,+Toronto,+ON+M4X+1P8" target="_blank" rel="noopener"><i class="form-success-box-link-icon ri-map-pin-2-fill" aria-hidden="true"></i><span class="form-success-box-link-text">584 Parliament St, Toronto, ON M4X 1P8</span></a></div></div></div><div class="form-success-next"><div class="form-success-next-title">What happens next</div><div class="form-success-step"><div class="form-success-step-icon"><i class="form-success-step-glyph ri-phone-line" aria-hidden="true"></i></div><div class="form-success-step-text"><div class="form-success-step-title">WE’LL TEXT YOU OR GIVE YOU A CALL</div><p class="form-success-step-body">A TVS team member will reach out to the phone number you provided, usually within 1 business day.</p></div></div><div class="form-success-step"><div class="form-success-step-icon"><i class="form-success-step-glyph ri-question-answer-line" aria-hidden="true"></i></div><div class="form-success-step-text"><div class="form-success-step-title">WE CONFIRM THE DETAILS</div><p class="form-success-step-body">We’ll go over your pet’s needs, answer any questions, and find the best time.</p></div></div><div class="form-success-step"><div class="form-success-step-icon"><i class="form-success-step-glyph ri-calendar-check-line" aria-hidden="true"></i></div><div class="form-success-step-text"><div class="form-success-step-title">YOUR APPOINTMENT IS BOOKED</div><p class="form-success-step-body">Once everything is confirmed, you’re officially scheduled. We’ll send you the registration form and the confirmation.</p></div></div></div><div class="form-success-foot"><p class="form-success-foot-text"><strong>Need to reach us sooner?</strong> Give us a call directly.</p><a class="form-success-foot-link" href="tel:+16473473300"><i class="form-success-foot-icon ri-phone-line" aria-hidden="true"></i><span class="form-success-foot-link-text">Call or text (647) 347-3300</span></a></div>
```


## 5 · Page settings

| Field | North York | Parliament | North York Pet Dental |
| --- | --- | --- | --- |
| `create_page` title (live) | North York | Parliament | North York Pet Dental |
| slug | `north-york-vet` | `parliament-vet` | `north-york-pet-dental` |
| folder | site root | site root | site root |
| SEO title (live) | North York Vet, Open Late 7 Days \| Toronto North Animal Hospital | Downtown Toronto Vet, Open 7 Days \| Parliament Animal Hospital | Dog & Cat Dental Care in North York \| TVS Animal Hospitals |
| SEO description (live) | Need a vet in North York? Open until 11PM, 7 days a week, with same-day urgent care and in-house surgery and dental. Request a visit — often seen the same day. | Your downtown Toronto vet in Cabbagetown, with evening and weekend hours. Same-day urgent care plus in-house surgery and dental for dogs and cats. | Dental care for dogs and cats in North York. Cleanings, extractions, dental X-rays, and gum disease treatment. Open late, 7 days a week. Request a visit. |
| Open Graph | titleCopied and descriptionCopied true, no image (as live) | same | same |
| draft | true until §8 passes | true | true |
| Live page id | `6a514d39734c42a22df6bb08` | `6a516bafdbb99aa452725ab7` | `6a5fb8e48e6ffbdfd012692e` |

**Head code** (`set_page_freeform_code`, location head). Read the block
first, because the write replaces it. Live's exact block, per page:

```html
<!-- Paid-search landing page: kept live for Google Ads, excluded from organic index to stop it competing with /locations/north-york (audit H-02 / H-03). -->
<meta name="robots" content="noindex,follow">
```

Parliament's comment says `/locations/parliament`; Dental's says
`/services/dental-care`. The robots value is live's `noindex,follow`, not
the prototype's `noindex`. Live's footer code is empty on all three.

**Sitemap and search:** exclude all three from the sitemap and site
search. Live also prints a second `<meta content="noindex" name="robots">`,
which is Webflow's own output for a page excluded from indexing. This is a
Designer step (TBD-D). GTM `GTM-W4QNPPMP` comes from the site head code,
so there's nothing to add per page.

## 6 · Video and image assets

**Video** `prototype/public/images/landing/landing-hero.mp4`:
- 3,258,875 bytes (3.3 MB);
- 1280×960, H.264, 16.3 s, no audio track;
- MD5 `bf50eb5497cb8a4315d63853ade2fdd5`.

Live plays a 14.3 MB original (`…6a27195677d18fcbcc70ae87_IMG_4343.mp4` on
the live site's asset store). Don't hotlink it: it belongs to the live
site.

Host it the template's way (`webflow-build/media.md`). The media page
exists: `/design/media`, page `6af4e2d97d259cb3efb2af70`.

1. [Claude] Add a block titled "Landing hero · /north-york-vet,
   /parliament-vet, /north-york-pet-dental" to the media page.
2. [Person] Drop a Background Video in it and upload `landing-hero.mp4`
   (TBD-A; the API can't upload video; well under the 30 MB limit).
3. Publish to staging. Read the converted MP4 address (and the WebM, if
   Webflow made one and it is smaller) from the published media page.
   Record them in BUILD-NOTES as a video table row: video, pages, MP4,
   WebM, poster.
4. Put the MP4 address in each hero's `<source src>` (`{{MP4_URL}}`).

**Poster:** `landing-hero-poster.webp`, 1600×1200, 172,178 bytes, MD5
`26ed8259d565055d5b19a8426920abcb`. Upload it with `create_asset` and use
its hostedUrl as `{{POSTER_URL}}`. Use this file rather than Webflow's
generated poster: it is the frame the prototype shows.

**Images** (`create_asset`, folder as Home's):

| File | Bytes | MD5 |
| --- | --- | --- |
| landing-pets.webp | 11,858 | `4b03c2ba93ffcf4105b44eca0a7f2a22` |
| landing-about-cat.webp | 40,866 | `ff59515b517d1857a05170107ff41377` |
| landing-about-cockapoo.webp | 49,226 | `43028de840ebe22b8b80724bb9c5f11b` |
| landing-about-white-dog.webp | 38,024 | `1ff76fff9e4c5bb3e29fd4ceed1c47b6` |

All in `prototype/public/images/landing/`. Reused, already assets:
services-toller, logo-full, logo-mark.

## 7 · Manual Designer steps (new MANUAL-TODO rows)

Letters are TBD: take the next free ones when adding the rows. Add a
`data-manual-todo` caption next to visible items (MANUAL-TODO's rule).

| ID | Where (page › element or class) | Breakpoint | Set | Why the API can't | Done |
| --- | --- | --- | --- | --- | --- |
| TBD-A | `/design/media` › new block "Landing hero" | — | Background Video: upload `prototype/public/images/landing/landing-hero.mp4` (3.3 MB); publish; Claude then reads the hosted address | The API can't upload a video (media.md) | ☐ |
| TBD-B | S Bg Overlay › Landing Hero Shade › Backgrounds › gradient | Desktop and Tablet | Desktop 90°: Ink Tint/Ink 90 0%, Ink 64 50%, Ink 12 100%. Tablet 180°: Ink 64 0%, Ink 90 60%, Brand/Ink 100%. Literal hex values go in first | The style API keeps only the first variable of a gradient (same as D) | ☐ |
| TBD-C | Each landing Form Block › Form settings | — | Name (North York New / Parliament New / North York Dental), Send to (TorontoNorth@ / Parliament@ / TorontoNorth@tvshospitals.com), no redirect. Then one test submission each | Notification settings aren't in the API; the name only if `set_settings` refuses it | ☐ |
| TBD-D | Pages › North York, Parliament, North York Pet Dental › Page settings | — | Exclude from site search and from the sitemap (Sitemap indexing off) | Sitemap and search exclusion have no API (MANUAL-TODO I) | ☐ |
| TBD-E | Each landing page › CTA instance › phones | — | Show only the page's clinic phone. If the CTA phones are a Locations Collection List, add a filter per instance in the Designer. If they are static rows, the API can add two boolean props (Show North York / Show Parliament) bound to each row's visibility instead, and this row goes | A Collection List filter can't be set or exposed per instance through the API | ☐ |

## 8 · Check list

On staging, against `http://localhost:5955/<slug>/` (prototype numbers
measured 2026-11-13, 1440×900, body 16px):

- [ ] **Header plus hero = 900px at 1440×900:**
  - G | Nav Landing is 82px high; its inner box is 1336px wide at x = 52.
  - The hero is 818px high from y = 82, so the two together fill the
    window.
  - The hero inner is 1336px wide at x = 52.
  - The form card is 531 × 702 at y = 140, vertically centred.
  - The copy column is 584px wide, and the H1 runs three lines (175px).
- [ ] **It grows after Submit.** Force the success state the way lessons
  say: `display: none` on the form, `display: block` on `.w-form-done`.
  The aside becomes 890px tall and the hero grows to 954px. Nothing is
  clipped, because min-height doesn't cap. Then send one real submission
  per form and see the same thing.
- [ ] **Window shorter than the form** (e.g. 1440×700): the hero grows to
  fit the form plus Spacing/32 above and below.
- [ ] **991 and 767:**
  - the hero has no min-height and is padded Spacing/64 and Section/Padding H;
  - the form stacks under the copy at full width;
  - the shade runs top to bottom;
  - the header is padded Nav/Padding H.
- [ ] **479:**
  - the logo is the mark;
  - the Call and Text buttons are icon-only, and their accessible names
    are still "Call (…)" / "Text (…)" (published `aria-label`);
  - the hero is padded Spacing/40 top and bottom;
  - the proof items are full width.
- [ ] **Header:** sticks at top 0 while scrolling. Call opens `tel:` and
  Text opens `sms:` with the page's clinic number (Parliament:
  647-347-3300).
- [ ] **Video:**
  - it autoplays muted and loops;
  - the poster shows first;
  - the published `<video>` carries `autoplay="true" muted="true"
    loop="true" playsinline="true"`;
  - nothing is requested from `/design/media`.
- [ ] **Forms:**
  - the published form has `data-name` and `id` as in §4.1, and the 10
    fields have live's `name` / `data-name`;
  - the Dental placeholder is live's;
  - the selects open (module `select`) and the radio chips check;
  - `list_forms` on the new site shows the three forms with the same 10
    fields;
  - the notification emails arrive (TBD-C).
- [ ] **Head:** the published head has `noindex,follow` on all three, and
  the pages are out of `sitemap.xml`.
- [ ] **Modules run:** the Landing Bar marquee, reveal staggers (tiles,
  about photos), the services banner dog rise, the FAQ accordion (first
  item open), the Reviews slider and modal, and the CTA gallery.
- [ ] **Classes:**
  - no empty `is-*` combos were created by the import, and no
    `inline-div-*`;
  - `wf:parity` / `wf:compare` against the prototype at 1440, 991, 767
    and 479;
  - no `data-manual-todo` and no `data-pack-*` left in the published HTML.

## Open questions and blockers

1. **Submit label.** Live's submit input says "Submit"; the prototype says
   "Request Appointment". The pack keeps the prototype's label. Ask the
   person, under "forms match live".
2. **Prototype vs live form copy:**
   - Live has an intro line under the form title, "Fill in your details
     and we’ll call you to get you scheduled."; the prototype has none.
   - The prototype's dental Message placeholder is the generic one; live
     has "e.g. Bad breath, tartar buildup, due for a cleaning...".
   The pack uses live's placeholder and leaves the intro line out. Both
   need the person's call and a fix in `prototype/scripts/build-forms.py`.
3. **Parliament CTA text** says (416) 546-7493, North York's number, as on
   live (HANDOFF 2026-11-13 open item). Confirm before launch.
4. **CTA phones** show both clinics in the component; the prototype shows
   only the page's clinic (TBD-E).
5. **Reviews component** doesn't exist yet (§3.7).
6. **Button Color Yellow variant vs Is Yellow combo** (§1.3).
7. **Prerequisite classes** from the Locations template and About packs
   must be in Webflow before this import (§1.1).
8. **The packs disagree on form controls.** This pack, `contact.md` and
   `registration.md` use a real Form Block with `<i data-wftag>` stand-in
   controls. `locations-template.md` (decision 1) imports native fields
   and forbids stand-ins. Settle it on the first form imported. Follow the
   §4.2 test: does `list_forms` show the fields, and does a test
   submission arrive with every field? Then use the same route for all
   clinic and landing forms. If native fields win, write §4.3's controls as
   real tags inside the form, but keep `<i data-wftag="button">` for the
   select toggles.
