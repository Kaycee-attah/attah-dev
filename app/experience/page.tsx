import type { Metadata } from 'next'
import ExperiencePage from '@/components/pages/ExperiencePage'

export const metadata: Metadata = {
  title: 'Experience',
  description:
    'Frontend Engineer at Oneflare Technologies. HNG Internship 2026. SIWES at ROLOF Institute. The full story of how Attah Kelechi got here.',
}

export default function Experience() {
  return <ExperiencePage />
}