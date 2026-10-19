// ExamPilot "Clear Glass" — motion presets for React Native (Reanimated 4.7 + react-native-worklets 0.13).
// npx expo install react-native-reanimated react-native-worklets
// Everything respects the OS "Reduce motion" setting: Reanimated presets use ReduceMotion.System,
// and components check useReducedMotion() for loops, blur, auto-advance and confetti.
import { Easing, ReduceMotion, Keyframe, FadeIn, FadeOut, LinearTransition, type WithSpringConfig } from "react-native-reanimated";

/* ─────────────── Easing (same cubic-béziers as the design) ─────────────── */
export const ease = {
  standard: Easing.bezier(0.2, 0, 0, 1),
  decelerate: Easing.bezier(0.05, 0.7, 0.1, 1),
  smooth: Easing.bezier(0.2, 0.8, 0.2, 1),
  overshoot: Easing.bezier(0.2, 0.9, 0.25, 1.08),
  springy: Easing.bezier(0.3, 1.25, 0.45, 1),
  scroll: Easing.bezier(0.65, 0, 0.25, 1), // blur-reader track
  accelerate: Easing.bezier(0.3, 0, 1, 1),
  draw: Easing.bezier(0.6, 0, 0.2, 1),
  inOut: Easing.inOut(Easing.ease),
};

/* ─────────────── Springs (stiffness / damping identical to the web spec, mass 1) ─────────────── */
const s = (stiffness: number, damping: number): WithSpringConfig => ({ stiffness, damping, mass: 1, reduceMotion: ReduceMotion.System });
export const spring = {
  press: s(500, 30),
  layout: s(400, 34), // tab groove, segmented slider, dock morph
  progress: s(300, 30),
  sheet: s(380, 36),
  pop: s(600, 18),
  icon: s(500, 18),
  pen: s(420, 16),
  island: s(380, 26),
  quickAdd: s(420, 24),
  tool: s(500, 22),
};

/* ─────────────── Durations (ms) ─────────────── */
export const duration = {
  blurIn: 480, blurInSoft: 260, page: 360, pageExit: 140, blurSwap: 520,
  tabLabelDelay: 180, tabLabel: 320, tabGrow: 520, check: 260, tick: 220, strike: 240,
  accordion: 250, message: 360, bar: 800, barStagger: 120, pageTurn: 420,
  readerTrack: 900, readerLine: 700, readerStep: 2600, veil: 260,
  staggerStep: 60,
};

/* ─────────────── Blur amounts ───────────────
   RN has no cross-platform CSS `filter: blur()` on views (iOS keeps it behind an experimental flag,
   Android needs API 31+). We get the same look with an expo-blur <BlurView> veil over the element
   whose intensity animates to 0 (see components/BlurIn.tsx). `intensity` is 0–100 in expo-blur;
   these map the design's px values to intensities that look the same on a 3× iPhone. */
export const blur = {
  entrance: 28, // CSS 10px
  soft: 22, // CSS 8px (rows)
  letter: 34, // CSS 12px (splash letters)
  swap: 40, // CSS 14px (mode / subject swap)
  veil: 40, // CSS 14px (quick-add backdrop)
  glass: 40, // CSS 22px saturate 1.6 (glass cards)
};

/* ─────────────── Press (every button) ───────────────
   Web: scale .96 + blur .6px. Native: scale .96 + opacity .94 + a light haptic — the .6px blur is
   invisible on a phone and costs a blur pass, so it is replaced by the haptic tick. */
export const press = { scale: 0.96, scaleSmall: 0.92, scaleRow: 0.98, opacity: 0.94 } as const;

/* ─────────────── Layout animations ─────────────── */
/** Blur-in rise for a block. Pair with <BlurIn> which adds the blur veil. */
export const riseIn = (index = 0, distance = 12, ms = duration.blurIn) =>
  new Keyframe({
    0: { opacity: 0, transform: [{ translateY: distance }] },
    100: { opacity: 1, transform: [{ translateY: 0 }], easing: ease.decelerate },
  })
    .duration(ms)
    .delay(40 + index * duration.staggerStep)
    .reduceMotion(ReduceMotion.System);

export const riseOut = new Keyframe({
  0: { opacity: 1, transform: [{ translateY: 0 }] },
  100: { opacity: 0, transform: [{ translateY: -6 }], easing: ease.accelerate },
}).duration(160);

/** Tab bar: the active tab grows 56 → full width in 520ms with a tiny overshoot (measured from the live design). */
export const tabGrow = LinearTransition.duration(520).easing(Easing.bezier(0.2, 0.9, 0.25, 1.04)).reduceMotion(ReduceMotion.System);
/** Tab label: fades + slides 6pt from the left, 320ms, starting 180ms after the tab starts growing. */
export const tabLabelTiming = { duration: 320, delay: 180 } as const;

/** Groove / dock / list re-layouts. */
export const layout = LinearTransition.springify().stiffness(400).damping(34).reduceMotion(ReduceMotion.System);

export const fadeIn = (ms = 260, delay = 0) => FadeIn.duration(ms).delay(delay).reduceMotion(ReduceMotion.System);
export const fadeOut = (ms = 160) => FadeOut.duration(ms);

/** Chat bubble. */
export const messageIn = new Keyframe({
  0: { opacity: 0, transform: [{ translateY: 10 }, { scale: 0.98 }] },
  100: { opacity: 1, transform: [{ translateY: 0 }, { scale: 1 }], easing: ease.overshoot },
}).duration(duration.message);

/** M4 quick-add item: flies out of the + button. Pass the reversed index so the last item comes first. */
export const quickAddItemIn = (i: number) =>
  new Keyframe({
    0: { opacity: 0, transform: [{ translateX: 14 }, { translateY: 26 }, { scale: 0.3 }] },
    100: { opacity: 1, transform: [{ translateX: 0 }, { translateY: 0 }, { scale: 1 }], easing: ease.overshoot },
  })
    .duration(340)
    .delay(i * 50);
export const quickAddItemOut = new Keyframe({
  0: { opacity: 1, transform: [{ translateX: 0 }, { translateY: 0 }, { scale: 1 }] },
  100: { opacity: 0, transform: [{ translateX: 14 }, { translateY: 26 }, { scale: 0.3 }] },
}).duration(200);

/** M5 tool dock: extra tools pop in 35ms apart. */
export const toolIn = (i: number) =>
  new Keyframe({
    0: { opacity: 0, transform: [{ scale: 0.4 }] },
    100: { opacity: 1, transform: [{ scale: 1 }], easing: ease.overshoot },
  })
    .duration(320)
    .delay(80 + i * 35);

/** M1 typed digit. */
export const digitIn = new Keyframe({
  0: { opacity: 0, transform: [{ scale: 0.6 }, { translateY: 4 }] },
  100: { opacity: 1, transform: [{ scale: 1 }, { translateY: 0 }], easing: ease.overshoot },
}).duration(260);

/** M3 onboarding: card drops in with a little rotation. */
export const dropIn = (delay = 0, rotate = -6) =>
  new Keyframe({
    0: { opacity: 0, transform: [{ translateY: -60 }, { rotate: `${rotate * 2}deg` }] },
    70: { opacity: 1, transform: [{ translateY: 6 }, { rotate: `${rotate * -0.3}deg` }] },
    100: { opacity: 1, transform: [{ translateY: 0 }, { rotate: `${rotate}deg` }] },
  })
    .duration(760)
    .delay(delay);

/** Pop (badges, finish card). */
export const popIn = (delay = 0) =>
  new Keyframe({
    0: { opacity: 0, transform: [{ scale: 0.6 }] },
    60: { opacity: 1, transform: [{ scale: 1.08 }] },
    100: { opacity: 1, transform: [{ scale: 1 }] },
  })
    .duration(560)
    .delay(delay);

/** Splash circles bloom. */
export const bloom = (delay: number) =>
  new Keyframe({
    0: { opacity: 0, transform: [{ scale: 0.6 }] },
    100: { opacity: 1, transform: [{ scale: 1 }], easing: ease.overshoot },
  })
    .duration(900)
    .delay(delay)
    .reduceMotion(ReduceMotion.System);

/* ─────────────── Blur reader ─────────────── */
/** Look of a line by its distance from the focused line. `blur` is in px of the design. */
export function readerLine(distance: number) {
  if (distance === 0) return { color: "#111113", weight: 700 as const, blur: 0, opacity: 1 };
  if (distance === 1) return { color: "#6E6E74", weight: 500 as const, blur: 0.4, opacity: 1 };
  if (distance <= 3) return { color: "#A6A6AC", weight: 500 as const, blur: 1.6, opacity: 1 };
  return { color: "#A6A6AC", weight: 500 as const, blur: 1.6, opacity: 0 };
}

/* ─────────────── Shake (wrong code) — translateX steps over 460ms ─────────────── */
export const SHAKE_STEPS = [0, -2, 4, -7, 7, -7, 7, 4, -2, 0];

/* ─────────────── Splash timeline (ms) ─────────────── */
export const splashTimeline = {
  circles: [0, 140, 280],
  markBadge: 300,
  markDraw: 500,
  orbitDot: 820,
  letters: { start: 700, step: 45 },
  loadBar: { start: 400, duration: 1500 },
  tagline: 1200,
  cta: 1700,
};

/* ─────────────── Confetti (react-native-fast-confetti) ─────────────── */
export const confetti = {
  count: 60,
  colors: ["#3B82F6", "#DDD0FF", "#BBF0D3", "#111113", "#FFFFFF"],
  reduceMotion: { mode: "system" as const, factor: 0 }, // factor 0 = no confetti with Reduce motion
};
