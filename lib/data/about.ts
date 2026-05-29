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