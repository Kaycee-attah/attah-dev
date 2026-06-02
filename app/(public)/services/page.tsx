import type { Metadata } from 'next'
import ServicesPage from '@/components/pages/ServicesPage'

export const metadata: Metadata = {
  title: 'Services',
  description:
    'Frontend code review, freelance development, and full-time roles. Production-grade frontend work from Attah Kelechi.',
}

export default function Services() {
  return <ServicesPage />
}