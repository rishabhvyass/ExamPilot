// One calm confetti burst (checklist done, plan ready, PDF finished). Never for streaks.
import { useEffect, useState } from 'react';
import { AccessibilityInfo, Dimensions, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

const COLORS = ['#8C7BB5', '#E9C4CC', '#BFE0D8', '#1B1B1F', '#FFFFFF'];
type Origin = { x: number; y: number };
let fire: ((o: Origin) => void) | null = null;

export function celebrate(origin: Origin = { x: 0.5, y: 0.35 }) {
  AccessibilityInfo.isReduceMotionEnabled()
    .then(reduce => {
      if (!reduce) fire?.(origin);
    })
    .catch(() => {});
}

export function ConfettiHost() {
  const [burst, setBurst] = useState<{ id: number; o: Origin } | null>(null);
  useEffect(() => {
    fire = o => setBurst({ id: Date.now(), o });
    return () => {
      fire = null;
    };
  }, []);
  useEffect(() => {
    if (!burst) return;
    const t = setTimeout(() => setBurst(null), 1800);
    return () => clearTimeout(t);
  }, [burst]);
  if (!burst) return null;
  const { width, height } = Dimensions.get('window');
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {Array.from({ length: 60 }).map((_, i) => (
        <Piece
          key={`${burst.id}-${i}`}
          i={i}
          x={burst.o.x * width}
          y={burst.o.y * height}
        />
      ))}
    </View>
  );
}
function Piece({ i, x, y }: { i: number; x: number; y: number }) {
  const t = useSharedValue(0);
  const angle = (-90 + (Math.random() - 0.5) * 70) * (Math.PI / 180);
  const speed = 160 + Math.random() * 200;
  const dx = Math.cos(angle) * speed + (Math.random() - 0.5) * 120;
  const dy = Math.sin(angle) * speed;
  const size = 6 + Math.random() * 5;
  useEffect(() => {
    t.value = withDelay(
      Math.random() * 80,
      withTiming(1, { duration: 1500, easing: Easing.out(Easing.quad) }),
    );
  }, [t]);
  const a = useAnimatedStyle(() => ({
    opacity: 1 - t.value * t.value,
    transform: [
      { translateX: dx * t.value },
      { translateY: dy * t.value + 420 * t.value * t.value },
    ],
  }));
  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          left: x,
          top: y,
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: COLORS[i % COLORS.length],
        },
        a,
      ]}
    />
  );
}
