// QuickAddMenu — board M4. A glossy black + button (bottom-right, above the tab bar).
// Tapping it blurs the whole screen behind a white veil (backdrop-filter 14px) and the menu
// items fly out of the button one after another (last item first), each blurring into focus.
// The + rotates 45° into ×. Tap the veil or × to close. Esc closes too.
import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { quickAddItem, spring } from "../animations/motion";

export type QuickAction = { id: string; label: string; icon: ReactNode; onSelect: () => void };

export function QuickAddMenu({ actions }: { actions: QuickAction[] }) {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, []);
  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            key="veil"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.26 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 bg-white/55"
            style={{ backdropFilter: reduce ? undefined : "blur(14px)", WebkitBackdropFilter: reduce ? undefined : "blur(14px)" }}
          />
        )}
      </AnimatePresence>
      <div className="fixed bottom-[112px] right-5 z-50 flex flex-col items-end gap-3">
        <AnimatePresence>
          {open &&
            actions.map((a, i) => (
              <motion.button
                key={a.id}
                type="button"
                custom={actions.length - 1 - i}
                variants={quickAddItem}
                initial="closed"
                animate="open"
                exit="closed"
                onClick={() => { setOpen(false); a.onSelect(); }}
                className="flex h-14 items-center gap-3 rounded-full bg-clay pl-5 pr-2 text-[16px] font-semibold text-ink-button shadow-clay"
              >
                {a.label}
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-ink-gloss text-white shadow-ink">{a.icon}</span>
              </motion.button>
            ))}
        </AnimatePresence>
        <motion.button
          type="button"
          aria-label={open ? "Close quick add" : "Quick add"}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          whileTap={{ scale: 0.92, filter: "blur(0.6px)" }}
          className="flex h-16 w-16 items-center justify-center rounded-full bg-ink-gloss text-white shadow-ink"
        >
          <motion.svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" animate={{ rotate: open ? 45 : 0 }} transition={spring.press} aria-hidden>
            <path d="M12 5v14M5 12h14" />
          </motion.svg>
        </motion.button>
      </div>
    </>
  );
}
