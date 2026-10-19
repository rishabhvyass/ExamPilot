import {
  useId,
  useState,
  type ReactNode,
  type ButtonHTMLAttributes,
} from "react";
import { motion, AnimatePresence, LayoutGroup } from "motion/react";
import { useNavigate } from "react-router-dom";
import {
  pressable,
  segment,
  checkBox,
  checkTick,
  strike,
  sheet as sheetV,
  scrim,
  TAB_PILL_LAYOUT_ID,
  tabPillTransition,
  tabLabel,
  spring,
} from "../lib/motion";
import type { SubjectColor } from "../data/types";

/* ---------- Icons ---------- */
const raw = import.meta.glob("../assets/icons/*.svg", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;
const icons: Record<string, string> = {};
for (const [p, v] of Object.entries(raw))
  icons[p.split("/").pop()!.replace(".svg", "")] = v.replace(
    / width="\d+" height="\d+"/,
    ' width="100%" height="100%"',
  );
export function Icon({
  name,
  size = 22,
  className = "",
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={`inline-flex flex-none ${className}`}
      style={{ width: size, height: size }}
      dangerouslySetInnerHTML={{ __html: icons[name] ?? "" }}
    />
  );
}

/* ---------- Subject styling ---------- */
export const SUBJ: Record<
  SubjectColor,
  {
    fill: string;
    deep: string;
    text: string;
    mark: string;
    markHex: string;
    art: string;
  }
> = {
  se: {
    fill: "bg-se-fill",
    deep: "bg-se-deep",
    text: "text-se-text",
    mark: "bg-se-mark",
    markHex: "#7D6BAA",
    art: "hero-card-art-lavender",
  },
  daa: {
    fill: "bg-daa-fill",
    deep: "bg-daa-deep",
    text: "text-daa-text",
    mark: "bg-daa-mark",
    markHex: "#B86A7A",
    art: "hero-card-art-pink",
  },
  dds: {
    fill: "bg-dds-fill",
    deep: "bg-dds-deep",
    text: "text-dds-text",
    mark: "bg-dds-mark",
    markHex: "#4F9686",
    art: "hero-card-art-mint",
  },
};
const art = import.meta.glob("../assets/illustrations/*.svg", {
  query: "?url",
  import: "default",
  eager: true,
}) as Record<string, string>;
export const illo = (n: string) => art[`../assets/illustrations/${n}.svg`];
export const colorOf = (id: string): SubjectColor =>
  id in SUBJ ? (id as SubjectColor) : "se";

/* ---------- Buttons ---------- */
export function PrimaryButton({
  children,
  onClick,
  disabled,
  type = "button",
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
}) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      {...pressable}
      className="flex h-16 w-full items-center justify-between rounded-full bg-ink pl-7 pr-2 text-lg font-semibold text-white disabled:opacity-50"
    >
      {children}
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-ink">
        <Icon name="arrow-right" size={20} />
      </span>
    </motion.button>
  );
}
export function SecondaryButton({
  children,
  onClick,
  variant = "white",
  icon,
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "white" | "outline" | "dashed";
  icon?: string;
}) {
  const v = {
    white: "bg-white",
    outline: "border-[1.5px] border-line-strong",
    dashed: "border-[1.5px] border-dashed border-line-strong",
  }[variant];
  return (
    <motion.button
      type="button"
      onClick={onClick}
      {...pressable}
      className={`flex h-14 w-full items-center justify-center gap-2 rounded-full px-6 text-base font-semibold ${v}`}
    >
      {icon && <Icon name={icon} size={20} />}
      {children}
    </motion.button>
  );
}
export function IconButton({
  icon,
  label,
  onClick,
  size = 56,
  dark = false,
  tone = "white",
}: {
  icon: string;
  label: string;
  onClick?: () => void;
  size?: number;
  dark?: boolean;
  tone?: "white" | "lavender" | "outline";
}) {
  const bg = dark
    ? "bg-ink text-white"
    : tone === "lavender"
      ? "bg-se-fill text-se-text"
      : tone === "outline"
        ? "border-[1.5px] border-line-strong"
        : "bg-white";
  return (
    <motion.button
      type="button"
      aria-label={label}
      onClick={onClick}
      {...pressable}
      style={{ width: size, height: size }}
      className={`flex flex-none items-center justify-center rounded-full ${bg}`}
    >
      <Icon name={icon} size={22} />
    </motion.button>
  );
}
export function Chip({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <motion.button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      {...pressable}
      className={`h-[52px] flex-none rounded-full px-6 text-base ${active ? "bg-ink font-semibold text-white" : "border-[1.5px] border-line-strong font-medium"}`}
    >
      {children}
    </motion.button>
  );
}
export function FilterRow({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto py-1 [scrollbar-width:none]">
      <span
        aria-hidden
        className="flex h-[52px] w-[52px] flex-none items-center justify-center rounded-full bg-white"
      >
        <Icon name="filter" size={20} />
      </span>
      {children}
    </div>
  );
}

/* ---------- Layout ---------- */
export function TopBar({
  back,
  onSearch,
}: {
  back?: boolean | string;
  onSearch?: () => void;
}) {
  const nav = useNavigate();
  return (
    <div className="flex items-center gap-2 pt-[60px]">
      {back ? (
        <IconButton
          icon="chevron-left"
          label="Back"
          onClick={() => (typeof back === "string" ? nav(back) : nav(-1))}
        />
      ) : (
        <span
          aria-label="Profile"
          role="img"
          className="flex h-14 w-14 items-center justify-center rounded-full bg-se-fill text-se-text"
        >
          <Icon name="user" />
        </span>
      )}
      <span className="flex-1" />
      <IconButton icon="search" label="Search" onClick={onSearch} />
      {!back && <IconButton icon="more-horizontal" label="More" />}
    </div>
  );
}
export function ScreenHeader({
  eyebrow,
  title,
  live,
}: {
  eyebrow: string;
  title: ReactNode;
  live?: boolean;
}) {
  return (
    <header className="px-1 pb-4 pt-3.5">
      <p className="text-xl font-medium text-ink-muted">{eyebrow}</p>
      <h1
        aria-live={live ? "polite" : undefined}
        className="max-w-[330px] text-display"
      >
        {title}
      </h1>
    </header>
  );
}
export const Card = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) => (
  <section className={`rounded-card bg-white p-[22px] ${className}`}>
    {children}
  </section>
);
export function InfoCard({
  children,
  tone = "dds",
  icon = "info",
}: {
  children: ReactNode;
  tone?: "dds" | "se" | "info" | "headsup";
  icon?: string;
}) {
  const c = {
    dds: "bg-dds-fill text-dds-text",
    se: "bg-se-fill text-se-text",
    info: "bg-info-fill text-info-text",
    headsup: "bg-headsup-fill text-headsup-text",
  }[tone];
  return (
    <div
      className={`flex items-start gap-3 rounded-[22px] p-4 text-[15px] leading-snug ${c}`}
    >
      <Icon name={icon} size={20} className="mt-0.5" />
      {children}
    </div>
  );
}
export const SubjectTag = ({
  code,
  color,
}: {
  code: string;
  color: SubjectColor;
}) => (
  <span
    className={`rounded-full px-[9px] py-0.5 text-[13px] font-semibold ${SUBJ[color].fill} ${SUBJ[color].text}`}
  >
    {code}
  </span>
);
export function SubjectRow({
  color,
  code,
  title,
  meta,
  onClick,
}: {
  color: SubjectColor;
  code: string;
  title: string;
  meta: string;
  onClick?: () => void;
}) {
  const s = SUBJ[color];
  return (
    <motion.button
      type="button"
      onClick={onClick}
      {...pressable}
      className={`flex w-full items-center gap-4 rounded-full p-2 pr-6 text-left ${s.fill} ${s.text}`}
    >
      <span
        className={`flex h-[52px] w-[52px] flex-none items-center justify-center rounded-full text-sm font-semibold ${s.deep}`}
      >
        {code}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-base font-semibold text-ink">
          {title}
        </span>
        <span className="block text-sm">{meta}</span>
      </span>
    </motion.button>
  );
}
export function SegmentedProgress({
  total,
  done,
  tint = false,
  h = 6,
}: {
  total: number;
  done: number;
  tint?: boolean;
  h?: number;
}) {
  return (
    <div
      className="flex gap-1.5"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={total}
      aria-valuenow={done}
    >
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={`flex-1 overflow-hidden rounded-full ${tint ? "bg-white/75" : "bg-track"}`}
          style={{ height: h }}
        >
          <motion.span
            className="block h-full origin-left rounded-full bg-ink"
            initial={false}
            variants={segment}
            animate={i < done ? "on" : "off"}
          />
        </span>
      ))}
    </div>
  );
}
export function HeroCard({
  color,
  eyebrow,
  title,
  desc,
  stats,
  footer,
  action,
  children,
}: {
  color: SubjectColor;
  eyebrow?: string;
  title: string;
  desc: string;
  stats: { label: string; value: string; foot?: string }[];
  footer?: ReactNode;
  action: ReactNode;
  children?: ReactNode;
}) {
  const s = SUBJ[color];
  return (
    <section className={`rounded-card p-2 ${s.fill} ${s.text}`}>
      <div className="flex items-start justify-between gap-3 px-4 pb-4 pt-3.5">
        <div>
          {eyebrow && <p className="text-[15px] font-medium">{eyebrow}</p>}
          <h2 className="text-card-title text-ink">{title}</h2>
          <p className="mt-1 text-[15px]">{desc}</p>
        </div>
        <IconButton
          icon="more-horizontal"
          label="More options"
          tone="outline"
          size={48}
        />
      </div>
      <div
        className={`relative flex h-[172px] overflow-hidden rounded-panel ${s.deep}`}
      >
        {stats.map((st) => (
          <div
            key={st.label}
            className="flex flex-1 flex-col justify-between border-r border-black/10 px-4 py-4"
          >
            <span className="text-[15px]">{st.label}</span>
            <span>
              <span className="block text-stat text-ink">{st.value}</span>
              {st.foot && <span className="mt-2 block text-sm">{st.foot}</span>}
            </span>
          </div>
        ))}
        <div className="relative flex-1">
          <img
            src={illo(s.art)}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
        <div className="absolute bottom-3 right-3">{action}</div>
      </div>
      {footer && <div className="px-3 pb-3 pt-4">{footer}</div>}
      {children}
    </section>
  );
}
export const ArrowUpRightButton = ({
  onClick,
  label,
}: {
  onClick: () => void;
  label: string;
}) => (
  <motion.button
    type="button"
    aria-label={label}
    onClick={onClick}
    {...pressable}
    className="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-ink text-white"
  >
    <Icon name="arrow-up-right" size={20} />
  </motion.button>
);
export function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  autoComplete,
  trailing,
  error,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  trailing?: ReactNode;
  error?: string;
}) {
  const id = useId();
  return (
    <div>
      <div className="ep-field flex items-center rounded-input bg-surface-input px-5 py-3">
        <div className="min-w-0 flex-1">
          <label
            htmlFor={id}
            className="block text-[13px] font-semibold text-ink-muted"
          >
            {label}
          </label>
          <input
            id={id}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            type={type}
            placeholder={placeholder}
            autoComplete={autoComplete}
            className="w-full bg-transparent text-[17px] outline-none placeholder:text-ink-subtle"
          />
        </div>
        {trailing}
      </div>
      {error && (
        <p
          role="alert"
          className="mt-2 rounded-full bg-error-fill px-4 py-1.5 text-sm text-error-text"
        >
          {error}
        </p>
      )}
    </div>
  );
}
export function StepHeader({
  step,
  onBack,
}: {
  step: 1 | 2 | 3;
  onBack: () => void;
}) {
  return (
    <div className="flex items-center gap-4 pt-[60px]">
      <IconButton icon="chevron-left" label="Back" onClick={onBack} size={52} />
      <div className="flex-1">
        <SegmentedProgress total={3} done={step} h={6} />
      </div>
      <span className="text-sm font-semibold text-ink-muted">{step} of 3</span>
    </div>
  );
}
export function BottomSheet({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center"
          role="dialog"
          aria-modal
          aria-label={title}
        >
          <motion.button
            aria-label="Close"
            onClick={onClose}
            variants={scrim}
            initial="closed"
            animate="open"
            exit="closed"
            className="absolute inset-0 bg-[rgba(27,27,31,.32)]"
          />
          <motion.div
            variants={sheetV}
            initial="closed"
            animate="open"
            exit="closed"
            className="relative w-full max-w-[480px] rounded-t-sheet bg-white px-6 pb-10 pt-3 shadow-sheet"
          >
            <div className="mx-auto mb-4 h-[5px] w-11 rounded-full bg-line-strong" />
            <h2 className="mb-4 text-section">{title}</h2>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

/* ---------- Checkbox row ---------- */
export function AnimatedCheckbox({
  title,
  meta,
  checked,
  onToggle,
}: {
  title: string;
  meta?: ReactNode;
  checked: boolean;
  onToggle: () => void;
}) {
  const state = checked ? "checked" : "unchecked";
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
        className={`flex h-[30px] w-[30px] flex-none items-center justify-center rounded-full ${checked ? "" : "border-2 border-[#BDB8AE]"}`}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#fff"
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <motion.path
            d="M5 12l5 5L20 7"
            variants={checkTick}
            initial={false}
            animate={state}
          />
        </svg>
      </motion.span>
      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="relative self-start">
          <motion.span
            animate={{ color: checked ? "#77727F" : "#1B1B1F" }}
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
            style={{ transformOrigin: "left" }}
            className="absolute left-0 right-0 top-1/2 h-[1.5px] bg-[#A9A4B0]"
          />
        </span>
        {meta && (
          <span className="flex items-center gap-2 text-[13px] text-ink-muted">
            {meta}
          </span>
        )}
      </span>
    </motion.button>
  );
}

/* ---------- Tab bar ---------- */
export type TabId = "today" | "calendar" | "subjects" | "questions";
const TABS: { id: TabId; label: string; icon: string }[] = [
  { id: "today", label: "Today", icon: "nav-today-sun" },
  { id: "calendar", label: "Calendar", icon: "nav-calendar" },
  { id: "subjects", label: "Subjects", icon: "nav-subjects-grid" },
  { id: "questions", label: "Questions", icon: "nav-questions" },
];
export function TabBar({ active }: { active: TabId }) {
  const nav = useNavigate();
  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-6 z-40"
      style={{ marginBottom: "env(safe-area-inset-bottom)" }}
    >
      <nav
        aria-label="Main"
        className="pointer-events-auto mx-5 flex items-center gap-2 rounded-full border border-white bg-white/80 p-2 shadow-nav backdrop-blur-md min-[480px]:mx-auto min-[480px]:max-w-[440px]"
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
                whileTap={{ scale: 0.92 }}
                onClick={() => nav("/" + t.id)}
                aria-current={on ? "page" : undefined}
                aria-label={on ? undefined : t.label}
                className={`relative flex h-14 items-center justify-center rounded-full ${on ? "flex-1 gap-2 px-5 text-white" : "w-14 flex-none border border-line bg-surface-muted hover:bg-white"}`}
              >
                {on && (
                  <motion.span
                    layoutId={TAB_PILL_LAYOUT_ID}
                    transition={tabPillTransition}
                    className="absolute inset-0 rounded-full bg-ink"
                  />
                )}
                <Icon name={t.icon} size={on ? 20 : 22} className="relative" />
                {on && (
                  <motion.span
                    key={t.id}
                    variants={tabLabel}
                    initial="initial"
                    animate="animate"
                    className="relative text-base font-semibold"
                  >
                    {t.label}
                  </motion.span>
                )}
              </motion.button>
            );
          })}
        </LayoutGroup>
      </nav>
    </div>
  );
}
export function useToggle(init = false) {
  const [v, s] = useState(init);
  return [v, () => s((x) => !x), s] as const;
}
export type { ButtonHTMLAttributes };
