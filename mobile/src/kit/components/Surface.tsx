import { useSubjectColors } from '../../theme';
import { useAppearance } from '../../appearance';
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
import { angle160, angle180, surface, type SubjectId, type SurfaceKind } from "../theme";

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
  const { dark } = useAppearance();
  const palettes = useSubjectColors();
  const original = surface[kind];
  const darkColors: Record<string, string[]> = {
    clay: ['#30343C', '#25282F', '#202329'], recess: ['#15171B', '#24272E'], dock: ['#292C33', '#1B1D22'],
    glass: ['rgba(38,42,49,0.95)', 'rgba(27,29,34,0.92)'], sheen: ['rgba(255,255,255,0.12)', 'rgba(255,255,255,0)'],
    blurReaderCard: ['#292C33', '#1B1D22'],
  };
  const s = dark && darkColors[kind] ? { ...original, colors: darkColors[kind], boxShadow: 'inset 0px 1px 0px rgba(255,255,255,0.08), 0px 8px 24px rgba(0,0,0,0.24)' } : original;
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
        {kind === "sheen" && subject && <View style={[StyleSheet.absoluteFill, { backgroundColor: palettes[subject.toLowerCase() as 'se' | 'daa' | 'dds'].fill }]} />}
        {isGlass && !glassAndroid && !reduce && <BlurView intensity={surface.glass.blurIntensity} tint={dark ? "dark" : "light"} style={StyleSheet.absoluteFill} />}
        <LinearGradient
          colors={glassAndroid && !dark ? ["rgba(255,255,255,0.94)", "rgba(250,251,253,0.9)"] : [...s.colors]}
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
