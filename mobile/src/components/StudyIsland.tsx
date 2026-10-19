import { useEffect, useState } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { GooeyIsland } from '../kit/components/GooeyIsland';
import { Icon } from './ui';
import { useColors } from '../theme';

export function StudyIsland({
  exam,
  days,
  complete,
}: {
  exam?: string;
  days: number;
  complete: boolean;
}) {
  const C = useColors();
  const focused = useIsFocused();
  const [remaining, setRemaining] = useState(25 * 60);
  const [deadline, setDeadline] = useState<number | null>(null);
  useEffect(() => {
    if (!deadline || !focused) return;
    const tick = () => {
      const left = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
      setRemaining(left);
      if (!left) setDeadline(null);
    };
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [deadline, focused]);
  const toggle = () => {
    if (deadline) {
      setRemaining(Math.max(0, Math.ceil((deadline - Date.now()) / 1000)));
      setDeadline(null);
    } else {
      const seconds = remaining || 25 * 60;
      setRemaining(seconds);
      setDeadline(Date.now() + seconds * 1000);
    }
  };
  const time = `${Math.floor(remaining / 60)}:${String(remaining % 60).padStart(
    2,
    '0',
  )}`;
  const text = deadline
    ? `${time} focus · tap to pause`
    : remaining < 1500 && remaining > 0
    ? `${time} paused · tap to resume`
    : complete
    ? 'All done ✓ · take a calm moment'
    : remaining === 0
    ? 'Focus complete · tap to start again'
    : exam
    ? `${exam} ${days === 0 ? 'today' : `in ${days} days`} · tap to focus`
    : 'Focus for 25 minutes';
  return (
    <GooeyIsland
      state={{
        kind: 'message',
        text,
        icon: (
          <Icon
            name={deadline ? 'clock' : 'sparkle'}
            color={C.surface}
            size={18}
          />
        ),
      }}
      onPress={toggle}
    />
  );
}
