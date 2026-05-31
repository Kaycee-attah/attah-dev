// ─── HERO DATA ────────────────────────────────────────────────
// All content for the Hero section lives here.
// When the Admin panel is built, these will be fetched
// from the database instead. The Hero component won't change.

export const heroData = {
  tag: 'Frontend Developer',
  name: {
    first: 'Attah',
    last: 'Kelechi.',
  },
  description:
    'I build fast, accessible, production-grade interfaces — from 3D furniture configurators and fintech dashboards to demographic intelligence APIs. Based in Nigeria, built for the world.',
  descriptionHighlight:
    'fast, accessible, production-grade interfaces',
  location: 'Osun, Nigeria · Open to remote · NYSC PPA',
  cvPath: '/cv/attah-kelechi-cv.pdf',
  photoPath: '/images/kelechi.jpeg',
  photoAlt: 'Attah Kelechi — Frontend Developer',
}

export const stackTags = [
  { label: 'React',          active: true  },
  { label: 'Next.js 14',     active: true  },
  { label: 'TypeScript',     active: true  },
  { label: 'Vue 3',          active: false },
  { label: 'Angular 17+',    active: false },
  { label: 'Three.js',       active: false },
  { label: 'TanStack Query', active: false },
  { label: 'Tailwind CSS',   active: false },
]

export const socialLinks = [
  {
    label: 'GitHub',
    href: 'https://github.com/Kaycee-attah',
  },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com/in/kelechi-attah',
  },
  {
    label: 'Email',
    href: 'mailto:attahkelechi97@gmail.com',
  },
]

export const codeLines = [
  [
    { text: 'const',        color: '#c084fc' },
    { text: ' dev',         color: '#e5e7eb' },
    { text: ' =',           color: '#67e8f9' },
    { text: ' {',           color: '#67e8f9' },
  ],
  [
    { text: '  role',       color: '#60a5fa' },
    { text: ':',            color: '#67e8f9' },
    { text: ' "Frontend"',  color: '#86efac' },
    { text: ',',            color: '#67e8f9' },
  ],
  [
    { text: '  open',       color: '#60a5fa' },
    { text: ':',            color: '#67e8f9' },
    { text: ' true',        color: '#c084fc' },
    { text: ',',            color: '#67e8f9' },
  ],
  [
    { text: '  hire',       color: '#60a5fa' },
    { text: ':',            color: '#67e8f9' },
    { text: ' () =>',       color: '#67e8f9' },
  ],
  [
    { text: "    \"Let's talk\"", color: '#86efac' },
  ],
  [
    { text: '}',            color: '#67e8f9' },
  ],
]