// Compact versions of the M7 control panel, radar and data grid.
import { useEffect } from 'react';
import { View } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, Path } from 'react-native-svg';
import { C, SUBJ, type SubjectColor } from '../theme';
import { Surface } from './surface';

export function LiveSubjectIcon({
  subject,
  size = 36,
}: {
  subject: SubjectColor;
  size?: number;
}) {
  const focused = useIsFocused();
  const reduce = useReducedMotion();
  const phase = useSharedValue(0);
  useEffect(() => {
    if (focused && !reduce)
      phase.value = withRepeat(
        withTiming(1, {
          duration: subject === 'daa' ? 2600 : subject === 'dds' ? 2200 : 2400,
          easing: Easing.linear,
        }),
        -1,
      );
    else phase.value = 0;
    return () => cancelAnimation(phase);
  }, [focused, reduce, subject, phase]);
  const rotation = useAnimatedStyle(() => ({
    transform: [{ rotate: `${phase.value * 360}deg` }],
  }));
  const pulse = useAnimatedStyle(() => ({
    opacity: 0.55 + 0.45 * Math.sin(phase.value * Math.PI),
  }));
  const c = SUBJ[subject];
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={{ width: size, height: size }}
    >
      <Surface
        kind="sheen"
        subject={subject}
        radius={size * 0.28}
        style={{
          width: size,
          height: size,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {subject === 'daa' ? (
          <>
            <Svg width={size * 0.8} height={size * 0.8} viewBox="0 0 32 32">
              <Circle cx="16" cy="16" r="13" fill="none" stroke={c.mark} />
              <Circle cx="16" cy="16" r="7" fill="none" stroke={c.mark} />
              <Circle cx="22" cy="10" r="2" fill={c.mark} />
            </Svg>
            <Animated.View style={[{ position: 'absolute' }, rotation]}>
              <Svg width={size * 0.8} height={size * 0.8} viewBox="0 0 32 32">
                <Path
                  d="M16 16V3A13 13 0 0 1 29 16Z"
                  fill={c.mark}
                  opacity={0.3}
                />
              </Svg>
            </Animated.View>
          </>
        ) : subject === 'se' ? (
          <Animated.View style={rotation}>
            <Surface
              kind="clay"
              radius={99}
              style={{
                width: size * 0.64,
                height: size * 0.64,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <View
                style={{
                  width: 3,
                  height: size * 0.4,
                  borderRadius: 2,
                  backgroundColor: c.mark,
                }}
              />
            </Surface>
          </Animated.View>
        ) : (
          <Animated.View
            style={[
              {
                width: size * 0.7,
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: 2,
              },
              pulse,
            ]}
          >
            {Array.from({ length: 9 }, (_, i) => (
              <View
                key={i}
                style={{
                  width: size * 0.18,
                  height: size * 0.18,
                  borderRadius: 2,
                  backgroundColor: i % 3 ? c.mark : C.artPink,
                }}
              />
            ))}
          </Animated.View>
        )}
      </Surface>
    </View>
  );
}
