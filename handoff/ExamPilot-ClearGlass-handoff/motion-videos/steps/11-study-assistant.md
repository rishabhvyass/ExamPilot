| time | trigger / element | animation | from → to | dur ms | delay ms | easing | loops | React Native |
|---|---|---|---|---|---|---|---|---|
| 0.00s | shape 52×52 | `glow` | transform:rotate(0deg) scale(1) → transform:rotate(0deg) scale(1) | 3000 | 0 | `ease-in-out` | ∞ | withRepeat rotate+scale |
| 0.00s | “Hi! I can plan your week, quiz yo…” | `msg` | opacity:0; transform:translateY(10px) scale(0.98) → opacity:1; transform:none | 360 | 0 | `bezier(0.2, 0.9, 0.25, 1.05)` |  | messageIn |
| 0.00s | “Make a plan for DAA before the ex…” | `msg` | opacity:0; transform:translateY(10px) scale(0.98) → opacity:1; transform:none | 360 | 0 | `bezier(0.2, 0.9, 0.25, 1.05)` |  | messageIn |
| 0.00s | “Here’s a calm plan for DAA before…” | `msg` | opacity:0; transform:translateY(10px) scale(0.98) → opacity:1; transform:none | 360 | 0 | `bezier(0.2, 0.9, 0.25, 1.05)` |  | messageIn |
| 0.00s | “Show my study hours by subject” | `msg` | opacity:0; transform:translateY(10px) scale(0.98) → opacity:1; transform:none | 360 | 0 | `bezier(0.2, 0.9, 0.25, 1.05)` |  | messageIn |
| 0.00s | “Planned study hours this week: 4h…” | `msg` | opacity:0; transform:translateY(10px) scale(0.98) → opacity:1; transform:none | 360 | 0 | `bezier(0.2, 0.9, 0.25, 1.05)` |  | messageIn |
| 0.00s | shape 93×20 | `bar` | transform:scaleY(0) → transform:scaleY(1) | 800 | 0 | `bezier(0.2, 0.8, 0.2, 1)` |  | scale 0→1, transformOrigin left/bottom |
| 0.00s | shape 93×0 | `bar` | transform:scaleY(0) → transform:scaleY(1) | 800 | 120 | `bezier(0.2, 0.8, 0.2, 1)` |  | scale 0→1, transformOrigin left/bottom |
| 0.00s | shape 93×0 | `bar` | transform:scaleY(0) → transform:scaleY(1) | 800 | 240 | `bezier(0.2, 0.8, 0.2, 1)` |  | scale 0→1, transformOrigin left/bottom |
| **1.40s** | 👆 **scroll to y=2000** | | | | | | | |
| **2.70s** | 👆 **tap text=Quiz me on AVL trees** | | | | | | | |
| 2.85s | “Quiz me on AVL trees” | `filter` | filter:none → filter:blur(0.6px) | 220 | 0 | `ease` |  | (press blur → haptic in RN) |
| 2.85s | “Quiz me on AVL trees” | `transform` | transform:translateY(-0.97px) → transform:scale(0.96) | 180 | 0 | `bezier(0.2, 0, 0, 1)` |  | PressableScale / withSpring |
| 3.00s | shape 52×52 | `glow` | transform:rotate(0deg) scale(1) → transform:rotate(0deg) scale(1) | 3000 | 0 | `ease-in-out` | ∞ | withRepeat rotate+scale |
| 3.00s | “Here’s a calm plan for DAA before…” | `msg` | opacity:0; transform:translateY(10px) scale(0.98) → opacity:1; transform:none | 360 | 0 | `bezier(0.2, 0.9, 0.25, 1.05)` |  | messageIn |
| 3.00s | “Show my study hours by subject” | `msg` | opacity:0; transform:translateY(10px) scale(0.98) → opacity:1; transform:none | 360 | 0 | `bezier(0.2, 0.9, 0.25, 1.05)` |  | messageIn |
| 3.00s | “Planned study hours this week: 4h…” | `msg` | opacity:0; transform:translateY(10px) scale(0.98) → opacity:1; transform:none | 360 | 0 | `bezier(0.2, 0.9, 0.25, 1.05)` |  | messageIn |
| 3.00s | shape 93×13 | `bar` | transform:scaleY(0) → transform:scaleY(1) | 800 | 0 | `bezier(0.2, 0.8, 0.2, 1)` |  | scale 0→1, transformOrigin left/bottom |
| 3.00s | “Quiz me on AVL trees” | `msg` | opacity:0; transform:translateY(10px) scale(0.98) → opacity:1; transform:none | 360 | 0 | `bezier(0.2, 0.9, 0.25, 1.05)` |  | messageIn |
| 3.00s | “Study buddy is typing” (div) | `msg` | opacity:0; transform:translateY(10px) scale(0.98) → opacity:1; transform:none | 360 | 0 | `bezier(0.2, 0.9, 0.25, 1.05)` |  | messageIn |
| 3.00s | shape 8×8 | `bounce` | opacity:0.4; transform:translateY(0px) → opacity:0.4; transform:translateY(0px) | 1000 | 0 | `ease-in-out` | ∞ | withRepeat translateY (typing dots) |
| 3.00s | shape 8×8 | `bounce` | opacity:0.4; transform:translateY(0px) → opacity:0.4; transform:translateY(0px) | 1000 | 150 | `ease-in-out` | ∞ | withRepeat translateY (typing dots) |
| 3.00s | shape 8×8 | `bounce` | opacity:0.4; transform:translateY(0px) → opacity:0.4; transform:translateY(0px) | 1000 | 300 | `ease-in-out` | ∞ | withRepeat translateY (typing dots) |
| 3.10s | shape 59×59 | `glow` | transform:rotate(0deg) scale(1) → transform:rotate(0deg) scale(1) | 3000 | 0 | `ease-in-out` | ∞ | withRepeat rotate+scale |
| 3.10s | “Hi! I can plan your week, quiz yo…” | `msg` | opacity:0; transform:translateY(10px) scale(0.98) → opacity:1; transform:none | 360 | 0 | `bezier(0.2, 0.9, 0.25, 1.05)` |  | messageIn |
| 3.10s | “Make a plan for DAA before the ex…” | `msg` | opacity:0; transform:translateY(10px) scale(0.98) → opacity:1; transform:none | 360 | 0 | `bezier(0.2, 0.9, 0.25, 1.05)` |  | messageIn |
| 3.10s | shape 94×80 | `bar` | transform:scaleY(0) → transform:scaleY(1) | 800 | 0 | `bezier(0.2, 0.8, 0.2, 1)` |  | scale 0→1, transformOrigin left/bottom |
| 3.10s | shape 94×99 | `bar` | transform:scaleY(0) → transform:scaleY(1) | 800 | 120 | `bezier(0.2, 0.8, 0.2, 1)` |  | scale 0→1, transformOrigin left/bottom |
| 3.10s | shape 94×19 | `bar` | transform:scaleY(0) → transform:scaleY(1) | 800 | 240 | `bezier(0.2, 0.8, 0.2, 1)` |  | scale 0→1, transformOrigin left/bottom |
| 3.10s | “Quiz me on AVL trees” | `msg` | opacity:0; transform:translateY(10px) scale(0.98) → opacity:1; transform:none | 360 | 0 | `bezier(0.2, 0.9, 0.25, 1.05)` |  | messageIn |
| 3.10s | “Quick one: you insert into the le…” | `msg` | opacity:0; transform:translateY(10px) scale(0.98) → opacity:1; transform:none | 360 | 0 | `bezier(0.2, 0.9, 0.25, 1.05)` |  | messageIn |
| **6.87s** | 👆 **scroll to y=2400** | | | | | | | |
