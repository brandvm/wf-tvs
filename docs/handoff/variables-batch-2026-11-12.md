# Variable batch for Webflow — 2026-11-12

From `prototype/src/css/proposed.css` (P1–P22), checked against a fresh
read of site `6af4e2d97d259cb3efb2af71` on 2026-11-12: every existing value
is still the starter's, so each line below is old → new as written.
Breakpoint values are Base / Tablet (991) / Mobile Landscape (767) /
Mobile (479). "NEW" = the variable doesn't exist yet. New variables land
at the end of their group (the API can't reorder; drag in the Designer if
the order matters).

Each group is one approval. Nothing is written until the person says go.

## V1 · Colors (P1, P2, P18, P22)

Changed
- Brand/Ink `#111111` → `#080829` (navy)
- Brand/Accent `#2f5bff` → `#1c1ce6` (blue)
- Ink Tint/Ink 4, 12, 24, 48, 64: `#111111` + alpha → `#080829` + the same alpha

NEW
- Brand/Yellow `#ffdd21`
- Neutral/Mist `#f9f9fb`, Neutral/Sand `#e6e1d6`, Neutral/Slate `#6b6b7f`
- Blue Tint/Blue 8 `#eef0fe`, Blue Tint/Blue 16 `#dde2fc`
- Service Tint/Green `#f2f9ef`, Pink `#ffedf9`, Yellow `#fffbed`, Violet `#f4edfe`, Sky `#eff4f9`
- Yellow Tint/Yellow 20 `#ffdd2133`
- Paper Tint/Paper 8 `#ffffff14`, Paper Tint/Paper 85 `#ffffffd9`
- Ink Tint/Ink 90 `#080829e6`

## V2 · Typography Scale (P5, P6, P19, P22)

Changed
- Family/Base Geist → Hanken Grotesk
- Letter Spacing/Tight −0.02em → −0.03em

NEW
- Family/Body: Instrument Sans
- Size/10 0.625em, Size/13 0.8125em, Size/15 0.9375em, Size/22 1.375em,
  Size/28 1.75em, Size/44 2.75em, Size/56 3.5em
- Line Height/Display 1.04, Line Height/Compact 1.3,
  Line Height/Comfortable 1.6, Line Height/Relaxed 1.7
- Letter Spacing/Snug −0.01em

Font files: Hanken Grotesk is in `Assets/fonts/hanken-grotesk/`; Instrument
Sans has no files yet (Google stand-in in the prototype). Until both are
uploaded in Site settings › Fonts, the variables point at fonts the site
doesn't have and text falls back to sans-serif.

## V3 · Typography Role (P7, P8, P19)

Sizes, Base / Tablet / Mobile L / Mobile (old in brackets)
- Size/Display 64 / 56 / 48 / 40  (96 / 80 / 64 / 48)
- Size/H1 56 / 48 / 40 / 40  (80 / 64 / 48 / 40)
- Size/H2 44 / 40 / 32 / 32  (64 / 48 / 40 / 32)
- Size/H3 28 / 28 / 24 / 24  (48 / 40 / 32 / 24)
- Size/H4 24 / 24 / 20 / 20  (32 / 24 / 24 / 20)
- Size/H5 20 / 20 / 18 / 18  (24 / 20 / 20 / 18)
- Size/H6 18 / 18 / 16 / 16  (20 / 18 / 18 / 16)
- Size/Label 12 → 13, Size/Button 16 → 15 (all breakpoints)

All breakpoints
- Weight/Display, H1, H2 Bold → Semibold; Weight/H3 Medium → Semibold
- Letter Spacing/H3, H4 Normal → Snug
- Family/Body, Body Large, Body Small: Family/Base → Family/Body
- Line Height/Body Normal 1.5 → Relaxed 1.7
- Line Height/Display, H1 Tight 1.1 → Display 1.04

## V4 · Colors Semantic (P3, P4, P11, P21)

Base mode
- Background/Surface Ink 4 → Neutral/Mist
- Text/Secondary Ink 64 → Neutral/Slate
- Button/Background Ink → Brand/Accent
- Button/Background Hover Accent → Brand/Ink

Dark mode
- Button/Background Paper → Brand/Yellow
- Button/Background Hover Accent → Brand/Paper
- Text/Accent, Link/Hover, Form/Focus Accent → Brand/Yellow

NEW Border/Strong: Base Ink 24, Dark Paper 24

NEW mode Photo (made without a breakpoint; the combo Is Photo sets it):
Background/Page Ink · Surface Paper 12 · Overlay Ink 64 · Text/Primary
Paper · Text/Secondary Paper 64 · Text/Accent Yellow · Border/Subtle
Paper 12 · Border/Strong Paper 24 · Button/Background Accent · Button/Text
Paper · Button/Background Hover Ink · Form/Focus Yellow · Link/Hover
Yellow · Status/* the On Dark colours (as in Dark).

## V5 · Spacing, Radius, Effects (P10, P22)

NEW Spacing: 6 0.375em, 10 0.625em, 20 1.25em, 28 1.75em, 40 2.5em,
56 3.5em, 80 5em
NEW Radius: 12 0.75em, 16 1em, 20 1.25em, 24 1.5em
NEW collection Effects: Disabled Opacity 0.4 (Number), Blur/Light 0.25em,
Blur/Medium 0.875em, Blur/Strong 2.25em

## V6 · Layout (P9, P20, P22)

Changed (Base / Tablet / Mobile L / Mobile; old in brackets)
- Section/Padding V 7.5 / 5 / 4 / 3.5em  (8 / 6 / 5 / 4)
- Section/Padding H 7.5 / 2.5 / 1.5 / 1.25em  (4 / 3 / 2 / 1.25)
- Nav/Padding H 7.5 / 2.5 / 1.5 / 1.25em  (4 / 3 / 2 / 1.25)
- Container/Max Width 75em everywhere  (90)
- Nav/Height 5.125 / 4.5 / 4 / 4em  (5 / 4.5 / 4 / 4)

NEW, one value everywhere unless four are given
- Button/Text Height 3.2em, Button/Text Height Small 2.4em, Button/Well Size 2.4em
- Top Bar/Height 2.5625em
- Nav/Logo Height 3.125 / 2.75 / 2.75 / 2.5em
- Nav Callout/Width 22.5em
- Phone Well/Size 2.25em, Icon Well/Size 3.25em, Service Icon/Size 2.375em
- Avatar/Size 2em, Rating/Height 0.875em, Check/Size 1.125em, Eyebrow/Dot Size 0.5em
- Clinic Card/Image Height 9em, Call Chooser/Width 24em
- Select/List Height 17em, Date Picker/Width 19em
- Footer/Logo Height 3em, Footer/Badge Size 4.5em, Footer/Brand Width 17.5em,
  Footer/Column Width 15.625em
- CTA/Copy Width 50em, Section Head/Width 47.5em
- Gallery/Item Width 18.75 / 15 / 15 / 12em
- Gallery/Item Height 20 / 16 / 16 / 13em
- Gallery/Item Height Short 17.5 / 14 / 14 / 11.5em
- Hero/Bar Height 4.5 / 4.5 / 3.75 / 3.75em
- Hero/Divider Height 3 / 3 / 2.25 / 2.25em
- Hero/Photo Width 112.15% / 100% / 100% / 100% (a Percentage variable)
- Hero/Photo Height `calc(100% − Hero/Bar Height)` on Base / Tablet / Mobile L,
  30em on Mobile. The calc is a custom value: tried through the API's
  custom route; if refused, a Designer step (MANUAL-TODO).
- Hero/Copy Offset 7.5 / 17 / 15 / 19em
- Hero/Title Width 36em, Hero/Lead Width 29.25em

V6b · home sections (homepage prototype finished 2026-11-12; re-read then)
- Services Banner/Dog Width 12em
- About/Photo Height 36.8125 / 28 / 22 / 16em
- About/Panel Offset 20.9375 / 16 / 12 / 9em
- About/Heading Width 31.625em, About/Collage Width 27.5em
- FAQ/Head Width 23.75em, FAQ/List Width 45em, FAQ/Answer Width 37.5em
- Review Card/Width 24 / 24 / 20 / 17.5em

Checked: every variable that `new-classes*.css` reads is either in the
Webflow snapshot or in this batch.

## Not variables (step 2, with the classes)

P12 Form Input, P13 Form, P14 Chip, P15 Button Color Secondary, P16
G | Nav W, P17 G | Footer W, P20 Button Size bindings, and the Body tag
style's Layout mode at Tablet / Mobile L / Mobile.
