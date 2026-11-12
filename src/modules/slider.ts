// Slider: a row of cards that scrolls sideways, with previous and next
// buttons (the reviews). The row is a native scroller with scroll snap, so
// touch swipe, trackpad and keyboard scrolling all work without script; the
// module adds the buttons: each moves by one card, and a button is disabled
// at its end. Markup: data-slider on the wrapper, data-slider-track on the
// scrolling row (its children are the cards), data-slider-prev and
// data-slider-next on the buttons. Reduced motion: the jump is instant.
export function initSlider() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll<HTMLElement>('[data-slider]').forEach((slider) => {
    const track = slider.querySelector<HTMLElement>('[data-slider-track]');
    const prev = slider.querySelector<HTMLButtonElement>('[data-slider-prev]');
    const next = slider.querySelector<HTMLButtonElement>('[data-slider-next]');
    if (!track) return;
    const step = () => {
      const first = track.children[0] as HTMLElement | undefined;
      const second = track.children[1] as HTMLElement | undefined;
      if (!first) return track.clientWidth;
      return second ? second.offsetLeft - first.offsetLeft : first.offsetWidth;
    };
    const update = () => {
      const max = track.scrollWidth - track.clientWidth - 1;
      if (prev) prev.disabled = track.scrollLeft <= 1;
      if (next) next.disabled = track.scrollLeft >= max;
    };
    const go = (dir: number) => track.scrollBy({ left: dir * step(), behavior: reduce ? 'auto' : 'smooth' });
    prev?.addEventListener('click', () => go(-1));
    next?.addEventListener('click', () => go(1));
    track.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  });
}
