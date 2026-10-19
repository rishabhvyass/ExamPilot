import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { Appearance, StyleSheet, useColorScheme, View } from 'react-native';
import { kv } from './data/kv';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

export type ThemeMode = 'system' | 'light' | 'dark';
const KEY = 'exampilot:appearance';
const Context = createContext({
  mode: 'system' as ThemeMode,
  dark: false,
  setMode: (_mode: ThemeMode) => {},
});
export const useAppearance = () => useContext(Context);

export function AppearanceProvider({ children }: { children: ReactNode }) {
  const system = useColorScheme();
  const [mode, setModeValue] = useState<ThemeMode>('system');
  const [ready, setReady] = useState(false);
  const reduce = useReducedMotion();
  const dark = mode === 'system' ? system === 'dark' : mode === 'dark';
  const fade = useSharedValue(0);
  const previous = useRef(dark);
  const [veilColor, setVeilColor] = useState('#FFFFFF');
  useEffect(() => {
    kv.getItem(KEY)
      .then(value => {
        if (value === 'light' || value === 'dark' || value === 'system')
          setModeValue(value);
      })
      .catch(() => {})
      .finally(() => setReady(true));
  }, []);
  useEffect(() => {
    if (previous.current === dark) return;
    setVeilColor(previous.current ? '#101114' : '#FFFFFF');
    previous.current = dark;
    fade.value = reduce ? 0 : 1;
    fade.value = withTiming(0, {
      duration: 320,
      easing: Easing.inOut(Easing.cubic),
    });
  }, [dark, fade, reduce]);
  useEffect(() => {
    if (!ready) return;
    Appearance.setColorScheme(mode === 'system' ? 'unspecified' : mode);
  }, [mode, ready]);
  const value = useMemo(
    () => ({
      mode,
      dark,
      setMode: (next: ThemeMode) => {
        setModeValue(next);
        kv.setItem(KEY, next).catch(() => {});
      },
    }),
    [mode, dark],
  );
  const veil = useAnimatedStyle(() => ({ opacity: fade.value }));
  return (
    <Context.Provider value={value}>
      <View style={{ flex: 1, backgroundColor: dark ? '#101114' : '#FFFFFF' }}>
        {children}
        <Animated.View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: veilColor, zIndex: 9999 },
            veil,
          ]}
        />
      </View>
    </Context.Provider>
  );
}
