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
import type { State, Subject, Exam } from './types';
import { todayISO } from '../lib/dates';
import { signOut as authSignOut, watchAuth, type User } from './auth';
import { createSync, loadUser, migrate } from './cloud';
import subjectsSeed from './seed/subjects.json';
import examsSeed from './seed/exams.json';
import tasksSeed from './seed/daily-tasks.json';
import sessionsSeed from './seed/study-sessions.json';
import questionsSeed from './seed/questions.json';
import materialsSeed from './seed/materials.json';

const KEY = 'exampilot:v1';

export function seed(): State {
  return {
    splashSeen: false,
    signedIn: false,
    onboarded: false,
    tasksEdited: false,
    profile: { firstName: '', surname: '', email: '' },
    exams: examsSeed.exams.map(e => ({
      ...e,
      source: 'preloaded' as const,
    })) as Exam[],
    subjects: subjectsSeed.subjects.map(s => ({
      ...s,
      isSample: true,
    })) as Subject[],
    tasks: tasksSeed.tasks.map(t => ({
      ...t,
      date: todayISO(),
      isSample: true,
    })),
    sessions: sessionsSeed.sessions.map((s, i) => ({
      ...s,
      id: 's' + i,
      source: 'plan' as const,
    })),
    questions: questionsSeed.questions.map(q => ({ ...q, isSample: true })),
    materials: materialsSeed.materials.map(m => ({
      ...m,
      isSample: true,
    })) as State['materials'],
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
        s = { ...remote, splashSeen: dev.splashSeen, signedIn: true };
      } else {
        s = {
          ...dev,
          signedIn: true,
          profile: { ...dev.profile, email: dev.profile.email || u.email || '' },
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
      .then(raw => (raw ? { ...seed(), ...JSON.parse(raw) } : seed()))
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
  if (!value) return <>{fallback ?? null}</>;
  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}
export const useStore = () => useContext(StoreCtx);
