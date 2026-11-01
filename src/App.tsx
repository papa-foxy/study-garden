import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { subjectById, subjects, topicById, topicsFor, type BeforeAfter, type Question, type Subject, type Topic } from './content'
import MindMap from './MindMap'
import './App.css'

const Demo = lazy(() => import('./Demos'))
const MarkdownContent = lazy(() => import('./MarkdownContent'))

type Progress = Record<string, 'learning' | 'learned'>
type Route = { page: 'library' } | { page: 'subject'; subjectId: string; topicId?: string } | { page: 'topic'; topicId: string }

function readProgress(): Progress {
  try { return JSON.parse(localStorage.getItem('study-progress') || '{}') as Progress } catch { return {} }
}
function routeFromHash(): Route {
  const hash = window.location.hash.replace(/^#\/?/, '')
  if (!hash) return { page: 'library' }
  if (hash.startsWith('topic/')) return { page: 'topic', topicId: decodeURIComponent(hash.slice(6).split('?')[0]) }
  const [path, query] = hash.split('?')
  const subjectId = decodeURIComponent(path.replace(/^subject\//, ''))
  if (subjectById.has(subjectId)) return { page: 'subject', subjectId, topicId: new URLSearchParams(query || '').get('topic') || undefined }
  return { page: 'library' }
}
function go(hash: string) { window.location.hash = hash }
function progressCount(subjectId: string, progress: Progress) {
  const list = topicsFor(subjectId)
  return list.length ? Math.round(list.filter((topic) => progress[topic.id] === 'learned').length / list.length * 100) : 0
}

function App() {
  const [route, setRoute] = useState<Route>(routeFromHash)
  const [progress, setProgress] = useState<Progress>(readProgress)
  const [theme, setTheme] = useState(() => localStorage.getItem('study-theme') || 'light')
  const [fontScale, setFontScale] = useState(() => Number(localStorage.getItem('study-font-scale') || 1))
  const [search, setSearch] = useState('')

  useEffect(() => { const update = () => setRoute(routeFromHash()); window.addEventListener('hashchange', update); return () => window.removeEventListener('hashchange', update) }, [])
  useEffect(() => { localStorage.setItem('study-progress', JSON.stringify(progress)) }, [progress])
  useEffect(() => { localStorage.setItem('study-theme', theme); document.documentElement.dataset.theme = theme }, [theme])
  useEffect(() => { localStorage.setItem('study-font-scale', String(fontScale)); document.documentElement.style.setProperty('--font-scale', String(fontScale)) }, [fontScale])

  const setStatus = (id: string, value: Progress[string]) => setProgress((current) => ({ ...current, [id]: value }))
  const topic = route.page === 'topic' ? topicById.get(route.topicId) : route.page === 'subject' && route.topicId ? topicById.get(route.topicId) : undefined
  const subject = route.page === 'subject' ? subjectById.get(route.subjectId) : topic ? subjectById.get(topic.subjectId) : undefined

  return <div className={`app-shell ${route.page === 'subject' ? 'mindmap-route' : ''}`}>
    <header className="topbar">
      <button className="brand" onClick={() => go('#/')} aria-label="Go to library"><span className="brand-mark">✳</span><span>Study garden</span></button>
      <nav className="topnav" aria-label="Main navigation">
        <button className={!subject ? 'nav-item active' : 'nav-item'} onClick={() => go('#/')}>Library</button>
        {subject && <button className="nav-item active" onClick={() => go(`#/subject/${subject.id}`)}>{subject.name}</button>}
      </nav>
      <div className="top-actions">
        <button className="icon-button" title="Decrease text size" aria-label="Decrease text size" onClick={() => setFontScale((n) => Math.max(.9, +(n - .05).toFixed(2)))}>A−</button>
        <button className="icon-button" title="Increase text size" aria-label="Increase text size" onClick={() => setFontScale((n) => Math.min(1.15, +(n + .05).toFixed(2)))}>A+</button>
        <button className="icon-button theme-toggle" title="Toggle color theme" aria-label="Toggle color theme" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>{theme === 'dark' ? '☼' : '☾'}</button>
      </div>
    </header>
    <main className="main-content">
      {route.page === 'library' && <Library progress={progress} search={search} setSearch={setSearch} />}
      {route.page === 'subject' && subject && <SubjectPage subject={subject} selected={topic} progress={progress} setStatus={setStatus} />}
      {route.page === 'topic' && topic && subject && <TopicPage topic={topic} subject={subject} progress={progress} setStatus={setStatus} />}
      {((route.page === 'topic' && !topic) || (route.page === 'subject' && !subject)) && <div className="empty-state"><span>☁</span><h1>We couldn’t find that page.</h1><button className="button primary" onClick={() => go('#/')}>Back to library</button></div>}
    </main>
    <footer className="footer"><span>Small steps make strong roots.</span><span>Made for one learner</span></footer>
  </div>
}

function Library({ progress, search, setSearch }: { progress: Progress; search: string; setSearch: (v: string) => void }) {
  const query = search.trim().toLowerCase()
  const filtered = subjects.filter((subject) => `${subject.name} ${subject.description} ${topicsFor(subject.id).map((t) => t.title).join(' ')}`.toLowerCase().includes(query))
  const learnedTotal = subjects.reduce((n, subject) => n + topicsFor(subject.id).filter((t) => progress[t.id] === 'learned').length, 0)
  const topicTotal = subjects.reduce((n, subject) => n + topicsFor(subject.id).length, 0)
  return <div className="library-page">
    <section className="welcome-row">
      <div><p className="eyebrow">YOUR PERSONAL STUDY SPACE</p><h1>A little progress, <em>every day.</em></h1><p className="intro-copy">Follow the connections. See an idea change. Learn at your own pace.</p></div>
      <div className="daily-card"><span className="daily-sun">✳</span><div><strong>{learnedTotal} of {topicTotal}</strong><span>topics learned</span></div><div className="daily-progress"><i style={{ width: `${topicTotal ? learnedTotal / topicTotal * 100 : 0}%` }} /></div></div>
    </section>
    <section className="section-heading"><div><p className="eyebrow">YOUR LIBRARY</p><h2>Choose a subject</h2></div><div className="search-box"><span>⌕</span><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search subjects and topics" aria-label="Search all subjects and topics" />{search && <button onClick={() => setSearch('')} aria-label="Clear search">×</button>}</div></section>
    <div className="subject-grid">{filtered.map((subject, index) => <SubjectCard key={subject.id} subject={subject} progress={progress} index={index} />)}</div>
    {filtered.length === 0 && <p className="no-results">No subjects or topics match “{search}”. Try another search.</p>}
    <section className="library-note"><div className="note-icon">✦</div><div><strong>Learning works better when ideas connect.</strong><p>Open a subject map to see how each topic fits into the bigger picture.</p></div><span className="note-decoration">↗</span></section>
  </div>
}

function SubjectCard({ subject, progress, index }: { subject: Subject; progress: Progress; index: number }) {
  const pct = progressCount(subject.id, progress)
  const total = topicsFor(subject.id).length
  const firstUnlearned = (topicById.get(subject.rootTopic) && progress[subject.rootTopic] !== 'learned' ? topicById.get(subject.rootTopic) : undefined) || topicsFor(subject.id).find((topic) => progress[topic.id] !== 'learned')
  return <article className={`subject-card card-${index % 2}`} style={{ '--subject-color': subject.color } as React.CSSProperties}>
    <div className="card-top"><span className="subject-icon">{subject.type === 'language' ? 'Aa' : '◉'}</span><span className="card-type">{subject.type}</span><button className="more-button" aria-label={`More about ${subject.name}`}>···</button></div>
    <p className="eyebrow">{subject.type === 'language' ? 'LANGUAGE' : 'SCIENCE'}</p><h3>{subject.name}</h3><p className="subject-description">{subject.description}</p>
    <div className="card-progress-label"><span>Progress</span><strong>{pct}%</strong></div><div className="progress-track"><i style={{ width: `${pct}%` }} /></div>
    <div className="card-bottom"><span>{total} topics <span className="dot-separator">·</span> {topicsFor(subject.id).filter((t) => progress[t.id] === 'learned').length} learned</span><button className="continue-button" onClick={() => go(`#/subject/${subject.id}${firstUnlearned ? `?topic=${firstUnlearned.id}` : ''}`)}>Continue <span>↗</span></button></div>
  </article>
}

function SubjectPage({ subject, selected, progress, setStatus }: { subject: Subject; selected?: Topic; progress: Progress; setStatus: (id: string, value: Progress[string]) => void }) {
  const selectTopic = (id?: string) => go(`#/subject/${subject.id}${id ? `?topic=${encodeURIComponent(id)}` : ''}`)
  return <div className="subject-page" style={{ '--subject-color': subject.color } as React.CSSProperties}>
    <div className={`map-workspace ${selected ? 'has-panel' : ''}`}>
      <MindMap subject={subject} selected={selected} progress={progress} onSelect={selectTopic} />
      {selected && <DetailPanel topic={selected} subject={subject} progress={progress} setStatus={setStatus} onClose={() => selectTopic()} onSelect={selectTopic} />}
    </div>
  </div>
}

function DetailPanel({ topic, subject, progress, setStatus, onClose, onSelect }: { topic: Topic; subject: Subject; progress: Progress; setStatus: (id: string, value: Progress[string]) => void; onClose: () => void; onSelect: (id?: string) => void }) {
  const siblings = topicsFor(subject.id)
  const index = siblings.findIndex((t) => t.id === topic.id)
  return <aside className="detail-panel" aria-label={`Details for ${topic.title}`}>
    <div className="panel-head"><div><span className="panel-label">TOPIC DETAILS</span><p className="breadcrumb">{subject.name} <span>›</span> {topic.title}</p></div><button className="close-button" onClick={onClose} aria-label="Close topic details">×</button></div>
    <div className="panel-content"><p className="eyebrow">{subject.name.toUpperCase()}</p><h2>{topic.title}</h2>{topic.oneLine && <p className="one-line">{topic.oneLine}</p>}
      {topic.beforeAfter && <BeforeAfterViewer key={topic.id} data={topic.beforeAfter} compact />}
      <TopicDetailsAccordion topic={topic} subject={subject} onSelect={onSelect} />
    </div>
    <div className="panel-footer"><button className="button secondary" onClick={() => siblings[index - 1] && onSelect(siblings[index - 1].id)} disabled={index <= 0}>← Previous</button><button className="button primary" onClick={() => setStatus(topic.id, progress[topic.id] === 'learned' ? 'learning' : 'learned')}>{progress[topic.id] === 'learned' ? '✓ Learned' : 'Mark learned'}</button><button className="button secondary" onClick={() => siblings[index + 1] && onSelect(siblings[index + 1].id)} disabled={index < 0 || index >= siblings.length - 1}>Next →</button><button className="open-full" onClick={() => go(`#/topic/${topic.id}`)}>Open full page ↗</button></div>
  </aside>
}

function TopicPage({ topic, subject, progress, setStatus }: { topic: Topic; subject: Subject; progress: Progress; setStatus: (id: string, value: Progress[string]) => void }) {
  const list = topicsFor(subject.id)
  const index = list.findIndex((t) => t.id === topic.id)
  return <article className="topic-page" style={{ '--subject-color': subject.color } as React.CSSProperties}>
    <div className="topic-page-head"><div><button className="back-link" onClick={() => go(`#/subject/${subject.id}?topic=${topic.id}`)}>← Back to map</button><div className="breadcrumb">{subject.name} <span>›</span> {topic.title}</div><h1>{topic.title}</h1>{topic.oneLine && <p className="one-line">{topic.oneLine}</p>}</div><div className="prev-next"><button className="button secondary" disabled={index <= 0} onClick={() => list[index - 1] && go(`#/topic/${list[index - 1].id}`)}>← Previous</button><button className="button secondary" disabled={index === list.length - 1} onClick={() => list[index + 1] && go(`#/topic/${list[index + 1].id}`)}>Next →</button></div></div>
    {topic.beforeAfter && <BeforeAfterViewer key={topic.id} data={topic.beforeAfter} />}
    <div className="topic-content-grid"><div className="topic-main-column"><TopicDetailsAccordion topic={topic} subject={subject} onSelect={(id) => go(`#/topic/${id}`)} full />
    </div><aside className="topic-aside"><p className="eyebrow">YOUR PROGRESS</p><div className="aside-progress-icon">{progress[topic.id] === 'learned' ? '✓' : '✳'}</div><h3>{progress[topic.id] === 'learned' ? 'Topic learned' : 'Keep going'}</h3><p>Understanding grows each time you recall and connect an idea.</p><button className="button primary full-width" onClick={() => setStatus(topic.id, progress[topic.id] === 'learned' ? 'learning' : 'learned')}>{progress[topic.id] === 'learned' ? 'Mark as learning' : 'Mark as learned'}</button><button className="button secondary full-width" onClick={() => go(`#/subject/${subject.id}?topic=${topic.id}`)}>View in mind map</button></aside></div>
  </article>
}

function BeforeAfterViewer({ data, compact = false }: { data: BeforeAfter; compact?: boolean }) {
  if (data.type === 'visual-example') return <VisualExample data={data} compact={compact} />
  if (data.type === 'text-compare') return <section className={`before-after ${compact ? 'compact' : ''}`}><div className="compare-grid"><CompareSide label="Before" items={data.before} caption={data.beforeCaption} /><CompareSide label="After" items={data.after} caption={data.afterCaption} /></div></section>
  if (data.type === 'steps') return <section className={`before-after ${compact ? 'compact' : ''}`}><div className="steps-viewer">{data.steps.map((step, index) => <div className="step-card" key={step.title}><span className="step-number">{String(index + 1).padStart(2, '0')}</span><div><h3>{step.title}</h3><p>{step.text}</p></div></div>)}</div></section>
  if (data.type === 'svg-component') return <section className={`before-after ${compact ? 'compact' : ''}`}><div className="compare-grid"><div className="compare-side"><strong>{data.before.title}</strong><p>f(x) = {data.before.slope}x + {data.before.intercept}</p></div><div className="compare-side positive"><strong>{data.after.title}</strong><p>f(x) = {data.after.slope}x + {data.after.intercept}</p></div></div></section>
  return <section className={`before-after ${compact ? 'compact' : ''}`}><div className="compare-grid"><div className="compare-side"><img src={data.before} alt={data.beforeAlt || 'Before'} /><p>{data.beforeCaption}</p></div><div className="compare-side positive"><img src={data.after} alt={data.afterAlt || 'After'} /><p>{data.afterCaption}</p></div></div></section>
}

function CompareSide({ label, items, caption }: { label: string; items: string[]; caption?: string }) { return <div className="compare-side"><span className="compare-label">{label}</span><div className="text-example">{items.map((item) => <p key={item}>{item}</p>)}</div>{caption && <p className="compare-caption">{caption}</p>}</div> }

function VisualExample({ data, compact }: { data: Extract<BeforeAfter, { type: 'visual-example' }>; compact: boolean }) {
  const [position, setPosition] = useState(50)
  const [animating, setAnimating] = useState(false)
  const [stepIndex, setStepIndex] = useState(-1)
  const [w, setW] = useState(1.5)
  const [b, setB] = useState(0)
  const [alpha, setAlpha] = useState(.1)
  const [ballRight, setBallRight] = useState(true)
  const timer = useRef<number | undefined>(undefined)
  useEffect(() => () => window.cancelAnimationFrame(timer.current || 0), [])
  const apply = () => {
    window.cancelAnimationFrame(timer.current || 0)
    if (data.kind === 'model-and-parameters') { setW(1.5); setB(0) }
    setPosition(0)
    setAnimating(true)
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) { setPosition(100); setAnimating(false); return }
    const started = performance.now()
    const frame = (now: number) => {
      const progress = Math.min(1, (now - started) / 1500)
      setPosition(Math.round(progress * 100))
      if (progress < 1) timer.current = requestAnimationFrame(frame) as unknown as number
      else setAnimating(false)
    }
    timer.current = requestAnimationFrame(frame) as unknown as number
  }
  const setPositionFromControl = (value: number) => { window.cancelAnimationFrame(timer.current || 0); setAnimating(false); setStepIndex(-1); setPosition(value) }
  const setSide = (side: 'before' | 'after') => { setPositionFromControl(side === 'before' ? 0 : 100); if (side === 'after' && data.kind === 'model-and-parameters') { setW(1.5); setB(0) } }
  return <section className={`before-after visual-example ${compact ? 'compact' : ''}`}>
    <div className="visual-controls"><div className="side-toggle" role="group" aria-label="Choose example state"><button className={position === 0 ? 'selected' : ''} onClick={() => setSide('before')}>Before</button><button className={position === 100 ? 'selected' : ''} onClick={() => setSide('after')}>After</button></div><button className="button primary apply-button" onClick={apply} disabled={animating}>{animating ? 'Applying…' : '▶ Apply it'}</button>{data.steps && <button className={`step-through ${stepIndex >= 0 ? 'active' : ''}`} onClick={() => { setStepIndex(stepIndex >= 0 ? -1 : 0); setPosition(stepIndex >= 0 ? 50 : 0) }}>Step through</button>}</div>
    <div className="example-stage"><svg viewBox="0 0 760 300" role="img" aria-label={`Before and after example: ${data.beforeCaption} ${data.afterCaption}`}>
      <defs><clipPath id={`example-reveal-${data.kind}`}><rect x={760 * (1 - position / 100)} y="0" width={760 * position / 100} height="300" /></clipPath></defs>
      <rect x="0" y="0" width="760" height="300" rx="18" className="scene-bg" />
      <Scene kind={data.kind} after={false} w={w} b={b} alpha={alpha} ballRight={ballRight} />
      <g clipPath={`url(#example-reveal-${data.kind})`}><Scene kind={data.kind} after w={w} b={b} alpha={alpha} ballRight={ballRight} /></g>
      <path d={`M ${760 * position / 100} 0V300`} className="reveal-line" />
      {position > 3 && position < 97 && <circle cx={760 * position / 100} cy="150" r="15" className="reveal-handle" />}
    </svg><span className="scene-label before" style={{ opacity: 1 - position / 120 }}>Before</span><span className="scene-label after" style={{ opacity: position / 100 }}>After</span></div>
    <input className="example-range" aria-label="Drag to compare before and after" type="range" min="0" max="100" value={position} onChange={(event) => setPositionFromControl(Number(event.target.value))} />
    {data.kind === 'model-and-parameters' && <div className="parameter-controls"><label>w <input aria-label="Set model slope w" type="range" min="0" max="1.5" step="0.01" value={w} onChange={(event) => setW(Number(event.target.value))} /><output>{w.toFixed(2)}</output></label><label>b <input aria-label="Set model intercept b" type="range" min="-50" max="60" step="1" value={b} onChange={(event) => setB(Number(event.target.value))} /><output>{b}</output></label></div>}
    {data.kind === 'learning-rate' && <div className="parameter-controls"><label>α <input aria-label="Set learning rate alpha" type="range" min="0.01" max="1.2" step="0.01" value={alpha} onChange={(event) => setAlpha(Number(event.target.value))} /><output>{alpha.toFixed(2)}</output></label></div>}
    {data.kind === 'slope-intuition' && <div className="start-toggle"><span>Start point</span><button className={ballRight ? 'selected' : ''} onClick={() => setBallRight(true)}>Right of minimum</button><button className={!ballRight ? 'selected' : ''} onClick={() => setBallRight(false)}>Left of minimum</button></div>}
    {stepIndex >= 0 && <div className="step-through-controls"><span>Step {stepIndex + 1} of 4</span><button onClick={() => { const next = Math.max(0, stepIndex - 1); setStepIndex(next); setPosition(next * 100 / 3) }}>← Previous</button><button onClick={() => { const next = (stepIndex + 1) % 4; setStepIndex(next); setPosition(next * 100 / 3) }}>Next →</button></div>}
    {stepIndex >= 0 && <p className="step-caption">{stepCopy(data.kind, stepIndex)}</p>}
    <p className="what-changed">{data.whatChanged}</p><p className="what-notice">{data.whatToNotice}</p>
  </section>
}

function stepCopy(kind: string, step: number) {
  const steps: Record<string, string[]> = {
    'gradient-descent': ['Start from the initial parameter values.', 'Measure the current cost and its slope.', 'Update w and b opposite their slopes.', 'Repeat until the cost is low and the line fits.'],
    'update-rule': ['Start with w = 0.5.', 'Read the slope: −2.', 'Multiply by the learning rate: 0.1 × (−2).', 'Subtract that product: w becomes 0.7.'],
    'learning-rate': ['All three runs begin at the same parameter.', 'Tiny alpha takes a short step.', 'A useful alpha moves toward the bottom.', 'An oversized alpha can jump past the minimum.'],
    'batch-gradient-descent': ['Choose a training row.', 'Add information from more rows.', 'Average the gradient across all m rows.', 'Use that batch gradient for one update.'],
  }
  return steps[kind]?.[step] || ''
}

function Scene({ kind, after, w, b, alpha, ballRight }: { kind: string; after: boolean; w: number; b: number; alpha: number; ballRight: boolean }) {
  const ink = after ? '#216d50' : '#9b745f', soft = after ? '#d8eee2' : '#f1dfd2', pale = after ? '#edf7f0' : '#fbf2ed'
  const dot = (x: number, y: number, key: string | number, r = 7, color = ink) => <circle key={key} cx={x} cy={y} r={r} fill={color} />
  const label = (x: number, y: number, value: string, size = 15, color = '#37443b', weight = 500) => <text key={`${x}-${y}-${value}`} x={x} y={y} fontSize={size} fill={color} fontWeight={weight}>{value}</text>
  const line = (d: string, color = ink, width = 4, dash = '') => <path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeDasharray={dash || undefined} />
  const points = [[150,216],[210,192],[280,167],[350,145],[420,111],[495,91],[570,69],[635,50]]
  const axes = <g>{line('M 95 42V245H672','#aeb7ae',2)}{line('M 95 204H672M95 157H672M95 110H672M95 63H672','#dce3dc',1,'4 6')}{label(52,56,'Price',14,'#68746b')}{label(640,273,'Size',14,'#68746b')}</g>
  if (kind === 'ml-week-one' || kind === 'applications') return <g>{label(60,43,kind === 'ml-week-one' ? '10 incoming messages' : 'Inbox · 10 messages',18)}{Array.from({length:10},(_,i)=><g key={i}><rect x="70" y={64+i*20} width="620" height="16" rx="5" fill={i<(after?9:6)?soft:'#f5f5f1'} stroke="#e4e8e2"/>{label(83,77+i*20, i%3===0?'Prize claim':i%3===1?'Project update':'Invoice attached',12,'#566158')}{label(610,77+i*20,i<(after?9:6)?'SPAM':'INBOX',12,i<(after?9:6)?ink:'#768078',700)}</g>)}{label(590,284,after?'9 of 10 caught':'6 of 10 caught',15,ink,700)}</g>
  if (kind === 'supervised-learning') return <g><rect x="91" y="47" width="580" height="202" rx="12" fill={pale} stroke="#dce3dc"/>{['House','Size x','Price y'].map((t,i)=>label(132+i*180,80,t,15,'#657168',700))}{[1,2,3,4].map((r)=><g key={r}><line x1="106" y1={90+r*34} x2="656" y2={90+r*34} stroke="#e1e7e1"/>{[String(r),`${850+r*250} sq ft`,after?`$${125+r*38}k`:'?'].map((t,c)=>label(140+c*180,113+r*34,t,15,c===2&&after?ink:'#404b43',c===2&&after?700:500))}</g>)}{label(170,280,after?'new house · 1,500 sq ft → $220k':'new house · 1,500 sq ft → ?',14,ink,700)}</g>
  if (kind === 'jupyter-notebooks') return <g><rect x="62" y="55" width="636" height="120" rx="13" fill={pale} stroke="#dce3dc"/><rect x="78" y="72" width="44" height="82" rx="8" fill={soft}/>{label(86,103,'In',14,ink,700)}{label(143,105,'house_sizes = [1000, 1250, 1500]',17)}{label(143,136,"print(sum(house_sizes) / len(house_sizes))",17,'#60766a')}{after&&<g><rect x="62" y="188" width="636" height="60" rx="12" fill="#e7f4e9" stroke="#c8dfcf"/>{label(86,224,'Out',14,ink,700)}{label(143,224,'1250.0',18,ink,700)}</g>}{!after&&label(82,224,'Press Shift + Enter to run this cell',14,'#8a7568')}</g>
  if (kind === 'dimensionality-reduction') return <g><rect x="96" y="45" width="568" height="206" rx="12" fill={pale} stroke="#dce3dc"/>{['Customer','Income','Visits',...(after?[]:['Spend'])].map((t,i)=>label(120+i*135,76,t,15,'#657168',700))}{Array.from({length:5},(_,r)=><g key={r}><line x1="112" y1={90+r*30} x2="648" y2={90+r*30} stroke="#e1e7e1"/>{[String(r+1),String(32+r*8),String(2+r),...(after?[]:[String(120+r*35)])].map((t,c)=>label(132+c*135,111+r*30,t,14))}</g>)}{label(504,282,after?'2 useful features':'3 input features',15,ink,700)}</g>
  if (kind === 'training-set-notation') return <g><rect x="85" y="47" width="590" height="205" rx="12" fill={pale} stroke="#dce3dc"/>{['i','x (size)','y (price)'].map((t,i)=>label(120+i*185,78,t,15,'#657168',700))}{[1,2,3,4].map((r)=><g key={r}><line x1="102" y1={89+r*33} x2="657" y2={89+r*33} stroke={r===2?'#8fc3a0':'#e1e7e1'} strokeWidth={r===2?2:1}/>{[String(r),`${1000+r*250} sq ft`,`$${180+r*35}k`].map((t,c)=>label(128+c*185,111+r*33,t,14,r===2?ink:'#404b43',r===2?700:500))}</g>)}{label(466,280,'x⁽²⁾, y⁽²⁾ highlighted',14,ink,700)}</g>
  if (kind === 'batch-gradient-descent') return <g><rect x="90" y="48" width="580" height="204" rx="12" fill={pale} stroke="#dce3dc"/>{['Example','Size x','Price y','Used?'].map((t,i)=>label(112+i*135,80,t,14,'#657168',700))}{[1,2,3,4,5].map((r)=><g key={r}><line x1="106" y1={89+r*28} x2="652" y2={89+r*28} stroke="#e1e7e1"/>{[String(r),`${r*250+800}`,`$${r*35+150}k`,after?'✓':(r===1?'✓':'—')].map((t,c)=>label(124+c*135,108+r*28,t,14,after?ink:(r===1&&c===3?ink:'#685f58'),after?700:(r===1&&c===3?700:500)))}</g>)}{label(486,274,after?'all m rows each step':'one row this step',14,ink,700)}</g>
  if (['classification'].includes(kind)) return <g>{axes}{Array.from({length:14},(_,i)=>{const left=i<7,x=145+(i%4)*48+(i%2)*7,y=205-Math.floor(i/4)*43-(i%3)*13;return <g key={i}>{dot(x,y,i,8,left?'#af765f':'#8999a7')}{after&&<text x={x-4} y={y+4} fontSize="11" fill="white">{left?'○':'×'}</text>}</g>})}{after&&line('M 385 54L385 230','#216d50',3,'7 5')}{dot(438,122,'patient',10,after?'#216d50':'#c59578')}{label(452,126,after?'patient → 1':'new patient ?',13,ink,700)}</g>
  if (['clustering','unsupervised-learning'].includes(kind)) return <g>{Array.from({length:18},(_,i)=>{const x=160+(i%6)*79+Math.sin(i*8)*12,y=95+Math.floor(i/6)*61+Math.cos(i*4)*10;const c=after?['#3d8a64','#4f8ca2','#aa8050'][Math.floor(i/6)]: '#aa907f';return <g key={i}>{dot(x,y,i,8,c)}{after&&<circle cx={x} cy={y} r="21" fill="none" stroke={c} strokeOpacity=".28" strokeWidth="2"/>}</g>})}{after&&['bargain','regular','big spender'].map((t,i)=>label(140+i*198,266,t,14,['#3d8a64','#4f8ca2','#aa8050'][i],700))}{!after&&label(289,270,'unlabeled customer data',14,'#887364')}</g>
  if (kind === 'anomaly-detection') return <g>{Array.from({length:22},(_,i)=>dot(210+(i%6)*43+Math.sin(i*5)*13,100+Math.floor(i/6)*36+Math.cos(i*3)*12,i,7,'#6d9b7e'))}{dot(after?562:562,57,'odd',10,after?'#c84e45':'#ba805f')}{line('M 490 54L548 57',after?'#c84e45':'#a77a67',2,'5 5')}{label(570,62,after?'SUSPICIOUS':'$4,800 transfer',14,after?'#b5433d':'#856b5b',700)}</g>
  if (kind === 'cost-intuition') return <g>{axes}{label(112,34,'points: (1,1), (2,2), (3,3)',13,'#68746b',600)}{line('M 150 65Q 375 220 620 65','#b9a99e',3)}{line('M 150 132Q 375 245 620 132',after?'#238459':'#ae8069',3)}{dot(after?385:260,after?198:176,'mark',11,after?'#238459':'#ae8069')}{label(410,210,after?'w = 1, J = 0':'w = 0.5, J ≈ 0.58',15,ink,700)}{label(624,273,'w',14)}</g>
  if (kind === 'visualizing-cost') return <g>{[1,2,3,4].map((r)=><ellipse key={r} cx="380" cy="150" rx={r*(after?42:65)} ry={r*(after?25:38)} fill="none" stroke={after?'#69a980':'#c9a999'} strokeWidth="2"/>)}{dot(after?380:534,after?150:79,'mark',10,ink)}{label(after?399:551,after?156:84,after?'low J':'high J',14,ink,700)}{label(302,282,'w',14)}{label(70,75,'b',14)}</g>
  if (kind === 'gradient-descent') return <g>{axes}{line('M 122 73Q 230 246 380 246Q 528 246 642 69','#93a198',4)}{after&&line('M 175 91Q 225 145 269 186Q 310 218 350 237Q 368 242 380 244','#218255',4)}{dot(after?380:175,after?244:91,'gd',10,ink)}{label(415,88,after?'low cost':'high cost',14,ink,700)}{label(126,276,after?'w → fitted, b → fitted':'w = −0.1, b = 900',14,ink,700)}</g>
  if (kind === 'learning-rate') return <g>{axes}{line('M 122 73Q 230 246 380 246Q 528 246 642 69','#93a198',4)}{line(after?'M 132 72Q 225 225 302 240':'M 132 72Q 175 140 207 175','#be8748',3)}{line(after?'M 132 72Q 310 244 405 244':'M 132 72Q 220 184 300 230','#4e9c71',3)}{line(after?(alpha>0.7?'M 132 72Q 615 30 558 79':'M 132 72Q 410 230 500 200'):'M 132 72Q 445 225 620 65','#a35a5a',3)}{label(390,280,`α = ${alpha.toFixed(2)} · step 10`,14,ink,700)}</g>
  if (kind === 'slope-intuition') { const startX = ballRight ? 526 : 232; return <g>{axes}{line('M 125 62Q 378 252 635 62','#9f887a',4)}{dot(after?380:startX,after?246:111,'ball',13,ink)}{after&&line(ballRight?'M 514 112Q 472 158 430 201':'M 246 108Q 288 156 330 201','#287f54',3,'6 5')}{label(ballRight?532:129,107,after?'one step toward minimum':(ballRight?'positive slope':'negative slope'),14,ink,700)}{label(330,282,'parameter w',14,'#68746b')}</g> }
  if (kind === 'convexity') return <g>{axes}{after?line('M 128 74Q 380 268 634 74','#37865b',5):line('M 128 90Q 220 140 268 215Q 310 259 353 160Q 400 77 440 189Q 487 258 528 201Q 573 123 634 77','#ae816a',5)}{dot(after?380:310,after?236:257,'start1',9,'#587da0')}{dot(after?380:520,after?236:203,'start2',9,'#9870a4')}{label(after?450:150,276,after?'same global minimum':'different valleys',14,ink,700)}</g>
  if (kind === 'update-rule') return <g><rect x="70" y="60" width="620" height="185" rx="17" fill={pale} stroke="#dce3dc"/>{label(112,104,'w before',15,'#69746c',700)}{label(112,150,'w := w − α × slope',18,'#37443b')}{label(112,207,after?'0.5 − 0.1 × (−2) = 0.7':'0.5    α = 0.1    slope = −2',20,ink,700)}{after&&line('M 357 222H519','#257a50',4)}{after&&label(543,227,'w after',15,ink,700)}</g>
  if (kind === 'model-and-parameters') { const y0 = 220 - b * .8, y1 = y0 - w * 115; return <g>{axes}{Array.from({length:8},(_,i)=>dot(points[i][0],points[i][1],i,7,'#8c9d9a'))}{line(after?`M 128 ${Math.max(42,Math.min(235,y0))}L640 ${Math.max(42,Math.min(235,y1))}`:'M 128 178L640 178',after?'#258454':'#b58a73',5)}{label(436,after?96:163,after?`w = ${w.toFixed(2)}, b = ${b}`:'w = 0, b = 0',14,ink,700)}</g> }
  if (kind === 'cost-function') {
    const fittedY = (x: number) => 224 - (x - 128) * .355
    const poorY = (x: number) => 204 - (x - 128) * .035
    return <g>{axes}
      {points.map(([x, y], i) => <line key={`residual-${i}`} x1={x} y1={y} x2={x} y2={after ? fittedY(x) : poorY(x)} stroke={after ? '#71a58a' : '#c58c79'} strokeWidth="1.7" strokeDasharray="3 3"/>)}
      {line(after ? 'M 128 224L640 42' : 'M 128 204L640 186', after ? '#238253' : '#b58a73', 5)}
      {points.map(([x, y], i) => dot(x, y, i, 7, '#718e85'))}
      {!after&&<g><rect x="119" y="18" width="196" height="38" rx="9" fill="#f7f0ed" stroke="#e7d6ce"/>{label(134,42,'J(w,b) = 12.8 · high',14,'#855a49',700)}</g>}
      {after&&<g><rect x="478" y="216" width="208" height="38" rx="9" fill="#edf6ef" stroke="#c9dfcf"/>{label(494,240,'J(w,b) = 0.42 · low',14,'#216d50',700)}</g>}
    </g>
  }
  if (kind === 'linear-regression' || kind === 'regression') return <g>{axes}{Array.from({length:8},(_,i)=>dot(points[i][0],points[i][1],i,7,'#718e85'))}{after&&line('M 128 221L640 43','#238253',5)}{!after&&dot(607,58,'unknown',10,'#bd8b71')}{!after&&label(617,53,'?',18,'#8d624d',700)}{after&&dot(607,58,'predicted',9,'#238253')}{after&&label(492,83,kind==='regression'?'Predicted $250k':'f(x) = wx + b',15,'#216d50',700)}</g>
  return <g>{axes}{Array.from({length:8},(_,i)=>dot(points[i][0],points[i][1],i,7,'#718e85'))}{after&&line('M 128 221L640 43','#238253',5)}{label(250,278,after?'same example · applied':'same example · starting point',14,ink,700)}</g>
}

function TopicDetailsAccordion({ topic, subject, onSelect, full = false }: { topic: Topic; subject: Subject; onSelect: (id: string) => void; full?: boolean }) {
  const [open, setOpen] = useState('english')
  const available = topicsFor(subject.id)
  const related = available.filter((item) => (topic.related || []).includes(item.id) || (item.related || []).includes(topic.id))
  const isCompareTopic = ['regression', 'classification', 'supervised-learning', 'unsupervised-learning'].includes(topic.id)
  const toggle = (id: string, title: string, children: React.ReactNode) => <section className={`accordion-item ${open === id ? 'open' : ''}`} key={id}><button className="accordion-trigger" aria-expanded={open === id} onClick={() => setOpen(open === id ? '' : id)}><span>{title}</span><span className="accordion-chevron">{open === id ? '−' : '+'}</span></button>{open === id && <div className="accordion-body">{children}</div>}</section>
  return <div className={`topic-accordion ${full ? 'full' : ''}`}>
    {toggle('english', 'In plain English', <>{topic.body && <Suspense fallback={<div className="markdown-loading">Loading notes…</div>}><MarkdownContent markdown={topic.body} /></Suspense>}{topic.vocabulary?.length ? <div className="vocab-list">{topic.vocabulary.map((v) => <div key={v.word}><strong>{v.word}</strong><p>{v.meaning}</p><small>{v.example}</small>{v.translation && <small>{v.translation}</small>}</div>)}</div> : null}</>)}
    {toggle('points', 'Key points', topic.keyPoints?.length ? <KeyPoints points={topic.keyPoints} /> : <p>Use the example above to connect this idea to the rest of the topic map.</p>)}
    {toggle('formula', 'Formula', <>{topic.formula ? <><code className="formula-display">{topic.formula}</code><details className="formula-meaning"><summary>What does each part mean?</summary><p>{topic.formula.split(/[=:+]/).join(' · ')} are the quantities used to express this relationship. See the explanation above for how they fit the example.</p></details></> : <p>No formula is needed for this idea.</p>}{topic.demo && <Suspense fallback={<div className="demo-loading">Opening interactive demo…</div>}><Demo id={topic.demo} large={full} /></Suspense>}</>)}
    {toggle('mistakes', 'Common mistakes', topic.commonMistakes?.length ? <Mistakes mistakes={topic.commonMistakes} /> : <p>Keep the example’s inputs, outputs, and goal distinct.</p>)}
    {toggle('related', isCompareTopic ? 'Compare with' : 'Related topics', related.length ? <div className="related-chips">{related.map((item) => <button key={item.id} onClick={() => onSelect(item.id)}>{item.title} <span>↗</span></button>)}</div> : <p>No related links for this topic.</p>)}
    {toggle('quiz', 'Quick quiz', topic.selfTest?.length ? <Quiz questions={topic.selfTest.slice(0, 3)} compact={!full} /> : <p>Recall the change shown in the visual: what does the idea make possible?</p>)}
  </div>
}
function KeyPoints({ points }: { points: string[] }) { return <section className="detail-section key-points"><p className="eyebrow">KEY POINTS</p><ul>{points.map((point) => <li key={point}><span>✓</span>{point}</li>)}</ul></section> }
function Mistakes({ mistakes }: { mistakes: string[] }) { return <section className="detail-section mistakes"><p className="eyebrow">WATCH FOR</p>{mistakes.map((mistake) => <p key={mistake}><span>!</span>{mistake}</p>)}</section> }
function Quiz({ questions, compact = false }: { questions: Question[]; compact?: boolean }) {
  const [index, setIndex] = useState(0); const [answer, setAnswer] = useState(''); const [revealed, setRevealed] = useState(false); const q = questions[index]
  if (!q) return null
  const next = () => { setIndex((n) => (n + 1) % questions.length); setAnswer(''); setRevealed(false) }
  return <section className={`quiz-card ${compact ? 'compact' : ''}`}><div className="quiz-head"><div><p className="eyebrow">QUICK RECALL</p><h3>Check what you remember</h3></div><span>{index + 1} / {questions.length}</span></div><p className="quiz-prompt">{q.prompt}</p>{q.type === 'multiple-choice' && q.options ? <div className="quiz-options">{q.options.map((option) => <button key={option} className={answer === option ? 'picked' : ''} onClick={() => setAnswer(option)}>{option}</button>)}</div> : <input className="quiz-input" value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Type your answer (optional)" aria-label="Your answer" />}{revealed && <div className="quiz-answer"><strong>Answer: {q.answer}</strong>{q.explanation && <p>{q.explanation}</p>}</div>}<div className="quiz-actions"><button className="button secondary" onClick={() => setRevealed(!revealed)}>{revealed ? 'Hide answer' : 'Reveal answer'}</button><button className="button primary" onClick={next}>Next question →</button></div></section>
}

export default App
