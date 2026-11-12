# Tag styles and classes for Webflow — 2026-11-12

Source: `prototype/src/css/new-classes.css`, `new-classes-shell.css`,
`new-classes-home.css` and the class parts of `proposed.css` (P12–P17,
P20), planned with `pnpm wf:styles` against today's variables. The
services template (`new-classes-service.css`) is still being built in the
prototype and is left for a later batch.

Totals: 306 new classes (base classes before their combos), about 1,800
declarations through the MCP, every value bound to a variable where the
prototype uses one. Nothing is written until the person says go.

## K1 · Tag styles (after MANUAL-TODO C)

Once the person has set one property on each in the Designer:
- All H1–H6 Headings: margin 0; Typography Styles mode H1…H6 on each tag,
  family/size/weight/line height/letter spacing bound to Typography Styles
  (as D1–D6 do).
- All Paragraphs: margin 0. All Links: colour inherit, no underline.

## K2 · Changes to existing classes (P12–P17, P20)

- Form Input: radius 8 → Radius/12; background → Background/Page;
  Focused border → Text/Primary; the Focus-visible outline removed (the
  keyboard ring comes from repo CSS `.is-keyboard`, js-state).
- Form (reserved name, exists in the starter): flex, column, row gap Spacing/20.
- Chip: text-transform uppercase.
- Button Color, variant Secondary: border → Border/Strong; hover fills
  Text/Primary with Background/Page text.
- G | Nav W: absolute → sticky, top −Top Bar/Height (Designer step: a
  negative variable), height auto, side padding 0, display block.
- G | Footer W: padding top Spacing/80, bottom Spacing/40, top border
  hairline Paper 12.
- Button Size: height → Button/Text Height; variant Small → Button/Text
  Height Small, font size inherit.

## K3 · New classes, by component

### new-classes.css
- **Button variants and states (TVS)** (6): Button + Is Disabled, Button Color + Is Light, Button Color + Is Call, Button Size + Is Call, Button Content + Is Call, Button Icon + Is Well
- **Form field states and parts (TVS)** (9): Form Input, Form Input + Is Error, Form Help, Form Error, Form Check, Form Check Input, Form Message, Form Message + Is Success, Form Message + Is Error
- **Select (TVS)** (10): Select, Select Native, Select Toggle, Select Toggle + Is Placeholder, Select Value, Select Icon, Select List, Select Option, Select Option + Is Active, Select Option + Is Selected
- **Date field (TVS)** (14): Date, Date Input, Date Icon, Datepicker, Datepicker Head, Datepicker Title, Datepicker Nav, Datepicker Grid, Datepicker Weekday, Datepicker Day, Datepicker Day + Is Outside, Datepicker Day + Is Today, Datepicker Day + Is Active, Datepicker Day + Is Selected
- **Eyebrow** (3): Eyebrow, Eyebrow Dot, Eyebrow Text
- **Section Head Is Center** (4): Section Head + Is Center, Section Actions, Section Head + Is Tight, Section Head Text
- **Section Is Tint** (1): Section + Is Tint

### new-classes-shell.css
- **Theme Dark** (1): Theme Dark
- **Shell Inner** (1): Shell Inner
- **Phone Well** (2): Phone Well, Phone Well Icon
- **Top Bar** (10): Topbar, Topbar Inner, Topbar Group, Topbar Item, Topbar Icon, Topbar Text, Topbar Pill, Topbar Pill Text, Topbar Clinic, Topbar Phone
- **Nav** (17): Nav Bar, Nav Inner, Nav Logo Link, Nav Logo, Nav Logo + Is Small, Nav Sheet, Nav Menu, Nav Item, Nav Link, Nav Link + Is Open, Nav Link Icon, Nav Sub, Nav Sub Link, Nav Actions, Nav Toggle, Nav Toggle Icon, Nav Toggle Icon + Is Close
- **Nav Panels** (9): Nav Panels, Nav Panels + Is Open, Nav Panel, Nav Panel + Is Active, Nav Panel Inner, Nav Panel Main, Nav Panel Label, Nav Dim, Nav Dim + Is Open
- **Nav Clinic** (10): Nav Clinics, Nav Clinic, Nav Clinic Img, Nav Clinic Text, Nav Clinic Name, Nav Clinic Address, Nav Clinic Hours, Nav Clinic Hours Text, Nav Clinic Hours Icon, Nav Clinic Cta
- **Nav Service** (7): Nav Services, Nav Service, Nav Service Icon, Nav Service Text, Nav Service Name, Nav Service Note, Nav All
- **Nav Callout** (9): Nav Callout, Nav Clinics, Nav Callout Title, Nav Callout Text, Phone Row, Phone Row Text, Phone Row Number, Phone Row Number + Is Large, Phone Row Label
- **Navigation page** (4): Nav Page, Nav Stage, Nav Stage + Is Narrow, Nav Panel + Is Static
- **Call Chooser** (15): Call Chooser, Call Chooser + Is Static, Call Chooser Head, Call Chooser Title, Call Chooser Close, Call Chooser List, Call Card, Call Card + Is Alt, Call Card Text, Call Card Name, Call Card Area, Call Card Reach, Call Card Number, Call Card Actions, Call Chooser Note
- **Footer** (18): Footer Inner, Footer Top, Footer Brand, Footer Logo, Footer Text, Footer Badge Link, Footer Badge, Footer Col, Footer Title, Footer Title + Is Accent, Footer Link, Footer Line, Footer Divider, Footer Credit, Footer Credit Text, Footer Credit Link, Footer Pride, Footer Pride Flag
- **CTA** (7): Cta, Cta Wrap, Cta Inner, Cta Copy, Cta Text, Cta Phones, Cta Action
- **Draggable Marquee** (7): Draggable Marquee, Draggable Marquee__collection, Draggable Marquee__list, Draggable Marquee__item, Draggable Marquee__item + Is Short, Draggable Marquee__item Img, Call Chooser

### new-classes-home.css
- **Home Hero** (9): Section + Home Hero, Home Hero Photo, Home Hero Shade, Home Hero Body, Home Hero Copy, Home Hero Text, Home Hero Lead Box, Home Hero Lead, Home Hero Actions
- **Proof Pill** (8): Proof Pill, Proof Pill Avatars, Proof Pill Avatar, Proof Pill Avatar + Is First, Proof Pill Avatar + Is Logo, Proof Pill Stars, Proof Pill Text, Proof Pill Stat
- **Hero Bar** (5): Hero Bar, Hero Bar Item, Hero Bar Text, Hero Bar Icon, Hero Bar Divider
- **Why Choose** (10): Why, Why Cards, Why Card, Why Card Icon, Why Card Icon + Is Violet, Why Card Icon + Is Green, Why Card Icon + Is Pink, Why Card Glyph, Why Card Title, Why Card Text
- **Services** (11): Services, Service Tiles, Service Tile, Service Tile Head, Service Tile Name Row, Service Tile Icon, Service Tile Name, Service Tile Text, Service Tags, Service Tag, Service Tag Text
- **Services Banner** (7): Services Banner Wrap, Services Banner, Services Banner Text, Services Banner Title, Services Banner Lead, Services Banner Actions, Services Banner Dog
- **About Intro** (6): Section + About Intro, About Intro Photo, About Panel, About Body, About Heading, About Actions
- **Interactive Collage** (12): Interactive Collage, Interactive Collage__collection, Interactive Collage__list, Interactive Collage__item, Interactive Collage__item + Is 1, Interactive Collage__item + Is 2, Interactive Collage__item + Is 3, Interactive Collage__item + Is 4, Interactive Collage__item Inner, Interactive Collage__card, Interactive Collage__card + Is Landscape, Interactive Collage__img
- **Team** (8): Team, Team Cards, Team Card, Team Card Photo, Team Card Scrim, Team Card Caption, Team Card Name, Team Card Role
- **Locations** (21): Locations, Clinic Cards, Clinic Card, Clinic Card Photo, Clinic Card Body, Clinic Card Intro, Clinic Card Name, Clinic Card Text, Clinic Card Divider, Clinic Facts, Clinic Fact, Clinic Fact + Is Top, Clinic Fact + Is Link, Clinic Fact Icon, Clinic Fact Text, Clinic Hours, Clinic Hours Title, Clinic Hours Row, Clinic Hours Day, Clinic Hours Time, Clinic Card Actions
- **Reviews** (16): Reviews, Review Slider, Review Track, Review Card, Review Card Photo, Review Card Scrim, Review Card Body, Review Card Quote, Review Quote, Review Card Text, Review Author, Review Author Avatar, Review Author Text, Review Author Name, Review Author Place, Review Stars
- **Slider Nav** (6): Slider Nav, Slider Button, Slider Button Icon, Review Track, Review Card, Review Card Text
- **FAQ** (11): Faq, Faq Head, Faq Head Action, Faq List, Faq Item, Faq Question, Faq Question Text, Faq Toggle, Faq Toggle Icon, Faq Answer, Faq Answer Inner
- **Latest Blog Posts** (12): Blog, Blog Head, Blog Head Text, Blog Cards, Blog Card, Blog Card Image, Blog Card Meta, Blog Card Category, Blog Card Dot, Blog Card Date, Blog Card Title, Blog Card Excerpt

How they are written: `create_style` per class with variable ids
(`variable_as_value`), then breakpoint and state values with
`update_style` (styles only, never variable modes at breakpoints). Border
shorthands go in as longhands (width, style, colour each bound);
`flex: 0 1 <var>` as grow, shrink and a bound basis. Theme Dark is a
class whose Colors Semantic mode is Dark (no breakpoint), plus background
Background/Page and colour Text/Primary. Combos on component classes
(Button Color + Is Light…) are checked against the component's variants
first.

## K4 · Designer steps (MANUAL-TODO D–G)

Decided 2026-11-12 (the person): calc() values are computed Layout
variables (b), created and bound through the API: Calc/Hero Min Height,
Calc/Nav Stick Top, Calc/Avatar Overlap, Calc/Callout Text Pull,
Calc/Chooser Max Height, Calc/Chooser Width Mobile, Calc/Stage Narrow
Width, Calc/Call Button Pad Left, Calc/FAQ Head Top.

Written through the API with literal values so the canvas looks right,
then the variables are bound in the Designer:
- Gradients (5): Home Hero Shade (Desktop, Mobile), Services Banner,
  Team Card Scrim, Review Card Scrim.
- Shadows (6): About Panel, Nav Panels, Nav Sheet @Tablet, Call Chooser,
  Select List, Datepicker; inset ring on Datepicker Day + Is Today.
- Backdrop blur: Proof Pill blur(Blur/Strong).
- Outline width: Form Check Input focus-visible (Spacing/2, the API takes
  no variable on outline-width).

calc() with variables (8): Section + Home Hero min-height, Proof Pill
Avatar margin-left, Nav Callout Text margin-top, Call Chooser max-height
and Mobile width, Nav Stage + Is Narrow max-width, Button Size + Is Call
padding-left, FAQ Head top, and G | Nav W top. Two ways:
- (a) Designer steps, typed with the variable picker; or
- (b) one computed Layout variable each (now possible through the API:
  `{type: "custom"}` works, GOTCHAS 2026-11-12), e.g.
  `Calc/Hero Min Height = calc(100dvh - Top Bar/Height - Nav/Height)`,
  bound through the API, no Designer step. Adds 9 variables.

## K5 · Repo CSS (at the repo port, not in Webflow)

47 rules `pnpm wf:styles` sorted as designer-cant or js-state:
descendant selectors (buttons full width inside action rows, FAQ and blog
hovers, nav open icons, call card actions), line clamps, scroll snap and
the hidden scrollbar, `-webkit-` prefixes, `::backdrop`, `@keyframes`
(phone shake and ripple), the hero's masked blur, popover reset, the
keyboard focus ring. They go to `src/styles.css` with their tags when the
modules are ported.
