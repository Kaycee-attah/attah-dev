import type { Metadata } from 'next'
import CaseStudyPage from '@/components/pages/CaseStudyPage'
import { fuegeCaseStudy } from '@/lib/data/casestudies'

export const metadata: Metadata = {
  title: 'Fuege — 3D Furniture Customizer',
  description:
    'Case study: How I built a real-time 3D furniture customizer with Vue 3 and Three.js. Load time from 8s to 1.2s, 60fps texture swaps, Flutterwave payments.',
}

export default function FuegePage() {
  return <CaseStudyPage study={fuegeCaseStudy} />
}