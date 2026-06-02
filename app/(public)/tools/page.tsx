import type { Metadata } from 'next'
import Link from 'next/link'
import { toolsData, toolsList } from '@/lib/data/tools'

export const metadata: Metadata = {
  title: toolsData.pageTitle,
  description: toolsData.pageDescription,
}

export default function ToolsPage() {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>

      {/* HERO */}
      <div style={{ padding: '52px 0 44px', borderBottom: '0.5px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
          <span style={{ width: '32px', height: '1px', background: 'var(--amber)', display: 'inline-block' }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--amber)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Free tools</span>
        </div>
        <h1 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text-primary)', lineHeight: 1.0, marginBottom: '12px' }}>
          {toolsData.title}{' '}
          <em style={{ fontStyle: 'italic', fontWeight: 300, color: 'var(--text-muted)' }}>
            {toolsData.titleEm}
          </em>
        </h1>
        <p style={{ fontSize: '15px', lineHeight: 1.75, color: 'var(--text-dim)', maxWidth: '520px' }}>
          {toolsData.description}
        </p>
      </div>

      {/* TOOLS LIST */}
      <div style={{ padding: '40px 0 80px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {toolsList.map((tool) => (
          <Link key={tool.id} href={tool.href} style={{ textDecoration: 'none' }}>
            <div
              style={{
                background: 'var(--bg-surface)',
                border: '0.5px solid var(--border)',
                borderRadius: '12px',
                padding: '24px',
                display: 'grid',
                gridTemplateColumns: 'auto 1fr auto',
                gap: '20px',
                alignItems: 'center',
                transition: 'border-color var(--transition)',
                cursor: 'pointer',
              }}
              className="tool-overview-card"
            >
              <div style={{ width: '48px', height: '48px', borderRadius: '10px', background: tool.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>
                {tool.icon}
              </div>
              <div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.01em', marginBottom: '4px' }}>{tool.name}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-ghost)', marginBottom: '8px' }}>{tool.sub}</div>
                <p style={{ fontSize: '13px', color: 'var(--text-dim)', lineHeight: 1.65, maxWidth: '560px', marginBottom: '10px' }}>{tool.desc}</p>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {tool.tags.map((tag) => (
                    <span key={tag} style={{ padding: '2px 8px', border: '0.5px solid var(--border)', borderRadius: '3px', fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--text-ghost)', background: 'var(--bg-elevated)' }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', color: 'var(--amber)', flexShrink: 0 }}>→</div>
            </div>
          </Link>
        ))}
      </div>

    </div>
  )
}