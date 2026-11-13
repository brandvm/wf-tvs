// Live opening status from a clinic's hours, in Toronto time.
//
// Markup (a scope per clinic):
//   <div data-open-hours>                     scope; optional data-open-hours-tz
//     <div data-hours-row>                    one row per line of hours
//       <span data-hours-time>10AM – 11PM</span>
//       <span data-hours-days>Mon to Sat</span>
//     </div>
//     <div data-open-status-text>Open today</div>   written by this module
//     <div data-open-today-time></div>   optional: today's hours ("10AM – 11PM")
//     <div data-open-today-day></div>    optional: "Today · Mon"
//   </div>
// Instead of rows, the scope may carry the hours as text:
//   data-open-hours="Mon to Sat 10AM – 11PM; Sun 9AM – 10PM"
//
// The rows are the CMS fields (Hours 1/2 time and days), so editors change
// hours in one place and the status follows. Days read: "Mon to Sat",
// "Mon – Sat", "Mon, Wed, Fri", "Sun", "Daily". Times read "10AM – 11PM",
// "9:30am-7pm". The scope gets data-open-state="open" | "closed" for styling.
// Without JavaScript the static text in the markup stays ("Open today").
// Refreshes every minute.

const DAYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

type Span = { open: number; close: number }; // minutes since midnight
type Week = (Span | null)[]; // index 0 = Sunday

function dayIndex(token: string): number {
  return DAYS.indexOf(token.trim().slice(0, 3).toLowerCase());
}

function parseDays(text: string): number[] {
  const t = text.toLowerCase();
  if (/daily|every ?day|7 days/.test(t)) return [0, 1, 2, 3, 4, 5, 6];
  const out = new Set<number>();
  for (const part of t.split(/,|&|\band\b/)) {
    const range = part.split(/\s*(?:to|–|—|-)\s*/).filter(Boolean);
    if (range.length === 2) {
      const a = dayIndex(range[0]);
      const b = dayIndex(range[1]);
      if (a < 0 || b < 0) continue;
      for (let i = a; ; i = (i + 1) % 7) {
        out.add(i);
        if (i === b) break;
      }
    } else if (range.length === 1) {
      const a = dayIndex(range[0]);
      if (a >= 0) out.add(a);
    }
  }
  return [...out];
}

function parseTime(text: string): number | null {
  const m = text.trim().match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)?$/i);
  if (!m) return null;
  let h = Number(m[1]) % 12;
  if ((m[3] || '').toLowerCase() === 'pm') h += 12;
  if (!m[3] && Number(m[1]) === 12) h = 12;
  return h * 60 + Number(m[2] || 0);
}

function parseSpan(text: string): Span | null {
  const [a, b] = text.split(/\s*(?:–|—|-|to)\s*/i);
  if (!a || !b) return null;
  const open = parseTime(a);
  const close = parseTime(b);
  if (open == null || close == null) return null;
  return { open, close: close <= open ? close + 24 * 60 : close };
}

function readWeek(scope: HTMLElement): Week {
  const week: Week = [null, null, null, null, null, null, null];
  const set = (days: string, time: string) => {
    const span = parseSpan(time);
    if (span) for (const d of parseDays(days)) week[d] = span;
  };
  const rows = scope.querySelectorAll<HTMLElement>('[data-hours-row]');
  rows.forEach((row) => set(row.querySelector('[data-hours-days]')?.textContent || '', row.querySelector('[data-hours-time]')?.textContent || ''));
  const inline = scope.dataset.openHours;
  if (!rows.length && inline) {
    for (const entry of inline.split(';')) {
      const m = entry.trim().match(/^(.*?)(\d{1,2}(?::\d{2})?\s*(?:am|pm)?\s*(?:–|—|-|to)\s*\d{1,2}(?::\d{2})?\s*(?:am|pm)?)$/i);
      if (m) set(m[1], m[2]);
    }
  }
  return week;
}

function formatTime(minutes: number): string {
  const m = minutes % (24 * 60);
  const h = Math.floor(m / 60);
  const min = m % 60;
  const h12 = h % 12 || 12;
  return `${h12}${min ? `:${String(min).padStart(2, '0')}` : ''}${h < 12 ? 'AM' : 'PM'}`;
}

function nowIn(timeZone: string): { day: number; minutes: number } {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone, weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(new Date());
  const get = (type: string) => parts.find((p) => p.type === type)?.value || '';
  return { day: dayIndex(get('weekday')), minutes: (Number(get('hour')) % 24) * 60 + Number(get('minute')) }; // hour12:false can print 24 at midnight
}

function status(week: Week, day: number, minutes: number): { open: boolean; text: string } {
  // Still inside yesterday's hours past midnight?
  const prev = week[(day + 6) % 7];
  if (prev && prev.close > 24 * 60 && minutes < prev.close - 24 * 60) return { open: true, text: `Open now · until ${formatTime(prev.close)}` };
  const today = week[day];
  if (today && minutes >= today.open && minutes < today.close) return { open: true, text: `Open now · until ${formatTime(today.close)}` };
  if (today && minutes < today.open) return { open: false, text: `Closed · opens today at ${formatTime(today.open)}` };
  for (let i = 1; i <= 7; i++) {
    const d = (day + i) % 7;
    const span = week[d];
    if (span) return { open: false, text: `Closed · opens ${i === 1 ? 'tomorrow' : DAY_LABELS[d]} at ${formatTime(span.open)}` };
  }
  return { open: false, text: 'Closed' };
}

export function initOpenHours() {
  const scopes = document.querySelectorAll<HTMLElement>('[data-open-hours]');
  if (!scopes.length) return;
  const update = () => {
    scopes.forEach((scope) => {
      const week = readWeek(scope);
      if (week.every((d) => !d)) return; // nothing readable: keep the static text
      const { day, minutes } = nowIn(scope.dataset.openHoursTz || 'America/Toronto');
      const s = status(week, day, minutes);
      scope.dataset.openState = s.open ? 'open' : 'closed';
      scope.querySelectorAll('[data-open-status-text]').forEach((el) => (el.textContent = s.text));
      const today = week[day];
      scope.querySelectorAll('[data-open-today-time]').forEach((el) => (el.textContent = today ? `Open ${formatTime(today.open)} – ${formatTime(today.close)}` : 'Closed today'));
      scope.querySelectorAll('[data-open-today-day]').forEach((el) => (el.textContent = `Today · ${DAY_LABELS[day]}`));
    });
  };
  update();
  window.setInterval(update, 60_000);
}
