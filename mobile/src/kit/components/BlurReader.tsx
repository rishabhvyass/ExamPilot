// BlurReader — the "focus read" from your reference clip (board M9), for React Native.
//
// • Lines drift up one at a time every 2.6s (track: 900ms, cubic-bezier(.65,0,.25,1)). The focused line is
//   centred, bold (700) and #111113; the next ones turn #6E6E74 and slightly blurred; far lines #A6A6AC and
//   more blurred; the top & bottom edges fade through a progressive blur.
// • Bottom: one soft dock with three glossy black icons (Notes / Ask Pilo / Saved). The selected one sits in
//   the pressed-in groove, which springs between them. Switching mode blurs the text out and back in.
//   A separate round pen button toggles a highlighter that wipes in under the focused line.
// • Tap a line to focus it. Auto-advance pauses while a finger is on the reader. Reduce motion: no
//   auto-advance, no blur, the track jumps instead of drifting.
//
// Per-line blur: iOS puts a small BlurView over each line (intensity 0 / 6 / 18); Android 12+ uses the
// native `filter: blur()` style; older Android shows colour only.
import { useEffect, useRef, useState } from "react";
import { Platform, Pressable, StyleSheet, Text, View, type LayoutChangeEvent } from "react-native";
import Animated, { useDerivedValue, useAnimatedStyle, useReducedMotion, useSharedValue, withSpring, withTiming } from "react-native-reanimated";
import { BlurVeil } from "../compat";
import { LinearGradient } from "../compat";
import { BlurIn } from "./BlurIn";
import { ProgressiveBlur } from "./ProgressiveBlur";
import { PressableScale } from "./PressableScale";
import { Surface, splitShadow } from "./Surface";
import { GlossIcon, ICON, READER_ICONS } from "./Icon";
import { blur as BLUR, duration, ease, readerLine, spring } from "../motion";
import { color, fontFamily, radius, surface } from "../theme";

export { READER_ICONS };
export type ReaderMode = { id: string; label: string; iconPath: string; lines: string[] };

const androidFilter = Platform.OS === "android" && Number(Platform.Version) >= 31;
const TOOLBAR = 96;

function Line({ text, distance, highlight, onPress, onLayout, reduce }: { text: string; distance: number; highlight: boolean; onPress: () => void; onLayout: (e: LayoutChangeEvent) => void; reduce: boolean }) {
  const look = readerLine(distance);
  const op = useSharedValue(look.opacity);
  const blur = useSharedValue(reduce ? 0 : look.blur);
  const hl = useSharedValue(highlight ? 1 : 0);
  useEffect(() => {
    op.value = withTiming(look.opacity, { duration: duration.readerLine, easing: ease.inOut });
    blur.value = withTiming(reduce ? 0 : look.blur, { duration: duration.readerLine, easing: ease.inOut });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [distance, reduce]);
  useEffect(() => {
    hl.value = withTiming(highlight ? 1 : 0, { duration: 700, easing: ease.smooth });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [highlight]);

  const wrap = useAnimatedStyle(() => ({ opacity: op.value, ...(androidFilter ? { filter: [{ blur: blur.value }] } : {}) }));
  const veil = useDerivedValue(() => blur.value * 11); // 0.4px → ~4, 1.6px → ~18
  const marker = useAnimatedStyle(() => ({ transform: [{ scaleX: hl.value }] }));

  return (
    <Pressable onPress={onPress} onLayout={onLayout} accessibilityRole="text" accessibilityState={{ selected: distance === 0 }}>
      <Animated.View style={[{ marginBottom: 22 }, wrap]}>
        <Animated.View pointerEvents="none" style={[styles.marker, { transformOrigin: "left" }, marker]} />
        <Text style={{ fontFamily: fontFamily[look.weight], fontSize: 17, lineHeight: 25.5, color: look.color }}>{text}</Text>
        {Platform.OS === "ios" && !reduce && distance > 0 && (
          <BlurVeil level={veil} max={18} style={StyleSheet.absoluteFill} />
        )}
      </Animated.View>
    </Pressable>
  );
}

export function BlurReader({ modes, height = 600 }: { modes: ReaderMode[]; height?: number }) {
  const reduce = useReducedMotion();
  const [modeIdx, setModeIdx] = useState(0);
  const [focus, setFocus] = useState(0);
  const [paused, setPaused] = useState(false);
  const [highlight, setHighlight] = useState(false);
  const layouts = useRef<Record<number, { y: number; h: number }>>({});
  const lines = modes[modeIdx].lines;
  const viewport = height - TOOLBAR;

  // auto-advance
  useEffect(() => {
    if (paused || reduce) return;
    const t = setInterval(() => setFocus((f) => (f + 1) % lines.length), duration.readerStep);
    return () => clearInterval(t);
  }, [paused, reduce, lines.length]);

  // centre the focused line
  const ty = useSharedValue(viewport / 2);
  const centre = () => {
    const l = layouts.current[focus];
    if (!l) return;
    const to = Math.round(viewport / 2 - (l.y + l.h / 2));
    ty.value = reduce ? to : withTiming(to, { duration: duration.readerTrack, easing: ease.scroll });
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(centre, [focus, modeIdx, viewport, reduce]);
  const track = useAnimatedStyle(() => ({ transform: [{ translateY: ty.value }] }));

  // groove under the selected mode button
  const BTN = 64, GAP = 2, PAD = 5;
  const gx = useSharedValue(PAD + modeIdx * (BTN + GAP));
  useEffect(() => {
    gx.value = withSpring(PAD + modeIdx * (BTN + GAP), spring.layout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modeIdx]);
  const groove = useAnimatedStyle(() => ({ transform: [{ translateX: gx.value }] }));
  const recessInset = splitShadow(surface.recess.boxShadow).inset;

  // pen
  const pen = useSharedValue(0);
  useEffect(() => {
    pen.value = withSpring(highlight ? 1 : 0, spring.pen);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [highlight]);
  const penStyle = useAnimatedStyle(() => ({ transform: [{ rotate: `${-18 * pen.value}deg` }, { scale: 1 + 0.1 * pen.value }] }));

  const switchMode = (i: number) => {
    if (i === modeIdx) return;
    layouts.current = {};
    setModeIdx(i);
    setFocus(0);
  };

  return (
    <Surface kind="blurReaderCard" radius={radius.reader} style={{ height, overflow: "visible" }}>
      <View
        style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: TOOLBAR, overflow: "hidden", borderTopLeftRadius: radius.reader, borderTopRightRadius: radius.reader }}
        onTouchStart={() => setPaused(true)}
        onTouchEnd={() => setPaused(false)}
        onTouchCancel={() => setPaused(false)}
        accessibilityLiveRegion="polite"
      >
        <BlurIn key={modes[modeIdx].id} amount={BLUR.swap} ms={duration.blurSwap} delay={0} rise={0} style={StyleSheet.absoluteFill}>
          <Animated.View style={[{ position: "absolute", left: 26, right: 26, top: 0 }, track]}>
            {lines.map((t, i) => (
              <Line
                key={i}
                text={t}
                distance={Math.abs(i - focus)}
                highlight={highlight && i === focus}
                reduce={!!reduce}
                onPress={() => setFocus(i)}
                onLayout={(e) => {
                  const { y, height: h } = e.nativeEvent.layout;
                  layouts.current[i] = { y, h };
                  if (i === focus) centre();
                }}
              />
            ))}
          </Animated.View>
        </BlurIn>
        <ProgressiveBlur side="top" height={130} />
        <ProgressiveBlur side="bottom" height={130} />
      </View>

      {/* toolbar */}
      <View style={styles.toolbar}>
        <Surface kind="dock" style={{ height: 60, flexDirection: "row", padding: PAD, gap: GAP }}>
          <Animated.View pointerEvents="none" style={[styles.groove, groove]}>
            <LinearGradient colors={[...surface.recess.colors]} style={StyleSheet.absoluteFill} />
            <View style={[StyleSheet.absoluteFill, { borderRadius: 9999, boxShadow: recessInset }]} />
          </Animated.View>
          {modes.map((m, i) => (
            <PressableScale key={m.id} amount="small" onPress={() => switchMode(i)} accessibilityRole="tab" accessibilityLabel={m.label} accessibilityState={{ selected: i === modeIdx }} style={styles.modeBtn}>
              <GlossIcon d={m.iconPath} active={i === modeIdx} />
            </PressableScale>
          ))}
        </Surface>
        <PressableScale amount="small" onPress={() => setHighlight((h) => !h)} accessibilityLabel="Highlight focus line" accessibilityState={{ selected: highlight }}>
          <Surface kind={highlight ? "recess" : "clay"} style={{ width: 60, height: 60, alignItems: "center", justifyContent: "center" }}>
            <Animated.View style={penStyle}>
              <GlossIcon d={ICON.pen} size={22} stroke />
            </Animated.View>
          </Surface>
        </PressableScale>
      </View>
    </Surface>
  );
}

const styles = StyleSheet.create({
  marker: { position: "absolute", left: -6, right: -6, top: 2, bottom: 2, borderRadius: 6, backgroundColor: color.highlighter },
  toolbar: { position: "absolute", left: 16, right: 16, bottom: 18, height: 64, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  groove: { position: "absolute", top: 5, left: 0, width: 64, height: 50, borderRadius: 9999, overflow: "hidden" },
  modeBtn: { width: 64, height: 50, borderRadius: 9999, alignItems: "center", justifyContent: "center" },
});
