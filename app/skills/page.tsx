import type { Metadata } from 'next'
import Skills from '@/components/sections/Skills'

export const metadata: Metadata = {
  title: 'Skills',
  description:
    'React, Next.js, TypeScript, Vue 3, Angular, Node.js, PostgreSQL and more. Full breakdown of what Attah Kelechi builds with.',
}

export default function SkillsPage() {
  return <Skills />
}