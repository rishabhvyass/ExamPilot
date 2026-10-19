import { Fragment } from 'react';
import { Keyboard, View } from 'react-native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Surface } from './Surface';
import { PressableScale } from './PressableScale';
import { Icon, Txt } from '../../components/ui';
import { useColors } from '../../theme';
import { useNav } from '../../navigation';

const icons: Record<string, string> = {
  Today: 'nav-today-sun',
  Calendar: 'nav-calendar',
  Subjects: 'nav-subjects-grid',
  Questions: 'nav-questions',
};
export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const C = useColors();
  const nav = useNav();
  return (
    <View
      pointerEvents="box-none"
      style={{
        position: 'absolute',
        left: 16,
        right: 16,
        bottom: Math.max(8, insets.bottom - 10),
        alignItems: 'center',
      }}
    >
      <Surface
        kind="dock"
        radius={36}
        style={{
          width: '100%',
          maxWidth: 440,
          flexDirection: 'row',
          alignItems: 'center',
          padding: 6,
          gap: 2,
        }}
      >
        {state.routes.map((route, i) => {
          const focused = state.index === i;
          const label = descriptors[route.key].options.title ?? route.name;
          return (
            <Fragment key={route.key}>
              {i === 2 && (
                <View style={{ flex: 1, alignItems: 'center' }}>
                  <PressableScale
                    accessibilityRole="button"
                    accessibilityLabel="Open AI study assistant"
                    onPress={() => {
                      Keyboard.dismiss();
                      nav.navigate('Assistant');
                    }}
                  >
                    <Surface
                      kind="ink"
                      radius={26}
                      style={{
                        width: 52,
                        height: 52,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Icon name="sparkle" color="#FFFFFF" size={25} />
                    </Surface>
                  </PressableScale>
                </View>
              )}
              <PressableScale
                accessibilityRole="tab"
                accessibilityLabel={label}
                accessibilityState={{ selected: focused }}
                onPress={() => {
                  const event = navigation.emit({
                    type: 'tabPress',
                    target: route.key,
                    canPreventDefault: true,
                  });
                  if (!focused && !event.defaultPrevented)
                    navigation.navigate(route.name, route.params);
                }}
                onLongPress={() =>
                  navigation.emit({ type: 'tabLongPress', target: route.key })
                }
                style={{ flex: 1 }}
              >
                <View
                  style={{
                    height: 56,
                    borderRadius: 28,
                    backgroundColor: focused ? C.track : 'transparent',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 4,
                  }}
                >
                  <Icon
                    name={icons[route.name]}
                    size={21}
                    color={focused ? C.ink : C.inkMuted}
                  />
                  <Txt
                    numberOfLines={1}
                    style={{
                      fontSize: 10,
                      fontWeight: focused ? 700 : 500,
                      color: focused ? C.ink : C.inkMuted,
                    }}
                  >
                    {label}
                  </Txt>
                </View>
              </PressableScale>
            </Fragment>
          );
        })}
      </Surface>
    </View>
  );
}
