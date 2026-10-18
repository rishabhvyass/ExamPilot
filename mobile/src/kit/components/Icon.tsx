// Icon — 24×24 stroke icons (2px, round caps/joins) drawn with react-native-svg.
// Pass `d` (one or more path strings) or SVG children. Colour comes from `color`.
// For the 39 icon files in assets/icons/*.svg you can also use react-native-svg-transformer:
//   import SearchIcon from "@/assets/icons/search.svg";  <SearchIcon width={22} height={22} color="#111113" />
// (their stroke is "currentColor", which react-native-svg resolves from the `color` prop).
import type { ReactNode } from "react";
import Svg, { Defs, LinearGradient, Path, Stop } from "react-native-svg";
import { color as c } from "../theme";

type Props = { d?: string | string[]; size?: number; color?: string; strokeWidth?: number; children?: ReactNode };

export function Icon({ d, size = 22, color = c.inkButton, strokeWidth = 2, children }: Props) {
  const paths = d ? (Array.isArray(d) ? d : [d]) : [];
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      {paths.map((p, i) => <Path key={i} d={p} />)}
      {children}
    </Svg>
  );
}

/** Glossy black icon (reader toolbar, from your reference clip). `active` = brighter gloss. */
export function GlossIcon({ d, size = 24, active = true, stroke = false }: { d: string; size?: number; active?: boolean; stroke?: boolean }) {
  const id = active ? "gloss" : "glossSoft";
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Defs>
        <LinearGradient id="gloss" x1="0" y1="0" x2="0.4" y2="1">
          <Stop offset="0" stopColor="#8A8A90" />
          <Stop offset="0.45" stopColor="#2A2A2E" />
          <Stop offset="1" stopColor="#050506" />
        </LinearGradient>
        <LinearGradient id="glossSoft" x1="0" y1="0" x2="0.4" y2="1">
          <Stop offset="0" stopColor="#C4C4C9" />
          <Stop offset="0.5" stopColor="#6A6A70" />
          <Stop offset="1" stopColor="#2A2A2E" />
        </LinearGradient>
      </Defs>
      {stroke ? (
        <Path d={d} fill="none" stroke={`url(#${id})`} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <Path d={d} fill={`url(#${id})`} />
      )}
    </Svg>
  );
}

/** Paths used across the components (all 24×24). */
export const ICON = {
  arrowRight: "M5 12h14M13 6l6 6-6 6",
  arrowUpRight: "M7 17L17 7M8 7h9v9",
  plus: "M12 5v14M5 12h14",
  check: "M5 12l5 5L20 7",
  chevronDown: "M6 9l6 6 6-6",
  chevronLeft: "M15 6l-6 6 6 6",
  chevronRight: "M9 6l6 6-6 6",
  search: ["M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14z", "M20 20l-3.5-3.5"],
  more: ["M5 12h.01", "M12 12h.01", "M19 12h.01"],
  filter: "M4 6h16M7 12h10M10 18h4",
  plane: "M3 11l18-7-7 18-2.5-8.5z",
  pen: "M20 3c-6 0-11 4-13 10l-2 6 1.2 1.2 6-2C18 16 21 10 21 4zM7.5 16.5L15 9",
  // tabs
  today: ["M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z", "M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M6.3 17.7l-1.4 1.4M19.1 4.9l-1.4 1.4"],
  calendar: ["M7 5h10a4 4 0 0 1 4 4v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a4 4 0 0 1 4-4z", "M16 3v4M8 3v4M3 10h18"],
  subjects: [
    "M7 3.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7z", "M17 3.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7z",
    "M7 13.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7z", "M17 13.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7z",
  ],
  questions: ["M8 4h8a5 5 0 0 1 5 5v6a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V9a5 5 0 0 1 5-5z", "M8 10h8M8 14h5"],
} as const;

/** Reader-mode glyphs (filled with the gloss gradient). */
export const READER_ICONS = {
  notes: "M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z",
  ask: "M4 4h12a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H10l-5 4v-4H4a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3zM20 9a3 3 0 0 1 3 3v5a2 2 0 0 1-2 2v3l-3-3h-4",
  saved: "M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z",
};
