// One calm confetti burst (checklist done, plan ready, PDF finished). Never for streaks.
// Skia-powered via react-native-fast-confetti; <ConfettiHost /> is mounted once in App.tsx.
import { useRef } from 'react';
import { CelebrateLayer, type CelebrateHandle } from '../kit/components/Celebrate';

let host: CelebrateHandle | null = null;
type Origin = { x: number; y: number };

/** The origin argument is kept for existing callers; the burst always falls from the top. */
export function celebrate(_origin?: Origin) {
  host?.fire();
}

export function ConfettiHost() {
  const ref = useRef<CelebrateHandle | null>(null);
  return (
    <CelebrateLayer
      ref={h => {
        ref.current = h;
        host = h;
      }}
    />
  );
}
