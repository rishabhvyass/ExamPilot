import { useEffect } from 'react';
import { View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { BlurIn } from '../kit/components/BlurIn';
import { useSubjectColors, useColors } from '../theme';
import { Txt } from './ui';
import { Surface } from './surface';
import { clampRange, minutesToTime, timeToMinutes } from '../lib/studyRange';

/** Two 44pt drag handles, snapped to quarter hours; accessible adjustment is equivalent to dragging. */
export function TimeRangePicker({
  start,
  end,
  onChange,
}: {
  start: string;
  end: string;
  onChange: (start: string, end: string) => void;
}) {
  const SUBJ = useSubjectColors();
  const C = useColors();
  const savedStart = timeToMinutes(start);
  const savedEnd = timeToMinutes(end);
  const width = useSharedValue(1);
  const left = useSharedValue(timeToMinutes(start));
  const right = useSharedValue(timeToMinutes(end));
  const startOrigin = useSharedValue(0);
  const endOrigin = useSharedValue(0);
  useEffect(() => {
    left.value = timeToMinutes(start);
    right.value = timeToMinutes(end);
  }, [start, end, left, right]);
  const commit = (a: number, b: number) =>
    onChange(minutesToTime(a), minutesToTime(b));
  const pan = (edge: 'start' | 'end') =>
    Gesture.Pan()
      .onBegin(() => {
        if (edge === 'start') startOrigin.value = left.value;
        else endOrigin.value = right.value;
      })
      .onUpdate(e => {
        const result = clampRange(
          edge,
          (edge === 'start' ? startOrigin.value : endOrigin.value) +
            (e.translationX / Math.max(1, width.value)) * 1440,
          left.value,
          right.value,
        );
        left.value = result.start;
        right.value = result.end;
      })
      .onEnd(() => {
        scheduleOnRN(commit, left.value, right.value);
      })
      .onFinalize((_event, success) => {
        if (!success) {
          // Cancelled gestures must not leave an unsaved range on screen.
          left.value = savedStart;
          right.value = savedEnd;
        }
      });
  const band = useAnimatedStyle(() => ({
    left: (left.value / 1440) * width.value,
    width: ((right.value - left.value) / 1440) * width.value,
  }));
  const a = useAnimatedStyle(() => ({
    transform: [{ translateX: (left.value / 1440) * width.value - 22 }],
  }));
  const b = useAnimatedStyle(() => ({
    transform: [{ translateX: (right.value / 1440) * width.value - 22 }],
  }));
  const adjust = (edge: 'start' | 'end', direction: number) => {
    const range = clampRange(
      edge,
      timeToMinutes(edge === 'start' ? start : end) + direction * 15,
      timeToMinutes(start),
      timeToMinutes(end),
    );
    commit(range.start, range.end);
  };
  return (
    <View style={{ paddingHorizontal: 22, gap: 10 }}>
      <BlurIn soft rise={0} key={`${start}-${end}`}>
        <Txt style={{ textAlign: 'center', color: C.inkMuted }}>
          {start} – {end} · {timeToMinutes(end) - timeToMinutes(start)} min
        </Txt>
      </BlurIn>
      <View
        onLayout={e => {
          width.value = e.nativeEvent.layout.width;
        }}
        style={{ height: 52, justifyContent: 'center' }}
      >
        <View
          style={{ height: 8, borderRadius: 4, backgroundColor: C.track }}
        />
        <Animated.View
          style={[
            {
              position: 'absolute',
              height: 8,
              borderRadius: 4,
              backgroundColor: SUBJ.se.mark,
            },
            band,
          ]}
        />
        {(['start', 'end'] as const).map(edge => (
          <GestureDetector key={edge} gesture={pan(edge)}>
            <Animated.View
              accessible
              accessibilityRole="adjustable"
              accessibilityLabel={`${edge === 'start' ? 'Start' : 'End'} time`}
              accessibilityValue={{ text: edge === 'start' ? start : end }}
              accessibilityActions={[
                { name: 'increment' },
                { name: 'decrement' },
              ]}
              onAccessibilityAction={e =>
                adjust(edge, e.nativeEvent.actionName === 'increment' ? 1 : -1)
              }
              style={[
                {
                  position: 'absolute',
                  width: 44,
                  height: 44,
                  alignItems: 'center',
                  justifyContent: 'center',
                },
                edge === 'start' ? a : b,
              ]}
            >
              <Surface
                kind={edge === 'start' ? 'clay' : 'ink'}
                radius={14}
                style={{
                  width: 28,
                  height: 36,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <View
                  style={{
                    width: 3,
                    height: 14,
                    borderRadius: 2,
                    backgroundColor: edge === 'start' ? C.ink : '#FFFFFF',
                  }}
                />
              </Surface>
            </Animated.View>
          </GestureDetector>
        ))}
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Txt style={{ fontSize: 12, color: C.inkSubtle }}>00:00</Txt>
        <Txt style={{ fontSize: 12, color: C.inkSubtle }}>12:00</Txt>
        <Txt style={{ fontSize: 12, color: C.inkSubtle }}>24:00</Txt>
      </View>
    </View>
  );
}
