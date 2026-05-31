// ─── SKILLS DATA ──────────────────────────────────────────────
// All skills content lives here.
// When the Admin panel is built, these will be fetched
// from the database instead.

export const skillGroups = [
  {
    id: 'frontend',
    label: 'Frontend',
    color: '#60a5fa',
    colorBg: 'rgba(96,165,250,0.08)',
    colorBorder: 'rgba(96,165,250,0.2)',
    skills: [
      { name: 'React',           level: 95 },
      { name: 'Next.js 14',      level: 92 },
      { name: 'TypeScript',      level: 88 },
      { name: 'Vue 3',           level: 82 },
      { name: 'Angular 17+',     level: 75 },
      { name: 'Tailwind CSS',    level: 90 },
      { name: 'Framer Motion',   level: 78 },
      { name: 'Three.js',        level: 70 },
    ],
  },
  {
    id: 'backend',
    label: 'Backend',
    color: '#4ade80',
    colorBg: 'rgba(74,222,128,0.08)',
    colorBorder: 'rgba(74,222,128,0.2)',
    skills: [
      { name: 'Node.js',         level: 80 },
      { name: 'Express',         level: 78 },
      { name: 'PostgreSQL',      level: 75 },
      { name: 'REST APIs',       level: 85 },
      { name: 'Firebase',        level: 72 },
    ],
  },
  {
    id: 'tools',
    label: 'Tools & workflow',
    color: '#c084fc',
    colorBg: 'rgba(192,132,252,0.08)',
    colorBorder: 'rgba(192,132,252,0.2)',
    skills: [
      { name: 'Git & GitHub',    level: 90 },
      { name: 'TanStack Query',  level: 88 },
      { name: 'Axios',           level: 85 },
      { name: 'Vite',            level: 82 },
      { name: 'Pinia',           level: 78 },
      { name: 'Recharts',        level: 75 },
    ],
  },
  {
    id: 'other',
    label: 'Other',
    color: '#f59e0b',
    colorBg: 'rgba(245,158,11,0.08)',
    colorBorder: 'rgba(245,158,11,0.2)',
    skills: [
      { name: 'C++',             level: 72 },
      { name: 'Flutter',         level: 55 },
      { name: 'Arduino / IoT',   level: 70 },
      { name: 'WCAG AA',         level: 85 },
      { name: 'Python',          level: 60 },
    ],
  },
]

export const skillsData = {
  title: 'What I',
  titleEm: 'build with.',
}