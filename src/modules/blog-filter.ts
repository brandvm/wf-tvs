// Blog filter: topic chips, search, sort and "Show more" for a list of
// blog cards. Stands in for Finsweet Attributes (List Filter, List Sort,
// List Load) in the prototype; in Webflow the repo wires Finsweet instead
// (webflow-build skill › recipes/finsweet/), on the same markup.
// Markup (every hook is a data attribute, never a class):
//   <div data-blog-filter>                                  the scope
//     <button data-blog-filter-chip="all" aria-pressed="true">All</button>
//     <button data-blog-filter-chip="cat-care" aria-pressed="false">Cat Care</button>
//     <input type="search" data-blog-filter-search>          optional
//     <select data-blog-filter-sort>                          optional: newest | oldest | title
//     <p data-blog-filter-status aria-live="polite"></p>      the count, read out
//     <div data-blog-filter-list>
//       <a data-blog-filter-item data-category="cat-care" data-date="2026-11-03">…</a>
//     </div>
//     <p data-blog-filter-empty>No articles match…</p>        optional, shown on 0
//     <button data-blog-filter-more data-blog-filter-page="9">Show more</button>
//   </div>
// Cards that don't match, or lie past the current page, get .is-hidden.
// In Webflow each card sits in a Collection List item (.w-dyn-item): the
// module moves and hides that item, never the card alone, or the empty
// items stay behind as grid cells and open a gap above the cards.
// Without JS every card shows and the chips do nothing. No-op when absent.

export function initBlogFilter() {
  document.querySelectorAll<HTMLElement>('[data-blog-filter]').forEach((root) => {
    const list = root.querySelector<HTMLElement>('[data-blog-filter-list]');
    if (!list) return;
    const items = Array.from(list.querySelectorAll<HTMLElement>('[data-blog-filter-item]'));
    if (!items.length) return;
    const chips = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-blog-filter-chip]'));
    const search = root.querySelector<HTMLInputElement>('[data-blog-filter-search]');
    const sort = root.querySelector<HTMLSelectElement>('[data-blog-filter-sort]');
    const status = root.querySelector<HTMLElement>('[data-blog-filter-status]');
    const empty = root.querySelector<HTMLElement>('[data-blog-filter-empty]');
    const more = root.querySelector<HTMLElement>('[data-blog-filter-more]');
    const pageSize = Math.max(1, Number(more?.dataset.blogFilterPage) || items.length);

    const text = new Map(items.map((el) => [el, (el.textContent || '').replace(/\s+/g, ' ').toLowerCase()]));
    const original = items.slice();
    // The list's direct child holding each card: the card itself in the
    // prototype, its .w-dyn-item in Webflow.
    const rowOf = (el: HTMLElement) => {
      let row = el;
      while (row.parentElement && row.parentElement !== list) row = row.parentElement;
      return row;
    };
    const setHidden = (el: HTMLElement, hide: boolean) => {
      el.classList.toggle('is-hidden', hide);
      const row = rowOf(el);
      if (row !== el) row.hidden = hide;
    };
    let category = chips.find((c) => c.getAttribute('aria-pressed') === 'true')?.dataset.blogFilterChip || 'all';
    let shown = pageSize;

    const label = (slug: string) => chips.find((c) => c.dataset.blogFilterChip === slug)?.textContent?.trim() || '';

    const apply = (announce: boolean) => {
      const query = (search?.value || '').trim().toLowerCase();
      const order = sort?.value || 'newest';
      const sorted = original.slice();
      if (order === 'newest' || order === 'oldest') {
        sorted.sort((a, b) => (a.dataset.date || '').localeCompare(b.dataset.date || '') * (order === 'newest' ? -1 : 1));
      } else if (order === 'title') {
        sorted.sort((a, b) => (text.get(a) || '').localeCompare(text.get(b) || ''));
      }
      sorted.forEach((el) => list.appendChild(rowOf(el)));

      const matches = sorted.filter((el) => (category === 'all' || el.dataset.category === category) && (!query || (text.get(el) || '').includes(query)));
      const visibleSet = new Set(matches.slice(0, shown));
      sorted.forEach((el) => setHidden(el, !visibleSet.has(el)));

      const visible = Math.min(shown, matches.length);
      if (more) more.classList.toggle('is-hidden', visible >= matches.length);
      if (empty) empty.classList.toggle('is-hidden', matches.length > 0);
      if (status && announce) {
        const scope = category === 'all' ? '' : ` in ${label(category)}`;
        const term = query ? ` for “${search?.value.trim()}”` : '';
        status.textContent = matches.length
          ? `Showing ${visible} of ${matches.length} article${matches.length === 1 ? '' : 's'}${scope}${term}`
          : `No articles${scope}${term}`;
      }
    };

    chips.forEach((chip) => {
      chip.addEventListener('click', () => {
        category = chip.dataset.blogFilterChip || 'all';
        chips.forEach((c) => c.setAttribute('aria-pressed', String(c === chip)));
        shown = pageSize;
        apply(true);
      });
    });

    let timer = 0;
    search?.addEventListener('input', () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => { shown = pageSize; apply(true); }, 200);
    });
    search?.closest('form')?.addEventListener('submit', (e) => e.preventDefault());
    sort?.addEventListener('change', () => { shown = pageSize; apply(true); });

    more?.addEventListener('click', (e) => {
      e.preventDefault();
      const firstNew = shown;
      shown += pageSize;
      apply(true);
      // Move focus to the first card that just appeared, so keyboard users
      // carry on from where the new cards start.
      const visible = Array.from(list.children)
        .map((row) => items.find((el) => rowOf(el) === row))
        .filter((el): el is HTMLElement => !!el && !el.classList.contains('is-hidden'));
      const target = visible[firstNew];
      target?.focus({ preventScroll: false });
    });

    apply(false);
  });
}
