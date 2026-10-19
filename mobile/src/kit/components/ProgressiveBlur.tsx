import { useAppearance } from '../../appearance';
// ProgressiveBlur — the soft top/bottom edge of the Blur Reader (and any scrolling list under a header).
// iOS: three BlurViews (light → strong) each masked by a gradient, stacked — the blur gets stronger
// towards the edge, like CSS backdrop-filter 2/5/10px with mask-image.
// Android: a white gradient fade only (a masked live blur is too costly there and reads the same on white).
// npx expo install expo-blur expo-linear-gradient @react-native-masked-view/masked-view
import { Platform, StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import type { ComponentType, ReactElement, ReactNode } from "react";
import RNMaskedView from "@react-native-masked-view/masked-view";
import { BlurView } from "../compat";
import { LinearGradient } from "../compat";
import { useReducedMotion } from "react-native-reanimated";

// The package ships class-component typings that React 19's JSX types reject; the runtime is fine.
const MaskedView = RNMaskedView as unknown as ComponentType<{ style?: StyleProp<ViewStyle>; maskElement: ReactElement; children?: ReactNode }>;

const LAYERS = [
  { intensity: 28, from: 0, to: 1 },
] as const;

export function ProgressiveBlur({ side, height = 120 }: { side: "top" | "bottom"; height?: number }) {
  const reduce = useReducedMotion();
  const { dark } = useAppearance();
  const pos = side === "top" ? { top: 0 } : { bottom: 0 };
  // gradient runs from the inner edge (transparent) to the outer edge (opaque)
  const start = side === "top" ? { x: 0.5, y: 1 } : { x: 0.5, y: 0 };
  const end = side === "top" ? { x: 0.5, y: 0 } : { x: 0.5, y: 1 };
  return (
    <View pointerEvents="none" style={[styles.wrap, pos, { height }]}>
      {Platform.OS === "ios" &&
        !reduce &&
        LAYERS.map((l, i) => (
          <MaskedView
            key={i}
            style={StyleSheet.absoluteFill}
            maskElement={<LinearGradient colors={["transparent", "#000"]} locations={[l.from, l.to]} start={start} end={end} style={StyleSheet.absoluteFill} />}
          >
            <BlurView intensity={l.intensity} tint={dark ? "dark" : "light"} style={StyleSheet.absoluteFill} />
          </MaskedView>
        ))}
      <LinearGradient colors={dark ? ["rgba(27,29,34,0)", "rgba(27,29,34,0.92)"] : ["rgba(255,255,255,0)", "rgba(255,255,255,0.92)"]} locations={[0.2, 1]} start={start} end={end} style={StyleSheet.absoluteFill} />
    </View>
  );
}

const styles = StyleSheet.create({ wrap: { position: "absolute", left: 0, right: 0 } });
