// Parallax: an element drifts slower than the page as it scrolls.
// Markup: data-parallax="<speed>" on the element, 0 to 1 (0.25 = it moves a
// quarter as far as the page). It is a transform only (no layout), driven by
// GSAP ScrollTrigger in step with Lenis, and off for visitors who ask for
// reduced motion.
// The element moves down while its section scrolls up. In the first
// section of a page (the hero) that never opens a gap you can see: the top
// edge it leaves behind is already above the window. Lower on a page, the
// element has to be taller than its frame by speed × the frame's height, or
// a gap shows at its top.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initParallax() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.querySelectorAll<HTMLElement>('[data-parallax]').forEach((el) => {
    const speed = parseFloat(el.dataset.parallax || '') || 0.25;
    const frame = el.closest<HTMLElement>('section') ?? el.parentElement!;
    const atTop = frame.getBoundingClientRect().top + window.scrollY < window.innerHeight * 0.5;
    gsap.fromTo(el, { y: 0 }, {
      y: () => speed * (atTop ? frame.offsetHeight : frame.offsetHeight + window.innerHeight),
      ease: 'none',
      scrollTrigger: { trigger: frame, start: atTop ? 'top top' : 'top bottom', end: 'bottom top', scrub: true, invalidateOnRefresh: true },
    });
  });
}
