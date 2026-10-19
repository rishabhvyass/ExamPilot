// TabBar — floating bottom nav, exactly four tabs.
// Look (from your reference clip): one soft white dock; inactive tabs are flat 56px icons;
// the active tab sits in a pressed-in grey groove that stretches to show icon + label.
// The groove is ONE shared element (layoutId) that slides between tabs.
import { motion, LayoutGroup } from "motion/react";
import type { ReactElement } from "react";
import { GROOVE_LAYOUT_ID, grooveTransition, tabLabel, spring } from "../animations/motion";
import { cn } from "./cn";

export type TabId = "today" | "calendar" | "subjects" | "questions";

const TABS: { id: TabId; label: string; icon: ReactElement }[] = [
  { id: "today", label: "Today", icon: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M6.3 17.7l-1.4 1.4M19.1 4.9l-1.4 1.4" /></> },
  { id: "calendar", label: "Calendar", icon: <><rect x="3" y="5" width="18" height="16" rx="4" /><path d="M16 3v4M8 3v4M3 10h18" /></> },
  { id: "subjects", label: "Subjects", icon: <><circle cx="7" cy="7" r="3.5" /><circle cx="17" cy="7" r="3.5" /><circle cx="7" cy="17" r="3.5" /><circle cx="17" cy="17" r="3.5" /></> },
  { id: "questions", label: "Questions", icon: <><rect x="3" y="4" width="18" height="16" rx="5" /><path d="M8 10h8M8 14h5" /></> },
];

export function TabBar({ active, onChange }: { active: TabId; onChange: (t: TabId) => void }) {
  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-5 bottom-6 z-40 mx-auto flex max-w-[440px] items-center gap-2 rounded-full bg-dock p-2 shadow-dock"
      style={{ marginBottom: "env(safe-area-inset-bottom)" }}
    >
      <LayoutGroup>
        {TABS.map((t) => {
          const on = t.id === active;
          return (
            <motion.button
              key={t.id}
              type="button"
              layout
              transition={spring.press}
              whileTap={{ scale: 0.92, filter: "blur(0.6px)" }}
              onClick={() => onChange(t.id)}
              aria-current={on ? "page" : undefined}
              aria-label={on ? undefined : t.label}
              className={cn(
                "relative flex h-14 items-center justify-center rounded-full text-ink-button",
                on ? "flex-1 gap-2 px-5" : "w-14 flex-none hover:bg-white"
              )}
            >
              {on && (
                <motion.span
                  layoutId={GROOVE_LAYOUT_ID}
                  transition={grooveTransition}
                  className="absolute inset-0 rounded-full bg-recess shadow-recess"
                />
              )}
              <svg className="relative" width={on ? 20 : 22} height={on ? 20 : 22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                {t.icon}
              </svg>
              {on && (
                <motion.span key={t.id} variants={tabLabel} initial="initial" animate="animate" className="relative text-base font-semibold">
                  {t.label}
                </motion.span>
              )}
            </motion.button>
          );
        })}
      </LayoutGroup>
    </nav>
  );
}
