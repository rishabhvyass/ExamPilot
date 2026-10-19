// React Native CLI replacements for the three Expo modules the handoff kit imports:
// expo-linear-gradient, expo-blur, expo-haptics.
import { forwardRef, type ComponentProps } from 'react';
import Animated, { useAnimatedStyle, type SharedValue } from 'react-native-reanimated';
import { Platform, View, type ViewProps } from 'react-native';
import { BlurView as RNBlurView } from '@react-native-community/blur';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

// RN 0.88's native background gradient also resizes correctly inside animated
// absolute-fill views. BVLinearGradient can leave those views white on Fabric.
export function LinearGradient({ colors, locations, start = { x: .5, y: 0 }, end = { x: .5, y: 1 }, style, ...rest }: ViewProps & {
  colors: readonly string[]; locations?: readonly number[];
  start?: { x: number; y: number }; end?: { x: number; y: number };
}) {
  const angle = Math.atan2(end.x - start.x, start.y - end.y) * 180 / Math.PI;
  const stops = colors.map((c, i) => `${c} ${(locations?.[i] ?? i / Math.max(1, colors.length - 1)) * 100}%`).join(', ');
  return <View {...rest} style={[style, { experimental_backgroundImage: `linear-gradient(${angle}deg, ${stops})` }]} />;
}

/** expo-blur API (`intensity` 0–100, `tint`) on top of @react-native-community/blur. */
export const BlurView = forwardRef<unknown, ViewProps & { intensity?: number; tint?: 'light' | 'dark' | 'default' }>(
  ({ intensity = 40, tint = 'light', style, ...rest }, _ref) => {
    // Android has no cheap live blur on a white page; the translucent gradient the kit draws on top is enough.
    if (Platform.OS !== 'ios') return null;
    return (
      <RNBlurView
        {...(rest as ComponentProps<typeof RNBlurView>)}
        style={style}
        blurType={tint === 'dark' ? 'dark' : 'light'}
        blurAmount={Math.max(1, Math.min(100, intensity))}
        reducedTransparencyFallbackColor="#FFFFFF"
      />
    );
  },
);

const fire = (type: Parameters<typeof ReactNativeHapticFeedback.trigger>[0]) =>
  ReactNativeHapticFeedback.trigger(type, {
    enableVibrateFallback: false,
    ignoreAndroidSystemSettings: false,
  });
export const Haptics = {
  selectionAsync: async () => fire('selection'),
  impactAsync: async (_style?: string) => fire('impactLight'),
  notificationAsync: async (_type?: string) => fire('notificationSuccess'),
  ImpactFeedbackStyle: { Light: 'impactLight', Medium: 'impactMedium', Heavy: 'impactHeavy' },
  NotificationFeedbackType: { Success: 'notificationSuccess', Warning: 'notificationWarning', Error: 'notificationError' },
};

/**
 * A blur whose strength animates on the UI thread. The native blur view is fixed at `max`; its opacity follows
 * `level / max`, which cross-fades the blurred layer in or out (reads the same as animating the radius).
 */
export function BlurVeil({
  level,
  max = 40,
  tint = 'light',
  style,
}: {
  level: SharedValue<number>;
  max?: number;
  tint?: 'light' | 'dark';
  style?: ViewProps['style'];
}) {
  const a = useAnimatedStyle(() => ({ opacity: Math.min(1, Math.max(0, level.value / max)) }));
  return (
    <Animated.View pointerEvents="none" style={[style, a]}>
      <BlurView intensity={max} tint={tint} style={{ flex: 1 }} />
    </Animated.View>
  );
}
