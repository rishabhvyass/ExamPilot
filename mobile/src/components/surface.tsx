// The existing screens and the supplied kit share one material renderer.
import { forwardRef, type ReactNode, type ComponentRef } from 'react';
import {
  StyleSheet,
  View,
  type ViewProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Animated from 'react-native-reanimated';
import { Surface as KitSurface } from '../kit/components/Surface';
import { SURFACE, type SubjectColor, type SurfaceKind } from '../theme';

export function Surface({
  kind,
  subject,
  radius = 9999,
  style,
  children,
}: {
  kind: SurfaceKind;
  subject?: SubjectColor;
  radius?: number;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
}) {
  return (
    <KitSurface
      kind={kind}
      subject={subject?.toUpperCase() as 'SE' | 'DAA' | 'DDS' | undefined}
      radius={radius}
      style={style}
    >
      {children}
    </KitSurface>
  );
}

/** Adapts legacy styles: Surface owns the gradient and both shadow layers. */
export const MaterialView = forwardRef<ComponentRef<typeof View>, ViewProps>(
  ({ style, children, ...props }, ref) => {
    const flat = StyleSheet.flatten(style) ?? {};
    const kind = (Object.keys(SURFACE) as SurfaceKind[]).find(
      k => flat.experimental_backgroundImage === SURFACE[k].gradient,
    );
    if (!kind)
      return (
        <View ref={ref} {...props} style={style}>
          {children}
        </View>
      );
    const layout = { ...flat };
    delete layout.experimental_backgroundImage;
    delete layout.boxShadow;
    const corners = {
      borderRadius: flat.borderRadius ?? 0,
      borderTopLeftRadius: flat.borderTopLeftRadius,
      borderTopRightRadius: flat.borderTopRightRadius,
      borderBottomLeftRadius: flat.borderBottomLeftRadius,
      borderBottomRightRadius: flat.borderBottomRightRadius,
    };
    return (
      <View ref={ref} {...props} style={layout}>
        <View pointerEvents="none" style={[StyleSheet.absoluteFill, corners]}>
          <Surface
            kind={kind}
            radius={Number(flat.borderRadius ?? 0)}
            style={[StyleSheet.absoluteFill, corners]}
          />
        </View>
        {children}
      </View>
    );
  },
);
export const AnimatedMaterialView =
  Animated.createAnimatedComponent(MaterialView);
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
