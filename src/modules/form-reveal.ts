// Form reveal: on phones a long form starts closed under a header button
// and opens in place ("Fill in the form").
//
// Markup: data-form-reveal on the wrapper (give it an id), inside it a
// button data-form-reveal-toggle (a button, not a link: smooth scrolling
// would jump to a link's target) and the form in data-form-reveal-panel.
// Optional data-form-reveal-below="991" (px; default 991): wider screens
// always show the open form and no toggle.
// The wrapper gets data-form-reveal-ready while the module is in charge
// (the CSS shows the toggle only then), and .is-open when open. Any link
// to #<wrapper id> (the sticky bar, the hero button) opens it and scrolls
// there. Without JavaScript, in the Designer and on desktop the form is
// simply open.
export function initFormReveal() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll<HTMLElement>('[data-form-reveal]').forEach((root, n) => {
    const toggle = root.querySelector<HTMLElement>('[data-form-reveal-toggle]');
    const panel = root.querySelector<HTMLElement>('[data-form-reveal-panel]');
    if (!toggle || !panel) return;
    const mq = window.matchMedia(`(max-width: ${Number(root.dataset.formRevealBelow) || 991}px)`);
    panel.id ||= `form-reveal-${n}`;
    toggle.setAttribute('aria-controls', panel.id);

    const set = (open: boolean, animate: boolean) => {
      root.classList.toggle('is-open', open);
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
      panel.addEventListener('transitionend', () => { if (root.classList.contains('is-open')) panel.style.height = 'auto'; }, { once: true });
    };

    const apply = () => {
      if (mq.matches) {
        root.setAttribute('data-form-reveal-ready', '');
        panel.style.overflow = 'hidden';
        set(root.classList.contains('is-open'), false);
      } else {
        root.removeAttribute('data-form-reveal-ready');
        panel.style.removeProperty('height');
        panel.style.removeProperty('overflow');
        toggle.removeAttribute('aria-expanded');
      }
    };
    apply();
    mq.addEventListener('change', apply);

    toggle.addEventListener('click', (e) => {
      if (!mq.matches) return;
      e.preventDefault();
      const open = !root.classList.contains('is-open');
      set(open, true);
    });
    if (root.id) {
      document.addEventListener('click', (e) => {
        const link = (e.target as Element).closest?.(`a[href="#${root.id}"]`);
        if (link && mq.matches && !root.classList.contains('is-open')) set(true, true);
      });
    }
  });
}
