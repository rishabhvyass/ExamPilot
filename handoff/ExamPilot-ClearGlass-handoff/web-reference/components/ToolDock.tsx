// ToolDock — board M5 (PDF reader tools). A soft white bar with 4 tools + a round "more"
// button. Tapping "more" morphs the bar into a grid panel (width/height/radius spring) and
// the extra tools pop in 35ms apart, blurring into focus. Tap again (×) to collapse.
import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { pressableSmall, spring, toolIn } from "../animations/motion";
import { cn } from "./cn";

export type Tool = { id: string; label: string; icon: ReactNode; active?: boolean; onSelect: () => void };

export function ToolDock({ primary, more }: { primary: Tool[]; more: Tool[] }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      layout
      transition={spring.layout}
      className={cn("bg-dock shadow-dock", open ? "rounded-[30px] p-4" : "rounded-full p-1.5")}
      style={{ width: open ? 340 : "auto" }}
    >
      <div className="flex items-center gap-1">
        {primary.map((t) => (
          <motion.button key={t.id} type="button" aria-label={t.label} aria-pressed={t.active} onClick={t.onSelect} {...pressableSmall}
            className={cn("flex h-12 w-12 items-center justify-center rounded-full text-ink-button", t.active && "bg-recess shadow-recess")}>
            {t.icon}
          </motion.button>
        ))}
        <motion.button type="button" aria-label={open ? "Fewer tools" : "More tools"} aria-expanded={open} onClick={() => setOpen((o) => !o)} {...pressableSmall}
          className="ml-auto flex h-12 w-12 items-center justify-center rounded-full bg-ink-gloss text-white shadow-ink">
          <motion.svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" animate={{ rotate: open ? 45 : 0 }} transition={spring.press} aria-hidden>
            <path d="M12 5v14M5 12h14" />
          </motion.svg>
        </motion.button>
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div key="grid" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0, filter: "blur(6px)" }} className="overflow-hidden">
            <div className="grid grid-cols-4 gap-2 pt-3">
              {more.map((t, i) => (
                <motion.button key={t.id} type="button" custom={i} variants={toolIn} initial="initial" animate="animate" onClick={t.onSelect}
                  className="flex flex-col items-center gap-1.5 rounded-[18px] bg-clay py-3 text-[12px] font-semibold text-ink-button shadow-clay">
                  {t.icon}
                  {t.label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
