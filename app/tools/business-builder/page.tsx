import type { Metadata } from 'next'
import BusinessBuilder from '@/components/tools/BusinessBuilder'
import { productIQData } from '@/lib/data/business-builder'

export const metadata: Metadata = {
  title: productIQData.pageTitle,
  description: productIQData.pageDescription,
}

export default function BusinessBuilderPage() {
  return <BusinessBuilder />
}