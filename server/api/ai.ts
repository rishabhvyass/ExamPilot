// ExamPilot AI proxy (Vercel Function). The app never sees the Gemini key.
//
// Env: GEMINI_API_KEY (required), GEMINI_MODEL (default gemini-3.8-flash),
//      APP_TOKEN (optional shared secret the app sends as x-app-token).
//
// POST { task: "chat", messages: [{ role, text }], context }  → { text, plan?, chart? }
// POST { task: "admit", text?: string, image?: { mimeType, data } } → { exams, undated }

declare const process: { env: Record<string, string | undefined> };

const MODEL = process.env.GEMINI_MODEL || 'gemini-3.8-flash';
const MAX_BODY = 6_000_000; // ~4.5 MB image after base64

type Msg = { role: 'user' | 'assistant'; text: string };

const CHAT_SCHEMA = {
  type: 'OBJECT',
  properties: {
    text: { type: 'STRING', description: 'Reply shown in the chat bubble. Plain text, short paragraphs.' },
    plan: {
      type: 'OBJECT',
      nullable: true,
      description: 'Only when the student asks for a plan/schedule.',
      properties: {
        title: { type: 'STRING' },
        subjectCode: { type: 'STRING', description: 'One of the subject codes from context.' },
        sessions: {
          type: 'ARRAY',
          items: {
            type: 'OBJECT',
            properties: {
              date: { type: 'STRING', description: 'YYYY-MM-DD, today or later, before the exam.' },
              topic: { type: 'STRING' },
              hours: { type: 'NUMBER' },
            },
            required: ['date', 'topic', 'hours'],
          },
        },
      },
      required: ['title', 'subjectCode', 'sessions'],
    },
    chart: {
      type: 'OBJECT',
      nullable: true,
      description: 'Only when the student asks for a chart.',
      properties: {
        title: { type: 'STRING' },
        unit: { type: 'STRING' },
        data: {
          type: 'ARRAY',
          items: {
            type: 'OBJECT',
            properties: { label: { type: 'STRING' }, value: { type: 'NUMBER' } },
            required: ['label', 'value'],
          },
        },
      },
      required: ['title', 'data'],
    },
  },
  required: ['text'],
};

const ADMIT_SCHEMA = {
  type: 'OBJECT',
  properties: {
    exams: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          name: { type: 'STRING', description: 'Subject name exactly as printed, without the course code.' },
          date: { type: 'STRING', description: 'YYYY-MM-DD' },
          time: { type: 'STRING', description: 'Start time, 24h HH:mm' },
        },
        required: ['name', 'date', 'time'],
      },
    },
    undated: { type: 'ARRAY', items: { type: 'STRING' }, description: 'Subjects listed without a date (e.g. practicals).' },
  },
  required: ['exams', 'undated'],
};

const CHAT_SYSTEM = `You are Pilo, the calm study assistant inside ExamPilot, an exam-week planner for college students.
- Use ONLY the student's own data in the context (exams, subjects, topics, questions, sessions). Never invent exams, dates or files.
- Be brief, warm and practical. No streaks, no pressure, no exclamation-heavy hype.
- For plans: only dates from today up to the day before the exam, lighter load the evening before an exam, 1–2.5 hours per session. Fill "plan".
- For charts: use real numbers from the context (e.g. planned hours per subject). Fill "chart".
- When quizzing, ask one question at a time and wait for the answer.
- If information is missing (no exams yet, no topics), say what to add in the app.`;

const ADMIT_SYSTEM = `You read university admit cards / exam timetables. Extract every exam row that has a printed date.
Ignore issue/printed/generated dates, date of birth and reporting times. Convert dates to YYYY-MM-DD (day-first for Indian formats like 21-10-2026) and start times to 24-hour HH:mm. Rows with no date go in "undated". Return no personal details.`;

async function gemini(body: unknown) {
  const r = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
    {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-goog-api-key': process.env.GEMINI_API_KEY ?? '',
      },
      body: JSON.stringify(body),
    },
  );
  const data = (await r.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
    promptFeedback?: { blockReason?: string };
    error?: { message?: string };
  };
  if (!r.ok) throw new Error(data.error?.message ?? `Gemini error ${r.status}`);
  if (data.promptFeedback?.blockReason) throw new Error('That request was blocked.');
  const text = data.candidates?.[0]?.content?.parts?.map(p => p.text ?? '').join('') ?? '';
  return JSON.parse(text);
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });

export async function POST(request: Request) {
  if (process.env.APP_TOKEN && request.headers.get('x-app-token') !== process.env.APP_TOKEN)
    return json({ error: 'Unauthorized' }, 401);
  if (!process.env.GEMINI_API_KEY) return json({ error: 'Server has no GEMINI_API_KEY.' }, 500);
  const raw = await request.text();
  if (raw.length > MAX_BODY) return json({ error: 'Request too large.' }, 413);
  let body: {
    task?: string;
    messages?: Msg[];
    context?: unknown;
    text?: string;
    image?: { mimeType: string; data: string };
  };
  try {
    body = JSON.parse(raw);
  } catch {
    return json({ error: 'Bad JSON.' }, 400);
  }
  try {
    if (body.task === 'chat') {
      const history = (body.messages ?? []).slice(-12).map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: String(m.text ?? '').slice(0, 4000) }],
      }));
      if (!history.length) return json({ error: 'No messages.' }, 400);
      return json(
        await gemini({
          systemInstruction: {
            parts: [{ text: `${CHAT_SYSTEM}\n\nStudent context (JSON):\n${JSON.stringify(body.context ?? {}).slice(0, 20000)}` }],
          },
          contents: history,
          generationConfig: { responseMimeType: 'application/json', responseSchema: CHAT_SCHEMA, temperature: 0.4 },
        }),
      );
    }
    if (body.task === 'admit') {
      const parts: object[] = [{ text: 'Extract the exam timetable from this admit card.' }];
      if (body.text) parts.push({ text: String(body.text).slice(0, 30000) });
      if (body.image) parts.push({ inline_data: { mime_type: body.image.mimeType, data: body.image.data } });
      if (parts.length === 1) return json({ error: 'Send text or an image.' }, 400);
      return json(
        await gemini({
          systemInstruction: { parts: [{ text: ADMIT_SYSTEM }] },
          contents: [{ role: 'user', parts }],
          generationConfig: { responseMimeType: 'application/json', responseSchema: ADMIT_SCHEMA, temperature: 0 },
        }),
      );
    }
    return json({ error: 'Unknown task.' }, 400);
  } catch (e) {
    return json({ error: (e as Error).message }, 502);
  }
}
