| time | trigger / element | animation | from → to | dur ms | delay ms | easing | loops | React Native |
|---|---|---|---|---|---|---|---|---|
| 0.00s | “Good morning Your Exam Week Next …” | `pagein` | opacity:0; transform:translateY(10px); filter:blur(10px) → opacity:1; transform:none; filter:blur(0px) | 360 | 0 | `bezier(0.2, 0.8, 0.2, 1)` |  | Screen + BlurIn (replays on focus) |
| 0.00s | 4 elements: shape 31×31, shape 74×8 | `pop` | transform:scale(0.9) → transform:scale(1) | 260 | 0 | `bezier(0.2, 0, 0, 1)` |  | withSequence scale .9→1.12→1 (AnimatedCheckbox / popIn) |
| 0.00s | 2× SVG stroke 10×7 | `draw` | strokeDashoffset:24px → strokeDashoffset:0px | 220 | 60 | `ease-out` |  | strokeDashoffset via useAnimatedProps |
| 0.00s | “Today” | `tabin` | maxWidth:56px → maxWidth:320px | 520 | 0 | `bezier(0.2, 0.9, 0.25, 1.04)` |  | TabBar tabGrow (520ms) |
| 0.00s | “Today” | `tablabel` | opacity:0; transform:translateX(-6px) → opacity:1; transform:none | 320 | 180 | `bezier(0.05, 0.7, 0.1, 1)` |  | TabBar label (180ms delay, 320ms) |
| **1.80s** | 👆 **scroll to y=520** | | | | | | | |
| **3.20s** | 👆 **tap text=Master theorem** | | | | | | | |
| 3.35s | “Master theorem — 3 practice probl…” | `filter` | filter:none → filter:blur(0.6px) | 220 | 0 | `ease` |  | (press blur → haptic in RN) |
| 3.35s | “Master theorem — 3 practice probl…” | `transform` | transform:translateY(-0.97px) → transform:scale(0.96) | 180 | 0 | `bezier(0.2, 0, 0, 1)` |  | PressableScale / withSpring |
| 3.50s | 6 elements: shape 27×27, shape 66×7 | `pop` | transform:scale(0.9) → transform:scale(1) | 260 | 0 | `bezier(0.2, 0, 0, 1)` |  | withSequence scale .9→1.12→1 (AnimatedCheckbox / popIn) |
| 3.50s | 3× SVG stroke 10×7 | `draw` | strokeDashoffset:24px → strokeDashoffset:0px | 220 | 60 | `ease-out` |  | strokeDashoffset via useAnimatedProps |
| **4.57s** | 👆 **tap text=AVL rotations** | | | | | | | |
| 4.70s | “AVL rotations — quick sketch reca…” | `filter` | filter:none → filter:blur(0.6px) | 220 | 0 | `ease` |  | (press blur → haptic in RN) |
| 4.70s | “AVL rotations — quick sketch reca…” | `transform` | transform:translateY(-0.97px) → transform:scale(0.96) | 180 | 0 | `bezier(0.2, 0, 0, 1)` |  | PressableScale / withSpring |
| 4.85s | 2 elements: shape 27×27, shape 66×7 | `pop` | transform:scale(0.9) → transform:scale(1) | 260 | 0 | `bezier(0.2, 0, 0, 1)` |  | withSequence scale .9→1.12→1 (AnimatedCheckbox / popIn) |
| 4.85s | SVG stroke 10×7 | `draw` | strokeDashoffset:24px → strokeDashoffset:0px | 220 | 60 | `ease-out` |  | strokeDashoffset via useAnimatedProps |
| 4.85s | “Nice work, you finished today's r…” | `fadeup` | opacity:0; transform:translateY(8px); filter:blur(8px) → opacity:1; transform:none; filter:blur(0px) | 260 | 0 | `bezier(0.05, 0.7, 0.1, 1)` |  | BlurIn soft |
| **7.73s** | 👆 **scroll to y=0** | | | | | | | |
