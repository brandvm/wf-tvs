# Manual Designer steps

Everything the Webflow MCP can't do, for a person to do in the Designer.
Claude adds a row the moment it hits a limit, with *why* the API can't;
the person marks it done; Claude then reads the result back (or checks it on
the canvas when the API can't read it) and says so.

Common reasons, so they don't need re-explaining (see the skill's
`lessons/mcp.md`):
- a value mixing a variable with `calc()`, a gradient or a shadow;
- conditional visibility on a CMS field; a list sourced from a
  multi-reference or multi-image field; "exclude current item";
- a link to the current CMS item, in a list or a component prop;
- tag styles that have never been set; reserved class names;
- placeholders, slot names, variant props exposed from nested instances.

How to enter a value with variables: select the class, switch to the
breakpoint, type `calc(` in the field and insert variables with the
variable picker. Gradients: Backgrounds → gradient, pick each stop from the
variables.

Letters run A, B, C… then AA, AB… and are never reused, so a letter
mentioned in GOTCHAS or a commit stays unambiguous. The next free letter is
also kept in `REVIEW.md` once the review phase starts.

Rows that change something visible on a page also get a marker there, so
the step is found on the canvas and nobody mistakes the unfinished state
for the design: a small Caption next to the element (on the style guide,
next to its specimen) with the attribute `data-manual-todo="<letter>"` and
the text "Manual step <letter>: <what>". When the row is done, Claude
removes the marker in the same batch that ticks the row. Before the build
handoff and before launch, no `data-manual-todo` may be left on any
published page (search the published HTML for it).

Categories to expect on every build. Go through them at the start and
again at each gate, so the steps are found early and not at the end:

1. **Values with variables in a calc, gradient or shadow** (negative
   section padding, nav height + padding, gradient stops).
2. **Reserved class names** (Label, Form) and **tag styles** never set
   before (All H1–H6 Headings, All Paragraphs, All Links): one property
   set by hand, then the API can do the rest.
3. **CMS bindings:** lists from a multi-reference or multi-image field,
   "exclude current item", links to the current item, conditional
   visibility, decimal number formats, date bindings.
4. **Component wiring:** slots made and named, variant props exposed from
   a nested instance, variant styles on an element with a combo class,
   conditional classes (typed text: check the published class list).
5. **Forms:** field names (type a value that differs from the one shown),
   placeholders, the notification address, the success and error states.
6. **Page settings:** sitemap and search exclusion, the 404 and password
   pages (the API can't reach utility pages), Open Graph images for CMS
   templates.
7. **Site settings:** fonts uploaded, head and footer code pasted, the
   staging password.

Rows D–G need an element carrying the class first (the Designer edits a class only through a selected element): do them once the style guide or Home sections are built; Claude can do them in the person's browser then.

| ID | Where (page › element or class) | Breakpoint | Set | Why the API can't | Done |
| --- | --- | --- | --- | --- | --- |
| A | Body (tag style) › Variable modes | Tablet, Mobile Landscape, Mobile | Done by the person; checked by Claude on the canvas 2026-11-12: Typography Role and Layout are on Tablet / Mobile Landscape / Mobile at each breakpoint | Breakpoint modes are never set through the API on this project (the person, 2026-11-12) | ☑ |
| B | Site settings › Fonts | — | Done by Claude through the API, 2026-11-12: Hanken Grotesk (wght 100–900) and Instrument Sans (wght 400–700, wdth 75–100, from the Google Fonts repo, OFL; originals in `Assets/fonts/instrument-sans/`), each upright and italic, variable woff2. Check the published `@font-face` host at the first publish | The person asked Claude to upload them | ☑ |
| C | Tag styles All H1–H6 Headings, All Paragraphs, All Links | Desktop | Done (person/starter); read back by Claude 2026-11-12: H1–H6 margin 0, bound to Typography Styles in modes H1–H6; p margin 0; a colour inherit, no underline | Tag styles don't exist for the API until a property is set in the Designer | ☑ |
| D | Home Hero Shade (Desktop and Mobile), Services Banner, Team Card Scrim, Review Card Scrim › Backgrounds › gradient | Desktop (Home Hero Shade also Mobile) | Bind each stop to its colour variable (Ink Tint 4/12/64/90, Brand Ink, Brand Accent) with the variable picker. The gradients are in with the same colours as literals, so the page already looks right | The style API keeps only the first variable of a gradient (`lessons/mcp.md`) | ☐ |
| E | About Panel, Nav Panels, Nav Sheet (Tablet), Call Chooser, Select List, Datepicker, Datepicker Day + Is Today › Box shadow | Desktop (Nav Sheet: Tablet) | Bind the shadow colour (Ink Tint 12 or 24) and the offsets/blur (Spacing 8/12/20/32/48/56/96, Hairline) to their variables. Literal values are in and match | A shadow with variables is stored as one variable binding (`lessons/mcp.md`) | ☐ |
| F | Proof Pill › Backdrop filter blur; Form Check Input › Focus-visible › outline width | Desktop | Bind blur to Effects/Blur/Strong (literal 2.25em in); bind outline width to Spacing/2 if the Designer allows it (literal 0.125em in) | A variable inside a filter function can't be written; outline-width takes no variable through the API | ☐ |
| G | Nav Link › Current state (colour Brand/Accent); Sgd Side Link › Current state (background Blue Tint/Blue 8, colour Brand/Accent, weight 500); Sgd Toc Link › Current state (colour Brand/Accent) | Desktop | As listed | The style API has no Current state; only the WHTML importer writes it (`lessons/mcp.md`). Elements exist for Sgd Side Link (Introduction page), so Claude can set it in the person's browser | ☐ |
| H | Pages › folder design › style-guide | — | Done: the person made the folder (id 6af621f2f54473f4f143f8b0) and Introduction; Claude created Logo, Colour, Typography, Layout and spacing, Icons, Buttons and links, Forms, Blocks, Class index (2026-11-12). Proposals not created: every proposal is now in Webflow | The API can neither create folders nor list an empty one | ☑ |
| I | Each page in design › style-guide (10) › Page settings | — | Done by Claude 2026-11-12: `<meta name="robots" content="noindex, nofollow">` in each page's head code (`set_page_freeform_code`). Site-search exclusion only matters if Webflow site search is turned on; the sitemap setting needs a paid site plan | The person asked Claude to do it through the API | ☑ |
| J | Site settings › Publishing › 301 redirects | — | Dropped by the person 2026-11-12: `/design/style-guide` needs nothing | — | ☑ |
