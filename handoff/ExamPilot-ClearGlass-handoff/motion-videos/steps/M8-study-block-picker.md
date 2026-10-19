| time | trigger / element | animation | from → to | dur ms | delay ms | easing | loops | React Native |
|---|---|---|---|---|---|---|---|---|
| 0.00s | “3 days” | `badge` | opacity:0; transform:scale(0.7) → opacity:1; transform:none | 300 | 0 | `bezier(0.2, 0.9, 0.25, 1.3)` |  | popIn() |
| 0.00s | “Oct 18” | `val` | opacity:0; transform:translateY(6px); filter:blur(3px) → opacity:1; transform:none; filter:blur(0px) | 280 | 0 | `bezier(0.2, 0.8, 0.2, 1)` |  | BlurIn soft keyed by value |
| 0.00s | “Oct 20” | `val` | opacity:0; transform:translateY(6px); filter:blur(3px) → opacity:1; transform:none; filter:blur(0px) | 280 | 0 | `bezier(0.2, 0.8, 0.2, 1)` |  | BlurIn soft keyed by value |
| **1.00s** | 👆 **tap button:has-text("Weekend")** | | | | | | | |
| 1.15s | “Weekend” | `transform` | transform:none → transform:scale(0.95) | 140 | 0 | `ease` |  | PressableScale / withSpring |
| 1.30s | “2 days” | `badge` | opacity:0; transform:scale(0.7) → opacity:1; transform:none | 300 | 0 | `bezier(0.2, 0.9, 0.25, 1.3)` |  | popIn() |
| 1.30s | “Oct 24” | `val` | opacity:0; transform:translateY(6px); filter:blur(3px) → opacity:1; transform:none; filter:blur(0px) | 280 | 0 | `bezier(0.2, 0.8, 0.2, 1)` |  | BlurIn soft keyed by value |
| 1.30s | “Oct 25” | `val` | opacity:0; transform:translateY(6px); filter:blur(3px) → opacity:1; transform:none; filter:blur(0px) | 280 | 0 | `bezier(0.2, 0.8, 0.2, 1)` |  | BlurIn soft keyed by value |
| **2.67s** | 👆 **tap button:has-text("1 week")** | | | | | | | |
| 2.80s | “1 week” | `transform` | transform:none → transform:scale(0.95) | 140 | 0 | `ease` |  | PressableScale / withSpring |
| 2.95s | “7 days” | `badge` | opacity:0; transform:scale(0.7) → opacity:1; transform:none | 300 | 0 | `bezier(0.2, 0.9, 0.25, 1.3)` |  | popIn() |
| 2.95s | “Oct 30” | `val` | opacity:0; transform:translateY(6px); filter:blur(3px) → opacity:1; transform:none; filter:blur(0px) | 280 | 0 | `bezier(0.2, 0.8, 0.2, 1)` |  | BlurIn soft keyed by value |
| **4.33s** | 👆 **tap button:has-text("3 days")** | | | | | | | |
| 4.45s | “3 days” | `transform` | transform:none → transform:scale(0.95) | 140 | 0 | `ease` |  | PressableScale / withSpring |
| 4.65s | “Oct 26” | `val` | opacity:0; transform:translateY(6px); filter:blur(3px) → opacity:1; transform:none; filter:blur(0px) | 280 | 0 | `bezier(0.2, 0.8, 0.2, 1)` |  | BlurIn soft keyed by value |
| **6.00s** | 👆 **tap button:has-text("Until exam")** | | | | | | | |
| 6.15s | “Until exam” | `transform` | transform:none → transform:scale(0.95) | 140 | 0 | `ease` |  | PressableScale / withSpring |
| 6.30s | “3 days” | `badge` | opacity:0; transform:scale(0.7) → opacity:1; transform:none | 300 | 0 | `bezier(0.2, 0.9, 0.25, 1.3)` |  | popIn() |
