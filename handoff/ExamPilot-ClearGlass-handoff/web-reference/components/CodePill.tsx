// CodePill — email verification (board M1). One pill that morphs through four states:
//   "Enter code" button → 6 digit cells (typed digits blur-pop in, caret blinks) →
//   "Verifying…" with a spinner → "Verified ✓".  Wrong code: cells tint error-bg and shake.
// Uses a single hidden <input inputMode="numeric" autoComplete="one-time-code"> so iOS/Android
// can autofill the SMS/email code.
import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { digit, shake, spring } from "../animations/motion";
import { cn } from "./cn";

type Phase = "idle" | "typing" | "checking" | "done";

export function CodePill({ verify }: { verify: (code: string) => Promise<boolean> }) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [code, setCode] = useState("");
  const [bad, setBad] = useState(0); // increment to replay the shake
  const input = useRef<HTMLInputElement>(null);

  async function onChange(v: string) {
    const c = v.replace(/\D/g, "").slice(0, 6);
    setCode(c);
    if (c.length === 6) {
      setPhase("checking");
      const ok = await verify(c);
      if (ok) setPhase("done");
      else { setPhase("typing"); setCode(""); setBad((b) => b + 1); input.current?.focus(); }
    }
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <motion.div
        layout
        transition={spring.layout}
        animate={bad ? shake : undefined}
        key={bad}
        className={cn("relative flex h-[60px] items-center justify-center rounded-full px-2", phase === "done" ? "bg-dds-fill text-dds-text" : "bg-clay shadow-clay")}
        onClick={() => { if (phase === "idle") setPhase("typing"); input.current?.focus(); }}
      >
        <input
          ref={input}
          aria-label="6-digit code"
          inputMode="numeric"
          autoComplete="one-time-code"
          value={code}
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-0 opacity-0"
          disabled={phase === "checking" || phase === "done"}
        />
        <AnimatePresence mode="popLayout" initial={false}>
          {phase === "idle" && (
            <motion.span key="idle" initial={{ opacity: 0, filter: "blur(6px)" }} animate={{ opacity: 1, filter: "blur(0px)" }} exit={{ opacity: 0, filter: "blur(6px)" }} className="px-5 text-[16px] font-semibold text-ink-button">
              Enter code
            </motion.span>
          )}
          {phase === "typing" && (
            <motion.div key="cells" initial={{ opacity: 0, filter: "blur(6px)", scale: 0.96 }} animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }} exit={{ opacity: 0 }} className="flex gap-1.5">
              {Array.from({ length: 6 }).map((_, i) => (
                <span key={i} className={cn("flex h-11 w-10 items-center justify-center rounded-[14px] text-[20px] font-semibold", bad && code.length === 0 ? "bg-error-bg text-error-text" : "bg-white text-ink", i === code.length && "ring-2 ring-ink")}>
                  {code[i] ? <motion.span variants={digit} initial="initial" animate="animate">{code[i]}</motion.span> : i === code.length ? <span className="ep-caret h-5 w-0.5 bg-ink" /> : null}
                </span>
              ))}
            </motion.div>
          )}
          {phase === "checking" && (
            <motion.span key="check" role="status" initial={{ opacity: 0, filter: "blur(6px)" }} animate={{ opacity: 1, filter: "blur(0px)" }} exit={{ opacity: 0 }} className="flex items-center gap-2 px-5 text-[16px] font-semibold">
              <span className="ep-spin h-4 w-4 rounded-full border-2 border-ink border-t-transparent" /> Verifying…
            </motion.span>
          )}
          {phase === "done" && (
            <motion.span key="done" role="status" initial={{ opacity: 0, filter: "blur(6px)", scale: 0.9 }} animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }} className="flex items-center gap-2 px-5 text-[16px] font-semibold">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" aria-hidden><motion.path d="M5 12l5 5L20 7" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} /></svg>
              Verified
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
      {bad > 0 && phase === "typing" && <p role="alert" className="text-[14px] text-error-text">That code didn’t match. Try again.</p>}
    </div>
  );
}
