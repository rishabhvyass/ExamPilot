// Turns the text of an admit card (PDF text layer or OCR lines) into exams.
// Handles rows like "303105253 Software Engineering 21-10-2026 02:00 PM Theory".
import { weekday } from './dates';

export type ParsedExam = {
  code?: string;
  name: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  flag?: string;
};

const pad = (n: number) => String(n).padStart(2, '0');
const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
const NUM_DATE = /\b(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})\b/;
const WORD_DATE = /\b(\d{1,2})\s*(?:st|nd|rd|th)?[\s-]+([A-Za-z]{3,9})[\s-,]+(\d{4})\b/;
const TIME = /\b(\d{1,2})[:.](\d{2})\s*([AaPp]\.?[Mm]\.?)?/;
const SKIP = /printed on|date of birth|\bdob\b|issued|generated|signature|valid till|reporting time/i;
const WEEKDAY = /\b(mon|tue|wed|thu|fri|sat|sun)[a-z]*\b/i;

function findDate(line: string): { iso: string; index: number; length: number } | null {
  const n = NUM_DATE.exec(line);
  if (n) {
    const [d, m, y] = [+n[1], +n[2], +n[3]];
    if (m >= 1 && m <= 12 && d >= 1 && d <= 31)
      return { iso: `${y}-${pad(m)}-${pad(d)}`, index: n.index, length: n[0].length };
  }
  const w = WORD_DATE.exec(line);
  if (w) {
    const m = MONTHS.indexOf(w[2].slice(0, 3).toLowerCase());
    if (m >= 0)
      return { iso: `${w[3]}-${pad(m + 1)}-${pad(+w[1])}`, index: w.index, length: w[0].length };
  }
  return null;
}

function findTime(text: string): string | null {
  const t = TIME.exec(text);
  if (!t) return null;
  let h = +t[1];
  const min = +t[2];
  const ap = t[3]?.toLowerCase().replace(/\./g, '');
  if (ap === 'pm' && h < 12) h += 12;
  if (ap === 'am' && h === 12) h = 0;
  if (h > 23 || min > 59) return null;
  return `${pad(h)}:${pad(min)}`;
}

const tidy = (s: string) =>
  s
    .replace(/\s+/g, ' ')
    .replace(/^[\s\-–:|.,]+|[\s\-–:|.,]+$/g, '')
    .trim();

export function parseAdmitCard(lines: string[]): {
  exams: ParsedExam[];
  /** Rows that look like subjects but have no date printed (e.g. practicals / viva). */
  undated: string[];
} {
  const exams: ParsedExam[] = [];
  const undated: string[] = [];
  const seen = new Set<string>();
  for (const raw of lines.flatMap(l => l.split('\n'))) {
    const line = raw.replace(/\s+/g, ' ').trim();
    if (!line || SKIP.test(line)) continue;
    const codeMatch = /^([A-Z]{0,4}\d{3,}[A-Z]?)\s+/.exec(line);
    const date = findDate(line);
    if (!date) {
      if (codeMatch) undated.push(tidy(line.slice(codeMatch[0].length).replace(/practical\/?viva|theory|practical|viva/gi, '')));
      continue;
    }
    const before = line.slice(codeMatch ? codeMatch[0].length : 0, date.index);
    const after = line.slice(date.index + date.length);
    const name = tidy(before.replace(WEEKDAY, ''));
    if (name.length < 3 || /^(date|time|day)$/i.test(name)) continue;
    const time = findTime(after) ?? findTime(before) ?? '10:00';
    const key = `${name.toLowerCase()}|${date.iso}`;
    if (seen.has(key)) continue;
    seen.add(key);
    const printed = WEEKDAY.exec(line)?.[1];
    exams.push({
      code: codeMatch?.[1],
      name,
      date: date.iso,
      time,
      flag:
        printed && weekday(date.iso, true).toLowerCase() !== printed.slice(0, 3).toLowerCase()
          ? 'Weekday doesn’t match the date — please check.'
          : undefined,
    });
  }
  exams.sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  return { exams, undated: undated.filter(Boolean) };
}

const SMALL = new Set(['and', 'of', 'the', 'using', 'in', 'for', 'to', 'with', 'on', '&', 'a', 'an']);
/** "Design and Analysis of Algorithm" → "DAA", "Theory of Computation" → "TOC", "Java" → "JAV". */
export function shortCode(name: string, taken: Set<string>): string {
  const words = name.split(/[\s/-]+/).filter(Boolean);
  const big = words.filter(w => !SMALL.has(w.toLowerCase()));
  let code =
    big.length > 1
      ? big.map(w => w[0]).join('').toUpperCase().slice(0, 4)
      : (big[0] ?? name).slice(0, 3).toUpperCase();
  if (words.length > 2 && /^theory$/i.test(words[0])) code = words.filter(w => w.length > 1).map(w => w[0]).join('').toUpperCase();
  let out = code;
  for (let i = 2; taken.has(out); i++) out = code + i;
  taken.add(out);
  return out;
}
