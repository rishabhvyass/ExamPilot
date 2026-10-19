// Animated splash (≈1.9s, first launch only). Pure white ground. Blue / violet / green circles
// bloom, a glossy black logo tile pops and its paper-plane draws, letters blur-rise one by one,
// a thin black bar loads, then the soft "Let's begin" button blurs in.
import { motion, useReducedMotion } from "motion/react";
import { splashTimeline as T } from "../animations/motion";
import { SoftButton } from "./SoftButton";

const s = (ms: number) => ms / 1000;
const bloom = (delay: number) => ({
  initial: { opacity: 0, scale: 0.6 },
  animate: { opacity: 1, scale: 1 },
  transition: { delay: s(delay), duration: 0.9, ease: [0.2, 0.9, 0.25, 1.08] as const },
});
const blurRise = (delay: number, y = 10, blur = 8) => ({
  initial: { opacity: 0, y, filter: `blur(${blur}px)` },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  transition: { delay: s(delay), duration: 0.6, ease: [0.05, 0.7, 0.1, 1] as const },
});

export function SplashIntro({ onBegin }: { onBegin: () => void }) {
  const reduce = useReducedMotion();
  const word = "ExamPilot".split("");
  return (
    <div className="relative flex min-h-dvh flex-col bg-white px-6 pb-10 pt-16 text-ink">
      <div aria-hidden className="relative flex-1">
        <motion.div className="absolute left-1/2 top-[46%] -ml-40 -mt-40 h-80 w-80" animate={reduce ? undefined : { rotate: 360 }} transition={{ duration: 14, repeat: Infinity, ease: "linear" }}>
          <motion.span {...bloom(T.orbitDots[1])} className="absolute left-[10px] top-[210px] h-[14px] w-[14px] rounded-full bg-ink-gloss" />
        </motion.div>
        <motion.span {...bloom(T.circles[0])} className="absolute left-[70px] top-[120px] h-[130px] w-[130px] rounded-full bg-art-blue" />
        <motion.span {...bloom(T.circles[1])} className="absolute left-[172px] top-[168px] h-[118px] w-[118px] rounded-full bg-art-violet" />
        <motion.span {...bloom(T.circles[2])} className="absolute left-[112px] top-[236px] h-24 w-24 rounded-full bg-art-green" />
        <motion.span {...bloom(T.markBadge)} className="absolute left-[155px] top-[190px] flex h-20 w-20 items-center justify-center rounded-[28px] bg-ink-gloss shadow-ink">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <motion.path d="M3 11l18-7-7 18-2.5-8.5z" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: s(T.markDraw), duration: 0.7, ease: [0.6, 0, 0.2, 1] }} />
          </svg>
        </motion.span>
      </div>

      <div className="flex flex-col gap-3.5">
        <h1 aria-label="ExamPilot" className="flex text-[60px] font-semibold leading-none tracking-[-0.04em]">
          {word.map((c, i) => (
            <motion.span key={i} aria-hidden {...blurRise(T.letters.start + i * T.letters.step, 22, 12)}>{c}</motion.span>
          ))}
        </h1>
        <motion.p {...blurRise(T.tagline)} className="text-[19px] leading-normal text-se-text">
          Study calm. Exam ready.<br />One topic at a time.
        </motion.p>
        <div aria-hidden className="mt-1.5 h-1 overflow-hidden rounded-full bg-line">
          <motion.span className="block h-full origin-left rounded-full bg-ink-gloss" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: s(T.loadBar.start), duration: s(T.loadBar.duration), ease: [0.4, 0, 0.2, 1] }} />
        </div>
        <motion.div {...blurRise(T.cta)} className="mt-3">
          <SoftButton variant="primary" className="h-16" onClick={onBegin}>Let’s begin</SoftButton>
        </motion.div>
      </div>
    </div>
  );
}
