export const timeToMinutes = (time: string) => {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
};
export const minutesToTime = (minutes: number) =>
  `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(
    minutes % 60,
  ).padStart(2, '0')}`;
export function clampRange(
  edge: 'start' | 'end',
  minutes: number,
  start: number,
  end: number,
) {
  'worklet';
  const snapped = Math.round(minutes / 15) * 15;
  return edge === 'start'
    ? { start: Math.max(0, Math.min(end - 15, snapped)), end }
    : { start, end: Math.min(1425, Math.max(start + 15, snapped)) };
}
