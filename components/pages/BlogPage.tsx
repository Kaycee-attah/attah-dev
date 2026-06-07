'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useFadeUp, useStaggerAnimation } from '@/lib/useGSAP'

const filters = ['All', 'ProductIQ', 'AI', 'Backend', 'Frontend', 'Accessibility', 'Dev Tools', 'Career']

interface Post {
  id: string
  title: string
  slug: string
  excerpt: string
  tags: string[]
  status: string
  read_time: number
  cover_image: string
  featured: boolean
  created_at: string
}

const tagColors: Record<string, { color: string; bg: string; border: string }> = {
  default:      { color: '#f59e0b', bg: 'rgba(245,158,11,0.08)',  border: 'rgba(245,158,11,0.2)'  },
  ProductIQ:    { color: '#f59e0b', bg: 'rgba(245,158,11,0.08)',  border: 'rgba(245,158,11,0.2)'  },
  AI:           { color: '#c084fc', bg: 'rgba(192,132,252,0.08)', border: 'rgba(192,132,252,0.2)' },
  Backend:      { color: '#4ade80', bg: 'rgba(74,222,128,0.08)',  border: 'rgba(74,222,128,0.2)'  },
  Frontend:     { color: '#60a5fa', bg: 'rgba(96,165,250,0.08)',  border: 'rgba(96,165,250,0.2)'  },
  Accessibility:{ color: '#fb7185', bg: 'rgba(251,113,133,0.08)', border: 'rgba(251,113,133,0.2)' },
  'Dev Tools':  { color: '#f59e0b', bg: 'rgba(245,158,11,0.08)',  border: 'rgba(245,158,11,0.2)'  },
  Career:       { color: '#34d399', bg: 'rgba(52,211,153,0.08)',  border: 'rgba(52,211,153,0.2)'  },
}

function getTagStyle(tags: string[]) {
  const tag = tags?.[0] || ''
  return { style: tagColors[tag] || tagColors.default, label: tag || 'Blog' }
}

export default function BlogPage() {
  const heroRef = useFadeUp({ y: 32, duration: 0.7 })
  const postsRef = useStaggerAnimation(
    '.blog-page-card',
    { opacity: 0, y: 24 },
    { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', stagger: 0.1 },
    { start: 'top 88%' }
  )

  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')

  useEffect(() => {
    fetch('/api/blog')
      .then(r => r.json())
      .then(data => { setPosts(data.posts || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const handleNewsletter = async () => {
    if (!newsletterEmail) return
    setNewsletterStatus('sending')
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newsletterEmail }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setNewsletterStatus('success')
      setNewsletterEmail('')
    } catch {
      setNewsletterStatus('error')
    }
  }

  const filtered = posts.filter((post) => {
    const matchesFilter = activeFilter === 'All' || post.tags?.includes(activeFilter)
    const matchesSearch = search === '' ||
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const featured = filtered.find(p => p.featured) || filtered[0]
  const rest = filtered.filter(p => p.id !== featured?.id)

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>

      {/* HERO */}
      <div ref={heroRef} style={{ padding: '52px 0 40px', borderBottom: '0.5px solid var(--border)', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '32px', flexWrap: 'wrap' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
            <span style={{ width: '32px', height: '1px', background: 'var(--amber)', display: 'inline-block' }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--amber)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Blog</span>
          </div>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text-primary)', lineHeight: 1.0, marginBottom: '12px' }}>
            Thinking out{' '}
            <em style={{ fontStyle: 'italic', fontWeight: 300, color: 'var(--text-muted)' }}>loud.</em>
          </h1>
          <p style={{ fontSize: '14px', lineHeight: 1.75, color: 'var(--text-dim)', maxWidth: '480px' }}>
            Writing about things I actually built — the problems, the decisions, the lessons. No tutorials that already exist.
          </p>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontSize: '52px', fontWeight: 800, letterSpacing: '-0.04em', color: 'var(--text-primary)', lineHeight: 1 }}>
            {posts.length}<span style={{ fontSize: '28px', color: 'var(--amber)' }}>+</span>
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-ghost)', letterSpacing: '0.06em', textTransform: 'uppercase', marginTop: '4px' }}>
            Posts published
          </div>
        </div>
      </div>

      {/* TOOLBAR */}
      <div style={{ padding: '20px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap', borderBottom: '0.5px solid var(--border)' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {filters.map((filter) => (
            <button key={filter} onClick={() => setActiveFilter(filter)} style={{ padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 500, fontFamily: 'var(--font-sans)', border: activeFilter === filter ? 'none' : '0.5px solid var(--border)', background: activeFilter === filter ? 'var(--amber)' : 'var(--bg-surface)', color: activeFilter === filter ? 'var(--bg-base)' : 'var(--text-dim)', cursor: 'pointer' }}>
              {filter}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 14px', background: 'var(--bg-surface)', border: '0.5px solid var(--border)', borderRadius: '8px', minWidth: '220px' }}>
          <span style={{ color: 'var(--text-ghost)', fontSize: '14px' }}>⌕</span>
          <input type="text" placeholder="Search posts..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ background: 'none', border: 'none', outline: 'none', fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'var(--font-sans)', width: '100%' }} />
        </div>
      </div>

      {/* POSTS */}
      <div ref={postsRef} style={{ padding: '28px 0 48px' }}>
        {loading ? (
          <div style={{ padding: '48px', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-ghost)' }}>Loading posts...</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', border: '0.5px dashed var(--border)', borderRadius: '12px' }}>
            <p style={{ fontSize: '14px', color: 'var(--text-ghost)', marginBottom: '6px' }}>No posts found</p>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-whisper)' }}>Try a different filter or search term</p>
          </div>
        ) : (
          <>
            {/* FEATURED POST */}
            {featured && (
              <Link href={`/blog/${featured.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
                <div className="blog-page-card" style={{ display: 'grid', gridTemplateColumns: '280px 1fr', background: 'var(--bg-surface)', border: '0.5px solid var(--border)', borderRadius: '12px', overflow: 'hidden', marginBottom: '12px', cursor: 'pointer' }}>
                  {/* COVER */}
                  <div style={{ background: 'var(--bg-elevated)', borderRight: '0.5px solid var(--border)', overflow: 'hidden', aspectRatio: '1200/630' }}>
                    {featured.cover_image ? (
                      <img src={featured.cover_image} alt={featured.title} 
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover', 
                        objectPosition: 'center',
                        imageRendering: 'auto',
                        filter: 'contrast(1.02) saturate(1.05)',
                      }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-whisper)' }}>No cover</span>
                      </div>
                    )}
                  </div>

                  {/* CONTENT */}
                  <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                        <span style={{ padding: '3px 9px', borderRadius: '4px', fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.05em', textTransform: 'uppercase', background: 'rgba(245,158,11,0.1)', border: '0.5px solid rgba(245,158,11,0.25)', color: 'var(--amber)' }}>Featured</span>
                        {(() => { const { style, label } = getTagStyle(featured.tags); return (
                          <span style={{ padding: '3px 9px', borderRadius: '4px', fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.05em', textTransform: 'uppercase', background: style.bg, border: `0.5px solid ${style.border}`, color: style.color }}>{label}</span>
                        )})()}
                      </div>
                      <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: 1.25, marginBottom: '10px' }}>{featured.title}</h2>
                      <p style={{ fontSize: '13px', lineHeight: 1.75, color: 'var(--text-dim)', marginBottom: '16px' }}>{featured.excerpt}</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-whisper)' }}>{featured.read_time} min read</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--amber)' }}>Read post →</span>
                    </div>
                  </div>
                </div>
              </Link>
            )}

            {/* REST */}
            {rest.length > 0 && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '20px 0' }}>
                  <div style={{ flex: 1, height: '0.5px', background: 'var(--border)' }} />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-whisper)', letterSpacing: '0.07em', textTransform: 'uppercase' }}>All posts</span>
                  <div style={{ flex: 1, height: '0.5px', background: 'var(--border)' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }} className="blog-page-grid">
                  {rest.map((post) => {
                    const { style, label } = getTagStyle(post.tags)
                    return (
                      <Link key={post.id} href={`/blog/${post.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
                        <div className="blog-page-card" style={{ background: 'var(--bg-surface)', border: '0.5px solid var(--border)', borderRadius: '12px', overflow: 'hidden', display: 'flex', flexDirection: 'column', cursor: 'pointer', height: '100%' }}>
                          {post.cover_image ? (
                            <div style={{ width: '100%', aspectRatio: '1200/630', overflow: 'hidden', borderBottom: '0.5px solid var(--border)' }}>
                              <img src={post.cover_image} alt={post.title} 
                              style={{ 
                                width: '100%', 
                                height: '100%', 
                                objectFit: 'cover', 
                                objectPosition: 'center',
                                imageRendering: 'auto',
                                filter: 'contrast(1.02) saturate(1.05)',
                              }} />
                            </div>
                          ) : (
                            <div style={{ background: 'var(--bg-elevated)', aspectRatio: '1200/630', borderBottom: '0.5px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-whisper)' }}>No cover</span>
                            </div>
                          )}
                          <div style={{ padding: '14px 16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', gap: '6px', marginBottom: '8px', flexWrap: 'wrap' }}>
                              <span style={{ padding: '3px 9px', borderRadius: '4px', fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.05em', textTransform: 'uppercase', background: style.bg, border: `0.5px solid ${style.border}`, color: style.color }}>{label}</span>
                            </div>
                            <h3 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-secondary)', lineHeight: 1.4, letterSpacing: '-0.01em', marginBottom: '8px' }}>{post.title}</h3>
                            <p style={{ fontSize: '12px', lineHeight: 1.65, color: 'var(--text-dim)', flex: 1, marginBottom: '12px' }}>{post.excerpt}</p>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
                              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-whisper)' }}>{post.read_time} min read</span>
                              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-ghost)' }}>Read →</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                  <div style={{ border: '0.5px dashed var(--border)', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '200px', padding: '20px' }}>
                    <div style={{ fontSize: '24px', opacity: 0.2, marginBottom: '10px', color: 'var(--text-primary)' }}>+</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-whisper)', letterSpacing: '0.06em', textTransform: 'uppercase', textAlign: 'center' }}>More posts coming</div>
                  </div>
                </div>
              </>
            )}
          </>
        )}

        {/* NEWSLETTER */}
        <div style={{ marginTop: '32px', padding: '16px 20px', background: 'var(--bg-surface)', border: '0.5px solid var(--border)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', flexWrap: 'wrap' }}>
          <div>
            <p style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '2px' }}>Get notified when I publish</p>
            <p style={{ fontSize: '12px', color: 'var(--text-ghost)' }}>No spam. One email per post. Unsubscribe any time.</p>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
            {newsletterStatus === 'success' ? (
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#4ade80', padding: '9px 0' }}>✓ You&apos;re subscribed!</p>
            ) : (
              <>
                <input type="email" placeholder="your@email.com" value={newsletterEmail} onChange={(e) => setNewsletterEmail(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleNewsletter()} style={{ padding: '9px 14px', background: 'var(--bg-base)', border: '0.5px solid var(--border-hover)', borderRadius: '6px', fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'var(--font-sans)', width: '200px', outline: 'none' }} />
                <button onClick={handleNewsletter} disabled={newsletterStatus === 'sending'} className="btn-primary" style={{ fontSize: '12px', padding: '9px 18px' }}>
                  {newsletterStatus === 'sending' ? 'Subscribing...' : 'Notify me'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .blog-page-grid { grid-template-columns: 1fr !important; }
        }
        @media (min-width: 769px) and (max-width: 1024px) {
          .blog-page-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </div>
  )
}