// Checklist row (Today, Subjects topics). Whole row is the button (min 60px tall).
// Unchecked: 30px circle with a 2px #C2C9D4 ring. Checked: glossy black circle that pops
// (.9 → 1.12 → 1), white tick draws itself, title turns #6B7385 and a #A0A8B8 strike line grows.
import type { ReactNode } from "react";
import { motion } from "motion/react";
import { checkBox, checkTick, strike } from "../animations/motion";
import { cn } from "./cn";

type Props = { title: string; meta?: ReactNode; checked: boolean; onToggle: () => void };

export function AnimatedCheckbox({ title, meta, checked, onToggle }: Props) {
  const state = checked ? "checked" : "unchecked";
  return (
    <motion.button
      type="button"
      onClick={onToggle}
      aria-pressed={checked}
      whileTap={{ scale: 0.98, filter: "blur(0.4px)" }}
      className="flex min-h-[60px] w-full items-center gap-3.5 rounded-[18px] px-1 py-2 text-left"
    >
      <motion.span
        variants={checkBox}
        initial={false}
        animate={state}
        className={cn(
          "flex h-[30px] w-[30px] flex-none items-center justify-center rounded-full transition-[background,box-shadow] duration-200",
          checked ? "bg-ink-gloss shadow-ink" : "border-2 border-[#C2C9D4]"
        )}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <motion.path d="M5 12l5 5L20 7" variants={checkTick} initial={false} animate={state} />
        </svg>
      </motion.span>
      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="relative self-start">
          <motion.span animate={{ color: checked ? "#6B7385" : "#1B1B1F" }} transition={{ duration: 0.2 }} className="text-[17px] font-medium leading-[1.3]">
            {title}
          </motion.span>
          <motion.span aria-hidden variants={strike} initial={false} animate={state} style={{ transformOrigin: "left" }} className="absolute inset-x-0 top-1/2 h-[1.5px] bg-[#A0A8B8]" />
        </span>
        {meta && <span className="flex items-center gap-2 text-[13px] text-ink-muted">{meta}</span>}
      </span>
    </motion.button>
  );
}
