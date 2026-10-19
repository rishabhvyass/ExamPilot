# ExamPilot — Design Handoff

Everything needed to build ExamPilot with Claude Code: spec, screenshots, assets, animations, tokens, sample data and research.

## Start here
1. Read **`DESIGN.md`** — the full spec for all 12 screens, with screenshots.
2. Copy **`CLAUDE.md`** into the root of your app repo (it tells Claude Code the rules).
3. Copy this whole folder into your repo as `/design` so Claude Code can read it.
4. Follow **`docs/build-plan.md`** — phase by phase, each with a ready-to-paste prompt.

## Folder map
```
ExamPilot-design-handoff/
├── README.md                 ← you are here
├── DESIGN.md                 ← master spec (all screens, system, motion, a11y)
├── CLAUDE.md                 ← rules for Claude Code (copy to repo root)
├── docs/
│   ├── motion.md             ← every animation: timing, easing, code mapping
│   ├── data-model.md         ← types, storage, localStorage → Firestore
│   ├── backend-and-ai.md     ← auth, AI proxy, admit-card pipeline, NotebookLM
│   └── build-plan.md         ← phased build with Claude Code prompts
├── screenshots/              ← 25 PNGs (2×, full height): every screen + states
├── reference/
│   ├── rendered-html/        ← static HTML of each screen (exact styles/markup)
│   └── prototypes/           ← original interactive design files + canvas.json
├── design-tokens/            ← tokens.json · tokens.css · tailwind.config.js
├── animations/
│   ├── keyframes.css         ← all CSS keyframes, named ep-*
│   ├── motion-variants.ts    ← Motion for React presets (page, tab, checkbox, sheet…)
│   └── examples/             ← TabBar.tsx · AnimatedCheckbox.tsx · SplashIntro.tsx · celebrate.ts
├── assets/
│   ├── icons/                ← 38 SVG icons + sprite.svg
│   ├── illustrations/        ← logo, app icon, splash art, hero art, badges
│   └── assets-overview.png   ← contact sheet of all assets
├── sample-data/              ← exams, subjects, tasks, sessions, questions, materials,
│                               microcopy, AI plan + admit-card output shapes
└── research/                 ← AI/backend report + design and backend research notes
```

## Screens
| # | Screen | Screenshot |
|---|---|---|
| 01 | Animated splash | `screenshots/01-splash-animated.png` |
| 02 | Login (+ create account) | `02-login.png`, `02b-login-create-account.png` |
| 03 | Your details | `03-your-details.png` |
| 04 | Admit card upload (idle / scanning / results) | `04-…`, `04b-…`, `04c-…` |
| 05 | Plan ready | `05-plan-ready.png` |
| 06 | Today (+ all done) | `06-today.png`, `06b-today-all-done.png` |
| 07 | Calendar (+ exam day) | `07-calendar.png`, `07b-calendar-exam-day.png` |
| 08 | Subjects (+ DAA) | `08-subjects.png`, `08b-subjects-daa.png` |
| 09 | Questions (+ filtered) | `09-questions.png`, `09b-questions-filtered-dds.png` |
| 10 | Study materials (+ add sheet) | `10-…`, `10b-…` |
| 11 | Study assistant (+ reply) | `11-…`, `11b-…` |
| 12 | PDF reader (+ finished) | `12-…`, `12b-…` |
| — | Subject hero component · design system board · earlier static splash | `component-subject-hero.png`, `design-system-board.png`, `earlier-splash-static.png` |

## Notes
- Real data: exams on 21, 22, 23 Oct 2026 at 2 PM. All other content is sample and must be labelled.
- Fonts: Urbanist from Google Fonts.
- The "Continue with Google" button in the mockups is a placeholder — use Google's official button.
- `reference/prototypes/*.dc.html` need the design canvas runtime to run; open the `rendered-html` versions in a browser instead.
