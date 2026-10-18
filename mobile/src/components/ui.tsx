import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type PressableProps,
  type StyleProp,
  type TextProps,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  SlideInDown,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Path, SvgXml } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { C, FONT, R, SHADOW, SUBJ, TYPE, type SubjectColor, INK } from '../theme';
import { ICONS } from '../assets/icons';
import { ILLOS } from '../assets/illustrations';
import { GlassCard, Surface } from './surface';
import { BlurIn } from '../kit/components/BlurIn';
import { Haptics } from '../kit/compat';

const AnimatedPath = Animated.createAnimatedComponent(Path);
const spring = {
  press: { stiffness: 500, damping: 30 },
  progress: { stiffness: 300, damping: 30 },
};

/* ---------- Text: maps fontWeight to the right Urbanist file ---------- */
export function Txt({
  style,
  ...p
}: TextProps & { style?: StyleProp<TextStyle> }) {
  const flat = {
    ...StyleSheet.flatten([
      { fontFamily: FONT[400], color: C.ink, fontSize: 16 },
      style,
    ]),
  } as { -readonly [K in keyof TextStyle]: TextStyle[K] };
  const w = Number(flat.fontWeight ?? 0) as 400 | 500 | 600 | 700;
  if (w && FONT[w]) {
    flat.fontFamily = FONT[w];
    delete flat.fontWeight;
  }
  return <Text maxFontSizeMultiplier={1.4} {...p} style={flat} />;
}

/* ---------- Icons & illustrations ---------- */
export function Icon({
  name,
  size = 22,
  color = C.ink,
}: {
  name: string;
  size?: number;
  color?: string;
}) {
  const xml = ICONS[name];
  if (!xml) return null;
  return <SvgXml xml={xml} width={size} height={size} color={color} />;
}
export function Illo({
  name,
  width,
  height,
  cover,
}: {
  name: string;
  width: number | `${number}%`;
  height: number | `${number}%`;
  cover?: boolean;
}) {
  return (
    <SvgXml
      xml={ILLOS[name] ?? null}
      width={width}
      height={height}
      preserveAspectRatio={cover ? 'xMidYMid slice' : 'xMidYMid meet'}
    />
  );
}

/* ---------- Pressable with lift/squeeze ---------- */
export function Press({
  children,
  style,
  scaleTo = 0.97,
  ...p
}: PressableProps & {
  style?: StyleProp<ViewStyle>;
  scaleTo?: number;
  children?: ReactNode;
}) {
  const s = useSharedValue(1);
  const a = useAnimatedStyle(() => ({ transform: [{ scale: s.value }] }));
  // Sizing in the parent's layout belongs on the Pressable, or flex/width are ignored.
  const { flex, flexGrow, flexShrink, alignSelf, width, ...inner } = StyleSheet.flatten(style) ?? {};
  const outer = { flex, flexGrow, flexShrink, alignSelf, width };
  return (
    <Pressable
      {...p}
      style={outer}
      onPressIn={e => {
        s.value = withSpring(scaleTo, spring.press);
        Haptics.selectionAsync().catch(() => {});
        p.onPressIn?.(e);
      }}
      onPressOut={e => {
        s.value = withSpring(1, spring.press);
        p.onPressOut?.(e);
      }}
    >
      <Animated.View style={[inner, width !== undefined && { width: '100%' }, a]}>{children}</Animated.View>
    </Pressable>
  );
}

/* ---------- Buttons ---------- */
export function PrimaryButton({
  label,
  onPress,
  disabled,
}: {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
}) {
  return (
    <Press
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      disabled={disabled}
      style={disabled && { opacity: 0.45 }}
    >
      <Surface
        kind="clay"
        style={{
          height: 62,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingLeft: 28,
          paddingRight: 8,
        }}
      >
        <Txt style={{ color: C.inkButton, fontSize: 18, fontWeight: 600 }}>
          {label}
        </Txt>
        <Surface
          kind="ink"
          style={{
            width: 46,
            height: 46,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon name="arrow-right" size={20} color="#fff" />
        </Surface>
      </Surface>
    </Press>
  );
}
export function SecondaryButton({
  label,
  onPress,
  variant = 'white',
  icon,
}: {
  label: string;
  onPress?: () => void;
  variant?: 'white' | 'outline' | 'dashed';
  icon?: string;
}) {
  const content = (
    <>
      {icon && <Icon name={icon} size={20} color={C.inkButton} />}
      <Txt style={{ fontWeight: 600, color: C.inkButton }}>{label}</Txt>
    </>
  );
  return (
    <Press
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
    >
      {variant === 'white' ? (
        <Surface kind="clay" style={[s.secondary, { borderRadius: 999 }]}>
          {content}
        </Surface>
      ) : (
        <View
          style={[
            s.secondary,
            {
              borderWidth: 1.5,
              borderColor: C.lineStrong,
              borderStyle: variant === 'dashed' ? 'dashed' : 'solid',
            },
          ]}
        >
          {content}
        </View>
      )}
    </Press>
  );
}
export function IconButton({
  icon,
  label,
  onPress,
  size = 56,
  tone = 'white',
  pressed,
}: {
  icon: string;
  label: string;
  onPress?: () => void;
  size?: number;
  tone?: 'white' | 'dark' | 'lavender' | 'outline';
  /** Toggled-on state: the pressed-in groove. */
  pressed?: boolean;
}) {
  const dim = {
    width: size,
    height: size,
    alignItems: 'center',
    justifyContent: 'center',
  } as const;
  const iconColor =
    tone === 'dark' ? '#fff' : tone === 'lavender' ? SUBJ.se.text : C.ink;
  const glyph = <Icon name={icon} size={22} color={iconColor} />;
  return (
    <Press
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={pressed === undefined ? undefined : { selected: pressed }}
      onPress={onPress}
      hitSlop={size < 44 ? 6 : 0}
      scaleTo={0.92}
    >
      {tone === 'dark' ? (
        <Surface kind="ink" style={dim}>
          {glyph}
        </Surface>
      ) : tone === 'lavender' ? (
        <View style={[dim, { borderRadius: size / 2, backgroundColor: SUBJ.se.fill }]}>
          {glyph}
        </View>
      ) : tone === 'outline' ? (
        <View
          style={[
            dim,
            {
              borderRadius: size / 2,
              borderWidth: 1.5,
              borderColor: 'rgba(30,58,138,0.25)',
            },
          ]}
        >
          {glyph}
        </View>
      ) : (
        <Surface kind={pressed ? 'recess' : 'clay'} style={dim}>
          {glyph}
        </Surface>
      )}
    </Press>
  );
}
export function Chip({
  active,
  label,
  onPress,
}: {
  active: boolean;
  label: string;
  onPress: () => void;
}) {
  const text = (
    <Txt
      style={{
        fontWeight: active ? 600 : 500,
        color: active ? '#fff' : C.ink,
      }}
    >
      {label}
    </Txt>
  );
  return (
    <Press
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      accessibilityLabel={label}
      onPress={onPress}
    >
      {active ? (
        <Surface kind="ink" style={s.chip}>
          {text}
        </Surface>
      ) : (
        <View style={[s.chip, { borderWidth: 1.5, borderColor: C.lineStrong }]}>
          {text}
        </View>
      )}
    </Press>
  );
}
export function FilterRow({
  children,
  icon = true,
}: {
  children: ReactNode;
  icon?: boolean;
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 8, paddingVertical: 4 }}
    >
      {icon && (
        <View
          style={[
            s.chip,
            { width: 52, paddingHorizontal: 0, backgroundColor: C.surface },
          ]}
          importantForAccessibility="no-hide-descendants"
        >
          <Icon name="filter" size={20} />
        </View>
      )}
      {children}
    </ScrollView>
  );
}

/* ---------- Layout ---------- */
export function Screen({
  children,
  gutter = 20,
  tabs,
  footer,
}: {
  children: ReactNode;
  gutter?: number;
  tabs?: boolean;
  footer?: ReactNode;
}) {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ flex: 1, backgroundColor: C.ground }}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: insets.top + 12,
          paddingHorizontal: gutter,
          paddingBottom: tabs ? 128 + insets.bottom : 40 + insets.bottom,
          maxWidth: 480,
          width: '100%',
          alignSelf: 'center',
        }}
      >
        <Animated.View
          entering={FadeInDown.duration(360).easing(
            Easing.bezier(0.2, 0.8, 0.2, 1),
          )}
        >
          {children}
        </Animated.View>
      </ScrollView>
      {footer}
    </View>
  );
}
/** Block entrance: rises, fades and sharpens out of a blur, staggered 60 ms by `i`. */
export function Rise({
  children,
  i = 0,
  style,
}: {
  children: ReactNode;
  i?: number;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <BlurIn index={i} style={style}>
      {children}
    </BlurIn>
  );
}
export function TopBar({
  back,
  onSearch,
  more = true,
}: {
  back?: boolean;
  onSearch?: () => void;
  more?: boolean;
}) {
  const nav = useNavigation();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
      {back ? (
        <IconButton
          icon="chevron-left"
          label="Back"
          onPress={() => nav.goBack()}
        />
      ) : (
        <View accessibilityLabel="Profile" style={[s.avatar]}>
          <Icon name="user" color={SUBJ.se.text} />
        </View>
      )}
      <View style={{ flex: 1 }} />
      <IconButton icon="search" label="Search" onPress={onSearch} />
      {more && <IconButton icon="more-horizontal" label="More" />}
    </View>
  );
}
export function ScreenHeader({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {
  return (
    <View style={{ paddingTop: 14, paddingBottom: 16, paddingHorizontal: 4 }}>
      <Txt style={TYPE.eyebrow}>{eyebrow}</Txt>
      <Txt accessibilityRole="header" style={[TYPE.display, { maxWidth: 330 }]}>
        {title}
      </Txt>
    </View>
  );
}
export const Card = ({
  children,
  style,
}: {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}) => (
  <GlassCard radius={R.card} padding={22} style={style}>
    {children}
  </GlassCard>
);
export function InfoCard({
  children,
  tone = 'dds',
  icon = 'info',
}: {
  children: string;
  tone?: 'dds' | 'se' | 'info' | 'headsup';
  icon?: string;
}) {
  const c = {
    dds: [SUBJ.dds.fill, SUBJ.dds.text],
    se: [SUBJ.se.fill, SUBJ.se.text],
    info: [C.infoFill, C.infoText],
    headsup: [C.headsupFill, C.headsupText],
  }[tone];
  return (
    <View
      style={{
        flexDirection: 'row',
        gap: 12,
        backgroundColor: c[0],
        borderRadius: 22,
        padding: 16,
      }}
    >
      <Icon name={icon} size={20} color={c[1]} />
      <Txt style={{ flex: 1, color: c[1], fontSize: 15, lineHeight: 21 }}>
        {children}
      </Txt>
    </View>
  );
}
export const SubjectTag = ({
  code,
  color,
}: {
  code: string;
  color: SubjectColor;
}) => (
  <View
    style={{
      backgroundColor: SUBJ[color].fill,
      borderRadius: 99,
      paddingHorizontal: 9,
      paddingVertical: 2,
    }}
  >
    <Txt style={[TYPE.micro, { color: SUBJ[color].text }]}>{code}</Txt>
  </View>
);
export function SubjectRow({
  color,
  code,
  title,
  meta,
  onPress,
}: {
  color: SubjectColor;
  code: string;
  title: string;
  meta: string;
  onPress?: () => void;
}) {
  const c = SUBJ[color];
  return (
    <Press
      accessibilityRole="button"
      accessibilityLabel={`${title}, ${meta}`}
      onPress={onPress}
      style={[s.pillRow, { backgroundColor: c.fill }]}
    >
      <View style={[s.circle52, { backgroundColor: c.deep }]}>
        <Txt style={{ fontSize: 14, fontWeight: 600, color: c.text }}>
          {code}
        </Txt>
      </View>
      <View style={{ flex: 1 }}>
        <Txt numberOfLines={1} style={TYPE.bodyStrong}>
          {title}
        </Txt>
        <Txt style={{ fontSize: 14, color: c.text }}>{meta}</Txt>
      </View>
    </Press>
  );
}
function Segment({ on, tint, h }: { on: boolean; tint?: boolean; h: number }) {
  const v = useSharedValue(on ? 1 : 0);
  useEffect(() => {
    v.value = withSpring(on ? 1 : 0, spring.progress);
  }, [on, v]);
  const a = useAnimatedStyle(() => ({ transform: [{ scaleX: v.value }] }));
  return (
    <View
      style={{
        flex: 1,
        height: h,
        borderRadius: 99,
        overflow: 'hidden',
        backgroundColor: tint ? 'rgba(255,255,255,0.75)' : C.track,
      }}
    >
      <Animated.View
        style={[
          {
            flex: 1,
            ...INK,
            borderRadius: 99,
            transformOrigin: 'left',
          },
          a,
        ]}
      />
    </View>
  );
}
export function SegmentedProgress({
  total,
  done,
  tint,
  h = 6,
}: {
  total: number;
  done: number;
  tint?: boolean;
  h?: number;
}) {
  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: total, now: done }}
      style={{ flexDirection: 'row', gap: 6 }}
    >
      {Array.from({ length: total }).map((_, i) => (
        <Segment key={i} on={i < done} tint={tint} h={h} />
      ))}
    </View>
  );
}
export function HeroCard({
  color,
  eyebrow,
  title,
  desc,
  stats,
  action,
  footer,
}: {
  color: SubjectColor;
  eyebrow?: string;
  title: string;
  desc: string;
  stats: { label: string; value: string; foot?: string }[];
  action?: ReactNode;
  footer?: ReactNode;
}) {
  const c = SUBJ[color];
  return (
    <View style={{ backgroundColor: c.fill, borderRadius: R.card, padding: 8 }}>
      <View
        style={{
          flexDirection: 'row',
          gap: 12,
          paddingHorizontal: 16,
          paddingTop: 14,
          paddingBottom: 16,
        }}
      >
        <View style={{ flex: 1 }}>
          {eyebrow && (
            <Txt style={{ fontSize: 15, fontWeight: 500, color: c.text }}>
              {eyebrow}
            </Txt>
          )}
          <Txt style={TYPE.cardTitle}>{title}</Txt>
          <Txt style={{ fontSize: 15, color: c.text, marginTop: 4 }}>
            {desc}
          </Txt>
        </View>
        <IconButton
          icon="more-horizontal"
          label="More options"
          tone="outline"
          size={48}
        />
      </View>
      <View
        style={{
          height: 172,
          borderRadius: R.panel,
          backgroundColor: c.deep,
          flexDirection: 'row',
          overflow: 'hidden',
        }}
      >
        {stats.map((st, i) => (
          <View
            key={st.label}
            style={{
              flex: 1,
              padding: 16,
              justifyContent: i === 0 ? 'space-between' : 'flex-end',
              borderRightWidth: 1,
              borderColor: 'rgba(0,0,0,0.08)',
            }}
          >
            <Txt style={{ fontSize: 15, color: c.text }}>{st.label}</Txt>
            <View>
              <Txt adjustsFontSizeToFit numberOfLines={1} style={TYPE.stat}>
                {st.value}
              </Txt>
              {st.foot && (
                <Txt style={{ fontSize: 14, color: c.text, marginTop: 6 }}>
                  {st.foot}
                </Txt>
              )}
            </View>
          </View>
        ))}
        <View
          style={{ flex: 1 }}
          importantForAccessibility="no-hide-descendants"
        >
          <Illo name={c.art} width="100%" height="100%" cover />
        </View>
        {action && (
          <View style={{ position: 'absolute', right: 12, bottom: 12 }}>
            {action}
          </View>
        )}
      </View>
      {footer && (
        <View
          style={{ paddingHorizontal: 12, paddingTop: 16, paddingBottom: 10 }}
        >
          {footer}
        </View>
      )}
    </View>
  );
}
export const ArrowButton = ({
  onPress,
  label,
}: {
  onPress: () => void;
  label: string;
}) => (
  <Press
    accessibilityRole="button"
    accessibilityLabel={label}
    onPress={onPress}
    style={[s.circle52, INK]}
  >
    <Icon name="arrow-up-right" size={20} color="#fff" />
  </Press>
);
export function Field({
  label,
  value,
  onChangeText,
  secure,
  keyboardType,
  autoComplete,
  trailing,
  placeholder,
  autoCapitalize,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  secure?: boolean;
  keyboardType?: 'default' | 'email-address' | 'number-pad';
  autoComplete?:
    | 'email'
    | 'password'
    | 'new-password'
    | 'given-name'
    | 'family-name'
    | 'off';
  trailing?: ReactNode;
  placeholder?: string;
  autoCapitalize?: 'none' | 'words';
}) {
  const [focus, setFocus] = useState(false);
  const input = useRef<{ focus: () => void } | null>(null);
  return (
    <Pressable
      onPress={() => input.current?.focus()}
      accessible={false}
      style={[
        s.field,
        focus && { backgroundColor: C.surface, borderColor: C.ink },
      ]}
    >
      <View style={{ flex: 1 }}>
        <Txt style={[TYPE.micro, { color: C.inkMuted }]}>{label}</Txt>
        <TextInput
          ref={input as never}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secure}
          keyboardType={keyboardType}
          autoComplete={autoComplete}
          autoCapitalize={
            autoCapitalize ??
            (keyboardType === 'email-address' ? 'none' : 'sentences')
          }
          placeholder={placeholder}
          placeholderTextColor={C.inkSubtle}
          accessibilityLabel={label}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          style={{
            fontFamily: FONT[400],
            fontSize: 17,
            color: C.ink,
            paddingVertical: 4,
          }}
        />
      </View>
      {trailing}
    </Pressable>
  );
}
export function StepHeader({
  step,
  onBack,
}: {
  step: 1 | 2 | 3;
  onBack: () => void;
}) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
      <IconButton icon="chevron-left" label="Back" onPress={onBack} size={52} />
      <View style={{ flex: 1 }}>
        <SegmentedProgress total={3} done={step} />
      </View>
      <Txt style={{ fontSize: 14, fontWeight: 600, color: C.inkMuted }}>
        {step} of 3
      </Txt>
    </View>
  );
}
export function BottomSheet({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  const insets = useSafeAreaInsets();
  return (
    <Modal
      visible={open}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1, justifyContent: 'flex-end' }}
      >
        <Animated.View
          entering={FadeIn.duration(260)}
          style={StyleSheet.absoluteFill}
        >
          <Pressable
            accessibilityLabel="Close"
            onPress={onClose}
            style={{ flex: 1, backgroundColor: C.scrim }}
          />
        </Animated.View>
        <Animated.View
          entering={SlideInDown.springify().stiffness(380).damping(36)}
          accessibilityViewIsModal
          style={{
            backgroundColor: C.surface,
            borderTopLeftRadius: R.sheet,
            borderTopRightRadius: R.sheet,
            paddingHorizontal: 24,
            paddingTop: 12,
            paddingBottom: 24 + insets.bottom,
            boxShadow: SHADOW.sheet,
          }}
        >
          <View
            style={{
              alignSelf: 'center',
              width: 44,
              height: 5,
              borderRadius: 3,
              backgroundColor: C.lineStrong,
              marginBottom: 16,
            }}
          />
          <Txt
            accessibilityRole="header"
            style={[TYPE.section, { marginBottom: 16 }]}
          >
            {title}
          </Txt>
          {children}
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
/** Small form inside a sheet, replacing browser prompt() for quick edits. */
export function FormSheet({
  open,
  onClose,
  title,
  fields,
  submit,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  submit: string;
  fields: {
    key: string;
    label: string;
    placeholder?: string;
    initial?: string;
  }[];
  onSubmit: (v: Record<string, string>) => void;
}) {
  const [v, setV] = useState<Record<string, string>>({});
  useEffect(() => {
    if (open)
      setV(Object.fromEntries(fields.map(f => [f.key, f.initial ?? ''])));
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <BottomSheet open={open} onClose={onClose} title={title}>
      <View style={{ gap: 10, marginBottom: 16 }}>
        {fields.map(f => (
          <Field
            key={f.key}
            label={f.label}
            placeholder={f.placeholder}
            value={v[f.key] ?? ''}
            onChangeText={t => setV({ ...v, [f.key]: t })}
          />
        ))}
      </View>
      <PrimaryButton label={submit} onPress={() => onSubmit(v)} />
    </BottomSheet>
  );
}

/* ---------- Checkbox row: box pops, tick draws, strike grows ---------- */
export function AnimatedCheckbox({
  title,
  meta,
  checked,
  onToggle,
}: {
  title: string;
  meta?: ReactNode;
  checked: boolean;
  onToggle: () => void;
}) {
  const p = useSharedValue(checked ? 1 : 0);
  const pop = useSharedValue(1);
  useEffect(() => {
    p.value = withTiming(checked ? 1 : 0, {
      duration: 240,
      easing: Easing.bezier(0.2, 0.8, 0.2, 1),
    });
    if (checked)
      pop.value = withSequence(
        withTiming(0.9, { duration: 60 }),
        withTiming(1.12, { duration: 100 }),
        withTiming(1, { duration: 100 }),
      );
  }, [checked, p, pop]);
  const box = useAnimatedStyle(() => ({
    transform: [{ scale: pop.value }],
    backgroundColor:
      p.value > 0.01 ? `rgba(27,27,31,${p.value})` : 'transparent',
    borderWidth: p.value > 0.5 ? 0 : 2,
  }));
  const tick = useAnimatedProps(() => ({
    strokeDashoffset: 24 * (1 - p.value),
  }));
  // Title dims briefly mid-toggle, then settles.
  const strike = useAnimatedStyle(() => ({ opacity: 1 - 0.15 * Math.sin(Math.PI * p.value) }));
  return (
    <Press
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      accessibilityLabel={title}
      onPress={onToggle}
      scaleTo={0.98}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        minHeight: 60,
        paddingVertical: 8,
        paddingHorizontal: 4,
      }}
    >
      <Animated.View
        style={[
          {
            width: 30,
            height: 30,
            borderRadius: 15,
            borderColor: C.ring,
            alignItems: 'center',
            justifyContent: 'center',
          },
          box,
        ]}
      >
        <Svg width={16} height={16} viewBox="0 0 24 24">
          <AnimatedPath
            d="M5 12l5 5L20 7"
            fill="none"
            stroke="#fff"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="24"
            animatedProps={tick}
          />
        </Svg>
      </Animated.View>
      <View style={{ flex: 1, gap: 4 }}>
        {/* Native strike-through follows every wrapped line; the row fades as it's ticked. */}
        <Animated.View style={strike}>
          {/* Remount on toggle: iOS can drop the glyphs when line-through is added to an existing Text. */}
          <Txt
            key={checked ? 'done' : 'todo'}
            style={[
              TYPE.bodyL,
              checked
                ? { color: C.inkSubtle, textDecorationLine: 'line-through', textDecorationColor: '#A9A4B0' }
                : { color: C.ink },
            ]}
          >
            {title}
          </Txt>
        </Animated.View>
        {meta && (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            {meta}
          </View>
        )}
      </View>
    </Press>
  );
}

/* ---------- Misc ---------- */
export function TypingDots() {
  return (
    <View
      accessibilityLabel="Study buddy is typing"
      style={{
        flexDirection: 'row',
        gap: 6,
        backgroundColor: C.surface,
        boxShadow: SHADOW.soft,
        borderRadius: 99,
        paddingHorizontal: 16,
        paddingVertical: 14,
        alignSelf: 'flex-start',
      }}
    >
      {[0, 1, 2].map(i => (
        <Dot key={i} delay={i * 150} />
      ))}
    </View>
  );
}
function Dot({ delay }: { delay: number }) {
  const v = useSharedValue(0);
  useEffect(() => {
    const loop = () => {
      v.value = withDelay(
        delay,
        withSequence(
          withTiming(1, { duration: 300 }),
          withTiming(0, { duration: 300 }),
        ),
      );
    };
    loop();
    const id = setInterval(loop, 1000);
    return () => clearInterval(id);
  }, [delay, v]);
  const a = useAnimatedStyle(() => ({
    opacity: 0.4 + v.value * 0.6,
    transform: [{ translateY: -5 * v.value }],
  }));
  return (
    <Animated.View
      style={[
        { width: 8, height: 8, borderRadius: 4, backgroundColor: C.inkSubtle },
        a,
      ]}
    />
  );
}

export const s = StyleSheet.create({
  primary: {
    height: 64,
    borderRadius: 999,
    ...INK,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 28,
    paddingRight: 8,
  },
  primaryCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondary: {
    height: 56,
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 20,
  },
  chip: {
    height: 52,
    borderRadius: 999,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: SUBJ.se.fill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    borderRadius: 999,
    padding: 8,
    paddingRight: 24,
  },
  circle52: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.input,
    borderRadius: R.input,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
});
