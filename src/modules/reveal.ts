// Staggered reveal: cards (or any items) fade in and rise a little, one after
// the other, as they scroll into view. Used wherever a group of cards sits:
// why-choose cards, service tiles, team, reviews, blog cards…
// Markup: data-reveal-stagger on the group. The items are its direct
// children, or, when some descendants carry data-reveal-item, those.
// Optional on the group: data-reveal-stagger="<seconds between items>"
// (default 0.08), data-reveal-y="<rise in px>" (default 24, 0 for none),
// data-reveal-scale="<starting scale>" (default 1: no scaling), and
// data-reveal-order="x" to reveal from left to right by where each item
// sits on screen rather than in page order (a marquee, whose clones sit
// beside the originals): the delay follows the item's position across the
// window, so what is visible plays first and the rest follows at once.
// Items that enter together are staggered together (ScrollTrigger.batch), so
// a long grid reveals row by row as it scrolls in, not all at once. It plays
// once. Nothing is hidden by CSS: without JavaScript, in the Webflow
// Designer and for visitors who ask for reduced motion, everything is simply
// visible. The inline transform is cleared afterwards so hover effects on
// the cards keep working.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initReveal() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.querySelectorAll<HTMLElement>('[data-reveal-stagger]').forEach((group) => {
    const marked = group.querySelectorAll<HTMLElement>('[data-reveal-item]');
    const items = marked.length ? Array.from(marked) : (Array.from(group.children) as HTMLElement[]);
    if (!items.length) return;
    const num = (value: string | undefined, fallback: number) => {
      const n = parseFloat(value ?? '');
      return Number.isFinite(n) ? n : fallback;
    };
    const each = num(group.dataset.revealStagger, 0.08) || 0.08;
    const y = num(group.dataset.revealY, 24);
    const scale = num(group.dataset.revealScale, 1);
    const byX = group.dataset.revealOrder === 'x';
    // Left to right: the item's place across the window (0 at the left edge,
    // 1 at the right) times the spread of about eight items.
    const stagger = byX
      ? (_: number, el: Element) => Math.min(Math.max(el.getBoundingClientRect().left / window.innerWidth, 0), 1) * each * 8
      : each;
    // Opacity only, never visibility: a hidden card would drop out of the Tab
    // order until it had scrolled in (the team cards are focusable).
    gsap.set(items, { opacity: 0, y, scale });
    ScrollTrigger.batch(items, {
      start: 'top 90%',
      once: true,
      onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, scale: 1, duration: byX ? 0.9 : 0.7, ease: 'power3.out', stagger, overwrite: true, clearProps: 'transform,opacity,visibility' }),
    });
  });
}
