// Checklist row: round box pops and the tick draws itself; the title fades to muted and
// gets a strike-through line that grows from the left. Whole row is the hit target (≥ 60px).
import { motion } from 'motion/react';
import { checkBox, checkTick, strike } from '../motion-variants';

type Props = {
  title: string;
  meta?: React.ReactNode; // e.g. <SubjectTag code="SE" /> · 25 min
  checked: boolean;
  onToggle: () => void;
};

export function AnimatedCheckbox({ title, meta, checked, onToggle }: Props) {
  const state = checked ? 'checked' : 'unchecked';
  return (
    <motion.button
      type="button"
      onClick={onToggle}
      aria-pressed={checked}
      whileTap={{ scale: 0.98 }}
      className="flex min-h-[60px] w-full items-center gap-3.5 rounded-[18px] px-1 py-2 text-left"
    >
      <motion.span
        variants={checkBox}
        initial={false}
        animate={state}
        className={`flex h-[30px] w-[30px] flex-none items-center justify-center rounded-full ${checked ? '' : 'border-2 border-[#BDB8AE]'}`}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <motion.path d="M5 12l5 5L20 7" variants={checkTick} initial={false} animate={state} />
        </svg>
      </motion.span>
      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="relative self-start">
          <motion.span
            animate={{ color: checked ? '#77727F' : '#1B1B1F' }}
            transition={{ duration: 0.2 }}
            className="text-[17px] font-medium leading-snug"
          >
            {title}
          </motion.span>
          <motion.span
            aria-hidden
            variants={strike}
            initial={false}
            animate={state}
            style={{ transformOrigin: 'left' }}
            className="absolute left-0 right-0 top-1/2 h-[1.5px] bg-[#A9A4B0]"
          />
        </span>
        {meta && <span className="flex items-center gap-2 text-[13px] text-ink-muted">{meta}</span>}
      </span>
    </motion.button>
  );
}
