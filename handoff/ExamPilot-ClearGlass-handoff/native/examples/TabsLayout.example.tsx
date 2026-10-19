// Example: plugging the Clear Glass TabBar into navigation.
// expo-router — app/(tabs)/_layout.tsx:
//   import { Tabs } from "expo-router";
//   export default function Layout() {
//     return (
//       <Tabs tabBar={(p) => <TabBar {...p} />} screenOptions={{ headerShown: false, animation: "fade" }}>
//         <Tabs.Screen name="index" options={{ title: "Today" }} />
//         <Tabs.Screen name="calendar" options={{ title: "Calendar" }} />
//         <Tabs.Screen name="subjects" options={{ title: "Subjects" }} />
//         <Tabs.Screen name="questions" options={{ title: "Questions" }} />
//       </Tabs>
//     );
//   }
// React Navigation 7 (below):
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { TabBar } from "../index";
import TodayScreen from "./TodayScreen.example";

const Tab = createBottomTabNavigator();

export function MainTabs() {
  return (
    <Tab.Navigator tabBar={(p) => <TabBar {...p} />} screenOptions={{ headerShown: false, animation: "fade" }}>
      <Tab.Screen name="today" component={TodayScreen} options={{ title: "Today" }} />
      <Tab.Screen name="calendar" component={TodayScreen} options={{ title: "Calendar" }} />
      <Tab.Screen name="subjects" component={TodayScreen} options={{ title: "Subjects" }} />
      <Tab.Screen name="questions" component={TodayScreen} options={{ title: "Questions" }} />
    </Tab.Navigator>
  );
}
