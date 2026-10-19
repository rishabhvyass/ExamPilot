// SplashIntro — animated splash (≈1.9s, first launch only). Pure white ground.
// Blue / violet / green circles bloom, a glossy black logo tile pops and its paper plane draws, the letters
// of "ExamPilot" blur-rise one by one, a thin black bar loads, then the soft "Let's begin" button blurs in.
// Hide the native splash (expo-splash-screen) as soon as this mounts so the two don't overlap.
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, { Easing, cancelAnimation, useAnimatedProps, useAnimatedStyle, useReducedMotion, useSharedValue, withDelay, withRepeat, withTiming } from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BlurIn } from "./BlurIn";
import { Surface } from "./Surface";
import { SoftButton } from "./SoftButton";
import { blur as BLUR, bloom, ease, splashTimeline as T } from "../motion";
import { color, subject, type as TYPE } from "../theme";

const APath = Animated.createAnimatedComponent(Path);
const PLANE_LEN = 57; // length of "M3 11l18-7-7 18-2.5-8.5z"

export function SplashIntro({ onBegin }: { onBegin: () => void }) {
  const reduce = useReducedMotion();
  const insets = useSafeAreaInsets();
  const draw = useSharedValue(reduce ? 0 : PLANE_LEN);
  const load = useSharedValue(reduce ? 1 : 0);
  const orbit = useSharedValue(0);

  useEffect(() => {
    if (reduce) return;
    draw.value = withDelay(T.markDraw, withTiming(0, { duration: 700, easing: ease.draw }));
    load.value = withDelay(T.loadBar.start, withTiming(1, { duration: T.loadBar.duration, easing: Easing.bezier(0.4, 0, 0.2, 1) }));
    orbit.value = withRepeat(withTiming(360, { duration: 14000, easing: Easing.linear }), -1);
    return () => cancelAnimation(orbit);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce]);

  const planeProps = useAnimatedProps(() => ({ strokeDashoffset: draw.value }));
  const bar = useAnimatedStyle(() => ({ transform: [{ scaleX: load.value }] }));
  const orbitStyle = useAnimatedStyle(() => ({ transform: [{ rotate: `${orbit.value}deg` }] }));

  return (
    <View style={{ flex: 1, backgroundColor: color.ground, paddingHorizontal: 24, paddingTop: insets.top + 16, paddingBottom: insets.bottom + 40 }}>
      <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={{ flex: 1 }}>
        <Animated.View style={[styles.orbit, orbitStyle]}>
          <Animated.View entering={bloom(T.orbitDot)}>
            <Surface kind="ink" style={{ position: "absolute", left: 10, top: 210, width: 14, height: 14 }} />
          </Animated.View>
        </Animated.View>
        <Animated.View entering={bloom(T.circles[0])} style={[styles.circle, { left: 46, top: 120, width: 130, height: 130, backgroundColor: color.artBlue }]} />
        <Animated.View entering={bloom(T.circles[1])} style={[styles.circle, { left: 148, top: 168, width: 118, height: 118, backgroundColor: color.artViolet }]} />
        <Animated.View entering={bloom(T.circles[2])} style={[styles.circle, { left: 88, top: 236, width: 96, height: 96, backgroundColor: color.artGreen }]} />
        <Animated.View entering={bloom(T.markBadge)} style={{ position: "absolute", left: 131, top: 190 }}>
          <Surface kind="ink" radius={28} style={{ width: 80, height: 80, alignItems: "center", justifyContent: "center" }}>
            <Svg width={40} height={40} viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <APath d="M3 11l18-7-7 18-2.5-8.5z" strokeDasharray={PLANE_LEN} animatedProps={planeProps} />
            </Svg>
          </Surface>
        </Animated.View>
      </View>

      <View style={{ gap: 14 }}>
        <View accessible accessibilityRole="header" accessibilityLabel="ExamPilot" style={{ flexDirection: "row" }}>
          {"ExamPilot".split("").map((ch, i) => (
            <BlurIn key={i} delay={T.letters.start + i * T.letters.step} rise={22} amount={BLUR.letter} ms={600}>
              <Text style={TYPE.splash}>{ch}</Text>
            </BlurIn>
          ))}
        </View>
        <BlurIn delay={T.tagline} rise={10} ms={600}>
          <Text style={{ ...TYPE.body, fontSize: 19, lineHeight: 28, color: subject.SE.text }}>
            Study calm. Exam ready.{"\n"}One topic at a time.
          </Text>
        </BlurIn>
        <View style={{ marginTop: 6, height: 4, borderRadius: 9999, backgroundColor: color.line, overflow: "hidden" }}>
          <Animated.View style={[{ height: 4, borderRadius: 9999, backgroundColor: color.inkFlat, transformOrigin: "left" }, bar]} />
        </View>
        <BlurIn delay={T.cta} rise={10} ms={600} style={{ marginTop: 12 }}>
          <SoftButton variant="primary" large onPress={onBegin}>Let’s begin</SoftButton>
        </BlurIn>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  circle: { position: "absolute", borderRadius: 9999 },
  orbit: { position: "absolute", left: 18, top: 40, width: 320, height: 320 },
});
