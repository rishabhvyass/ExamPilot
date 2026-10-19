// Example: the Today screen rebuilt with the kit (matches screenshots/06-today.png).
// Not a drop-in — replace the sample state with your store / API.
import { useRef, useState } from "react";
import { Text, View } from "react-native";
import {
  AnimatedCheckbox, BlurIn, CelebrateLayer, GlassCard, GooeyIsland, Icon, ICON, IconButton, QuickAddMenu, Screen,
  StatPanel, SubjectCard, color, fontFamily, subject, type CelebrateHandle,
} from "../index";

const TASKS = [
  { id: "t1", title: "SDLC models — waterfall vs agile", meta: "SE · 25 min" },
  { id: "t2", title: "Requirement engineering", meta: "SE · 20 min" },
  { id: "t3", title: "Testing levels", meta: "SE · 30 min" },
];

export default function TodayScreen() {
  const [done, setDone] = useState<Record<string, boolean>>({ t1: true });
  const celebrate = useRef<CelebrateHandle>(null);
  const toggle = (id: string) => {
    const next = { ...done, [id]: !done[id] };
    setDone(next);
    if (TASKS.every((t) => next[t.id])) celebrate.current?.fire();
  };

  return (
    <Screen
      overlay={
        <>
          <QuickAddMenu actions={[
            { id: "block", label: "Study block", icon: <Icon d={ICON.calendar as unknown as string[]} size={20} color="#FFFFFF" />, onSelect: () => {} },
            { id: "ask", label: "Ask Pilo", icon: <Icon d={ICON.plane} size={20} color="#FFFFFF" />, onSelect: () => {} },
          ]} />
          <CelebrateLayer ref={celebrate} />
        </>
      }
    >
      <BlurIn index={0}>
        <GooeyIsland state={{ kind: "message", text: "SE in 3 days · tap to focus" }} />
      </BlurIn>

      <BlurIn index={1}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <View style={{ width: 56, height: 56, borderRadius: 9999, backgroundColor: subject.SE.fill }} />
          <View style={{ flexDirection: "row", gap: 10 }}>
            <IconButton label="Search"><Icon d={[...ICON.search]} /></IconButton>
            <IconButton label="More"><Icon d={[...ICON.more]} /></IconButton>
          </View>
        </View>
      </BlurIn>

      <BlurIn index={2}>
        <Text style={{ fontFamily: fontFamily[500], fontSize: 20, color: color.inkMuted }}>Good morning</Text>
        <Text style={{ fontFamily: fontFamily[600], fontSize: 46, lineHeight: 47, letterSpacing: -1.38, color: color.ink }}>Your Exam Week</Text>
      </BlurIn>

      <BlurIn index={3}>
        <SubjectCard subject="SE">
          <View style={{ padding: 14, gap: 4 }}>
            <Text style={{ fontFamily: fontFamily[600], fontSize: 14, color: subject.SE.textMuted }}>Next exam</Text>
            <Text style={{ fontFamily: fontFamily[600], fontSize: 28, color: color.ink }}>Software Engineering</Text>
            <Text style={{ fontFamily: fontFamily[400], fontSize: 15, color: subject.SE.textMuted }}>Wed 21 Oct · 2:00 PM</Text>
          </View>
          <StatPanel subject="SE">
            <View style={{ flexDirection: "row", padding: 20, gap: 20 }}>
              <View>
                <Text style={{ fontFamily: fontFamily[600], fontSize: 54, color: subject.SE.text }}>3</Text>
                <Text style={{ fontFamily: fontFamily[500], fontSize: 14, color: subject.SE.text }}>Days to prepare</Text>
              </View>
              <View style={{ width: 1, backgroundColor: subject.SE.divider }} />
              <View>
                <Text style={{ fontFamily: fontFamily[600], fontSize: 40, color: subject.SE.text }}>4/6</Text>
                <Text style={{ fontFamily: fontFamily[500], fontSize: 14, color: subject.SE.text }}>Topics</Text>
              </View>
            </View>
            <View style={{ position: "absolute", right: 14, bottom: 14 }}>
              <IconButton label="Open Software Engineering" tone="ink" size={52}>
                <Icon d={ICON.arrowUpRight} color="#FFFFFF" />
              </IconButton>
            </View>
          </StatPanel>
        </SubjectCard>
      </BlurIn>

      <BlurIn index={4}>
        <GlassCard>
          <Text style={{ fontFamily: fontFamily[600], fontSize: 24, color: color.ink, marginBottom: 8 }}>Today’s revision</Text>
          {TASKS.map((t) => (
            <AnimatedCheckbox key={t.id} title={t.title} meta={t.meta} checked={!!done[t.id]} onToggle={() => toggle(t.id)} />
          ))}
        </GlassCard>
      </BlurIn>
    </Screen>
  );
}
