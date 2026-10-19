# ExamPilot

A calm exam-prep companion built with React Native CLI 0.88 and TypeScript.

| Folder | Purpose |
|---|---|
| `mobile/` | iOS and Android app |
| `server/` | AI backend |
| `handoff/ExamPilot-ClearGlass-handoff/` | Supplied Clear Glass native kit, screenshots, prototypes and measured motion references |
| `handoff/ExamPilot-design-handoff/` | Original design reference |
| `exampilot/` | Earlier web prototype |

## Run

```sh
cd mobile
npm install
cd ios && bundle install && bundle exec pod install && cd ..
npm start
npm run ios       # or npm run android
```

Rebuild the native app to pick up launcher icons and platform appearance settings. JavaScript UI changes work with Metro reload.

## Clear Glass implementation

The app keeps its existing routes and data flows. Shared components support light, dark and system appearance with Urbanist typography, clay buttons, glossy ink selections, frosted cards and blue/violet/green subject palettes.

- `mobile/src/theme.ts` and `src/kit/theme.ts`: existing token API and supplied native kit tokens.
- `src/components/surface.tsx`: adapter for existing material styles; the supplied `Surface` owns gradient and shadow layers.
- `src/kit/compat.tsx`: React Native CLI gradient, blur and haptic adapters.
- `src/kit/motion.ts`: measured handoff timings and springs.
- `src/components/ui.tsx`: shared controls and screen entrances that preserve child state.
- `src/screens/`: splash, onboarding, verification, four tabs, materials, assistant and PDF reader.
- `src/components/FocusReaderSheet.tsx`: focus reading for PDFs, notes and assistant replies; highlights are saved as notes.
- `src/components/NativeExamActivity.tsx`: automatically syncs the next exam to the native iOS Live Activity, with no simulated island in the app.
- `src/screens/account.tsx`: editable profile, appearance preferences and search across subjects, materials, exams and questions.
- `src/appearance.tsx`: persisted light/dark/system preference and reduced-motion-aware theme transition.
- `src/components/TimeRangePicker.tsx`: quarter-hour study-time range, including accessible adjustments.

Firebase authentication and cloud storage, admit-card parsing, file imports and the existing AI integration remain connected. PDF notes and bookmarks persist through the existing store. The app starts with the student's data rather than automatically seeding the screenshot examples.

See [the implementation and validation notes](mobile/design-review/CLEAR-GLASS.md) for platform adaptations and verification limits.

## Checks

```sh
cd mobile
npx tsc --noEmit
npx jest --runInBand --watchman=false
```
