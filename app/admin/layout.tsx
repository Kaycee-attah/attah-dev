import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: 'Admin — attah.dev',
    template: '%s | Admin',
  },
  robots: 'noindex, nofollow',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg-base)',
        display: 'flex',
      }}
    >
      {children}
    </div>
  )
}