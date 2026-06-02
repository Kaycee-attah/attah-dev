import type { Metadata } from 'next'
import CaseStudyPage from '@/components/pages/CaseStudyPage'
import { hmsCaseStudy } from '@/lib/data/casestudies'

export const metadata: Metadata = {
  title: 'Oneflare HMS — Hotel Management System',
  description:
    'Case study: Building a full hotel management system at Oneflare Technologies. 11 report pages, 30+ TanStack Query hooks, 9 operational modules.',
}

export default function HMSPage() {
  return <CaseStudyPage study={hmsCaseStudy} />
}