const pad = (n: number) => String(n).padStart(2, '0');
export const toISO = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const todayISO = () => toISO(new Date());
export const parseISO = (s: string) => {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
};
export const addDays = (s: string, n: number) => {
  const d = parseISO(s);
  d.setDate(d.getDate() + n);
  return toISO(d);
};
export const daysBetween = (a: string, b: string) =>
  Math.round((parseISO(b).getTime() - parseISO(a).getTime()) / 86400000);

const WD = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MO = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
export const weekday = (s: string, short = false) => {
  const w = WD[parseISO(s).getDay()];
  return short ? w.slice(0, 3) : w;
};
export const monthName = (m: number) => MO[m];
export const monthShort = (s: string) => MO[parseISO(s).getMonth()].slice(0, 3);
export const dayNum = (s: string) => parseISO(s).getDate();
export const fmtLong = (s: string) => `${weekday(s)}, ${dayNum(s)} ${MO[parseISO(s).getMonth()]}`;
export const fmtShort = (s: string) => `${weekday(s, true)}, ${dayNum(s)} ${monthShort(s)}`;
export const fmtTime = (t: string) => {
  const [h, m] = t.split(':').map(Number);
  const ap = h >= 12 ? 'PM' : 'AM';
  return `${((h + 11) % 12) + 1}:${pad(m)} ${ap}`;
};
export const fmtTimeShort = (t: string) => {
  const [h, m] = t.split(':').map(Number);
  return `${((h + 11) % 12) + 1}${m ? ':' + pad(m) : ''} ${h >= 12 ? 'PM' : 'AM'}`;
};
export const greeting = (d = new Date()) => {
  const h = d.getHours();
  if (h < 5) return 'Still up?';
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
};
/** Whole days only; never a ticking clock. */
export const countdown = (examDate: string, time: string, today = todayISO()) => {
  const n = daysBetween(today, examDate);
  if (n <= 0) return `Today, ${fmtTime(time)} — you’ve prepared for this.`;
  if (n === 1) return `Tomorrow, ${fmtTime(time)}`;
  return `${n} days to prepare`;
};
/** Parse DD/MM/YYYY explicitly (never new Date(str)) and check the printed weekday. */
export const parseDDMM = (str: string, printedWeekday?: string) => {
  const m = str.match(/(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})/);
  if (!m) return null;
  const iso = `${m[3]}-${pad(+m[2])}-${pad(+m[1])}`;
  const ok = !printedWeekday || weekday(iso, true).toUpperCase() === printedWeekday.slice(0, 3).toUpperCase();
  return { iso, weekdayMatches: ok };
};
