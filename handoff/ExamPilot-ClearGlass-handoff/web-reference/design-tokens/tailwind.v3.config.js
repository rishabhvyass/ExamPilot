/** Tailwind CSS v3 — merge `theme.extend` and `plugins` into your existing tailwind.config.js.
 *  (Using Tailwind v4? Use tailwind.v4.css instead.) */
const plugin = require("tailwindcss/plugin");

module.exports = {
  theme: {
    extend: {
      fontFamily: { sans: ['"Urbanist"', '"Urbanist Variable"', "system-ui", "sans-serif"] },
      colors: {
        ground: "#FFFFFF",
        input: "#F4F6FA",
        "surface-muted": "#F6F7F9",
        skeleton: "#EEF0F4",
        line: { DEFAULT: "#E8EBF0", 2: "#E2E6EC", strong: "#CBD2DC" },
        ink: { DEFAULT: "#1B1B1F", button: "#111113", muted: "#5B6475", subtle: "#6B7385" },
        placeholder: "#8A92A3",
        se: { fill: "#DCEBFF", deep: "#BFD6FF", text: "#1E3A8A", mark: "#2563EB" },
        daa: { fill: "#EDE5FF", deep: "#CDBBFF", text: "#5B21B6", mark: "#7C3AED" },
        dds: { fill: "#D9F5E6", deep: "#9EE6C0", text: "#065F46", mark: "#10B981" },
        art: { blue: "#3B82F6", violet: "#DDD0FF", green: "#BBF0D3", pink: "#F9A8D4" },
        highlighter: "#E3EEFF",
        info: { bg: "#E3EEF8", text: "#2C5577" },
        headsup: { bg: "#FEF3C7", text: "#92400E" },
        error: { bg: "#FEE2E2", text: "#B91C1C" },
      },
      borderRadius: { input: "22px", panel: "28px", card: "34px", sheet: "36px", reader: "40px" },
      boxShadow: {
        clay: "inset 0 1px 0 #FFFFFF, inset 0 -2px 5px rgba(0,0,0,.035), 0 0 0 1px rgba(0,0,0,.045), 0 1px 2px rgba(0,0,0,.06), 0 10px 24px rgba(0,0,0,.07)",
        recess: "inset 0 2px 6px rgba(0,0,0,.13), inset 0 -1px 0 rgba(255,255,255,.9)",
        dock: "inset 0 1px 0 #FFFFFF, 0 0 0 1px rgba(0,0,0,.05), 0 2px 4px rgba(0,0,0,.05), 0 16px 34px rgba(0,0,0,.10)",
        ink: "inset 0 1px 0 rgba(255,255,255,.22), inset 0 -1px 0 rgba(0,0,0,.4), 0 1px 2px rgba(0,0,0,.25), 0 8px 18px rgba(0,0,0,.18)",
        glass: "inset 0 1px 0 #FFFFFF, inset 0 0 0 1px rgba(15,23,42,.07), 0 14px 36px rgba(15,23,42,.07)",
        sheen: "inset 0 1px 0 rgba(255,255,255,.9), inset 0 0 0 1px rgba(255,255,255,.6), 0 12px 30px rgba(15,23,42,.06)",
      },
      transitionTimingFunction: {
        standard: "cubic-bezier(.2,0,0,1)",
        decelerate: "cubic-bezier(.05,.7,.1,1)",
        smooth: "cubic-bezier(.2,.8,.2,1)",
        overshoot: "cubic-bezier(.2,.9,.25,1.08)",
        spring: "cubic-bezier(.3,1.25,.45,1)",
      },
    },
  },
  plugins: [
    plugin(({ addUtilities }) =>
      addUtilities({
        ".bg-clay": { background: "linear-gradient(180deg, #FFFFFF 0%, #F1F1F2 60%, #E9E9EB 100%)" },
        ".bg-recess": { background: "linear-gradient(180deg, #DEDEE1, #E9E9EB)" },
        ".bg-dock": { background: "linear-gradient(180deg, #FFFFFF, #F0F0F2)" },
        ".bg-ink-gloss": { background: "linear-gradient(180deg, #4A4A4F 0%, #1C1C1F 55%, #0E0E10 100%)" },
        ".bg-glass": {
          background: "linear-gradient(160deg, rgba(255,255,255,.78), rgba(248,250,253,.55))",
          backdropFilter: "blur(22px) saturate(1.6)",
          WebkitBackdropFilter: "blur(22px) saturate(1.6)",
        },
        ".bg-sheen-se": { background: "linear-gradient(160deg, rgba(255,255,255,.6), rgba(255,255,255,0) 55%), #DCEBFF" },
        ".bg-sheen-daa": { background: "linear-gradient(160deg, rgba(255,255,255,.6), rgba(255,255,255,0) 55%), #EDE5FF" },
        ".bg-sheen-dds": { background: "linear-gradient(160deg, rgba(255,255,255,.6), rgba(255,255,255,0) 55%), #D9F5E6" },
      })
    ),
  ],
};
