// Celebrate — one gentle confetti burst (plan ready, all tasks done, PDF finished).
// npx expo install react-native-fast-confetti @shopify/react-native-skia
// Mount <CelebrateLayer ref={celebrate} /> once at the top of a screen, then call celebrate.current?.fire().
// Off with the OS "Reduce motion" setting.
import { useImperativeHandle, useRef, type Ref } from "react";
import { StyleSheet, View } from "react-native";
import { useReducedMotion } from "react-native-reanimated";
import { Confetti, type ConfettiMethods } from "react-native-fast-confetti";
import * as Haptics from "expo-haptics";
import { confetti } from "../motion";

export type CelebrateHandle = { fire: () => void };

export function CelebrateLayer({ ref }: { ref?: Ref<CelebrateHandle> }) {
  const reduce = useReducedMotion();
  const c = useRef<ConfettiMethods>(null);
  useImperativeHandle(ref, () => ({
    fire: () => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      if (!reduce) c.current?.restart();
    },
  }));
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Confetti ref={c} autoplay={false} count={confetti.count} colors={confetti.colors} fadeOutOnEnd reduceMotion="system" />
    </View>
  );
}
