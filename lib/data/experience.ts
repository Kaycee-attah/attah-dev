// ─── EXPERIENCE DATA ──────────────────────────────────────────
// Q&A conversation format — recruiter questions + Attah answers
// When Admin panel is built, these will come from the database

export const conversations = [
  {
    id: 'current-role',
    question: 'Where are you currently working?',
    answer:
      'Frontend Engineer at Oneflare Technologies — building HMS, a full hotel management system. I shipped 11 live report pages, authored 30+ TanStack Query hooks, and built across 9 operational modules.',
    highlights: ['11 live report pages', '30+ TanStack Query hooks', '9 operational modules'],
    stack: ['Next.js 14', 'TypeScript', 'TanStack Query', 'Axios'],
    period: 'Mar 2026 – Present · Remote',
  },
  {
    id: 'backend',
    question: 'Any backend experience?',
    answer:
      'Yes — built a production REST API with a custom NLP parser from scratch, no libraries. It maps plain English like "show me women over 30 in Lagos" to parameterised SQL. 80+ countries, sub-500ms response times, 100/100 HNG grading.',
    highlights: ['custom NLP parser from scratch', '80+ countries', '100/100 HNG grading'],
    stack: ['Node.js', 'Express', 'PostgreSQL', 'Railway'],
    period: 'Apr 2026 – Present · Remote',
  },
  {
    id: 'hard-problem',
    question: 'Tell me about a hard problem you solved in production.',
    answer:
      "In the Warehouse module, users couldn't create a stock item if no categories existed — navigating away lost their form state. I built a stacked modal pattern — CreateCategoryModal opens on top of AddItemModal, saves, invalidates the query, auto-refreshes the dropdown, and auto-selects the new category. No form state lost.",
    highlights: ['stacked modal pattern', 'auto-selects the new category'],
    stack: [],
    period: 'Oneflare Technologies · 2026',
  },
  {
    id: 'before-paid',
    question: 'What did you build before anyone paid you to?',
    answer:
      "CPE Study Hub — interactive study tools used by 300+ classmates across 6 courses at Redeemer's University. I saw a gap and filled it. Still live.",
    highlights: ['300+ classmates', '6 courses'],
    stack: ['React', 'Firebase', 'HTML/CSS'],
    period: 'Redeemer\'s University · 2022–2023',
  },
  {
    id: 'hardware',
    question: 'Hardware or software?',
    answer:
      'Both. Started with microcontrollers and IoT systems at ROLOF Institute — automated irrigation, obstacle avoidance, embedded C++. That hardware foundation is still how I think about performance today.',
    highlights: ['microcontrollers and IoT systems'],
    stack: ['C++', 'Python', 'Arduino', 'IoT'],
    period: 'ROLOF Institute · Jul–Sep 2024',
  },
]

// ─── EXPERIENCE PAGE DATA ─────────────────────────────────────
export const experiencePageData = {
  title: "Where I've",
  titleEm: 'worked.',
}

export const experiences = [
  {
    id: 'oneflare',
    role: 'Frontend Engineer',
    company: 'Oneflare Technologies',
    location: 'Remote · Nigeria',
    period: 'Mar 2026 — Present',
    status: 'current',
    statusLabel: 'Current',
    bullets: [
      'Built and integrated <strong>11 live report pages</strong> for a Hotel Management System — Occupancy, Staff Sales, Daily Sales, Taxation, Expenses — each with date filtering and CSV export',
      'Authored <strong>30+ custom TanStack Query hooks</strong> for CRUD, server-side pagination, search, and blob-based CSV exports across 9 operational modules',
      'Enforced frontend architecture standards — centralised Axios via a custom HotelAPI wrapper, typed query key constants, and a reusable <strong>ConfirmDeleteModal</strong> replacing all native browser dialogs',
      'Diagnosed and resolved <strong>12+ production bugs</strong> including API payload mismatches, stale query cache, and incorrect endpoint paths across Rooms, Warehouse, Wallet, and Housekeeping modules',
      'Solved a critical UX gap by building an <strong>inline stacked modal</strong> for category creation — users can create and auto-select a category without losing their current form state',
    ],
    stack: ['Next.js 14', 'TypeScript', 'TanStack Query', 'Axios', 'Tailwind CSS', 'Recharts'],
    stackLit: true,
  },
  {
    id: 'hng-frontend',
    role: 'Frontend Developer Intern',
    company: 'HNG Internship 2026',
    location: 'Remote',
    period: 'Apr 2026 — Present',
    status: 'current',
    statusLabel: 'Current',
    bullets: [
      'Built a fully accessible <strong>Invoice Management App</strong> in React — complete CRUD, Draft/Pending/Paid workflow, light/dark mode with zero flash, WCAG AA verified across 21 colour pairs',
      'Built a <strong>Todo Card</strong> with inline editing, overdue detection updating every 30 seconds, and full keyboard navigation — passed all automated test criteria at Stage 1a',
      'Diagnosed and fixed critical React bugs — Hook order violations, focus loss on keystroke, and a <strong>WCAG AA colour contrast failure</strong> (4.37:1) identified and corrected without tooling',
      'Achieved <strong>100/100 Stage 0 grading</strong> — all automated tests passed including precise data-testid matching and accessibility compliance',
    ],
    stack: ['React', 'Vite', 'Vanilla JS', 'WCAG AA', 'ARIA', 'Vercel'],
    stackLit: true,
  },
  {
    id: 'hng-backend',
    role: 'Backend Developer Intern',
    company: 'HNG Internship 2026',
    location: 'Remote',
    period: 'Apr 2026 — Present',
    status: 'current',
    statusLabel: 'Current',
    bullets: [
      'Built a production REST API across <strong>3 progressive stages</strong> — external API integration, full CRUD with PostgreSQL, and an advanced query engine with 7 combinable filters',
      'Wrote a <strong>custom NLP parser from scratch</strong> (no libraries) mapping plain-English queries to parameterised SQL — handles 80+ countries, gender, age ranges, and cursor-based pagination',
      'Seeded <strong>2,026 profiles</strong>, created 7 PostgreSQL indexes, achieved sub-500ms response times on Railway free tier',
    ],
    stack: ['Node.js', 'Express', 'PostgreSQL', 'Axios', 'Railway'],
    stackLit: true,
  },
  {
    id: 'rolof',
    role: 'SIWES Intern',
    company: 'ROLOF Institute of Management & Technology',
    location: 'Delta State, Nigeria',
    period: 'Jul 2024 — Sep 2024',
    status: 'hardware',
    statusLabel: 'Hardware',
    bullets: [
      'Prototyped IoT systems including <strong>obstacle avoidance devices</strong> using ultrasonic sensors and motor shields',
      'Engineered an <strong>automated water irrigation system</strong> integrating soil moisture sensors with relay-controlled pumps — programmed in C++ and Python for real-time data processing',
    ],
    stack: ['C++', 'Python', 'Arduino', 'IoT', 'Sensors'],
    stackLit: false,
  },
  {
    id: 'hng-2023',
    role: 'Web Development Intern',
    company: 'HNG Internship 2023',
    location: 'Remote',
    period: 'Sep 2023 — Oct 2023',
    status: 'completed',
    statusLabel: 'Completed',
    bullets: [
      'Built responsive websites using <strong>React, GSAP, and Three.js</strong> — scroll-triggered animations and interactive 3D elements',
      'Developed mobile-first applications improving <strong>mobile engagement by 40%</strong> — built RESTful APIs and integrated third-party services',
    ],
    stack: ['React', 'GSAP', 'Three.js', 'REST APIs'],
    stackLit: false,
  },
]

export const education = {
  degree: 'B.Eng. Computer Engineering',
  school: "Redeemer's University, Nigeria",
  period: 'Expected Oct 2026',
  status: 'First Class Honours',
  gpa: '4.79',
  gpaMax: '5',
  tags: [
    "Dean's List — Every year since 2021",
    'Data Structures & Algorithms',
    'Embedded Systems',
    'Human-Computer Interaction',
  ],
}