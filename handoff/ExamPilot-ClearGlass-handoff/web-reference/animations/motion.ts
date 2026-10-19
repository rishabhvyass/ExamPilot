// ExamPilot "Clear Glass" — Motion for React presets.
// npm i motion@14   →   import { motion, AnimatePresence, MotionConfig } from "motion/react";
// Wrap the app once in <MotionConfig reducedMotion="user">. Infinite loops, blur effects and
// confetti must also be gated with useReducedMotion() (see components/*).
import type { Transition, Variants } from "motion/react";

/* ─────────────── Easing & springs ─────────────── */
export const ease = {
  standard: [0.2, 0, 0, 1] as const,
  decelerate: [0.05, 0.7, 0.1, 1] as const,
  smooth: [0.2, 0.8, 0.2, 1] as const,
  overshoot: [0.2, 0.9, 0.25, 1.08] as const,
  springy: [0.3, 1.25, 0.45, 1] as const, // CSS stand-in for small springs (groove, coin)
  scroll: [0.65, 0, 0.25, 1] as const, // blur-reader track
  accelerate: [0.3, 0, 1, 1] as const,
};

export const spring = {
  press: { type: "spring", stiffness: 500, damping: 30 } satisfies Transition,
  layout: { type: "spring", stiffness: 400, damping: 34 } satisfies Transition,
  progress: { type: "spring", stiffness: 300, damping: 30 } satisfies Transition,
  sheet: { type: "spring", stiffness: 380, damping: 36 } satisfies Transition,
  pop: { type: "spring", stiffness: 600, damping: 18 } satisfies Transition,
};

/* ─────────────── Blur-in (NEW — used everywhere) ───────────────
   Every entrance goes from transparent + 12px low + blurred to sharp. */
export const blurIn: Variants = {
  initial: { opacity: 0, y: 12, filter: "blur(10px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.48, ease: ease.decelerate } },
  exit: { opacity: 0, y: -6, filter: "blur(6px)", transition: { duration: 0.16, ease: ease.accelerate } },
};
/** Smaller version for rows, results, chips (8px blur, 8px rise, 260ms). */
export const blurInSoft: Variants = {
  initial: { opacity: 0, y: 8, filter: "blur(8px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.26, ease: ease.decelerate } },
};
/** Parent that staggers blurIn children 60ms apart. */
export const stagger: Variants = { animate: { transition: { staggerChildren: 0.06, delayChildren: 0.04 } } };
/** Screen / tab change. Use with <AnimatePresence mode="wait" initial={false}> keyed by route. */
export const page: Variants = {
  initial: { opacity: 0, y: 10, filter: "blur(10px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.36, ease: ease.smooth } },
  exit: { opacity: 0, y: -6, filter: "blur(6px)", transition: { duration: 0.14, ease: ease.accelerate } },
};
/** Content swap inside a card (reader mode change, subject change): blur out → blur in. */
export const blurSwap: Variants = {
  initial: { opacity: 0, scale: 0.98, filter: "blur(14px)" },
  animate: { opacity: 1, scale: 1, filter: "blur(0px)", transition: { duration: 0.52, ease: ease.smooth } },
  exit: { opacity: 0, scale: 0.99, filter: "blur(10px)", transition: { duration: 0.2 } },
};

/* ─────────────── Buttons (soft clay) ───────────────
   Spread onto motion.button / motion.a. Hover lifts 1px; press squeezes to .96 and blurs .6px. */
export const pressable = {
  whileHover: { y: -1 },
  whileTap: { scale: 0.96, filter: "blur(0.6px)" },
  transition: spring.press,
} as const;
export const pressableSmall = {
  whileHover: { y: -1 },
  whileTap: { scale: 0.92, filter: "blur(0.6px)" },
  transition: spring.press,
} as const;

/* ─────────────── Tab bar & segmented toolbars ───────────────
   The pressed-in groove is ONE shared element that slides between buttons. */
export const GROOVE_LAYOUT_ID = "ep-groove";
export const grooveTransition: Transition = spring.layout;
export const tabLabel: Variants = {
  initial: { opacity: 0, x: -6, filter: "blur(4px)" },
  animate: { opacity: 1, x: 0, filter: "blur(0px)", transition: { delay: 0.12, duration: 0.3, ease: ease.decelerate } },
};

/* ─────────────── Checkbox ─────────────── */
export const checkBox: Variants = {
  unchecked: { scale: 1 },
  checked: { scale: [0.9, 1.12, 1], transition: { duration: 0.26, ease: ease.standard } },
};
export const checkTick: Variants = {
  unchecked: { pathLength: 0, opacity: 0 },
  checked: { pathLength: 1, opacity: 1, transition: { delay: 0.06, duration: 0.22, ease: "easeOut" } },
};
export const strike: Variants = {
  unchecked: { scaleX: 0 },
  checked: { scaleX: 1, transition: { duration: 0.24, ease: ease.smooth } },
};

/* ─────────────── Progress, accordion, sheet, chat, charts ─────────────── */
export const segment: Variants = { off: { scaleX: 0 }, on: { scaleX: 1, transition: spring.progress } };
export const accordion: Variants = {
  closed: { height: 0, opacity: 0, filter: "blur(4px)", transition: { duration: 0.2, ease: ease.standard } },
  open: {
    height: "auto", opacity: 1, filter: "blur(0px)",
    transition: { height: { duration: 0.25, ease: ease.smooth }, opacity: { delay: 0.08, duration: 0.2 }, filter: { delay: 0.08, duration: 0.24 } },
  },
};
export const sheet: Variants = { closed: { y: "100%" }, open: { y: 0, transition: spring.sheet } };
export const scrim: Variants = { closed: { opacity: 0 }, open: { opacity: 1, transition: { duration: 0.26 } } };
export const message: Variants = {
  initial: { opacity: 0, y: 10, scale: 0.98, filter: "blur(6px)" },
  animate: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", transition: { duration: 0.36, ease: ease.overshoot } },
};
export const bar = (i: number): Variants => ({
  initial: { scaleY: 0 },
  animate: { scaleY: 1, transition: { delay: i * 0.12, duration: 0.8, ease: ease.smooth } },
});
/** PDF page turn — direction 1 = next, -1 = previous. Use AnimatePresence custom={direction}. */
export const pageTurn: Variants = {
  enter: (d: number) => ({ opacity: 0, x: 40 * d, rotate: 2 * d, filter: "blur(6px)" }),
  center: { opacity: 1, x: 0, rotate: 0, filter: "blur(0px)", transition: { duration: 0.42, ease: ease.smooth } },
  exit: (d: number) => ({ opacity: 0, x: -30 * d, filter: "blur(4px)", transition: { duration: 0.18 } }),
};

/* ─────────────── Blur reader (your reference clip) ─────────────── */
/** Look of a paragraph by its distance from the focused one. */
export function readerLine(distance: number) {
  if (distance === 0) return { color: "#111113", fontWeight: 700, filter: "blur(0px)", opacity: 1 };
  if (distance === 1) return { color: "#6E6E74", fontWeight: 500, filter: "blur(0.4px)", opacity: 1 };
  if (distance <= 3) return { color: "#A6A6AC", fontWeight: 500, filter: "blur(1.6px)", opacity: 1 };
  return { color: "#A6A6AC", fontWeight: 500, filter: "blur(1.6px)", opacity: 0 };
}
export const readerTrackTransition: Transition = { duration: 0.9, ease: ease.scroll };
export const readerLineTransition: Transition = { duration: 0.7, ease: "easeInOut" };
export const READER_STEP_MS = 2600; // auto-advance interval

/* ─────────────── Motion lab ─────────────── */
/** M4 quick-add: menu items fly out from the + button; last item first. */
export const quickAddItem: Variants = {
  closed: { opacity: 0, x: 14, y: 26, scale: 0.3, filter: "blur(4px)" },
  open: (i: number) => ({ opacity: 1, x: 0, y: 0, scale: 1, filter: "blur(0px)", transition: { delay: i * 0.05, type: "spring", stiffness: 420, damping: 24 } }),
};
/** M5 PDF tools: dock morphs from a bar into a grid; tools pop in 35ms apart. */
export const toolIn: Variants = {
  initial: { opacity: 0, scale: 0.4, filter: "blur(4px)" },
  animate: (i: number) => ({ opacity: 1, scale: 1, filter: "blur(0px)", transition: { delay: 0.08 + i * 0.035, type: "spring", stiffness: 500, damping: 22 } }),
};
/** M1 code pill: each typed digit. */
export const digit: Variants = {
  initial: { opacity: 0, scale: 0.6, y: 4, filter: "blur(4px)" },
  animate: { opacity: 1, scale: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.26, ease: ease.overshoot } },
};
export const shake = { x: [0, -2, 4, -7, 7, -7, 7, 4, -2, 0], transition: { duration: 0.46 } };

/* ─────────────── Splash timeline (ms). ~1.9s, first launch only ─────────────── */
export const splashTimeline = {
  rings: [0, 120],
  circles: [0, 140, 280],
  markBadge: 300,
  markDraw: 500,
  orbitDots: [700, 820],
  letters: { start: 700, step: 45 },
  loadBar: { start: 400, duration: 1500 },
  tagline: 1200,
  cta: 1700,
};

/* ─────────────── Celebration (canvas-confetti) ─────────────── */
export const confettiOptions = {
  particleCount: 60,
  spread: 70,
  startVelocity: 32,
  gravity: 0.9,
  scalar: 0.9,
  ticks: 160,
  colors: ["#3B82F6", "#DDD0FF", "#BBF0D3", "#111113", "#FFFFFF"],
  shapes: ["circle"] as "circle"[],
  disableForReducedMotion: true, // off by default in canvas-confetti — keep this true
};
