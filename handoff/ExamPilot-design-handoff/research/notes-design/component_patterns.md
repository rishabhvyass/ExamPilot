# ExamPilot — UI/UX Component and Information-Architecture Patterns (4 tabs: Today, Calendar, Subjects, Questions)

## Q1. Mobile bottom navigation for 4 tabs (sizing, labels, active indicator, safe areas, desktop switch)

### Takeaway
Four labeled destinations sit comfortably inside every major guideline (Material: 3–5; Apple: "fewer is easier", ≤5 default). Build a fixed bottom bar about 64–80px tall with a 24px icon, a one-word label always visible, a pill-shaped active indicator, and `padding-bottom: env(safe-area-inset-bottom)`. From about 600–768px up, change it to a top bar or a left sidebar/rail. Never hide or disable a tab. Explain an empty section inside the section itself.

### Cited Findings
- Material navigation bar supports 3 to 5 destinations ("does not support more than 5 menu items"). Icon is 24dp. The active indicator is a fully rounded pill, 56dp wide × 32dp tall, using the `secondaryContainer` color, with 4dp between indicator and label. Labels use Title Small, one line. — [Material Components Android: BottomNavigation docs](https://gitea.com/784622644/material-components-android/src/branch/master/docs/components/BottomNavigation.md)
- M3 Expressive cut the container height from 80dp to 64dp. At 600dp+ windows the item layout switches to icon-beside-label (horizontal). — [same source](https://gitea.com/784622644/material-components-android/src/branch/master/docs/components/BottomNavigation.md)
- Classic M3 NavigationBar default height is 80. — [Flutter API: NavigationBar.height](https://api.flutter.dev/flutter/material/NavigationBar/height.html)
- Android's default label mode shows labels on all items only when there are 3 or fewer. With 4 or more it shows only the selected label. Apple and NN/g both recommend labels (see below), so for a study app keep all 4 labels visible. — [Material Components docs](https://gitea.com/784622644/material-components-android/src/branch/master/docs/components/BottomNavigation.md)
- Apple HIG says to use a tab bar for navigation, not actions (actions go in a toolbar). Keep it visible across sections, since hiding it makes people forget where they are; modals are the exception. Avoid overflow "More" tabs. **"Don't disable or hide tab bar buttons, even when their content is unavailable… If a section is empty, explain why."** Include labels and use single words where possible. Prefer filled icons. Reserve badges for critical info. Default list of five or fewer. (Updated June 8, 2026.) — [Apple HIG: Tab bars](https://developer.apple.com/design/human-interface-guidelines/tab-bars.md)
- iPadOS places the tab bar near the top and can convert it to a sidebar (`sidebarAdaptable`). This is the platform precedent for "bottom bar on phone → top bar or sidebar on larger screens". — [Apple HIG: Tab bars](https://developer.apple.com/design/human-interface-guidelines/tab-bars.md)
- NN/g says that with 4–5 main categories, showing all of them at all times makes sense. Beyond 5 it is hard to keep touch targets large. Labeling icons is "a recommended best practice in most cases". Hamburger menus are the least discoverable option. (2015, still the canonical primer.) — [NN/g: Basic Patterns for Mobile Navigation](https://www.nngroup.com/articles/mobile-navigation-patterns/)
- WCAG 2.2 SC 2.5.8 (AA) requires pointer targets of at least 24×24 CSS px, or spacing so that a 24px circle around each target doesn't overlap another. It recommends the stricter 2.5.5 (Enhanced) for important controls. — [W3C Understanding 2.5.8](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)
- `env(safe-area-inset-bottom)` is the safe distance from the bottom edge. It is 0 on rectangular viewports. MDN's sticky footer example: `padding: 1em 1em calc(1em + env(safe-area-inset-bottom));`. The variable names are case-sensitive. — [MDN: env()](https://developer.mozilla.org/en-US/docs/Web/CSS/env)
- On iOS, the insets become non-zero only with `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">`. (MDN's fetched page didn't state this. It came from the fetch tool's general-knowledge note, so treat it as widely known but not verified from that page.) — [MDN: env()](https://developer.mozilla.org/en-US/docs/Web/CSS/env)

### Inferences
- Tailwind sketch: `<nav aria-label="Main" class="fixed inset-x-0 bottom-0 border-t bg-white/90 backdrop-blur pb-[env(safe-area-inset-bottom)] md:static md:border-0">` containing `grid grid-cols-4 h-16`. Each item is `flex flex-col items-center justify-center gap-1 min-h-12 text-xs`. The active pill is `h-8 w-14 rounded-full bg-indigo-100` behind the icon. Add `pb-[calc(4rem+env(safe-area-inset-bottom))]` to `<main>` so content isn't hidden behind the bar.
- Use `md:` (768px) or a custom 600px breakpoint to move the nav to a top bar (`md:top-0 md:flex-row`, icon beside label). From `lg:` up, use a 220–240px left sidebar.
- Mark the current tab with `aria-current="page"` on links (route-based). This is simpler and more correct than `role="tablist"` for app-level navigation. The ARIA tabs pattern suits in-page panels, such as segmented filters.
- ≥44–48px targets: Apple's 44pt and Material's 48dp are common platform conventions. I didn't fetch a 2023+ primary page stating them, but `min-h-12` (48px) satisfies both and WCAG 2.5.8.
- The tab bar is for navigation only. Put "+ Add" as a floating button or header button inside each screen, not as a fifth center tab (Apple HIG: tab bars are not for actions).

### Gaps
- m3.material.io spec pages render only with JavaScript and couldn't be fetched. Indicator size (56×32 vs the 64×32 commonly quoted for original M3) comes from the Android component docs, which reflect M3 Expressive. Original M3 used a 64×32 indicator and 80dp bar (not verified from a fetched primary page).
- I couldn't fetch an Apple page giving the tab bar height in points for iOS (only tvOS's 68pt was stated).

---

## Q2. "Today" screen: countdown to next exam + short daily checklist

### Takeaway
Lead with one large, plain number ("12 days" until the next exam, plus the subject and date). Below it, show a short, finite checklist of about 3–5 items with a visible "2 of 4 done" progress bar. Todoist's own guidance is to pick the 3 most important tasks and reschedule the rest. Hick's Law and the goal-gradient effect explain why short lists with visible progress feel calmer and keep people going.

### Cited Findings
- Todoist's Today view shows every task dated today. To keep it manageable: "pick the 3 most important tasks" (mark them P1), reschedule what you can't realistically finish, plan in the morning, and postpone overdue tasks instead of letting them pile up. P1 tasks appear at the top in red. — [Todoist Help: Plan your day with the Today view](https://www.todoist.com/help/articles/plan-your-day-with-the-today-view-UVUXaiSs)
- Hick's Law: "The time it takes to make a decision increases with the number and complexity of choices." Takeaways: reduce choices, break tasks into steps, highlight recommended options, and use progressive onboarding. — [Laws of UX: Hick's Law](https://lawsofux.com/hicks-law/)
- Goal-gradient effect: people become more motivated the closer they get to a goal. Showing steps remaining ("15 actions left") and how little remains of a daily goal improves completion. — [Built for Mars: Goal-gradient effect](https://builtformars.com/ux-glossary/goal-gradient-effect)
- Structured (daily planner) centers the app on a single visual timeline of the day, combining events and to-dos, with color-coding plus icons. It lists "Differentiate Without Color Alone" as an accessibility feature, and has an Inbox for capturing items to sort later. Pro "Replan" reschedules missed tasks. — [App Store: Structured – Daily Planner](https://apps.apple.com/app/apple-store/id1499198946)
- Things 3 splits Today into a main section and a "This Evening" section (`when=evening`) and has a separate Deadlines list. It also supports Today / Upcoming / Anytime / Someday lists. — [Things URL scheme support doc](https://culturedcode.com/things/support/articles/2803573/)

### Inferences
- Countdown component: a card with a large number (`text-5xl font-semibold tabular-nums`) and "days" beneath, then "Physics · Mon 3 Nov". Under 48h, switch to hours ("in 20 h"). Use a big number, not a ring. A ring implies a fixed total, which an exam countdown lacks unless you define a start date. A thin progress bar "since you started prepping" is optional.
- Use calm wording: avoid red or alarm colors until the final 1–2 days, and even then use amber, not red. This matches the "calm" brief. It is an inference; no source tested exam-anxiety color effects.
- Checklist: cap visible items at 5 with "+ 2 more" collapsed. Add a progress bar with "2 of 4 done" text. When the list is complete, show a gentle "All done for today" state instead of an empty box.
- Optional "Later" or "Tomorrow" move action (Todoist-style postpone) keeps today's list honest.
- Use native `<input type="checkbox">` with `<label>` and keep it in a `<ul>` so screen readers announce the list count.

### Gaps
- I didn't fetch details on dedicated exam-countdown apps or Notion study templates. No primary source compares ring vs number countdown legibility.
- No primary research found that specifically quantifies "3–5 items" reducing overwhelm. The figure of 3 comes from Todoist's guidance. Hick's Law and goal-gradient are general principles.

---

## Q3. Calendar: month grid vs week strip vs agenda; exams vs study sessions; navigation; adding sessions

### Takeaway
On phones, use a compact week strip or month grid with dots for "something on this day", above a scrolling agenda list grouped by day. Todoist's "Week Navigator" is a strong reference: dot under days with items, swipe or arrows for the next week, a month picker for jumping, a "Today" button in the top-right, and add a task by dropping it on a date. Show exams and study sessions with distinct chip styles that differ in shape or icon as well as color.

### Cited Findings
- Todoist Upcoming: a "Week Navigator" bar shows the current week's days. Tap a date to view it. Swipe (mobile) or click the arrow (web) for future weeks. A month picker at the top-left jumps to any day, month, or year. **A small dot below a date means tasks are due. No dot means the day is free.** A "Today" button sits at the top-right. Add tasks by dragging the add button onto a date, and reschedule by dragging tasks to another day. — [Todoist Inspiration: Upcoming view](https://www.todoist.com/inspiration/todoist-upcoming-view)
- Todoist's calendar layout (web and desktop) lets you drag tasks onto hours to time-block and drag the bottom edge to set duration. This is a Pro feature. — [Todoist Help: Today view](https://www.todoist.com/help/articles/plan-your-day-with-the-today-view-UVUXaiSs)
- Structured offers day and week timelines, with color plus icon per item, and doesn't rely on color alone. — [App Store: Structured](https://apps.apple.com/app/apple-store/id1499198946)
- WAI-ARIA date grid pattern: a `table` with `role="grid"` and `aria-labelledby` pointing to the month heading. Column `th` elements use an `abbr` with the full day name. **Roving tabindex**: one cell has `tabindex="0"`, the rest `-1`. Arrows move by day or week. Home/End go to the start or end of the week. PageUp/PageDown change month (keeping the day number, clamping to month end). Shift+PageUp/Down change year. Enter/Space selects. `aria-selected="true"` goes only on the selected date. — [WAI-ARIA APG: Date Picker Dialog example](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/datepicker-dialog/)

### Inferences
- Recommended mobile layout: a header with "‹ October 2026 ›" and a "Today" pill. Below it, a month grid (7 columns, `aspect-square` cells at least 40–44px, today ringed, selected day filled). Below that, the agenda for the selected day. On desktop, show the grid and agenda side by side (`lg:grid-cols-[1fr_320px]`).
- Markers in cells: an exam is a filled square or star dot in a strong accent; a study session is a small hollow or soft dot. Give at most 3 dots per cell and use "+" for overflow. In the agenda, show an exam as a bold chip with a 🎓/flag icon and "Exam" text, and a study session as a soft tinted chip with a book icon and time range. This meets "not color alone" (Structured precedent, WCAG 1.4.1).
- Simple add: a "+ Study session" button opens a bottom sheet (`<dialog>`) prefilled with the selected date and three fields: subject (select), time (optional), duration chips (30/60/90 min). Skip drag-to-time-block for v1.
- Give each day cell an accessible name, for example `aria-label="Monday 3 November, 1 exam, 2 study sessions"`. Use `aria-current="date"` for today (a standard ARIA value; not shown in the APG example).

### Gaps
- I found no 2023–2026 usability study comparing month grid vs week strip vs agenda on mobile. The recommendation rests on app precedents (Todoist, Structured).
- MyStudyLife's exam/class display wasn't fetched.

---

## Q4. Subjects: topic progress rollup, notes, PDFs in a browser-only app (storage limits)

### Takeaway
Model each subject as a list of topics with checkboxes. Percent equals checked topics divided by total, shown as a bar plus "7 / 12 topics". Notes are a plain textarea autosaved to localStorage. Do **not** put PDFs in localStorage, which is about 5MB and stores strings only. Store PDF Blobs in IndexedDB (or OPFS) and create object URLs on demand. Offer "add a link" as the zero-storage option.

### Cited Findings
- localStorage is about 5MB, strings only, synchronous (blocks the main thread), and unavailable in workers. web.dev says it "should be avoided" for anything substantial. — [web.dev: Storage for the web](https://web.dev/articles/storage-for-the-web)
- IndexedDB quotas: Chrome lets an origin use up to 60% of disk (about 5% in Incognito). Firefox allows up to 2GB per eTLD+1 group. Safari allows about 1GB, then prompts in 200MB steps. For blob or file content, web.dev recommends **OPFS**; for structured data, IndexedDB with a promise wrapper. — [web.dev: Storage for the web](https://web.dev/articles/storage-for-the-web)
- Storage is "best effort" and can be evicted. `navigator.storage.persist()` protects it from automatic eviction. **Safari caps script-writable storage (IndexedDB, Cache) at 7 days of no user interaction** (since iOS 13.4 / Safari 13.1); installed PWAs are exempt. Over-quota writes throw `QuotaExceededError`. — [web.dev: Storage for the web](https://web.dev/articles/storage-for-the-web)
- `URL.createObjectURL(file)` returns a `blob:` URL that keeps the Blob in memory until `URL.revokeObjectURL()` is called; creating them in a loop leaks memory. Blob URLs are tied to the document and don't survive a reload, so the Blob itself must be persisted (for example, in IndexedDB) and the URL recreated. (The reload behavior came from the fetch tool's spec-knowledge note, not MDN text.) — [MDN: URL.createObjectURL()](https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL_static)
- Goal-gradient: visible progress toward completion raises motivation, which supports a per-subject progress bar. — [Built for Mars](https://builtformars.com/ux-glossary/goal-gradient-effect)

### Inferences
- Data shape (localStorage JSON): `subjects: [{id, name, color, examDate, topics:[{id,title,done}], notes:"", files:[{id,name,size,kind:'idb'|'link',url?}]}]`. File Blobs live in an IndexedDB store keyed by file id. The `idb-keyval` library keeps this to a few lines.
- PDF flow: `<input type="file" accept="application/pdf">`, then `set(id, file)` in IndexedDB. To open, `get(id)`, then `URL.createObjectURL(blob)`, then `window.open` or `<iframe>`, then revoke on close. Show the size and a "Stored on this device only" note, and call `navigator.storage.persist()` after the first upload. Wrap writes in try/catch for `QuotaExceededError` and show a friendly message.
- Mention the Safari 7-day eviction risk with a small "Export backup (JSON)" option. That is a design suggestion.
- Subject list card: color dot, name, "Exam in 12 days", progress bar, and "7/12 topics". Subject detail: three sections (Topics, Notes, Files) as stacked cards on mobile. Topic rows use native checkboxes. A parent "mark all" checkbox can use `indeterminate` (set by JavaScript) when partially complete.
- Notes: autosave with a debounce (about 500ms) and a subtle "Saved" text. Avoid rich text in v1.

### Gaps
- I didn't fetch the WAI-ARIA checkbox (tri-state) pattern page. `indeterminate` and `aria-checked="mixed"` are standard but uncited here.
- The `persist()` API details (grant heuristics per browser) were not documented on the fetched page.

---

## Q5. Questions: filter by subject, expandable answers, "revised" marking, search (Quizlet/Anki patterns)

### Takeaway
Use a search field and a horizontally scrollable row of subject chips (single-select with "All"), plus a "Not revised / Revised / Starred" segmented filter. Each question is an accordion row (button inside a heading, `aria-expanded`, `aria-controls`). Inside the row, a "Mark revised" toggle mirrors Quizlet's private star and Anki's mark or flag, and those can be filtered on.

### Cited Findings
- Quizlet: tap a **Star** next to a term to revisit it. Stars are private. Shift-click stars a range. A **Starred / "Study X"** button on the set page studies only starred terms, and "Study starred" is available across sets in a folder. — [Quizlet Help: Studying most missed terms with stars](https://help.quizlet.com/hc/en-ca/articles/360031172312-Studying-most-missed-terms-with-stars)
- Anki Browser: a sidebar of quick filters (decks, tags, saved searches) runs searches when clicked, and they can be combined (AND/OR/negate). A search box sits above the card list. A "Marked" note carries the *Marked* tag and shows purple. Flags color the row. Toggle Mark applies to the selection. — [Anki Manual: Browsing](https://docs.ankiweb.net/browsing.html)
- WAI-ARIA accordion: each header's title is a `button` inside a heading with the right `aria-level`, and the button must be the only element in the heading. Use `aria-expanded` true/false and `aria-controls` pointing to the panel id. The optional `role="region"` with `aria-labelledby` should be avoided when more than about 6 panels can be open. Enter/Space toggles. Tab and Shift+Tab use normal order. — [WAI-ARIA APG: Accordion](https://www.w3.org/WAI/ARIA/apg/patterns/accordion/)
- WAI-ARIA tabs, for a segmented filter that switches panels: `tablist`, `tab` (`aria-selected`, `aria-controls`), and `tabpanel` (`aria-labelledby`). Left/Right arrows move between tabs and wrap; Home/End are optional. Automatic activation is recommended when panels show without latency. — [WAI-ARIA APG: Tabs](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/)

### Inferences
- Subject chips filter one list rather than switching panels, so use a group of toggle buttons (`role="group"` plus `aria-pressed`) or radio inputs styled as chips, not `tablist`. Use the tabs pattern only if each segment has its own panel.
- Row layout: `<h3><button aria-expanded aria-controls="a-12" class="w-full text-left flex justify-between min-h-12">Q text <Chevron class="transition-transform aria-expanded:rotate-180"/></button></h3>`, then `<div id="a-12" hidden={!open}>` with the answer, then a footer row with a "✓ Revised" toggle (`aria-pressed`), an "★ Important" toggle, and the subject chip. Keep toggles outside the heading button, per APG.
- Allow multiple answers open (study use). Add "Expand all / Collapse all" for revision sessions.
- Search: client-side `includes()` on question and answer text with a 150ms debounce. Show "3 of 40 questions" live (`aria-live="polite"`). Make the empty-result state explicit: "No questions match 'enthalpy' in Chemistry. Clear filters."
- Optional "Revise mode" (Quizlet/Anki-inspired): show only not-revised questions one at a time, with answers hidden until tapped.

### Gaps
- Brainscape's confidence-rating (1–5) UI wasn't fetched. It could inform a "how confident" variant of "revised".
- NN/g's accordion article couldn't be fetched (fetch error), so its mobile accordion guidance isn't included.

---

## Q6. Empty states and onboarding for study apps

### Takeaway
Never leave a blank tab. Each empty tab should say what will appear there, why it's empty, and offer one direct button to fill it. A brief first-run flow (add first exam, then subject, then topics) beats a forced tutorial. NN/g calls in-context empty-state help more memorable than tutorials, and Hick's Law supports progressive onboarding.

### Cited Findings
- NN/g (Kaplan, 2021) gives three jobs for an empty state: (1) **communicate system status**, which means not showing "No records" while still loading; (2) **provide learning cues**, which means explaining what the feature does; in-context help is more memorable than tutorials; (3) **provide direct pathways**, such as a Create button and not vague text. Don't default to a blank state. — [NN/g: Designing Empty States in Complex Applications](https://www.nngroup.com/articles/empty-state-interface-design/)
- Apple HIG: don't hide or disable tabs when empty. Explain why the content is unavailable. — [Apple HIG: Tab bars](https://developer.apple.com/design/human-interface-guidelines/tab-bars.md)
- Hick's Law takeaway: "use progressive onboarding to introduce features to new users gradually." — [Laws of UX: Hick's Law](https://lawsofux.com/hicks-law/)

### Inferences
- Today (no exams): "When's your next exam? Add it and we'll count down for you." Button: "+ Add exam". Today (all done): "Nice — today's list is done." with an optional "Plan tomorrow" link.
- Calendar (empty): "No study sessions yet. Tap a day to plan one."
- Subjects (empty): "Add a subject to track your syllabus." Offer quick-add chips for common subjects.
- Questions (empty): "Save important questions here to revise before the exam." Button: "+ Add question". Use a separate "no results" message for empty filters.
- First run: a 3-step skippable sheet (Exam name and date → Subjects → Done), then land on Today with the countdown already populated. Store `onboarded: true` in localStorage.
- Copy tone: friendly, short, second person. One illustration or emoji at most per empty state.

### Gaps
- NN/g's source is from 2021; I found no 2023–2026 study-app-specific onboarding research. Mobbin and Dribbble couldn't be accessed through fetch, so there are no screenshot-level references.

---

## Q7. Accessibility: focus states, ARIA for tabs/accordions/checkboxes, calendar keyboard navigation

### Takeaway
Prefer native elements: `<a aria-current="page">` for nav, `<button>` with `aria-expanded` for accordions, native checkboxes with labels, and `<dialog>` for add sheets. Add ARIA only where a pattern needs it (calendar grid with roving tabindex). Give every interactive element a visible focus ring and a 24px-minimum (target 48px) hit area.

### Cited Findings
- Tabs pattern roles and keys (tablist, tab, tabpanel; arrows, Home/End; automatic vs manual activation). — [WAI-ARIA APG: Tabs](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/)
- Accordion pattern (heading > button only, `aria-expanded`, `aria-controls`, Enter/Space, region caveat over 6 panels). — [WAI-ARIA APG: Accordion](https://www.w3.org/WAI/ARIA/apg/patterns/accordion/)
- Date grid keyboard model (arrows, Home/End, PageUp/PageDown, Shift+PageUp/Down), roving tabindex, `aria-selected` on the chosen date only, `th abbr` for full day names. — [WAI-ARIA APG: Date Picker Dialog](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/datepicker-dialog/)
- Target size minimum is 24×24 CSS px (WCAG 2.2 AA 2.5.8), with Enhanced recommended for important controls. — [W3C Understanding 2.5.8](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)
- Structured explicitly supports "Differentiate Without Color Alone", VoiceOver, and a dyslexia-friendly font. This is a precedent for a calm study app. — [App Store: Structured](https://apps.apple.com/app/apple-store/id1499198946)

### Inferences
- Tailwind focus: `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2` on all buttons, links, and chips. Never remove outlines without a replacement.
- Calendar: implement roving tabindex in React with a `focusedDate` state, and handle `onKeyDown` for the APG keys. When the month changes, move focus to the same day number, clamped.
- Accordion rows: animate with `motion-safe:` utilities only. Respect `prefers-reduced-motion`.
- Exam vs session markers need text or icon equivalents (aria-label on day cells, "Exam" text in chips).
- Use a live region for checklist progress ("3 of 4 done") and search result counts, with `aria-live="polite"`.
- Check color contrast at least 4.5:1 for text (WCAG 1.4.3). This is a standard requirement, not fetched here.

### Gaps
- I didn't fetch the WAI-ARIA checkbox pattern or the WCAG 1.4.1/1.4.3 pages; those requirements are standard but uncited above.
