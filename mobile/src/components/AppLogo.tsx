// The ExamPilot app icon ("Pilo" the cloud), used wherever the app shows its own logo.
import { Image, View } from 'react-native';

const ICON = require('../assets/pilo-icon.png');

export function AppLogo({
  size = 52,
  round = false,
}: {
  size?: number;
  /** Circle instead of the iOS-style rounded square (avatars). */
  round?: boolean;
}) {
  const radius = round ? size / 2 : size * 0.225;
  return (
    <View
      accessibilityRole="image"
      accessibilityLabel="ExamPilot"
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        boxShadow: `0px ${Math.round(size / 10)}px ${Math.round(
          size / 4,
        )}px rgba(59,120,231,0.28)`,
      }}
    >
      <Image
        source={ICON}
        style={{ width: size, height: size, borderRadius: radius }}
      />
    </View>
  );
}
