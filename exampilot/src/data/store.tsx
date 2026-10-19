import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { State, Subject, Exam } from "./types";
import { todayISO } from "../lib/dates";
import subjectsSeed from "./seed/subjects.json";
import examsSeed from "./seed/exams.json";
import tasksSeed from "./seed/daily-tasks.json";
import sessionsSeed from "./seed/study-sessions.json";
import questionsSeed from "./seed/questions.json";
import materialsSeed from "./seed/materials.json";

const KEY = "exampilot:v1";

function seed(): State {
  return {
    splashSeen: false,
    signedIn: false,
    onboarded: false,
    tasksEdited: false,
    profile: { firstName: "", surname: "", email: "" },
    exams: examsSeed.exams.map((e) => ({
      ...e,
      source: "preloaded" as const,
    })) as Exam[],
    subjects: subjectsSeed.subjects.map((s) => ({
      ...s,
      isSample: true,
    })) as Subject[],
    tasks: tasksSeed.tasks.map((t) => ({
      ...t,
      date: todayISO(),
      isSample: true,
    })),
    sessions: sessionsSeed.sessions.map((s, i) => ({
      ...s,
      id: "s" + i,
      source: "plan" as const,
    })),
    questions: questionsSeed.questions.map((q) => ({ ...q, isSample: true })),
    materials: materialsSeed.materials.map((m) => ({
      ...m,
      isSample: true,
    })) as State["materials"],
    pdf: {},
    chat: [],
  };
}

function load(): State {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { ...seed(), ...JSON.parse(raw) };
  } catch {
    /* storage unavailable */
  }
  return seed();
}

interface Ctx {
  state: State;
  update: (fn: (s: State) => State) => void;
  reset: () => void;
}
const C = createContext<Ctx>(null as never);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(load);
  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [state]);
  const value = useMemo<Ctx>(
    () => ({
      state,
      update: (fn) => setState(fn),
      reset: () => {
        try {
          localStorage.removeItem(KEY);
        } catch {
          /* ignore */
        }
        setState(seed());
      },
    }),
    [state],
  );
  return <C.Provider value={value}>{children}</C.Provider>;
}
export const useStore = () => useContext(C);
export const useSubject = (id: string) =>
  useStore().state.subjects.find((s) => s.id === id);
