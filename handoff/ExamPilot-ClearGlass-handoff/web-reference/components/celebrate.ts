// One calm celebration burst: today's checklist done, plan generated, PDF finished,
// all questions in a subject revised. Never for streaks.   npm i canvas-confetti @types/canvas-confetti
import confetti from "canvas-confetti";
import { confettiOptions } from "../animations/motion";

export function celebrate(origin?: { x: number; y: number }) {
  return confetti({ ...confettiOptions, origin: origin ?? { x: 0.5, y: 0.35 } });
}

/** Burst from a DOM element (e.g. the success badge). */
export function celebrateFrom(el: HTMLElement) {
  const r = el.getBoundingClientRect();
  return celebrate({ x: (r.left + r.width / 2) / window.innerWidth, y: (r.top + r.height / 2) / window.innerHeight });
}
