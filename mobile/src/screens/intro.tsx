import { dropIn } from '../kit/motion';
import { MaterialView } from '../components/surface';
// Onboarding carousel (handoff board M3): three swipeable slides, a progress track with a star knob, back / next.
import { useRef, useState } from 'react';
import { ScrollView, View, useWindowDimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useAnimatedScrollHandler,
  useReducedMotion,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon, IconButton, Press, Txt, PrimaryButton, SecondaryButton } from '../components/ui';
import { GlassCard, Surface } from '../components/surface';
import { C, INK, SUBJ, TYPE, type SubjectColor } from '../theme';
import { useNav } from '../navigation';
import { useStore } from '../data/store';

const DATES: [string, string, string, SubjectColor, string][] = [
  ['21', 'OCT', 'Software Engineering', 'se', '-7deg'],
  ['22', 'OCT', 'Algorithms', 'daa', '5deg'],
  ['23', 'OCT', 'Data Structures', 'dds', '-3deg'],
];

function PlanArt() {
  return (
    <View style={{ flex: 1, justifyContent: 'center' }}>
      {DATES.map(([d, m, name, c, rot], i) => (
        <Animated.View entering={dropIn(i * 140, parseInt(rot, 10))}
          key={d}
          style={{
            marginLeft: i === 1 ? 70 : i === 2 ? 22 : 0,
            marginTop: i === 0 ? 0 : -34,
            width: '72%',
            transform: [{ rotate: rot }],
          }}
        >
          <GlassCard radius={30} padding={16}>
            <View
              style={{
                width: 56,
                height: 56,
                borderRadius: 18,
                backgroundColor: SUBJ[c].fill,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Txt style={{ fontSize: 22, fontWeight: 700, lineHeight: 24 }}>
                {d}
              </Txt>
              <Txt style={{ fontSize: 11, fontWeight: 700, color: SUBJ[c].text }}>
                {m}
              </Txt>
            </View>
            <Txt numberOfLines={1} style={[TYPE.bodyStrong, { marginTop: 10 }]}>
              {name}
            </Txt>
          </GlassCard>
        </Animated.View>
      ))}
      <Surface
        kind="ink"
        style={{
          position: 'absolute',
          top: 18,
          right: 18,
          height: 46,
          paddingHorizontal: 18,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <Icon name="check" size={18} color="#fff" />
        <Txt style={{ color: '#fff', fontWeight: 600 }}>Plan ready</Txt>
      </Surface>
    </View>
  );
}
function CalmArt() {
  const rows = [
    ['Recurrence relations', true, 'se'],
    ['Master theorem', true, 'se'],
    ['Amortised analysis', false, 'daa'],
    ['Hash tables', false, 'dds'],
  ] as const;
  return (
    <View style={{ flex: 1, justifyContent: 'center', gap: 12, padding: 8 }}>
      {rows.map(([t, done, c]) => (
        <GlassCard key={t} radius={26} padding={14}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <MaterialView
              style={[
                {
                  width: 28,
                  height: 28,
                  borderRadius: 14,
                  alignItems: 'center',
                  justifyContent: 'center',
                },
                done
                  ? INK
                  : { borderWidth: 2, borderColor: C.ring },
              ]}
            >
              {done && <Icon name="check" size={16} color="#fff" />}
            </MaterialView>
            <Txt style={{ flex: 1, fontWeight: 600, opacity: done ? 0.5 : 1 }}>
              {t}
            </Txt>
            <View
              style={{
                width: 10,
                height: 10,
                borderRadius: 5,
                backgroundColor: SUBJ[c].mark,
              }}
            />
          </View>
        </GlassCard>
      ))}
    </View>
  );
}
function AskArt() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', gap: 14, padding: 8 }}>
      <View style={{ alignSelf: 'flex-end', maxWidth: '78%' }}>
        <Surface kind="ink" radius={26} style={{ padding: 16, borderBottomRightRadius: 8 }}>
          <Txt style={{ color: '#fff' }}>Explain the master theorem simply</Txt>
        </Surface>
      </View>
      <View style={{ alignSelf: 'flex-start', maxWidth: '86%' }}>
        <GlassCard radius={26} padding={16} style={{ borderBottomLeftRadius: 8 }}>
          <Txt>
            Split the problem, solve the parts, then combine — compare the work at the
            top with the work at the leaves.
          </Txt>
        </GlassCard>
      </View>
    </View>
  );
}

const SLIDES = [
  {
    eyebrow: 'SMART PLANNING',
    title: 'Plan around\nyour exams',
    body: 'Add your admit card and we’ll build a calm day-by-day plan.',
    tint: SUBJ.se.fill,
    Art: PlanArt,
  },
  {
    eyebrow: 'CALM REVISION',
    title: 'One topic\nat a time',
    body: 'A short checklist each day. Tick it off, rest, and come back tomorrow.',
    tint: SUBJ.dds.fill,
    Art: CalmArt,
  },
  {
    eyebrow: 'STUDY ASSISTANT',
    title: 'Ask when\nyou’re stuck',
    body: 'Get plain-language answers, short plans and quick charts for any topic.',
    tint: SUBJ.daa.fill,
    Art: AskArt,
  },
];

export function Intro() {
  const nav = useNav();
  const reduce = useReducedMotion();
  const { state } = useStore();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const scroll = useRef<React.ComponentRef<typeof ScrollView>>(null);
  const [i, setI] = useState(0);
  const [trackW, setTrackW] = useState(0);
  const knob = useSharedValue(0);
  const last = i === SLIDES.length - 1;
  const onScroll = useAnimatedScrollHandler(e => { knob.value = Math.max(0, Math.min(1, e.contentOffset.x / (width * (SLIDES.length - 1)))); });
  const goTo = (n: number) => {
    scroll.current?.scrollTo({ x: n * width, animated: !reduce });
    setI(n);
    knob.value = withSpring(n / (SLIDES.length - 1), { stiffness: 300, damping: 31 });
  };
  const finish = () =>
    nav.reset({
      index: 0,
      routes: [
        {
          name: state.signedIn ? (state.onboarded ? 'Main' : 'Details') : 'Login',
        },
      ],
    });
  const knobStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: knob.value * Math.max(0, trackW - 44) }],
  }));
  const fill = useAnimatedStyle(() => ({ width: 22 + knob.value * Math.max(0, trackW - 44) }));
  return (
    <View style={{ flex: 1, backgroundColor: C.ground }}>
      <Animated.ScrollView
        onScroll={onScroll}
        scrollEventThrottle={16}
        ref={scroll}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={e => {
          const n = Math.round(e.nativeEvent.contentOffset.x / width);
          setI(n);
          knob.value = withSpring(n / (SLIDES.length - 1), { stiffness: 300, damping: 31 });
        }}
        style={{ flex: 1 }}
      >
        {SLIDES.map((s, k) => (
          <View
            key={k}
            style={{ width, paddingTop: insets.top + 16, paddingHorizontal: 24 }}
          >
            <View
              style={{
                height: '52%',
                borderRadius: 40,
                backgroundColor: s.tint,
                padding: 20,
                overflow: 'hidden',
              }}
            >
              <s.Art />
            </View>
            <View style={{ alignItems: 'center', marginTop: 28, gap: 8 }}>
              <Txt style={{ fontSize: 13, fontWeight: 700, letterSpacing: 2, color: C.inkSubtle }}>
                {s.eyebrow}
              </Txt>
              <Txt accessibilityRole="header" style={[TYPE.onboard, { textAlign: 'center' }]}>
                {s.title}
              </Txt>
              <Txt style={{ fontSize: 17, textAlign: 'center', color: C.inkMuted }}>
                {s.body}
              </Txt>
            </View>
          </View>
        ))}
      </Animated.ScrollView>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 16,
          paddingHorizontal: 24,
          paddingBottom: insets.bottom + 20,
          paddingTop: 12,
        }}
      >
        <View style={{ opacity: i === 0 ? 0.4 : 1 }}>
          <IconButton
            icon="chevron-left"
            label="Previous slide"
            onPress={() => i > 0 && goTo(i - 1)}
          />
        </View>
        <View
          onLayout={e => setTrackW(e.nativeEvent.layout.width)}
          style={{ flex: 1, height: 44, justifyContent: 'center' }}
        >
          <View style={{ height: 4, borderRadius: 2, backgroundColor: C.line2 }} />
          <Animated.View
            style={[
              {
                position: 'absolute',
                left: 0,
                height: 4,
                borderRadius: 2,
                backgroundColor: C.inkFlat,
              },
              fill,
            ]}
          />
          <Animated.View
            style={[
              {
                position: 'absolute',
                left: 0,
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: '#3B82F6',
                borderWidth: 3,
                borderColor: '#fff',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0px 6px 16px rgba(59,130,246,0.35)',
              },
              knobStyle,
            ]}
          >
            <Icon name="sparkle" size={18} color="#fff" />
          </Animated.View>
        </View>
        <IconButton
          icon="arrow-right"
          label={last ? 'Get started' : 'Next slide'}
          tone="dark"
          onPress={() => (last ? finish() : goTo(i + 1))}
        />
      </View>
      {last && <View style={{ paddingHorizontal: 24, gap: 12, paddingBottom: insets.bottom + 16 }}>
        <PrimaryButton label="Create account" onPress={() => nav.reset({ index: 0, routes: [{ name: 'Login', params: { mode: 'up' } }] })} />
        <SecondaryButton label="Log in" onPress={finish} />
      </View>}
      {!last && (
        <Press
          accessibilityRole="button"
          onPress={finish}
          style={{ position: 'absolute', right: 24, top: insets.top + 24, padding: 8 }}
        >
          <Txt style={{ fontWeight: 600, color: C.inkMuted }}>Skip</Txt>
        </Press>
      )}
    </View>
  );
}
