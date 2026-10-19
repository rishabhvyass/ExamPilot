import { useEffect, useRef, useState } from 'react';
import { Pressable, View, useWindowDimensions } from 'react-native';
import Animated, {
  Easing,
  FadeInDown,
  useAnimatedProps,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { scheduleOnRN } from 'react-native-worklets';
import type { SharedValue } from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { keepLocalCopy, pick, types } from '@react-native-documents/picker';
import { parseAdmitCard, shortCode } from '../lib/admitParser';
import { imageText, pdfText } from '../lib/pdfText';
import { aiEnabled, readAdmitCardAI } from '../lib/ai';
import { launchCamera } from 'react-native-image-picker';
import {
  Field,
  Icon,
  IconButton,
  Illo,
  InfoCard,
  Press,
  PrimaryButton,
  Rise,
  Screen,
  SecondaryButton,
  StepHeader,
  Txt,
} from '../components/ui';
import { ExamSheet } from '../components/examsheet';
import { ChoiceGroup } from '../components/choicegroup';
import { celebrate } from '../lib/celebrate';
import { C, SUBJ, TYPE, colorOf, paletteAt, SHADOW, INK, SHEEN } from '../theme';
import { GoogleSigninButton } from '@react-native-google-signin/google-signin';
import { useStore } from '../data/store';
import {
  authMessage,
  resetPassword,
  signInEmail,
  signInGoogle,
  signUpEmail,
  type User,
} from '../data/auth';
import type { State } from '../data/types';
import { useNav } from '../navigation';
import {
  daysBetween,
  dayNum,
  fmtTimeShort,
  monthShort,
  todayISO,
  weekday,
} from '../lib/dates';
import { generatePlan, hours } from '../lib/plan';
import micro from '../data/seed/microcopy.json';

const AnimatedPath = Animated.createAnimatedComponent(Path);
const T = {
  rings: [0, 120],
  circles: [0, 140, 280],
  markBadge: 300,
  markDraw: 500,
  orbitDots: [700, 820],
  letters: { start: 700, step: 45 },
  loadBar: { start: 400, duration: 1500 },
  tagline: 1200,
  cta: 1700,
};

/* ---------- 01 Splash ---------- */
function Bloom({
  delay,
  style,
  children,
}: {
  delay: number;
  style: object;
  children?: React.ReactNode;
}) {
  const v = useSharedValue(0);
  useEffect(() => {
    v.value = withDelay(
      delay,
      withTiming(1, {
        duration: 900,
        easing: Easing.bezier(0.2, 0.9, 0.25, 1.08),
      }),
    );
  }, [delay, v]);
  const a = useAnimatedStyle(() => ({
    opacity: Math.min(1, v.value * 1.4),
    transform: [{ scale: 0.6 + 0.4 * v.value }],
  }));
  return (
    <Animated.View style={[{ position: 'absolute' }, style, a]}>
      {children}
    </Animated.View>
  );
}
function Letter({ c, i }: { c: string; i: number }) {
  const v = useSharedValue(0);
  useEffect(() => {
    v.value = withDelay(
      T.letters.start + i * T.letters.step,
      withTiming(1, {
        duration: 600,
        easing: Easing.bezier(0.05, 0.7, 0.1, 1),
      }),
    );
  }, [i, v]);
  const a = useAnimatedStyle(() => ({
    opacity: v.value,
    transform: [{ translateY: 22 * (1 - v.value) }],
  }));
  return <Animated.Text style={[TYPE.splash, a]}>{c}</Animated.Text>;
}
function FadeUpAt({ at, children }: { at: number; children: React.ReactNode }) {
  return (
    <Animated.View
      entering={FadeInDown.delay(at)
        .duration(600)
        .easing(Easing.bezier(0.05, 0.7, 0.1, 1))}
    >
      {children}
    </Animated.View>
  );
}
export function Splash() {
  const nav = useNav();
  const { state, update } = useStore();
  const reduce = useReducedMotion();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const orbit = useSharedValue(0);
  const draw = useSharedValue(0);
  const bar = useSharedValue(0);
  useEffect(() => {
    if (!reduce)
      orbit.value = withRepeat(
        withTiming(360, { duration: 14000, easing: Easing.linear }),
        -1,
      );
    draw.value = withDelay(
      T.markDraw,
      withTiming(1, { duration: 700, easing: Easing.bezier(0.6, 0, 0.2, 1) }),
    );
    bar.value = withDelay(
      T.loadBar.start,
      withTiming(1, {
        duration: T.loadBar.duration,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
      }),
    );
  }, [reduce, orbit, draw, bar]);
  const orbitStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${orbit.value}deg` }],
  }));
  const pathProps = useAnimatedProps(() => ({
    strokeDashoffset: 60 * (1 - draw.value),
  }));
  const barStyle = useAnimatedStyle(() => ({
    transform: [{ scaleX: bar.value }],
  }));
  const begin = () => {
    update(x => ({ ...x, splashSeen: true }));
    nav.reset({
      index: 0,
      routes: [
        {
          name: state.signedIn
            ? state.onboarded
              ? 'Main'
              : 'Details'
            : 'Intro',
        },
      ],
    });
  };
  const cx = Math.min(width, 480) / 2 - 24;
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: C.splash,
        paddingTop: insets.top + 24,
        paddingBottom: insets.bottom + 24,
        paddingHorizontal: 24,
      }}
    >
      <View
        style={{ flex: 1, minHeight: 360 }}
        importantForAccessibility="no-hide-descendants"
      >
        <View style={{ position: 'absolute', left: cx, top: '48%' }}>
          {[320, 220].map((s, i) => (
            <Bloom
              key={s}
              delay={T.rings[i]}
              style={{
                left: -s / 2,
                top: -s / 2,
                width: s,
                height: s,
                borderRadius: s / 2,
                borderWidth: 1.5,
                borderColor: 'rgba(255,255,255,0.6)',
              }}
            />
          ))}
          <Animated.View
            style={[
              {
                position: 'absolute',
                left: -160,
                top: -160,
                width: 320,
                height: 320,
              },
              orbitStyle,
            ]}
          >
            <Bloom
              delay={T.orbitDots[0]}
              style={{
                left: 149,
                top: -11,
                width: 22,
                height: 22,
                borderRadius: 11,
                backgroundColor: '#fff',
              }}
            />
            <Bloom
              delay={T.orbitDots[1]}
              style={{
                left: 8,
                top: 210,
                width: 14,
                height: 14,
                borderRadius: 7,
                ...INK,
              }}
            />
          </Animated.View>
          <Bloom
            delay={T.circles[0]}
            style={{
              left: -95,
              top: -85,
              width: 130,
              height: 130,
              borderRadius: 65,
              backgroundColor: C.artPlum,
            }}
          />
          <Bloom
            delay={T.circles[1]}
            style={{
              left: -5,
              top: -40,
              width: 118,
              height: 118,
              borderRadius: 59,
              backgroundColor: C.artPink,
            }}
          />
          <Bloom
            delay={T.circles[2]}
            style={{
              left: -55,
              top: 25,
              width: 96,
              height: 96,
              borderRadius: 48,
              backgroundColor: C.artMint,
            }}
          />
          <Bloom
            delay={T.markBadge}
            style={{
              left: -40,
              top: -25,
              width: 80,
              height: 80,
              borderRadius: 28,
              ...INK,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Svg width={40} height={40} viewBox="0 0 24 24">
              <AnimatedPath
                d="M3 11l18-7-7 18-2.5-8.5z"
                fill="none"
                stroke="#fff"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="60"
                animatedProps={pathProps}
              />
            </Svg>
          </Bloom>
        </View>
      </View>
      <View
        style={{ gap: 14, maxWidth: 480, width: '100%', alignSelf: 'center' }}
      >
        <View
          accessible
          accessibilityRole="header"
          accessibilityLabel="ExamPilot"
          style={{ flexDirection: 'row' }}
        >
          {'ExamPilot'.split('').map((c, i) => (
            <Letter key={i} c={c} i={i} />
          ))}
        </View>
        <FadeUpAt at={T.tagline}>
          <Txt style={{ fontSize: 19, lineHeight: 28, color: SUBJ.se.text }}>
            Study calm. Exam ready.{'\n'}One topic at a time.
          </Txt>
        </FadeUpAt>
        <View
          style={{
            height: 4,
            borderRadius: 2,
            backgroundColor: C.line,
            overflow: 'hidden',
            marginTop: 6,
          }}
        >
          <Animated.View
            style={[
              { flex: 1, backgroundColor: C.ink, transformOrigin: 'left' },
              barStyle,
            ]}
          />
        </View>
        <FadeUpAt at={T.cta}>
          <View style={{ marginTop: 12 }}>
            <PrimaryButton label="Let’s begin" onPress={begin} />
          </View>
        </FadeUpAt>
      </View>
    </View>
  );
}

/* ---------- 02 Login ---------- */
export function Login() {
  const nav = useNav();
  const { signIn } = useStore();
  const [mode, setMode] = useState<'in' | 'up'>('in');
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [show, setShow] = useState(false);
  const [err, setErr] = useState('');
  const [segW, setSegW] = useState(0);
  const x = useSharedValue(0);
  useEffect(() => {
    x.value = withSpring(mode === 'in' ? 0 : 1, {
      stiffness: 400,
      damping: 36,
    });
  }, [mode, x]);
  const ind = useAnimatedStyle(() => ({
    transform: [{ translateX: x.value * (segW / 2 - 6) }],
  }));
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState('');
  const finish = (s: State | null) =>
    s &&
    nav.reset({ index: 0, routes: [{ name: s.onboarded ? 'Main' : 'Details' }] });
  const run = async (fn: () => Promise<{ user: User } | null>) => {
    if (busy) return;
    setErr('');
    setNote('');
    setBusy(true);
    try {
      finish(await signIn(fn));
    } catch (e) {
      setErr(authMessage(e));
    } finally {
      setBusy(false);
    }
  };
  const submit = () => {
    if (!/^\S+@\S+\.\S+$/.test(email))
      return setErr('That email doesn’t look quite right.');
    if (pw.length < 6)
      return setErr('Use at least 6 characters for your password.');
    run(() => (mode === 'up' ? signUpEmail : signInEmail)(email, pw));
  };
  const forgot = async () => {
    setNote('');
    if (!/^\S+@\S+\.\S+$/.test(email))
      return setErr('Add your email above and we’ll send a reset link.');
    setErr('');
    try {
      await resetPassword(email);
      setNote('Check your inbox for a link to reset your password.');
    } catch (e) {
      setErr(authMessage(e));
    }
  };
  return (
    <Screen gutter={24}>
      <View
        style={{ position: 'absolute', right: -24, top: -60 }}
        importantForAccessibility="no-hide-descendants"
      >
        <Illo name="login-corner-art" width={200} height={200} />
      </View>
      <View style={{ paddingTop: 24 }}>
        <View
          style={{
            width: 52,
            height: 52,
            borderRadius: 18,
            ...INK,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon name="logo-plane" size={26} color="#fff" />
        </View>
        <Txt
          style={[
            TYPE.onboard,
            { fontSize: 42, lineHeight: 45, marginTop: 32 },
          ]}
        >
          {mode === 'in' ? 'Welcome back' : 'Let’s get you set up'}
        </Txt>
        <Txt style={{ fontSize: 17, color: C.inkMuted, marginTop: 8 }}>
          {mode === 'in'
            ? 'Pick up where you left off.'
            : 'It takes about a minute.'}
        </Txt>
        <View
          onLayout={e => setSegW(e.nativeEvent.layout.width)}
          style={{
            marginTop: 28,
            flexDirection: 'row',
            backgroundColor: C.surface,
            boxShadow: SHADOW.soft,
            borderRadius: 999,
            padding: 6,
          }}
        >
          <Animated.View
            style={[
              {
                position: 'absolute',
                top: 6,
                bottom: 6,
                left: 6,
                width: segW / 2 - 6,
                borderRadius: 999,
                ...INK,
              },
              ind,
            ]}
          />
          {(['in', 'up'] as const).map(m => (
            <Pressable
              key={m}
              accessibilityRole="button"
              accessibilityState={{ selected: mode === m }}
              onPress={() => {
                setMode(m);
                setErr('');
              }}
              style={{
                flex: 1,
                height: 48,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Txt
                style={{ fontWeight: 600, color: mode === m ? '#fff' : C.ink }}
              >
                {m === 'in' ? 'Sign in' : 'Create account'}
              </Txt>
            </Pressable>
          ))}
        </View>
        <View style={{ gap: 12, marginTop: 20 }}>
          <Rise i={0}>
            <Field
              label="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoComplete="email"
              placeholder="you@college.edu"
            />
          </Rise>
          <Rise i={1}>
            <Field
              label="Password"
              value={pw}
              onChangeText={setPw}
              secure={!show}
              autoComplete={mode === 'in' ? 'password' : 'new-password'}
              placeholder="••••••••"
              autoCapitalize="none"
              trailing={
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={show ? 'Hide password' : 'Show password'}
                  onPress={() => setShow(!show)}
                  style={{
                    width: 44,
                    height: 44,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Icon name={show ? 'eye-off' : 'eye'} size={20} />
                </Pressable>
              }
            />
          </Rise>
          {!!err && (
            <Txt
              accessibilityRole="alert"
              style={{
                backgroundColor: C.errorFill,
                color: C.errorText,
                borderRadius: 16,
                overflow: 'hidden',
                paddingHorizontal: 16,
                paddingVertical: 8,
                fontSize: 14,
              }}
            >
              {err}
            </Txt>
          )}
          {!!note && (
            <Txt
              accessibilityRole="alert"
              style={{
                backgroundColor: SUBJ.dds.fill,
                ...SHEEN,
                color: SUBJ.dds.text,
                borderRadius: 16,
                overflow: 'hidden',
                paddingHorizontal: 16,
                paddingVertical: 8,
                fontSize: 14,
              }}
            >
              {note}
            </Txt>
          )}
          {mode === 'in' && (
            <Pressable
              accessibilityRole="button"
              onPress={forgot}
              style={{ paddingHorizontal: 8, paddingVertical: 6 }}
            >
              <Txt style={{ fontSize: 15, fontWeight: 600, color: C.inkMuted }}>
                Forgot password?
              </Txt>
            </Pressable>
          )}
          <Rise i={2}>
            <PrimaryButton
              label={
                busy ? 'One moment…' : mode === 'in' ? 'Sign in' : 'Create account'
              }
              onPress={submit}
            />
          </Rise>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
            marginVertical: 20,
          }}
        >
          <View style={{ flex: 1, height: 1, backgroundColor: C.lineStrong }} />
          <Txt style={{ fontSize: 14, color: C.inkSubtle }}>or</Txt>
          <View style={{ flex: 1, height: 1, backgroundColor: C.lineStrong }} />
        </View>
        <GoogleSigninButton
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Light}
          disabled={busy}
          onPress={() => run(signInGoogle)}
          style={{ width: '100%', height: 56 }}
        />
        {__DEV__ && (
          // TODO: remove once email sign-in is fixed.
          <Pressable
            accessibilityRole="button"
            onPress={() => nav.reset({ index: 0, routes: [{ name: 'Details' }] })}
            style={{ alignSelf: 'center', padding: 12 }}
          >
            <Txt style={{ fontSize: 15, fontWeight: 600, color: C.inkMuted }}>
              Skip for now
            </Txt>
          </Pressable>
        )}
        <Txt
          style={{
            marginTop: 8,
            textAlign: 'center',
            fontSize: 13,
            color: C.inkSubtle,
          }}
        >
          By continuing you agree to our terms and privacy notice.
        </Txt>
      </View>
    </Screen>
  );
}

/* ---------- 03 Your details ---------- */
export function Details() {
  const nav = useNav();
  const { state, update, signOut } = useStore();
  const [p, setP] = useState(state.profile);
  const [err, setErr] = useState('');
  const initials =
    ((p.firstName[0] ?? '') + (p.surname[0] ?? '')).toUpperCase() || 'Hi';
  const pop = useSharedValue(1);
  useEffect(() => {
    pop.value = withSequence(
      withTiming(0.85, { duration: 80 }),
      withSpring(1, { stiffness: 600, damping: 34 }),
    );
  }, [initials, pop]);
  const popStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pop.value }],
  }));
  const go = () => {
    if (!p.firstName.trim() || !/^\S+@\S+\.\S+$/.test(p.email))
      return setErr('Add your first name and a valid email to continue.');
    update(x => ({ ...x, profile: p }));
    nav.navigate('Admit');
  };
  return (
    <Screen gutter={24}>
      <StepHeader
        step={1}
        onBack={() =>
          nav.canGoBack()
            ? nav.goBack()
            : // Back to Login means a different account, so sign this one out first.
              signOut()
                .catch(() => {})
                .then(() => nav.reset({ index: 0, routes: [{ name: 'Login' }] }))
        }
      />
      <View style={{ marginTop: 24, gap: 12 }}>
        <Rise
          i={0}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}
        >
          <Animated.View
            style={[
              {
                width: 72,
                height: 72,
                borderRadius: 36,
                backgroundColor: SUBJ.se.fill,
                ...SHEEN,
                alignItems: 'center',
                justifyContent: 'center',
              },
              popStyle,
            ]}
          >
            <Txt style={{ fontSize: 24, fontWeight: 600, color: SUBJ.se.text }}>
              {initials}
            </Txt>
          </Animated.View>
          <Txt style={TYPE.eyebrow}>
            Nice to meet you{p.firstName ? `, ${p.firstName}` : ''}!
          </Txt>
        </Rise>
        <Rise i={1}>
          <Txt
            accessibilityRole="header"
            style={[TYPE.onboard, { marginVertical: 8 }]}
          >
            Tell us a little about you
          </Txt>
        </Rise>
        <Rise i={2} style={{ flexDirection: 'row', gap: 12 }}>
          <View style={{ flex: 1 }}>
            <Field
              label="First name"
              value={p.firstName}
              onChangeText={v => setP({ ...p, firstName: v })}
              autoComplete="given-name"
              autoCapitalize="words"
            />
          </View>
          <View style={{ flex: 1 }}>
            <Field
              label="Surname"
              value={p.surname}
              onChangeText={v => setP({ ...p, surname: v })}
              autoComplete="family-name"
              autoCapitalize="words"
            />
          </View>
        </Rise>
        <Rise i={3}>
          <Field
            label="Student email"
            value={p.email}
            onChangeText={v => setP({ ...p, email: v })}
            keyboardType="email-address"
            autoComplete="email"
          />
        </Rise>
        <Rise i={4}>
          <Field
            label="College (optional)"
            value={p.college ?? ''}
            onChangeText={v => setP({ ...p, college: v })}
            autoCapitalize="words"
          />
        </Rise>
        <Rise i={5}>
          <Txt
            style={[
              TYPE.micro,
              { color: C.inkMuted, marginBottom: 8, paddingHorizontal: 4 },
            ]}
          >
            Semester
          </Txt>
          <ChoiceGroup
            size="circle"
            outline={false}
            label="Semester"
            options={[3, 4, 5, 6, 7, 8].map(n => ({
              value: n,
              label: String(n),
              a11y: `Semester ${n}`,
            }))}
            value={p.semester ?? null}
            onChange={n => setP({ ...p, semester: Number(n) })}
          />
        </Rise>
        {!!err && <InfoCard tone="headsup">{err}</InfoCard>}
        <Rise i={6} style={{ marginTop: 8 }}>
          <PrimaryButton label="Continue" onPress={go} />
        </Rise>
      </View>
    </Screen>
  );
}

/* ---------- 04 Admit card ---------- */
type Found = {
  id: string;
  subjectId: string;
  title: string;
  date: string;
  time: string;
  flag?: string;
};
function ScanLine() {
  const reduce = useReducedMotion();
  const v = useSharedValue(0);
  useEffect(() => {
    if (!reduce)
      v.value = withRepeat(
        withTiming(1, {
          duration: 1600,
          easing: Easing.bezier(0.45, 0, 0.55, 1),
        }),
        -1,
        true,
      );
  }, [reduce, v]);
  const a = useAnimatedStyle(() => ({ top: `${8 + v.value * 80}%` }));
  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          left: 0,
          right: 0,
          height: 3,
          backgroundColor: C.inkFlat,
          boxShadow: '0px 0px 18px 6px rgba(140,123,181,0.55)',
        },
        a,
      ]}
    />
  );
}
function Bob({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  const v = useSharedValue(0);
  useEffect(() => {
    if (!reduce)
      v.value = withRepeat(
        withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
        -1,
        true,
      );
  }, [reduce, v]);
  const a = useAnimatedStyle(() => ({
    transform: [{ translateY: -6 * v.value }],
  }));
  return <Animated.View style={a}>{children}</Animated.View>;
}
const ROW_H = 72;
const ROW_STEP = ROW_H + 12;
/** Exam row that can be picked up by its grip and dropped to a new position; the rows it passes slide out of the way. */
function DragRow({
  i,
  count,
  dragIdx,
  target,
  onMove,
  bg,
  children,
}: {
  i: number;
  count: number;
  dragIdx: SharedValue<number>;
  target: SharedValue<number>;
  onMove: (from: number, to: number) => void;
  bg: string;
  children: React.ReactNode;
}) {
  const ty = useSharedValue(0);
  const pan = Gesture.Pan()
    .onBegin(() => {
      dragIdx.value = i;
      target.value = i;
      ty.value = 0;
    })
    .onUpdate(e => {
      ty.value = e.translationY;
      target.value = Math.max(
        0,
        Math.min(count - 1, Math.round(i + e.translationY / ROW_STEP)),
      );
    })
    .onEnd(() => {
      const to = target.value;
      ty.value = withTiming((to - i) * ROW_STEP, { duration: 120 }, () => {
        dragIdx.value = -1;
        ty.value = 0;
        if (to !== i) scheduleOnRN(onMove, i, to);
      });
    })
    .onFinalize((_e, ok) => {
      if (!ok) {
        dragIdx.value = -1;
        ty.value = withTiming(0, { duration: 120 });
      }
    });
  const a = useAnimatedStyle(() => {
    const d = dragIdx.value;
    if (d === i)
      return {
        zIndex: 10,
        transform: [{ translateY: ty.value }, { scale: 1.02 }],
        boxShadow: '0px 10px 24px rgba(27,27,31,0.18)',
      };
    let off = 0;
    if (d >= 0 && d < i && target.value >= i) off = -ROW_STEP;
    else if (d >= 0 && d > i && target.value <= i) off = ROW_STEP;
    return {
      zIndex: 0,
      transform: [{ translateY: withTiming(off, { duration: 150 }) }],
      boxShadow: '0px 0px 0px rgba(27,27,31,0)',
    };
  });
  return (
    <Animated.View
      entering={FadeInDown.delay(100 + i * 60)
        .duration(480)
        .easing(Easing.bezier(0.05, 0.7, 0.1, 1))}
      style={[
        {
          height: ROW_H,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
          borderRadius: 999,
          padding: 10,
          paddingRight: 8,
          backgroundColor: bg,
        },
        a,
      ]}
    >
      {children}
      <GestureDetector gesture={pan}>
        <View
          accessibilityLabel="Drag to reorder"
          style={{
            width: 36,
            height: 52,
            alignItems: 'center',
            justifyContent: 'center',
            gap: 4,
          }}
        >
          {[0, 1, 2].map(k => (
            <View
              key={k}
              style={{
                width: 18,
                height: 2.5,
                borderRadius: 2,
                backgroundColor: C.inkMuted,
              }}
            />
          ))}
        </View>
      </GestureDetector>
    </Animated.View>
  );
}
type AdmitSource = {
  lines: () => Promise<string[]>;
  /** Set for photos so the AI fallback can look at the image itself. */
  imageUri?: string;
  mimeType?: string;
};
export function AdmitCard() {
  const nav = useNav();
  const { update } = useStore();
  const [phase, setPhase] = useState<'idle' | 'scanning' | 'results'>('idle');
  const [found, setFound] = useState<Found[]>([]);
  const [editing, setEditing] = useState<number | null>(null);
  const [adding, setAdding] = useState(false);
  const dragIdx = useSharedValue(-1);
  const target = useSharedValue(0);
  const move = (from: number, to: number) =>
    setFound(f => {
      const n = [...f];
      n.splice(to, 0, n.splice(from, 1)[0]);
      return n;
    });
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const [error, setError] = useState('');
  const [undated, setUndated] = useState<string[]>([]);
  const [cards, setCards] = useState(0);
  /**
   * Reads each file's text on-device, parses the timetable rows and shows them for confirmation.
   * `append` adds to the exams already found (another admit card); duplicates are dropped.
   */
  const read = async (
    sources: AdmitSource[],
    append: boolean,
  ) => {
    setError('');
    setPhase('scanning');
    const started = Date.now();
    const failed: string[] = [];
    const parsed = await Promise.all(
      sources.map(async src => {
        try {
          const lines = await src.lines().catch(() => [] as string[]);
          const local = parseAdmitCard(lines);
          // On-device parsing first; Gemini only when it finds nothing (odd layouts, blurry photos, scans).
          if (local.exams.length || !aiEnabled) {
            if (!local.exams.length && !lines.join('').trim())
              throw new Error('No readable text in that file.');
            return local;
          }
          return await readAdmitCardAI(
            src.imageUri
              ? { imageUri: src.imageUri, mimeType: src.mimeType }
              : { text: lines.join('\n') },
          );
        } catch (e) {
          failed.push((e as Error).message);
          return { exams: [], undated: [] as string[] };
        }
      }),
    );
    // Let the scan animation register even when reading is instant.
    await new Promise<void>(r =>
      setTimeout(r, Math.max(0, 1200 - (Date.now() - started))),
    );
    const base = append ? found : [];
    const key = (title: string, date: string) =>
      `${title.trim().toLowerCase()}|${date}`;
    const seen = new Set(base.map(x => key(x.title, x.date)));
    const fresh: Found[] = [];
    parsed.forEach((r, ci) =>
      r.exams.forEach((e, i) => {
        if (seen.has(key(e.name, e.date))) return;
        seen.add(key(e.name, e.date));
        fresh.push({
          id: `a${Date.now()}-${ci}-${i}`,
          subjectId: '',
          title: e.name,
          date: e.date,
          time: e.time,
          flag: e.flag,
        });
      }),
    );
    const all = [...base, ...fresh].sort((x, y) =>
      (x.date + x.time).localeCompare(y.date + y.time),
    );
    const und = Array.from(
      new Set([...(append ? undated : []), ...parsed.flatMap(r => r.undated)]),
    );
    setUndated(und);
    setFound(all);
    setCards(n => (append ? n : 0) + parsed.length - failed.length);
    if (failed.length)
      setError(
        `${failed.length} file${failed.length > 1 ? 's' : ''} couldn’t be read. ${failed[0]}`,
      );
    else if (!all.length)
      setError(
        'We couldn’t find exam dates in that file. Try a clearer photo, or add them yourself below.',
      );
    else if (append && !fresh.length)
      setError('No new exams in that card — they’re already in the list.');
    setPhase(all.length || !failed.length ? 'results' : 'idle');
  };
  const chooseFile = async (append = false) => {
    try {
      const files = await pick({
        type: [types.pdf, types.images],
        allowMultiSelection: true,
      });
      const copies = await keepLocalCopy({
        files: files.map((file, i) => ({
          uri: file.uri,
          fileName: file.name ?? `admit-card-${i}`,
        })) as [{ uri: string; fileName: string }],
        destination: 'cachesDirectory',
      });
      read(
        files.map((file, i) => {
          const copy = copies.find(c => c.sourceUri === file.uri) ?? copies[i];
          const uri = copy?.status === 'success' ? copy.localUri : file.uri;
          const isPdf =
            file.type === 'application/pdf' ||
            /\.pdf$/i.test(file.name ?? uri);
          return isPdf
            ? { lines: async () => (await pdfText(uri)).pages }
            : {
                lines: () => imageText(uri),
                imageUri: uri,
                mimeType: file.type ?? 'image/jpeg',
              };
        }),
        append,
      );
    } catch {
      /* cancelled */
    }
  };
  const takePhoto = async (append = false) => {
    try {
      const r = await launchCamera({
        mediaType: 'photo',
        quality: 0.8,
        maxWidth: 2000,
        maxHeight: 2000,
      });
      const uri = r.assets?.[0]?.uri;
      if (!r.didCancel && uri)
        read(
          [{ lines: () => imageText(uri), imageUri: uri, mimeType: 'image/jpeg' }],
          append,
        );
      else if (r.errorCode === 'camera_unavailable')
        setError('No camera here — choose a PDF or photo instead.');
    } catch {
      setError('No camera here — choose a PDF or photo instead.');
    }
  };
  const confirm = () => {
    if (!found.length) return;
    update(x => {
      // One subject per exam name; reuse an existing subject with the same name.
      const subjects = [...x.subjects];
      const codes = new Set(subjects.map(sj => sj.code));
      const exams = found.map((f, i) => {
        let sj = subjects.find(
          y => y.name.toLowerCase() === f.title.trim().toLowerCase(),
        );
        if (!sj) {
          const code = shortCode(f.title, codes);
          sj = {
            id: `sub-${Date.now().toString(36)}-${i}`,
            code,
            name: f.title.trim(),
            color: paletteAt(subjects.length),
            topics: [],
            isSample: false,
          };
          subjects.push(sj);
        }
        return {
          id: f.id,
          subjectId: sj.id,
          title: sj.name,
          date: f.date,
          time: f.time,
          source: 'admit-card' as const,
        };
      });
      // Keep exams from earlier admit cards; a re-scanned exam replaces its old copy.
      const fresh = new Set(exams.map(e => `${e.subjectId}|${e.date}`));
      const kept = x.exams.filter(e => !fresh.has(`${e.subjectId}|${e.date}`));
      return { ...x, subjects, exams: [...kept, ...exams] };
    });
    nav.navigate('Plan');
  };
  return (
    <Screen gutter={24}>
      <StepHeader step={2} onBack={() => nav.goBack()} />
      {phase === 'idle' && (
        <View style={{ marginTop: 24, gap: 16 }}>
          <Rise i={0}>
            <Txt accessibilityRole="header" style={TYPE.onboard}>
              {micro.admitCard.idleTitle}
            </Txt>
          </Rise>
          <Rise i={1}>
            <Txt style={{ fontSize: 17, color: C.inkMuted }}>
              {micro.admitCard.idleSub}
            </Txt>
          </Rise>
          <Rise
            i={2}
            style={{
              alignItems: 'center',
              gap: 12,
              borderRadius: 34,
              borderWidth: 1.5,
              borderStyle: 'dashed',
              borderColor: C.lineStrong,
              backgroundColor: C.surface,
              boxShadow: SHADOW.soft,
              paddingHorizontal: 24,
              paddingVertical: 36,
            }}
          >
            <Bob>
              <View
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  backgroundColor: SUBJ.se.fill,
                  ...SHEEN,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon name="upload" size={32} color={SUBJ.se.text} />
              </View>
            </Bob>
            <Txt style={TYPE.section}>Upload admit card</Txt>
            <Txt style={{ fontSize: 15, color: C.inkMuted }}>
              PDFs or clear photos · pick several at once
            </Txt>
            <Press
              accessibilityRole="button"
              onPress={() => chooseFile()}
              style={{
                marginTop: 8,
                height: 56,
                borderRadius: 999,
                ...INK,
                paddingHorizontal: 32,
                justifyContent: 'center',
              }}
            >
              <Txt style={{ color: '#fff', fontWeight: 600 }}>Choose file</Txt>
            </Press>
          </Rise>
          <Rise i={3} style={{ flexDirection: 'row', gap: 12 }}>
            <View style={{ flex: 1 }}>
              <SecondaryButton
                icon="camera"
                label="Take photo"
                onPress={() => takePhoto()}
              />
            </View>
          </Rise>
          {!!error && (
            <Rise i={4}>
              <InfoCard tone="headsup">{error}</InfoCard>
            </Rise>
          )}
          <Rise i={5}>
            <InfoCard tone="dds" icon="lock">
              {micro.admitCard.privacy}
            </InfoCard>
          </Rise>
        </View>
      )}
      {phase === 'scanning' && (
        <View style={{ marginTop: 24, gap: 16 }}>
          <Txt style={TYPE.onboard}>One moment…</Txt>
          <View
            style={{
              borderRadius: 34,
              backgroundColor: C.surface,
              boxShadow: SHADOW.soft,
              padding: 24,
              overflow: 'hidden',
              alignItems: 'center',
            }}
          >
            <Illo name="admit-card-skeleton" width={250} height={320} />
            <ScanLine />
          </View>
          <Txt
            accessibilityLiveRegion="polite"
            accessibilityRole="text"
            style={{ textAlign: 'center', fontSize: 17, color: C.inkMuted }}
          >
            {micro.admitCard.scanning}
          </Txt>
        </View>
      )}
      {phase === 'results' && (
        <View style={{ marginTop: 24, gap: 12 }}>
          <Rise i={0}>
            <Txt
              accessibilityRole="header"
              style={[TYPE.onboard, { marginBottom: 8 }]}
            >
              {micro.admitCard.doneTitle.replace('{n}', String(found.length))}
            </Txt>
            {cards > 1 && (
              <Txt style={{ color: C.inkMuted, marginTop: -4 }}>
                From {cards} admit cards
              </Txt>
            )}
          </Rise>
          {!!error && <InfoCard tone="headsup">{error}</InfoCard>}
          {undated.length > 0 && (
            <InfoCard tone="info">
              {`No date printed for: ${undated.join(', ')}. Add them below if they have one.`}
            </InfoCard>
          )}
          {found.map((f, i) => {
            const c = SUBJ[paletteAt(i)];
            return (
              <DragRow
                key={f.id}
                i={i}
                count={found.length}
                dragIdx={dragIdx}
                target={target}
                onMove={move}
                bg={c.fill}
              >
                <View
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 26,
                    backgroundColor: '#fff',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Txt
                    style={{ fontSize: 16, fontWeight: 600, lineHeight: 18 }}
                  >
                    {dayNum(f.date)}
                  </Txt>
                  <Txt
                    style={{ fontSize: 10, fontWeight: 600, lineHeight: 12 }}
                  >
                    {monthShort(f.date).toUpperCase()}
                  </Txt>
                </View>
                <View style={{ flex: 1 }}>
                  <Txt numberOfLines={1} style={TYPE.bodyStrong}>
                    {f.title}
                  </Txt>
                  <Txt numberOfLines={1} style={{ fontSize: 14, color: C.inkMuted }}>
                    {weekday(f.date)} · {fmtTimeShort(f.time)}
                  </Txt>
                  {f.flag && (
                    <Txt
                      numberOfLines={1}
                      style={{ fontSize: 12, color: C.headsupText }}
                    >
                      {f.flag}
                    </Txt>
                  )}
                </View>
                <IconButton
                  icon="edit-pencil"
                  label={`Edit ${f.title}`}
                  size={44}
                  onPress={() => setEditing(i)}
                />
              </DragRow>
            );
          })}
          <Rise i={found.length + 1} style={{ gap: 12 }}>
            <SecondaryButton
              icon="upload"
              label="Add another admit card"
              onPress={() => chooseFile(true)}
            />
            <SecondaryButton
              variant="dashed"
              icon="plus"
              label="Add an exam we missed"
              onPress={() => setAdding(true)}
            />
          </Rise>
          <Rise i={found.length + 2} style={{ marginTop: 8 }}>
            <PrimaryButton
              label="Looks right — build my plan"
              onPress={confirm}
              disabled={!found.length}
            />
          </Rise>
          <Pressable
            accessibilityRole="button"
            onPress={() => setPhase('idle')}
            style={{
              height: 48,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Txt style={{ fontSize: 15, fontWeight: 600, color: C.inkMuted }}>
              Start over
            </Txt>
          </Pressable>
        </View>
      )}
      <ExamSheet
        open={editing !== null}
        onClose={() => setEditing(null)}
        heading="Edit exam"
        submit="Save"
        initial={
          editing === null
            ? { title: '', date: todayISO(), time: '14:00' }
            : {
                title: found[editing].title,
                date: found[editing].date,
                time: found[editing].time,
              }
        }
        onSubmit={v => {
          setFound(
            found.map((x, j) =>
              j === editing
                ? { ...x, title: v.title.trim() || x.title, date: v.date, time: v.time, flag: undefined }
                : x,
            ),
          );
          setEditing(null);
        }}
      />
      <ExamSheet
        open={adding}
        onClose={() => setAdding(false)}
        heading="Add an exam"
        submit="Add exam"
        initial={{ title: '', date: todayISO(), time: '14:00' }}
        onSubmit={v => {
          if (!v.title.trim()) return;
          setFound([
            ...found,
            {
              id: 'x' + Date.now(),
              subjectId: 'x',
              title: v.title.trim(),
              date: v.date,
              time: v.time,
            },
          ]);
          setAdding(false);
        }}
      />
    </Screen>
  );
}

/* ---------- 05 Plan ready ---------- */
function BurstDot({ i }: { i: number }) {
  const v = useSharedValue(0);
  const a = (i / 14) * Math.PI * 2,
    r = 62 + (i % 3) * 14,
    size = 8 + (i % 3) * 4;
  useEffect(() => {
    v.value = withDelay(
      200 + i * 20,
      withTiming(1, {
        duration: 1100,
        easing: Easing.bezier(0.15, 0.8, 0.3, 1),
      }),
    );
  }, [i, v]);
  const st = useAnimatedStyle(() => ({
    opacity: v.value < 0.7 ? 1 : (1 - v.value) / 0.3,
    transform: [
      { translateX: Math.cos(a) * r * v.value },
      { translateY: Math.sin(a) * r * v.value },
      { scale: 0.4 + 0.6 * v.value },
    ],
  }));
  const colors = [
    '#8C7BB5',
    '#E9C4CC',
    '#BFE0D8',
    '#1B1B1F',
    '#C5BADB',
    '#DDB5BD',
  ];
  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          left: 60 - size / 2,
          top: 60 - size / 2,
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: colors[i % 6],
        },
        st,
      ]}
    />
  );
}
export function PlanReady() {
  const nav = useNav();
  const { state, update } = useStore();
  const reduce = useReducedMotion();
  const [plan] = useState(() => generatePlan(state.exams));
  const days = Array.from(
    new Set([...plan.map(p => p.date), ...state.exams.map(e => e.date)]),
  )
    .filter(d => daysBetween(todayISO(), d) >= 0)
    .sort();
  const total = plan.reduce((a, p) => a + hours(p), 0);
  const tick = useSharedValue(0);
  useEffect(() => {
    tick.value = withDelay(500, withTiming(1, { duration: 400 }));
    celebrate({ x: 0.5, y: 0.25 });
  }, [tick]);
  const tickProps = useAnimatedProps(() => ({
    strokeDashoffset: 24 * (1 - tick.value),
  }));
  const code = (id: string) =>
    state.subjects.find(s => s.id === id)?.code ?? 'Exam';
  const finish = (to: 'Main' | 'Assistant') => {
    update(x => ({
      ...x,
      sessions: [...x.sessions.filter(s => s.source !== 'plan'), ...plan],
      onboarded: true,
    }));
    nav.reset({
      index: to === 'Main' ? 0 : 1,
      routes:
        to === 'Main'
          ? [{ name: 'Main' }]
          : [{ name: 'Main' }, { name: 'Assistant' }],
    });
  };
  return (
    <Screen gutter={24}>
      <StepHeader step={3} onBack={() => nav.goBack()} />
      <View style={{ marginTop: 24, alignItems: 'center' }}>
        <View style={{ width: 120, height: 120 }}>
          {!reduce &&
            Array.from({ length: 14 }).map((_, i) => (
              <BurstDot key={i} i={i} />
            ))}
          <Animated.View
            entering={FadeInDown.springify().stiffness(500).damping(31)}
            style={{
              position: 'absolute',
              left: 8,
              top: 8,
              right: 8,
              bottom: 8,
              borderRadius: 52,
              ...INK,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Svg width={44} height={44} viewBox="0 0 24 24">
              <AnimatedPath
                d="M5 12l5 5L20 7"
                fill="none"
                stroke="#fff"
                strokeWidth={2.6}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="24"
                animatedProps={tickProps}
              />
            </Svg>
          </Animated.View>
        </View>
        <Txt
          accessibilityRole="header"
          style={[TYPE.onboard, { marginTop: 16, textAlign: 'center' }]}
        >
          {micro.plan.title}
        </Txt>
        <Txt
          style={{
            fontSize: 17,
            color: C.inkMuted,
            textAlign: 'center',
            marginTop: 8,
            maxWidth: 300,
          }}
        >
          {micro.plan.sub}
        </Txt>
      </View>
      <Rise i={3} style={{ flexDirection: 'row', gap: 10, marginTop: 24 }}>
        {(
          [
            ['se', String(state.exams.length), 'exams'],
            ['daa', String(plan.length), 'sessions'],
            [
              'dds',
              `${(total / Math.max(1, days.length)).toFixed(1)}h`,
              'a day',
            ],
          ] as const
        ).map(([c, v, l]) => (
          <View
            key={l}
            style={{
              flex: 1,
              borderRadius: 28,
              paddingVertical: 16,
              alignItems: 'center',
              backgroundColor: SUBJ[c].fill,
            }}
          >
            <Txt style={{ fontSize: 32, lineHeight: 36, fontWeight: 600 }}>
              {v}
            </Txt>
            <Txt style={{ fontSize: 14, color: C.inkMuted }}>{l}</Txt>
          </View>
        ))}
      </Rise>
      <Rise
        i={4}
        style={{
          marginTop: 16,
          borderRadius: 34,
          backgroundColor: C.surface,
          boxShadow: SHADOW.soft,
          padding: 20,
        }}
      >
        {days.map((d, i) => (
          <View
            key={d}
            style={{
              flexDirection: 'row',
              gap: 12,
              paddingVertical: 12,
              borderBottomWidth: i < days.length - 1 ? 1 : 0,
              borderColor: C.line,
            }}
          >
            <Txt
              style={{
                width: 56,
                fontSize: 14,
                fontWeight: 600,
                color: C.inkMuted,
                paddingTop: 6,
              }}
            >
              {weekday(d, true)} {dayNum(d)}
            </Txt>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: 6,
              }}
            >
              {state.exams
                .filter(e => e.date === d)
                .map(e => (
                  <View
                    key={e.id}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 6,
                      ...INK,
                      borderRadius: 99,
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                    }}
                  >
                    <View
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: SUBJ[colorOf(e.subjectId)].mark,
                      }}
                    />
                    <Txt style={[TYPE.micro, { color: '#fff' }]}>
                      {code(e.subjectId)} exam ·{' '}
                      {fmtTimeShort(e.time).replace(':00', '')}
                    </Txt>
                  </View>
                ))}
              {plan
                .filter(p => p.date === d)
                .map(p => {
                  const c = SUBJ[colorOf(p.subjectId)];
                  return (
                    <View
                      key={p.id}
                      style={{
                        backgroundColor: c.fill,
                        ...SHEEN,
                        borderRadius: 99,
                        paddingHorizontal: 12,
                        paddingVertical: 6,
                      }}
                    >
                      <Txt style={[TYPE.micro, { color: c.text }]}>
                        {code(p.subjectId)} · {hours(p)}h
                      </Txt>
                    </View>
                  );
                })}
            </View>
          </View>
        ))}
      </Rise>
      <View style={{ gap: 12, marginTop: 20 }}>
        <PrimaryButton label="Open my plan" onPress={() => finish('Main')} />
        <SecondaryButton
          label="Adjust with study assistant"
          onPress={() => finish('Assistant')}
        />
      </View>
    </Screen>
  );
}
