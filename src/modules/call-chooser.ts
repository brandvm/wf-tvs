// Call Chooser: every "Call / Text" button opens one dialog where the
// visitor picks a clinic, then calls (tel:) or texts (sms:) it.
// Markup: buttons with data-call-chooser (an <a href="tel:…"> that still
// works without JavaScript); one <dialog data-call-chooser-dialog> with a
// [data-call-chooser-close] button. A native modal dialog sits in the top
// layer, traps focus, closes on Escape and gives focus back to the button.
// Clicking the dimmed backdrop closes it too. Page scrolling (Lenis) pauses
// while it is open.
export function initCallChooser() {
  const dialog = document.querySelector<HTMLDialogElement>('[data-call-chooser-dialog]');
  if (!dialog || typeof dialog.showModal !== 'function') return;
  const lock = (on: boolean) => window.dispatchEvent(new CustomEvent(on ? 'scroll:lock' : 'scroll:unlock'));
  document.addEventListener('click', (e) => {
    const trigger = (e.target as Element).closest?.('[data-call-chooser]');
    if (!trigger) return;
    e.preventDefault();
    dialog.showModal();
    lock(true);
  });
  dialog.querySelector('[data-call-chooser-close]')?.addEventListener('click', () => dialog.close());
  // A click on the dialog element itself (not its content) is the backdrop.
  dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => lock(false));
}
