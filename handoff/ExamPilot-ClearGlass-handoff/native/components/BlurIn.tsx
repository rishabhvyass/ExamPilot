// BlurIn — the "blurry" entrance from your reference clip, for React Native.
//
// A block rises 12px and fades in (Reanimated `entering`) while a BlurView veil on top of it animates from
// strong blur to 0 and then unmounts — so the block arrives out of focus and sharpens, exactly like
// CSS `filter: blur(10px) → blur(0)`.
//   • iOS: BlurView over the content blurs it directly.
//   • Android 12+ (API 31): the content is wrapped in a BlurTargetView and the BlurView blurs that target.
//   • Android < 12 and "Reduce motion": no blur — plain fade (and no rise with Reduce motion).
//
// Usage — stagger blocks 60ms apart by passing their index:
//   <Screen>
//     <BlurIn index={0}><TopBar/></BlurIn>
//     <BlurIn index={1}><Header/></BlurIn>
//     <BlurIn index={2}><HeroCard/></BlurIn>
//   </Screen>
// Performance rule: wrap BLOCKS (5–10 per screen), never single words or icons.
import { useEffect, useRef, useState, type ComponentRef, type ReactNode } from "react";
import { Platform, StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import Animated, { useAnimatedProps, useReducedMotion, useSharedValue, withDelay, withTiming } from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import { BlurTargetView, BlurView } from "expo-blur";
import { blur as BLUR, duration, ease, riseIn } from "../motion";

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);
const canBlur = Platform.OS === "ios" || (Platform.OS === "android" && Number(Platform.Version) >= 31);

type Props = {
  children: ReactNode;
  /** position in the stagger (60ms steps) */
  index?: number;
  /** explicit delay in ms (overrides index) */
  delay?: number;
  /** rows / results: 8px rise, lighter blur, 260ms */
  soft?: boolean;
  /** override blur intensity (0–100), e.g. BLUR.swap for mode switches */
  amount?: number;
  /** override duration (ms) */
  ms?: number;
  /** rise distance in px (0 = blur + fade only) */
  rise?: number;
  radius?: number;
  style?: StyleProp<ViewStyle>;
};

export function BlurIn({ children, index = 0, delay, soft, amount, ms, rise, radius = 0, style }: Props) {
  const reduce = useReducedMotion();
  const total = ms ?? (soft ? duration.blurInSoft : duration.blurIn);
  const wait = delay ?? 40 + index * duration.staggerStep;
  const start = amount ?? (soft ? BLUR.soft : BLUR.entrance);
  const useBlur = canBlur && !reduce && start > 0;

  const intensity = useSharedValue(useBlur ? start : 0);
  const [veil, setVeil] = useState(useBlur);
  const target = useRef<ComponentRef<typeof View>>(null);

  useEffect(() => {
    if (!useBlur) return;
    intensity.value = withDelay(
      wait,
      withTiming(0, { duration: total, easing: ease.decelerate }, (finished) => {
        if (finished) scheduleOnRN(setVeil, false);
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const blurProps = useAnimatedProps(() => ({ intensity: intensity.value }));
  const entering = reduce ? undefined : riseIn(0, rise ?? (soft ? 8 : 12), total).delay(wait);

  return (
    <Animated.View entering={entering} style={style}>
      {Platform.OS === "android" ? <BlurTargetView ref={target}>{children}</BlurTargetView> : children}
      {veil && (
        <AnimatedBlurView
          pointerEvents="none"
          tint="light"
          animatedProps={blurProps}
          blurTarget={Platform.OS === "android" ? target : undefined}
          blurMethod="dimezisBlurViewSdk31Plus"
          style={[StyleSheet.absoluteFill, { borderRadius: radius, overflow: "hidden" }]}
        />
      )}
    </Animated.View>
  );
}
