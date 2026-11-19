# Build notes

What the build handoff needs (see the skill's `checklists.md` › Build
handoff). Kept current during the build, not written at the end. No
credentials here: name the vault entry instead.

## CMS notes

How to edit what: each collection and its fields, which sections are
conditional on which field, and each component's props.

| Collection / component | How to edit | Notes |
| --- | --- | --- |
| | | |

## Integrations

| Service | What it does | Where it's configured | Vault entry |
| --- | --- | --- | --- |
| | | | |

## Changes log

Changes made during the build that differ from the approved design, and
who approved them.

- <Date> · <change> · <approved by>

## Redirect map

Every old URL → its closest new page, from the crawl saved in discovery.

| Old URL | New URL | Status |
| --- | --- | --- |
| | | 301 |

## Conversion pass (2026-11-19)

Landing pages, Contact and Services, worked on before launch. Re-check this
list in the pre-launch QA.

### Built in the prototype, now in Webflow (2026-11-19)

Published to staging 2026-11-19; the modules (`sticky-cta`, `form-reveal`,
`contact-tabs`) work once the repo is pushed. The Landing Action Bar's
shadow is a literal (`0 0.75em 2em rgba(8,8,41,.24)`): a shadow with
variables is a Designer step (as MANUAL-TODO E). Contact's open status reads
hidden rows bound to Hours 1/2 time and days (class Location Status Hours).


- [x] Landing pages (`/north-york-vet`, `/parliament-vet`,
  `/north-york-pet-dental`): a live open-status pill under the lead
  (module `open-hours`); classes Landing Hero Actions, Landing Status
  (+ Dot, Text).
- [x] Landing hero layout "option C" (the person, 2026-11-19): Location
  Main removed; the head, status, proof, services and the form sit directly
  in Landing Hero Inner, now a grid (desktop: copy in column 1 rows 2–5,
  form in column 2 across all rows; below 992px one column: head, status,
  form, proof, services). Below 992px the badge (combo Landing Hero Badge)
  and the lead hide, and the form starts closed under a card "Request an
  appointment" with a "Fill in the form +" button that opens it in place
  (module `form-reveal`, new, port to the repo; `data-form-reveal` on the
  aside). Classes Landing Form Toggle (+ Text, Title, Lead, Button, Label,
  Well, Icon), Landing Form Panel; repo CSS for the open/closed states.
- [x] Landing pages: Action Bar inside G | Nav Landing: Call, Text,
  Request a visit, fixed to the bottom below 992px; module `sticky-cta`
  (new, port to the repo); classes Landing Action Bar, Landing Action
  (Is Primary), Landing Action Icon/Text; repo CSS for `.is-visible`, the
  footer clearance (`:has()`) and the iPhone safe area.
- [x] Landing pages: CTA button "Get in Touch" → "Request a visit", link
  `#request` (the form), not `#hero`.
- [x] Contact: live open status under each clinic name (Location Status
  classes, module `open-hours`, hours from the Locations CMS).
- [x] Contact: "Pet sick or hurt today?" box with Call / Text (Call
  Chooser) above the location switch; classes Contact Urgent (+ Text,
  Title, Lead, Action).
- [x] Contact: the clinic form is chosen from `?clinic=north-york|parliament`
  or from the page the visitor came from (`data-contact-tab-match`);
  `contact-tabs` module updated, port to the repo.

### Still to do before launch

- [ ] **Tracking (do first):** GTM `dataLayer` events for call clicks, text
  clicks, Call Chooser opens, each form submit (form name + clinic),
  Get directions clicks; check with `pnpm wf:tracking`.
- [ ] Services template: sticky mobile action bar (Call / Text, Book) and a
  CTA after "How we can help" (today the main CTA is only at the end).
- [ ] Services template and Locations: live open status on the phone cards.
- [ ] `FAQPage` structured data from the FAQ lists (services, locations,
  landing pages).
- [ ] Landing pages: the form in two steps (same fields, layout only), only
  if the client wants it; keep live's fields, names and order.
- [ ] Landing pages: match each H1 to its ad (ask which ads point where).
- [ ] Blog bodies: 10 more posts have inline images with `loading="auto"` (Lyme, travel certificate, tick removal, allergies, puppy checklist, wellness exam, neutering, kitten checklist, Bordetella, teeth cleaning); set `loading="lazy"` in each post's `content` (done on the spaying post). New posts: Webflow writes `auto`.
- [ ] Hide the nav's Call/Text icons while the landing action bar shows?
  (they repeat on mobile; decide after seeing it on a phone).

### Waiting on the client

- [ ] Google rating and review count to show (live says 4.8/5, 1,000+).
- [ ] Same-day appointments: can we promise them on every page?
- [ ] Reply time for forms ("we reply within …") for Contact.
- [ ] Which ads point to which landing page.

## Known issues

### Fix before launch

- <issue> · <owner>

### Fix after launch

- <issue> · <owner>
