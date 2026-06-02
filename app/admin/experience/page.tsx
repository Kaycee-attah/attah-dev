'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Toast, useToast } from '@/components/admin/Toast'

interface ExperienceEntry {
  id: string
  role: string
  company: string
  location: string
  period: string
  status: 'current' | 'completed' | 'hardware'
  status_label: string
  bullets: string[]
  stack: string[]
  stack_lit: boolean
  sort_order: number
}

interface EducationEntry {
  id: string
  degree: string
  school: string
  period: string
  status: string
  gpa: string
  gpa_max: string
  tags: string[]
}

export default function AdminExperience() {
  const router = useRouter()
  const [experiences, setExperiences] = useState<ExperienceEntry[]>([])
  const [education, setEducation] = useState<EducationEntry | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Partial<ExperienceEntry> | null>(null)
  const [editingEdu, setEditingEdu] = useState(false)
  const [eduForm, setEduForm] = useState<Partial<EducationEntry>>({})
  const [saving, setSaving] = useState(false)
  const { toasts, removeToast, toast } = useToast()

  const fetchData = async () => {
    setLoading(true)
    const res = await fetch('/api/admin/experience')
    const data = await res.json()
    setExperiences(data.experiences || [])
    setEducation(data.education || null)
    if (data.education) setEduForm(data.education)
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [])

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  const handleSaveExperience = async () => {
    if (!editing) return
    setSaving(true)
    const t = toast.loading(editing.id ? 'Saving role...' : 'Adding role...')

    const method = editing.id ? 'PATCH' : 'POST'
    const res = await fetch('/api/admin/experience', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...editing, type: 'experience' }),
    })

    if (res.ok) {
        t.success(editing.id ? 'Role updated successfully' : 'Role added successfully')
        await fetchData()
        setEditing(null)
    } else {
        t.error('Failed to save role. Please try again.')
    }
    setSaving(false)
  }

  const handleSaveEducation = async () => {
    setSaving(true)
    const t = toast.loading('Saving education...')

    const method = eduForm.id ? 'PATCH' : 'POST'
    const res = await fetch('/api/admin/experience', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...eduForm, type: 'education' }),
    })

    if (res.ok) {
        t.success('Education updated successfully')
        await fetchData()
        setEditingEdu(false)
    } else {
        t.error('Failed to save education.')
    }
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this entry?')) return
    const t = toast.loading('Deleting entry...')

    const res = await fetch(`/api/admin/experience?id=${id}&type=experience`, { method: 'DELETE' })

    if (res.ok) {
        t.success('Entry deleted')
        await fetchData()
    } else {
        t.error('Failed to delete entry.')
    }
  }

  const inputStyle = { width: '100%', padding: '9px 12px', background: 'var(--bg-elevated)', border: '0.5px solid var(--border)', borderRadius: '7px', fontSize: '13px', color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', outline: 'none', boxSizing: 'border-box' as const }
  const labelStyle = { display: 'block', fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-ghost)', letterSpacing: '0.06em', textTransform: 'uppercase' as const, marginBottom: '5px' }

  const STATUS_COLORS = {
    current: '#4ade80',
    completed: '#f59e0b',
    hardware: '#c084fc',
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
            { label: 'Experience', href: '/admin/experience', icon: '📋', active: true },
            { label: 'Blog', href: '/admin/blog', icon: '✍️' },
            { label: 'Services', href: '/admin/services', icon: '🔧' },
          ].map((item) => (
            <Link key={item.href} href={item.href} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px', borderRadius: '7px', fontSize: '13px', color: (item as any).active ? 'var(--text-primary)' : 'var(--text-dim)', background: (item as any).active ? 'var(--bg-elevated)' : 'transparent', textDecoration: 'none', fontWeight: (item as any).active ? 500 : 400, marginBottom: '1px' }}>
              <span>{item.icon}</span>{item.label}
            </Link>
          ))}
          <div style={{ marginTop: '12px' }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px', borderRadius: '7px', fontSize: '13px', color: 'var(--text-dim)', textDecoration: 'none', marginBottom: '1px' }}><span>🌐</span>View site</Link>
            <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px', borderRadius: '7px', fontSize: '13px', color: '#f87171', background: 'transparent', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left', fontFamily: 'var(--font-sans)' }}><span>→</span>Sign out</button>
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '12px 24px', borderBottom: '0.5px solid var(--border)', background: 'var(--bg-surface)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>Experience & Education</div>
          <button onClick={() => setEditing({ role: '', company: '', location: '', period: '', status: 'completed', status_label: 'Completed', bullets: [], stack: [], stack_lit: false, sort_order: 0 })} style={{ padding: '7px 14px', background: 'var(--amber)', color: 'var(--bg-base)', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
            + Add role
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '48px', fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-ghost)' }}>Loading...</div>
          ) : (
            <>
              {/* EXPERIENCE LIST */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-ghost)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '12px' }}>Work experience</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {experiences.map((exp) => (
                    <div key={exp.id} style={{ background: 'var(--bg-surface)', border: '0.5px solid var(--border)', borderRadius: '10px', padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                          <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>{exp.role}</span>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', padding: '2px 7px', borderRadius: '3px', background: `${STATUS_COLORS[exp.status]}18`, color: STATUS_COLORS[exp.status], border: `0.5px solid ${STATUS_COLORS[exp.status]}40` }}>{exp.status_label}</span>
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--amber)', marginBottom: '2px' }}>{exp.company}</div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-ghost)' }}>{exp.period} · {exp.location}</div>
                      </div>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button onClick={() => setEditing(exp)} style={{ padding: '5px 10px', background: 'var(--bg-elevated)', border: '0.5px solid var(--border)', borderRadius: '5px', fontSize: '11px', color: 'var(--text-secondary)', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>Edit</button>
                        <button onClick={() => handleDelete(exp.id)} style={{ padding: '5px 10px', background: 'transparent', border: '0.5px solid rgba(239,68,68,0.2)', borderRadius: '5px', fontSize: '11px', color: '#f87171', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* EDUCATION */}
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-ghost)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '12px' }}>Education</div>
                {education && (
                  <div style={{ background: 'var(--bg-surface)', border: '0.5px solid var(--border)', borderRadius: '10px', padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '2px' }}>{education.degree}</div>
                      <div style={{ fontSize: '12px', color: 'var(--amber)', marginBottom: '2px' }}>{education.school}</div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-ghost)' }}>{education.period} · GPA {education.gpa}/{education.gpa_max} · {education.status}</div>
                    </div>
                    <button onClick={() => setEditingEdu(true)} style={{ padding: '5px 10px', background: 'var(--bg-elevated)', border: '0.5px solid var(--border)', borderRadius: '5px', fontSize: '11px', color: 'var(--text-secondary)', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>Edit</button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* EXPERIENCE EDIT MODAL */}
      {editing && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '24px' }}>
          <div style={{ background: 'var(--bg-surface)', border: '0.5px solid var(--border)', borderRadius: '12px', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '16px 20px', borderBottom: '0.5px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>{editing.id ? 'Edit role' : 'Add role'}</div>
              <button onClick={() => setEditing(null)} style={{ background: 'none', border: 'none', color: 'var(--text-ghost)', cursor: 'pointer', fontSize: '18px' }}>×</button>
            </div>
            <div style={{ padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={labelStyle}>Role *</label>
                  <input style={inputStyle} value={editing.role || ''} onChange={(e) => setEditing({ ...editing, role: e.target.value })} placeholder="Frontend Engineer" />
                </div>
                <div>
                  <label style={labelStyle}>Company *</label>
                  <input style={inputStyle} value={editing.company || ''} onChange={(e) => setEditing({ ...editing, company: e.target.value })} placeholder="Company name" />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={labelStyle}>Location</label>
                  <input style={inputStyle} value={editing.location || ''} onChange={(e) => setEditing({ ...editing, location: e.target.value })} placeholder="Remote · Nigeria" />
                </div>
                <div>
                  <label style={labelStyle}>Period</label>
                  <input style={inputStyle} value={editing.period || ''} onChange={(e) => setEditing({ ...editing, period: e.target.value })} placeholder="Mar 2026 — Present" />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={labelStyle}>Status</label>
                  <select style={{ ...inputStyle }} value={editing.status || 'completed'} onChange={(e) => setEditing({ ...editing, status: e.target.value as any })}>
                    <option value="current">Current</option>
                    <option value="completed">Completed</option>
                    <option value="hardware">Hardware</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Status label</label>
                  <input style={inputStyle} value={editing.status_label || ''} onChange={(e) => setEditing({ ...editing, status_label: e.target.value })} placeholder="Current" />
                </div>
                <div>
                  <label style={labelStyle}>Sort order</label>
                  <input type="number" style={inputStyle} value={editing.sort_order || 0} onChange={(e) => setEditing({ ...editing, sort_order: parseInt(e.target.value) })} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Bullets (one per line)</label>
                <textarea rows={5} style={{ ...inputStyle, resize: 'vertical', fontFamily: 'var(--font-sans)' }}
                  value={(editing.bullets || []).join('\n')}
                  onChange={(e) => setEditing({ ...editing, bullets: e.target.value.split('\n').filter(Boolean) })}
                  placeholder="Built 11 live report pages&#10;Authored 30+ TanStack Query hooks"
                />
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-whisper)', marginTop: '4px' }}>You can use {'<strong>'} tags for bold text</p>
              </div>
              <div>
                <label style={labelStyle}>Stack (comma separated)</label>
                <input style={inputStyle} value={(editing.stack || []).join(', ')} onChange={(e) => setEditing({ ...editing, stack: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} placeholder="Next.js, TypeScript, TanStack Query" />
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-dim)', cursor: 'pointer' }}>
                <input type="checkbox" checked={editing.stack_lit || false} onChange={(e) => setEditing({ ...editing, stack_lit: e.target.checked })} />
                Highlight stack tags in amber (current roles)
              </label>
            </div>
            <div style={{ padding: '14px 20px', borderTop: '0.5px solid var(--border)', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button onClick={() => setEditing(null)} style={{ padding: '9px 18px', background: 'transparent', border: '0.5px solid var(--border)', borderRadius: '7px', fontSize: '13px', color: 'var(--text-dim)', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>Cancel</button>
              <button onClick={handleSaveExperience} disabled={saving} style={{ padding: '9px 18px', background: 'var(--amber)', color: 'var(--bg-base)', border: 'none', borderRadius: '7px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDUCATION EDIT MODAL */}
      {editingEdu && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '24px' }}>
          <div style={{ background: 'var(--bg-surface)', border: '0.5px solid var(--border)', borderRadius: '12px', width: '100%', maxWidth: '500px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '16px 20px', borderBottom: '0.5px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>Edit education</div>
              <button onClick={() => setEditingEdu(false)} style={{ background: 'none', border: 'none', color: 'var(--text-ghost)', cursor: 'pointer', fontSize: '18px' }}>×</button>
            </div>
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={labelStyle}>Degree</label>
                <input style={inputStyle} value={eduForm.degree || ''} onChange={(e) => setEduForm({ ...eduForm, degree: e.target.value })} />
              </div>
              <div>
                <label style={labelStyle}>School</label>
                <input style={inputStyle} value={eduForm.school || ''} onChange={(e) => setEduForm({ ...eduForm, school: e.target.value })} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={labelStyle}>Period</label>
                  <input style={inputStyle} value={eduForm.period || ''} onChange={(e) => setEduForm({ ...eduForm, period: e.target.value })} />
                </div>
                <div>
                  <label style={labelStyle}>GPA</label>
                  <input style={inputStyle} value={eduForm.gpa || ''} onChange={(e) => setEduForm({ ...eduForm, gpa: e.target.value })} />
                </div>
                <div>
                  <label style={labelStyle}>Max GPA</label>
                  <input style={inputStyle} value={eduForm.gpa_max || ''} onChange={(e) => setEduForm({ ...eduForm, gpa_max: e.target.value })} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Status label</label>
                <input style={inputStyle} value={eduForm.status || ''} onChange={(e) => setEduForm({ ...eduForm, status: e.target.value })} placeholder="First Class Honours" />
              </div>
              <div>
                <label style={labelStyle}>Tags (comma separated)</label>
                <input style={inputStyle} value={(eduForm.tags || []).join(', ')} onChange={(e) => setEduForm({ ...eduForm, tags: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} />
              </div>
            </div>
            <div style={{ padding: '14px 20px', borderTop: '0.5px solid var(--border)', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button onClick={() => setEditingEdu(false)} style={{ padding: '9px 18px', background: 'transparent', border: '0.5px solid var(--border)', borderRadius: '7px', fontSize: '13px', color: 'var(--text-dim)', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>Cancel</button>
              <button onClick={handleSaveEducation} disabled={saving} style={{ padding: '9px 18px', background: 'var(--amber)', color: 'var(--bg-base)', border: 'none', borderRadius: '7px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      <Toast toasts={toasts} removeToast={removeToast} />
    </div>
  )
}