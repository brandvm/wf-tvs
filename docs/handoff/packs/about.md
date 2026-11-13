# About page — Webflow import pack

Page: **About Us**, `/about-us` (the live URL). Prototype
`prototype/about-us/index.html` (classes in `prototype/src/css/new-classes-about.css`,
variables in `prototype/src/css/proposed.css` › P26). Figma 684:11295.
Prepared 2026-11-13 by a read-only prep session. Every fact about Webflow
below was read through `webflow-wf-tvs` that day; nothing was written.

Order of work: **0 page → 1 variables → 2 classes → 3 import → 4 components
and hooks → 5 images → 6 page settings → 7 Designer rows → 8 check.**

Page sections, top to bottom:

| # | Section | Source | Built as |
| --- | --- | --- | --- |
| 1 | About Hero (684:11319, 684:11339) | page | WHTML import + C \| Button instance |
| 2 | Our Story (684:11359) | page | WHTML import |
| 3 | What We Believe (684:11379) | page | WHTML import (Why Choose card classes + Is Value) |
| 4 | Page Divider | page | WHTML import |
| 5 | About Team (684:11418) | page | WHTML import (pins are static page content, **not** the Team collection) |
| 6 | Clinics (684:11437) | Home's Locations section, unchanged | kept from the duplicated Home page (Collection List can't be a component, lessons/mcp.md 2026-10-14) |
| 7 | CTA (684:11510) | CTA component | instance, two props overridden |

## 0. Create the page (recommended route: duplicate Home)

The API can't start a slot's content (MANUAL-TODO K), and the Clinics
section holds a Collection List, so it can't become a component. Both are
solved by duplicating Home, which already has G | Page W with a started
slot, the bound Locations list and the CTA instance:

1. `create_page` `{site_id: 6af4e2d97d259cb3efb2af71, title: "About Us", slug: "about-us", duplicateOf: "6af4e2d97d259cb3efb2af6c"}`.
2. On the new page, inside G | Main's slot, **remove every section except**
   the Locations section (`section#locations`, class Section; on Home its
   id is `acc0de6b-0a4b-3cda-c5ab-2713d1598885`, the duplicate gets new
   ids, so query `attribute_name: id, attribute_value: locations`) and the
   **CTA** instance. Re-query after each removal (ids change).
3. Read back: the Locations DynamoWrapper still has source Locations and
   sort Sort order ascending, `data-reveal-stagger` on the Clinic Cards
   list; the CTA instance is there. If the duplicate lost the list
   binding, rebuild it with the Home pattern in the shared notes (source →
   sort → move the static card in → bind → `remove_attribute href` on
   bound links, GOTCHAS 2026-11-13) or use row TBD-5.
4. Page head code: Home has none, nothing to clear. Check
   `get_page_freeform_code` on the duplicate anyway.

Fallback if `duplicateOf` is refused: create a blank page, insert G | Page W
and G | Components instances, import a "To Slot" wrapper and use row TBD-4.

## 1. Variables to create first (P26 + six Calc variables)

None exist yet (checked: `story`, `value-icon`, `team-pin`, `maple`,
`about-hero` return nothing). Layout collection
`collection-d7e7593e-789e-d7e8-8691-268f429221b0` (modes Tablet / Mobile
Landscape / Mobile exist; **only the Base value is written**, never a
breakpoint mode through the API). Colors collection
`collection-f0ec9d40-8f80-62fe-38e8-9772a5a5c829`. Check every create
result's `name` for a suffix ("-2") and `rename_variable` if so.

| Collection | Name | CSS name | Value |
| --- | --- | --- | --- |
| Layout | About Hero/Min Height | `--_layout---about-hero--min-height` | 62.0625em (993px) |
| Layout | About Hero/Lead Width | `--_layout---about-hero--lead-width` | 29.6875em |
| Layout | Story/Copy Width | `--_layout---story--copy-width` | 30em |
| Layout | Story/Collage Width | `--_layout---story--collage-width` | 37.5em |
| Layout | Value Icon/Size | `--_layout---value-icon--size` | 2.375em |
| Layout | About Team/Intro Width | `--_layout---about-team--intro-width` | 34.625em |
| Layout | About Team/Lead Width | `--_layout---about-team--lead-width` | 40.375em |
| Layout | Team Pin/Dot Size | `--_layout---team-pin--dot-size` | 1.75em |
| Colors | Brand/Maple | `--_colors---brand--maple` | #ff7d55 |

Calc variables (NEW, not in P26 — **ask the person first**; they replace
six Designer calc steps; shape `value: {type: "custom", value: "calc(…)"}`,
GOTCHAS 2026-11-12). Existing precedent: the nine `Calc/…` variables.

| Name | CSS name | Value | Literal it equals |
| --- | --- | --- | --- |
| Calc/About Hero Pad Bottom | `--_layout---calc--about-hero-pad-bottom` | `calc(var(--_spacing---64) + var(--_spacing---10))` | 4.625em |
| Calc/Story Pad Top | `--_layout---calc--story-pad-top` | `calc(var(--_spacing---80) + var(--_spacing---4))` | 5.25em |
| Calc/Story Pad Bottom | `--_layout---calc--story-pad-bottom` | `calc(var(--_spacing---96) + var(--_spacing---6))` | 6.375em |
| Calc/Value Icon Gap | `--_layout---calc--value-icon-gap` | `calc(var(--_spacing---28) - var(--_spacing---10))` | 1.125em |
| Calc/Page Divider Width | `--_layout---calc--page-divider-width` | `calc(100% - var(--_layout---section--padding-h) * 2)` | — |
| Calc/About Team Gap | `--_layout---calc--about-team-gap` | `calc(var(--_spacing---56) * 2)` | 7em |

If the person declines them: write the literal, and row TBD-2 binds each in
the Designer with `calc(` and the variable picker.

Reused existing variables (read 2026-11-13): About/Photo Overhang
(`calc(var(--_spacing---64) * -1)`) and About/Photo Frame Height
(`calc(100% + var(--_spacing---128))`), made for Home's About Intro
parallax photo — the hero and team photos use the same frame. The person's
rule is "no element borrowing another's"; if they want it strict, rename
both to `Parallax/Overhang`, `Parallax/Frame Height` (`rename_variable`
keeps ids and the Home bindings) rather than creating copies.

## 2. Classes to create first

Every value is written `var(--<css name>)` (binds the variable,
GOTCHAS 2026-11-12). Breakpoint ids: `main` (base), `medium` 991,
`small` 767, `tiny` 479. **Create every class and combo below before the
import** — one missing class drops the element's whole class list. Then
read each back (a dropped property gives no error).

Already in Webflow (checked against all 748 selectors on the site): Button, Button
Color/Size/Content + Is Call, Button Icon + Is Well, Icon Glyph +
ri-phone-fill, Chip, D0, D1, D2, Eyebrow (+ Dot, Text), Hero Bar (+ Item,
Text, Divider, Icon, Icon + ri-time-line, Icon + ri-heart-line), Draggable
Marquee (+ __collection, __list), Home Hero Actions/Lead/Text/Body,
Home Hero Lead Box, Home Hero Blur/Shade (+ S Bg Overlay), Home Hero Copy
(+ S Wrapper), Proof Pill, Proof Pill Text, Proof Pill Stat, S Bg,
S Bg Media, Section, Section + Is Hero + Is Photo, Section + Is Tint,
Section Head + Is Center + is-tight, Section Head Text, S Wrapper,
Why Cards, Why Card, Why Card Icon (+ Is Violet / Is Green / Is Pink),
Why Card Title, Why Card Text, and everything in the Locations section and
CTA component.

### 2a. New global classes

| Class | Base (`main`) | 991 | 767 | 479 |
| --- | --- | --- | --- | --- |
| Proof Pill Leaf (svg) | display block; flex 0 0 auto; width, height Spacing/16; color Brand/Maple | | | |
| Live Dot | flex 0 0 auto; width, height Spacing/8; margin-left Spacing/4; radius Radius/Pill; background Status/Success On Dark; **box-shadow literal** `0 0 0 0.25em #ffffff1f` (→ TBD-1) | | | |
| Story Copy | display flex; flex 0 1 Story/Copy Width; direction column; align-items flex-start; gap Spacing/24; min-width 0 | flex 0 0 auto; max-width CTA/Copy Width | | |
| Story Chips | display flex; wrap; gap Spacing/8 | | | |
| Story Collage | position relative; flex 0 0 auto; width Story/Collage Width; max-width 100%; aspect-ratio 1 / 1 | align-self center | | |
| Story Photo | position absolute; overflow hidden; radius Radius/20; background Blue Tint/Blue 16 | | | |
| Story Photo Img | display block; width 100%; height 100%; object-fit cover | | | |
| Story Play | position absolute; top 0; right 0; bottom 0; left 0; margin auto (all four); display flex; center/center; width, height Spacing/56; radius Radius/Pill; background Brand/Yellow; color Brand/Ink | | | width, height Spacing/40 |
| Story Play Icon | font-size Size/20; line-height 1 | | | font-size Size/16 |
| Value Icon (svg) | display block; flex 0 0 auto; width, height Spacing/24 | | | |
| Page Divider | width Calc/Page Divider Width; max-width Container/Max Width; height Spacing/Hairline; margin-left, margin-right auto; background Ink Tint/Ink 12 | | | |
| About Team Wrap | width 100%; padding-left, padding-right Section/Padding H | | | |
| About Team Intro | display flex; flex 0 1 About Team/Intro Width; direction column; align-items flex-start; gap Spacing/20; min-width 0 | flex 0 0 auto | | |
| About Team Media | position relative; overflow hidden; width 100%; aspect-ratio 1440 / 642; background Neutral/Mist | | aspect-ratio 4 / 3 | |
| About Team Photo | position absolute; top About/Photo Overhang; left 0; width 100%; max-width none; height About/Photo Frame Height; object-fit cover; object-position 50% 30% | | | |
| Team Pin | position absolute; z-index 1; display flex; align-items center; gap Spacing/10; padding Spacing/10 Spacing/16 Spacing/10 Spacing/10; radius Radius/Pill; background Brand/Paper; color Brand/Ink; **box-shadow literal** `0 1em 2.5em #0808291f` (→ TBD-1) | | | gap Spacing/8; padding Spacing/6 Spacing/12 Spacing/6 Spacing/6 |
| Team Pin Dot | display flex; flex 0 0 auto; center/center; width, height Team Pin/Dot Size; radius Radius/Pill; background Brand/Yellow | | | |
| Team Pin Dot Inner | width, height Spacing/8; radius Radius/Pill; background Brand/Ink | | | |
| Team Pin Text | display flex; direction column; white-space nowrap | | | |
| Team Pin Name | font-size Size/15; weight Weight/Medium; line-height Line Height/Compact | | | font-size Size/14 |
| Team Pin Role | color Ink Tint/Ink 64; font-size Size/13; line-height Line Height/Compact | | | font-size Size/12 |

Story Play: the prototype centres it with `translate(-50%, -50%)`; inset 0 +
margin auto gives the same result without a transform (the API's transform
support is untested here). Story Copy at 991 borrows CTA/Copy Width as the
prototype does.

### 2b. New combos (parent chain › combo name)

| Selector | Chain › combo | Base (`main`) | 991 | 767 | 479 |
| --- | --- | --- | --- | --- | --- |
| `.section.is-hero.is-photo.about-hero` | Section › Is Hero › Is Photo › **About Hero** | min-height About Hero/Min Height; padding all four 0; justify-content flex-end | min-height 0 | | |
| `.s-bg-media.about-hero-photo` | S Bg Media › **About Hero Photo** | position absolute; top About/Photo Overhang; left 0; width 100%; max-width none; height About/Photo Frame Height; object-fit cover; object-position 50% 30% | | | |
| `.home-hero-body.is-about` | Home Hero Body › **Is About** | padding-bottom Calc/About Hero Pad Bottom | padding-bottom Spacing/48 | padding-bottom Spacing/40 | |
| `.home-hero-lead-box.is-about` | Home Hero Lead Box › **Is About** | max-width About Hero/Lead Width | | | |
| `.proof-pill.is-label` | Proof Pill › **Is Label** | gap Spacing/8; padding Spacing/8 Spacing/16 | | | radius Radius/20 (all four corners) |
| `.proof-pill-text.is-light` | Proof Pill Text › **Is Light** | color Paper Tint/Paper 85 | | | white-space normal |
| `.section.is-tint.story-section` | Section › Is Tint › **Story Section** | padding-top Calc/Story Pad Top; padding-bottom Calc/Story Pad Bottom | | padding-top, -bottom Spacing/80 | |
| `.s-wrapper.story` | S Wrapper › **Story** | flex-direction row; align-items center; justify-content space-between; gap Spacing/64 | direction column; align-items stretch; gap Spacing/48 | | |
| `.chip.is-solid` | Chip › **Is Solid** | padding Spacing/8 Spacing/12; border colour transparent (all four); background Brand/Paper; color Neutral/Slate | | | |
| `.chip.is-solid.is-yellow` | Chip › Is Solid › **Is Yellow** | background Brand/Yellow; color Brand/Ink | | | |
| `.story-photo.is-vet` | Story Photo › **Is Vet** | top 0; left 41.667%; width 58.333%; height 73.333% | | | |
| `.story-photo.is-team` | Story Photo › **Is Team** | top 15%; left 0; width 38.333%; height 38.333% | | | |
| `.story-photo.is-puppy` | Story Photo › **Is Puppy** | top 56.667%; left 11.667%; width 26.667%; height 33.333% | | | |
| `.story-photo.is-cat` | Story Photo › **Is Cat** | top 76.667%; left 50%; width 30%; height 23.333% | | | |
| `.story-play-icon.ri-play-fill` | Story Play Icon › **ri-play-fill** | (empty: the bundled Remix CSS draws it; same pattern as Hero Bar Icon › ri-time-line) | | | |
| `.s-wrapper.values` | S Wrapper › **Values** | align-items center; gap Spacing/56 | | | |
| `.why-card.is-value` | Why Card › **Is Value** | gap Spacing/10; padding Spacing/32 (all four) | | | padding Spacing/24 |
| `.why-card-icon.is-value` | Why Card Icon › **Is Value** | width, height Value Icon/Size; margin-bottom Calc/Value Icon Gap | | | |
| `.why-card-icon.is-violet.is-value` | Why Card Icon › Is Violet › **Is Value** | (empty; the two-class style above reaches it) | | | |
| `.why-card-icon.is-green.is-value` | Why Card Icon › Is Green › **Is Value** | (empty) | | | |
| `.why-card-icon.is-pink.is-value` | Why Card Icon › Is Pink › **Is Value** | (empty) | | | |
| `.why-card-title.is-value` | Why Card Title › **Is Value** | font-weight Weight/Medium | | | |
| `.section.about-team` | Section › **About Team** | padding-right, -bottom, -left 0; gap Calc/About Team Gap | gap Spacing/64 | | gap Spacing/48 |
| `.s-wrapper.about-team-head` | S Wrapper › **About Team Head** | flex-direction row; align-items flex-end; justify-content space-between; gap Spacing/16 | direction column; align-items flex-start; gap Spacing/20 | | |
| `.section-head-text.about-team-lead` | Section Head Text › **About Team Lead** | flex 0 1 About Team/Lead Width; min-width 0 | flex 0 0 auto | | |
| `.team-pin.is-first` | Team Pin › **Is First** | top 13.08%; left 78.06% | left auto; right Spacing/24 | top Spacing/16; right Spacing/16 | |
| `.team-pin.is-second` | Team Pin › **Is Second** | top 52.65%; left 74.72% | left auto; right Spacing/40 | top auto; right auto; bottom Spacing/16; left Spacing/16 | |

Notes:
- Combos override the parent at every breakpoint, so Is About's 991/767
  values repeat Home Hero Body's own (48, 40); without them 4.625em would
  win on tablet and phone.
- The three-class `.why-card-icon.is-<colour>.is-value` styles only have
  to exist (importer); `.why-card-icon.is-value` publishes as a two-class
  selector and also styles them. Is Value needs its own element to be
  styled in the Designer: the first (blue) card provides it.
- Percentages in Story Photo and Team Pin combos are raw by design
  (positions as shares of the frame), not sizes.
- `aspect-ratio`: read back after the create; if the API refuses
  `1440 / 642`, set it in the Designer (Size › Ratio › Custom), row TBD-3.

## 3. WHTML markup (importer-safe)

Prepared from the prototype by script, whitespace between tags removed (no
stray " " String nodes, as on Home's hero actions). Rules applied:
- Contact Us is **not** in the markup: it is a C | Button instance (§4).
- Call / Text Clinic stays static markup with `data-call-chooser=""`
  (same as Home: Button + Is Call layers, the tel: link to North York).
- Valueless hooks carry `=""` (Webflow strips empty booleans on publish).
- `<img>`: only `class`, `src`, `alt` are written; the importer drops the
  rest and the asset link (§5 re-adds them).
- `<svg>` icons are kept inline as DOM elements (Proof Pill Leaf, two
  hero-bar icons, four Value Icons). The mask id `about-value-book-mask` is
  unique on the page.
- `<i>` icons: `hero-bar-icon ri-time-line`, `hero-bar-icon ri-heart-line`,
  `icon-glyph ri-phone-fill`, `story-play-icon ri-play-fill` — all as
  combos (existing or created in §2b).
- The one `<span>` is inline text (Proof Pill Stat), as on Home.
- Each section is one action (largest ≈ 7.5 KB, under the ~15 KB limit).

Import into the duplicated page's slot, **before** `section#locations`, in
this order: Hero, Story, Values, Divider, Team. After each action, re-check
`styleNames` on a few elements (the class list drops silently).

### 3.1 About Hero

```html
<section class="section is-hero is-photo about-hero" id="top"><div class="s-bg" aria-hidden="true" data-parallax-frame=""><img class="s-bg-media about-hero-photo" src="/images/about/hero-team.webp" alt=""><div class="s-bg-overlay home-hero-blur"></div><div class="s-bg-overlay home-hero-shade"></div></div><div class="home-hero-body is-about"><div class="s-wrapper home-hero-copy"><div class="proof-pill is-label"><svg class="proof-pill-leaf" aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15.2013 8.06563L14.601 7.83257C14.0841 7.43283 14.8009 5.96607 14.9174 5.06557C14.9174 5.06557 12.9004 5.78237 12.7337 5.38197L12.2168 4.3989L10.3503 6.4159C10.1504 6.4491 10.0671 6.4159 10.0339 6.21603L10.9004 1.98303L9.55017 2.73303C9.43363 2.76623 9.3171 2.73303 9.26697 2.6165L7.96683 0L6.61657 2.733C6.50003 2.81633 6.4167 2.84953 6.33337 2.7662L5.03323 2.0494L5.81643 6.24923C5.7331 6.39898 5.61657 6.4491 5.4167 6.36577L3.63353 4.34877C3.40047 4.69903 3.2338 5.33183 2.91673 5.44903C2.60033 5.56558 1.56647 5.21597 0.899733 5.0493C1.1328 5.88263 1.8496 7.2993 1.41667 7.7823L0.666667 8.01537L4.14967 11.0987C4.43287 11.8819 4.06633 12.1319 3.83327 12.5154L7.63343 12.0486L7.5501 15.8487H8.3333L8.18357 12.0486L11.9837 12.4822C11.7507 11.9652 11.5501 11.7322 11.7507 10.932L15.2337 8.04853H15.1503L15.2013 8.06563Z" fill="currentColor"/></svg><div class="proof-pill-text is-light"><span class="proof-pill-stat">Independent, Canadian-owned</span> animal hospital and clinic</div></div><div class="home-hero-text"><h1 class="d1">About TVS<br>Animal Hospitals</h1><div class="home-hero-lead-box is-about"><p class="home-hero-lead">We’re TVS Animal Hospitals, an independent, Canadian-owned veterinary practice caring for dogs, cats, and the people who love them across Toronto. We’re not part of a corporate chain, which means every decision we make is about your pet and nothing else. To us, your pets are family, and we look after them the way we’d want our own to be looked after.</p></div></div><div class="home-hero-actions"><a class="button" href="tel:+14165467493" data-call-chooser=""><div class="button-color is-call"><div class="button-size is-call"><div class="button-content is-call"><div class="button-icon is-well"><i class="icon-glyph ri-phone-fill" aria-hidden="true"></i></div><div>Call / Text Clinic</div></div></div></div></a></div></div></div><div class="hero-bar"><div data-draggable-marquee-init="" data-direction="left" data-duration="30" data-multiplier="35" data-sensitivity="0.01" class="draggable-marquee"><div data-draggable-marquee-collection="" class="draggable-marquee__collection"><div data-draggable-marquee-list="" class="draggable-marquee__list"><div class="hero-bar-item"><svg class="hero-bar-icon" aria-hidden="true" width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg"><g stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M7.175 9.275C7.175 10.1932 6.43067 10.9375 5.5125 10.9375C4.59433 10.9375 3.85 10.1932 3.85 9.275C3.85 8.35683 4.59433 7.6125 5.5125 7.6125C6.43067 7.6125 7.175 8.35683 7.175 9.275Z"/><path d="M10.0625 5.6C10.0625 6.51817 9.31817 7.2625 8.4 7.2625C7.48183 7.2625 6.7375 6.51817 6.7375 5.6C6.7375 4.68183 7.48183 3.9375 8.4 3.9375C9.31817 3.9375 10.0625 4.68183 10.0625 5.6Z"/><path d="M14.2625 5.6C14.2625 6.51817 13.5182 7.2625 12.6 7.2625C11.6818 7.2625 10.9375 6.51817 10.9375 5.6C10.9375 4.68183 11.6818 3.9375 12.6 3.9375C13.5182 3.9375 14.2625 4.68183 14.2625 5.6Z"/><path d="M17.15 9.275C17.15 10.1932 16.4057 10.9375 15.4875 10.9375C14.5693 10.9375 13.825 10.1932 13.825 9.275C13.825 8.35683 14.5693 7.6125 15.4875 7.6125C16.4057 7.6125 17.15 8.35683 17.15 9.275Z"/><path d="M10.5 11.025C8.225 11.025 6.125 13.3 6.125 15.225C6.125 16.625 7.175 17.15 8.4 17.15C9.275 17.15 9.8 16.7125 10.5 16.7125C11.2 16.7125 11.725 17.15 12.6 17.15C13.825 17.15 14.875 16.625 14.875 15.225C14.875 13.3 12.775 11.025 10.5 11.025Z"/></g></svg><div class="hero-bar-text">Cats &amp; Dogs</div></div><div class="hero-bar-divider"></div><div class="hero-bar-item"><svg class="hero-bar-icon" aria-hidden="true" width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg"><g stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6.5625 3.9375H14.4375C15.6456 3.9375 16.625 4.91688 16.625 6.125V15.75C16.625 16.9581 15.6456 17.9375 14.4375 17.9375H6.5625C5.35438 17.9375 4.375 16.9581 4.375 15.75V6.125C4.375 4.91688 5.35438 3.9375 6.5625 3.9375Z"/><path d="M8.75 2.625H12.25C12.7332 2.625 13.125 3.01675 13.125 3.5V4.55C13.125 5.03325 12.7332 5.425 12.25 5.425H8.75C8.26675 5.425 7.875 5.03325 7.875 4.55V3.5C7.875 3.01675 8.26675 2.625 8.75 2.625Z"/><path d="M7.875 11.55L9.625 13.3L13.125 9.8"/></g></svg><div class="hero-bar-text">Tailored testing plans</div></div><div class="hero-bar-divider"></div><div class="hero-bar-item"><i class="hero-bar-icon ri-time-line" aria-hidden="true"></i><div class="hero-bar-text">Open 7 days a week</div><div class="live-dot" aria-hidden="true"></div></div><div class="hero-bar-divider"></div><div class="hero-bar-item"><i class="hero-bar-icon ri-heart-line" aria-hidden="true"></i><div class="hero-bar-text">Caring for pets since 2009</div></div><div class="hero-bar-divider"></div></div></div></div></div></section>
```

### 3.2 Our Story

```html
<section class="section is-tint story-section" id="story"><div class="s-wrapper story"><div class="story-copy"><div class="eyebrow"><div class="eyebrow-dot"></div><div class="eyebrow-text">Our Story</div></div><h2 class="d0">Our story</h2><p class="section-head-text">Our story started in 2009, when our founding clinic opened its doors in North York. Word spread, families kept coming back, and the practice grew. In 2025, we brought our clinics together under one name, TVS Animal Hospitals, with two locations, Toronto North in North York and Parliament in Downtown Toronto. Same people, same values, same care now easier to find close to home.</p><div class="story-chips"><div class="chip is-solid is-yellow">Since 2009</div><div class="chip is-solid">North York</div><div class="chip is-solid">Downtown Toronto</div></div></div><div class="story-collage" data-reveal-stagger=""><div class="story-photo is-vet"><img class="story-photo-img" src="/images/about/story-vet-cat.webp" alt="A TVS vet holding an orange cat on the exam table"></div><div class="story-photo is-team"><img class="story-photo-img" src="/images/about/story-team-patient.webp" alt="Two TVS team members with a fluffy dog patient"><div class="story-play" aria-hidden="true"><i class="story-play-icon ri-play-fill"></i></div></div><div class="story-photo is-puppy"><img class="story-photo-img" src="/images/about/story-puppy.webp" alt="A Weimaraner puppy in a recovery cone"></div><div class="story-photo is-cat"><img class="story-photo-img" src="/images/about/story-ginger-cat.webp" alt="A ginger cat wrapped in a towel"></div></div></div></section>
```

### 3.3 What We Believe

```html
<section class="section" id="values"><div class="s-wrapper values"><div class="section-head is-center is-tight"><h2 class="d2">What we believe</h2><p class="section-head-text">Good veterinary care comes down to trust, and trust is built on honesty. That belief shapes everything we do.</p></div><div class="why-cards" data-reveal-stagger=""><div class="why-card is-value"><div class="why-card-icon is-value"><svg class="value-icon" aria-hidden="true" width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"><mask id="about-value-book-mask" fill="white"><path d="M2.0625 6.18749H7.5625C9.375 6.18749 11 7.41879 11 8.93749C11 7.41879 12.625 6.18749 14.4375 6.18749H19.9375C20.3958 6.18749 20.625 6.41666 20.625 6.87499V17.1875C20.625 17.6458 20.3958 17.875 19.9375 17.875H13.75C12.231 17.875 11 18.7998 11 19.9375C11 18.7998 9.769 17.875 8.25 17.875H2.0625C1.60417 17.875 1.375 17.6458 1.375 17.1875V6.87499C1.375 6.41666 1.60417 6.18749 2.0625 6.18749ZM11 8.93749V19.9375ZM7.3279 4.31059C8.02 2.95839 9.481 2.06479 11 2.06479C12.519 2.06479 13.98 2.95839 14.6721 4.31059"/></mask><path d="M9.5 19.9375C9.5 20.7659 10.1716 21.4375 11 21.4375C11.8284 21.4375 12.5 20.7659 12.5 19.9375H11H9.5ZM5.99264 3.62716C5.61519 4.36461 5.90703 5.26841 6.64447 5.64585C7.38191 6.0233 8.28571 5.73147 8.66316 4.99402L7.3279 4.31059L5.99264 3.62716ZM13.3368 4.99402C13.7143 5.73147 14.6181 6.0233 15.3555 5.64585C16.093 5.26841 16.3848 4.36461 16.0074 3.62716L14.6721 4.31059L13.3368 4.99402ZM2.0625 6.18749V7.68749H7.5625V6.18749V4.68749H2.0625V6.18749ZM7.5625 6.18749V7.68749C8.14075 7.68749 8.67171 7.88738 9.03368 8.17205C9.39668 8.45752 9.5 8.74357 9.5 8.93749H11H12.5C12.5 7.61272 11.7908 6.52377 10.8882 5.81391C9.98454 5.10326 8.79675 4.68749 7.5625 4.68749V6.18749ZM11 8.93749H12.5C12.5 8.74357 12.6033 8.45752 12.9663 8.17205C13.3283 7.88738 13.8592 7.68749 14.4375 7.68749V6.18749V4.68749C13.2033 4.68749 12.0155 5.10326 11.1118 5.81391C10.2092 6.52377 9.5 7.61272 9.5 8.93749H11ZM14.4375 6.18749V7.68749H19.9375V6.18749V4.68749H14.4375V6.18749ZM19.9375 6.18749V7.68749C19.9354 7.68749 19.6584 7.68596 19.3925 7.42003C19.1265 7.15409 19.125 6.87704 19.125 6.87499H20.625H22.125C22.125 6.41461 22.0089 5.79381 21.5138 5.29871C21.0187 4.80361 20.3979 4.68749 19.9375 4.68749V6.18749ZM20.625 6.87499H19.125V17.1875H20.625H22.125V6.87499H20.625ZM20.625 17.1875H19.125C19.125 17.1854 19.1265 16.9084 19.3925 16.6425C19.6584 16.3765 19.9354 16.375 19.9375 16.375V17.875V19.375C20.3979 19.375 21.0187 19.2589 21.5138 18.7638C22.0089 18.2687 22.125 17.6479 22.125 17.1875H20.625ZM19.9375 17.875V16.375H13.75V17.875V19.375H19.9375V17.875ZM13.75 17.875V16.375C12.6968 16.375 11.6862 16.6937 10.9051 17.2798C10.1238 17.8661 9.5 18.7904 9.5 19.9375H11H12.5C12.5 19.931 12.5002 19.9118 12.5226 19.8722C12.5473 19.8284 12.6012 19.7578 12.7057 19.6794C12.9198 19.5187 13.2842 19.375 13.75 19.375V17.875ZM11 19.9375H12.5C12.5 18.7904 11.8762 17.8661 11.0949 17.2798C10.3138 16.6937 9.30316 16.375 8.25 16.375V17.875V19.375C8.71584 19.375 9.08016 19.5187 9.29433 19.6794C9.39881 19.7578 9.4527 19.8284 9.47742 19.8722C9.49977 19.9118 9.5 19.931 9.5 19.9375H11ZM8.25 17.875V16.375H2.0625V17.875V19.375H8.25V17.875ZM2.0625 17.875V16.375C2.06455 16.375 2.3416 16.3765 2.60754 16.6425C2.87347 16.9084 2.875 17.1854 2.875 17.1875H1.375H-0.125C-0.125 17.6479 -0.00888813 18.2687 0.486215 18.7638C0.981318 19.2589 1.60212 19.375 2.0625 19.375V17.875ZM1.375 17.1875H2.875V6.87499H1.375H-0.125V17.1875H1.375ZM1.375 6.87499H2.875C2.875 6.87704 2.87347 7.15409 2.60754 7.42003C2.3416 7.68596 2.06455 7.68749 2.0625 7.68749V6.18749V4.68749C1.60212 4.68749 0.981318 4.80361 0.486215 5.29871C-0.00888813 5.79381 -0.125 6.41461 -0.125 6.87499H1.375ZM11 8.93749H9.5V19.9375H11H12.5V8.93749H11ZM7.3279 4.31059L8.66316 4.99402C9.09876 4.14297 10.0442 3.56479 11 3.56479V2.06479V0.564793C8.91783 0.564793 6.94124 1.77382 5.99264 3.62716L7.3279 4.31059ZM11 2.06479V3.56479C11.9558 3.56479 12.9012 4.14297 13.3368 4.99402L14.6721 4.31059L16.0074 3.62716C15.0588 1.77382 13.0822 0.564793 11 0.564793V2.06479Z" fill="currentColor" mask="url(#about-value-book-mask)"/></svg></div><h3 class="why-card-title is-value">Education Over Pressure</h3><p class="why-card-text">We explain what’s going on and what your options are, and we never push procedures your pet doesn’t need.</p></div><div class="why-card is-value"><div class="why-card-icon is-violet is-value"><svg class="value-icon" aria-hidden="true" width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.9961 1.45329C12.2376 2.37311 13.3743 3.42671 14.3857 4.59489L14.3877 4.59587C16.6711 7.2182 17.8125 9.91044 17.8125 12.3752C17.8125 14.1819 17.095 15.915 15.8174 17.1926C14.5399 18.4701 12.8067 19.1877 11 19.1877C9.19326 19.1877 7.4602 18.4701 6.18262 17.1926C4.90506 15.915 4.18755 14.1819 4.1875 12.3752C4.1875 9.91045 5.32887 7.2182 7.61231 4.59587L7.61426 4.59392C8.62336 3.4265 9.7574 2.37324 10.9961 1.45329Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></div><h3 class="why-card-title is-value">Transparent From The Start</h3><p class="why-card-text">You’ll always know what to expect, including the cost, before we go ahead.</p></div><div class="why-card is-value"><div class="why-card-icon is-green is-value"><svg class="value-icon" aria-hidden="true" width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.35661 4.18162C7.48003 4.18095 8.55783 4.62699 9.3527 5.42088C9.35841 5.42657 9.36439 5.43198 9.37028 5.43748L10.4875 6.48143C10.7753 6.7505 11.2225 6.75095 11.5109 6.48241L12.6359 5.43553C12.6419 5.42991 12.6476 5.42377 12.6535 5.41795C13.2467 4.82775 14.0014 4.42625 14.8224 4.26463C15.6435 4.10302 16.4942 4.18841 17.2668 4.50975C18.0392 4.83105 18.6991 5.37426 19.1632 6.0703C19.6274 6.76643 19.8756 7.58509 19.8752 8.42186V8.42381C19.8764 8.97931 19.7666 9.52991 19.5539 10.043C19.3411 10.556 19.0287 11.0216 18.6349 11.4131L18.63 11.4189L10.9992 19.1611L3.37028 11.4189L3.3654 11.415L3.22087 11.2627C2.51672 10.4861 2.12385 9.47322 2.12321 8.41991C2.12259 7.29655 2.56861 6.21863 3.36247 5.42381C4.15633 4.62916 5.23334 4.18231 6.35661 4.18162Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></div><h3 class="why-card-title is-value">Relationships, Not Transactions</h3><p class="why-card-text">We follow up, we remember your pet, and we’re here for the long run.</p></div><div class="why-card is-value"><div class="why-card-icon is-pink is-value"><svg class="value-icon" aria-hidden="true" width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.3438 2.8125C13.424 2.8125 15.4187 3.63938 16.8896 5.11035C18.3607 6.58134 19.1875 8.57596 19.1875 10.6562C19.1875 12.7365 18.3607 14.7312 16.8896 16.2021C15.4187 17.6732 13.424 18.5 11.3438 18.5H4.125C3.95919 18.5 3.79979 18.4346 3.68262 18.3174C3.56544 18.2002 3.5 18.0408 3.5 17.875V10.6572C3.50228 8.57741 4.32916 6.58295 5.7998 5.1123C7.27026 3.64185 9.26424 2.815 11.3438 2.8125Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></div><h3 class="why-card-title is-value">Easy To Reach</h3><p class="why-card-text">Talk to a real person by phone, text, or email, 7 days a week, with evening hours when you need them.</p></div></div></div></section>
```

### 3.4 Page Divider

```html
<div class="page-divider"></div>
```

### 3.5 About Team

```html
<section class="section about-team" id="team"><div class="about-team-wrap"><div class="s-wrapper about-team-head"><div class="about-team-intro"><div class="eyebrow"><div class="eyebrow-dot"></div><div class="eyebrow-text">Our Team</div></div><h2 class="d2">The people behind TVS Animal Hospitals</h2></div><p class="section-head-text about-team-lead">Our team is a close group of veterinarians, technicians, and support staff who genuinely love their work, and it shows in how they treat your pet and you. Our practice was founded by Behrooz Tamjidi DVM, who leads our surgical team and set the tone of honest, relationship-driven care we’re known for.</p></div></div><div class="about-team-media" data-parallax-frame=""><img class="about-team-photo" src="/images/about/team-group.webp" alt="The TVS team, vets, technicians and support staff, with dogs and cats in the clinic"><div class="team-pin is-first"><div class="team-pin-dot" aria-hidden="true"><div class="team-pin-dot-inner"></div></div><div class="team-pin-text"><div class="team-pin-name">Behrooz Tamjidi DVM</div><div class="team-pin-role">Founder · Leads our surgical team</div></div></div><div class="team-pin is-second"><div class="team-pin-dot" aria-hidden="true"><div class="team-pin-dot-inner"></div></div><div class="team-pin-text"><div class="team-pin-name">Our team</div><div class="team-pin-role">Vets, technicians &amp; support staff</div></div></div></div></section>
```

## 4. Components and hooks after the import

| Where | Component | Props / settings |
| --- | --- | --- |
| Hero › Home Hero Actions (prepend, before the Call link) | **C \| Button** `e6bbfb98-a077-7e52-8a94-f86f22d3c82c` | Label "Contact Us"; Link → page Contact (until that page exists: URL `/contact-us`, as on Home); Icon Before off; Icon After off; Color base (Primary); Size base (Default). Same values as Home's hero. |
| CTA (kept from the duplicate) | **CTA** `25dab600-c3f8-6f46-adaf-1487aa16c392` | Heading "Come say hello"; Text "Whether your pet needs a checkup, a hand with something urgent, or you’re simply looking for a vet who’ll treat them like family, we’d love to meet you. Book online, or reach us by phone, text, or email."; Button label "Get in Touch" (default); Button link `/contact-us` (default) |
| Clinics | (kept section, not a component) | unchanged from Home |

Hooks the importer keeps (check with `get_attributes`): `data-parallax-frame=""`
on the hero's S Bg and on About Team Media; `data-reveal-stagger=""` on Story
Collage and on Why Cards; `data-call-chooser=""` on the call link; the five
`data-draggable-marquee-*` / `data-direction` / `data-duration` /
`data-multiplier` / `data-sensitivity` on the hero bar; `aria-hidden` on
S Bg, svgs, icons and Team Pin Dot; section ids `top`, `story`, `values`,
`team`.

Modules used (all in the repo bundle already): parallax (frame mode),
reveal, draggable-marquee, marquee-clip (CTA), call-chooser. No new repo CSS
and no new module.

## 5. Images

None of these is in the site's assets yet (84 assets listed 2026-11-13;
the `about-*.webp` ones are Home's About Intro collage, not these). Upload
from `prototype/public/images/about/`, then `set_image_asset` on each Image
in document order and re-add the attributes the importer drops.

| Element (class) | File | Size | Alt | `set_attributes` |
| --- | --- | --- | --- | --- |
| S Bg Media + About Hero Photo | `hero-team.webp` | 1920×1240, 132 KB | decorative (empty alt, see TBD-6) | `data-parallax="frame"`, `loading="eager"`, `fetchpriority="high"` |
| Story Photo Img (Is Vet) | `story-vet-cat.webp` | 700×880, 32 KB | A TVS vet holding an orange cat on the exam table | `loading="lazy"` (default) |
| Story Photo Img (Is Team) | `story-team-patient.webp` | 460×460, 20 KB | Two TVS team members with a fluffy dog patient | |
| Story Photo Img (Is Puppy) | `story-puppy.webp` | 320×400, 12 KB | A Weimaraner puppy in a recovery cone | |
| Story Photo Img (Is Cat) | `story-ginger-cat.webp` | 360×280, 20 KB | A ginger cat wrapped in a towel | |
| About Team Photo | `team-group.webp` | 2070×941, 168 KB | The TVS team, vets, technicians and support staff, with dogs and cats in the clinic | `data-parallax="frame"` |

`hero-team-1000.webp` is not needed: Webflow makes its own responsive
sizes. `set_attributes` on imported Images worked on Home (About Intro
Photo carries `data-parallax="frame"`); if one refuses (GOTCHAS 2026-11-13,
images inside a dialog), move the hook to a wrapper only for
`data-parallax-frame`, never for `data-parallax="frame"` — the module needs
it on the image itself, so then use row TBD-6.

## 6. CMS bindings

| List | Source | Filter | Sort | Limit | State |
| --- | --- | --- | --- | --- | --- |
| Clinics › Clinic Cards (DynamoList) | Locations `6af7416f18d49df547956a48` | none | Sort order, ascending | none (2 items) | kept from Home duplicate; bindings as on Home (Card photo, Area label, Name, Card description, Address, Phone link + text, Map link, Locations URL Path; Open clinic label) |
| CTA › phones | Locations | — | — | — | inside the CTA component, nothing to do |
| CTA › gallery marquee | Gallery `6af741720c576e56bcc479bc` | — | — | — | inside the CTA component, nothing to do |

**Team collection is not used on this page**: the two pins ("Behrooz
Tamjidi DVM · Founder · Leads our surgical team", "Our team · Vets,
technicians & support staff") are placed by hand on the group photo, as in
Figma. No FAQ, Reviews or Services list on this page.

## 7. Page settings

From the live page (`webflow-tvs-live`, page `6a29b0b8f0f13591c90bb9cd`,
read only, 2026-11-13):

| Field | Value |
| --- | --- |
| Title | About Us |
| Slug | `about-us` (root, no folder) |
| SEO title | About TVS Animal Hospitals \| Toronto's Family Vet |
| SEO description | Meet the team behind TVS Animal Hospitals. Proudly Canadian, independent and education-first, caring for Toronto pets across two clinics since 2009. |
| Open Graph title / description | copied from SEO (`titleCopied: true`, `descriptionCopied: true`), as live |
| Open Graph image | live has none. Suggest the default share image `og-default-1200x630` (asset `6af62d9393033fc0c9854686`), or ask the person whether the hero team photo should be the share image |
| JSON-LD | live has none |
| Head / footer code | none (do not copy Home's; Home has none either) |
| Indexing | indexed (the live page is) |

`update_page_settings` on the new page id with `seo` and `openGraph` as
above. The `<title>` in the prototype ("About Us | TVS Animal Hospitals") is
not used; live SEO wins.

## 8. Manual Designer steps (new MANUAL-TODO rows, letters TBD)

| ID | Where | Breakpoint | Set | Why the API can't |
| --- | --- | --- | --- | --- |
| TBD-1 | Team Pin › Box shadow; Live Dot › Box shadow | Desktop | Team Pin: Y Spacing/16, blur Spacing/40, colour Ink Tint/Ink 12 (literal `0 1em 2.5em #0808291f` in). Live Dot: spread Spacing/4, colour Paper Tint/Paper 12 (literal `0 0 0 0.25em #ffffff1f` in) | A shadow with variables is stored as one variable binding (`lessons/mcp.md`, row E) |
| TBD-2 | Only if the six Calc variables are declined: Home Hero Body + Is About (pb), Section + Is Tint + Story Section (pt, pb), Why Card Icon + Is Value (mb), Page Divider (width), Section + About Team (gap) | Desktop | `calc(` with the variable picker, values as §1 | A value mixing variables in a calc can't be written (row M) |
| TBD-3 | Only if refused: About Team Media › aspect ratio 1440/642 (767: 4/3); Story Collage › 1/1 | Desktop, 767 | Size › Ratio › Custom | if the API refuses `aspect-ratio` |
| TBD-4 | Only on the fallback route: the "To Slot" wrapper into G \| Main's slot, ungroup; copy Home's Locations section (Cmd+C / Cmd+V keeps its list settings) | — | as row K | The API can't start a slot's content; a section with a list can't be a component |
| TBD-5 | Only if the duplicate lost it: Clinics list sort / bindings | — | as Home (row N, Q, R) | list query writes may conflict (GOTCHAS 2026-11-13) |
| TBD-6 | Hero photo › Image settings › Alt text: Decorative; and any image that refused `set_attributes` | — | mark decorative; add the `data-parallax="frame"` attribute by hand | Empty alt from the API may publish as a missing alt; attributes refused on some imported images |
| TBD-7 | G \| Nav W › "About Us" nav link (and the footer's About link, if a URL link) | — | Switch from URL `/about-us` to a page link to About Us, so Nav Link · Current applies (row G's note) | Page links on links inside components are set in the Designer |

Rows that change something visible get a `data-manual-todo` Caption marker
per the MANUAL-TODO rules (TBD-1, TBD-3 only if they apply).

## 9. Check list after the import

Structure and classes
- [ ] Page About Us at `/about-us`, inside G | Page W; slot order: About
      Hero, Story, Values, Page Divider, About Team, Locations, CTA. No other
      Home section left.
- [ ] Every imported element kept its full class list (spot-check one
      element per combo in §2b, especially the 4-deep About Hero and the
      three Why Card Icon colour + Is Value chains).
- [ ] No new empty `ph`/unknown combos created by the import
      (`query_styles` for names made today).
- [ ] Every style read back with its variable bindings (not raw values),
      incl. 991/767/479 (`include_breakpoints`).
- [ ] Contact Us C | Button: Label, Link, both icon switches off, Primary /
      Default. Call / Text link: phone `tel:+14165467493`,
      `data-call-chooser`, no stray `href` custom attribute.
- [ ] CTA props Heading and Text overridden; Button label/link default.

Images and hooks
- [ ] Six images have their assets and alts; hero `loading="eager"`,
      `fetchpriority="high"`, `data-parallax="frame"`; team photo
      `data-parallax="frame"`.
- [ ] `data-parallax-frame` on S Bg and About Team Media;
      `data-reveal-stagger` on Story Collage and Why Cards.

Published staging (wf-tvs.webflow.io/about-us) at 1440, 991, 767, 375,
side by side with `http://localhost:5955/about-us/`:
- [ ] Hero 993px tall at 1440 incl. the bar; photo parallaxes inside its
      frame (no gap at the top or bottom while scrolling); blur + shade
      over it; marquee drags; live dot green with its ring.
- [ ] Proof pill: maple leaf, "Independent, Canadian-owned" in white
      stat colour, rest Paper 85; wraps at 479 with 20px corners.
- [ ] Story: collage square, four photos fade in one after the other,
      yellow play badge centred on the team photo; stacks under the copy at
      991; chips Since 2009 (yellow), North York, Downtown Toronto.
- [ ] Values: four cards in a row, 38px icon wells in blue / violet / green
      / pink, Medium titles; staggered fade-in.
- [ ] Divider: hairline the width of the container.
- [ ] Team: heading left, lead right (stacks at 991); photo full bleed with
      parallax; pins at their positions, at 767 one top-right and one
      bottom-left, never covering faces badly (check at 375).
- [ ] Clinics: both clinic cards from the CMS, Open clinic and Get
      Directions links work.
- [ ] CTA: "Come say hello", both phones, gallery marquee.
- [ ] Call / Text Clinic opens the Call Chooser; Escape closes it.
- [ ] No horizontal scroll at any width (`pnpm wf:overflow /about-us`);
      `pnpm wf:compare /about-us` against the prototype.
- [ ] `<title>` and meta description match live (`pnpm wf:seo`); one H1
      ("About TVS Animal Hospitals"); no `data-manual-todo` left once rows
      are done.
- [ ] Nav "About Us" marks Current on this page (after TBD-7).

## Open points for the person

- Approve the six Calc variables (§1) or keep them as Designer steps.
- Reuse of About/Photo Overhang and About/Photo Frame Height for two more
  photos, or rename them to a shared Parallax group.
- Open Graph image: default share image or the hero team photo.
- The play badge on the story photo marks a video still; no video file
  exists yet, so it is decoration only (as in the prototype).
