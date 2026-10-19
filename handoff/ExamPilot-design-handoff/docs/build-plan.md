# Build plan for Claude Code

Work phase by phase. Start each session with: *"Read CLAUDE.md and /design/DESIGN.md first."* Each phase ends with `npm run build` passing and a visual check against the screenshots.

---

## Phase 0 — Project setup
**Prompt:**
> Create a React + Vite + TypeScript app called exampilot. Add Tailwind v3 and merge /design/design-tokens/tailwind.config.js. Import /design/design-tokens/tokens.css and /design/animations/keyframes.css globally. Install motion, react-router-dom, canvas-confetti, recharts, react-pdf. Copy /design/assets/icons and /design/assets/illustrations into src/assets. Set up routes for all 12 screens (placeholders) and wrap the app in `<MotionConfig reducedMotion="user">`. Add an `AnimatePresence mode="wait"` page transition using the `page` variants from /design/animations/motion-variants.ts (copy it to src/lib/motion.ts).

## Phase 1 — Components
**Prompt:**
> Build the shared components listed in DESIGN.md section 3 in src/components: TopBar, ScreenHeader, FloatingTabBar (start from /design/animations/examples/TabBar.tsx), PrimaryButton, SecondaryButton, IconButton, Chip, SubjectTag, SubjectRow, HeroCard, SegmentedProgress, AnimatedCheckbox (from the example), Card, InfoCard, BottomSheet, StepHeader, Field. Use tokens only. Make a /dev/components route that shows them all.

## Phase 2 — Data layer
**Prompt:**
> Implement src/data/types.ts and a Store interface exactly as in /design/docs/data-model.md, with a LocalStore (localStorage + IndexedDB for files). Seed from /design/sample-data on first run (isSample flags). Add date helpers for IST, "days to prepare" and safe DD/MM parsing with tests.

## Phase 3 — Four tabs
**Prompt (one screen per session works best):**
> Build the Today screen to match /design/screenshots/06-today.png and 06b-today-all-done.png and the spec in DESIGN.md §06. Use HeroCard, SubjectRow, SegmentedProgress and AnimatedCheckbox. Persist ticks per day. Show the completion card and fire celebrate() once when all tasks are done.

Repeat for Calendar (§07), Subjects (§08), Questions (§09). Check against `reference/rendered-html/*.html` for spacing.

## Phase 4 — Onboarding
> Build Splash (§01) from /design/animations/examples/SplashIntro.tsx (first launch only), Login (§02) with Firebase Auth email/password + Google (official Google button), Your details (§03), Admit card (§04) with a mocked extractor that returns /design/sample-data/admit-card-extraction-example.json after 2.4s, and Plan ready (§05) using a local plan generator. Redirect signed-in users past onboarding.

## Phase 5 — Study tools
> Build Study materials (§10) with IndexedDB file storage and the add sheet, the PDF reader (§12) with react-pdf, lazy pages, thumbnails, highlights, rocket progress (fix: clamp the knob) and the finished state; and the Study assistant UI (§11) rendering text, study_plan and chart blocks (Recharts) from a mocked API.

## Phase 6 — Backend & AI
> Create a Cloudflare Worker at /api/ai with routes chat, plan, quiz, admit-card as in /design/docs/backend-and-ai.md. Verify Firebase ID tokens, enforce a per-user daily cap, call Gemini (keys in Worker secrets), validate JSON with a schema, fall back to Groq. Replace the mocks in the app. Move storage to Firestore and migrate local data on first login.

## Phase 7 — Polish & checks
- Accessibility pass against DESIGN.md §6 (axe DevTools, keyboard only, screen reader).
- Reduced-motion pass.
- Lighthouse ≥ 90 performance/accessibility on mobile.
- Real admit-card test set (20–50 cards) for extraction accuracy.
- Privacy notice, delete-my-data, file-deletion log; under-18 decision.

## Later
Expo app (Reanimated 4, react-native-pdf, Victory Native XL), cloud PDF storage (Blaze), retrieval with page citations, flashcards & quizzes from PDFs.
