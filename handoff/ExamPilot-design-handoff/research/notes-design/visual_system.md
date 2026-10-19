# ExamPilot Visual Design System (calm, friendly, low-anxiety; React + Tailwind + Google Fonts)

## Q1. Which calm/friendly apps use warm off-whites, soft pastels and rounded cards, and what exactly do they do?

### Takeaway
The best-documented references (Headspace, Notion, Duolingo, Calm) share a few habits: an off-white or white canvas with white cards on top, a base card radius of 16–20px (24px for feature panels, full pill for CTAs), barely-there shadows (6–10% black), and pastel tints used as card or section backgrounds instead of saturated fills. Headspace's warm canvas (#f9f4f2) and Notion's pastel tag tints are the closest matches to ExamPilot's goals.

### Cited Findings
- **Headspace (web):** canvas **#f9f4f2** (warm off-white), cards on a **#ffffff** surface, ink **#2d2c2b**, meta text #63605d, hairline borders #e2ded9. Cards use a **16px** radius, feature plates **24px**, CTA pills **32px**. Spacing is built on a 4/8/24/32/48px scale. Its brand "orb" accents are saturated (saffron #ffce00, aqua #00a4ff, pink #ffa1cc, grass #02873e) but are kept to illustrations and characters. The font is Apercu (400/500/700). — [shadcn.io Headspace DESIGN.md](https://www.shadcn.io/design/headspace)
- **Notion (web):** warm grey surfaces **#f6f5f4** and #fafaf9, with a cream card tint #f8f5e8. Pastel card tints: peach **#ffe8d4**, rose #fde0ec, mint **#d9f3e1**, lavender **#e6e0f5**, sky **#dcecfa**, yellow #fef7d6. Warm hairlines #e5e3df and #ede9e4. Charcoal text #37352f, slate #5d5b54. Base radius 8px, cards 12px, feature cards up to 24px. The only shadow is one 24px diffuse shadow on the hero mockup. Font is Inter-based. — [shadcn.io Notion DESIGN.md](https://www.shadcn.io/design/notion)
- **Duolingo (web):** pure white canvas, with a warm cream #fff4dd used as the warning background. Radii: 12px inputs, 16px buttons, **20px default cards**, 24px featured, pill. Card shadow `0 2px 8px rgba(0,0,0,0.06)`, hover `0 4px 16px rgba(0,0,0,0.10)`. Buttons get a signature "3D" solid offset shadow (`0 4px 0 0` in a darker shade of the button colour). Spacing uses a 4px base, card padding is 24px, and content blocks are 64px apart. Semantic tints: info #ddf4ff, warning #fff4dd, danger #ffe5e5. Body font falls back to **Lexend Deca**. — [webdesignhot Duolingo design.md](https://www.webdesignhot.com/design.md/duolingo/)
  - A second extraction says Duolingo uses a 12px button / 16px UI base radius and Feather Bold / DIN Round fonts, and lists no shadow tokens. This partly conflicts with the source above. — [shadcn.io Duolingo](https://www.shadcn.io/design/duolingo)
- **Calm (web, light marketing):** white canvas with a **lavender surface #e2eaff** for testimonial and trial cards, ink #1a3e6f (navy rather than black). **20px** base radius, pill CTAs. Font is **Figtree** (a free Google Font), weights 400/500/700. It uses a blue-to-violet gradient (#2477aa to #6461e0) as the brand accent. — [shadcn.io Calm DESIGN.md](https://www.shadcn.io/design/calm)
  - The Calm product UI is dark (navy canvas #0a1f3a, cards #13294a, 16px card radius, 24px modals). Its semantic colours are softened: success #42d68a, warning **#ffba43**, danger #ff6b6b (a coral, not a pure red). — [webdesignhot Calm design.md](https://www.webdesignhot.com/design.md/calm/)
- **Finch:** a design critique credits its "playful design" and gentle cause-and-effect feedback (for example "Your Finch feels calmer"). It flags overwhelming onboarding with too many options at once as a stress point. It does not document colours. — [Pratt IXD critique of Finch](https://ixd.prattsi.org/2025/09/design-critique-finch-ios-app-2/)

### Inferences
- The common recipe is a warm off-white canvas, white or pastel-tinted cards, and 16–24px radii. Shadows are 6–10% black, or replaced by 1px warm hairlines (Notion, Headspace).
- Calm and Headspace use navy or warm charcoal for text instead of pure black. This softens contrast without failing WCAG.
- Brands with saturated colours (Headspace orbs, Duolingo green) limit them to illustrations, mascots and primary buttons. Large surfaces stay neutral or pastel.
- Duolingo's 3D button shadow is playful and gamified. For a low-anxiety exam app, a flat, softer button is probably the better fit. The 3D shadow could be kept just for "start session" moments.

### Gaps
- I could not get verified design tokens for Things 3, Structured, Forest, Todoist, Brainscape, Quizlet, StudySmarter, Daylio, Bear or Craft within the time budget. Their visual traits are not cited here.
- The DESIGN.md token extractions (shadcn.io, webdesignhot) are third-party scrapes of the marketing websites, not official brand guidelines. In-app UIs may differ, as the Duolingo radius conflict above shows.
- Mobbin requires login and was not checked.

## Q2. Which warm off-white backgrounds and pastel accents pass WCAG AA? Give 2–3 candidate palettes and pick the best one for a study app with about 3 subjects

### Takeaway
All contrast ratios below were computed with the WCAG relative-luminance formula. Each palette pairs a warm off-white canvas with dark warm text and a deepened accent for text and buttons, and keeps pastels as fills only. **Palette A, "Oat & Sage," is recommended.** Its three subject hues (sage, lavender, peach) plus a sky-blue info tint are evenly spaced around the colour wheel and all low-arousal.

### Cited Findings
- The WCAG AA thresholds (SC 1.4.3) are **4.5:1** for normal text and **3:1** for large text (about 24px regular, or about 18.5px bold). Ratios are not rounded, so 4.499 fails. — [W3C Understanding SC 1.4.3](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
- Non-text UI parts such as icons, chart segments and focus indicators are covered by SC 1.4.11 (non-text contrast, 3:1). The 1.4.3 page cross-references it with a "just above 3:1" example. — [W3C Understanding SC 1.4.3](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
- As reference points, Headspace's #2d2c2b on #f9f4f2 gives 12.78:1 and Notion's #37352f on #f6f5f4 gives 11.26:1. Notion's steel #787671 on #f6f5f4 gives only **4.17:1**, which fails AA for body text. — computed from tokens in [Headspace](https://www.shadcn.io/design/headspace) and [Notion](https://www.shadcn.io/design/notion)

### Computed palettes (ratio = contrast against the background shown)

**Palette A: "Oat & Sage" (RECOMMENDED)**
| Token | Hex | Use | Contrast |
|---|---|---|---|
| canvas | #FAF7F2 | page background | n/a |
| surface | #FFFFFF | cards | n/a |
| surface-sunken | #F3EFE7 | inputs, wells | ink 12.51, ink-soft 5.89 |
| ink | #2B2A27 | headings and body | 13.43 on canvas |
| ink-soft | #5F5B53 | secondary text | 6.32 on canvas, 6.76 on white |
| ink-muted | #8A857B | placeholder / disabled only | 3.43 (large text or disabled only) |
| hairline | #E8E2D8 | card borders (decorative) | 1.21 |
| border-strong | #D6CFC3 / #B3AB9C | dividers, input borders | 1.45 / 2.13 (pair with a focus ring) |
| primary (sage) | #4F7A63 | primary button fill, links | white text 4.89, on canvas 4.57 |
| primary-hover | #3F6B55 | hover / pressed | white text 6.09 |
| Subject 1 Sage | tint #E3EFE6 / text #2F5A44 / dot #5E8C72 | subject card, chip, dot | text 6.66, dot 3.59 on canvas |
| Subject 2 Lavender | tint #ECE8F7 / text #4B3F86 / dot #7E6FC4 | subject card, chip, dot | text 7.41, dot 3.96 |
| Subject 3 Peach | tint #FDE9DD / text #8A4A26 / dot #C9774C | subject card, chip, dot | text 5.79, dot 3.16 |
| Info (sky) | tint #E3EEF8 / text #2C5577 / dot #4F86B8 | tips, info, 4th subject | text 6.68, dot 3.62 |
| Warning (amber) | tint #FEF3DC or #FFF4E5 / text #7A5300 or #8A5300 | "due soon", low time | 6.22 / 5.82 |
| Error (soft rose) | tint #FDE7E4 / text #9A3B33 | validation only | 5.82 |

Notes: the lighter pastel "mid" dots (#7FA88F 2.49, #9C8FD6 2.69, #E49B73 2.13, #6F9FCB 2.62) **fail 3:1** as standalone icons or chart marks on the canvas. Use the deeper dot values above. Amber #B4690E reaches only 3.96 on the canvas (large text only). #9A5B0B (5.07) is safe for amber text. #78716A on the canvas lands on the 4.5 border and should be avoided.

**Palette B: "Cream & Lavender"** (calmer and more "wellness"; primary is violet)
- canvas #FBF8F3, ink #2E2B3A (13.02), ink-soft #6E6878 (5.06)
- primary #6B57C9 (on canvas 5.17, white on it 5.48), hover #5B48B8 (white 6.85)
- Subject tints: reuse lavender #F1EEFB / #4B3F86 (7.8), sky #EAF3FB / #2C5577 (7.0), peach #FFF1EA / #8A4A26 (6.16)

**Palette C: "Linen & Sky"** (cooler and more "productivity")
- canvas #F7F5F0, ink #1F2A37 (13.34), ink-soft #5B6B7C (5.02)
- primary #3A6EA5 (on canvas 4.88, white on it 5.31), success/sage text #2F6B57 (5.73)

### Inferences
- Palette A fits ExamPilot best. Sage as the primary colour sits in the low-arousal green/blue zone (see Q3) and reads as "progress" and "growth" without the "error" connotation of red. Sage, lavender and peach are evenly spaced hues, so they stay distinguishable for colour-vision-deficient users when paired with labels or icons. Sky is left free as a fourth subject or the info colour.
- Rule of thumb: pastel tint (about 90–95% lightness) for fills, deep shade of the same hue (about 30–40% lightness) for text on that tint, mid shade only for large marks with at least 3:1 contrast.
- Tailwind: define these as custom tokens in `theme.extend.colors` (or `@theme` in Tailwind v4), for example `canvas`, `ink`, and `sage-50/600/700`. Don't rely on the default `stone-50` (#fafaf9), which is close to neutral rather than warm.

### Gaps
- No user testing data exists for these exact palettes. The values are computed for contrast and rest on design reasoning.
- Colour-blindness simulation (for example deuteranopia separation between sage and peach) was not run.

## Q3. What does research and credible design writing say about colour and anxiety? How should warnings look without causing stress?

### Takeaway
The strongest controlled evidence (Wilms & Oberfeld 2018) shows that **saturation and brightness drive arousal more than hue does**. Among hues, red is the most arousing and blue the least, but only at medium or high saturation. The famous "seeing red hurts exam performance" finding (Elliot et al. 2007) has **not held up well** in a 2020 meta-analysis. Still, red keeps its cultural "mistake" association in schools. So the practical guidance is to use low-saturation pastels, show warnings in amber or peach tints with dark text plus an icon and plain wording, and keep red for true destructive errors only.

### Cited Findings
- **Wilms & Oberfeld 2018** (N=62, 27 colours, with hue, saturation and brightness controlled independently, plus physiological measures): saturation had the strongest effect on arousal. Arousal rose blue → green → red, but only at medium and high saturation. At low saturation, hue made little difference. Saturated and bright colours produced larger skin-conductance responses. A highly saturated blue can be more arousing than a dim red. — [Wilms & Oberfeld 2018, Psychological Research (PDF)](https://www.staff.uni-mainz.de/oberfeld/downloads/Wilms-Oberfeld2018_Article_ColorAndEmotionEffectsOfHueSat.pdf); [PubMed 28612080](https://pubmed.ncbi.nlm.nih.gov/28612080/)
- **Elliot, Maier, Moller, Friedman & Meinhardt 2007** (J. Exp. Psych: General): across four experiments, brief exposure to red before an IQ test or exam impaired performance. Two more experiments linked red to avoidance motivation, such as choosing easier questions. The authors attribute this to red's association with marked mistakes and say "care must be taken in how red is used in achievement contexts." — [ScienceDaily summary, Univ. of Rochester](https://sciencedaily.com/releases/2007/02/070228170240.htm)
- **Contradicting evidence, Gnambs 2020 meta-analysis** (22 publications, 38 samples): no significant effect on anagram (d=-0.06) or knowledge tests (d=-0.04). There was a small effect on reasoning tests (d=-0.34), but no evidential value remained after correcting for publication bias, and close replications failed. The paper finds "little evidence for a robust color-priming effect in achievement situations." — [Gnambs 2020, Psychonomic Bulletin & Review](https://link.springer.com/article/10.3758/s13423-020-01772-1)
- **Calm Technology principles** (Amber Case / Calm Tech Institute) include "Require the smallest possible amount of attention," "Inform and create calm," "Make use of the periphery," and "Communicate without speaking." — [Calm Tech Institute](https://calmtech.institute/calm-tech-principles)
- **NN/g on errors:** show errors close to their source, use "noticeable, redundant, and accessible indicators," avoid showing them too early, and scale visibility to the impact of the error. — [NN/g video: error message visibility](https://www.nngroup.com/videos/error-message-visibility/)
- **How reference apps soften semantic colours:** Calm's product UI uses warning #ffba43 and a coral danger #ff6b6b instead of pure red. Duolingo uses a warm cream warning background #fff4dd with orange #ff9600. — [Calm design.md](https://www.webdesignhot.com/design.md/calm/); [Duolingo design.md](https://www.webdesignhot.com/design.md/duolingo/)

### Inferences
- Low saturation matters more than which hue you pick. Pastel fills with deep text keep arousal low whatever the hue.
- Warnings ("exam in 3 days," "behind schedule"): amber/peach tint background (#FEF3DC), dark amber text (#7A5300), a rounded info or clock icon (not a triangle "!"), and supportive wording ("3 days to go, here's a light plan" instead of "Overdue!"). No pulsing, no red badges, no counters on the warning itself.
- Errors: limit to form validation and destructive confirmations. Use a soft rose tint (#FDE7E4) with #9A3B33 text, always paired with an icon and text so colour is not the only cue.
- Don't mark wrong quiz answers with saturated red fills. Use a rose tint, an outline and an explanation. Correct answers can get a sage tint. The Elliot effect is contested, but red's cultural "mark of failure" meaning is uncontested, and avoiding it costs nothing.
- Following the calm-technology principles, put status items (streaks, countdown) in peripheral, low-contrast chips rather than alarm banners.

### Gaps
- I found no rigorous study specifically on lavender, peach or sage in digital UIs and anxiety. Claims in popular articles (Livingetc, Homes & Gardens) are interior-design opinion and were not used.
- I did not reach NN/g's or Smashing Magazine's writing on colour psychology directly. The Valdez & Mehrabian 1994 abstract was blocked by a captcha.

## Q4. Which free Google Fonts pairings feel friendly but stay highly readable? What about Lexend research?

### Takeaway
Reference apps use humanist or rounded sans-serifs: Calm uses **Figtree**, and Duolingo falls back to **Lexend Deca**. Lexend has a small, vendor-reported study showing a reading-fluency gain. It is promising but not strong enough evidence to make it the only body font. A sound choice is a friendly geometric or humanist sans for UI (Plus Jakarta Sans, DM Sans, Figtree, or Lexend), with an optional soft display face for headings.

### Cited Findings
- Calm's whole web type system uses **Figtree** (weights 400/500/700, 13.5–49.5px across 13 levels). — [shadcn.io Calm](https://www.shadcn.io/design/calm)
- Duolingo's body font stack includes **Lexend Deca**, which is also the fallback for its rounded display face. Its type scale is 88/72/56/40/32/24/20 for display and 18/16/14/13/12 for body and UI. — [webdesignhot Duolingo](https://www.webdesignhot.com/design.md/duolingo/)
- **Lexend's own claims:** the font was based on Bonnie Shaver-Troup's theory (2000) of sans-serif letterforms with expanded scaling and character spacing to reduce crowding. In the study it reports, **20 third-graders** read 16pt text two grade levels above their level. **17 of 19** scored better with Lexend than with Times New Roman, with average WCPM rising from **110 to 128 (+19.8%)** and **p = 0.014**. The site admits "no one setting worked best for all students." — [lexend.com](https://www.lexend.com/)
- Commentary repeats the p = 0.014 WCPM result and Shaver-Troup's doctoral work on second-grade oral fluency. It quotes a W3C literacy expert saying there is little evidence that special fonts speed up reading. The publisher has a commercial interest in Lexend. — [Teleprompter.com](https://teleprompter.com/blog/effectiveness-of-lexend-and-opendyslexic-fonts)
- Type designers on TypeDrawers debated the "empirically shown" claim. — [TypeDrawers thread](https://typedrawers.com/discussion/comment/43210/)

### Inferences (recommended pairings, all free on Google Fonts)
1. **Recommended: Plus Jakarta Sans (headings 600–700) + Lexend (body and UI 400/500).** Friendly geometric headings with readability-focused body text. Lexend runs wide, so allow slightly smaller sizes or tighter containers.
2. **Fraunces (soft, "SOFT"/"WONK" axes, used only for big display headings, 600) + DM Sans or Figtree (UI).** Warmer and more editorial. Keep Fraunces to H1/H2.
3. **Nunito (rounded, very friendly) for headings + Inter or DM Sans for body.** Nunito's rounded terminals suit a "friendly" feel but get juvenile at small sizes, so keep body text in a neutral sans.
4. **Outfit + DM Sans** for a crisp, modern but soft look.
- Load at most 2 families and 3–4 weights via `<link>` with `display=swap`, and set them in `theme.extend.fontFamily` (`font-display`, `font-sans`).
- Possible feature: a settings toggle for "readability mode" (Lexend at wider letter-spacing), following Lexend's note that no one setting works for everyone.

### Gaps
- The Google Fonts specimen pages for Nunito, DM Sans, Plus Jakarta Sans, Outfit and Fraunces were not fetched. The descriptions of their character (rounded terminals, soft axes) come from general typographic knowledge and should be checked.
- No independent peer-reviewed replication of the Lexend study was found. The sample is tiny (n=20) and children-only.

## Q5. Spacing, line-height, type scale, radius and shadow specs for a calm, uncluttered feel; avoiding heavy gradients

### Takeaway
Reference systems converge on a **4px base spacing scale**, **24px card padding**, **16–24px card radii**, a 16px body font, and shadows at **6–10% black opacity with large blur**, often replaced by warm 1px hairlines. Gradients appear only on brand accents (Calm), never on working UI surfaces.

### Cited Findings
- Duolingo uses spacing of 0/4/8/12/16/20/24/32/40/48/64/80/96, 24px card padding and 64px between content blocks. Shadows: card `0 2px 8px rgba(0,0,0,.06)`, hover `0 4px 16px rgba(0,0,0,.10)`, toast `0 8px 24px rgba(0,0,0,.12)`, modal `0 16px 48px rgba(0,0,0,.20)`. — [Duolingo design.md](https://www.webdesignhot.com/design.md/duolingo/)
- Headspace uses a 4/8/24/32/48 spacing base and radii of 16 (cards), 24 (feature), 32 (pills). — [Headspace DESIGN.md](https://www.shadcn.io/design/headspace)
- Calm uses a 20px base radius and pill CTAs, with spacing anchored at 8/12/20/40. The gradient is limited to brand and primary elements. — [Calm DESIGN.md](https://www.shadcn.io/design/calm)
- Notion uses almost no shadows (one 24px diffuse shadow on the hero) and relies on warm hairlines (#e5e3df) and pastel fills for structure. — [Notion DESIGN.md](https://www.shadcn.io/design/notion)
- Calm Technology principle: "Require the smallest possible amount of attention." — [Calm Tech Institute](https://calmtech.institute/calm-tech-principles)

### Inferences (buildable spec for Tailwind)
- **Spacing:** Tailwind's default 4px scale. Card padding `p-6` (24px), or `p-5` on mobile. Gaps between cards `gap-4`/`gap-6`. Gap between sections `space-y-12`/`py-16` (48–64px). Page max width `max-w-5xl` for the dashboard and `max-w-2xl` (about 65ch) for reading or quiz screens.
- **Type scale (px / line-height):** 12/16 caption · 14/20 small · **16/26 body (leading about 1.6)** · 18/28 lead · 20/28 H4 · 24/32 H3 · 30/38 H2 · 36/44 H1 (display up to 48/56). Headings use `tracking-tight` and weight 600–700. Body is 400, labels 500. Avoid all-caps, or limit it to tiny overline labels with `tracking-wide`.
- **Radius:** `rounded-xl` (12px) inputs and small chips · `rounded-2xl` (16px) buttons and list cards · **`rounded-[20px]`/`rounded-3xl` (24px) primary cards and modals** · `rounded-full` pills and progress bars. Keep radii nested consistently (inner radius = outer radius − padding).
- **Shadows (custom `boxShadow` tokens, warm-tinted):**
  - `soft`: `0 1px 2px rgba(43,42,39,0.04), 0 2px 8px rgba(43,42,39,0.06)` for resting cards
  - `lift`: `0 4px 16px rgba(43,42,39,0.08)` for hover and draggable items
  - `float`: `0 12px 32px rgba(43,42,39,0.12)` for modals and popovers
  - Prefer `border border-[#E8E2D8]` with `shadow-soft`, or the border alone, for dense lists.
- **Gradients:** none on cards or backgrounds. At most a very subtle two-stop wash of the same hue (for example #FAF7F2 → #F3EFE7) in the hero or empty-state illustration. No multi-hue or neon gradients, and no glassmorphism blur on working surfaces.
- **Density:** one primary action per card, at most 3–4 cards above the fold on the dashboard, generous whitespace, and progress shown with thin rounded bars (`h-2 rounded-full`) in subject tints instead of red/green gauges.
- **Motion:** 150–250ms ease-out transitions, and honour `prefers-reduced-motion`. This is a design inference, not cited.

### Gaps
- I found no empirical study that ties specific radius values or shadow opacities to lower anxiety. These specs come from reference-app convergence and design reasoning.

## Q6. Dribbble/Behance/Mobbin study-planner shots with warm, pastel styling: common traits

### Takeaway
Searches turned up a few study-planner concepts (Contra, Lovable templates, Goodnotes pastel planners), but I could not fetch and verify their visual details. No cited trait summary is possible from this round.

### Cited Findings
- Examples of pastel study and productivity planner products and concepts exist: an "AI Study Planner Mobile App" concept on Contra, a Lovable "study planner" template, and pastel productivity planners on the Goodnotes marketplace. Their visual specifics were not verified. — [Contra: AI Study Planner](https://contra.com/p/AbPboPvP-ai-study-planner-mobile-app); [Lovable study planner template](https://lovable.dev/templates/apps/education/study-planner); [Goodnotes Pastel Productivity Planner](https://marketplace.goodnotes.com/en/product/64f9a0db5de9efc2774c3f2c)

### Inferences
- Based on the verified references above (Notion pastel tints, Headspace warm canvas, Duolingo semantic tints), shots in this genre probably share: colour-coded subject cards in pastel tints, large rounded cards (16–24px), a weekly calendar strip, circular or bar progress indicators, mascots or illustrations, and generous whitespace. **This is unverified for Dribbble/Behance specifically.**

### Gaps
- Dribbble, Behance and Mobbin pages were not fetched (Mobbin needs login, and Dribbble search results returned profile pages, not shots). The report writer should not present specific Dribbble trends as sourced.
