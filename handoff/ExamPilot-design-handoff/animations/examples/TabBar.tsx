// Floating bottom nav: the active tab is a black pill with icon + label; the pill slides
// between tabs as one shared element (layoutId). Inactive tabs are 56px round buttons.
import { motion, LayoutGroup } from 'motion/react';
import { TAB_PILL_LAYOUT_ID, tabPillTransition, tabLabel, spring } from '../motion-variants';

export type TabId = 'today' | 'calendar' | 'subjects' | 'questions';

const TABS: { id: TabId; label: string; icon: JSX.Element }[] = [
  { id: 'today', label: 'Today', icon: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M6.3 17.7l-1.4 1.4M19.1 4.9l-1.4 1.4" /></> },
  { id: 'calendar', label: 'Calendar', icon: <><rect x="3" y="5" width="18" height="16" rx="4" /><path d="M16 3v4M8 3v4M3 10h18" /></> },
  { id: 'subjects', label: 'Subjects', icon: <><circle cx="7" cy="7" r="3.5" /><circle cx="17" cy="7" r="3.5" /><circle cx="7" cy="17" r="3.5" /><circle cx="17" cy="17" r="3.5" /></> },
  { id: 'questions', label: 'Questions', icon: <><rect x="3" y="4" width="18" height="16" rx="5" /><path d="M8 10h8M8 14h5" /></> },
];

export function TabBar({ active, onChange }: { active: TabId; onChange: (t: TabId) => void }) {
  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-5 bottom-6 z-40 flex items-center gap-2 rounded-full border border-white bg-white/80 p-2 shadow-nav backdrop-blur-md"
      style={{ marginBottom: 'env(safe-area-inset-bottom)' }}
    >
      <LayoutGroup>
        {TABS.map((t) => {
          const isActive = t.id === active;
          return (
            <motion.button
              key={t.id}
              type="button"
              layout
              transition={spring.press}
              whileTap={{ scale: 0.92 }}
              onClick={() => onChange(t.id)}
              aria-current={isActive ? 'page' : undefined}
              aria-label={isActive ? undefined : t.label}
              className={`relative flex h-14 items-center justify-center rounded-full ${
                isActive ? 'flex-1 gap-2 px-5 text-white' : 'w-14 flex-none border border-[#E4E1DA] bg-surface-muted text-ink hover:bg-white'
              }`}
            >
              {isActive && (
                <motion.span layoutId={TAB_PILL_LAYOUT_ID} transition={tabPillTransition} className="absolute inset-0 rounded-full bg-ink" />
              )}
              <svg className="relative" width={isActive ? 20 : 22} height={isActive ? 20 : 22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                {t.icon}
              </svg>
              {isActive && (
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
