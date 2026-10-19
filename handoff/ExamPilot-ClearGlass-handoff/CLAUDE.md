# CLAUDE.md — ExamPilot (Clear Glass design)

Copy this file to the project root. The full guide is `/design/EXAMPILOT-REDESIGN.md`. Read it before any UI work.

## Project
ExamPilot: a calm exam-prep app for one student. The exams are real:
- SE (Software Engineering): Wed 21 Oct 2026, 2:00 PM
- DAA (Design and Analysis of Algorithm): Thu 22 Oct 2026, 2:00 PM
- DDS (Design of Data Structures): Fri 23 Oct 2026, 2:00 PM

All other content is sample data and must be labelled "Sample".

## Stack (React Native)
- Expo SDK 58: React Native 0.88, React 19.3, **New Architecture on** (needed for `boxShadow`).
- TypeScript.
- Animations: `react-native-reanimated@4.7` + `react-native-worklets@0.13`.
- Blur and gradients: `expo-blur`, `expo-linear-gradient`, `@react-native-masked-view/masked-view`.
- Drawing: `react-native-svg`, `@shopify/react-native-skia`.
- Feedback: `expo-haptics`, `react-native-fast-confetti`.
- Font: `@expo-google-fonts/urbanist`.
- `react-native-pdf` (development build).
- `react-native-gifted-charts`.
- UI kit: `src/ui` (copied from `/design/native`). Import everything from `@/ui`.

## Design rules (must)
1. **Page background is always `#FFFFFF`.** Never use greige, lavender or a tinted page background.
2. **Use tokens only.** Use `color`, `subject`, `type`, `radius`, `surface` from `@/ui` (`theme.ts`). Don't write new hex values in screens.
3. **Buttons come from one family:**
   - clay: `SoftButton` and `IconButton`
   - ink gloss: `Surface kind="ink"`, for selected states and arrow / send / ↗ circles
   - recess groove: active tab, toggled tool
   - outline and dashed: unselected and "add" actions
   - Every other tappable thing uses `PressableScale`. No `TouchableOpacity`, no flat black or flat white buttons.
   - Materials are drawn with `<Surface>` only: it layers outer shadow → gradient → inset shadow. Never put `boxShadow` and `LinearGradient` on the same view.
4. **Cards:**
   - White cards use `GlassCard` (blur on iOS, translucent white on Android).
   - Subject cards use `SubjectCard`, a fill with a sheen.
   - Overlapping and stacked cards stay solid white.
5. **Subject colours:**

   | Subject | Fill | Deep | Text | Mark |
   |---|---|---|---|---|
   | SE | `#DCEBFF` | `#BFD6FF` | `#1E3A8A` | `#2563EB` |
   | DAA | `#EDE5FF` | `#CDBBFF` | `#5B21B6` | `#7C3AED` |
   | DDS | `#D9F5E6` | `#9EE6C0` | `#065F46` | `#10B981` |

   - Red (`#FEE2E2` / `#B91C1C`) is only for real errors, never for exams or deadlines.
6. **Font:** Urbanist only. Set the weight with `fontFamily: fontFamily[600]` (or `type.*`), never `fontWeight`, because Android ignores it with custom fonts.
7. **Motion:**
   - Every screen uses `Screen`, and every block is wrapped in `BlurIn index={n}`.
   - Pressing a button scales it to .96 with a haptic.
   - Use the springs, easings and durations from `motion.ts`. Don't invent new ones.
   - Blur only block wrappers (5–10 per screen), never single words.
   - All animation runs on the UI thread (shared values); no `Animated` from react-native core.
8. **Reduced motion:**
   - Presets use `ReduceMotion.System`.
   - Components check `useReducedMotion()`.
   - No blur, loops, auto-advance or confetti when Reduce Motion is on.
9. **Performance:**
   - At most about 6 live BlurViews on screen.
   - No BlurView inside list rows.
   - Check performance in release builds.
10. **Accessibility:**
    - Contrast 4.5:1 or higher.
    - `accessibilityLabel` on icon-only buttons.
    - `accessibilityRole` and `accessibilityState` (selected / checked / disabled / expanded) where they apply.
    - Touch targets 44pt or larger (`hitSlop`).
    - `maxFontSizeMultiplier={1.3}` on display text.
11. **Layout:**
    - Keep the existing four tabs (Today, Calendar, Subjects, Questions), routes, copy and data model.
    - This is a reskin plus features, not a rewrite.

## Workflow
- Work one phase or one screen at a time, in the order of the guide's §3–§11.
- After each step, run the app on iOS and Android (`npx expo start`, then a development build once `react-native-pdf` is in) and run `npx tsc --noEmit`.
- For motion, match `/design/motion-videos/`: read `frames/<clip>.png`, `timeline/<clip>.json` and the clip's section in `MOTION-VIDEOS.md` before animating anything; use the measured durations, delays and easings.
- Compare the result with `/design/screenshots/<screen>.png`. For exact numbers, check `/design/reference/rendered-html/<screen>.html` (CSS px = RN pt).
- Don't modify files in `/design`. The kit lives in `src/ui`, and you may extend it there.
- When something can't match the design exactly, say what's different and why.
