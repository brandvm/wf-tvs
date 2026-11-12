// Custom select. Markup (the native select stays for the form's value and
// for no-JS):
//   <div class="select" data-select>
//     <select class="select-native" name="…">…options…</select>
//     <button class="form-input select-toggle" type="button" data-select-toggle>
//       <div class="select-value" data-select-value></div><i class="select-icon ri-arrow-down-s-line"></i>
//     </button>
//     <div class="select-list" data-select-list></div>
//   </div>
// The list is a top-layer popover placed by ./popover, so it is never
// clipped and follows the toggle on scroll. Keyboard: Enter/Space/arrows
// open; arrows, Home, End and typing move; Enter picks; Escape closes.
import { floating } from './popover';

let uid = 0;
export function initSelect() {
  document.querySelectorAll<HTMLElement>('[data-select]').forEach((root) => {
    const native = root.querySelector('select');
    const toggle = root.querySelector<HTMLButtonElement>('[data-select-toggle]');
    const value = root.querySelector<HTMLElement>('[data-select-value]');
    const list = root.querySelector<HTMLElement>('[data-select-list]');
    if (!native || !toggle || !value || !list) return;
    const id = `select-${++uid}`;
    list.id = id; list.setAttribute('role', 'listbox'); list.tabIndex = -1;
    toggle.setAttribute('role', 'combobox'); toggle.setAttribute('aria-haspopup', 'listbox'); toggle.setAttribute('aria-controls', id); toggle.setAttribute('aria-expanded', 'false');
    const label = native.closest('label')?.firstChild?.textContent?.trim() || native.getAttribute('aria-label') || native.name;
    if (label) { toggle.setAttribute('aria-label', label); list.setAttribute('aria-label', label); }
    native.classList.add('is-enhanced'); native.tabIndex = -1; native.setAttribute('aria-hidden', 'true');
    toggle.disabled = native.disabled;
    list.textContent = '';
    const options = Array.from(native.options).map((o, i) => {
      const el = document.createElement('div');
      el.className = 'select-option'; el.id = `${id}-${i}`; el.setAttribute('role', 'option'); el.textContent = o.textContent;
      if (o.disabled) el.setAttribute('aria-disabled', 'true');
      el.addEventListener('click', () => { if (!o.disabled) pick(i); });
      el.addEventListener('pointermove', () => setActive(i));
      list.appendChild(el);
      return el;
    });
    let active = native.selectedIndex;
    const render = () => {
      const o = native.options[native.selectedIndex];
      value.textContent = o?.textContent ?? '';
      toggle.classList.toggle('is-placeholder', !o?.value);
      options.forEach((el, i) => { const on = i === native.selectedIndex; el.classList.toggle('is-selected', on); el.setAttribute('aria-selected', String(on)); });
    };
    const setActive = (i: number) => {
      active = Math.max(0, Math.min(options.length - 1, i));
      options.forEach((el, n) => el.classList.toggle('is-active', n === active));
      toggle.setAttribute('aria-activedescendant', options[active]?.id ?? '');
      options[active]?.scrollIntoView({ block: 'nearest' });
    };
    const pop = floating(toggle, list, { matchWidth: true, onClose: () => { toggle.setAttribute('aria-expanded', 'false'); toggle.classList.remove('is-open'); } });
    const open = () => { if (toggle.disabled) return; pop.open(); toggle.setAttribute('aria-expanded', 'true'); toggle.classList.add('is-open'); setActive(native.selectedIndex); };
    const pick = (i: number) => { native.selectedIndex = i; native.dispatchEvent(new Event('change', { bubbles: true })); render(); pop.close(); toggle.focus(); };
    let typed = ''; let timer = 0;
    toggle.addEventListener('click', () => (pop.isOpen() ? pop.close() : open()));
    toggle.addEventListener('keydown', (e) => {
      const k = e.key;
      if (!pop.isOpen()) { if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(k)) { e.preventDefault(); open(); } return; }
      if (k === 'Escape' || k === 'Tab') { pop.close(); if (k === 'Escape') e.preventDefault(); return; }
      if (k === 'Enter' || k === ' ') { e.preventDefault(); if (!native.options[active]?.disabled) pick(active); return; }
      if (k === 'ArrowDown') { e.preventDefault(); setActive(active + 1); } else if (k === 'ArrowUp') { e.preventDefault(); setActive(active - 1); } else if (k === 'Home') { e.preventDefault(); setActive(0); } else if (k === 'End') { e.preventDefault(); setActive(options.length - 1); } else if (k.length === 1) {
        typed += k.toLowerCase(); window.clearTimeout(timer); timer = window.setTimeout(() => (typed = ''), 600);
        const hit = options.findIndex((el) => el.textContent?.toLowerCase().startsWith(typed)); if (hit >= 0) setActive(hit);
      }
    });
    native.addEventListener('change', render);
    native.form?.addEventListener('reset', () => window.setTimeout(render));
    render();
  });
}
