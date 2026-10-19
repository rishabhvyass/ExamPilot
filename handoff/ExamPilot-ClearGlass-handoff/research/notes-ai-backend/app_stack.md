# ExamPilot free app stack: auth, data sync, storage, PDF, charts, animation (as of 18 Oct 2026)

Research date: 2026-10-18. Pricing pages were fetched live on that date unless noted. Vendors change free tiers often, so re-check before launch.

## 1. Auth (email+password + "Sign in with Google"): Firebase Auth vs Supabase Auth vs Clerk vs Appwrite

### Takeaway
All four give roughly 50K+ free monthly users, which is far more than ExamPilot needs. Firebase Auth is the safest default for an India-based web-first app that may later move to Expo. It has 50K MAU free on Spark, Google sign-in is first-party, and verification/reset emails need no SMTP setup. Supabase Auth is good too, but its built-in email sender allows only 2 emails per hour, so you need custom SMTP before real users arrive. India also blocked supabase.co for about a week in Feb–Mar 2026. Clerk has the most polished UI, but its free tier keeps Clerk branding and allows only 3 social connections.

### Cited Findings
- **Firebase Spark (no-cost):** Authentication allows 50K MAUs (Identity Platform) and 50 MAUs for SAML/OIDC. Phone auth is "Not applicable" on Spark, which doesn't matter because ExamPilot needs no SMS. Quotas apply per project. (Fetched 2026-10-18.) — [Firebase pricing](https://firebase.google.com/pricing)
- **Supabase Free:** 50,000 MAUs, 2 active projects. Pro starts at $25/month. (Fetched 2026-10-18.) — [Supabase pricing](https://supabase.com/pricing)
- **Supabase built-in email provider:** limited to **2 emails per hour** per project, across all email-sending Auth endpoints (signup confirmation, password reset, magic link). The limit can be changed only with custom SMTP or a Send Email hook. — [Supabase Auth rate limits](https://supabase.com/docs/guides/auth/rate-limits)
- **Supabase Google sign-in on web:** `supabase.auth.signInWithOAuth({ provider: 'google' })`, or Google's prebuilt button / One Tap with the ID token passed to `signInWithIdToken` (nonce recommended). Without a custom domain, the Google consent screen shows `<project-id>.supabase.co`, which the docs say "does not inspire trust". A custom domain is a paid add-on. For native apps, put Web, iOS and Android client IDs comma-separated, with the web client ID first. — [Supabase Google login docs](https://supabase.com/docs/guides/auth/social-login/auth-google)
- **Clerk Free (Hobby):** 50,000 monthly *retained* users per app, unlimited apps, up to 3 social connections, fixed 7-day sessions, and Clerk branding stays on prebuilt UIs. No MFA, SMS or passkeys. Email codes/links and custom domains are included. Pro costs $20/mo billed annually or $25/mo monthly. (Fetched 2026-10-18.) — [Clerk pricing](https://clerk.com/pricing)
- **Clerk on Expo:** hosted (browser) auth works in Expo Go. Native components (`<AuthView />`, SwiftUI/Jetpack Compose, **beta**) and native Google sign-in need a development build. Google setup needs iOS, Android and Web OAuth client IDs. — [Clerk Expo quickstart](https://clerk.com/docs/quickstarts/expo)
- **Appwrite Cloud Free (secondary source):** 75K MAU, 5 GB bandwidth, 2 GB storage, 1 database and 1 bucket per project, 2 projects per account sharing one resource allowance. Read from appwrite.io/pricing by the aggregator on 2026-10-04. — [AgentDeals Appwrite page](https://agentdeals.dev/vendor/appwrite)
- **Appwrite inactivity:** Free projects pause after 7 days with no *Console/development* activity, and end-user traffic doesn't count (changelog 2026-02-20). Projects paused for 90 days are deleted after email warnings (changelog 2026-06-29). The aggregator rates Appwrite "caution" because of this. — [AgentDeals Appwrite page](https://agentdeals.dev/vendor/appwrite)
- **Appwrite pricing page (official):** on a Free plan limit breach the project freezes and the Console becomes read-only. The fetched page didn't render exact Free numbers or the Pro price. — [Appwrite pricing](https://appwrite.io/pricing)
- **Google sign-in in Expo, generally:** both main libraries (`@react-native-google-signin/google-signin` and `react-native-nitro-google-signin`) need native code, so they "can't be used in Expo Go". You need a config plugin and a dev build. The legacy Android Google Sign-In SDK is deprecated in favour of Credential Manager. In `@react-native-google-signin`, the Credential Manager APIs are part of a paid offering. Android needs the SHA-1 fingerprint registered in Firebase or Google Cloud. — [Expo Google auth guide](https://docs.expo.dev/guides/google-authentication/)
- **India: Supabase block.** On 2026-02-24 a Section 69A IT Act order led JioFiber, Airtel and ACT Fibernet to block supabase.co, with uneven enforcement. supabase.com stayed reachable. Supabase suggested a DNS change or a VPN. — [TechCrunch, 2026-02-27](https://www.techcrunch.com/2026/02/27/india-disrupts-access-to-popular-developer-platform-supabase-with-blocking-order/); [MediaNama](https://www.medianama.com/2026/02/223-supabase-isp-level-block-jiofiber-users-india/)
- The block was resolved on 2026-03-03: "Access ... has now been fully restored for all users across India." — [Lovable status incident](https://status.lovable.dev/incidents/01KJDBPNKJRQZPEDCY6MW95CYX)
- The recommended structural mitigation is to proxy Supabase through your own domain (for example Cloudflare Workers) so clients never call supabase.co directly. Self-hosting is the other option. — [WhyOps, 2026-02-28](https://whyops.com/blog/supabase-blocked-india)
- **Google "Sign in with Google" branding rules** (following them is required for app verification):
  - **Text:** "Sign in with Google", "Sign up with Google" or "Continue with Google" (localisable). Never "Google" alone.
  - **Themes:**
    - Light: fill #FFFFFF, stroke #747775, text #1F1F1F
    - Dark: fill #131314, stroke #8E918F, text #E3E3E3
    - Neutral: fill #F2F2F2, no stroke, text #1F1F1F
  - **Font:** Google Sans Medium 14/20 (not Roboto).
  - **Padding:**
    - Web/Android: 12px left of the G, 10px right of the G, 12px right of the text.
    - iOS: 16 / 12 / 16.
  - **Logo:** keep the aspect ratio. The standard full-colour G must not be recoloured, made monochrome, recreated, or used without the button frame and text.
  - **Prominence:** the button must be at least as prominent as other third-party sign-in options.
  - **Preferred implementation:** the Google Identity Services SDK button, which stays compliant automatically.
  - — [Google Identity branding guidelines](https://developers.google.com/identity/branding-guidelines)

### Inferences
- **Recommendation: Firebase Auth** (email/password + Google provider), for these reasons:
  - It's free up to 50K MAU.
  - Its verification and reset emails come from Firebase's own sender, so ExamPilot avoids Supabase's 2-emails-per-hour trap. (This is from general Firebase knowledge; the pricing page doesn't list an email cap.)
  - Google sign-in is native to Google's platform, and the consent screen shows your Firebase project/app name rather than a third-party domain.
  - The Expo path works via `@react-native-google-signin` plus Firebase credentials in a dev build.
- **If Supabase is chosen** (attractive for Postgres plus Storage on one free plan):
  - Configure free custom SMTP (for example Brevo or Resend free tiers) before inviting testers.
  - Plan for a Cloudflare proxy or custom domain as insurance against another India ISP block.
- **Clerk:** a good choice if you want drop-in UI fast, but you still need a separate database and storage, and the free tier keeps Clerk branding.
- **Appwrite:** the 7-day Console-inactivity pause and the 90-day deletion rule make it risky for a student side project that may sit idle during exams.

### Gaps
- I didn't find a documented daily cap on Firebase Auth verification/reset emails on Spark.
- Appwrite's exact Free/Pro numbers come from an aggregator, not a first-party page render.
- I didn't find a first-party statement of whether `expo-auth-session`'s Google provider is still recommended for 2026.

## 2. Database + file storage free tiers (Firestore vs Supabase Postgres + Storage vs Appwrite), including Supabase inactivity pausing

### Takeaway
Supabase Free bundles a 500 MB Postgres database, 1 GB file storage (50 MB max file) and 5 GB egress, but projects pause after 1 week of inactivity. Firestore on Spark gives 1 GiB storage and 50K reads/20K writes per day with no pausing. However, **Cloud Storage for Firebase now requires the Blaze (pay-as-you-go) plan**, so uploading PDFs to Firebase needs a billing account, even though Blaze still includes a no-cost allowance.

### Cited Findings
- **Supabase Free:**
  - 500 MB database per project
  - 1 GB file storage, 50 MB maximum file upload
  - 5 GB egress plus 5 GB cached egress
  - 2 active projects
  - Pauses after 1 week of inactivity
  - Pro is $25/mo, plus $10/mo per extra project
  - (Fetched 2026-10-18.) — [Supabase pricing](https://supabase.com/pricing)
- Paused Supabase projects don't count toward the free project quota and accrue no compute charges. — [Supabase billing FAQ](https://supabase.com/docs/guides/platform/billing-faq)
- **Firestore Standard on Spark:** 1 GiB stored, 20K writes/day, 50K reads/day, 20K deletes/day, 10 GiB/month egress. The Enterprise edition has a similar free allowance in "units". (Fetched 2026-10-18.) — [Firebase pricing](https://firebase.google.com/pricing)
- **Cloud Storage for Firebase on Spark:** listed as "Not applicable" on the pricing page. — [Firebase pricing](https://firebase.google.com/pricing)
- The Storage FAQ states that "your Firebase project must be on the pay-as-you-go Blaze pricing plan". Spark projects lose bucket access and get 402/403 errors. — [Firebase Storage FAQ (Sept 2024 changes)](https://firebase.google.com/docs/storage/faqs-storage-changes-announced-sept-2024)
- **No-cost usage that remains on Blaze:**
  - Legacy `*.appspot.com` buckets keep 5 GB stored, 1 GB downloaded/day, 20K uploads/day and 50K downloads/day.
  - New `*.firebasestorage.app` buckets get the GCS "Always Free" tier, but only in US-CENTRAL1, US-EAST1 and US-WEST1.
  - — [Firebase Storage FAQ](https://firebase.google.com/docs/storage/faqs-storage-changes-announced-sept-2024)
- **Appwrite Free (aggregator):** 2 GB storage, 5 GB bandwidth, 1 bucket per project. Projects pause after 7 days without Console activity and are deleted after 90 days paused. — [AgentDeals Appwrite page](https://agentdeals.dev/vendor/appwrite)

### Inferences
- **Option A (simplest single vendor): Firebase Auth + Firestore on Spark,** with *no* cloud file storage at first.
  - Keep user-uploaded PDFs on the device (IndexedDB on web, the file system on Expo) and sync only metadata, highlights and progress to Firestore.
  - If cloud PDF storage becomes necessary, upgrade to Blaze with a budget alert and use a US region to stay inside the Always Free tier.
- **Option B (one free plan covers everything): Supabase Auth + Postgres + Storage.**
  - The 1 GB / 50 MB-per-file limits are fine for exam PDFs.
  - Mitigate the 1-week pause by actually using the app, or with a scheduled ping (a GitHub Actions cron, for example). Supabase may treat automated keep-alives as abuse, so check its terms.
  - Add the SMTP and India-proxy mitigations from section 1.
- ExamPilot's data shape (subjects, sessions, scores, AI plans) is small. Both 500 MB of Postgres and 1 GiB of Firestore will last a long time.

### Gaps
- The Supabase project-pausing guide failed to fetch. I couldn't confirm first-hand what counts as "activity" (API requests vs dashboard use) or the exact restore window for paused projects. It's widely reported as 90 days, but I didn't verify that.

## 3. In-app PDF viewing (react-pdf / pdf.js on web; react-native-pdf / Expo on mobile)

### Takeaway
On web, use **react-pdf (wojtekmaj, MIT)**. It gives you `<Document>`/`<Page>` with text and annotation layers plus a `<Thumbnail>` component. If ExamPilot needs user highlights, use **react-pdf-highlighter-extended** (MIT, pdf.js-based) for text and area highlights. On Expo, use **react-native-pdf (MIT, v7.0.5)**, which needs a dev build and config plugin. A lighter alternative is **react-native-pdf-renderer (MIT)**, which uses native PdfRenderer/PDFKit. Neither native library provides a real thumbnail strip or cross-platform text selection.

### Cited Findings
- **react-pdf:**
  - MIT licence, docs for the 10.x line.
  - `<Page>` renders a text layer (needs `TextLayer.css`) and an annotation layer (needs `AnnotationLayer.css`) by default, and `customTextRenderer` lets you customise text rendering (useful for search-term highlighting).
  - `<Thumbnail>` renders a page preview without text or annotation layers, and `onItemClick` navigates to that page.
  - The worker must be configured: `pdfjs.GlobalWorkerOptions.workerSrc` pointing to `pdfjs-dist/build/pdf.worker.min.mjs` via `new URL(..., import.meta.url)`.
  - — [react-pdf GitHub](https://github.com/wojtekmaj/react-pdf)
- **react-pdf-highlighter-extended:** MIT, uses PDF.js. Supports text and rectangular (area) highlights plus `scrollToHighlight`. 27 open issues and 11 open PRs at fetch time. — [GitHub](https://github.com/DanielArnould/react-pdf-highlighter-extended)
- **react-native-pdf:**
  - MIT, latest v7.0.5 (security upgrade plus iOS text-selection fixes).
  - "Not available in the Expo Go app", so it needs a custom dev client with an Expo config plugin.
  - Has page navigation (`page`, `setPage()`, `onPageChanged`), pinch and double-tap zoom, and caching (`source.cache`, `expiration`).
  - Text selection exists on iOS via PDFKit (v7.0.4); Android isn't mentioned.
  - No thumbnail component; `singlePage` is "useful for thumbnail views".
  - Has a Fabric code path, but full New Architecture support isn't stated explicitly.
  - — [react-native-pdf GitHub](https://github.com/wonday/react-native-pdf)
- **react-native-pdf-renderer:** MIT, v1.6.0. Uses native PdfRenderer (Android) and PdfKit (iOS) with no third-party native dependencies. Options include `maxPageResolution` (Android, default 2048, to prevent zoom crashes), `maxZoom` (default 5), and experimental `singlePage` for thumbnails. — [npm](https://www.npmjs.com/package/react-native-pdf-renderer)

### Inferences
- **For large PDFs on web**, render pages lazily:
  - Virtualise the page list (for example with react-window or an IntersectionObserver) so only visible `<Page>` components mount.
  - Turn off `renderTextLayer`/`renderAnnotationLayer` on off-screen or thumbnail pages, and render thumbnails at small widths.
  - This is standard pdf.js practice; react-pdf's README doesn't document performance guidance.
- **For highlights**, store them as JSON (page number plus bounding rects plus text) in Firestore or Supabase. That keeps them sync-able and independent of the PDF file.
- **On Expo**, an alternative is opening PDFs in a WebView running pdf.js, which reuses the web highlight code. This adds complexity and memory use.

### Gaps
- I found no benchmark numbers for react-pdf with 300+ page PDFs.
- The pdf.js version bundled with react-pdf 10.x and the exact latest react-pdf release number weren't on the fetched page.
- Android text selection in react-native-pdf is unconfirmed.

## 4. Charts from AI JSON: Recharts vs Chart.js vs Victory Native / visx

### Takeaway
On web, **Recharts (MIT, v3.1.2, about 8.8M weekly downloads)** is the easiest way to render model output. It takes an array of objects plus `dataKey` props, so the AI can emit `[{subject:"Physics", hours:6}]` and you map it directly to `<BarChart data={...}><Bar dataKey="hours"/>`. Recharts is SVG and DOM-only, so for Expo use **Victory Native XL (MIT, Skia + Reanimated + Gesture Handler)**. Chart.js (via react-chartjs-2, MIT) is canvas-based and needs the data reshaped into `labels` + `datasets`.

### Cited Findings
- **Recharts:** MIT (copyright 2015–2026). Built on React plus D3 with "native SVG support". The example passes `data={data}` with `dataKey="name"` / `dataKey="uv"`. 27.6k GitHub stars. — [Recharts GitHub](https://github.com/recharts/recharts)
- Recharts latest version is 3.1.2, with 8,849,935 weekly downloads (fetched 2026-10-18). — [npm recharts](https://www.npmjs.com/package/recharts)
- **react-chartjs-2:** MIT, supports Chart.js v4 and v3, recommends `chart.js@^4.0.0`. The README doesn't mention React Native. — [react-chartjs-2 GitHub](https://github.com/reactchartjs/react-chartjs-2)
- **Victory Native XL:** MIT. Requires React Native Reanimated, React Native Gesture Handler and `@shopify/react-native-skia`, plus the Reanimated Babel plugin. Described as performance-focused and actively maintained. — [victory-native-xl GitHub](https://github.com/FormidableLabs/victory-native-xl)

### Inferences
- **Recommended pattern:** have the model return a strict, validated JSON schema:
  ```
  { type: "bar"|"line", title, xKey, series: [{ key, label }], data: [{...}] }
  ```
  - Validate it with zod.
  - Render it with a single `<AIChart spec={...}/>` component that switches between Recharts `BarChart`/`LineChart` on web and Victory Native XL `CartesianChart` (which takes `data`, `xKey`, `yKeys`) on native.
  - Because both libraries consume arrays of objects keyed by field names, one spec format serves both. (The Victory Native XL API names come from general knowledge; the fetched README didn't show them.)
- Chart.js is fine but less idiomatic in React, and its labels/datasets shape needs a transform step.
- visx is lower-level (D3 primitives) and overkill for two simple chart types.

### Gaps
- Victory Native XL's web support and exact Expo SDK compatibility weren't stated on the fetched README.
- I didn't verify whether Recharts 3.x has any React Native port.

## 5. Animation: Motion (web), Reanimated / Moti (mobile), shared-element tab indicators, splash screens, Lottie, confetti

### Takeaway
Use **Motion** (`motion` package, import from `motion/react`) on web. Its `layoutId` gives a shared-element sliding tab underline in about 3 lines. On Expo, use **Reanimated 4** (latest 4.8.x, New Architecture only, needs `react-native-worklets`). Treat **Moti** with caution: it is documented as "powered by Reanimated 3", and Reanimated 4 compatibility isn't confirmed. Keep the native splash (`expo-splash-screen`) up only until fonts and session load, then optionally play a short in-app intro. For celebrations, use Lottie, plus canvas-confetti with `disableForReducedMotion: true`.

### Cited Findings
- **Motion shared-element tab underline:** render `{selected === tab && <motion.div layoutId="underline" />}` inside each tab, and Motion animates it between tabs. Wrap separately-rendering components in `<LayoutGroup>`. Import from `"motion/react"`. — [Motion layout animations docs](https://motion.dev/docs/react-layout-animations)
- **Reanimated:** latest is 4.8.x, supporting RN 0.86–0.88, and it "works only with the React Native New Architecture". It depends on `react-native-worklets` 0.14.x. Reanimated 3 is no longer actively maintained and won't work with worklets installed. — [Reanimated compatibility table](https://docs.swmansion.com/react-native-reanimated/docs/guides/compatibility)
- **Moti:** MIT, with web support out of the box. It describes itself as "powered by Reanimated 3"; Reanimated 4 isn't mentioned. — [Moti GitHub](https://github.com/nandorojo/moti)
- **expo-splash-screen:**
  - Call `SplashScreen.preventAutoHideAsync()` in global scope (not inside components or hooks) and call `SplashScreen.hide()` as soon as content is ready.
  - `setOptions({ duration, fade })` controls the fade-out (default 400 ms; `fade` is listed as iOS-only).
  - The config plugin sets `backgroundColor`, `image`, `imageWidth`, `resizeMode` and dark-mode variants, and changes need a new binary.
  - Expo Go shows the app icon instead of the splash, so test on a release build.
  - For custom animated intros, the docs point to the `with-splash-screen` example.
  - — [Expo SplashScreen docs](https://docs.expo.dev/versions/latest/sdk/splash-screen/)
- **lottie-react-native:**
  - Apache-2.0.
  - The current release needs RN 0.84+ with the New Architecture; older RN versions should use 7.3.x.
  - Web support comes via `@lottiefiles/dotlottie-react`, and `.lottie` files need `"lottie"` added to Metro `assetExts`.
  - About 17.2k stars.
  - — [lottie-react-native GitHub](https://github.com/lottie-react-native/lottie-react-native)
- **canvas-confetti:**
  - ISC licence, CDN example at v1.9.4.
  - `disableForReducedMotion` defaults to false. When true, confetti is skipped for users who prefer reduced motion and the promise resolves immediately.
  - `confetti.create(canvas, { useWorker: true })` renders off the main thread when supported.
  - — [canvas-confetti GitHub](https://github.com/catdad/canvas-confetti)

### Inferences
- **Splash best practice for ExamPilot:**
  - The native splash should match the first frame of the intro (same background colour and logo position).
  - The in-app intro should be 1.5 s or less. Store a `hasSeenIntro` flag (AsyncStorage or localStorage) so repeat opens skip straight to the app.
  - Honour reduced-motion: `useReducedMotion` / `MotionConfig reducedMotion="user"` in Motion, and `AccessibilityInfo.isReduceMotionEnabled` or Reanimated's `useReducedMotion` on native.
  - These durations are design guidance, not a documented Expo rule.
- **Mobile tab indicator:** use Reanimated `useSharedValue` + `withSpring` on the indicator's translateX, measured from tab layouts. Reanimated's own shared-element transitions are separate and less needed for tabs.
- **Lottie on web:** prefer `@lottiefiles/dotlottie-react` (or `lottie-react`) and lazy-load the animation JSON only when a celebration fires, to keep the bundle small.

### Gaps
- The Motion shared-layout and reduced-motion doc pages failed to fetch. Reduced-motion API names (`MotionConfig reducedMotion`, `useReducedMotion`) come from general knowledge and weren't verified this session.
- I didn't confirm whether Moti supports Reanimated 4 (check moti.fyi or GitHub issues).
- I didn't check the current versions of `motion` or `lottie-react` on npm.

## 6. localStorage vs synced database: when to move to the cloud

### Takeaway
localStorage is fine for a single-device MVP (settings, a draft plan, a streak). Move to a synced database once you add login, because users expect their data on phone and laptop, and because AI-generated plans, highlights and progress history are data users will be upset to lose.

### Cited Findings
- I found no single authoritative source this session. The decision criteria below come from general engineering practice. The free-tier capacity numbers that make cloud sync costless at ExamPilot's scale are cited in sections 1–2 (Firestore 50K reads/day on Spark: [Firebase pricing](https://firebase.google.com/pricing); Supabase 500 MB DB: [Supabase pricing](https://supabase.com/pricing)).

### Inferences
- **Move to cloud when any of these apply:**
  - You add accounts.
  - You need multi-device access, including the planned Expo app.
  - Data is worth backing up (study history, AI plans, PDF highlights).
  - You approach localStorage's roughly 5 MB per-origin cap. Never put PDFs in localStorage; use IndexedDB.
  - You need server-side features (sending reminders, sharing).
- **Pattern:** keep a local cache as the source for instant UI, and sync to Firestore (which has built-in offline persistence) or Supabase.
  - On first login, migrate the existing localStorage data into the user's cloud document once, then clear it.
  - Keep purely device-level preferences (theme, `hasSeenIntro`, reduced-motion override) in localStorage/AsyncStorage.

### Gaps
- I didn't fetch first-party docs on Firestore offline persistence or browser storage quotas this session. These behaviours are stated from general knowledge.
