// Floating dock: inactive tabs are flat 56px icons; the active tab grows into a pressed-in groove with icon + label.
import type { ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  FadeInLeft,
  LinearTransition,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Icon, Press, Txt } from './ui';
import { Surface } from './surface';
import { C } from '../theme';

const META: Record<string, { label: string; icon: string }> = {
  Today: { label: 'Today', icon: 'nav-today-sun' },
  Calendar: { label: 'Calendar', icon: 'nav-calendar' },
  Subjects: { label: 'Subjects', icon: 'nav-subjects-grid' },
  Questions: { label: 'Questions', icon: 'nav-questions' },
};
const Tab = ({
  on,
  style,
  children,
}: {
  on: boolean;
  style: StyleProp<ViewStyle>;
  children: ReactNode;
}) =>
  on ? (
    <Surface kind="recess" style={style}>
      {children}
    </Surface>
  ) : (
    <View style={style}>{children}</View>
  );
const layout = LinearTransition.springify().stiffness(400).damping(34);

export function TabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  return (
    <View
      pointerEvents="box-none"
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: Math.max(insets.bottom, 12) + 8,
        alignItems: 'center',
      }}
    >
      <View
        accessibilityRole="tablist"
        style={{ width: '100%', maxWidth: 440, paddingHorizontal: 20 }}
      >
        <Surface
          kind="dock"
          style={{ flexDirection: 'row', gap: 8, padding: 8 }}
        >
          {state.routes.map((r, i) => {
            const on = state.index === i;
            const m = META[r.name];
            return (
              <Animated.View
                key={r.key}
                layout={layout}
                style={on ? { flex: 1 } : undefined}
              >
                <Press
                  accessibilityRole="tab"
                  accessibilityState={{ selected: on }}
                  accessibilityLabel={m.label}
                  scaleTo={0.92}
                  onPress={() => {
                    if (!on) navigation.navigate(r.name);
                  }}
                >
                  <Tab
                    on={on}
                    style={[
                      {
                        height: 56,
                        borderRadius: 28,
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'row',
                        gap: 8,
                      },
                      on
                        ? { paddingHorizontal: 20 }
                        : { width: 56 },
                    ]}
                  >
                    <Icon
                      name={m.icon}
                      size={on ? 20 : 22}
                      color={C.inkButton}
                    />
                    {on && (
                      <Animated.View
                        entering={FadeInLeft.delay(120).duration(300)}
                      >
                        <Txt style={{ color: C.inkButton, fontWeight: 600 }}>
                          {m.label}
                        </Txt>
                      </Animated.View>
                    )}
                  </Tab>
                </Press>
              </Animated.View>
            );
          })}
        </Surface>
      </View>
    </View>
  );
}
