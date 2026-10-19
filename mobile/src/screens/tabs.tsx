import { TimeRangePicker } from '../components/TimeRangePicker';
import { StudyIsland } from '../components/StudyIsland';
import { BlurIn } from '../kit/components/BlurIn';
import { FocusReaderSheet, readingLines } from '../components/FocusReaderSheet';
import { MaterialView } from '../components/surface';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Pressable, ScrollView, TextInput, View } from 'react-native';
import Animated, {
  FadeIn,
  LinearTransition,
  ZoomIn,
} from 'react-native-reanimated';
import { liveActivity, type ExamActivity } from '../lib/liveActivity';
import { QuickAddMenu } from '../kit/components/QuickAddMenu';
import { StudyBlockPicker } from '../components/rangepicker';
import { ChoiceGroup } from '../components/choicegroup';
import { TimeField } from '../components/examsheet';
import { useNavigation } from '@react-navigation/native';
import {
  AnimatedCheckbox,
  ArrowButton,
  BottomSheet,
  Card,
  EmptyState,
  FormSheet,
  HeroCard,
  Icon,
  IconButton,
  Press,
  PrimaryButton,
  Rise,
  Screen,
  ScreenHeader,
  SecondaryButton,
  SegmentedProgress,
  SubjectRow,
  SubjectTag,
  TopBar,
  Txt,
} from '../components/ui';
import { C, FONT, SUBJ, TYPE, colorOf, SHADOW, INK, SHEEN, CLAY } from '../theme';
import { useStore } from '../data/store';
import { useNav } from '../navigation';
import { celebrate } from '../lib/celebrate';
import {
  countdown,
  addDays,
  daysBetween,
  dayNum,
  fmtLong,
  fmtShort,
  fmtTime,
  fmtTimeShort,
  greeting,
  monthName,
  monthShort,
  parseISO,
  todayISO,
  toISO,
  weekday,
} from '../lib/dates';
import micro from '../data/seed/microcopy.json';


/* ---------- 06 Today ---------- */
export function Today() {
  const nav = useNav();
  const tabNav = useNavigation<{ navigate: (n: string) => void }>();
  const { state, update, user, signOut } = useStore();
  const profileMenu = () =>
    Alert.alert(
      [state.profile.firstName, state.profile.surname].join(' ').trim() ||
        'Your account',
      user?.email ?? state.profile.email,
      [
        { text: 'Add admit card', onPress: () => nav.navigate('Admit') },
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign out',
          style: 'destructive',
          onPress: () =>
            signOut()
              .then(() => nav.reset({ index: 0, routes: [{ name: 'Login' }] }))
              .catch(() => Alert.alert('Couldn’t sign out. Please try again.')),
        },
      ],
    );
  const today = todayISO();
  const tasks = state.tasks.filter(t => t.date === today);
  const done = tasks.filter(t => t.done).length;
  const upcoming = [...state.exams]
    .sort((a, b) => a.date.localeCompare(b.date))
    .filter(e => daysBetween(today, e.date) >= 0);
  const next = upcoming[0];
  const nextSubj = next && state.subjects.find(s => s.id === next.subjectId);
  const n = next ? daysBetween(today, next.date) : 0;
  const allDone = tasks.length > 0 && done === tasks.length;
  const [sheet, setSheet] = useState(false);
  const [draft, setDraft] = useState({
    title: '',
    subjectId: state.subjects[0]?.id ?? '',
  });
  const wasDone = useRef(allDone);
  useEffect(() => {
    if (allDone && !wasDone.current) celebrate();
    wasDone.current = allDone;
  }, [allDone]);
  // The next exam lives in the real Dynamic Island / lock screen as a Live Activity (iOS 16.2+).
  const [islandSupported, setIslandSupported] = useState(false);
  const [inIsland, setInIsland] = useState(false);
  const activity: ExamActivity | null = next
    ? {
        code: nextSubj?.code ?? 'Exam',
        title: nextSubj?.name ?? next.title,
        date: next.date,
        time: next.time,
        accent: SUBJ[colorOf(nextSubj?.color)].mark,
        topicsDone: done,
        topicsTotal: tasks.length,
      }
    : null;
  useEffect(() => {
    liveActivity.isSupported().then(setIslandSupported).catch(() => {});
    liveActivity.isRunning().then(setInIsland).catch(() => {});
  }, []);
  // Keep a running activity in step with the checklist and the next exam.
  const activityKey = activity && JSON.stringify(activity);
  useEffect(() => {
    if (inIsland && activity) liveActivity.update(activity).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inIsland, activityKey]);
  const toggleIsland = async () => {
    try {
      if (inIsland) {
        await liveActivity.end();
        setInIsland(false);
      } else if (activity) {
        await liveActivity.start(activity);
        setInIsland(true);
      }
    } catch (e) {
      Alert.alert(
        'Couldn’t show it in the Dynamic Island',
        (e as Error).message ?? 'Please try again.',
      );
    }
  };

  const toggle = (id: string) =>
    update(x => ({
      ...x,
      tasks: x.tasks.map(t =>
        t.id === id ? { ...t, done: !t.done, isSample: false } : t,
      ),
    }));
  const add = () => {
    if (!draft.title.trim()) return;
    update(x => ({
      ...x,
      tasks: [
        ...x.tasks,
        {
          id: 'u' + Date.now(),
          date: today,
          title: draft.title.trim(),
          subjectId: draft.subjectId,
          minutes: 25,
          done: false,
          isSample: false,
        },
      ],
    }));
    setDraft({ ...draft, title: '' });
    setSheet(false);
  };
  return (
    <Screen
      tabs
      footer={
        <QuickAddMenu
          actions={[
            {
              id: 'topic',
              label: 'Add topic',
              icon: <Icon name="plus" size={20} color="#fff" />,
              onSelect: () => setSheet(true),
            },
            {
              id: 'admit',
              label: 'Add admit card',
              icon: <Icon name="upload" size={20} color="#fff" />,
              onSelect: () => nav.navigate('Admit'),
            },
            {
              id: 'pdf',
              label: 'Add material',
              icon: <Icon name="file-pdf" size={20} color="#fff" />,
              onSelect: () => nav.navigate('Materials', {}),
            },
            {
              id: 'ask',
              label: 'Ask study assistant',
              icon: <Icon name="sparkle" size={20} color="#fff" />,
              onSelect: () => nav.navigate('Assistant'),
            },
          ]}
        />
      }
    >
      <StudyIsland exam={nextSubj?.code} days={n} complete={allDone} />
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Pressable
          style={{
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: SUBJ.se.fill,
            ...SHEEN,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          accessibilityRole="button"
          accessibilityLabel="Profile"
          onPress={profileMenu}
        >
          <Icon name="user" color={SUBJ.se.text} />
        </Pressable>
        <View style={{ flex: 1 }} />
        <IconButton
          icon="sparkle"
          label="Open study assistant"
          onPress={() => nav.navigate('Assistant')}
        />
        <IconButton icon="search" label="Search study materials" onPress={() => nav.navigate('Materials', {})} />
        <IconButton icon="more-horizontal" label="Account options" onPress={profileMenu} />
      </View>
      <ScreenHeader eyebrow={greeting()} title={'Your Exam\nWeek'} />
      {islandSupported && activity && (
        <Press
          accessibilityRole="switch"
          accessibilityState={{ checked: inIsland }}
          accessibilityLabel="Show next exam in the Dynamic Island"
          onPress={toggleIsland}
          style={[
            {
              alignSelf: 'flex-start',
              height: 44,
              borderRadius: 22,
              paddingHorizontal: 16,
              marginBottom: 14,
              marginLeft: 4,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
            },
            inIsland ? INK : CLAY,
          ]}
        >
          <View
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: inIsland ? '#34D399' : C.inkSubtle,
            }}
          />
          <Txt
            style={{
              fontSize: 15,
              fontWeight: 600,
              color: inIsland ? '#fff' : C.inkButton,
            }}
          >
            {inIsland ? 'In Dynamic Island' : 'Show in Dynamic Island'}
          </Txt>
        </Press>
      )}
      <View style={{ gap: 14 }}>
        {next ? (
          <Rise i={0}>
            <HeroCard
              color={colorOf(next.subjectId)}
              eyebrow="Next exam"
              title={next.title}
              desc={`${fmtLong(next.date)} at ${fmtTime(next.time)}`}
              stats={[
                {
                  label: n <= 1 ? 'Exam' : 'Days',
                  value: n <= 0 ? 'Today' : n === 1 ? 'Tmrw' : String(n),
                  foot: n > 1 ? 'to prepare' : fmtTimeShort(next.time),
                },
                {
                  label: 'Topics',
                  value: `${nextSubj?.topics.filter(t => t.done).length ?? 0}/${
                    nextSubj?.topics.length ?? 0
                  }`,
                },
              ]}
              action={
                <ArrowButton
                  label="Open subjects"
                  onPress={() => tabNav.navigate('Subjects')}
                />
              }
            />
            <Txt
              style={{ position: 'absolute', opacity: 0 }}
              accessibilityLabel={countdown(next.date, next.time)}
            >
              {' '}
            </Txt>
          </Rise>
        ) : state.exams.length ? (
          <Card>
            <Txt style={TYPE.section}>All exams done</Txt>
            <Txt style={{ color: C.inkMuted, marginTop: 4 }}>
              Rest well — you’ve prepared for this.
            </Txt>
          </Card>
        ) : (
          <Card>
            <Txt style={TYPE.section}>No exams yet</Txt>
            <Txt style={{ color: C.inkMuted, marginTop: 4, marginBottom: 16 }}>
              Add your admit card and we’ll fill in your exam week.
            </Txt>
            <PrimaryButton
              label="Add admit card"
              onPress={() => nav.navigate('Admit')}
            />
          </Card>
        )}
        {upcoming.slice(1).map((e, i) => (
          <Rise key={e.id} i={i + 1}>
            <SubjectRow
              color={colorOf(e.subjectId)}
              code={state.subjects.find(s => s.id === e.subjectId)?.code ?? '?'}
              title={e.title}
              meta={`${weekday(e.date)}, ${dayNum(e.date)} ${monthShort(
                e.date,
              )} · ${fmtTimeShort(e.time)}`}
              onPress={() => tabNav.navigate('Calendar')}
            />
          </Rise>
        ))}
        <Rise i={3}>
          <Card>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                gap: 12,
              }}
            >
              <View>
                <Txt accessibilityRole="header" style={TYPE.section}>
                  Today’s revision
                </Txt>
                <Txt style={{ fontSize: 15, color: C.inkMuted, marginTop: 4 }}>
                  {micro.checklist.progress
                    .replace('{done}', String(done))
                    .replace('{total}', String(tasks.length))}
                </Txt>
              </View>
              {tasks.some(t => t.isSample) && (
                <View
                  style={{
                    alignSelf: 'flex-start',
                    borderWidth: 1.5,
                    borderColor: C.lineStrong,
                    borderRadius: 99,
                    paddingHorizontal: 14,
                    paddingVertical: 7,
                  }}
                >
                  <Txt
                    style={{ fontSize: 14, fontWeight: 500, color: C.inkMuted }}
                  >
                    Sample plan
                  </Txt>
                </View>
              )}
            </View>
            <View style={{ marginTop: 12 }}>
              <SegmentedProgress
                total={Math.max(1, tasks.length)}
                done={done}
                h={8}
              />
            </View>
            <View style={{ marginTop: 10 }}>
              {tasks.length === 0 && (
                <Txt style={{ color: C.inkMuted, paddingVertical: 16 }}>
                  {micro.checklist.empty}
                </Txt>
              )}
              {tasks.map(t => (
                <AnimatedCheckbox
                  key={t.id}
                  title={t.title}
                  checked={t.done}
                  onToggle={() => toggle(t.id)}
                  meta={
                    <>
                      <SubjectTag
                        code={
                          state.subjects.find(s => s.id === t.subjectId)
                            ?.code ?? ''
                        }
                        color={colorOf(t.subjectId)}
                      />
                      <Txt style={{ fontSize: 13, color: C.inkMuted }}>
                        {t.minutes} min
                      </Txt>
                    </>
                  }
                />
              ))}
            </View>
            {allDone ? (
              <BlurIn soft delay={0}><MaterialView
                key="done"
                style={{
                  marginTop: 16,
                  flexDirection: 'row',
                  gap: 12,
                  alignItems: 'center',
                  backgroundColor: SUBJ.se.fill,
                  ...SHEEN,
                  borderRadius: 28,
                  padding: 16,
                }}
              >
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 22,
                    backgroundColor: '#fff',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Icon name="sparkle" color={SUBJ.se.text} />
                </View>
                <View style={{ flex: 1 }}>
                  <Txt style={{ fontWeight: 600 }}>
                    {micro.checklist.allDone}
                  </Txt>
                  <Txt style={{ fontSize: 14, color: SUBJ.se.text }}>
                    {micro.checklist.allDoneSub}
                  </Txt>
                </View>
              </MaterialView></BlurIn>
            ) : (
              <Animated.View
                key="foot"
                entering={FadeIn}
                style={{
                  marginTop: 16,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12,
                }}
              >
                <Txt style={{ fontSize: 17, color: C.inkMuted, flexShrink: 1 }}>
                  {micro.checklist.encourage}
                </Txt>
                <Press
                  accessibilityRole="button"
                  onPress={() => setSheet(true)}
                  style={{
                    height: 52,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 8,
                    borderRadius: 999,
                    borderWidth: 1.5,
                    borderColor: C.lineStrong,
                    paddingHorizontal: 20,
                  }}
                >
                  <Icon name="plus" size={18} />
                  <Txt style={{ fontWeight: 500 }}>Add topic</Txt>
                </Press>
              </Animated.View>
            )}
          </Card>
        </Rise>
      </View>
      <BottomSheet
        open={sheet}
        onClose={() => setSheet(false)}
        title="Add a topic"
      >
        <TextInput
          autoFocus
          value={draft.title}
          onChangeText={v => setDraft({ ...draft, title: v })}
          onSubmitEditing={add}
          placeholder="What will you revise?"
          placeholderTextColor={C.inkSubtle}
          accessibilityLabel="Topic"
          style={{
            height: 56,
            borderRadius: 22,
            backgroundColor: C.input,
            paddingHorizontal: 20,
            fontSize: 17,
            fontFamily: FONT[400],
            color: C.ink,
            marginBottom: 12,
          }}
        />
        <View style={{ marginBottom: 16 }}>
          <ChoiceGroup
            label="Subject"
            options={state.subjects.map(x => ({ value: x.id, label: x.code }))}
            value={draft.subjectId}
            onChange={v => setDraft({ ...draft, subjectId: v })}
          />
        </View>
        <PrimaryButton label="Add to today" onPress={add} />
      </BottomSheet>
    </Screen>
  );
}

/* ---------- 07 Calendar ---------- */
export function Calendar() {
  const { state, update } = useStore();
  const today = todayISO();
  const [sel, setSel] = useState(today);
  const [view, setView] = useState(() => {
    const d = parseISO(today);
    return { y: d.getFullYear(), m: d.getMonth() };
  });
  const [sheet, setSheet] = useState(false);
  const [form, setForm] = useState({
    subjectId: state.subjects[0]?.id ?? '',
    date: today,
    endDate: today,
    start: '10:00',
    end: '11:00',
  });
  const shift = (k: number) =>
    setView(v => {
      const d = new Date(v.y, v.m + k, 1);
      return { y: d.getFullYear(), m: d.getMonth() };
    });
  const choose = (d: string) => {
    setSel(d);
    const p = parseISO(d);
    setView({ y: p.getFullYear(), m: p.getMonth() });
  };
  const cells = useMemo(() => {
    const lead = (new Date(view.y, view.m, 1).getDay() + 6) % 7;
    return Array.from({ length: 42 }, (_, i) =>
      toISO(new Date(view.y, view.m, 1 - lead + i)),
    );
  }, [view]);
  const examsOn = (d: string) => state.exams.filter(e => e.date === d);
  const sessOn = (d: string) =>
    state.sessions
      .filter(s => s.date === d)
      .sort((a, b) => a.start.localeCompare(b.start));
  const code = (id: string) =>
    state.subjects.find(s => s.id === id)?.code ?? '';
  const valid = form.endDate >= form.date && form.end > form.start;
  const addSession = () => {
    if (!valid) return;
    const n = daysBetween(form.date, form.endDate) + 1;
    update(x => ({
      ...x,
      sessions: [
        ...x.sessions,
        ...Array.from({ length: n }, (_, i) => ({
          id: 'm' + Date.now() + '-' + i,
          date: addDays(form.date, i),
          start: form.start,
          end: form.end,
          subjectId: form.subjectId,
          title: 'Study session',
          source: 'manual' as const,
        })),
      ],
    }));
    setSheet(false);
    choose(form.date);
  };
  return (
    <Screen tabs>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Press
          accessibilityRole="button"
          onPress={() => choose(today)}
          style={{
            height: 56,
            borderRadius: 999,
            ...CLAY,
            paddingHorizontal: 24,
            justifyContent: 'center',
          }}
        >
          <Txt style={{ fontWeight: 600 }}>Today</Txt>
        </Press>
        <View style={{ flex: 1 }} />
        <IconButton
          icon="chevron-left"
          label="Previous month"
          onPress={() => shift(-1)}
        />
        <IconButton
          icon="chevron-right"
          label="Next month"
          onPress={() => shift(1)}
        />
      </View>
      <View accessibilityLiveRegion="polite">
        <ScreenHeader
          eyebrow={`Calendar · ${view.y}`}
          title={monthName(view.m)}
        />
      </View>
      <Card style={{ padding: 16 }}>
        <View style={{ flexDirection: 'row', paddingBottom: 4 }}>
          {'MTWTFSS'.split('').map((d, i) => (
            <Txt
              key={i}
              style={{
                flex: 1,
                textAlign: 'center',
                fontSize: 13,
                fontWeight: 600,
                color: C.inkSubtle,
              }}
            >
              {d}
            </Txt>
          ))}
        </View>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {cells.map(d => {
            const inMonth = parseISO(d).getMonth() === view.m;
            const ex = examsOn(d),
              ss = sessOn(d),
              on = d === sel;
            return (
              <Pressable
                key={d}
                onPress={() => choose(d)}
                accessibilityRole="button"
                accessibilityState={{ selected: on }}
                accessibilityLabel={`${weekday(d)} ${dayNum(d)} ${monthName(
                  parseISO(d).getMonth(),
                )}${ex.length ? ', exam' : ss.length ? ', study session' : ''}`}
                style={{
                  width: `${100 / 7}%`,
                  height: 52,
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 2,
                }}
              >
                <MaterialView
                  style={[
                    {
                      width: 36,
                      height: 36,
                      borderRadius: 18,
                      alignItems: 'center',
                      justifyContent: 'center',
                    },
                    on
                      ? INK
                      : d === today
                      ? { borderWidth: 2, borderColor: C.ink }
                      : null,
                  ]}
                >
                  <Txt
                    style={{
                      fontSize: 15,
                      fontWeight: 500,
                      color: on ? '#fff' : inMonth ? C.ink : C.otherMonth,
                    }}
                  >
                    {dayNum(d)}
                  </Txt>
                </MaterialView>
                <View style={{ height: 6, flexDirection: 'row', gap: 2 }}>
                  {ex.map(e => (
                    <View
                      key={e.id}
                      style={{
                        width: 12,
                        height: 6,
                        borderRadius: 3,
                        backgroundColor: SUBJ[colorOf(e.subjectId)].mark,
                      }}
                    />
                  ))}
                  {!ex.length && ss.length > 0 && (
                    <View
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: 3,
                        borderWidth: 1.5,
                        borderColor: C.inkSubtle,
                      }}
                    />
                  )}
                </View>
              </Pressable>
            );
          })}
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 20,
            marginTop: 8,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <View
              style={{
                width: 12,
                height: 6,
                borderRadius: 3,
                backgroundColor: SUBJ.se.mark,
              }}
            />
            <Txt style={{ fontSize: 13, color: C.inkMuted }}>Exam</Txt>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <View
              style={{
                width: 6,
                height: 6,
                borderRadius: 3,
                borderWidth: 1.5,
                borderColor: C.inkSubtle,
              }}
            />
            <Txt style={{ fontSize: 13, color: C.inkMuted }}>Study session</Txt>
          </View>
        </View>
      </Card>
      <View
        style={{
          marginTop: 20,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 4,
        }}
      >
        <Txt accessibilityRole="header" style={TYPE.section}>
          {sel === today
            ? `Today, ${dayNum(sel)} ${monthShort(sel)}`
            : fmtShort(sel)}
        </Txt>
        <IconButton
          icon="plus"
          label="Add study session"
          tone="dark"
          onPress={() => {
            setForm({ ...form, date: sel, endDate: sel });
            setSheet(true);
          }}
        />
      </View>
      <BlurIn
        key={sel} soft delay={0}
        style={{ marginTop: 12, gap: 10 }}
      >
        {examsOn(sel).map(e => {
          const c = SUBJ[colorOf(e.subjectId)];
          return (
            <MaterialView
              key={e.id}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 16,
                borderRadius: 999,
                padding: 8,
                paddingRight: 24,
                backgroundColor: c.fill,
                ...SHEEN,
              }}
            >
              <MaterialView
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 26,
                  ...INK,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Txt style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>
                  {fmtTimeShort(e.time).replace(':00', '')}
                </Txt>
              </MaterialView>
              <View style={{ flex: 1 }}>
                <Txt numberOfLines={1} style={TYPE.bodyStrong}>
                  {e.title}
                </Txt>
                <Txt style={{ fontSize: 14, color: c.text }}>
                  Exam · {fmtTime(e.time)}
                </Txt>
              </View>
            </MaterialView>
          );
        })}
        {sessOn(sel).map(x => {
          const c = SUBJ[colorOf(x.subjectId)];
          return (
            <View
              key={x.id}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 16,
                borderRadius: 999,
                padding: 8,
                paddingRight: 24,
                backgroundColor: C.surface,
                boxShadow: SHADOW.soft,
              }}
            >
              <View
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 26,
                  backgroundColor: c.deep,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Txt style={{ fontSize: 13, fontWeight: 600, color: c.text }}>
                  {code(x.subjectId)}
                </Txt>
              </View>
              <View style={{ flex: 1 }}>
                <Txt numberOfLines={1} style={TYPE.bodyStrong}>
                  {x.title}
                </Txt>
                <Txt style={{ fontSize: 14, color: C.inkMuted }}>
                  {fmtTimeShort(x.start)} – {fmtTimeShort(x.end)}
                  {x.source === 'plan' ? ' · From your plan' : ''}
                </Txt>
              </View>
            </View>
          );
        })}
        {!examsOn(sel).length && !sessOn(sel).length && (
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
              {micro.calendar.empty}
            </Txt>
          </View>
        )}
      </BlurIn>
      <BottomSheet
        open={sheet}
        onClose={() => setSheet(false)}
        title="Add a study session"
      >
        <View style={{ marginBottom: 12 }}>
          <ChoiceGroup
            label="Subject"
            options={state.subjects.map(x => ({ value: x.id, label: x.code }))}
            value={form.subjectId}
            onChange={v => setForm({ ...form, subjectId: v })}
          />
        </View>
        <ScrollView
          style={{ maxHeight: 460 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ gap: 12, paddingBottom: 16 }}
        >
          <StudyBlockPicker
            value={{ start: form.date, end: form.endDate }}
            onChange={r => setForm({ ...form, date: r.start, endDate: r.end })}
            examDates={state.exams.map(e => e.date)}
          />
          <TimeRangePicker start={form.start} end={form.end} onChange={(start, end) => setForm({ ...form, start, end })} />
          <TimeField
            label="Start time"
            value={form.start}
            onChange={start => setForm({ ...form, start })}
          />
          <TimeField
            label="End time"
            value={form.end}
            onChange={end => setForm({ ...form, end })}
          />
        </ScrollView>
        <PrimaryButton
          label="Add session"
          onPress={addSession}
          disabled={!valid}
        />
      </BottomSheet>
    </Screen>
  );
}

/* ---------- 08 Subjects ---------- */
const milestone = (p: number) =>
  micro.milestones[
    (p >= 100
      ? '100'
      : p >= 75
      ? '75'
      : p >= 50
      ? '50'
      : p >= 25
      ? '25'
      : '0') as keyof typeof micro.milestones
  ];
const size = (kb = 0) =>
  kb > 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${kb} KB`;
export function Subjects() {
  const { state } = useStore();
  if (!state.subjects.length)
    return (
      <EmptyState
        tabs
        eyebrow="Your syllabus"
        title={'Your Custom\nSyllabus'}
        body="Your subjects appear here once you add your admit card. Then add the topics you need to cover."
      />
    );
  return <SubjectsBody />;
}
function SubjectsBody() {
  const nav = useNav();
  const { state, update } = useStore();
  const [focusNote, setFocusNote] = useState(false);
  const [picked, setId] = useState(state.subjects[0].id);
  const sj = state.subjects.find(x => x.id === picked) ?? state.subjects[0];
  const id = sj.id;
  const done = sj.topics.filter(t => t.done).length;
  const pct = Math.round((done / Math.max(1, sj.topics.length)) * 100);
  const exam = state.exams.find(e => e.subjectId === id);
  const pdfs = state.materials.filter(
    m => m.subjectId === id && m.type === 'pdf',
  );
  const note = state.materials.find(
    m => m.subjectId === id && m.type === 'note',
  );
  const toggle = (tid: string) =>
    update(x => ({
      ...x,
      subjects: x.subjects.map(s =>
        s.id === id
          ? {
              ...s,
              isSample: false,
              topics: s.topics.map(t =>
                t.id === tid ? { ...t, done: !t.done } : t,
              ),
            }
          : s,
      ),
    }));
  const addPdf = () => nav.navigate('Materials', { subjectId: id });
  return (
    <Screen tabs>
      <TopBar />
      <ScreenHeader
        eyebrow={sj.isSample ? 'Sample syllabus' : 'Your syllabus'}
        title={'Your Custom\nSyllabus'}
      />
      <ChoiceGroup
        scroll
        filterIcon
        label="Subject"
        options={state.subjects.map(x => ({ value: x.id, label: x.code }))}
        value={id}
        onChange={setId}
      />
      <BlurIn
        key={id}
        ms={520} amount={40} rise={0} delay={0}
        style={{ marginTop: 12, gap: 14 }}
      >
        <HeroCard
          color={colorOf(sj.color)}
          title={sj.name}
          desc={sj.description ?? ''}
          stats={[
            {
              label: 'Topics',
              value: `${done}/${sj.topics.length}`,
              foot: 'revised',
            },
            { label: 'PDFs', value: String(pdfs.length) },
          ]}
          action={
            exam && (
              <MaterialView
                style={{
                  height: 52,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 8,
                  borderRadius: 999,
                  ...INK,
                  paddingHorizontal: 18,
                }}
              >
                <Icon name="nav-calendar" size={18} color="#fff" />
                <Txt style={{ color: '#fff', fontWeight: 600, fontSize: 15 }}>
                  {dayNum(exam.date)} {monthShort(exam.date)}
                </Txt>
              </MaterialView>
            )
          }
          footer={
            <SegmentedProgress
              total={sj.topics.length}
              done={done}
              tint
              h={8}
            />
          }
        />
        <Card>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'baseline',
            }}
          >
            <Txt accessibilityRole="header" style={TYPE.section}>
              Topics
            </Txt>
            <Txt style={{ fontSize: 15, color: C.inkMuted }}>
              {done} of {sj.topics.length} topics revised
            </Txt>
          </View>
          <Txt style={{ fontSize: 15, color: C.inkMuted, marginTop: 4 }}>
            {milestone(pct)}
          </Txt>
          <View style={{ marginTop: 8 }}>
            {sj.topics.map(t => (
              <AnimatedCheckbox
                key={t.id}
                title={t.name}
                checked={t.done}
                onToggle={() => toggle(t.id)}
              />
            ))}
          </View>
        </Card>
        <Card>
          <Txt accessibilityRole="header" style={TYPE.section}>
            Notes & PDFs
          </Txt>
          {note && (
            <View
              style={{
                marginTop: 12,
                borderRadius: 28,
                backgroundColor: C.surfaceMuted,
                padding: 16,
              }}
            >
              <Txt style={{ lineHeight: 24 }}>
                {note.isSample ? 'Sample note: ' : ''}
                {note.body ?? note.name}
              </Txt>
              <SecondaryButton label="Focus read" icon="book-open" onPress={() => setFocusNote(true)} />
            </View>
          )}
          <View style={{ marginTop: 12, gap: 8 }}>
            {pdfs.map(m => (
              <Press
                key={m.id}
                accessibilityRole="button"
                accessibilityLabel={`Open ${m.name}`}
                onPress={() => nav.navigate('Pdf', { id: m.id })}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 12,
                  borderRadius: 999,
                  backgroundColor: C.surfaceMuted,
                  padding: 8,
                  paddingRight: 20,
                }}
              >
                <View
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: 23,
                    backgroundColor: '#fff',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Icon name="file-pdf" size={20} />
                </View>
                <View style={{ flex: 1 }}>
                  <Txt numberOfLines={1} style={TYPE.bodyStrong}>
                    {m.name}
                  </Txt>
                  <Txt style={{ fontSize: 13, color: C.inkMuted }}>
                    {m.isSample ? 'Sample · ' : ''}
                    {size(m.sizeKb)}
                  </Txt>
                </View>
              </Press>
            ))}
          </View>
          <View style={{ marginTop: 12, gap: 8 }}>
            <SecondaryButton
              variant="dashed"
              icon="plus"
              label="Add a PDF"
              onPress={addPdf}
            />
            <SecondaryButton
              variant="outline"
              label="See all materials"
              onPress={() => nav.navigate('Materials', { subjectId: id })}
            />
          </View>
        </Card>
        <Txt
          style={{
            marginTop: 8,
            paddingHorizontal: 4,
            fontSize: 15,
            color: C.inkMuted,
          }}
        >
          Also in your syllabus
        </Txt>
        {state.subjects
          .filter(x => x.id !== id)
          .map(x => (
            <SubjectRow
              key={x.id}
              color={colorOf(x.color)}
              code={x.code}
              title={x.name}
              meta={`${x.topics.filter(t => t.done).length} of ${
                x.topics.length
              } topics revised`}
              onPress={() => setId(x.id)}
            />
          ))}
      </BlurIn>
    <FocusReaderSheet open={focusNote} onClose={() => setFocusNote(false)} title={note?.name ?? sj.name} lines={readingLines(note?.body ?? note?.name ?? "")} subjectId={id} />
    </Screen>
  );
}

/* ---------- 09 Questions ---------- */
export function Questions() {
  const { state, update } = useStore();
  const [f, setF] = useState('all');
  const [open, setOpen] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const list = state.questions.filter(q => f === 'all' || q.subjectId === f);
  const addQuestion = (v: Record<string, string>) => {
    const sid = f !== 'all' ? f : state.subjects[0]?.id;
    if (!v.question?.trim() || !sid) return;
    update(x => ({
      ...x,
      questions: [
        ...x.questions,
        {
          id: 'q' + Date.now(),
          subjectId: sid,
          question: v.question.trim(),
          answer: v.answer?.trim() ?? '',
          revised: false,
          isSample: false,
        },
      ],
    }));
    setAdding(false);
  };
  const revised = list.filter(q => q.revised).length;
  const msg =
    list.length && revised === list.length
      ? micro.questions.all
      : revised >= Math.min(4, Math.ceil(list.length / 2)) && revised > 0
      ? micro.questions.gte4
      : micro.questions.lt4;
  const mark = (id: string) =>
    update(x => ({
      ...x,
      questions: x.questions.map(q =>
        q.id === id ? { ...q, revised: !q.revised, isSample: false } : q,
      ),
    }));
  return (
    <Screen tabs>
      <TopBar />
      <ScreenHeader
        eyebrow="Question bank"
        title={'Important\nQuestions'}
      />
      <ChoiceGroup
        scroll
        filterIcon
        label="Filter questions"
        options={[
          { value: 'all', label: 'All' },
          ...state.subjects.map(x => ({ value: x.id as string, label: x.code })),
        ]}
        value={f}
        onChange={setF}
      />
      <MaterialView
        style={{
          marginTop: 12,
          borderRadius: 34,
          backgroundColor: SUBJ.se.fill,
          ...SHEEN,
          padding: 20,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'baseline',
          }}
        >
          <Txt style={TYPE.section}>Revised</Txt>
          <Txt style={{ fontSize: 24, fontWeight: 600 }}>
            {revised}/{list.length}
          </Txt>
        </View>
        <Txt
          style={{
            fontSize: 15,
            color: SUBJ.se.text,
            marginTop: 4,
            marginBottom: 12,
          }}
        >
          {msg}
        </Txt>
        <SegmentedProgress
          total={Math.max(1, list.length)}
          done={revised}
          tint
          h={8}
        />
      </MaterialView>
      <BlurIn key={f} soft delay={0} style={{ marginTop: 14, gap: 12 }}>
        {list.map(q => {
          const isOpen = open === q.id;
          return (
            <Animated.View
              key={q.id}
              layout={LinearTransition.duration(250)}
              style={{
                borderRadius: 30,
                backgroundColor: C.surface,
                boxShadow: SHADOW.soft,
                padding: 20,
              }}
            >
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ expanded: isOpen }}
                accessibilityLabel={q.question}
                onPress={() => setOpen(isOpen ? null : q.id)}
                style={{ flexDirection: 'row', gap: 12 }}
              >
                <View style={{ flex: 1 }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 8,
                      marginBottom: 8,
                    }}
                  >
                    <SubjectTag
                      code={
                        state.subjects.find(x => x.id === q.subjectId)?.code ??
                        ''
                      }
                      color={colorOf(q.subjectId)}
                    />
                    {q.revised && (
                      <Animated.View entering={ZoomIn.springify().stiffness(300).damping(24)}>
                        <Txt style={[TYPE.micro, { color: SUBJ.dds.text }]}>
                          ✓ Revised
                        </Txt>
                      </Animated.View>
                    )}
                  </View>
                  <Txt
                    style={{ fontSize: 18, lineHeight: 24, fontWeight: 600 }}
                  >
                    {q.question}
                  </Txt>
                </View>
                <MaterialView
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    alignItems: 'center',
                    justifyContent: 'center',
                    ...(isOpen ? INK : CLAY),
                  }}
                >
                  <Icon
                    name={isOpen ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color={isOpen ? '#fff' : C.ink}
                  />
                </MaterialView>
              </Pressable>
              {isOpen && (
                <BlurIn soft rise={0} delay={0}>
                  <View
                    style={{
                      marginTop: 16,
                      borderRadius: 28,
                      backgroundColor: C.surfaceMuted,
                      padding: 16,
                    }}
                  >
                    <Txt style={{ lineHeight: 24 }}>{q.answer}</Txt>
                  </View>
                  <Press
                    accessibilityRole="button"
                    accessibilityState={{ checked: q.revised }}
                    onPress={() => mark(q.id)}
                    style={[
                      {
                        marginTop: 12,
                        alignSelf: 'flex-start',
                        height: 48,
                        borderRadius: 999,
                        paddingHorizontal: 20,
                        justifyContent: 'center',
                      },
                      q.revised
                        ? INK
                        : { borderWidth: 1.5, borderColor: C.lineStrong },
                    ]}
                  >
                    <Txt
                      style={{
                        fontSize: 15,
                        fontWeight: 600,
                        color: q.revised ? '#fff' : C.ink,
                      }}
                    >
                      {q.revised ? '✓ Revised' : 'Mark as revised'}
                    </Txt>
                  </Press>
                </BlurIn>
              )}
            </Animated.View>
          );
        })}
        {list.length === 0 && (
          <Txt style={{ color: C.inkMuted, paddingVertical: 12, paddingHorizontal: 4 }}>
            {state.subjects.length
              ? 'No questions yet. Add the ones your teacher marked as important.'
              : 'Add your admit card first, then save important questions per subject.'}
          </Txt>
        )}
        {state.subjects.length > 0 && (
          <SecondaryButton
            variant="dashed"
            icon="plus"
            label="Add a question"
            onPress={() => setAdding(true)}
          />
        )}
      </BlurIn>
      <FormSheet
        open={adding}
        onClose={() => setAdding(false)}
        title={`Add a question${
          f !== 'all'
            ? ` · ${state.subjects.find(x => x.id === f)?.code ?? ''}`
            : ` · ${state.subjects[0]?.code ?? ''}`
        }`}
        submit="Save question"
        fields={[
          { key: 'question', label: 'Question' },
          { key: 'answer', label: 'Answer (optional)' },
        ]}
        onSubmit={addQuestion}
      />
    </Screen>
  );
}
