| time | trigger / element | animation | from → to | dur ms | delay ms | easing | loops | React Native |
|---|---|---|---|---|---|---|---|---|
| 0.00s | “Today Calendar · 2026 October M T…” | `pagein` | opacity:0; transform:translateY(10px); filter:blur(10px) → opacity:1; transform:none; filter:blur(0px) | 360 | 0 | `bezier(0.2, 0.8, 0.2, 1)` |  | Screen + BlurIn (replays on focus) |
| 0.00s | “Selected day” (section) | `fadeup` | opacity:0; transform:translateY(8px); filter:blur(8px) → opacity:1; transform:none; filter:blur(0px) | 260 | 0 | `bezier(0.05, 0.7, 0.1, 1)` |  | BlurIn soft |
| 0.00s | “Calendar” | `tabin` | maxWidth:56px → maxWidth:320px | 520 | 0 | `bezier(0.2, 0.9, 0.25, 1.04)` |  | TabBar tabGrow (520ms) |
| 0.00s | “Calendar” | `tablabel` | opacity:0; transform:translateX(-6px) → opacity:1; transform:none | 320 | 180 | `bezier(0.05, 0.7, 0.1, 1)` |  | TabBar label (180ms delay, 320ms) |
| **1.40s** | 👆 **tap [aria-label^="Wednesday 21 October"]** | | | | | | | |
| 1.55s | “Wednesday 21 October, exam” (button) | `filter` | filter:none → filter:blur(0.6px) | 220 | 0 | `ease` |  | (press blur → haptic in RN) |
| 1.55s | “Wednesday 21 October, exam” (button) | `transform` | transform:translateY(-0.97px) → transform:scale(0.96) | 180 | 0 | `bezier(0.2, 0, 0, 1)` |  | PressableScale / withSpring |
| 1.70s | “Selected day” (section) | `fadeup` | opacity:0; transform:translateY(8px); filter:blur(8px) → opacity:1; transform:none; filter:blur(0px) | 260 | 0 | `bezier(0.05, 0.7, 0.1, 1)` |  | BlurIn soft |
| **3.07s** | 👆 **tap [aria-label^="Friday 23 October"]** | | | | | | | |
| 3.20s | “Friday 23 October, exam” (button) | `filter` | filter:none → filter:blur(0.6px) | 220 | 0 | `ease` |  | (press blur → haptic in RN) |
| 3.20s | “Friday 23 October, exam” (button) | `transform` | transform:translateY(-0.97px) → transform:scale(0.96) | 180 | 0 | `bezier(0.2, 0, 0, 1)` |  | PressableScale / withSpring |
| 3.35s | “Selected day” (section) | `fadeup` | opacity:0; transform:translateY(8px); filter:blur(8px) → opacity:1; transform:none; filter:blur(0px) | 260 | 0 | `bezier(0.05, 0.7, 0.1, 1)` |  | BlurIn soft |
| **4.73s** | 👆 **tap [aria-label="Next month"]** | | | | | | | |
| 4.85s | “Next month” (button) | `filter` | filter:none → filter:blur(0.6px) | 220 | 0 | `ease` |  | (press blur → haptic in RN) |
| 4.85s | “Next month” (button) | `transform` | transform:translateY(-0.97px) → transform:scale(0.96) | 180 | 0 | `bezier(0.2, 0, 0, 1)` |  | PressableScale / withSpring |
| 5.05s | “Selected day” (section) | `fadeup` | opacity:0; transform:translateY(8px); filter:blur(8px) → opacity:1; transform:none; filter:blur(0px) | 260 | 0 | `bezier(0.05, 0.7, 0.1, 1)` |  | BlurIn soft |
| **6.00s** | 👆 **tap [aria-label="Previous month"]** | | | | | | | |
| **7.27s** | 👆 **scroll to y=360** | | | | | | | |
