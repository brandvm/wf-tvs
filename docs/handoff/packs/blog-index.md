# Import pack — Blog index (`/blog`)

Prepared 2026-11-13 by a read-only prep session. Nothing here has been written
to Webflow. Source: prototype `prototype/blog/index.html` (section "Blog
Articles"), classes in `prototype/src/css/new-classes-blog.css`, module
`prototype/src/modules/blog-filter.ts`; Figma "Blog (/blog)" 684:11647
(Articles 684:11670). Webflow state read 2026-11-13 through `webflow-wf-tvs`
(site `6af4e2d97d259cb3efb2af71`); SEO read from `webflow-tvs-live`.

## 0. Before you start — two content decisions (blockers)

1. **No Blogs item has Featured on.** The featured list would render empty.
   The prototype features `spaying-a-cat-age-and-recovery` (item of 2026-11-03).
   Needs the person's OK to switch Featured on for that item (CMS write).
2. **8 posts are dated in the future and are not on live**, but are
   published on staging: `why-is-my-dog-coughing` (11-17),
   `leptospirosis-dogs-toronto-wildlife` (11-24),
   `cat-constipation-when-to-see-vet` (12-01),
   `periodontal-disease-dogs-health-effects` (12-08),
   `holiday-foods-plants-toxic-pets` (12-15),
   `dog-arthritis-symptoms-senior-dogs` (12-22),
   `winter-parasite-prevention-pets` (12-29),
   `pet-blood-tests-x-rays-costs` (2027-01-05). None is in the live sitemap;
   the prototype leaves them out ("the 8 staged ones"). With them published,
   the "recent" row shows January/December posts instead of Arthritis /
   Teeth cleaning / Bordetella. Recommendation: set those 8 back to Draft
   (person's OK), or schedule them. A "Date posted is in the past" list filter
   is the alternative, but date filters and sort refuse each other through the
   API (`lessons/mcp.md` 2026-10-29) — avoid it.

Also open (not blocking): every Blogs item has an empty **Cover alt**.

## 1. Classes to create first

Already in Webflow (reuse, do not recreate): Section, S Wrapper, Eyebrow,
Eyebrow Dot, Eyebrow Text, D2, D2 + Weight Regular, Blog Head Text, Blog Card,
Blog Card Image, Blog Card Title, Blog Card Excerpt, Blog Card Date, Button,
Select, Select Toggle, Select Value, Select Icon, Select List, Select Native.

All variables exist except the five marked **NEW**. Breakpoint ids:
Desktop = `main`, 991 = `medium`, 767 = `small`, 479 = `tiny`.
"Spacing/x" = `--_spacing---x`; type sizes are Typography Scale `Size/x`.

### New variables (Layout collection `collection-d7e7593e-789e-d7e8-8691-268f429221b0`)

| Name | CSS name | Value | How |
| --- | --- | --- | --- |
| Blog/Recent Width **NEW** | `--_layout---blog--recent-width` | 34.625em (554px) | `create_size_variable`, Base only |
| Blog/Thumb Width **NEW** | `--_layout---blog--thumb-width` | 12.5em (200px) | Base only |
| Blog/Search Width **NEW** | `--_layout---blog--search-width` | 18.75em (300px) | Base only |
| Calc/Blog Index Gap **NEW** | `--_layout---calc--blog-index-gap` | `calc(var(--_spacing---96) + var(--_spacing---16))` (112px) | `value: {type: "custom", value: "calc(…)"}` (GOTCHAS 2026-11-12) |
| Calc/Section Bleed Right **NEW** | `--_layout---calc--section-bleed-right` | `calc(var(--_layout---section--padding-h) * -1)` | same shape; follows the Layout mode, like Calc/Nav Stick Top |

Check every create result's `name` (no "-2" suffix) before binding.

### New classes and combos

Values are variable bindings unless shown in plain CSS. Bind with
`property_value: "var(--…)"` (GOTCHAS 2026-11-12).

| Class (combo on) | Element | Desktop | 991 | 767 | 479 |
| --- | --- | --- | --- | --- | --- |
| Blog Top (on Section) | section | padding-top Spacing/96 | — | padding-top Spacing/64 | padding-top Spacing/48 |
| Blog Index (on S Wrapper) | page wrapper | row-gap Calc/Blog Index Gap | row-gap Spacing/80 | row-gap Spacing/64 | — |
| Blog Intro | header + featured row | flex column; gap Spacing/32; align-self stretch | | | |
| Blog List Head | head row | flex row wrap; align-items flex-end; justify space-between; gap Spacing/24; align-self stretch | | | |
| Is Tight (on Blog Head Text) | | gap Spacing/12 | | | |
| Blog List Lead | p | margin 0; color Text/Secondary; font-family Family/Body; font-size Size/18; line-height Comfortable | | | |
| Is Small (on Blog List Lead) | | font-size Size/16 | | | |
| Blog Featured Row | row | flex row; align-items stretch; gap Spacing/56; align-self stretch | flex column; gap Spacing/48 | | |
| Blog Featured List | Collection List **Wrapper** (featured) | flex; flex 1 1 0; min-width 0 | | | |
| Blog Fill | featured Collection List **and** its Collection Item | flex; flex 1 1 auto; min-width 0 | | | |
| Blog Featured | link block | flex column; flex 1 1 auto; gap Spacing/32; color inherit; text-decoration none | | | |
| Blog Featured Media | div | position relative; flex 1 1 auto; overflow hidden; min-height 0; aspect-ratio 590/448; radius Radius/16 | | | |
| Blog Featured Image | image | display block; width 100%; height 100%; object-fit cover; transition transform 400ms cubic-bezier(0.4,0,0.2,1) | | | |
| Blog Featured Content | div | flex column; align-items flex-start; gap Spacing/12 | | | |
| Blog Featured Meta | div | flex row wrap; align-items center; gap Spacing/24 | | | |
| Blog Featured Badge | div | flex; padding Spacing/4 Spacing/10; radius Radius/Pill; background Brand/Yellow; color Brand/Ink | | | |
| Blog Featured Badge Text | text | font-size Size/12; weight Medium; letter-spacing Wide; line-height Compact; uppercase | | | |
| Blog Featured Title | h2 | margin 0; font-size Size/28; weight Regular; letter-spacing Snug; line-height Snug; transition color 200ms ease | | font-size Size/24 | |
| Blog Featured Excerpt | p | margin 0; color Text/Secondary; font-family Family/Body; line-height Comfortable | | | |
| Blog Recent List | Collection List **Wrapper** (recent) | flex column; flex 0 0 Blog/Recent Width; min-width 0 | flex none | | |
| Blog Recent Item | Collection **Item** (recent) | padding Spacing/32 0; border-top Hairline solid Ink Tint/Ink 12. **First child** state: padding-top 0; border-top-width 0 | | padding Spacing/24 0 (first child keeps 0 top) | |
| Blog Recent | link block | flex row; align-items center; gap Spacing/24; color inherit; text-decoration none | | gap Spacing/16 | |
| Blog Recent Media | div | position relative; flex none; overflow hidden; width Blog/Thumb Width; aspect-ratio 10/9; radius Radius/16 | | width Blog/Search Width; max-width 40% | max-width 36% |
| Blog Recent Image | image | as Blog Featured Image | | | |
| Blog Recent Text | div | flex column; flex 1 1 0; align-items flex-start; gap Spacing/10; min-width 0 | | | |
| Is Recent (on Button) | Read More wrapper in Blog Recent | — | — | — | display none |
| Blog Chip | div | absolute; top Spacing/10; left Spacing/10; z-index 1; flex; padding Spacing/4 Spacing/10; radius Radius/Pill; background Blue Tint/Blue 8; color Brand/Accent | | | |
| Blog Chip Text | text | font-size Size/10; weight Medium; letter-spacing Wide; line-height Compact; uppercase; white-space nowrap | | | |
| Blog Date | div | flex; align-items center; gap Spacing/6 | | | |
| Blog Date Icon | div around the `<i>` | flex none; color Ink Tint/Ink 48; font-size Size/16; line-height 1 | | | |
| Blog All | div | flex column; gap Spacing/32; align-self stretch | | | |
| Blog Tools | div | flex row wrap; align-items center; gap Spacing/12 | | align-self stretch | |
| Blog Search | label (DOM) | flex; align-items center; gap Spacing/10; width Blog/Search Width; max-width 100%; height Button/Height; margin 0 (incl. margin-bottom: webflow.css gives labels 5px); padding 0 Spacing/20; border Hairline solid transparent; radius Radius/Pill; background Blue Tint/Blue 8; font-weight Regular (labels are bold in webflow.css); cursor text; transition border-color, background-color 200ms. **Hover**: border-color Ink Tint/Ink 12. **Focus within**: border-color Form/Focus; background Brand/Paper | | flex 1 1 auto; width auto | flex 1 1 100% |
| Blog Search Icon | div around the `<i>` | flex none; color Neutral/Slate; font-size Size/18; line-height 1 | | | |
| Blog Search Input | input (DOM) | flex 1 1 0; min-width 0; height 100%; padding 0; border 0; background transparent; color Brand/Ink; font-family Family/Body (prototype: inherit); font-size Size/15; line-height Compact; outline 0. **Placeholder**: color Neutral/Slate | | | |
| Blog Sort (on Select) | div | flex none | | | flex 1 1 100% |
| Blog Sort Toggle (on Select Toggle) | button (DOM) | gap Spacing/10; height Button/Height; padding 0 Spacing/16 0 Spacing/20; border Hairline solid Ink Tint/Ink 12; radius Radius/Pill; background Brand/Paper; color Brand/Ink; transition border-color 200ms. **Hover**: border-color Brand/Ink | | | |
| Blog Filters | div (chips row) | flex row wrap; gap Spacing/8 | | | flex-wrap nowrap; overflow-x auto; margin-right Calc/Section Bleed Right; padding-right Section/Padding H |
| Blog Filter Wrap | chips Collection List **Wrapper** | flex 0 1 auto; min-width 0 | | | flex none |
| Blog Filter Items | chips Collection List | flex row wrap; gap Spacing/8 | | | flex-wrap nowrap |
| Blog Filter Chip | button (DOM) | flex; align-items center; padding Spacing/10 Spacing/16; border Hairline solid Ink Tint/Ink 12; radius Radius/Pill; background Brand/Paper; color Brand/Ink; font-family Family/Base; white-space nowrap; cursor pointer; transition background-color, border-color, color 200ms. **Hover**: border-color Brand/Ink. **Pressed (active)**: background Blue Tint/Blue 8 | | | |
| Blog Filter Chip Text | text | font-size Size/15; weight Medium; line-height Compact | | | |
| Blog Filter Status | p | margin 0 (the rest is repo CSS, §5) | | | |
| Blog Grid | grid Collection List | grid, 3 columns `minmax(0,1fr)`; row-gap Spacing/48; column-gap Spacing/24; margin-top Spacing/16 | 2 columns | 1 column; row-gap Spacing/40 | |
| Blog Card Media | div | position relative; overflow hidden; align-self stretch; radius Radius/16 | | | |
| Blog Empty | p | margin 0; color Text/Secondary; font-family Family/Body; line-height Comfortable | | | |
| Is Hidden (on Blog Empty) | | display none (start state; the module removes it on 0 matches) | | | |
| Blog More | div | flex; justify-content center; margin-top Spacing/24 | | | |
| Blog Dyn Empty | Empty State of all four lists | display none | | | |

Note the one deliberate change from the prototype: the recent rows' padding
and hairline move from `.blog-recent` to the Collection Item (**Blog Recent
Item**), because in Webflow each link sits alone in its item, so
`.blog-recent:first-child` would match every row. The Grid columns are a
Designer grid (set the columns explicitly, or `.w-layout-grid` defaults
apply — AGENTS.md › Unset properties).

## 2. Components to reuse

| Component | Where | Settings |
| --- | --- | --- |
| G \| Page W (+ G \| Components) | page shell | as on Home; content in its G \| Main slot |
| Button Color (not C \| Button) | "Read More" inside Blog Featured, Blog Recent, Blog Card | Variant **Secondary** (`e13de0db-430f-b667-aee3-d545b7e6faea`), Size **Small** (`59642798-b49d-486d-53fd-1f7e1042710d`), Label "Read More", Icon `ri-arrow-right-s-line`, Icon After on. It must not be C \| Button: the whole card is already a link, and a link inside a link is invalid. Place it inside a `div.button` with `aria-hidden="true"` (in the markup below). In Blog Recent the div is `button is-recent` |
| Button Color | inside the Show more `<button>` | Variant Secondary, Size Default (base), Label "Show more", Icon After **off** |
| CTA | after the section, in the slot | default props (Heading "Ready when your pet needs you" …), as the prototype's `partials/sections/cta.html` |

## 3. WHTML markup (importer-safe)

Rules applied: every class exists before import (§1); buttons, inputs, the
select, its options and the label are `<i data-wftag="…">` stand-ins (GOTCHAS
2026-11-12: after import, `set_tag` to the data-wftag value, then
`remove_attribute data-wftag`; inputs are void, emitted as `<i …></i>`); no
`<span>`, `<time>` or `style`; Remix glyphs are plain `<i class="ri-…">`
inside a classed div (so Blog Date Icon / Blog Search Icon are real class
uses); the section id is imported with the section (lesson 2026-10-29).

The three Blogs lists and the chips list cannot be imported: each is shown
here as a static container holding **one sample item** between
`LIST-START`/`LIST-END` comments. After import, build each Collection List at
body level (`lessons/mcp.md` 2026-10-14), set its source, `move_element` the
sample item's children into the Collection Item, give the wrapper / list /
item the classes named in the comment, move the list into place, and remove
the static container.

```html
<div class="to-slot">
<section class="section blog-top" id="articles">
  <div class="s-wrapper blog-index" data-blog-filter="">
    <div class="blog-intro">
      <div class="blog-list-head">
        <div class="blog-head-text is-tight">
          <div class="eyebrow"><div class="eyebrow-dot"></div><div class="eyebrow-text">Blog</div></div>
          <h1 class="d2">Pet health articles and advice</h1>
          <p class="blog-list-lead is-small">Explore our featured articles</p>
        </div>
      </div>
      <div class="blog-featured-row">
        <!-- LIST-START featured: Wrapper "Blog Featured List", List "Blog Fill", Item "Blog Fill", Empty State "Blog Dyn Empty". Blogs, Featured is On, sort Date posted newest, limit 1 -->
        <div class="blog-featured-list">
          <a class="blog-featured" href="#">
            <div class="blog-featured-media">
              <img class="blog-featured-image" src="" alt="">
              <div class="blog-chip"><div class="blog-chip-text">Spay &amp; Neuter</div></div>
            </div>
            <div class="blog-featured-content">
              <div class="blog-featured-meta">
                <div class="blog-featured-badge"><div class="blog-featured-badge-text">Featured</div></div>
                <div class="blog-date"><div class="blog-date-icon"><i class="ri-calendar-line" aria-hidden="true"></i></div><div class="blog-card-date">November 3, 2026</div></div>
              </div>
              <h2 class="blog-featured-title">Spaying Your Cat, the Right Age and What the First Week at Home Looks Like</h2>
              <p class="blog-featured-excerpt">Spaying a cat by five months prevents heat cycles and surprise litters. Learn the right age, what the surgery involves, and what the first week at home looks like.</p>
              <div class="button" aria-hidden="true"><!-- Button Color instance: Secondary, Small, "Read More", ri-arrow-right-s-line --></div>
            </div>
          </a>
        </div>
        <!-- LIST-END featured -->
        <!-- LIST-START recent: Wrapper "Blog Recent List", List (no class), Item "Blog Recent Item", Empty State "Blog Dyn Empty". Blogs, Featured is Off, sort Date posted newest, limit 3 -->
        <div class="blog-recent-list">
          <a class="blog-recent" href="#">
            <div class="blog-recent-media">
              <img class="blog-recent-image" src="" alt="">
              <div class="blog-chip"><div class="blog-chip-text">Wellness</div></div>
            </div>
            <div class="blog-recent-text">
              <div class="blog-date"><div class="blog-date-icon"><i class="ri-calendar-line" aria-hidden="true"></i></div><div class="blog-card-date">November 10, 2026</div></div>
              <h3 class="blog-card-title">Arthritis in Dogs, The Slow Signs Owners Mistake for Normal Aging</h3>
              <div class="button is-recent" aria-hidden="true"><!-- Button Color instance: Secondary, Small, "Read More", ri-arrow-right-s-line --></div>
            </div>
          </a>
        </div>
        <!-- LIST-END recent -->
      </div>
    </div>
    <div class="blog-all">
      <div class="blog-list-head">
        <div class="blog-head-text is-tight">
          <h2 class="d2 weight-regular">All articles</h2>
          <p class="blog-list-lead">Browse every article, or narrow it down by topic.</p>
        </div>
        <div class="blog-tools">
          <i data-wftag="label" class="blog-search">
            <div class="blog-search-icon"><i class="ri-search-line" aria-hidden="true"></i></div>
            <i data-wftag="input" class="blog-search-input" type="search" name="Search" placeholder="Search articles" aria-label="Search articles" autocomplete="off" data-blog-filter-search=""></i>
          </i>
          <div class="select blog-sort" data-select="">
            <i data-wftag="select" class="select-native" name="Sort" aria-label="Sort articles" data-blog-filter-sort="">
              <i data-wftag="option" value="newest" selected="">Sort: Newest first</i>
              <i data-wftag="option" value="oldest">Sort: Oldest first</i>
              <i data-wftag="option" value="title">Sort: Title A–Z</i>
            </i>
            <i data-wftag="button" class="select-toggle blog-sort-toggle" type="button" data-select-toggle="">
              <div class="select-value" data-select-value="">Sort: Newest first</div>
              <i class="select-icon ri-arrow-down-s-line" aria-hidden="true"></i>
            </i>
            <div class="select-list" data-select-list=""></div>
          </div>
        </div>
      </div>
      <div class="blog-filters" role="group" aria-label="Filter articles by topic">
        <i data-wftag="button" class="blog-filter-chip" type="button" data-blog-filter-chip="all" aria-pressed="true"><div class="blog-filter-chip-text">All</div></i>
        <!-- LIST-START chips: Wrapper "Blog Filter Wrap", List "Blog Filter Items", Item (no class), Empty State "Blog Dyn Empty". Blog Categories, sort Created on oldest first (= Figma order) -->
        <div class="blog-filter-wrap">
          <i data-wftag="button" class="blog-filter-chip" type="button" data-blog-filter-chip="wellness" aria-pressed="false"><div class="blog-filter-chip-text">Wellness</div></i>
        </div>
        <!-- LIST-END chips -->
      </div>
      <p class="blog-filter-status" aria-live="polite" data-blog-filter-status=""></p>
      <!-- LIST-START grid: Wrapper (no class), List "Blog Grid" + data-blog-filter-list, Item (no class), Empty State "Blog Dyn Empty". Blogs, sort Date posted newest, no limit -->
      <div class="blog-grid" data-blog-filter-list="">
        <a class="blog-card" href="#" data-blog-filter-item="" data-category="wellness">
          <div class="blog-card-media">
            <img class="blog-card-image" src="" alt="">
            <div class="blog-chip"><div class="blog-chip-text">Wellness</div></div>
          </div>
          <div class="blog-date"><div class="blog-date-icon"><i class="ri-calendar-line" aria-hidden="true"></i></div><div class="blog-card-date">November 10, 2026</div></div>
          <h3 class="blog-card-title">Arthritis in Dogs, The Slow Signs Owners Mistake for Normal Aging</h3>
          <p class="blog-card-excerpt">Arthritis in dogs often looks like normal aging. Learn the early signs, how we diagnose it, the treatment options, and simple changes that help at home.</p>
          <div class="button" aria-hidden="true"><!-- Button Color instance: Secondary, Small, "Read More", ri-arrow-right-s-line --></div>
        </a>
      </div>
      <!-- LIST-END grid -->
      <p class="blog-empty is-hidden" data-blog-filter-empty="">No articles match. Try another topic, or clear the search.</p>
      <div class="blog-more">
        <i data-wftag="button" class="button" type="button" data-blog-filter-more="" data-blog-filter-page="9"><!-- Button Color instance: Secondary, Default, "Show more", Icon After off --></i>
      </div>
    </div>
  </div>
</section>
</div>
```

After import: `To Slot` has no class of its own (as on Home, row K) — it is
dragged into the slot and ungrouped. Insert the Button Color instances with
`insert_component_instance` and set Variant / Size / Label / Icon / Icon After
with `set_component_instance_prop_values`. Insert the CTA instance after the
section. Check that `<img>` came in as Image elements with their classes, and
that every `data-wftag` was turned into its tag and removed (count tags:
1 label, 1 input, 1 select, 3 option, 1 + 1 + 1 button stand-ins before the
chips list is built).

## 4. CMS lists and bindings

Collections: Blogs `6af7417034f822e0c17f6900`, Blog Categories
`6af7416b0fddcc8540376fd5`. One query key per `set_settings` call (source,
then sort, then limit, then filters), read each back; a list that refuses once
is rebuilt or handed to the Designer (`lessons/mcp.md` 2026-10-14, 2026-10-29).

| List | Source | Filter | Sort | Limit |
| --- | --- | --- | --- | --- |
| Featured | Blogs | `{"fieldSlug": "featured", "operator": "isOn"}` | `[{"fieldSlug": "date-posted", "direction": "descending"}]` | 1 |
| Recent | Blogs | `{"fieldSlug": "featured", "operator": "isOff"}` | date-posted descending | 3 |
| Grid (All articles) | Blogs | none (all posts, featured included, as in the prototype) | date-posted descending | none (27 items, under 100) |
| Chips | Blog Categories | none | Created on, oldest first (gives Figma's order: Wellness, Vaccinations, Spay & Neuter, Dental Care, Parasites, Allergies & Skin, New Pets, Travel). If the API has no slug for Created on, Designer step (row TBD-3). Name A–Z would reorder the chips | none |

Field bindings (Blogs field ids):

| Element | Binding |
| --- | --- |
| Blog Featured / Blog Recent / Blog Card link | Link → Current Blogs page (Designer, row TBD-2); then remove the imported `href` custom attribute (GOTCHAS 2026-11-13) |
| Blog Featured Image / Blog Recent Image / Blog Card Image | Image → Cover `afd6240cc6697ba9fbe98f6a13799e09`; alt → Cover alt `23307d9667df3157817f0d116d783ce6` (all empty today) |
| Blog Chip Text (all three lists) | Category › Name: `d5d7e72164114738e8e54a2d44fe63bf:::79f6cd56742a41ccd51e1651ac42c7ef` |
| Blog Card Date (all three) | Date posted `162d1e97a407fbb04a199683d1bd38f6` (`set_settings` key `text`, `cms` binding); default format "MMMM D, YYYY" = the design |
| Blog Featured Title, Blog Card Title (recent and grid) | Title `03628d1d398d177e5ba6c83def4ae6a1` |
| Blog Featured Excerpt, Blog Card Excerpt | Excerpt `c78825678111954454de14f383a08e7a` |
| Blog Featured Badge | static "Featured" (only in the Featured-on list) |
| Grid card `data-category` | attribute value bound to Category › Slug: `d5d7e72164114738e8e54a2d44fe63bf:::af30118f3a770c15629a49db11fbf4fd` (`set_settings` › `attributes` with `value_binding`; it replaces the list, so send `data-blog-filter-item` with it) |
| Chip button `data-blog-filter-chip` | attribute value bound to Blog Categories Slug `af30118f3a770c15629a49db11fbf4fd`; keep static `type="button"`, `aria-pressed="false"` |
| Chip text | Blog Categories Name `79f6cd56742a41ccd51e1651ac42c7ef` |

All 27 Blogs items have a Category, so the chip needs no conditional
visibility. Blog Categories Colour is empty on every item and the design
styles all chips alike: do not bind it.

## 5. Module hooks — recommendation: keep module `blog-filter`, not Finsweet

**Recommended: port the prototype module `blog-filter` to
`wf-tvs/src/modules/blog-filter.ts`** (`run('blog-filter', initBlogFilter)`
after `select`), with data-* hooks on the CMS markup.

Why, against Finsweet List (via `recipes/finsweet/`, the only allowed way):
- 27 posts, one page: Webflow renders all of them in one list (limit 100), so
  nothing needs to be fetched from paginated pages — Finsweet's main
  advantage doesn't apply.
- Size: the module is about 2 KB; Finsweet List bundled is about 100 KB+ and
  the repo has no Finsweet set up yet (recipe steps 1–6, a new dependency).
- The sort control is the site's custom select (module `select`, popover);
  the module reads its native `<select>` change event as it is. Finsweet's
  custom empty message also needs an extra module (`lessons/js.md`).
- Already built and checked in the prototype: chips, search, sort, page size
  9, the polite live-region count, focus to the first new card on Show more.
- Trade-off: if posts ever pass 100, switch to Finsweet List + Load (the
  markup maps 1:1 to `fs-list-*`), or add native pagination.

The prototype comment "filtered by Finsweet List Filter in Webflow" predates
this decision; update it if the person agrees.

Hooks to set (all attributes, never classes):

| Element | Attribute |
| --- | --- |
| S Wrapper Blog Index | `data-blog-filter` (imported) |
| Blog Search Input | `data-blog-filter-search` (imported) |
| Select Native | `data-blog-filter-sort` (imported); Select root `data-select`, toggle `data-select-toggle`, value `data-select-value`, list `data-select-list` (module select) |
| Chip buttons | `data-blog-filter-chip="all"` (static) / bound Slug (CMS), `aria-pressed` |
| Blog Filter Status | `data-blog-filter-status`, `aria-live="polite"` |
| Grid Collection List (the `.w-dyn-items` element, class Blog Grid) | `data-blog-filter-list` (set on the built list) |
| Grid card link (Blog Card) | `data-blog-filter-item`, `data-category` = Category › Slug |
| Blog Empty | `data-blog-filter-empty` |
| Show more button | `data-blog-filter-more`, `data-blog-filter-page="9"` |

Changes needed at the port (repo session, not the builder):
1. Items: the module moves and hides `item.closest('.w-dyn-item') ?? item`,
   not the link itself (appending the link would pull it out of its item).
2. Sort without `data-date`: "newest" = the server order (the list is sorted
   Date posted newest first), "oldest" = that order reversed, "title" as now.
   A bound date attribute publishes "November 3, 2026"; DOM order avoids
   parsing it.
3. Repo CSS (§ in `src/styles.css`, tagged):
   - `js-state`: `.blog-filter-chip[aria-pressed="true"]` (border and
     background Brand/Ink, colour Brand/Paper);
     `[data-blog-filter-list] > .is-hidden, [data-blog-filter-more].is-hidden,
     [data-blog-filter-empty].is-hidden { display: none; }`.
   - `designer-cant`: `.blog-filter-status` visually hidden (clip); hidden
     chip scrollbar (`scrollbar-width`, `::-webkit-scrollbar`); descendant
     hovers `.blog-featured:hover .blog-featured-image { scale 1.02 }`,
     `.blog-featured:hover .blog-featured-title { colour Brand/Accent }`,
     `.blog-recent:hover .blog-recent-image { scale 1.03 }`,
     `.blog-recent:hover .blog-card-title { colour Brand/Accent }` (Blog
     Card's own hover rules are already in `src/styles.css`).
   - Every `var()` with its raw fallback (GOTCHAS 2026-11-12).

## 6. SEO from live (read only)

Live page "Blog" (`6a2abb689196f5138eb79ada`, `/blog`):

| Field | Value |
| --- | --- |
| Page title / slug | Blog / `blog` (coexists with the Blogs collection at `/blog/{slug}`, as on live) |
| SEO title | Pet Care Tips & Advice \| TVS Animal Hospitals Blog |
| Meta description | Practical pet care advice from Toronto vets: cost guides, wellness tips and clear answers to the questions owners ask most. From the TVS team. |
| Open Graph | title and description copied from SEO (`titleCopied`, `descriptionCopied` true); no OG image |
| JSON-LD | none |
| Canonical | default (`https://www.tvshospitals.com/blog`) |

Create with `create_page` (`title: "Blog"`, `slug: "blog"`, `seo`,
`openGraph: {titleCopied: true, descriptionCopied: true}`). Live paginates
with `?fd2ff946_page=2`; the new page shows everything on one URL, so no
redirect is needed (query strings only).

## 7. Manual Designer steps (new MANUAL-TODO rows, letters TBD)

| ID | Where | Breakpoint | Set | Why the API can't | Done |
| --- | --- | --- | --- | --- | --- |
| TBD-1 | Blog › the "To Slot" wrapper | — | Drag into G \| Page W's G \| Main slot and ungroup (as row K) | The API can't start a slot's content | ☐ |
| TBD-2 | Blog › Blog Featured, Blog Recent, Blog Card link blocks | — | Link → Current Blogs page; then delete the `href` custom attribute on each | A link to the current CMS item is Designer-only | ☐ |
| TBD-3 | Blog › chips Collection List (Blog Categories) | — | Sort: Created on, oldest first (only if the API sort has no Created on slug) | No known API field slug for Created on | ☐ |
| TBD-4 | Blog › any of the four lists that refuses a sort / filter / limit write | — | As §4 | "[Conflict] … component map" on query writes (GOTCHAS 2026-11-13) | ☐ |
| TBD-5 | Blog › the three cover Images | — | Alt → Cover alt field (only if the API binding fails); fill Cover alt in the CMS (empty on all 27) | Image alt bindings untested through the API | ☐ |

No `data-manual-todo` markers are needed except for TBD-2 (an unlinked card
looks finished): add a Caption "Manual step TBD-2: card links" next to the
grid until done.

## 8. Check list after the import

- [ ] Page `/blog` exists with the SEO in §6; the section sits in G | Main
      with the CTA after it; nav and footer render.
- [ ] Every element kept its full class list (no element lost all classes);
      `query_elements` shows no leftover `data-wftag`, and 1 `input`,
      1 `select` with 3 options, the label, and buttons (All chip, sort
      toggle, Show more, one per chip item).
- [ ] Featured list shows 1 post (needs §0.1), Recent shows 3 posts without
      the featured one, Grid shows every published post newest first,
      chips show 8 categories in Figma order after "All".
- [ ] Cards: image, category chip (Category › Name), date "Month D, YYYY",
      title, excerpt, Read More; links go to `/blog/<slug>`; no `href`
      custom attribute left.
- [ ] Published HTML: each grid card has `data-blog-filter-item` and a
      `data-category` equal to a chip's `data-blog-filter-chip`.
- [ ] With the repo port live on staging: chip filters and toggles
      `aria-pressed`; search narrows (debounced); sort switches order;
      9 cards, then Show more adds 9 and hides when all are shown; empty
      message on no match; the live region reads the count.
- [ ] Layout against the prototype (http://localhost:5955/blog/) at 1440,
      991, 767, 479: featured row stacks at 991; recent thumbnails shrink at
      767, Read More hidden in recent rows at 479; grid 3 → 2 → 1; chips
      scroll sideways at 479 to the screen edge with no scrollbar.
- [ ] Empty States of the four lists never show ("No items found").
- [ ] `pnpm wf:pass /blog` (and `wf:compare`) against the prototype.
- [ ] New MANUAL-TODO rows added with real letters; HANDOFF Pages table
      gets the `/blog` row.
