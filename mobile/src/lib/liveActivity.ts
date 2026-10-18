// The exam countdown in the iPhone Dynamic Island and on the lock screen (iOS 16.2+ Live Activity).
// Native side: ios/ExamPilot/LiveActivityModule.swift + the ExamPilotWidget extension.
import { NativeModules, Platform } from 'react-native';

export type ExamActivity = {
  code: string;
  title: string;
  /** Local exam date (YYYY-MM-DD) and start time (HH:mm). */
  date: string;
  time: string;
  accent: string;
  topicsDone: number;
  topicsTotal: number;
};

type Native = {
  isSupported(): Promise<boolean>;
  isRunning(): Promise<boolean>;
  start(p: object): Promise<string>;
  update(p: object): Promise<boolean>;
  end(): Promise<boolean>;
};
const native: Native | undefined =
  Platform.OS === 'ios' ? NativeModules.LiveActivity : undefined;

const payload = (a: ExamActivity) => {
  const [y, m, d] = a.date.split('-').map(Number);
  const [h, min] = a.time.split(':').map(Number);
  return { ...a, examAt: new Date(y, m - 1, d, h, min).getTime() };
};

export const liveActivity = {
  isSupported: () => native?.isSupported() ?? Promise.resolve(false),
  isRunning: () => native?.isRunning() ?? Promise.resolve(false),
  start: (a: ExamActivity) =>
    native ? native.start(payload(a)) : Promise.reject(new Error('unsupported')),
  update: (a: ExamActivity) =>
    native?.update(payload(a)) ?? Promise.resolve(false),
  end: () => native?.end() ?? Promise.resolve(false),
};
