'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Toast, useToast, ConfirmModal } from '@/components/admin/Toast'

interface Project {
  id: string
  title: string
  tagline: string
  description: string
  stack: string[]
  live_url: string
  github_url: string
  case_study_url: string | null
  status: 'active' | 'archived'
  featured: boolean
  sort_order: number
  category: string
  created_at: string
}

const EMPTY_PROJECT: Omit<Project, 'id' | 'created_at'> = {
  title: '',
  tagline: '',
  description: '',
  stack: [],
  live_url: '',
  github_url: '',
  case_study_url: '',
  status: 'active',
  featured: true,
  sort_order: 0,
  category: 'fullstack',
}

export default function AdminProjects() {
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Partial<Project> | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; id: string | null; title: string }>({
    open: false,
    id: null,
    title: '',
  })
  const { toasts, removeToast, toast } = useToast()

  const fetchProjects = async () => {
    setLoading(true)
    const res = await fetch('/api/admin/projects')
    const data = await res.json()
    setProjects(data.projects || [])
    setLoading(false)
  }

  useEffect(() => { fetchProjects() }, [])

  const handleSave = async () => {
    if (!editing) return
    setSaving(true)
    const t = toast.loading(editing.id ? 'Saving project...' : 'Adding project...')

    const method = editing.id ? 'PATCH' : 'POST'
    const body = editing.id ? editing : { ...EMPTY_PROJECT, ...editing }

    const res = await fetch('/api/admin/projects', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (res.ok) {
      t.success(editing.id ? 'Project updated successfully' : 'Project added successfully')
      await fetchProjects()
      setEditing(null)
    } else {
      t.error('Failed to save project. Please try again.')
    }
    setSaving(false)
  }

  const handleDelete = async () => {
    if (!deleteModal.id) return
    setDeleting(true)
    const t = toast.loading('Deleting project...')
    const res = await fetch(`/api/admin/projects?id=${deleteModal.id}`, { method: 'DELETE' })
    if (res.ok) {
      t.success('Project deleted')
      setDeleteModal({ open: false, id: null, title: '' })
      await fetchProjects()
    } else {
      t.error('Failed to delete project.')
    }
    setDeleting(false)
  }

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
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
            { label: 'Projects', href: '/admin/projects', icon: '💼', active: true },
            { label: 'Experience', href: '/admin/experience', icon: '📋' },
            { label: 'Blog', href: '/admin/blog', icon: '✍️' },
            { label: 'Services', href: '/admin/services', icon: '🔧' },
          ].map((item) => (
            <Link key={item.href} href={item.href} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px', borderRadius: '7px', fontSize: '13px', color: (item as any).active ? 'var(--text-primary)' : 'var(--text-dim)', background: (item as any).active ? 'var(--bg-elevated)' : 'transparent', textDecoration: 'none', fontWeight: (item as any).active ? 500 : 400, marginBottom: '1px' }}>
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
          <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>Projects</div>
          <button onClick={() => setEditing(EMPTY_PROJECT)} style={{ padding: '7px 14px', background: 'var(--amber)', color: 'var(--bg-base)', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
            + Add project
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '48px', fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-ghost)' }}>Loading...</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {projects.map((project) => (
                <div key={project.id} style={{ background: 'var(--bg-surface)', border: '0.5px solid var(--border)', borderRadius: '10px', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                      <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>{project.title}</span>
                      {project.featured && <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', padding: '2px 6px', background: 'rgba(245,158,11,0.1)', border: '0.5px solid rgba(245,158,11,0.2)', color: 'var(--amber)', borderRadius: '3px' }}>Featured</span>}
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', padding: '2px 6px', background: project.status === 'active' ? 'rgba(74,222,128,0.08)' : 'var(--bg-elevated)', border: `0.5px solid ${project.status === 'active' ? 'rgba(74,222,128,0.2)' : 'var(--border)'}`, color: project.status === 'active' ? '#4ade80' : 'var(--text-ghost)', borderRadius: '3px' }}>{project.status}</span>
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-dim)', marginBottom: '6px' }}>{project.tagline}</div>
                    <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                      {project.stack.slice(0, 4).map((tag) => (
                        <span key={tag} style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', padding: '2px 7px', background: 'var(--bg-elevated)', border: '0.5px solid var(--border)', borderRadius: '3px', color: 'var(--text-ghost)' }}>{tag}</span>
                      ))}
                      {project.stack.length > 4 && <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--text-whisper)' }}>+{project.stack.length - 4}</span>}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                    <button onClick={() => setEditing(project)} style={{ padding: '6px 12px', background: 'var(--bg-elevated)', border: '0.5px solid var(--border)', borderRadius: '6px', fontSize: '11px', color: 'var(--text-secondary)', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>Edit</button>
                    <button
                      onClick={() => setDeleteModal({ open: true, id: project.id, title: project.title })}
                      style={{ padding: '6px 12px', background: 'transparent', border: '0.5px solid rgba(239,68,68,0.2)', borderRadius: '6px', fontSize: '11px', color: '#f87171', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}
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

      {/* EDIT MODAL */}
      {editing && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '24px' }}>
          <div style={{ background: 'var(--bg-surface)', border: '0.5px solid var(--border)', borderRadius: '12px', width: '100%', maxWidth: '640px', maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '16px 20px', borderBottom: '0.5px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>{editing.id ? 'Edit project' : 'Add project'}</div>
              <button onClick={() => setEditing(null)} style={{ background: 'none', border: 'none', color: 'var(--text-ghost)', cursor: 'pointer', fontSize: '18px' }}>×</button>
            </div>
            <div style={{ padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={labelStyle}>Title *</label>
                <input style={inputStyle} value={editing.title || ''} onChange={(e) => setEditing({ ...editing, title: e.target.value })} placeholder="Project title" />
              </div>
              <div>
                <label style={labelStyle}>Tagline</label>
                <input style={inputStyle} value={editing.tagline || ''} onChange={(e) => setEditing({ ...editing, tagline: e.target.value })} placeholder="One line description" />
              </div>
              <div>
                <label style={labelStyle}>Description</label>
                <textarea rows={3} style={{ ...inputStyle, resize: 'vertical' }} value={editing.description || ''} onChange={(e) => setEditing({ ...editing, description: e.target.value })} placeholder="Full description" />
              </div>
              <div>
                <label style={labelStyle}>Stack (comma separated)</label>
                <input style={inputStyle} value={(editing.stack || []).join(', ')} onChange={(e) => setEditing({ ...editing, stack: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} placeholder="React, TypeScript, Tailwind CSS" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={labelStyle}>Live URL</label>
                  <input style={inputStyle} value={editing.live_url || ''} onChange={(e) => setEditing({ ...editing, live_url: e.target.value })} placeholder="https://..." />
                </div>
                <div>
                  <label style={labelStyle}>GitHub URL</label>
                  <input style={inputStyle} value={editing.github_url || ''} onChange={(e) => setEditing({ ...editing, github_url: e.target.value })} placeholder="https://github.com/..." />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Case study URL</label>
                <input style={inputStyle} value={editing.case_study_url || ''} onChange={(e) => setEditing({ ...editing, case_study_url: e.target.value })} placeholder="/projects/my-project" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={labelStyle}>Category</label>
                  <select style={{ ...inputStyle }} value={editing.category || 'fullstack'} onChange={(e) => setEditing({ ...editing, category: e.target.value })}>
                    <option value="fullstack">Fullstack</option>
                    <option value="frontend">Frontend</option>
                    <option value="backend">Backend</option>
                    <option value="mobile">Mobile</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Status</label>
                  <select style={{ ...inputStyle }} value={editing.status || 'active'} onChange={(e) => setEditing({ ...editing, status: e.target.value as 'active' | 'archived' })}>
                    <option value="active">Active</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Sort order</label>
                  <input type="number" style={inputStyle} value={editing.sort_order || 0} onChange={(e) => setEditing({ ...editing, sort_order: parseInt(e.target.value) })} />
                </div>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-dim)', cursor: 'pointer' }}>
                <input type="checkbox" checked={editing.featured || false} onChange={(e) => setEditing({ ...editing, featured: e.target.checked })} />
                Featured on homepage
              </label>
            </div>
            <div style={{ padding: '14px 20px', borderTop: '0.5px solid var(--border)', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button onClick={() => setEditing(null)} style={{ padding: '9px 18px', background: 'transparent', border: '0.5px solid var(--border)', borderRadius: '7px', fontSize: '13px', color: 'var(--text-dim)', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>Cancel</button>
              <button onClick={handleSave} disabled={saving} style={{ padding: '9px 18px', background: 'var(--amber)', color: 'var(--bg-base)', border: 'none', borderRadius: '7px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
                {saving ? 'Saving...' : 'Save project'}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={deleteModal.open}
        title="Delete project"
        message={`Are you sure you want to delete "${deleteModal.title}"? This cannot be undone.`}
        confirmLabel="Delete project"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteModal({ open: false, id: null, title: '' })}
      />
      <Toast toasts={toasts} removeToast={removeToast} />
    </div>
  )
}