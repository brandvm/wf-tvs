// Date picker. Markup:
//   <div class="date" data-date>
//     <input class="form-input date-input" type="text" name="…" readonly data-date-input placeholder="Select a date">
//     <i class="date-icon ri-calendar-line"></i>
//     <div class="datepicker" data-date-panel></div>
//   </div>
// Optional on the root: data-date-min="today" (no past dates),
// data-date-max="today" (no future dates, e.g. a date of birth).
// The value is written as yyyy-mm-dd, the format the live site's forms
// submit (flatpickr dateFormat "Y-m-d"), so submissions read the same.
// The calendar is a top-layer popover placed by ./popover. Keyboard: Enter
// or ArrowDown opens; arrows move by day and week; PageUp/PageDown by month;
// Enter picks; Escape closes.
import { floating } from './popover';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
const key = (d: Date) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
const el = (tag: string, cls: string, text = '') => { const n = document.createElement(tag); n.className = cls; n.textContent = text; return n; };

export function initDatePicker() {
  document.querySelectorAll<HTMLElement>('[data-date]').forEach((root) => {
    const input = root.querySelector<HTMLInputElement>('[data-date-input]');
    const panel = root.querySelector<HTMLElement>('[data-date-panel]');
    if (!input || !panel) return;
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const min = root.dataset.dateMin === 'today' ? today : null;
    const max = root.dataset.dateMax === 'today' ? today : null;
    let selected: Date | null = null;
    let cursor = new Date(today);
    panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-label', 'Choose a date');
    const pop = floating(input, panel, { onClose: () => input.setAttribute('aria-expanded', 'false') });
    input.setAttribute('aria-haspopup', 'dialog'); input.setAttribute('aria-expanded', 'false');
    const pick = (d: Date) => {
      selected = d; cursor = new Date(d);
      input.value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      input.dispatchEvent(new Event('change', { bubbles: true }));
      pop.close(); input.focus();
    };
    const render = () => {
      panel.textContent = '';
      const head = el('div', 'datepicker-head');
      const prev = el('button', 'datepicker-nav') as HTMLButtonElement; prev.type = 'button'; prev.setAttribute('aria-label', 'Previous month'); prev.appendChild(el('i', 'ri-arrow-left-s-line'));
      const next = el('button', 'datepicker-nav') as HTMLButtonElement; next.type = 'button'; next.setAttribute('aria-label', 'Next month'); next.appendChild(el('i', 'ri-arrow-right-s-line'));
      prev.addEventListener('click', () => { cursor = new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1); render(); });
      next.addEventListener('click', () => { cursor = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1); render(); });
      head.append(prev, el('div', 'datepicker-title', `${MONTHS[cursor.getMonth()]} ${cursor.getFullYear()}`), next);
      const grid = el('div', 'datepicker-grid');
      DAYS.forEach((d) => grid.appendChild(el('div', 'datepicker-weekday', d)));
      const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
      const start = new Date(first); start.setDate(1 - ((first.getDay() + 6) % 7));
      for (let i = 0; i < 42; i++) {
        const d = new Date(start); d.setDate(start.getDate() + i);
        const b = el('button', 'datepicker-day', String(d.getDate())) as HTMLButtonElement; b.type = 'button'; b.tabIndex = -1;
        if (d.getMonth() !== cursor.getMonth()) b.classList.add('is-outside');
        if (key(d) === key(today)) b.classList.add('is-today');
        if (selected && key(d) === key(selected)) { b.classList.add('is-selected'); b.setAttribute('aria-pressed', 'true'); }
        if (key(d) === key(cursor)) b.classList.add('is-active');
        if ((min && d < min) || (max && d > max)) b.disabled = true;
        b.setAttribute('aria-label', `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`);
        b.addEventListener('click', () => pick(d));
        grid.appendChild(b);
      }
      panel.append(head, grid);
    };
    const open = () => { if (input.disabled) return; cursor = new Date(selected ?? (min && today < min ? min : today)); render(); pop.open(); input.setAttribute('aria-expanded', 'true'); };
    const move = (days: number, months = 0) => { cursor = months ? new Date(cursor.getFullYear(), cursor.getMonth() + months, cursor.getDate()) : new Date(cursor.getFullYear(), cursor.getMonth(), cursor.getDate() + days); if (min && cursor < min) cursor = new Date(min); if (max && cursor > max) cursor = new Date(max); render(); };
    input.addEventListener('click', () => (pop.isOpen() ? pop.close() : open()));
    input.addEventListener('keydown', (e) => {
      const k = e.key;
      if (!pop.isOpen()) { if (k === 'Enter' || k === 'ArrowDown' || k === ' ') { e.preventDefault(); open(); } return; }
      const map: Record<string, () => void> = { ArrowLeft: () => move(-1), ArrowRight: () => move(1), ArrowUp: () => move(-7), ArrowDown: () => move(7), PageUp: () => move(0, -1), PageDown: () => move(0, 1) };
      if (map[k]) { e.preventDefault(); map[k](); } else if (k === 'Enter' || k === ' ') { e.preventDefault(); pick(new Date(cursor)); } else if (k === 'Escape') { e.preventDefault(); pop.close(); } else if (k === 'Tab') pop.close();
    });
  });
}
