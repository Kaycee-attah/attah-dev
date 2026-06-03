'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Toast, useToast } from '@/components/admin/Toast'

interface Service {
  id: string
  service_id: string
  name: string
  description: string
  icon: string
  icon_bg: string
  sub: string
  price: string
  price_unit: string | null
  slots_total: number
  slots_remaining: number
  status: 'open' | 'closed' | 'waitlist'
  features: string[]
  cta: string
  cta_style: string
  featured: boolean
  visible: boolean
  sort_order: number
}

const EMPTY_SERVICE: Omit<Service, 'id'> = {
  service_id: '',
  name: '',
  description: '',
  icon: '🔧',
  icon_bg: 'rgba(245,158,11,0.1)',
  sub: '',
  price: '',
  price_unit: null,
  slots_total: 3,
  slots_remaining: 3,
  status: 'open',
  features: [],
  cta: 'Get in touch',
  cta_style: 'secondary',
  featured: false,
  visible: true,
  sort_order: 0,
}

export default function AdminServices() {
  const router = useRouter()
  const { toasts, removeToast, toast } = useToast()
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Partial<Service> | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)

  const fetchServices = async () => {
    setLoading(true)
    const res = await fetch('/api/admin/services')
    const data = await res.json()
    setServices(data.services || [])
    setLoading(false)
  }

  useEffect(() => { fetchServices() }, [])

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  const handleSave = async () => {
    if (!editing) return
    setSaving(true)
    const method = editing.id ? 'PATCH' : 'POST'
    const t = toast.loading(editing.id ? 'Saving service...' : 'Adding service...')

    const payload = {
      ...editing,
      features: typeof editing.features === 'string'
        ? (editing.features as string).split('\n').filter(Boolean)
        : editing.features || [],
    }

    const res = await fetch('/api/admin/services', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (res.ok) {
      t.success(editing.id ? 'Service updated' : 'Service added')
      await fetchServices()
      setEditing(null)
    } else {
      t.error('Failed to save service.')
    }
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this service? This cannot be undone.')) return
    setDeleting(id)
    const t = toast.loading('Deleting service...')
    const res = await fetch(`/api/admin/services?id=${id}`, { method: 'DELETE' })
    if (res.ok) {
      t.success('Service deleted')
      await fetchServices()
    } else {
      t.error('Failed to delete service.')
    }
    setDeleting(null)
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

  const STATUS_COLORS = {
    open: '#4ade80',
    closed: '#f87171',
    waitlist: '#f59e0b',
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
            { label: 'Blog', href: '/admin/blog', icon: '✍️' },
            { label: 'Services', href: '/admin/services', icon: '🔧', active: true },
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
          <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>Services</div>
          <button onClick={() => setEditing(EMPTY_SERVICE)} style={{ padding: '7px 14px', background: 'var(--amber)', color: 'var(--bg-base)', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
            + Add service
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '48px', fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-ghost)' }}>Loading...</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {services.map((service) => (
                <div key={service.id} style={{ background: 'var(--bg-surface)', border: '0.5px solid var(--border)', borderRadius: '10px', padding: '16px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', flex: 1 }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: service.icon_bg || 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>
                        {service.icon}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>{service.name}</span>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', padding: '2px 7px', borderRadius: '3px', background: `${STATUS_COLORS[service.status]}18`, color: STATUS_COLORS[service.status], border: `0.5px solid ${STATUS_COLORS[service.status]}40` }}>{service.status}</span>
                          {service.featured && <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', padding: '2px 7px', borderRadius: '3px', background: 'rgba(245,158,11,0.1)', border: '0.5px solid rgba(245,158,11,0.2)', color: 'var(--amber)' }}>Featured</span>}
                          {!service.visible && <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', padding: '2px 7px', borderRadius: '3px', background: 'var(--bg-elevated)', border: '0.5px solid var(--border)', color: 'var(--text-whisper)' }}>Hidden</span>}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--text-dim)', marginBottom: '4px' }}>{service.description}</div>
                        <div style={{ display: 'flex', gap: '16px' }}>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--amber)', fontWeight: 700 }}>{service.price}{service.price_unit ? ` ${service.price_unit}` : ''}</span>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: service.slots_remaining === 0 ? '#f87171' : '#4ade80' }}>
                            {service.slots_remaining}/{service.slots_total} slots
                          </span>
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                      <button onClick={() => setEditing({ ...service, features: service.features || [] })} style={{ padding: '6px 12px', background: 'var(--bg-elevated)', border: '0.5px solid var(--border)', borderRadius: '6px', fontSize: '11px', color: 'var(--text-secondary)', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>Edit</button>
                      <button onClick={() => handleDelete(service.id)} disabled={deleting === service.id} style={{ padding: '6px 12px', background: 'transparent', border: '0.5px solid rgba(239,68,68,0.2)', borderRadius: '6px', fontSize: '11px', color: '#f87171', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
                        {deleting === service.id ? '...' : 'Delete'}
                      </button>
                    </div>
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
          <div style={{ background: 'var(--bg-surface)', border: '0.5px solid var(--border)', borderRadius: '12px', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '16px 20px', borderBottom: '0.5px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>{editing.id ? 'Edit service' : 'Add service'}</div>
              <button onClick={() => setEditing(null)} style={{ background: 'none', border: 'none', color: 'var(--text-ghost)', cursor: 'pointer', fontSize: '18px' }}>×</button>
            </div>

            <div style={{ padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={labelStyle}>Service ID (slug)</label>
                  <input style={inputStyle} value={editing.service_id || ''} onChange={(e) => setEditing({ ...editing, service_id: e.target.value })} placeholder="code-review" />
                </div>
                <div>
                  <label style={labelStyle}>Name</label>
                  <input style={inputStyle} value={editing.name || ''} onChange={(e) => setEditing({ ...editing, name: e.target.value })} placeholder="Code Review" />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Description</label>
                <textarea rows={2} style={{ ...inputStyle, resize: 'none' }} value={editing.description || ''} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={labelStyle}>Icon (emoji)</label>
                  <input style={inputStyle} value={editing.icon || ''} onChange={(e) => setEditing({ ...editing, icon: e.target.value })} placeholder="🔍" />
                </div>
                <div>
                  <label style={labelStyle}>Price</label>
                  <input style={inputStyle} value={editing.price || ''} onChange={(e) => setEditing({ ...editing, price: e.target.value })} placeholder="₦25,000" />
                </div>
                <div>
                  <label style={labelStyle}>Price unit</label>
                  <input style={inputStyle} value={editing.price_unit || ''} onChange={(e) => setEditing({ ...editing, price_unit: e.target.value })} placeholder="/ project" />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Subtitle</label>
                <input style={inputStyle} value={editing.sub || ''} onChange={(e) => setEditing({ ...editing, sub: e.target.value })} placeholder="Code · Architecture · Performance" />
              </div>

              <div>
                <label style={labelStyle}>Features (one per line)</label>
                <textarea
                  rows={5}
                  style={{ ...inputStyle, resize: 'vertical' }}
                  value={Array.isArray(editing.features) ? editing.features.join('\n') : (editing.features || '')}
                  onChange={(e) => setEditing({ ...editing, features: e.target.value.split('\n').filter(Boolean) })}
                  placeholder={'Full codebase walkthrough\nArchitecture & performance audit\nAccessibility & security check'}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={labelStyle}>Total slots</label>
                  <input type="number" style={inputStyle} value={editing.slots_total || 3} onChange={(e) => setEditing({ ...editing, slots_total: parseInt(e.target.value) })} />
                </div>
                <div>
                  <label style={labelStyle}>Remaining slots</label>
                  <input type="number" style={inputStyle} value={editing.slots_remaining ?? 3} onChange={(e) => setEditing({ ...editing, slots_remaining: parseInt(e.target.value) })} />
                </div>
                <div>
                  <label style={labelStyle}>Sort order</label>
                  <input type="number" style={inputStyle} value={editing.sort_order || 0} onChange={(e) => setEditing({ ...editing, sort_order: parseInt(e.target.value) })} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={labelStyle}>Status</label>
                  <select style={{ ...inputStyle }} value={editing.status || 'open'} onChange={(e) => setEditing({ ...editing, status: e.target.value as any })}>
                    <option value="open">Open</option>
                    <option value="closed">Closed</option>
                    <option value="waitlist">Waitlist</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>CTA text</label>
                  <input style={inputStyle} value={editing.cta || ''} onChange={(e) => setEditing({ ...editing, cta: e.target.value })} placeholder="Book a review" />
                </div>
                <div>
                  <label style={labelStyle}>CTA style</label>
                  <select style={{ ...inputStyle }} value={editing.cta_style || 'secondary'} onChange={(e) => setEditing({ ...editing, cta_style: e.target.value })}>
                    <option value="primary">Primary (amber)</option>
                    <option value="secondary">Secondary (outline)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-dim)', cursor: 'pointer' }}>
                  <input type="checkbox" checked={editing.featured || false} onChange={(e) => setEditing({ ...editing, featured: e.target.checked })} />
                  Featured (amber border)
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-dim)', cursor: 'pointer' }}>
                  <input type="checkbox" checked={editing.visible !== false} onChange={(e) => setEditing({ ...editing, visible: e.target.checked })} />
                  Visible on portfolio
                </label>
              </div>
            </div>

            <div style={{ padding: '14px 20px', borderTop: '0.5px solid var(--border)', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button onClick={() => setEditing(null)} style={{ padding: '9px 18px', background: 'transparent', border: '0.5px solid var(--border)', borderRadius: '7px', fontSize: '13px', color: 'var(--text-dim)', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>Cancel</button>
              <button onClick={handleSave} disabled={saving} style={{ padding: '9px 18px', background: 'var(--amber)', color: 'var(--bg-base)', border: 'none', borderRadius: '7px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
                {saving ? 'Saving...' : 'Save service'}
              </button>
            </div>
          </div>
        </div>
      )}

      <Toast toasts={toasts} removeToast={removeToast} />
    </div>
  )
}