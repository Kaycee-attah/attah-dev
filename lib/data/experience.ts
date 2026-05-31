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