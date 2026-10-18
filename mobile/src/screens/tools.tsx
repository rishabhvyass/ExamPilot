import { useEffect, useRef, useState } from 'react';
import {
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
  withDelay,
  withRepeat,
  withTiming,
  SlideInRight,
  SlideInLeft,
  FadeOut,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRoute, type RouteProp } from '@react-navigation/native';
import { keepLocalCopy, pick, types } from '@react-native-documents/picker';
import Pdf from 'react-native-pdf';
import { BarChart } from 'react-native-gifted-charts';
import { BlurReader } from '../kit/components/BlurReader';
import { ICON, Icon as KIcon, READER_ICONS } from '../kit/components/Icon';
import { ToolDock } from '../kit/components/ToolDock';
import {
  BottomSheet,
  Chip,
  FormSheet,
  Icon,
  IconButton,
  Press,
  Rise,
  Screen,
  SecondaryButton,
  TypingDots,
  Txt,
} from '../components/ui';
import { C, FONT, SHADOW, SUBJ, TYPE, colorOf, INK, SHEEN } from '../theme';
import { useStore } from '../data/store';
import { useNav, type RootParams } from '../navigation';
import { celebrate } from '../lib/celebrate';
import { addDays, fmtShort, todayISO } from '../lib/dates';
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
  const nav = useNav();
  const route = useRoute<RouteProp<RootParams, 'Materials'>>();
  const insets = useSafeAreaInsets();
  const { state, update } = useStore();
  const [f, setF] = useState(route.params?.subjectId ?? state.subjects[0].id);
  const [sheet, setSheet] = useState(false);
  const [form, setForm] = useState<'link' | 'note' | null>(null);
  const items = state.materials.filter(m => m.subjectId === f);
  const sj = state.subjects.find(x => x.id === f)!;
  const c = SUBJ[colorOf(sj.color)];
  const add = (m: Omit<Material, 'id' | 'subjectId' | 'isSample'>) =>
    update(x => ({
      ...x,
      materials: [
        ...x.materials,
        { ...m, id: 'u' + Date.now(), subjectId: f, isSample: false },
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
  const pickFile = async (kind: 'pdf' | 'image') => {
    try {
      const [file] = await pick({
        type: [kind === 'pdf' ? types.pdf : types.images],
      });
      setSheet(false);
      let uri: string | undefined;
      if (kind === 'pdf') {
        // Picker URIs are temporary; keep a copy inside the app so the reader can open it later.
        const [copy] = await keepLocalCopy({
          files: [{ uri: file.uri, fileName: file.name ?? 'Document.pdf' }],
          destination: 'documentDirectory',
        });
        uri = copy.status === 'success' ? copy.localUri : file.uri;
      }
      add(
        kind === 'pdf'
          ? {
              type: 'pdf',
              name: file.name ?? 'Document.pdf',
              sizeKb: Math.round((file.size ?? 0) / 1024),
              uri,
            }
          : { type: 'image', name: file.name ?? 'Photo of notes', count: 1 },
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
      'Upload PDF',
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
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 8 }}
      >
        {state.subjects.map(x => (
          <Chip
            key={x.id}
            label={x.code}
            active={f === x.id}
            onPress={() => setF(x.id)}
          />
        ))}
      </ScrollView>
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
  if (t.includes('plan') || t.includes('week') || t.includes('daa')) {
    return {
      text: 'Here’s a calm plan for DAA before Thursday, lighter the evening before.',
      block: {
        type: 'study_plan',
        subjectId: 'daa',
        title: 'Calm plan for DAA before Thursday',
        sessions: [
          {
            date: addDays(today, 1),
            topic: 'Divide & conquer + Master theorem',
            hours: 1.5,
          },
          {
            date: addDays(today, 2),
            topic: 'DP and greedy, 6 practice problems',
            hours: 1.5,
          },
          {
            date: addDays(today, 3),
            topic: 'Light recap of graphs after SE exam',
            hours: 1,
          },
        ],
      },
    };
  }
  if (
    t.includes('uml') ||
    t.includes('explain') ||
    t.includes('quiz') ||
    t.includes('page')
  ) {
    return {
      text: 'UML class diagrams show classes, their attributes and how they relate (association, inheritance, composition). Try sketching one for a library system from memory, then compare with your notes.',
      source: {
        materialId: 'm1',
        label: 'SE_Unit3_Design_UML.pdf · p.4–6',
        page: 4,
      },
    };
  }
  return {
    text: 'I can plan your week, quiz you, or chart your study hours. Which would help most right now?',
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
          {['Plan my week', 'Quiz me on UML', 'Chart my study hours'].map(x => (
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
// Sample pages until react-native-pdf (or similar) renders real files from device storage.
const PAGES = (name: string) => [
  {
    h: 'Overview',
    lines: [
      name.replace(/\.pdf$/i, '').replace(/_/g, ' '),
      'This is a sample page. Real PDF rendering arrives once files are stored on the device.',
      'Skim the headings first, then read slowly.',
    ],
  },
  {
    h: 'Key ideas',
    lines: [
      'Break the topic into three or four ideas.',
      'Write each one in your own words.',
      'Say it out loud as if teaching a friend.',
    ],
  },
  {
    h: 'Worked example',
    lines: [
      'Pick one small example and walk through it step by step.',
      'Note where you hesitate — that is the part to revise.',
      'Come back to it tomorrow.',
    ],
  },
  {
    h: 'Common mistakes',
    lines: [
      'Mixing up similar terms.',
      'Skipping the base case.',
      'Memorising without understanding.',
    ],
  },
  {
    h: 'Practice',
    lines: [
      'Try two questions without looking.',
      'Check your answers, then mark what to revisit.',
      'Short sessions beat long ones.',
    ],
  },
  {
    h: 'Summary',
    lines: [
      'You have covered the main ideas.',
      'Rest well — sleep helps it stick.',
      'Nicely done.',
    ],
  },
];
export function PdfReader() {
  const nav = useNav();
  const route = useRoute<RouteProp<RootParams, 'Pdf'>>();
  const { state, update } = useStore();
  const id = route.params.id;
  const m = state.materials.find(x => x.id === id);
  const pages = PAGES(m?.name ?? 'Notes.pdf');
  const real = !!m?.uri;
  const [realTotal, setRealTotal] = useState(m?.pages ?? 0);
  const [focusRead, setFocusRead] = useState(false);
  const total = real ? Math.max(1, realTotal) : pages.length;
  const prog = state.pdf[id] ?? { page: 1, highlights: {} };
  const [page, setPage] = useState(
    Math.min(total, Math.max(1, route.params.page ?? prog.page)),
  );
  const [dir, setDir] = useState(1);
  const [hl, setHl] = useState(false);
  const [trackW, setTrackW] = useState(0);
  const pct = total > 1 ? (page - 1) / (total - 1) : 0;
  const knob = useSharedValue(0);
  useEffect(() => {
    knob.value = withTiming(pct, {
      duration: 500,
      easing: Easing.bezier(0.2, 0.8, 0.2, 1),
    });
  }, [pct, knob]);
  // Clamp the rocket inside the track so it never covers the page count (known fix from the spec).
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
  const go = (p: number) => {
    if (p < 1 || p > total || p === page) return;
    setDir(p > page ? 1 : -1);
    setPage(p);
    save(p, p === total ? { finished: true } : {});
    if (p === total && !prog.finished) celebrate({ x: 0.5, y: 0.6 });
  };
  const toggleLine = (i: number) => {
    if (!hl) return;
    const cur = prog.highlights[page] ?? [];
    save(page, {
      highlights: {
        ...prog.highlights,
        [page]: cur.includes(i) ? cur.filter(x => x !== i) : [...cur, i],
      },
    });
  };
  if (!m)
    return (
      <Screen>
        <Txt style={{ paddingTop: 80 }}>That file isn’t here any more.</Txt>
      </Screen>
    );
  const sj = state.subjects.find(x => x.id === m.subjectId);
  const finished = page === total;
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
            {sj?.name} · {m.isSample ? 'sample PDF' : 'PDF'}
          </Txt>
        </View>
        <Press
          accessibilityRole="switch"
          accessibilityLabel="Highlighter"
          accessibilityState={{ checked: hl }}
          onPress={() => setHl(!hl)}
          scaleTo={0.92}
          style={{
            width: 56,
            height: 56,
            borderRadius: 28,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: hl ? C.ink : C.surface,
          }}
        >
          <Icon name="highlighter" color={hl ? '#fff' : C.ink} />
        </Press>
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
                ...INK,
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
      <View style={{ marginTop: 20, minHeight: 400 }}>
        {real ? (
          <View
            style={{
              height: 520,
              borderRadius: 28,
              overflow: 'hidden',
              backgroundColor: C.surface,
              boxShadow: SHADOW.soft,
            }}
          >
            <Pdf
              source={{ uri: m.uri!, cache: true }}
              page={page}
              enablePaging
              horizontal
              fitPolicy={0}
              style={{ flex: 1, backgroundColor: 'transparent' }}
              onLoadComplete={n => {
                setRealTotal(n);
                update(x => ({
                  ...x,
                  materials: x.materials.map(it =>
                    it.id === m.id ? { ...it, pages: n } : it,
                  ),
                }));
              }}
              onPageChanged={p => go(p)}
            />
          </View>
        ) : (
        <Animated.View
          key={page}
          entering={(dir > 0 ? SlideInRight : SlideInLeft)
            .duration(420)
            .easing(Easing.bezier(0.2, 0.8, 0.2, 1))}
          exiting={FadeOut.duration(120)}
          style={{
            minHeight: 400,
            borderRadius: 28,
            backgroundColor: C.surface,
            boxShadow: SHADOW.soft,
            padding: 28,
            transform: [{ rotate: '0deg' }],
          }}
        >
          <Txt style={{ fontSize: 14, fontWeight: 600, color: C.inkSubtle }}>
            Page {page}
          </Txt>
          <Txt style={[TYPE.section, { marginTop: 4, marginBottom: 16 }]}>
            {pages[page - 1].h}
          </Txt>
          {pages[page - 1].lines.map((l, i) => {
            const on = (prog.highlights[page] ?? []).includes(i);
            return (
              <Pressable
                key={i}
                disabled={!hl}
                onPress={() => toggleLine(i)}
                accessibilityState={{ selected: on }}
                style={{
                  marginBottom: 12,
                  borderRadius: 8,
                  paddingHorizontal: 4,
                  backgroundColor: on ? C.highlight : 'transparent',
                }}
              >
                <Txt style={{ fontSize: 17, lineHeight: 27 }}>{l}</Txt>
              </Pressable>
            );
          })}
        </Animated.View>
        )}
      </View>
      {finished && (
        <Animated.View
          entering={ZoomIn.springify().stiffness(400).damping(14)}
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
          <Press
            accessibilityRole="button"
            onPress={() => nav.navigate('Assistant')}
            style={{
              marginTop: 12,
              alignSelf: 'flex-start',
              height: 48,
              borderRadius: 99,
              ...INK,
              paddingHorizontal: 24,
              justifyContent: 'center',
            }}
          >
            <Txt style={{ color: '#fff', fontWeight: 600, fontSize: 15 }}>
              Yes, quiz me
            </Txt>
          </Press>
        </Animated.View>
      )}
      {!real && (
        <View style={{ marginTop: 16 }}>
          <SecondaryButton
            icon="book-open"
            label="Focus read"
            onPress={() => setFocusRead(true)}
          />
        </View>
      )}
      <Modal
        visible={focusRead}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setFocusRead(false)}
      >
        <View style={{ flex: 1, backgroundColor: C.ground, padding: 20 }}>
          <View style={{ alignItems: 'flex-end', marginBottom: 12 }}>
            <IconButton
              icon="close"
              label="Close focus read"
              onPress={() => setFocusRead(false)}
            />
          </View>
          <BlurReader
            height={620}
            modes={[
              {
                id: 'notes',
                label: 'Notes',
                iconPath: READER_ICONS.notes,
                lines: pages.flatMap(p => [p.h, ...p.lines]),
              },
            ]}
          />
        </View>
      </Modal>
      {!real && (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 8, paddingVertical: 16 }}
      >
        {pages.map((_, i) => (
          <Press
            key={i}
            accessibilityRole="button"
            accessibilityLabel={`Go to page ${i + 1}`}
            accessibilityState={{ selected: page === i + 1 }}
            onPress={() => go(i + 1)}
            style={{
              width: 56,
              height: 80,
              borderRadius: 12,
              backgroundColor: '#fff',
              alignItems: 'center',
              justifyContent: 'flex-end',
              paddingBottom: 4,
              borderWidth: page === i + 1 ? 2 : 1,
              borderColor: page === i + 1 ? C.ink : C.line,
            }}
          >
            <Txt style={{ fontSize: 12, color: C.inkMuted }}>{i + 1}</Txt>
          </Press>
        ))}
      </ScrollView>
      )}
      <ToolDock
        primary={[
          {
            id: 'prev',
            label: 'Previous page',
            icon: <KIcon d={ICON.chevronLeft} />,
            onSelect: () => go(page - 1),
          },
          {
            id: 'hl',
            label: 'Highlighter',
            icon: <Icon name="highlighter" size={22} color={C.inkButton} />,
            active: hl,
            onSelect: () => setHl(!hl),
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
          ...(real
            ? []
            : [
                {
                  id: 'focus',
                  label: 'Focus',
                  icon: <Icon name="book-open" size={22} color={C.inkButton} />,
                  onSelect: () => setFocusRead(true),
                },
              ]),
        ]}
      />
    </Screen>
  );
}
export { Rise };
