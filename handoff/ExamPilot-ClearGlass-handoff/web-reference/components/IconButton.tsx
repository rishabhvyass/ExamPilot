// IconButton — round soft button (back, search, more, edit, eye toggle, prev/next month…).
// Sizes: 56 (top bars), 52 (onboarding back), 44–48 (inside cards).
// tone="soft"   raised clay circle (default)
// tone="ink"    glossy black circle with white icon (↗ on hero cards, ⊕ add session, send)
// pressed       shows the pressed-in groove (use for toggles like the highlighter / pen)
import type { ReactNode } from "react";
import { motion, type HTMLMotionProps } from "motion/react";
import { pressableSmall } from "../animations/motion";
import { cn } from "./cn";

type Props = Omit<HTMLMotionProps<"button">, "children"> & {
  label: string; // required — icon-only buttons need an accessible name
  size?: 44 | 48 | 52 | 56 | 60;
  tone?: "soft" | "ink";
  pressed?: boolean;
  children: ReactNode; // a 20–22px SVG icon
};

export function IconButton({ label, size = 56, tone = "soft", pressed, children, className, type = "button", ...rest }: Props) {
  const look =
    tone === "ink"
      ? "bg-ink-gloss text-white shadow-ink"
      : pressed
        ? "bg-recess text-ink-button shadow-recess"
        : "bg-clay text-ink-button shadow-clay";
  return (
    <motion.button
      type={type}
      aria-label={label}
      aria-pressed={pressed}
      {...pressableSmall}
      className={cn(
        "inline-flex flex-none items-center justify-center rounded-full transition-[background,box-shadow] duration-200",
        "focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-ink",
        look,
        className
      )}
      style={{ width: size, height: size }}
      {...rest}
    >
      {children}
    </motion.button>
  );
}
