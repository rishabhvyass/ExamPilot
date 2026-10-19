| time | trigger / element | animation | from → to | dur ms | delay ms | easing | loops | React Native |
|---|---|---|---|---|---|---|---|---|
| 0.00s | “Enter code” | `morph` | opacity:0; transform:scale(0.96); filter:blur(6px) → opacity:1; transform:none; filter:blur(0px) | 260 | 0 | `bezier(0.2, 0.8, 0.2, 1)` |  | layout + FadeIn (CodePill) |
| **0.90s** | 👆 **tap text=Enter code** | | | | | | | |
| 1.20s | block 280×45 | `morph` | opacity:0; transform:scale(0.96); filter:blur(6px) → opacity:1; transform:none; filter:blur(0px) | 260 | 0 | `bezier(0.2, 0.8, 0.2, 1)` |  | layout + FadeIn (CodePill) |
| 1.20s | shape 2×20 | `caret` | opacity:1 → opacity:0 | 1000 | 0 | `steps(1)` | ∞ | Caret withRepeat opacity |
| **2.47s** | 👆 **tap text=Wrong code** | | | | | | | |
| 2.60s | “Wrong code” | `filter` | filter:none → filter:blur(0.6px) | 220 | 0 | `ease` |  | (press blur → haptic in RN) |
| 2.60s | “Wrong code” | `transform` | transform:translateY(-0.97px) → transform:scale(0.96) | 180 | 0 | `bezier(0.2, 0, 0, 1)` |  | PressableScale / withSpring |
| 2.75s | block 283×46 | `morph` | opacity:0; transform:scale(0.96); filter:blur(6px) → opacity:1; transform:none; filter:blur(0px) | 260 | 0 | `bezier(0.2, 0.8, 0.2, 1)` |  | layout + FadeIn (CodePill) |
| 2.75s | shape 2×20 | `caret` | opacity:1 → opacity:0 | 1000 | 0 | `steps(1)` | ∞ | Caret withRepeat opacity |
| 2.80s | “2” | `morph` | opacity:0; transform:scale(0.96); filter:blur(6px) → opacity:1; transform:none; filter:blur(0px) | 260 | 0 | `bezier(0.2, 0.8, 0.2, 1)` |  | layout + FadeIn (CodePill) |
| 2.80s | “2” | `digit` | opacity:0; transform:scale(0.6) translateY(4px); filter:blur(4px) → opacity:1; transform:none; filter:blur(0px) | 220 | 0 | `bezier(0.2, 0.9, 0.25, 1.2)` |  | digitIn |
| 2.80s | shape 2×20 | `caret` | opacity:1 → opacity:0 | 1000 | 0 | `steps(1)` | ∞ | Caret withRepeat opacity |
| 2.85s | “2 1 3” | `morph` | opacity:0; transform:scale(0.96); filter:blur(6px) → opacity:1; transform:none; filter:blur(0px) | 260 | 0 | `bezier(0.2, 0.8, 0.2, 1)` |  | layout + FadeIn (CodePill) |
| 2.85s | 2× “1” | `digit` | opacity:0; transform:scale(0.6) translateY(4px); filter:blur(4px) → opacity:1; transform:none; filter:blur(0px) | 220 | 0 | `bezier(0.2, 0.9, 0.25, 1.2)` |  | digitIn |
| 2.85s | “3” | `digit` | opacity:0; transform:scale(0.6) translateY(4px); filter:blur(4px) → opacity:1; transform:none; filter:blur(0px) | 220 | 0 | `bezier(0.2, 0.9, 0.25, 1.2)` |  | digitIn |
| 2.85s | 2× shape 2×20 | `caret` | opacity:1 → opacity:0 | 1000 | 0 | `steps(1)` | ∞ | Caret withRepeat opacity |
| 2.85s | “2 1 3 2 1” | `morph` | opacity:0; transform:scale(0.96); filter:blur(6px) → opacity:1; transform:none; filter:blur(0px) | 260 | 0 | `bezier(0.2, 0.8, 0.2, 1)` |  | layout + FadeIn (CodePill) |
| 2.85s | “2” | `digit` | opacity:0; transform:scale(0.6) translateY(4px); filter:blur(4px) → opacity:1; transform:none; filter:blur(0px) | 220 | 0 | `bezier(0.2, 0.9, 0.25, 1.2)` |  | digitIn |
| 2.90s | “2 1 3 2 1 2” | `morph` | opacity:0; transform:scale(0.96); filter:blur(6px) → opacity:1; transform:none; filter:blur(0px) | 260 | 0 | `bezier(0.2, 0.8, 0.2, 1)` |  | layout + FadeIn (CodePill) |
| 2.90s | “2” | `digit` | opacity:0; transform:scale(0.6) translateY(4px); filter:blur(4px) → opacity:1; transform:none; filter:blur(0px) | 220 | 0 | `bezier(0.2, 0.9, 0.25, 1.2)` |  | digitIn |
| 2.95s | “Verifying” | `morph` | opacity:0; transform:scale(0.96); filter:blur(6px) → opacity:1; transform:none; filter:blur(0px) | 260 | 0 | `bezier(0.2, 0.8, 0.2, 1)` |  | layout + FadeIn (CodePill) |
| 2.95s | shape 20×20 | `spin` | transform:none → transform:rotate(360deg) | 800 | 0 | `linear` | ∞ | withRepeat rotate / ActivityIndicator |
| 2.95s | “Verifying” | `shimmer` | backgroundPositionX:120%; backgroundPositionY:0px → backgroundPositionX:-120%; backgroundPositionY:0px | 1200 | 0 | `linear` | ∞ | — |
| 3.10s | “2 1 3 2 1 2 6-digit code” | `shake` | transform:none → transform:none | 420 | 0 | `bezier(0.36, 0.07, 0.19, 0.97)` |  | SHAKE_STEPS withSequence |
| 3.10s | “2 1 3 2 1 2” | `morph` | opacity:0; transform:scale(0.96); filter:blur(6px) → opacity:1; transform:none; filter:blur(0px) | 260 | 0 | `bezier(0.2, 0.8, 0.2, 1)` |  | layout + FadeIn (CodePill) |
| 3.15s | shape 2×20 | `caret` | opacity:1 → opacity:0 | 1000 | 0 | `steps(1)` | ∞ | Caret withRepeat opacity |
| **6.03s** | 👆 **tap text=Reset** | | | | | | | |
| 6.15s | “Reset” | `filter` | filter:none → filter:blur(0.6px) | 220 | 0 | `ease` |  | (press blur → haptic in RN) |
| 6.15s | “Reset” | `transform` | transform:translateY(-0.97px) → transform:scale(0.96) | 180 | 0 | `bezier(0.2, 0, 0, 1)` |  | PressableScale / withSpring |
| 6.35s | “Enter code” | `morph` | opacity:0; transform:scale(0.96); filter:blur(6px) → opacity:1; transform:none; filter:blur(0px) | 260 | 0 | `bezier(0.2, 0.8, 0.2, 1)` |  | layout + FadeIn (CodePill) |
| **7.20s** | 👆 **tap text=Enter code** | | | | | | | |
| 7.50s | shape 2×20 | `caret` | opacity:1 → opacity:0 | 1000 | 0 | `steps(1)` | ∞ | Caret withRepeat opacity |
| **8.47s** | 👆 **tap text=Correct code** | | | | | | | |
| 8.60s | “Correct code” | `filter` | filter:none → filter:blur(0.6px) | 220 | 0 | `ease` |  | (press blur → haptic in RN) |
| 8.60s | “Correct code” | `transform` | transform:translateY(-0.97px) → transform:scale(0.96) | 180 | 0 | `bezier(0.2, 0, 0, 1)` |  | PressableScale / withSpring |
| 8.75s | shape 2×20 | `caret` | opacity:1 → opacity:0 | 1000 | 0 | `steps(1)` | ∞ | Caret withRepeat opacity |
| 8.85s | “Verified” | `morph` | opacity:0; transform:scale(0.96); filter:blur(6px) → opacity:1; transform:none; filter:blur(0px) | 260 | 0 | `bezier(0.2, 0.8, 0.2, 1)` |  | layout + FadeIn (CodePill) |
| 8.85s | SVG stroke 11×7 | `draw` | strokeDashoffset:24px → strokeDashoffset:0px | 300 | 120 | `ease-out` |  | strokeDashoffset via useAnimatedProps |
| 8.85s | shape 60×60 | `shine` | left:-70px → left:110% | 900 | 250 | `ease-in-out` |  | withRepeat opacity |
| 8.85s | “Continue” | `rise` | opacity:0; transform:translateY(12px); filter:blur(10px) → opacity:1; transform:none; filter:blur(0px) | 420 | 0 | `bezier(0.05, 0.7, 0.1, 1)` |  | BlurIn index={n} |
