# ExamPilot — "Clear Glass" Redesign Guide · React Native

This file has everything you need to reskin your existing **React Native** ExamPilot app into the Clear Glass design and add the new features. It covers:
- libraries, with exact versions
- tokens, button and glass styles
- every animation and every SVG
- every screen
- step-by-step instructions, from the smallest change to the biggest

The design source is the **v1 · Clear Glass** page of the ExamPilot design canvas. Every value is copied from those files; the original sources are in `reference/prototypes/`. The ready-made React Native kit is in **`native/`**. It is type-checked in strict mode against Expo SDK 58 (React Native 0.88, React 19.3, Reanimated 4.7). It has not been run on a device, so test each piece on a real iPhone and Android phone as you add it (see §11).

> **The look in one sentence:** a pure white background, frosted-glass cards, soft grey-white "clay" buttons with glossy black accents (from your reference clip), one colour per subject (SE blue, DAA violet, DDS green), and a soft blur on every entrance.

---

## Contents

0. [How to use this folder](#0-how-to-use-this-folder)
1. [What changes, and how web effects become native](#1-what-changes-and-how-web-effects-become-native)
2. [Libraries: exact versions and install commands](#2-libraries-exact-versions-and-install-commands)
3. [Phase 0 · Prepare your project](#3-phase-0--prepare-your-project)
4. [Phase 1 · Foundations: fonts, theme, Reanimated, white background](#4-phase-1--foundations)
5. [Phase 2 · Buttons: the soft clay style everywhere](#5-phase-2--buttons)
6. [Phase 3 · Glass cards, subject cards, fields](#6-phase-3--glass-cards-subject-cards-fields)
7. [Phase 4 · Navigation, segmented control, chips](#7-phase-4--navigation-segmented-control-chips)
8. [Phase 5 · Blur motion everywhere](#8-phase-5--blur-motion-everywhere)
9. [Phase 6 · Screen by screen](#9-phase-6--screen-by-screen)
10. [Phase 7 · New features](#10-phase-7--new-features)
11. [Phase 8 · QA, accessibility, performance](#11-phase-8--qa-accessibility-performance)
12. [Claude Code prompts for each phase](#12-claude-code-prompts-for-each-phase)
13. [Troubleshooting](#13-troubleshooting)
- [Appendix A · Every token](#appendix-a--every-token)
- [Appendix B · Every animation (web spec → React Native)](#appendix-b--every-animation-web-spec--react-native)
- [Appendix C · Every SVG (inline code)](#appendix-c--every-svg-inline-code)
- [Appendix D · Folder map](#appendix-d--folder-map)
- [Appendix E · Motion videos (live recordings)](#appendix-e--motion-videos-live-recordings)

---

## 0. How to use this folder

1. Copy this whole folder into your project as **`/design`**, next to `app/` or `src/`. It's reference material, so the app never imports from it.
2. Copy **`design/native/`** to **`src/ui/`** (or wherever your shared UI lives). This is the kit: `theme.ts`, `motion.ts`, 20 components and `index.ts`. Your screens import from `@/ui`.
3. Copy `CLAUDE.md` to your **project root**, or merge it with yours. Claude Code reads it automatically.
4. Work through the phases **in order**. Each phase ends with an app that builds and runs, so you can commit after every phase.
5. For each phase you can paste the matching prompt from [§12](#12-claude-code-prompts-for-each-phase) into Claude Code.
6. Compare your screens with `screenshots/` (390 pt wide, 2× images). An iPhone 15/16 simulator (393 pt) is the closest match. For exact numbers, open the matching file in `reference/rendered-html/` in a desktop browser and inspect it. The CSS values there map 1:1 to the values in `native/theme.ts`.

| You want… | Look in |
|---|---|
| The picture to match | `screenshots/*.png` |
| **The motion to match** | `motion-videos/*.mp4` (watch), `motion-videos/index.html` (modal player, slow-mo, steps), `motion-videos/frames/*.png` + `timeline/*.json` (for Claude Code) |
| Exact size or colour of any element | `reference/rendered-html/<screen>.html` (static), `reference/prototypes/<Screen>.dc.html` (interactive source) |
| Colours, type, radii, shadows | `native/theme.ts` (also `design-tokens/tokens.json`) |
| Springs, easings, entrance presets | `native/motion.ts` |
| Ready React Native components | `native/components/*.tsx`, exported from `native/index.ts` |
| Full screen example | `native/examples/TodayScreen.example.tsx`, `TabsLayout.example.tsx` |
| NativeWind users | `native/nativewind.config.example.js` |
| Icons & art | `assets/icons/`, `assets/icons-glossy/`, `assets/illustrations/` |
| Seed data & copy | `sample-data/` |
| Data model, backend, AI | `docs/` |
| The original web CSS / components | `web-reference/` (reference only, don't import) |

---

## 1. What changes, and how web effects become native

### 1.1 Old look → new look

| Area | Before (Lavender Calm) | Now (Clear Glass) |
|---|---|---|
| Screen background | warm greige `#EDECE8`, splash `#C9C0DB` | **pure white `#FFFFFF` everywhere** |
| Primary button | black pill, white label, white arrow circle | **soft clay pill** (white→`#E9E9EB` gradient, layered soft shadow), **black label**, **glossy black arrow circle** |
| Icon buttons | flat white 56 pt circles | **soft clay circles** |
| Selected chip / toggle | flat black | **glossy black** (`#4A4A4F → #1C1C1F → #0E0E10` + highlight) |
| Bottom tab bar | white capsule, active = black pill | **soft dock**: inactive tabs are flat icons; the **active tab is a pressed-in grey groove** showing icon + label |
| White cards | flat white on greige | **frosted glass**: iOS blur + translucent white gradient + hairline + soft shadow |
| Subject colours | SE lavender, DAA pink, DDS mint | **SE blue `#DCEBFF`, DAA violet `#EDE5FF`, DDS green `#D9F5E6`**, with a white glass sheen |
| Decorative art | plum / pink / mint circles | **blue `#3B82F6` / violet `#DDD0FF` / green `#BBF0D3`** |
| Text | ink `#1B1B1F`, muted `#5C5866` | ink `#1B1B1F` (same), muted **`#5B6475`**, subtle **`#6B7385`** |
| Entrances | fade + rise | **fade + rise + blur → sharp** ("blur-in") |
| Button press | opacity | **scale .96 + light haptic** |
| New | — | **Blur Reader** (focus reading), code pill, gooey study island, blur quick-add menu, PDF tool dock, onboarding carousel, live subject icons, study-block range picker |

These **don't change**: layout, spacing, type scale, copy, flows, the four tabs, the data model and the backend plan. This is a reskin plus new features, not a rewrite.

### 1.2 How each web effect is done in React Native

The design was drawn in HTML/CSS. Here is how every CSS effect maps to native. The kit already does all of this; the table explains why it's built the way it is.

| Design effect (CSS) | React Native |
|---|---|
| `linear-gradient(...)` backgrounds | `expo-linear-gradient` inside `<Surface>` (works on every RN version) |
| `box-shadow` incl. **`inset`** (clay, recess, dock, ink) | the **`boxShadow` style prop**, which needs RN ≥ 0.76 on the New Architecture. `<Surface>` paints it in layers: outer shadow → gradient → inset overlay → children |
| `backdrop-filter: blur()` (glass cards, quick-add veil) | `expo-blur` `<BlurView>` on iOS. On Android, a translucent white gradient (a live Android blur needs a `BlurTargetView` around whatever is behind it, and on a white page it looks the same) |
| `filter: blur(10px → 0)` entrances | `<BlurIn>`: Reanimated `entering` (fade + rise) **plus a BlurView veil whose `intensity` animates to 0** and then unmounts. RN's own `filter: blur` is Android 12+ only (on iOS it's behind an experimental flag) |
| Press `scale(.96)` + `blur(.6px)` | `<PressableScale>`: spring to .96 + opacity .94 + `expo-haptics` selection tick. A 0.6 px blur can't be seen on a phone, so the haptic replaces it |
| `hover` lift | none on touch screens (ignored) |
| Motion `layoutId` (sliding groove, slider) | one absolutely positioned `Animated.View` that springs to the **measured** frame (`onLayout`) of the active item |
| `AnimatePresence` enter / exit | Reanimated `entering` / `exiting` (`Keyframe`, `FadeIn`, …) and `layout={LinearTransition}` |
| `mask-image` progressive edge blur | `@react-native-masked-view/masked-view` + gradient masks over 3 BlurViews (iOS); white gradient fade (Android) |
| SVG goo filter (study island) | `@shopify/react-native-skia` `<Group layer={<Paint><Blur/><ColorMatrix/></Paint>}>` |
| SVG `pathLength` draw (ticks, logo) | `react-native-svg` `<Path strokeDasharray strokeDashoffset>` animated with `useAnimatedProps` |
| `canvas-confetti` | `react-native-fast-confetti` (Skia) |
| `prefers-reduced-motion` | Reanimated `useReducedMotion()` + `ReduceMotion.System` in every preset |
| Tailwind classes | `StyleSheet` + `theme.ts` tokens (or NativeWind for colours and radii only) |
| `focus-visible` ring | `accessibilityLabel` / `accessibilityRole` / `accessibilityState` on every pressable |

---

## 2. Libraries: exact versions and install commands

Versions are the latest published as of **18 Oct 2026**. They are the set **Expo SDK 58** bundles (`expo/bundledNativeModules.json`), and the kit was type-checked against them.

| Package | Version | Why |
|---|---|---|
| `expo` | **58.0.14** | SDK 58 → React Native **0.88.0**, React **19.3.0** |
| `react-native-reanimated` | **4.7.1** | all animations (UI thread) |
| `react-native-worklets` | **0.13.0** | required by Reanimated 4 (`scheduleOnRN`) |
| `expo-blur` | **58.0.4** | glass, blur-in veil, quick-add veil, reader blur |
| `expo-linear-gradient` | **58.0.3** | clay / ink / dock / recess / glass gradients |
| `react-native-svg` | **15.16.0** | icons, ticks, logo, glossy icons, charts |
| `react-native-svg-transformer` | **1.5.3** (dev) | import `.svg` files as components (optional) |
| `@shopify/react-native-skia` | **2.14.0** | gooey island, confetti renderer |
| `@react-native-masked-view/masked-view` | **0.3.2** | progressive edge blur |
| `expo-haptics` | **58.0.7** | press tick, success buzz |
| `expo-font` + `@expo-google-fonts/urbanist` | **58.0.8** + **0.4.2** | Urbanist 400/500/600/700 |
| `react-native-safe-area-context` | **5.10.1** | insets for the floating tab bar |
| `react-native-fast-confetti` | **2.0.2** | one gentle burst on wins |
| `expo-router` **or** `@react-navigation/bottom-tabs` + `/native` | **58.0.23** or **7.21.0** + **7.5.1** | navigation (keep whichever you use; the TabBar works with both) |
| `react-native-screens` / `react-native-gesture-handler` | **4.30.0** / **~3.3.0** (SDK pin) | navigation deps |
| `react-native-pdf` + `react-native-blob-util` + `@config-plugins/react-native-pdf` + `@config-plugins/react-native-blob-util` | **7.0.5** + **0.25.1** + **14.0.2** + **14.0.2** | PDF reader (needs a **development build**, not Expo Go) |
| `react-native-gifted-charts` | **1.4.81** | assistant chart blocks (animated bars) |
| `expo-document-picker` / `expo-image-picker` / `expo-camera` | **58.0.4** / **58.0.10** / **58.0.10** | admit card upload, "Take photo" |
| `zustand`, `date-fns` | **5.0.15**, **4.4.0** | small store, countdown maths (optional) |

**Install (Expo, recommended).** `npx expo install` picks the versions that match your SDK:

```bash
npx expo install react-native-reanimated react-native-worklets expo-blur expo-linear-gradient react-native-svg \
  @shopify/react-native-skia @react-native-masked-view/masked-view expo-haptics expo-font @expo-google-fonts/urbanist \
  react-native-safe-area-context expo-document-picker expo-image-picker expo-camera
npm i react-native-fast-confetti@2.0.2 react-native-gifted-charts@1.4.81 zustand@5.0.15 date-fns@4.4.0
# PDF reader (development build required):
npx expo install react-native-pdf react-native-blob-util @config-plugins/react-native-pdf @config-plugins/react-native-blob-util
npm i -D react-native-svg-transformer@1.5.3
```

Add the PDF plugins to `app.json` → `"plugins": ["@config-plugins/react-native-pdf", "@config-plugins/react-native-blob-util"]`, then make a development build with `npx expo run:ios`, `npx expo run:android` or `eas build --profile development`.

**Bare React Native (no Expo):** install the same versions with `npm i …@version`. Add `npx install-expo-modules@latest` for `expo-blur`, `expo-linear-gradient`, `expo-haptics` and `expo-font`, run `cd ios && pod install`, and add `'react-native-worklets/plugin'` as the **last** Babel plugin. Expo's `babel-preset-expo` adds it for you.

**Requirements**
- **New Architecture.** Required for `boxShadow`, which gives the clay, recess and ink looks. It's the default since Expo SDK 53, and RN 0.82+ runs only on the New Architecture. If your app is older, upgrade first (Phase 0, step 5).
- **Expo Go.** Everything except `react-native-pdf` works in Expo Go. Use a development build once you add the PDF reader.
- **Minimum OS.** iOS 15.1+. Android 7+, but the live Android blur-in needs Android 12 (API 31); older Android gets a plain fade.

---

## 3. Phase 0 · Prepare your project

Small steps first, so nothing breaks.

1. **Make a branch:** `git checkout -b redesign/clear-glass`.
2. **Take "before" screenshots** of every screen on an iPhone 15/16 simulator and one Android emulator (Pixel 8). Save them in `design/before/` for comparing later.
3. **Copy the folders:** `/design` and `CLAUDE.md` (see §0). Don't copy `native/` yet; that happens in Phase 1.
4. **Check your versions:**
   ```bash
   npx expo --version && npx expo-doctor
   grep -E '"(expo|react-native|react|react-native-reanimated|nativewind|expo-router|@react-navigation/native)"' package.json
   grep -n "newArchEnabled" app.json android/gradle.properties 2>/dev/null
   ```
5. **If you're below SDK 58 / RN 0.88, upgrade first** (one SDK at a time if you're far behind):
   ```bash
   npx expo install expo@^58.0.0 --fix
   npx expo-doctor
   ```
   Fix what expo-doctor reports, run the app, and commit `chore: expo sdk 58`. If you can't upgrade yet, the kit still works on **SDK 53+ / RN 0.79+ with the New Architecture**. Below that, `boxShadow` is missing; use `legacyShadow` from `theme.ts` and accept that the inset shadows disappear.
6. **Find every hard-coded colour:**
   ```bash
   grep -rnoE "#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b|rgba?\([^)]*\)" app src --include=*.tsx --include=*.ts | sort | uniq -c | sort -rn | head -80
   ```
   Keep this list. You'll replace each colour with a token in Phase 1 (mapping table in §4.7).
7. **Find every pressable:**
   ```bash
   grep -rnE "<(TouchableOpacity|TouchableHighlight|TouchableWithoutFeedback|Pressable|Button)\b" app src | wc -l
   ```
   You'll replace these with `SoftButton`, `IconButton` or `PressableScale` in Phase 2.
8. **Commit:** `chore: add design handoff`.

---

## 4. Phase 1 · Foundations

### 4.1 Install the libraries
Run the install block from §2. Then restart Metro with a clean cache: `npx expo start -c`.

### 4.2 Copy the kit
```
src/ui/          ← design/native/   (theme.ts, motion.ts, index.ts, components/, examples/)
```
Add a path alias so screens can `import { SoftButton } from "@/ui"`:
```jsonc
// tsconfig.json
{ "compilerOptions": { "baseUrl": ".", "paths": { "@/*": ["src/*"] } } }
```
(Expo SDK 50+ reads `paths` automatically. On bare RN, add `babel-plugin-module-resolver`.) Delete `src/ui/examples/` once you've read them, or keep them out of your app's routes.

### 4.3 Fonts: Urbanist
```tsx
// app/_layout.tsx (expo-router), or App.tsx
import { useFonts, Urbanist_400Regular, Urbanist_500Medium, Urbanist_600SemiBold, Urbanist_700Bold } from "@expo-google-fonts/urbanist";
import * as SplashScreen from "expo-splash-screen";
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({ Urbanist_400Regular, Urbanist_500Medium, Urbanist_600SemiBold, Urbanist_700Bold });
  useEffect(() => { if (loaded) SplashScreen.hideAsync(); }, [loaded]);
  if (!loaded) return null;
  return /* your providers + navigator */;
}
```
**Rule:** never set `fontWeight` with a custom font, because Android ignores it. Use `fontFamily: fontFamily[600]` from `theme.ts`, or the ready text styles in `type` (`type.display`, `type.button`, …).

### 4.4 Reanimated 4
- **Expo:** nothing to do. `babel-preset-expo` already adds the worklets plugin.
- **Bare:** `babel.config.js` → `plugins: [/* others */, "react-native-worklets/plugin"]`, plugin listed last.
- Every preset in `motion.ts` passes `ReduceMotion.System`, so the OS "Reduce motion" switch is honoured automatically.

### 4.5 SVG files as components (optional)
To use `assets/icons/*.svg` directly (`import Search from "@/assets/icons/search.svg"`):
```js
// metro.config.js
const { getDefaultConfig } = require("expo/metro-config");
const config = getDefaultConfig(__dirname);
config.transformer.babelTransformerPath = require.resolve("react-native-svg-transformer/expo");
config.resolver.assetExts = config.resolver.assetExts.filter((e) => e !== "svg");
config.resolver.sourceExts.push("svg");
module.exports = config;
```
```ts
// declarations.d.ts
declare module "*.svg" { import type { FC } from "react"; import type { SvgProps } from "react-native-svg"; const C: FC<SvgProps>; export default C; }
```
The icons use `stroke="currentColor"`, so colour them with `<Search color="#111113" width={22} height={22} />`. **Don't** use `sprite.svg` in React Native, because external `<use href>` isn't supported. Without the transformer, use `<Icon d={ICON.search} />` from the kit, which already contains the paths you need.

### 4.6 White background everywhere
- `Screen` (from the kit) paints `#FFFFFF`. Also set the navigator background so there's no grey flash between screens:
  ```tsx
  // expo-router Stack / Tabs, or React Navigation navigators
  screenOptions={{ contentStyle: { backgroundColor: "#FFFFFF" } }}        // native-stack
  <NavigationContainer theme={{ ...DefaultTheme, colors: { ...DefaultTheme.colors, background: "#FFFFFF" } }}>
  ```
- `app.json`: `"backgroundColor": "#FFFFFF"`, splash `"backgroundColor": "#FFFFFF"`, `"userInterfaceStyle": "light"`.
- Status bar: `<StatusBar style="dark" />` (expo-status-bar).
- Remove every old screen background (`#EDECE8`, `#F4F2EE`, splash lavender `#C9C0DB`).

### 4.7 Replace old colours (search → replace with tokens)

| Old value | New token (`theme.ts`) | Where it was used |
|---|---|---|
| `#EDECE8`, `#F4F2EE`, `#C9C0DB` | `color.ground` `#FFFFFF` | screens, splash |
| `#F7F6F3` | `color.input` `#F4F6FA` | text inputs |
| `#ECEAE5` / `#E4E1DA` / `#E6E3DD` | `color.skeleton` `#EEF0F4` / `color.line` `#E8EBF0` | skeletons, borders |
| `#D9D5CD` / `#DAD6CF` | `color.line2` `#E2E6EC` | dividers, empty step bars |
| `#CFCAC1` / `#BDB8AE` | `color.lineStrong` `#CBD2DC` / `color.checkRing` `#C2C9D4` | outline chips, dashed buttons, unchecked ring |
| `#5C5866` / `#77727F` / `#8E8996` / `#A9A4B0` | `color.inkMuted` `#5B6475` / `color.inkSubtle` `#6B7385` / `color.placeholder` `#8A92A3` / `color.strike` `#A0A8B8` | muted text |
| `#D6CDE6` / `#C5BADB` / `#3E3557` / `#4A4260` / `#7D6BAA` | `subject.SE.fill` / `.deep` / `.text` / `.textMuted` / `.mark` | SE |
| `#EBD3D7` / `#DDB5BD` / `#6B3440` / `#B86A7A` | `subject.DAA.fill` / `.deep` / `.text` / `.mark` | DAA |
| `#CFE6E0` / `#A9D3C8` / `#24524A` / `#4F9686` | `subject.DDS.fill` / `.deep` / `.text` / `.mark` | DDS |
| `#8C7BB5` / `#E9C4CC` / `#BFE0D8` | `color.artBlue` / `color.artViolet` / `color.artGreen` | decorative circles |
| `#E9DFF7` | `color.highlighter` `#E3EEFF` | PDF highlight |
| `#FEF3DC` / `#7A5300` | `color.warnBg` / `color.warnText` | heads-up |
| `#FDE7E4` / `#9A3B33` | `color.errorBg` / `color.errorText` | **real errors only** |
| `shadowColor` purple, `rgba(40,30,60,x)` | `boxShadow` with `rgba(15,23,42,x)` (use `Surface`) | shadows |
| `#1B1B1F` as a **background** (buttons, selected) | `Surface kind="ink"` (see Phase 2) | — |

✅ **Done when:** every screen is white, uses the new subject colours and the Urbanist font, and the app runs on iOS and Android. Commit: `style: clear glass tokens`.

---

## 5. Phase 2 · Buttons

Your reference clip defines one family of buttons. **Use it for every pressable thing.**

### 5.1 The five materials (`<Surface kind=…>`)

| Kind | Look | Used for |
|---|---|---|
| **`clay`** | raised soft pill or circle: white→`#E9E9EB` gradient + layered soft shadow | primary buttons, icon buttons (search, more, back, eye, edit, prev/next), Google, "Take photo", "Read again" |
| **`recess`** | pressed-in groove: `#DEDEE1→#E9E9EB` + inner shadow | active tab, selected toolbar item, toggled round button (highlighter / pen) |
| **`dock`** | container: `#FFFFFF→#F0F0F2` + soft drop shadow | tab bar, reader toolbar, tool dock |
| **`ink`** | glossy black: `#4A4A4F→#1C1C1F→#0E0E10` + top highlight | arrow chip inside primary buttons, ↗ / ⊕ / send circles, selected chips & semester, login slider, logo tile, quick-add + |
| outline / dashed | plain `View` with `borderWidth: 1.5, borderColor: #CBD2DC` (+ `borderStyle: "dashed"`) | unselected chips, unselected semester, "Add topic", "Add an exam we missed" |

Exact values (these are in `theme.ts → surface`):
```ts
clay:   colors ["#FFFFFF","#F1F1F2","#E9E9EB"] @ [0,.6,1]
        boxShadow "inset 0px 1px 0px #FFFFFF, inset 0px -2px 5px rgba(0,0,0,0.035), 0px 0px 0px 1px rgba(0,0,0,0.045), 0px 1px 2px rgba(0,0,0,0.06), 0px 10px 24px rgba(0,0,0,0.07)"
recess: colors ["#DEDEE1","#E9E9EB"]
        boxShadow "inset 0px 2px 6px rgba(0,0,0,0.13), inset 0px -1px 0px rgba(255,255,255,0.9)"
dock:   colors ["#FFFFFF","#F0F0F2"]
        boxShadow "inset 0px 1px 0px #FFFFFF, 0px 0px 0px 1px rgba(0,0,0,0.05), 0px 2px 4px rgba(0,0,0,0.05), 0px 16px 34px rgba(0,0,0,0.10)"
ink:    colors ["#4A4A4F","#1C1C1F","#0E0E10"] @ [0,.55,1]
        boxShadow "inset 0px 1px 0px rgba(255,255,255,0.22), inset 0px -1px 0px rgba(0,0,0,0.4), 0px 1px 2px rgba(0,0,0,0.25), 0px 8px 18px rgba(0,0,0,0.18)"
```
Thin progress fills (8 pt tall or less: step bars, segment bars, the splash load bar) use flat **`#151517`** (`color.inkFlat`), not the gradient.

> **Why `Surface` and not just a style:** a CSS inset shadow paints above the background. In RN the gradient is a child view and would cover it. `Surface` stacks outer shadow → gradient → inset overlay → children, so it looks exactly like the design.

### 5.2 Behaviour (every button)
- **Press:** spring to `scale .96` (small round buttons `.92`, list rows `.98`), opacity `.94`, plus `Haptics.selectionAsync()`. Spring stiffness 500, damping 30.
- **Disabled:** 45% opacity, no motion, `accessibilityState={{ disabled: true }}`.
- **Accessibility:** `accessibilityRole="button"` and an `accessibilityLabel` on every icon-only button. Toggles use `accessibilityState={{ selected }}`.
- **Touch target:** at least 44 pt. `IconButton` adds `hitSlop` automatically below 44.
- **Reduce motion:** no scale, opacity only (built in).

### 5.3 Step by step
1. **Primary buttons** (Let's begin, Sign in, Create account, Continue, Looks right — build my plan, Open my plan, Choose file…):
   ```tsx
   import { SoftButton } from "@/ui";
   <SoftButton variant="primary" onPress={next}>Continue</SoftButton>
   ```
   This renders a 62 pt clay pill: an 18/600 black label 28 pt from the left, and a 46 pt glossy black chip with a white arrow 8 pt from the right. Use `large` for the 64 pt splash button.
2. **Secondary** (Google, Take photo, Adjust with study assistant): `variant="secondary"`.
   **Google** must follow Google's branding rules:
   - Use `borderColor="#747775"`.
   - Use the official 4-colour G as `leading`.
   - The label is "Continue with Google".
   - Use `@react-native-google-signin/google-signin@16.1.5` (development build), or `expo-auth-session`, for the sign-in itself.
3. **Icon buttons:**
   ```tsx
   <IconButton label="Search"><Icon d={[...ICON.search]} /></IconButton>          // 56
   <IconButton label="Back" size={52}><Icon d={ICON.chevronLeft} /></IconButton>   // onboarding
   <IconButton label="Open SE" tone="ink" size={52}><Icon d={ICON.arrowUpRight} color="#fff" /></IconButton>
   ```
4. **Toggles** (password eye, highlighter, pen): `<IconButton label="Show password" pressed={shown} …>`. When `pressed` is true it shows the recess groove.
5. **Selected states** (semester, filter chips, "✓ Revised"): use `variant="ink"` when selected and `variant="outline"` when not.
6. **"Add…" buttons:** `variant="dashed"`.
7. **Anything else tappable** (cards, rows): wrap it in `<PressableScale amount="row">` so it feels the same.
8. **Remove the old buttons.** Delete your old `Button`/`TouchableOpacity` wrappers, or make them render `SoftButton` so existing imports keep working.

✅ **Done when:** no button in the app has a flat black or flat white background, and every button squeezes softly with a haptic tick. Commit: `feat: soft clay buttons`.

---

## 6. Phase 3 · Glass cards, subject cards, fields

### 6.1 Glass card (every white card)
```tsx
<GlassCard>…</GlassCard>                    // radius 34, padding 20
<GlassCard radius={28} padding={16}>…</GlassCard>  // inner panels, material rows
```
- **iOS:** `BlurView` (intensity 40, tint "light"), then a gradient `rgba(255,255,255,.78) → rgba(248,250,253,.55)` at 160°, an inset hairline `rgba(15,23,42,.07)` and an outer shadow `0 14px 36px rgba(15,23,42,.07)`.
- **Android:** the same, but the gradient is 94% → 90% white and there's no live blur.

Use it for:
- the "Today's revision" card, the Topics card and the Notes & PDFs card
- question cards
- the calendar month card and the plan day list
- the PDF page sheet
- the admit-card drop zone
- material rows (radius 28)
- assistant bubbles

**Don't** use glass on cards that overlap each other (stacked flashcards in onboarding). Use a plain white `View` there, or the layers look muddy.

### 6.2 Subject (tinted) cards
```tsx
<SubjectCard subject="SE">                 {/* fill #DCEBFF + white sheen + inner highlight */}
  <View style={{ padding: 14 }}>…title…</View>
  <StatPanel subject="SE">…stats…</StatPanel>   {/* solid deep fill #BFD6FF, radius 28, 176 tall */}
</SubjectCard>
```
- **Stat column dividers:** `subject.SE.divider` (the subject's text colour at 18%).
- **Decorative circles inside the panel** (absolute, `borderRadius: 9999`):
  - `#3B82F6`, 120 pt
  - `#DDD0FF`, 96 pt
  - a 72 pt ring: `borderWidth: 1.5`, `borderColor: "rgba(255,255,255,.8)"`
  - an 18 pt white dot
- **Subject pill rows** (DAA / DDS on Today, results on Admit card):
  - a full pill (`borderRadius: 9999`) in `subject.X.fill`
  - a 52 pt circle in `.deep` with the code in `.text`, 14/700
  - the title 16/600
  - the meta 14 in `.text`

### 6.3 Fields
```tsx
<Text style={{ fontFamily: fontFamily[600], fontSize: 13, color: color.inkMuted }}>Email</Text>
<TextInput
  style={{ backgroundColor: focused ? "#FFFFFF" : color.input, borderRadius: radius.input, paddingHorizontal: 18, height: 56,
           fontFamily: fontFamily[500], fontSize: 17, color: color.ink, borderWidth: 2, borderColor: focused ? color.ink : "transparent" }}
  placeholderTextColor={color.placeholder}
  onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
/>
```

### 6.4 Status boxes
| Box | Background / text |
|---|---|
| Info | `#E3EEF8` / `#2C5577` |
| Success | DDS green `#D9F5E6` / `#065F46` |
| Heads-up | `#FEF3C7` / `#92400E` |
| Error | `#FEE2E2` / `#B91C1C` — **real errors only**, never exams or deadlines |

The admit-card privacy note uses the DDS green box with a lock icon.

✅ **Done when:** every card is glass or tinted with a sheen, and fields use the new input colour. Commit: `style: glass surfaces`.

---

## 7. Phase 4 · Navigation, segmented control, chips

### 7.1 Bottom tab bar (`TabBar`)
- **Position:** floats 20 pt from the sides and 24 pt + safe-area from the bottom, max width 440, centred.
- **Container:** the **dock** material, 8 pt padding, gap 8.
- **Inactive tab:** a 56 pt circle with no background and a 22 pt icon.
- **Active tab:** grows (`flex: 1`, 520 ms `bezier(.2,.9,.25,1.04)` — `tabGrow`) and shows a 20 pt icon plus its label (16/600, `#111113`) inside the **recess groove**.
- **The groove:** one view that springs to the active tab's measured frame. The label slides 6 pt in from the left 180 ms later, over 320 ms.
- **Accessibility:** `accessibilityRole="tab"`, with `accessibilityState={{ selected }}` on each tab.

```tsx
// expo-router: app/(tabs)/_layout.tsx
<Tabs tabBar={(p) => <TabBar {...p} />} screenOptions={{ headerShown: false, animation: "fade" }}>
  <Tabs.Screen name="index" options={{ title: "Today" }} />
  <Tabs.Screen name="calendar" options={{ title: "Calendar" }} />
  <Tabs.Screen name="subjects" options={{ title: "Subjects" }} />
  <Tabs.Screen name="questions" options={{ title: "Questions" }} />
</Tabs>
```
React Navigation 7 is the same, with `<Tab.Navigator tabBar={…}>` (see `native/examples/TabsLayout.example.tsx`). Icons are matched by route name: `index`/`today`, `calendar`, `subjects`, `questions`. If your routes have other names, edit `ICONS` in `TabBar.tsx`.

Content must clear the bar. `Screen` adds 128 pt bottom padding plus the safe-area inset (`withTabBar`, on by default).

### 7.2 Segmented control (Login "Sign in | Create account")
A white pill track with 6 pt padding. The selected option sits on a **glossy black slider** (spring 400/34) and its label turns white.
```tsx
<SegmentedControl value={mode} onChange={setMode} options={[{ value: "in", label: "Sign in" }, { value: "up", label: "Create account" }]} />
```

### 7.3 Filter chips (Subjects, Questions, Materials)
A plain white 52 pt circle with the filter icon, then 52 pt chips. The selected chip is **glossy black** with white 16/600 text; the others are transparent with a 1.5 pt `#CBD2DC` ring. The row scrolls horizontally.
```tsx
<FilterChips value={filter} onChange={setFilter} chips={[{ value: "all", label: "All" }, { value: "SE", label: "SE" }, { value: "DAA", label: "DAA" }, { value: "DDS", label: "DDS" }]} />
```

✅ **Done when:** the groove slides smoothly between tabs on both platforms, and chips switch between ink and outline. Commit: `feat: clay tab bar + chips`.

---

## 8. Phase 5 · Blur motion everywhere

The "blurry animation" from your clip covers four things:

| # | Effect | Spec | How (kit) |
|---|---|---|---|
| 1 | **Blur-in entrances** | each block rises 12 pt and fades in while going from blurred to sharp, 480 ms `bezier(.05,.7,.1,1)`, blocks 60 ms apart | `<BlurIn index={n}>` |
| 2 | **Screen change** | entrances replay every time a screen gains focus; navigator cross-fades | `<Screen>` + `animation: "fade"` on Tabs / Stack |
| 3 | **Press** | scale .96 + haptic | built into every button (`PressableScale`) |
| 4 | **Focus blur** (reader) | lines further from the focus get blurrier (0 / 0.4 / 1.6 px); edges fade through a progressive blur | `BlurReader`, `ProgressiveBlur` |

Smaller ones (presets in `native/motion.ts`):
- Rows and results: `<BlurIn soft>` (8 pt rise, 260 ms).
- Chat bubbles: `entering={messageIn}`.
- Menu items fly in: `quickAddItemIn(i)`.
- Typed digits pop: `digitIn`.
- Mode swaps blur out → in: `<BlurIn key={mode} amount={blur.swap} ms={520} rise={0}>`.

### How `BlurIn` works (so you can trust it)
1. Reanimated `entering` fades the block in and moves it up 12 pt.
2. At the same time, an `expo-blur` `BlurView` covers the block at intensity 28 (≈ CSS 10 px). Its `intensity` animates to 0 on the UI thread, then the veil unmounts.
3. Platform behaviour:
   - **iOS:** the BlurView blurs the block directly.
   - **Android 12+:** the block is wrapped in `BlurTargetView` and the veil blurs that target.
   - **Android < 12:** fade + rise only.
   - **Reduce motion:** no blur, no rise.

### Step by step
1. **Every screen:** wrap the content in `<Screen>`, and wrap each block (top bar, header, hero card, list card, …) in `<BlurIn index={0…n}>`. See `native/examples/TodayScreen.example.tsx`.
2. **Navigator transitions:**
   - Tabs: `screenOptions={{ animation: "fade" }}`.
   - Native stack: `animation: "fade"` for modal-like screens, the default slide for drill-downs.
   - `Screen` replays the blur-in on focus, so tabs feel like the web's blurred page change.
3. **Lists that change** (calendar day list, subject switch, filter results):
   - Give the list a `key` from the selection so it remounts.
   - Wrap each row in `<BlurIn soft index={i}>`.
   - For `FlatList`, use `Animated.FlatList` with `itemLayoutAnimation={layout}` for reorders.
4. **Accordions** (Questions): render the answer conditionally inside `Animated.View layout={layout}`, with the answer itself in `<BlurIn soft rise={0}>`.
5. **Performance rule:** blur-in only the **block wrappers** (5–10 per screen, ≤ 520 ms), never single words or icons. Each `BlurIn` is a live blur view for under half a second, then it's gone.
6. **Reduce motion:** test it.
   - iOS: Settings → Accessibility → Motion → Reduce Motion.
   - Android: Settings → Accessibility → Remove animations.
   - Expected: no blur, no loops, no auto-advance, no confetti.

✅ **Done when:** every screen arrives softly out of focus on both platforms, buttons squeeze with a tick, and nothing blurs with Reduce Motion on. Commit: `feat: blur motion`.

---

## 9. Phase 6 · Screen by screen

Layout, copy and flows don't change from your current build. This section lists **only what to change** on each screen, plus the target screenshot.

> Real data:
> - SE: **Wed 21 Oct 2026, 2:00 PM**
> - DAA: **Thu 22 Oct 2026, 2:00 PM**
> - DDS: **Fri 23 Oct 2026, 2:00 PM**
>
> "Today" in the design is Sun 18 Oct 2026. Everything else is sample content and must be labelled "Sample".

### 01 · Splash: `screenshots/01-splash-animated.png`
Use `<SplashIntro onBegin={…} />` (drop-in). It shows:
- **Background:** white.
- **Circles:** blue `#3B82F6` 130, violet `#DDD0FF` 118, green `#BBF0D3` 96, blooming at 0 / 140 / 280 ms.
- **Logo tile:** 80 pt, radius 28, **glossy black**. The paper plane draws in 700 ms starting at 500 ms.
- **Wordmark:** "ExamPilot", 60/600, with each letter blur-rising (22 pt) at 700 ms + 45 ms × i.
- **Tagline:** 19 pt in `#1E3A8A`, at 1200 ms.
- **Load bar:** 4 pt on `#E8EBF0`, fill `#151517`, from 400 to 1900 ms.
- **CTA:** a 64 pt primary SoftButton ("Let's begin") at 1700 ms.
- **Orbit:** one glossy dot on a 14 s loop (off with reduce motion).

Show it on first launch only (`AsyncStorage` / `expo-secure-store` flag), and hide the native splash as it mounts.

### 02 · Login: `02-login.png`, `02b-login-create-account.png`
1. **Corner circles:** SE fill 130 pt and DAA fill 110 pt, plus a 1.5 pt white ring.
2. **Logo tile:** 52 pt, radius 18, `Surface kind="ink"`.
3. **Mode switch:** `SegmentedControl`.
4. **Fields:** §6.3. The eye toggle is `IconButton size={44} pressed={shown}`.
5. **Sign in / Create account:** `SoftButton variant="primary"`.
6. **Google:** `variant="secondary"` + `borderColor="#747775"` + the official G.
7. **Motion:** fields blur in with `<BlurIn index>` (60 ms stagger).
8. **Keyboard:** wrap the form in `KeyboardAvoidingView behavior="padding"` (iOS).

### 03 · Your details: `03-your-details.png`
1. **Back:** `IconButton size={52}`.
2. **Step bar:** 3 segments, 6 pt tall. Done segments are `#151517`, todo segments `#E2E6EC`. The current segment fills with `scaleX` from 0 → 1 (`transformOrigin: "left"`, 600 ms).
3. **Avatar:** 72 pt in the SE fill with SE text initials. It pops (`popIn`) on change.
4. **Semester chips:** 48 pt. Selected is `variant="ink"`, the others `variant="outline"`.
5. **Continue:** primary.

### 04 · Admit card: `04-admit-card-upload.png`, `04b-…-scanning.png`, `04c-…-results.png`
1. **Drop zone:** a `GlassCard` with a dashed 2 pt `#CBD2DC` border (`borderStyle: "dashed"`), radius 34.
   - Upload badge: 84 pt in the SE fill, bobbing `translateY` ±4 on a 2.4 s `withRepeat` loop.
2. **Buttons:**
   - "Choose file": a small ink pill. It opens `expo-document-picker` (`type: ["application/pdf","image/*"]`).
   - "Take photo": clay secondary. It opens `expo-image-picker` `launchCameraAsync`, or `expo-camera`.
   - "Try a sample": outline.
3. **Privacy note:** DDS green box with a lock icon.
4. **Scanning state:**
   - A glass card 250×320 with skeleton rows `#EEF0F4` / `#E2E6EC`, plus colour rows in the three subject fills.
   - The scan line is `#151517` with a **blue glow**: `boxShadow: "0px 0px 18px 6px rgba(59,130,246,0.55)"`. It loops top → bottom over 1.6 s with `withRepeat(withTiming)`.
   - Text "Reading your exam dates…" with blinking dots.
5. **Results:**
   - Subject pill rows (§6.2), each with a white 56 pt date tile and a 44 pt translucent edit button (`rgba(255,255,255,.7)`).
   - A dashed "Add an exam we missed".
   - Primary "Looks right — build my plan".
   - Rows come in with `<BlurIn soft index>` 120 ms apart (`delay={i*120}`).

### 05 · Plan ready: `05-plan-ready.png`
1. **Success badge:** 104 pt `Surface kind="ink"`. A white tick draws in (animated `strokeDashoffset`), then a burst of 14 dots in blue / violet / green / ink, each flying out via `entering` keyframes. Call `celebrate.current?.fire()`.
2. **Stat tiles:** `SubjectCard` × 3.
3. **Day list:** `GlassCard`. Study chips use the subject fill; exam chips are `Surface kind="ink"` with a coloured dot.
4. **Actions:** "Open my plan" primary; "Adjust with study assistant" secondary.

### 06 · Today: `06-today.png`, `06b-today-all-done.png`
See `native/examples/TodayScreen.example.tsx`.
1. **Top bar:**
   - Avatar: 56 pt in the SE fill (user icon `#1E3A8A`).
   - Search and More: clay `IconButton`s.
2. **Header:** eyebrow "Good morning" 20/500 `#5B6475`, title "Your Exam Week" 46/600.
3. **Hero card:** **`SubjectCard subject="SE"`**.
   - "Next exam" 14/600 `#1E40AF`, title 28/600, date 15 pt `#1E40AF`.
   - A 48 pt outline ⋯ button (`borderColor: "rgba(30,58,138,.25)"`).
   - `StatPanel`: Days **3** (54/600) "to prepare", Topics **4/6** (40/600), the art circles, and a **glossy black ↗ (52 pt)**.
4. **DAA / DDS pill rows:** violet / green (§6.2).
5. **"Today's revision":** a `GlassCard`.
   - Segment bar 8 pt: done `#151517`, todo `#EEF0F4`.
   - `AnimatedCheckbox` rows (glossy black when checked).
   - Footer "One topic at a time." plus a dashed "Add topic".
6. **All done:** the completion card blurs in, and `celebrate` fires once.
7. **New (optional):** `GooeyIsland` at the very top, and `QuickAddMenu` via `Screen overlay` (§10).

### 07 · Calendar: `07-calendar.png`, `07b-calendar-exam-day.png`
1. **Header buttons:** the "Today" pill is a small clay secondary; prev/next are clay `IconButton size={48}`.
2. **Month card:** a `GlassCard`.
   - Selected day: an **ink** 38 pt circle with a white number.
   - Today: a 2 pt ink ring.
   - Other-month days: `#B8C0CC`.
   - Exam markers: 12×6 pills in the subject marks (`#2563EB`, `#7C3AED`, `#10B981`).
   - Study days: a 6 pt hollow ring.
3. **Add:** ⊕ is `IconButton tone="ink"`.
4. **Event rows:**
   - Exam: a subject-fill pill with an **ink** 52 pt "2 PM" circle.
   - Study: a glass pill with a subject circle.
5. **Day change:** the selected-day list remounts with `key={day}` and `<BlurIn soft index>`.
6. **New (optional):** the study-block range picker for "Add session" (§10.8).

### 08 · Subjects: `08-subjects.png`, `08b-subjects-daa.png`
1. **Filter:** `FilterChips` SE / DAA / DDS.
2. **Hero:** a `SubjectCard` in the chosen subject.
   - The panel uses the deep fill.
   - Stats: Topics, PDFs.
   - Exam date: a small ink pill with the calendar icon + "21 Oct".
3. **Topic segments:** 8 pt. Done segments are `#151517`, on `rgba(255,255,255,.75)` (on a tint) or `#EEF0F4` (on glass).
4. **Lists:** Topics and Notes & PDFs are `GlassCard`s. PDF rows are glass pills. "Add a PDF" is dashed.
5. **Switching subject:** the whole section **blur-swaps**: `<BlurIn key={subject} amount={blur.swap} ms={520} rise={0}>`.

### 09 · Questions: `09-questions.png`, `09b-questions-filtered-dds.png`
1. **Filter:** `FilterChips` All / SE / DAA / DDS.
2. **Progress card:** an SE `SubjectCard`, "Revised 3/8", with 8 segments.
3. **Question cards:** `GlassCard radius={30}`.
   - Subject tag, "✓ Revised", question 18/600.
   - A 40 pt chevron circle: clay, **ink** when open, rotating 180° with `withSpring`.
4. **Answer:** a box with background `#F6F7F9`, which appears with the accordion pattern (§8 step 4).
5. **Mark as revised:** "Mark as revised" is an outline pill; it becomes the ink pill "✓ Revised".

### 10 · Study materials: `10-study-materials.png`, `10b-study-materials-add-sheet.png`
1. **Rows:** glass, radius 28, each with a 52 pt subject-tinted tile.
2. **Floating "Add material":** an **ink** pill with a breathing shadow. Loop the outer `boxShadow` blur 18 ↔ 26 over 2.8 s, or loop `scale` 1 ↔ 1.02 if that's smoother on Android.
3. **Add sheet:**
   - Use `@gorhom/bottom-sheet` (if you already have it) or a `Modal` with `animationType="slide"`.
   - White, radius 36 at the top, handle 44×5 `#E2E6EC`, scrim `rgba(27,27,31,.32)`.
   - Tiles in the SE / DAA / DDS fills plus muted `#F6F7F9`.
4. **New (optional):** replace the FAB with `QuickAddMenu`.

### 11 · Study assistant: `11-study-assistant.png`, `11b-study-assistant-reply.png`
1. **Avatar:** an SE-fill circle with a sparkle and a slowly rotating glow (`withRepeat`, 3 s).
2. **Bubbles:**
   - Assistant: glass, corner radii 26/26/26/8 (`borderBottomLeftRadius: 8`).
   - User: `Surface kind="ink"` (26/26/8/26) with white text.
   - Both arrive with `entering={messageIn}`.
3. **Plan card:** rows in the subject fills. "Add to calendar" turns into a green "Added to calendar".
4. **Chart:** `react-native-gifted-charts` `BarChart` with `isAnimated`, `animationDuration={800}`, bars `frontColor` = subject **marks** (`#2563EB`, `#7C3AED`, `#10B981`), `barBorderRadius={8}`, no rules or axis lines.
5. **Input bar:** attach is a clay `IconButton`; send is `IconButton tone="ink"`. Wrap it in `KeyboardAvoidingView`.
6. **Streaming text:** render the assistant reply in a `<BlurIn soft rise={0}>` once complete. For long answers, offer "Focus read" (§10.1).

### 12 · PDF reader: `12-pdf-reader.png`, `12b-pdf-reader-finished.png`
1. **PDF view:** `react-native-pdf` (`<Pdf source={{ uri }} onPageChanged={…} enablePaging />`) inside a `GlassCard radius={28}` sheet. Development build needed.
2. **Highlighter toggle:** `IconButton pressed`. The highlight colour is `#E3EEFF`.
3. **Progress:**
   - Track `#E8EBF0`, fill `#151517`.
   - The rocket knob is a clay circle. Clamp its `left` to `Math.min(pct * trackWidth, trackWidth - 14)`.
4. **Page turns:** `entering` from 40 pt + 2° with `<BlurIn>` (`pageTurn` feel), `exiting` fade.
5. **Bottom bar:** prev/next clay circles; "✦ Ask about this page" primary. Or swap the whole bar for **`ToolDock`** (§10.5).
6. **Finished:** an SE `SubjectCard` that pops (`popIn`), plus `celebrate`.
7. **New:** a "Focus mode" button that opens the page text in **`BlurReader`** (§10.1).

---

## 10. Phase 7 · New features

Each feature lists what it is, where it goes, which component to use, the steps, and when it's done. Screenshots: `screenshots/M*.png`. Interactive sources: `reference/prototypes/Motion*.dc.html`, `BlurReader.dc.html`, `LiveIcons.dc.html`, `StudyBlockPicker.dc.html`.

### 10.1 Blur Reader / Focus read (your reference clip): `M9-blur-reader.png`
**What:**
- Reading lines drift up one at a time, every 2.6 s.
- The focused line is centred, bold and black. Its neighbours are grey and slightly blurred. The top and bottom edges fade through a progressive blur.
- A soft dock at the bottom holds three glossy black icons (Notes / Ask Pilo / Saved) with a sliding pressed-in groove.
- A round pen button highlights the focused line.

**Where:**
- PDF reader "Focus mode"
- revision notes on Subjects
- the assistant's long answers

**Steps:**
1. Use `BlurReader` from the kit (it uses `ProgressiveBlur`, `BlurIn`, `GlossIcon`).
2. Split the text into short lines (one sentence each):
   ```ts
   const lines = text.split(/(?<=[.!?])\s+/).filter(Boolean);
   ```
   For PDFs, `react-native-pdf` doesn't extract text. Get the page text from your backend; the AI pipeline in `docs/backend-and-ai.md` already extracts it when a PDF is uploaded. Store it per page and pass the current page's text.
3. Render it:
   ```tsx
   <BlurReader height={600} modes={[
     { id: "notes", label: "Notes", iconPath: READER_ICONS.notes, lines: noteLines },
     { id: "ask",   label: "Ask Pilo", iconPath: READER_ICONS.ask, lines: chatLines },
     { id: "saved", label: "Saved", iconPath: READER_ICONS.saved, lines: savedLines },
   ]} />
   ```
4. Exact behaviour:

   | Behaviour | Spec |
   |---|---|
   | Track drift | 900 ms `bezier(.65,0,.25,1)` |
   | Line style change | 700 ms |
   | Mode switch | blur-swaps 520 ms |
   | Groove | springs 400/34 |
   | Pen when on | rotates −18° and scales 1.1 (spring 420/16) |
   | Highlighter | wipes in from the left, 700 ms |
   | Tap a line | focuses it |
   | Touch | auto-advance pauses while a finger is down |
   | Reduce motion | no auto-advance, no blur |

5. Line blur by platform:
   - **iOS:** a small BlurView over each non-focused line (intensity ≈ 4 / 18).
   - **Android 12+:** native `filter: blur()`.
   - **Older Android:** colour only.

**Done when:** it matches the clip: smooth drift, a readable focus line, blurred edges and a sliding groove, at 60 fps on a mid-range Android phone in a **release** build.

### 10.2 Email code pill: `M1-email-code-pill.png`
**What:** one pill that morphs:
1. "Enter code"
2. 6 digit cells: digits pop in, the caret blinks
3. "Verifying…" with a spinner
4. "Verified ✓" in green

A wrong code shakes the pill and tints the cells with the error colour.

**Where:** between Login (Create account) and Your details, if you verify by code. With Firebase email-link sign-in, show it as the "check your inbox" step instead.

**Steps:** `<CodePill verify={(code) => api.verify(code)} />`. It uses a hidden `TextInput` with `keyboardType="number-pad"`, `textContentType="oneTimeCode"` (iOS autofill) and `autoComplete="sms-otp"` (Android).

### 10.3 Gooey study island: `M2-study-island.png`
**What:** a black pill at the top of Today, like Dynamic Island. A small blob melts into it (a Skia blur + alpha-threshold "goo"), and it stretches to show a status:
1. "SE in 3 days · tap to focus"
2. a focus timer
3. "All done ✓"

**Steps:**
1. Place `<GooeyIsland state={…} onPress={…} />` as the first block of Today.
2. Drive `state` from your focus-timer store: `{ kind: "idle" }` or `{ kind: "message", text, icon?, trailing? }`.

With reduce motion, the goo is off and the island just resizes.

### 10.4 Blur quick-add menu: `M4-quick-add-blur-menu.png`
**What:**
- A glossy black + (64 pt) above the tab bar.
- Tapping it blurs the whole screen behind a white veil (iOS live blur; Android 82% white).
- The actions (Study block, Material, Question, Ask Pilo) fly out of the button, last one first, and the + turns into ×.
- Tapping the veil or pressing Android back closes it.

**Steps:**
1. Pass it as `<Screen overlay={<QuickAddMenu actions={…} />}>` so it sits above the scroll view.
2. Hook each action up to your existing sheet or route.

### 10.5 PDF tool dock (bar → grid): `M5-pdf-tools.png`
**What:**
- A soft dock with 4 tools (highlight, note, bookmark, search) and a glossy black "more".
- "More" morphs the dock into a grid panel (layout spring 400/34).
- The extra tools pop in 35 ms apart: Summary, Flashcards, Quiz me, Ask Pilo, Read aloud (`expo-speech`), Focus 25, Share (`expo-sharing`), Focus read.

**Steps:**
1. `<ToolDock primary={[…]} more={[…]} />` replaces the PDF reader bottom bar.
2. Wire "Focus read" to open `BlurReader` with the current page's text.

### 10.6 Onboarding carousel: `M3-onboarding-carousel.png`
**What:** 3 slides before Login.
- **Slide 1:** exam cards drop in with rotation.
- **Slide 2:** a flashcard swings in.
- **Slide 3:** a medal and weekly bars.
- **Bottom:** prev/next round buttons, and a gold coin that slides along a progress track.
- **Final slide** ("Ready to ace it?"): a coin drops into a trophy, with "Create account" (primary) and "Log in" (secondary).

**Steps:**
1. Use a horizontal `Animated.ScrollView` with `pagingEnabled` (or `react-native-pager-view`).
2. Drive the coin with `useAnimatedScrollHandler` → `translateX = progress * trackWidth`.
3. Animate the cards with `dropIn(delay, rotate)` and `popIn` from `motion.ts`.
4. For the coin falling into the cup, use `withSequence` of `translateY` + `scale`. Timings are in `reference/prototypes/MotionOnboarding.dc.html` (`ep-coinfall` 1100 ms, `ep-cupbump`).
5. Show it only on first launch, after the splash. The illustration panels use the subject fills; buttons use clay / ink per Phase 2.

### 10.7 Live subject icons: `M7-live-subject-icons.png`
**What:** three small animated icons for subject chips, hero cards and empty states:
- SE: gears twisting (`rotate` loop)
- DAA: a radar sweep (rotating wedge, 2.4 s)
- DDS: tree nodes blinking (opacity loop, 3.6 s)

**Steps:**
1. Copy the SVG geometry from `reference/rendered-html/M7-live-subject-icons.html` into `react-native-svg`.
2. Wrap the moving parts in `Animated.View` with `withRepeat` loops.
3. Pause them when off-screen (`useIsFocused`) and with reduce motion.

### 10.8 Study block picker (range): `M8-study-block-picker.png`
**What:** a sheet for adding a study session. Pick a day, then drag a start/end range on a time track. The duration label blurs in as it changes.

**Steps:**
1. Build it with `react-native-gesture-handler` `Gesture.Pan()` on two handles. Snap to 15 min with `Math.round`.
2. Show the label with `<BlurIn key={duration} soft rise={0}>`.
3. Use it for Calendar ⊕ "Add session", and write the result to study sessions (`docs/data-model.md`).

### 10.9 Split tab bar motion: `M6-split-tab-bar.png`
An optional alternative nav animation, where the active tab splits away from its neighbours. The main `TabBar` (with the groove) is the default.

### 10.10 App icon & mascot: `app-icon-and-mascot.png`
1. Export `assets/illustrations/app-icon-1024.svg` to a 1024×1024 PNG (for example with `npx @resvg/resvg-js-cli`, or Figma).
2. Set `app.json` → `"icon"`, plus `android.adaptiveIcon.foregroundImage` (with white `backgroundColor`).
3. `expo prebuild` generates every size.

---

## 11. Phase 8 · QA, accessibility, performance

### Visual QA (per screen)
- [ ] An iPhone 15/16 simulator screenshot matches `screenshots/NN-*.png`. Overlay them at 50% opacity in Figma or Preview.
- [ ] Also check a small phone (iPhone SE, 375 pt), a large Android (Pixel 8 Pro) and a tablet. On tablets, centre a 480 pt column.
- [ ] Background is pure white, with no greige or lavender left: `grep -rn "EDECE8\|C9C0DB\|D6CDE6" app src`.
- [ ] Every button is clay, ink, outline or dashed, and the active tab is the groove.
- [ ] Inset shadows show on both iOS and Android. If they don't, the New Architecture is off.

### Accessibility
- [ ] **Text contrast is 4.5:1 or higher.** These pairs were checked:

  | Pair | Contrast |
  |---|---|
  | ink on white | 16.6 |
  | `#5B6475` on white | 5.9 |
  | `#6B7385` on white | 4.8 (captions only) |
  | SE text on SE fill | 9.0 |
  | DAA text on DAA fill | 7.6 |
  | DDS text on DDS fill | 7.3 |
  | white on ink | > 12 |
  | `#111113` on clay | > 15 |

- [ ] **VoiceOver (iOS) and TalkBack (Android):**
  - Every icon-only button has an `accessibilityLabel`.
  - Toggles announce selected.
  - Tabs announce "tab, selected".
  - Checkboxes announce checked.
  - The reader announces the focused line (`accessibilityLiveRegion` on Android).
- [ ] **Dynamic Type / font scale:** large display text (46/54/60) gets `maxFontSizeMultiplier={1.3}` so it doesn't break the layout. Body text scales freely.
- [ ] **Touch targets** are at least 44 pt (`hitSlop` where smaller).
- [ ] **Reduce motion** on both platforms: no blur, no loops, no auto-advance, no confetti.

### Performance (blur is the expensive part)
- [ ] Test in a **release build** (`npx expo run:ios --configuration Release`, `npx expo run:android --variant release`). Dev builds are much slower.
- [ ] Turn on the Perf Monitor (dev menu). The UI and JS threads should stay at 60 fps while scrolling Today and Subjects.
- [ ] No more than **~6 live BlurViews** on screen at once (glass cards on iOS + reader). In long lists, rows get a plain `rgba(255,255,255,.9)` background; keep glass only on the containing card.
- [ ] Entrances only blur for ≤ 520 ms, and only on block wrappers.
- [ ] If Android drops frames on a mid-range phone, use `soft` blur-ins or set `amount={0}` on Android via `Platform.select`.
- [ ] All animations run on the UI thread (Reanimated shared values). No `setState` in animation loops.

---

## 12. Claude Code prompts for each phase

Paste one at a time, and review the diff before moving on.

**Phase 0**
> Read `/design/EXAMPILOT-REDESIGN.md` and `/CLAUDE.md`. Don't change code yet. Report:
> - our Expo SDK, React Native, React, Reanimated and navigation versions
> - whether the New Architecture is on
> - every hard-coded colour in `app/` and `src/`, with file paths
> - every button, touchable and card component, with file paths

**Phase 0b** (only if below SDK 58)
> Upgrade the project to Expo SDK 58 following §3 step 5. Run `npx expo-doctor`, fix every issue, and tell me what changed.

**Phase 1**
> Do Phase 1 of `/design/EXAMPILOT-REDESIGN.md`:
> - install the libraries from §2
> - copy `/design/native` to `src/ui` and add the `@/*` path alias
> - load the Urbanist fonts in the root layout
> - make every screen and navigator background pure white
> - replace old colours with `theme.ts` tokens using the table in §4.7
>
> Run the app on iOS and Android and fix errors.

**Phase 2**
> Do Phase 2: replace every button following §5.3:
> - primary
> - secondary + Google rules
> - icon buttons
> - toggles with `pressed`
> - selected = ink
> - add = dashed
>
> Wrap other tappable cards in `PressableScale`. Remove old button styles. List every replacement.

**Phase 3**
> Do Phase 3:
> - every white card becomes a `GlassCard`
> - every subject-tinted card becomes a `SubjectCard` with a `StatPanel` where there are stats
> - fields follow §6.3
> - status boxes use the new colours

**Phase 4**
> Do Phase 4:
> - replace our tab bar with `TabBar` from `@/ui` (keep our routes, set `headerShown: false` and `animation: "fade"`)
> - the login switch becomes `SegmentedControl`
> - subject filters become `FilterChips`

**Phase 5**
> Do Phase 5:
> - wrap every screen in `Screen` and each block in `BlurIn` with increasing `index`
> - use `BlurIn soft` keyed by selection for changing lists
> - use the accordion pattern for answers
>
> Confirm that Reduce Motion removes all blur.

**Phase 6** (one screen per prompt)
> Apply §9 "06 · Today" exactly, using `native/examples/TodayScreen.example.tsx` as the pattern. Compare with `/design/screenshots/06-today.png` and `/design/reference/rendered-html/06-today.html`. List anything you couldn't match.

**Phase 7** (one feature per prompt)
> Add the Blur Reader from §10.1 as "Focus mode" in the PDF reader. Get the page text from our backend, split it into sentences, and pass it to `BlurReader`.

**Phase 8**
> Run the QA checklist in §11:
> - fix contrast, accessibility labels/roles/states and reduce-motion issues
> - report how many BlurViews each screen shows at once
> - report the frame rate on Android in a release build

---

## 13. Troubleshooting

| Problem | Fix |
|---|---|
| Clay buttons look flat, with no inner highlight or groove | `boxShadow` needs the New Architecture (RN ≥ 0.76). Check `newArchEnabled`, or upgrade (Phase 0 step 5). |
| Inset shadow hidden under the gradient | Use `<Surface>`, not a `LinearGradient` with `boxShadow` on the same view. Surface draws the inset layer above the gradient. |
| Shadow clipped | Don't put `overflow: "hidden"` on the view that has the outer shadow. Surface clips only its inner gradient layer. |
| Font looks bold or regular on Android regardless of weight | You set `fontWeight` with a custom font. Use `fontFamily: fontFamily[600]` instead. |
| `useFonts` never resolves | The font names must match exactly: `Urbanist_600SemiBold` and so on. Restart Metro with `-c`. |
| "Reanimated: failed to create a worklet" / plugin errors | Bare RN: `react-native-worklets/plugin` must be the **last** Babel plugin. Clear the cache with `npx expo start -c`. |
| Blur-in shows a white flash on Android | On Android < 12, `dimezisBlurViewSdk31Plus` falls back to a translucent view. That's expected (it reads as a fade). For no veil at all, pass `amount={0}` on old Android. |
| Blur-in does nothing on Android 12+ | The content must be inside `BlurTargetView`, and the BlurView must be a sibling, not a child. `BlurIn` already does this; check you didn't wrap `BlurIn` in another `BlurTargetView`. |
| Glass card is pure white | On a white screen that's correct. The blur shows when content scrolls behind (the tab bar over cards). On Android, glass is intentionally a solid translucent white. |
| Tab groove jumps instead of sliding | The groove needs the tabs' `onLayout`. Don't wrap tabs in extra views without passing `onLayout` through. Use the kit `TabBar` unchanged first. |
| Default tab bar still visible | Pass `tabBar={(p) => <TabBar {...p} />}`, and remove `tabBarStyle` overrides. |
| `react-native-pdf` crashes in Expo Go | It needs a development build: add the two `@config-plugins/*` plugins and run `npx expo run:ios` or `run:android`. |
| MaskedView TypeScript error with React 19 | Use the cast already in `ProgressiveBlur.tsx`. The runtime is fine. |
| Confetti plays with Reduce Motion | `CelebrateLayer` checks `useReducedMotion()` before firing; keep that check if you customise it. |
| Gooey island shows a grey halo | The goo needs solid black shapes. Don't add shadows or anti-aliased borders inside the Skia group. |
| Scroll jank on Android | Lower the number of glass cards, use `soft` blur-ins, test a release build, and remove BlurViews from list rows. |

---

## Appendix A · Every token

The source of truth in code is `native/theme.ts`. A machine-readable copy is in `design-tokens/tokens.json`.

### Colour
| Token (`color.`) | Hex | Use |
|---|---|---|
| ground | `#FFFFFF` | screen background (always) |
| input | `#F4F6FA` | fields, note boxes |
| surfaceMuted | `#F6F7F9` | answer boxes, quiet rows |
| skeleton | `#EEF0F4` | loading bars, empty segments |
| line | `#E8EBF0` | hairlines, tracks |
| line2 | `#E2E6EC` | dividers, empty step bars, sheet handle |
| lineStrong | `#CBD2DC` | outline & dashed buttons |
| checkRing | `#C2C9D4` | unchecked checkbox ring |
| ink | `#1B1B1F` | headings, body |
| inkButton | `#111113` | labels on clay |
| inkMuted | `#5B6475` | secondary text |
| inkSubtle | `#6B7385` | captions |
| placeholder | `#8A92A3` | input placeholder |
| strike | `#A0A8B8` | done-task strike line |
| inkFlat | `#151517` | thin progress fills |

| Subject (`subject.X`) | fill | deep | text | mark |
|---|---|---|---|---|
| SE · Software Engineering | `#DCEBFF` | `#BFD6FF` | `#1E3A8A` (textMuted `#1E40AF`) | `#2563EB` |
| DAA · Design and Analysis of Algorithm | `#EDE5FF` | `#CDBBFF` | `#5B21B6` | `#7C3AED` |
| DDS · Design of Data Structures | `#D9F5E6` | `#9EE6C0` | `#065F46` | `#10B981` |

**Art:**
- blue `#3B82F6`
- violet `#DDD0FF`
- green `#BBF0D3`
- pink `#F9A8D4`
- highlighter `#E3EEFF`

**Status:**

| Status | Background / text |
|---|---|
| info | `#E3EEF8` / `#2C5577` |
| success | `#D9F5E6` / `#065F46` |
| heads-up | `#FEF3C7` / `#92400E` |
| error | `#FEE2E2` / `#B91C1C` |

### Type: Urbanist (`type.` in theme.ts)
RN `letterSpacing` is in points, so the design's em values are converted.

| Style | Size / line height | Family | letterSpacing |
|---|---|---|---|
| splash | 60 / 60 | 600 SemiBold | −2.4 |
| display | 46 / 47 | 600 | −1.38 |
| onboarding | 40 / 42 | 600 | −1.2 |
| stat | 54 / 54 | 600 | −1.62 |
| statSmall | 40 / 40 | 600 | −1.2 |
| cardTitle | 28 / 31 | 600 | −0.56 |
| section | 24 / 29 | 600 | −0.48 |
| eyebrow | 20 / 26 | 500 Medium | 0 |
| button | 18 / 22 | 600 | 0 |
| bodyLarge / reader | 17 / 26 | 500 (reader focus 700 Bold) | 0 |
| body | 16 / 25 | 400 Regular | 0 |
| caption | 14 / 20 | 400 | 0 |
| micro | 13 / 17 | 600 | 0 |

### Shape & size
- **Radius:** input 22 · panel 28 · card 34 · sheet 36 · reader 40 · pill 9999.
- **Sizes:**
  - primary button 62–64 (arrow chip 46–48)
  - icon button 56 (52 on onboarding, 44–48 inside cards)
  - chip 52
  - tab 56
  - checkbox 30
  - touch target ≥ 44
- **Spacing:**
  - gutters 20 (tabs) / 24 (onboarding)
  - top 60 (safe area + 12)
  - gap between cards 14
  - card padding 18–22
  - bottom 128 + safe area (clears the tab bar)

### Surfaces
See §5.1 (clay, recess, dock, ink), §6.1 (glass) and §6.2 (sheen).

### Motion (`motion.ts`)
- **Easings:**
  - standard `(.2,0,0,1)`
  - decelerate `(.05,.7,.1,1)`
  - smooth `(.2,.8,.2,1)`
  - overshoot `(.2,.9,.25,1.08)`
  - springy `(.3,1.25,.45,1)`
  - scroll `(.65,0,.25,1)`
- **Springs (stiffness/damping, mass 1):** press 500/30 · layout 400/34 · progress 300/30 · sheet 380/36 · pop 600/18.
- **Blur (expo-blur intensity):** entrance 28 (≈10 px) · soft 22 (≈8 px) · letters 34 (≈12 px) · swap / veil / glass 40 (≈14–22 px).

---

## Appendix B · Every animation (web spec → React Native)

`K` = component in `native/components`; `M` = preset in `native/motion.ts`.

| # | Where | What | Timing | React Native (K / M) |
|---|---|---|---|---|
| 1 | every button | press .96 + haptic | spring 500·30 | `PressableScale` / `spring.press`, `press` |
| 2 | every screen | blur-in on focus; navigator fade | 360–480 ms | `Screen`, `BlurIn` / `riseIn` |
| 3 | blocks & fields | blur-rise, 60 ms stagger | 480 ms decelerate | `BlurIn index` / `riseIn(i)`, `blur.entrance` |
| 4 | rows, results | soft blur-up | 260 ms | `BlurIn soft` / `blur.soft` |
| 5 | tab bar | active tab grows 520 ms `bezier(.2,.9,.25,1.04)`; groove springs; label slides in +180 ms (320 ms) | 520 ms / spring 400·34 | `TabBar` / `tabGrow`, `tabLabelTiming` |
| 6 | login switch | ink slider springs | spring 400·34 | `SegmentedControl` |
| 7 | checkbox | pop .9→1.12→1, tick draws, strike grows | 260 + 220 ms | `AnimatedCheckbox` |
| 8 | progress | segment fills (`scaleX`, `transformOrigin: "left"`) | spring 300·30 / 600 ms | `spring.progress` |
| 9 | chart bars | grow from the bottom, staggered | 800 ms | gifted-charts `isAnimated animationDuration={800}` |
| 10 | accordion | height via layout transition + blur-in | 250 ms | `layout`, `BlurIn soft rise={0}` |
| 11 | field focus | 2 pt ink border, white fill | 180 ms | §6.3 |
| 12 | splash | bloom · logo draw · letters blur-rise · bar · CTA | ≈1.9 s | `SplashIntro` / `bloom`, `splashTimeline` |
| 13 | admit idle | badge bobs ±4 pt | 2.4 s loop | `withRepeat(withTiming)` |
| 14 | admit scan | scan line with blue glow, dots blink | 1.6 s loop | `withRepeat`, `boxShadow` glow |
| 15 | plan ready | burst + badge pop + tick + confetti | 1.1 s | `popIn`, `CelebrateLayer` |
| 16 | sheet | slides up, scrim fades | spring 380·36 / 260 ms | `spring.sheet`, `fadeIn(260)` |
| 17 | FAB | shadow breathes | 2.8 s loop | `withRepeat` on scale or shadow |
| 18 | chat | bubbles in; typing dots; avatar glow | 360 ms; 1 s; 3 s | `messageIn`, `withRepeat` |
| 19 | PDF | page turn + blur; rocket glide; finish pop | 420 / 500 / 600 ms | `BlurIn`, `withTiming`, `popIn` |
| 20 | **blur reader** | track drift; line focus; mode blur-swap; highlight wipe; groove | 900 / 700 / 520 / 700 ms; 2.6 s step | `BlurReader` / `readerLine`, `duration.reader*` |
| 21 | **progressive blur** | edges blur through 3 masked layers | static | `ProgressiveBlur` |
| 22 | code pill | morph, digits pop, caret, shake, spinner | 360 / 260 / 1 s / 460 ms | `CodePill` / `digitIn`, `SHAKE_STEPS` |
| 23 | island | goo merge + resize; content fades in +160 ms | spring 380·26 | `GooeyIsland` / `spring.island` |
| 24 | onboarding | cards drop, swing, pop; coin slides; coin falls in cup | 760 / 900 / 560 / 640 / 1100 ms | `dropIn`, `popIn`, scroll handler |
| 25 | quick add | veil blur; items fly out, last first | 260 ms; 50 ms apart | `QuickAddMenu` / `quickAddItemIn` |
| 26 | tool dock | bar → grid morph; tools pop 35 ms apart | spring 400·34 | `ToolDock` / `toolIn`, `layout` |
| 27 | live icons | blink, radar sweep, heat pulse | 3.6 / 2.4 / 1.6 s loops | `withRepeat` |
| 28 | range picker | value blurs in | 300 ms | `BlurIn soft rise={0}` keyed by value |
| 29 | celebration | one confetti burst + success haptic | — | `CelebrateLayer` / `confetti` |

**Reduce motion:**
- Every Reanimated preset uses `ReduceMotion.System`, so entrances become instant.
- `BlurIn`, `ProgressiveBlur`, `BlurReader`, `GooeyIsland`, `SplashIntro`, `PressableScale` and `CelebrateLayer` check `useReducedMotion()` and drop blur, loops, auto-advance and confetti.
- `web-reference/animations/keyframes.css` keeps the original CSS keyframes, in case you need an exact curve.

---

## Appendix C · Every SVG (inline code)

All icons are 24×24 with `stroke="currentColor"`, a 2 px stroke and round caps and joins.

They work with **react-native-svg** in two ways:
1. **As files** with `react-native-svg-transformer` (§4.5): `<SearchIcon color="#111113" width={22} height={22} />`. `currentColor` takes the `color` prop.
2. **As code:** copy the `d` attributes into `<Icon d={…} />` from the kit (`native/components/Icon.tsx` already contains the paths the components need).

**Glossy icons:**
- They use the gradients in `gloss-gradients.svg`: `#gloss` (active) and `#glossSoft` (idle).
- In React Native, use `<GlossIcon d={…} active />`. It defines the same gradients inside its own `<Svg>`, because react-native-svg can't reference gradients across separate `<Svg>` elements.

None of these SVGs use filters, masks, CSS classes or `<style>`, so all of them render in react-native-svg as they are. **Don't** use `sprite.svg` in RN, because external `<use href>` isn't supported.

### C.1 · UI icons (24×24, currentColor)

39 files in `assets/icons/`.

**`arrow-right.svg`**
```svg
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
```

**`arrow-up-right.svg`**
```svg
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17L17 7M8 7h9v9"/></svg>
```

**`arrow-up-send.svg`**
```svg
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M6 11l6-6 6 6"/></svg>
```

**`book-open.svg`**
```svg
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 5h6a4 4 0 0 1 4 4v12a3 3 0 0 0-3-3H2z"/><path d="M22 5h-6a4 4 0 0 0-4 4v12a3 3 0 0 1 3-3h7z"/></svg>
```

**`camera.svg`**
```svg
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg>
```

**`check.svg`**
```svg
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5L20 7"/></svg>
```

**`chevron-down.svg`**
```svg
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>
```

**`chevron-left.svg`**
```svg
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6l-6 6 6 6"/></svg>
```

**`chevron-right.svg`**
```svg
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg>
```

**`chevron-up.svg`**
```svg
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 15l6-6 6 6"/></svg>
```

**`clock.svg`**
```svg
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>
```

**`close.svg`**
```svg
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 6l12 12M18 6L6 18"/></svg>
```

**`edit-pencil.svg`**
```svg
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h4L19 9l-4-4L4 16z"/></svg>
```

**`eye-off.svg`**
```svg
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3l18 18"/><path d="M10.6 5.1A10.4 10.4 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-3.2 4.2M6.6 6.6C3.8 8.4 2 12 2 12s3.5 7 10 7a9.8 9.8 0 0 0 5.4-1.6"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/></svg>
```

**`eye.svg`**
```svg
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>
```

**`file-pdf.svg`**
```svg
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/></svg>
```

**`filter.svg`**
```svg
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16M7 12h10M10 17h4"/></svg>
```

**`highlighter.svg`**
```svg
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l-5 5v3h3l5-5"/><path d="M14 4l6 6-8 8-6-6z"/></svg>
```

**`image.svg`**
```svg
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="4"/><circle cx="9" cy="10" r="2"/><path d="M21 16l-5-5-9 9"/></svg>
```

**`info.svg`**
```svg
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></svg>
```

**`link.svg`**
```svg
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/></svg>
```

**`lock.svg`**
```svg
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="10" rx="3"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>
```

**`logo-plane.svg`**
```svg
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l18-7-7 18-2.5-8.5z"/></svg>
```

**`more-horizontal.svg`**
```svg
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/></svg>
```

**`nav-calendar.svg`**
```svg
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="4"/><path d="M16 3v4M8 3v4M3 10h18"/></svg>
```

**`nav-questions.svg`**
```svg
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="5"/><path d="M8 10h8M8 14h5"/></svg>
```

**`nav-subjects-grid.svg`**
```svg
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="7" cy="7" r="3.5"/><circle cx="17" cy="7" r="3.5"/><circle cx="7" cy="17" r="3.5"/><circle cx="17" cy="17" r="3.5"/></svg>
```

**`nav-today-sun.svg`**
```svg
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M6.3 17.7l-1.4 1.4M19.1 4.9l-1.4 1.4"/></svg>
```

**`note.svg`**
```svg
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h9l4 4v14H6z"/><path d="M9 12h7M9 16h5"/></svg>
```

**`paperclip.svg`**
```svg
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5l-8.5 8.5a5 5 0 0 1-7-7L14 4.5a3.5 3.5 0 0 1 5 5L10.5 18a2 2 0 0 1-3-3L15 7.5"/></svg>
```

**`pen-exam.svg`**
```svg
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>
```

**`plus.svg`**
```svg
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
```

**`rocket.svg`**
```svg
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 15c-1.5 1.3-2 5-2 5s3.7-.5 5-2"/><path d="M9 12a22 22 0 0 1 11-9c0 3-1 8-9 11z"/><path d="M9 12H5l2-4h4M12 15v4l4-2v-4"/></svg>
```

**`search.svg`**
```svg
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>
```

**`sparkle-outline.svg`**
```svg
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l1.8 4.6L18.5 9l-4.7 1.4L12 15l-1.8-4.6L5.5 9l4.7-1.4z"/><path d="M19 15l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z"/></svg>
```

**`sparkle.svg`**
```svg
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.2 5.8L20 10l-5.8 2.2L12 18l-2.2-5.8L4 10l5.8-2.2z"/><circle cx="19" cy="18" r="2"/></svg>
```

**`sprite.svg`**
```svg
<svg xmlns="http://www.w3.org/2000/svg" style="display:none">
<symbol id="nav-today-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M6.3 17.7l-1.4 1.4M19.1 4.9l-1.4 1.4"/></symbol>
<symbol id="nav-calendar" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="4"/><path d="M16 3v4M8 3v4M3 10h18"/></symbol>
<symbol id="nav-subjects-grid" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="7" cy="7" r="3.5"/><circle cx="17" cy="7" r="3.5"/><circle cx="7" cy="17" r="3.5"/><circle cx="17" cy="17" r="3.5"/></symbol>
<symbol id="nav-questions" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="5"/><path d="M8 10h8M8 14h5"/></symbol>
<symbol id="search" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></symbol>
<symbol id="more-horizontal" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/></symbol>
<symbol id="user" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></symbol>
<symbol id="filter" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16M7 12h10M10 17h4"/></symbol>
<symbol id="arrow-up-right" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17L17 7M8 7h9v9"/></symbol>
<symbol id="arrow-right" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></symbol>
<symbol id="arrow-up-send" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M6 11l6-6 6 6"/></symbol>
<symbol id="chevron-left" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6l-6 6 6 6"/></symbol>
<symbol id="chevron-right" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></symbol>
<symbol id="chevron-up" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 15l6-6 6 6"/></symbol>
<symbol id="chevron-down" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></symbol>
<symbol id="check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5L20 7"/></symbol>
<symbol id="plus" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></symbol>
<symbol id="close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 6l12 12M18 6L6 18"/></symbol>
<symbol id="clock" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></symbol>
<symbol id="info" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></symbol>
<symbol id="sparkle" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.2 5.8L20 10l-5.8 2.2L12 18l-2.2-5.8L4 10l5.8-2.2z"/><circle cx="19" cy="18" r="2"/></symbol>
<symbol id="sparkle-outline" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l1.8 4.6L18.5 9l-4.7 1.4L12 15l-1.8-4.6L5.5 9l4.7-1.4z"/><path d="M19 15l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z"/></symbol>
<symbol id="paperclip" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5l-8.5 8.5a5 5 0 0 1-7-7L14 4.5a3.5 3.5 0 0 1 5 5L10.5 18a2 2 0 0 1-3-3L15 7.5"/></symbol>
<symbol id="file-pdf" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/></symbol>
<symbol id="image" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="4"/><circle cx="9" cy="10" r="2"/><path d="M21 16l-5-5-9 9"/></symbol>
<symbol id="link" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/></symbol>
<symbol id="note" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h9l4 4v14H6z"/><path d="M9 12h7M9 16h5"/></symbol>
<symbol id="camera" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></symbol>
<symbol id="upload" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 16V4M7 9l5-5 5 5"/><path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3"/></symbol>
<symbol id="lock" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="10" rx="3"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></symbol>
<symbol id="eye" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></symbol>
<symbol id="eye-off" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3l18 18"/><path d="M10.6 5.1A10.4 10.4 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-3.2 4.2M6.6 6.6C3.8 8.4 2 12 2 12s3.5 7 10 7a9.8 9.8 0 0 0 5.4-1.6"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/></symbol>
<symbol id="edit-pencil" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h4L19 9l-4-4L4 16z"/></symbol>
<symbol id="pen-exam" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></symbol>
<symbol id="highlighter" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l-5 5v3h3l5-5"/><path d="M14 4l6 6-8 8-6-6z"/></symbol>
<symbol id="rocket" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 15c-1.5 1.3-2 5-2 5s3.7-.5 5-2"/><path d="M9 12a22 22 0 0 1 11-9c0 3-1 8-9 11z"/><path d="M9 12H5l2-4h4M12 15v4l4-2v-4"/></symbol>
<symbol id="book-open" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 5h6a4 4 0 0 1 4 4v12a3 3 0 0 0-3-3H2z"/><path d="M22 5h-6a4 4 0 0 0-4 4v12a3 3 0 0 1 3-3h7z"/></symbol>
<symbol id="logo-plane" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l18-7-7 18-2.5-8.5z"/></symbol>
</svg>
```

**`upload.svg`**
```svg
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 16V4M7 9l5-5 5 5"/><path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3"/></svg>
```

**`user.svg`**
```svg
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>
```


### C.2 · Glossy icons (reader toolbar, arrow chip, gradients)

10 files in `assets/icons-glossy/`.

**`bookmark-active.svg`**
```svg
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><defs><linearGradient id="gloss" x1="0" y1="0" x2="0.4" y2="1"><stop offset="0" stop-color="#8A8A90"/><stop offset=".45" stop-color="#2A2A2E"/><stop offset="1" stop-color="#050506"/></linearGradient><linearGradient id="glossSoft" x1="0" y1="0" x2="0.4" y2="1"><stop offset="0" stop-color="#C4C4C9"/><stop offset=".5" stop-color="#6A6A70"/><stop offset="1" stop-color="#2A2A2E"/></linearGradient></defs><path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z" fill="url(#gloss)"/></svg>
```

**`bookmark-idle.svg`**
```svg
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><defs><linearGradient id="gloss" x1="0" y1="0" x2="0.4" y2="1"><stop offset="0" stop-color="#8A8A90"/><stop offset=".45" stop-color="#2A2A2E"/><stop offset="1" stop-color="#050506"/></linearGradient><linearGradient id="glossSoft" x1="0" y1="0" x2="0.4" y2="1"><stop offset="0" stop-color="#C4C4C9"/><stop offset=".5" stop-color="#6A6A70"/><stop offset="1" stop-color="#2A2A2E"/></linearGradient></defs><path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z" fill="url(#glossSoft)"/></svg>
```

**`chat-active.svg`**
```svg
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><defs><linearGradient id="gloss" x1="0" y1="0" x2="0.4" y2="1"><stop offset="0" stop-color="#8A8A90"/><stop offset=".45" stop-color="#2A2A2E"/><stop offset="1" stop-color="#050506"/></linearGradient><linearGradient id="glossSoft" x1="0" y1="0" x2="0.4" y2="1"><stop offset="0" stop-color="#C4C4C9"/><stop offset=".5" stop-color="#6A6A70"/><stop offset="1" stop-color="#2A2A2E"/></linearGradient></defs><path d="M4 4h12a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H10l-5 4v-4H4a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3zM20 9a3 3 0 0 1 3 3v5a2 2 0 0 1-2 2v3l-3-3h-4" fill="url(#gloss)"/></svg>
```

**`chat-idle.svg`**
```svg
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><defs><linearGradient id="gloss" x1="0" y1="0" x2="0.4" y2="1"><stop offset="0" stop-color="#8A8A90"/><stop offset=".45" stop-color="#2A2A2E"/><stop offset="1" stop-color="#050506"/></linearGradient><linearGradient id="glossSoft" x1="0" y1="0" x2="0.4" y2="1"><stop offset="0" stop-color="#C4C4C9"/><stop offset=".5" stop-color="#6A6A70"/><stop offset="1" stop-color="#2A2A2E"/></linearGradient></defs><path d="M4 4h12a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H10l-5 4v-4H4a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3zM20 9a3 3 0 0 1 3 3v5a2 2 0 0 1-2 2v3l-3-3h-4" fill="url(#glossSoft)"/></svg>
```

**`gloss-gradients.svg`**
```svg
<svg xmlns="http://www.w3.org/2000/svg" width="0" height="0" style="position:absolute" aria-hidden="true"><defs><linearGradient id="gloss" x1="0" y1="0" x2="0.4" y2="1"><stop offset="0" stop-color="#8A8A90"/><stop offset=".45" stop-color="#2A2A2E"/><stop offset="1" stop-color="#050506"/></linearGradient><linearGradient id="glossSoft" x1="0" y1="0" x2="0.4" y2="1"><stop offset="0" stop-color="#C4C4C9"/><stop offset=".5" stop-color="#6A6A70"/><stop offset="1" stop-color="#2A2A2E"/></linearGradient></defs></svg>
```

**`ink-arrow-chip.svg`**
```svg
<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><defs><linearGradient id="ink" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4A4A4F"/><stop offset=".55" stop-color="#1C1C1F"/><stop offset="1" stop-color="#0E0E10"/></linearGradient></defs><circle cx="24" cy="24" r="24" fill="url(#ink)"/><path d="M24 1.2a22.8 22.8 0 0 1 22.8 22.8" fill="none" stroke="rgba(255,255,255,.22)" stroke-width="1"/><path d="M17 24h14M25 18l6 6-6 6" fill="none" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
```

**`pen-active.svg`**
```svg
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><defs><linearGradient id="gloss" x1="0" y1="0" x2="0.4" y2="1"><stop offset="0" stop-color="#8A8A90"/><stop offset=".45" stop-color="#2A2A2E"/><stop offset="1" stop-color="#050506"/></linearGradient><linearGradient id="glossSoft" x1="0" y1="0" x2="0.4" y2="1"><stop offset="0" stop-color="#C4C4C9"/><stop offset=".5" stop-color="#6A6A70"/><stop offset="1" stop-color="#2A2A2E"/></linearGradient></defs><path d="M20 3c-6 0-11 4-13 10l-2 6 1.2 1.2 6-2C18 16 21 10 21 4zM7.5 16.5L15 9" fill="none" stroke="url(#gloss)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
```

**`pen-idle.svg`**
```svg
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><defs><linearGradient id="gloss" x1="0" y1="0" x2="0.4" y2="1"><stop offset="0" stop-color="#8A8A90"/><stop offset=".45" stop-color="#2A2A2E"/><stop offset="1" stop-color="#050506"/></linearGradient><linearGradient id="glossSoft" x1="0" y1="0" x2="0.4" y2="1"><stop offset="0" stop-color="#C4C4C9"/><stop offset=".5" stop-color="#6A6A70"/><stop offset="1" stop-color="#2A2A2E"/></linearGradient></defs><path d="M20 3c-6 0-11 4-13 10l-2 6 1.2 1.2 6-2C18 16 21 10 21 4zM7.5 16.5L15 9" fill="none" stroke="url(#glossSoft)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
```

**`star-active.svg`**
```svg
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><defs><linearGradient id="gloss" x1="0" y1="0" x2="0.4" y2="1"><stop offset="0" stop-color="#8A8A90"/><stop offset=".45" stop-color="#2A2A2E"/><stop offset="1" stop-color="#050506"/></linearGradient><linearGradient id="glossSoft" x1="0" y1="0" x2="0.4" y2="1"><stop offset="0" stop-color="#C4C4C9"/><stop offset=".5" stop-color="#6A6A70"/><stop offset="1" stop-color="#2A2A2E"/></linearGradient></defs><path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z" fill="url(#gloss)"/></svg>
```

**`star-idle.svg`**
```svg
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><defs><linearGradient id="gloss" x1="0" y1="0" x2="0.4" y2="1"><stop offset="0" stop-color="#8A8A90"/><stop offset=".45" stop-color="#2A2A2E"/><stop offset="1" stop-color="#050506"/></linearGradient><linearGradient id="glossSoft" x1="0" y1="0" x2="0.4" y2="1"><stop offset="0" stop-color="#C4C4C9"/><stop offset=".5" stop-color="#6A6A70"/><stop offset="1" stop-color="#2A2A2E"/></linearGradient></defs><path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z" fill="url(#glossSoft)"/></svg>
```


### C.3 · Illustrations, logo, app icon

11 files in `assets/illustrations/`.

**`admit-card-skeleton.svg`**
```svg
<svg xmlns="http://www.w3.org/2000/svg" width="250" height="320" viewBox="0 0 250 320"><rect width="250" height="320" rx="26" fill="#FFFFFF"/><rect x="20" y="20" width="46" height="56" rx="10" fill="#EEF0F4"/><rect x="78" y="32" width="140" height="9" rx="4.5" fill="#E2E6EC"/><rect x="78" y="50" width="96" height="9" rx="4.5" fill="#E8EBF0"/><rect x="20" y="92" width="210" height="1" fill="#EEF0F4"/><rect x="20" y="106" width="210" height="30" rx="10" fill="#DCEBFF"/><rect x="20" y="148" width="210" height="30" rx="10" fill="#EDE5FF"/><rect x="20" y="190" width="210" height="30" rx="10" fill="#D9F5E6"/><rect x="20" y="236" width="147" height="9" rx="4.5" fill="#E8EBF0"/><rect x="20" y="256" width="95" height="9" rx="4.5" fill="#E8EBF0"/></svg>
```

**`app-icon-1024.svg`**
```svg
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024"><rect width="1024" height="1024" fill="#C7DCFF"/><circle cx="420" cy="430" r="230" fill="#3B82F6"/><circle cx="640" cy="560" r="200" fill="#DDD0FF"/><circle cx="470" cy="700" r="160" fill="#BBF0D3"/><rect x="352" y="352" width="320" height="320" rx="110" fill="#111113"/><g transform="translate(392 392) scale(10)" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l18-7-7 18-2.5-8.5z"/></g></svg>
```

**`assistant-avatar.svg`**
```svg
<svg xmlns="http://www.w3.org/2000/svg" width="52" height="52" viewBox="0 0 52 52"><rect width="52" height="52" rx="20" fill="#C7DCFF"/><g transform="translate(13 13) scale(1.0833)" fill="#111113"><path d="M12 2l2.2 5.8L20 10l-5.8 2.2L12 18l-2.2-5.8L4 10l5.8-2.2z"/><circle cx="19" cy="18" r="2"/></g></svg>
```

**`hero-card-art-daa-violet.svg`**
```svg
<svg xmlns="http://www.w3.org/2000/svg" width="150" height="176" viewBox="0 0 150 176"><circle cx="66" cy="30" r="55" fill="#A78BFA"/><circle cx="100" cy="100" r="44" fill="#DCEBFF"/><circle cx="29" cy="129" r="33" fill="none" stroke="#FFFFFF" stroke-opacity=".85" stroke-width="1.5"/></svg>
```

**`hero-card-art-dds-green.svg`**
```svg
<svg xmlns="http://www.w3.org/2000/svg" width="150" height="176" viewBox="0 0 150 176"><circle cx="66" cy="30" r="55" fill="#34D399"/><circle cx="100" cy="100" r="44" fill="#EDE5FF"/><circle cx="29" cy="129" r="33" fill="none" stroke="#FFFFFF" stroke-opacity=".85" stroke-width="1.5"/></svg>
```

**`hero-card-art-se-blue.svg`**
```svg
<svg xmlns="http://www.w3.org/2000/svg" width="150" height="176" viewBox="0 0 150 176"><circle cx="66" cy="30" r="60" fill="#3B82F6"/><circle cx="108" cy="98" r="48" fill="#DDD0FF"/><circle cx="30" cy="134" r="35" fill="none" stroke="#FFFFFF" stroke-opacity=".8" stroke-width="1.5"/><circle cx="39" cy="79" r="9" fill="#FFFFFF"/></svg>
```

**`login-corner-art.svg`**
```svg
<svg xmlns="http://www.w3.org/2000/svg" width="220" height="220" viewBox="0 0 220 220"><circle cx="65" cy="105" r="65" fill="#DCEBFF"/><circle cx="135" cy="145" r="55" fill="#EDE5FF"/><circle cx="87" cy="37" r="27" fill="none" stroke="#FFFFFF" stroke-width="1.5"/></svg>
```

**`logo-mark.svg`**
```svg
<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80"><rect width="80" height="80" rx="28" fill="#111113"/><g transform="translate(20 20) scale(1.6667)" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l18-7-7 18-2.5-8.5z"/></g></svg>
```

**`splash-composition.svg`**
```svg
<svg xmlns="http://www.w3.org/2000/svg" width="342" height="400" viewBox="0 0 342 400"><circle cx="171" cy="190" r="160" fill="none" stroke="#FFFFFF" stroke-opacity=".7" stroke-width="1.5"/><circle cx="171" cy="190" r="110" fill="none" stroke="#FFFFFF" stroke-opacity=".5" stroke-width="1.5"/><circle cx="121" cy="160" r="65" fill="#3B82F6"/><circle cx="217" cy="203" r="59" fill="#DDD0FF"/><circle cx="146" cy="258" r="48" fill="#BBF0D3"/><circle cx="182" cy="30" r="11" fill="#FFFFFF"/><circle cx="18" cy="242" r="7" fill="#111113"/><rect x="131" y="150" width="80" height="80" rx="28" fill="#111113"/><g transform="translate(151 170) scale(1.6667)" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l18-7-7 18-2.5-8.5z"/></g></svg>
```

**`success-badge.svg`**
```svg
<svg xmlns="http://www.w3.org/2000/svg" width="104" height="104" viewBox="0 0 104 104"><rect width="104" height="104" rx="36" fill="#111113"/><g transform="translate(28 28) scale(2)" fill="none" stroke="#FFFFFF" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></g></svg>
```

**`upload-badge.svg`**
```svg
<svg xmlns="http://www.w3.org/2000/svg" width="84" height="84" viewBox="0 0 84 84"><circle cx="42" cy="42" r="42" fill="#DCEBFF"/><g transform="translate(25 25) scale(1.4167)" fill="none" stroke="#1E3A8A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 16V4M7 9l5-5 5 5"/><path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3"/></g></svg>
```

---

## Appendix D · Folder map

```
ExamPilot-ClearGlass-handoff/
  CLAUDE.md
  EXAMPILOT-REDESIGN.md
  README.md
  assets/  (0 files)
    icons/  (39 files)
    icons-glossy/  (10 files)
    illustrations/  (11 files)
  design-tokens/  (1 files)
    tokens.json
  docs/  (2 files)
    backend-and-ai.md
    data-model.md
  motion-videos/  (21 clips + index.html, MOTION-VIDEOS.md, motion-data.js)
    frames/  (21 key-frame sheets)
    timeline/  (21 measured timelines)
    steps/  (21 spec tables)
    posters/  (21 thumbnails)
  native/  (4 files)
    index.ts
    motion.ts
    nativewind.config.example.js
    theme.ts
    components/  (20 files)
      AnimatedCheckbox.tsx
      BlurIn.tsx
      BlurReader.tsx
      Celebrate.tsx
      CodePill.tsx
      FilterChips.tsx
      GlassCard.tsx
      GooeyIsland.tsx
      Icon.tsx
      IconButton.tsx
      PressableScale.tsx
      ProgressiveBlur.tsx
      QuickAddMenu.tsx
      Screen.tsx
      SegmentedControl.tsx
      SoftButton.tsx
      SplashIntro.tsx
      Surface.tsx
      TabBar.tsx
      ToolDock.tsx
    examples/  (2 files)
      TabsLayout.example.tsx
      TodayScreen.example.tsx
  reference/  (0 files)
    prototypes/  (26 files)
    rendered-html/  (25 files)
  research/  (1 files)
    ai-and-backend-report.md
    notes-ai-backend/  (4 files)
    notes-design/  (4 files)
  sample-data/  (9 files)
    admit-card-extraction-example.json
    ai-plan-example.json
    daily-tasks.json
    exams.json
    materials.json
    microcopy.json
    questions.json
    study-sessions.json
    subjects.json
  screenshots/  (35 files)
  web-reference/  (1 files)
    README.md
    animations/  (2 files)
    components/  (17 files)
    design-tokens/  (3 files)
    styles/  (1 files)
```

---

## Appendix E · Motion videos (live recordings)

There are 21 clips in `motion-videos/`, one per screen (01–12) and one per motion board (M1–M9).
- They were recorded **frame by frame at 30 fps** from the live Clear Glass design, so every timing is exact.
- Each clip comes with a key-frame sheet that Claude Code can read, a measured timeline (every animation's property, from → to, duration, delay and easing), and a step-by-step explanation.

| Step | What to do |
|---|---|
| Watch | Open `motion-videos/index.html` in a browser. Tap a clip to open it in the modal, slow it to 0.25×, and tap a step to jump to that moment. |
| Read | `motion-videos/MOTION-VIDEOS.md` has, for each clip, the video, numbered steps with timestamps, which kit piece to use, and the full spec table. |
| Build with Claude Code | Point it at `frames/<clip>.png` + `timeline/<clip>.json` + the clip's section (prompt in the MOTION-VIDEOS.md header). |

The timings measured from the live page are already in `native/motion.ts`. The tab grow is 520 ms `bezier(.2,.9,.25,1.04)`, and the tab label waits 180 ms and runs 320 ms; both now match the recording exactly.
