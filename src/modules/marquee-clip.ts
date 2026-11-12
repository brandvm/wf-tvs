// Marquee clip: the photos in a marquee seem to shrink and grow as they
// travel, without ever being scaled. Each item is clipped from its edges by
// an amount that depends on where it is: full size at the left edge, in the
// centre and at the right edge of the marquee, smallest halfway between.
// The image inside keeps its size and position; only the visible window
// closes in and opens out.
// Markup: data-marquee-clip="<most to clip, % of the item, default 7>" on
// the marquee wrapper; items are the children of its lists (clones included).
// Works with any marquee: it only reads one position and sets clip-path.
// Cost per frame: one layout read (where the moving strip is) and a
// clip-path write for the few items on screen. Item offsets, widths and
// corner radius are measured once and again on resize, never per frame, and
// nothing runs while the marquee is off screen.
export function initMarqueeClip() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.querySelectorAll<HTMLElement>('[data-marquee-clip]').forEach((wrap) => {
    const max = parseFloat(wrap.dataset.marqueeClip || '') || 7;
    const strip = wrap.firstElementChild as HTMLElement | null;
    if (!strip) return;
    type Item = { el: HTMLElement; left: number; width: number; last: number };
    let items: Item[] = [];
    let wrapLeft = 0; let wrapWidth = 0; let radius = '0px';
    const measure = () => {
      const box = wrap.getBoundingClientRect();
      const s = strip.getBoundingClientRect();
      wrapLeft = box.left; wrapWidth = box.width;
      const els = Array.from(wrap.querySelectorAll<HTMLElement>('[data-draggable-marquee-list] > *, [data-marquee-clip-item]'));
      items = els.map((el) => { const r = el.getBoundingClientRect(); return { el, left: r.left - s.left, width: r.width, last: -1 }; });
      radius = els[0] ? getComputedStyle(els[0]).borderTopLeftRadius : '0px';
    };
    let visible = false; let frame = 0;
    const tick = () => {
      frame = 0;
      if (!visible) return;
      const x = strip.getBoundingClientRect().left - wrapLeft; // the only read
      for (const it of items) {
        const centre = x + it.left + it.width / 2;
        if (centre < -it.width || centre > wrapWidth + it.width) continue;
        const t = Math.min(1, Math.max(0, centre / wrapWidth));
        // 0 at t = 0, 0.5 and 1; 1 at t = 0.25 and 0.75.
        const amount = Math.round(((1 - Math.cos(4 * Math.PI * t)) / 2) * max * 10) / 10;
        if (amount !== it.last) { it.last = amount; it.el.style.clipPath = `inset(${amount}% round ${radius})`; }
      }
      frame = requestAnimationFrame(tick);
    };
    measure();
    let wait = 0;
    window.addEventListener('resize', () => { window.clearTimeout(wait); wait = window.setTimeout(measure, 150); });
    new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible) { measure(); if (!frame) frame = requestAnimationFrame(tick); } }).observe(wrap);
  });
}
