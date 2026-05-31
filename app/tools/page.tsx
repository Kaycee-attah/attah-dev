import type { Metadata } from 'next'
import ToolsPage from '@/components/pages/ToolsPage'

export const metadata: Metadata = {
  title: 'Tools',
  description:
    'Free developer tools built from real problems. WCAG contrast checker and NLP query tester — no sign-up, no limits.',
}

export default function Tools() {
  return <ToolsPage />
}