import { AnimatedMaterialView } from './surface';
// Single-choice group with the login switch's motion: one glossy black pill springs to the
// measured frame of the selected option (works across wrapped rows too), and labels swap colour.
import { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, View, type ViewStyle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useColors, INK } from '../theme';
import { Haptics } from '../kit/compat';
import { Icon, Txt } from './ui';

// Minimal motion: a short ease-out glide, no spring overshoot.
const GLIDE = { duration: 220, easing: Easing.out(Easing.cubic) };
const APressable = Animated.createAnimatedComponent(Pressable);

/** One option: a barely-there press (scale .98) so taps feel acknowledged without popping. */
function Option({
  children,
  style,
  ...p
}: React.ComponentProps<typeof Pressable> & { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  const s = useSharedValue(1);
  const a = useAnimatedStyle(() => ({ transform: [{ scale: s.value }] }));
  return (
    <APressable
      {...p}
      onPressIn={e => {
        if (!reduce) s.value = withTiming(0.98, { duration: 90 });
        p.onPressIn?.(e);
      }}
      onPressOut={e => {
        s.value = withTiming(1, { duration: 160 });
        p.onPressOut?.(e);
      }}
      style={[style as object, a]}
    >
      {children}
    </APressable>
  );
}
type Frame = { x: number; y: number; w: number; h: number };
type Size = 'chip' | 'circle' | 'small';
const ITEM: Record<Size, ViewStyle> = {
  chip: { height: 52, paddingHorizontal: 24, borderRadius: 26 },
  small: { height: 44, minWidth: 56, paddingHorizontal: 14, borderRadius: 22 },
  circle: { width: 48, height: 48, borderRadius: 24 },
};

export function ChoiceGroup<T extends string | number>({
  options,
  value,
  onChange,
  size = 'chip',
  wrap,
  scroll,
  filterIcon,
  outline = true,
  label,
}: {
  options: { value: T; label: string; a11y?: string }[];
  /** null = nothing selected (the pill hides). */
  value: T | null;
  onChange: (v: T) => void;
  size?: Size;
  /** Let options flow onto several rows. */
  wrap?: boolean;
  /** Horizontal scroll row (filter chips). */
  scroll?: boolean;
  /** Leading non-interactive filter icon, as on the filter rows. */
  filterIcon?: boolean;
  /** Unselected options get the 1.5px outline ring. */
  outline?: boolean;
  label?: string;
}) {
  const C = useColors();
  const frames = useRef<Record<string, Frame>>({});
  const [ready, setReady] = useState(false);
  const x = useSharedValue(0);
  const y = useSharedValue(0);
  const w = useSharedValue(0);
  const h = useSharedValue(0);
  const o = useSharedValue(0);
  const placed = useRef(false);
  const scroller = useRef<React.ComponentRef<typeof ScrollView>>(null);
  const viewW = useRef(0);

  const moveTo = (v: T | null, animate: boolean) => {
    const f = v === null ? undefined : frames.current[String(v)];
    if (!f) {
      o.value = withTiming(0, { duration: 150 });
      return;
    }
    if (animate && placed.current) {
      x.value = withTiming(f.x, GLIDE);
      y.value = withTiming(f.y, GLIDE);
      w.value = withTiming(f.w, GLIDE);
      h.value = withTiming(f.h, GLIDE);
    } else {
      x.value = f.x;
      y.value = f.y;
      w.value = f.w;
      h.value = f.h;
    }
    placed.current = true;
    o.value = withTiming(1, { duration: 150 });
    // Keep the chosen chip in view on scrolling rows (the filter icon sits before the group).
    if (scroll && animate) {
      const lead = filterIcon ? 60 : 0;
      const target = lead + f.x + f.w / 2 - viewW.current / 2;
      scroller.current?.scrollTo({ x: Math.max(0, target), animated: true });
    }
  };
  useEffect(() => {
    if (ready) moveTo(value, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, ready]);

  const pill = useAnimatedStyle(() => ({
    opacity: o.value,
    width: w.value,
    height: h.value,
    transform: [{ translateX: x.value }, { translateY: y.value }],
  }));

  const group = (
    <View
      accessibilityRole="radiogroup"
      accessibilityLabel={label}
      style={{
        flexDirection: 'row',
        flexWrap: wrap ? 'wrap' : 'nowrap',
        gap: 8,
        alignItems: 'center',
      }}
    >
      <AnimatedMaterialView
        pointerEvents="none"
        style={[
          { position: 'absolute', left: 0, top: 0, borderRadius: 999, ...INK },
          pill,
        ]}
      />
      {options.map(op => {
        const on = op.value === value;
        return (
          <Option
            key={String(op.value)}
            accessibilityRole="radio"
            accessibilityState={{ selected: on }}
            accessibilityLabel={op.a11y ?? op.label}
            onLayout={e => {
              const l = e.nativeEvent.layout;
              frames.current[String(op.value)] = {
                x: l.x,
                y: l.y,
                w: l.width,
                h: l.height,
              };
              if (Object.keys(frames.current).length >= options.length) {
                if (!ready) setReady(true);
                else if (on) moveTo(value, false);
              }
            }}
            onPress={() => {
              if (on) return;
              Haptics.selectionAsync().catch(() => {});
              onChange(op.value);
            }}
            style={[
              ITEM[size],
              { alignItems: 'center', justifyContent: 'center' },
              outline && !on && { borderWidth: 1.5, borderColor: C.lineStrong },
            ]}
          >
            <Txt
              style={{
                fontSize: size === 'chip' ? 16 : 15,
                fontWeight: 600,
                color: on ? '#fff' : C.ink,
              }}
            >
              {op.label}
            </Txt>
          </Option>
        );
      })}
    </View>
  );

  if (!scroll) return group;
  return (
    <ScrollView
      ref={scroller}
      horizontal
      onLayout={e => {
        viewW.current = e.nativeEvent.layout.width;
      }}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 8, paddingVertical: 4, alignItems: 'center' }}
    >
      {filterIcon && (
        <View
          importantForAccessibility="no-hide-descendants"
          style={{
            width: 52,
            height: 52,
            borderRadius: 26,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: C.surface,
            boxShadow:
              'inset 0px 0px 0px 1px rgba(15,23,42,0.07), 0px 14px 36px rgba(15,23,42,0.07)',
          }}
        >
          <Icon name="filter" size={20} />
        </View>
      )}
      {group}
    </ScrollView>
  );
}
