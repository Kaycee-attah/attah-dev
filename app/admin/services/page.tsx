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
  price: string
  slots_total: number
  slots_remaining: number
  status: 'open' | 'closed' | 'waitlist'
  sort_order: number
}

export default function AdminServices() {
  const router = useRouter()
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Service | null>(null)
  const [saving, setSaving] = useState(false)
  const { toasts, removeToast, toast } = useToast()

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
    const t = toast.loading('Saving service...')

    const res = await fetch('/api/admin/services', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editing),
    })

    if (res.ok) {
        t.success('Service updated successfully')
        await fetchServices()
        setEditing(null)
    } else {
        t.error('Failed to save service.')
    }
    setSaving(false)
  }

  const inputStyle = { width: '100%', padding: '9px 12px', background: 'var(--bg-elevated)', border: '0.5px solid var(--border)', borderRadius: '7px', fontSize: '13px', color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', outline: 'none', boxSizing: 'border-box' as const }
  const labelStyle = { display: 'block', fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-ghost)', letterSpacing: '0.06em', textTransform: 'uppercase' as const, marginBottom: '5px' }

  const STATUS_COLORS = { open: '#4ade80', closed: '#f87171', waitlist: '#f59e0b' }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100%' }}>
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

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '12px 24px', borderBottom: '0.5px solid var(--border)', background: 'var(--bg-surface)' }}>
          <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>Services & Beta slots</div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '48px', fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-ghost)' }}>Loading...</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {services.map((service) => (
                <div key={service.id} style={{ background: 'var(--bg-surface)', border: '0.5px solid var(--border)', borderRadius: '10px', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                      <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>{service.name}</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', padding: '2px 7px', borderRadius: '3px', background: `${STATUS_COLORS[service.status]}18`, color: STATUS_COLORS[service.status], border: `0.5px solid ${STATUS_COLORS[service.status]}40` }}>{service.status}</span>
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-dim)', marginBottom: '6px' }}>{service.description}</div>
                    <div style={{ display: 'flex', gap: '16px' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--amber)' }}>{service.price}</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: service.slots_remaining === 0 ? '#f87171' : '#4ade80' }}>
                        {service.slots_remaining}/{service.slots_total} slots remaining
                      </span>
                    </div>
                  </div>
                  <button onClick={() => setEditing(service)} style={{ padding: '6px 12px', background: 'var(--bg-elevated)', border: '0.5px solid var(--border)', borderRadius: '6px', fontSize: '11px', color: 'var(--text-secondary)', cursor: 'pointer', fontFamily: 'var(--font-sans)', flexShrink: 0 }}>Edit</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {editing && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '24px' }}>
          <div style={{ background: 'var(--bg-surface)', border: '0.5px solid var(--border)', borderRadius: '12px', width: '100%', maxWidth: '480px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '16px 20px', borderBottom: '0.5px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>Edit — {editing.name}</div>
              <button onClick={() => setEditing(null)} style={{ background: 'none', border: 'none', color: 'var(--text-ghost)', cursor: 'pointer', fontSize: '18px' }}>×</button>
            </div>
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={labelStyle}>Name</label>
                <input style={inputStyle} value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
              </div>
              <div>
                <label style={labelStyle}>Description</label>
                <textarea rows={3} style={{ ...inputStyle, resize: 'vertical' }} value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
              </div>
              <div>
                <label style={labelStyle}>Price</label>
                <input style={inputStyle} value={editing.price} onChange={(e) => setEditing({ ...editing, price: e.target.value })} placeholder="₦25,000" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={labelStyle}>Total slots</label>
                  <input type="number" style={inputStyle} value={editing.slots_total} onChange={(e) => setEditing({ ...editing, slots_total: parseInt(e.target.value) })} />
                </div>
                <div>
                  <label style={labelStyle}>Remaining</label>
                  <input type="number" style={inputStyle} value={editing.slots_remaining} onChange={(e) => setEditing({ ...editing, slots_remaining: parseInt(e.target.value) })} />
                </div>
                <div>
                  <label style={labelStyle}>Status</label>
                  <select style={{ ...inputStyle }} value={editing.status} onChange={(e) => setEditing({ ...editing, status: e.target.value as any })}>
                    <option value="open">Open</option>
                    <option value="closed">Closed</option>
                    <option value="waitlist">Waitlist</option>
                  </select>
                </div>
              </div>
            </div>
            <div style={{ padding: '14px 20px', borderTop: '0.5px solid var(--border)', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button onClick={() => setEditing(null)} style={{ padding: '9px 18px', background: 'transparent', border: '0.5px solid var(--border)', borderRadius: '7px', fontSize: '13px', color: 'var(--text-dim)', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>Cancel</button>
              <button onClick={handleSave} disabled={saving} style={{ padding: '9px 18px', background: 'var(--amber)', color: 'var(--bg-base)', border: 'none', borderRadius: '7px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
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