// GooeyIsland — board M2. A black "study island" at the top of Today (like Dynamic Island).
// A small blob sits next to the pill; when a status arrives they melt together (SVG goo filter)
// and the pill stretches to show the message; content blurs in. States:
//   idle → alert ("SE in 3 days · tap to focus") → focus (ring timer) → done ✓ → idle
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

export type IslandState = { kind: "idle" } | { kind: "message"; icon?: ReactNode; text: string; trailing?: ReactNode };

/** Render once near the root: the goo filter used by the island. */
export function GooFilter() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden>
      <filter id="ep-goo">
        <feGaussianBlur in="SourceGraphic" stdDeviation="7" result="b" />
        <feColorMatrix in="b" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -10" />
      </filter>
    </svg>
  );
}

export function GooeyIsland({ state, onTap }: { state: IslandState; onTap?: () => void }) {
  const reduce = useReducedMotion();
  const open = state.kind === "message";
  const W = open ? 340 : 126, H = open ? 56 : 36;
  const spr = { type: "spring" as const, stiffness: 380, damping: 26 };
  return (
    <button type="button" onClick={onTap} aria-live="polite" aria-label={open ? state.text : "Study status"} className="relative mx-auto block" style={{ width: W + 50, height: H + 20 }}>
      <span aria-hidden className="absolute inset-0" style={{ filter: reduce ? undefined : "url(#ep-goo)" }}>
        <motion.span className="absolute left-1/2 top-[10px] -translate-x-1/2 bg-black" animate={{ width: W, height: H, borderRadius: H / 2 }} transition={spr} />
        <motion.span className="absolute top-[10px] h-9 w-9 rounded-full bg-black" animate={{ left: open ? "50%" : `calc(50% + ${W / 2 + 8}px)`, opacity: open ? 0 : 1 }} transition={spr} />
      </span>
      <AnimatePresence>
        {open && (
          <motion.span key={state.text} initial={{ opacity: 0, x: -6, filter: "blur(6px)" }} animate={{ opacity: 1, x: 0, filter: "blur(0px)", transition: { delay: 0.16, duration: 0.36 } }} exit={{ opacity: 0, filter: "blur(6px)" }}
            className="absolute inset-x-[35px] top-[10px] flex h-14 items-center gap-3 px-3 text-left text-[14px] font-semibold text-white">
            {state.icon}
            <span className="flex-1 truncate">{state.text}</span>
            {state.trailing}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
