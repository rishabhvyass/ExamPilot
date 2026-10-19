import { AppearanceProvider, useAppearance } from './src/appearance';
import { ProfileScreen, SearchScreen } from './src/screens/account';
import { NativeExamActivity } from './src/components/NativeExamActivity';
import { VerifyEmail } from './src/screens/verification';
import { StatusBar, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator, type BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { ReducedMotionConfig, ReduceMotion, useReducedMotion } from 'react-native-reanimated';
import { StoreProvider } from './src/data/store';
import { ConfettiHost } from './src/lib/celebrate';
import { TabBar } from './src/components/TabBar';
import { Intro } from './src/screens/intro';
import { Splash, Login, Details, AdmitCard, PlanReady } from './src/screens/onboarding';
import { Today, Calendar, Subjects, Questions } from './src/screens/tabs';
import { Materials, Assistant, PdfReader } from './src/screens/tools';
import type { RootParams, TabParams } from './src/navigation';
import { useColors } from './src/theme';

const Stack = createNativeStackNavigator<RootParams>();
const Tabs = createBottomTabNavigator<TabParams>();


const renderTabBar = (p: BottomTabBarProps) => <TabBar {...p} />;

function Main() {
  return (
    <Tabs.Navigator tabBar={renderTabBar} screenOptions={{ headerShown: false, animation: 'fade' }}>
      <Tabs.Screen name="Today" component={Today} />
      <Tabs.Screen name="Calendar" component={Calendar} />
      <Tabs.Screen name="Subjects" component={Subjects} />
      <Tabs.Screen name="Questions" component={Questions} />
    </Tabs.Navigator>
  );
}

function Root() {
  const C = useColors();
  const { dark } = useAppearance();
  const theme = { ...DefaultTheme, dark, colors: { ...DefaultTheme.colors, background: C.ground, card: C.surface, text: C.ink, primary: C.ink, border: C.line } };
  const reduce = useReducedMotion();
  // Every launch shows the brief splash, then restores the correct account route.
  const initial: keyof RootParams = 'Splash';
  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator initialRouteName={initial} screenOptions={{ headerShown: false, contentStyle: { backgroundColor: C.ground }, animation: reduce ? 'none' : 'fade_from_bottom' }}>
        <Stack.Screen name="Splash" component={Splash} options={{ animation: 'fade' }} />
        <Stack.Screen name="Intro" component={Intro} options={{ animation: 'fade' }} />
        <Stack.Screen name="Login" component={Login} options={{ animation: 'fade' }} />
        <Stack.Screen name="VerifyEmail" component={VerifyEmail} options={{ animation: 'fade' }} />
        <Stack.Screen name="Details" component={Details} options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="Admit" component={AdmitCard} options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="Plan" component={PlanReady} options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="Main" component={Main} options={{ animation: 'fade' }} />
        <Stack.Screen name="Materials" component={Materials} options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="Assistant" component={Assistant} options={{ animation: reduce ? 'none' : 'slide_from_bottom', animationDuration: 320 }} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Search" component={SearchScreen} />
        <Stack.Screen name="Pdf" component={PdfReader} options={{ animation: 'slide_from_right' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function AppContent() {
  const C = useColors();
  const { dark } = useAppearance();
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ReducedMotionConfig mode={ReduceMotion.System} />
        <StatusBar barStyle={dark ? "light-content" : "dark-content"} />
        <StoreProvider fallback={<View style={{ flex: 1, backgroundColor: C.ground }} />}>
          <NativeExamActivity />
          <Root />
          <ConfettiHost />
        </StoreProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default function App() {
  return <AppearanceProvider><AppContent /></AppearanceProvider>;
}
