import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { BarChart, Bar, XAxis, Cell, LabelList, ResponsiveContainer } from 'recharts';
import { Page } from '../components/Page';
import { Icon, IconButton, Chip, BottomSheet, SUBJ, colorOf, illo } from '../components/ui';
import { useStore } from '../data/store';
import { message, pageTurn, rise, stagger } from '../lib/motion';
import { celebrate } from '../lib/celebrate';
import { addDays, todayISO, fmtShort } from '../lib/dates';
import { hours } from '../lib/plan';
import type { ChartBlock, ChatMessage, Material, StudyPlanBlock } from '../data/types';
import micro from '../data/seed/microcopy.json';

/* ---------- 10 Study materials ---------- */
const TYPE_ICON = { pdf: 'file-pdf', image: 'image', link: 'link', note: 'note' } as const;
export function Materials() {
  const nav = useNavigate();
  const [sp] = useSearchParams();
  const { state, update } = useStore();
  const [f, setF] = useState(sp.get('s') ?? state.subjects[0].id);
  const [sheet, setSheet] = useState(false);
  const file = useRef<HTMLInputElement>(null);
  const items = state.materials.filter((m) => m.subjectId === f);
  const sj = state.subjects.find((s) => s.id === f)!;
  const add = (m: Omit<Material, 'id' | 'subjectId' | 'isSample'>) => update((x) => ({ ...x, materials: [...x.materials, { ...m, id: 'u' + Date.now(), subjectId: f, isSample: false }] }));
  const groups: [string, Material['type'][]][] = [['PDFs', ['pdf']], ['Photos & notes', ['image', 'note']], ['Videos & links', ['link']]];
  const meta = (m: Material) => `${m.isSample ? 'Sample · ' : ''}${m.type === 'pdf' ? `${m.pages ?? '?'} pages` : m.type === 'image' ? `${m.count ?? 1} photo${(m.count ?? 1) > 1 ? 's' : ''}` : m.type === 'link' ? `${m.minutes ?? '?'} min` : 'Note'}`;
  const sheetTiles: [string, string, string, () => void][] = [
    ['Upload PDF', 'file-pdf', 'bg-se-fill text-se-text', () => file.current?.click()],
    ['Photo of notes', 'camera', 'bg-daa-fill text-daa-text', () => { setSheet(false); add({ type: 'image', name: 'Photo of notes', count: 1 }); }],
    ['Video or link', 'link', 'bg-dds-fill text-dds-text', () => { const u = prompt('Paste a link'); if (u) { setSheet(false); add({ type: 'link', name: u.replace(/^https?:\/\//, '').slice(0, 40) }); } }],
    ['Write a note', 'note', 'bg-surface-muted', () => { const b = prompt('Your note'); if (b) { setSheet(false); add({ type: 'note', name: b.slice(0, 40), body: b }); } }],
  ];
  return (
    <Page>
      <div className="flex items-center gap-2 pt-[60px]"><IconButton icon="chevron-left" label="Back" onClick={() => nav(-1)} /><span className="flex-1" /><IconButton icon="search" label="Search" /></div>
      <header className="px-1 pb-4 pt-3.5"><p className="text-xl font-medium text-ink-muted">{items.length} items{items.some((i) => i.isSample) ? ' · sample' : ''}</p><h1 className="text-display">Study<br />Materials</h1></header>
      <div className="flex gap-2 overflow-x-auto py-1">{state.subjects.map((s) => <Chip key={s.id} active={f === s.id} onClick={() => setF(s.id)}>{s.code}</Chip>)}</div>
      <input ref={file} type="file" accept="application/pdf" hidden onChange={(e) => { const x = e.target.files?.[0]; if (x) { add({ type: 'pdf', name: x.name, pages: 6, sizeKb: Math.round(x.size / 1024) }); setSheet(false); } }} />
      <motion.div variants={stagger} initial="initial" animate="animate" key={f} className="mt-4 flex flex-col gap-5 pb-24">
        {groups.map(([title, types]) => {
          const rows = items.filter((m) => types.includes(m.type));
          if (!rows.length) return null;
          return (
            <motion.section variants={rise} key={title}>
              <h2 className="mb-2 px-1 text-lg font-semibold text-ink-muted">{title}</h2>
              <div className="flex flex-col gap-2.5">
                {rows.map((m) => (
                  <motion.button whileHover={{ y: -2 }} type="button" key={m.id} onClick={() => m.type === 'pdf' && nav('/pdf/' + m.id)} className="flex items-center gap-3.5 rounded-panel bg-white p-3 text-left">
                    <span className={`flex h-[52px] w-[52px] flex-none items-center justify-center rounded-[18px] ${SUBJ[colorOf(sj.color)].fill} ${SUBJ[colorOf(sj.color)].text}`}><Icon name={TYPE_ICON[m.type]} /></span>
                    <span className="min-w-0 flex-1"><span className="block truncate font-semibold">{m.name}</span><span className="text-sm text-ink-muted">{meta(m)}</span></span>
                    <Icon name="chevron-right" size={20} className="text-ink-subtle" />
                  </motion.button>
                ))}
              </div>
            </motion.section>
          );
        })}
        {!items.length && <p className="rounded-panel border-[1.5px] border-dashed border-line-strong p-5 text-center text-ink-muted">Nothing here yet. Add your first note or PDF.</p>}
      </motion.div>
      <div className="pointer-events-none fixed inset-x-0 bottom-8 z-30 flex justify-center">
        <button type="button" onClick={() => setSheet(true)} className="ep-fab-breathe pointer-events-auto flex h-16 items-center gap-2 rounded-full bg-ink pl-6 pr-7 text-lg font-semibold text-white"><Icon name="plus" size={22} />Add material</button>
      </div>
      <BottomSheet open={sheet} onClose={() => setSheet(false)} title={`Add to ${sj.code}`}>
        <div className="grid grid-cols-2 gap-3">
          {sheetTiles.map(([l, ic, c, fn], i) => (
            <motion.button key={l} type="button" onClick={fn} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.06 }} className={`flex h-28 flex-col items-start justify-between rounded-panel p-4 text-left font-semibold ${c}`}><Icon name={ic} size={26} />{l}</motion.button>
          ))}
        </div>
        <p className="mt-4 text-sm text-ink-muted">Anything you add here can be used by the study assistant to build your plan and quiz you.</p>
      </BottomSheet>
    </Page>
  );
}

/* ---------- 11 Study assistant ---------- */
const uid = () => Math.random().toString(36).slice(2);
function reply(q: string, state: ReturnType<typeof useStore>['state']): Omit<ChatMessage, 'id' | 'role'> {
  const t = q.toLowerCase();
  const today = todayISO();
  if (t.includes('chart') || t.includes('hours')) {
    const data = state.subjects.map((s) => ({ label: s.code, subjectId: s.id, value: state.sessions.filter((x) => x.subjectId === s.id).reduce((a, x) => a + hours(x), 0) }));
    return { text: 'Here’s how your planned study hours split across subjects.', block: { type: 'chart', kind: 'bar', title: 'Planned study hours this week', unit: 'h', data } };
  }
  if (t.includes('plan') || t.includes('week') || t.includes('daa')) {
    return { text: 'Here’s a calm plan for DAA before Thursday. Lighter the evening before.', block: { type: 'study_plan', subjectId: 'daa', title: 'Calm plan for DAA before Thursday', sessions: [
      { date: addDays(today, 1), topic: 'Divide & conquer + Master theorem', hours: 1.5 }, { date: addDays(today, 2), topic: 'DP and greedy, 6 practice problems', hours: 1.5 }, { date: addDays(today, 3), topic: 'Light recap of graphs after SE exam', hours: 1 }] } };
  }
  if (t.includes('uml') || t.includes('explain') || t.includes('quiz')) {
    return { text: 'UML class diagrams show classes, their attributes and the relationships between them (association, inheritance, composition). Try sketching one for a library system from memory, then compare with your notes.', source: { materialId: 'm1', label: 'SE_Unit3_Design_UML.pdf · p.4–6', page: 4 } };
  }
  return { text: 'I can plan your week, quiz you, or chart your study hours. Which would help most right now?' };
}
export function Assistant() {
  const nav = useNavigate();
  const { state, update } = useStore();
  const [text, setText] = useState('');
  const [typing, setTyping] = useState(false);
  const end = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const msgs: ChatMessage[] = state.chat.length ? state.chat : [{ id: 'hello', role: 'assistant', text: micro.assistant.hello }];
  useEffect(() => { end.current?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'end' }); }, [msgs.length, typing, reduce]);
  const send = (q: string) => {
    if (!q.trim() || typing) return;
    update((x) => ({ ...x, chat: [...(x.chat.length ? x.chat : msgs), { id: uid(), role: 'user', text: q }] }));
    setText(''); setTyping(true);
    window.setTimeout(() => { setTyping(false); update((x) => ({ ...x, chat: [...x.chat, { id: uid(), role: 'assistant', ...reply(q, x) }] })); }, 900);
  };
  const addToCal = (m: ChatMessage) => {
    const b = m.block as StudyPlanBlock;
    update((x) => ({ ...x, sessions: [...x.sessions, ...b.sessions.map((s) => ({ id: uid(), date: s.date, start: '17:00', end: `${17 + Math.floor(s.hours)}:${s.hours % 1 ? '30' : '00'}`, subjectId: b.subjectId ?? 'se', title: s.topic, source: 'assistant' as const }))], chat: x.chat.map((c) => (c.id === m.id ? { ...c, added: true } : c)) }));
  };
  return (
    <main className="mx-auto flex h-dvh max-w-[480px] flex-col">
      <div className="flex items-center gap-3 px-5 pb-3 pt-[60px]">
        <IconButton icon="chevron-left" label="Back" onClick={() => nav(-1)} />
        <span className="ep-glow flex h-12 w-12 items-center justify-center rounded-full bg-se-fill text-se-text"><Icon name="sparkle" /></span>
        <div><p className="text-lg font-semibold leading-tight">Study buddy</p><p className="flex items-center gap-1.5 text-[13px] text-ink-muted"><span className="h-2 w-2 rounded-full bg-dds-mark" />Knows your plan &amp; materials</p></div>
      </div>
      <p className="mx-5 mb-2 rounded-full border-[1.5px] border-line-strong px-4 py-1.5 text-center text-[13px] text-ink-muted">{micro.assistant.notConnected}</p>
      <div className="flex-1 overflow-y-auto px-5 pb-4" role="log" aria-live="polite">
        <div className="flex flex-col gap-3 py-2">
          {msgs.map((m) => (
            <motion.div key={m.id} variants={message} initial="initial" animate="animate" className={`flex flex-col gap-2 ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
              {m.text && <p className={`max-w-[86%] px-4 py-3 text-[16px] leading-snug ${m.role === 'user' ? 'rounded-[26px_26px_8px_26px] bg-ink text-white' : 'rounded-[26px_26px_26px_8px] bg-white'}`}>{m.text}</p>}
              {m.block?.type === 'study_plan' && <PlanCard m={m} onAdd={() => addToCal(m)} />}
              {m.block?.type === 'chart' && <ChartCard b={m.block} />}
              {m.source && <button type="button" onClick={() => nav(`/pdf/${m.source!.materialId}?p=${m.source!.page}`)} className="flex items-center gap-2 rounded-full bg-se-fill px-4 py-2 text-[13px] font-semibold text-se-text"><Icon name="file-pdf" size={16} />{m.source.label}</button>}
            </motion.div>
          ))}
          {typing && <div className="ep-typing flex w-fit gap-1.5 rounded-full bg-white px-4 py-3.5" aria-label="Study buddy is typing"><span /><span /><span /></div>}
          <div ref={end} />
        </div>
      </div>
      <div className="bg-gradient-to-t from-ground via-ground to-transparent px-5 pb-6 pt-3">
        <div className="mb-3 flex gap-2 overflow-x-auto [scrollbar-width:none]">
          {['Plan my week', 'Quiz me on UML', 'Chart my study hours'].map((s) => <button key={s} type="button" onClick={() => send(s)} className="h-11 flex-none rounded-full border-[1.5px] border-line-strong px-4 text-[15px] font-medium">{s}</button>)}
        </div>
        <form onSubmit={(e) => { e.preventDefault(); send(text); }} className="flex items-center gap-2 rounded-full bg-white p-1.5">
          <span className="flex h-11 w-11 items-center justify-center text-ink-muted"><Icon name="paperclip" size={20} /></span>
          <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Ask anything…" aria-label="Message" className="min-w-0 flex-1 bg-transparent text-[16px] outline-none" />
          <button type="submit" aria-label="Send" className="flex h-12 w-12 items-center justify-center rounded-full bg-ink text-white"><Icon name="arrow-up-send" size={20} /></button>
        </form>
      </div>
    </main>
  );
}
function PlanCard({ m, onAdd }: { m: ChatMessage; onAdd: () => void }) {
  const b = m.block as StudyPlanBlock;
  const c = SUBJ[colorOf(b.subjectId ?? 'se')];
  return (
    <div className="w-full rounded-[26px] bg-white p-4">
      <p className="mb-2 font-semibold">{b.title}</p>
      <div className="flex flex-col gap-2">{b.sessions.map((s) => <div key={s.date + s.topic} className={`flex items-center justify-between gap-3 rounded-full px-4 py-2.5 text-[14px] ${c.fill} ${c.text}`}><span><b>{fmtShort(s.date)}</b> · {s.topic}</span><span className="flex-none font-semibold">{s.hours}h</span></div>)}</div>
      <button type="button" onClick={onAdd} disabled={m.added} className={`mt-3 h-12 w-full rounded-full text-[15px] font-semibold ${m.added ? 'bg-dds-fill text-dds-text' : 'bg-ink text-white'}`}>{m.added ? '✓ Added to calendar' : 'Add to calendar'}</button>
    </div>
  );
}
function ChartCard({ b }: { b: ChartBlock }) {
  return (
    <div className="w-full rounded-[26px] bg-white p-4">
      <p className="font-semibold">{b.title}</p>
      <div className="h-[170px]" role="img" aria-label={b.data.map((d) => `${d.label} ${d.value}${b.unit ?? ''}`).join(', ')}>
        <ResponsiveContainer><BarChart data={b.data} margin={{ top: 22, bottom: 0 }}>
          <XAxis dataKey="label" axisLine={false} tickLine={false} />
          <Bar dataKey="value" radius={[12, 12, 12, 12]} animationDuration={800}>
            {b.data.map((d) => <Cell key={d.label} fill={SUBJ[colorOf(d.subjectId ?? 'se')].markHex} />)}
            <LabelList dataKey="value" position="top" formatter={(v: unknown) => `${v}${b.unit ?? ""}`} />
          </Bar>
        </BarChart></ResponsiveContainer>
      </div>
    </div>
  );
}

/* ---------- 12 PDF reader ---------- */
const PAGES = (name: string): { h: string; lines: string[] }[] => [
  { h: 'Overview', lines: [`${name.replace(/\.pdf$/i, '').replace(/_/g, ' ')}`, 'This is a sample page. Real PDF rendering (react-pdf) arrives once files are stored on device.', 'Skim the headings first, then read slowly.'] },
  { h: 'Key ideas', lines: ['Break the topic into three or four ideas.', 'Write each one in your own words.', 'Say it out loud as if teaching a friend.'] },
  { h: 'Worked example', lines: ['Pick one small example and walk through it step by step.', 'Note where you hesitate — that is the part to revise.', 'Come back to it tomorrow.'] },
  { h: 'Common mistakes', lines: ['Mixing up similar terms.', 'Skipping the base case.', 'Memorising without understanding.'] },
  { h: 'Practice', lines: ['Try two questions without looking.', 'Check your answers, then mark what to revisit.', 'Short sessions beat long ones.'] },
  { h: 'Summary', lines: ['You have covered the main ideas.', 'Rest well — sleep helps it stick.', 'Nicely done.'] },
];
export function PdfReader() {
  const { id } = useParams();
  const [sp] = useSearchParams();
  const nav = useNavigate();
  const { state, update } = useStore();
  const m = state.materials.find((x) => x.id === id);
  const reduce = useReducedMotion();
  const pages = PAGES(m?.name ?? 'Notes.pdf');
  const total = pages.length;
  const prog = state.pdf[id ?? ''] ?? { page: 1, highlights: {} };
  const [page, setPage] = useState(Math.min(total, Math.max(1, Number(sp.get('p')) || prog.page)));
  const [dir, setDir] = useState(1);
  const [hl, setHl] = useState(false);
  const finished = page === total;
  const save = (p: number, extra: Partial<typeof prog> = {}) => update((x) => ({ ...x, pdf: { ...x.pdf, [id!]: { ...prog, page: p, ...extra } } }));
  const go = (p: number) => { if (p < 1 || p > total) return; setDir(p > page ? 1 : -1); setPage(p); save(p, p === total ? { finished: true } : {}); if (p === total && !prog.finished && !reduce) celebrate({ x: 0.5, y: 0.6 }); };
  const toggleLine = (i: number) => { if (!hl) return; const cur = prog.highlights[page] ?? []; save(page, { highlights: { ...prog.highlights, [page]: cur.includes(i) ? cur.filter((x) => x !== i) : [...cur, i] } }); };
  if (!m) return <Page><p className="pt-32">That file isn’t here any more.</p></Page>;
  const pct = ((page - 1) / (total - 1)) * 100;
  const sj = state.subjects.find((s) => s.id === m.subjectId);
  return (
    <Page>
      <div className="flex items-center gap-3 pt-[60px]">
        <IconButton icon="chevron-left" label="Back" onClick={() => nav(-1)} />
        <div className="min-w-0 flex-1"><p className="truncate font-semibold">{m.name}</p><p className="text-sm text-ink-muted">{sj?.name} · {m.isSample ? 'sample PDF' : 'PDF'}</p></div>
        <motion.button type="button" aria-label="Highlighter" aria-pressed={hl} onClick={() => setHl(!hl)} whileTap={{ scale: 0.92 }} className={`flex h-14 w-14 items-center justify-center rounded-full ${hl ? 'bg-ink text-white' : 'bg-white'}`}><Icon name="highlighter" /></motion.button>
      </div>
      <div className="mt-5 flex items-center gap-3">
        <div className="relative h-2 flex-1 rounded-full bg-track">
          <span className="ep-progress-fill absolute inset-y-0 left-0 rounded-full bg-ink" style={{ width: `${pct}%` }} />
          <span className="ep-rocket absolute top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-card" style={{ left: `min(${pct}%, calc(100% - 28px))` }}><Icon name="rocket" size={16} /></span>
        </div>
        <span className="text-sm font-semibold text-ink-muted">{page} / {total}</span>
      </div>
      <div className="relative mt-5 min-h-[400px]">
        <AnimatePresence mode="wait" custom={dir} initial={false}>
          <motion.article key={page} custom={dir} variants={pageTurn} initial="enter" animate="center" exit="exit" className="min-h-[400px] rounded-panel bg-white p-7 shadow-sheet">
            <p className="text-sm font-semibold text-ink-subtle">Page {page}</p>
            <h2 className="mb-4 mt-1 text-section">{pages[page - 1].h}</h2>
            {pages[page - 1].lines.map((l, i) => (
              <p key={i} onClick={() => toggleLine(i)} className={`mb-3 rounded-lg px-1 text-[17px] leading-relaxed transition-colors ${hl ? 'cursor-pointer' : ''} ${(prog.highlights[page] ?? []).includes(i) ? 'bg-[#E9DFF7]' : ''}`}>{l}</p>
            ))}
          </motion.article>
        </AnimatePresence>
      </div>
      <AnimatePresence>
        {finished && (
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="ep-cheer mt-4 rounded-panel bg-se-fill p-5 text-se-text"><p className="text-lg font-semibold text-ink">{micro.pdf.finished}</p><p>{micro.pdf.finishedSub}</p><button type="button" onClick={() => nav('/assistant')} className="mt-3 h-12 rounded-full bg-ink px-6 text-[15px] font-semibold text-white">Yes, quiz me</button></motion.div>
        )}
      </AnimatePresence>
      <div className="mt-4 flex gap-2 overflow-x-auto pb-2">{pages.map((_, i) => <button key={i} type="button" aria-label={`Go to page ${i + 1}`} aria-current={page === i + 1} onClick={() => go(i + 1)} className={`flex h-20 w-14 flex-none items-end justify-center rounded-xl bg-white pb-1 text-xs text-ink-muted ${page === i + 1 ? 'border-2 border-ink' : 'border border-line'}`}>{i + 1}</button>)}</div>
      <div className="mt-3 flex items-center gap-3">
        <IconButton icon="chevron-left" label="Previous page" onClick={() => go(page - 1)} />
        <button type="button" onClick={() => nav('/assistant')} className="flex h-14 flex-1 items-center justify-center gap-2 rounded-full bg-ink font-semibold text-white"><Icon name="sparkle" size={18} />Ask about this page</button>
        <IconButton icon="chevron-right" label="Next page" onClick={() => go(page + 1)} />
      </div>
    </Page>
  );
}
export { illo };
