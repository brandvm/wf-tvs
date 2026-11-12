# Third-party notices

wf-template is MIT-0 (`LICENSE`). These parts come from others and keep
their own licences. Keep this file in every repo made from the template:
the build tooling still contains code from the Finsweet starter.

## Finsweet developer-starter

wf-template began as a copy of Finsweet's Webflow custom code starter,
<https://github.com/finsweet/developer-starter>, released under the ISC
licence (declared in its `package.json`).

```
ISC License

Copyright (c) Finsweet

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
```

## Bundled files with their own licence

| Part | Licence | Where |
| --- | --- | --- |
| Remix Icon (icon font, package `remixicon`, bundled by `pnpm build`) | Apache 2.0 | `node_modules/remixicon/License` |
| Phosphor Icons (icon font; kept as source for the template tooling, not bundled on this site: `src/phosphor.css` is the empty stub from `pnpm phosphor none`) | MIT | `src/phosphor/LICENSE` |
| Geist font (prototype starter) | SIL Open Font License 1.1 | `.claude/skills/webflow-prototype/prototype-starter/public/fonts/Geist-OFL.txt` |
| Webflow's default stylesheet, kept for reference only (never linked or bundled); its first part is normalize.css v3 | Webflow's own output, not covered by MIT-0; normalize.css is MIT | `.claude/skills/webflow-build/reference/webflow-default.css` |

npm packages installed with `pnpm install` (Finsweet Attributes and the
rest) are not copied into this repo; each carries its own licence in
`node_modules/`.
