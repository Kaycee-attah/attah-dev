import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'

interface Props {
  params: Promise<{ slug: string }>
}

async function getPost(slug: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://attah-dev.vercel.app'
    const res = await fetch(`${baseUrl}/api/blog/${slug}`, {
      cache: 'no-store',
    })
    if (!res.ok) return null
    const data = await res.json()
    return data.post || null
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) return { title: 'Post not found' }
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.cover_image ? [{ url: post.cover_image }] : [],
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) notFound()

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: '0 24px 80px' }}>

      {/* BACK */}
      <div style={{ padding: '24px 0', borderBottom: '0.5px solid var(--border)', marginBottom: '40px' }}>
        <Link href="/blog" style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-ghost)', textDecoration: 'none' }}>
          ← All posts
        </Link>
      </div>

      {/* COVER */}
      {post.cover_image && (
        <div style={{ width: '100%', aspectRatio: '1200/630', overflow: 'hidden', borderRadius: '10px', marginBottom: '32px', border: '0.5px solid var(--border)' }}>
          <img src={post.cover_image} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
        </div>
      )}

      {/* HEADER */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
          {post.tags?.map((tag: string) => (
            <span key={tag} style={{ padding: '3px 10px', borderRadius: '4px', fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.05em', textTransform: 'uppercase', background: 'rgba(245,158,11,0.08)', border: '0.5px solid rgba(245,158,11,0.2)', color: 'var(--amber)' }}>
              {tag}
            </span>
          ))}
          <span style={{ padding: '3px 10px', border: '0.5px solid var(--border)', borderRadius: '4px', fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-ghost)' }}>
            {post.read_time} min read
          </span>
        </div>

        <h1 style={{ fontSize: 'clamp(28px, 5vw, 40px)', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text-primary)', lineHeight: 1.15, marginBottom: '16px' }}>
          {post.title}
        </h1>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', paddingBottom: '24px', borderBottom: '0.5px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--amber)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, color: 'var(--bg-base)' }}>A</div>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>Attah Kelechi</span>
          </div>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-ghost)' }}>
            {new Date(post.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
          </span>
        </div>
      </div>

      {/* CONTENT */}
      <div
        style={{ fontSize: '15px', lineHeight: 1.85, color: 'var(--text-dim)' }}
        className="blog-content"
        dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }}
      />

      {/* FOOTER */}
      <div style={{ marginTop: '48px', paddingTop: '32px', borderTop: '0.5px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <p style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '2px' }}>Attah Kelechi</p>
          <p style={{ fontSize: '12px', color: 'var(--text-ghost)' }}>Frontend Engineer · attah-dev.vercel.app</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Link href="/contact" style={{ padding: '9px 18px', background: 'var(--amber)', color: 'var(--bg-base)', borderRadius: '7px', fontSize: '13px', fontWeight: 700, textDecoration: 'none' }}>
            Work with me →
          </Link>
          <Link href="/blog" style={{ padding: '9px 18px', background: 'transparent', border: '0.5px solid var(--border)', color: 'var(--text-dim)', borderRadius: '7px', fontSize: '13px', textDecoration: 'none' }}>
            More posts
          </Link>
        </div>
      </div>

      <style>{`
        .blog-content h2 { font-size: 22px; font-weight: 800; color: var(--text-primary); letter-spacing: -0.02em; margin: 36px 0 14px; line-height: 1.2; }
        .blog-content h3 { font-size: 17px; font-weight: 700; color: var(--text-secondary); margin: 28px 0 10px; }
        .blog-content p { margin-bottom: 20px; }
        .blog-content strong { color: var(--text-secondary); font-weight: 600; }
        .blog-content a { color: var(--amber); text-decoration: underline; text-underline-offset: 3px; }
        .blog-content code { font-family: var(--font-mono); font-size: 13px; background: var(--bg-elevated); border: 0.5px solid var(--border); padding: 2px 6px; border-radius: 4px; color: var(--amber); }
        .blog-content pre { background: var(--bg-elevated); border: 0.5px solid var(--border); border-radius: 8px; padding: 16px 20px; overflow-x: auto; margin: 20px 0; font-family: var(--font-mono); font-size: 13px; line-height: 1.7; color: var(--text-secondary); }
        .blog-content pre code { background: none; border: none; padding: 0; color: inherit; }
        .blog-content ul, .blog-content ol { padding-left: 24px; margin-bottom: 20px; }
        .blog-content li { margin-bottom: 8px; }
        .blog-content blockquote { border-left: 3px solid var(--amber); padding-left: 16px; margin: 24px 0; color: var(--text-ghost); font-style: italic; }
        .blog-content hr { border: none; border-top: 0.5px solid var(--border); margin: 32px 0; }
        .blog-content img { width: 100%; border-radius: 8px; border: 0.5px solid var(--border); margin: 20px 0; }
      `}</style>
    </div>
  )
}

function renderMarkdown(content: string): string {
  if (!content) return ''
  return content
    .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    .replace(/^---$/gm, '<hr/>')
    .replace(/^\- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>')
    .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
    .replace(/^(?!<[a-z]).+$/gm, (line) => line.trim() ? `<p>${line}</p>` : '')
    .replace(/\n{3,}/g, '\n\n')
}