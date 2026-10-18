// Clear Glass materials in plain React Native (no gradient library): a CSS linear-gradient via
// `experimental_backgroundImage`, with outer shadows on the root and inset shadows in an overlay above the gradient.
import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { SURFACE, SUBJ, type SubjectColor, type SurfaceKind } from '../theme';

/** Split "a, inset b, c" into outer / inset lists without breaking on commas inside rgba(). */
const splitShadow = (shadow: string) => {
  const parts = shadow.split(/,(?![^(]*\))/).map(p => p.trim());
  return {
    outer: parts.filter(p => !p.startsWith('inset')).join(', '),
    inset: parts.filter(p => p.startsWith('inset')).join(', '),
  };
};
const SPLIT = Object.fromEntries(
  Object.entries(SURFACE).map(([k, v]) => [k, splitShadow(v.shadow)]),
) as Record<SurfaceKind, { outer: string; inset: string }>;

export function Surface({
  kind,
  subject,
  radius = 9999,
  style,
  children,
}: {
  kind: SurfaceKind;
  /** kind="sheen": which subject fill sits under the white sheen. */
  subject?: SubjectColor;
  radius?: number;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
}) {
  const { outer, inset } = SPLIT[kind];
  return (
    <View style={[{ borderRadius: radius, boxShadow: outer }, style]}>
      <View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFill,
          {
            borderRadius: radius,
            experimental_backgroundImage: SURFACE[kind].gradient,
            backgroundColor:
              kind === 'sheen' && subject ? SUBJ[subject].fill : undefined,
          },
        ]}
      />
      {inset ? (
        <View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFill,
            { borderRadius: radius, boxShadow: inset },
          ]}
        />
      ) : null}
      {children}
    </View>
  );
}

/** Frosted-glass card: translucent white gradient, hairline and soft shadow. */
export const GlassCard = ({
  children,
  radius = 34,
  padding = 22,
  style,
}: {
  children?: ReactNode;
  radius?: number;
  padding?: number;
  style?: StyleProp<ViewStyle>;
}) => (
  <Surface kind="glass" radius={radius} style={[{ padding }, style]}>
    {children}
  </Surface>
);
