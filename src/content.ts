import { parse } from 'yaml'

export type Question = {
  type: 'fill-blank' | 'multiple-choice' | 'short-answer'
  prompt: string
  answer: string
  explanation?: string
  options?: string[]
}

export type BeforeAfter =
  | { type: 'visual-example'; kind: string; beforeCaption: string; afterCaption: string; whatChanged: string; whatToNotice: string; steps?: boolean }
  | { type: 'text-compare'; before: string[]; after: string[]; beforeCaption?: string; afterCaption?: string }
  | { type: 'steps'; before?: string[]; after?: string[]; steps: { title: string; text: string }[] }
  | { type: 'svg-component'; before: { title: string; slope: number; intercept: number }; after: { title: string; slope: number; intercept: number }; beforeCaption?: string; afterCaption?: string }
  | { type: 'image-compare'; before: string; after: string; beforeAlt?: string; afterAlt?: string; beforeCaption?: string; afterCaption?: string }

export type TopicMeta = {
  id: string
  title: string
  parent: string
  oneLine?: string
  related?: string[]
  beforeAfter?: BeforeAfter
  formula?: string
  demo?: string | null
  selfTest?: Question[]
  keyPoints?: string[]
  commonMistakes?: string[]
  vocabulary?: { word: string; meaning: string; example: string; translation?: string }[]
}

export type Topic = TopicMeta & { subjectId: string; body: string }
export type Subject = { id: string; name: string; color: string; description: string; type: 'language' | 'science' | 'general'; rootTopic: string; plugins: string[] }

const subjectModules = import.meta.glob('../content/*/subject.json', { eager: true, import: 'default' }) as Record<string, Subject>
const topicModules = import.meta.glob('../content/*/topics/*.md', { eager: true, query: '?raw', import: 'default' }) as Record<string, string>

function parseTopic(path: string, raw: string): Topic {
  const match = raw.match(/^---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n?([\s\S]*)$/)
  if (!match) throw new Error(`${path}: missing YAML frontmatter`)
  const meta = parse(match[1]) as TopicMeta
  const subjectId = path.match(/\.\.\/content\/([^/]+)\//)?.[1]
  if (!subjectId || !meta) throw new Error(`${path}: invalid topic metadata`)
  return { ...meta, subjectId, body: match[2].trim() }
}

export const subjects = Object.values(subjectModules).sort((a, b) => a.name.localeCompare(b.name))
export const topics: Topic[] = Object.entries(topicModules).map(([path, raw]) => parseTopic(path, raw))
export const topicById = new Map(topics.map((topic) => [topic.id, topic]))
export const subjectById = new Map(subjects.map((subject) => [subject.id, subject]))
export const topicsFor = (subjectId: string) => topics.filter((topic) => topic.subjectId === subjectId)

export function topicChildren(subjectId: string, parentId: string): Topic[] {
  const order = ['ml-week-one', 'supervised-learning', 'unsupervised-learning', 'applications', 'jupyter-notebooks', 'multiple-features', 'vectorization', 'gradient-descent-multiple', 'feature-scaling', 'convergence', 'feature-engineering', 'regression', 'classification', 'linear-regression', 'training-set-notation', 'model-and-parameters', 'cost-function', 'cost-intuition', 'visualizing-cost', 'gradient-descent', 'update-rule', 'slope-intuition', 'learning-rate', 'convexity', 'batch-gradient-descent', 'clustering', 'anomaly-detection', 'dimensionality-reduction', 'vectorized-gradient-descent', 'scaling-methods', 'choosing-learning-rate', 'polynomial-regression']
  return topics.filter((topic) => topic.subjectId === subjectId && topic.parent === parentId).sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id))
}
