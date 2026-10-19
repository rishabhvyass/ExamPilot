// Replays an entrance without remounting child forms or native PDF views.
import { useEffect, useState, type ReactNode } from 'react';
import {
  Platform,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { BlurVeil } from '../compat';
import { blur as BLUR, duration, ease } from '../motion';

type Props = {
  children: ReactNode;
  index?: number;
  delay?: number;
  soft?: boolean;
  amount?: number;
  ms?: number;
  rise?: number;
  radius?: number;
  style?: StyleProp<ViewStyle>;
  replayKey?: string | number;
  easing?: typeof ease.smooth;
};
export function BlurIn({
  children,
  index = 0,
  delay,
  soft,
  amount,
  ms,
  rise,
  radius = 0,
  style,
  replayKey,
  easing = ease.decelerate,
}: Props) {
  const reduce = useReducedMotion();
  const total = ms ?? (soft ? duration.blurInSoft : duration.blurIn);
  const wait = delay ?? index * duration.staggerStep;
  const start = amount ?? (soft ? BLUR.soft : BLUR.entrance);
  const useBlur = Platform.OS === 'ios' && !reduce && start > 0;
  const progress = useSharedValue(reduce ? 1 : 0);
  const intensity = useSharedValue(useBlur ? start : 0);
  const [veil, setVeil] = useState(useBlur);
  useEffect(() => {
    setVeil(useBlur);
    progress.value = reduce ? 1 : 0;
    intensity.value = useBlur ? start : 0;
    if (!reduce) {
      progress.value = withDelay(
        wait,
        withTiming(1, { duration: total, easing }),
      );
      intensity.value = withDelay(
        wait,
        withTiming(0, { duration: total, easing }, finished => {
          if (finished) scheduleOnRN(setVeil, false);
        }),
      );
    }
    return () => {
      cancelAnimation(progress);
      cancelAnimation(intensity);
    };
  }, [
    replayKey,
    reduce,
    useBlur,
    start,
    wait,
    total,
    easing,
    progress,
    intensity,
  ]);
  const animated = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [
      { translateY: (1 - progress.value) * (rise ?? (soft ? 8 : 12)) },
    ],
  }));
  return (
    <Animated.View style={[style, animated]}>
      {children}
      {veil && (
        <BlurVeil
          level={intensity}
          max={start}
          style={[
            StyleSheet.absoluteFill,
            { borderRadius: radius, overflow: 'hidden' },
          ]}
        />
      )}
    </Animated.View>
  );
}
