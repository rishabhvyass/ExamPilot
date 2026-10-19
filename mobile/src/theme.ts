import { useAppearance } from './appearance';
// Clear Glass tokens (design handoff native/theme.ts), kept under the existing key names.
import type { TextStyle } from 'react-native';

export const C = {
  ground: '#FFFFFF',
  surface: '#FFFFFF',
  surfaceMuted: '#F6F7F9',
  input: '#F4F6FA',
  splash: '#FFFFFF',
  track: '#EEF0F4',
  line: '#E8EBF0',
  line2: '#E2E6EC',
  lineStrong: '#CBD2DC',
  ring: '#C2C9D4',
  ink: '#1B1B1F',
  inkButton: '#111113',
  inkFlat: '#151517', // thin progress fills (8px tall or less)
  inkMuted: '#5B6475',
  inkSubtle: '#6B7385',
  placeholder: '#8A92A3',
  otherMonth: '#B8C0CC',
  artPlum: '#3B82F6',
  artPink: '#DDD0FF',
  artMint: '#BBF0D3',
  highlight: '#E3EEFF',
  infoFill: '#E3EEF8',
  infoText: '#2C5577',
  headsupFill: '#FEF3C7',
  headsupText: '#92400E',
  errorFill: '#FEE2E2',
  errorText: '#B91C1C',
  scrim: 'rgba(27,27,31,0.32)',
};
export type SubjectColor = 'se' | 'daa' | 'dds';
export const SUBJ: Record<
  SubjectColor,
  {
    fill: string;
    deep: string;
    text: string;
    mark: string;
    divider: string;
    art: string;
  }
> = {
  se: {
    fill: '#DCEBFF',
    deep: '#BFD6FF',
    text: '#1E3A8A',
    mark: '#2563EB',
    divider: 'rgba(30,58,138,0.18)',
    art: 'hero-card-art-se-blue',
  },
  daa: {
    fill: '#EDE5FF',
    deep: '#CDBBFF',
    text: '#5B21B6',
    mark: '#7C3AED',
    divider: 'rgba(91,33,182,0.18)',
    art: 'hero-card-art-daa-violet',
  },
  dds: {
    fill: '#D9F5E6',
    deep: '#9EE6C0',
    text: '#065F46',
    mark: '#10B981',
    divider: 'rgba(6,95,70,0.18)',
    art: 'hero-card-art-dds-green',
  },
};
const subjectColors: Record<string, SubjectColor> = {};
/** Called by the store whenever subjects change, so colorOf(subjectId) resolves admit-card subjects. */
export const registerSubjectColors = (
  subjects: { id: string; color: SubjectColor }[],
) => {
  for (const x of subjects) subjectColors[x.id] = x.color;
};
/** Accepts a palette key ('se' | 'daa' | 'dds') or any subject id. */
export const colorOf = (id?: string): SubjectColor =>
  !id ? 'se' : id in SUBJ ? (id as SubjectColor) : subjectColors[id] ?? 'se';
/** Palette for the nth subject: blue, violet, green, then repeat. */
export const paletteAt = (i: number): SubjectColor =>
  (['se', 'daa', 'dds'] as const)[i % 3];

/**
 * Materials. `gradient` is a CSS linear-gradient string (RN backgroundImage); `shadow` is split into
 * outer (on the root) and inset (overlay above the gradient) by <Surface>.
 */
export const SURFACE = {
  clay: {
    gradient: 'linear-gradient(180deg, #FFFFFF 0%, #F1F1F2 60%, #E9E9EB 100%)',
    shadow:
      'inset 0px 1px 0px #FFFFFF, inset 0px -2px 5px rgba(0,0,0,0.035), 0px 0px 0px 1px rgba(0,0,0,0.045), 0px 1px 2px rgba(0,0,0,0.06), 0px 10px 24px rgba(0,0,0,0.07)',
  },
  recess: {
    gradient: 'linear-gradient(180deg, #DEDEE1 0%, #E9E9EB 100%)',
    shadow:
      'inset 0px 2px 6px rgba(0,0,0,0.13), inset 0px -1px 0px rgba(255,255,255,0.9)',
  },
  dock: {
    gradient: 'linear-gradient(180deg, #FFFFFF 0%, #F0F0F2 100%)',
    shadow:
      'inset 0px 1px 0px #FFFFFF, 0px 0px 0px 1px rgba(0,0,0,0.05), 0px 2px 4px rgba(0,0,0,0.05), 0px 16px 34px rgba(0,0,0,0.10)',
  },
  ink: {
    gradient: 'linear-gradient(180deg, #4A4A4F 0%, #1C1C1F 55%, #0E0E10 100%)',
    shadow:
      'inset 0px 1px 0px rgba(255,255,255,0.22), inset 0px -1px 0px rgba(0,0,0,0.4), 0px 1px 2px rgba(0,0,0,0.25), 0px 8px 18px rgba(0,0,0,0.18)',
  },
  glass: {
    gradient:
      'linear-gradient(160deg, rgba(255,255,255,0.94) 0%, rgba(248,250,253,0.86) 100%)',
    shadow:
      'inset 0px 1px 0px #FFFFFF, inset 0px 0px 0px 1px rgba(15,23,42,0.07), 0px 14px 36px rgba(15,23,42,0.07)',
  },
  sheen: {
    gradient:
      'linear-gradient(160deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 55%)',
    shadow:
      'inset 0px 1px 0px rgba(255,255,255,0.9), inset 0px 0px 0px 1px rgba(255,255,255,0.6), 0px 12px 30px rgba(15,23,42,0.06)',
  },
} as const;
/** Glossy black as a plain style (gradient background + inset highlights); spread into a View's style. */
export const INK = {
  experimental_backgroundImage: SURFACE.ink.gradient,
  boxShadow: SURFACE.ink.shadow,
} as const;
/** Soft clay as a plain style (for pills that hold only text). */
export const CLAY = {
  experimental_backgroundImage: SURFACE.clay.gradient,
  boxShadow: SURFACE.clay.shadow,
} as const;
/** White sheen drawn over a subject fill (spread next to its backgroundColor). */
export const SHEEN = {
  experimental_backgroundImage: SURFACE.sheen.gradient,
  boxShadow: SURFACE.sheen.shadow,
} as const;
export type SurfaceKind = keyof typeof SURFACE;

export const R = { input: 22, panel: 28, card: 34, sheet: 36, pill: 9999 };
export const SHADOW = {
  nav: '0px 16px 34px rgba(0,0,0,0.10)',
  sheet: '0px 16px 40px rgba(15,23,42,0.10)',
  card: '0px 14px 36px rgba(15,23,42,0.07)',
  soft: 'inset 0px 0px 0px 1px rgba(15,23,42,0.07), 0px 14px 36px rgba(15,23,42,0.07)',
  fab: '0px 10px 26px rgba(27,27,31,0.25)',
};
export const FONT: Record<400 | 500 | 600 | 700, string> = {
  400: 'Urbanist-Regular',
  500: 'Urbanist-Medium',
  600: 'Urbanist-SemiBold',
  700: 'Urbanist-Bold',
};
const t = (
  size: number,
  lh: number,
  w: 400 | 500 | 600 | 700,
  ls = 0,
): TextStyle => ({
  fontSize: size,
  lineHeight: Math.round(size * lh),
  fontFamily: FONT[w],
  letterSpacing: size * ls,
  color: C.ink,
});
export const TYPE = {
  splash: t(60, 1.05, 600, -0.04),
  display: t(46, 1.04, 600, -0.03),
  onboard: t(40, 1.08, 600, -0.03),
  stat: t(54, 1.05, 600, -0.03),
  cardTitle: t(28, 1.12, 600, -0.02),
  section: t(24, 1.2, 600, -0.02),
  eyebrow: { ...t(20, 1.3, 500), color: C.inkMuted },
  bodyL: t(17, 1.45, 500),
  body: t(16, 1.5, 400),
  bodyStrong: t(16, 1.4, 600),
  caption: t(14, 1.4, 400),
  micro: t(13, 1.3, 600),
};
export const EASE = {
  smooth: [0.2, 0.8, 0.2, 1],
  overshoot: [0.2, 0.9, 0.25, 1.05],
  standard: [0.2, 0, 0, 1],
  decelerate: [0.05, 0.7, 0.1, 1],
} as const;

// Theme-aware tokens. Subject palettes keep their own contrasting text colours.
export const DARK: typeof C = {
  ...C, ground: '#101114', surface: '#1B1D22', surfaceMuted: '#24272E', input: '#24272E', splash: '#101114',
  track: '#30343C', line: '#30343C', line2: '#3B404A', lineStrong: '#505764', ring: '#687181',
  ink: '#F4F5F7', inkButton: '#F4F5F7', inkFlat: '#E2E7F0', inkMuted: '#BBC2CF', inkSubtle: '#A3ADBD',
  placeholder: '#929CAC', otherMonth: '#737E8F', highlight: '#263B5B', infoFill: '#203347', infoText: '#B8DAF5',
  headsupFill: '#423519', headsupText: '#F8D87E', errorFill: '#45252A', errorText: '#FFB5BC', scrim: 'rgba(0,0,0,0.55)',
};
export function useColors() { return useAppearance().dark ? DARK : C; }
export function useTypography() {
  const colors = useColors();
  return Object.fromEntries(Object.entries(TYPE).map(([key, value]) => [key, {
    ...value, color: value.color === C.inkMuted ? colors.inkMuted : colors.ink,
  }])) as typeof TYPE;
}
export const DARK_SUBJ: typeof SUBJ = {
  se: { ...SUBJ.se, fill: '#1C304B', deep: '#244164', text: '#C8DEFF', mark: '#83B4FF', divider: 'rgba(200,222,255,0.18)' },
  daa: { ...SUBJ.daa, fill: '#302540', deep: '#423058', text: '#E3D3FF', mark: '#C5A5FF', divider: 'rgba(227,211,255,0.18)' },
  dds: { ...SUBJ.dds, fill: '#173A30', deep: '#20513F', text: '#B9EFD6', mark: '#6DDEAD', divider: 'rgba(185,239,214,0.18)' },
};
export function useSubjectColors() { return useAppearance().dark ? DARK_SUBJ : SUBJ; }
