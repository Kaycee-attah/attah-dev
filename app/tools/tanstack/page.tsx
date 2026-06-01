import type { Metadata } from 'next'
import Link from 'next/link'
import TanstackTool from '@/components/tools/TanstackTool'
import { toolsList } from '@/lib/data/tools'

const tool = toolsList.find((t) => t.id === 'tanstack')!

export const metadata: Metadata = {
  title: tool.pageTitle,
  description: tool.pageDescription,
}

export default function TanstackPage() {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
      <div style={{ padding: '20px 0', borderBottom: '0.5px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/tools" style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-ghost)', textDecoration: 'none' }}>← All tools</Link>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-whisper)' }}>Free · Browser only · No sign-up</span>
      </div>
      <div style={{ padding: '40px 0 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <span style={{ width: '32px', height: '1px', background: 'var(--amber)', display: 'inline-block' }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--amber)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Tool</span>
        </div>
        <h1 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text-primary)', lineHeight: 1.0, marginBottom: '10px' }}>
          {tool.heroTitle}{' '}
          <em style={{ fontStyle: 'italic', fontWeight: 300, color: 'var(--text-muted)' }}>{tool.heroTitleEm}</em>
        </h1>
        <p style={{ fontSize: '14px', lineHeight: 1.75, color: 'var(--text-dim)', maxWidth: '520px' }}>{tool.heroDesc}</p>
      </div>
      <div style={{ background: 'var(--bg-surface)', border: '0.5px solid var(--border)', borderRadius: '12px', overflow: 'hidden', marginBottom: '80px' }}>
        <TanstackTool />
      </div>
    </div>
  )
}