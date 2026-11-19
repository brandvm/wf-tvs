// Entry point. Keep this file a manifest: one run() call per module.
// Feature code lives in src/modules/<name>.ts and exports an init
// function that no-ops when its selector is absent from the page.
import { initAriaRoles } from './modules/aria-roles';
import { initPlaceholders } from './modules/placeholders';
import { initUniqueFormIds } from './modules/unique-form-ids';
import { initStyleGuideNav } from './modules/style-guide-nav';
import { initFocusModality } from './modules/focus-modality';
import { initSelect } from './modules/select';
import { initDatePicker } from './modules/date-picker';
import { initNav } from './modules/nav';
import { initDraggableMarquee } from './modules/draggable-marquee';
import { initMarqueeClip } from './modules/marquee-clip';
import { initSmoothScroll } from './modules/smooth-scroll';
import { initCallChooser } from './modules/call-chooser';
import { initParallax } from './modules/parallax';
import { initRise } from './modules/rise';
import { initReveal } from './modules/reveal';
import { initInteractiveCollage } from './modules/interactive-collage';
import { initAccordion } from './modules/accordion';
import { initSlider } from './modules/slider';
import { initReviewModal } from './modules/review-modal';
import { initContactTabs } from './modules/contact-tabs';
import { initBlogFilter } from './modules/blog-filter';
import { initOpenHours } from './modules/open-hours';
import { initShareLinks } from './modules/share-links';
import { initStickyCta } from './modules/sticky-cta';
import { initFormReveal } from './modules/form-reveal';
import { initLazyVideo } from './modules/lazy-video';

// Each module runs in isolation: one that throws is logged and skipped,
// and every module after it still initializes.
function run(name: string, init: () => void) {
  try {
    init();
  } catch (error) {
    console.error(`[wfc] ${name} failed to initialize`, error);
  }
}

function boot() {
  // Release the pre-paint scroll lock set by loader.html first, before any
  // module measures the page — smooth-scroll libraries such as Lenis read
  // the scroll height at init and get ~0 while body is still locked. The
  // head snippet also has a fallback timeout.
  document.documentElement.classList.remove('is-loading');

  // Starter fixes for markup Webflow publishes (conventions.md §9–11).
  run('aria-roles', initAriaRoles);
  run('placeholders', initPlaceholders);
  run('unique-form-ids', initUniqueFormIds);
  // Project features, in the prototype's order (prototype/src/main.ts).
  run('year', () => document.querySelectorAll('[data-year]').forEach((el) => (el.textContent = String(new Date().getFullYear()))));
  run('focus-modality', initFocusModality);
  run('select', initSelect);
  run('date-picker', initDatePicker);
  run('nav', initNav);
  run('draggable-marquee', initDraggableMarquee);
  run('marquee-clip', initMarqueeClip);
  run('smooth-scroll', initSmoothScroll);
  run('call-chooser', initCallChooser);
  run('parallax', initParallax);
  run('rise', initRise);
  run('reveal', initReveal);
  // cms-color is not ported: it stood in for the CMS binding of the
  // wrapper's text colour to the item's Service colour field.
  run('interactive-collage', initInteractiveCollage);
  run('accordion', initAccordion);
  run('slider', initSlider);
  run('review-modal', initReviewModal);
  run('contact-tabs', initContactTabs);
  run('blog-filter', initBlogFilter);
  run('open-hours', initOpenHours);
  run('share-links', initShareLinks);
  run('form-reveal', initFormReveal);
  run('sticky-cta', initStickyCta);
  run('lazy-video', initLazyVideo);
  run('style-guide-nav', initStyleGuideNav);
  // Add project feature initializers here: run('<name>', init<Name>);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot, { once: true });
} else {
  boot();
}
