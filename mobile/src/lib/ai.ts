// Client for the ExamPilot AI proxy (server/api/ai.ts → Gemini).
import ReactNativeBlobUtil from 'react-native-blob-util';
import { AI_TOKEN, AI_URL } from '../config/ai';
import type { ChatMessage, State } from '../data/types';
import { hours } from './plan';
import { todayISO } from './dates';
import type { ParsedExam } from './admitParser';

export const aiEnabled = !!AI_URL;

async function call<T>(body: object): Promise<T> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 45000);
  const headers: Record<string, string> = { 'content-type': 'application/json' };
  if (AI_TOKEN) headers['x-app-token'] = AI_TOKEN;
  try {
    const r = await fetch(AI_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
      signal: ctrl.signal,
    });
    const data = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(data.error ?? `AI error ${r.status}`);
    return data as T;
  } catch (e) {
    if ((e as Error).name === 'AbortError')
      throw new Error('The assistant took too long. Try again.');
    throw e;
  } finally {
    clearTimeout(t);
  }
}

/** Just what the model needs to answer about this student's week. */
const contextOf = (s: State) => {
  const code = (id: string) => s.subjects.find(x => x.id === id)?.code ?? '?';
  return {
    today: todayISO(),
    name: s.profile.firstName || undefined,
    exams: s.exams
      .filter(e => e.date >= todayISO())
      .map(e => ({ subject: code(e.subjectId), name: e.title, date: e.date, time: e.time })),
    subjects: s.subjects.map(x => ({
      code: x.code,
      name: x.name,
      topics: x.topics.map(t => ({ name: t.name, done: t.done })),
      plannedHours: +s.sessions
        .filter(y => y.subjectId === x.id && y.date >= todayISO())
        .reduce((a, y) => a + hours(y), 0)
        .toFixed(1),
      pdfs: s.materials.filter(m => m.subjectId === x.id && m.type === 'pdf').map(m => m.name),
    })),
    questions: s.questions.slice(0, 40).map(q => ({
      subject: code(q.subjectId),
      question: q.question,
      revised: q.revised,
    })),
    todayTasks: s.tasks
      .filter(t => t.date === todayISO())
      .map(t => ({ title: t.title, done: t.done })),
  };
};

type ChatReply = {
  text: string;
  plan?: { title: string; subjectCode: string; sessions: { date: string; topic: string; hours: number }[] } | null;
  chart?: { title: string; unit?: string; data: { label: string; value: number }[] } | null;
};

export async function askAssistant(
  s: State,
  history: ChatMessage[],
): Promise<Omit<ChatMessage, 'id' | 'role'>> {
  const r = await call<ChatReply>({
    task: 'chat',
    messages: history
      .filter(m => m.text)
      .map(m => ({ role: m.role, text: m.text })),
    context: contextOf(s),
  });
  const byCode = (c?: string) =>
    s.subjects.find(x => x.code.toLowerCase() === (c ?? '').toLowerCase())?.id;
  if (r.plan?.sessions?.length)
    return {
      text: r.text,
      block: {
        type: 'study_plan',
        subjectId: byCode(r.plan.subjectCode),
        title: r.plan.title,
        sessions: r.plan.sessions.filter(x => x.date >= todayISO()),
      },
    };
  if (r.chart?.data?.length)
    return {
      text: r.text,
      block: {
        type: 'chart',
        kind: 'bar',
        title: r.chart.title,
        unit: r.chart.unit,
        data: r.chart.data.map(d => ({ ...d, subjectId: byCode(d.label) })),
      },
    };
  return { text: r.text };
}

type AdmitReply = { exams: { name: string; date: string; time: string }[]; undated: string[] };
const tidyExams = (r: AdmitReply): { exams: ParsedExam[]; undated: string[] } => ({
  exams: (r.exams ?? []).filter(
    e => /^\d{4}-\d{2}-\d{2}$/.test(e.date) && e.name?.trim(),
  ).map(e => ({
    name: e.name.trim(),
    date: e.date,
    time: /^\d{2}:\d{2}$/.test(e.time) ? e.time : '10:00',
  })),
  undated: r.undated ?? [],
});

/** Fallback when on-device parsing finds nothing: send the text, or the photo itself. */
export async function readAdmitCardAI(
  input: { text: string } | { imageUri: string; mimeType?: string },
) {
  if ('text' in input)
    return tidyExams(await call<AdmitReply>({ task: 'admit', text: input.text }));
  const path = decodeURI(input.imageUri.replace(/^file:\/\//, ''));
  const data = await ReactNativeBlobUtil.fs.readFile(path, 'base64');
  if (data.length > 5_500_000)
    throw new Error('That photo is too large to send. Try a smaller or cropped photo.');
  return tidyExams(
    await call<AdmitReply>({
      task: 'admit',
      image: { mimeType: input.mimeType ?? 'image/jpeg', data },
    }),
  );
}
