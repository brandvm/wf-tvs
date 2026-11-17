// Share links: fills in the post's own URL on share buttons, because a
// Webflow link field can't insert a CMS field (the slug) into a URL.
// Markup: an <a data-share="facebook"> or <a data-share="email"> anywhere on
// the page. The URL is the page's canonical link if it has one, otherwise
// the current address without query or hash; the email subject is the
// page's h1 (or the document title). Without JavaScript the links keep
// their Webflow fallback (the sharer URL, mailto:). No-op when absent.
export function initShareLinks() {
  const links = document.querySelectorAll<HTMLAnchorElement>('a[data-share]');
  if (!links.length) return;
  const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.href;
  const url = canonical || `${location.origin}${location.pathname}`;
  const title = (document.querySelector('h1')?.textContent || document.title).replace(/\s+/g, ' ').trim();
  links.forEach((link) => {
    const kind = link.dataset.share;
    if (kind === 'facebook') {
      link.href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
      link.target = '_blank';
      link.rel = 'noopener';
    } else if (kind === 'email') {
      link.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`;
    }
  });
}
