// ─── CONTACT DATA ─────────────────────────────────────────────
// All contact content lives here.
// When the Admin panel is built, these will be fetched
// from the database instead.

export const contactData = {
  title: "Let's build something",
  titleEm: 'together.',
  description:
    'Whether you\'re hiring, have a project in mind, or just want to connect — I\'d love to hear from you. I\'m currently open to full-time roles, NYSC PPA placements, and select freelance work.',
  cvPath: '/cv/attah-kelechi-cv.pdf',
}

export const reasonPills = [
  { label: 'Job opportunity',  active: true  },
  { label: 'NYSC PPA',         active: true  },
  { label: 'Freelance project',active: false },
  { label: 'Collaboration',    active: false },
  { label: 'Just saying hi',   active: false },
]

export const subjectOptions = [
  'Job opportunity',
  'NYSC PPA enquiry',
  'Freelance project',
  'Collaboration',
  'Just saying hi',
  'Other',
]

export const directContacts = [
  {
    id: 'email',
    label: 'Email',
    value: 'attahkelechi97@gmail.com',
    sub: 'Preferred · replies within 24hrs',
    href: 'mailto:attahkelechi97@gmail.com',
    color: '#f59e0b',
    colorBg: 'rgba(245,158,11,0.1)',
    icon: '✉',
  },
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    value: '+234 812 586 1997',
    sub: 'For quick questions and chats',
    href: 'https://wa.me/2348125861997',
    color: '#25d366',
    colorBg: 'rgba(37,211,102,0.1)',
    icon: '✆',
  },
]

export const socialLinks = [
  {
    id: 'github',
    label: 'GitHub',
    handle: 'Kaycee-attah',
    href: 'https://github.com/Kaycee-attah',
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    handle: 'kelechi-attah',
    href: 'https://linkedin.com/in/kelechi-attah',
  },
]