// SegmentedControl — Login "Sign in | Create account".
// White pill track (6px padding, hairline); the selected option sits on a glossy black slider that springs
// (400/34) between options; its label turns white.
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View, type LayoutChangeEvent } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { spring } from "../motion";
import { color, fontFamily, surface } from "../theme";

type Option<T extends string> = { value: T; label: string };

export function SegmentedControl<T extends string>({ options, value, onChange }: { options: Option<T>[]; value: T; onChange: (v: T) => void }) {
  const [frames, setFrames] = useState<Record<string, { x: number; width: number }>>({});
  const x = useSharedValue(0);
  const w = useSharedValue(0);
  const f = frames[value];
  useEffect(() => {
    if (!f) return;
    const first = w.value === 0;
    x.value = first ? f.x : withSpring(f.x, spring.layout);
    w.value = first ? f.width : withSpring(f.width, spring.layout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, f?.x, f?.width]);
  const slider = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }], width: w.value }));

  return (
    <View accessibilityRole="tablist" style={styles.track}>
      <Animated.View pointerEvents="none" style={[styles.slider, { boxShadow: surface.ink.boxShadow }, slider]}>
        <LinearGradient colors={[...surface.ink.colors]} locations={[...surface.ink.locations]} style={[StyleSheet.absoluteFill, { borderRadius: 9999 }]} />
      </Animated.View>
      {options.map((o) => {
        const on = o.value === value;
        return (
          <Pressable
            key={o.value}
            accessibilityRole="tab"
            accessibilityState={{ selected: on }}
            onPress={() => onChange(o.value)}
            onLayout={(e: LayoutChangeEvent) => {
              const { x: fx, width } = e.nativeEvent.layout;
              setFrames((p) => ({ ...p, [o.value]: { x: fx, width } }));
            }}
            style={styles.option}
          >
            <Text style={{ fontFamily: fontFamily[600], fontSize: 16, color: on ? "#FFFFFF" : color.inkMuted }}>{o.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: { flexDirection: "row", padding: 6, borderRadius: 9999, backgroundColor: "#FFFFFF", boxShadow: "0px 0px 0px 1px rgba(15,23,42,0.07), 0px 6px 16px rgba(15,23,42,0.05)" },
  slider: { position: "absolute", top: 6, left: 0, height: 48, borderRadius: 9999 },
  option: { flex: 1, height: 48, alignItems: "center", justifyContent: "center" },
});
