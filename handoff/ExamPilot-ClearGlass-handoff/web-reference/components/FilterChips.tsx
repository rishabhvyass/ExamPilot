// FilterChips — SE / DAA / DDS (and All) chips on Subjects, Questions, Materials.
// Selected chip = glossy black with white text. Others = transparent with 1.5px #CBD2DC ring.
// A leading plain 52px white circle with the filter icon is decorative (aria-hidden).
import { motion } from "motion/react";
import { pressableSmall } from "../animations/motion";
import { cn } from "./cn";

type Props<T extends string> = {
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
  label: string; // e.g. "Filter questions by subject"
};

export function FilterChips<T extends string>({ options, value, onChange, label }: Props<T>) {
  return (
    <div role="group" aria-label={label} className="flex items-center gap-2 overflow-x-auto pb-1">
      <span aria-hidden className="flex h-[52px] w-[52px] flex-none items-center justify-center rounded-full bg-white text-ink">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M4 7h16M7 12h10M10 17h4" /></svg>
      </span>
      {options.map((o) => {
        const on = o === value;
        return (
          <motion.button
            key={o}
            type="button"
            aria-pressed={on}
            onClick={() => onChange(o)}
            {...pressableSmall}
            className={cn(
              "h-[52px] flex-none rounded-full px-5 text-[16px] font-semibold transition-[background,color,box-shadow] duration-200",
              on ? "bg-ink-gloss text-white shadow-ink" : "border-[1.5px] border-line-strong bg-transparent text-ink"
            )}
          >
            {o}
          </motion.button>
        );
      })}
    </div>
  );
}
