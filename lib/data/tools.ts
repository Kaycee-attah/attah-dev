// ─── TOOLS DATA ───────────────────────────────────────────────
import { productIQData } from './business-builder'

export const toolsData = {
  title: 'Built from',
  titleEm: 'real problems.',
  description:
    'Tools I built because I needed them myself. Free, no sign-up, no limits. Browser-only — nothing leaves your machine.',
  pageTitle: 'Tools',
  pageDescription:
    'Free developer tools built from real problems. WCAG contrast checker, CSS specificity calculator, TanStack Query hook generator, Git commit generator — no sign-up, no limits.',
}

export const toolsList = [
  {
    id: 'commit-generator',
    href: '/tools/commit-generator',
    icon: '⚡',
    iconBg: 'rgba(245,158,11,0.1)',
    name: 'Git commit generator',
    sub: 'Describe changes or paste diff · get a conventional commit',
    desc: 'Stop writing "fix stuff" commits. Describe what you changed in plain English or paste your git diff — get a properly formatted conventional commit message instantly. Also available as a VSCode extension.',
    tags: ['Git', 'Developer tools', 'AI-powered'],
    marketplaceUrl: 'https://marketplace.visualstudio.com/items?itemName=attah-kelechi.commit-gen',
    pageTitle: 'Git Commit Generator — Free Tool',
    pageDescription: 'Free AI-powered git commit message generator. Paste your diff or describe what you changed — get a properly formatted conventional commit message instantly.',
    heroTitle: 'Git commit',
    heroTitleEm: 'generator.',
    heroDesc: 'Describe what you changed or paste your git diff. Get a properly formatted conventional commit message — editable before you copy.',
  },
  {
    id: 'wcag',
    href: '/tools/wcag',
    icon: '♿',
    iconBg: 'rgba(211,75,90,0.1)',
    name: 'WCAG contrast checker',
    sub: 'Verify colour pair accessibility · WCAG AA & AAA',
    desc: 'Paste any two hex colours and instantly see the contrast ratio with AA and AAA pass/fail for normal and large text. Came from verifying 21 colour pairs by hand on a production invoice app.',
    tags: ['Accessibility', 'CSS', 'Design'],
    pageTitle: 'WCAG Contrast Checker — Free Tool',
    pageDescription:
      'Free browser-based WCAG AA and AAA contrast ratio checker. Verify any colour pair instantly — no sign-up, no limits.',
    heroTitle: 'WCAG contrast',
    heroTitleEm: 'checker.',
    heroDesc:
      'Paste any two hex colours and instantly see the contrast ratio with AA and AAA pass/fail. Came from verifying 21 colour pairs by hand on a production invoice app — so I built the tool that automates it.',
  },
  {
    id: 'specificity',
    href: '/tools/specificity',
    icon: '🎯',
    iconBg: 'rgba(127,119,221,0.1)',
    name: 'CSS specificity calculator',
    sub: 'Paste any selector · instant token breakdown',
    desc: 'Paste any CSS selector and see exactly what contributes to its specificity score — IDs, classes, pseudo-classes, elements. Supports multiple selectors sorted by specificity.',
    tags: ['CSS', 'Debugging', 'Frontend'],
    pageTitle: 'CSS Specificity Calculator — Free Tool',
    pageDescription:
      'Free browser-based CSS specificity calculator. Paste any selector and instantly see the specificity score with a per-token breakdown.',
    heroTitle: 'CSS specificity',
    heroTitleEm: 'calculator.',
    heroDesc:
      'Paste any CSS selector and see exactly what contributes to its specificity score — IDs, classes, pseudo-classes, elements. Supports multiple selectors sorted by specificity.',
  },
  {
    id: 'tanstack',
    href: '/tools/tanstack',
    icon: '⚙️',
    iconBg: 'rgba(29,158,117,0.1)',
    name: 'TanStack Query hook generator',
    sub: 'Paste endpoint + Swagger JSON · get a typed hook',
    desc: 'Describe your endpoint, paste the Swagger JSON response, and get a fully typed useQuery or useMutation hook. TypeScript interface auto-generated from JSON. Built after writing 30+ hooks in production.',
    tags: ['React', 'TypeScript', 'TanStack'],
    pageTitle: 'TanStack Query Hook Generator — Free Tool',
    pageDescription:
      'Free browser-based TanStack Query hook generator. Paste your endpoint and Swagger JSON response — get a fully typed useQuery or useMutation hook instantly.',
    heroTitle: 'TanStack Query',
    heroTitleEm: 'hook generator.',
    heroDesc:
      'Describe your endpoint, paste the Swagger JSON response, and get a fully typed hook — useQuery for GET, useMutation for everything else. TypeScript interface auto-generated from JSON.',
  },
  {
    id: 'business-builder',
    href: '/tools/business-builder',
    icon: '🧠',
    iconBg: 'rgba(99,102,241,0.1)',
    name: 'ProductIQ — What should you build?',
    sub: 'Answer 8 questions · get a personalised product strategy',
    desc: 'Not sure what to build for your business? Answer 8 questions and get a personalised strategy — platform recommendation, name ideas, monetisation roadmap, and your first 3 things to build. Powered by AI.',
    tags: ['Business', 'Strategy', 'AI-powered'],
    pageTitle: productIQData.pageTitle,
    pageDescription: productIQData.pageDescription,
    heroTitle: 'ProductIQ',
    heroTitleEm: 'What should you build?',
    heroDesc: productIQData.description,
  },
]