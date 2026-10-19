// Screen — white page with the standard paddings, and a blur-in that REPLAYS every time the screen gains
// focus (tab switch / navigation), so page changes feel like the web's blurred page transition.
// Works with React Navigation 7 and expo-router (both provide useFocusEffect via @react-navigation/native).
import { useCallback, useState, type ReactNode } from "react";
import { ScrollView, View, type StyleProp, type ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { color, space } from "../theme";

type Props = {
  children: ReactNode;
  /** horizontal gutter: 20 for tab screens, 24 for onboarding */
  gutter?: number;
  /** leave room for the floating tab bar */
  withTabBar?: boolean;
  scroll?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
  /** overlays that must sit above the scroll view (QuickAddMenu, sheets) */
  overlay?: ReactNode;
};

export function Screen({ children, gutter = space.gutter, withTabBar = true, scroll = true, contentStyle, overlay }: Props) {
  const insets = useSafeAreaInsets();
  const [visit, setVisit] = useState(0);
  useFocusEffect(useCallback(() => setVisit((v) => v + 1), []));

  const content = (
    <View key={visit} style={[{ gap: space.cardGap }, contentStyle]}>
      {children}
    </View>
  );
  const pad = { paddingTop: insets.top + 12, paddingHorizontal: gutter, paddingBottom: withTabBar ? space.bottomClearance + insets.bottom : 32 + insets.bottom };

  return (
    <View style={{ flex: 1, backgroundColor: color.ground }}>
      {scroll ? (
        <ScrollView contentContainerStyle={pad} showsVerticalScrollIndicator={false}>
          {content}
        </ScrollView>
      ) : (
        <View style={[{ flex: 1 }, pad]}>{content}</View>
      )}
      {overlay}
    </View>
  );
}
