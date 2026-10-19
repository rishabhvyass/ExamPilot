# Motion Design for ExamPilot (React + Motion / Framer Motion)

> Scope: calm, friendly exam-prep web app. Concrete durations, easings, springs, distances, code patterns and reduced-motion handling. Research date: 2026-10-18.
> Note on numbers: values marked "recommended for ExamPilot" are my synthesis (Inferences) from the cited sources, not quoted from any one source.

## Q1. What durations and easings do authoritative sources recommend? Which feel "calm" vs "snappy"?

### Takeaway
All sources converge on roughly 100–400 ms, with ~500 ms as a hard ceiling: about 100 ms for micro-feedback (checkbox/toggle), 200–300 ms for screen changes, entering a little slower than exiting, and shorter for anything frequent. "Snappy" means ease-out at 150–250 ms or a stiff, critically damped spring. "Calm" means the same short durations with gentler deceleration (M3 standard/emphasized-decelerate) and low or no bounce, not longer animations.

### Cited Findings
**NN/g (Animation Duration)**
- Simple feedback such as a checkbox or toggle should take about 100 ms. That reads as immediate and feels like physically moving the object. — [NN/g](https://www.nngroup.com/articles/animation-duration/)
- Substantial screen changes, such as a modal entering, should take 200–300 ms. Most animations fall within 100–400 ms. Reserve up to 400 ms for large movement across a large screen. Avoid going past about 500 ms, where animations "feel like a drag." — [NN/g](https://www.nngroup.com/articles/animation-duration/)
- Entering should be subtly longer than exiting, for example a popup at 300 ms in and 200–250 ms out. The more often an animation is seen, the shorter and subtler it should be. Use the shortest duration that isn't jarring, because animations are more often too long than too short. — [NN/g](https://www.nngroup.com/articles/animation-duration/)

**Material Design 3 motion tokens** (from Material Components Android Motion.md, which mirrors the M3 token set)
- Durations: short1 50, short2 100, short3 150, short4 200, medium1 250, medium2 300, medium3 350, medium4 400, long1 450, long2 500, long3 550, long4 600, extraLong1–4 700/800/900/1000 ms. — [MDC Android Motion.md](https://github.com/material-components/material-components-android/blob/master/docs/theming/Motion.md)
- Easing curves:
  - Standard: `cubic-bezier(0.2, 0, 0, 1)`
  - Standard decelerate: `(0, 0, 0, 1)`
  - Standard accelerate: `(0.3, 0, 1, 1)`
  - Emphasized decelerate: `(0.05, 0.7, 0.1, 1)`
  - Emphasized accelerate: `(0.3, 0, 0.8, 0.15)`
  - Emphasized (path-based, not a single bezier): `M 0,0 C 0.05,0,0.133333,0.06,0.166666,0.4 C 0.208333,0.82,0.25,1,1,1`
  - Linear: `(0, 0, 1, 1)`

  — [MDC Android Motion.md](https://github.com/material-components/material-components-android/blob/master/docs/theming/Motion.md)
- M3 spring tokens (damping ratio / stiffness):
  - FastSpatial: 0.9 / 1400
  - FastEffects: 1 / 3800
  - DefaultSpatial: 0.9 / 700
  - DefaultEffects: 1 / 1600
  - SlowSpatial: 0.9 / 300
  - SlowEffects: 1 / 800

  "Spatial" means position/size/shape and allows a slight overshoot. "Effects" means color/opacity and has no overshoot. — [MDC Android Motion.md](https://github.com/material-components/material-components-android/blob/master/docs/theming/Motion.md)
- The m3.material.io token page renders only with JavaScript and could not be fetched directly. Values were taken from the official MDC Android docs instead. — [m3.material.io](https://m3.material.io/styles/motion/easing-and-duration/tokens-specs)

**Apple HIG (Motion, updated Sept 2025)**
- "Add motion purposefully, supporting the experience without overshadowing it… Gratuitous or excessive animation can distract people and may make them feel disconnected or physically uncomfortable." — [Apple HIG](https://developer.apple.com/design/human-interface-guidelines/motion.md)
- "Aim for brevity and precision in feedback animations." "In apps, generally avoid adding motion to UI interactions that occur frequently." "Let people cancel motion… don't make people wait for an animation to complete." "Make motion optional": don't use motion as the only way to communicate information. — [Apple HIG](https://developer.apple.com/design/human-interface-guidelines/motion.md)
- Avoid sustained oscillation, especially around 0.2 Hz, because people are very sensitive to that frequency (stated for visionOS). — [Apple HIG](https://developer.apple.com/design/human-interface-guidelines/motion.md)
- HIG gives no numeric durations.

**Emil Kowalski**
- Keep most UI animations under 300 ms. Use ease-out for snappy interactions. A 500 ms enter animation on a frequently used tool is frustrating. Never animate keyboard-initiated actions. — [Emil Kowalski, great animations](https://emilkowal.ski/ui/great-animations)
- Sonner's toasts are deliberately "a bit slower than usual" and use `ease` instead of `ease-out` to feel more elegant. Match easing to brand personality. — [Emil Kowalski](https://emilkowal.ski/ui/great-animations)
- Concrete examples:
  - Tooltip: 125 ms ease-out.
  - A select at 180 ms feels more responsive than at 400 ms.
  - Button `:active` scale 0.97.
  - Never enter from `scale(0)`. Start at 0.9 or higher; the tooltip uses 0.97.
  - Optional `blur(2px)` during a crossfade.
  - Set transform-origin toward the trigger.

  — [Emil Kowalski, 7 practical tips](https://emilkowal.ski/ui/7-practical-animation-tips)
- Animate only `transform` and `opacity` for performance. Animations must be interruptible. — [Emil Kowalski](https://emilkowal.ski/ui/great-animations)

**Motion library defaults (source code, motion-dom)**
- Defaults when no transition is given:
  - Transform `x`/`y`/`rotate`: spring with stiffness 500, damping 25 (underdamped, slight bounce).
  - `scale*`: spring with stiffness 550, damping 30, or critically damped when animating to 0.
  - Everything else (opacity, color, etc.): tween of 0.3 s with ease `[0.25, 0.1, 0.35, 1]`.
  - More than two keyframes: 0.8 s.

  — [motion-dom default-transitions.ts](https://raw.githubusercontent.com/motiondivision/motion/main/packages/motion-dom/src/animation/utils/default-transitions.ts)
- Raw spring generator defaults when `type: "spring"` is set without other options: stiffness 100, damping 10, mass 1, duration 800 ms, bounce 0.3, visualDuration 0.3 s. `bounce` maps to damping ratio as in SwiftUI (0 = critically damped). — [motion-dom spring.ts](https://raw.githubusercontent.com/motiondivision/motion/main/packages/motion-dom/src/animation/generators/spring.ts)
- The docs page lists spring defaults as bounce 0.25, damping 10, stiffness "1", mass 1. This partly conflicts with source code, where stiffness is 100 and bounce is 0.3. "Stiffness 1" looks like a docs error. Setting `stiffness`, `damping` or `mass` overrides `bounce`/`duration`. `visualDuration` (seconds) sets when the spring visually arrives. — [motion.dev transitions](https://motion.dev/docs/react-transitions); contradicted in part by [spring.ts](https://raw.githubusercontent.com/motiondivision/motion/main/packages/motion-dom/src/animation/generators/spring.ts)

### Inferences
Recommended ExamPilot motion tokens:

| Token | Value | Use |
|---|---|---|
| `instant` | 100 ms, ease-out | checkbox tick fill, toggle, tap feedback |
| `fast` | 150–180 ms, M3 standard `[0.2,0,0,1]` | hover, small fades, exits |
| `base` | 220–250 ms, M3 emphasized-decelerate `[0.05,0.7,0.1,1]` | page/tab enter, card enter, accordion |
| `slow` | 300–400 ms | progress ring fill, celebratory moments only |
| exit | about 70–80% of enter, accelerate curve `[0.3,0,1,1]` | |
| `springSnappy` | `{ type:"spring", stiffness: 500, damping: 30 }` (≈ Motion default) | press, indicators |
| `springCalm` | `{ type:"spring", visualDuration: 0.3, bounce: 0.1 }` | layout, nav indicator |
| `springGentle` | `{ type:"spring", stiffness: 300, damping: 30 }` (near M3 SlowSpatial, damping ratio ≈0.87) | progress bars |
| `springBouncy` | `{ type:"spring", visualDuration: 0.35, bounce: 0.35 }` | checkmark pop only |

- "Calm" in practice means:
  - low bounce (0–0.15)
  - decelerating curves
  - small distances (4–12 px)
  - opacity carrying most of the change
  - no looping or ambient motion
- "Snappy" means 100–180 ms with ease-out or a high-stiffness spring.

Code for the tokens:
```ts
// motion-tokens.ts
export const ease = {
  standard: [0.2, 0, 0, 1] as const,
  decel: [0.05, 0.7, 0.1, 1] as const,   // M3 emphasized decelerate
  accel: [0.3, 0, 1, 1] as const,        // M3 standard accelerate (exits)
};
export const dur = { instant: 0.1, fast: 0.16, base: 0.24, slow: 0.36 };
export const spring = {
  snappy: { type: "spring", stiffness: 500, damping: 30 },
  calm:   { type: "spring", visualDuration: 0.3, bounce: 0.1 },
  gentle: { type: "spring", stiffness: 300, damping: 30 },
  pop:    { type: "spring", visualDuration: 0.35, bounce: 0.35 },
} as const;
```

### Gaps
- Could not fetch the live M3 page (JS-rendered) or the M3 Expressive spring docs. Spring values come from the MDC Android docs.
- Apple HIG gives no millisecond values. Apple's SwiftUI default spring values were not verified in this session.

## Q2. Gentle page/tab transitions: fade + small y offset; AnimatePresence `mode="wait"` vs `"popLayout"`

### Takeaway
Use opacity plus an 8 px y offset, with enter at about 220–250 ms (decelerate) and exit at about 150 ms (accelerate), inside `<AnimatePresence mode="wait" initial={false}>` keyed by route or tab. With `wait`, total perceived time is exit plus enter, so keep the exit very short (120–150 ms) so the switch stays under about 400 ms. `popLayout` is for lists where siblings should reflow, not for page swaps.

### Cited Findings
- `mode="sync"` (default): enter and exit run at the same time with no layout management, so overlapping elements need `position:absolute`. `mode="wait"`: the entering child waits for the exit to finish, and only one child is supported. The docs suggest an ease-in curve on exit and an ease-out curve on enter for an overall ease-in-out feel. — [motion.dev AnimatePresence](https://motion.dev/docs/react-animate-presence)
- `mode="popLayout"` removes the exiting element from flow (via `position:absolute`) so siblings reflow immediately. Pair it with `layout` on siblings. A custom-component child must use `forwardRef`. The parent must be non-static (e.g. `relative`). — [motion.dev AnimatePresence](https://motion.dev/docs/react-animate-presence)
- `initial={false}` on AnimatePresence skips enter animations for children present on first render. Every direct child needs a stable unique `key`. AnimatePresence itself must stay mounted, with the condition inside it. — [motion.dev AnimatePresence](https://motion.dev/docs/react-animate-presence)
- Exits should be shorter than enters (300 ms in vs 200–250 ms out). — [NN/g](https://www.nngroup.com/articles/animation-duration/)
- WCAG's own example: a page-flip transition is disabled when reduced motion is on. — [W3C Understanding 2.3.3](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html)

### Inferences
- Pattern:
```tsx
import { AnimatePresence, motion } from "motion/react";

const page = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.24, ease: [0.05, 0.7, 0.1, 1] } },
  exit:    { opacity: 0, y: -4, transition: { duration: 0.14, ease: [0.3, 0, 1, 1] } },
};

<AnimatePresence mode="wait" initial={false}>
  <motion.main key={pathname} variants={page} initial="initial" animate="animate" exit="exit">
    {children}
  </motion.main>
</AnimatePresence>
```
- Total switch time is about 140 + 240 = 380 ms, which is under the NN/g 400–500 ms ceiling.
- For bottom-tab switches you can go faster still: exit 100 ms and enter 180 ms, or use `mode="sync"` with absolutely positioned panes so there is no wait at all.
- Keep y at 8 px for enter and 4 px or less for exit. Avoid horizontal slides on tab change for calmness, and because they imply directional hierarchy.
- Under `reducedMotion="user"`, the `y` animation is skipped automatically and only the opacity fade runs. That is a good reduced-motion fallback with no extra code.
- For React Router or Next.js App Router: exit animations in Next.js App Router are known to be tricky because the old route unmounts. Keying by pathname in a client layout is the common approach. I did not verify current Next.js-specific guidance.

### Gaps
- No authoritative source gives a specific "8–12 px" offset. The 8 px figure is a common practitioner convention and my recommendation, not a cited spec.
- I did not research Next.js App Router exit-animation specifics.

## Q3. Satisfying checkbox interactions: pathLength checkmark, scale bounce, strikethrough, subtle confetti

### Takeaway
Draw the check with `pathLength` 0→1 over about 150–200 ms (ease-out), pop the box with a short spring (scale 1 → about 1.1 → 1, bounce ≈0.3–0.4). Animate the strikethrough as a `scaleX` 0→1 line with `transform-origin: left` (about 200 ms), and fade the label to about 50–60% opacity. Reserve confetti for rare milestones (e.g. a completed day plan, all tasks done), with a small particle count and a short burst, and skip it under reduced motion.

### Cited Findings
- `pathLength`, `pathSpacing` and `pathOffset` are 0–1 progress values. They are supported on `path`, `circle`, `ellipse`, `line`, `polygon`, `polyline` and `rect`. Example: `<motion.path initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />`. — [motion.dev SVG animation](https://motion.dev/docs/react-svg-animation)
- Simple feedback like a checkbox should be about 100 ms so it feels immediate. — [NN/g](https://www.nngroup.com/articles/animation-duration/)
- Never enter from scale(0). Start at 0.9 or higher. — [Emil Kowalski](https://emilkowal.ski/ui/7-practical-animation-tips)
- Motion's default for `scale` is a critically damped spring (stiffness 550, damping 30), so add bounce explicitly if you want a pop. — [motion-dom default-transitions.ts](https://raw.githubusercontent.com/motiondivision/motion/main/packages/motion-dom/src/animation/utils/default-transitions.ts)
- Under reduced motion, Motion instant-snaps only "positional" keys: width, height, top, left, right, bottom, and all transform props. `pathLength` is not in that set, so the checkmark draw keeps animating under `reducedMotion="user"`. — [keys-position.ts](https://raw.githubusercontent.com/motiondivision/motion/main/packages/motion-dom/src/render/utils/keys-position.ts), [visual-element-target.ts](https://raw.githubusercontent.com/motiondivision/motion/main/packages/motion-dom/src/animation/interfaces/visual-element-target.ts)
- Apple: feedback should be brief and precise, and motion should be supplemented with haptics or audio rather than being the only signal. — [Apple HIG](https://developer.apple.com/design/human-interface-guidelines/motion.md)

### Inferences
- Checkbox pattern:
```tsx
function Check({ checked }: { checked: boolean }) {
  return (
    <motion.span
      className="grid size-5 place-items-center rounded-md border"
      animate={{
        backgroundColor: checked ? "var(--accent)" : "rgba(0,0,0,0)",
        scale: checked ? [1, 1.12, 1] : 1,          // 3 keyframes → give explicit duration
      }}
      transition={{ scale: { duration: 0.28, ease: [0.2, 0, 0, 1] },
                    backgroundColor: { duration: 0.12 } }}
    >
      <svg viewBox="0 0 16 16" className="size-3.5" fill="none">
        <motion.path
          d="M3.5 8.5 6.5 11.5 12.5 4.5"
          stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
          initial={false}
          animate={{ pathLength: checked ? 1 : 0, opacity: checked ? 1 : 0 }}
          transition={{ pathLength: { duration: 0.18, ease: "easeOut", delay: checked ? 0.04 : 0 },
                        opacity: { duration: 0.05 } }}
        />
      </svg>
    </motion.span>
  );
}
```
  The `opacity` on the path hides the rounded-cap dot that otherwise shows at `pathLength: 0`. Alternatively, use the spring `{ type: "spring", visualDuration: 0.3, bounce: 0.35 }` on scale instead of keyframes.
- Strikethrough plus label fade:
```tsx
<span className="relative">
  <motion.span animate={{ opacity: done ? 0.55 : 1 }} transition={{ duration: 0.2 }}>{title}</motion.span>
  <motion.span
    aria-hidden
    className="absolute left-0 right-0 top-1/2 h-px bg-current origin-left"
    initial={false}
    animate={{ scaleX: done ? 1 : 0 }}
    transition={{ duration: 0.22, ease: [0.2, 0, 0, 1] }}
  />
</span>
```
  The completed state must still be conveyed semantically (`aria-checked`, `<s>`/`<del>` or visually hidden text), not only by the animation. This follows HIG "make motion optional" and WCAG.
- Completed tasks can move to a "Done" group using `layout` plus `AnimatePresence mode="popLayout"` so the remaining items glide up. Use about 250 ms (`springCalm`).
- Subtle celebration: trigger only on milestones, not on every tick, per the frequency guidance from NN/g and HIG.
  - Options: a soft scale-pulse on the progress ring (1 → 1.04 → 1), a sparkle of 6–12 small particles around the checkbox, or a canvas-confetti burst of about 40–80 particles lasting under 1 s.
  - Check `useReducedMotion()` and replace it with a static "Nice work" toast or fade.
  - The particle counts are my suggestion and are not sourced.

### Gaps
- I found no authoritative numeric spec for "satisfying" checkbox bounce. Values above are synthesized from NN/g's ~100 ms feedback guidance and Motion defaults.
- I did not research the canvas-confetti library API or its `disableForReducedMotion` option in this session, so verify before relying on it.

## Q4. Soft button presses: whileTap scale and spring values

### Takeaway
Use `whileTap={{ scale: 0.97 }}` (0.96–0.98 range) with a fast, near-critically-damped spring (stiffness about 400–600, damping about 30), plus an optional subtle hover lift. The Motion docs' `scale: 0.9` example is too strong for a calm app.

### Cited Findings
- Emil Kowalski uses `scale(0.97)` on `:active` for buttons. — [Emil Kowalski](https://emilkowal.ski/ui/7-practical-animation-tips)
- Motion example: `whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}`. When the gesture ends, the element returns to its `animate`/`initial` values. — [motion.dev animation](https://motion.dev/docs/react-animation)
- The default transition for scale is spring stiffness 550, damping 30 (critically damped toward 0). — [default-transitions.ts](https://raw.githubusercontent.com/motiondivision/motion/main/packages/motion-dom/src/animation/utils/default-transitions.ts)
- M3 FastSpatial spring is damping ratio 0.9, stiffness 1400. — [MDC Motion.md](https://github.com/material-components/material-components-android/blob/master/docs/theming/Motion.md)
- Under `reducedMotion="user"`, scale (a transform) is disabled automatically. — [motion.dev MotionConfig](https://motion.dev/docs/react-motion-config)

### Inferences
```tsx
<motion.button
  whileHover={{ y: -1 }}
  whileTap={{ scale: 0.97 }}
  transition={{ type: "spring", stiffness: 500, damping: 30, mass: 0.6 }}
  className="... transition-colors duration-150"
/>
```
- Larger surfaces such as cards should use a smaller press scale, 0.98–0.99, because the same scale factor moves large elements' edges more pixels.
- Use an inferred reduced-motion fallback: a background-color or opacity change on press (e.g. `whileTap={{ opacity: 0.85 }}`), which still runs under `reducedMotion="user"`.
- Don't animate keyboard-triggered actions such as Enter submitting a quiz answer (Emil). `whileTap` also fires on keyboard press of a focused button in recent Motion versions; I did not verify this.

### Gaps
- No primary source gives a canonical press spring. The values given are reasonable syntheses.

## Q5. Animated progress bars and progress rings (scaleX/width springs, number count-up, layout)

### Takeaway
Animate bars with `scaleX` (`transform-origin: left`) rather than `width` for GPU performance, and rings with `pathLength` on an SVG `<circle>`. Use a gentle spring (stiffness about 100–300, damping about 30, no bounce). Count numbers up with `useSpring` or `animate()` on a motion value, rendered through `useTransform` so React doesn't re-render every frame.

### Cited Findings
- Animate `transform` and `opacity`. Properties like width, margin or padding trigger layout and paint work. — [Emil Kowalski](https://emilkowal.ski/ui/great-animations)
- Motion animates transform axes independently, including `scaleX`, and both independent transforms and `transform` are hardware accelerated. — [motion.dev animation](https://motion.dev/docs/react-animation)
- `pathLength` works on `circle`. — [motion.dev SVG](https://motion.dev/docs/react-svg-animation)
- `useSpring(0, { stiffness: 300 })` creates a spring motion value. `.set()` animates and `.jump()` sets without animation. It can follow another motion value with `useSpring(x)`. — [motion.dev useSpring](https://motion.dev/docs/react-use-spring)
- Reduced motion (`"user"`) instant-snaps width, height and all transforms, including `scaleX`, but not `pathLength` or `opacity`. — [keys-position.ts](https://raw.githubusercontent.com/motiondivision/motion/main/packages/motion-dom/src/render/utils/keys-position.ts); [motion.dev accessibility](https://motion.dev/docs/react-accessibility)
- Layout animations use `transform: scale()`, which distorts children. Add `layout` to children to counter-scale. Border radius and box shadow are corrected automatically if set via `style`. — [motion.dev layout](https://motion.dev/docs/react-layout-animations)

### Inferences
- Progress bar:
```tsx
<div className="h-2 rounded-full bg-muted overflow-hidden" role="progressbar"
     aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
  <motion.div
    className="h-full bg-accent origin-left"
    initial={{ scaleX: 0 }}
    animate={{ scaleX: pct / 100 }}
    transition={{ type: "spring", stiffness: 120, damping: 24, restDelta: 0.001 }}
  />
</div>
```
  scaleX squashes rounded ends. Either keep the radius on the track with `overflow-hidden` (as above), or use `width: \`${pct}%\`` for very thin bars where the cost is negligible.
- Progress ring:
```tsx
<svg viewBox="0 0 48 48" className="-rotate-90">
  <circle cx="24" cy="24" r="20" className="stroke-muted" strokeWidth="4" fill="none" />
  <motion.circle cx="24" cy="24" r="20" strokeWidth="4" fill="none" strokeLinecap="round"
    className="stroke-accent"
    initial={{ pathLength: 0 }}
    animate={{ pathLength: pct / 100 }}
    transition={{ duration: 0.8, ease: [0.05, 0.7, 0.1, 1] }} />
</svg>
```
  Because `pathLength` is not auto-disabled by `reducedMotion="user"`, gate it manually: `transition={reduce ? { duration: 0 } : {...}}`. A ring fill is arguably "motion" (shape change), so treat it as such. 600–800 ms is acceptable here because it is infrequent, data-revealing and on a dashboard; elsewhere stay at 400 ms or less.
- Count-up number:
```tsx
import { useSpring, useTransform, motion, useReducedMotion } from "motion/react";
function CountUp({ value }: { value: number }) {
  const reduce = useReducedMotion();
  const mv = useSpring(0, { stiffness: 80, damping: 20 });
  const text = useTransform(mv, (v) => Math.round(v).toString());
  useEffect(() => { reduce ? mv.jump(value) : mv.set(value); }, [value, reduce]);
  return <motion.span className="tabular-nums">{text}</motion.span>;
}
```
  Use `tabular-nums` to prevent width jitter. Put `aria-live`/`aria-valuenow` on the final value, not the animating text. Rendering a MotionValue as a `motion.span` child is a documented Motion pattern, but I did not fetch its exact doc page this session.
- When a stat card's content changes size (e.g. streak badge appears), use `layout` on the card with `transition={{ layout: spring.calm }}`.

### Gaps
- I did not fetch the `useTransform` or `animate()` docs page for the count-up pattern. The code follows Motion's documented API shape, but verify that rendering a MotionValue as a child is supported in the installed version.

## Q6. Bottom navigation active indicator with `layoutId`

### Takeaway
Render the indicator (pill or underline) only inside the active tab with a shared `layoutId`. Motion animates it between tabs. Use a calm spring (`visualDuration` 0.3, `bounce` 0.1–0.2). Wrap the nav in `LayoutGroup` (or give the id a unique namespace) if several navs exist.

### Cited Findings
- `isSelected && <motion.div layoutId="underline" />`: when a new element with a matching `layoutId` mounts, it animates from the previous one. If both exist, they crossfade. — [motion.dev layout](https://motion.dev/docs/react-layout-animations)
- `LayoutGroup` synchronizes layout animations across components that don't re-render together. — [motion.dev layout](https://motion.dev/docs/react-layout-animations)
- A layout-specific transition goes under the `layout` key, e.g. `transition={{ layout: { duration: 0.3 } }}`. In shared layout, the transition of the element being animated **to** is used. — [motion.dev layout](https://motion.dev/docs/react-layout-animations)
- Caveats:
  - set border radius via `style` for distortion correction
  - `display:inline` won't animate
  - scrollable containers need `layoutScroll`; fixed containers need `layoutRoot`
  - use `scrollbar-gutter: stable` to avoid scrollbar-triggered layout animations

  — [motion.dev layout](https://motion.dev/docs/react-layout-animations)
- Under `reducedMotion="user"`, layout animations are disabled and the indicator jumps. — [motion.dev MotionConfig](https://motion.dev/docs/react-motion-config)

### Inferences
```tsx
<nav className="fixed bottom-0 inset-x-0">
  <LayoutGroup id="bottom-nav">
    <ul className="flex">
      {tabs.map((t) => (
        <li key={t.href} className="relative flex-1">
          <Link href={t.href} aria-current={active === t.href ? "page" : undefined}
                className="relative z-10 flex flex-col items-center py-2">
            <t.Icon /> <span className="text-xs">{t.label}</span>
          </Link>
          {active === t.href && (
            <motion.div layoutId="nav-pill"
              className="absolute inset-x-3 inset-y-1 bg-accent/12"
              style={{ borderRadius: 999 }}
              transition={{ type: "spring", visualDuration: 0.3, bounce: 0.15 }} />
          )}
        </li>
      ))}
    </ul>
  </LayoutGroup>
</nav>
```
- The bottom nav is `position: fixed`, so per the docs add `layoutRoot` to the fixed container if the pill mis-positions on scroll.
- Optional: a small icon scale bump for the active tab (1 → 1.08) using `springSnappy`. Keep it subtle because it is very frequent.

### Gaps
- No issues found. M3's own navigation-bar indicator timing was not verified.

## Q7. Expandable accordion answers: height auto best practice

### Takeaway
Motion can animate `height: 0 ↔ "auto"` directly. Wrap the content in `AnimatePresence initial={false}`, animate `height` plus `opacity`, and keep `overflow: hidden` on the animating wrapper. Put padding on an inner element, not the animating one. Duration is about 200–250 ms, or a no-bounce spring. Use semantic `button[aria-expanded]` with `aria-controls`.

### Cited Findings
- Width and height can animate to and from `"auto"`: `<motion.div initial={{ height: 0 }} animate={{ height: "auto" }} />`. If you also toggle display, use `visibility: "hidden"` instead of `display: none`, because display-none elements can't be measured. — [motion.dev animation](https://motion.dev/docs/react-animation)
- AnimatePresence must stay mounted with the condition inside it, and children need keys. `initial={false}` prevents already-open items from animating on first load. — [motion.dev AnimatePresence](https://motion.dev/docs/react-animate-presence)
- `height` is a "positional" key, so under `reducedMotion="user"` it snaps instantly while opacity still fades. — [keys-position.ts](https://raw.githubusercontent.com/motiondivision/motion/main/packages/motion-dom/src/render/utils/keys-position.ts)
- Animating height triggers layout work and is less performant than transforms. — [Emil Kowalski](https://emilkowal.ski/ui/great-animations)

### Inferences
```tsx
<button aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)}>
  {question}
  <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2, ease: [0.2,0,0,1] }}>⌄</motion.span>
</button>
<AnimatePresence initial={false}>
  {open && (
    <motion.div
      id={id} key="answer"
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1,
                 transition: { height: { duration: 0.24, ease: [0.05,0.7,0.1,1] }, opacity: { duration: 0.18, delay: 0.04 } } }}
      exit={{ height: 0, opacity: 0,
              transition: { height: { duration: 0.18, ease: [0.3,0,1,1] }, opacity: { duration: 0.1 } } }}
      style={{ overflow: "hidden" }}
    >
      <div className="pb-4 pt-1">{answer}</div>
    </motion.div>
  )}
</AnimatePresence>
```
- Fading opacity slightly after the height starts, and fading out before it collapses, avoids clipped text "wiping."
- When several accordions sit in a list, give siblings `layout` (or wrap the list in `LayoutGroup`) so content below glides rather than jumps. This is optional; the height animation already pushes siblings in normal flow.
- Alternative without JS measurement: CSS `interpolate-size: allow-keywords` or a `grid-template-rows: 0fr → 1fr` transition. Browser support for `interpolate-size` was not verified this session.

### Gaps
- The motion.dev docs page has no full accordion example. The pattern above is assembled from the documented pieces.

## Q8. Reduced motion: what MotionConfig `reducedMotion="user"` disables, `useReducedMotion`, WCAG 2.3.3, Tailwind variants

### Takeaway
Wrap the app in `<MotionConfig reducedMotion="user">`. The default is `"never"`, so you must opt in. It makes transform and layout animations (and width/height/top/left/right/bottom) instant, while opacity, color, backgroundColor and `pathLength` still animate. Use `useReducedMotion()` for everything else: confetti, count-ups, ring fills, autoplay, and swapping slides for fades. WCAG 2.3.3 (AAA) requires that interaction-triggered motion can be disabled unless essential. Opacity/color/blur changes are not "motion" under that criterion.

### Cited Findings
- `MotionConfig reducedMotion` takes `"user"` (respect the device setting), `"always"` (force on, useful for debugging) or `"never"`. **Default: `"never"`.** When reduced motion is on, "transform and layout animations are disabled, while animations like `opacity` and `backgroundColor` still run." — [motion.dev MotionConfig](https://motion.dev/docs/react-motion-config); [motion.dev accessibility](https://motion.dev/docs/react-accessibility)
- The source code confirms the exact set. When `shouldReduceMotion` is true and the key is in `positionalKeys`, the transition becomes `{ type: false }` (instant). `positionalKeys` = width, height, top, left, right, bottom, plus all transform props (x, y, z, scale*, rotate*, skew*, transformPerspective). — [visual-element-target.ts](https://raw.githubusercontent.com/motiondivision/motion/main/packages/motion-dom/src/animation/interfaces/visual-element-target.ts); [keys-position.ts](https://raw.githubusercontent.com/motiondivision/motion/main/packages/motion-dom/src/render/utils/keys-position.ts)
- `useReducedMotion()` returns a boolean and works for any React code. Documented uses:
  - swap a sidebar's `x: "-100%"` for opacity 0/1
  - `autoPlay={!shouldReduceMotion}` on background video
  - `style={{ y: shouldReduceMotion ? 0 : y }}` for parallax

  — [motion.dev accessibility](https://motion.dev/docs/react-accessibility)
- WCAG 2.2 SC 2.3.3 Animation from Interactions (Level **AAA**): "Motion animation triggered by interaction can be disabled, unless the animation is essential."
  - Motion animation is defined as adding steps between conditions to create the illusion of movement. Color, blur or opacity changes that don't change perceived size, shape or position are excluded.
  - Sufficient techniques: C39 (CSS `prefers-reduced-motion`), SCR40 (the same query in JS), or a user preference setting.
  - Example: a page transition disabled under reduced motion.

  — [W3C Understanding 2.3.3](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html)
- Josh Comeau:
  - Write "no-motion-first" CSS, adding animations inside `@media (prefers-reduced-motion: no-preference)`.
  - Disable movement, scaling, springs and scroll-driven motion, but keep fades, which are safe.
  - Don't blanket-set durations to about 0 (it misses JS animations and can make springs faster).
  - SSR hooks may default to reduced on first render.
  - Up to 35% of US adults aged 40+ have experienced vestibular dysfunction (citing vestibular.org).

  — [Josh Comeau](https://www.joshwcomeau.com/react/prefers-reduced-motion/)
- Tailwind: `motion-safe:` maps to `@media (prefers-reduced-motion: no-preference)` and `motion-reduce:` maps to `@media (prefers-reduced-motion: reduce)`. Example: `motion-safe:transition motion-safe:hover:-translate-x-0.5`, and `animate-spin motion-reduce:hidden`. — [Tailwind docs](https://tailwindcss.com/docs/hover-focus-and-other-states)
- Apple: "Make motion optional." Don't rely on motion alone to convey information; supplement it with haptics or audio. — [Apple HIG](https://developer.apple.com/design/human-interface-guidelines/motion.md)

### Inferences
- App root:
```tsx
import { MotionConfig } from "motion/react";
export function Providers({ children }) {
  const pref = useUserSetting("motion"); // "system" | "reduced" | "full" (optional in-app toggle)
  const reducedMotion = pref === "reduced" ? "always" : pref === "full" ? "never" : "user";
  return <MotionConfig reducedMotion={reducedMotion}
           transition={{ duration: 0.24, ease: [0.05, 0.7, 0.1, 1] }}>{children}</MotionConfig>;
}
```
  An in-app "Reduce animations" toggle in Settings satisfies WCAG's user-preference technique and helps users who don't know the OS setting.
- What is automatic vs what still needs manual handling under `"user"`:

| Pattern | Auto-handled? | Action |
|---|---|---|
| Page fade + y | y snapped, fade kept | none |
| whileTap scale | snapped | optional opacity fallback |
| layoutId nav pill | snapped | none |
| Accordion height | snapped, opacity kept | none |
| Progress bar scaleX | snapped | none |
| Checkmark `pathLength` | **NOT** auto (still draws) | acceptable (small, feedback); or gate |
| Progress ring `pathLength` | **NOT** auto | gate with `useReducedMotion` |
| Count-up via useSpring | **NOT** auto (not a style key) | `mv.jump()` when reduced |
| Confetti / canvas / CSS keyframes | **NOT** auto | skip or swap for toast |
| Tailwind `animate-*`, CSS transitions | **NOT** auto | `motion-safe:` prefix |

- Because opacity is always kept, design every enter/exit as "opacity + small transform." It then degrades cleanly to a pure fade with zero extra code.
- Test with DevTools "Emulate CSS prefers-reduced-motion: reduce", or temporarily set `reducedMotion="always"`.

### Gaps
- I did not fetch the web.dev prefers-reduced-motion article. The W3C, Josh Comeau and Tailwind sources cover the same ground.
- It is not confirmed whether `useSpring`-driven motion values respect `MotionConfig reducedMotion`. Based on the source (the check is in `animateTarget` for visual element values), they likely do not, so I treated them as manual.

## Q9. Current package name, version and import path (framer-motion vs motion)

### Takeaway
Install `motion` and import from `"motion/react"`. As of 2026-10-18 both `motion` and `framer-motion` are at **14.3.0** on npm, published in lockstep, so `framer-motion` is still maintained. The official upgrade path is `npm uninstall framer-motion && npm install motion` and changing imports to `motion/react`. Peer deps: React 18 or 19.

### Cited Findings
- `motion@latest` = **14.3.0** (MIT, author Matt Perry, maintainers popmotion/motionone). peerDependencies: `react ^18.0.0 || ^19.0.0`, `react-dom ^18.0.0 || ^19.0.0` (both optional). — [npm registry: motion](https://registry.npmjs.org/motion/latest)
- `framer-motion@latest` = **14.3.0**. — [npm registry: framer-motion](https://registry.npmjs.org/framer-motion/latest)
- Upgrade guide: "npm uninstall framer-motion / npm install motion", then change imports from `"framer-motion"` to `"motion/react"` (e.g. `import { motion } from "motion/react"`). v12 had no breaking changes for React. v11 changed velocity calculation and moved post-mount render to a microtask, which affects Jest tests. — [motion.dev upgrade guide](https://motion.dev/docs/react-upgrade-guide)
- The MotionConfig docs show `import { motion, MotionConfig } from "motion/react"`. The older accessibility page still shows `from "framer-motion"`, so the docs are inconsistent and both paths appear. — [motion.dev MotionConfig](https://motion.dev/docs/react-motion-config); [motion.dev accessibility](https://motion.dev/docs/react-accessibility)

### Inferences
- For ExamPilot, use `npm i motion` and `import { motion, AnimatePresence, MotionConfig, LayoutGroup, useReducedMotion, useSpring, useTransform } from "motion/react"`.
- For Next.js App Router server components, Motion also offers a `"motion/react-client"` entry for `motion.*` components in RSC trees. This is from prior knowledge and was not verified this session.
- The bundle-size option `LazyMotion` + `m` exists for reducing the initial JS. Not verified this session.

### Gaps
- I did not see the changelog for v13/v14 breaking changes. The upgrade guide fetched covered v11/v12 only. Check the changelog for anything between 12 and 14.3.0.
