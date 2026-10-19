// ToolDock — board M5 (PDF reader tools). A soft dock with 4 tools + a glossy black "more" button.
// "More" morphs the dock into a grid panel (layout spring 400/34) and the extra tools pop in 35ms apart.
// The + rotates into × to collapse.
import { useEffect, useState, type ReactNode } from "react";
import { Text, View } from "react-native";
import Animated, { FadeOut, useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { PressableScale } from "./PressableScale";
import { Surface } from "./Surface";
import { Icon, ICON } from "./Icon";
import { layout, spring, toolIn } from "../motion";
import { useKitColors, fontFamily } from "../theme";

export type Tool = { id: string; label: string; icon: ReactNode; active?: boolean; onSelect: () => void };

export function ToolDock({ primary, more }: { primary: Tool[]; more: Tool[] }) {
  const color = useKitColors();
  const [open, setOpen] = useState(false);
  const rot = useSharedValue(0);
  useEffect(() => {
    rot.value = withSpring(open ? 45 : 0, spring.press);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);
  const plus = useAnimatedStyle(() => ({ transform: [{ rotate: `${rot.value}deg` }] }));

  return (
    <Animated.View layout={layout} style={{ width: open ? "100%" : undefined, maxWidth: 340, alignSelf: "center" }}>
      <Surface kind="dock" radius={open ? 30 : 9999} style={{ padding: open ? 16 : 6 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          {primary.map((t) => (
            <PressableScale key={t.id} amount="small" onPress={t.onSelect} accessibilityLabel={t.label} accessibilityState={{ selected: t.active }}>
              {t.active ? (
                <Surface kind="recess" style={{ width: 48, height: 48, alignItems: "center", justifyContent: "center" }}>{t.icon}</Surface>
              ) : (
                <View style={{ width: 48, height: 48, alignItems: "center", justifyContent: "center" }}>{t.icon}</View>
              )}
            </PressableScale>
          ))}
          <View style={{ flex: open ? 1 : 0, width: open ? undefined : 4 }} />
          <PressableScale amount="small" onPress={() => setOpen((o) => !o)} accessibilityLabel={open ? "Fewer tools" : "More tools"} accessibilityState={{ expanded: open }}>
            <Surface kind="ink" style={{ width: 48, height: 48, alignItems: "center", justifyContent: "center" }}>
              <Animated.View style={plus}>
                <Icon d={ICON.plus} size={20} strokeWidth={2.4} color="#FFFFFF" />
              </Animated.View>
            </Surface>
          </PressableScale>
        </View>
        {open && (
          <Animated.View exiting={FadeOut.duration(150)} style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, paddingTop: 12 }}>
            {more.map((t, i) => (
              <Animated.View key={t.id} entering={toolIn(i)} style={{ width: "22%" }}>
                <PressableScale amount="small" onPress={t.onSelect} accessibilityLabel={t.label}>
                  <Surface kind="clay" radius={18} style={{ alignItems: "center", gap: 6, paddingVertical: 12 }}>
                    {t.icon}
                    <Text numberOfLines={1} style={{ fontFamily: fontFamily[600], fontSize: 12, color: color.inkButton }}>{t.label}</Text>
                  </Surface>
                </PressableScale>
              </Animated.View>
            ))}
          </Animated.View>
        )}
      </Surface>
    </Animated.View>
  );
}
