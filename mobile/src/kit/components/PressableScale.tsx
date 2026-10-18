// PressableScale — the press feel shared by every button.
// Press in: spring to scale .96 (small round buttons .92, rows .98) + opacity .94 + a light haptic.
// Disabled: 45 % opacity, no motion. Reduce motion: no scale, opacity only.
import type { ReactNode } from "react";
import { Pressable, type PressableProps, type StyleProp, type ViewStyle } from "react-native";
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withSpring, withTiming } from "react-native-reanimated";
import { Haptics } from "../compat";
import { press, spring } from "../motion";

const APressable = Animated.createAnimatedComponent(Pressable);

type Props = Omit<PressableProps, "style" | "children"> & {
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
  /** "default" .96 · "small" .92 · "row" .98 */
  amount?: "default" | "small" | "row";
  haptic?: boolean;
};

export function PressableScale({ style, children, amount = "default", haptic = true, disabled, onPressIn, onPressOut, ...rest }: Props) {
  const reduce = useReducedMotion();
  const p = useSharedValue(0);
  const target = amount === "small" ? press.scaleSmall : amount === "row" ? press.scaleRow : press.scale;
  const a = useAnimatedStyle(() => ({
    opacity: 1 - (1 - press.opacity) * p.value,
    transform: [{ scale: reduce ? 1 : 1 - (1 - target) * p.value }],
  }));
  return (
    <APressable
      accessibilityRole="button"
      disabled={disabled}
      onPressIn={(e) => {
        p.value = withSpring(1, spring.press);
        if (haptic) Haptics.selectionAsync().catch(() => {});
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        p.value = withSpring(0, spring.press);
        onPressOut?.(e);
      }}
      style={[style, a, disabled ? { opacity: 0.45 } : null]}
      {...rest}
    >
      {children}
    </APressable>
  );
}

/** Small helper for one-off timing animations elsewhere. */
export const fade = (to: number, ms = 200) => withTiming(to, { duration: ms });
