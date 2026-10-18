import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  serverTimestamp,
  writeBatch,
} from '@react-native-firebase/firestore';
import type { State } from './types';

/**
 * Firestore layout (docs/data-model.md, v2):
 *   users/{uid}                       { profile, onboarded, tasksEdited, createdAt, migratedAt }
 *   users/{uid}/{exams|subjects|tasks|sessions|questions|materials}/{id}
 *   users/{uid}/pdfProgress/{materialId}
 *   users/{uid}/chats/{id}
 * List items carry `order` so arrays come back in the order screens expect.
 */
const LISTS = [
  'exams',
  'subjects',
  'tasks',
  'sessions',
  'questions',
  'materials',
] as const;
const ROOT = '';
const BATCH_MAX = 450;

type Docs = Map<string, Record<string, unknown>>;

const db = () => getFirestore();
// Firestore rejects undefined fields; ids may hold characters doc ids can't.
const clean = <T>(v: T) => JSON.parse(JSON.stringify(v));
const enc = (id: string) => encodeURIComponent(id).replace(/\./g, '%2E');
const userRef = (uid: string) => doc(db(), 'users', uid);

function flatten(s: State): Docs {
  const out: Docs = new Map();
  out.set(
    ROOT,
    clean({
      profile: s.profile,
      onboarded: s.onboarded,
      tasksEdited: s.tasksEdited,
    }),
  );
  for (const k of LISTS)
    (s[k] as { id: string }[]).forEach((item, order) =>
      out.set(`${k}/${enc(item.id)}`, clean({ ...item, order })),
    );
  for (const [materialId, p] of Object.entries(s.pdf))
    out.set(`pdfProgress/${enc(materialId)}`, clean({ ...p, materialId }));
  s.chat.forEach((m, order) =>
    out.set(`chats/${enc(m.id)}`, clean({ ...m, order })),
  );
  return out;
}

async function commit(
  uid: string,
  sets: [string, Record<string, unknown>][],
  deletes: string[],
) {
  const ops = [
    ...sets.map(([path, data]) => ({ path, data })),
    ...deletes.map(path => ({ path, data: null })),
  ];
  for (let i = 0; i < ops.length; i += BATCH_MAX) {
    const batch = writeBatch(db());
    for (const { path, data } of ops.slice(i, i + BATCH_MAX)) {
      const ref = path === ROOT ? userRef(uid) : doc(userRef(uid), path);
      if (!data) batch.delete(ref);
      else if (path === ROOT) batch.set(ref, data, { merge: true });
      else batch.set(ref, data);
    }
    await batch.commit();
  }
}

/** Reads users/{uid}. Resolves null when the student has never synced. */
export async function loadUser(
  uid: string,
): Promise<Omit<State, 'splashSeen' | 'signedIn'> | null> {
  const root = await getDoc(userRef(uid));
  if (!root.exists()) return null;
  const r = root.data() as Partial<Pick<State, 'onboarded' | 'tasksEdited'>> & {
    profile?: Partial<State['profile']>;
  };
  const read = async (name: string) => {
    const snap = await getDocs(collection(userRef(uid), name));
    return snap.docs
      .map(d => d.data() as Record<string, unknown> & { order?: number })
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .map(({ order: _order, ...rest }) => rest);
  };
  const [exams, subjects, tasks, sessions, questions, materials, pdf, chat] =
    await Promise.all([...LISTS, 'pdfProgress', 'chats'].map(read));
  return {
    profile: { firstName: '', surname: '', email: '', ...r.profile },
    onboarded: !!r.onboarded,
    tasksEdited: !!r.tasksEdited,
    exams,
    subjects,
    tasks,
    sessions,
    questions,
    materials,
    pdf: Object.fromEntries(
      pdf.map(({ materialId, ...p }) => [materialId as string, p]),
    ),
    chat,
  } as unknown as Omit<State, 'splashSeen' | 'signedIn'>;
}

/** First login: copy the device's local data up once. */
export async function migrate(uid: string, s: State) {
  const docs = flatten(s);
  docs.set(ROOT, {
    ...docs.get(ROOT),
    createdAt: serverTimestamp(),
    migratedAt: serverTimestamp(),
  });
  await commit(uid, [...docs], []);
}

/** Write-through sync: each push writes only the docs that changed since the last one. */
export function createSync(uid: string, initial: State) {
  let prev = new Map([...flatten(initial)].map(([k, v]) => [k, JSON.stringify(v)]));
  return {
    push(s: State) {
      const next = flatten(s);
      const sets: [string, Record<string, unknown>][] = [];
      const seen = new Map<string, string>();
      for (const [path, data] of next) {
        const json = JSON.stringify(data);
        seen.set(path, json);
        if (prev.get(path) !== json) sets.push([path, data]);
      }
      const deletes = [...prev.keys()].filter(k => !seen.has(k));
      prev = seen;
      if (!sets.length && !deletes.length) return;
      // Firestore queues writes offline; the promise settles once the server acks.
      commit(uid, sets, deletes).catch(e =>
        console.warn('[cloud] sync failed', e),
      );
    },
  };
}
