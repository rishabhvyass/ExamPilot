// Surface — draws one of the Clear Glass materials (clay, recess, dock, ink, glass, sheen) behind its children.
//
// Why it is built in layers: in CSS an inset box-shadow paints ABOVE the background. In React Native a
// gradient is a child view, so it would cover an inset shadow drawn on the parent. Surface therefore
// stacks:  outer shadow (on the root)  →  gradient  →  inset shadows (overlay)  →  children.
//
// Glass = iOS BlurView (expo-blur, tint "light") + translucent white gradient. On Android a blur needs a
// BlurTargetView around whatever is behind the card; on a white page that blur is invisible anyway, so
// Android draws the gradient at 90 % white instead (cheaper, looks the same).
import { useReducedMotion } from "react-native-reanimated";
import type { ReactNode } from "react";
import { Platform, StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { LinearGradient } from "../compat";
import { BlurView } from "../compat";
import { angle160, angle180, surface, subject as subjects, type SubjectId, type SurfaceKind } from "../theme";

/** Split "a, inset b, c" into outer / inset lists without breaking on commas inside rgba(). */
export function splitShadow(shadow: string) {
  const parts = shadow.split(/,(?![^(]*\))/).map((p) => p.trim());
  return {
    outer: parts.filter((p) => !p.startsWith("inset")).join(", "),
    inset: parts.filter((p) => p.startsWith("inset")).join(", "),
  };
}

type Props = {
  kind: SurfaceKind;
  /** For kind="sheen": which subject fill sits under the white sheen. */
  subject?: SubjectId;
  radius?: number;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
  pointerEvents?: "auto" | "none" | "box-none" | "box-only";
};

export function Surface({ kind, subject, radius = 9999, style, children, pointerEvents }: Props) {
  const reduce = useReducedMotion();
  const s = surface[kind];
  const flat = StyleSheet.flatten(style) ?? {};
  const corners = { borderRadius: flat.borderRadius ?? radius, borderTopLeftRadius: flat.borderTopLeftRadius, borderTopRightRadius: flat.borderTopRightRadius, borderBottomLeftRadius: flat.borderBottomLeftRadius, borderBottomRightRadius: flat.borderBottomRightRadius };
  const { outer, inset } = splitShadow(s.boxShadow);
  const diagonal = kind === "glass" || kind === "sheen";
  const dir = diagonal ? angle160 : angle180;
  const isGlass = kind === "glass";
  const glassAndroid = isGlass && Platform.OS === "android";

  return (
    <View pointerEvents={pointerEvents} style={[{ borderRadius: radius, boxShadow: outer }, style]}>
      <View pointerEvents="none" style={[StyleSheet.absoluteFill, { ...corners, overflow: "hidden" }]}>
        {kind === "sheen" && subject && <View style={[StyleSheet.absoluteFill, { backgroundColor: subjects[subject].fill }]} />}
        {isGlass && !glassAndroid && !reduce && <BlurView intensity={surface.glass.blurIntensity} tint="light" style={StyleSheet.absoluteFill} />}
        <LinearGradient
          colors={glassAndroid ? ["rgba(255,255,255,0.94)", "rgba(250,251,253,0.9)"] : [...s.colors]}
          locations={[...s.locations]}
          start={dir.start}
          end={dir.end}
          style={StyleSheet.absoluteFill}
        />
      </View>
      {inset ? <View pointerEvents="none" style={[StyleSheet.absoluteFill, { ...corners, boxShadow: inset }]} /> : null}
      {children}
    </View>
  );
}
