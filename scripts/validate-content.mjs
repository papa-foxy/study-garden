import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import { parse } from 'yaml'

const contentRoot = path.resolve('content')
const errors = []
const allowedQuestionTypes = new Set(['flashcard', 'multiple-choice', 'fill-blank', 'short-answer', 'match-pairs', 'order-steps'])
const requiredMachineLearningRelated = new Set([
  'model-and-parameters:cost-function',
  'cost-function:gradient-descent',
  'learning-rate:convexity',
  'regression:classification',
  'supervised-learning:unsupervised-learning',
])
const allowedMachineLearningRelated = new Set([
  ...requiredMachineLearningRelated,
  'multiple-features:model-and-parameters',
  'vectorization:model-and-parameters',
  'vectorized-gradient-descent:gradient-descent',
  'gradient-descent-multiple:gradient-descent',
  'feature-scaling:learning-rate',
  'scaling-methods:learning-rate',
  'convergence:cost-function',
  'choosing-learning-rate:learning-rate',
  'feature-engineering:regression',
  'polynomial-regression:linear-regression',
])
const requiredMachineLearningMapArrows = new Set([
  'model-and-parameters:cost-function',
  'cost-function:gradient-descent',
  'learning-rate:convexity',
])
const mapArrowDistanceLimit = 160
const topicFiles = []

async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name)
    if (entry.isDirectory()) await walk(file)
    else if (entry.name.endsWith('.md')) topicFiles.push(file)
  }
}

const subjects = new Map()
for (const entry of await readdir(contentRoot, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue
  const topicsDirectory = path.join(contentRoot, entry.name, 'topics')
  try {
    await walk(topicsDirectory)
  } catch {
    errors.push(`${entry.name}: missing or unreadable topics folder`)
  }
  const file = path.join(contentRoot, entry.name, 'subject.json')
  try {
    const subject = JSON.parse(await readFile(file, 'utf8'))
    if (!subject.id || !subject.rootTopic || !subject.name) errors.push(`${file}: subject needs id, name, and rootTopic`)
    subjects.set(entry.name, subject)
  } catch {
    errors.push(`${file}: missing or invalid subject.json`)
  }
}

const parsed = []
for (const file of topicFiles) {
  const relative = path.relative(contentRoot, file)
  const subjectFolder = relative.split(path.sep)[0]
  try {
    const raw = await readFile(file, 'utf8')
    const match = raw.match(/^---\s*\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/)
    if (!match) throw new Error('missing YAML frontmatter block')
    const meta = parse(match[1])
    if (!meta?.id || !meta?.title || meta.parent === undefined) throw new Error('id, title, and parent are required')
    parsed.push({ file, subjectFolder, meta })
  } catch (error) {
    errors.push(`${relative}: ${error.message}`)
  }
}

const bySubjectAndId = new Map()
for (const topic of parsed) {
  const key = `${topic.subjectFolder}:${topic.meta.id}`
  if (bySubjectAndId.has(key)) errors.push(`${topic.file}: duplicate topic id ${topic.meta.id}`)
  bySubjectAndId.set(key, topic)
}
for (const topic of parsed) {
  const { file, subjectFolder, meta } = topic
  const relative = path.relative(contentRoot, file)
  const parentKey = `${subjectFolder}:${meta.parent}`
  if (meta.parent && !bySubjectAndId.has(parentKey)) errors.push(`${relative}: parent topic ${meta.parent} does not exist in ${subjectFolder}`)
  for (const related of meta.related || []) {
    if (!bySubjectAndId.has(`${subjectFolder}:${related}`)) errors.push(`${relative}: related topic ${related} does not exist in ${subjectFolder}`)
    if (subjectFolder === 'machine-learning' && !allowedMachineLearningRelated.has(`${meta.id}:${related}`)) errors.push(`${relative}: disallowed related link ${meta.id} -> ${related}`)
  }
  if (subjectFolder === 'machine-learning') {
    if (!meta.beforeAfter) errors.push(`${relative}: machine-learning topic needs a hero visual`)
    if (!Array.isArray(meta.selfTest) || meta.selfTest.length < 2 || meta.selfTest.length > 3) errors.push(`${relative}: machine-learning topic needs 2–3 quick quiz questions`)
  }
  for (const question of meta.selfTest || []) {
    if (!allowedQuestionTypes.has(question.type)) errors.push(`${relative}: unsupported question type ${question.type}`)
  }
}
for (const [folder, subject] of subjects) {
  const subjectTopics = parsed.filter((topic) => topic.subjectFolder === folder)
  const roots = subjectTopics.filter((topic) => !topic.meta.parent)
  if (roots.length > 1) errors.push(`${folder}: topic tree has ${roots.length} roots; expected exactly one`)
  else if (roots.length === 0) errors.push(`${folder}: topic tree has no root; set one topic parent to an empty string`)
  else if (roots[0].meta.id !== subject.rootTopic) errors.push(`${folder}/subject.json: rootTopic ${subject.rootTopic} does not match the only root ${roots[0].meta.id}`)
  if (!bySubjectAndId.has(`${folder}:${subject.rootTopic}`)) errors.push(`${folder}/subject.json: rootTopic ${subject.rootTopic} does not exist`)
}

const requiredMachineLearningTree = {
  'ml-week-one': '', 'supervised-learning': 'ml-week-one', 'unsupervised-learning': 'ml-week-one',
  applications: 'ml-week-one', 'jupyter-notebooks': 'ml-week-one',
  regression: 'supervised-learning', classification: 'supervised-learning',
  'linear-regression': 'regression', 'training-set-notation': 'linear-regression',
  'model-and-parameters': 'linear-regression', 'cost-function': 'linear-regression',
  'gradient-descent': 'linear-regression', 'cost-intuition': 'cost-function',
  'visualizing-cost': 'cost-function', 'update-rule': 'gradient-descent',
  'slope-intuition': 'gradient-descent', 'learning-rate': 'gradient-descent',
  convexity: 'gradient-descent', 'batch-gradient-descent': 'gradient-descent',
  clustering: 'unsupervised-learning', 'anomaly-detection': 'unsupervised-learning',
  'dimensionality-reduction': 'unsupervised-learning',
  'multiple-features': 'ml-week-one', 'vectorization': 'ml-week-one',
  'vectorized-gradient-descent': 'vectorization', 'gradient-descent-multiple': 'ml-week-one',
  'feature-scaling': 'ml-week-one', 'scaling-methods': 'feature-scaling',
  convergence: 'ml-week-one', 'choosing-learning-rate': 'convergence',
  'feature-engineering': 'ml-week-one', 'polynomial-regression': 'feature-engineering',
}
const machineLearningTopics = parsed.filter((topic) => topic.subjectFolder === 'machine-learning')
if (machineLearningTopics.length !== 32) errors.push(`machine-learning: expected exactly 32 topics; found ${machineLearningTopics.length}`)
for (const [id, parent] of Object.entries(requiredMachineLearningTree)) {
  const topic = bySubjectAndId.get(`machine-learning:${id}`)
  if (!topic) errors.push(`machine-learning: required topic ${id} is missing`)
  else if ((topic.meta.parent || '') !== parent) errors.push(`${path.relative(contentRoot, topic.file)}: expected parent ${parent || '(root)'}, got ${topic.meta.parent || '(root)'}`)
}
for (const topic of machineLearningTopics) if (!(topic.meta.id in requiredMachineLearningTree)) errors.push(`${path.relative(contentRoot, topic.file)}: unexpected machine-learning topic ${topic.meta.id}`)

const machineLearningById = new Map(machineLearningTopics.map((topic) => [topic.meta.id, topic]))
const machineLearningOrder = ['ml-week-one', 'supervised-learning', 'unsupervised-learning', 'applications', 'jupyter-notebooks', 'multiple-features', 'vectorization', 'gradient-descent-multiple', 'feature-scaling', 'convergence', 'feature-engineering', 'regression', 'classification', 'linear-regression', 'training-set-notation', 'model-and-parameters', 'cost-function', 'cost-intuition', 'visualizing-cost', 'gradient-descent', 'update-rule', 'slope-intuition', 'learning-rate', 'convexity', 'batch-gradient-descent', 'clustering', 'anomaly-detection', 'dimensionality-reduction', 'vectorized-gradient-descent', 'scaling-methods', 'choosing-learning-rate', 'polynomial-regression']
const machineLearningChildren = (id) => machineLearningTopics
  .filter((topic) => topic.meta.parent === id)
  .sort((a, b) => machineLearningOrder.indexOf(a.meta.id) - machineLearningOrder.indexOf(b.meta.id))
const machineLearningDepth = (topic) => {
  let depth = 0
  let parent = topic.meta.parent
  while (parent && machineLearningById.has(parent)) {
    depth += 1
    parent = machineLearningById.get(parent).meta.parent
  }
  return depth
}
const expectedTreeIsValid = machineLearningTopics.length === machineLearningOrder.length && Object.entries(requiredMachineLearningTree).every(([id, parent]) => machineLearningById.get(id)?.meta.parent === parent)
function machineLearningPositionsForSelection(selectedId) {
  const collapsed = new Set(machineLearningTopics
    .filter((topic) => machineLearningDepth(topic) >= 2 && machineLearningChildren(topic.meta.id).length > 0)
    .map((topic) => topic.meta.id))
  let selected = machineLearningById.get(selectedId)
  while (selected?.meta.parent && machineLearningById.has(selected.meta.parent)) {
    collapsed.delete(selected.meta.parent)
    selected = machineLearningById.get(selected.meta.parent)
  }
  collapsed.delete(selectedId)

  const spanCache = new Map()
  const span = (topic) => {
    if (spanCache.has(topic.meta.id)) return spanCache.get(topic.meta.id)
    const children = collapsed.has(topic.meta.id) ? [] : machineLearningChildren(topic.meta.id)
    const childSpan = children.length
      ? children.reduce((sum, child) => sum + span(child), 0) + 24 * (children.length - 1)
      : 56
    const value = Math.max(56, childSpan)
    spanCache.set(topic.meta.id, value)
    return value
  }
  const positions = new Map()
  const place = (topic, depth, start) => {
    const children = collapsed.has(topic.meta.id) ? [] : machineLearningChildren(topic.meta.id)
    const topicSpan = span(topic)
    positions.set(topic.meta.id, { depth, y: start + topicSpan / 2 })
    const total = children.reduce((sum, child) => sum + span(child), 0) + 24 * Math.max(0, children.length - 1)
    let childStart = start + (topicSpan - total) / 2
    for (const child of children) {
      place(child, depth + 1, childStart)
      childStart += span(child) + 24
    }
  }
  const root = machineLearningById.get('ml-week-one')
  if (root) place(root, 0, 26)
  return positions
}
if (expectedTreeIsValid) for (const pair of requiredMachineLearningMapArrows) {
  const [from, to] = pair.split(':')
  const qualifiesWhenSelected = [from, to].some((selectedId) => {
    const positions = machineLearningPositionsForSelection(selectedId)
    const source = positions.get(from)
    const target = positions.get(to)
    return source && target && source.depth === target.depth && Math.abs(source.y - target.y) < mapArrowDistanceLimit
  })
  if (!qualifiesWhenSelected) errors.push(`machine-learning: map arrow ${from} -> ${to} must share a column and stay under ${mapArrowDistanceLimit}px apart when selected`)
}
for (const pair of requiredMachineLearningRelated) {
  const [from, to] = pair.split(':')
  const topic = bySubjectAndId.get(`machine-learning:${from}`)
  if (topic && !(topic.meta.related || []).includes(to)) errors.push(`${path.relative(contentRoot, topic.file)}: required related link ${from} -> ${to} is missing`)
  if (requiredMachineLearningMapArrows.has(pair)) {
    const target = bySubjectAndId.get(`machine-learning:${to}`)
    if (topic && target && topic.meta.parent !== target.meta.parent) errors.push(`machine-learning: map arrow ${from} -> ${to} must connect nodes in the same tree column`)
  }
}
for (const pair of requiredMachineLearningMapArrows) if (!allowedMachineLearningRelated.has(pair)) errors.push(`machine-learning: map arrow ${pair} must also be an allowed related link`)

if (errors.length) {
  console.error(`Content validation found ${errors.length} issue${errors.length === 1 ? '' : 's'}:`)
  for (const error of errors) console.error(`- ${error}`)
  process.exit(1)
}
console.log(`Content looks good: ${subjects.size} subjects and ${parsed.length} topics.`)
