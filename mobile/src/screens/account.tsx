import { useMemo, useState } from 'react';
import { Alert, Pressable, View } from 'react-native';
import { useStore } from '../data/store';
import { useNav } from '../navigation';
import { useAppearance, type ThemeMode } from '../appearance';
import { useSubjectColors, useColors, useTypography } from '../theme';
import {
  Field,
  Icon,
  PrimaryButton,
  Screen,
  ScreenHeader,
  TopBar,
  Txt,
} from '../components/ui';
import { Surface } from '../components/surface';

export function ProfileScreen() {
  const SUBJ = useSubjectColors();
  const C = useColors();
  const TYPE = useTypography();
  const { state, update, user } = useStore();
  const { mode, setMode } = useAppearance();
  const [draft, setDraft] = useState(state.profile);
  const [saved, setSaved] = useState(false);
  const edit = (
    key: 'firstName' | 'surname' | 'college' | 'email',
    value: string,
  ) => {
    setSaved(false);
    setDraft(p => ({ ...p, [key]: value }));
  };
  const save = () => {
    if (!draft.firstName.trim())
      return Alert.alert('Add your first name', 'This is how we’ll greet you.');
    update(s => ({
      ...s,
      profile: {
        ...draft,
        firstName: draft.firstName.trim(),
        surname: draft.surname.trim(),
        college: draft.college?.trim() ?? '',
        email: user?.email ?? draft.email.trim(),
      },
    }));
    setSaved(true);
  };
  return (
    <Screen>
      <TopBar back more={false} />
      <ScreenHeader eyebrow="Your space" title="Profile" />
      <View style={{ alignItems: 'center', marginBottom: 28, gap: 10 }}>
        <View
          style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: SUBJ.se.fill,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Txt style={{ fontSize: 32, fontWeight: 600, color: SUBJ.se.text }}>
            {(draft.firstName || 'P')[0].toUpperCase()}
          </Txt>
        </View>
        <Txt style={TYPE.section}>
          {[state.profile.firstName, state.profile.surname]
            .filter(Boolean)
            .join(' ') || 'Your profile'}
        </Txt>
        <Txt style={{ color: C.inkMuted }}>
          {user?.email || state.profile.email || 'Local profile'}
        </Txt>
      </View>
      <View style={{ gap: 12 }}>
        <Field
          label="First name"
          value={draft.firstName}
          onChangeText={v => edit('firstName', v)}
        />
        <Field
          label="Last name"
          value={draft.surname}
          onChangeText={v => edit('surname', v)}
        />
        {!user && (
          <Field
            label="Email (optional)"
            keyboardType="email-address"
            value={draft.email}
            onChangeText={v => edit('email', v)}
          />
        )}
        <Field
          label="College"
          value={draft.college ?? ''}
          onChangeText={v => edit('college', v)}
        />
        <Field
          label="Semester"
          value={draft.semester?.toString() ?? ''}
          keyboardType="number-pad"
          onChangeText={v => {
            setSaved(false);
            const n = Number(v.replace(/\D/g, ''));
            setDraft(p => ({ ...p, semester: Math.min(20, Math.max(0, n)) }));
          }}
        />
        <PrimaryButton
          label={saved ? 'Changes saved' : 'Save profile'}
          onPress={save}
        />
        {saved && (
          <Txt
            accessibilityLiveRegion="polite"
            style={{ color: C.inkMuted, textAlign: 'center' }}
          >
            Your profile has been updated.
          </Txt>
        )}
      </View>
      <Txt style={[TYPE.section, { marginTop: 32, marginBottom: 8 }]}>
        Appearance
      </Txt>
      <Txt style={{ color: C.inkMuted, marginBottom: 16 }}>
        Choose your look, or follow your device.
      </Txt>
      <View
        accessibilityRole="radiogroup"
        style={{ flexDirection: 'row', gap: 8 }}
      >
        {(['light', 'dark', 'system'] as ThemeMode[]).map(option => (
          <Pressable
            key={option}
            accessibilityRole="radio"
            accessibilityState={{ checked: mode === option }}
            onPress={() => setMode(option)}
            style={{ flex: 1 }}
          >
            <Surface
              kind={mode === option ? 'recess' : 'clay'}
              radius={20}
              style={{ paddingVertical: 18, alignItems: 'center', gap: 8 }}
            >
              <Txt style={{ fontWeight: 600, color: C.ink }}>
                {option[0].toUpperCase() + option.slice(1)}
              </Txt>
              <View
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: 4,
                  backgroundColor: mode === option ? C.ink : 'transparent',
                }}
              />
            </Surface>
          </Pressable>
        ))}
      </View>
      <Txt style={{ color: C.inkSubtle, marginTop: 24, lineHeight: 22 }}>
        Your exam countdown appears in Live Activities on supported iPhones. You
        can manage Live Activities in iOS Settings.
      </Txt>
    </Screen>
  );
}

type Result = { key: string; label: string; detail: string; open: () => void };
export function SearchScreen() {
  const C = useColors();
  const TYPE = useTypography();
  const { state } = useStore();
  const nav = useNav();
  const [query, setQuery] = useState('');
  const results = useMemo(() => {
    const q = query.trim().toLocaleLowerCase();
    if (!q) return [];
    const matches = (...values: (string | undefined)[]) =>
      values.some(v => v?.toLocaleLowerCase().includes(q));
    const found: Result[] = [];
    state.subjects
      .filter(s => matches(s.name, s.code, ...s.topics.map(t => t.name)))
      .forEach(s =>
        found.push({
          key: `s-${s.id}`,
          label: s.name,
          detail: `${s.code} · Subject & materials`,
          open: () => nav.navigate('Materials', { subjectId: s.id }),
        }),
      );
    state.materials
      .filter(m => matches(m.name, m.body))
      .forEach(m =>
        found.push({
          key: `m-${m.id}`,
          label: m.name,
          detail:
            m.type === 'pdf' ? 'PDF document' : `${m.type} · Study material`,
          open: () =>
            m.type === 'pdf'
              ? nav.navigate('Pdf', { id: m.id })
              : nav.navigate('Materials', { subjectId: m.subjectId }),
        }),
      );
    state.exams
      .filter(e => matches(e.title, e.date))
      .forEach(e =>
        found.push({
          key: `e-${e.id}`,
          label: e.title,
          detail: `Exam · ${e.date}`,
          open: () => nav.navigate('Main', { screen: 'Calendar' }),
        }),
      );
    state.questions
      .filter(qn => matches(qn.question, qn.answer))
      .forEach(qn =>
        found.push({
          key: `q-${qn.id}`,
          label: qn.question,
          detail: 'Revision question',
          open: () => nav.navigate('Main', { screen: 'Questions' }),
        }),
      );
    return found.slice(0, 50);
  }, [query, state, nav]);
  return (
    <Screen>
      <TopBar back more={false} search={false} />
      <ScreenHeader eyebrow="Find what you need" title="Search" />
      <Field
        label="Search your studies"
        value={query}
        onChangeText={setQuery}
        placeholder="Subjects, notes, exams, questions…"
        autoCapitalize="none"
      />
      <Txt
        accessibilityLiveRegion="polite"
        style={{ color: C.inkMuted, marginVertical: 20 }}
      >
        {query.trim()
          ? `${results.length}${results.length === 50 ? '+' : ''} results`
          : 'Everything you’ve added, in one place.'}
      </Txt>
      <View style={{ gap: 12 }}>
        {results.map(result => (
          <Pressable
            key={result.key}
            accessibilityRole="button"
            onPress={result.open}
          >
            <Surface
              kind="glass"
              radius={24}
              style={{
                padding: 20,
                flexDirection: 'row',
                gap: 12,
                alignItems: 'center',
              }}
            >
              <View style={{ flex: 1 }}>
                <Txt numberOfLines={2} style={{ fontWeight: 600 }}>
                  {result.label}
                </Txt>
                <Txt style={{ fontSize: 13, color: C.inkMuted, marginTop: 6 }}>
                  {result.detail}
                </Txt>
              </View>
              <Icon name="chevron-right" />
            </Surface>
          </Pressable>
        ))}
        {!!query.trim() && !results.length && (
          <View style={{ paddingVertical: 32, gap: 8 }}>
            <Txt style={TYPE.section}>No matches yet</Txt>
            <Txt style={{ color: C.inkMuted }}>
              Try a subject code, a topic, or part of a document name.
            </Txt>
          </View>
        )}
      </View>
    </Screen>
  );
}
