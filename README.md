# ExamPilot

Calm exam-prep companion for B.Tech students, built from the design handoff.

| Folder | What it is |
|---|---|
| `mobile/` | The app — React Native CLI 0.88 (TypeScript) |
| `handoff/ExamPilot-design-handoff/` | Design spec, screenshots, tokens, sample data |
| `exampilot/` | Earlier web prototype (Vite + React), kept for reference |

## Run the app

```sh
cd mobile
npm install
cd ios && bundle install && bundle exec pod install && cd ..
npm start          # Metro
npm run ios        # or: npm run android
```

## Stack
React Navigation (native stack + custom floating tab bar) · Reanimated 4 · react-native-svg (icons and illustrations from the handoff) · AsyncStorage · @react-native-documents/picker · Urbanist font bundled in `mobile/assets/fonts`.

## Code map (`mobile/src`)
- `theme.ts` — Lavender Calm tokens (colours, type, radii, shadows)
- `components/ui.tsx` — shared components (buttons, chips, hero card, checkbox, sheets…)
- `components/TabBar.tsx` — floating capsule nav
- `screens/onboarding.tsx` — splash, login, details, admit card, plan ready
- `screens/tabs.tsx` — Today, Calendar, Subjects, Questions
- `screens/tools.tsx` — study materials, study assistant, PDF reader
- `data/` — types, AsyncStorage store, seed JSON
- `lib/` — dates, plan generator, confetti

## Not wired yet
- Auth is a local mock (Firebase Auth + Google sign-in to come).
- Admit-card reading returns the sample extraction after 2.4 s.
- Assistant replies are canned, in the AI contract shape (`text`, `study_plan`, `chart`).
- The PDF reader shows sample pages; picked files store metadata only.
