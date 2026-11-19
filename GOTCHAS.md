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

### 2026-11-19 · Loader tests hardcode dev port 3000; a project devPort breaks CI
- Area: ci
- Scope: template-candidate
- Symptom: after loader.html (with DEV = localhost:3855 from `pnpm new-project`) was committed, five tests in tests/loader.spec.mjs failed in CI ("Expected http://localhost:3000/index.js") and staging stopped deploying.
- Cause: the test set `const local = 'http://localhost:3000/'` while new-project writes the project's devPort into loader.html.
- Fix: both loader tests (spec and check) read the port back from loader.html (`var DEV = "…"`), as they already do for OWNER and SITE; webflow-build.config.json and the rest of the new-project output are committed. update-skills.check.mjs's "what's new" test is skipped when CHANGELOG.md is absent (new-project removes it from client repos).
- Status: fixed
- Found by: claude

### 2026-11-17 · Sort on a new static-page list works when source and sort are written in ONE call
- Area: mcp
- Scope: template-candidate
- Symptom: on /contact-us a new Locations list took `source`, then every `sort` write (API, and the Designer's Sort +, also after a reload) returned "[Conflict] … component map", as on /blog.
- Cause: unknown; a sort added after the source conflicts on these lists.
- Fix: create a fresh `CMSCollection`, then one `set_settings` operation with both `source` and `sort` (two keys, same call) — accepted and read back. Build the item first in any list and `move_element` it into the sorted list; bindings survive the move. (The element builder refuses `source` at creation: "not applicable".) Also: the builder can't bind a new element inside a list at creation ("not inside a CMS context"); create it, then bind with `set_settings`.
- Status: workaround confirmed (Contact clinic list, MANUAL-TODO CB)
- Found by: claude

### 2026-11-17 · A colour typed as `var(--…)` can publish as `@var_variable-…` (dropped by browsers)
- Area: designer
- Scope: template-candidate
- Symptom: nested `.help-item-body a` published `color: @var_variable-fdfc898a-…` (Brand/Accent's id) instead of `var(--_colors---brand--accent)`; links rendered grey. The same typed value on `.book-solo-text a` and `.post-body a` published fine. The Designer field showed "Brand/Accent" either way.
- Cause: unknown; the custom-value editor stored a reference the publisher could not resolve.
- Fix: Option-click the property label to reset it, type the `var()` again, republish. After any Designer variable binding, grep the published CSS for `@var_`. Also, for nested rich-text selectors: the API still can't see them (`update_style` "Post Body > All Paragraphs not found"), so set every property in the Designer; heading sizes go fastest by setting the nested selector's Typography Styles mode (e.g. H3) and overriding only what differs. Escape in a spacing popover clears the element selection; click the panel instead.
- Status: fixed on staging
- Found by: claude

### 2026-11-17 · Designer: typing right after inserting an element goes to keyboard shortcuts
- Area: designer
- Scope: template-candidate
- Symptom: after inserting a Rich Text from the Add panel with a Section selected, the Rich Text landed inside the section, and typing a class name into the style selector was taken as single-key shortcuts (the Apps panel opened, the selection changed).
- Cause: the new element wasn't selected yet when the selector was clicked, so focus stayed on the canvas.
- Fix: deleted the stray element; check the selection (breadcrumb) and that the selector field has focus before typing. Insert temporary elements after a top-level component instance (they go beside it), not with a Section selected (they go inside). Also: `set_link` with `linkType: page` works on links inside components, and the Designer's "Use alt text from asset" is stored as `altText: "inherit"` (the API refuses to write it).
- Status: workaround confirmed
- Found by: claude

### 2026-11-13 · `transition` IS writable through the style API
- Area: mcp
- Scope: template-candidate
- Symptom: MANUAL-TODO rows AH, AL, CA, EC, EH, W list every transition as Designer-only.
- Cause: assumed from an older note; `update_style` with `property_name: "transition"`, `property_value: "height 350ms cubic-bezier(0.4, 0, 0.2, 1)"` applied to Service Tile Panel, read back and published (the location accordion now animates). Variant styles return `transition` too.
- Fix: write transitions by API; the transition rows can be done without the Designer.
- Status: confirmed; rows AH, AL, CA, EC, EH done by API 2026-11-17 (W's transition too)
- Found by: claude

### 2026-11-13 · Styling a CMS-bound Rich Text's list: nested selectors only, from an unbound copy
- Area: designer
- Scope: template-candidate
- Symptom: Home's Tile tags (Rich Text bound to a CMS field) showed as a plain bulleted list; the chip look had to go on its `ul`/`li`. Clicking inside a bound Rich Text on the canvas never selects its children, and `update_style` with `parent_style_names` returns "Style \"Service Tags > All List Items\" not found".
- Cause: nested rich-text selectors exist only in the Designer and are invisible to the style API; bound Rich Text children aren't selectable.
- Fix: add a temporary unbound Rich Text with the same class, select its `li` (and `ul`), open the style selector, press Down + Return to pick the HTML tag (clicking the tag pill does not stick), then tick "Nest selector inside of <class>" and set the properties there (variables via the purple dot in each field). Clicking a property on a classless child without that step creates a stray class named after the element (undo it). Put inherited type settings on the parent class by API to save Designer steps. Delete the temporary element.
- Status: workaround confirmed (MANUAL-TODO P)
- Found by: claude

### 2026-11-13 · A sort written by API blocks every later filter on that list ("[Conflict] … component map")
- Area: mcp
- Scope: template-candidate
- Symptom: on the Locations template's FAQ list, adding any filter failed with "[Conflict] The operation could not be applied to the component map", in the Designer (twice, after a reload, no other writer) and by API. Items were not drafts.
- Cause: the list's sort had been written by API first. A fresh list took a filter fine; after clearing the sort (`set_settings` key `sort`, `clear: true`) the same list took a filter again. Matches lessons/mcp.md 2026-10-29 (filter and sort refuse each other when written separately).
- Fix: on lists that need both, write neither by API: set filter and sort together in the Designer. If a sort is already there, clear it by API first. "Current item" filters are Designer-only anyway (the API wants a fixed item id).
- Later the same day: after one fixed-id filter was written by API on a fresh list on that template, a second fresh list on the same template refused any filter ("[Conflict]"), alone or with sort; the Designer also kept refusing "+ Filter" on the original list. So the conflict is not only sort-then-filter. Resolved: the person set filter (Current Location) and sort on the SAME list in their own Designer and it worked — the failures came from the automated (browser-driven) Designer and from API writes, not from the list. Note: a "current item" filter reads back as `filters: []` through the API; check it on the published page, not by API read.
- Status: workaround confirmed (set current-item filters in a human Designer)
- Found by: claude (after the planning session hit it in the Designer)

### 2026-11-13 · Video can be hosted byte for byte through the Data API
- Area: mcp
- Scope: template-candidate
- Symptom: `media.md` says Webflow only hosts a video uploaded as a Background Video, which Webflow re-encodes (quality loss); the person wanted the original.
- Cause: the Data API asset upload (`data_assets_tool create_asset` with the file's MD5, then a multipart POST of the bytes to the returned S3 `uploadUrl`) accepts `video/mp4` up to 30 MB and stores the file untouched; the CDN serves it with `accept-ranges: bytes`.
- Fix: landing hero original uploaded that way (asset `6af776e7869bcc4a16b15c18`, MD5 of the CDN copy = the source file) and played with a plain `<video>`; listed on /design/media. Use the Background Video route only when Webflow's transcodes are wanted.
- Status: workaround confirmed
- Found by: human + claude

### 2026-11-13 · Collection List `offset` and `limit` write fine; `sort` conflicts on a new static page
- Note (added after the template): on the Blogs Template a brand-new list at body level took `source`, `limit` AND `sort` in one go. On /blog (a page created through `create_page`) every `sort` conflicted, also after moving the list back to body level, before and after its items were filled. Not the slot, not limit/offset; cause still unknown.

### (original entry) Collection List `offset` and `limit` write fine; `sort` still conflicts
- Area: mcp
- Scope: template-candidate
- Symptom: on the new /blog page, `sort` on all four new Collection Lists returned "[Conflict] … component map" (lists at body level, items Ready), while `limit` (1, 3) and `offset` (1) on the same lists applied and read back.
- Cause: unknown; same conflict as rows N/T.
- Fix: "featured = newest, then the next three" is built as two lists on the same sort, the second with `offset: 1`, `limit: 3`; the sort itself is a Designer row (EA).
- Status: workaround confirmed
- Found by: claude

### 2026-11-13 · Sitemap indexing per page is refused on this plan
- Area: mcp
- Scope: template-candidate
- Symptom: `data_sitemap_tool update_page_sitemap_status` on /design/navigation returned 403 "Site plan doesn't support sitemap indexing controls".
- Cause: per-page sitemap control needs a paid site plan (as `lessons/mcp.md` 2026-10-05 says for the Designer setting); the API is gated the same way.
- Fix: noindex meta through `set_page_freeform_code`; sitemap exclusion is a manual row (FB) once the plan allows it.
- Status: workaround confirmed
- Found by: claude

### 2026-11-13 · transform_element_to_component can't reach elements inside a component definition
- Area: mcp
- Scope: template-candidate
- Symptom: splitting Nav Bar out of G | Nav W with `transform_element_to_component` (id `{component: <G | Nav W id>, element: …}`) returned "Element … not found"; the same id works in `query_elements` with `scope_component_id`.
- Cause: the transform action has no `scope_component_id` and only searches the page tree.
- Fix: nested components are made in the Designer (open the component › right-click › Create component); row FD. Also confirmed: a section holding a bound Collection List is refused with "Components can't hold a live CMS binding" (row FA).
- Status: workaround confirmed
- Found by: claude

### 2026-11-13 · duplicate_component prefixes every element id with the new component id
- Area: mcp
- Scope: template-candidate
- Symptom: after `duplicate_component` (Form · North York → Form · Registration North York), every element inside the copy had an id of the form `<newComponentId-prefix><4 hex>` (e.g. `433f9d23-…-3c19fd1774b2`), and the FormWrapper's element id equals the component id. Form name, field names (data-names), required flags, classes and custom attributes were all copied; the `for` attribute was NOT on the copied Form Row Labels (nor visible on the source).
- Cause: Webflow re-keys the duplicated tree; ids are stable afterwards.
- Fix: read the copy once with `get_all_elements scope_component_id`, then rename the form (`set_settings name` on the FormWrapper), set every field's `domId` in one `set_settings` batch (27 ops in one call worked), `set_attributes for` on the labels. Field `name` didn't need touching when the data-names stay the same.
- Status: workaround confirmed
- Found by: claude

### 2026-11-13 · The WHTML importer drops `target="_blank"` on links
- Area: mcp
- Scope: template-candidate
- Symptom: the Contact section's "Get directions" and Instagram links came in with `rel="noopener"` but no `target="_blank"`; the link setting's "open in new tab" was off. The source `href` was also kept as a custom attribute (as in the 2026-11-13 entry).
- Cause: importer default; `target` is not carried into the Link setting.
- Fix: after import, `set_settings` key `link` with `static_link {mode: "url", to, open_in_new_tab: true, rel: "noopener"}` on each external link, then `remove_attribute href`.
- Status: workaround confirmed
- Found by: claude

### 2026-11-13 · `create_page` with `duplicateOf` copies a page with its started slot
- Area: mcp
- Scope: template-candidate
- Symptom: a new static page needs G | Page W with a started G | Main slot (MANUAL-TODO K), and the API can't start a slot.
- Cause: `data_pages_tool › create_page` with `duplicateOf: <Home id>` copies the whole page: G | Page W, the slot content, component instances with their prop overrides and bound Collection Lists. Page head code is not an issue (Home has none).
- Fix: duplicate Home, then `remove_element` the sections the page doesn't keep, 2–3 per call: a batch of 8 removals in one call returned 429 Too Many Requests for every item (nothing removed). Import new sections `before` the first kept instance.
- Status: workaround confirmed (About Us)
- Found by: claude

### 2026-11-13 · Component Link prop: `link_mode: "page"` refused
- Area: mcp
- Scope: template-candidate
- Symptom: `set_component_instance_prop_values` on C | Button's Link prop with `type: "link", link_mode: "page", link_to: <pageId>` failed: "Invalid enum value. Expected 'url' | 'email' | 'phone' | 'popover' | 'modal'", although the tool schema lists `page`.
- Cause: server-side validation narrower than the schema.
- Fix: set `mode: url` (`/contact-us`) and add a Designer row to switch it to a page link (DD).
- Status: open
- Found by: claude

### 2026-11-13 · Empty-valued data hooks get explicit values before publish
- Area: mcp
- Scope: project
- Symptom: the importer keeps `data-parallax-frame=""`, `data-call-chooser=""`, `data-reveal-stagger=""`, `data-draggable-marquee-*=""` as empty attributes; Webflow strips empty booleans on publish.
- Cause: modules select by presence (`[data-parallax-frame]`, `[data-call-chooser]`, `[data-draggable-marquee-init]`…); reveal reads `data-reveal-stagger` as seconds (fallback 0.08); the marquee only checks for the value "initialized".
- Fix: on About, presence hooks set to `"true"`, `data-reveal-stagger` to `"0.08"` (the module default). Apply the same on any imported page.
- Status: done on About Us
- Found by: claude (coordinator's note)

### 2026-11-13 · Collection List `offset` and `limit` write fine; `sort` still conflicts
- Area: mcp
- Scope: template-candidate
- Symptom: on the new /blog page, `sort` on all four new Collection Lists returned "[Conflict] … component map" (lists at body level, items Ready), while `limit` (1, 3) and `offset` (1) on the same lists applied and read back.
- Cause: unknown; same conflict as rows N/T.
- Fix: "featured = newest, then the next three" is built as two lists on the same sort, the second with `offset: 1`, `limit: 3`; the sort itself is a Designer row (EA).
- Status: workaround confirmed
- Found by: claude

### 2026-11-13 · CMS image alt text DOES bind through the API
- Area: mcp
- Scope: template-candidate
- Symptom: MANUAL rows AC/AG and the blog-post pack treat "Image alt from a CMS field" as Designer-only.
- Cause: inside a Collection List (and on Home's Blog Card Image), `set_settings` key `altText` with a `cms` binding to a Plain text field (Cover alt) applies and reads back. What does not exist is the image field's own alt (an Image field has no alt sub-field to bind).
- Fix: bind `altText` to a Plain text "… alt" field by API; keep a Designer row only when the alt must come from the image field itself.
- Status: confirmed on /blog (3 list images)
- Found by: claude

### 2026-11-13 · Landing pack: a wrapped `<form>` lands one level off; what the form API can't set
- Area: mcp
- Scope: template-candidate
- Symptom: importing `<div class="clinic-form is-card"><form class="clinic-form-body is-compact">…</form><div class="form-success">…</div></div>` gave an outer Block with the div's classes, a FormWrapper carrying the `<form>`'s classes, a class-less FormForm, Webflow's own Success/Error blocks inside, and my two extra divs as stray siblings. Then: no `placeholder` key on fields (set_attributes `placeholder` = "internal error"); `set_attributes`/`set_settings attributes` on FormSuccessMessage/FormErrorMessage = "[Conflict] … component map"; `set_text` refuses Blocks ("doesn't support text").
- Cause: the importer turns the `<form>` itself into the Form Block; placeholders only come from the import.
- Fix: import the `<form>` alone (or restyle: FormWrapper → wrapper classes, FormForm → form classes, move the wrapper out, remove the shell). To change a placeholder, remove the field and import a lone `<textarea>`/`<input>` with the new placeholder into its cell: inside a form it arrives as a real FormTextarea/FormTextInput. Block text: `set_settings` key `text` with `static_text`. Success/Error attributes: Designer (MANUAL-TODO AJ).
- Status: workaround confirmed
- Found by: claude

### 2026-11-13 · Landing pack: smaller API facts (sms links, href, drafts, page duplicates)
- Area: mcp
- Scope: template-candidate
- Symptom: (1) `set_link url "sms:+1…"` reported success but stored nothing; (2) binding a custom attribute named `href` to a prop: "reserved attribute name"; (3) `bulk_update_pages` with `draft: false` returned the pages still `draft: true`; (4) the pack's tile SVGs had no `width`/`height` on `<svg>` and `<rect>`, so the icon tiles would render blank.
- Cause: (1)(2) link settings vs attributes; (3) unknown; (4) the pack generator stripped size attributes (the importer keeps them on SVG DOM elements, only `<img>` loses them).
- Fix: (1)(2) a component `link` prop with mode `url` and `to: "sms:+1…"` bound to the Link's `link` key works and publishes `href="sms:…"`; (3) `update_page_settings` per page works; (4) took the tiles from `prototype/<slug>/index.html` instead. Also: `create_page` with `duplicateOf` copies the page with the SAME element ids (only the component part changes), so one page's ids drive edits on its copies; head code is not copied.
- Status: workaround confirmed
- Found by: claude

### 2026-11-13 · Native forms through the importer: names, ids and the checkbox
- Area: mcp
- Scope: template-candidate
- Symptom: importing a `<form>` with native fields made a real Form Block (FormWrapper › FormForm, Success and Error states), but the form was named "Html Form", every `<select>` was named "Field", fields took the `name` attribute (First-Name) instead of the `data-name` (First Name), and the checkbox came in wrapped with an inline label holding its name ("No-Date-of-Visit") beside the markup's own "N/A". Renaming a field through `set_settings name` also rewrote its DOM id (lead-north-york-First-Name → First-Name), which breaks the `for` of the labels and duplicates ids when two forms share a page.
- Cause: importer and Webflow defaults: the DOM id follows the field Name unless set explicitly.
- Fix: after import, `set_settings` `name` on the FormWrapper and every field (the data-name values), then `domId` on every field with the form's prefix, last. Checkbox: `set_text` the FormInlineLabel to the label text and remove the extra text block. The select toggles stay `<i data-wftag="button">` → `set_tag button`. Two forms with the same fields: build one, make it a component, `duplicate_component`, then rename and re-id the copy.
- Status: workaround confirmed
- Found by: claude

### 2026-11-13 · A component's Link prop CAN bind to a CMS field on a template
- Area: mcp
- Scope: template-candidate
- Symptom: MANUAL-TODO Q treated "link prop to a CMS field" as Designer-only.
- Cause: on a CMS template page (not inside a Collection List), `set_component_instance_prop_values` with `type: "bindable"`, `binding_source_type: "cms"` binds a C | Button Link to a Link field (Get directions → Map link).
- Fix: use it on templates; inside Collection Lists keep the Designer step until tested there.
- Status: confirmed
- Found by: claude

### 2026-11-13 · Services template: what the API could and couldn't do
- Area: mcp
- Scope: template-candidate
- Symptom: building the Services CMS template: (1) `transform_element_to_component` refused Home's Reviews and Locations sections; (2) every `sort` and `filters` write on the template's five new Collection Lists returned "[Conflict] … component map", with the lists at body level, the template open in the Designer and every item Ready; (3) `visibility` has no CMS sources (`get_bindable_sources` returns none), so "is set" conditions can't be written; (4) a Phone field DID bind as text to a Block (div) Phone Card Number, where it failed on a Span on Home (row R).
- Cause: (1) the sections contain bound Collection Lists; (2) unknown, as on Home; (3) conditional visibility is Designer-only; (4) the text binding takes a Phone field on a Text Block, not on an importer Span.
- Fix: (1) Designer › right-click › Create component (untick "Create N properties"); (2) build the list, its classes, hooks and bindings by API, and leave sort/filter to the Designer (MANUAL-TODO T); (3) MANUAL-TODO V; (4) write phone numbers as a `<div>`, never a `<span>`, and bind by API. An empty template slot was seeded with a temporary "Slot Helper" component (group Temp; lessons/mcp.md 2026-10-29): delete it once no page needs it.
- Status: workaround confirmed
- Found by: claude

### 2026-11-13 · Imported links keep their href as a custom attribute
- Area: mcp
- Scope: template-candidate
- Symptom: after binding a CMS list's Link Block to the item URL and a phone link to a Phone field, both still carried `href=/blog/spaying-…` / `href=tel:+1416…` under Custom attributes, which would override the binding on the published page.
- Cause: the WHTML importer stores the source `href` as a custom attribute as well as the link setting.
- Fix: after binding any imported link, `remove_attribute href` (or delete it under Custom attributes). Query `attribute_name: href` on the page to find them.
- Status: fixed on Home (Blog Card, Clinic Fact phone)
- Found by: claude

### 2026-11-13 · All-draft collections make Collection List queries fail with "[Conflict] … component map"
- Area: mcp
- Scope: template-candidate
- Symptom: sort and filter on new Home lists failed in the API and in the Designer, and the canvas showed "No items found" / "No element to style".
- Cause: every item in the collections was a draft; the canvas renders no draft items and query edits conflicted.
- Fix: set the items Ready to publish (`isDraft: false`, not published) with the person's OK; then sort, filter and limit worked from the API (`filters` on a Switch take `operator: "isOn"`/`"isOff"`; `limit` is a static number).
- Status: fixed
- Found by: human + claude

### 2026-11-13 · Conditional visibility can match the CMS item itself
- Area: designer
- Scope: template-candidate
- Symptom: per-item icons in a Services list were driven by an extra Option field (Icon), because a condition on Name breaks when an editor renames an item.
- Cause: missed that the Visibility conditions field list starts with "Current <Item>" (e.g. Current Service): `Current Service is any [Surgery]` matches by item, not by text, and still matches after the item is renamed (tested by the person).
- Fix: use "Current <Item> is any [item]" for per-item visibility; no Option field needed. The Services Icon option field becomes redundant once all ten icon conditions use it.
- Status: fixed — Icon field deleted 2026-11-13
- Found by: human

### 2026-11-13 · Collection List settings through the API: shapes and the Home conflict
- Area: mcp
- Scope: template-candidate
- Symptom: on Home, `sort` (and filters) on a new Collection List returned "[Conflict] The operation could not be applied to the component map", even on a list rebuilt from scratch; source, styles, moves and bindings in the same lists worked. A phone number could not be shown as text from a Phone field.
- Cause: unknown on the conflict (it cleared once after the person reloaded the Designer, then came back). The value shapes are strict: `source` is `static_json {"collectionId": "<id>"}` on the DynamoWrapper, `sort` is `[{"fieldSlug": "<slug>", "direction": "ascending"|"descending"}]`. A Phone field binds only to a link; a referenced item's field binds as `"<refFieldId>:::<fieldId>"`; a Span can't take a text binding.
- Fix: build the list, bind it, and put sort/filter/limit in MANUAL-TODO (row N) for the Designer. Show phone numbers from a Plain text field, or bind the text in the Designer (row R).
- Status: workaround confirmed
- Found by: claude

<!-- Add new entries here, newest first. -->

### 2026-11-13 · A CMS field's type can't change; re-creating it suffixes the slug
- Area: mcp
- Scope: template-candidate
- Symptom: Services Hero intro, How we can help intro, Step 1–4 body and Service Items Body were Plain text, so the source copy's inline links were lost. The person: any field whose content has (or on live used) inline links must take links.
- Cause: the API has no type change. Deleting the field and creating it again with the same name gives slug `<name>-2` (the old slug stays reserved), e.g. `hero-intro-2`, `body-2`.
- Fix: deleted + re-created as Rich text (same display names, help "links allowed"), refilled from `Assets/content/tvs-service-pages/` with links rewritten to `/services/…` and `/locations/…`, field groups re-applied. Bind templates to the `-2` slugs. Decide Plain vs Rich per field before importing: does the source or live page link inside it?
- Status: workaround confirmed
- Found by: human + claude

### 2026-11-13 · data-* attributes refused on two imported Image elements
- Area: mcp
- Scope: template-candidate
- Symptom: `set_attributes` / `set_settings attributes` on the review modal's two images (imported with no asset) failed with "MPS rejected update … [Conflict] … component map"; after `set_image_asset` the call reported success, but `get_attributes` read back empty and the published `<img>` had no attribute. Other images on the page (the dog, `data-rise`) took attributes fine.
- Cause: unknown; both were Images created by the WHTML importer without an asset inside a `<dialog>` DOM element.
- Fix: the module also finds those images by class (`review-modal.ts`, `byClass`). For scripts, prefer hooks on a wrapper div over attributes on an Image.
- Later (2026-11-19): with `scope_component_id` set to the Reviews component, `set_attributes loading="lazy"` on both modal images applied, read back and published (`loading="lazy"` in the HTML; the photo now loads only when the popup opens). Image settings have no loading key, so this attribute is the API route to lazy/eager.
- Status: workaround confirmed
- Found by: claude

### 2026-11-13 · Review card text overflowed: the line clamp lived half in the Designer
- Area: css
- Scope: project
- Symptom: with the full review texts in the cards, the text ran up over the photo; no ellipsis.
- Cause: the repo rule set only `-webkit-box-orient` and `-webkit-line-clamp`; `display: -webkit-box` and `overflow: hidden` were assumed to come from the Designer, which can't set `-webkit-box`. The old texts were short enough not to show it.
- Fix: the whole clamp is in the repo rule (`display`, `overflow`, both clamp properties), as in the prototype.
- Status: fixed in `src/styles.css` (uncommitted)
- Found by: claude

### 2026-11-13 · Repo media rules for a custom width beat the Designer's smaller breakpoints
- Area: css
- Scope: template-candidate
- Symptom: on every docs page at 991px and below, content started 165px lower than the prototype; the stacked docs nav was 224px tall instead of 59px.
- Cause: the repo's `@media (max-width: 1279px) { .sgd-side { flex-basis: 14em } }` (a width the Designer has no breakpoint for) loads after Webflow's CSS, so it also wins over the Designer's 991px `flex: none` and 479px paddings on the same classes. In the prototype both live in one file, 1279 before 991, so the smaller breakpoint wins there.
- Fix: give repo rules for an in-between width a floor: `@media (min-width: 992px) and (max-width: 1279px)`. Do the same for any custom-width rule whose properties the Designer also sets at 991/767/479.
- Status: fixed in `src/styles.css` (uncommitted)
- Found by: claude

### 2026-11-13 · Image width/height attributes can't be restored through the API
- Area: mcp
- Scope: template-candidate
- Symptom: Logo docs specimens rendered at their natural size (347×78 instead of 249×56); the prototype sizes them with `height="56"` etc.
- Cause: the WHTML importer drops every `<img>` attribute, `set_attributes` refuses `width`/`height` on an Image ("internal error"), and Image settings expose no size keys.
- Fix: a height combo per size on the image class (Sgd Logo Img + Is H32…Is H210, em values). On site design, size images by class from the start rather than by attribute.
- Status: workaround confirmed
- Found by: claude

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
