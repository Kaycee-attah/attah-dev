import type { Metadata } from 'next'
import BlogPage from '@/components/pages/BlogPage'

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Writing about things I actually built — the problems, the decisions, the lessons. No tutorials that already exist.',
}

export default function Blog() {
  return <BlogPage />
}