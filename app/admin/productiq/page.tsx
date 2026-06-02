'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { phase1Questions } from '@/lib/data/business-builder'

interface Lead {
  id: string
  created_at: string
  name: string
  email: string
  phone: string | null
  phase1_answers: Record<string, string>
  phase2_answers: Record<string, string>
  results: {
    businessName?: { recommended?: string }
    platform?: { recommendation?: string }
  }
  status: 'new' | 'contacted' | 'in_progress' | 'closed'
  notes: string | null
}

interface Analytics {
  events: Record<string, number>
  totalLeads: number
  thisWeek: number
  today: number
  byStatus: Record<string, number>
  deviceCounts: Record<string, number>
  budgetDist: Record<string, number>
  timelineDist: Record<string, number>
  businessTypes: Record<string, number>
  phoneProvidedRate: number
  calendlyClickRate: number
  clientConversionRate: number
  totalRevenue: number
  avgCompletionTime: number
  questionAnswerCounts: Record<string, number>
  topAnswers: Record<string, Array<{ answer: string; count: number }>>
}

const STATUS_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  new: { bg: 'rgba(96,165,250,0.1)', color: '#60a5fa', label: 'New' },
  contacted: { bg: 'rgba(245,158,11,0.1)', color: '#f59e0b', label: 'Contacted' },
  in_progress: { bg: 'rgba(74,222,128,0.1)', color: '#4ade80', label: 'In progress' },
  closed: { bg: 'var(--bg-elevated)', color: 'var(--text-ghost)', label: 'Closed' },
}

export default function ProductIQAdmin() {
  const router = useRouter()
  const [leads, setLeads] = useState<Lead[]>([])
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [statusFilter, setStatusFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [leadsRes, analyticsRes] = await Promise.all([
        fetch(`/api/admin/leads?status=${statusFilter}`),
        fetch('/api/admin/analytics'),
      ])
      const leadsData = await leadsRes.json()
      const analyticsData = await analyticsRes.json()
      setLeads(leadsData.leads || [])
      setTotal(leadsData.total || 0)
      setAnalytics(analyticsData)
    } catch (err) {
      console.error('Failed to fetch admin data:', err)
    } finally {
      setLoading(false)
    }
  }, [statusFilter])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Auto-refresh every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchData()
    }, 60000)
    return () => clearInterval(interval)
  }, [fetchData])

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  const updateStatus = async (id: string, status: string) => {
    await fetch('/api/admin/leads', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    })
    fetchData()
  }

  const funnelSteps = analytics ? [
    { label: 'Page views', count: analytics.events.page_view, color: '#60a5fa' },
    { label: 'Started Phase 1', count: analytics.events.phase1_start, color: '#60a5fa' },
    { label: 'Completed Phase 1', count: analytics.events.phase1_complete, color: '#4ade80' },
    { label: 'Completed Phase 2', count: analytics.events.phase2_complete, color: '#4ade80' },
    { label: 'Reached gate', count: analytics.events.gate_reached, color: '#f59e0b' },
    { label: 'Submitted details', count: analytics.events.gate_submitted, color: '#f59e0b' },
  ] : []

  const maxCount = Math.max(...funnelSteps.map(s => s.count), 1)

  const sidebarItems = [
    { label: 'ProductIQ', href: '/admin/productiq', icon: '🧠', active: true, badge: analytics?.byStatus.new },
    { label: 'Projects', href: '#', icon: '💼', active: false },
    { label: 'Experience', href: '#', icon: '📋', active: false },
    { label: 'Blog', href: '#', icon: '✍️', active: false },
    { label: 'Services', href: '#', icon: '🔧', active: false },
  ]

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100%' }}>

      {/* ── SIDEBAR ─────────────────────────────────────────── */}
      <div
        style={{
          width: '220px',
          background: 'var(--bg-surface)',
          borderRight: '0.5px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
        }}
      >
        {/* LOGO */}
        <div
          style={{
            padding: '16px 18px',
            borderBottom: '0.5px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: 'var(--amber)',
              display: 'inline-block',
            }}
          />
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '13px',
              fontWeight: 500,
              color: 'var(--text-primary)',
            }}
          >
            attah.dev admin
          </span>
        </div>

        {/* NAV */}
        <div style={{ padding: '12px 8px', flex: 1 }}>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '9px',
              color: 'var(--text-whisper)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              padding: '6px 10px',
              marginBottom: '2px',
            }}
          >
            Tools
          </div>
          {sidebarItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 10px',
                borderRadius: '7px',
                fontSize: '13px',
                color: item.active ? 'var(--text-primary)' : 'var(--text-dim)',
                background: item.active ? 'var(--bg-elevated)' : 'transparent',
                textDecoration: 'none',
                fontWeight: item.active ? 500 : 400,
                marginBottom: '1px',
              }}
            >
              <span style={{ fontSize: '14px' }}>{item.icon}</span>
              {item.label}
              {item.badge && item.badge > 0 ? (
                <span
                  style={{
                    marginLeft: 'auto',
                    fontSize: '10px',
                    padding: '1px 6px',
                    borderRadius: '10px',
                    background: 'rgba(239,68,68,0.1)',
                    color: '#f87171',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  {item.badge}
                </span>
              ) : null}
            </Link>
          ))}

          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '9px',
              color: 'var(--text-whisper)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              padding: '6px 10px',
              marginBottom: '2px',
              marginTop: '12px',
            }}
          >
            Account
          </div>
          <Link
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 10px',
              borderRadius: '7px',
              fontSize: '13px',
              color: 'var(--text-dim)',
              textDecoration: 'none',
              marginBottom: '1px',
            }}
          >
            <span style={{ fontSize: '14px' }}>🌐</span>
            View site
          </Link>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 10px',
              borderRadius: '7px',
              fontSize: '13px',
              color: '#f87171',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              width: '100%',
              textAlign: 'left',
              fontFamily: 'var(--font-sans)',
            }}
          >
            <span style={{ fontSize: '14px' }}>→</span>
            Sign out
          </button>
        </div>
      </div>

      {/* ── MAIN ─────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* TOPBAR */}
        <div
          style={{
            padding: '12px 24px',
            borderBottom: '0.5px solid var(--border)',
            background: 'var(--bg-surface)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div
            style={{
              fontSize: '15px',
              fontWeight: 600,
              color: 'var(--text-primary)',
            }}
          >
            ProductIQ — leads & analytics
          </div>
          <button
            onClick={fetchData}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              background: 'transparent',
              border: '0.5px solid var(--border)',
              borderRadius: '6px',
              fontSize: '12px',
              color: 'var(--text-ghost)',
              cursor: 'pointer',
              fontFamily: 'var(--font-sans)',
            }}
          >
            ↺ Refresh
          </button>
        </div>

        {/* CONTENT */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>

          {/* METRICS */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: '10px',
              marginBottom: '20px',
            }}
          >
            {[
              {
                label: 'Page views',
                value: analytics?.events.page_view ?? '—',
                sub: 'Total visits',
                subColor: 'var(--text-ghost)',
              },
              {
                label: 'Started Phase 1',
                value: analytics?.events.phase1_start ?? '—',
                sub: analytics
                  ? `${Math.round((analytics.events.phase1_start / Math.max(analytics.events.page_view, 1)) * 100)}% of visitors`
                  : '—',
                subColor: 'var(--text-ghost)',
              },
              {
                label: 'Reached gate',
                value: analytics?.events.gate_reached ?? '—',
                sub: analytics
                  ? `${Math.round((analytics.events.gate_reached / Math.max(analytics.events.phase1_start, 1)) * 100)}% of starters`
                  : '—',
                subColor: '#f59e0b',
              },
              {
                label: 'Leads captured',
                value: analytics?.totalLeads ?? '—',
                sub: analytics
                  ? `${Math.round((analytics.events.gate_submitted / Math.max(analytics.events.gate_reached, 1)) * 100)}% gate conversion`
                  : '—',
                subColor: '#4ade80',
              },
              {
                label: "Today's leads",
                value: analytics?.today ?? '—',
                sub: analytics?.today === 1 ? '1 new today' : `${analytics?.today || 0} new today`,
                subColor: (analytics?.today || 0) > 0 ? '#4ade80' : 'var(--text-ghost)',
              },
              {
                label: 'Total revenue',
                value: analytics?.totalRevenue
                  ? `₦${analytics.totalRevenue.toLocaleString()}`
                  : '₦0',
                sub: `${analytics?.clientConversionRate || 0}% lead→client`,
                subColor: '#c084fc',
              },
            ].map((m) => (
              <div
                key={m.label}
                style={{
                  background: 'var(--bg-surface)',
                  border: '0.5px solid var(--border)',
                  borderRadius: '10px',
                  padding: '14px',
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    color: 'var(--text-ghost)',
                    letterSpacing: '0.05em',
                    marginBottom: '6px',
                  }}
                >
                  {m.label}
                </div>
                <div
                  style={{
                    fontSize: '26px',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    lineHeight: 1,
                    marginBottom: '4px',
                  }}
                >
                  {m.value}
                </div>
                <div
                  style={{
                    fontSize: '11px',
                    color: m.subColor,
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  {m.sub}
                </div>
              </div>
            ))}
          </div>

          {/* FUNNEL */}
          {funnelSteps.length > 0 && (
            <div
              style={{
                background: 'var(--bg-surface)',
                border: '0.5px solid var(--border)',
                borderRadius: '10px',
                padding: '16px',
                marginBottom: '20px',
              }}
            >
              <div
                style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  marginBottom: '4px',
                }}
              >
                Conversion funnel
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  color: 'var(--text-ghost)',
                  marginBottom: '14px',
                }}
              >
                Where people drop off — gate conversion rate:{' '}
                <span style={{ color: analytics && analytics.events.gate_submitted / Math.max(analytics.events.gate_reached, 1) > 0.4 ? '#4ade80' : '#f59e0b' }}>
                  {analytics
                    ? `${Math.round((analytics.events.gate_submitted / Math.max(analytics.events.gate_reached, 1)) * 100)}%`
                    : '—'}
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                {funnelSteps.map((step) => (
                  <div key={step.label} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '11px',
                        color: 'var(--text-secondary)',
                        width: '160px',
                        flexShrink: 0,
                      }}
                    >
                      {step.label}
                    </div>
                    <div
                      style={{
                        flex: 1,
                        height: '18px',
                        background: 'var(--bg-elevated)',
                        borderRadius: '4px',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          height: '100%',
                          width: `${(step.count / maxCount) * 100}%`,
                          background: step.color,
                          opacity: 0.7,
                          borderRadius: '4px',
                          transition: 'width 0.4s ease',
                        }}
                      />
                    </div>
                    <div
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '11px',
                        color: 'var(--text-secondary)',
                        width: '32px',
                        textAlign: 'right',
                        flexShrink: 0,
                      }}
                    >
                      {step.count}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── AUDIENCE INSIGHTS ──────────────────────────────── */}
          {analytics && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '10px',
                marginBottom: '20px',
              }}
            >
              {/* DEVICE BREAKDOWN */}
              <div
                style={{
                  background: 'var(--bg-surface)',
                  border: '0.5px solid var(--border)',
                  borderRadius: '10px',
                  padding: '14px',
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    color: 'var(--text-ghost)',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    marginBottom: '10px',
                  }}
                >
                  Device breakdown
                </div>
                {Object.entries(analytics.deviceCounts || {})
                  .filter(([, v]) => v > 0)
                  .sort(([, a], [, b]) => (b as number) - (a as number))
                  .map(([device, count]) => (
                    <div
                      key={device}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '6px',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '12px',
                          color: 'var(--text-secondary)',
                          textTransform: 'capitalize',
                        }}
                      >
                        {device}
                      </span>
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '11px',
                          color: 'var(--text-primary)',
                          fontWeight: 600,
                        }}
                      >
                        {count as number}
                      </span>
                    </div>
                  ))}
              </div>

              {/* BUDGET DISTRIBUTION */}
              <div
                style={{
                  background: 'var(--bg-surface)',
                  border: '0.5px solid var(--border)',
                  borderRadius: '10px',
                  padding: '14px',
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    color: 'var(--text-ghost)',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    marginBottom: '10px',
                  }}
                >
                  Budget distribution
                </div>
                {Object.entries(analytics.budgetDist || {})
                  .sort(([, a], [, b]) => (b as number) - (a as number))
                  .slice(0, 5)
                  .map(([budget, count]) => (
                    <div
                      key={budget}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '6px',
                        gap: '8px',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '11px',
                          color: 'var(--text-secondary)',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {budget}
                      </span>
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '11px',
                          color: 'var(--amber)',
                          fontWeight: 600,
                          flexShrink: 0,
                        }}
                      >
                        {count as number}
                      </span>
                    </div>
                  ))}
              </div>

              {/* LEAD QUALITY */}
              <div
                style={{
                  background: 'var(--bg-surface)',
                  border: '0.5px solid var(--border)',
                  borderRadius: '10px',
                  padding: '14px',
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    color: 'var(--text-ghost)',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    marginBottom: '10px',
                  }}
                >
                  Lead quality
                </div>
                {[
                  {
                    label: 'Gave WhatsApp',
                    value: `${analytics.phoneProvidedRate}%`,
                    color: '#4ade80',
                  },
                  {
                    label: 'Clicked Calendly',
                    value: `${analytics.calendlyClickRate}%`,
                    color: 'var(--amber)',
                  },
                  {
                    label: 'Became client',
                    value: `${analytics.clientConversionRate}%`,
                    color: '#c084fc',
                  },
                  {
                    label: 'Total revenue',
                    value: analytics.totalRevenue > 0
                      ? `₦${analytics.totalRevenue.toLocaleString()}`
                      : '—',
                    color: '#4ade80',
                  },
                  {
                    label: 'Avg completion',
                    value: analytics.avgCompletionTime > 0
                      ? `${Math.round(analytics.avgCompletionTime / 60)}m`
                      : '—',
                    color: 'var(--text-secondary)',
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '6px',
                    }}
                  >
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                      {item.label}
                    </span>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '11px',
                        color: item.color,
                        fontWeight: 600,
                      }}
                    >
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── QUESTION DROP-OFF ────────────────────────────── */}
          {analytics && (
            <div
              style={{
                background: 'var(--bg-surface)',
                border: '0.5px solid var(--border)',
                borderRadius: '10px',
                padding: '16px',
                marginBottom: '20px',
              }}
            >
              <div
                style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  marginBottom: '4px',
                }}
              >
                Question drop-off
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  color: 'var(--text-ghost)',
                  marginBottom: '14px',
                }}
              >
                How many people answered each question — shows where you lose them
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {phase1Questions.map((q, i) => {
                  const count = analytics.questionAnswerCounts?.[`q${i + 1}`] || 0
                  const maxQ = analytics.questionAnswerCounts?.q1 || 1
                  return (
                    <div
                      key={q.id}
                      style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
                    >
                      <div
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '10px',
                          color: 'var(--text-ghost)',
                          width: '20px',
                          flexShrink: 0,
                        }}
                      >
                        Q{i + 1}
                      </div>
                      <div
                        style={{
                          fontSize: '11px',
                          color: 'var(--text-secondary)',
                          width: '200px',
                          flexShrink: 0,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {q.question}
                      </div>
                      <div
                        style={{
                          flex: 1,
                          height: '16px',
                          background: 'var(--bg-elevated)',
                          borderRadius: '4px',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            height: '100%',
                            width: `${(count / maxQ) * 100}%`,
                            background: '#60a5fa',
                            opacity: 0.7,
                            borderRadius: '4px',
                          }}
                        />
                      </div>
                      <div
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '11px',
                          color: 'var(--text-secondary)',
                          width: '28px',
                          textAlign: 'right',
                          flexShrink: 0,
                        }}
                      >
                        {count}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* LEADS TABLE */}
          <div
            style={{
              background: 'var(--bg-surface)',
              border: '0.5px solid var(--border)',
              borderRadius: '10px',
              overflow: 'hidden',
            }}
          >
            {/* TABLE HEADER */}
            <div
              style={{
                padding: '12px 16px',
                borderBottom: '0.5px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '10px',
              }}
            >
              <div
                style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                }}
              >
                All leads
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    color: 'var(--text-ghost)',
                    fontWeight: 400,
                    marginLeft: '8px',
                  }}
                >
                  {total} total
                </span>
              </div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {['all', 'new', 'contacted', 'in_progress', 'closed'].map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '20px',
                      fontSize: '11px',
                      fontFamily: 'var(--font-sans)',
                      border: statusFilter === s ? 'none' : '0.5px solid var(--border)',
                      background: statusFilter === s ? 'var(--amber)' : 'transparent',
                      color: statusFilter === s ? 'var(--bg-base)' : 'var(--text-dim)',
                      cursor: 'pointer',
                      fontWeight: statusFilter === s ? 600 : 400,
                    }}
                  >
                    {s === 'in_progress' ? 'In progress' : s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* TABLE */}
            {loading ? (
              <div
                style={{
                  padding: '48px',
                  textAlign: 'center',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                  color: 'var(--text-ghost)',
                }}
              >
                Loading...
              </div>
            ) : leads.length === 0 ? (
              <div
                style={{
                  padding: '48px',
                  textAlign: 'center',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                  color: 'var(--text-ghost)',
                }}
              >
                No leads yet
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      {['Name', 'Email', 'Business', 'Recommended name', 'Date', 'Status', 'Actions'].map((h) => (
                        <th
                          key={h}
                          style={{
                            padding: '8px 14px',
                            fontFamily: 'var(--font-mono)',
                            fontSize: '10px',
                            color: 'var(--text-ghost)',
                            textAlign: 'left',
                            borderBottom: '0.5px solid var(--border)',
                            fontWeight: 400,
                            letterSpacing: '0.04em',
                            textTransform: 'uppercase',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map((lead) => {
                      const statusStyle = STATUS_STYLES[lead.status] || STATUS_STYLES.new
                      return (
                        <tr
                          key={lead.id}
                          style={{ borderBottom: '0.5px solid var(--border)' }}
                        >
                          <td
                            style={{
                              padding: '10px 14px',
                              fontSize: '13px',
                              fontWeight: 600,
                              color: 'var(--text-primary)',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {lead.name}
                          </td>
                          <td
                            style={{
                              padding: '10px 14px',
                              fontSize: '12px',
                              color: 'var(--amber)',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            <a
                              href={`mailto:${lead.email}`}
                              style={{ color: 'inherit', textDecoration: 'none' }}
                            >
                              {lead.email}
                            </a>
                          </td>
                          <td
                            style={{
                              padding: '10px 14px',
                              fontSize: '12px',
                              color: 'var(--text-dim)',
                              maxWidth: '160px',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {lead.phase1_answers?.business || '—'}
                          </td>
                          <td
                            style={{
                              padding: '10px 14px',
                              fontSize: '12px',
                              color: 'var(--text-secondary)',
                              fontWeight: 500,
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {lead.results?.businessName?.recommended || '—'}
                          </td>
                          <td
                            style={{
                              padding: '10px 14px',
                              fontFamily: 'var(--font-mono)',
                              fontSize: '11px',
                              color: 'var(--text-ghost)',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {new Date(lead.created_at).toLocaleDateString('en-GB', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </td>
                          <td style={{ padding: '10px 14px' }}>
                            <select
                              value={lead.status}
                              onChange={(e) => updateStatus(lead.id, e.target.value)}
                              style={{
                                padding: '3px 8px',
                                borderRadius: '10px',
                                fontSize: '11px',
                                background: statusStyle.bg,
                                color: statusStyle.color,
                                border: 'none',
                                cursor: 'pointer',
                                fontFamily: 'var(--font-sans)',
                                outline: 'none',
                              }}
                            >
                              <option value="new">New</option>
                              <option value="contacted">Contacted</option>
                              <option value="in_progress">In progress</option>
                              <option value="closed">Closed</option>
                            </select>
                          </td>
                          <td style={{ padding: '10px 14px' }}>
                            <Link
                              href={`/admin/productiq/${lead.id}`}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                padding: '5px 10px',
                                background: 'var(--bg-elevated)',
                                border: '0.5px solid var(--border)',
                                borderRadius: '6px',
                                fontSize: '11px',
                                color: 'var(--text-secondary)',
                                textDecoration: 'none',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              View full strategy →
                            </Link>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}