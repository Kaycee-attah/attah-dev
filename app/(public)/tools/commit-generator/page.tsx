import type { Metadata } from 'next'
import Link from 'next/link'
import CommitGenerator from '@/components/tools/CommitGenerator'

export const metadata: Metadata = {
  title: 'Git Commit Generator — Free Tool',
  description:
    'Free AI-powered git commit message generator. Paste your diff or describe what you changed — get a properly formatted conventional commit message instantly.',
}

export default function CommitGeneratorPage() {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
      <div style={{ padding: '20px 0', borderBottom: '0.5px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/tools" style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-ghost)', textDecoration: 'none' }}>
          ← All tools
        </Link>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-whisper)' }}>
          Free · AI-powered · 10 generations/hr
        </span>
      </div>

      <div style={{ padding: '40px 0 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <span style={{ width: '32px', height: '1px', background: 'var(--amber)', display: 'inline-block' }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--amber)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Tool</span>
        </div>
        <h1 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text-primary)', lineHeight: 1.0, marginBottom: '10px' }}>
          Git commit{' '}
          <em style={{ fontStyle: 'italic', fontWeight: 300, color: 'var(--text-muted)' }}>generator.</em>
        </h1>
        <p style={{ fontSize: '14px', lineHeight: 1.75, color: 'var(--text-dim)', maxWidth: '520px', marginBottom: '16px' }}>
          Describe what you changed or paste your git diff. Get a properly formatted conventional commit message — editable before you copy. Built after writing hundreds of commits across production projects.
        </p>

        {/* VSCODE EXTENSION BADGE */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <a
            href="https://marketplace.visualstudio.com/items?itemName=attah-kelechi.commit-gen"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 14px',
              background: 'rgba(245,158,11,0.06)',
              border: '0.5px solid rgba(245,158,11,0.2)',
              borderRadius: '7px',
              fontSize: '12px',
              color: 'var(--amber)',
              textDecoration: 'none',
              fontFamily: 'var(--font-mono)',
              fontWeight: 600,
            }}
          >
            ↗ Also available as a VSCode extension
          </a>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-ghost)' }}>
            Free · Bring your own Groq key · Works in any project
          </span>
        </div>
      </div>

      <div style={{ background: 'var(--bg-surface)', border: '0.5px solid var(--border)', borderRadius: '12px', overflow: 'hidden', marginBottom: '80px' }}>
        <CommitGenerator />
      </div>
    </div>
  )
}