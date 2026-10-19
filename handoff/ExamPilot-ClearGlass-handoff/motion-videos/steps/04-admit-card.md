| time | trigger / element | animation | from → to | dur ms | delay ms | easing | loops | React Native |
|---|---|---|---|---|---|---|---|---|
| 0.00s | shape 16×6 | `grow` | transform:scaleX(0) → transform:scaleX(1) | 600 | 200 | `bezier(0.2, 0.8, 0.2, 1)` |  | scaleX 0→1, transformOrigin left |
| 0.00s | “Upload admit card PDF or a clear …” | `fadeup` | opacity:0; transform:translateY(8px); filter:blur(8px) → opacity:1; transform:none; filter:blur(0px) | 420 | 0 | `bezier(0.05, 0.7, 0.1, 1)` |  | BlurIn soft |
| 0.00s | shape 84×84 | `bob` | transform:translateY(0px) → transform:translateY(0px) | 2400 | 0 | `ease-in-out` | ∞ | withRepeat translateY ± |
| **1.30s** | 👆 **tap text=Try a sample** | | | | | | | |
| 1.45s | “Try a sample” | `filter` | filter:none → filter:blur(0.6px) | 220 | 0 | `ease` |  | (press blur → haptic in RN) |
| 1.45s | “Try a sample” | `transform` | transform:translateY(-0.97px) → transform:scale(0.96) | 180 | 0 | `bezier(0.2, 0, 0, 1)` |  | PressableScale / withSpring |
| 1.60s | shape 0×6 | `grow` | transform:scaleX(0) → transform:scaleX(1) | 600 | 200 | `bezier(0.2, 0.8, 0.2, 1)` |  | scaleX 0→1, transformOrigin left |
| 1.60s | “Reading your exam dates . . .” | `fadeup` | opacity:0; transform:translateY(8px); filter:blur(8px) → opacity:1; transform:none; filter:blur(0px) | 420 | 0 | `bezier(0.05, 0.7, 0.1, 1)` |  | BlurIn soft |
| 1.60s | 7 elements: shape 122×9, shape 147×9, shape 210×30… | `shine` | opacity:0.55 → opacity:0.55 | 1400 | 0 | `ease-in-out` | ∞ | withRepeat opacity |
| 1.60s | shape 250×3 | `scan` | top:8% → top:88% | 1600 | 0 | `bezier(0.45, 0, 0.55, 1)` | ∞ | withRepeat translateY |
| 1.60s | “.” | `dot` | opacity:0.25 → opacity:0.25 | 1200 | 0 | `ease-in-out` | ∞ | withRepeat opacity (staggered) |
| 1.60s | “.” | `dot` | opacity:0.25 → opacity:0.25 | 1200 | 150 | `ease-in-out` | ∞ | withRepeat opacity (staggered) |
| 1.60s | “.” | `dot` | opacity:0.25 → opacity:0.25 | 1200 | 300 | `ease-in-out` | ∞ | withRepeat opacity (staggered) |
| 1.90s | shape 48×6 | `grow` | transform:scaleX(0) → transform:scaleX(1) | 600 | 200 | `bezier(0.2, 0.8, 0.2, 1)` |  | scaleX 0→1, transformOrigin left |
| 1.90s | “21 OCT Software Engineering Wed ·…” | `fadeup` | opacity:0; transform:translateY(8px); filter:blur(8px) → opacity:1; transform:none; filter:blur(0px) | 420 | 0 | `bezier(0.05, 0.7, 0.1, 1)` |  | BlurIn soft |
| 1.90s | “22 OCT Design and Analysis of Alg…” | `fadeup` | opacity:0; transform:translateY(8px); filter:blur(8px) → opacity:1; transform:none; filter:blur(0px) | 420 | 120 | `bezier(0.05, 0.7, 0.1, 1)` |  | BlurIn soft |
| 1.90s | “23 OCT Design of Data Structures …” | `fadeup` | opacity:0; transform:translateY(8px); filter:blur(8px) → opacity:1; transform:none; filter:blur(0px) | 420 | 240 | `bezier(0.05, 0.7, 0.1, 1)` |  | BlurIn soft |
| 1.90s | “Add an exam we missed” | `fadeup` | opacity:0; transform:translateY(8px); filter:blur(8px) → opacity:1; transform:none; filter:blur(0px) | 420 | 320 | `bezier(0.05, 0.7, 0.1, 1)` |  | BlurIn soft |
| 1.90s | “Looks right — build my plan” | `fadeup` | opacity:0; transform:translateY(8px); filter:blur(8px) → opacity:1; transform:none; filter:blur(0px) | 420 | 320 | `bezier(0.05, 0.7, 0.1, 1)` |  | BlurIn soft |
| **5.97s** | 👆 **scroll to y=400** | | | | | | | |
