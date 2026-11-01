import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { topicById, topicChildren, topicsFor, type Subject, type Topic } from './content'

type Progress = Record<string, 'learning' | 'learned'>

const NODE_W = 180
const NODE_H = 56
const DEPTH_GAP = 22
const STACK_GAP = 24
const MAP_RELATED_LINKS = new Set([
  'model-and-parameters:cost-function',
  'cost-function:gradient-descent',
  'learning-rate:convexity',
])
type Position = { topic: Topic; x: number; y: number; depth: number; parent?: string }
type Transform = { x: number; y: number; scale: number }
type Size = { width: number; height: number }

function visibleLayout(subjectId: string, rootId: string, collapsed: Set<string>): Position[] {
  const all: Position[] = []
  const crossSpan = (topic: Topic): number => {
    const children = collapsed.has(topic.id) ? [] : topicChildren(subjectId, topic.id)
    if (!children.length) return NODE_H
    const childrenSpan = children.reduce((total, child) => total + crossSpan(child), 0) + STACK_GAP * (children.length - 1)
    return Math.max(NODE_H, childrenSpan)
  }
  const place = (topic: Topic, depth: number, start: number) => {
    const children = collapsed.has(topic.id) ? [] : topicChildren(subjectId, topic.id)
    const span = crossSpan(topic)
    const x = 34 + depth * (NODE_W + DEPTH_GAP) + NODE_W / 2
    const y = start + span / 2
    all.push({ topic, x, y, depth, parent: topic.parent || undefined })
    if (!children.length) return
    const total = children.reduce((value, child) => value + crossSpan(child), 0) + STACK_GAP * (children.length - 1)
    let childStart = start + (span - total) / 2
    for (const child of children) {
      const childSpan = crossSpan(child)
      place(child, depth + 1, childStart)
      childStart += childSpan + STACK_GAP
    }
  }
  const root = topicById.get(rootId)
  if (root?.subjectId === subjectId) place(root, 0, 26)
  return all
}

function nodeColor(topic: Topic): 'purple' | 'teal' | 'gray' {
  const ancestry = new Set<string>()
  let current: Topic | undefined = topic
  while (current) {
    ancestry.add(current.id)
    current = current.parent ? topicById.get(current.parent) : undefined
  }
  if (ancestry.has('cost-function') || ancestry.has('gradient-descent') || ancestry.has('unsupervised-learning')) return 'teal'
  if (ancestry.has('supervised-learning')) return 'purple'
  return 'gray'
}

function shortened(text: string, limit = 29) {
  const value = text.trim()
  return value.length > limit ? `${value.slice(0, limit - 1).trimEnd()}…` : value
}

function nodeColorHex(color: 'purple' | 'teal' | 'gray') {
  return color === 'purple' ? '#8b76aa' : color === 'teal' ? '#529a91' : '#89928f'
}

export default function MindMap({ subject, selected, progress, onSelect }: { subject: Subject; selected?: Topic; progress: Progress; onSelect: (id?: string) => void }) {
  const [collapsed, setCollapsed] = useState<Set<string>>(() => {
    const topics = topicsFor(subject.id)
    const byId = new Map(topics.map((topic) => [topic.id, topic]))
    const depthOf = (topic: Topic) => {
      let depth = 0, current = topic
      while (current.parent && byId.has(current.parent)) { depth += 1; current = byId.get(current.parent)! }
      return depth
    }
    return new Set(topics.filter((topic) => depthOf(topic) >= 2 && topicChildren(subject.id, topic.id).length > 0).map((topic) => topic.id))
  })
  const [focusMode, setFocusMode] = useState(false)
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map')
  const [search, setSearch] = useState('')
  const [canvasSize, setCanvasSize] = useState<Size>({ width: 0, height: 0 })
  const [transform, setTransform] = useState<Transform>({ x: 0, y: 0, scale: 1 })
  const canvasRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const pointerRef = useRef(new Map<number, { x: number; y: number }>())
  const gestureRef = useRef<{ kind: 'pan' | 'pinch'; x: number; y: number; tx: number; ty: number; scale: number; distance: number; midX: number; midY: number } | null>(null)

  const selectedAncestors = useMemo(() => {
    const ancestors = new Set<string>()
    let parent = selected?.parent ? topicById.get(selected.parent) : undefined
    while (parent) { ancestors.add(parent.id); parent = parent.parent ? topicById.get(parent.parent) : undefined }
    return ancestors
  }, [selected])
  const effectiveCollapsed = useMemo(() => new Set([...collapsed].filter((id) => !selectedAncestors.has(id))), [collapsed, selectedAncestors])
  const topics = useMemo(() => visibleLayout(subject.id, subject.rootTopic, effectiveCollapsed), [subject.id, subject.rootTopic, effectiveCollapsed])
  const byId = useMemo(() => new Map(topics.map((item) => [item.topic.id, item])), [topics])
  const allTopics = useMemo(() => topicsFor(subject.id), [subject.id])

  useEffect(() => {
    if (!selected || !topicChildren(subject.id, selected.id).length) return
    // oxlint-disable-next-line react/set-state-in-effect -- Selecting a branch opens it once; its control can collapse it afterward.
    setCollapsed((current) => {
      if (!current.has(selected.id)) return current
      const next = new Set(current)
      next.delete(selected.id)
      return next
    })
  }, [selected, subject.id])
  const parentPath = useMemo(() => {
    const ids = new Set<string>()
    let item = selected
    while (item) { ids.add(item.id); item = item.parent ? topicById.get(item.parent) : undefined }
    return ids
  }, [selected])
  const normalizedSearch = search.trim().toLowerCase()
  const matches = (topic: Topic) => !normalizedSearch || `${topic.title} ${topic.oneLine || ''}`.toLowerCase().includes(normalizedSearch)
  const branchIds = useMemo(() => allTopics.filter((topic) => topicChildren(subject.id, topic.id).length > 0).map((topic) => topic.id), [subject.id, allTopics])

  useEffect(() => {
    const element = canvasRef.current
    if (!element) return
    const observer = new ResizeObserver(([entry]) => setCanvasSize({ width: entry.contentRect.width, height: entry.contentRect.height }))
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  const fit = useCallback((branch?: Topic) => {
    if (!canvasSize.width || !canvasSize.height || !topics.length) return
    const ids = new Set<string>()
    if (branch) {
      const branchDepth = (() => { let depth = 0, current = branch; while (current.parent && topicById.get(current.parent)?.subjectId === subject.id) { depth += 1; current = topicById.get(current.parent)! } return depth })()
      const anchor = branchDepth >= 2 && branch.parent ? topicById.get(branch.parent) || branch : branch
      const addDescendants = (id: string) => { ids.add(id); for (const child of topicChildren(subject.id, id)) addDescendants(child.id) }
      addDescendants(anchor.id)
      let parent = anchor.parent ? topicById.get(anchor.parent) : undefined
      while (parent) { ids.add(parent.id); parent = parent.parent ? topicById.get(parent.parent) : undefined }
    }
    const points = branch ? topics.filter((item) => ids.has(item.topic.id)) : topics
    if (!points.length) return
    const minX = Math.min(...points.map((item) => item.x - NODE_W / 2))
    const maxX = Math.max(...points.map((item) => item.x + NODE_W / 2))
    const minY = Math.min(...points.map((item) => item.y - NODE_H / 2))
    const maxY = Math.max(...points.map((item) => item.y + NODE_H / 2))
    const scale = Math.min((canvasSize.width - 42) / (maxX - minX), (canvasSize.height - 42) / (maxY - minY), 1)
    const bounded = Math.max(.7, scale)
    setTransform({ scale: bounded, x: (canvasSize.width - (minX + maxX) * bounded) / 2, y: (canvasSize.height - (minY + maxY) * bounded) / 2 })
  }, [canvasSize, subject.id, topics])

  useEffect(() => {
    if (!canvasSize.width || !canvasSize.height) return
    const selectedId = selected?.id
    // oxlint-disable-next-line react/set-state-in-effect -- Keep the map viewport aligned with the selected node and measured canvas.
    if (selectedId) fit(selected)
    else fit()
  }, [canvasSize.width, canvasSize.height, topics, selected?.id, selected, fit])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && selected) { event.preventDefault(); onSelect() }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [selected, onSelect])

  const zoomAtCenter = (factor: number) => {
    setTransform((current) => {
      const scale = Math.min(2, Math.max(.7, current.scale * factor))
      const cx = canvasSize.width / 2, cy = canvasSize.height / 2
      const worldX = (cx - current.x) / current.scale, worldY = (cy - current.y) / current.scale
      return { scale, x: cx - worldX * scale, y: cy - worldY * scale }
    })
  }
  const point = (event: React.PointerEvent<SVGSVGElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    return { x: event.clientX - rect.left, y: event.clientY - rect.top }
  }
  const onPointerDown = (event: React.PointerEvent<SVGSVGElement>) => {
    if ((event.target as Element).closest('[data-map-control="true"]')) return
    event.currentTarget.setPointerCapture(event.pointerId)
    pointerRef.current.set(event.pointerId, point(event))
    const values = [...pointerRef.current.values()]
    if (values.length === 1) gestureRef.current = { kind: 'pan', x: values[0].x, y: values[0].y, tx: transform.x, ty: transform.y, scale: transform.scale, distance: 0, midX: 0, midY: 0 }
    else if (values.length >= 2) {
      const [a, b] = values
      gestureRef.current = { kind: 'pinch', x: 0, y: 0, tx: transform.x, ty: transform.y, scale: transform.scale, distance: Math.hypot(a.x - b.x, a.y - b.y), midX: (a.x + b.x) / 2, midY: (a.y + b.y) / 2 }
    }
  }
  const onPointerMove = (event: React.PointerEvent<SVGSVGElement>) => {
    if (!pointerRef.current.has(event.pointerId)) return
    const currentPoint = point(event)
    pointerRef.current.set(event.pointerId, currentPoint)
    const gesture = gestureRef.current
    if (!gesture) return
    const points = [...pointerRef.current.values()]
    if (gesture.kind === 'pan' && points.length === 1) {
      setTransform((current) => ({ ...current, x: gesture.tx + currentPoint.x - gesture.x, y: gesture.ty + currentPoint.y - gesture.y }))
    } else if (gesture.kind === 'pinch' && points.length >= 2) {
      const [a, b] = points
      const distance = Math.hypot(a.x - b.x, a.y - b.y)
      const midX = (a.x + b.x) / 2, midY = (a.y + b.y) / 2
      const scale = Math.min(2, Math.max(.7, gesture.scale * distance / (gesture.distance || distance)))
      const worldX = (gesture.midX - gesture.tx) / gesture.scale, worldY = (gesture.midY - gesture.ty) / gesture.scale
      setTransform({ scale, x: midX - worldX * scale, y: midY - worldY * scale })
    }
  }
  const onPointerUp = (event: React.PointerEvent<SVGSVGElement>) => {
    pointerRef.current.delete(event.pointerId)
    const remaining = [...pointerRef.current.values()]
    if (remaining.length === 1) gestureRef.current = { kind: 'pan', x: remaining[0].x, y: remaining[0].y, tx: transform.x, ty: transform.y, scale: transform.scale, distance: 0, midX: 0, midY: 0 }
    else gestureRef.current = null
  }
  const onWheel = (event: React.WheelEvent<SVGSVGElement>) => {
    event.preventDefault()
    const p = point(event as unknown as React.PointerEvent<SVGSVGElement>)
    const factor = event.deltaY < 0 ? 1.12 : .89
    setTransform((current) => {
      const scale = Math.min(2, Math.max(.7, current.scale * factor))
      const worldX = (p.x - current.x) / current.scale, worldY = (p.y - current.y) / current.scale
      return { scale, x: p.x - worldX * scale, y: p.y - worldY * scale }
    })
  }

  const keyNode = (event: React.KeyboardEvent<SVGGElement>, id: string) => {
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); onSelect(id); return }
    const arrows = ['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp']
    if (!arrows.includes(event.key)) return
    event.preventDefault()
    const current = byId.get(id)
    const candidates = topics.filter((item) => item.topic.id !== id).sort((a, b) => {
      const primary = (event.key === 'ArrowLeft' || event.key === 'ArrowRight') ? a.x - b.x : a.y - b.y
      return primary || a.y - b.y || a.x - b.x
    })
    const next = candidates.find((item) => {
      if (!current) return false
      if (event.key === 'ArrowRight') return item.x > current.x
      if (event.key === 'ArrowLeft') return item.x < current.x
      if (event.key === 'ArrowDown') return item.y > current.y
      return item.y < current.y
    })
    if (next) document.getElementById(`map-node-${next.topic.id}`)?.focus()
  }

  const regularEdges = topics.filter((item) => item.parent && byId.has(item.parent)).map((item) => ({ from: byId.get(item.parent!)!, to: item, related: false }))
  const relatedEdges: { from: Position; to: Position; related: true }[] = []
  const edgeIds = new Set<string>()
  for (const item of topics.filter((position) => position.topic.id === selected?.id || (position.topic.related || []).includes(selected?.id || ''))) for (const id of item.topic.related || []) {
    if (item.topic.id !== selected?.id && id !== selected?.id) continue
    const key = `${item.topic.id}:${id}`
    if (!MAP_RELATED_LINKS.has(key)) continue
    const target = byId.get(id)
    if (!target) continue
    if (edgeIds.has(key)) continue
    if (item.depth !== target.depth || Math.abs(item.x - target.x) >= 1 || Math.abs(item.y - target.y) >= 160) continue
    edgeIds.add(key)
    relatedEdges.push({ from: item, to: target, related: true })
    if (relatedEdges.length >= 3) break
  }
  const edgePath = (from: Position, to: Position) => {
    const forward = to.x >= from.x
    const sx = from.x + (forward ? NODE_W / 2 : -NODE_W / 2)
    const ex = to.x - (forward ? NODE_W / 2 : -NODE_W / 2)
    const bend = Math.max(34, Math.abs(ex - sx) * .48)
    return `M ${sx} ${from.y} C ${sx + (forward ? bend : -bend)} ${from.y}, ${ex - (forward ? bend : -bend)} ${to.y}, ${ex} ${to.y}`
  }
  const relatedPath = (from: Position, to: Position) => {
    const downward = to.y > from.y
    const startY = from.y + (downward ? NODE_H / 2 : -NODE_H / 2)
    const endY = to.y + (downward ? -NODE_H / 2 : NODE_H / 2)
    return `M ${from.x} ${startY} L ${to.x} ${endY}`
  }

  return <section className="map-card visual-map-card" style={{ '--subject-color': subject.color } as React.CSSProperties}>
    <div className="visual-map-toolbar">
      <div className="map-title-label"><button className="map-library-link" onClick={() => { window.location.hash = '#/' }}>← Library</button><span className="map-title-dot">✳</span><div><strong>{subject.name}</strong><small>{allTopics.length} connected topics</small></div></div>
      <div className="map-tools">
        <div className="zoom-tools"><button title="Zoom in" aria-label="Zoom in" onClick={() => zoomAtCenter(1.2)}>+</button><button title="Zoom out" aria-label="Zoom out" onClick={() => zoomAtCenter(.83)}>−</button><button className="fit-button" onClick={() => fit()}>Fit</button></div>
        <button className="tool-button" onClick={() => setCollapsed(collapsed.size ? new Set() : new Set(branchIds))}>{collapsed.size ? 'Expand all' : 'Collapse all'}</button>
        <button className={`tool-button ${focusMode ? 'active' : ''}`} aria-pressed={focusMode} onClick={() => setFocusMode((value) => !value)}>◎ Focus</button>
        <div className="view-switch" role="group" aria-label="Map or list view"><button className={viewMode === 'map' ? 'active' : ''} onClick={() => setViewMode('map')}>Map</button><button className={viewMode === 'list' ? 'active' : ''} onClick={() => setViewMode('list')}>List</button></div>
        <label className="map-search"><span>⌕</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search topics" aria-label="Search topics in this map" />{search && <button aria-label="Clear search" onClick={() => setSearch('')}>×</button>}</label>
      </div>
    </div>
    <div className="map-canvas-area" ref={canvasRef}>
      {viewMode === 'map' ? <svg ref={svgRef} className="mindmap-svg" role="application" aria-label={`${subject.name} visual mind map. Drag to pan and use the mouse wheel to zoom.`} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp} onWheel={onWheel}>
        <defs><marker id="related-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 1 L 8 5 L 0 9" fill="none" stroke="context-stroke" strokeWidth="1.5" /></marker></defs>
        <g className="mindmap-world" style={{ transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})` }}>
          {regularEdges.map(({ from, to }) => { const active = parentPath.has(from.topic.id) && parentPath.has(to.topic.id); return <path key={`tree-${to.topic.id}`} d={edgePath(from, to)} className={`mindmap-edge ${active ? 'path-active' : ''} ${focusMode && selected && !active ? 'dimmed' : ''}`} style={active ? { stroke: nodeColorHex(nodeColor(to.topic)) } : undefined} /> })}
          {relatedEdges.map(({ from, to }) => { const active = selected?.id === from.topic.id || selected?.id === to.topic.id; return <path key={`related-${from.topic.id}-${to.topic.id}`} d={relatedPath(from, to)} className={`mindmap-related-edge ${nodeColor(selected || from.topic)} ${active ? 'active' : ''} ${focusMode && selected && !active ? 'dimmed' : ''}`} markerEnd="url(#related-arrow)" /> })}
          {topics.map((item) => {
            const { topic, x, y } = item
            const children = topicChildren(subject.id, topic.id)
            const isCollapsed = effectiveCollapsed.has(topic.id)
            const isSelected = selected?.id === topic.id
            const inPath = parentPath.has(topic.id)
            const isRelated = selected?.related?.includes(topic.id) || topic.related?.includes(selected?.id || '')
            const isDimmed = (focusMode && selected && !inPath && !isRelated) || (normalizedSearch && !matches(topic))
            const state = progress[topic.id]
            const color = nodeColor(topic)
            const stroke = nodeColorHex(color)
            return <g key={topic.id} id={`map-node-${topic.id}`} className={`mindmap-node ${color} ${isSelected ? 'selected' : ''} ${inPath ? 'in-path' : ''} ${isRelated ? 'related-node' : ''} ${isDimmed ? 'dimmed' : ''}`} transform={`translate(${x - NODE_W / 2} ${y - NODE_H / 2})`} tabIndex={0} role="button" aria-label={`${topic.title}. ${topic.oneLine || ''}${state === 'learned' ? '. Learned' : state === 'learning' ? '. In progress' : ''}`} aria-pressed={isSelected} onClick={() => onSelect(topic.id)} onKeyDown={(event) => keyNode(event, topic.id)} data-map-control="true" style={{ '--node-color': stroke } as React.CSSProperties}>
              <title>{topic.oneLine || topic.title}</title>
              <rect className="map-node-card" width={NODE_W} height={NODE_H} rx="8" />
              <text className="map-node-title" x="13" y="24">{shortened(topic.title, 24)}</text>
              <text className="map-node-subtitle" x="13" y="42">{shortened(topic.oneLine || '', 24)}</text>
              {state === 'learned' && <g className="map-learned-badge" transform={`translate(${NODE_W - 19} 5)`}><circle r="9" cx="5" cy="5" /><text x="5" y="9">✓</text></g>}
              {state === 'learning' && <circle className="map-learning-dot" cx={NODE_W - 11} cy={NODE_H - 10} r="4" />}
              {children.length > 0 && <g className="map-collapse-control" transform={`translate(${NODE_W - 11} ${NODE_H / 2})`} role="button" tabIndex={0} aria-label={`${isCollapsed ? 'Expand' : 'Collapse'} ${topic.title}`} data-map-control="true" onClick={(event) => { event.stopPropagation(); setCollapsed((current) => { const next = new Set(current); if (next.has(topic.id)) next.delete(topic.id); else next.add(topic.id); return next }) }} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); event.stopPropagation(); setCollapsed((current) => { const next = new Set(current); if (next.has(topic.id)) next.delete(topic.id); else next.add(topic.id); return next }) } }}><circle className="map-collapse-hit" r="22" /><circle className="map-collapse-visible" r="13" /><text y="4">{isCollapsed ? '+' : '−'}</text></g>}
            </g>
          })}
        </g>
      </svg> : <div className="list-view-scroll"><div className="topic-tree" role="tree" aria-label={`${subject.name} topic list`}><ListNode topic={topicById.get(subject.rootTopic)} subjectId={subject.id} selectedId={selected?.id} progress={progress} collapsed={effectiveCollapsed} search={normalizedSearch} onSelect={onSelect} onToggle={(id) => setCollapsed((current) => { const next = new Set(current); if (next.has(id)) next.delete(id); else next.add(id); return next })} /></div></div>}
      <div className="map-legend"><span><i className="legend-swatch purple" />Supervised learning</span><span><i className="legend-swatch teal" />Unsupervised &amp; optimization</span><span><i className="legend-swatch gray" />Foundations &amp; tools</span><span className="legend-divider" /><span><i className="legend-dot" />Not started</span><span><i className="legend-dot learning" />Learning</span><span><i className="legend-dot learned" />Learned</span></div>
    </div>
  </section>
}

function hasSearchMatch(topic: Topic, subjectId: string, search: string): boolean {
  return `${topic.title} ${topic.oneLine || ''}`.toLowerCase().includes(search) || topicChildren(subjectId, topic.id).some((child) => hasSearchMatch(child, subjectId, search))
}

function ListNode({ topic, subjectId, selectedId, progress, collapsed, search, onSelect, onToggle }: { topic?: Topic; subjectId: string; selectedId?: string; progress: Progress; collapsed: Set<string>; search: string; onSelect: (id?: string) => void; onToggle: (id: string) => void }) {
  if (!topic) return null
  if (search && !hasSearchMatch(topic, subjectId, search)) return null
  const children = topicChildren(subjectId, topic.id)
  const isCollapsed = collapsed.has(topic.id)
  const state = progress[topic.id] || 'not-started'
  return <div className="tree-branch" role="treeitem" aria-expanded={children.length ? !isCollapsed : undefined}><div className={`tree-node-row ${selectedId === topic.id ? 'selected' : ''}`}>
    {children.length > 0 && <button className="tree-toggle" aria-label={`${isCollapsed ? 'Expand' : 'Collapse'} ${topic.title}`} onClick={() => onToggle(topic.id)}>{isCollapsed ? '+' : '−'}</button>}
    <button className="tree-node" onClick={() => onSelect(topic.id)} title={topic.oneLine || topic.title}><span className={`node-status ${state}`} />{topic.title}{state === 'learned' && <span className="check-mark">✓</span>}</button>
  </div>{children.length > 0 && !isCollapsed && <div className="tree-children" role="group">{children.map((child) => <ListNode key={child.id} topic={child} subjectId={subjectId} selectedId={selectedId} progress={progress} collapsed={collapsed} search={search} onSelect={onSelect} onToggle={onToggle} />)}</div>}</div>
}
