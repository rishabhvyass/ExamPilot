import { nextUpcomingExam } from '../lib/nextExam';
import { useEffect, useState } from 'react';
import { AppState } from 'react-native';
import { useStore } from '../data/store';
import { liveActivity, type ExamActivity } from '../lib/liveActivity';
import { useSubjectColors, colorOf } from '../theme';
import { todayISO } from '../lib/dates';

// One native activity, shared by all screens. No simulated island in the app UI.
export function NativeExamActivity() {
  const SUBJ = useSubjectColors();
  const { state } = useStore();
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 60000);
    const subscription = AppState.addEventListener('change', status => {
      if (status === 'active') setNow(Date.now());
    });
    return () => {
      clearInterval(timer);
      subscription.remove();
    };
  }, []);
  const next = nextUpcomingExam(state.exams, now);
  const subject = state.subjects.find(s => s.id === next?.subjectId);
  const tasks = state.tasks.filter(t => t.date === todayISO());
  const key = JSON.stringify(
    (state.signedIn || state.guestMode) && next
      ? ({
          code: subject?.code ?? 'Exam',
          title: subject?.name ?? next.title,
          date: next.date,
          time: next.time || '09:00',
          accent: SUBJ[colorOf(subject?.color)].mark,
          topicsDone: tasks.filter(t => t.done).length,
          topicsTotal: tasks.length,
        } satisfies ExamActivity)
      : null,
  );
  useEffect(() => {
    let active = true;
    let syncing = false;
    const sync = async () => {
      if (syncing || AppState.currentState !== 'active') return;
      syncing = true;
      try {
        if (!(await liveActivity.isSupported()) || !active) return;
        const payload: ExamActivity | null = JSON.parse(key);
        if (payload) await liveActivity.start(payload);
        else await liveActivity.end();
      } catch (error) {
        console.warn('[Live Activity]', error);
      } finally {
        syncing = false;
      }
    };
    sync();
    const subscription = AppState.addEventListener('change', value => {
      if (value === 'active') sync();
    });
    return () => {
      active = false;
      subscription.remove();
    };
  }, [key]);
  return null;
}
