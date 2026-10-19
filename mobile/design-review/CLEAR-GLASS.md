# Clear Glass implementation review

Reference: `handoff/ExamPilot-ClearGlass-handoff/EXAMPILOT-REDESIGN.md`, the native kit and `motion-videos/` supplied on 19 October 2026.

## Applied across the app

- Unified the existing UI and native kit behind the same layered Surface renderer. This includes material fills used by calendar dates, selection pills, onboarding badges, assistant bubbles and action buttons.
- Preserved the white ground, Urbanist font files and subject palettes already present in the app. Native appearance is fixed to light; launcher icons are generated from the supplied SVG for both platforms.
- Imported the handoff's updated motion presets, including the 520 ms tab growth and 180 ms / 320 ms label delay/duration. The tab groove moves between measured frames and emits React Navigation tab events.
- Screen entry runs for 360 ms with the specified smooth easing and 10 pt rise. It replays on focus without remounting form inputs or native PDF views. Block entrances, calendar day changes, subject swaps, question answers and completion cards use blur entrances.
- Primary controls use 64 pt clay surfaces and ink arrow chips. Checkboxes use the glossy ink material, 260 ms pop and 60 ms delayed / 220 ms tick drawing. Thin progress bars use the flat ink token.
- Added the Today study island with a 25-minute focus timer, pause/resume and completion state. Existing OS Live Activity support remains separate and functional.
- Added compact animated subject illustrations, stopped when the route is unfocused or reduced motion is enabled.
- Added a quarter-hour time-range track alongside existing calendar date/time controls. Drag handles cannot cross and have accessible increment/decrement actions. Opening the sheet now initializes both range dates to the selected day.
- Focus reading is available from PDF pages, subject notes and long assistant replies. The three modes use the actual reading text, existing assistant replies and saved highlights. Highlighted sentences are saved as note materials through the existing store.
- The PDF dock supports focus highlighting, saved page notes, persistent bookmarks, text search, page navigation, assistant navigation and system sharing on iOS.
- Signup uses a real Firebase email-link verification screen with checking, resend and continue actions. A six-digit CodePill is not shown because the existing authentication provider verifies via links.
- Intro progress follows swipe position on the UI thread; cards use the supplied drop-in preset. Final-slide account actions lead to the appropriate login mode.
- Subjects' PDF action opens the existing material-import flow, preserving the local file URI rather than creating an unreadable metadata-only entry.

## Platform adaptations and limits

- Kept React Native CLI and existing dependencies. No Expo migration was necessary.
- The installed native gradient component failed to repaint inside the animated login slider on Fabric. The CLI adapter now uses RN 0.88 background gradients; inset and outer shadows remain on separate layers. The corrected login pill was visually verified in the iOS simulator.
- iOS blur strength is approximated by cross-fading a fixed native blur layer. Android entrance blur falls back to fade/rise; Android 12+ reader lines use native blur filters. These are not pixel-identical to browser CSS blur.
- Progressive reader edges use one masked blur each rather than three, limiting steady-state live blur layers to six with nearby lines. Focus drift remains 900 ms, line changes 700 ms, automatic advance 2600 ms and mode swaps 520 ms.
- Live icons are compact adaptations of M7's control-panel, radar and data-grid designs. Existing onboarding copy and flow are retained; this is not a reproduction of every standalone motion-demo scene.
- The standard groove tab bar is used; M6's optional split-tab alternative is not enabled.
- PDF highlighting happens in extracted focus text, not as positioned annotations on PDF pages. Scanned PDFs with no text show a clear message. Notes/bookmarks persist; the focus timer is local to the mounted Today screen.
- Optional generated summary/flashcard/quiz and read-aloud dock tools are not represented by nonfunctional buttons. The existing assistant remains available. Android system sharing currently shares the material name; attaching a private local file requires a content-URI sharing implementation.
- Real account data is preserved. Screenshot sample subjects/content are not inserted into the student's store.

## Validation performed

- TypeScript: `tsc --noEmit` passed.
- ESLint: the components, kit, screens and new range helper pass with no errors (repository style warnings remain).
- Jest: two suites, seven tests passed, including range snapping/crossing/day-boundary tests and existing admit-card parser tests.
- Metro generated minified production JavaScript bundles for iOS and Android.
- iOS Info.plist passed `plutil -lint`.
- Captured and inspected the running iOS login screen, identified the white selection-pill regression and verified its correction. See `ios-login.png`.

## Device QA still required

The UI automation connection to Device Hub timed out. A complete screen-by-screen interactive walkthrough, native release builds, reduced-motion/device-font testing and frame-rate measurements were not completed. There was no connected Android emulator/device, so Android visual behavior has not been verified. Production JavaScript bundles are not native release builds. Native icon and appearance changes require rebuilding the app.

## Follow-up validation — 19 October 2026

- Confirmed that the iPhone 15 Pro (iOS 18.0) and iPhone 17 (iOS 26.5) simulators are booted. Device Hub's computer-use connection still timed out, so the interactive walkthrough remains unverified.
- Reviewed the new study timer, verification screen, focus reader and range picker. Fixed cancelled range gestures leaving unsaved handle positions on screen, separated the two handles' drag origins, and guarded against a zero-width track during layout.
- After the range-picker change, TypeScript and targeted ESLint passed; both Jest suites passed (seven tests). These checks do not verify native gesture cancellation behavior on a device.
