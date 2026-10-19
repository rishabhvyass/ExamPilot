| time | trigger / element | animation | from → to | dur ms | delay ms | easing | loops | React Native |
|---|---|---|---|---|---|---|---|---|
| 0.00s | “Sample question bank Important Qu…” | `pagein` | opacity:0; transform:translateY(10px); filter:blur(10px) → opacity:1; transform:none; filter:blur(0px) | 360 | 0 | `bezier(0.2, 0.8, 0.2, 1)` |  | Screen + BlurIn (replays on focus) |
| 0.00s | 3× shape 33×6 | `pop` | transform:scale(0.9) → transform:scale(1) | 260 | 0 | `bezier(0.2, 0, 0, 1)` |  | withSequence scale .9→1.12→1 (AnimatedCheckbox / popIn) |
| 0.00s | “SE Revised Compare the Waterfall …” | `fadeup` | opacity:0; transform:translateY(8px); filter:blur(8px) → opacity:1; transform:none; filter:blur(0px) | 260 | 0 | `bezier(0.05, 0.7, 0.1, 1)` |  | BlurIn soft |
| 0.00s | 3× “Revised” | `pop` | transform:scale(0.9) → transform:scale(1) | 260 | 0 | `bezier(0.2, 0, 0, 1)` |  | withSequence scale .9→1.12→1 (AnimatedCheckbox / popIn) |
| 0.00s | “Waterfall runs phases in a fixed …” | `fadeup` | opacity:0; transform:translateY(8px); filter:blur(8px) → opacity:1; transform:none; filter:blur(0px) | 260 | 0 | `bezier(0.05, 0.7, 0.1, 1)` |  | BlurIn soft |
| 0.00s | “SE What is the difference between…” | `fadeup` | opacity:0; transform:translateY(8px); filter:blur(8px) → opacity:1; transform:none; filter:blur(0px) | 260 | 0 | `bezier(0.05, 0.7, 0.1, 1)` |  | BlurIn soft |
| 0.00s | “SE Revised Explain coupling and c…” | `fadeup` | opacity:0; transform:translateY(8px); filter:blur(8px) → opacity:1; transform:none; filter:blur(0px) | 260 | 0 | `bezier(0.05, 0.7, 0.1, 1)` |  | BlurIn soft |
| 0.00s | “DAA Revised State the Master theo…” | `fadeup` | opacity:0; transform:translateY(8px); filter:blur(8px) → opacity:1; transform:none; filter:blur(0px) | 260 | 0 | `bezier(0.05, 0.7, 0.1, 1)` |  | BlurIn soft |
| 0.00s | “DAA Greedy vs dynamic programming…” | `fadeup` | opacity:0; transform:translateY(8px); filter:blur(8px) → opacity:1; transform:none; filter:blur(0px) | 260 | 0 | `bezier(0.05, 0.7, 0.1, 1)` |  | BlurIn soft |
| 0.00s | “DAA Why does Dijkstra’s algorithm…” | `fadeup` | opacity:0; transform:translateY(8px); filter:blur(8px) → opacity:1; transform:none; filter:blur(0px) | 260 | 0 | `bezier(0.05, 0.7, 0.1, 1)` |  | BlurIn soft |
| 0.00s | “DDS Explain the four rotations us…” | `fadeup` | opacity:0; transform:translateY(8px); filter:blur(8px) → opacity:1; transform:none; filter:blur(0px) | 260 | 0 | `bezier(0.05, 0.7, 0.1, 1)` |  | BlurIn soft |
| 0.00s | “DDS How does a hash table handle …” | `fadeup` | opacity:0; transform:translateY(8px); filter:blur(8px) → opacity:1; transform:none; filter:blur(0px) | 260 | 0 | `bezier(0.05, 0.7, 0.1, 1)` |  | BlurIn soft |
| 0.00s | “Questions” | `tabin` | maxWidth:56px → maxWidth:320px | 520 | 0 | `bezier(0.2, 0.9, 0.25, 1.04)` |  | TabBar tabGrow (520ms) |
| 0.00s | “Questions” | `tablabel` | opacity:0; transform:translateX(-6px) → opacity:1; transform:none | 320 | 180 | `bezier(0.05, 0.7, 0.1, 1)` |  | TabBar label (180ms delay, 320ms) |
| **1.87s** | 👆 **tap text=Explain coupling and cohesion** | | | | | | | |
| 2.00s | “SE Revised Explain coupling and c…” | `filter` | filter:none → filter:blur(0.6px) | 220 | 0 | `ease` |  | (press blur → haptic in RN) |
| 2.00s | “SE Revised Explain coupling and c…” | `transform` | transform:translateY(-0.97px) → transform:scale(0.96) | 180 | 0 | `bezier(0.2, 0, 0, 1)` |  | PressableScale / withSpring |
| 2.15s | 3× shape 32×5 | `pop` | transform:scale(0.9) → transform:scale(1) | 260 | 0 | `bezier(0.2, 0, 0, 1)` |  | withSequence scale .9→1.12→1 (AnimatedCheckbox / popIn) |
| 2.15s | “SE Revised Compare the Waterfall …” | `fadeup` | opacity:0; transform:translateY(8px); filter:blur(8px) → opacity:1; transform:none; filter:blur(0px) | 260 | 0 | `bezier(0.05, 0.7, 0.1, 1)` |  | BlurIn soft |
| 2.15s | 3× “Revised” | `pop` | transform:scale(0.9) → transform:scale(1) | 260 | 0 | `bezier(0.2, 0, 0, 1)` |  | withSequence scale .9→1.12→1 (AnimatedCheckbox / popIn) |
| 2.15s | “SE What is the difference between…” | `fadeup` | opacity:0; transform:translateY(8px); filter:blur(8px) → opacity:1; transform:none; filter:blur(0px) | 260 | 0 | `bezier(0.05, 0.7, 0.1, 1)` |  | BlurIn soft |
| 2.15s | “SE Revised Explain coupling and c…” | `fadeup` | opacity:0; transform:translateY(8px); filter:blur(8px) → opacity:1; transform:none; filter:blur(0px) | 260 | 0 | `bezier(0.05, 0.7, 0.1, 1)` |  | BlurIn soft |
| 2.15s | “Cohesion is how closely related a…” | `fadeup` | opacity:0; transform:translateY(8px); filter:blur(8px) → opacity:1; transform:none; filter:blur(0px) | 260 | 0 | `bezier(0.05, 0.7, 0.1, 1)` |  | BlurIn soft |
| 2.15s | “DAA Revised State the Master theo…” | `fadeup` | opacity:0; transform:translateY(8px); filter:blur(8px) → opacity:1; transform:none; filter:blur(0px) | 260 | 0 | `bezier(0.05, 0.7, 0.1, 1)` |  | BlurIn soft |
| 2.15s | “DAA Greedy vs dynamic programming…” | `fadeup` | opacity:0; transform:translateY(8px); filter:blur(8px) → opacity:1; transform:none; filter:blur(0px) | 260 | 0 | `bezier(0.05, 0.7, 0.1, 1)` |  | BlurIn soft |
| 2.15s | “DAA Why does Dijkstra’s algorithm…” | `fadeup` | opacity:0; transform:translateY(8px); filter:blur(8px) → opacity:1; transform:none; filter:blur(0px) | 260 | 0 | `bezier(0.05, 0.7, 0.1, 1)` |  | BlurIn soft |
| 2.15s | “DDS Explain the four rotations us…” | `fadeup` | opacity:0; transform:translateY(8px); filter:blur(8px) → opacity:1; transform:none; filter:blur(0px) | 260 | 0 | `bezier(0.05, 0.7, 0.1, 1)` |  | BlurIn soft |
| 2.15s | “DDS How does a hash table handle …” | `fadeup` | opacity:0; transform:translateY(8px); filter:blur(8px) → opacity:1; transform:none; filter:blur(0px) | 260 | 0 | `bezier(0.05, 0.7, 0.1, 1)` |  | BlurIn soft |
| **3.53s** | 👆 **tap text=State the Master theorem** | | | | | | | |
| 3.65s | “DAA Revised State the Master theo…” | `filter` | filter:none → filter:blur(0.6px) | 220 | 0 | `ease` |  | (press blur → haptic in RN) |
| 3.65s | “DAA Revised State the Master theo…” | `transform` | transform:translateY(-0.97px) → transform:scale(0.96) | 180 | 0 | `bezier(0.2, 0, 0, 1)` |  | PressableScale / withSpring |
| 3.85s | 2× “Revised” | `pop` | transform:scale(0.9) → transform:scale(1) | 260 | 0 | `bezier(0.2, 0, 0, 1)` |  | withSequence scale .9→1.12→1 (AnimatedCheckbox / popIn) |
| 3.85s | “SE What is the difference between…” | `fadeup` | opacity:0; transform:translateY(8px); filter:blur(8px) → opacity:1; transform:none; filter:blur(0px) | 260 | 0 | `bezier(0.05, 0.7, 0.1, 1)` |  | BlurIn soft |
| 3.85s | “SE Revised Explain coupling and c…” | `fadeup` | opacity:0; transform:translateY(8px); filter:blur(8px) → opacity:1; transform:none; filter:blur(0px) | 260 | 0 | `bezier(0.05, 0.7, 0.1, 1)` |  | BlurIn soft |
| 3.85s | “DAA Revised State the Master theo…” | `fadeup` | opacity:0; transform:translateY(8px); filter:blur(8px) → opacity:1; transform:none; filter:blur(0px) | 260 | 0 | `bezier(0.05, 0.7, 0.1, 1)` |  | BlurIn soft |
| 3.85s | “For T(n) = aT(n/b) + f(n), compar…” | `fadeup` | opacity:0; transform:translateY(8px); filter:blur(8px) → opacity:1; transform:none; filter:blur(0px) | 260 | 0 | `bezier(0.05, 0.7, 0.1, 1)` |  | BlurIn soft |
| 3.85s | “DAA Greedy vs dynamic programming…” | `fadeup` | opacity:0; transform:translateY(8px); filter:blur(8px) → opacity:1; transform:none; filter:blur(0px) | 260 | 0 | `bezier(0.05, 0.7, 0.1, 1)` |  | BlurIn soft |
| 3.85s | “DAA Why does Dijkstra’s algorithm…” | `fadeup` | opacity:0; transform:translateY(8px); filter:blur(8px) → opacity:1; transform:none; filter:blur(0px) | 260 | 0 | `bezier(0.05, 0.7, 0.1, 1)` |  | BlurIn soft |
| 3.85s | “DDS Explain the four rotations us…” | `fadeup` | opacity:0; transform:translateY(8px); filter:blur(8px) → opacity:1; transform:none; filter:blur(0px) | 260 | 0 | `bezier(0.05, 0.7, 0.1, 1)` |  | BlurIn soft |
| 3.85s | “DDS How does a hash table handle …” | `fadeup` | opacity:0; transform:translateY(8px); filter:blur(8px) → opacity:1; transform:none; filter:blur(0px) | 260 | 0 | `bezier(0.05, 0.7, 0.1, 1)` |  | BlurIn soft |
| **5.20s** | 👆 **scroll to y=0** | | | | | | | |
| **5.90s** | 👆 **tap button[aria-pressed]:has-text("DDS")** | | | | | | | |
| 6.05s | “DDS” | `filter` | filter:none → filter:blur(0.6px) | 220 | 0 | `ease` |  | (press blur → haptic in RN) |
| 6.05s | “DDS” | `transform` | transform:translateY(-0.97px) → transform:scale(0.96) | 180 | 0 | `bezier(0.2, 0, 0, 1)` |  | PressableScale / withSpring |
| 6.20s | “DDS Explain the four rotations us…” | `fadeup` | opacity:0; transform:translateY(8px); filter:blur(8px) → opacity:1; transform:none; filter:blur(0px) | 260 | 0 | `bezier(0.05, 0.7, 0.1, 1)` |  | BlurIn soft |
| 6.20s | “DDS How does a hash table handle …” | `fadeup` | opacity:0; transform:translateY(8px); filter:blur(8px) → opacity:1; transform:none; filter:blur(0px) | 260 | 0 | `bezier(0.05, 0.7, 0.1, 1)` |  | BlurIn soft |
