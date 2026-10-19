// OPTIONAL — only if your app already uses NativeWind 4 (Tailwind 3.4 syntax).
// Merge `theme.extend` into your tailwind.config.js. Colours/radii/fonts work as classes
// (bg-se-fill, text-ink-muted, rounded-card, font-urbanist-semibold). Gradients, inset shadows and
// blur are NOT expressible as NativeWind classes — use <Surface kind="clay|recess|dock|ink|glass|sheen">.
/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        ground: "#FFFFFF", input: "#F4F6FA", "surface-muted": "#F6F7F9", skeleton: "#EEF0F4",
        line: "#E8EBF0", "line-2": "#E2E6EC", "line-strong": "#CBD2DC", "check-ring": "#C2C9D4",
        ink: { DEFAULT: "#1B1B1F", button: "#111113", muted: "#5B6475", subtle: "#6B7385", flat: "#151517" },
        placeholder: "#8A92A3", strike: "#A0A8B8",
        se: { fill: "#DCEBFF", deep: "#BFD6FF", text: "#1E3A8A", muted: "#1E40AF", mark: "#2563EB" },
        daa: { fill: "#EDE5FF", deep: "#CDBBFF", text: "#5B21B6", mark: "#7C3AED" },
        dds: { fill: "#D9F5E6", deep: "#9EE6C0", text: "#065F46", mark: "#10B981" },
        art: { blue: "#3B82F6", violet: "#DDD0FF", green: "#BBF0D3", pink: "#F9A8D4" },
        highlighter: "#E3EEFF",
        info: { bg: "#E3EEF8", text: "#2C5577" }, warn: { bg: "#FEF3C7", text: "#92400E" }, error: { bg: "#FEE2E2", text: "#B91C1C" },
      },
      borderRadius: { input: "22px", panel: "28px", card: "34px", sheet: "36px", reader: "40px" },
      fontFamily: {
        "urbanist": ["Urbanist_400Regular"], "urbanist-medium": ["Urbanist_500Medium"],
        "urbanist-semibold": ["Urbanist_600SemiBold"], "urbanist-bold": ["Urbanist_700Bold"],
      },
    },
  },
};
