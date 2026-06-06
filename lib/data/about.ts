// ─── ABOUT DATA ───────────────────────────────────────────────
// All content for the About section lives here.
// When the Admin panel is built, these will be fetched
// from the database instead. The About component won't change.

export const aboutData = {
  statement: {
    line1: 'Engineer by training,',
    line2: 'builder',
    line3: 'instinct.',
  },
  readMoreHref: '/about',
  cvPath: '/cv/attah-kelechi-cv.pdf',
}

export const storyBeats = [
  {
    id: 'hardware',
    icon: '⚙',
    iconBg: 'rgba(168, 85, 247, 0.1)',
    iconColor: '#c084fc',
    title: 'Hardware → Web',
    text: 'Started with microcontrollers and embedded systems, ended up shipping 3D interfaces and fintech dashboards. That hardware foundation is still how I think about performance.',
  },
  {
    id: 'builder',
    icon: '🏫',
    iconBg: 'rgba(251, 113, 133, 0.1)',
    iconColor: '#fb7185',
    title: 'Built before anyone paid me to',
    text: "Created interactive study tools used by 300+ classmates across 6 courses at Redeemer's University — because I saw a gap and filled it.",
  },
  {
    id: 'a11y',
    icon: '⚡',
    iconBg: 'rgba(245, 158, 11, 0.1)',
    iconColor: '#f59e0b',
    title: 'Accessibility is not optional',
    text: 'WCAG AA, keyboard navigation, semantic HTML — built in from the start, not added at the end. Every project I ship is verified.',
  },
]

export const numbers = [
  {
    num: '13',
    unit: '+',
    label: 'Projects shipped',
    sub: 'Across frontend, backend, IoT',
  },
  {
    num: '1',
    unit: 'yr+',
    label: 'Production exp.',
    sub: 'Oneflare Technologies',
  },
  {
    num: '4.79',
    unit: '/5',
    label: 'First Class CGPA',
    sub: "Dean's List every year",
  },
  {
    num: '300',
    unit: '+',
    label: 'Students reached',
    sub: 'CPE Study Hub',
  },
]

export const currentStatus = [
  {
    key: 'Working',
    value: 'Frontend Engineer',
    detail: 'Oneflare Technologies',
  },
  {
    key: 'Building',
    value: 'attah.dev',
    detail: 'this portfolio',
  },
  {
    key: 'Learning',
    value: 'Go',
    detail: 'high-performance backends',
  },
  {
    key: 'Open to',
    value: 'NYSC PPA',
    detail: 'Full-time · Freelance',
  },
]

export const interestTags = [
  { label: 'Frontend Engineering', active: true  },
  { label: 'Full-stack',           active: true  },
  { label: 'Flutter',              active: false },
  { label: 'Remote-first',         active: false },
  { label: 'Open Source',          active: false },
]

// ─── FULL ABOUT PAGE DATA ─────────────────────────────────────
export const fullAboutData = {
  title: 'The full',
  titleEm: 'story.',
  intro:
    'Computer Engineering student by training, frontend developer by obsession. Here\'s how I got from microcontrollers to production-grade web applications.',
  photoPath: '/images/kelechi.jpeg',
  photoAlt: 'Attah Kelechi — Frontend Engineer',
  name: 'Attah Kelechi',
  role: 'Frontend Engineer',
  location: 'Osun, Nigeria',
}

export const storyChapters = [
  {
    id: 'hardware',
    chapter: '01',
    title: 'It started with hardware',
    body:
      'I started Computer Engineering at Redeemer\'s University in 2021 expecting to build circuits and program microcontrollers. And I did — SIWES at ROLOF Institute had me building automated irrigation systems, obstacle avoidance devices, and sound-controlled automation in C++ and Python. That foundation of thinking at the hardware level — understanding memory, performance, and how software touches physical systems — is something I carry into every frontend decision I make today.',
    highlight: 'C++ and Python',
  },
  {
    id: 'gap',
    chapter: '02',
    title: 'I saw a gap and filled it',
    body:
      'In my second year I noticed something — my classmates were struggling with course material that had no interactive resources. I built CPE Study Hub: React-powered study tools covering 6 courses, deployed on Firebase, used by 300+ students. Nobody asked me to. I just saw a problem and built the solution. That\'s still how I approach every project.',
    highlight: '300+ students',
  },
  {
    id: 'production',
    chapter: '03',
    title: 'Production experience before graduation',
    body:
      'Most students graduate without touching production code. I joined Oneflare Technologies in March 2026 as a Frontend Engineer while still finishing my degree. I shipped 11 live report pages for a hotel management system, authored 30+ TanStack Query hooks, built across 9 operational modules, and resolved 12+ production bugs. Real deadlines, real users, real consequences.',
    highlight: '11 live report pages',
  },
  {
    id: 'backend',
    chapter: '04',
    title: 'Backend because I had to',
    body:
      'The HNG Backend internship pushed me to build a production REST API from scratch. The NLP parser — mapping plain English queries to parameterised SQL with no libraries — came out of a zero-budget constraint on Railway free tier. Sometimes the best engineering decisions come from having no choice but to be creative.',
    highlight: 'no libraries',
  },
  {
    id: 'now',
    chapter: '05',
    title: 'Right now',
    body:
      'Final year at Redeemer\'s University, First Class standing, 4.79 CGPA. Working full-time at Oneflare, running two HNG internships simultaneously, and building this portfolio. Looking for a full-time role or NYSC PPA where I can keep shipping things that matter.',
    highlight: '4.79 CGPA',
  },
]

export const aboutValues = [
  {
    id: 'build',
    icon: '⚡',
    title: 'Build first',
    body: 'I learn by shipping. Every concept I understand deeply came from building something with it, breaking it, and fixing it.',
  },
  {
    id: 'accessibility',
    icon: '♿',
    title: 'Accessibility is not optional',
    body: 'WCAG AA, keyboard navigation, semantic HTML — baked in from the start. Verified, not assumed.',
  },
  {
    id: 'performance',
    icon: '🔧',
    title: 'Performance is a feature',
    body: 'Load time from 8s to 1.2s on Fuege. Sub-500ms API responses on free tier. Performance is never an afterthought.',
  },
]

export const aboutPageStats = [
  { num: '13',   unit: '+',   label: 'Projects'    },
  { num: '4.79', unit: '/5',  label: 'CGPA'        },
  { num: '300',  unit: '+',   label: 'Students'    },
  { num: '1',    unit: 'yr+', label: 'Prod. exp.'  },
]

export const coreStack = [
  { label: 'React',       active: true  },
  { label: 'Next.js',     active: true  },
  { label: 'TypeScript',  active: true  },
  { label: 'Supabase',    active: true  },
  { label: 'Tailwind',    active: true  },
  { label: 'Groq AI',     active: true  },
  { label: 'Vue 3',       active: false },
  { label: 'Node.js',     active: false },
  { label: 'PostgreSQL',  active: false },
  { label: 'Three.js',    active: false },
  { label: 'TanStack',    active: false },
  { label: 'Vercel',      active: false },
]

export const about_page_currentStatus = [
  'Frontend Engineer · Oneflare Technologies',
  'Building attah.dev — portfolio + tools',
  "Final year · Redeemer's University, CPE",
  'Open to full-time · NYSC PPA · Freelance',
]