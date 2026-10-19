import { MaterialView } from './surface';
import { useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';
import { BottomSheet, Field, PrimaryButton, Txt } from './ui';
import { ChoiceGroup } from './choicegroup';
import { useColors, useTypography, INK } from '../theme';
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

export function Row({
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
  const C = useColors();
  const TYPE = useTypography();
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
  const C = useColors();
  const TYPE = useTypography();
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
              <MaterialView
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
              </MaterialView>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export function TimePicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (t: string) => void;
}) {
  const C = useColors();
  const [h24, m] = value.split(':').map(Number);
  const pm = h24 >= 12;
  const h12 = ((h24 + 11) % 12) + 1;
  const set = (h: number, min: number, isPm: boolean) =>
    onChange(`${pad((h % 12) + (isPm ? 12 : 0))}:${pad(min)}`);
  return (
    <View style={{ paddingVertical: 8, gap: 12 }}>
      <Txt style={{ fontSize: 13, color: C.inkMuted }}>Hour</Txt>
      <ChoiceGroup
        wrap
        size="small"
        outline={false}
        label="Hour"
        options={Array.from({ length: 12 }, (_, i) => ({
          value: i + 1,
          label: String(i + 1),
        }))}
        value={h12}
        onChange={h => set(h, m, pm)}
      />
      <Txt style={{ fontSize: 13, color: C.inkMuted }}>Minutes</Txt>
      <ChoiceGroup
        size="small"
        outline={false}
        label="Minutes"
        options={[0, 15, 30, 45].map(min => ({ value: min, label: pad(min) }))}
        value={[0, 15, 30, 45].includes(m) ? m : null}
        onChange={min => set(h12, min, pm)}
      />
      <ChoiceGroup
        size="small"
        outline={false}
        label="AM or PM"
        options={[
          { value: 'AM', label: 'AM' },
          { value: 'PM', label: 'PM' },
        ]}
        value={pm ? 'PM' : 'AM'}
        onChange={v => set(h12, m, v === 'PM')}
      />
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

/** A tappable row that expands into the time picker. */
export function TimeField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (t: string) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <View style={{ gap: 6 }}>
      <Row
        label={label}
        value={fmtTime(value)}
        open={open}
        onPress={() => setOpen(!open)}
      />
      {open && <TimePicker value={value} onChange={onChange} />}
    </View>
  );
}
