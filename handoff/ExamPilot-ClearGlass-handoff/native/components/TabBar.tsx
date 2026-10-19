// TabBar — floating bottom nav (exactly four tabs: Today, Calendar, Subjects, Questions).
// One soft dock; inactive tabs are flat 56px icons; the active tab grows to show icon + label inside a
// pressed-in grey groove. The groove is ONE view that springs (400/34) to the active tab's measured frame;
// the label fades/slides in 180ms later (320ms).
//
// React Navigation 7:   <Tab.Navigator tabBar={(p) => <TabBar {...p} />} screenOptions={{ headerShown: false }}>
// expo-router:          <Tabs tabBar={(p) => <TabBar {...p} />} screenOptions={{ headerShown: false }}>
// Route names are matched to icons below; the label is `options.title` (or the route name).
import { useEffect, useState } from "react";
import { StyleSheet, Text, View, type LayoutChangeEvent } from "react-native";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { Keyframe, useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { Surface } from "./Surface";
import { PressableScale } from "./PressableScale";
import { Icon, ICON } from "./Icon";
import { ease, spring, tabGrow, tabLabelTiming } from "../motion";
import { color, fontFamily, surface } from "../theme";
import { splitShadow } from "./Surface";
import { LinearGradient } from "expo-linear-gradient";

const ICONS: Record<string, readonly string[]> = {
  index: ICON.today, today: ICON.today, calendar: ICON.calendar, subjects: ICON.subjects, questions: ICON.questions,
};

const labelIn = new Keyframe({
  0: { opacity: 0, transform: [{ translateX: -6 }] },
  100: { opacity: 1, transform: [{ translateX: 0 }], easing: ease.decelerate },
})
  .duration(tabLabelTiming.duration)
  .delay(tabLabelTiming.delay);

export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const x = useSharedValue(0);
  const w = useSharedValue(0);
  const [frames, setFrames] = useState<Record<string, { x: number; width: number }>>({});
  const activeKey = state.routes[state.index].key;

  const onTabLayout = (key: string, focused: boolean) => (e: LayoutChangeEvent) => {
    const { x: fx, width } = e.nativeEvent.layout;
    setFrames((f) => ({ ...f, [key]: { x: fx, width } }));
    if (focused && w.value === 0) {
      x.value = fx; // first layout: place without animating
      w.value = width;
    }
  };
  // when the active tab changes, spring the groove to its (re-measured) frame
  const f = frames[activeKey];
  useEffect(() => {
    if (!f) return;
    x.value = withSpring(f.x, spring.layout);
    w.value = withSpring(f.width, spring.layout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeKey, f?.x, f?.width]);

  const groove = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }], width: w.value }));
  const { inset } = splitShadow(surface.recess.boxShadow);

  return (
    <View pointerEvents="box-none" style={{ position: "absolute", left: 20, right: 20, bottom: 24 + insets.bottom, alignItems: "center" }}>
      <Surface kind="dock" style={{ width: "100%", maxWidth: 440, flexDirection: "row", padding: 8, gap: 8 }}>
        {/* the sliding groove */}
        <Animated.View pointerEvents="none" style={[{ position: "absolute", top: 8, left: 0, height: 56, borderRadius: 9999, overflow: "hidden" }, groove]}>
          <LinearGradient colors={[...surface.recess.colors]} style={StyleSheet.absoluteFill} />
          <View style={[StyleSheet.absoluteFill, { borderRadius: 9999, boxShadow: inset }]} />
        </Animated.View>

        {state.routes.map((route, i) => {
          const focused = state.index === i;
          const { options } = descriptors[route.key];
          const label = typeof options.title === "string" ? options.title : route.name;
          const d = ICONS[route.name.toLowerCase()] ?? ICON.today;
          const onPress = () => {
            const e = navigation.emit({ type: "tabPress", target: route.key, canPreventDefault: true });
            if (!focused && !e.defaultPrevented) navigation.navigate(route.name, route.params);
          };
          return (
            <Animated.View key={route.key} layout={tabGrow} onLayout={onTabLayout(route.key, focused)} style={focused ? { flex: 1 } : { width: 56 }}>
              <PressableScale
                amount="small"
                onPress={onPress}
                accessibilityRole="tab"
                accessibilityState={{ selected: focused }}
                accessibilityLabel={label}
                style={{ height: 56, borderRadius: 9999, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, paddingHorizontal: focused ? 20 : 0 }}
              >
                <Icon d={[...d]} size={focused ? 20 : 22} color={color.inkButton} />
                {focused && (
                  <Animated.View entering={labelIn}>
                    <Text numberOfLines={1} style={{ fontFamily: fontFamily[600], fontSize: 16, color: color.inkButton }}>{label}</Text>
                  </Animated.View>
                )}
              </PressableScale>
            </Animated.View>
          );
        })}
      </Surface>
    </View>
  );
}
