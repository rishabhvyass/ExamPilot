// AnimatedCheckbox — checklist row (Today, Subjects topics). The whole row is the button (min 60px tall).
// Unchecked: 30px circle with a 2px #C2C9D4 ring. Checked: glossy black circle pops (.9 → 1.12 → 1),
// the white tick draws itself, the title fades to #6B7385 and a #A0A8B8 strike line grows from the left.
import { useEffect, type ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, { interpolateColor, useAnimatedProps, useAnimatedStyle, useSharedValue, withDelay, withSequence, withTiming } from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";
import { LinearGradient } from "expo-linear-gradient";
import { PressableScale } from "./PressableScale";
import { ease } from "../motion";
import { color, fontFamily, surface } from "../theme";

const APath = Animated.createAnimatedComponent(Path);
const TICK = 22; // length of "M5 12l5 5L20 7"

type Props = { title: string; meta?: ReactNode; checked: boolean; onToggle: () => void };

export function AnimatedCheckbox({ title, meta, checked, onToggle }: Props) {
  const on = useSharedValue(checked ? 1 : 0);
  const pop = useSharedValue(1);
  const tick = useSharedValue(checked ? 0 : TICK);

  useEffect(() => {
    on.value = withTiming(checked ? 1 : 0, { duration: 200 });
    tick.value = checked ? withDelay(60, withTiming(0, { duration: 220, easing: ease.standard })) : withTiming(TICK, { duration: 120 });
    if (checked) pop.value = withSequence(withTiming(0.9, { duration: 60 }), withTiming(1.12, { duration: 110 }), withTiming(1, { duration: 90 }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checked]);

  const box = useAnimatedStyle(() => ({ transform: [{ scale: pop.value }] }));
  const fill = useAnimatedStyle(() => ({ opacity: on.value }));
  const ring = useAnimatedStyle(() => ({ opacity: 1 - on.value }));
  const titleStyle = useAnimatedStyle(() => ({ color: interpolateColor(on.value, [0, 1], [color.ink, color.inkSubtle]) }));
  const strike = useAnimatedStyle(() => ({ transform: [{ scaleX: on.value }] }));
  const tickProps = useAnimatedProps(() => ({ strokeDashoffset: tick.value }));

  return (
    <PressableScale amount="row" onPress={onToggle} accessibilityRole="checkbox" accessibilityState={{ checked }} accessibilityLabel={title} style={styles.row}>
      <Animated.View style={[styles.box, box]}>
        <Animated.View style={[StyleSheet.absoluteFill, styles.ring, ring]} />
        <Animated.View style={[StyleSheet.absoluteFill, { borderRadius: 9999, boxShadow: surface.ink.boxShadow, overflow: "hidden" }, fill]}>
          <LinearGradient colors={[...surface.ink.colors]} locations={[...surface.ink.locations]} style={StyleSheet.absoluteFill} />
        </Animated.View>
        <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
          <APath d="M5 12l5 5L20 7" strokeDasharray={TICK} animatedProps={tickProps} />
        </Svg>
      </Animated.View>
      <View style={{ flex: 1, gap: 4 }}>
        <View style={{ alignSelf: "flex-start" }}>
          <Animated.Text style={[{ fontFamily: fontFamily[500], fontSize: 17, lineHeight: 22 }, titleStyle]}>{title}</Animated.Text>
          <Animated.View pointerEvents="none" style={[styles.strike, { transformOrigin: "left" }, strike]} />
        </View>
        {meta ? <Text style={{ fontFamily: fontFamily[400], fontSize: 13, color: color.inkMuted }}>{meta}</Text> : null}
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  row: { minHeight: 60, flexDirection: "row", alignItems: "center", gap: 14, paddingHorizontal: 4, paddingVertical: 8, borderRadius: 18 },
  box: { width: 30, height: 30, borderRadius: 9999, alignItems: "center", justifyContent: "center" },
  ring: { borderRadius: 9999, borderWidth: 2, borderColor: color.checkRing },
  strike: { position: "absolute", left: 0, right: 0, top: "50%", height: 1.5, backgroundColor: color.strike },
});
