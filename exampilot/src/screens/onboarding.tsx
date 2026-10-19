import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Page } from '../components/Page';
import { Icon, PrimaryButton, SecondaryButton, IconButton, Field, StepHeader, InfoCard, illo, SubjectRow, colorOf } from '../components/ui';
import { pressable, splashTimeline as T, rise, stagger } from '../lib/motion';
import { celebrate } from '../lib/celebrate';
import { useStore } from '../data/store';
import { fmtLong, fmtTimeShort, dayNum, monthShort, weekday, parseDDMM, daysBetween, todayISO, fmtShort } from '../lib/dates';
import { generatePlan, hours } from '../lib/plan';
import admitSample from '../data/seed/admit-card-extraction-example.json';
import micro from '../data/seed/microcopy.json';

/* ---------- 01 Splash ---------- */
const s = (ms: number) => ms / 1000;
const bloom = (delay: number) => ({ initial: { opacity: 0, scale: 0.6 }, animate: { opacity: 1, scale: 1 }, transition: { delay: s(delay), duration: 0.9, ease: [0.2, 0.9, 0.25, 1.08] as const } });
export function Splash() {
  const nav = useNavigate();
  const { state, update } = useStore();
  const reduce = useReducedMotion();
  const begin = () => { update((x) => ({ ...x, splashSeen: true })); nav(state.signedIn ? '/today' : '/login'); };
  return (
    <div className="bg-splash">
      <div className="relative mx-auto flex min-h-dvh max-w-[480px] flex-col px-6 pb-10 pt-16 text-ink">
        <div aria-hidden className="relative min-h-[380px] flex-1">
          {[320, 220].map((size, i) => (
            <motion.span key={size} {...bloom(T.rings[i])} className="absolute left-1/2 top-[46%] rounded-full border-[1.5px] border-white/60" style={{ width: size, height: size, marginLeft: -size / 2, marginTop: -size / 2 }} />
          ))}
          <motion.div className="absolute left-1/2 top-[46%] -ml-40 -mt-40 h-80 w-80" animate={reduce ? undefined : { rotate: 360 }} transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}>
            <motion.span {...bloom(T.orbitDots[0])} className="absolute left-[148px] top-[-10px] h-[22px] w-[22px] rounded-full bg-white" />
            <motion.span {...bloom(T.orbitDots[1])} className="absolute left-[10px] top-[210px] h-[14px] w-[14px] rounded-full bg-ink" />
          </motion.div>
          <div className="absolute left-1/2 top-[46%] h-0 w-0">
            <motion.span {...bloom(T.circles[0])} className="absolute -left-[95px] -top-[85px] h-[130px] w-[130px] rounded-full bg-art-plum" />
            <motion.span {...bloom(T.circles[1])} className="absolute left-[-5px] -top-[40px] h-[118px] w-[118px] rounded-full bg-art-pink" />
            <motion.span {...bloom(T.circles[2])} className="absolute -left-[55px] top-[25px] h-24 w-24 rounded-full bg-art-mint" />
            <motion.span {...bloom(T.markBadge)} className="absolute -left-10 -top-[25px] flex h-20 w-20 items-center justify-center rounded-[28px] bg-ink">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <motion.path d="M3 11l18-7-7 18-2.5-8.5z" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: s(T.markDraw), duration: 0.7, ease: [0.6, 0, 0.2, 1] }} />
              </svg>
            </motion.span>
          </div>
        </div>
        <div className="flex flex-col gap-3.5">
          <h1 aria-label="ExamPilot" className="flex text-splash">
            {'ExamPilot'.split('').map((c, i) => (
              <motion.span key={i} aria-hidden initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: s(T.letters.start + i * T.letters.step), duration: 0.6, ease: [0.05, 0.7, 0.1, 1] }}>{c}</motion.span>
            ))}
          </h1>
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: s(T.tagline), duration: 0.6 }} className="text-[19px] leading-normal text-se-text">
            Study calm. Exam ready.<br />One topic at a time.
          </motion.p>
          <div aria-hidden className="mt-1.5 h-1 overflow-hidden rounded-full bg-white/60">
            <motion.span className="block h-full origin-left rounded-full bg-ink" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: s(T.loadBar.start), duration: s(T.loadBar.duration), ease: [0.4, 0, 0.2, 1] }} />
          </div>
          <motion.button type="button" onClick={begin} {...pressable} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: s(T.cta), duration: 0.6 }}
            className="mt-3 flex h-16 items-center justify-between rounded-full bg-ink pl-7 pr-2 text-lg font-semibold text-white">
            Let’s begin <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-ink"><Icon name="arrow-right" size={20} /></span>
          </motion.button>
        </div>
      </div>
    </div>
  );
}

/* ---------- 02 Login ---------- */
export function Login() {
  const nav = useNavigate();
  const { update } = useStore();
  const [mode, setMode] = useState<'in' | 'up'>('in');
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [show, setShow] = useState(false);
  const [err, setErr] = useState('');
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) return setErr('That email doesn’t look quite right.');
    if (pw.length < 6) return setErr('Use at least 6 characters for your password.');
    // Auth is mocked until Firebase is wired; profile email is carried forward.
    update((x) => ({ ...x, signedIn: true, profile: { ...x.profile, email } }));
    nav(mode === 'up' ? '/details' : '/today');
  };
  return (
    <Page gutter={24}>
      <img src={illo('login-corner-art')} alt="" aria-hidden className="pointer-events-none absolute right-0 top-0 w-[200px]" />
      <div className="relative pt-[72px]">
        <span className="flex h-[52px] w-[52px] items-center justify-center rounded-[18px] bg-ink text-white"><Icon name="logo-plane" size={26} /></span>
        <h1 className="mt-8 text-[42px] font-semibold leading-[1.05] tracking-[-0.03em]">{mode === 'in' ? 'Welcome back' : 'Let’s get you set up'}</h1>
        <p className="mt-2 text-[17px] text-ink-muted">{mode === 'in' ? 'Pick up where you left off.' : 'It takes about a minute.'}</p>
        <div role="group" aria-label="Sign in or create account" className="relative mt-7 grid grid-cols-2 rounded-full bg-white p-1.5">
          <span aria-hidden className="ep-seg-indicator absolute bottom-1.5 left-1.5 top-1.5 w-[calc(50%-6px)] rounded-full bg-ink" style={{ transform: `translateX(${mode === 'in' ? 0 : 100}%)` }} />
          {(['in', 'up'] as const).map((m) => (
            <button key={m} type="button" aria-pressed={mode === m} onClick={() => { setMode(m); setErr(''); }} className={`relative h-12 rounded-full text-base font-semibold transition-colors ${mode === m ? 'text-white' : 'text-ink'}`}>{m === 'in' ? 'Sign in' : 'Create account'}</button>
          ))}
        </div>
        <form onSubmit={submit} className="mt-5 flex flex-col gap-3">
          <Field label="Email" value={email} onChange={setEmail} type="email" autoComplete="email" placeholder="you@college.edu" />
          <Field label="Password" value={pw} onChange={setPw} type={show ? 'text' : 'password'} autoComplete={mode === 'in' ? 'current-password' : 'new-password'} placeholder="••••••••"
            trailing={<button type="button" aria-label={show ? 'Hide password' : 'Show password'} onClick={() => setShow(!show)} className="flex h-11 w-11 items-center justify-center rounded-full"><Icon name={show ? 'eye-off' : 'eye'} size={20} /></button>} />
          {err && <p role="alert" className="rounded-full bg-error-fill px-4 py-1.5 text-sm text-error-text">{err}</p>}
          {mode === 'in' && <button type="button" className="self-start px-2 text-[15px] font-semibold text-ink-muted">Forgot password?</button>}
          <PrimaryButton type="submit">{mode === 'in' ? 'Sign in' : 'Create account'}</PrimaryButton>
        </form>
        <div className="my-5 flex items-center gap-3 text-sm text-ink-subtle"><span className="h-px flex-1 bg-line-strong" />or<span className="h-px flex-1 bg-line-strong" /></div>
        {/* Placeholder: replace with Google's official sign-in button when Firebase Auth is wired. */}
        <button type="button" onClick={() => { setEmail('student@college.edu'); setPw('password'); }} className="flex h-14 w-full items-center justify-center gap-3 rounded-full border border-[#747775] bg-white text-sm font-medium">
          <span aria-hidden className="text-lg font-bold">G</span>Continue with Google
        </button>
        <p className="mt-5 text-center text-[13px] text-ink-subtle">By continuing you agree to our terms and privacy notice.</p>
      </div>
    </Page>
  );
}

/* ---------- 03 Your details ---------- */
export function Details() {
  const nav = useNavigate();
  const { state, update } = useStore();
  const [p, setP] = useState(state.profile);
  const [err, setErr] = useState('');
  const initials = ((p.firstName[0] ?? '') + (p.surname[0] ?? '')).toUpperCase() || 'Hi';
  const go = () => {
    if (!p.firstName.trim() || !/^\S+@\S+\.\S+$/.test(p.email)) return setErr('Add your first name and a valid email to continue.');
    update((x) => ({ ...x, profile: p }));
    nav('/admit');
  };
  return (
    <Page gutter={24}>
      <StepHeader step={1} onBack={() => nav('/login')} />
      <motion.div variants={stagger} initial="initial" animate="animate" className="mt-6 flex flex-col gap-3">
        <motion.div variants={rise} className="flex items-center gap-4">
          <motion.span key={initials} initial={{ scale: 0.85 }} animate={{ scale: 1 }} className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-se-fill text-2xl font-semibold text-se-text">{initials}</motion.span>
          <p className="text-xl font-medium text-ink-muted">Nice to meet you{p.firstName ? `, ${p.firstName}` : ''}!</p>
        </motion.div>
        <motion.h1 variants={rise} className="my-2 text-onboard">Tell us a little about you</motion.h1>
        <motion.div variants={rise} className="grid grid-cols-2 gap-3">
          <Field label="First name" value={p.firstName} onChange={(v) => setP({ ...p, firstName: v })} autoComplete="given-name" />
          <Field label="Surname" value={p.surname} onChange={(v) => setP({ ...p, surname: v })} autoComplete="family-name" />
        </motion.div>
        <motion.div variants={rise}><Field label="Student email" value={p.email} onChange={(v) => setP({ ...p, email: v })} type="email" autoComplete="email" /></motion.div>
        <motion.div variants={rise}><Field label="College (optional)" value={p.college ?? ''} onChange={(v) => setP({ ...p, college: v })} /></motion.div>
        <motion.div variants={rise}>
          <p className="mb-2 px-1 text-[13px] font-semibold text-ink-muted">Semester</p>
          <div className="flex gap-2" role="group" aria-label="Semester">
            {[3, 4, 5, 6, 7, 8].map((n) => (
              <button key={n} type="button" aria-pressed={p.semester === n} onClick={() => setP({ ...p, semester: n })} className={`h-12 w-12 rounded-full text-base font-semibold ${p.semester === n ? 'bg-ink text-white' : 'bg-white'}`}>{n}</button>
            ))}
          </div>
        </motion.div>
        {err && <p role="alert" className="rounded-full bg-headsup-fill px-4 py-1.5 text-sm text-headsup-text">{err}</p>}
        <motion.div variants={rise} className="mt-2"><PrimaryButton onClick={go}>Continue</PrimaryButton></motion.div>
      </motion.div>
    </Page>
  );
}

/* ---------- 04 Admit card ---------- */
type Found = { id: string; subjectId: string; title: string; date: string; time: string; flag?: string };
export function AdmitCard() {
  const nav = useNavigate();
  const { state, update } = useStore();
  const [phase, setPhase] = useState<'idle' | 'scanning' | 'results'>('idle');
  const [found, setFound] = useState<Found[]>([]);
  const file = useRef<HTMLInputElement>(null);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const scan = () => {
    setPhase('scanning');
    // Mocked extractor: the real pipeline (pdf.js → server proxy → validation) lands in the AI phase.
    timer.current = window.setTimeout(() => {
      const rows: Found[] = admitSample.exams.map((e, i) => {
        const p = parseDDMM(e.rawText, e.weekdayPrinted);
        const ex = state.exams[i];
        return { id: ex?.id ?? 'x' + i, subjectId: ex?.subjectId ?? 'se', title: e.subjectName, date: e.date, time: e.start, flag: p && !p.weekdayMatches ? 'Weekday doesn’t match the date — please check.' : undefined };
      });
      setFound(rows); setPhase('results');
    }, 2400);
  };
  const confirm = () => {
    update((x) => ({ ...x, exams: found.map((f) => ({ id: f.id, subjectId: f.subjectId, title: f.title, date: f.date, time: f.time, source: 'admit-card' as const })) }));
    nav('/plan');
  };
  return (
    <Page gutter={24}>
      <StepHeader step={2} onBack={() => nav('/details')} />
      <input ref={file} type="file" accept="application/pdf,image/*" capture={undefined} hidden onChange={(e) => e.target.files?.[0] && scan()} />
      {phase === 'idle' && (
        <motion.div variants={stagger} initial="initial" animate="animate" className="mt-6 flex flex-col gap-4">
          <motion.h1 variants={rise} className="text-onboard">{micro.admitCard.idleTitle}</motion.h1>
          <motion.p variants={rise} className="text-[17px] text-ink-muted">{micro.admitCard.idleSub}</motion.p>
          <motion.div variants={rise} className="flex flex-col items-center gap-3 rounded-card border-[1.5px] border-dashed border-line-strong bg-white px-6 py-9 text-center">
            <span className="ep-bob flex h-20 w-20 items-center justify-center rounded-full bg-se-fill text-se-text"><Icon name="upload" size={32} /></span>
            <p className="text-section">Upload admit card</p>
            <p className="text-[15px] text-ink-muted">PDF or a clear photo · up to 10 MB</p>
            <button type="button" onClick={() => file.current?.click()} className="mt-2 h-14 rounded-full bg-ink px-8 text-base font-semibold text-white">Choose file</button>
          </motion.div>
          <motion.div variants={rise} className="grid grid-cols-2 gap-3">
            <SecondaryButton icon="camera" onClick={() => file.current?.click()}>Take photo</SecondaryButton>
            <SecondaryButton icon="sparkle-outline" onClick={scan}>Try a sample</SecondaryButton>
          </motion.div>
          <motion.div variants={rise}><InfoCard tone="dds" icon="lock">{micro.admitCard.privacy}</InfoCard></motion.div>
        </motion.div>
      )}
      {phase === 'scanning' && (
        <div className="mt-6 flex flex-col gap-4">
          <h1 className="text-onboard">One moment…</h1>
          <div className="relative overflow-hidden rounded-card bg-white p-6">
            <img src={illo('admit-card-skeleton')} alt="" className="ep-shine w-full" />
            <span aria-hidden className="ep-scan" />
          </div>
          <p role="status" className="text-center text-[17px] text-ink-muted">{micro.admitCard.scanning.replace('…', '')}<span className="ep-dot">.</span><span className="ep-dot" style={{ animationDelay: '.2s' }}>.</span><span className="ep-dot" style={{ animationDelay: '.4s' }}>.</span></p>
        </div>
      )}
      {phase === 'results' && (
        <motion.div variants={stagger} initial="initial" animate="animate" className="mt-6 flex flex-col gap-3">
          <motion.h1 variants={rise} className="mb-2 text-onboard">{micro.admitCard.doneTitle.replace('{n}', String(found.length))}</motion.h1>
          {found.map((f, i) => (
            <motion.div key={f.id} variants={rise} className={`flex items-center gap-3 rounded-full p-2 pr-3 ${colorOf(f.subjectId) === 'se' ? 'bg-se-fill' : colorOf(f.subjectId) === 'daa' ? 'bg-daa-fill' : 'bg-dds-fill'}`}>
              <span className="flex h-[52px] w-[52px] flex-none flex-col items-center justify-center rounded-full bg-white text-[11px] font-semibold leading-tight"><span className="text-base">{dayNum(f.date)}</span>{monthShort(f.date).toUpperCase()}</span>
              <span className="min-w-0 flex-1"><span className="block truncate text-base font-semibold">{f.title}</span><span className="block text-sm text-ink-muted">{weekday(f.date)} · {fmtTimeShort(f.time)}</span>{f.flag && <span className="text-xs text-headsup-text">{f.flag}</span>}</span>
              <IconButton icon="edit-pencil" label={`Edit ${f.title}`} size={44} onClick={() => { const t = prompt('Time (HH:mm)', f.time); if (t && /^\d{2}:\d{2}$/.test(t)) setFound(found.map((x, j) => (j === i ? { ...x, time: t } : x))); }} />
            </motion.div>
          ))}
          <motion.div variants={rise}><SecondaryButton variant="dashed" icon="plus" onClick={() => {
            const d = prompt('Exam date (DD/MM/YYYY)'); const p = d && parseDDMM(d); const t = prompt('Subject name');
            if (p && t) setFound([...found, { id: 'x' + Date.now(), subjectId: 'x', title: t, date: p.iso, time: '14:00' }]);
          }}>Add an exam we missed</SecondaryButton></motion.div>
          <motion.div variants={rise} className="mt-2"><PrimaryButton onClick={confirm}>Looks right — build my plan</PrimaryButton></motion.div>
          <motion.button variants={rise} type="button" onClick={() => setPhase('idle')} className="h-12 text-[15px] font-semibold text-ink-muted">Upload a different file</motion.button>
        </motion.div>
      )}
    </Page>
  );
}

/* ---------- 05 Plan ready ---------- */
export function PlanReady() {
  const nav = useNavigate();
  const { state, update } = useStore();
  const reduce = useReducedMotion();
  const plan = state.sessions.some((x) => x.source === 'plan' && daysBetween(todayISO(), x.date) >= 0) && state.onboarded ? state.sessions : generatePlan(state.exams);
  const days = Array.from(new Set([...plan.map((p) => p.date), ...state.exams.map((e) => e.date)])).sort();
  const total = plan.reduce((a, p) => a + hours(p), 0);
  const badge = useRef<HTMLSpanElement>(null);
  const colors = ['#8C7BB5', '#E9C4CC', '#BFE0D8', '#1B1B1F', '#C5BADB', '#DDB5BD'];
  useEffect(() => { if (!reduce) celebrate({ x: 0.5, y: 0.3 }); }, [reduce]);
  const finish = (to: string) => {
    update((x) => ({ ...x, sessions: [...x.sessions.filter((s) => s.source !== 'plan'), ...plan], onboarded: true }));
    nav(to);
  };
  return (
    <Page gutter={24}>
      <StepHeader step={3} onBack={() => nav('/admit')} />
      <div className="mt-6 flex flex-col items-center text-center">
        <div className="relative h-[120px] w-[120px]">
          {Array.from({ length: 14 }).map((_, i) => {
            const a = (i / 14) * Math.PI * 2, r = 62 + (i % 3) * 14;
            return <span key={i} aria-hidden className="ep-burst" style={{ width: 8 + (i % 3) * 4, height: 8 + (i % 3) * 4, background: colors[i % 6], ['--x' as string]: `${Math.cos(a) * r}px`, ['--y' as string]: `${Math.sin(a) * r}px`, animationDelay: `${200 + i * 20}ms` }} />;
          })}
          <span ref={badge} className="ep-badge absolute inset-2 flex items-center justify-center rounded-full bg-ink text-white">
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden><motion.path d="M5 12l5 5L20 7" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.5, duration: 0.4 }} /></svg>
          </span>
        </div>
        <h1 className="mt-4 text-onboard">{micro.plan.title}</h1>
        <p className="mt-2 max-w-[300px] text-[17px] text-ink-muted">{micro.plan.sub}</p>
      </div>
      <div className="mt-6 grid grid-cols-3 gap-2.5 text-center">
        {[['se', String(state.exams.length), 'exams'], ['daa', String(plan.length), 'sessions'], ['dds', (total / Math.max(1, days.length)).toFixed(1) + 'h', 'a day']].map(([c, v, l]) => (
          <div key={l} className={`rounded-panel py-4 ${c === 'se' ? 'bg-se-fill' : c === 'daa' ? 'bg-daa-fill' : 'bg-dds-fill'}`}><div className="text-[32px] font-semibold leading-none">{v}</div><div className="mt-1 text-sm text-ink-muted">{l}</div></div>
        ))}
      </div>
      <section className="mt-4 rounded-card bg-white p-5">
        {days.map((d, i) => (
          <motion.div key={d} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.1 }} className="flex items-start gap-3 border-b border-line py-3 last:border-0">
            <span className="w-14 flex-none pt-1.5 text-sm font-semibold text-ink-muted">{fmtShort(d).split(', ').join(' ').replace(/ [A-Za-z]+$/, '')}</span>
            <span className="flex flex-wrap gap-1.5">
              {state.exams.filter((e) => e.date === d).map((e) => <span key={e.id} className="flex items-center gap-1.5 rounded-full bg-ink px-3 py-1.5 text-[13px] font-semibold text-white"><span className="h-2 w-2 rounded-full" style={{ background: ({ se: '#7D6BAA', daa: '#B86A7A', dds: '#4F9686' } as Record<string, string>)[e.subjectId] ?? '#fff' }} />{(state.subjects.find((s) => s.id === e.subjectId)?.code ?? 'Exam')} exam · {fmtTimeShort(e.time).replace(':00', '')}</span>)}
              {plan.filter((p) => p.date === d).map((p) => { const c = colorOf(p.subjectId); return <span key={p.id} className={`rounded-full px-3 py-1.5 text-[13px] font-semibold ${c === 'se' ? 'bg-se-fill text-se-text' : c === 'daa' ? 'bg-daa-fill text-daa-text' : 'bg-dds-fill text-dds-text'}`}>{state.subjects.find((s) => s.id === p.subjectId)?.code ?? ''} · {hours(p)}h</span>; })}
            </span>
          </motion.div>
        ))}
      </section>
      <div className="mt-5 flex flex-col gap-3">
        <PrimaryButton onClick={() => finish('/today')}>Open my plan</PrimaryButton>
        <SecondaryButton onClick={() => finish('/assistant')}>Adjust with study assistant</SecondaryButton>
      </div>
    </Page>
  );
}
export { SubjectRow, fmtLong };
