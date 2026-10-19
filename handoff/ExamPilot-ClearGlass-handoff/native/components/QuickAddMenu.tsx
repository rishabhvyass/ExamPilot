// QuickAddMenu — board M4. A glossy black + (64px) above the tab bar, bottom-right.
// Tap: the whole screen blurs behind a white veil, the actions fly out of the button one after another
// (last item first), and the + rotates 45° into ×. Tap the veil or × (or Android back) to close.
// Render it as the LAST child of the screen (Screen's `overlay` prop) so the veil covers everything.
// iOS: live BlurView veil (intensity 40). Android: a white 82% veil (no live blur — cheaper, reads the same).
import { useEffect, useState, type ReactNode } from "react";
import { BackHandler, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn, FadeOut, useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { BlurView } from "expo-blur";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PressableScale } from "./PressableScale";
import { Surface } from "./Surface";
import { Icon, ICON } from "./Icon";
import { blur as BLUR, duration, quickAddItemIn, quickAddItemOut, spring } from "../motion";
import { color, fontFamily } from "../theme";

export type QuickAction = { id: string; label: string; icon: ReactNode; onSelect: () => void };

export function QuickAddMenu({ actions }: { actions: QuickAction[] }) {
  const [open, setOpen] = useState(false);
  const insets = useSafeAreaInsets();
  const rot = useSharedValue(0);
  useEffect(() => {
    rot.value = withSpring(open ? 45 : 0, spring.press);
    if (!open) return;
    const sub = BackHandler.addEventListener("hardwareBackPress", () => (setOpen(false), true));
    return () => sub.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);
  const plus = useAnimatedStyle(() => ({ transform: [{ rotate: `${rot.value}deg` }] }));

  return (
    <>
      {open && (
        <Animated.View entering={FadeIn.duration(duration.veil)} exiting={FadeOut.duration(duration.veil)} style={StyleSheet.absoluteFill}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setOpen(false)} accessibilityLabel="Close quick add">
            {Platform.OS === "ios" ? (
              <BlurView intensity={BLUR.veil} tint="light" style={[StyleSheet.absoluteFill, { backgroundColor: "rgba(255,255,255,0.55)" }]} />
            ) : (
              <View style={[StyleSheet.absoluteFill, { backgroundColor: "rgba(255,255,255,0.82)" }]} />
            )}
          </Pressable>
        </Animated.View>
      )}
      <View pointerEvents="box-none" style={{ position: "absolute", right: 20, bottom: 112 + insets.bottom, alignItems: "flex-end", gap: 12 }}>
        {open &&
          actions.map((a, i) => (
            <Animated.View key={a.id} entering={quickAddItemIn(actions.length - 1 - i)} exiting={quickAddItemOut}>
              <PressableScale onPress={() => { setOpen(false); a.onSelect(); }} accessibilityLabel={a.label}>
                <Surface kind="clay" style={{ height: 56, flexDirection: "row", alignItems: "center", gap: 12, paddingLeft: 20, paddingRight: 8 }}>
                  <Text style={{ fontFamily: fontFamily[600], fontSize: 16, color: color.inkButton }}>{a.label}</Text>
                  <Surface kind="ink" style={{ width: 44, height: 44, alignItems: "center", justifyContent: "center" }}>{a.icon}</Surface>
                </Surface>
              </PressableScale>
            </Animated.View>
          ))}
        <PressableScale amount="small" onPress={() => setOpen((o) => !o)} accessibilityLabel={open ? "Close quick add" : "Quick add"} accessibilityState={{ expanded: open }}>
          <Surface kind="ink" style={{ width: 64, height: 64, alignItems: "center", justifyContent: "center" }}>
            <Animated.View style={plus}>
              <Icon d={ICON.plus} size={24} strokeWidth={2.4} color="#FFFFFF" />
            </Animated.View>
          </Surface>
        </PressableScale>
      </View>
    </>
  );
}
