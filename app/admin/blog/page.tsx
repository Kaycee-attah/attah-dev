'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { Toast, useToast, ConfirmModal } from '@/components/admin/Toast'

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false })

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  tags: string[]
  status: 'draft' | 'published'
  read_time: number
  featured: boolean
  cover_image: string
  created_at: string
  updated_at: string
}

const EMPTY_POST: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'> = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  tags: [],
  status: 'draft',
  read_time: 5,
  featured: false,
  cover_image: '',
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export default function AdminBlog() {
  const router = useRouter()
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Partial<BlogPost> | null>(null)
  const [saving, setSaving] = useState(false)
  const [statusFilter, setStatusFilter] = useState('all')
  const [deleting, setDeleting] = useState(false)
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; id: string | null; title: string }>({
    open: false,
    id: null,
    title: '',
  })
  const [preview, setPreview] = useState(false)
  const { toasts, removeToast, toast } = useToast()

  const fetchPosts = async () => {
    setLoading(true)
    const res = await fetch(`/api/admin/blog?status=${statusFilter}`)
    const data = await res.json()
    setPosts(data.posts || [])
    setLoading(false)
  }

  useEffect(() => { fetchPosts() }, [statusFilter])

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  const handleSave = async (publish = false) => {
    if (!editing) return
    setSaving(true)
    const t = toast.loading(publish ? 'Publishing post...' : 'Saving draft...')

    const payload = {
      ...editing,
      status: publish ? 'published' : (editing.status || 'draft'),
    }

    const method = editing.id ? 'PATCH' : 'POST'
    const res = await fetch('/api/admin/blog', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (res.ok) {
      t.success(publish ? 'Post published successfully' : 'Draft saved')
      await fetchPosts()
      setEditing(null)
      setPreview(false)
    } else {
      t.error('Failed to save post. Please try again.')
    }
    setSaving(false)
  }

  const handleDelete = async () => {
    if (!deleteModal.id) return
    setDeleting(true)
    const t = toast.loading('Deleting post...')
    const res = await fetch(`/api/admin/blog?id=${deleteModal.id}`, { method: 'DELETE' })
    if (res.ok) {
      t.success('Post deleted')
      setDeleteModal({ open: false, id: null, title: '' })
      await fetchPosts()
    } else {
      t.error('Failed to delete post.')
    }
    setDeleting(false)
  }

  const inputStyle = {
    width: '100%',
    padding: '9px 12px',
    background: 'var(--bg-elevated)',
    border: '0.5px solid var(--border)',
    borderRadius: '7px',
    fontSize: '13px',
    color: 'var(--text-primary)',
    fontFamily: 'var(--font-sans)',
    outline: 'none',
    boxSizing: 'border-box' as const,
  }

  const labelStyle = {
    display: 'block',
    fontFamily: 'var(--font-mono)',
    fontSize: '10px',
    color: 'var(--text-ghost)',
    letterSpacing: '0.06em',
    textTransform: 'uppercase' as const,
    marginBottom: '5px',
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100%' }}>

      {/* SIDEBAR */}
      <div style={{ width: '220px', background: 'var(--bg-surface)', borderRight: '0.5px solid var(--border)', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        <div style={{ padding: '16px 18px', borderBottom: '0.5px solid var(--border)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--amber)', display: 'inline-block' }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)' }}>attah.dev admin</span>
        </div>
        <div style={{ padding: '12px 8px', flex: 1 }}>
          {[
            { label: 'ProductIQ', href: '/admin/productiq', icon: '🧠' },
            { label: 'Projects', href: '/admin/projects', icon: '💼' },
            { label: 'Experience', href: '/admin/experience', icon: '📋' },
            { label: 'Blog', href: '/admin/blog', icon: '✍️', active: true },
            { label: 'Services', href: '/admin/services', icon: '🔧' },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '8px 10px', borderRadius: '7px',
                fontSize: '13px',
                color: (item as any).active ? 'var(--text-primary)' : 'var(--text-dim)',
                background: (item as any).active ? 'var(--bg-elevated)' : 'transparent',
                textDecoration: 'none',
                fontWeight: (item as any).active ? 500 : 400,
                marginBottom: '1px',
              }}
            >
              <span>{item.icon}</span>{item.label}
            </Link>
          ))}
          <div style={{ marginTop: '12px' }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px', borderRadius: '7px', fontSize: '13px', color: 'var(--text-dim)', textDecoration: 'none', marginBottom: '1px' }}>
              <span>🌐</span>View site
            </Link>
            <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px', borderRadius: '7px', fontSize: '13px', color: '#f87171', background: 'transparent', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left', fontFamily: 'var(--font-sans)' }}>
              <span>→</span>Sign out
            </button>
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '12px 24px', borderBottom: '0.5px solid var(--border)', background: 'var(--bg-surface)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>Blog posts</div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {['all', 'published', 'draft'].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                style={{
                  padding: '5px 10px', borderRadius: '20px', fontSize: '11px',
                  fontFamily: 'var(--font-sans)',
                  border: statusFilter === s ? 'none' : '0.5px solid var(--border)',
                  background: statusFilter === s ? 'var(--amber)' : 'transparent',
                  color: statusFilter === s ? 'var(--bg-base)' : 'var(--text-dim)',
                  cursor: 'pointer',
                  fontWeight: statusFilter === s ? 600 : 400,
                }}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
            <button
              onClick={() => { setEditing(EMPTY_POST); setPreview(false) }}
              style={{ padding: '7px 14px', background: 'var(--amber)', color: 'var(--bg-base)', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}
            >
              + New post
            </button>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '48px', fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-ghost)' }}>Loading...</div>
          ) : posts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-ghost)', marginBottom: '12px' }}>No posts yet</div>
              <button onClick={() => setEditing(EMPTY_POST)} style={{ padding: '9px 18px', background: 'var(--amber)', color: 'var(--bg-base)', border: 'none', borderRadius: '7px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
                Write your first post →
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {posts.map((post) => (
                <div
                  key={post.id}
                  style={{
                    background: 'var(--bg-surface)',
                    border: '0.5px solid var(--border)',
                    borderRadius: '10px',
                    padding: '14px 18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '16px',
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                      <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {post.title || 'Untitled'}
                      </span>
                      <span style={{
                        fontFamily: 'var(--font-mono)', fontSize: '9px', padding: '2px 7px', borderRadius: '3px', flexShrink: 0,
                        background: post.status === 'published' ? 'rgba(74,222,128,0.08)' : 'rgba(245,158,11,0.08)',
                        border: `0.5px solid ${post.status === 'published' ? 'rgba(74,222,128,0.2)' : 'rgba(245,158,11,0.2)'}`,
                        color: post.status === 'published' ? '#4ade80' : '#f59e0b',
                      }}>
                        {post.status}
                      </span>
                      {post.featured && (
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', padding: '2px 6px', background: 'rgba(245,158,11,0.1)', border: '0.5px solid rgba(245,158,11,0.2)', color: 'var(--amber)', borderRadius: '3px', flexShrink: 0 }}>
                          Featured
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-dim)', marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {post.excerpt || 'No excerpt'}
                    </div>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-ghost)' }}>
                        {new Date(post.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-ghost)' }}>
                        {post.read_time} min read
                      </span>
                      {post.tags.slice(0, 3).map((tag) => (
                        <span key={tag} style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', padding: '1px 6px', background: 'var(--bg-elevated)', border: '0.5px solid var(--border)', borderRadius: '3px', color: 'var(--text-ghost)' }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                    <button
                      onClick={() => { setEditing(post); setPreview(false) }}
                      style={{ padding: '5px 10px', background: 'var(--bg-elevated)', border: '0.5px solid var(--border)', borderRadius: '5px', fontSize: '11px', color: 'var(--text-secondary)', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteModal({ open: true, id: post.id, title: post.title || 'Untitled' })}
                      style={{ padding: '5px 10px', background: 'transparent', border: '0.5px solid rgba(239,68,68,0.2)', borderRadius: '5px', fontSize: '11px', color: '#f87171', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* EDITOR MODAL */}
      {editing && (
        <div style={{ position: 'fixed', inset: 0, background: 'var(--bg-base)', zIndex: 50, display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '12px 20px', borderBottom: '0.5px solid var(--border)', background: 'var(--bg-surface)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
            <button onClick={() => { setEditing(null); setPreview(false) }} style={{ background: 'none', border: 'none', color: 'var(--text-ghost)', cursor: 'pointer', fontSize: '13px', fontFamily: 'var(--font-sans)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              ← Back
            </button>
            <div style={{ flex: 1, maxWidth: '400px' }}>
              <input
                value={editing.title || ''}
                onChange={(e) => setEditing({
                  ...editing,
                  title: e.target.value,
                  slug: editing.id ? editing.slug : slugify(e.target.value),
                })}
                placeholder="Post title..."
                style={{ width: '100%', background: 'transparent', border: 'none', fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', outline: 'none' }}
              />
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button
                onClick={() => setPreview(!preview)}
                style={{ padding: '6px 12px', background: 'transparent', border: '0.5px solid var(--border)', borderRadius: '6px', fontSize: '12px', color: preview ? 'var(--amber)' : 'var(--text-dim)', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}
              >
                {preview ? 'Edit' : 'Preview'}
              </button>
              <button
                onClick={() => handleSave(false)}
                disabled={saving}
                style={{ padding: '6px 12px', background: 'transparent', border: '0.5px solid var(--border)', borderRadius: '6px', fontSize: '12px', color: 'var(--text-dim)', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}
              >
                {saving ? 'Saving...' : 'Save draft'}
              </button>
              <button
                onClick={() => handleSave(true)}
                disabled={saving}
                style={{ padding: '6px 14px', background: 'var(--amber)', color: 'var(--bg-base)', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}
              >
                {editing.status === 'published' ? 'Update' : 'Publish →'}
              </button>
            </div>
          </div>

          <div style={{ flex: 1, overflow: 'hidden', display: 'flex' }}>
            <div style={{ width: '260px', borderRight: '0.5px solid var(--border)', padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px', flexShrink: 0 }}>
              <div>
                <label style={labelStyle}>Slug</label>
                <input style={inputStyle} value={editing.slug || ''} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} placeholder="post-url-slug" />
              </div>
              <div>
                <label style={labelStyle}>Excerpt</label>
                <textarea rows={3} style={{ ...inputStyle, resize: 'none' }} value={editing.excerpt || ''} onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })} placeholder="Short description shown in listings..." />
              </div>
              <div>
                <label style={labelStyle}>Tags (comma separated)</label>
                <input style={inputStyle} value={(editing.tags || []).join(', ')} onChange={(e) => setEditing({ ...editing, tags: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} placeholder="React, TypeScript, Next.js" />
              </div>
              <div>
                <label style={labelStyle}>Read time (minutes)</label>
                <input type="number" style={inputStyle} value={editing.read_time || 5} onChange={(e) => setEditing({ ...editing, read_time: parseInt(e.target.value) })} />
              </div>
              <div>
                <label style={labelStyle}>Cover image URL</label>
                <input style={inputStyle} value={editing.cover_image || ''} onChange={(e) => setEditing({ ...editing, cover_image: e.target.value })} placeholder="https://..." />
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-dim)', cursor: 'pointer' }}>
                <input type="checkbox" checked={editing.featured || false} onChange={(e) => setEditing({ ...editing, featured: e.target.checked })} />
                Featured post
              </label>
              <div style={{ padding: '10px 12px', background: 'var(--bg-elevated)', border: '0.5px solid var(--border)', borderRadius: '7px' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-ghost)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: editing.status === 'published' ? '#4ade80' : '#f59e0b' }}>
                  {editing.status === 'published' ? '● Published' : '○ Draft'}
                </div>
              </div>
            </div>

            <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }} data-color-mode="dark">
              <MDEditor
                value={editing.content || ''}
                onChange={(val) => setEditing({ ...editing, content: val || '' })}
                preview={preview ? 'preview' : 'edit'}
                height="100%"
                style={{ flex: 1, borderRadius: 0, border: 'none' }}
              />
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={deleteModal.open}
        title="Delete post"
        message={`Are you sure you want to delete "${deleteModal.title}"? This cannot be undone.`}
        confirmLabel="Delete post"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteModal({ open: false, id: null, title: '' })}
      />
      <Toast toasts={toasts} removeToast={removeToast} />
    </div>
  )
}