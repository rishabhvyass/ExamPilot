| time | trigger / element | animation | from → to | dur ms | delay ms | easing | loops | React Native |
|---|---|---|---|---|---|---|---|---|
| 0.00s | “Sample syllabus Your Custom Sylla…” | `pagein` | opacity:0; transform:translateY(10px); filter:blur(10px) → opacity:1; transform:none; filter:blur(0px) | 360 | 0 | `bezier(0.2, 0.8, 0.2, 1)` |  | Screen + BlurIn (replays on focus) |
| 0.00s | “Software Engineering” (section) | `fadeup` | opacity:0; transform:translateY(8px); filter:blur(8px) → opacity:1; transform:none; filter:blur(0px) | 280 | 0 | `bezier(0.05, 0.7, 0.1, 1)` |  | BlurIn soft |
| 0.00s | 4× shape 31×31 | `pop` | transform:scale(0.9) → transform:scale(1) | 260 | 0 | `bezier(0.2, 0, 0, 1)` |  | withSequence scale .9→1.12→1 (AnimatedCheckbox / popIn) |
| 0.00s | 4× SVG stroke 10×6 | `draw` | strokeDashoffset:24px → strokeDashoffset:0px | 220 | 60 | `ease-out` |  | strokeDashoffset via useAnimatedProps |
| 0.00s | “Subjects” | `tabin` | maxWidth:56px → maxWidth:320px | 520 | 0 | `bezier(0.2, 0.9, 0.25, 1.04)` |  | TabBar tabGrow (520ms) |
| 0.00s | “Subjects” | `tablabel` | opacity:0; transform:translateX(-6px) → opacity:1; transform:none | 320 | 180 | `bezier(0.05, 0.7, 0.1, 1)` |  | TabBar label (180ms delay, 320ms) |
| **1.40s** | 👆 **tap button:has-text("DAA") >> nth=0** | | | | | | | |
| 1.55s | “DAA” | `filter` | filter:none → filter:blur(0.6px) | 220 | 0 | `ease` |  | (press blur → haptic in RN) |
| 1.55s | “DAA” | `transform` | transform:translateY(-0.97px) → transform:scale(0.96) | 180 | 0 | `bezier(0.2, 0, 0, 1)` |  | PressableScale / withSpring |
| 1.70s | “Design and Analysis of Algorithm” (section) | `fadeup` | opacity:0; transform:translateY(8px); filter:blur(8px) → opacity:1; transform:none; filter:blur(0px) | 280 | 0 | `bezier(0.05, 0.7, 0.1, 1)` |  | BlurIn soft |
| 1.70s | 3× shape 28×28 | `pop` | transform:scale(0.9) → transform:scale(1) | 260 | 0 | `bezier(0.2, 0, 0, 1)` |  | withSequence scale .9→1.12→1 (AnimatedCheckbox / popIn) |
| 1.70s | 3× SVG stroke 10×6 | `draw` | strokeDashoffset:24px → strokeDashoffset:0px | 220 | 60 | `ease-out` |  | strokeDashoffset via useAnimatedProps |
| **3.27s** | 👆 **tap button:has-text("DDS") >> nth=0** | | | | | | | |
| 3.40s | “DDS” | `filter` | filter:none → filter:blur(0.6px) | 220 | 0 | `ease` |  | (press blur → haptic in RN) |
| 3.40s | “DDS” | `transform` | transform:translateY(-0.97px) → transform:scale(0.96) | 180 | 0 | `bezier(0.2, 0, 0, 1)` |  | PressableScale / withSpring |
| 3.55s | SVG stroke 9×6 | `draw` | strokeDashoffset:24px → strokeDashoffset:0px | 220 | 60 | `ease-out` |  | strokeDashoffset via useAnimatedProps |
| **5.13s** | 👆 **scroll to y=520** | | | | | | | |
