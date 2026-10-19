import { VerifyEmail } from './src/screens/verification';
import { StatusBar, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator, type BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { ReducedMotionConfig, ReduceMotion } from 'react-native-reanimated';
import { StoreProvider, useStore } from './src/data/store';
import { ConfettiHost } from './src/lib/celebrate';
import { TabBar } from './src/components/TabBar';
import { Intro } from './src/screens/intro';
import { Splash, Login, Details, AdmitCard, PlanReady } from './src/screens/onboarding';
import { Today, Calendar, Subjects, Questions } from './src/screens/tabs';
import { Materials, Assistant, PdfReader } from './src/screens/tools';
import type { RootParams, TabParams } from './src/navigation';
import { C } from './src/theme';

const Stack = createNativeStackNavigator<RootParams>();
const Tabs = createBottomTabNavigator<TabParams>();
const theme = { ...DefaultTheme, colors: { ...DefaultTheme.colors, background: C.ground, card: C.ground, text: C.ink, primary: C.ink } };

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
  const { state } = useStore();
  // First launch plays the splash; returning students open straight on Today.
  const initial: keyof RootParams = !state.splashSeen ? 'Splash' : !state.signedIn ? 'Login' : !state.onboarded ? 'Details' : 'Main';
  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator initialRouteName={initial} screenOptions={{ headerShown: false, contentStyle: { backgroundColor: C.ground }, animation: 'fade_from_bottom' }}>
        <Stack.Screen name="Splash" component={Splash} options={{ animation: 'fade' }} />
        <Stack.Screen name="Intro" component={Intro} options={{ animation: 'fade' }} />
        <Stack.Screen name="Login" component={Login} options={{ animation: 'fade' }} />
        <Stack.Screen name="VerifyEmail" component={VerifyEmail} options={{ animation: 'fade' }} />
        <Stack.Screen name="Details" component={Details} options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="Admit" component={AdmitCard} options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="Plan" component={PlanReady} options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="Main" component={Main} options={{ animation: 'fade' }} />
        <Stack.Screen name="Materials" component={Materials} options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="Assistant" component={Assistant} options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="Pdf" component={PdfReader} options={{ animation: 'slide_from_right' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ReducedMotionConfig mode={ReduceMotion.System} />
        <StatusBar barStyle="dark-content" />
        <StoreProvider fallback={<View style={{ flex: 1, backgroundColor: C.ground }} />}>
          <Root />
          <ConfettiHost />
        </StoreProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
