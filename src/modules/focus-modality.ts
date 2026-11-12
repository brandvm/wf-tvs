// Keyboard or pointer? Sets `is-keyboard` on <html> while the visitor moves
// with the keyboard (Tab, arrows) and removes it on the next pointer press.
// Text fields match :focus-visible however they were focused, so CSS alone
// can't keep the focus ring for keyboard users only; the ring on fields is
// written as `.is-keyboard .form-input:focus`.
export function initFocusModality() {
  const root = document.documentElement;
  document.addEventListener('keydown', (e) => { if (e.key === 'Tab' || e.key.startsWith('Arrow')) root.classList.add('is-keyboard'); }, true);
  document.addEventListener('pointerdown', () => root.classList.remove('is-keyboard'), true);
}
