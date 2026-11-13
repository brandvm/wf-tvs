// Rise: an element rises into place from behind an edge as its block
// scrolls into view (the dog over the Services banner). Markup:
// data-rise="<start offset in % of its own height>" on the element (default
// 18, a gentle drift like the background parallax); its parent clips it (overflow hidden), so it seems to come up from
// behind that edge. The motion is scrubbed to the scroll between the moment
// the block's top enters the window and the moment it reaches 35% of it, so
// it follows the scroll both ways. Transform only. Off for reduced motion:
// the element simply stands in place, as it does in the Designer and
// without JavaScript.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initRise() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.querySelectorAll<HTMLElement>('[data-rise]').forEach((el) => {
    const from = parseFloat(el.dataset.rise || '') || 18;
    const block = el.closest<HTMLElement>('[data-rise-scope]') ?? el.parentElement!;
    gsap.fromTo(el, { yPercent: from }, {
      yPercent: 0,
      ease: 'none',
      scrollTrigger: { trigger: block, start: 'top bottom', end: 'top 35%', scrub: true },
    });
  });
}
