import type { Metadata } from 'next'
import Experience from '@/components/sections/Experience'

export const metadata: Metadata = {
  title: 'Experience',
  description:
    'Frontend Engineer at Oneflare Technologies. HNG Internship 2026. SIWES at ROLOF Institute. The full story of how I got here.',
}

export default function ExperiencePage() {
  return <Experience />
}