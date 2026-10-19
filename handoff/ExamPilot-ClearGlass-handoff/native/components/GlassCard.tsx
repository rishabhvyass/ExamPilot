// GlassCard  — every white card: frosted glass (iOS blur + translucent white gradient + hairline + soft shadow).
// SubjectCard — a card tinted with the subject fill and a white glass sheen on top (hero cards, progress cards).
// SubjectTag — small pill with the subject code.
// Don't use GlassCard for cards that overlap each other (stacked flashcards) — use a plain white View there.
import type { ReactNode } from "react";
import { Text, View, type StyleProp, type ViewStyle } from "react-native";
import { Surface } from "./Surface";
import { fontFamily, radius as R, subject as subjects, type SubjectId } from "../theme";

export function GlassCard({ children, radius = R.card, padding = 20, style }: { children: ReactNode; radius?: number; padding?: number; style?: StyleProp<ViewStyle> }) {
  return (
    <Surface kind="glass" radius={radius} style={[{ padding }, style]}>
      {children}
    </Surface>
  );
}

export function SubjectCard({ subject, children, radius = R.card, padding = 8, style }: { subject: SubjectId; children: ReactNode; radius?: number; padding?: number; style?: StyleProp<ViewStyle> }) {
  return (
    <Surface kind="sheen" subject={subject} radius={radius} style={[{ padding }, style]}>
      {children}
    </Surface>
  );
}

/** The solid inner stat panel of a hero card (deep fill, radius 28). */
export function StatPanel({ subject, children, height = 176, style }: { subject: SubjectId; children: ReactNode; height?: number; style?: StyleProp<ViewStyle> }) {
  return <View style={[{ height, borderRadius: R.panel, backgroundColor: subjects[subject].deep, overflow: "hidden" }, style]}>{children}</View>;
}

export function SubjectTag({ subject, deep = false }: { subject: SubjectId; deep?: boolean }) {
  const s = subjects[subject];
  return (
    <View style={{ alignSelf: "flex-start", height: 28, paddingHorizontal: 12, borderRadius: 9999, justifyContent: "center", backgroundColor: deep ? s.deep : s.fill }}>
      <Text style={{ fontFamily: fontFamily[700], fontSize: 13, color: s.text }}>{subject}</Text>
    </View>
  );
}
