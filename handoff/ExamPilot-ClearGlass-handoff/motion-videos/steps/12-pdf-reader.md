| time | trigger / element | animation | from → to | dur ms | delay ms | easing | loops | React Native |
|---|---|---|---|---|---|---|---|---|
| 0.00s | “Page 4: UML class diagrams” (article) | `turnR` | opacity:0; transform:translateX(40px) rotate(2deg) → opacity:1; transform:none | 420 | 0 | `bezier(0.2, 0.8, 0.2, 1)` |  | BlurIn + translateX 40 / rotate 2° |
| **1.20s** | 👆 **tap [aria-label="Highlight key line"]** | | | | | | | |
| 1.35s | “Highlight key line” (button) | `filter` | filter:none → filter:blur(0.6px) | 220 | 0 | `ease` |  | (press blur → haptic in RN) |
| 1.35s | “Highlight key line” (button) | `transform` | transform:translateY(-0.97px) → transform:scale(0.96) | 180 | 0 | `bezier(0.2, 0, 0, 1)` |  | PressableScale / withSpring |
| **3.03s** | 👆 **tap [aria-label="Next page"]** | | | | | | | |
| 3.15s | “Next page” (button) | `filter` | filter:none → filter:blur(0.6px) | 220 | 0 | `ease` |  | (press blur → haptic in RN) |
| 3.15s | “Next page” (button) | `transform` | transform:translateY(-0.97px) → transform:scale(0.96) | 180 | 0 | `bezier(0.2, 0, 0, 1)` |  | PressableScale / withSpring |
| 3.35s | “Page 5: Sequence diagrams” (article) | `turnR` | opacity:0; transform:translateX(40px) rotate(2deg) → opacity:1; transform:none | 420 | 0 | `bezier(0.2, 0.8, 0.2, 1)` |  | BlurIn + translateX 40 / rotate 2° |
| **4.30s** | 👆 **tap [aria-label="Next page"]** | | | | | | | |
| 4.45s | “Next page” (button) | `filter` | filter:none → filter:blur(0.6px) | 220 | 0 | `ease` |  | (press blur → haptic in RN) |
| 4.45s | “Next page” (button) | `transform` | transform:translateY(-1px) → transform:scale(0.96) | 180 | 0 | `bezier(0.2, 0, 0, 1)` |  | PressableScale / withSpring |
| 4.60s | “Page 6: Summary” (article) | `turnR` | opacity:0; transform:translateX(40px) rotate(2deg) → opacity:1; transform:none | 420 | 0 | `bezier(0.2, 0.8, 0.2, 1)` |  | BlurIn + translateX 40 / rotate 2° |
| 4.60s | “You finished this PDF! Want 5 qui…” | `cheer` | opacity:0; transform:scale(0.8) → opacity:1; transform:none | 600 | 0 | `bezier(0.2, 0.9, 0.25, 1.3)` |  | popIn() |
| 4.60s | shape 9×9 | `spark` | opacity:1; transform:translate(0px) scale(0.5) → opacity:0; transform:translate(60px) scale(1) | 900 | 200 | `ease-out` |  | Keyframe out from centre |
| **5.57s** | 👆 **tap [aria-label="Previous page"]** | | | | | | | |
| 5.85s | “Page 5: Sequence diagrams” (article) | `turnL` | opacity:0; transform:translateX(-40px) rotate(-2deg) → opacity:1; transform:none | 420 | 0 | `bezier(0.2, 0.8, 0.2, 1)` |  | BlurIn + translateX -40 / rotate -2° |
| **6.83s** | 👆 **tap [aria-label^="Page 6"]** | | | | | | | |
| 7.15s | “Page 6: Summary” (article) | `turnR` | opacity:0; transform:translateX(40px) rotate(2deg) → opacity:1; transform:none | 420 | 0 | `bezier(0.2, 0.8, 0.2, 1)` |  | BlurIn + translateX 40 / rotate 2° |
| 7.15s | shape 10×10 | `spark` | opacity:1; transform:translate(0px) scale(0.5) → opacity:0; transform:translate(60px) scale(1) | 900 | 200 | `ease-out` |  | Keyframe out from centre |
| 7.15s | shape 9×9 | `spark` | opacity:1; transform:translate(0px) scale(0.5) → opacity:0; transform:translate(42px, 28px) scale(1) | 900 | 230 | `ease-out` |  | Keyframe out from centre |
| 7.15s | shape 9×9 | `spark` | opacity:1; transform:translate(0px) scale(0.5) → opacity:0; transform:translate(0px, 40px) scale(1) | 900 | 260 | `ease-out` |  | Keyframe out from centre |
| 7.15s | shape 9×9 | `spark` | opacity:1; transform:translate(0px) scale(0.5) → opacity:0; transform:translate(-42px, 28px) scale(1) | 900 | 290 | `ease-out` |  | Keyframe out from centre |
| 7.15s | shape 9×9 | `spark` | opacity:1; transform:translate(0px) scale(0.5) → opacity:0; transform:translate(-60px) scale(1) | 900 | 320 | `ease-out` |  | Keyframe out from centre |
| 7.15s | shape 9×9 | `spark` | opacity:1; transform:translate(0px) scale(0.5) → opacity:0; transform:translate(-42px, -28px) scale(1) | 900 | 350 | `ease-out` |  | Keyframe out from centre |
| 7.15s | shape 9×9 | `spark` | opacity:1; transform:translate(0px) scale(0.5) → opacity:0; transform:translate(0px, -40px) scale(1) | 900 | 380 | `ease-out` |  | Keyframe out from centre |
| 7.15s | shape 8×8 | `spark` | opacity:1; transform:translate(0px) scale(0.5) → opacity:0; transform:translate(42px, -28px) scale(1) | 900 | 410 | `ease-out` |  | Keyframe out from centre |
