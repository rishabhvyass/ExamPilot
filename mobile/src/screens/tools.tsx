import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  TextInput,
  View,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Animated, {
  Easing,
  FadeInDown,
  ZoomIn,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRoute, type RouteProp } from '@react-navigation/native';
import { keepLocalCopy, pick, types } from '@react-native-documents/picker';
import Pdf from 'react-native-pdf';
import { BarChart } from 'react-native-gifted-charts';
import { BlurReader } from '../kit/components/BlurReader';
import { ICON, Icon as KIcon, READER_ICONS } from '../kit/components/Icon';
import { ToolDock } from '../kit/components/ToolDock';
import { ChoiceGroup } from '../components/choicegroup';
import {
  BottomSheet,
  Card,
  EmptyState,
  FormSheet,
  Icon,
  IconButton,
  Press,
  Rise,
  Screen,
  TypingDots,
  Txt,
} from '../components/ui';
import { C, FONT, SHADOW, SUBJ, TYPE, colorOf, INK, SHEEN } from '../theme';
import { useStore } from '../data/store';
import { useNav, type RootParams } from '../navigation';
import { celebrate } from '../lib/celebrate';
import { pdfText } from '../lib/pdfText';
import { addDays, daysBetween, fmtShort, todayISO, weekday } from '../lib/dates';
import { hours } from '../lib/plan';
import type {
  ChartBlock,
  ChatMessage,
  Material,
  State,
  StudyPlanBlock,
} from '../data/types';
import micro from '../data/seed/microcopy.json';

/* ---------- 10 Study materials ---------- */
const TYPE_ICON = {
  pdf: 'file-pdf',
  image: 'image',
  link: 'link',
  note: 'note',
} as const;
function Breathe({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  const v = useSharedValue(0);
  useEffect(() => {
    if (!reduce)
      v.value = withRepeat(
        withTiming(1, { duration: 1400, easing: Easing.inOut(Easing.ease) }),
        -1,
        true,
      );
  }, [reduce, v]);
  const a = useAnimatedStyle(() => ({
    boxShadow: `0px ${10 + 4 * v.value}px ${26 + 8 * v.value}px rgba(27,27,31,${
      0.25 + 0.1 * v.value
    })`,
  }));
  return (
    <Animated.View style={[{ borderRadius: 999 }, a]}>{children}</Animated.View>
  );
}
export function Materials() {
  const { state } = useStore();
  if (!state.subjects.length)
    return (
      <EmptyState
        back
        eyebrow="Study materials"
        title={'Notes &\nPDFs'}
        body="Add your admit card first — then keep PDFs, photos of notes and links for each subject here."
      />
    );
  return <MaterialsBody />;
}
function MaterialsBody() {
  const nav = useNav();
  const route = useRoute<RouteProp<RootParams, 'Materials'>>();
  const insets = useSafeAreaInsets();
  const { state, update } = useStore();
  const [picked, setF] = useState(
    route.params?.subjectId ?? state.subjects[0].id,
  );
  const [sheet, setSheet] = useState(false);
  const [form, setForm] = useState<'link' | 'note' | null>(null);
  const items = state.materials.filter(m => m.subjectId === f);
  const sj = state.subjects.find(x => x.id === picked) ?? state.subjects[0];
  const f = sj.id;
  const c = SUBJ[colorOf(sj.color)];
  const add = (...ms: Omit<Material, 'id' | 'subjectId' | 'isSample'>[]) =>
    update(x => ({
      ...x,
      materials: [
        ...x.materials,
        ...ms.map((m, i) => ({
          ...m,
          id: `u${Date.now()}-${i}`,
          subjectId: f,
          isSample: false,
        })),
      ],
    }));
  const meta = (m: Material) =>
    `${m.isSample ? 'Sample · ' : ''}${
      m.type === 'pdf'
        ? `${m.pages ?? '?'} pages`
        : m.type === 'image'
        ? `${m.count ?? 1} photo${(m.count ?? 1) > 1 ? 's' : ''}`
        : m.type === 'link'
        ? m.minutes
          ? `${m.minutes} min`
          : 'Link'
        : 'Note'
    }`;
  /** Pick one or many files at once; PDFs are copied into the app so the reader can open them later. */
  const pickFile = async (kind: 'pdf' | 'image') => {
    try {
      const files = await pick({
        type: [kind === 'pdf' ? types.pdf : types.images],
        allowMultiSelection: true,
      });
      setSheet(false);
      if (kind === 'image') {
        add(
          ...files.map(file => ({
            type: 'image' as const,
            name: file.name ?? 'Photo of notes',
            count: 1,
          })),
        );
        return;
      }
      // Picker URIs are temporary; keep copies inside the app.
      const copies = await keepLocalCopy({
        files: files.map(file => ({
          uri: file.uri,
          fileName: file.name ?? 'Document.pdf',
        })) as [{ uri: string; fileName: string }],
        destination: 'documentDirectory',
      });
      add(
        ...files.map((file, i) => {
          const copy = copies.find(c => c.sourceUri === file.uri) ?? copies[i];
          return {
            type: 'pdf' as const,
            name: file.name ?? 'Document.pdf',
            sizeKb: Math.round((file.size ?? 0) / 1024),
            uri: copy?.status === 'success' ? copy.localUri : file.uri,
          };
        }),
      );
    } catch {
      /* cancelled */
    }
  };
  const groups: [string, Material['type'][]][] = [
    ['PDFs', ['pdf']],
    ['Photos & notes', ['image', 'note']],
    ['Videos & links', ['link']],
  ];
  const tiles: [string, string, string, string, () => void][] = [
    [
      'Upload PDFs',
      'file-pdf',
      SUBJ.se.fill,
      SUBJ.se.text,
      () => pickFile('pdf'),
    ],
    [
      'Photo of notes',
      'camera',
      SUBJ.daa.fill,
      SUBJ.daa.text,
      () => pickFile('image'),
    ],
    [
      'Video or link',
      'link',
      SUBJ.dds.fill,
      SUBJ.dds.text,
      () => {
        setSheet(false);
        setForm('link');
      },
    ],
    [
      'Write a note',
      'note',
      C.surfaceMuted,
      C.ink,
      () => {
        setSheet(false);
        setForm('note');
      },
    ],
  ];
  return (
    <Screen
      footer={
        <View
          pointerEvents="box-none"
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: insets.bottom + 20,
            alignItems: 'center',
          }}
        >
          <Breathe>
            <Press
              accessibilityRole="button"
              onPress={() => setSheet(true)}
              style={{
                height: 64,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
                borderRadius: 999,
                ...INK,
                paddingLeft: 24,
                paddingRight: 28,
              }}
            >
              <Icon name="plus" size={22} color="#fff" />
              <Txt style={{ color: '#fff', fontSize: 18, fontWeight: 600 }}>
                Add material
              </Txt>
            </Press>
          </Breathe>
        </View>
      }
    >
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <IconButton
          icon="chevron-left"
          label="Back"
          onPress={() => nav.goBack()}
        />
        <View style={{ flex: 1 }} />
        <IconButton icon="search" label="Search" />
      </View>
      <View style={{ paddingTop: 14, paddingBottom: 16, paddingHorizontal: 4 }}>
        <Txt style={TYPE.eyebrow}>
          {items.length} items{items.some(i => i.isSample) ? ' · sample' : ''}
        </Txt>
        <Txt accessibilityRole="header" style={TYPE.display}>
          {'Study\nMaterials'}
        </Txt>
      </View>
      <ChoiceGroup
        scroll
        label="Subject"
        options={state.subjects.map(x => ({ value: x.id, label: x.code }))}
        value={f}
        onChange={setF}
      />
      <View key={f} style={{ marginTop: 16, gap: 20, paddingBottom: 80 }}>
        {groups.map(([title, kinds], gi) => {
          const rows = items.filter(m => kinds.includes(m.type));
          if (!rows.length) return null;
          return (
            <Rise key={title} i={gi}>
              <Txt
                accessibilityRole="header"
                style={{
                  fontSize: 18,
                  fontWeight: 600,
                  color: C.inkMuted,
                  marginBottom: 8,
                  paddingHorizontal: 4,
                }}
              >
                {title}
              </Txt>
              <View style={{ gap: 10 }}>
                {rows.map(m => (
                  <Press
                    key={m.id}
                    accessibilityRole="button"
                    accessibilityLabel={`${m.name}, ${meta(m)}`}
                    onPress={() =>
                      m.type === 'pdf' && nav.navigate('Pdf', { id: m.id })
                    }
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 14,
                      borderRadius: 28,
                      backgroundColor: C.surface,
                      boxShadow: SHADOW.soft,
                      padding: 12,
                    }}
                  >
                    <View
                      style={{
                        width: 52,
                        height: 52,
                        borderRadius: 18,
                        backgroundColor: c.fill,
                        ...SHEEN,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Icon name={TYPE_ICON[m.type]} color={c.text} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Txt numberOfLines={1} style={TYPE.bodyStrong}>
                        {m.name}
                      </Txt>
                      <Txt style={{ fontSize: 14, color: C.inkMuted }}>
                        {meta(m)}
                      </Txt>
                    </View>
                    <Icon name="chevron-right" size={20} color={C.inkSubtle} />
                  </Press>
                ))}
              </View>
            </Rise>
          );
        })}
        {!items.length && (
          <View
            style={{
              borderRadius: 28,
              borderWidth: 1.5,
              borderStyle: 'dashed',
              borderColor: C.lineStrong,
              padding: 20,
            }}
          >
            <Txt style={{ textAlign: 'center', color: C.inkMuted }}>
              Nothing here yet. Add your first note or PDF.
            </Txt>
          </View>
        )}
      </View>
      <BottomSheet
        open={sheet}
        onClose={() => setSheet(false)}
        title={`Add to ${sj.code}`}
      >
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
          {tiles.map(([l, ic, bg, fg, fn], i) => (
            <Animated.View
              key={l}
              entering={FadeInDown.delay(100 + i * 60).duration(300)}
              style={{ width: '47%', flexGrow: 1 }}
            >
              <Press
                accessibilityRole="button"
                onPress={fn}
                style={{
                  height: 112,
                  borderRadius: 28,
                  backgroundColor: bg,
                  padding: 16,
                  justifyContent: 'space-between',
                }}
              >
                <Icon name={ic} size={26} color={fg} />
                <Txt style={{ fontWeight: 600, color: fg }}>{l}</Txt>
              </Press>
            </Animated.View>
          ))}
        </View>
        <Txt style={{ marginTop: 16, fontSize: 14, color: C.inkMuted }}>
          Anything you add here can be used by the study assistant to build your
          plan and quiz you.
        </Txt>
      </BottomSheet>
      <FormSheet
        open={form === 'link'}
        onClose={() => setForm(null)}
        title="Add a video or link"
        submit="Add link"
        fields={[
          { key: 'name', label: 'Title' },
          { key: 'url', label: 'Link', placeholder: 'https://' },
        ]}
        onSubmit={v => {
          if (v.url) {
            add({
              type: 'link',
              name: v.name || v.url.replace(/^https?:\/\//, '').slice(0, 40),
            });
            setForm(null);
          }
        }}
      />
      <FormSheet
        open={form === 'note'}
        onClose={() => setForm(null)}
        title="Write a note"
        submit="Save note"
        fields={[
          { key: 'name', label: 'Title' },
          { key: 'body', label: 'Note' },
        ]}
        onSubmit={v => {
          if (v.body || v.name) {
            add({
              type: 'note',
              name: v.name || v.body.slice(0, 40),
              body: v.body,
            });
            setForm(null);
          }
        }}
      />
    </Screen>
  );
}

/* ---------- 11 Study assistant ---------- */
const uid = () => Math.random().toString(36).slice(2);
/** Mocked replies in the AI contract shape (text, study_plan, chart). Replace with the /api/ai proxy. */
function reply(q: string, state: State): Omit<ChatMessage, 'id' | 'role'> {
  const t = q.toLowerCase();
  const today = todayISO();
  if (t.includes('chart') || t.includes('hours')) {
    const data = state.subjects.map(x => ({
      label: x.code,
      subjectId: x.id,
      value: state.sessions
        .filter(y => y.subjectId === x.id)
        .reduce((a, y) => a + hours(y), 0),
    }));
    return {
      text: 'Here’s how your planned study hours split across subjects.',
      block: {
        type: 'chart',
        kind: 'bar',
        title: 'Planned study hours this week',
        unit: 'h',
        data,
      },
    };
  }
  const upcoming = [...state.exams]
    .filter(e => e.date >= today)
    .sort((x, y) => (x.date + x.time).localeCompare(y.date + y.time));
  // Prefer the subject the student named ("plan DAA"), else the next exam.
  const named = state.subjects.find(
    x =>
      t.includes(x.code.toLowerCase()) || t.includes(x.name.toLowerCase()),
  );
  const exam =
    (named && upcoming.find(e => e.subjectId === named.id)) ?? upcoming[0];
  const sj = named ?? state.subjects.find(x => x.id === exam?.subjectId);
  if (t.includes('plan') || t.includes('week')) {
    if (!exam || !sj)
      return {
        text: 'Add your admit card first and I’ll plan around your exam dates.',
      };
    const left = daysBetween(today, exam.date);
    const todo = sj.topics.filter(x => !x.done).map(x => x.name);
    const days = Math.max(1, Math.min(left, 4));
    return {
      text:
        left <= 0
          ? `${sj.name} is today — a short, calm recap is all you need.`
          : `Here’s a calm plan for ${sj.code} before ${weekday(exam.date)}, lighter the evening before.`,
      block: {
        type: 'study_plan',
        subjectId: sj.id,
        title: `Plan for ${sj.name}`,
        sessions: Array.from({ length: days }, (_, i) => {
          const eve = i === days - 1 && left > 0;
          return {
            date: left <= 0 ? today : addDays(exam.date, -(days - i)),
            topic: eve
              ? 'Light recap, then rest'
              : todo[i] ?? (todo.length ? 'Practice questions' : `Revise ${sj.name}`),
            hours: eve ? 1 : 1.5,
          };
        }).filter(x => x.date >= today),
        note: todo.length
          ? undefined
          : 'Add topics on the Subjects tab and I’ll plan them one by one.',
      },
    };
  }
  if (t.includes('quiz') || t.includes('explain') || t.includes('page')) {
    const pool = state.questions.filter(
      q => !q.revised && (!sj || q.subjectId === sj.id),
    );
    const q = pool[Math.floor(Math.random() * pool.length)];
    const pdf = [...state.materials]
      .reverse()
      .find(m => m.type === 'pdf' && m.uri && (!sj || m.subjectId === sj.id));
    const source = pdf
      ? {
          materialId: pdf.id,
          label: `${pdf.name} · p.${state.pdf[pdf.id]?.page ?? 1}`,
          page: state.pdf[pdf.id]?.page ?? 1,
        }
      : undefined;
    if (!q)
      return {
        text: `No questions saved${
          sj ? ` for ${sj.code}` : ''
        } yet. Add the important ones on the Questions tab and I’ll quiz you from them.`,
        source,
      };
    return {
      text: `Quick quiz: ${q.question}${
        q.answer ? '\n\nThink it through, then check your answer on the Questions tab.' : ''
      }`,
      source,
    };
  }
  return {
    text: 'I can plan your week, quiz you from your saved questions, or chart your study hours. Which would help most right now?',
  };
}
export function Assistant() {
  const nav = useNav();
  const insets = useSafeAreaInsets();
  const { state, update } = useStore();
  const [text, setText] = useState('');
  const [typing, setTyping] = useState(false);
  const scroll = useRef<{
    scrollToEnd: (o?: { animated?: boolean }) => void;
  } | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  const msgs: ChatMessage[] = state.chat.length
    ? state.chat
    : [{ id: 'hello', role: 'assistant', text: micro.assistant.hello }];
  const send = (q: string) => {
    if (!q.trim() || typing) return;
    update(x => ({
      ...x,
      chat: [
        ...(x.chat.length ? x.chat : msgs),
        { id: uid(), role: 'user', text: q.trim() },
      ],
    }));
    setText('');
    setTyping(true);
    timer.current = setTimeout(() => {
      setTyping(false);
      update(x => ({
        ...x,
        chat: [...x.chat, { id: uid(), role: 'assistant', ...reply(q, x) }],
      }));
    }, 900);
  };
  const addToCal = (m: ChatMessage) => {
    const b = m.block as StudyPlanBlock;
    update(x => ({
      ...x,
      sessions: [
        ...x.sessions,
        ...b.sessions.map(y => ({
          id: uid(),
          date: y.date,
          start: '17:00',
          end: `${17 + Math.floor(y.hours)}:${y.hours % 1 ? '30' : '00'}`,
          subjectId: b.subjectId ?? 'se',
          title: y.topic,
          source: 'assistant' as const,
        })),
      ],
      chat: x.chat.map(cm => (cm.id === m.id ? { ...cm, added: true } : cm)),
    }));
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1, backgroundColor: C.ground }}
    >
      <View
        style={{
          paddingTop: insets.top + 12,
          paddingHorizontal: 20,
          paddingBottom: 12,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <IconButton
          icon="chevron-left"
          label="Back"
          onPress={() => nav.goBack()}
        />
        <Glow>
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: SUBJ.se.fill,
              ...SHEEN,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon name="sparkle" color={SUBJ.se.text} />
          </View>
        </Glow>
        <View>
          <Txt style={{ fontSize: 18, fontWeight: 600 }}>Study buddy</Txt>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <View
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: SUBJ.dds.mark,
              }}
            />
            <Txt style={{ fontSize: 13, color: C.inkMuted }}>
              Knows your plan & materials
            </Txt>
          </View>
        </View>
      </View>
      <View
        style={{
          marginHorizontal: 20,
          marginBottom: 8,
          borderRadius: 99,
          borderWidth: 1.5,
          borderColor: C.lineStrong,
          paddingVertical: 6,
        }}
      >
        <Txt style={{ textAlign: 'center', fontSize: 13, color: C.inkMuted }}>
          {micro.assistant.notConnected}
        </Txt>
      </View>
      <ScrollView
        ref={scroll as never}
        onContentSizeChange={() =>
          scroll.current?.scrollToEnd({ animated: true })
        }
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingVertical: 8,
          gap: 12,
        }}
        accessibilityLiveRegion="polite"
      >
        {msgs.map(m => (
          <Animated.View
            key={m.id}
            entering={FadeInDown.duration(360).easing(
              Easing.bezier(0.2, 0.9, 0.25, 1.05),
            )}
            style={{
              gap: 8,
              alignItems: m.role === 'user' ? 'flex-end' : 'flex-start',
            }}
          >
            {!!m.text && (
              <View
                style={[
                  {
                    maxWidth: '86%',
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                  },
                  m.role === 'user'
                    ? {
                        ...INK,
                        borderTopLeftRadius: 26,
                        borderTopRightRadius: 26,
                        borderBottomLeftRadius: 26,
                        borderBottomRightRadius: 8,
                      }
                    : {
                        backgroundColor: C.surface,
                        boxShadow: SHADOW.soft,
                        borderTopLeftRadius: 26,
                        borderTopRightRadius: 26,
                        borderBottomRightRadius: 26,
                        borderBottomLeftRadius: 8,
                      },
                ]}
              >
                <Txt
                  style={{
                    lineHeight: 22,
                    color: m.role === 'user' ? '#fff' : C.ink,
                  }}
                >
                  {m.text}
                </Txt>
              </View>
            )}
            {m.block?.type === 'study_plan' && (
              <PlanCard m={m} onAdd={() => addToCal(m)} />
            )}
            {m.block?.type === 'chart' && <ChartCard b={m.block} />}
            {m.source && (
              <Press
                accessibilityRole="button"
                onPress={() =>
                  nav.navigate('Pdf', {
                    id: m.source!.materialId,
                    page: m.source!.page,
                  })
                }
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 8,
                  borderRadius: 99,
                  backgroundColor: SUBJ.se.fill,
                  ...SHEEN,
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                }}
              >
                <Icon name="file-pdf" size={16} color={SUBJ.se.text} />
                <Txt style={[TYPE.micro, { color: SUBJ.se.text }]}>
                  {m.source.label}
                </Txt>
              </Press>
            )}
          </Animated.View>
        ))}
        {typing && <TypingDots />}
      </ScrollView>
      <View
        style={{
          paddingHorizontal: 20,
          paddingTop: 8,
          paddingBottom: insets.bottom + 12,
        }}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8, marginBottom: 12 }}
          keyboardShouldPersistTaps="handled"
        >
          {['Plan my week', 'Quiz me', 'Chart my study hours'].map(x => (
            <Pressable
              key={x}
              accessibilityRole="button"
              onPress={() => send(x)}
              style={{
                height: 44,
                borderRadius: 99,
                borderWidth: 1.5,
                borderColor: C.lineStrong,
                paddingHorizontal: 16,
                justifyContent: 'center',
              }}
            >
              <Txt style={{ fontSize: 15, fontWeight: 500 }}>{x}</Txt>
            </Pressable>
          ))}
        </ScrollView>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            borderRadius: 99,
            backgroundColor: C.surface,
            boxShadow: SHADOW.soft,
            padding: 6,
          }}
        >
          <View
            style={{
              width: 44,
              height: 44,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon name="paperclip" size={20} color={C.inkMuted} />
          </View>
          <TextInput
            value={text}
            onChangeText={setText}
            onSubmitEditing={() => send(text)}
            returnKeyType="send"
            placeholder="Ask anything…"
            placeholderTextColor={C.inkSubtle}
            accessibilityLabel="Message"
            style={{
              flex: 1,
              fontSize: 16,
              fontFamily: FONT[400],
              color: C.ink,
              paddingVertical: 8,
            }}
          />
          <Press
            accessibilityRole="button"
            accessibilityLabel="Send"
            onPress={() => send(text)}
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              ...INK,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon name="arrow-up-send" size={20} color="#fff" />
          </Press>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
function Glow({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  const v = useSharedValue(0);
  useEffect(() => {
    if (!reduce)
      v.value = withRepeat(
        withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        -1,
        true,
      );
  }, [reduce, v]);
  const a = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${12 * v.value}deg` },
      { scale: 1 + 0.06 * v.value },
    ],
  }));
  return <Animated.View style={a}>{children}</Animated.View>;
}
function PlanCard({ m, onAdd }: { m: ChatMessage; onAdd: () => void }) {
  const b = m.block as StudyPlanBlock;
  const c = SUBJ[colorOf(b.subjectId)];
  return (
    <View
      style={{
        alignSelf: 'stretch',
        borderRadius: 26,
        backgroundColor: C.surface,
        boxShadow: SHADOW.soft,
        padding: 16,
      }}
    >
      <Txt style={{ fontWeight: 600, marginBottom: 8 }}>{b.title}</Txt>
      <View style={{ gap: 8 }}>
        {b.sessions.map(x => (
          <View
            key={x.date + x.topic}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 12,
              borderRadius: 22,
              backgroundColor: c.fill,
              ...SHEEN,
              paddingHorizontal: 16,
              paddingVertical: 10,
            }}
          >
            <Txt style={{ flex: 1, fontSize: 14, color: c.text }}>
              <Txt style={{ fontSize: 14, fontWeight: 700, color: c.text }}>
                {fmtShort(x.date)}
              </Txt>{' '}
              · {x.topic}
            </Txt>
            <Txt style={{ fontSize: 14, fontWeight: 600, color: c.text }}>
              {x.hours}h
            </Txt>
          </View>
        ))}
      </View>
      <Press
        accessibilityRole="button"
        disabled={m.added}
        onPress={onAdd}
        style={{
          marginTop: 12,
          height: 48,
          borderRadius: 99,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: m.added ? SUBJ.dds.fill : C.ink,
        }}
      >
        <Txt
          style={{
            fontSize: 15,
            fontWeight: 600,
            color: m.added ? SUBJ.dds.text : '#fff',
          }}
        >
          {m.added ? '✓ Added to calendar' : 'Add to calendar'}
        </Txt>
      </Press>
    </View>
  );
}
function ChartCard({ b }: { b: ChartBlock }) {
  const max = Math.max(...b.data.map(d => d.value), 0);
  return (
    <View
      accessible
      accessibilityLabel={`${b.title}: ${b.data
        .map(d => `${d.label} ${+d.value.toFixed(1)}${b.unit ?? ''}`)
        .join(', ')}`}
      style={{
        alignSelf: 'stretch',
        borderRadius: 26,
        backgroundColor: C.surface,
        boxShadow: SHADOW.soft,
        padding: 16,
      }}
    >
      <Txt style={{ fontWeight: 600 }}>{b.title}</Txt>
      <View style={{ marginTop: 12, alignItems: 'center' }}>
        <BarChart
          data={b.data.map(d => ({
            value: d.value,
            label: d.label,
            frontColor: SUBJ[colorOf(d.subjectId)].mark,
            topLabelComponent: () => (
              <Txt style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
                {`${+d.value.toFixed(1)}${b.unit ?? ''}`}
              </Txt>
            ),
          }))}
          isAnimated
          animationDuration={800}
          barWidth={44}
          spacing={28}
          initialSpacing={12}
          barBorderRadius={14}
          height={130}
          maxValue={max ? max * 1.15 : 1}
          noOfSections={1}
          hideRules
          hideYAxisText
          yAxisThickness={0}
          xAxisThickness={0}
          xAxisLabelTextStyle={{ fontSize: 13, color: C.inkMuted }}
          disableScroll
        />
      </View>
    </View>
  );
}

/* ---------- 12 PDF reader ---------- */
/** Splits extracted PDF text into short sentence-sized lines for the focus reader. */
const toLines = (text: string) => {
  const out: string[] = [];
  for (const raw of text.replace(/\s+/g, ' ').match(/[^.!?]+[.!?]*/g) ?? []) {
    let line = raw.trim();
    while (line.length > 150) {
      const cut = line.lastIndexOf(' ', 140);
      const at = cut > 40 ? cut : 140;
      out.push(line.slice(0, at));
      line = line.slice(at).trim();
    }
    if (line.length > 1) out.push(line);
  }
  return out;
};
export function PdfReader() {
  const nav = useNav();
  const route = useRoute<RouteProp<RootParams, 'Pdf'>>();
  const { state, update } = useStore();
  const id = route.params.id;
  const m = state.materials.find(x => x.id === id);
  const prog = state.pdf[id] ?? { page: 1, highlights: {} };
  const [total, setTotal] = useState(Math.max(1, m?.pages ?? 1));
  // The viewer owns its page: we only listen (onPageChanged) and jump through the ref.
  // Feeding `page` back in as a prop fights the native swipe and loops.
  const [startPage] = useState(Math.max(1, route.params.page ?? prog.page));
  const [page, setPage] = useState(startPage);
  const pdfRef = useRef<{ setPage: (p: number) => void } | null>(null);
  const [focus, setFocus] = useState<{ page: string[]; all: string[] } | null>(
    null,
  );
  const [trackW, setTrackW] = useState(0);
  const pct = total > 1 ? (page - 1) / (total - 1) : 0;
  const knob = useSharedValue(0);
  useEffect(() => {
    knob.value = withTiming(pct, {
      duration: 500,
      easing: Easing.bezier(0.2, 0.8, 0.2, 1),
    });
  }, [pct, knob]);
  // Clamp the rocket inside the track so it never covers the page count.
  const knobStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: Math.min(knob.value * trackW, Math.max(0, trackW - 28)) },
    ],
  }));
  const fillStyle = useAnimatedStyle(() => ({ width: knob.value * trackW }));
  const save = (p: number, extra: Partial<typeof prog> = {}) =>
    update(x => ({
      ...x,
      pdf: { ...x.pdf, [id]: { ...(x.pdf[id] ?? prog), page: p, ...extra } },
    }));
  /** Called by the viewer whenever the visible page changes (swipe or jump). */
  const onPage = (p: number) => {
    if (p === page) return;
    setPage(p);
    save(p, p === total ? { finished: true } : {});
    if (p === total && total > 1 && !prog.finished) celebrate();
  };
  const go = (p: number) => {
    if (p < 1 || p > total || p === page) return;
    pdfRef.current?.setPage(p);
  };
  const openFocus = async () => {
    if (!m?.uri) return;
    try {
      const r = await pdfText(m.uri);
      const all = toLines(r.pages.join(' '));
      if (!all.length) {
        Alert.alert(
          'No text in this PDF',
          'It looks like a scanned image, so there’s nothing to read line by line.',
        );
        return;
      }
      const here = toLines(r.pages[page - 1] ?? '');
      setFocus({ page: here.length ? here : all, all });
    } catch (e) {
      Alert.alert('Couldn’t read this PDF', (e as Error).message);
    }
  };
  if (!m?.uri)
    return (
      <Screen>
        <IconButton
          icon="chevron-left"
          label="Back"
          onPress={() => nav.goBack()}
        />
        <Card style={{ marginTop: 24 }}>
          <Txt style={TYPE.section}>This file isn’t on this device</Txt>
          <Txt style={{ color: C.inkMuted, marginTop: 6 }}>
            Add the PDF again from Study materials to read it here.
          </Txt>
        </Card>
      </Screen>
    );
  const sj = state.subjects.find(x => x.id === m.subjectId);
  const finished = page === total && total > 1;
  return (
    <Screen>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <IconButton
          icon="chevron-left"
          label="Back"
          onPress={() => nav.goBack()}
        />
        <View style={{ flex: 1 }}>
          <Txt numberOfLines={1} style={TYPE.bodyStrong}>
            {m.name}
          </Txt>
          <Txt style={{ fontSize: 14, color: C.inkMuted }}>
            {sj ? `${sj.name} · ` : ''}
            {total} {total === 1 ? 'page' : 'pages'}
          </Txt>
        </View>
      </View>
      <View
        style={{
          marginTop: 20,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <View
          onLayout={e => setTrackW(e.nativeEvent.layout.width)}
          style={{
            flex: 1,
            height: 8,
            borderRadius: 4,
            backgroundColor: C.track,
            justifyContent: 'center',
          }}
          accessibilityRole="progressbar"
          accessibilityValue={{ min: 1, max: total, now: page }}
        >
          <Animated.View
            style={[
              {
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                borderRadius: 4,
                backgroundColor: C.inkFlat,
              },
              fillStyle,
            ]}
          />
          <Animated.View
            style={[
              {
                position: 'absolute',
                left: 0,
                width: 28,
                height: 28,
                borderRadius: 14,
                backgroundColor: '#fff',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: SHADOW.card,
              },
              knobStyle,
            ]}
          >
            <Icon name="rocket" size={16} />
          </Animated.View>
        </View>
        <Txt style={{ fontSize: 14, fontWeight: 600, color: C.inkMuted }}>
          {page} / {total}
        </Txt>
      </View>
      <View
        style={{
          marginTop: 20,
          height: 560,
          borderRadius: 28,
          overflow: 'hidden',
          backgroundColor: C.surface,
          boxShadow: SHADOW.soft,
        }}
      >
        <Pdf
          ref={pdfRef}
          source={{ uri: m.uri, cache: true }}
          page={startPage}
          enablePaging
          horizontal
          fitPolicy={0}
          style={{ flex: 1, backgroundColor: 'transparent' }}
          onLoadComplete={n => {
            setTotal(Math.max(1, n));
            if (m.pages !== n)
              update(x => ({
                ...x,
                materials: x.materials.map(it =>
                  it.id === m.id ? { ...it, pages: n } : it,
                ),
              }));
          }}
          onPageChanged={onPage}
          onError={() =>
            Alert.alert('Couldn’t open this PDF', 'The file may be damaged.')
          }
        />
      </View>
      {finished && (
        <Animated.View
          entering={ZoomIn.springify().stiffness(400).damping(28)}
          style={{
            marginTop: 16,
            borderRadius: 28,
            backgroundColor: SUBJ.se.fill,
            ...SHEEN,
            padding: 20,
          }}
        >
          <Txt style={{ fontSize: 18, fontWeight: 600 }}>
            {micro.pdf.finished}
          </Txt>
          <Txt style={{ color: SUBJ.se.text }}>{micro.pdf.finishedSub}</Txt>
        </Animated.View>
      )}
      <View style={{ marginTop: 16 }}>
        <ToolDock
          primary={[
            {
              id: 'prev',
              label: 'Previous page',
              icon: <KIcon d={ICON.chevronLeft} />,
              onSelect: () => go(page - 1),
            },
            {
              id: 'focus',
              label: 'Focus read',
              icon: <Icon name="book-open" size={22} color={C.inkButton} />,
              onSelect: openFocus,
            },
            {
              id: 'ask',
              label: 'Ask about this page',
              icon: <Icon name="sparkle" size={22} color={C.inkButton} />,
              onSelect: () => nav.navigate('Assistant'),
            },
            {
              id: 'next',
              label: 'Next page',
              icon: <KIcon d={ICON.chevronRight} />,
              onSelect: () => go(page + 1),
            },
          ]}
          more={[
            {
              id: 'first',
              label: 'First',
              icon: <KIcon d={ICON.chevronLeft} />,
              onSelect: () => go(1),
            },
            {
              id: 'last',
              label: 'Last',
              icon: <KIcon d={ICON.chevronRight} />,
              onSelect: () => go(total),
            },
          ]}
        />
      </View>
      <Modal
        visible={!!focus}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setFocus(null)}
      >
        <View style={{ flex: 1, backgroundColor: C.ground, padding: 20 }}>
          <View style={{ alignItems: 'flex-end', marginBottom: 12 }}>
            <IconButton
              icon="close"
              label="Close focus read"
              onPress={() => setFocus(null)}
            />
          </View>
          {focus && (
            <BlurReader
              height={620}
              modes={[
                {
                  id: 'page',
                  label: `Page ${page}`,
                  iconPath: READER_ICONS.notes,
                  lines: focus.page,
                },
                {
                  id: 'all',
                  label: 'Whole PDF',
                  iconPath: READER_ICONS.saved,
                  lines: focus.all,
                },
              ]}
            />
          )}
        </View>
      </Modal>
    </Screen>
  );
}
export { Rise };
