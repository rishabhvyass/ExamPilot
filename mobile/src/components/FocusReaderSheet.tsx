import { Modal, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useReducedMotion } from 'react-native-reanimated';
import { BlurReader, READER_ICONS } from '../kit/components/BlurReader';
import { IconButton, Txt } from './ui';
import { useColors, useTypography } from '../theme';
import { useStore } from '../data/store';

export const readingLines = (text: string) =>
  text
    .split(/(?<=[.!?])\s+|\n+/)
    .map(s => s.trim())
    .filter(Boolean);

/** All focus-reading entry points use real content and save highlights as notes. */
export function FocusReaderSheet({
  open,
  onClose,
  title,
  lines,
  subjectId,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  lines: string[];
  subjectId?: string;
}) {
  const C = useColors();
  const TYPE = useTypography();
  const { state, update } = useStore();
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const reduce = useReducedMotion();
  const sid = subjectId ?? state.subjects[0]?.id ?? '';
  const saved = state.materials.filter(
    m =>
      m.type === 'note' && m.name === 'Saved highlights' && m.subjectId === sid,
  );
  const savedLines = saved.flatMap(m => readingLines(m.body ?? ''));
  const replies = state.chat
    .filter(m => m.role === 'assistant' && m.text)
    .flatMap(m => readingLines(m.text!));
  const save = (line: string) => {
    if (!sid) return;
    update(s => {
      const existing = s.materials.find(
        m =>
          m.type === 'note' &&
          m.name === 'Saved highlights' &&
          m.subjectId === sid,
      );
      if (existing && readingLines(existing.body ?? '').includes(line))
        return s;
      return {
        ...s,
        materials: existing
          ? s.materials.map(m =>
              m.id === existing.id
                ? { ...m, body: [m.body, line].filter(Boolean).join('\n') }
                : m,
            )
          : [
              ...s.materials,
              {
                id: `highlight-${Date.now()}`,
                subjectId: sid,
                name: 'Saved highlights',
                type: 'note',
                body: line,
                isSample: false,
              },
            ],
      };
    });
  };
  return (
    <Modal
      visible={open}
      animationType={reduce ? 'none' : 'slide'}
      onRequestClose={onClose}
      presentationStyle="fullScreen"
    >
      <View
        style={{
          flex: 1,
          backgroundColor: C.ground,
          paddingHorizontal: 20,
          paddingTop: insets.top + 12,
          paddingBottom: insets.bottom + 12,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
            marginBottom: 20,
          }}
        >
          <View style={{ flex: 1 }}>
            <Txt numberOfLines={1} style={{ color: C.inkMuted, fontSize: 14 }}>
              {title}
            </Txt>
            <Txt accessibilityRole="header" style={TYPE.section}>
              Focus read
            </Txt>
          </View>
          <IconButton
            icon="close"
            label="Close focus read"
            size={48}
            onPress={onClose}
          />
        </View>
        {open && (
          <BlurReader
            height={Math.max(280, height - insets.top - insets.bottom - 145)}
            onHighlight={save}
            modes={[
              {
                id: 'notes',
                label: 'Notes',
                iconPath: READER_ICONS.notes,
                lines,
              },
              {
                id: 'ask',
                label: 'Ask Pilo replies',
                iconPath: READER_ICONS.ask,
                lines: replies,
              },
              {
                id: 'saved',
                label: 'Saved highlights',
                iconPath: READER_ICONS.saved,
                lines: savedLines,
              },
            ]}
          />
        )}
        <Txt
          style={{
            textAlign: 'center',
            color: C.inkSubtle,
            fontSize: 13,
            marginTop: 14,
          }}
        >
          Tap a line to focus. Hold to pause. Pen saves a highlight.
        </Txt>
      </View>
    </Modal>
  );
}
