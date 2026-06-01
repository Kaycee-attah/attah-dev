// ─── TOOLS DATA ───────────────────────────────────────────────
// All tools content lives here.
// When Admin panel is built, these will be fetched
// from the database instead.

export const toolsData = {
  title: 'Built from',
  titleEm: 'real problems.',
  description:
    'Three tools I built because I needed them myself. Free, no sign-up, no limits. Browser-only — nothing leaves your machine.',
}

export const toolsMeta = [
  {
    id: 'wcag',
    icon: 'ti-accessibility',
    iconBg: 'rgba(211,75,90,0.1)',
    iconColor: '#D34B5A',
    name: 'WCAG contrast checker',
    sub: 'Verify colour pair accessibility · WCAG AA & AAA',
    badge: 'Browser only · No sign-up',
  },
  {
    id: 'specificity',
    icon: 'ti-selector',
    iconBg: 'rgba(127,119,221,0.1)',
    iconColor: '#7F77DD',
    name: 'CSS specificity calculator',
    sub: 'Paste any selector · instant breakdown',
    badge: 'Browser only · No sign-up',
  },
  {
    id: 'tanstack',
    icon: 'ti-code',
    iconBg: 'rgba(29,158,117,0.1)',
    iconColor: '#1D9E75',
    name: 'TanStack Query hook generator',
    sub: 'Describe your endpoint · get a typed hook',
    badge: 'Browser only · No sign-up',
  },
]