// IconButton — round clay button with one icon (search, more, back, eye, prev/next, attach…).
//   tone="soft"  clay circle (default)          tone="ink"  glossy black circle (↗ on hero cards, ⊕, send)
//   pressed      shows the pressed-in recess groove (toggles: password eye, highlighter, pen)
//   size         56 default · 52 onboarding back · 44–48 inside cards
// Always pass `label` — it becomes the accessibilityLabel.
import type { ReactNode } from "react";
import { PressableScale } from "./PressableScale";
import { Surface } from "./Surface";

type Props = { label: string; children: ReactNode; onPress?: () => void; size?: number; tone?: "soft" | "ink"; pressed?: boolean; disabled?: boolean };

export function IconButton({ label, children, onPress, size = 56, tone = "soft", pressed, disabled }: Props) {
  const kind = pressed ? "recess" : tone === "ink" ? "ink" : "clay";
  return (
    <PressableScale
      amount="small"
      onPress={onPress}
      disabled={disabled}
      accessibilityLabel={label}
      accessibilityState={{ selected: pressed, disabled }}
      hitSlop={size < 44 ? (44 - size) / 2 : undefined}
    >
      <Surface kind={kind} style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
        {children}
      </Surface>
    </PressableScale>
  );
}
