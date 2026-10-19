// CodePill — email/SMS code verification (board M1). One pill that morphs through four states:
//   "Enter code" → 6 digit cells (typed digits pop in, caret blinks) → "Verifying…" (spinner) → "Verified ✓".
// Wrong code: the pill shakes, cells tint with the error colour, a message appears.
// One hidden TextInput (number pad, one-time-code autofill on iOS, sms-otp on Android).
import { useEffect, useRef, useState, type ComponentRef } from "react";
import { ActivityIndicator, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import Animated, { FadeIn, FadeOut, useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from "react-native-reanimated";
import { Surface } from "./Surface";
import { Icon, ICON } from "./Icon";
import { digitIn, layout, SHAKE_STEPS } from "../motion";
import { color, fontFamily, subject } from "../theme";

type Phase = "idle" | "typing" | "checking" | "done";

function Caret() {
  const o = useSharedValue(1);
  useEffect(() => {
    o.value = withRepeat(withSequence(withTiming(0, { duration: 500 }), withTiming(1, { duration: 500 })), -1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const s = useAnimatedStyle(() => ({ opacity: o.value }));
  return <Animated.View style={[{ width: 2, height: 20, backgroundColor: color.ink }, s]} />;
}

export function CodePill({ verify }: { verify: (code: string) => Promise<boolean> }) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [code, setCode] = useState("");
  const [bad, setBad] = useState(false);
  const input = useRef<ComponentRef<typeof TextInput>>(null);
  const x = useSharedValue(0);
  const shake = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }] }));

  async function onChange(v: string) {
    const c = v.replace(/\D/g, "").slice(0, 6);
    setCode(c);
    if (c.length === 6) {
      setPhase("checking");
      const ok = await verify(c);
      if (ok) setPhase("done");
      else {
        setPhase("typing");
        setCode("");
        setBad(true);
        x.value = withSequence(...SHAKE_STEPS.map((s) => withTiming(s, { duration: 46 })));
        input.current?.focus();
      }
    } else if (c.length > 0) setBad(false);
  }

  const done = phase === "done";
  const pill = (
    <Animated.View layout={layout} style={[{ height: 60, borderRadius: 9999, paddingHorizontal: 8, justifyContent: "center" }, done ? { backgroundColor: subject.DDS.fill } : null]}>
      {phase === "idle" && (
        <Animated.Text entering={FadeIn} exiting={FadeOut} style={[styles.label, { paddingHorizontal: 20 }]}>Enter code</Animated.Text>
      )}
      {phase === "typing" && (
        <Animated.View entering={FadeIn.duration(260)} style={{ flexDirection: "row", gap: 6 }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <View key={i} style={[styles.cell, bad && code.length === 0 ? { backgroundColor: color.errorBg } : null, i === code.length ? styles.cellActive : null]}>
              {code[i] ? (
                <Animated.Text entering={digitIn} style={[styles.digit, bad && code.length === 0 ? { color: color.errorText } : null]}>{code[i]}</Animated.Text>
              ) : i === code.length ? (
                <Caret />
              ) : null}
            </View>
          ))}
        </Animated.View>
      )}
      {phase === "checking" && (
        <Animated.View entering={FadeIn} style={{ flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 20 }} accessibilityLiveRegion="polite">
          <ActivityIndicator color={color.ink} />
          <Text style={styles.label}>Verifying…</Text>
        </Animated.View>
      )}
      {done && (
        <Animated.View entering={FadeIn} style={{ flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 20 }} accessibilityLiveRegion="polite">
          <Icon d={ICON.check} size={18} strokeWidth={3} color={subject.DDS.text} />
          <Text style={[styles.label, { color: subject.DDS.text }]}>Verified</Text>
        </Animated.View>
      )}
    </Animated.View>
  );

  return (
    <View style={{ alignItems: "center", gap: 12 }}>
      <Animated.View style={shake}>
        <Pressable
          onPress={() => {
            if (phase === "idle") setPhase("typing");
            setTimeout(() => input.current?.focus(), 0);
          }}
          accessibilityRole="button"
          accessibilityLabel={phase === "idle" ? "Enter code" : "6-digit code"}
        >
          {done ? pill : <Surface kind="clay">{pill}</Surface>}
        </Pressable>
      </Animated.View>
      <TextInput
        ref={input}
        value={code}
        onChangeText={onChange}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        autoComplete={Platform.OS === "android" ? "sms-otp" : "one-time-code"}
        maxLength={6}
        editable={phase === "typing" || phase === "idle"}
        style={styles.hidden}
        accessibilityLabel="6-digit code"
      />
      {bad && phase === "typing" && (
        <Animated.Text entering={FadeIn} accessibilityRole="alert" style={{ fontFamily: fontFamily[400], fontSize: 14, color: color.errorText }}>
          That code didn’t match. Try again.
        </Animated.Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  label: { fontFamily: fontFamily[600], fontSize: 16, color: color.inkButton },
  cell: { width: 40, height: 44, borderRadius: 14, backgroundColor: "#FFFFFF", alignItems: "center", justifyContent: "center" },
  cellActive: { borderWidth: 2, borderColor: color.ink },
  digit: { fontFamily: fontFamily[600], fontSize: 20, color: color.ink },
  hidden: { position: "absolute", width: 1, height: 1, opacity: 0 },
});
