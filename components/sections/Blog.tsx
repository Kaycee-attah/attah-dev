'use client'

import Link from 'next/link'
import { useFadeUp, useStaggerAnimation } from '@/lib/useGSAP'
import { blogPosts, blogData } from '@/lib/data/blog'

export default function Blog() {
  const ref = useFadeUp({ y: 32, duration: 0.7 })
  const cardsRef = useStaggerAnimation(
    '.blog-card',
    { opacity: 0, y: 28, rotation: 1 },
    { opacity: 1, y: 0, rotation: 0, duration: 0.55, ease: 'power2.out', stagger: 0.12 },
    { start: 'top 85%' }
  )

  return (
    <section
      ref={ref}
      style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '80px 24px',
      }}
    >

      {/* ── HEADER ───────────────────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          marginBottom: '32px',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <h2
          style={{
            fontSize: 'clamp(28px, 4vw, 36px)',
            fontWeight: 800,
            letterSpacing: '-0.025em',
            color: 'var(--text-primary)',
            lineHeight: 1.1,
          }}
        >
          {blogData.title}{' '}
          <em
            style={{
              fontStyle: 'italic',
              fontWeight: 300,
              color: 'var(--text-muted)',
            }}
          >
            {blogData.titleEm}
          </em>
        </h2>

        <Link
          href={blogData.viewAllHref}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: 'var(--text-ghost)',
            letterSpacing: '0.03em',
            border: '0.5px solid var(--border)',
            padding: '7px 14px',
            borderRadius: '6px',
            background: 'var(--bg-surface)',
            textDecoration: 'none',
            transition: 'color var(--transition), border-color var(--transition)',
          }}
        >
          View all posts →
        </Link>
      </div>

      {/* ── POSTS GRID ───────────────────────────────────────── */}
      <div
        ref={cardsRef}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '12px',
        }}
        className="blog-grid"
      >
        {blogPosts.map((post) => (
          <div
            className="blog-card"
            key={post.id}
            style={{
              background: 'var(--bg-surface)',
              border: '0.5px solid var(--border)',
              borderRadius: '12px',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              transition: 'border-color var(--transition), transform 0.15s ease',
              cursor: 'pointer',
            }}
          >

            {/* CODE PREVIEW */}
            <div
              style={{
                background: 'var(--bg-elevated)',
                padding: '16px',
                borderBottom: '0.5px solid var(--border)',
                minHeight: '110px',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  lineHeight: 1.85,
                }}
              >
                {post.codePreview.map((line, lineIndex) => (
                  <div key={lineIndex}>
                    {line.tokens.map((token, tokenIndex) => (
                      <span
                        key={tokenIndex}
                        style={{ color: token.color }}
                      >
                        {token.text}
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* CARD BODY */}
            <div
              style={{
                padding: '16px',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
              }}
            >

              {/* META ROW */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '10px',
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
                <span
                  style={{
                    padding: '2px 8px',
                    border: '0.5px solid var(--border)',
                    borderRadius: '4px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '9px',
                    color: 'var(--text-ghost)',
                  }}
                >
                  {post.status}
                </span>
              </div>

              {/* TITLE */}
              <h3
                style={{
                  fontSize: '13px',
                  fontWeight: 700,
                  color: 'var(--text-secondary)',
                  lineHeight: 1.4,
                  letterSpacing: '-0.01em',
                  marginBottom: '8px',
                }}
              >
                {post.title}
              </h3>

              {/* EXCERPT */}
              <p
                style={{
                  fontSize: '12px',
                  lineHeight: 1.65,
                  color: 'var(--text-dim)',
                  flex: 1,
                  marginBottom: '14px',
                }}
              >
                {post.excerpt}
              </p>

              {/* FOOTER */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: 'auto',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    color: 'var(--text-whisper)',
                  }}
                >
                  {post.readTime}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    color: 'var(--text-ghost)',
                  }}
                >
                  Read →
                </span>
              </div>

            </div>
          </div>
        ))}
      </div>

    </section>
  )
}