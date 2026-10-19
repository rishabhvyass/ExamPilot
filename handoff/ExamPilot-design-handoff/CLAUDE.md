# CLAUDE.md — ExamPilot

You are building **ExamPilot**, a calm exam-prep app for Indian B.Tech students. The design handoff lives in `/design` (this folder's contents). Treat it as the source of truth.

## Read before coding
- `/design/DESIGN.md` — spec for every screen. Match the screenshots in `/design/screenshots/`.
- `/design/design-tokens/` — use these tokens; never invent colours, radii or fonts.
- `/design/animations/` — use `motion-variants.ts` presets and `keyframes.css`; copy the examples.
- `/design/reference/rendered-html/<screen>.html` — open to check exact spacing/sizes.
- `/design/sample-data/` — seed data and microcopy.

## Stack
- React + Vite + TypeScript, Tailwind CSS v3 (merge `/design/design-tokens/tailwind.config.js`), Motion (`npm i motion`, import from `motion/react`), React Router.
- Firebase Auth (email/password + Google) and Firestore. Until auth is wired, persist to localStorage behind a `storage` module so it can be swapped.
- react-pdf for the reader, Recharts for charts, canvas-confetti for celebrations.
- AI: never call model APIs from the client. Call our proxy (`/api/ai/*`, Cloudflare Worker) only.

## Non-negotiable UI rules
- Font Urbanist. Ground `#EDECE8`, ink `#1B1B1F`, subjects SE lavender / DAA pink / DDS mint (tokens).
- Exactly four bottom tabs: Today, Calendar, Subjects, Questions. Floating capsule nav; active tab is a black pill with icon + label.
- Primary button = black pill with a white circle + arrow on the right. Icon buttons = 56px white circles.
- No red for deadlines or exams, no streaks, no ticking seconds, no gradients on surfaces, no emoji.
- Countdown in whole days: "3 days to prepare", "Tomorrow, 2:00 PM", "Today, 2:00 PM".
- Label sample content "Sample" until the student edits it.
- Copy comes from `/design/sample-data/microcopy.json`.

## Motion rules
- Wrap the app in `<MotionConfig reducedMotion="user">`.
- Screen change: `page` variants with `AnimatePresence mode="wait" initial={false}`.
- Buttons: spread `pressable`. Checkboxes: `AnimatedCheckbox`. Tabs: `TabBar` with shared `layoutId`.
- Gate infinite loops and confetti with `useReducedMotion()`.
- Keep durations ≤ 520 ms except the splash (~1.9 s, first launch only).

## Accessibility
- `aria-label` on icon-only buttons; `aria-pressed` on toggles/chips; `aria-expanded` on accordions; `aria-current="page"` on the active tab.
- Visible focus ring (3px ink, 2px offset). Touch targets ≥ 44px. Contrast ≥ 4.5:1.

## Code structure
```
src/
  app/            routes, providers (MotionConfig, auth)
  components/     TabBar, TopBar, ScreenHeader, PrimaryButton, IconButton, Chip,
                  SubjectTag, SubjectRow, HeroCard, SegmentedProgress, AnimatedCheckbox,
                  Card, InfoCard, BottomSheet, StepHeader, Field
  screens/        Splash, Login, Profile, AdmitCard, PlanReady, Today, Calendar,
                  Subjects, Questions, Materials, Assistant, PdfReader
  data/           types.ts, storage.ts (local → Firestore), seed from /design/sample-data
  lib/            dates (DD/MM safe parsing, IST), plan generator, ai client
  styles/         tokens.css, keyframes.css
  assets/         icons/*.svg, illustrations/*.svg
```

## Definition of done (per screen)
Matches the screenshot at 390px width, works at 360–480px and on desktop (centred column), all listed interactions work, state persists, reduced motion respected, no console errors, `npm run build` passes.
