// ─── BLOG DATA ────────────────────────────────────────────────
// All blog content lives here.
// When the Admin panel is built, these will be fetched
// from the database instead.

export const blogPosts = [
  {
    id: 'nlp-parser',
    slug: 'how-i-built-a-custom-nlp-parser',
    tag: 'Backend',
    tagColor: '#4ade80',
    tagBg: 'rgba(74,222,128,0.08)',
    tagBorder: 'rgba(74,222,128,0.2)',
    status: 'In progress',
    date: 'Coming soon',
    readTime: '~8 min read',
    title: 'How I built a custom NLP parser without any libraries',
    excerpt:
      'Most developers reach for an NLP library without thinking. I had a Railway free tier budget of zero and a query engine to build. Here\'s how I mapped plain English to parameterised SQL using nothing but regex and keyword matching.',
    codePreview: [
      { tokens: [{ text: '// No libraries. Pure regex + keywords.', color: '#374151' }] },
      { tokens: [{ text: 'function ', color: '#c084fc' }, { text: 'parseQuery', color: '#60a5fa' }, { text: '(input) {', color: '#67e8f9' }] },
      { tokens: [{ text: '  const ', color: '#c084fc' }, { text: 'filters', color: '#e5e7eb' }, { text: ' = {}', color: '#67e8f9' }] },
      { tokens: [{ text: '  if ', color: '#c084fc' }, { text: '(text.includes(', color: '#67e8f9' }, { text: "'women'", color: '#86efac' }, { text: '))', color: '#67e8f9' }] },
      { tokens: [{ text: '    filters.gender', color: '#60a5fa' }, { text: " = 'female'", color: '#86efac' }] },
      { tokens: [{ text: '}', color: '#67e8f9' }] },
    ],
  },
  {
    id: 'wcag',
    slug: 'wcag-aa-in-practice',
    tag: 'Accessibility',
    tagColor: '#fb7185',
    tagBg: 'rgba(251,113,133,0.08)',
    tagBorder: 'rgba(251,113,133,0.2)',
    status: 'In progress',
    date: 'Coming soon',
    readTime: '~5 min read',
    title: 'WCAG AA in practice: verifying 21 colour pairs by hand',
    excerpt:
      'I found a contrast failure at 4.37:1 — below the 4.5:1 minimum — and fixed it without a single automated tool. Here\'s the maths behind accessible colour contrast and why I do it manually.',
    codePreview: [
      { tokens: [{ text: '// Contrast ratio formula', color: '#374151' }] },
      { tokens: [{ text: 'const ', color: '#c084fc' }, { text: 'ratio', color: '#e5e7eb' }, { text: ' = ', color: '#67e8f9' }, { text: '(L1 + 0.05)', color: '#60a5fa' }] },
      { tokens: [{ text: '             / ', color: '#67e8f9' }, { text: '(L2 + 0.05)', color: '#60a5fa' }] },
      { tokens: [{ text: '// 4.37:1 — FAIL (min 4.5:1)', color: '#ef4444' }] },
      { tokens: [{ text: '// 5.2:1  — PASS', color: '#4ade80' }] },
    ],
  },
  {
    id: 'prd-first',
    slug: 'building-portfolio-prd-first',
    tag: 'Dev Tools',
    tagColor: '#f59e0b',
    tagBg: 'rgba(245,158,11,0.08)',
    tagBorder: 'rgba(245,158,11,0.2)',
    status: 'In progress',
    date: 'Coming soon',
    readTime: '~6 min read',
    title: 'Building my portfolio like a product — PRD first, then design',
    excerpt:
      'Most developers open a code editor and start building. I wrote a PRD, designed every section before writing a line of code, then built. Here\'s why that changed everything about how the portfolio turned out.',
    codePreview: [
      { tokens: [{ text: '## PRD — attah.dev', color: '#f59e0b' }] },
      { tokens: [{ text: 'Goal: ', color: '#60a5fa' }, { text: '3 audiences', color: '#e5e7eb' }] },
      { tokens: [{ text: 'Phase 1: ', color: '#60a5fa' }, { text: 'Design all sections', color: '#e5e7eb' }] },
      { tokens: [{ text: 'Phase 2: ', color: '#60a5fa' }, { text: 'Build with data layer', color: '#e5e7eb' }] },
      { tokens: [{ text: 'Status: ', color: '#4ade80' }, { text: 'Shipping', color: '#86efac' }] },
    ],
  },
]

export const blogData = {
  title: 'Thinking out',
  titleEm: 'loud.',
  viewAllHref: '/blog',
}