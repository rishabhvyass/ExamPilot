// GooeyIsland — board M2. A black "study island" at the top of Today (like Dynamic Island).
// A small blob sits next to the pill; when a status arrives they melt together (Skia goo: blur + alpha
// threshold) and the pill stretches to show the message, which fades in 160ms later.
// npx expo install @shopify/react-native-skia
// Reduce motion: no goo, the pill just resizes.
import type { ReactNode } from "react";
import { useEffect } from "react";
import { Pressable, Text, View, useWindowDimensions } from "react-native";
import Animated, { FadeIn, FadeOut, useDerivedValue, useReducedMotion, useSharedValue, withSpring } from "react-native-reanimated";
import { Blur, Canvas, Circle, ColorMatrix, Group, Paint, RoundedRect } from "@shopify/react-native-skia";
import { spring } from "../motion";
import { fontFamily } from "../theme";

export type IslandState = { kind: "idle" } | { kind: "message"; icon?: ReactNode; text: string; trailing?: ReactNode };

const CH = 76;
const IDLE = { w: 126, h: 36 };

export function GooeyIsland({ state, onPress }: { state: IslandState; onPress?: () => void }) {
  const reduce = useReducedMotion();
  const { width } = useWindowDimensions();
  const CW = Math.min(390, width - 40);
  const OPEN = { w: Math.min(340, CW - 16), h: 56 };
  const open = state.kind === "message";
  const w = useSharedValue(IDLE.w);
  const h = useSharedValue(IDLE.h);
  const blobX = useSharedValue(CW / 2 + IDLE.w / 2 + 26);
  const blobR = useSharedValue(18);

  useEffect(() => {
    w.value = withSpring(open ? OPEN.w : IDLE.w, spring.island);
    h.value = withSpring(open ? OPEN.h : IDLE.h, spring.island);
    blobX.value = withSpring(open ? CW / 2 : CW / 2 + IDLE.w / 2 + 26, spring.island);
    blobR.value = withSpring(open ? 0 : 18, spring.island);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const x = useDerivedValue(() => (CW - w.value) / 2);
  const r = useDerivedValue(() => h.value / 2);

  const shapes = (
    <>
      <RoundedRect x={x} y={10} width={w} height={h} r={r} color="black" />
      <Circle cx={blobX} cy={28} r={blobR} color="black" />
    </>
  );

  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={open ? state.text : "Study status"} accessibilityLiveRegion="polite" style={{ width: CW, height: CH, alignSelf: "center" }}>
      <Canvas style={{ width: CW, height: CH }}>
        {reduce ? (
          shapes
        ) : (
          <Group layer={<Paint><Blur blur={7} /><ColorMatrix matrix={[1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 22, -10]} /></Paint>}>
            {shapes}
          </Group>
        )}
      </Canvas>
      {open && (
        <Animated.View entering={FadeIn.delay(160).duration(360)} exiting={FadeOut.duration(150)} style={{ position: "absolute", left: (CW - OPEN.w) / 2 + 12, right: (CW - OPEN.w) / 2 + 12, top: 10, height: OPEN.h, flexDirection: "row", alignItems: "center", gap: 12 }}>
          {state.icon}
          <View style={{ flex: 1 }}>
            <Text numberOfLines={1} style={{ fontFamily: fontFamily[600], fontSize: 14, color: "#FFFFFF" }}>{state.text}</Text>
          </View>
          {state.trailing}
        </Animated.View>
      )}
    </Pressable>
  );
}
