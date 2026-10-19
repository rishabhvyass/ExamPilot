# ExamPilot · Clear Glass handoff (React Native)

Start with **[EXAMPILOT-REDESIGN.md](EXAMPILOT-REDESIGN.md)**. It's the full guide for your React Native / Expo app:
- libraries with exact versions
- step-by-step phases
- every screen
- the new features
- all animations
- every SVG inline

## Quick start
1. Copy this folder into your project as `/design`.
2. Copy `CLAUDE.md` to your project root.
3. Install the libraries (guide §2):
   ```bash
   npx expo install react-native-reanimated react-native-worklets expo-blur expo-linear-gradient react-native-svg \
     @shopify/react-native-skia @react-native-masked-view/masked-view expo-haptics expo-font @expo-google-fonts/urbanist react-native-safe-area-context
   npm i react-native-fast-confetti@2.0.2
   ```
4. Copy `native/` to `src/ui/` and import from `@/ui`.
5. Follow Phases 0 → 8. Each phase ends with a working app.

## What's inside

| Folder | Contents |
|---|---|
| `native/` | **The React Native kit:** `theme.ts` (all tokens), `motion.ts` (Reanimated presets), 20 components and 2 full examples. Type-checked (strict) against Expo SDK 58 / RN 0.88 / Reanimated 4.7. Not yet run on a device. |
| `assets/` | 39 UI icons, glossy toolbar icons, illustrations, logo and app icon (SVG; react-native-svg compatible) |
| `motion-videos/` | **21 frame-perfect MP4 recordings** of every animation, a modal player (`index.html`), step-by-step explanations (`MOTION-VIDEOS.md`), key-frame sheets and measured timelines for Claude Code |
| `screenshots/` | 35 target images: 12 screens with their states, plus motion boards M1–M9 |
| `reference/` | Interactive design sources (`prototypes/*.dc.html`) and static HTML snapshots (`rendered-html/`). Open them in a desktop browser to inspect exact sizes. |
| `design-tokens/tokens.json` | All tokens, machine-readable |
| `sample-data/`, `docs/`, `research/` | Seed data and microcopy, data model, backend and AI plan |
| `web-reference/` | The original web CSS and components the native kit was translated from. Reference only. |

The components are:

| Group | Components |
|---|---|
| Materials and press | Surface, PressableScale |
| Buttons | SoftButton, IconButton |
| Cards | GlassCard, SubjectCard, StatPanel |
| Screen and motion | Screen, BlurIn, ProgressiveBlur |
| Navigation and controls | TabBar, SegmentedControl, FilterChips, AnimatedCheckbox |
| New features | BlurReader, SplashIntro, CodePill, QuickAddMenu, ToolDock, GooeyIsland, CelebrateLayer |
| Icons | Icon, GlossIcon |
