// Navigation. Services and Locations share one panel container under the
// bar: opening a menu grows the container to that menu's height, and moving
// to the other menu swaps the content inside while the container glides to
// the new height, so the panel never closes and reopens (as on apple.com).
// Markup: [data-nav] › [data-nav-trigger="name"] buttons, [data-nav-panels]
// holding [data-nav-panel="name"], [data-nav-dim], and for small screens
// [data-nav-toggle], [data-nav-sheet] and [data-nav-sub="name"].
// Opens on hover (after a short pause, pointer devices only), on click and
// from the keyboard (Enter, Space, ArrowDown); Escape closes and returns
// focus; leaving the nav with the pointer or with focus closes.
export function initNav() {
  const root = document.querySelector<HTMLElement>('[data-nav]');
  const wrap = root?.querySelector<HTMLElement>('[data-nav-panels]');
  if (!root || !wrap) return;
  const triggers = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-nav-trigger]'));
  const panels = Array.from(wrap.querySelectorAll<HTMLElement>('[data-nav-panel]'));
  const dim = root.querySelector<HTMLElement>('[data-nav-dim]');
  const toggle = root.querySelector<HTMLButtonElement>('[data-nav-toggle]');
  const sheet = root.querySelector<HTMLElement>('[data-nav-sheet]');
  const desktop = window.matchMedia('(min-width: 992px)');
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)');
  let current: string | null = null;
  let timer = 0;

  const panelOf = (name: string) => panels.find((p) => p.dataset.navPanel === name);
  const setHeight = () => { const p = current && panelOf(current); wrap.style.height = p ? `${p.offsetHeight}px` : '0px'; };
  const open = (name: string) => {
    window.clearTimeout(timer);
    if (current === name) return;
    current = name;
    panels.forEach((p) => { const on = p.dataset.navPanel === name; p.classList.toggle('is-active', on); p.inert = !on; });
    triggers.forEach((t) => { const on = t.dataset.navTrigger === name; t.classList.toggle('is-open', on); t.setAttribute('aria-expanded', String(on)); });
    wrap.classList.add('is-open'); dim?.classList.add('is-open');
    setHeight();
  };
  const close = () => {
    window.clearTimeout(timer);
    if (!current) return;
    current = null;
    panels.forEach((p) => { p.classList.remove('is-active'); p.inert = true; });
    triggers.forEach((t) => { t.classList.remove('is-open'); t.setAttribute('aria-expanded', 'false'); });
    wrap.classList.remove('is-open'); dim?.classList.remove('is-open');
    setHeight();
  };
  const later = (fn: () => void, ms: number) => { window.clearTimeout(timer); timer = window.setTimeout(fn, ms); };
  panels.forEach((p) => (p.inert = true));

  triggers.forEach((t) => {
    const name = t.dataset.navTrigger!;
    t.addEventListener('click', () => {
      if (!desktop.matches) { // small screens: an accordion inside the sheet
        const sub = root.querySelector<HTMLElement>(`[data-nav-sub="${name}"]`);
        const on = !sub?.classList.contains('is-open');
        sub?.classList.toggle('is-open', on); t.classList.toggle('is-open', on); t.setAttribute('aria-expanded', String(on));
        return;
      }
      if (current === name) close(); else open(name);
    });
    t.addEventListener('pointerenter', () => { if (desktop.matches && canHover.matches) later(() => open(name), current ? 0 : 90); });
    t.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown' && desktop.matches) { e.preventDefault(); open(name); panelOf(name)?.querySelector<HTMLElement>('a, button')?.focus(); }
    });
  });
  // Plain links in the menu close the panel when the pointer moves onto them.
  root.querySelectorAll<HTMLElement>('.nav-menu a').forEach((a) => a.addEventListener('pointerenter', () => { if (current && canHover.matches) later(close, 120); }));
  wrap.addEventListener('pointerenter', () => window.clearTimeout(timer));
  root.addEventListener('pointerleave', () => { if (current && canHover.matches) later(close, 180); });
  dim?.addEventListener('click', close);
  // The dim is inside the nav's root, so the pointer never "leaves" the root
  // while it is over the page: moving onto the dim is what closes the menu.
  dim?.addEventListener('pointerenter', () => { if (current && canHover.matches) later(close, 180); });
  root.addEventListener('focusout', (e) => { const to = e.relatedTarget as Node | null; if (current && to && !root.contains(to)) close(); });
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (current) { const t = triggers.find((x) => x.dataset.navTrigger === current); close(); t?.focus(); }
    else if (sheet?.classList.contains('is-open')) { setSheet(false); toggle?.focus(); }
  });
  window.addEventListener('resize', () => { if (current) setHeight(); if (desktop.matches) setSheet(false); else close(); });

  const setSheet = (on: boolean) => {
    sheet?.classList.toggle('is-open', on); toggle?.classList.toggle('is-open', on);
    toggle?.setAttribute('aria-expanded', String(on)); toggle?.setAttribute('aria-label', on ? 'Close menu' : 'Menu');
  };
  toggle?.addEventListener('click', () => setSheet(!sheet?.classList.contains('is-open')));
}
