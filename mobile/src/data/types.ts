export type SubjectId = string;
export type SubjectColor = 'se' | 'daa' | 'dds';
export interface Profile {
  firstName: string;
  surname: string;
  email: string;
  college?: string;
  semester?: number;
}
export interface Exam {
  id: string;
  subjectId: SubjectId;
  title: string;
  date: string;
  time: string;
  source: 'preloaded' | 'admit-card' | 'manual';
}
export interface Topic {
  id: string;
  name: string;
  done: boolean;
}
export interface Subject {
  id: SubjectId;
  code: string;
  name: string;
  color: SubjectColor;
  description?: string;
  topics: Topic[];
  isSample: boolean;
}
export interface DailyTask {
  id: string;
  date: string;
  title: string;
  subjectId: SubjectId;
  minutes: number;
  done: boolean;
  isSample: boolean;
}
export interface StudySession {
  id: string;
  date: string;
  start: string;
  end: string;
  subjectId: SubjectId;
  title: string;
  source: 'plan' | 'manual' | 'assistant';
}
export interface Question {
  id: string;
  subjectId: SubjectId;
  question: string;
  answer: string;
  revised: boolean;
  isSample: boolean;
}
export type MaterialType = 'pdf' | 'image' | 'link' | 'note';
export interface Material {
  id: string;
  subjectId: SubjectId;
  type: MaterialType;
  name: string;
  pages?: number;
  sizeKb?: number;
  count?: number;
  minutes?: number;
  body?: string;
  isSample: boolean;
}
export interface PdfProgress {
  page: number;
  finished?: boolean;
  highlights: Record<number, number[]>;
}
export interface StudyPlanBlock {
  type: 'study_plan';
  subjectId?: SubjectId;
  title: string;
  sessions: { date: string; topic: string; hours: number }[];
  note?: string;
}
export interface ChartBlock {
  type: 'chart';
  kind: 'bar';
  title: string;
  unit?: string;
  data: { label: string; subjectId?: SubjectId; value: number }[];
}
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text?: string;
  block?: StudyPlanBlock | ChartBlock;
  source?: { materialId: string; label: string; page: number };
  added?: boolean;
}
export interface State {
  splashSeen: boolean;
  signedIn: boolean;
  onboarded: boolean;
  profile: Profile;
  exams: Exam[];
  subjects: Subject[];
  tasks: DailyTask[];
  sessions: StudySession[];
  questions: Question[];
  materials: Material[];
  pdf: Record<string, PdfProgress>;
  chat: ChatMessage[];
  tasksEdited: boolean;
}
