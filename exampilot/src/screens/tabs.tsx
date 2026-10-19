import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Page } from '../components/Page';
import { Icon, TopBar, ScreenHeader, HeroCard, SubjectRow, SegmentedProgress, AnimatedCheckbox, SubjectTag, Card, ArrowUpRightButton, BottomSheet, FilterRow, Chip, IconButton, SecondaryButton, PrimaryButton, colorOf, SUBJ } from '../components/ui';
import { useStore } from '../data/store';
import { addDays, countdown, daysBetween, dayNum, fmtLong, fmtShort, fmtTime, fmtTimeShort, greeting, monthName, parseISO, todayISO, toISO, weekday } from '../lib/dates';
import { accordion, rise, stagger } from '../lib/motion';
import { celebrate } from '../lib/celebrate';
import micro from '../data/seed/microcopy.json';

const subjOf = (subjects: { id: string; code: string }[], id: string) => subjects.find((s) => s.id === id);

/* ---------- 06 Today ---------- */
export function Today() {
  const nav = useNavigate();
  const { state, update } = useStore();
  const today = todayISO();
  const tasks = state.tasks.filter((t) => t.date === today);
  const done = tasks.filter((t) => t.done).length;
  const exams = [...state.exams].sort((a, b) => a.date.localeCompare(b.date));
  const upcoming = exams.filter((e) => daysBetween(today, e.date) >= 0);
  const next = upcoming[0];
  const others = upcoming.slice(1);
  const [sheet, setSheet] = useState(false);
  const [draft, setDraft] = useState({ title: '', subjectId: 'se' });
  const celebrated = useRef(done === tasks.length && tasks.length > 0);

  useEffect(() => {
    const all = tasks.length > 0 && done === tasks.length;
    if (all && !celebrated.current) celebrate();
    celebrated.current = all;
  }, [done, tasks.length]);

  const toggle = (id: string) => update((x) => ({ ...x, tasks: x.tasks.map((t) => (t.id === id ? { ...t, done: !t.done, isSample: false } : t)) }));
  const add = () => {
    if (!draft.title.trim()) return;
    update((x) => ({ ...x, tasks: [...x.tasks, { id: 'u' + Date.now(), date: today, title: draft.title.trim(), subjectId: draft.subjectId, minutes: 25, done: false, isSample: false }] }));
    setDraft({ ...draft, title: '' }); setSheet(false);
  };
  const nextSubj = next && state.subjects.find((s) => s.id === next.subjectId);
  const doneTopics = nextSubj?.topics.filter((t) => t.done).length ?? 0;
  const n = next ? daysBetween(today, next.date) : 0;
  const allDone = tasks.length > 0 && done === tasks.length;

  return (
    <Page tab="today">
      <TopBar />
      <ScreenHeader eyebrow={greeting()} title={<>Your Exam<br />Week</>} />
      <motion.div variants={stagger} initial="initial" animate="animate" className="flex flex-col gap-3.5">
        {next ? (
          <motion.div variants={rise}>
            <HeroCard color={colorOf(next.subjectId)} eyebrow="Next exam" title={next.title} desc={`${fmtLong(next.date)} at ${fmtTime(next.time)}`}
              stats={[{ label: n <= 1 ? 'Exam' : 'Days', value: n <= 0 ? 'Today' : n === 1 ? 'Tomorrow' : String(n), foot: n > 1 ? 'to prepare' : undefined }, { label: 'Topics', value: `${doneTopics}/${nextSubj?.topics.length ?? 0}` }]}
              action={<ArrowUpRightButton label="Open subjects" onClick={() => nav('/subjects')} />} />
            <p className="sr-only">{countdown(next.date, next.time)}</p>
          </motion.div>
        ) : (
          <motion.div variants={rise}><Card><p className="text-section">All exams done</p><p className="mt-1 text-ink-muted">Rest well — you’ve prepared for this.</p></Card></motion.div>
        )}
        {others.map((e) => (
          <motion.div variants={rise} key={e.id}><SubjectRow color={colorOf(e.subjectId)} code={subjOf(state.subjects, e.subjectId)?.code ?? '?'} title={e.title} meta={`${weekday(e.date)}, ${dayNum(e.date)} ${monthName(parseISO(e.date).getMonth()).slice(0, 3)} · ${fmtTimeShort(e.time)}`} onClick={() => nav('/calendar')} /></motion.div>
        ))}
        <motion.div variants={rise}>
          <Card>
            <div className="flex items-start justify-between gap-3">
              <div><h2 className="text-section">Today’s revision</h2><p className="mt-1 text-[15px] text-ink-muted">{micro.checklist.progress.replace('{done}', String(done)).replace('{total}', String(tasks.length))}</p></div>
              {tasks.some((t) => t.isSample) && <span className="rounded-full border-[1.5px] border-line-strong px-3.5 py-2 text-sm font-medium text-ink-muted">Sample plan</span>}
            </div>
            <div className="mt-3"><SegmentedProgress total={Math.max(tasks.length, 1)} done={done} h={8} /></div>
            <div className="mt-3 flex flex-col">
              {tasks.length === 0 && <p className="py-4 text-ink-muted">{micro.checklist.empty}</p>}
              {tasks.map((t) => {
                const sj = subjOf(state.subjects, t.subjectId);
                return <AnimatedCheckbox key={t.id} title={t.title} checked={t.done} onToggle={() => toggle(t.id)} meta={<><SubjectTag code={sj?.code ?? ''} color={colorOf(t.subjectId)} /><span>{t.minutes} min</span></>} />;
              })}
            </div>
            <AnimatePresence mode="wait" initial={false}>
              {allDone ? (
                <motion.div key="done" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-4 flex items-center gap-3 rounded-panel bg-se-fill p-4 text-se-text">
                  <span className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-white"><Icon name="sparkle" size={22} /></span>
                  <span><span className="block font-semibold text-ink">{micro.checklist.allDone}</span><span className="text-sm">{micro.checklist.allDoneSub}</span></span>
                </motion.div>
              ) : (
                <motion.div key="foot" exit={{ opacity: 0 }} className="mt-4 flex items-center justify-between gap-3">
                  <span className="text-[17px] text-ink-muted">{micro.checklist.encourage}</span>
                  <button type="button" onClick={() => setSheet(true)} className="flex h-[52px] items-center gap-2 rounded-full border-[1.5px] border-line-strong px-5 text-base font-medium"><Icon name="plus" size={18} />Add topic</button>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </motion.div>
      </motion.div>
      <BottomSheet open={sheet} onClose={() => setSheet(false)} title="Add a topic">
        <input autoFocus value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} onKeyDown={(e) => e.key === 'Enter' && add()} placeholder="What will you revise?" aria-label="Topic" className="mb-3 h-14 w-full rounded-input bg-surface-input px-5 text-[17px] outline-none focus:ring-2 focus:ring-ink" />
        <div className="mb-4 flex gap-2">{state.subjects.map((s) => <Chip key={s.id} active={draft.subjectId === s.id} onClick={() => setDraft({ ...draft, subjectId: s.id })}>{s.code}</Chip>)}</div>
        <PrimaryButton onClick={add}>Add to today</PrimaryButton>
      </BottomSheet>
    </Page>
  );
}

/* ---------- 07 Calendar ---------- */
export function Calendar() {
  const { state, update } = useStore();
  const today = todayISO();
  const [sel, setSel] = useState(today);
  const [view, setView] = useState(() => { const d = parseISO(today); return { y: d.getFullYear(), m: d.getMonth() }; });
  const [sheet, setSheet] = useState(false);
  const [form, setForm] = useState({ subjectId: 'se', date: today, start: '10:00', end: '11:00' });
  const shift = (n: number) => setView((v) => { const d = new Date(v.y, v.m + n, 1); return { y: d.getFullYear(), m: d.getMonth() }; });
  const pick = (d: string) => { setSel(d); const p = parseISO(d); setView({ y: p.getFullYear(), m: p.getMonth() }); };
  const cells = useMemo(() => {
    const first = new Date(view.y, view.m, 1);
    const lead = (first.getDay() + 6) % 7;
    return Array.from({ length: 42 }, (_, i) => toISO(new Date(view.y, view.m, 1 - lead + i)));
  }, [view]);
  const examsOn = (d: string) => state.exams.filter((e) => e.date === d);
  const sessOn = (d: string) => state.sessions.filter((s) => s.date === d).sort((a, b) => a.start.localeCompare(b.start));
  const code = (id: string) => subjOf(state.subjects, id)?.code ?? '';
  const addSession = () => {
    update((x) => ({ ...x, sessions: [...x.sessions, { id: 'm' + Date.now(), date: form.date, start: form.start, end: form.end, subjectId: form.subjectId, title: 'Study session', source: 'manual' }] }));
    setSheet(false); pick(form.date);
  };
  const label = sel === today ? `Today, ${dayNum(sel)} ${fmtShort(sel).split(' ')[2]}` : fmtShort(sel);
  return (
    <Page tab="calendar">
      <div className="flex items-center gap-2 pt-[60px]">
        <button type="button" onClick={() => pick(today)} className="h-14 rounded-full bg-white px-6 text-base font-semibold">Today</button>
        <span className="flex-1" />
        <IconButton icon="chevron-left" label="Previous month" onClick={() => shift(-1)} />
        <IconButton icon="chevron-right" label="Next month" onClick={() => shift(1)} />
      </div>
      <ScreenHeader eyebrow={`Calendar · ${view.y}`} title={monthName(view.m)} live />
      <Card className="!p-4">
        <div className="grid grid-cols-7 pb-1 text-center text-[13px] font-semibold text-ink-subtle">{'MTWTFSS'.split('').map((d, i) => <span key={i}>{d}</span>)}</div>
        <div className="grid grid-cols-7" role="grid" aria-label={`${monthName(view.m)} ${view.y}`}>
          {cells.map((d) => {
            const inMonth = parseISO(d).getMonth() === view.m;
            const ex = examsOn(d), ss = sessOn(d);
            const on = d === sel;
            return (
              <button key={d} type="button" role="gridcell" aria-selected={on} aria-label={`${weekday(d)} ${dayNum(d)} ${monthName(parseISO(d).getMonth())}${ex.length ? ', exam' : ss.length ? ', study session' : ''}`} onClick={() => pick(d)} className="flex h-[50px] flex-col items-center justify-center gap-0.5">
                <span className={`flex h-[34px] w-[34px] items-center justify-center rounded-full text-[15px] font-medium ${on ? 'bg-ink text-white' : d === today ? 'ring-2 ring-ink' : ''} ${!inMonth && !on ? 'text-[#B5B0A8]' : ''}`}>{dayNum(d)}</span>
                <span className="flex h-1.5 items-center gap-0.5">
                  {ex.map((e) => <span key={e.id} className="h-1.5 w-3 rounded-full" style={{ background: SUBJ[colorOf(e.subjectId)].markHex }} />)}
                  {!ex.length && ss.length > 0 && <span className="h-1.5 w-1.5 rounded-full border-[1.5px] border-ink-subtle" />}
                </span>
              </button>
            );
          })}
        </div>
        <div className="mt-2 flex justify-center gap-5 text-[13px] text-ink-muted"><span className="flex items-center gap-1.5"><span className="h-1.5 w-3 rounded-full bg-se-mark" />Exam</span><span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full border-[1.5px] border-ink-subtle" />Study session</span></div>
      </Card>
      <div className="mt-5 flex items-center justify-between px-1"><h2 className="text-section" aria-live="polite">{label}</h2><IconButton icon="plus" label="Add study session" dark onClick={() => { setForm({ ...form, date: sel }); setSheet(true); }} /></div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={sel} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-3 flex flex-col gap-2.5">
          {examsOn(sel).map((e) => { const c = SUBJ[colorOf(e.subjectId)]; return (
            <div key={e.id} className={`flex items-center gap-4 rounded-full p-2 pr-6 ${c.fill} ${c.text}`}><span className="flex h-[52px] w-[52px] flex-none items-center justify-center rounded-full bg-ink text-sm font-semibold text-white">{fmtTimeShort(e.time).replace(':00', '')}</span><span><span className="block font-semibold text-ink">{e.title}</span><span className="text-sm">Exam · {fmtTime(e.time)}</span></span></div>
          ); })}
          {sessOn(sel).map((s) => { const c = SUBJ[colorOf(s.subjectId)]; return (
            <div key={s.id} className="flex items-center gap-4 rounded-full bg-white p-2 pr-6"><span className={`flex h-[52px] w-[52px] flex-none items-center justify-center rounded-full text-sm font-semibold ${c.deep} ${c.text}`}>{code(s.subjectId)}</span><span><span className="block font-semibold">{s.title}</span><span className="text-sm text-ink-muted">{fmtTimeShort(s.start)} – {fmtTimeShort(s.end)}{s.source === 'plan' ? ' · Sample' : ''}</span></span></div>
          ); })}
          {!examsOn(sel).length && !sessOn(sel).length && <p className="rounded-panel border-[1.5px] border-dashed border-line-strong p-5 text-center text-ink-muted">{micro.calendar.empty}</p>}
        </motion.div>
      </AnimatePresence>
      <p className="mt-4 px-1 text-sm text-ink-subtle">{micro.calendar.sampleNote}</p>
      <BottomSheet open={sheet} onClose={() => setSheet(false)} title="Add a study session">
        <div className="mb-3 flex gap-2">{state.subjects.map((s) => <Chip key={s.id} active={form.subjectId === s.id} onClick={() => setForm({ ...form, subjectId: s.id })}>{s.code}</Chip>)}</div>
        <div className="mb-4 grid grid-cols-3 gap-2">
          {([['date', 'Date', 'date'], ['start', 'Start', 'time'], ['end', 'End', 'time']] as const).map(([k, l, t]) => (
            <label key={k} className="rounded-input bg-surface-input px-3 py-2 text-[13px] font-semibold text-ink-muted">{l}<input type={t} value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} className="block w-full bg-transparent text-[15px] text-ink outline-none" /></label>
          ))}
        </div>
        <PrimaryButton onClick={addSession}>Add session</PrimaryButton>
      </BottomSheet>
    </Page>
  );
}

/* ---------- 08 Subjects ---------- */
const milestone = (p: number) => micro.milestones[(p >= 100 ? '100' : p >= 75 ? '75' : p >= 50 ? '50' : p >= 25 ? '25' : '0') as keyof typeof micro.milestones];
export function Subjects() {
  const nav = useNavigate();
  const { state, update } = useStore();
  const [id, setId] = useState(state.subjects[0].id);
  const sj = state.subjects.find((s) => s.id === id)!;
  const color = colorOf(sj.color);
  const done = sj.topics.filter((t) => t.done).length;
  const pct = Math.round((done / sj.topics.length) * 100);
  const exam = state.exams.find((e) => e.subjectId === id);
  const pdfs = state.materials.filter((m) => m.subjectId === id && m.type === 'pdf');
  const note = state.materials.find((m) => m.subjectId === id && m.type === 'note');
  const toggle = (tid: string) => update((x) => ({ ...x, subjects: x.subjects.map((s) => (s.id === id ? { ...s, isSample: false, topics: s.topics.map((t) => (t.id === tid ? { ...t, done: !t.done } : t)) } : s)) }));
  const file = useRef<HTMLInputElement>(null);
  const addPdf = (f?: File) => f && update((x) => ({ ...x, materials: [...x.materials, { id: 'u' + Date.now(), subjectId: id, type: 'pdf', name: f.name, pages: 6, sizeKb: Math.round(f.size / 1024), isSample: false }] }));
  return (
    <Page tab="subjects">
      <TopBar />
      <ScreenHeader eyebrow={sj.isSample ? 'Sample syllabus' : 'Your syllabus'} title={<>Your Custom<br />Syllabus</>} />
      <FilterRow>{state.subjects.map((s) => <Chip key={s.id} active={s.id === id} onClick={() => setId(s.id)}>{s.code}</Chip>)}</FilterRow>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-3 flex flex-col gap-3.5">
          <HeroCard color={color} title={sj.name} desc={sj.description ?? ''} stats={[{ label: 'Topics', value: `${done}/${sj.topics.length}`, foot: 'revised' }, { label: 'PDFs', value: String(pdfs.length) }]}
            action={exam && <span className="flex h-[52px] items-center gap-2 rounded-full bg-ink px-5 text-[15px] font-semibold text-white"><Icon name="nav-calendar" size={18} />{dayNum(exam.date)} {fmtShort(exam.date).split(' ')[2]}</span>}
            footer={<SegmentedProgress total={sj.topics.length} done={done} tint h={8} />} />
          <Card>
            <div className="flex items-baseline justify-between"><h2 className="text-section">Topics</h2><span className="text-[15px] text-ink-muted">{done} of {sj.topics.length} topics revised</span></div>
            <p className="mt-1 text-[15px] text-ink-muted">{milestone(pct)}</p>
            <div className="mt-2">{sj.topics.map((t) => <AnimatedCheckbox key={t.id} title={t.name} checked={t.done} onToggle={() => toggle(t.id)} />)}</div>
          </Card>
          <Card>
            <h2 className="text-section">Notes &amp; PDFs</h2>
            {note && <p className="mt-3 rounded-panel bg-surface-muted p-4 text-[16px] leading-relaxed">{sj.isSample ? 'Sample note: ' : ''}{note.body ?? note.name}</p>}
            <div className="mt-3 flex flex-col gap-2">
              {pdfs.map((m) => (
                <button key={m.id} type="button" onClick={() => nav('/pdf/' + m.id)} className="flex items-center gap-3 rounded-full bg-surface-muted p-2 pr-5 text-left"><span className="flex h-[46px] w-[46px] flex-none items-center justify-center rounded-full bg-white"><Icon name="file-pdf" size={20} /></span><span className="min-w-0"><span className="block truncate font-semibold">{m.name}</span><span className="text-sm text-ink-muted">{m.isSample ? 'Sample · ' : ''}{(m.sizeKb ?? 0) > 1024 ? ((m.sizeKb ?? 0) / 1024).toFixed(1) + ' MB' : (m.sizeKb ?? 0) + ' KB'}</span></span></button>
              ))}
            </div>
            <input ref={file} type="file" accept="application/pdf" hidden onChange={(e) => addPdf(e.target.files?.[0])} />
            <div className="mt-3 flex flex-col gap-2"><SecondaryButton variant="dashed" icon="plus" onClick={() => file.current?.click()}>Add a PDF</SecondaryButton><SecondaryButton variant="outline" onClick={() => nav('/materials?s=' + id)}>See all materials</SecondaryButton></div>
          </Card>
          <p className="mt-2 px-1 text-[15px] text-ink-muted">Also in your syllabus</p>
          {state.subjects.filter((s) => s.id !== id).map((s) => <SubjectRow key={s.id} color={colorOf(s.color)} code={s.code} title={s.name} meta={`${s.topics.filter((t) => t.done).length} of ${s.topics.length} topics revised`} onClick={() => setId(s.id)} />)}
        </motion.div>
      </AnimatePresence>
    </Page>
  );
}

/* ---------- 09 Questions ---------- */
export function Questions() {
  const { state, update } = useStore();
  const [f, setF] = useState('all');
  const [open, setOpen] = useState<string | null>(null);
  const list = state.questions.filter((q) => f === 'all' || q.subjectId === f);
  const revised = list.filter((q) => q.revised).length;
  const msg = revised >= list.length && list.length ? micro.questions.all : revised >= 4 || (list.length && revised >= list.length / 2) ? micro.questions.gte4 : micro.questions.lt4;
  const mark = (id: string) => update((x) => ({ ...x, questions: x.questions.map((q) => (q.id === id ? { ...q, revised: !q.revised, isSample: false } : q)) }));
  return (
    <Page tab="questions">
      <TopBar />
      <ScreenHeader eyebrow="Sample question bank" title={<>Important<br />Questions</>} />
      <FilterRow>{[['all', 'All'], ...state.subjects.map((s) => [s.id, s.code])].map(([k, l]) => <Chip key={k} active={f === k} onClick={() => setF(k)}>{l}</Chip>)}</FilterRow>
      <div className="mt-3 rounded-card bg-se-fill p-5 text-se-text">
        <div className="flex items-baseline justify-between"><h2 className="text-section text-ink">Revised</h2><span className="text-2xl font-semibold text-ink">{revised}/{list.length}</span></div>
        <p className="mb-3 mt-1 text-[15px]">{msg}</p>
        <SegmentedProgress total={Math.max(list.length, 1)} done={revised} tint h={8} />
      </div>
      <div className="mt-3.5 flex flex-col gap-3">
        {list.map((q) => {
          const isOpen = open === q.id;
          const sj = subjOf(state.subjects, q.subjectId);
          return (
            <motion.article layout key={q.id} className="rounded-[30px] bg-white p-5">
              <h2>
                <button type="button" aria-expanded={isOpen} aria-controls={'a-' + q.id} onClick={() => setOpen(isOpen ? null : q.id)} className="flex w-full items-start gap-3 text-left">
                  <span className="flex-1">
                    <span className="mb-2 flex items-center gap-2"><SubjectTag code={sj?.code ?? ''} color={colorOf(q.subjectId)} />{q.revised && <motion.span initial={{ scale: 0.6 }} animate={{ scale: 1 }} className="text-[13px] font-semibold text-dds-text">✓ Revised</motion.span>}</span>
                    <span className="text-lg font-semibold leading-snug">{q.question}</span>
                  </span>
                  <span className={`flex h-10 w-10 flex-none items-center justify-center rounded-full ${isOpen ? 'bg-ink text-white' : 'bg-surface-muted'}`}><Icon name={isOpen ? 'chevron-up' : 'chevron-down'} size={20} /></span>
                </button>
              </h2>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div id={'a-' + q.id} role="region" variants={accordion} initial="closed" animate="open" exit="closed" className="overflow-hidden">
                    <p className="mt-4 rounded-panel bg-surface-muted p-4 text-[16px] leading-relaxed">{q.answer}</p>
                    <button type="button" onClick={() => mark(q.id)} className={`mt-3 h-12 rounded-full px-5 text-[15px] font-semibold ${q.revised ? 'bg-ink text-white' : 'border-[1.5px] border-line-strong'}`}>{q.revised ? '✓ Revised' : 'Mark as revised'}</button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.article>
          );
        })}
      </div>
    </Page>
  );
}
export { addDays };
