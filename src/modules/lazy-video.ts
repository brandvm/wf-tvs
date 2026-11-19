// Lazy background video (landing heroes): the poster is the picture on
// phones and while the page loads; the video file only loads on screens
// 992px and wider, after the page has finished loading, and never for
// reduced motion or Data Saver.
// Markup: <video data-lazy-video preload="none" muted loop playsinline
//   poster="…"><source data-src="…mp4" type="video/mp4"></video>
// (no autoplay, no src). Without JavaScript the poster shows.
// Why: the landing hero video is ~14 MB; downloading it on a phone pushed
// the page's largest paint past 5 s on Lighthouse's mobile profile
// (2026-11-19).
export function initLazyVideo() {
  const videos = Array.from(document.querySelectorAll<HTMLVideoElement>('video[data-lazy-video]'));
  if (!videos.length) return;
  const wide = window.matchMedia('(min-width: 992px)');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true;
  if (reduce || saveData) return;

  const start = (video: HTMLVideoElement) => {
    if (video.dataset.lazyVideoStarted) return;
    video.dataset.lazyVideoStarted = 'true';
    video.querySelectorAll<HTMLSourceElement>('source[data-src]').forEach((s) => (s.src = s.dataset.src!));
    video.muted = true;
    video.load();
    video.play().catch(() => { /* autoplay blocked: the poster stays */ });
  };
  const run = () => {
    if (!wide.matches) return;
    videos.forEach(start);
  };
  if (document.readyState === 'complete') run();
  else window.addEventListener('load', run, { once: true });
  wide.addEventListener('change', run);
}
