# Backend & AI

Summary of `research/ai-and-backend-report.md` (researched 18 Oct 2026 — re-check prices and limits before launch).

## Architecture
```
React app ──(Firebase ID token)──► Cloudflare Worker  /api/ai/*
   │                                   ├─ verifies token, per-student daily cap
   │                                   ├─ Gemini API (primary)
   │                                   └─ Groq (fallback) → Workers AI / OpenRouter
   ├─► Firebase Auth (email/password + Google)
   └─► Firestore (data)      PDFs on device (IndexedDB) in v1
```
API keys live only in the Worker. Gemini quotas are per project, so every student shares one pool — cap per student.

## Login
- **Firebase Auth** on the free Spark plan (50K monthly users). Email/password with verification + reset; Google sign-in via Google's official button.
- Expo later: `@react-native-google-signin/google-signin` needs a development build (not Expo Go).
- Runner-up Supabase: free projects pause after 1 week idle, built-in email sender ~2 emails/hour, `supabase.co` was blocked by some Indian ISPs (24 Feb–3 Mar 2026).

## AI study assistant
| Use | Model | Mode |
|---|---|---|
| Chat replies | Gemini Flash-Lite | streaming text |
| Plans + charts | Gemini Flash | non-streaming, JSON schema (`study_plan`, `chart`), validated in the Worker |
| Chat with my PDF | Gemini Flash (native PDF input, ≤ 1,000 pages / 50 MB, ~258 tokens/page) | answer with page citations |
| Fallback | Groq (gpt-oss-120b / qwen) | strict JSON (not while streaming) |

**Use Gemini's paid tier with a low monthly cap from day one**, because the free tier:
- may use prompts for training and allow human review (Google says not to send personal data),
- no longer publishes its limits,
- is barred for users under 18 / apps likely used by them, and for EEA/UK/CH users.
Estimated paid cost: ≈ $0.001 per chat turn (estimate, not a quoted price).

### Endpoints (suggested)
- `POST /api/ai/chat` → streamed text (context: today's plan, subjects, selected material ids)
- `POST /api/ai/plan` → `StudyPlanBlock` (+ optional `ChartBlock`)
- `POST /api/ai/quiz` → `{ questions: [{ q, options, answer, explanation }] }`
- `POST /api/ai/admit-card` → `{ exams: [...] }` (schema without personal fields)

## NotebookLM
- Renamed **Gemini Notebook** (16 Jul 2026). No public API for the consumer product; cannot embed or open with sources.
- Enterprise API: preview, ≥ 15 paid seats, company identity sign-in, no chat endpoint — not usable for a consumer app.
- Unofficial cookie-based libraries → collecting users' Google sessions → **don't**.
- **Do:** build "chat with my notes" on Gemini PDF input with page citations; flashcards/quizzes as JSON; optional "Open in NotebookLM" link only.
- Later: page-level retrieval (pdf.js text → embeddings → pgvector or Firestore vector search) for exact clickable citations.

## Admit-card pipeline
1. Consent notice + age question.
2. Text PDF → `pdf.js getTextContent()` on device; strip personal lines; send text only.
3. Scanned PDF / photo → upright, ~2000px image → Worker → Gemini Flash-Lite (paid) with a schema that **omits name, photo, roll/enrolment numbers**.
4. Code checks: DD/MM parsing, printed weekday matches date, end after start, duplicates, clashes, FN/AN/Morning/Afternoon labels.
5. Review screen: editable rows, raw text shown, uncertain rows flagged amber; save disabled until fixed.
6. Save exam rows → build plan → **delete the file**; keep a minimal "processed and deleted" log.
7. Offline fallback: Tesseract.js for images.
8. Build a test set of 20–50 real hall tickets to measure accuracy (no public benchmark exists).
Estimated cost ≈ ₹0.1 per card on paid Flash-Lite (estimate).

## Libraries
react-pdf (MIT) + react-pdf-highlighter-extended for highlights; Recharts for charts (Victory Native XL on Expo); Motion; canvas-confetti; Lottie optional.

## Open decisions for you
- Under-18 students: an 18+ gate, parental consent, or a non-Gemini route for minors.
- When to switch Gemini billing on (recommended: before any real student uses it).
- Firebase Storage needs the Blaze plan — keep PDFs on device until then.
- Groq's published limits are ambiguous between its Free and Developer plans — verify in your console.
- Short legal review of DPDP erasure timelines and log retention before May 2027.
