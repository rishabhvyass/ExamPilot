import { clampRange, minutesToTime, timeToMinutes } from '../studyRange';

describe('study-time range', () => {
  it('snaps drags to 15 minutes', () =>
    expect(clampRange('start', 608, 600, 660)).toEqual({
      start: 615,
      end: 660,
    }));
  it('prevents crossing handles and keeps a 15-minute minimum', () => {
    expect(clampRange('start', 900, 600, 660)).toEqual({
      start: 645,
      end: 660,
    });
    expect(clampRange('end', 500, 600, 660)).toEqual({ start: 600, end: 615 });
  });
  it('clamps the range to the selected day', () => {
    expect(clampRange('start', -100, 600, 660).start).toBe(0);
    expect(clampRange('end', 1600, 600, 660).end).toBe(1425);
  });
  it('round-trips calendar times', () => {
    for (const t of ['00:00', '09:15', '12:30', '23:45'])
      expect(minutesToTime(timeToMinutes(t))).toBe(t);
  });
});
