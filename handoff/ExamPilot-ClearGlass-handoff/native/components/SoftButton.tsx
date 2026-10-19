// SoftButton — the button from your reference clip. Use it for EVERY text button.
//
//  variant="primary"   62px clay pill, black 18/600 label 28px from the left, 46px glossy black arrow chip 8px from the right
//  variant="secondary" 56px clay pill, centred 17/600 label (Google, "Take photo", "Adjust with study assistant")
//  variant="outline"   transparent pill, 1.5px #CBD2DC border (unselected chips / semester)
//  variant="dashed"    dashed 1.5px #CBD2DC border ("Add topic", "Add an exam we missed")
//  variant="ink"       glossy black pill, white 16/600 label (selected chips, "✓ Revised")
//
//  large  → 64px primary with a 48px chip (splash "Let's begin")
import type { ReactNode } from "react";
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from "react-native";
import { PressableScale } from "./PressableScale";
import { Surface } from "./Surface";
import { Icon, ICON } from "./Icon";
import { color, fontFamily, size } from "../theme";

type Variant = "primary" | "secondary" | "outline" | "dashed" | "ink";

export function ArrowChip({ large = false, icon }: { large?: boolean; icon?: ReactNode }) {
  const d = large ? size.arrowChipLarge : size.arrowChip;
  return (
    <Surface kind="ink" style={{ width: d, height: d, alignItems: "center", justifyContent: "center" }}>
      {icon ?? <Icon d={ICON.arrowRight} size={20} strokeWidth={2.2} color="#FFFFFF" />}
    </Surface>
  );
}

type Props = {
  variant?: Variant;
  children: ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  large?: boolean;
  /** primary: icon inside the glossy chip instead of the arrow */
  chipIcon?: ReactNode;
  /** icon before the label (Google G, camera…) */
  leading?: ReactNode;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
  /** e.g. Google button needs a 1px #747775 border */
  borderColor?: string;
};

export function SoftButton({ variant = "primary", children, onPress, disabled, large, chipIcon, leading, style, accessibilityLabel, borderColor }: Props) {
  const label = (txtColor: string, fs: number) =>
    typeof children === "string" ? <Text style={{ fontFamily: fontFamily[600], fontSize: fs, color: txtColor }}>{children}</Text> : children;

  let body: ReactNode;
  if (variant === "primary") {
    const h = large ? size.primaryButtonLarge : size.primaryButton;
    body = (
      <Surface kind="clay" style={[styles.row, { height: h, paddingLeft: 28, paddingRight: 8, justifyContent: "space-between" }]}>
        <View style={styles.inner}>{leading}{label(color.inkButton, 18)}</View>
        <ArrowChip large={large} icon={chipIcon} />
      </Surface>
    );
  } else if (variant === "secondary") {
    body = (
      <Surface kind="clay" style={[styles.row, { height: 56, paddingHorizontal: 24, justifyContent: "center", gap: 12 }, borderColor ? { borderWidth: 1, borderColor } : null]}>
        {leading}{label(color.inkButton, 17)}
      </Surface>
    );
  } else if (variant === "ink") {
    body = (
      <Surface kind="ink" style={[styles.row, { height: 48, paddingHorizontal: 20, justifyContent: "center", gap: 8 }]}>
        {leading}{label("#FFFFFF", 16)}
      </Surface>
    );
  } else {
    const dashed = variant === "dashed";
    body = (
      <View style={[styles.row, { height: dashed ? 52 : 48, paddingHorizontal: 20, justifyContent: "center", gap: 8, borderRadius: 9999, borderWidth: 1.5, borderColor: color.lineStrong, borderStyle: dashed ? "dashed" : "solid" }]}>
        {leading}{label(color.ink, dashed ? 15 : 16)}
      </View>
    );
  }

  return (
    <PressableScale onPress={onPress} disabled={disabled} style={style} accessibilityLabel={accessibilityLabel ?? (typeof children === "string" ? children : undefined)} accessibilityState={{ disabled }}>
      {body}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", borderRadius: 9999 },
  inner: { flexDirection: "row", alignItems: "center", gap: 10 },
});
