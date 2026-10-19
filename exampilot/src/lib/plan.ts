import type { Exam, StudySession } from '../data/types';
import { addDays, daysBetween, todayISO } from './dates';

/** Local heuristic: soonest exam first, lighter evening before each exam, no new topics on exam day. */
export function generatePlan(exams: Exam[], today = todayISO()): StudySession[] {
  const sorted = [...exams].sort((a, b) => a.date.localeCompare(b.date));
  if (!sorted.length) return [];
  const last = sorted[sorted.length - 1].date;
  const out: StudySession[] = [];
  let id = 0;
  for (let d = today; daysBetween(d, last) > 0; d = addDays(d, 1)) {
    const next = sorted.find((e) => e.date >= d);
    if (!next) break;
    const examToday = sorted.find((e) => e.date === d);
    const upcoming = examToday ? sorted.find((e) => e.date > d) : next;
    if (!upcoming) continue;
    const eve = daysBetween(d, upcoming.date) === 1;
    out.push({
      id: 'p' + id++, date: d, subjectId: upcoming.subjectId, source: 'plan',
      title: examToday ? 'Gentle evening review' : eve ? 'Light review, then rest' : 'Focused revision',
      start: examToday ? '18:00' : '10:00', end: examToday ? '19:00' : eve ? '11:00' : '11:30',
    });
    if (!examToday && !eve && daysBetween(d, upcoming.date) > 1) {
      out.push({ id: 'p' + id++, date: d, subjectId: upcoming.subjectId, source: 'plan', title: 'Practice problems', start: '16:00', end: '17:00' });
    }
  }
  return out;
}
export const hours = (s: { start: string; end: string }) => {
  const m = (t: string) => +t.slice(0, 2) * 60 + +t.slice(3);
  return (m(s.end) - m(s.start)) / 60;
};
