// ExamPilot — Motion for React presets (npm i motion; import from "motion/react").
// Wrap the app once in <MotionConfig reducedMotion="user"> so movement/scale become instant
// for people who prefer reduced motion. Opacity, colour and pathLength still animate.
import type { Transition, Variants } from 'motion/react';

export const ease = {
  standard: [0.2, 0, 0, 1] as const,
  decelerate: [0.05, 0.7, 0.1, 1] as const,
  smooth: [0.2, 0.8, 0.2, 1] as const,
  overshoot: [0.2, 0.9, 0.25, 1.05] as const,
  accelerate: [0.3, 0, 1, 1] as const,
};

export const spring = {
  press: { type: 'spring', stiffness: 500, damping: 30 } satisfies Transition,
  layout: { type: 'spring', stiffness: 400, damping: 34 } satisfies Transition,
  progress: { type: 'spring', stiffness: 300, damping: 30 } satisfies Transition,
  pop: { type: 'spring', stiffness: 600, damping: 18 } satisfies Transition,
};

/** Screen / tab change. Use with <AnimatePresence mode="wait" initial={false}> keyed by route. */
export const page: Variants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.36, ease: ease.smooth } },
  exit: { opacity: 0, y: -6, transition: { duration: 0.14, ease: ease.accelerate } },
};

/** Lists and onboarding fields rise in one after another. */
export const stagger: Variants = { animate: { transition: { staggerChildren: 0.06, delayChildren: 0.04 } } };
export const rise: Variants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.48, ease: ease.decelerate } },
};

/** Buttons: lift on hover, squeeze on press. Spread onto any motion.button / motion.a. */
export const pressable = {
  whileHover: { y: -1 },
  whileTap: { scale: 0.97 },
  transition: spring.press,
};

/** Bottom nav: the black pill is one shared element that slides between tabs. */
export const TAB_PILL_LAYOUT_ID = 'ep-tab-pill';
export const tabPillTransition: Transition = spring.layout;
export const tabLabel: Variants = {
  initial: { opacity: 0, x: -6 },
  animate: { opacity: 1, x: 0, transition: { delay: 0.12, duration: 0.3, ease: ease.decelerate } },
};

/** Checkbox: box pops, tick draws, title gets a strike-through line. */
export const checkBox: Variants = {
  unchecked: { scale: 1, backgroundColor: 'rgba(0,0,0,0)' },
  checked: { scale: [0.9, 1.12, 1], backgroundColor: '#1B1B1F', transition: { duration: 0.26, ease: ease.standard } },
};
export const checkTick: Variants = {
  unchecked: { pathLength: 0, opacity: 0 },
  checked: { pathLength: 1, opacity: 1, transition: { delay: 0.06, duration: 0.22, ease: 'easeOut' } },
};
export const strike: Variants = {
  unchecked: { scaleX: 0 },
  checked: { scaleX: 1, transition: { duration: 0.24, ease: ease.smooth } },
}; // render as an absolutely-positioned 1.5px line with transformOrigin: 'left'

/** Segmented progress: each segment fills with a spring. */
export const segment: Variants = {
  off: { scaleX: 0 },
  on: { scaleX: 1, transition: spring.progress },
};

/** Accordion answer (Questions). */
export const accordion: Variants = {
  closed: { height: 0, opacity: 0, transition: { duration: 0.2, ease: ease.standard } },
  open: { height: 'auto', opacity: 1, transition: { height: { duration: 0.25, ease: ease.smooth }, opacity: { delay: 0.08, duration: 0.2 } } },
};

/** Bottom sheet + scrim (Add material). */
export const sheet: Variants = {
  closed: { y: '100%' },
  open: { y: 0, transition: { type: 'spring', stiffness: 380, damping: 36 } },
};
export const scrim: Variants = { closed: { opacity: 0 }, open: { opacity: 1, transition: { duration: 0.26 } } };

/** Chat bubbles. */
export const message: Variants = {
  initial: { opacity: 0, y: 10, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.36, ease: ease.overshoot } },
};

/** Chart bars grow from the bottom, staggered 120ms. */
export const bar = (i: number): Variants => ({
  initial: { scaleY: 0 },
  animate: { scaleY: 1, transition: { delay: i * 0.12, duration: 0.8, ease: ease.smooth } },
});

/** PDF page turn — direction 1 = next, -1 = previous. Use AnimatePresence custom={direction}. */
export const pageTurn: Variants = {
  enter: (d: number) => ({ opacity: 0, x: 40 * d, rotate: 2 * d }),
  center: { opacity: 1, x: 0, rotate: 0, transition: { duration: 0.42, ease: ease.smooth } },
  exit: (d: number) => ({ opacity: 0, x: -30 * d, transition: { duration: 0.18 } }),
};

/** Splash intro timeline (ms). Total ≈ 1.9s; skip entirely on repeat opens. */
export const splashTimeline = {
  rings: [0, 120],
  circles: [0, 140, 280],
  markBadge: 300,
  markDraw: 500,       // logo path draws over 700ms
  orbitDots: [700, 820],
  letters: { start: 700, step: 45 },
  loadBar: { start: 400, duration: 1500 },
  tagline: 1200,
  cta: 1700,
};

/** Celebration (plan ready, finished PDF, all tasks done). Use canvas-confetti with these. */
export const confettiOptions = {
  particleCount: 60,
  spread: 70,
  startVelocity: 32,
  gravity: 0.9,
  scalar: 0.9,
  ticks: 160,
  colors: ['#8C7BB5', '#E9C4CC', '#BFE0D8', '#1B1B1F', '#FFFFFF'],
  shapes: ['circle'] as ('circle')[],
  disableForReducedMotion: true, // off by default in canvas-confetti — keep this true
};
