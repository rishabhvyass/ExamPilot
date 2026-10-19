// SegmentedControl — Login "Sign in | Create account" (and any 2–3 option switch).
// White pill track (6px padding); the selected option sits on a glossy black slider that
// slides with a spring; its label turns white.
import { motion } from "motion/react";
import { spring } from "../animations/motion";
import { cn } from "./cn";

type Props<T extends string> = { options: readonly { value: T; label: string }[]; value: T; onChange: (v: T) => void; label: string };

export function SegmentedControl<T extends string>({ options, value, onChange, label }: Props<T>) {
  return (
    <div role="group" aria-label={label} className="relative grid rounded-full bg-white p-1.5" style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0,1fr))` }}>
      {options.map((o) => {
        const on = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            aria-pressed={on}
            onClick={() => onChange(o.value)}
            className={cn("relative h-12 rounded-full text-[16px] font-semibold transition-colors duration-200", on ? "text-white" : "text-ink")}
          >
            {on && <motion.span layoutId="ep-seg-slider" transition={spring.layout} className="absolute inset-0 rounded-full bg-ink-gloss shadow-ink" />}
            <span className="relative">{o.label}</span>
          </button>
        );
      })}
    </div>
  );
}
