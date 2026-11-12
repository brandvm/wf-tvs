// Shared by select and date-picker: a panel that opens next to a control
// and can never be clipped or covered. The panel is a `popover="manual"`
// element, so the browser draws it in the top layer, above every parent's
// overflow, transform and z-index. It is placed with fixed coordinates from
// the control's box and re-placed on every scroll and resize, so it follows
// the control when the page or any scrolling parent moves. It flips above
// the control when there is no room below.
export interface Floating { open(): void; close(): void; isOpen(): boolean; }

export function floating(anchor: HTMLElement, panel: HTMLElement, opts: { matchWidth?: boolean; onClose?: () => void } = {}): Floating {
  panel.setAttribute('popover', 'manual');
  let open = false;
  const place = () => {
    const a = anchor.getBoundingClientRect();
    if (opts.matchWidth) panel.style.minWidth = `${a.width}px`;
    const p = panel.getBoundingClientRect();
    const gap = 6;
    const below = window.innerHeight - a.bottom;
    const up = below < p.height + gap && a.top > below;
    panel.style.top = `${Math.max(8, up ? a.top - p.height - gap : a.bottom + gap)}px`;
    panel.style.left = `${Math.max(8, Math.min(a.left, window.innerWidth - p.width - 8))}px`;
    panel.toggleAttribute('data-above', up);
    // The control scrolled out of view: nothing to point at any more.
    if (a.bottom < 0 || a.top > window.innerHeight) api.close();
  };
  const outside = (e: Event) => { const t = e.target as Node; if (!panel.contains(t) && !anchor.contains(t)) api.close(); };
  const api: Floating = {
    open() {
      if (open) return;
      open = true;
      if (!panel.isConnected) document.body.appendChild(panel);
      panel.showPopover();
      place();
      window.addEventListener('scroll', place, { capture: true, passive: true });
      window.addEventListener('resize', place);
      document.addEventListener('pointerdown', outside, true);
    },
    close() {
      if (!open) return;
      open = false;
      panel.hidePopover();
      window.removeEventListener('scroll', place, { capture: true });
      window.removeEventListener('resize', place);
      document.removeEventListener('pointerdown', outside, true);
      opts.onClose?.();
    },
    isOpen: () => open,
  };
  return api;
}
