import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { blogPosts } from '@/lib/data/blog'

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = blogPosts.find((p) => p.slug === slug)
  if (!post) return { title: 'Post not found' }
  return {
    title: post.title,
    description: post.excerpt,
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = blogPosts.find((p) => p.slug === slug)
  if (!post) notFound()

  const tocItems = [
    'The problem',
    'The approach',
    'The code',
    'Handling edge cases',
    'Performance results',
    "What I'd do differently",
  ]

  return (
    <div
      style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 24px',
      }}
    >

      {/* ── BACK LINK ──────────────────────────────────────────── */}
      <div
        style={{
          padding: '20px 0',
          borderBottom: '0.5px solid var(--border)',
        }}
      >
        <Link
          href="/blog"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: 'var(--text-ghost)',
            textDecoration: 'none',
            letterSpacing: '0.03em',
          }}
        >
          ← Back to blog
        </Link>
      </div>

      {/* ── LAYOUT ───────────────────────────────────────────── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 220px',
          gap: '48px',
          padding: '40px 0 80px',
          alignItems: 'start',
        }}
        className="post-layout"
      >

        {/* ── ARTICLE ────────────────────────────────────────── */}
        <article>

          {/* POST HEADER */}
          <div style={{ marginBottom: '32px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '14px',
                flexWrap: 'wrap',
              }}
            >
              <span
                style={{
                  padding: '3px 9px',
                  borderRadius: '4px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '9px',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  background: post.tagBg,
                  border: `0.5px solid ${post.tagBorder}`,
                  color: post.tagColor,
                }}
              >
                {post.tag}
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-whisper)' }}>·</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-whisper)' }}>{post.date}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-whisper)' }}>·</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-whisper)' }}>{post.readTime}</span>
              <span
                style={{
                  padding: '3px 9px',
                  borderRadius: '4px',
                  background: 'rgba(245,158,11,0.08)',
                  border: '0.5px solid rgba(245,158,11,0.2)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '9px',
                  color: 'var(--amber)',
                  letterSpacing: '0.05em',
                }}
              >
                {post.status}
              </span>
            </div>

            <h1
              style={{
                fontSize: 'clamp(22px, 3.5vw, 32px)',
                fontWeight: 800,
                letterSpacing: '-0.025em',
                color: 'var(--text-primary)',
                lineHeight: 1.15,
                marginBottom: '14px',
              }}
            >
              {post.title}
            </h1>

            <p
              style={{
                fontSize: '15px',
                lineHeight: 1.75,
                color: 'var(--text-dim)',
                borderLeft: '2px solid var(--amber)',
                paddingLeft: '14px',
              }}
            >
              {post.excerpt}
            </p>
          </div>

          {/* DIVIDER */}
          <div style={{ height: '0.5px', background: 'var(--border)', margin: '24px 0' }} />

          {/* COMING SOON BODY */}
          <div
            style={{
              padding: '48px 32px',
              background: 'var(--bg-surface)',
              border: '0.5px solid var(--border)',
              borderRadius: '12px',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '32px',
                color: 'var(--border-hover)',
                marginBottom: '16px',
              }}
            >
              {'{ }'}
            </div>
            <p
              style={{
                fontSize: '15px',
                fontWeight: 700,
                color: 'var(--text-secondary)',
                marginBottom: '8px',
              }}
            >
              This post is in progress
            </p>
            <p
              style={{
                fontSize: '13px',
                color: 'var(--text-ghost)',
                lineHeight: 1.6,
                maxWidth: '360px',
                margin: '0 auto 24px',
              }}
            >
              I&apos;m writing this up properly. Subscribe on the blog
              page to get notified when it&apos;s live.
            </p>
            <Link href="/blog" className="btn-secondary" style={{ fontSize: '12px' }}>
              ← Back to all posts
            </Link>
          </div>

          {/* CODE PREVIEW */}
          <div style={{ marginTop: '24px' }}>
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                color: 'var(--text-ghost)',
                letterSpacing: '0.07em',
                textTransform: 'uppercase',
                marginBottom: '12px',
              }}
            >
              Code snippet from this post
            </p>
            <div
              style={{
                background: 'var(--bg-surface)',
                border: '0.5px solid var(--border)',
                borderRadius: '8px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '8px 12px',
                  background: 'var(--bg-elevated)',
                  borderBottom: '0.5px solid var(--border)',
                }}
              >
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444', opacity: 0.7, display: 'inline-block' }} />
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#f59e0b', opacity: 0.7, display: 'inline-block' }} />
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', opacity: 0.7, display: 'inline-block' }} />
                <span
                  style={{
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    color: 'var(--text-ghost)',
                  }}
                >
                  {post.slug}.js
                </span>
              </div>
              <div
                style={{
                  padding: '16px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                  lineHeight: 1.9,
                }}
              >
                {post.codePreview.map((line, i) => (
                  <div key={i}>
                    {line.tokens.map((token, j) => (
                      <span key={j} style={{ color: token.color }}>
                        {token.text}
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

        </article>

        {/* ── SIDEBAR ────────────────────────────────────────── */}
        <div
          style={{
            position: 'sticky',
            top: '88px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}
        >
          <div
            style={{
              background: 'var(--bg-surface)',
              border: '0.5px solid var(--border)',
              borderRadius: '10px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                padding: '10px 14px',
                borderBottom: '0.5px solid var(--border)',
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                color: 'var(--text-ghost)',
                letterSpacing: '0.07em',
                textTransform: 'uppercase',
              }}
            >
              On this page
            </div>
            <div style={{ padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {tocItems.map((item, i) => (
                <div
                  key={item}
                  style={{
                    fontSize: '12px',
                    color: i === 0 ? 'var(--text-primary)' : 'var(--text-ghost)',
                    padding: '4px 0 4px 10px',
                    borderLeft: i === 0 ? '2px solid var(--amber)' : '2px solid transparent',
                    cursor: 'pointer',
                  }}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              background: 'var(--bg-surface)',
              border: '0.5px solid var(--border)',
              borderRadius: '10px',
              padding: '14px',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: 'var(--bg-elevated)',
                border: '1.5px solid rgba(245,158,11,0.3)',
                margin: '0 auto 8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                fontWeight: 700,
                color: 'var(--amber)',
              }}
            >
              AK
            </div>
            <p style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '2px' }}>
              Attah Kelechi
            </p>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--text-ghost)', letterSpacing: '0.04em', marginBottom: '12px' }}>
              Frontend Engineer · Osun, NG
            </p>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--text-whisper)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '8px' }}>
              Share this post
            </p>
            <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
              {['Twitter', 'LinkedIn', 'Copy'].map((label) => (
                <button
                  key={label}
                  style={{
                    padding: '5px 10px',
                    background: 'var(--bg-elevated)',
                    border: '0.5px solid var(--border)',
                    borderRadius: '5px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '9px',
                    color: 'var(--text-ghost)',
                    cursor: 'pointer',
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>

      <style>{`
        @media (max-width: 768px) {
          .post-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

    </div>
  )
}