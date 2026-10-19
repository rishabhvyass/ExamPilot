// FilterChips — Subjects / Questions / Materials filter row.
// A plain white 52px circle with the filter icon (decorative), then 52px chips:
// selected = glossy black + white 16/600 text; others = transparent with a 1.5px #CBD2DC ring.
import { ScrollView, Text, View } from "react-native";
import { PressableScale } from "./PressableScale";
import { Surface } from "./Surface";
import { Icon, ICON } from "./Icon";
import { color, fontFamily } from "../theme";

type Chip<T extends string> = { value: T; label: string };

export function FilterChips<T extends string>({ chips, value, onChange }: { chips: Chip<T>[]; value: T; onChange: (v: T) => void }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingVertical: 4, paddingRight: 20 }}>
      <View accessible={false} style={{ width: 52, height: 52, borderRadius: 9999, backgroundColor: "#FFFFFF", alignItems: "center", justifyContent: "center", boxShadow: "0px 0px 0px 1px rgba(15,23,42,0.07)" }}>
        <Icon d={ICON.filter} size={20} />
      </View>
      {chips.map((c) => {
        const on = c.value === value;
        const label = <Text style={{ fontFamily: fontFamily[600], fontSize: 16, color: on ? "#FFFFFF" : color.ink }}>{c.label}</Text>;
        return (
          <PressableScale key={c.value} amount="small" onPress={() => onChange(c.value)} accessibilityRole="button" accessibilityState={{ selected: on }} accessibilityLabel={c.label}>
            {on ? (
              <Surface kind="ink" style={{ height: 52, paddingHorizontal: 22, justifyContent: "center" }}>{label}</Surface>
            ) : (
              <View style={{ height: 52, paddingHorizontal: 22, justifyContent: "center", borderRadius: 9999, borderWidth: 1.5, borderColor: color.lineStrong }}>{label}</View>
            )}
          </PressableScale>
        );
      })}
    </ScrollView>
  );
}
