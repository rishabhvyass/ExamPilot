// ExamPilot "Clear Glass" — design tokens for React Native (Expo SDK 58 / RN 0.88, New Architecture).
// Every value here is copied from the v1 · Clear Glass design. Components import ONLY from this file;
// never type a new hex value in a screen.
//
// Shadows use the `boxShadow` style prop (RN ≥ 0.76, New Architecture) which supports `inset`
// shadows on iOS and Android — that is what makes the clay / recess look work 1:1 with the design.
// Gradients use expo-linear-gradient (works on every RN version) via <Surface/>.
import { Platform, type TextStyle } from "react-native";

/* ─────────────── Colour ─────────────── */
export const color = {
  ground: "#FFFFFF", // page background — ALWAYS white
  input: "#F4F6FA",
  surfaceMuted: "#F6F7F9",
  skeleton: "#EEF0F4",
  line: "#E8EBF0",
  line2: "#E2E6EC",
  lineStrong: "#CBD2DC",
  checkRing: "#C2C9D4",
  ink: "#1B1B1F",
  inkButton: "#111113",
  inkMuted: "#5B6475",
  inkSubtle: "#6B7385",
  placeholder: "#8A92A3",
  strike: "#A0A8B8",
  inkFlat: "#151517", // thin progress fills (≤ 8px tall)
  white: "#FFFFFF",
  // decorative art
  artBlue: "#3B82F6",
  artViolet: "#DDD0FF",
  artGreen: "#BBF0D3",
  artPink: "#F9A8D4",
  highlighter: "#E3EEFF",
  // status
  infoBg: "#E3EEF8", infoText: "#2C5577",
  successBg: "#D9F5E6", successText: "#065F46",
  warnBg: "#FEF3C7", warnText: "#92400E",
  errorBg: "#FEE2E2", errorText: "#B91C1C", // real errors ONLY
  scrim: "rgba(27,27,31,0.32)",
  // reader
  readerNear: "#6E6E74",
  readerFar: "#A6A6AC",
} as const;

export type SubjectId = "SE" | "DAA" | "DDS";
export const subject: Record<SubjectId, { name: string; fill: string; deep: string; text: string; textMuted: string; mark: string; divider: string }> = {
  SE: { name: "Software Engineering", fill: "#DCEBFF", deep: "#BFD6FF", text: "#1E3A8A", textMuted: "#1E40AF", mark: "#2563EB", divider: "rgba(30,58,138,0.18)" },
  DAA: { name: "Design and Analysis of Algorithm", fill: "#EDE5FF", deep: "#CDBBFF", text: "#5B21B6", textMuted: "#5B21B6", mark: "#7C3AED", divider: "rgba(91,33,182,0.18)" },
  DDS: { name: "Design of Data Structures", fill: "#D9F5E6", deep: "#9EE6C0", text: "#065F46", textMuted: "#065F46", mark: "#10B981", divider: "rgba(6,95,70,0.18)" },
};

/* ─────────────── Surfaces ───────────────
   Each surface = gradient colours (top → bottom) + boxShadow string.
   Render with <Surface kind="clay"> (native/components/Surface.tsx). */
export const surface = {
  clay: {
    colors: ["#FFFFFF", "#F1F1F2", "#E9E9EB"] as const,
    locations: [0, 0.6, 1] as const,
    boxShadow:
      "inset 0px 1px 0px #FFFFFF, inset 0px -2px 5px rgba(0,0,0,0.035), 0px 0px 0px 1px rgba(0,0,0,0.045), 0px 1px 2px rgba(0,0,0,0.06), 0px 10px 24px rgba(0,0,0,0.07)",
  },
  recess: {
    colors: ["#DEDEE1", "#E9E9EB"] as const,
    locations: [0, 1] as const,
    boxShadow: "inset 0px 2px 6px rgba(0,0,0,0.13), inset 0px -1px 0px rgba(255,255,255,0.9)",
  },
  dock: {
    colors: ["#FFFFFF", "#F0F0F2"] as const,
    locations: [0, 1] as const,
    boxShadow: "inset 0px 1px 0px #FFFFFF, 0px 0px 0px 1px rgba(0,0,0,0.05), 0px 2px 4px rgba(0,0,0,0.05), 0px 16px 34px rgba(0,0,0,0.10)",
  },
  ink: {
    colors: ["#4A4A4F", "#1C1C1F", "#0E0E10"] as const,
    locations: [0, 0.55, 1] as const,
    boxShadow: "inset 0px 1px 0px rgba(255,255,255,0.22), inset 0px -1px 0px rgba(0,0,0,0.4), 0px 1px 2px rgba(0,0,0,0.25), 0px 8px 18px rgba(0,0,0,0.18)",
  },
  glass: {
    // drawn on top of a BlurView (intensity 40, tint "light"); diagonal 160°
    colors: ["rgba(255,255,255,0.78)", "rgba(248,250,253,0.55)"] as const,
    locations: [0, 1] as const,
    boxShadow: "inset 0px 1px 0px #FFFFFF, inset 0px 0px 0px 1px rgba(15,23,42,0.07), 0px 14px 36px rgba(15,23,42,0.07)",
    blurIntensity: 40, // ≈ CSS blur(22px) saturate(1.6)
  },
  sheen: {
    // white sheen drawn over the subject fill, 160°, fades out at 55%
    colors: ["rgba(255,255,255,0.6)", "rgba(255,255,255,0)"] as const,
    locations: [0, 0.55] as const,
    boxShadow: "inset 0px 1px 0px rgba(255,255,255,0.9), inset 0px 0px 0px 1px rgba(255,255,255,0.6), 0px 12px 30px rgba(15,23,42,0.06)",
  },
  blurReaderCard: {
    colors: ["#FFFFFF", "#F7F7F8"] as const,
    locations: [0, 1] as const,
    boxShadow: "inset 0px 1px 0px #FFFFFF, 0px 0px 0px 1px rgba(0,0,0,0.045), 0px 2px 6px rgba(0,0,0,0.04), 0px 24px 50px rgba(0,0,0,0.08)",
  },
} as const;
export type SurfaceKind = keyof typeof surface;

/** CSS 160° ≈ this start/end pair for expo-linear-gradient. 180° = top→bottom. */
export const angle160 = { start: { x: 0.33, y: 0 }, end: { x: 0.67, y: 1 } } as const;
export const angle180 = { start: { x: 0.5, y: 0 }, end: { x: 0.5, y: 1 } } as const;

/** Old-architecture fallback (no inset shadows): roughly the outer shadow only. */
export const legacyShadow = Platform.select({
  ios: { shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 12, shadowOffset: { width: 0, height: 8 } },
  android: { elevation: 4 },
  default: {},
});

/* ─────────────── Type — Urbanist (one font file per weight) ─────────────── */
// npx expo install expo-font @expo-google-fonts/urbanist
// On Android a custom font ignores `fontWeight`, so pick the family by weight.
export const fontFamily = {
  400: "Urbanist_400Regular",
  500: "Urbanist_500Medium",
  600: "Urbanist_600SemiBold",
  700: "Urbanist_700Bold",
} as const;
export type Weight = keyof typeof fontFamily;
const t = (size: number, lineHeight: number, weight: Weight, letterSpacingEm = 0): TextStyle => ({
  fontFamily: fontFamily[weight],
  fontSize: size,
  lineHeight: Math.round(size * lineHeight),
  letterSpacing: +(size * letterSpacingEm).toFixed(2),
  color: color.ink,
});
export const type = {
  splash: t(60, 1.0, 600, -0.04),
  display: t(46, 1.02, 600, -0.03),
  onboarding: t(40, 1.05, 600, -0.03),
  stat: t(54, 1.0, 600, -0.03),
  statSmall: t(40, 1.0, 600, -0.03),
  cardTitle: t(28, 1.1, 600, -0.02),
  section: t(24, 1.2, 600, -0.02),
  eyebrow: { ...t(20, 1.3, 500), color: color.inkMuted },
  button: { ...t(18, 1.2, 600), color: color.inkButton },
  bodyLarge: t(17, 1.5, 500),
  body: t(16, 1.55, 400),
  bodyStrong: t(16, 1.55, 600),
  caption: { ...t(14, 1.45, 400), color: color.inkMuted },
  micro: { ...t(13, 1.3, 600), color: color.inkMuted },
  reader: t(17, 1.5, 500),
} satisfies Record<string, TextStyle>;

/* ─────────────── Shape, size, spacing ─────────────── */
export const radius = { input: 22, panel: 28, card: 34, sheet: 36, reader: 40, pill: 9999 } as const;
export const size = {
  primaryButton: 62, primaryButtonLarge: 64, arrowChip: 46, arrowChipLarge: 48,
  iconButton: 56, iconButtonOnboarding: 52, iconButtonCard: 44,
  chip: 52, tab: 56, checkbox: 30, touchMin: 44,
} as const;
export const space = {
  gutter: 20, gutterOnboarding: 24, top: 60, cardGap: 14, cardPadding: 20, bottomClearance: 128,
} as const;
