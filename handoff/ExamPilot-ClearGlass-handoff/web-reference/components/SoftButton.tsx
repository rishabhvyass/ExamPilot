// SoftButton — the button style from your reference clip. Use it for EVERY button.
//
//  variant="primary"   62px soft white pill, black 18/600 label, glossy black arrow chip on the right
//  variant="secondary" 56px soft pill, centred label (Google, "Take photo", "Adjust with study assistant")
//  variant="outline"   transparent pill with 1.5px #CBD2DC border (inactive semester chips, filters)
//  variant="dashed"    dashed #CBD2DC border ("Add topic", "Add an exam we missed")
//  variant="ink"       glossy black pill, white label (selected chips, "Sign in" selected state)
//
//  Press: scale .96 + 0.6px blur. Hover: lift 1px. Disabled: 45% opacity, no motion.
import { forwardRef, type ReactNode } from "react";
import { motion, type HTMLMotionProps } from "motion/react";
import { pressable } from "../animations/motion";
import { cn } from "./cn";

type Variant = "primary" | "secondary" | "outline" | "dashed" | "ink";

const base =
  "relative inline-flex select-none items-center rounded-full font-sans font-semibold " +
  "focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-ink " +
  "disabled:pointer-events-none disabled:opacity-45";

const styles: Record<Variant, string> = {
  primary: "h-[62px] w-full justify-between pl-7 pr-2 text-[18px] text-ink-button bg-clay shadow-clay",
  secondary: "h-14 justify-center gap-3 px-6 text-[17px] text-ink-button bg-clay shadow-clay",
  outline: "h-12 justify-center gap-2 px-5 text-[16px] text-ink border-[1.5px] border-line-strong bg-transparent",
  dashed: "h-[52px] justify-center gap-2 px-5 text-[15px] text-ink border-[1.5px] border-dashed border-line-strong bg-transparent",
  ink: "h-12 justify-center gap-2 px-5 text-[16px] text-white bg-ink-gloss shadow-ink",
};

export function ArrowChip({ size = 46, icon }: { size?: 46 | 48; icon?: ReactNode }) {
  return (
    <span
      aria-hidden
      className="flex flex-none items-center justify-center rounded-full bg-ink-gloss text-white shadow-ink"
      style={{ width: size, height: size }}
    >
      {icon ?? (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      )}
    </span>
  );
}

type Props = Omit<HTMLMotionProps<"button">, "children"> & {
  variant?: Variant;
  children: ReactNode;
  /** primary only: replaces the arrow inside the glossy chip */
  chipIcon?: ReactNode;
  leading?: ReactNode;
};

export const SoftButton = forwardRef<HTMLButtonElement, Props>(function SoftButton(
  { variant = "primary", children, chipIcon, leading, className, type = "button", ...rest },
  ref
) {
  return (
    <motion.button ref={ref} type={type} {...pressable} className={cn(base, styles[variant], className)} {...rest}>
      {leading}
      <span>{children}</span>
      {variant === "primary" && <ArrowChip icon={chipIcon} />}
    </motion.button>
  );
});
