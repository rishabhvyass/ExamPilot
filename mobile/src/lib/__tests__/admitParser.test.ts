import { parseAdmitCard, shortCode } from '../admitParser';

const CARD = `Parul University
Admit Card for BTech Regular Exam, Semester - 5, Winter 2026-27
Code Subject Name Date Time Exam Type Supervisor's Sign
303105253 Software Engineering 21-10-2026 02:00 PM Theory
303105218 Design and Analysis of Algorithm 22-10-2026 02:00 PM Theory
303105306 Theory of Computation 27-10-2026 02:00 PM Theory
303105309 Enterprise Programming using Java 29-10-2026 02:00 PM Theory
303105301 AWS Fundamental 25-11-2026 02:00 PM Theory
303105314 Data Analytics and Data Visualization 30-11-2026 02:00 PM Theory
303105219 Design and Analysis of Algorithm Laboratory Practical/Viva
Signature of the Student Printed on : 04-10-2026 02:03 PM Signature of the Principal/Dean
T : 01-10-2026 06:00 PM P :01-10-2026 06:00 PM`;

test('reads every dated exam row and skips footer dates', () => {
  const { exams, undated } = parseAdmitCard([CARD]);
  expect(exams.map(e => [e.name, e.date, e.time])).toEqual([
    ['Software Engineering', '2026-10-21', '14:00'],
    ['Design and Analysis of Algorithm', '2026-10-22', '14:00'],
    ['Theory of Computation', '2026-10-27', '14:00'],
    ['Enterprise Programming using Java', '2026-10-29', '14:00'],
    ['AWS Fundamental', '2026-11-25', '14:00'],
    ['Data Analytics and Data Visualization', '2026-11-30', '14:00'],
  ]);
  expect(exams[0].code).toBe('303105253');
  expect(undated).toEqual(['Design and Analysis of Algorithm Laboratory']);
});

test('other common formats', () => {
  const { exams } = parseAdmitCard([
    'CS301 Operating Systems 05/12/2026 10:30 AM',
    'Maths III 7 Dec 2026 14:00',
  ]);
  expect(exams.map(e => [e.name, e.date, e.time])).toEqual([
    ['Operating Systems', '2026-12-05', '10:30'],
    ['Maths III', '2026-12-07', '14:00'],
  ]);
});

test('short codes', () => {
  const taken = new Set<string>();
  expect(shortCode('Software Engineering', taken)).toBe('SE');
  expect(shortCode('Design and Analysis of Algorithm', taken)).toBe('DAA');
  expect(shortCode('Theory of Computation', taken)).toBe('TOC');
  expect(shortCode('Enterprise Programming using Java', taken)).toBe('EPJ');
  expect(shortCode('Data Analytics and Data Visualization', taken)).toBe('DADV');
  expect(shortCode('Software Engineering', taken)).toBe('SE2');
});
