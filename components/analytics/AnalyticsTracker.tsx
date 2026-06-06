'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

export default function AnalyticsTracker() {
  const pathname = usePathname()
  const lastPathname = useRef<string | null>(null)

  useEffect(() => {
    // Don't track the same page twice in a row
    if (pathname === lastPathname.current) return
    lastPathname.current = pathname

    // Don't track in development
    if (process.env.NODE_ENV === 'development') return

    const referrer = document.referrer || null

    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pathname, referrer }),
    }).catch(() => {
      // Analytics failure should never affect the user
    })
  }, [pathname])

  return null
}