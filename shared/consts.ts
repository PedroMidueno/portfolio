export const BLOG_CATEGORIES = [
  'frontend',
  'backend',
  'full-stack',
  'html-css',
  'javascript',
  'typescript',
  'nodejs'
] as const

export const CATEGORY_LABELS: Record<typeof BLOG_CATEGORIES[number], string> = {
  'frontend': 'FrontEnd',
  'backend': 'BackEnd',
  'full-stack': 'Full Stack',
  'html-css': 'HTML & CSS',
  'javascript': 'JavaScript',
  'typescript': 'TypeScript',
  'nodejs': 'Node.js'
}
