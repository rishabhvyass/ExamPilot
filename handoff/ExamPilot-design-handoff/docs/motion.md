# Motion

Goal: every interaction feels smooth and a little satisfying, never busy. Research basis: `research/notes-design/motion_design.md` (NN/g, Material 3, Apple HIG, Motion docs).

## Principles
1. **Purposeful.** Motion explains a change (where something came from, that it worked). No decoration loops on screens people stare at for long, except tiny idle hints (upload badge bob, assistant avatar glow).
2. **Fast.** UI feedback 100–260 ms; screen changes ≤ 360 ms; exits shorter than enters.
3. **Soft.** Decelerating easings and light overshoot; never bounce text.
4. **Optional.** With reduced motion, everything snaps to its final state; fades may remain.

## Tokens
| Name | Value |
|---|---|
| ease.standard | `cubic-bezier(.2,0,0,1)` |
| ease.decelerate | `cubic-bezier(.05,.7,.1,1)` |
| ease.smooth | `cubic-bezier(.2,.8,.2,1)` |
| ease.overshoot | `cubic-bezier(.2,.9,.25,1.05)` |
| spring.press | stiffness 500, damping 30 |
| spring.layout | stiffness 400, damping 34 |
| spring.progress | stiffness 300, damping 30 |

## Catalogue
| # | Where | What moves | Timing | CSS class (`keyframes.css`) | Motion preset (`motion-variants.ts`) |
|---|---|---|---|---|---|
| 1 | All buttons | hover lift −1px, press scale .97 | 120–140 ms | `ep-press` | `pressable` |
| 2 | Every tab screen | content fades + rises 10px | 360 ms in / 140 out | `ep-page-in` | `page` |
| 3 | Bottom nav | black pill slides to the new tab; label fades in from −6px | spring 400/34; label +120 ms | `ep-tab-pill`, `ep-tab-label` | `TAB_PILL_LAYOUT_ID`, `tabLabel` |
| 4 | Lists, onboarding fields | rise 12px, 60 ms stagger | 480 ms | `ep-rise ep-d1…5` | `stagger`, `rise` |
| 5 | Checkbox | pop .9→1.12→1, tick draws, strike line grows | 260 + 220 ms | `ep-pop`, `ep-draw` | `checkBox`, `checkTick`, `strike` |
| 6 | Segmented progress | segment fills | spring 300/30 | `ep-grow-x` | `segment` |
| 7 | Chart bars | grow from bottom, 120 ms stagger | 800 ms | `ep-grow-y` | `bar(i)` |
| 8 | Accordion (Questions) | height auto + fade | 250 ms | — | `accordion` |
| 9 | Login segment | indicator slides | 360 ms overshoot | `ep-seg-indicator` | `layoutId` |
| 10 | Field focus | 2px ink ring, white fill | 180 ms | `ep-field` | — |
| 11 | Splash | rings/circles bloom, logo draws, letters rise, bar fills, CTA fades | ~1.9 s | `ep-bloom`, `ep-ring`, `ep-mark`, `ep-letter`, `ep-load-bar`, `ep-fade`, `ep-orbit` | `splashTimeline`, `SplashIntro.tsx` |
| 12 | Admit card idle | upload badge bobs | 2.4 s loop | `ep-bob` | — |
| 13 | Admit card scan | scan line sweeps, rows pulse, dots blink | 1.6 s loop | `ep-scan`, `ep-shine`, `ep-dot` | — |
| 14 | Results / plan rows | fade up with stagger | 120 / 70 ms steps | `ep-fade-up` | `rise` |
| 15 | Plan ready | dot burst + badge pop + tick draw | 1.1 s | `ep-burst`, `ep-badge`, `ep-draw` | `confettiOptions` |
| 16 | Bottom sheet | slides up, scrim fades | spring 380/36 / 260 ms | `ep-sheet`, `ep-scrim` | `sheet`, `scrim` |
| 17 | Add-material FAB | shadow breathes | 2.8 s loop | `ep-fab-breathe` | — |
| 18 | Chat | bubbles rise + scale; typing dots bounce; avatar glows | 360 ms; 1 s; 3 s | `ep-msg`, `ep-typing`, `ep-glow` | `message` |
| 19 | PDF page turn | slide 40px + 2° rotate in reading direction | 420 ms | `ep-turn-next/prev` | `pageTurn` |
| 20 | PDF progress | fill + rocket glide | 500 ms | `ep-progress-fill`, `ep-rocket` | — |
| 21 | PDF finished | card pops + small burst | 600 ms | `ep-cheer`, `ep-burst` | `celebrate()` |
| 22 | Today all done | completion card fades up + one confetti burst | 260 ms | `ep-fade-up` | `celebrate()` |

## Implementation notes
- Tab pill: render the pill as an absolutely-positioned `motion.span` with the same `layoutId` inside whichever tab is active; Motion animates it between buttons (see `examples/TabBar.tsx`).
- Page transitions: key `<motion.main>` by `location.pathname` inside `<AnimatePresence mode="wait" initial={false}>`.
- Height-auto accordions: animate `height: 'auto'` on a wrapper with `overflow: hidden`.
- Confetti: `canvas-confetti`'s `disableForReducedMotion` is **off by default** — keep it `true`.
- Expo later: Reanimated 4 (+ react-native-worklets) for the same specs; `expo-splash-screen` `preventAutoHideAsync()` → show `SplashIntro` → `hide()`.

## Reduced motion
- `<MotionConfig reducedMotion="user">` makes x/y/scale/rotate/layout instant; opacity, colour and `pathLength` still animate.
- Manually gate with `useReducedMotion()`: orbit, bob, scan, glow, FAB breathing, typing dots, confetti, count-ups.
- CSS: the `@media (prefers-reduced-motion: reduce)` block at the end of `keyframes.css`.
