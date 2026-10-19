import { nextUpcomingExam } from '../nextExam';
import type { Exam } from '../../data/types';
const exam = (id: string, date: string, time: string): Exam => ({
  id,
  date,
  time,
  subjectId: id,
  title: id,
  source: 'manual',
});
it('skips exams that have already started and selects the next actual time', () => {
  const exams = [
    exam('tomorrow', '2026-10-20', '09:00'),
    exam('past', '2026-10-19', '09:00'),
    exam('next', '2026-10-19', '14:00'),
  ];
  expect(
    nextUpcomingExam(exams, new Date('2026-10-19T10:00:00').getTime())?.id,
  ).toBe('next');
  expect(exams[0].id).toBe('tomorrow');
});
it('handles an empty schedule, invalid dates and times containing seconds', () => {
  expect(nextUpcomingExam([], 0)).toBeUndefined();
  expect(
    nextUpcomingExam([exam('bad', 'invalid', '09:00')], 0),
  ).toBeUndefined();
  expect(
    nextUpcomingExam(
      [exam('seconds', '2026-10-19', '14:00:00')],
      new Date('2026-10-19T13:59:00').getTime(),
    )?.id,
  ).toBe('seconds');
});
