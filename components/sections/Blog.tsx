'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useFadeUp, useStaggerAnimation } from '@/lib/useGSAP'
import { blogData } from '@/lib/data/blog'

interface Post {
  id: string
  title: string
  slug: string
  excerpt: string
  tags: string[]
  status: string
  read_time: number
  cover_image: string
  created_at: string
}

export default function Blog() {
  const [posts, setPosts] = useState<Post[]>([])
  const ref = useFadeUp({ y: 32, duration: 0.7 })
  const cardsRef = useStaggerAnimation(
    '.blog-card',
    { opacity: 0, y: 28, rotation: 1 },
    { opacity: 1, y: 0, rotation: 0, duration: 0.55, ease: 'power2.out', stagger: 0.12 },
    { start: 'top 85%' }
  )

  useEffect(() => {
    fetch('/api/blog')
      .then(r => r.json())
      .then(data => setPosts(data.posts?.slice(0, 3) || []))
      .catch(() => setPosts([]))
  }, [])

  const tagColors: Record<string, { color: string; bg: string; border: string }> = {
    default: { color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)' },
    Backend: { color: '#4ade80', bg: 'rgba(74,222,128,0.08)', border: 'rgba(74,222,128,0.2)' },
    Frontend: { color: '#60a5fa', bg: 'rgba(96,165,250,0.08)', border: 'rgba(96,165,250,0.2)' },
    Accessibility: { color: '#fb7185', bg: 'rgba(251,113,133,0.08)', border: 'rgba(251,113,133,0.2)' },
    AI: { color: '#c084fc', bg: 'rgba(192,132,252,0.08)', border: 'rgba(192,132,252,0.2)' },
    ProductIQ: { color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)' },
  }

  const getTagStyle = (tags: string[]) => {
    const tag = tags?.[0] || ''
    return tagColors[tag] || tagColors.default
  }

  return (
    <section
      ref={ref}
      style={{ maxWidth: '1200px', margin: '0 auto', padding: '80px 24px' }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <h2 style={{ fontSize: 'clamp(28px, 4vw, 36px)', fontWeight: 800, letterSpacing: '-0.025em', color: 'var(--text-primary)', lineHeight: 1.1 }}>
          {blogData.title}{' '}
          <em style={{ fontStyle: 'italic', fontWeight: 300, color: 'var(--text-muted)' }}>
            {blogData.titleEm}
          </em>
        </h2>
        <Link
          href="/blog"
          style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-ghost)', letterSpacing: '0.03em', border: '0.5px solid var(--border)', padding: '7px 14px', borderRadius: '6px', background: 'var(--bg-surface)', textDecoration: 'none' }}
        >
          View all posts →
        </Link>
      </div>

      {posts.length === 0 ? (
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-ghost)', padding: '40px 0' }}>
          No posts yet — check back soon.
        </div>
      ) : (
        <div
          ref={cardsRef}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}
          className="blog-grid"
        >
          {posts.map((post) => {
            const tagStyle = getTagStyle(post.tags)
            const tag = post.tags?.[0] || 'Blog'
            return (
              <Link
                href={`/blog/${post.slug}`}
                key={post.id}
                className="blog-card"
                style={{ background: 'var(--bg-surface)', border: '0.5px solid var(--border)', borderRadius: '12px', overflow: 'hidden', display: 'flex', flexDirection: 'column', textDecoration: 'none', cursor: 'pointer' }}
              >
                {/* COVER IMAGE */}
                {post.cover_image ? (
                  <div style={{ width: '100%', aspectRatio: '1200/630', overflow: 'hidden', borderBottom: '0.5px solid var(--border)' }}>
                    <img src={post.cover_image} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
                  </div>
                ) : (
                  <div style={{ background: 'var(--bg-elevated)', padding: '16px', borderBottom: '0.5px solid var(--border)', minHeight: '110px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-whisper)' }}>No cover</span>
                  </div>
                )}

                {/* CARD BODY */}
                <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', flexWrap: 'wrap' }}>
                    <span style={{ padding: '3px 9px', borderRadius: '4px', fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.05em', textTransform: 'uppercase', background: tagStyle.bg, border: `0.5px solid ${tagStyle.border}`, color: tagStyle.color }}>
                      {tag}
                    </span>
                    <span style={{ padding: '2px 8px', border: '0.5px solid var(--border)', borderRadius: '4px', fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--text-ghost)' }}>
                      {post.status === 'published' ? 'Published' : 'Draft'}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-secondary)', lineHeight: 1.4, letterSpacing: '-0.01em', marginBottom: '8px' }}>
                    {post.title}
                  </h3>

                  <p style={{ fontSize: '12px', lineHeight: 1.65, color: 'var(--text-dim)', flex: 1, marginBottom: '14px' }}>
                    {post.excerpt}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-whisper)' }}>
                      {post.read_time} min read
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-ghost)' }}>
                      Read →
                    </span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </section>
  )
}