// Sticky call-to-action bar (landing pages, below 992px).
//
// Markup: <div data-sticky-cta data-sticky-cta-after="#hero"
//              data-sticky-cta-hide="#request">…</div>
// The bar gets .is-visible while the element named by data-sticky-cta-after
// is fully scrolled past AND the element named by data-sticky-cta-hide is
// not on screen (the form itself is the call to action there). Both
// attributes are optional; hidden, the bar is also inert (out of the Tab
// order).
// Without JavaScript the bar stays hidden; the nav's Call and Text remain.
export function initStickyCta() {
  document.querySelectorAll<HTMLElement>('[data-sticky-cta]').forEach((bar) => {
    const after = bar.dataset.stickyCtaAfter ? document.querySelector<HTMLElement>(bar.dataset.stickyCtaAfter) : null;
    const hide = bar.dataset.stickyCtaHide ? document.querySelector<HTMLElement>(bar.dataset.stickyCtaHide) : null;
    let pastAfter = !after;
    let hideInView = false;
    const update = () => {
      const on = pastAfter && !hideInView;
      bar.classList.toggle('is-visible', on);
      bar.toggleAttribute('inert', !on);
    };
    if (after) {
      new IntersectionObserver(([entry]) => {
        pastAfter = !entry.isIntersecting && entry.boundingClientRect.top < 0;
        update();
      }).observe(after);
    }
    if (hide) {
      new IntersectionObserver(([entry]) => {
        hideInView = entry.isIntersecting;
        update();
      }, { threshold: 0.15 }).observe(hide);
    }
    update();
  });
}
