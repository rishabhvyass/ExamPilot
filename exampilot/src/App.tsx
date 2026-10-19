import { MotionConfig, AnimatePresence } from 'motion/react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { StoreProvider, useStore } from './data/store';
import { Splash, Login, Details, AdmitCard, PlanReady } from './screens/onboarding';
import { Today, Calendar, Subjects, Questions } from './screens/tabs';
import { Materials, Assistant, PdfReader } from './screens/tools';

function Guard({ children }: { children: React.ReactNode }) {
  const { state } = useStore();
  if (!state.splashSeen) return <Navigate to="/splash" replace />;
  if (!state.signedIn) return <Navigate to="/login" replace />;
  if (!state.onboarded) return <Navigate to="/details" replace />;
  return <>{children}</>;
}
function Routed() {
  const loc = useLocation();
  const g = (el: React.ReactNode) => <Guard>{el}</Guard>;
  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={loc} key={loc.pathname.split('/')[1]}>
        <Route path="/splash" element={<Splash />} />
        <Route path="/login" element={<Login />} />
        <Route path="/details" element={<Details />} />
        <Route path="/admit" element={<AdmitCard />} />
        <Route path="/plan" element={<PlanReady />} />
        <Route path="/today" element={g(<Today />)} />
        <Route path="/calendar" element={g(<Calendar />)} />
        <Route path="/subjects" element={g(<Subjects />)} />
        <Route path="/questions" element={g(<Questions />)} />
        <Route path="/materials" element={g(<Materials />)} />
        <Route path="/assistant" element={<Assistant />} />
        <Route path="/pdf/:id" element={g(<PdfReader />)} />
        <Route path="*" element={<Navigate to="/today" replace />} />
      </Routes>
    </AnimatePresence>
  );
}
export default function App() {
  return <MotionConfig reducedMotion="user"><StoreProvider><Routed /></StoreProvider></MotionConfig>;
}
