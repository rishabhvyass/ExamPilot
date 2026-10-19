| time | trigger / element | animation | from → to | dur ms | delay ms | easing | loops | React Native |
|---|---|---|---|---|---|---|---|---|
| 0.00s | shape 8×6 | `grow` | transform:scaleX(0) → transform:scaleX(1) | 600 | 200 | `bezier(0.2, 0.8, 0.2, 1)` |  | scaleX 0→1, transformOrigin left |
| 0.00s | “Hi Your details Nice to meet you!” | `rise` | opacity:0; transform:translateY(12px); filter:blur(10px) → opacity:1; transform:none; filter:blur(0px) | 480 | 0 | `bezier(0.05, 0.7, 0.1, 1)` |  | BlurIn index={n} |
| 0.00s | “Hi” | `pop` | transform:scale(0.85) → transform:scale(1) | 320 | 0 | `bezier(0.2, 0.9, 0.25, 1.2)` |  | withSequence scale .9→1.12→1 (AnimatedCheckbox / popIn) |
| 0.00s | “Tell us a little about you” | `rise` | opacity:0; transform:translateY(12px); filter:blur(10px) → opacity:1; transform:none; filter:blur(0px) | 480 | 60 | `bezier(0.05, 0.7, 0.1, 1)` |  | BlurIn index={n} |
| 0.00s | “First name Surname” | `rise` | opacity:0; transform:translateY(12px); filter:blur(10px) → opacity:1; transform:none; filter:blur(0px) | 480 | 120 | `bezier(0.05, 0.7, 0.1, 1)` |  | BlurIn index={n} |
| 0.00s | “Student email” | `rise` | opacity:0; transform:translateY(12px); filter:blur(10px) → opacity:1; transform:none; filter:blur(0px) | 480 | 120 | `bezier(0.05, 0.7, 0.1, 1)` |  | BlurIn index={n} |
| 0.00s | “College (optional)” | `rise` | opacity:0; transform:translateY(12px); filter:blur(10px) → opacity:1; transform:none; filter:blur(0px) | 480 | 180 | `bezier(0.05, 0.7, 0.1, 1)` |  | BlurIn index={n} |
| 0.00s | “Semester” (div) | `rise` | opacity:0; transform:translateY(12px); filter:blur(10px) → opacity:1; transform:none; filter:blur(0px) | 480 | 180 | `bezier(0.05, 0.7, 0.1, 1)` |  | BlurIn index={n} |
| 0.00s | “5” | `pop` | transform:scale(0.85) → transform:scale(1) | 320 | 0 | `bezier(0.2, 0.9, 0.25, 1.2)` |  | withSequence scale .9→1.12→1 (AnimatedCheckbox / popIn) |
| 0.00s | “Continue” | `rise` | opacity:0; transform:translateY(12px); filter:blur(10px) → opacity:1; transform:none; filter:blur(0px) | 480 | 240 | `bezier(0.05, 0.7, 0.1, 1)` |  | BlurIn index={n} |
| **1.30s** | 👆 **type "Rishabh" into input[autocomplete=given-name]** | | | | | | | |
| 1.30s | “First name” | `box-shadow` | boxShadow:none → boxShadow:rgb(27, 27, 31) 0px 0px 0px 2px | 180 | 0 | `ease` |  | Surface kind swap |
| 1.40s | block 47×47 | `opacity` | opacity:0.85 → opacity:0 | 153 | 0 | `ease` |  | withTiming opacity |
| 1.55s | shape 0×6 | `grow` | transform:scaleX(0) → transform:scaleX(1) | 600 | 200 | `bezier(0.2, 0.8, 0.2, 1)` |  | scaleX 0→1, transformOrigin left |
| 1.55s | “R Your details Nice to meet you, …” | `rise` | opacity:0; transform:translateY(12px); filter:blur(10px) → opacity:1; transform:none; filter:blur(0px) | 480 | 0 | `bezier(0.05, 0.7, 0.1, 1)` |  | BlurIn index={n} |
| 1.55s | “R” | `pop` | transform:scale(0.85) → transform:scale(1) | 320 | 0 | `bezier(0.2, 0.9, 0.25, 1.2)` |  | withSequence scale .9→1.12→1 (AnimatedCheckbox / popIn) |
| 1.55s | “Semester” (div) | `rise` | opacity:0; transform:translateY(12px); filter:blur(10px) → opacity:1; transform:none; filter:blur(0px) | 480 | 180 | `bezier(0.05, 0.7, 0.1, 1)` |  | BlurIn index={n} |
| 1.95s | “Surname” | `box-shadow` | boxShadow:none → boxShadow:rgb(27, 27, 31) 0px 0px 0px 2px | 180 | 0 | `ease` |  | Surface kind swap |
| **1.97s** | 👆 **type "Vyas" into input[autocomplete=family-name]** | | | | | | | |
| 2.05s | block 53×53 | `opacity` | opacity:0.85 → opacity:0 | 153 | 0 | `ease` |  | withTiming opacity |
| 2.05s | block 53×53 | `transform` | transform:scale(1.05) → transform:scale(1.4) | 153 | 0 | `ease` |  | PressableScale / withSpring |
| 2.20s | “RV Your details Nice to meet you,…” | `rise` | opacity:0; transform:translateY(12px); filter:blur(10px) → opacity:1; transform:none; filter:blur(0px) | 480 | 0 | `bezier(0.05, 0.7, 0.1, 1)` |  | BlurIn index={n} |
| 2.20s | “RV” | `pop` | transform:scale(0.85) → transform:scale(1) | 320 | 0 | `bezier(0.2, 0.9, 0.25, 1.2)` |  | withSequence scale .9→1.12→1 (AnimatedCheckbox / popIn) |
| **2.53s** | 👆 **tap [aria-label="Semester"] button >> nth=4** | | | | | | | |
| 2.65s | “7” | `filter` | filter:none → filter:blur(0.6px) | 220 | 0 | `ease` |  | (press blur → haptic in RN) |
| 2.65s | “7” | `transform` | transform:translateY(-0.97px) → transform:scale(0.96) | 180 | 0 | `bezier(0.2, 0, 0, 1)` |  | PressableScale / withSpring |
| 2.85s | “RV Your details Nice to meet you,…” | `rise` | opacity:0; transform:translateY(12px); filter:blur(10px) → opacity:1; transform:none; filter:blur(0px) | 480 | 0 | `bezier(0.05, 0.7, 0.1, 1)` |  | BlurIn index={n} |
| 2.85s | “7” | `pop` | transform:scale(0.85) → transform:scale(1) | 320 | 0 | `bezier(0.2, 0.9, 0.25, 1.2)` |  | withSequence scale .9→1.12→1 (AnimatedCheckbox / popIn) |
| **3.60s** | 👆 **tap [aria-label="Semester"] button >> nth=5** | | | | | | | |
| 3.75s | “8” | `filter` | filter:none → filter:blur(0.6px) | 220 | 0 | `ease` |  | (press blur → haptic in RN) |
| 3.75s | “8” | `transform` | transform:translateY(-0.97px) → transform:scale(0.96) | 180 | 0 | `bezier(0.2, 0, 0, 1)` |  | PressableScale / withSpring |
| 3.90s | “RV” | `pop` | transform:scale(0.85) → transform:scale(1) | 320 | 0 | `bezier(0.2, 0.9, 0.25, 1.2)` |  | withSequence scale .9→1.12→1 (AnimatedCheckbox / popIn) |
| 3.90s | “8” | `pop` | transform:scale(0.85) → transform:scale(1) | 320 | 0 | `bezier(0.2, 0.9, 0.25, 1.2)` |  | withSequence scale .9→1.12→1 (AnimatedCheckbox / popIn) |
