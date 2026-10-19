// BlurReader — the "focus read" from your reference clip (board M9).
// • Lines drift up one at a time every 2.6s; the focused line is centred, bold and black;
//   neighbours turn grey and slightly blurred; far lines blur more; the top & bottom edges
//   fade out through a progressive blur.
// • Bottom toolbar: one soft dock with three glossy-black icon buttons (Notes / Ask Pilo / Saved);
//   the selected one sits in the pressed-in groove, which slides. Switching mode blurs the text
//   out and back in. A separate round pen button toggles a highlighter under the focused line.
// • Tap a line to focus it; the auto-advance pauses while the reader is hovered/touched.
// Use it in the PDF reader ("Focus mode"), revision notes, or the assistant's answers.
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { blurSwap, GROOVE_LAYOUT_ID, grooveTransition, pressableSmall, readerLine, readerLineTransition, readerTrackTransition, READER_STEP_MS } from "../animations/motion";
import { ProgressiveBlur } from "./ProgressiveBlur";
import { cn } from "./cn";

export type ReaderMode = { id: string; label: string; iconPath: string; lines: string[] };

/** Glossy icon gradients — render once anywhere on the page (or inline in the toolbar as here). */
function GlossDefs() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden>
      <defs>
        <linearGradient id="ep-gloss" x1="0" y1="0" x2="0.4" y2="1"><stop offset="0" stopColor="#8A8A90" /><stop offset=".45" stopColor="#2A2A2E" /><stop offset="1" stopColor="#050506" /></linearGradient>
        <linearGradient id="ep-gloss-soft" x1="0" y1="0" x2="0.4" y2="1"><stop offset="0" stopColor="#C4C4C9" /><stop offset=".5" stopColor="#6A6A70" /><stop offset="1" stopColor="#2A2A2E" /></linearGradient>
      </defs>
    </svg>
  );
}

export function BlurReader({ modes, height = 600 }: { modes: ReaderMode[]; height?: number }) {
  const reduce = useReducedMotion();
  const [modeIdx, setModeIdx] = useState(0);
  const [focus, setFocus] = useState(0);
  const [paused, setPaused] = useState(false);
  const [highlight, setHighlight] = useState(false);
  const [offset, setOffset] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const lines = modes[modeIdx].lines;
  const viewport = height - 96; // text area above the toolbar

  // auto-advance
  useEffect(() => {
    if (paused || reduce) return;
    const t = setInterval(() => setFocus((f) => (f + 1) % lines.length), READER_STEP_MS);
    return () => clearInterval(t);
  }, [paused, reduce, lines.length]);

  // centre the focused line (measured, because lines wrap to different heights)
  useLayoutEffect(() => {
    const el = trackRef.current?.children[focus] as HTMLElement | undefined;
    if (el) setOffset(Math.round(viewport / 2 - (el.offsetTop + el.offsetHeight / 2)));
  }, [focus, modeIdx, viewport]);

  const switchMode = (i: number) => { if (i !== modeIdx) { setModeIdx(i); setFocus(0); } };

  return (
    <section
      className="relative overflow-hidden rounded-reader shadow-[inset_0_1px_0_#fff,0_0_0_1px_rgba(0,0,0,.045),0_2px_6px_rgba(0,0,0,.04),0_24px_50px_rgba(0,0,0,.08)]"
      style={{ height, background: "linear-gradient(180deg,#FFFFFF,#F7F7F8)" }}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
    >
      <GlossDefs />
      <div className="absolute inset-x-0 top-0 overflow-hidden" style={{ bottom: 96 }} aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={modes[modeIdx].id} variants={blurSwap} initial="initial" animate="animate" exit="exit" className="absolute inset-0">
            <motion.div ref={trackRef} className="absolute inset-x-[26px] top-0" animate={{ y: offset }} transition={reduce ? { duration: 0 } : readerTrackTransition}>
              {lines.map((t, i) => {
                const d = Math.abs(i - focus);
                const look = readerLine(d);
                return (
                  <motion.p
                    key={i}
                    onClick={() => setFocus(i)}
                    animate={reduce ? { ...look, filter: "blur(0px)" } : look}
                    transition={readerLineTransition}
                    className="mb-[22px] cursor-pointer text-[17px] leading-[1.5]"
                    aria-current={d === 0 ? "true" : undefined}
                  >
                    <span className={cn("ep-highlight", d === 0 && highlight && "is-on")}>{t}</span>
                  </motion.p>
                );
              })}
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="absolute inset-x-0 top-0" style={{ height: viewport }}>
        <ProgressiveBlur side="top" />
        <ProgressiveBlur side="bottom" />
      </div>

      <div className="absolute inset-x-4 bottom-[18px] flex h-16 items-center justify-between">
        <div role="tablist" aria-label="Reader mode" className="flex h-[60px] gap-0.5 rounded-full bg-dock p-[5px] shadow-dock">
          {modes.map((m, i) => {
            const on = i === modeIdx;
            return (
              <motion.button key={m.id} type="button" role="tab" aria-selected={on} aria-label={m.label} onClick={() => switchMode(i)} {...pressableSmall} className="relative flex h-[50px] w-16 items-center justify-center rounded-full">
                {on && <motion.span layoutId={`${GROOVE_LAYOUT_ID}-reader`} transition={grooveTransition} className="absolute inset-0 rounded-full bg-recess shadow-recess" />}
                <motion.svg className="relative" width="24" height="24" viewBox="0 0 24 24" aria-hidden animate={{ scale: on ? 1.08 : 1 }} transition={{ type: "spring", stiffness: 500, damping: 18 }}>
                  <path d={m.iconPath} fill={on ? "url(#ep-gloss)" : "url(#ep-gloss-soft)"} />
                </motion.svg>
              </motion.button>
            );
          })}
        </div>
        <motion.button
          type="button"
          aria-label="Highlight focus line"
          aria-pressed={highlight}
          onClick={() => setHighlight((h) => !h)}
          {...pressableSmall}
          className={cn("flex h-[60px] w-[60px] items-center justify-center rounded-full transition-[background,box-shadow] duration-200", highlight ? "bg-recess shadow-recess" : "bg-clay shadow-dock")}
        >
          <motion.svg width="22" height="22" viewBox="0 0 24 24" aria-hidden animate={{ rotate: highlight ? -18 : 0, scale: highlight ? 1.1 : 1 }} transition={{ type: "spring", stiffness: 420, damping: 16 }}>
            <path d="M20 3c-6 0-11 4-13 10l-2 6 1.2 1.2 6-2C18 16 21 10 21 4zM7.5 16.5L15 9" fill="none" stroke="url(#ep-gloss)" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
          </motion.svg>
        </motion.button>
      </div>
    </section>
  );
}

/** Icon paths used by the three default modes (24×24, filled with the gloss gradient). */
export const READER_ICONS = {
  notes: "M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z",
  ask: "M4 4h12a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H10l-5 4v-4H4a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3zM20 9a3 3 0 0 1 3 3v5a2 2 0 0 1-2 2v3l-3-3h-4",
  saved: "M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z",
};
