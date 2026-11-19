# TVS — design handoff → Webflow build

The brief every build session starts from. Written when the design is
approved (by the designer, or at the end of the prototype phase) and kept
current during the build. Agents read it after `AGENTS.md` and `GOTCHAS.md`.

## Read first

1. `AGENTS.md`, `GOTCHAS.md`, and the skill's `conventions.md`.
2. This file, then `MANUAL-TODO.md` and `BUILD-NOTES.md` in this folder;
   after the build handoff, `REVIEW.md` (feedback rounds until launch) and
   `SEO-PLAN.md`.
3. The approved design: <prototype folder and its URL>, built from <Figma file link>.

## Status

2026-11-12 (evening) — In Webflow and published to staging:
- Variables (P1–P22 + nine Calc variables), fonts, 306 Home/shell
  classes, 75 Sgd classes, tag styles; repo port on master (modules,
  repo CSS with raw fallbacks, no env switcher, no Phosphor, badge hidden).
- Style guide: all ten docs pages in design › style-guide, noindex,
  built from the regenerated prototype pages; Buttons/Forms/Blocks use
  component instances (C | Button, C | Icon Button, Icon, Icon Size,
  Why Choose) and real form controls.
- Home: nav and footer rebuilt inside G | Nav W / G | Footer W; ten
  sections in the page slot with static content (CMS binding later);
  components Why Choose, CTA (props Heading, Text, Button label, Button
  link), Top Bar, Nav Callout, Call Chooser; 57 images as assets.
C | Button has Color and Size props (linked in the Designer); every
instance on Home, in the nav components and on the docs pages is set
and published (MANUAL-TODO L done). Waiting on the person: MANUAL-TODO D–G; the ss03/ss08 question on Body. Not done: CMS
collections and bindings, Light/Call as C | Button variants, the
Navigation page (/design/navigation), services template.

## Ground rules for this project

- <Who gives the go-ahead for Webflow writes, and how.>
- <Anything that differs from conventions.md, agreed with the designer.>
- <Which repo or folders are read-only, if any.>

## Pages

| URL | Design source | Webflow page | Notes |
| --- | --- | --- | --- |
| `/` | <prototype file> · <Figma frame link> | Home | |
| `/<page>` | | | |
| `/<collection>/<item>` | | <Collection> template | CMS template |
| `/design/style-guide` | | Style guide (folder `design`) | first page built; excluded from search |
| `/design/media` | | Media (folder `design`) | only when a page plays a video; excluded from search |
| `/design/navigation` | prototype `design/navigation/` | Navigation (folder `design`) | every nav component open, for editing; noindex, excluded from search and the sitemap |

Breakpoints: 991 (tablet), 767 (mobile landscape), 479 (mobile). Checked at
<widths>.

## Variables and classes

- Variable changes, as old → new, grouped for approval: <file or list>.
- New classes, with what each is for: <CLASSES.md or list>.
- Approval state: <approved / pending, by whom, when>.

## CMS

| Collection | Fields | Used on |
| --- | --- | --- |
| Services (`services`) | Field groups in page order: SEO (meta title, meta description) · Filters & sort (sort order) · Tile (icon, service colour, description, bullets, tags) · Hero (H1, intro, photo, marquee 1–4) · How we can help (heading, intro, group 1–3 title) · When to book (heading, intro, image, step 1–4 title + body) · FAQ (heading) | `/services/{slug}` template; tiles on Home, locations, Services index; nav dropdown |
| Service Items (new) | name, body, Service (ref), group (option 1/2/3), sort order | 3 lists on the service template, one per group |
| Locations (new, `locations`) | SEO · Filters & sort · Card (area label, illustration, card description) · Hero (eyebrow, H1, intro, highlight 1–4, video, poster) · Clinic info (email, phone, text number, address, directions note, map link, hours) · CTA (heading, text) | `/locations/{slug}` template (same URLs as the live static pages); clinic cards, nav dropdown, footer, CTA phones, Contact |
| Blogs (`blog`) | SEO · Filters & sort (Category ref, Author ref, date posted, featured) · Card (excerpt, cover, cover alt) · Content (rich text) · Related service (ref Services) | `/blog`, `/blog/{slug}` |
| Blog Categories | name, colour, SEO | filter chips, category on cards (reference from Blogs) |
| Authors (new) | name, role, photo | post header (reference from Blogs) |
| FAQs | question, answer (rich text), Service (ref), Location (ref), show on home, sort order | FAQ component on Home, service and location templates |
| Team | name, role, bio, photo, sort order | Home |
| Reviews | reviewed by, review, photo, where from, sort order | Reviews component |
| Gallery | name, image | CTA photo marquee |

## Components to make

| Component | Used on | Props | Behaviour inside |
| --- | --- | --- | --- |
| Nav | every page | — | <modules> |
| Footer | every page | — | — |
| <Name> | | | |

## Modules

| Module | `data-*` hooks | What it does |
| --- | --- | --- |
| <name> | `data-…` | |

## Decisions

- 2026-11-11 · Locations become a collection at the live URLs. Each clinic
  keeps its own Form block: North York forms notify
  TorontoNorth@tvshospitals.com, Parliament forms
  Parliament@tvshospitals.com.
- 2026-11-11 · CMS fields are grouped (Webflow field groups), in the order
  the page reads top to bottom, with SEO and Filters & sort groups.
- 2026-11-11 · The new services copy (`Assets/content/tvs-service-pages/`)
  replaces the live service pages in full: body, meta titles and
  descriptions, and FAQs. Live slugs stay.
- 2026-11-11 · Blog categories and authors are their own collections,
  referenced from Blogs.
- 2026-11-11 · Breakpoints are Webflow's defaults (base, 991, 767, 479).
  The Figma file has desktop frames only; smaller widths are derived.
- 2026-11-11 · Nav dropdown: Option A, one container whose menus swap
  inside it (behaves like Apple's nav). Surgery "How we can help": Option A.
- 2026-11-11 · Parliament is labelled "Cabbagetown" on clinic cards and
  "Downtown Toronto" in the nav and on Contact, exactly as designed.
- 2026-11-11 · 301 redirects are created by the team before launch (the
  API can't read the live ones). GTM `GTM-W4QNPPMP` carries over.
- 2026-11-11 · Style guide: by the person's request it is documentation
  pages in `design/style-guide/` (introduction, logo, colour, typography,
  layout, icons, buttons, forms, blocks, class-index, proposals), with its
  own layout (`src/css/style-guide-docs.css`, Sgd classes), not the
  template's one page. `prototype/scripts/style-guide-pages.mjs` writes
  them; the skill's generated page stays as the source and for the check.
- 2026-11-12 · Style guide rule (the person): every component and element
  shows all its variants, sizes and states (default, hover, focus, pressed,
  disabled; open/closed; empty, loading, error where they apply), on light
  and on navy. States are shown at rest through the generated
  `src/css/style-guide-states.css` (`.sgd-force-<state>`); the checklist is
  on the Blocks page. New classes for this: Button Is Disabled, Button
  Color Is Ghost, Form Input Is Error, Form Help, Form Error, Form Check,
  Form Check Input, Form Message (Is Success, Is Error).
- 2026-11-12 · The Dark theme is `.section.is-dark`; proposal P4 targets it.
- 2026-11-12 · Fluid scaling confirmed by the person: design frame 1440px
  at 16px, scaling up to 1680px (`--size-container-ideal: 1440`, min
  1440px, max 1680px in `src/styles.css` §01; `dist/` rebuilt, uncommitted).
- 2026-11-12 · Focus: the ring is for keyboard users only. A focused field
  darkens its border (P12); the ring on fields comes from the repo
  (`.is-keyboard .form-input:focus`, module focus-modality).
- 2026-11-12 · Form controls are custom: select (module select) and date
  field (module date-picker). Both open in the browser's top layer
  (`popover`), placed by `modules/popover.ts`, so no parent clips them and
  they follow the field on scroll. Flatpickr from the live site is not
  carried over.
- 2026-11-12 · Buttons, from the Figma props: Primary, Secondary (outline,
  inverts on hover, P15), Light (white), Call (outline pill with the yellow
  36px phone well; 50px high, 6px around the well). Button height 48px,
  small 36px. Chips are always uppercase (P14).
- 2026-11-12 · Fonts: Hanken Grotesk from the person's files
  (`Assets/fonts/hanken-grotesk/`, variable TTF, OFL). Instrument Sans is
  still a Google Fonts stand-in in the prototype; its files are needed.
- 2026-11-12 · Remix Icon is the npm package `remixicon` (4.9.1) in the
  prototype. For the repo: `pnpm add remixicon` and import its CSS, or a
  subset script like `pnpm phosphor`; decide at the repo port.
- 2026-11-12 · Shell built in the prototype (`partials/nav.html`,
  `partials/footer.html`, CTA in `index.html`, classes in
  `src/css/new-classes-shell.css`). G | Nav W = Top Bar + Nav, sticky with
  top −41px so only the nav bar stays (P16). Nav menus: one panel
  container, height animated by module `nav`, Option A; the Services menu
  is not drawn in Figma and is Claude's layout (2-column list with the
  service icons). Theme Dark is a new class that sets the Dark mode on
  non-section elements (nav callout, footer). CTA: component with props
  Heading, Text, Button label, Button link; gallery in Osmo's Draggable
  Marquee (module `draggable-marquee`, GSAP as a package, code unchanged)
  plus module `marquee-clip` (items clipped from their edges by position:
  full at the edges and centre, smallest between; images never scale).
- 2026-11-12 · Lesson: never set a font-size on an element whose padding
  or max-width reads a Layout variable in em; the em resolves against that
  font-size and the element stops lining up with the page (the top bar).
- 2026-11-12 · Stand-ins: clinic illustrations and CVO badge are 1x
  exports from Figma (132px, 72px); gallery photos come from the live site
  (600 KB to 1 MB each, to be resized). The top bar's "Open … Today" text
  is static; a module for live opening hours is not built.
- 2026-11-12 · Smooth scrolling: Lenis (package `lenis`, module
  `smooth-scroll`), lerp 0.14, wheel multiplier 1, touch left native,
  anchors on, off for reduced motion, driven by GSAP's ticker so
  ScrollTrigger stays in step. Inner scrollers carry `data-lenis-prevent`.
  Its CSS is in `repo.css` (third-party).
- 2026-11-12 · Marquee jank, cause and fix: `marquee-clip` measured every
  item and read computed style on every frame, and the nine gallery photos
  were 1080px JPEGs of 600 KB to 1 MB. Now one layout read per frame with
  cached offsets, and photos resized to 800px (1.2 MB in total; originals in
  `Assets/content/live-site/gallery-originals/`). Measured: 16.7 ms median
  and worst frame while wheel-scrolling through the CTA at 1440.
- 2026-11-12 · Phone wells shake and ripple on hover/focus (@keyframes,
  repo CSS). Locations menu cards are vertical (image, info, hours, Open
  clinic button). CVO emblem: the official 300px file from the live site.
- 2026-11-12 · Navigation page (the person's way of working): a page
  "Navigation" in the folder design (`/design/navigation`), noindex,
  excluded from search and the sitemap, holding one instance of every nav
  component laid out open (Top Bar, Nav bar, Nav Menu · Services, Nav Menu
  · Locations, Nav Callout, Footer), so the client edits menus there
  without hovering. Nav Callout is its own component, used in both menus.
  Prototype: parts in `partials/nav/*.html`; `pnpm nav`
  (`scripts/build-nav.mjs`) writes `partials/nav.html` and
  `design/navigation/index.html`, both generated.
- 2026-11-12 · Gotcha for the build: the service icons are inline SVGs with
  ids (clip paths, masks). Two copies on one page (the nav and the
  Navigation page) repeat the ids and the second copy's clipped shapes go
  blank. The prototype suffixes the ids of the second copy; in Webflow the
  icons need unique ids per place they are used, or ids removed where the
  clip is not needed.
- 2026-11-12 · Home hero built (Figma 684:9602): `index.html`, classes in
  `src/css/new-classes-home.css`. Desktop min-height `calc(100dvh -
  7.6875em)` (the window under the 123px header, so the reassurance bar
  sits at the fold; asked for by the person); tablet and below size to
  content. Section uses a new colour mode Photo (P21) so the primary
  button stays blue on the photo. Buttons now 48px / 36px small (P20); the
  starter's Button/Height gave 45px because the em resolved against the
  button's 15px type. H1 line height 1.04 (P19). The progressive blur is
  backdrop-filter plus mask-image (repo CSS, designer-cant); the navy shade
  is a gradient with raw ink alphas (a manual step in the Designer).
  Figma's hidden "Photo (blurred)" layer (a puppy photo under the main
  photo) is never visible and was not carried over. Hero photo from the
  Figma source, 1855px JPEG 300 KB plus a 1000px version.
- 2026-11-12 · Open: "1,000+ happy patients" is marked in Figma as a
  placeholder to confirm with the client.
- 2026-11-12 · Every call button says "Call / Text" (the client wants to
  push texting) and opens the Call Chooser: a site-wide dialog component
  (in G | Nav W, part `partials/nav/call-chooser.html`, module
  `call-chooser`) with one card per clinic (name, area, number) and Text (`sms:+1…`) and Call (`tel:+1…`) buttons. Layout
  from Figma 727:2413 (384px card); title row, close button and the
  Text and Call buttons added; no underline on the number and no "Call or
  text" pill (both at the person's request). Native `<dialog>`: top layer, focus
  trap, Escape and backdrop close, focus back to the button; Lenis pauses
  while open. Without JS the button is a `tel:` link to North York. Card
  names "Toronto North Location" / "Parliament Location" and the area
  "Cabbagetown" are from the sketch; confirm against the Locations CMS
  names. Text messages: `sms:` with no body works on iOS and Android; a
  prefilled message needs different syntax per platform, so none is set.
- 2026-11-12 · Motion modules, reusable (the person: "we will need card
  staggered fade in in many places"): `reveal` — `data-reveal-stagger` on a
  group fades and lifts its children (or its `[data-reveal-item]`s) in one
  after another as they scroll in, row by row (ScrollTrigger.batch), once,
  with optional `data-reveal-stagger="<s>"` and `data-reveal-y`. Nothing is
  hidden by CSS, so the Designer canvas, no-JS and reduced-motion visitors
  see everything. `parallax` — `data-parallax="<speed>"` (0.25 on the hero
  photo); transform only, off for reduced motion.
- 2026-11-12 · Why Choose built (Figma 684:9652), a component for the home
  and location pages. New site-wide pieces: Eyebrow (dot and label),
  Section Head Is Center, Section Actions. The fourth card title is Medium
  in Figma and SemiBold in the other three; built SemiBold for all four.
- 2026-11-12 · Variables everywhere (the person: no raw values on
  elements, few new variables, no element borrowing another's). Every
  value in `new-classes*.css` is a variable; new ones are proposal P22
  (type sizes 10/22, line heights Compact 1.3 and Comfortable 1.6,
  spacing 6/10/28, radius 24, Paper 8/85 and Ink 90 tints, Effects
  Disabled Opacity and three blurs, and one Layout variable per sized
  component: top bar, logo, phone well, button well, icon well, service
  icon, avatar, rating, check, eyebrow dot, clinic image, chooser, select
  list, date picker, footer logo/badge/columns, CTA copy, gallery items,
  hero bar/divider/photo/copy offset/title/lead, section head). Font
  sizes sit on text elements only (new leaves Topbar Text, Topbar Pill
  Text, Hero Bar Text, Eyebrow Text, Home Hero Lead Box), so em spacing on
  containers resolves against 16px. Snapped to the scale: 60px → 64
  (hero bar gaps, hero copy bottom), 18px → 16 (proof pill right), 3px
  focus offset → 4, eyebrow 80% opacity dropped, gradient stops 60% → Ink
  64 and 98% → Ink, every disabled opacity → Effects/Disabled Opacity
  (0.4). The 1279px media rules are gone from the shell. The docs frame
  (`style-guide-docs.css`, Sgd classes) keeps raw values: it is
  documentation chrome, not site design.
- 2026-11-12 · Lenis no longer uses `data-lenis-prevent`: a sideways
  scrolling table froze the page (GOTCHAS). Inner scrollers are decided
  per wheel with Lenis's `prevent` option.
- 2026-11-12 · Homepage built in the prototype, every section from its
  Figma frame (684:9575), variables only: Services (Figma 730:2474: ten
  tiles from Services with icon in Service colour, Tile description, Tile
  tags — placeholder tags on every tile until the CMS has each service's
  own — and the "We have more to offer" banner with the dog cut-out;
  section Is Tint), About Intro (photo with the panel lifted over it; the
  collage is Osmo's Collage Focus Card on Hover, module
  `interactive-collage`, with one marked change so cards stay inside the
  collage), Team (nine cards from Team, cut-outs from Figma; no flip, no
  bio — removed at the person's request), Locations (two clinic cards from
  Locations), Reviews (Figma cards in a sideways-scrolling row, three in
  view, previous/next buttons, module `slider`; eight reviews from Figma
  684:10061 and 684:16344; the Osmo Cascading Slider was tried and
  reverted at the person's request), FAQ (sticky head, accordion module,
  answers from the live FAQs; Show on home), Latest Blog Posts (three
  newest from Blogs). The CTA gallery reveals left to right with scale and
  opacity as it scrolls in (reveal module, `data-reveal-order="x"`).
  `reveal` now uses opacity only, never visibility, so revealed cards stay
  in the Tab order. The eyebrow colour follows the theme (Text/Accent).
- 2026-11-12 · Services template started in the prototype
  (`/services/diagnostics`, Figma 684:10562): hero (breadcrumb, H1,
  intro, clinic phone cards, photo), the marquee of the four Hero marquee
  fields (Hero Bar classes, plus a live dot), How We Can Help (up to three
  tinted groups of Service Items, numbered by CSS counters), When To Book
  (four steps in a card), FAQ (the home FAQ component, filtered by
  Service, rich-text answers), then the shared Reviews and Locations
  (now partials, one Webflow component each). Template rules from the
  variants: a group title is optional and hidden when empty (Allergy has
  one untitled group); When To Book without steps shows its image on the
  right and the intro as rich text (Travel, 684:16335) — conditional
  visibility, a Designer step. How We Can Help numbering restarts at 01 in
  every group, on every service, Surgery included (the person, 2026-11-12;
  Figma's Surgery frame 684:10984 numbers on across groups and is not
  followed there).
- 2026-11-12 · Forms keep the live site's structure and behaviour (the
  person: "the form structure and functionality should be the same as
  what is live too (all forms)"); Figma sets only the look. The three
  live clinic forms share one 26-field structure: "Lead North York" (the
  North York location page), "Registration - North York", "Registration -
  Parliament" (the Parliament location page and Contact). Same field
  names, data-names, required flags, options, order, the N/A checkbox,
  "Send Message", "Please wait...", and the success and error texts. The
  date fields submit yyyy-mm-dd (live: flatpickr "Y-m-d"); our date
  picker now writes that format and blocks future dates of birth. The
  10-field landing forms ("North York New", "Parliament New", "North York
  Dental") come with those pages. Prototype: `scripts/build-forms.py`
  writes `partials/forms/*.html`; `form-preview` (prototype only) shows
  the success state as Webflow would.
- 2026-11-12 · Locations template built in the prototype
  (`/locations/north-york`, Figma 684:11995): the location hero (eyebrow,
  H1, intro, four highlights, email, hours, a static "Open today" status,
  address and directions, Call or text card, video poster with play, the
  clinic form), then the shared Services, Why Choose, Reviews, a
  per-location FAQ (live FAQs) and the CTA. Open: Figma's note that the
  location pages' Services "will have drop downs for the content" is not
  designed yet; the shared Services section is used. The video file and
  a live open-hours status are still to come.
- 2026-11-13 · Desktop scaling in bands (the person): up to 1920px wide
  the layout stays at the 1440 frame (16px, container 1200px); 1921–2240px
  it scales to a 1680 frame (18.67px, 1400px); above 2240px to a 1920
  frame (21.33px, 1600px). `--size-container-max` is 1440px with two
  min-width media queries (1921, 2241) in `src/styles.css` §01 and the
  prototype's stand-in. Replaces the 2026-11-12 range 1440–1680.
- 2026-11-13 · All remaining pages built in the prototype (the person:
  "Built all of these"): About (`/about-us`, Figma 684:11295), Contact
  (`/contact-us`, 684:13978; a clinic switch with "Lead North York" and
  "Registration - Parliament", module contact-tabs), Blog (`/blog`,
  684:11647; featured, search, sort, topic chips, show more, module
  blog-filter) and the Blog post template
  (`/blog/spaying-a-cat-age-and-recovery`, 684:14697; rich text class
  Post Body), the Services index (`/services`, no frame: page head plus
  shared sections), and the five landing and registration pages
  (`/north-york-vet`, `/parliament-vet`, `/north-york-pet-dental`,
  `/north-york-registration`, `/parliament-registration`; no Figma, the
  live pages rebuilt in the design system, noindex as live). Location
  pages: Services as an accordion (title and tags with a + on the right;
  description and Learn more open; the person's direction). Every form
  shows the live success panel (lead or registration copy, per clinic)
  and has per-form field ids; the landing forms ("North York New",
  "Parliament New", "North York Dental") are generated too. ss03/ss08
  removed from Body. New variables P26–P29.
  Open: Blog categories (live Topics vs Figma's eight) — the person's
  call; Locations needs a second label (cards "Cabbagetown", nav and
  Contact "Downtown Toronto"); on /parliament-vet the live copy has North
  York's number in the closing text, "late into the evening in North
  York" and "6 days a week" (kept as live, to confirm); "Pyometa" typo on
  the dental page (kept as live); the blog post's "On this page"
  highlight and copy-link share button are not built; author and read
  time are static.
- 2026-11-19 · Mobile performance (the person: "fix the mobile performance"): Latin font subsets with preloads, Remix icon subset, lazy hero video (≥992px only), WebP CMS images, review popup images lazy, and the bundle requested after `load` or the first tap (loader.html piece 3, installed). Reveal leaves cards already on screen alone when the bundle boots late. Inlining critical CSS was tested and rejected: blocking the repo sheet did not move LCP. Mobile medians 83–93, desktop 95–99; with our JS removed entirely pages reach ~90–92, the rest is Webflow's own CSS, jQuery, webflow.js, Turnstile and the fonts.
- 2026-11-12 · Documentation examples are live (no `inert`); state tables
  stack below 1280px, so none scrolls sideways.
- 2026-11-11 · Icons: Remix Icon (the set the Figma layers are named
  after). The repo bundles it at the port (`pnpm add remixicon`); the
  starter's Phosphor specimens move to Remix names then.
- 2026-11-11 · Service icons: ten SVGs exported from Figma
  (`Assets/figma/icons/services/`), made colour-adaptive by `pnpm brand`
  (accent = currentColor, tile = currentColor at 14%). In Webflow each is
  an svg custom element (not an Embed); the wrapper's text colour binds to
  a new Services field, Service colour. Defaults:
  `prototype/public/images/icons/services/colours.json`.
- 2026-11-11 · Logo: full, horizontal, stacked, mark, reversed versions,
  favicon, webclip, app icons and a default share image in `Assets/brand/`
  (`pnpm brand`). Vector mark from the live footer logo, lettering from the
  live full logo; the Figma logo is a bitmap.
- 2026-11-11 · Fluid scaling: design width 1440 (`--size-container-ideal`
  in `src/styles.css` §01 and the prototype); range 1440–1680 unchanged,
  not yet confirmed by the person. `dist/` not rebuilt yet.
- 2026-11-11 · Service tile tags: on the live site only the Urgent Care
  card has tags (the eight shown on every tile in Figma), as static text.
  The Tile tags field is optional and hidden when empty.

- 2026-11-12 · Icons in Webflow use Remix Icon through the starter's own
  components (the person): Icon, Icon Size, Button Content, C | Button and
  C | Icon Button now take `ri-<name>` in their Icon prop (default
  `ri-arrow-right-line`); the class lands on the Icon Glyph `<i>`, and the
  bundled `remixicon` CSS draws it. No Phosphor class is used on any
  published page, and Phosphor is removed from the repo bundle
  (`pnpm phosphor none`, the person's go-ahead). Docs pages import plain `<i class="ri-…">`
  (GOTCHAS 2026-11-12).

## Open decisions

| Item | Now | Options |
| --- | --- | --- |
| | | |

## Stand-in assets and placeholders

- <Images, copy and `#` links still to replace, with an owner.>
