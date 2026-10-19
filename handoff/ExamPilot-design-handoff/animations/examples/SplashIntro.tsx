// Animated splash (≈1.9s). Shows on first launch only; repeat opens skip straight to the app.
// On Expo: keep the native splash with expo-splash-screen preventAutoHideAsync(), render this
// screen, then call SplashScreen.hide() once the first frame is ready.
import { motion, useReducedMotion } from 'motion/react';
import { splashTimeline as T, pressable } from '../motion-variants';

const s = (ms: number) => ms / 1000;
const bloom = (delay: number) => ({
  initial: { opacity: 0, scale: 0.6 },
  animate: { opacity: 1, scale: 1 },
  transition: { delay: s(delay), duration: 0.9, ease: [0.2, 0.9, 0.25, 1.08] as const },
});

export function SplashIntro({ onBegin }: { onBegin: () => void }) {
  const reduce = useReducedMotion();
  const word = 'ExamPilot'.split('');

  return (
    <div className="relative flex min-h-dvh flex-col bg-splash px-6 pb-10 pt-16 text-ink">
      {/* Composition — circles bloom, rings expand, logo draws, two dots orbit */}
      <div aria-hidden className="relative flex-1">
        {[320, 220].map((size, i) => (
          <motion.span key={size} {...bloom(T.rings[i])}
            className="absolute left-1/2 top-[46%] rounded-full border-[1.5px] border-white/60"
            style={{ width: size, height: size, marginLeft: -size / 2, marginTop: -size / 2 }} />
        ))}
        <motion.div className="absolute left-1/2 top-[46%] -ml-40 -mt-40 h-80 w-80"
          animate={reduce ? undefined : { rotate: 360 }} transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}>
          <motion.span {...bloom(T.orbitDots[0])} className="absolute left-[148px] top-[-10px] h-[22px] w-[22px] rounded-full bg-white" />
          <motion.span {...bloom(T.orbitDots[1])} className="absolute left-[10px] top-[210px] h-[14px] w-[14px] rounded-full bg-ink" />
        </motion.div>
        <motion.span {...bloom(T.circles[0])} className="absolute left-[70px] top-[120px] h-[130px] w-[130px] rounded-full bg-art-plum" />
        <motion.span {...bloom(T.circles[1])} className="absolute left-[172px] top-[168px] h-[118px] w-[118px] rounded-full bg-art-pink" />
        <motion.span {...bloom(T.circles[2])} className="absolute left-[112px] top-[236px] h-24 w-24 rounded-full bg-art-mint" />
        <motion.span {...bloom(T.markBadge)} className="absolute left-[155px] top-[190px] flex h-20 w-20 items-center justify-center rounded-[28px] bg-ink">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <motion.path d="M3 11l18-7-7 18-2.5-8.5z" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ delay: s(T.markDraw), duration: 0.7, ease: [0.6, 0, 0.2, 1] }} />
          </svg>
        </motion.span>
      </div>

      <div className="flex flex-col gap-3.5">
        <h1 aria-label="ExamPilot" className="flex text-[60px] font-semibold leading-none tracking-[-0.04em]">
          {word.map((c, i) => (
            <motion.span key={i} aria-hidden initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: s(T.letters.start + i * T.letters.step), duration: 0.6, ease: [0.05, 0.7, 0.1, 1] }}>
              {c}
            </motion.span>
          ))}
        </h1>
        <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: s(T.tagline), duration: 0.6 }}
          className="text-[19px] leading-normal text-se-text">
          Study calm. Exam ready.<br />One topic at a time.
        </motion.p>
        <div aria-hidden className="mt-1.5 h-1 overflow-hidden rounded-full bg-white/60">
          <motion.span className="block h-full origin-left rounded-full bg-ink" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
            transition={{ delay: s(T.loadBar.start), duration: s(T.loadBar.duration), ease: [0.4, 0, 0.2, 1] }} />
        </div>
        <motion.button type="button" onClick={onBegin} {...pressable}
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: s(T.cta), duration: 0.6 }}
          className="mt-3 flex h-16 items-center justify-between rounded-full bg-ink pl-7 pr-2 text-lg font-semibold text-white">
          Let’s begin
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-ink">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </span>
        </motion.button>
      </div>
    </div>
  );
}
