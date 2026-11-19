// Review modal: a click (or Enter/Space) on a review card opens one dialog
// showing that review in full: its photo, the whole text, the avatar, name
// and place. The cards clamp their text to four lines; the full text is
// already in each card (the CMS Review field), the clamp only hides it.
// Markup: data-review-open on each card; one <dialog data-review-modal>
// with data-review-modal-photo / -text / -avatar / -name / -place slots and
// a data-review-modal-close button. Native <dialog>: top layer, focus trap,
// Escape closes; a click on the backdrop closes; focus goes back to the
// control that opened it; the page stops scrolling while it is open (scroll:lock, as the call
// chooser does).
export function initReviewModal() {
  const modal = document.querySelector<HTMLDialogElement>('[data-review-modal]');
  const cards = Array.from(document.querySelectorAll<HTMLElement>('[data-review-open]'));
  if (!modal || !cards.length) return;
  // The two images are also found by class: Webflow refused data-* attributes
  // on these Image elements (GOTCHAS 2026-11-13).
  const byClass: Record<string, string> = { photo: '.review-modal-photo', avatar: '.review-author-avatar' };
  const slot = <T extends HTMLElement>(name: string) =>
    modal.querySelector<T>(`[data-review-modal-${name}]`) ?? (byClass[name] ? modal.querySelector<T>(byClass[name]) : null);
  let opener: HTMLElement | null = null;
  const lock = (on: boolean) => window.dispatchEvent(new CustomEvent(on ? 'scroll:lock' : 'scroll:unlock'));
  const open = (card: HTMLElement) => {
    const photo = card.querySelector<HTMLImageElement>('.review-card-photo');
    const avatar = card.querySelector<HTMLImageElement>('.review-author-avatar');
    const name = card.querySelector('.review-author-name')?.textContent ?? '';
    slot<HTMLImageElement>('photo')!.src = photo?.currentSrc || photo?.src || '';
    slot<HTMLImageElement>('avatar')!.src = avatar?.currentSrc || avatar?.src || '';
    slot('text')!.innerHTML = card.querySelector('.review-card-text')?.innerHTML ?? '';
    slot('name')!.textContent = name;
    slot('place')!.textContent = card.querySelector('.review-author-place')?.textContent ?? '';
    opener = card.querySelector<HTMLElement>('[role="button"]') ?? card;
    modal.showModal();
    lock(true);
  };
  // After the dialog's own focus restore, which would otherwise win.
  modal.addEventListener('close', () => { lock(false); window.setTimeout(() => opener?.focus(), 0); });
  modal.addEventListener('click', (event) => { if (event.target === modal) modal.close(); });
  slot('close')?.addEventListener('click', () => modal.close());
  cards.forEach((card) => {
    // The whole card opens the review on click. The keyboard control is the
    // card's "Read full review" pill when it has one: a card is a CMS list
    // item (role listitem), which may not itself be a button (Lighthouse
    // aria-required-children, 2026-11-19).
    const control = card.querySelector<HTMLElement>('[data-review-open-control], .review-card-more') ?? card;
    control.setAttribute('role', 'button');
    control.setAttribute('tabindex', '0');
    control.setAttribute('aria-haspopup', 'dialog');
    const name = card.querySelector('.review-author-name')?.textContent ?? 'this review';
    control.setAttribute('aria-label', `Read the full review by ${name}`);
    card.addEventListener('click', () => open(card));
    control.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); open(card); }
    });
  });
}
