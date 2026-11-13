# Import pack — Registration pages (`/north-york-registration`, `/parliament-registration`)

Prepared 2026-11-13 by a read-only prep session for the Webflow build
session. Nothing here has been written to Webflow. Sources:
`prototype/north-york-registration/index.html`,
`prototype/parliament-registration/index.html`,
`prototype/partials/forms/registration-{north-york,parliament}.html`
(standalone variant), `prototype/src/css/new-classes-location.css`,
`new-classes-landing.css`, `proposed.css` (P28); live site read through
`webflow-tvs-live` (read only) and the published live pages.

Both pages: the full site shell (G | Page W: nav, main slot, footer), one
section with the two-line H1 centred above the clinic's 26-field
registration form, noindex. No Figma frame (live pages rebuilt in the TVS
system).

## 0. Before you start (blockers and order)

1. **Repo: date-picker port is behind the prototype.** `wf-tvs/src/modules/date-picker.ts`
   writes "4 January 2027" and ignores `data-date-max`; the prototype's
   module writes `yyyy-mm-dd` (live flatpickr "Y-m-d") and supports
   `data-date-max="today"` (Pet's Date of Birth). Port
   `prototype/src/modules/date-picker.ts` into the repo (`pnpm build`,
   commit `dist/`) before these pages go to staging, or submissions differ
   from live. Not a Webflow step.
2. **Shared classes.** Almost every class below is shared with the
   Locations template, Contact and the landing forms (same generated form
   partials). Whichever pack is imported first creates them; later packs
   only check. Re-run the class check (§1, last paragraph) right before
   importing.
3. **Form Block, not DOM form.** The forms must submit to Webflow
   (notifications, the Forms list), so the `<form>` imports as a real Form
   Block and only the controls go in as `<i data-wftag>` stand-ins (GOTCHAS
   2026-11-12). Unverified on this site: that Webflow accepts and emails
   the 26 DOM-element fields of a Form Block. Check §7 item 9 on the first
   page before doing the second.

## 1. Classes to create first

Checked against Webflow 2026-11-13 (`get_styles`, 748 styles). Values are
variables (CSS name → Webflow name in brackets where not obvious). Use
`property_value: "var(--…)"` (GOTCHAS 2026-11-12: binds the variable).
Breakpoints: main = desktop, medium = 991, small = 767, tiny = 479.

**Already exist (no action):** D2, Date, Date Input (also as combo on Form
Input), Date Icon, Datepicker, Form Check, Form Check Input, Form Input,
Form Message, Form Message › Is Error, G | Page W / G | Main W / G | Main,
S Wrapper, Section, Section Head, Section Head › Is Center (and the chain
Is Center › is-tight), Select, Select Icon, Select List, Select Native,
Select Toggle (also as combo on Form Input), Select Value, Skip Link.

**New variable (P28, missing):** Layout › `Registration/Form Width` =
`48em` (`--_layout---registration--form-width`). Create it first and check
the returned name is not suffixed.

**New globals and combos (missing):**

| Class (combo chain) | Element | main | medium 991 | small 767 | tiny 479 |
| --- | --- | --- | --- | --- | --- |
| Section › **Location Top** | the section | padding-top `--_spacing---48` | | | |
| S Wrapper › **Registration** | the wrapper | align-items center; row-gap and column-gap `--_spacing---40` | | gap `--_spacing---32` | |
| **Registration Title Sub** | text Span in the H1 | display block; color `--_colors-semantic---text--accent` (Text/Accent) | | | |
| **Registration Form** | div around the Form Block | width 100%; max-width `--_layout---registration--form-width` | | | |
| **Clinic Form** | Form Block wrapper (`.w-form`) | padding `--_spacing---32` (4 sides); radius `--_radius---24`; background `--_colors---blue-tint--blue-8`; **margin-bottom 0** (webflow.css gives `.w-form` 15px) | | | padding top/bottom `--_spacing---24`, left/right `--_spacing---16` |
| **Clinic Form Body** | the `<form>` (FormForm) | display flex; direction column; gap `--_spacing---24`; margin 0 | | | |
| **Clinic Form Head** | | flex column; gap `--_spacing---16` | | | |
| **Clinic Form Line** | | width 100%; height `--_spacing---hairline`; background `--_colors---ink-tint--ink-12` | | | |
| **Clinic Form Title** | h2 | margin 0; size `--_typography-scale---size--28`; weight `--_typography-scale---weight--regular`; letter-spacing `--_typography-scale---letter-spacing--snug`; line-height `--_typography-scale---line-height--snug` | | | |
| **Form Group** | | flex column; gap `--_spacing---10` | | | |
| **Form Group Label** | div | color `--_colors---ink-tint--ink-64`; size `--_typography-scale---size--12`; weight medium; letter-spacing `--_typography-scale---letter-spacing--wide`; line-height compact; uppercase | | | |
| **Form Grid** | | display grid; 2 columns `minmax(0, 1fr)`; row and column gap `--_spacing---10` | | | 1 column `minmax(0, 1fr)` |
| Form Grid › **Is Labelled** | | align-items center | | | |
| **Form Cell** | | flex column; gap `--_spacing---10`; min-width 0 | | | |
| Form Cell › **Is Full** | | grid-column 1 / -1 (span all) | | | |
| **Form Row Label** | `<label>` | size `--_typography-scale---size--14`; weight medium; line-height compact; **margin-bottom 0** (webflow.css `label` gives 5px and bold) | | | |
| Form Input › **Is Panel** | fields and toggles | border colour transparent (4 sides); radius `--_radius---12`; background `--_colors---brand--paper` | | | |
| **Form Actions** | | display flex | | | |
| **Form Submit** | submit input | height `--_layout---button--height`; padding 0 `--_spacing---24`; border width 0; radius `--_radius---pill`; background `--_colors---brand--accent`; color `--_colors---brand--paper`; font-family inherit; size `--_typography-role---size--button`; weight medium; cursor pointer; transition background-color 200ms ease. **Hover:** background `--_colors---brand--ink`. **Pressed:** background `--_colors---ink-tint--ink-90` | | | |
| Form Message › **Form Success** | Webflow's Success block (`.w-form-done`) | padding 0; radius 0; background transparent; color `--_colors---brand--ink`; **text-align left** (webflow.css centres `.w-form-done`). **No `display`** (webflow.js shows it with inline `display: block`) | | | |
| **Form Success Panel** | | flex column; gap `--_spacing---24`; padding `--_spacing---24`; radius `--_radius---12`; background `#1d2b5d` (raw, approved 2026-11-13: keep the live look); color `--_colors---brand--paper` | | | padding `--_spacing---16` |
| **Form Success Head** | | flex column; align-items center; gap `--_spacing---8`; text-align center | | | |
| **Form Success Title** | h3 | margin 0; color paper; size `--_typography-scale---size--24`; weight semibold; line-height compact | | | |
| Form Success Title › **Is Capitalized** | | text-transform capitalize | | | |
| **Form Success Lead** | p | margin 0; text-wrap balance; color paper; size 14; line-height normal | | | |
| **Form Success Box** | | display flex; align-items flex-start; gap `--_spacing---20`; padding `--_spacing---16`; border `--_spacing---hairline` solid `--_colors---paper-tint--paper-12`; radius `--_radius---8`; background `rgba(255,255,255,0.1)` (raw, approved) | | | gap `--_spacing---12` |
| Form Success Box › **Is Accent** | | border width `--_spacing---2`, colour `--_colors---brand--yellow`; background `--_colors---yellow-tint--yellow-20` | | | |
| **Form Success Box Icon** | | flex none; display flex; centre both axes; width and height `--_spacing---48`; radius `--_radius---4`; background `#fef5d3` (raw, approved); color ink | | | width/height `--_spacing---40` |
| **Form Success Box Glyph** | `<i>` | size `--_typography-scale---size--24`; line-height 1 | | | |
| **Form Success Box Text** | | flex column; align-items flex-start; gap `--_spacing---10`; min-width 0 | | | |
| **Form Success Box Title** | div | text-wrap balance; color paper; size `--_typography-scale---size--20`; weight semibold; line-height `--_typography-scale---line-height--tight` | | | size `--_typography-scale---size--18` |
| Form Success Box Title › **Is Accent** | | color `--_colors---brand--yellow` | | | |
| Form Success Box Title › **Is Upper** | | text-transform uppercase | | | |
| **Form Success Box Body** | p | margin 0; color paper; size 14; line-height normal | | | |
| **Form Success Call** | link | display inline-flex; align-items center; gap `--_spacing---4`; height `--_spacing---40`; padding 0 `--_spacing---16`; radius `--_radius---8`; background paper; color `--_colors---brand--accent`; no underline; transition background-color 200ms ease. **Hover:** background `--_colors---blue-tint--blue-8`. **Pressed:** `--_colors---blue-tint--blue-16` | | | |
| **Form Success Call Icon** | `<i>` | size 16; line-height 1 | | | |
| **Form Success Call Text** | Span | size 16; weight medium; line-height compact | | | |
| **Form Success Box Link** | link | display flex; align-items flex-start; gap `--_spacing---6`; color paper; underline; decoration colour `--_colors---paper-tint--paper-48`; underline offset 0.25em. **Hover:** decoration colour `--_colors---brand--yellow` (if the Designer has no decoration colour/offset, see TBD-REG-5) | | | |
| **Form Success Box Link Icon** | `<i>` | flex none; color `--_colors---brand--yellow`; size 16; line-height normal | | | |
| **Form Success Box Link Text** | Span | size 14; line-height normal | | | |
| **Form Success Next** | | flex column; gap `--_spacing---20`; **margin-top `--_spacing---32`** (spacing after the panel is a margin: the Success block is `display: block`) | | | |
| **Form Success Next Title** | | size 18; weight bold; line-height compact | | | |
| **Form Success Step** | | display flex; align-items flex-start; gap `--_spacing---16` | | | |
| **Form Success Step Icon** | | flex none; flex centre; width and height `--_spacing---40`; radius pill; background `--_colors---brand--yellow`; color ink | | | |
| **Form Success Step Glyph** | `<i>` | size 18; line-height 1 | | | |
| **Form Success Step Text** | | flex column; gap `--_spacing---6`; min-width 0; padding-top `--_spacing---10` | | | |
| **Form Success Step Title** | | size 14; weight bold; line-height compact | | | |
| **Form Success Step Body** | p | margin 0; size 14; line-height normal | | | |

Short names above: size N = `--_typography-scale---size--N`; weight
medium/semibold/bold = `--_typography-scale---weight--…`; line-height
compact/normal = `--_typography-scale---line-height--…`; paper/ink =
`--_colors---brand--paper` / `--_colors---brand--ink`; pill =
`--_radius---pill`. All variables exist in Webflow (checked 2026-11-13)
except Registration/Form Width.

Deliberate change from the prototype: the clinic box title is
`form-success-box-title is-upper` without `is-place` (an unstyled marker
nobody reads); this avoids a three-class chain. The Locations/Contact
packs may still use `is-place` on the non-standalone panel.

Before import, re-check with `query_styles` that every class in §2's
markup exists (the importer drops an element's whole class list when one is
missing): `location-top, registration, registration-title-sub,
registration-form, clinic-form-body, clinic-form-head, clinic-form-line,
clinic-form-title, form-group, form-group-label, form-grid, is-labelled,
form-cell, is-full, form-input, is-panel, select, select-native,
select-toggle, select-value, select-icon, select-list, date, date-input,
date-icon, datepicker, form-row-label, form-check, form-check-input,
form-actions, form-submit` and every `form-success-*` class plus
`is-accent, is-upper, is-capitalized`.

## 2. WHTML markup per page

### 2.1 Page shell

1. Create the pages (`create_page`): §5 has titles, slugs and SEO.
2. Insert a **G | Page W** instance (`280bc82e-29bf-4fe9-0e6c-feb86b116bc6`)
   on each page. Its Slot can't be started by API (MANUAL-TODO K): import
   the section below anywhere on the page, then TBD-REG-1 (drag it into
   the slot), or insert straight into the slot if the builder has found a
   way since.

### 2.2 Section (import as one action; same for both pages except the H1 sub-line)

```html
<section class="section location-top" id="hero">
  <div class="s-wrapper registration">
    <div class="section-head is-center is-tight">
      <h1 class="d2">Registration Form <span class="registration-title-sub">{{SUB}}</span></h1>
    </div>
    <div class="registration-form"></div>
  </div>
</section>
```

- North York: `{{SUB}}` = `Toronto North Animal Hospital.`
- Parliament: `{{SUB}}` = `Parliament Animal Hospital.`

The sub-line is `display: block`, so a space the importer trims before
the Span (lessons 2026-10-28) doesn't show. It still matters for screen
readers and the page text ("Registration FormToronto…"): if it's gone,
put `&nbsp;` at the end of "Registration Form" (§7 item 8).

### 2.3 Form (import into `.registration-form`, one action per page)

Rules applied (GOTCHAS 2026-11-12): every `<input>` is written as an
explicitly closed `<i data-wftag="input" …></i>` **before** any other
rewrite (void-input rule: the N/A label wraps its input); `<select>`,
`<option>`, `<button>` and `<label>` are `<i data-wftag="…">`; no `<span>`
inside a stand-in; boolean attributes carry values (`required="required"`,
`readonly="readonly"`, module hooks `="true"`, the modules test presence
only). The `<form>` itself stays a real `<form>` so the importer makes a
Form Block (lessons 2026-10-05: FormWrapper › FormForm, class lands on the
wrapper). Names, data-names, required flags, ids and options are exactly
the partials'.

#### North York — Form Block "Registration - North York"

```html
<form class="clinic-form-body" id="wf-form-Registration---North-York" name="wf-form-Registration---North-York" data-name="Registration - North York" method="get">
  <div class="clinic-form-head"><h2 class="clinic-form-title">Contact Us</h2><div class="clinic-form-line"></div></div>
  <div class="form-group"><div class="form-group-label">Client details *</div><div class="form-grid"><div class="form-cell"><i data-wftag="input" class="form-input is-panel" type="text" maxlength="256" name="First-Name" data-name="First Name" placeholder="First Name" aria-label="First Name" id="registration-north-york-First-Name" required="required"></i></div><div class="form-cell"><i data-wftag="input" class="form-input is-panel" type="text" maxlength="256" name="Last-Name" data-name="Last Name" placeholder="Last Name" aria-label="Last Name" id="registration-north-york-Last-Name" required="required"></i></div><div class="form-cell is-full"><i data-wftag="input" class="form-input is-panel" type="email" maxlength="256" name="Email-Address" data-name="Email Address" placeholder="Email Address" aria-label="Email Address" id="registration-north-york-Email-Address" required="required"></i></div><div class="form-cell is-full"><i data-wftag="input" class="form-input is-panel" type="text" maxlength="256" name="Address-Line" data-name="Address Line" placeholder="Address Line" aria-label="Address Line" id="registration-north-york-Address-Line" required="required"></i></div><div class="form-cell is-full"><i data-wftag="input" class="form-input is-panel" type="text" maxlength="256" name="City" data-name="City" placeholder="City" aria-label="City" id="registration-north-york-City" required="required"></i></div><div class="form-cell is-full"><div class="form-grid"><div class="form-cell"><div class="select" data-select="true"><i data-wftag="select" class="select-native" id="registration-north-york-Province" name="Province" data-name="Province" aria-label="Province" required="required"><i data-wftag="option" value="">Province</i><i data-wftag="option" value="Alberta">Alberta</i><i data-wftag="option" value="British Columbia">British Columbia</i><i data-wftag="option" value="Manitoba">Manitoba</i><i data-wftag="option" value="New Brunswick">New Brunswick</i><i data-wftag="option" value="Newfoundland and Labrador">Newfoundland and Labrador</i><i data-wftag="option" value="Nova Scotia">Nova Scotia</i><i data-wftag="option" value="Ontario">Ontario</i><i data-wftag="option" value="Prince Edward Island">Prince Edward Island</i><i data-wftag="option" value="Quebec">Quebec</i><i data-wftag="option" value="Saskatchewan">Saskatchewan</i></i><i data-wftag="button" class="form-input is-panel select-toggle" type="button" data-select-toggle="true"><div class="select-value" data-select-value="true">Province</div><i class="select-icon ri-arrow-down-s-line" aria-hidden="true"></i></i><div class="select-list" data-select-list="true"></div></div></div><div class="form-cell"><i data-wftag="input" class="form-input is-panel" type="text" maxlength="256" name="Postal-Code" data-name="Postal Code" placeholder="Postal Code" aria-label="Postal Code" id="registration-north-york-Postal-Code" required="required"></i></div></div></div><div class="form-cell"><i data-wftag="input" class="form-input is-panel" type="tel" maxlength="256" name="Phone" data-name="Phone" placeholder="+1 ( 000) 000-00-00" aria-label="+1 ( 000) 000-00-00" id="registration-north-york-Phone" required="required"></i></div></div></div>
  <div class="form-group"><div class="form-group-label">Emergency contact (optional)</div><div class="form-grid"><div class="form-cell"><i data-wftag="input" class="form-input is-panel" type="text" maxlength="256" name="Emergency-Contact-Name" data-name="Emergency Contact / Name" placeholder="Name" aria-label="Name" id="registration-north-york-Emergency-Contact-Name"></i></div><div class="form-cell"><i data-wftag="input" class="form-input is-panel" type="tel" maxlength="256" name="Emergency-Contact-Phone" data-name="Emergency Contact / Phone" placeholder="+1 ( 000) 000-00-00" aria-label="+1 ( 000) 000-00-00" id="registration-north-york-Emergency-Contact-Phone"></i></div></div></div>
  <div class="form-group"><div class="form-group-label">Patient details *</div><div class="form-grid"><div class="form-cell"><i data-wftag="input" class="form-input is-panel" type="text" maxlength="256" name="Pet-s-Name" data-name="Pet’s Name" placeholder="Pet’s Name" aria-label="Pet’s Name" id="registration-north-york-Pet-s-Name" required="required"></i></div><div class="form-cell"><div class="select" data-select="true"><i data-wftag="select" class="select-native" id="registration-north-york-Type-of-Pet" name="Type-of-Pet" data-name="Type of Pet" aria-label="Type of Pet" required="required"><i data-wftag="option" value="">Type of Pet</i><i data-wftag="option" value="Dog">Dog</i><i data-wftag="option" value="Cat">Cat</i></i><i data-wftag="button" class="form-input is-panel select-toggle" type="button" data-select-toggle="true"><div class="select-value" data-select-value="true">Type of Pet</div><i class="select-icon ri-arrow-down-s-line" aria-hidden="true"></i></i><div class="select-list" data-select-list="true"></div></div></div><div class="form-cell"><i data-wftag="input" class="form-input is-panel" type="text" maxlength="256" name="Pet-s-Breed" data-name="Pet’s Breed" placeholder="Pet’s Breed" aria-label="Pet’s Breed" id="registration-north-york-Pet-s-Breed" required="required"></i></div><div class="form-cell"><i data-wftag="input" class="form-input is-panel" type="text" maxlength="256" name="Pet-s-Color" data-name="Pet’s Color" placeholder="Pet’s Color" aria-label="Pet’s Color" id="registration-north-york-Pet-s-Color" required="required"></i></div><div class="form-cell"><div class="select" data-select="true"><i data-wftag="select" class="select-native" id="registration-north-york-Pet-s-Gender" name="Pet-s-Gender" data-name="Pet’s Gender" aria-label="Pet’s Gender" required="required"><i data-wftag="option" value="">Pet’s Gender</i><i data-wftag="option" value="Male">Male</i><i data-wftag="option" value="Female">Female</i></i><i data-wftag="button" class="form-input is-panel select-toggle" type="button" data-select-toggle="true"><div class="select-value" data-select-value="true">Pet’s Gender</div><i class="select-icon ri-arrow-down-s-line" aria-hidden="true"></i></i><div class="select-list" data-select-list="true"></div></div></div><div class="form-cell"><div class="select" data-select="true"><i data-wftag="select" class="select-native" id="registration-north-york-Neutered-or-Spayed" name="Neutered-or-Spayed" data-name="Neutered or Spayed" aria-label="Neutered or Spayed" required="required"><i data-wftag="option" value="">Neutered or Spayed</i><i data-wftag="option" value="Yes">Yes</i><i data-wftag="option" value="No">No</i></i><i data-wftag="button" class="form-input is-panel select-toggle" type="button" data-select-toggle="true"><div class="select-value" data-select-value="true">Neutered or Spayed</div><i class="select-icon ri-arrow-down-s-line" aria-hidden="true"></i></i><div class="select-list" data-select-list="true"></div></div></div><div class="form-cell is-full"><i data-wftag="input" class="form-input is-panel" type="text" maxlength="256" name="Microchip-Number" data-name="Microchip Number" placeholder="Microchip Number (optional)" aria-label="Microchip Number (optional)" id="registration-north-york-Microchip-Number"></i></div><div class="form-cell is-full"><div class="form-grid"><div class="form-cell"><div class="select" data-select="true"><i data-wftag="select" class="select-native" id="registration-north-york-Do-you-have-insurance" name="Do-you-have-insurance" data-name="Do you have insurance?" aria-label="Do you have insurance?" required="required"><i data-wftag="option" value="">Do you have insurance?</i><i data-wftag="option" value="Yes">Yes</i><i data-wftag="option" value="No">No</i></i><i data-wftag="button" class="form-input is-panel select-toggle" type="button" data-select-toggle="true"><div class="select-value" data-select-value="true">Do you have insurance?</div><i class="select-icon ri-arrow-down-s-line" aria-hidden="true"></i></i><div class="select-list" data-select-list="true"></div></div></div><div class="form-cell"><i data-wftag="input" class="form-input is-panel" type="text" maxlength="256" name="Insurance-Provider" data-name="Insurance Provider" placeholder="(If Yes) Insurance Provider" aria-label="Insurance Provider" id="registration-north-york-Insurance-Provider"></i></div><div class="form-cell is-full"><i data-wftag="input" class="form-input is-panel" type="text" maxlength="256" name="Insurance-Policy-Number" data-name="Insurance Policy Number" placeholder="(If Yes) Insurance Policy Number" aria-label="Insurance Policy Number" id="registration-north-york-Insurance-Policy-Number"></i></div></div></div><div class="form-cell is-full"><i data-wftag="input" class="form-input is-panel" type="text" maxlength="256" name="Any-Medical-Information-optional" data-name="Any Medical Information (optional)" placeholder="Any Medical Information (optional)" aria-label="Any Medical Information (optional)" id="registration-north-york-Any-Medical-Information-optional"></i></div><div class="form-cell is-full"><div class="form-grid is-labelled"><i data-wftag="label" class="form-row-label" for="registration-north-york-Pet-s-Date-of-Birth">Pet’s Date of Birth *</i><div class="form-cell"><div class="date" data-date="true" data-date-max="today"><i data-wftag="input" class="form-input is-panel date-input" type="text" maxlength="256" id="registration-north-york-Pet-s-Date-of-Birth" name="Pet-s-Date-of-Birth" data-name="Pet's Date of Birth" placeholder="yyyy-mm-dd" readonly="readonly" data-date-input="true" required="required"></i><i class="date-icon ri-calendar-line" aria-hidden="true"></i><div class="datepicker" data-date-panel="true"></div></div></div></div></div><div class="form-cell is-full"><div class="select" data-select="true"><i data-wftag="select" class="select-native" id="registration-north-york-Other-Pets-in-the-household" name="Other-Pets-in-the-household" data-name="Other Pets in the household?" aria-label="Other Pets in the household? (optional)"><i data-wftag="option" value="">Other Pets in the household? (optional)</i><i data-wftag="option" value="Yes">Yes</i><i data-wftag="option" value="No">No</i></i><i data-wftag="button" class="form-input is-panel select-toggle" type="button" data-select-toggle="true"><div class="select-value" data-select-value="true">Other Pets in the household? (optional)</div><i class="select-icon ri-arrow-down-s-line" aria-hidden="true"></i></i><div class="select-list" data-select-list="true"></div></div></div></div></div>
  <div class="form-group"><div class="form-group-label">Appointment *</div><div class="form-grid"><div class="form-cell is-full"><div class="select" data-select="true"><i data-wftag="select" class="select-native" id="registration-north-york-Reason-for-Visit" name="Reason-for-Visit" data-name="Reason for Visit" aria-label="Reason for Visit (Optional)"><i data-wftag="option" value="">Reason for Visit (Optional)</i><i data-wftag="option" value="Vaccinations">Vaccinations</i><i data-wftag="option" value="Diagnostic">Diagnostic</i><i data-wftag="option" value="Wellness care">Wellness care</i><i data-wftag="option" value="Surgery">Surgery</i><i data-wftag="option" value="Spay and neuter services">Spay and neuter services</i><i data-wftag="option" value="Dental Care">Dental Care</i><i data-wftag="option" value="Nutrition counseling">Nutrition counseling</i><i data-wftag="option" value="Microchipping">Microchipping</i><i data-wftag="option" value="End-of-Life Care">End-of-Life Care</i><i data-wftag="option" value="Parasite prevention">Parasite prevention</i><i data-wftag="option" value="Allergy testing">Allergy testing</i><i data-wftag="option" value="Rehabilitation services">Rehabilitation services</i><i data-wftag="option" value="Preventive care">Preventive care</i><i data-wftag="option" value="Emergency care">Emergency care</i><i data-wftag="option" value="Surgical procedures">Surgical procedures</i><i data-wftag="option" value="Pharmacy">Pharmacy</i></i><i data-wftag="button" class="form-input is-panel select-toggle" type="button" data-select-toggle="true"><div class="select-value" data-select-value="true">Reason for Visit (Optional)</div><i class="select-icon ri-arrow-down-s-line" aria-hidden="true"></i></i><div class="select-list" data-select-list="true"></div></div></div><div class="form-cell is-full"><div class="form-grid is-labelled"><i data-wftag="label" class="form-row-label" for="registration-north-york-Appointment-Date">Choose a Date of Visit *</i><div class="form-cell"><div class="date" data-date="true" data-date-min="today"><i data-wftag="input" class="form-input is-panel date-input" type="text" maxlength="256" id="registration-north-york-Appointment-Date" name="Appointment-Date" data-name="Appointment Date" placeholder="yyyy-mm-dd" readonly="readonly" data-date-input="true"></i><i class="date-icon ri-calendar-line" aria-hidden="true"></i><div class="datepicker" data-date-panel="true"></div></div><i data-wftag="label" class="form-check"><i data-wftag="input" class="form-check-input" type="checkbox" id="registration-north-york-No-Date-of-Visit" name="No-Date-of-Visit" data-name="No Date of Visit"></i><div>N/A</div></i></div></div></div></div></div>
  <div class="form-actions"><i data-wftag="input" class="form-submit" type="submit" value="Send Message" data-wait="Please wait..."></i></div>
</form>
```

#### Parliament — Form Block "Registration - Parliament"

```html
<form class="clinic-form-body" id="wf-form-Registration---Parliament" name="wf-form-Registration---Parliament" data-name="Registration - Parliament" method="get">
  <div class="clinic-form-head"><h2 class="clinic-form-title">Contact Us</h2><div class="clinic-form-line"></div></div>
  <div class="form-group"><div class="form-group-label">Client details *</div><div class="form-grid"><div class="form-cell"><i data-wftag="input" class="form-input is-panel" type="text" maxlength="256" name="First-Name" data-name="First Name" placeholder="First Name" aria-label="First Name" id="registration-parliament-First-Name" required="required"></i></div><div class="form-cell"><i data-wftag="input" class="form-input is-panel" type="text" maxlength="256" name="Last-Name" data-name="Last Name" placeholder="Last Name" aria-label="Last Name" id="registration-parliament-Last-Name" required="required"></i></div><div class="form-cell is-full"><i data-wftag="input" class="form-input is-panel" type="email" maxlength="256" name="Email-Address" data-name="Email Address" placeholder="Email Address" aria-label="Email Address" id="registration-parliament-Email-Address" required="required"></i></div><div class="form-cell is-full"><i data-wftag="input" class="form-input is-panel" type="text" maxlength="256" name="Address-Line" data-name="Address Line" placeholder="Address Line" aria-label="Address Line" id="registration-parliament-Address-Line" required="required"></i></div><div class="form-cell is-full"><i data-wftag="input" class="form-input is-panel" type="text" maxlength="256" name="City" data-name="City" placeholder="City" aria-label="City" id="registration-parliament-City" required="required"></i></div><div class="form-cell is-full"><div class="form-grid"><div class="form-cell"><div class="select" data-select="true"><i data-wftag="select" class="select-native" id="registration-parliament-Province" name="Province" data-name="Province" aria-label="Province" required="required"><i data-wftag="option" value="">Province</i><i data-wftag="option" value="Alberta">Alberta</i><i data-wftag="option" value="British Columbia">British Columbia</i><i data-wftag="option" value="Manitoba">Manitoba</i><i data-wftag="option" value="New Brunswick">New Brunswick</i><i data-wftag="option" value="Newfoundland and Labrador">Newfoundland and Labrador</i><i data-wftag="option" value="Nova Scotia">Nova Scotia</i><i data-wftag="option" value="Ontario">Ontario</i><i data-wftag="option" value="Prince Edward Island">Prince Edward Island</i><i data-wftag="option" value="Quebec">Quebec</i><i data-wftag="option" value="Saskatchewan">Saskatchewan</i></i><i data-wftag="button" class="form-input is-panel select-toggle" type="button" data-select-toggle="true"><div class="select-value" data-select-value="true">Province</div><i class="select-icon ri-arrow-down-s-line" aria-hidden="true"></i></i><div class="select-list" data-select-list="true"></div></div></div><div class="form-cell"><i data-wftag="input" class="form-input is-panel" type="text" maxlength="256" name="Postal-Code" data-name="Postal Code" placeholder="Postal Code" aria-label="Postal Code" id="registration-parliament-Postal-Code" required="required"></i></div></div></div><div class="form-cell"><i data-wftag="input" class="form-input is-panel" type="tel" maxlength="256" name="Phone" data-name="Phone" placeholder="+1 ( 000) 000-00-00" aria-label="+1 ( 000) 000-00-00" id="registration-parliament-Phone" required="required"></i></div></div></div>
  <div class="form-group"><div class="form-group-label">Emergency contact (optional)</div><div class="form-grid"><div class="form-cell"><i data-wftag="input" class="form-input is-panel" type="text" maxlength="256" name="Emergency-Contact-Name" data-name="Emergency Contact / Name" placeholder="Name" aria-label="Name" id="registration-parliament-Emergency-Contact-Name"></i></div><div class="form-cell"><i data-wftag="input" class="form-input is-panel" type="tel" maxlength="256" name="Emergency-Contact-Phone" data-name="Emergency Contact / Phone" placeholder="+1 ( 000) 000-00-00" aria-label="+1 ( 000) 000-00-00" id="registration-parliament-Emergency-Contact-Phone"></i></div></div></div>
  <div class="form-group"><div class="form-group-label">Patient details *</div><div class="form-grid"><div class="form-cell"><i data-wftag="input" class="form-input is-panel" type="text" maxlength="256" name="Pet-s-Name" data-name="Pet’s Name" placeholder="Pet’s Name" aria-label="Pet’s Name" id="registration-parliament-Pet-s-Name" required="required"></i></div><div class="form-cell"><div class="select" data-select="true"><i data-wftag="select" class="select-native" id="registration-parliament-Type-of-Pet" name="Type-of-Pet" data-name="Type of Pet" aria-label="Type of Pet" required="required"><i data-wftag="option" value="">Type of Pet</i><i data-wftag="option" value="Dog">Dog</i><i data-wftag="option" value="Cat">Cat</i></i><i data-wftag="button" class="form-input is-panel select-toggle" type="button" data-select-toggle="true"><div class="select-value" data-select-value="true">Type of Pet</div><i class="select-icon ri-arrow-down-s-line" aria-hidden="true"></i></i><div class="select-list" data-select-list="true"></div></div></div><div class="form-cell"><i data-wftag="input" class="form-input is-panel" type="text" maxlength="256" name="Pet-s-Breed" data-name="Pet’s Breed" placeholder="Pet’s Breed" aria-label="Pet’s Breed" id="registration-parliament-Pet-s-Breed" required="required"></i></div><div class="form-cell"><i data-wftag="input" class="form-input is-panel" type="text" maxlength="256" name="Pet-s-Color" data-name="Pet’s Color" placeholder="Pet’s Color" aria-label="Pet’s Color" id="registration-parliament-Pet-s-Color" required="required"></i></div><div class="form-cell"><div class="select" data-select="true"><i data-wftag="select" class="select-native" id="registration-parliament-Pet-s-Gender" name="Pet-s-Gender" data-name="Pet’s Gender" aria-label="Pet’s Gender" required="required"><i data-wftag="option" value="">Pet’s Gender</i><i data-wftag="option" value="Male">Male</i><i data-wftag="option" value="Female">Female</i></i><i data-wftag="button" class="form-input is-panel select-toggle" type="button" data-select-toggle="true"><div class="select-value" data-select-value="true">Pet’s Gender</div><i class="select-icon ri-arrow-down-s-line" aria-hidden="true"></i></i><div class="select-list" data-select-list="true"></div></div></div><div class="form-cell"><div class="select" data-select="true"><i data-wftag="select" class="select-native" id="registration-parliament-Neutered-or-Spayed" name="Neutered-or-Spayed" data-name="Neutered or Spayed" aria-label="Neutered or Spayed" required="required"><i data-wftag="option" value="">Neutered or Spayed</i><i data-wftag="option" value="Yes">Yes</i><i data-wftag="option" value="No">No</i></i><i data-wftag="button" class="form-input is-panel select-toggle" type="button" data-select-toggle="true"><div class="select-value" data-select-value="true">Neutered or Spayed</div><i class="select-icon ri-arrow-down-s-line" aria-hidden="true"></i></i><div class="select-list" data-select-list="true"></div></div></div><div class="form-cell is-full"><i data-wftag="input" class="form-input is-panel" type="text" maxlength="256" name="Microchip-Number" data-name="Microchip Number" placeholder="Microchip Number (optional)" aria-label="Microchip Number (optional)" id="registration-parliament-Microchip-Number"></i></div><div class="form-cell is-full"><div class="form-grid"><div class="form-cell"><div class="select" data-select="true"><i data-wftag="select" class="select-native" id="registration-parliament-Do-you-have-insurance" name="Do-you-have-insurance" data-name="Do you have insurance?" aria-label="Do you have insurance?" required="required"><i data-wftag="option" value="">Do you have insurance?</i><i data-wftag="option" value="Yes">Yes</i><i data-wftag="option" value="No">No</i></i><i data-wftag="button" class="form-input is-panel select-toggle" type="button" data-select-toggle="true"><div class="select-value" data-select-value="true">Do you have insurance?</div><i class="select-icon ri-arrow-down-s-line" aria-hidden="true"></i></i><div class="select-list" data-select-list="true"></div></div></div><div class="form-cell"><i data-wftag="input" class="form-input is-panel" type="text" maxlength="256" name="Insurance-Provider" data-name="Insurance Provider" placeholder="(If Yes) Insurance Provider" aria-label="Insurance Provider" id="registration-parliament-Insurance-Provider"></i></div><div class="form-cell is-full"><i data-wftag="input" class="form-input is-panel" type="text" maxlength="256" name="Insurance-Policy-Number" data-name="Insurance Policy Number" placeholder="(If Yes) Insurance Policy Number" aria-label="Insurance Policy Number" id="registration-parliament-Insurance-Policy-Number"></i></div></div></div><div class="form-cell is-full"><i data-wftag="input" class="form-input is-panel" type="text" maxlength="256" name="Any-Medical-Information-optional" data-name="Any Medical Information (optional)" placeholder="Any Medical Information (optional)" aria-label="Any Medical Information (optional)" id="registration-parliament-Any-Medical-Information-optional"></i></div><div class="form-cell is-full"><div class="form-grid is-labelled"><i data-wftag="label" class="form-row-label" for="registration-parliament-Pet-s-Date-of-Birth">Pet’s Date of Birth *</i><div class="form-cell"><div class="date" data-date="true" data-date-max="today"><i data-wftag="input" class="form-input is-panel date-input" type="text" maxlength="256" id="registration-parliament-Pet-s-Date-of-Birth" name="Pet-s-Date-of-Birth" data-name="Pet's Date of Birth" placeholder="yyyy-mm-dd" readonly="readonly" data-date-input="true" required="required"></i><i class="date-icon ri-calendar-line" aria-hidden="true"></i><div class="datepicker" data-date-panel="true"></div></div></div></div></div><div class="form-cell is-full"><div class="select" data-select="true"><i data-wftag="select" class="select-native" id="registration-parliament-Other-Pets-in-the-household" name="Other-Pets-in-the-household" data-name="Other Pets in the household?" aria-label="Other Pets in the household? (optional)"><i data-wftag="option" value="">Other Pets in the household? (optional)</i><i data-wftag="option" value="Yes">Yes</i><i data-wftag="option" value="No">No</i></i><i data-wftag="button" class="form-input is-panel select-toggle" type="button" data-select-toggle="true"><div class="select-value" data-select-value="true">Other Pets in the household? (optional)</div><i class="select-icon ri-arrow-down-s-line" aria-hidden="true"></i></i><div class="select-list" data-select-list="true"></div></div></div></div></div>
  <div class="form-group"><div class="form-group-label">Appointment *</div><div class="form-grid"><div class="form-cell is-full"><div class="select" data-select="true"><i data-wftag="select" class="select-native" id="registration-parliament-Reason-for-Visit" name="Reason-for-Visit" data-name="Reason for Visit" aria-label="Reason for Visit (Optional)"><i data-wftag="option" value="">Reason for Visit (Optional)</i><i data-wftag="option" value="Vaccinations">Vaccinations</i><i data-wftag="option" value="Diagnostic">Diagnostic</i><i data-wftag="option" value="Wellness care">Wellness care</i><i data-wftag="option" value="Surgery">Surgery</i><i data-wftag="option" value="Spay and neuter services">Spay and neuter services</i><i data-wftag="option" value="Dental Care">Dental Care</i><i data-wftag="option" value="Nutrition counseling">Nutrition counseling</i><i data-wftag="option" value="Microchipping">Microchipping</i><i data-wftag="option" value="End-of-Life Care">End-of-Life Care</i><i data-wftag="option" value="Parasite prevention">Parasite prevention</i><i data-wftag="option" value="Allergy testing">Allergy testing</i><i data-wftag="option" value="Rehabilitation services">Rehabilitation services</i><i data-wftag="option" value="Preventive care">Preventive care</i><i data-wftag="option" value="Emergency care">Emergency care</i><i data-wftag="option" value="Surgical procedures">Surgical procedures</i><i data-wftag="option" value="Pharmacy">Pharmacy</i></i><i data-wftag="button" class="form-input is-panel select-toggle" type="button" data-select-toggle="true"><div class="select-value" data-select-value="true">Reason for Visit (Optional)</div><i class="select-icon ri-arrow-down-s-line" aria-hidden="true"></i></i><div class="select-list" data-select-list="true"></div></div></div><div class="form-cell is-full"><div class="form-grid is-labelled"><i data-wftag="label" class="form-row-label" for="registration-parliament-Appointment-Date">Choose a Date of Visit *</i><div class="form-cell"><div class="date" data-date="true" data-date-min="today"><i data-wftag="input" class="form-input is-panel date-input" type="text" maxlength="256" id="registration-parliament-Appointment-Date" name="Appointment-Date" data-name="Appointment Date" placeholder="yyyy-mm-dd" readonly="readonly" data-date-input="true"></i><i class="date-icon ri-calendar-line" aria-hidden="true"></i><div class="datepicker" data-date-panel="true"></div></div><i data-wftag="label" class="form-check"><i data-wftag="input" class="form-check-input" type="checkbox" id="registration-parliament-No-Date-of-Visit" name="No-Date-of-Visit" data-name="No Date of Visit"></i><div>N/A</div></i></div></div></div></div></div>
  <div class="form-actions"><i data-wftag="input" class="form-submit" type="submit" value="Send Message" data-wait="Please wait..."></i></div>
</form>
```

#### Success message (import into the Form Block's Success element, per page)

Webflow's Form Block brings its own Success (`w-form-done`) and Error
(`w-form-fail`) elements. Delete their default text, give Success the
classes **Form Message › Form Success** and Error **Form Message › Is
Error**, then import this into Success (one action):

North York:

```html
<div class="form-success-panel"><div class="form-success-head"><h3 class="form-success-title is-capitalized">We received your registration form!</h3><p class="form-success-lead">Please call, text, or email us after submitting this form to book your appointment. Our team will not contact you automatically.</p></div><div class="form-success-box is-accent"><div class="form-success-box-icon"><i class="form-success-box-glyph ri-checkbox-circle-line" aria-hidden="true"></i></div><div class="form-success-box-text"><div class="form-success-box-title is-accent">YOU ARE NOT BOOKED YET, CONTACT US TO BOOK YOUR APPOINTMENT</div><p class="form-success-box-body">Please <strong>call, text, or email us after submitting this form</strong> to book your appointment.</p><a class="form-success-call" href="tel:+14165467493"><i class="form-success-call-icon ri-phone-line" aria-hidden="true"></i><span class="form-success-call-text">Call or text (416) 546-7493</span></a></div></div><div class="form-success-box"><div class="form-success-box-icon"><i class="form-success-box-glyph ri-map-pin-2-line" aria-hidden="true"></i></div><div class="form-success-box-text"><div class="form-success-box-title is-upper">Toronto North LOCATION - North York</div><a class="form-success-box-link" href="https://share.google/ulI7h2uVlY2PpVva0" target="_blank" rel="noopener"><i class="form-success-box-link-icon ri-map-pin-2-fill" aria-hidden="true"></i><span class="form-success-box-link-text">223 Sheppard Ave W, North York, ON M2N 1N2</span></a></div></div></div><div class="form-success-next"><div class="form-success-next-title">What happens next</div><div class="form-success-step"><div class="form-success-step-icon"><i class="form-success-step-glyph ri-phone-line" aria-hidden="true"></i></div><div class="form-success-step-text"><div class="form-success-step-title">CALL, TEXT, OR EMAIL US</div><p class="form-success-step-body">Call, text, or email our team to let us know you’ve completed the registration form and would like to book or confirm an appointment.</p></div></div><div class="form-success-step"><div class="form-success-step-icon"><i class="form-success-step-glyph ri-question-answer-line" aria-hidden="true"></i></div><div class="form-success-step-text"><div class="form-success-step-title">WE’LL REVIEW THE DETAILS WITH YOU</div><p class="form-success-step-body">Our team will discuss your pet’s needs, answer your questions, and help find an appropriate appointment time on the call.</p></div></div><div class="form-success-step"><div class="form-success-step-icon"><i class="form-success-step-glyph ri-calendar-check-line" aria-hidden="true"></i></div><div class="form-success-step-text"><div class="form-success-step-title">WE CONFIRM YOUR APPOINTMENT</div><p class="form-success-step-body">Your appointment is only booked once a TVS Hospitals team member confirms the date and time with you.</p></div></div></div>
```

Parliament:

```html
<div class="form-success-panel"><div class="form-success-head"><h3 class="form-success-title is-capitalized">We received your registration form!</h3><p class="form-success-lead">Please call, text, or email us after submitting this form to book your appointment. Our team will not contact you automatically.</p></div><div class="form-success-box is-accent"><div class="form-success-box-icon"><i class="form-success-box-glyph ri-checkbox-circle-line" aria-hidden="true"></i></div><div class="form-success-box-text"><div class="form-success-box-title is-accent">YOU ARE NOT BOOKED YET, CONTACT US TO BOOK YOUR APPOINTMENT</div><p class="form-success-box-body">Please <strong>call, text, or email us after submitting this form</strong> to book your appointment.</p><a class="form-success-call" href="tel:+16473473300"><i class="form-success-call-icon ri-phone-line" aria-hidden="true"></i><span class="form-success-call-text">Call or text (647) 347-3300</span></a></div></div><div class="form-success-box"><div class="form-success-box-icon"><i class="form-success-box-glyph ri-map-pin-2-line" aria-hidden="true"></i></div><div class="form-success-box-text"><div class="form-success-box-title is-upper">Parliament LOCATION - Downtown Toronto</div><a class="form-success-box-link" href="https://www.google.com/maps/dir/?api=1&amp;destination=584+Parliament+St,+Toronto,+ON+M4X+1P8" target="_blank" rel="noopener"><i class="form-success-box-link-icon ri-map-pin-2-fill" aria-hidden="true"></i><span class="form-success-box-link-text">584 Parliament St, Toronto, ON M4X 1P8</span></a></div></div></div><div class="form-success-next"><div class="form-success-next-title">What happens next</div><div class="form-success-step"><div class="form-success-step-icon"><i class="form-success-step-glyph ri-phone-line" aria-hidden="true"></i></div><div class="form-success-step-text"><div class="form-success-step-title">CALL, TEXT, OR EMAIL US</div><p class="form-success-step-body">Call, text, or email our team to let us know you’ve completed the registration form and would like to book or confirm an appointment.</p></div></div><div class="form-success-step"><div class="form-success-step-icon"><i class="form-success-step-glyph ri-question-answer-line" aria-hidden="true"></i></div><div class="form-success-step-text"><div class="form-success-step-title">WE’LL REVIEW THE DETAILS WITH YOU</div><p class="form-success-step-body">Our team will discuss your pet’s needs, answer your questions, and help find an appropriate appointment time on the call.</p></div></div><div class="form-success-step"><div class="form-success-step-icon"><i class="form-success-step-glyph ri-calendar-check-line" aria-hidden="true"></i></div><div class="form-success-step-text"><div class="form-success-step-title">WE CONFIRM YOUR APPOINTMENT</div><p class="form-success-step-body">Your appointment is only booked once a TVS Hospitals team member confirms the date and time with you.</p></div></div></div>
```

Error text (both): set the Error element's text block to
`Oops! Something went wrong while submitting the form.` (live).

### 2.4 After the import: restore the tags

1. Move classes: the importer puts `clinic-form-body` on the FormWrapper.
   Set the wrapper's class to **Clinic Form**, the inner FormForm's to
   **Clinic Form Body** (lessons 2026-10-05).
2. On the FormForm set the form name / `data-name` to
   `Registration - North York` (or `- Parliament`) and the element id
   `wf-form-Registration---North-York` (or `---Parliament`). If the API
   won't, TBD-REG-3.
3. Query the page for `attribute_name: data-wftag`. For each element:
   `set_tag` to its `data-wftag` value, then `remove_attribute data-wftag`.
   Work inside out is not needed (tags are independent), but re-query
   after "Element not found" (ids change under concurrent edits).
4. Count per form (both forms identical):

   | Tag | Count | Detail |
   | --- | --- | --- |
   | input | 20 | text 15, email 1, tel 2, checkbox 1, submit 1 |
   | select | 7 | Province, Type of Pet, Pet's Gender, Neutered or Spayed, Do you have insurance?, Other Pets in the household?, Reason for Visit |
   | option | 43 | 11 + 3 + 3 + 3 + 3 + 3 + 17 (first option of each has `value=""`) |
   | button | 7 | one select toggle per select, `type="button"` |
   | label | 3 | 2 row labels (`for` = the date input ids), 1 Form Check wrapping the N/A checkbox |
   | `data-wftag` left | 0 | |
   | named fields | 26 | 19 inputs + 7 selects, the live form's 26 fields |
   | `required` | 16 | |

   Per page that is 80 `set_tag` calls; budget the batches (5 actions per
   call where the tool limits it).
5. Read back on the published page (§7): the importer is known to drop
   `for`, `checked` and `name` on imported Webflow form fields (lessons
   2026-10-29, 2026-10-06). On DOM stand-ins these are plain attributes
   and should survive; where one is missing, `set_attributes` it.

## 3. Module hooks

Both modules run on every page from the bundle; nothing to install per
page.

**select** (`src/modules/select.ts`): root `div.select[data-select]`
holding the hidden native `select.select-native` (it carries `name`,
`data-name`, `required` and the options, so Webflow submits it), the
toggle `button.form-input.is-panel.select-toggle[data-select-toggle]
type=button` with `div.select-value[data-select-value]` and the
`i.select-icon.ri-arrow-down-s-line`, and the list
`div.select-list[data-select-list]` (filled by the module, opened as a
top-layer popover). The toggle's placeholder colour is the js-state combo
Select Toggle › Is Placeholder (exists). The first `<option>` must keep
`value=""`, or the required check passes on the placeholder text and the
toggle never shows its placeholder state.

**date-picker** (`src/modules/date-picker.ts`, after the port in §0.1):
root `div.date[data-date]` with `data-date-max="today"` (Pet's Date of
Birth, no future dates) or `data-date-min="today"` (Appointment Date, no
past dates); input `input.form-input.is-panel.date-input[data-date-input]`
`readonly`, placeholder `yyyy-mm-dd`; icon `i.date-icon.ri-calendar-line`;
panel `div.datepicker[data-date-panel]`. Value written `yyyy-mm-dd`
(live: flatpickr "Y-m-d"). Pet's Date of Birth is `required`;
Appointment Date is not (the N/A checkbox "No Date of Visit" sits next to
it, as live).

Also running: `unique-form-ids` (no effect here: ids are already unique
per form), `focus-modality` (keyboard focus ring on `.form-input`).

## 4. Form settings per form

Read 2026-11-13 from `webflow-tvs-live` (`list_forms`, read only) and the
published live pages.

| | North York | Parliament |
| --- | --- | --- |
| Form name (data-name) | `Registration - North York` | `Registration - Parliament` |
| Element id / name | `wf-form-Registration---North-York` | `wf-form-Registration---Parliament` |
| Method | GET (Webflow default) | GET |
| Fields | 26, as §2.3, same order as live | 26, same |
| Redirect | none (`redirectUrl` null) | none |
| Email confirmation to sender | off (`sendEmailConfirmation: false`) | off |
| Notification address | `TorontoNorth@tvshospitals.com` (HANDOFF decision 2026-11-11; the forms API does not expose it) | `Parliament@tvshospitals.com` (same) |
| Submit label / wait text | `Send Message` / `Please wait...` | same |
| Success | the panel in §2.3 (live copy, North York phone (416) 546-7493, 223 Sheppard Ave W) | the panel (647) 347-3300, 584 Parliament St, "Parliament LOCATION - Downtown Toronto" |
| Error text | `Oops! Something went wrong while submitting the form.` | same |

On live both forms sit inside a component (componentId
`01d16f2a…2e` / `3cf3882d…d6`); "Registration - Parliament" is also used
on Contact and the Parliament location page. Here each registration page
holds its own Form Block, as the prototype does; if the build later makes
the clinic forms components, these pages take instances instead.

Live field types to match in the Forms list: Phone and Emergency Contact /
Phone are Phone, Email Address is Email, No Date of Visit is Checkbox,
the seven selects are Select, the rest Plain.

## 5. Page settings

| | North York | Parliament |
| --- | --- | --- |
| Page title | North York Registration | Parliament Registration |
| Slug | `north-york-registration` | `parliament-registration` |
| Folder | root | root |
| SEO title | `North York Registration` (live; no description on live) | `Register Your Pet \| Parliament Animal Hospital Toronto` |
| Meta description | — (none on live; keep none) | `New client registration for Parliament Animal Hospital in Cabbagetown, Toronto. Tell us about your pet before your first visit so we can prepare.` |
| Open Graph | title and description copied from SEO (live: both copied) | same |
| Head code (`set_page_freeform_code`, read the block first) | `<meta name="robots" content="noindex">` | same |

Live publishes noindex on both (`<meta content="noindex" name="robots">`;
North York also has a second one from its head code). Sitemap and
site-search exclusion: TBD-REG-2.

## 6. Manual Designer steps (new MANUAL-TODO rows)

Letters are TBD: the builder assigns the next free letters (after S on
2026-11-13, unless another pack took them).

| ID | Where (page › element or class) | Breakpoint | Set | Why the API can't | Done |
| --- | --- | --- | --- | --- | --- |
| TBD-REG-1 | North York Registration, Parliament Registration › G \| Page W › Slot | — | Drag the imported section into G \| Page W's main slot (as K on Home) | The API can't start a slot's content (row K) | ☐ |
| TBD-REG-2 | Both pages › Page settings | — | Exclude from site search and from the sitemap (live: noindex). Head-code noindex is done by API | No API for search/sitemap exclusion; sitemap setting needs a paid site plan | ☐ |
| TBD-REG-3 | Both pages › Form Block › Form settings | — | Notification email: North York `TorontoNorth@tvshospitals.com`, Parliament `Parliament@tvshospitals.com`; form name as §4 if the API didn't take it; check no redirect | Form notification settings have no API | ☐ |
| TBD-REG-4 | Both pages › Form Block › Success and Error states | — | Check each state in the Designer (Form Block › State): success panel spacing (Next 32 below the panel), left-aligned text, no grey box; error box | States are only visible in the Designer; a real submit needs Turnstile | ☐ |
| TBD-REG-5 | Form Success Box Link › text-decoration colour / underline offset (base and hover) | Desktop | Only if the Designer has no field for them: keep them as a `designer-cant` repo rule instead (ask the person) | Possibly no Designer field | ☐ |

## 7. Check list for the builder

After import and publish to staging, on both pages at 1440, 991, 767,
479 (compare with `http://localhost:5955/<slug>/`):

1. No `data-wftag` attribute left; tag counts as §2.4 in the published
   HTML (`grep -c` on the page source).
2. 26 named controls; names and data-names equal the partial (diff the
   published form's `name`/`data-name` list against
   `prototype/partials/forms/registration-*.html`); 16 `required`.
3. Every first `<option>` has `value=""`; the select toggles show the
   placeholder colour and open the list; selecting writes the native
   select.
4. Pet's Date of Birth refuses future dates, Appointment Date past dates;
   both write `yyyy-mm-dd` (needs §0.1 on staging).
5. The two row labels have `for` pointing at the date input ids; clicking
   "N/A" toggles the checkbox; label text isn't bold (webflow.css
   `label` default) and has no 5px bottom margin (check Form Check too:
   if it lacks `margin-bottom: 0` and a normal weight, add them).
6. Classes on every element (no lost class lists): spot-check the cells,
   the select toggles (`form-input is-panel select-toggle`) and the date
   inputs (`form-input is-panel date-input`).
7. The Form Block wrapper has Clinic Form (no 15px gap under it), the
   FormForm Clinic Form Body; the form is 768px wide (48em) and centred.
8. H1 reads "Registration Form" then the blue sub-line on its own line,
   with a space between them in the published HTML.
9. **Submit one test entry per form on staging in a real browser** (Turnstile)
   and confirm, read-only, that the submission lists all 26 fields with
   their data-names, and the notification email arrives at the clinic
   address (ask the person). If the DOM fields are not stored, stop and
   report: the fallback is native Webflow form fields with the classes
   added in the Designer.
10. Success state (force it in the Designer, or after the test submit):
    navy panel, yellow-bordered "not booked yet" box with the call button
    (`tel:+14165467493` / `tel:+16473473300`), clinic box with the map link
    (North York `https://share.google/ulI7h2uVlY2PpVva0`, Parliament the
    Google Maps directions URL), "What happens next" with three yellow
    steps, 32px below the panel; title capitalised, clinic line uppercase.
11. Page head has `<meta name="robots" content="noindex">`; SEO title and
    description as §5.
12. Nav and footer present (G | Page W), skip link reaches `#main`.
13. Remove any `data-manual-todo` markers when TBD rows are done.
