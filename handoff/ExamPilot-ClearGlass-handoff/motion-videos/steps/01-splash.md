| time | trigger / element | animation | from → to | dur ms | delay ms | easing | loops | React Native |
|---|---|---|---|---|---|---|---|---|
| 0.00s | shape 274×274 | `ring` | opacity:0; transform:scale(0.85) → opacity:1; transform:scale(1) | 1100 | 0 | `bezier(0.2, 0.8, 0.2, 1)` |  | motion.bloom() |
| 0.00s | shape 189×189 | `ring` | opacity:0; transform:scale(0.85) → opacity:1; transform:scale(1) | 1100 | 120 | `bezier(0.2, 0.8, 0.2, 1)` |  | motion.bloom() |
| 0.00s | block 320×320 | `orbit` | transform:none → transform:rotate(360deg) | 14000 | 0 | `linear` | ∞ | withRepeat(withTiming(360deg), -1) |
| 0.00s | shape 13×13 | `bloom` | opacity:0; transform:scale(0.6) → opacity:1; transform:scale(1) | 900 | 700 | `bezier(0.2, 0.9, 0.25, 1.08)` |  | motion.bloom() |
| 0.00s | shape 9×9 | `bloom` | opacity:0; transform:scale(0.6) → opacity:1; transform:scale(1) | 900 | 820 | `bezier(0.2, 0.9, 0.25, 1.08)` |  | motion.bloom() |
| 0.00s | shape 78×78 | `bloom` | opacity:0; transform:scale(0.6) → opacity:1; transform:scale(1) | 900 | 0 | `bezier(0.2, 0.9, 0.25, 1.08)` |  | motion.bloom() |
| 0.00s | shape 71×71 | `bloom` | opacity:0; transform:scale(0.6) → opacity:1; transform:scale(1) | 900 | 140 | `bezier(0.2, 0.9, 0.25, 1.08)` |  | motion.bloom() |
| 0.00s | shape 58×58 | `bloom` | opacity:0; transform:scale(0.6) → opacity:1; transform:scale(1) | 900 | 280 | `bezier(0.2, 0.9, 0.25, 1.08)` |  | motion.bloom() |
| 0.00s | shape 56×56 | `bloom` | opacity:0; transform:scale(0.7) → opacity:1; transform:scale(1) | 500 | 300 | `bezier(0.2, 0.9, 0.25, 1.1)` |  | motion.bloom() |
| 0.00s | SVG stroke 21×21 | `draw` | strokeDashoffset:60px → strokeDashoffset:0px | 700 | 500 | `bezier(0.6, 0, 0.2, 1)` |  | strokeDashoffset via useAnimatedProps |
| 0.00s | “E” | `letter` | opacity:0; transform:translateY(22px); filter:blur(12px) → opacity:1; transform:none; filter:blur(0px) | 600 | 700 | `bezier(0.05, 0.7, 0.1, 1)` |  | SplashIntro letters (BlurIn delay) |
| 0.00s | “x” | `letter` | opacity:0; transform:translateY(22px); filter:blur(12px) → opacity:1; transform:none; filter:blur(0px) | 600 | 745 | `bezier(0.05, 0.7, 0.1, 1)` |  | SplashIntro letters (BlurIn delay) |
| 0.00s | “a” | `letter` | opacity:0; transform:translateY(22px); filter:blur(12px) → opacity:1; transform:none; filter:blur(0px) | 600 | 790 | `bezier(0.05, 0.7, 0.1, 1)` |  | SplashIntro letters (BlurIn delay) |
| 0.00s | “m” | `letter` | opacity:0; transform:translateY(22px); filter:blur(12px) → opacity:1; transform:none; filter:blur(0px) | 600 | 835 | `bezier(0.05, 0.7, 0.1, 1)` |  | SplashIntro letters (BlurIn delay) |
| 0.00s | “P” | `letter` | opacity:0; transform:translateY(22px); filter:blur(12px) → opacity:1; transform:none; filter:blur(0px) | 600 | 880 | `bezier(0.05, 0.7, 0.1, 1)` |  | SplashIntro letters (BlurIn delay) |
| 0.00s | “i” | `letter` | opacity:0; transform:translateY(22px); filter:blur(12px) → opacity:1; transform:none; filter:blur(0px) | 600 | 925 | `bezier(0.05, 0.7, 0.1, 1)` |  | SplashIntro letters (BlurIn delay) |
| 0.00s | “l” | `letter` | opacity:0; transform:translateY(22px); filter:blur(12px) → opacity:1; transform:none; filter:blur(0px) | 600 | 970 | `bezier(0.05, 0.7, 0.1, 1)` |  | SplashIntro letters (BlurIn delay) |
| 0.00s | “o” | `letter` | opacity:0; transform:translateY(22px); filter:blur(12px) → opacity:1; transform:none; filter:blur(0px) | 600 | 1015 | `bezier(0.05, 0.7, 0.1, 1)` |  | SplashIntro letters (BlurIn delay) |
| 0.00s | “t” | `letter` | opacity:0; transform:translateY(22px); filter:blur(12px) → opacity:1; transform:none; filter:blur(0px) | 600 | 1060 | `bezier(0.05, 0.7, 0.1, 1)` |  | SplashIntro letters (BlurIn delay) |
| 0.00s | “Study calm. Exam ready. One topic…” | `fade` | opacity:0; transform:translateY(10px); filter:blur(8px) → opacity:1; transform:none; filter:blur(0px) | 600 | 1200 | `bezier(0.05, 0.7, 0.1, 1)` |  | BlurIn |
| 0.00s | shape 0×4 | `bar` | transform:scaleX(0) → transform:scaleX(1) | 1500 | 400 | `bezier(0.4, 0, 0.2, 1)` |  | scale 0→1, transformOrigin left/bottom |
| 0.00s | “Let's begin” | `fade` | opacity:0; transform:translateY(10px); filter:blur(8px) → opacity:1; transform:none; filter:blur(0px) | 600 | 1700 | `bezier(0.05, 0.7, 0.1, 1)` |  | BlurIn |
| **3.40s** | 👆 **tap text=Replay** | | | | | | | |
| 3.40s | “Replay” | `box-shadow` | boxShadow:none → boxShadow:rgba(27, 27, 31, 0.22) 0px 10px 24px 0px | 220 | 0 | `ease` |  | Surface kind swap |
| 3.55s | “Replay” | `filter` | filter:none → filter:blur(0.6px) | 220 | 0 | `ease` |  | (press blur → haptic in RN) |
| 3.55s | “Replay” | `transform` | transform:translateY(-0.97px) → transform:scale(0.96) | 180 | 0 | `bezier(0.2, 0, 0, 1)` |  | PressableScale / withSpring |
| 3.70s | “Replay” | `box-shadow` | boxShadow:none → boxShadow:rgba(27, 27, 31, 0.22) 0px 10px 24px 0px | 220 | 0 | `ease` |  | Surface kind swap |
| 3.70s | block 320×320 | `orbit` | transform:none → transform:rotate(360deg) | 14000 | 0 | `linear` | ∞ | withRepeat(withTiming(360deg), -1) |
