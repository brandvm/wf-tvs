// Accordion: questions that open one at a time (the FAQ).
// Markup: data-accordion on the list; each item data-accordion-item, its
// question a button data-accordion-toggle, its answer data-accordion-panel.
// data-accordion-open on an item opens it at load. The module sets
// aria-expanded / aria-controls, .is-open on the item, and animates the
// panel's height (instant for reduced motion). Without JavaScript, in the
// Designer and for search engines every answer is visible: nothing is hidden
// by CSS until the module runs.
export function initAccordion() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll<HTMLElement>('[data-accordion]').forEach((list, l) => {
    const items = Array.from(list.querySelectorAll<HTMLElement>('[data-accordion-item]'));
    const parts = items.map((item, i) => {
      const toggle = item.querySelector<HTMLElement>('[data-accordion-toggle]')!;
      const panel = item.querySelector<HTMLElement>('[data-accordion-panel]')!;
      panel.id ||= `accordion-${l}-${i}`;
      toggle.setAttribute('aria-controls', panel.id);
      return { item, toggle, panel };
    });
    const set = (part: (typeof parts)[number], open: boolean, animate: boolean) => {
      const { item, toggle, panel } = part;
      item.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      if (!animate || reduce) {
        panel.style.height = open ? 'auto' : '0px';
        return;
      }
      const from = panel.offsetHeight;
      panel.style.height = 'auto';
      const to = open ? panel.offsetHeight : 0;
      panel.style.height = `${from}px`;
      panel.getBoundingClientRect();
      panel.style.height = `${to}px`;
      panel.addEventListener('transitionend', () => { if (item.classList.contains('is-open')) panel.style.height = 'auto'; }, { once: true });
    };
    parts.forEach((part) => {
      part.panel.style.overflow = 'hidden';
      set(part, part.item.hasAttribute('data-accordion-open'), false);
      part.toggle.addEventListener('click', () => {
        const open = !part.item.classList.contains('is-open');
        parts.forEach((other) => other !== part && other.item.classList.contains('is-open') && set(other, false, true));
        set(part, open, true);
      });
    });
  });
}
