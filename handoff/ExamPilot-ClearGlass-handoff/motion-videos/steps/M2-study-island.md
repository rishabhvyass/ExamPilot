| time | trigger / element | animation | from → to | dur ms | delay ms | easing | loops | React Native |
|---|---|---|---|---|---|---|---|---|
| 0.00s | g 9×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 0.05s | g 9×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 0.15s | g 9×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 0.25s | g 10×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 0.25s | “SE exam · Wed 2 PM 3 days to prep…” | `fadein` | opacity:0; transform:translateX(-6px); filter:blur(6px) → opacity:1; transform:none; filter:blur(0px) | 360 | 140 | `bezier(0.2, 0.8, 0.2, 1)` |  | FadeIn + translateX |
| 0.25s | shape 42×42 | `pulse` | opacity:0.55 → opacity:0.55 | 1600 | 0 | `ease-in-out` | ∞ | withRepeat opacity |
| 0.40s | g 10×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 0.40s | “Next up Master theorem · 25 min” | `fadein` | opacity:0; transform:translateX(-6px); filter:blur(6px) → opacity:1; transform:none; filter:blur(0px) | 360 | 140 | `bezier(0.2, 0.8, 0.2, 1)` |  | FadeIn + translateX |
| 0.40s | “Start” (button) | `pop` | opacity:0; transform:scale(0.5) → opacity:1; transform:scale(1) | 380 | 180 | `bezier(0.2, 0.9, 0.25, 1.3)` |  | withSequence scale .9→1.12→1 (AnimatedCheckbox / popIn) |
| 0.65s | g 9×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 0.65s | “Updating your plan” | `fadein` | opacity:0; transform:translateX(-6px); filter:blur(6px) → opacity:1; transform:none; filter:blur(0px) | 360 | 140 | `bezier(0.2, 0.8, 0.2, 1)` |  | FadeIn + translateX |
| 0.65s | shape 34×34 | `spin` | transform:none → transform:rotate(360deg) | 1000 | 0 | `linear` | ∞ | withRepeat rotate / ActivityIndicator |
| 0.85s | g 9×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 0.85s | “Plan updated” | `fadein` | opacity:0; transform:translateX(-6px); filter:blur(6px) → opacity:1; transform:none; filter:blur(0px) | 360 | 140 | `bezier(0.2, 0.8, 0.2, 1)` |  | FadeIn + translateX |
| 0.85s | shape 17×17 | `pop` | opacity:0; transform:scale(0.5) → opacity:1; transform:scale(1) | 380 | 180 | `bezier(0.2, 0.9, 0.25, 1.3)` |  | withSequence scale .9→1.12→1 (AnimatedCheckbox / popIn) |
| 0.85s | SVG stroke 5×3 | `draw` | strokeDashoffset:24px → strokeDashoffset:0px | 320 | 200 | `ease-out` |  | strokeDashoffset via useAnimatedProps |
| 1.00s | g 10×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 1.00s | “Moved DAA practice to 4 PM” | `fadein` | opacity:0; transform:translateX(-6px); filter:blur(6px) → opacity:1; transform:none; filter:blur(0px) | 360 | 140 | `bezier(0.2, 0.8, 0.2, 1)` |  | FadeIn + translateX |
| 1.00s | shape 21×21 | `pop` | opacity:0; transform:scale(0.5) → opacity:1; transform:scale(1) | 380 | 180 | `bezier(0.2, 0.9, 0.25, 1.3)` |  | withSequence scale .9→1.12→1 (AnimatedCheckbox / popIn) |
| 1.00s | SVG stroke 6×4 | `draw` | strokeDashoffset:24px → strokeDashoffset:0px | 320 | 200 | `ease-out` |  | strokeDashoffset via useAnimatedProps |
| 1.10s | g 10×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 1.10s | “All done for today!” | `fadein` | opacity:0; transform:translateX(-6px); filter:blur(6px) → opacity:1; transform:none; filter:blur(0px) | 360 | 140 | `bezier(0.2, 0.8, 0.2, 1)` |  | FadeIn + translateX |
| **1.20s** | 👆 **tap button:has-text("Pause")** | | | | | | | |
| 1.20s | g 9×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 1.25s | g 9×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 1.35s | “Pause” | `filter` | filter:none → filter:blur(0.6px) | 220 | 0 | `ease` |  | (press blur → haptic in RN) |
| 1.35s | “Pause” | `transform` | transform:translateY(-0.97px) → transform:scale(0.96) | 180 | 0 | `bezier(0.2, 0, 0, 1)` |  | PressableScale / withSpring |
| 1.35s | 2× g 9×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 1.40s | g 10×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 1.40s | “Start” (button) | `pop` | opacity:0; transform:scale(0.5) → opacity:1; transform:scale(1) | 380 | 180 | `bezier(0.2, 0.9, 0.25, 1.3)` |  | withSequence scale .9→1.12→1 (AnimatedCheckbox / popIn) |
| 1.45s | g 9×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 1.45s | “Updating your plan” | `fadein` | opacity:0; transform:translateX(-6px); filter:blur(6px) → opacity:1; transform:none; filter:blur(0px) | 360 | 140 | `bezier(0.2, 0.8, 0.2, 1)` |  | FadeIn + translateX |
| 1.45s | shape 48×48 | `spin` | transform:none → transform:rotate(360deg) | 1000 | 0 | `linear` | ∞ | withRepeat rotate / ActivityIndicator |
| 1.50s | “Pause” | `filter` | filter:blur(0.31px) → filter:none | 114 | 0 | `ease` |  | (press blur → haptic in RN) |
| 1.50s | g 9×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 1.50s | shape 17×17 | `pop` | opacity:0; transform:scale(0.5) → opacity:1; transform:scale(1) | 380 | 180 | `bezier(0.2, 0.9, 0.25, 1.3)` |  | withSequence scale .9→1.12→1 (AnimatedCheckbox / popIn) |
| 1.50s | SVG stroke 5×3 | `draw` | strokeDashoffset:24px → strokeDashoffset:0px | 320 | 200 | `ease-out` |  | strokeDashoffset via useAnimatedProps |
| 1.55s | g 10×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 1.55s | shape 21×21 | `pop` | opacity:0; transform:scale(0.5) → opacity:1; transform:scale(1) | 380 | 180 | `bezier(0.2, 0.9, 0.25, 1.3)` |  | withSequence scale .9→1.12→1 (AnimatedCheckbox / popIn) |
| 1.55s | SVG stroke 6×4 | `draw` | strokeDashoffset:24px → strokeDashoffset:0px | 320 | 200 | `ease-out` |  | strokeDashoffset via useAnimatedProps |
| 1.60s | g 10×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 1.65s | 2× g 9×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 1.70s | g 10×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 1.70s | shape 42×42 | `pulse` | opacity:0.55 → opacity:0.55 | 1600 | 0 | `ease-in-out` | ∞ | withRepeat opacity |
| 1.75s | g 9×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 1.80s | g 10×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 1.85s | g 9×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 1.90s | g 9×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 2.00s | g 9×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 2.05s | g 9×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| **2.07s** | 👆 **tap button:has-text("Exam alert")** | | | | | | | |
| 2.15s | g 10×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 2.15s | shape 42×42 | `pulse` | opacity:0.55 → opacity:0.55 | 1600 | 0 | `ease-in-out` | ∞ | withRepeat opacity |
| 2.20s | “Exam alert” | `filter` | filter:none → filter:blur(0.6px) | 220 | 0 | `ease` |  | (press blur → haptic in RN) |
| 2.20s | “Exam alert” | `transform` | transform:translateY(-0.77px) → transform:scale(0.96) | 180 | 0 | `bezier(0.2, 0, 0, 1)` |  | PressableScale / withSpring |
| 2.35s | “Exam alert” | `filter` | filter:blur(0.6px) → filter:none | 220 | 0 | `ease` |  | (press blur → haptic in RN) |
| 2.35s | “Exam alert” | `transform` | transform:scale(0.96) → transform:translateY(-1px) | 180 | 0 | `bezier(0.2, 0, 0, 1)` |  | PressableScale / withSpring |
| 2.35s | g 10×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 2.35s | “Next up Master theorem · 25 min” | `fadein` | opacity:0; transform:translateX(-6px); filter:blur(6px) → opacity:1; transform:none; filter:blur(0px) | 360 | 140 | `bezier(0.2, 0.8, 0.2, 1)` |  | FadeIn + translateX |
| 2.40s | g 9×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 2.40s | shape 47×47 | `spin` | transform:none → transform:rotate(360deg) | 1000 | 0 | `linear` | ∞ | withRepeat rotate / ActivityIndicator |
| 2.45s | 2 elements: g 10×5, g 9×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 2.65s | g 10×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 2.85s | 2× g 9×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 2.90s | g 9×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 2.95s | g 9×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 3.05s | g 10×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 3.05s | shape 42×42 | `pulse` | opacity:0.55 → opacity:0.55 | 1600 | 0 | `ease-in-out` | ∞ | withRepeat opacity |
| 3.15s | g 10×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 3.25s | g 9×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 3.25s | shape 47×47 | `spin` | transform:none → transform:rotate(360deg) | 1000 | 0 | `linear` | ∞ | withRepeat rotate / ActivityIndicator |
| 3.35s | g 9×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 3.45s | g 10×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 3.45s | “Moved DAA practice to 4 PM” | `fadein` | opacity:0; transform:translateX(-6px); filter:blur(6px) → opacity:1; transform:none; filter:blur(0px) | 360 | 140 | `bezier(0.2, 0.8, 0.2, 1)` |  | FadeIn + translateX |
| 3.50s | g 10×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 3.65s | 2× g 9×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 3.70s | g 9×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 3.75s | 2 elements: g 10×5, g 9×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 3.75s | “SE exam · Wed 2 PM 3 days to prep…” | `fadein` | opacity:0; transform:translateX(-6px); filter:blur(6px) → opacity:1; transform:none; filter:blur(0px) | 360 | 140 | `bezier(0.2, 0.8, 0.2, 1)` |  | FadeIn + translateX |
| 3.75s | shape 42×42 | `pulse` | opacity:0.55 → opacity:0.55 | 1600 | 0 | `ease-in-out` | ∞ | withRepeat opacity |
| 3.80s | g 9×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 3.80s | “Plan updated” | `fadein` | opacity:0; transform:translateX(-6px); filter:blur(6px) → opacity:1; transform:none; filter:blur(0px) | 360 | 140 | `bezier(0.2, 0.8, 0.2, 1)` |  | FadeIn + translateX |
| 3.85s | 2× g 9×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 3.85s | shape 46×46 | `spin` | transform:none → transform:rotate(360deg) | 1000 | 0 | `linear` | ∞ | withRepeat rotate / ActivityIndicator |
| 3.90s | g 10×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 4.00s | g 10×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 4.00s | “All done for today!” | `fadein` | opacity:0; transform:translateX(-6px); filter:blur(6px) → opacity:1; transform:none; filter:blur(0px) | 360 | 140 | `bezier(0.2, 0.8, 0.2, 1)` |  | FadeIn + translateX |
| 4.05s | 2× g 9×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 4.10s | g 10×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 4.10s | shape 42×42 | `pulse` | opacity:0.55 → opacity:0.55 | 1600 | 0 | `ease-in-out` | ∞ | withRepeat opacity |
| **4.13s** | 👆 **tap button:has-text("Next up")** | | | | | | | |
| 4.15s | g 10×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 4.25s | “Next up” | `filter` | filter:none → filter:blur(0.6px) | 220 | 0 | `ease` |  | (press blur → haptic in RN) |
| 4.25s | “Next up” | `transform` | transform:translateY(-0.90px) → transform:scale(0.96) | 180 | 0 | `bezier(0.2, 0, 0, 1)` |  | PressableScale / withSpring |
| 4.35s | “Next up” | `filter` | filter:none → filter:blur(0.6px) | 220 | 0 | `ease` |  | (press blur → haptic in RN) |
| 4.35s | “Next up” | `transform` | transform:translateY(0px) → transform:scale(0.96) | 180 | 0 | `bezier(0.2, 0, 0, 1)` |  | PressableScale / withSpring |
| 4.35s | g 9×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 4.35s | shape 46×46 | `spin` | transform:none → transform:rotate(360deg) | 1000 | 0 | `linear` | ∞ | withRepeat rotate / ActivityIndicator |
| 4.45s | 2× g 10×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 4.60s | g 9×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 4.65s | g 9×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 4.70s | g 9×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 4.75s | g 9×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 4.80s | g 10×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 4.80s | shape 42×42 | `pulse` | opacity:0.55 → opacity:0.55 | 1600 | 0 | `ease-in-out` | ∞ | withRepeat opacity |
| 4.85s | g 10×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 4.90s | g 9×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 4.90s | shape 34×34 | `spin` | transform:none → transform:rotate(360deg) | 1000 | 0 | `linear` | ∞ | withRepeat rotate / ActivityIndicator |
| 5.05s | g 9×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 5.15s | 2× g 10×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 5.35s | g 9×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 5.40s | g 9×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 5.55s | g 9×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 5.65s | g 9×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 5.75s | g 9×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 5.85s | g 10×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 5.85s | shape 42×42 | `pulse` | opacity:0.55 → opacity:0.55 | 1600 | 0 | `ease-in-out` | ∞ | withRepeat opacity |
| 6.15s | g 10×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| **6.20s** | 👆 **tap button:has-text("AI working")** | | | | | | | |
| 6.30s | g 9×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 6.30s | shape 37×37 | `spin` | transform:none → transform:rotate(360deg) | 1000 | 0 | `linear` | ∞ | withRepeat rotate / ActivityIndicator |
| 6.35s | 2× “AI working” | `filter` | filter:none → filter:blur(0.6px) | 220 | 0 | `ease` |  | (press blur → haptic in RN) |
| 6.35s | 2× “AI working” | `transform` | transform:translateY(-1px) → transform:scale(0.96) | 180 | 0 | `bezier(0.2, 0, 0, 1)` |  | PressableScale / withSpring |
| 6.35s | g 9×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 6.40s | “AI working” | `filter` | filter:none → filter:blur(0.6px) | 220 | 0 | `ease` |  | (press blur → haptic in RN) |
| 6.40s | “AI working” | `transform` | transform:translateY(0px) → transform:scale(0.96) | 180 | 0 | `bezier(0.2, 0, 0, 1)` |  | PressableScale / withSpring |
| 6.40s | g 10×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 6.50s | “AI working” | `filter` | filter:blur(0.45px) → filter:none | 166 | 0 | `ease` |  | (press blur → haptic in RN) |
| 6.55s | g 10×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 6.75s | g 9×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 6.85s | g 9×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 6.95s | g 9×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 7.00s | g 9×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 7.05s | g 10×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 7.05s | shape 42×42 | `pulse` | opacity:0.55 → opacity:0.55 | 1600 | 0 | `ease-in-out` | ∞ | withRepeat opacity |
| 7.20s | g 10×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 7.45s | g 9×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 7.45s | shape 47×47 | `spin` | transform:none → transform:rotate(360deg) | 1000 | 0 | `linear` | ∞ | withRepeat rotate / ActivityIndicator |
| 7.55s | g 10×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 7.60s | g 10×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 7.85s | g 9×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 7.90s | g 9×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 8.05s | g 9×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 8.20s | g 9×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 8.25s | g 9×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 8.35s | g 10×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 8.35s | shape 42×42 | `pulse` | opacity:0.55 → opacity:0.55 | 1600 | 0 | `ease-in-out` | ∞ | withRepeat opacity |
| 8.45s | g 10×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 8.65s | g 9×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 8.65s | shape 34×34 | `spin` | transform:none → transform:rotate(360deg) | 1000 | 0 | `linear` | ∞ | withRepeat rotate / ActivityIndicator |
| 8.85s | g 9×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 8.95s | g 10×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 9.20s | g 10×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 9.40s | g 9×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 9.45s | 2× g 9×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 9.50s | g 10×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 9.50s | shape 42×42 | `pulse` | opacity:0.55 → opacity:0.55 | 1600 | 0 | `ease-in-out` | ∞ | withRepeat opacity |
| 9.65s | g 10×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 9.80s | g 9×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 9.80s | shape 40×40 | `spin` | transform:none → transform:rotate(360deg) | 1000 | 0 | `linear` | ∞ | withRepeat rotate / ActivityIndicator |
| 9.85s | g 10×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 9.90s | g 10×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 10.00s | g 9×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 10.05s | g 9×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| **10.07s** | 👆 **tap button:has-text("All done")** | | | | | | | |
| 10.15s | 2× g 9×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 10.20s | g 10×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 10.30s | g 9×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 10.30s | shape 34×34 | `spin` | transform:none → transform:rotate(360deg) | 1000 | 0 | `linear` | ∞ | withRepeat rotate / ActivityIndicator |
| 10.45s | g 9×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 10.55s | g 10×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 10.70s | g 10×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 10.80s | g 9×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 10.85s | 2× g 9×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 10.90s | g 9×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 10.95s | 2 elements: g 10×5, g 9×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 10.95s | shape 42×42 | `pulse` | opacity:0.55 → opacity:0.55 | 1600 | 0 | `ease-in-out` | ∞ | withRepeat opacity |
| 11.05s | g 10×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 11.15s | g 9×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 11.15s | shape 47×47 | `spin` | transform:none → transform:rotate(360deg) | 1000 | 0 | `linear` | ∞ | withRepeat rotate / ActivityIndicator |
| 11.25s | 2 elements: g 10×5, g 9×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 11.35s | g 10×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 11.55s | 2× g 9×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 11.60s | g 9×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 11.65s | g 10×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 11.65s | shape 42×42 | `pulse` | opacity:0.55 → opacity:0.55 | 1600 | 0 | `ease-in-out` | ∞ | withRepeat opacity |
| 11.70s | g 10×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 11.80s | g 9×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 11.80s | shape 34×34 | `spin` | transform:none → transform:rotate(360deg) | 1000 | 0 | `linear` | ∞ | withRepeat rotate / ActivityIndicator |
| 11.90s | g 10×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 11.95s | g 10×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 12.05s | 2× g 9×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 12.15s | g 9×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 12.20s | g 9×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| **12.23s** | 👆 **tap button:has-text("Split")** | | | | | | | |
| 12.25s | g 9×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 12.30s | g 10×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 12.30s | shape 42×42 | `pulse` | opacity:0.55 → opacity:0.55 | 1600 | 0 | `ease-in-out` | ∞ | withRepeat opacity |
| 12.35s | “Split” | `filter` | filter:none → filter:blur(0.6px) | 220 | 0 | `ease` |  | (press blur → haptic in RN) |
| 12.35s | “Split” | `transform` | transform:translateY(-0.77px) → transform:scale(0.96) | 180 | 0 | `bezier(0.2, 0, 0, 1)` |  | PressableScale / withSpring |
| 12.45s | g 10×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 12.50s | g 9×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 12.50s | shape 34×34 | `spin` | transform:none → transform:rotate(360deg) | 1000 | 0 | `linear` | ∞ | withRepeat rotate / ActivityIndicator |
| 12.55s | g 10×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 12.65s | g 10×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 12.85s | g 9×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 12.95s | g 9×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 13.15s | g 9×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 13.25s | g 9×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 13.30s | g 9×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 13.40s | g 10×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 13.40s | shape 42×42 | `pulse` | opacity:0.55 → opacity:0.55 | 1600 | 0 | `ease-in-out` | ∞ | withRepeat opacity |
| 13.60s | g 10×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 13.75s | g 9×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 13.75s | shape 37×37 | `spin` | transform:none → transform:rotate(360deg) | 1000 | 0 | `linear` | ∞ | withRepeat rotate / ActivityIndicator |
| 13.85s | g 9×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 13.95s | g 10×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| **14.10s** | 👆 **tap button:has-text("Apart")** | | | | | | | |
| 14.15s | g 10×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 14.25s | “Apart” | `filter` | filter:none → filter:blur(0.6px) | 220 | 0 | `ease` |  | (press blur → haptic in RN) |
| 14.25s | “Apart” | `transform` | transform:translateY(-0.77px) → transform:scale(0.96) | 180 | 0 | `bezier(0.2, 0, 0, 1)` |  | PressableScale / withSpring |
| 14.40s | g 9×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 14.45s | g 9×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 14.55s | g 9×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 14.60s | g 9×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 14.65s | g 10×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 14.65s | shape 42×42 | `pulse` | opacity:0.55 → opacity:0.55 | 1600 | 0 | `ease-in-out` | ∞ | withRepeat opacity |
| 14.75s | g 10×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 15.00s | g 9×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 15.00s | shape 34×34 | `spin` | transform:none → transform:rotate(360deg) | 1000 | 0 | `linear` | ∞ | withRepeat rotate / ActivityIndicator |
| 15.15s | g 9×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 15.20s | g 10×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 15.25s | g 9×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 15.30s | g 9×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 15.40s | g 9×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 15.50s | g 9×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 15.60s | g 9×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 15.65s | g 10×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 15.65s | shape 42×42 | `pulse` | opacity:0.55 → opacity:0.55 | 1600 | 0 | `ease-in-out` | ∞ | withRepeat opacity |
| 15.85s | g 10×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 15.90s | g 9×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 15.90s | shape 46×46 | `spin` | transform:none → transform:rotate(360deg) | 1000 | 0 | `linear` | ∞ | withRepeat rotate / ActivityIndicator |
| 16.05s | g 10×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
| 16.20s | g 10×5 | `blink` | transform:scaleY(1) → transform:scaleY(1) | 2600 | 0 | `ease-in-out` | ∞ | withRepeat scaleY |
