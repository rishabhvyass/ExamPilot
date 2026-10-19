import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { State } from './types';
import { signOut as authSignOut, watchAuth, type User } from './auth';
import { createSync, loadUser, migrate } from './cloud';
import { registerSubjectColors } from '../theme';

const KEY = 'exampilot:v1';

export function seed(): State {
  return {
    splashSeen: false,
    signedIn: false,
    onboarded: false,
    tasksEdited: false,
    profile: { firstName: '', surname: '', email: '' },
    // Everything starts empty: exams and subjects come from the student's admit card.
    exams: [],
    subjects: [],
    tasks: [],
    sessions: [],
    questions: [],
    materials: [],
    pdf: {},
    chat: [],
  };
}

interface Ctx {
  state: State;
  update: (fn: (s: State) => State) => void;
  reset: () => void;
  /** Signed-in Firebase user, or null while using local storage. */
  user: User | null;
  /** Runs a sign-in call, then resolves once that user's data is loaded. */
  signIn: (run: () => Promise<{ user: User } | null>) => Promise<State | null>;
  signOut: () => Promise<void>;
}
const StoreCtx = createContext<Ctx>(null as never);

const signedOut = (): State => ({ ...seed(), splashSeen: true });

/** Drops the sample content earlier builds seeded (sample flags, preloaded exams, seeded sessions). */
const stripSamples = (s: State): State => ({
  ...s,
  exams: s.exams.filter(e => e.source !== 'preloaded'),
  subjects: s.subjects.filter(x => !x.isSample),
  tasks: s.tasks.filter(t => !t.isSample),
  sessions: s.sessions.filter(x => !/^s\d+$/.test(x.id)),
  questions: s.questions.filter(q => !q.isSample),
  materials: s.materials.filter(m => !m.isSample),
  // Canned replies from earlier builds pointed at sample files / sample subjects.
  chat: s.chat.filter(
    c =>
      c.source?.materialId !== 'm1' &&
      !['se', 'daa', 'dds'].includes(
        c.block?.type === 'study_plan' ? c.block.subjectId ?? '' : '',
      ),
  ),
});

/**
 * Signed out: AsyncStorage (device-local). Signed in: Firestore under users/{uid},
 * with the local data copied up once on first login.
 */
export function StoreProvider({
  children,
  fallback,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const [state, setState] = useState<State | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const local = useRef<State | null>(null);
  const sync = useRef<ReturnType<typeof createSync> | null>(null);
  const hydrating = useRef<{ uid: string; p: Promise<State> } | null>(null);
  const latest = useRef<State | null>(null);
  latest.current = state;
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const hydrate = useCallback((u: User): Promise<State> => {
    if (hydrating.current?.uid === u.uid) return hydrating.current.p;
    const p = (async () => {
      const dev = local.current ?? seed();
      const remote = await loadUser(u.uid);
      let s: State;
      if (remote) {
        s = stripSamples({
          ...remote,
          splashSeen: dev.splashSeen,
          signedIn: true,
        });
      } else {
        s = {
          ...dev,
          signedIn: true,
          profile: {
            ...dev.profile,
            email: dev.profile.email || u.email || '',
          },
        };
        await migrate(u.uid, s);
      }
      sync.current = createSync(u.uid, s);
      setUser(u);
      setState(s);
      return s;
    })();
    hydrating.current = { uid: u.uid, p };
    p.catch(() => {
      if (hydrating.current?.p === p) hydrating.current = null;
    });
    return p;
  }, []);

  useEffect(() => {
    let unsub: (() => void) | undefined;
    let alive = true;
    AsyncStorage.getItem(KEY)
      .then(raw =>
        raw ? stripSamples({ ...seed(), ...JSON.parse(raw) }) : seed(),
      )
      .catch(() => seed())
      .then((s: State) => {
        if (!alive) return;
        // Local data only ever belongs to a signed-out device.
        local.current = { ...s, signedIn: false };
        unsub = watchAuth(u => {
          if (u) {
            hydrate(u).catch(() => {
              // Couldn't load the cloud copy: fall back to Login rather than risk overwriting it.
              authSignOut().catch(() => {});
            });
            return;
          }
          hydrating.current = null;
          sync.current = null;
          setUser(null);
          setState(local.current ?? signedOut());
        });
      });
    return () => {
      alive = false;
      unsub?.();
    };
  }, [hydrate]);

  useEffect(() => {
    if (!state) return;
    clearTimeout(timer.current);
    timer.current = setTimeout(
      () => {
        if (sync.current) return sync.current.push(state);
        local.current = state;
        AsyncStorage.setItem(KEY, JSON.stringify(state)).catch(() => {});
      },
      user ? 400 : 300,
    );
  }, [state, user]);

  const value = useMemo<Ctx | null>(
    () =>
      state && {
        state,
        user,
        update: fn => setState(s => (s ? fn(s) : s)),
        reset: () => {
          if (!sync.current) AsyncStorage.removeItem(KEY).catch(() => {});
          setState({ ...seed(), signedIn: !!sync.current });
        },
        signIn: async run => {
          const cred = await run();
          return cred ? hydrate(cred.user) : null;
        },
        signOut: async () => {
          clearTimeout(timer.current);
          if (sync.current && latest.current) sync.current.push(latest.current);
          sync.current = null;
          // The next student on this device starts fresh; their data stays in the cloud.
          local.current = signedOut();
          await AsyncStorage.setItem(KEY, JSON.stringify(local.current)).catch(
            () => {},
          );
          await authSignOut();
        },
      },
    [state, user, hydrate],
  );
  // Subject colours are looked up by id across the app (colorOf); keep that map in step.
  if (state) registerSubjectColors(state.subjects);
  if (!value) return <>{fallback ?? null}</>;
  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}
export const useStore = () => useContext(StoreCtx);
