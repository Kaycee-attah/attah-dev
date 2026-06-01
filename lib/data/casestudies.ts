// ─── CASE STUDY DATA ──────────────────────────────────────────
// All case study content lives here.
// When Admin panel is built, these will be fetched
// from the database instead.

export const fuegeCaseStudy = {
  id: 'fuege',
  name: 'Fuege',
  tagline: '3D Furniture Customizer',
  liveUrl: 'https://fuege.netlify.app',
  githubUrl: 'https://github.com/Kaycee-attah',
  stack: ['Vue 3', 'Three.js', 'Pinia', 'Flutterwave', 'Vite'],
  timeline: '6 weeks · 2024',
  role: 'Solo frontend developer',
  status: 'Live',

  overview:
    'Fuege is a real-time 3D furniture customizer that lets customers configure sofas, chairs, and sectionals — swapping materials, colours, and fabric types — before paying via Flutterwave. Built entirely as a frontend project with Three.js handling the 3D rendering.',

  problem:
    'Most furniture e-commerce sites show static product photos. Customers can\'t visualise how a sofa would look in brown leather vs grey cotton, or how a sectional looks from different angles. This leads to purchase hesitation and returns. Fuege needed to solve this with a real-time 3D experience that felt fast, not like a loading screen.',

  metrics: [
    { value: '60fps',  label: 'Texture swap speed',    sub: 'No frame drops on material change' },
    { value: '1.2s',   label: 'Initial load time',     sub: 'Down from 8s before optimisation' },
    { value: '95+',    label: 'Lighthouse score',       sub: 'Performance + accessibility' },
    { value: '6',      label: 'Furniture models',       sub: 'Sofa, chair, sectional + variants' },
  ],

  challenges: [
    {
      id: 'load-time',
      title: '8 second load time',
      problem:
        'Three.js models and high-res textures were loading all at once on page load. The initial bundle was enormous — users were waiting 8+ seconds before seeing anything.',
      solution:
        'Implemented lazy loading for all 3D models — only the currently selected furniture loads upfront. Remaining models load in the background after initial paint. Textures are cached after first load so subsequent swaps are instant.',
      outcome: 'Load time dropped from 8s to 1.2s.',
    },
    {
      id: 'texture-swap',
      title: 'Texture swapping performance',
      problem:
        'Early implementation re-created the Three.js material object on every colour or fabric change, causing a visible flash and frame drop each time a user selected a new option.',
      solution:
        'Switched to mutating the existing material object in place rather than replacing it. Pre-loaded all texture maps for the current model into memory on first render so swaps became near-instant property updates.',
      outcome: 'Texture swaps now run at 60fps with no visible flash.',
    },
    {
      id: 'payment',
      title: 'Flutterwave integration with dynamic pricing',
      problem:
        'Each customisation combination — colour + fabric + model — produces a different final price. The Flutterwave checkout needed to reflect the exact configured price, not a base price.',
      solution:
        'Built a reactive price calculator in Pinia that tracks the selected base model, colour modifier, and fabric upcharge. The final computed price is passed directly to the Flutterwave payment modal at checkout.',
      outcome: 'Accurate per-configuration pricing with zero manual calculation.',
    },
  ],

  screenshots: [
  {
    id: 'hero',
    path: '/images/fuege/fuege-hero.png',
    caption: 'Homepage hero — "Welcome to Our Furniture Store" with gradient banner',
  },
  {
    id: 'collections',
    path: '/images/fuege/fuege-collections.png',
    caption: 'Featured collections — 6 furniture products with Naira pricing',
  },
  {
    id: 'customizer-cotton',
    path: '/images/fuege/fuege-customizer-cotton.png',
    caption: '3D customizer — cotton material selected, real-time texture swap',
  },
  {
    id: 'customizer-orbit',
    path: '/images/fuege/fuege-customizer-orbit.png',
    caption: '360° orbit — users inspect furniture from any angle',
  },
  {
    id: 'mid-century',
    path: '/images/fuege/fuege-mid-century.png',
    caption: 'Mid-century modern — full customizer panel with colour swatches',
  },
],

  learnings: [
    'Three.js performance is almost entirely about what you load and when — lazy loading was the single biggest win.',
    'Mutating objects in place is sometimes the right call. React\'s immutability patterns don\'t always translate to Three.js.',
    'Pinia\'s computed stores are extremely well-suited to reactive price calculation — this would have been messier in Vuex.',
  ],
}

export const hmsCaseStudy = {
  id: 'hms',
  name: 'Oneflare HMS',
  tagline: 'Hotel Management System',
  liveUrl: '#',
  githubUrl: '#',
  stack: ['Next.js 14', 'TypeScript', 'TanStack Query', 'Axios', 'Tailwind CSS'],
  timeline: 'Mar 2026 – Present',
  role: 'Frontend Engineer',
  status: 'Production · Private',
  permission: 'Screenshots shown with permission from Oneflare Technologies',

  overview:
    'HMS is a full hotel operations platform built for Oneflare Technologies. It covers reservations, housekeeping, maintenance, warehouse management, financials, and reporting across 9 operational modules. I joined as the frontend engineer responsible for building and maintaining the entire client-facing application.',

  problem:
    'Hotel operations were being managed across disconnected tools — spreadsheets for inventory, separate systems for reservations, manual processes for reporting. The business needed a unified platform where every department could work from a single source of truth, with real-time data and exportable reports.',

  metrics: [
    { value: '11',   label: 'Live report pages',      sub: 'Date filtering + CSV export' },
    { value: '30+',  label: 'TanStack Query hooks',   sub: 'Custom hooks across 9 modules' },
    { value: '9',    label: 'Operational modules',    sub: 'Reservations to financials' },
    { value: '12+',  label: 'Production bugs fixed',  sub: 'API mismatches, cache, UI' },
  ],

  challenges: [
    {
      id: 'stacked-modal',
      title: 'Stacked modal — inline category creation',
      problem:
        'In the Warehouse module, users couldn\'t create a stock item if no categories existed yet. Navigating away to create a category lost all form state — a frustrating experience that blocked a core workflow.',
      solution:
        'Built a stacked modal pattern — a CreateCategoryModal opens on top of the AddItemModal. On save, it invalidates the TanStack Query cache for categories, which auto-refreshes the dropdown in the parent modal and auto-selects the newly created category. The user never leaves the form.',
      outcome: 'Zero form state lost. Workflow unblocked. Pattern reused in 3 other modules.',
    },
    {
      id: 'report-pages',
      title: '11 report pages with consistent data patterns',
      problem:
        'Each report page needed date range filtering, paginated data fetching, loading states, error states, and CSV export — built consistently across 11 different data domains.',
      solution:
        'Extracted a reusable report page pattern using TanStack Query with a shared date filter component. Each report page composes from the same building blocks but fetches from its own endpoint. CSV export uses a shared utility that serialises any query result to a downloadable file.',
      outcome: 'All 11 report pages built with consistent UX. New reports can be added in under 2 hours.',
    },
    {
      id: 'api-mismatches',
      title: 'API contract mismatches in production',
      problem:
        'Several backend API responses changed shape after I had already built the consuming components — field names renamed, nested objects flattened, arrays replaced with paginated wrappers. This caused silent failures in production.',
      solution:
        'Introduced a thin data-transformation layer between the API response and the component. Each TanStack Query hook now includes a select function that maps the raw API shape to the shape the component expects. API changes only require updating the select function, not the component.',
      outcome: '12+ production bugs resolved. New API changes no longer break the UI.',
    },
  ],

  learnings: [
    'TanStack Query\'s select option is underused. It\'s the cleanest way to decouple your UI from your API contract.',
    'Stacked modals feel complex but the user experience payoff is significant. The pattern is worth the extra state management.',
    'Building 11 report pages taught me that consistency is more valuable than per-page optimisation. Shared patterns compound.',
  ],

  screenshots: [
  {
    id: 'login',
    path: '/images/hms/hms-login.png',
    caption: 'Sign in page — split layout with HMS branding',
  },
  {
    id: 'rooms-report',
    path: '/images/hms/hms-rooms-report.png',
    caption: 'Rooms report — occupancy stats and revenue table',
  },
  {
    id: 'country-report',
    path: '/images/hms/hms-country-report.png',
    caption: 'Country report — branch revenue and occupancy by country',
  },
  {
    id: 'monthly-sales-graph',
    path: '/images/hms/hms-monthly-sales-graph.png',
    caption: 'Monthly sales graph — revenue trend across months',
  },
  {
    id: 'monthly-sales-table',
    path: '/images/hms/hms-monthly-sales-table.png',
    caption: 'Monthly sales table — rooms and services breakdown',
  },
  {
    id: 'expenses',
    path: '/images/hms/hms-expenses.png',
    caption: 'Expenses report — summary cards with date-filtered table',
  },
  {
    id: 'supplier',
    path: '/images/hms/hms-supplier.png',
    caption: 'Supplier management — searchable paginated table',
  },
  {
    id: 'wallet',
    path: '/images/hms/hms-wallet.png',
    caption: 'Wallet — total balance with sub-wallet breakdown',
  },
  {
    id: 'staff-login',
    path: '/images/hms/hms-staff-login.png',
    caption: 'Staff login — device tracking with MAC ID and IP address',
  },
],
}