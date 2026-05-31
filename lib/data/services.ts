// ─── SERVICES DATA ────────────────────────────────────────────
// All services content lives here.
// Update betaSlots.taken to reflect real bookings.
// When Admin panel is built, these will be fetched
// from the database instead.

export const servicesData = {
  title: 'Work with',
  titleEm: 'me.',
  description:
    'Production-grade frontend work from someone already shipping in production. No juniors. No agencies. Just me — accountable, fast, and direct.',
}

export const availabilityItems = [
  'Full-time frontend roles',
  'NYSC PPA placement',
  'Freelance / contract work',
  'Code review & audits',
]

export const betaSlots = {
  total: 3,
  taken: 0, // Update this as slots fill up
  discountedPrice: '₦5,000',
  standardPrice: '₦25,000',
  description:
    "I'm opening 3 beta review slots at ₦5,000 (vs ₦25,000 standard). You get a full code review and written report. I get a case study I can publish — with your permission. First come, first served. No catch.",
}

export const services = [
  {
    id: 'code-review',
    icon: '🔍',
    iconBg: 'rgba(245,158,11,0.1)',
    name: 'Frontend code review',
    sub: '48hr turnaround · Written report',
    price: '₦25,000',
    priceUnit: '/ review',
    featured: true,
    description:
      'I review your React or Next.js codebase and deliver a written report covering performance, accessibility, architecture, and quick wins.',
    features: [
      'Performance — bundle size, lazy loading, render patterns',
      'WCAG AA accessibility check across all components',
      'Component architecture and data-fetching patterns',
      'Prioritised fixes with code examples',
    ],
    cta: 'Claim a beta slot →',
    ctaStyle: 'primary',
  },
  {
    id: 'freelance',
    icon: '⚡',
    iconBg: 'rgba(96,165,250,0.1)',
    name: 'Freelance development',
    sub: 'Project-based · React / Next.js',
    price: '₦80,000',
    priceUnit: '/ project',
    featured: false,
    description:
      'I build your frontend from scratch or extend your existing codebase. Dashboards, landing pages, web apps, and component libraries.',
    features: [
      'React, Next.js 14, TypeScript',
      'TanStack Query, Axios, REST APIs',
      'Responsive, accessible, performant',
      'Handover with documentation',
    ],
    cta: 'Get a quote →',
    ctaStyle: 'secondary',
  },
  {
    id: 'fulltime',
    icon: '💼',
    iconBg: 'rgba(74,222,128,0.1)',
    name: 'NYSC PPA / Full-time',
    sub: 'Available Oct 2026 · Remote-first',
    price: 'Let\'s talk',
    priceUnit: '',
    featured: false,
    description:
      'Final year, First Class standing, 4.79 CGPA. Production experience at Oneflare before graduation. Looking for a team where I can keep shipping things that matter.',
    features: [
      'Available for NYSC PPA from Oct 2026',
      'Open to remote or Lagos-based roles',
      'Frontend-focused, full-stack capable',
    ],
    cta: 'Start a conversation →',
    ctaStyle: 'secondary',
  },
]

export const howItWorks = [
  {
    step: '01',
    title: 'You book',
    desc: 'Choose your booking method — Calendly, WhatsApp, or the contact form. Tell me what you want reviewed.',
  },
  {
    step: '02',
    title: 'You share',
    desc: "Share your GitHub repo or a ZIP. A quick brief helps — what's the context, what are you worried about?",
  },
  {
    step: '03',
    title: 'I review',
    desc: 'I go through the code and write a structured report with findings, severity levels, and code examples for each fix.',
  },
  {
    step: '04',
    title: 'You receive',
    desc: 'PDF report delivered within 48 hours. Follow-up questions answered. One revision round included.',
  },
]

export const bookingStats = [
  { num: '48', unit: 'hr', label: 'Turnaround' },
  { num: '24', unit: 'hr', label: 'Reply time' },
  { num: '1',  unit: 'yr+', label: 'Prod. exp.' },
]

export const bookingOptions = [
  {
    id: 'calendly',
    label: 'Book on Calendly →',
    href: 'https://calendly.com/placeholder',
    style: 'primary',
  },
  {
    id: 'whatsapp',
    label: 'WhatsApp me',
    href: 'https://wa.me/2348125861997',
    style: 'whatsapp',
  },
  {
    id: 'contact',
    label: 'Send a message',
    href: '/contact',
    style: 'secondary',
  },
]