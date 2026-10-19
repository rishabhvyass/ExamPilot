import { MaterialView } from './surface';
// Study-block picker: tap a start day, tap an end day, and a band joins them. Presets fill it in one tap.
import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { useSubjectColors, useColors, INK } from '../theme';
import { Txt } from './ui';
import { ChoiceGroup } from './choicegroup';
import {
  addDays,
  daysBetween,
  monthName,
  parseISO,
  toISO,
  todayISO,
  weekday,
} from '../lib/dates';

const DOW = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const label = (iso: string) => `${monthName(parseISO(iso).getMonth()).slice(0, 3)} ${parseISO(iso).getDate()}`;

export type Range = { start: string; end: string };

export function StudyBlockPicker({
  value,
  onChange,
  examDates = [],
}: {
  value: Range;
  onChange: (r: Range) => void;
  /** Dates to mark with a dot; the "Until exam" preset runs to the first one after the start. */
  examDates?: string[];
}) {
  const SUBJ = useSubjectColors();
  const C = useColors();
  const s0 = parseISO(value.start);
  const [view, setView] = useState({ y: s0.getFullYear(), m: s0.getMonth() });
  // Which end the next tap sets: after choosing a start, the next tap picks the end.
  const [picking, setPicking] = useState<'start' | 'end'>('start');
  const lead = (new Date(view.y, view.m, 1).getDay() + 6) % 7;
  const days = new Date(view.y, view.m + 1, 0).getDate();
  const cells = [
    ...Array<null>(lead).fill(null),
    ...Array.from({ length: days }, (_, i) => i + 1),
  ];
  const shift = (k: number) =>
    setView(v => {
      const d = new Date(v.y, v.m + k, 1);
      return { y: d.getFullYear(), m: d.getMonth() };
    });
  const tap = (iso: string) => {
    if (picking === 'start' || iso < value.start) {
      onChange({ start: iso, end: iso });
      setPicking('end');
    } else {
      onChange({ start: value.start, end: iso });
      setPicking('start');
    }
  };
  const n = daysBetween(value.start, value.end) + 1;
  const today = todayISO();
  const preset = (r: Range) => {
    onChange(r);
    setPicking('start');
    const d = parseISO(r.start);
    setView({ y: d.getFullYear(), m: d.getMonth() });
  };
  const nextSat = () => {
    const d = parseISO(today);
    return addDays(today, (6 - d.getDay() + 7) % 7);
  };
  const untilExam = () => {
    const e = examDates.filter(x => x >= value.start).sort()[0];
    return { start: value.start, end: e ?? addDays(value.start, 6) };
  };
  const presets: [string, () => Range][] = [
    ['Weekend', () => ({ start: nextSat(), end: addDays(nextSat(), 1) })],
    ['3 days', () => ({ start: value.start, end: addDays(value.start, 2) })],
    ['1 week', () => ({ start: value.start, end: addDays(value.start, 6) })],
    ['Until exam', untilExam],
  ];
  const isPreset = (get: () => Range) => {
    const r = get();
    return r.start === value.start && r.end === value.end;
  };
  return (
    <View style={{ gap: 12 }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <View style={{ flexDirection: 'row', gap: 24 }}>
          {(['start', 'end'] as const).map(k => (
            <Pressable
              key={k}
              accessibilityRole="button"
              onPress={() => setPicking(k)}
              style={{ paddingBottom: 4 }}
            >
              <Txt style={{ fontSize: 12, fontWeight: 600, color: C.inkMuted }}>
                {k.toUpperCase()}
              </Txt>
              <Txt style={{ fontSize: 20, fontWeight: 600 }}>
                {label(value[k])}
              </Txt>
              <View
                style={{
                  height: 3,
                  marginTop: 2,
                  borderRadius: 2,
                  backgroundColor: picking === k ? '#2563EB' : 'transparent',
                }}
              />
            </Pressable>
          ))}
        </View>
        <View
          style={{
            backgroundColor: SUBJ.se.fill,
            borderRadius: 999,
            paddingHorizontal: 14,
            paddingVertical: 8,
          }}
        >
          <Txt style={{ fontWeight: 600, color: SUBJ.se.text }}>
            {n} {n === 1 ? 'day' : 'days'}
          </Txt>
        </View>
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Previous month"
          onPress={() => shift(-1)}
          style={{ width: 44, height: 44, justifyContent: 'center' }}
        >
          <Txt style={{ fontSize: 22 }}>‹</Txt>
        </Pressable>
        <Txt style={{ fontSize: 17, fontWeight: 600 }}>
          {monthName(view.m)} {view.y}
        </Txt>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Next month"
          onPress={() => shift(1)}
          style={{ width: 44, height: 44, alignItems: 'flex-end', justifyContent: 'center' }}
        >
          <Txt style={{ fontSize: 22 }}>›</Txt>
        </Pressable>
      </View>
      <View style={{ flexDirection: 'row' }}>
        {DOW.map((d, i) => (
          <Txt
            key={i}
            style={{ flex: 1, textAlign: 'center', fontSize: 12, color: C.inkSubtle }}
          >
            {d}
          </Txt>
        ))}
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        {cells.map((d, i) => {
          if (d === null) return <View key={i} style={{ width: '14.285%' }} />;
          const iso = toISO(new Date(view.y, view.m, d));
          const isStart = iso === value.start;
          const isEnd = iso === value.end;
          const inBand = iso >= value.start && iso <= value.end;
          const edge = isStart || isEnd;
          const col = i % 7;
          return (
            <Pressable
              key={i}
              accessibilityRole="button"
              accessibilityState={{ selected: inBand }}
              accessibilityLabel={`${weekday(iso)} ${label(iso)}`}
              onPress={() => tap(iso)}
              style={{ width: '14.285%', height: 44, justifyContent: 'center' }}
            >
              {inBand && (
                <View
                  style={{
                    position: 'absolute',
                    top: 3,
                    bottom: 3,
                    left: isStart || col === 0 ? 3 : 0,
                    right: isEnd || col === 6 ? 3 : 0,
                    backgroundColor: SUBJ.se.fill,
                    borderTopLeftRadius: isStart || col === 0 ? 20 : 0,
                    borderBottomLeftRadius: isStart || col === 0 ? 20 : 0,
                    borderTopRightRadius: isEnd || col === 6 ? 20 : 0,
                    borderBottomRightRadius: isEnd || col === 6 ? 20 : 0,
                  }}
                />
              )}
              <MaterialView
                style={[
                  {
                    alignSelf: 'center',
                    width: 38,
                    height: 38,
                    borderRadius: 19,
                    alignItems: 'center',
                    justifyContent: 'center',
                  },
                  isEnd ? INK : null,
                ]}
              >
                <Txt
                  style={{
                    fontSize: 15,
                    fontWeight: edge ? 600 : 400,
                    color: isEnd ? '#fff' : inBand ? SUBJ.se.text : C.ink,
                  }}
                >
                  {d}
                </Txt>
                {examDates.includes(iso) && !isEnd && (
                  <View
                    style={{
                      position: 'absolute',
                      bottom: 2,
                      width: 5,
                      height: 5,
                      borderRadius: 3,
                      backgroundColor: '#7C3AED',
                    }}
                  />
                )}
              </MaterialView>
            </Pressable>
          );
        })}
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
        <ChoiceGroup
          wrap
          size="small"
          label="Presets"
          options={presets.map(([l]) => ({ value: l, label: l }))}
          value={presets.find(([, get]) => isPreset(get))?.[0] ?? null}
          onChange={l => preset(presets.find(([x]) => x === l)![1]())}
        />
        <Pressable
          accessibilityRole="button"
          onPress={() => preset({ start: today, end: today })}
          style={{ paddingHorizontal: 8, height: 44, justifyContent: 'center' }}
        >
          <Txt style={{ fontWeight: 600, color: C.inkMuted }}>Clear</Txt>
        </Pressable>
      </View>
    </View>
  );
}
