// GlassCard — every white card on the white ground is a frosted glass pane.
// SubjectCard — a card tinted in the subject colour with a glass sheen on top.
import type { HTMLAttributes } from "react";
import { cn } from "./cn";

export function GlassCard({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-card bg-glass p-5 shadow-glass", className)} {...rest} />;
}

export type SubjectCode = "SE" | "DAA" | "DDS";
const tint: Record<SubjectCode, string> = { SE: "bg-sheen-se", DAA: "bg-sheen-daa", DDS: "bg-sheen-dds" };

export function SubjectCard({ subject, className, ...rest }: HTMLAttributes<HTMLDivElement> & { subject: SubjectCode }) {
  return <div className={cn("rounded-card p-2 shadow-sheen", tint[subject], className)} {...rest} />;
}

/** Small subject tag: "SE" in the subject fill + text colour. */
export function SubjectTag({ subject }: { subject: SubjectCode }) {
  const c = { SE: "bg-se-fill text-se-text", DAA: "bg-daa-fill text-daa-text", DDS: "bg-dds-fill text-dds-text" }[subject];
  return <span className={cn("inline-flex items-center rounded-full px-[9px] py-0.5 text-[13px] font-semibold", c)}>{subject}</span>;
}
