import { useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';
import { BottomSheet, Field, PrimaryButton, Txt } from './ui';
import { C, INK, TYPE } from '../theme';
import {
  fmtLong,
  fmtTime,
  monthName,
  parseISO,
  todayISO,
  toISO,
} from '../lib/dates';

const DOW = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const pad = (n: number) => String(n).padStart(2, '0');

function Row({
  label,
  value,
  open,
  onPress,
}: {
  label: string;
  value: string;
  open: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${label}, ${value}`}
      onPress={onPress}
      style={{
        height: 64,
        borderRadius: 20,
        paddingHorizontal: 20,
        backgroundColor: C.input,
        borderWidth: open ? 2 : 0,
        borderColor: C.ink,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <View>
        <Txt style={{ fontSize: 13, color: C.inkMuted }}>{label}</Txt>
        <Txt style={TYPE.bodyStrong}>{value}</Txt>
      </View>
      <Txt style={{ fontSize: 20, color: C.inkMuted }}>{open ? '⌃' : '⌄'}</Txt>
    </Pressable>
  );
}

function Calendar({
  value,
  onChange,
}: {
  value: string;
  onChange: (iso: string) => void;
}) {
  const sel = parseISO(value);
  const [view, setView] = useState({ y: sel.getFullYear(), m: sel.getMonth() });
  const first = new Date(view.y, view.m, 1).getDay();
  const days = new Date(view.y, view.m + 1, 0).getDate();
  const cells = [
    ...Array<null>(first).fill(null),
    ...Array.from({ length: days }, (_, i) => i + 1),
  ];
  const go = (d: number) =>
    setView(v => {
      const n = new Date(v.y, v.m + d, 1);
      return { y: n.getFullYear(), m: n.getMonth() };
    });
  const today = todayISO();
  return (
    <View style={{ paddingVertical: 8 }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 8,
        }}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Previous month"
          onPress={() => go(-1)}
          style={{ width: 44, height: 44, justifyContent: 'center' }}
        >
          <Txt style={{ fontSize: 22 }}>‹</Txt>
        </Pressable>
        <Txt style={TYPE.bodyStrong}>
          {monthName(view.m)} {view.y}
        </Txt>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Next month"
          onPress={() => go(1)}
          style={{
            width: 44,
            height: 44,
            justifyContent: 'center',
            alignItems: 'flex-end',
          }}
        >
          <Txt style={{ fontSize: 22 }}>›</Txt>
        </Pressable>
      </View>
      <View style={{ flexDirection: 'row' }}>
        {DOW.map((d, i) => (
          <Txt
            key={i}
            style={{
              flex: 1,
              textAlign: 'center',
              fontSize: 12,
              color: C.inkSubtle,
            }}
          >
            {d}
          </Txt>
        ))}
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        {cells.map((d, i) => {
          if (d === null) return <View key={i} style={{ width: '14.285%' }} />;
          const iso = toISO(new Date(view.y, view.m, d));
          const on = iso === value;
          return (
            <Pressable
              key={i}
              accessibilityRole="button"
              accessibilityState={{ selected: on }}
              accessibilityLabel={fmtLong(iso)}
              onPress={() => onChange(iso)}
              style={{
                width: '14.285%',
                height: 44,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  alignItems: 'center',
                  justifyContent: 'center',
                  ...(on ? INK : {}),
                  borderWidth: !on && iso === today ? 1.5 : 0,
                  borderColor: C.lineStrong,
                }}
              >
                <Txt
                  style={{
                    fontSize: 15,
                    fontWeight: on ? 600 : 400,
                    color: on ? '#fff' : C.ink,
                  }}
                >
                  {d}
                </Txt>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function Chip({
  label,
  on,
  onPress,
}: {
  label: string;
  on: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: on }}
      onPress={onPress}
      style={{
        height: 44,
        minWidth: 56,
        paddingHorizontal: 14,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        ...(on ? INK : { backgroundColor: C.input }),
      }}
    >
      <Txt
        style={{ fontSize: 15, fontWeight: 600, color: on ? '#fff' : C.ink }}
      >
        {label}
      </Txt>
    </Pressable>
  );
}

function TimePicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (t: string) => void;
}) {
  const [h24, m] = value.split(':').map(Number);
  const pm = h24 >= 12;
  const h12 = ((h24 + 11) % 12) + 1;
  const set = (h: number, min: number, isPm: boolean) =>
    onChange(`${pad((h % 12) + (isPm ? 12 : 0))}:${pad(min)}`);
  return (
    <View style={{ paddingVertical: 8, gap: 12 }}>
      <Txt style={{ fontSize: 13, color: C.inkMuted }}>Hour</Txt>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {Array.from({ length: 12 }, (_, i) => i + 1).map(h => (
          <Chip
            key={h}
            label={String(h)}
            on={h === h12}
            onPress={() => set(h, m, pm)}
          />
        ))}
      </View>
      <Txt style={{ fontSize: 13, color: C.inkMuted }}>Minutes</Txt>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        {[0, 15, 30, 45].map(min => (
          <Chip
            key={min}
            label={pad(min)}
            on={min === m}
            onPress={() => set(h12, min, pm)}
          />
        ))}
      </View>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <Chip label="AM" on={!pm} onPress={() => set(h12, m, false)} />
        <Chip label="PM" on={pm} onPress={() => set(h12, m, true)} />
      </View>
    </View>
  );
}

export type ExamDraft = { title: string; date: string; time: string };

/** One sheet for adding or editing an exam: subject text plus tap-to-pick date and time. */
export function ExamSheet({
  open,
  onClose,
  heading,
  submit,
  initial,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  heading: string;
  submit: string;
  initial: ExamDraft;
  onSubmit: (v: ExamDraft) => void;
}) {
  const [v, setV] = useState(initial);
  const [pane, setPane] = useState<'date' | 'time' | null>(null);
  useEffect(() => {
    if (open) {
      setV(initial);
      setPane(null);
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps
  const toggle = (p: 'date' | 'time') => setPane(pane === p ? null : p);
  return (
    <BottomSheet open={open} onClose={onClose} title={heading}>
      <View style={{ gap: 10, marginBottom: 16 }}>
        <Field
          label="Subject"
          placeholder="Subject name"
          value={v.title}
          onChangeText={title => setV({ ...v, title })}
        />
        <Row
          label="Date"
          value={fmtLong(v.date)}
          open={pane === 'date'}
          onPress={() => toggle('date')}
        />
        {pane === 'date' && (
          <Calendar value={v.date} onChange={date => setV({ ...v, date })} />
        )}
        <Row
          label="Start time"
          value={fmtTime(v.time)}
          open={pane === 'time'}
          onPress={() => toggle('time')}
        />
        {pane === 'time' && (
          <TimePicker value={v.time} onChange={time => setV({ ...v, time })} />
        )}
      </View>
      <PrimaryButton label={submit} onPress={() => onSubmit(v)} />
    </BottomSheet>
  );
}
