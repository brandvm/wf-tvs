# Gotchas

A running log of things that cost time on this project. Agents read it at
the start of every session and add to it when they hit something new (see
the Session protocol in `AGENTS.md`). Never delete an entry — update its
`Status` instead.

Lessons from earlier builds are in the skill, not here:
`.claude/skills/webflow-build/lessons/` (one file per area). Read the file
for the area you work in. Entries tagged `Scope: template-candidate` are
collected from client repos into those files.

## Entry format

```md
### YYYY-MM-DD · Short title
- Area: designer | css | loader | release | mcp | ci | js | perf
- Scope: project | template-candidate
- Symptom: what was observed
- Cause: why it happened
- Fix: what was done, or the workaround
- Status: open | fixed <sha> | upstreamed wf-template <sha>
- Found by: claude | codex | human
```

## This project

<!-- Add new entries here, newest first. -->

### 2026-11-12 · Nested variant props: link in the Designer, set by API
- Area: mcp
- Scope: template-candidate
- Symptom: C | Button's Color/Size had to be chosen per instance, but the nested Button Color / Button Size `Variant` props were not linked to any parent prop, so the API saw nothing to set. `create_prop` has no `variant` type.
- Cause: linking a nested instance's Variant to a new parent prop is Designer-only (purple dot left of Variant › New Variant property). A prop made on the middle layer (Button Color › Size) shows up on the outer component's nested instance, where it is linked again (C | Button › Size).
- Fix: link in the Designer, then `set_component_instance_prop_values` with `type: "string"`, `string_value: <variant id>` (or `base`). Done for C | Button (Color `a86542c6…`, Size `06aa6257…`). Also: double-clicking a component in the Components panel inserts an instance into the open page; use the hover "Open component" button instead (one stray Button Color was undone).
- Status: workaround confirmed
- Found by: claude

### 2026-11-12 · Importing buttons and form controls: use `<i data-wftag>` stand-ins
- Area: mcp
- Scope: template-candidate
- Symptom: the WHTML importer turns `<button>` into a Link, and the Forms docs page lost every control. A custom stand-in tag (`<wf-button>`, `<wf-input>`…) was silently removed with its classes and attributes, leaving only its children (16 Home buttons and the whole Forms page lost).
- Cause: the importer keeps known tags only; `<i>` and `<dialog>` survive as DOM elements with classes, attributes and block children, unknown tags are unwrapped. A `<span>` inside an `<i>` becomes the text "##INLINE0##".
- Fix (inputs are void: always emit `<i data-wftag="input" …></i>` before rewriting any closing tags, or a label that wraps its input stays open and the parser re-opens it in every following block, creating extra labels and forms): write each `<button>`, `<input>`, `<select>`, `<option>`, `<textarea>`, `<form>` and `<label>` as `<i data-wftag="<tag>" …>` (spans inside them as `<div>`), import, then per element `set_tag` to the data-wftag value and `remove_attribute data-wftag`. Verify by counting tags afterwards.
- Status: workaround confirmed
- Found by: claude

### 2026-11-12 · "Made in Webflow" badge hidden from the repo CSS
- Area: css
- Scope: project
- Symptom: the badge showed on staging (wf-tvs.webflow.io); a plain `.w-webflow-badge { display: none !important }` doesn't reliably win.
- Cause: Webflow's published CSS styles `.w-webflow-badge` with `display`, `visibility`, `opacity` and `z-index` all `!important` on a single class.
- Fix: `html body .w-webflow-badge { display: none !important; … }` in `src/styles.css` §03 (`override-webflow`, asked for by the person). Before launch, prefer turning the badge off in Site settings (paid site plan), then this rule can go.
- Status: fixed (verify on staging after deploy)
- Found by: human + claude

### 2026-11-12 · Repo CSS reads Webflow variable names (approved)
- Area: css
- Scope: project
- Symptom: the repo rules ported from the prototype (phone ring keyframes, descendant hovers, the call chooser backdrop, the docs frame and state rules) use `var(--_colors---…)`, `var(--_spacing---…)`, `var(--_effects---…)`, `var(--_layout---…)` and `var(--_typography-…)`. AGENTS.md rule 4 forbids that without approval.
- Cause: the person's rule that nothing carries a raw value; these rules can't live in the Designer (`designer-cant` / `js-state`).
- Fix: approved by the person on 2026-11-12, with a raw fallback on every read: `var(--_colors---brand--yellow, #ffdd21)` (the person's request), filled in from the published CSS's Base values. Risk left: a renamed variable falls back to the value it had on 2026-11-12, so a later colour or size change is not followed. Before renaming or changing a variable in Webflow, `grep -n "<css name>" src/styles.css` and update the rules in the same change.
- Status: accepted
- Found by: claude

### 2026-11-12 · Remix icons import as DOM `<i>` with a literal class
- Area: mcp
- Scope: template-candidate
- Symptom: the docs pages use `<i class="ri-…">` icons (hundreds on the icons page); `ri-*` are not Webflow classes, and the importer drops an element's whole class list when one class is missing.
- Cause: the WHTML importer turns `<i>` into a DOM element and keeps `class` as a plain attribute (tested: `class="ri-book-open-line"`, `aria-hidden` kept).
- Fix: import Remix icons as `<i>`; the bundled Remix CSS draws them (staging only; the canvas shows nothing without the repo stylesheet). A Webflow class written in the same literal attribute (e.g. `sgd-side-icon`) renders but doesn't count as used, so keep one real use of each such class on a styled element, or "Clean up unused styles" deletes it. Site icons that editors change stay Icon component instances (prop = `ri-<name>`).
- Status: workaround confirmed
- Found by: claude

### 2026-11-12 · Osmo's `is--` modifiers become `is-` in Webflow
- Area: designer
- Scope: template-candidate
- Symptom: combos Interactive Collage__item + Is 1…4, Interactive Collage__card + Is Landscape and Draggable Marquee__item + Is Short were created, but their selectors are `.is-1`, `.is-landscape`, `.is-short`, not Osmo's `.is--1`, `.is--landscape`, `.is--short` (the prototype markup).
- Cause: Webflow slugs a class name with single hyphens; a name can't produce a double hyphen.
- Fix: no module or repo CSS reads the `is--` names. When the About collage and the CTA gallery are imported, write `is-1`…`is-4`, `is-landscape`, `is-short` in the markup (WHTML drops a class list with an unknown class).
- Status: open (apply at the section build)
- Found by: claude

### 2026-11-12 · Page head code can be written through the MCP
- Area: mcp
- Scope: template-candidate
- Symptom: the style guide skill and `lessons/mcp.md` (Page SEO) treat a page's `noindex` head code as a Designer step.
- Cause: the scripts tool (MCP v2.2.0) has `set_page_freeform_code` / `get_page_freeform_code` for a page's head and footer blocks.
- Fix: read the block first (it replaces the whole block), then write `<meta name="robots" content="noindex, nofollow">`; done on the ten style guide pages. Search and sitemap exclusion still have no API.
- Status: workaround confirmed
- Found by: claude

### 2026-11-12 · A style value of `var(--name)` binds that variable, no id needed
- Area: mcp
- Scope: template-candidate
- Symptom: binding ~1,800 class properties to variables with `variable_as_value` needs each variable's id (`variable-<uuid>`), looked up per property.
- Cause: the "collapse to the first variable" behaviour in `lessons/mcp.md` (2026-10-05) also works on purpose: a value that is exactly `var(--_spacing---24)` is stored as a binding to that variable.
- Fix: `create_style` / `update_style` / `set_variant_styles` with `property_value: "var(--<css name>)"`; read back as `{id: "variable-…"}`. Confirmed on base, breakpoint, pseudo and component-variant styles. Still never mix `var()` with other text (calc, gradients, shadows).
- Status: workaround confirmed
- Found by: claude

### 2026-11-12 · calc() variables work through the MCP's `{type: "custom"}` value
- Area: mcp
- Scope: template-candidate
- Symptom: AGENTS.md says `custom_value` is rejected for Size variables and points to the variables JSON import; Layout › Hero/Photo Height needed `calc(100% - var(--_layout---hero--bar-height))`.
- Cause: the MCP (v2.2.0) takes a second value shape, `{"type": "custom", "value": "<css>"}`, the shape `get_variables` returns. It is not the `custom_value` field.
- Fix: `create_size_variable` with `value: {type: "custom", value: "calc(…)"}` was accepted, and it read back in every mode; a mode can still take a static value (Mobile 30em). Use this shape before falling back to the JSON import or a Designer step.
- Status: workaround confirmed (update AGENTS.md › Webflow MCP limits upstream)
- Found by: claude

### 2026-11-12 · Variable create came back suffixed: Spacing "6" → "6-5"
- Area: mcp
- Scope: template-candidate
- Symptom: `create_size_variable` "6" in Spacing returned name "6-5" (`--_spacing---6-5`) and reported success; no live variable had that name.
- Cause: as in `lessons/mcp.md` (2026-10-09): most likely a deleted starter variable still holds the name.
- Fix: `rename_variable` to "6" right after; CSS name became `--_spacing---6`. Check every create result's `name`.
- Status: fixed (renamed 2026-11-12)
- Found by: claude

### 2026-11-12 · Style guide generator ignored specimens inside included partials
- Area: designer
- Scope: template-candidate
- Symptom: a section moved into a shared partial (`partials/sections/reviews.html`, used by the home and service pages) dropped out of the style guide, so its classes failed the class check.
- Cause: `gen-style-guide.mjs` read each page raw and matched `sg:start`/`sg:end` before `<!-- @include -->` was expanded.
- Fix: the generator now matches on `expand(read(f))`; the `sg:` markers stay on one page around the include, so a partial used on several pages is one specimen.
- Status: fixed in `.claude/skills/webflow-style-guide/scripts/gen-style-guide.mjs` (uncommitted; offer upstream to wf-template)
- Found by: claude

### 2026-11-12 · Lenis: data-lenis-prevent on a sideways scroller freezes the page
- Area: js
- Scope: template-candidate
- Symptom: on the style-guide docs pages, wheel scrolling stopped a few screens down and never resumed while the cursor stayed in the content column.
- Cause: the docs tables (`.sg-table`, `.sgd-scrollbox`) scroll sideways and were marked `data-lenis-prevent`. Lenis then hands every wheel over them to the box, and its CSS adds `overscroll-behavior: contain`, so a vertical wheel over a box that can't scroll vertically goes nowhere.
- Fix: no `data-lenis-prevent` attribute; Lenis's `prevent` option decides per wheel, and only for inner scrollers that really overflow vertically. Sideways wheels never reach Lenis, so horizontal boxes need nothing.
- Status: fixed in prototype `src/modules/smooth-scroll.ts`; carried over to the repo's `src/modules/smooth-scroll.ts` at the port, 2026-11-12 (uncommitted)
- Found by: human
