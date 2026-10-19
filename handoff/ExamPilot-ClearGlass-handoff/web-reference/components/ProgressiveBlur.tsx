// ProgressiveBlur — text softly blurs and fades as it reaches the top/bottom edge of a
// scrolling area (the edge effect in your reference clip). Three stacked backdrop-blur layers
// (2px → 5px → 10px), each masked so the blur gets stronger toward the edge, plus a white fade.
//
// Place it as the LAST child of a `relative overflow-hidden` container that scrolls or animates.
// Needs a browser with backdrop-filter (all current Safari/Chrome/Firefox).
export function ProgressiveBlur({ side, height = side === "top" ? 120 : 110, fade = side === "top" ? "255,255,255" : "247,247,248" }: { side: "top" | "bottom"; height?: number; fade?: string }) {
  const dir = side === "top" ? "180deg" : "0deg";
  const layers = side === "top"
    ? [ { blur: 2, inset: "0", stop: "60%" }, { blur: 5, inset: "0 0 30px 0", stop: "45%" }, { blur: 10, inset: "0 0 60px 0", stop: "30%" } ]
    : [ { blur: 2, inset: "0", stop: "60%" }, { blur: 6, inset: "30px 0 0 0", stop: "40%" } ];
  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-0 z-[2]" style={{ [side]: 0, height }}>
      {layers.map((l, i) => (
        <span
          key={i}
          className="absolute"
          style={{
            inset: l.inset,
            backdropFilter: `blur(${l.blur}px)`,
            WebkitBackdropFilter: `blur(${l.blur}px)`,
            maskImage: `linear-gradient(${dir}, #000 ${l.stop}, transparent)`,
            WebkitMaskImage: `linear-gradient(${dir}, #000 ${l.stop}, transparent)`,
          }}
        />
      ))}
      <span className="absolute inset-0" style={{ background: `linear-gradient(${dir}, rgba(${fade},${side === "top" ? 0.85 : 0.95}), rgba(${fade},0))` }} />
    </div>
  );
}
