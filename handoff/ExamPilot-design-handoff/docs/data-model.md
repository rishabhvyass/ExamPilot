# Data model & storage

## Types (TypeScript)
```ts
export type SubjectId = 'se' | 'daa' | 'dds' | string;
export type SubjectColor = 'se' | 'daa' | 'dds';           // maps to token palettes

export interface Profile {
  uid: string; firstName: string; surname: string; email: string;
  college?: string; semester?: number; createdAt: string;
  onboarding: { detailsDone: boolean; admitCardDone: boolean; planDone: boolean };
}

export interface Exam {
  id: string; subjectId: SubjectId; title: string;
  date: string;   // 'YYYY-MM-DD' (local, IST)
  time: string;   // 'HH:mm' 24h
  source: 'preloaded' | 'admit-card' | 'manual';
}

export interface Topic { id: string; name: string; done: boolean; doneAt?: string; }

export interface Subject {
  id: SubjectId; code: string; name: string; color: SubjectColor;
  description?: string; topics: Topic[]; isSample: boolean;
}

export interface DailyTask {
  id: string; date: string; title: string; subjectId: SubjectId;
  minutes: number; done: boolean; isSample: boolean;
}

export interface StudySession {
  id: string; date: string; start: string; end: string;     // 'HH:mm'
  subjectId: SubjectId; title: string; source: 'plan' | 'manual' | 'assistant';
}

export interface Question {
  id: string; subjectId: SubjectId; question: string; answer: string;
  revised: boolean; isSample: boolean;
}

export type MaterialType = 'pdf' | 'image' | 'link' | 'note';
export interface Material {
  id: string; subjectId: SubjectId; type: MaterialType; name: string;
  // pdf/image: blob kept on device (IndexedDB key = id); only metadata synced
  pages?: number; sizeKb?: number; url?: string; body?: string; updatedAt: string;
}

export interface PdfProgress { materialId: string; page: number; pages: number; highlights: { page: number; text: string }[]; finishedAt?: string; }

export interface ChatMessage {
  id: string; role: 'user' | 'assistant'; createdAt: string;
  text?: string;
  block?: StudyPlanBlock | ChartBlock;
  sources?: { materialId: string; pages: string }[];
}
export interface StudyPlanBlock { type: 'study_plan'; subjectId?: SubjectId; title: string; sessions: { date: string; topic: string; hours: number }[]; note?: string; }
export interface ChartBlock { type: 'chart'; kind: 'bar' | 'line'; title: string; unit?: string; data: { label: string; subjectId?: SubjectId; value: number }[]; }
```
Shapes for AI blocks and admit-card extraction: `sample-data/ai-plan-example.json`, `sample-data/admit-card-extraction-example.json`.

## Storage phases
| Phase | Where | What |
|---|---|---|
| v1 (no login) | `localStorage` key `exampilot:v1` (JSON), IndexedDB store `exampilot-files` | All app state; PDF/image blobs in IndexedDB. Never put files in localStorage (~5 MB, strings only). |
| v2 (login) | Firestore `users/{uid}/…` | `profile`, `exams`, `subjects`, `tasks`, `sessions`, `questions`, `materials` (metadata), `pdfProgress`, `chats`. On first login copy local data up once. |
| v3 | Firebase Storage (Blaze plan) | Optional cloud copies of PDFs. |

Firestore free (Spark) limits: 1 GiB stored, 50K reads / 20K writes / 20K deletes per day — fine for an MVP. Batch writes for checklist toggles (debounce ~400 ms).

## Storage module
Expose one interface so screens never touch the backend directly:
```ts
interface Store {
  get<T>(key: string): Promise<T | undefined>;
  set<T>(key: string, value: T): Promise<void>;
  subscribe<T>(key: string, cb: (v: T) => void): () => void;
}
```
`LocalStore` (localStorage + IndexedDB) now, `FirestoreStore` later.

## Dates
- Store dates as `YYYY-MM-DD` and times as `HH:mm` in IST; compute "days to prepare" from local midnight to exam date.
- Never parse admit-card dates with `new Date(str)` (US order). Parse DD/MM explicitly and check the printed weekday.

## Seeding
On first run load `sample-data/*.json`; mark everything except the three exams as `isSample: true`. Clear the flag when the student edits an item.

## Privacy
- Admit cards: extract → confirm → delete file. Store only exam rows.
- Do not store photos, roll numbers or enrolment numbers.
- India's DPDP Act duties (notice, security, erasure, children) apply from 13 May 2027; users under 18 need verifiable parental consent. Plan for it now (see `docs/backend-and-ai.md`).
