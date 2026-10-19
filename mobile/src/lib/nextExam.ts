import type { Exam } from '../data/types';
export function nextUpcomingExam(
  exams: Exam[],
  now = Date.now(),
): Exam | undefined {
  const at = (exam: Exam) =>
    new Date(
      `${exam.date}T${exam.time || '09:00'}${
        (exam.time || '').split(':').length === 3 ? '' : ':00'
      }`,
    ).getTime();
  return exams
    .filter(exam => Number.isFinite(at(exam)) && at(exam) > now)
    .sort((a, b) => at(a) - at(b))[0];
}
