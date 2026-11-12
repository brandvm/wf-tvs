// Smooth scrolling with Lenis, tuned to feel like normal scrolling with the
// edges taken off: a short ease on wheel input, the browser's own momentum
// on touch (Lenis leaves touch alone by default), the wheel's own distance
// (no multiplier), anchors eased. Off for visitors who ask for reduced
// motion. GSAP's ticker drives it so ScrollTrigger and the marquee stay in
// step with the scroll position.
// Anything that scrolls up and down on its own inside the page (the open
// select list, the mobile nav sheet, the docs sidebar) gets the wheel itself,
// but only while it really has more to scroll vertically. It is decided per
// wheel event (Lenis `prevent`), not with data-lenis-prevent: that attribute
// also brings Lenis's `overscroll-behavior: contain`, so a box that scrolls
// only sideways (the docs tables) swallowed every vertical wheel over it and
// the page stopped scrolling. Sideways wheels never reach Lenis, so those
// boxes need nothing.
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const INNER_SCROLLERS = 'dialog, [data-nav-sheet], [data-select-list], [data-date-panel], .sgd-side, .sgd-toc, textarea';

const scrollsVertically = (node: HTMLElement) =>
  node.matches(INNER_SCROLLERS) && node.scrollHeight > node.clientHeight + 1;

export function initSmoothScroll() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const lenis = new Lenis({ lerp: 0.14, wheelMultiplier: 1, anchors: true, autoRaf: false, prevent: scrollsVertically });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  // Dialogs (the call chooser) pause the page while they are open.
  window.addEventListener('scroll:lock', () => lenis.stop());
  window.addEventListener('scroll:unlock', () => lenis.start());
}
