'use client'

import { useEffect, useState } from 'react'

export default function StatsPage() {
  const [password, setPassword] = useState('')
  const [authed, setAuthed] = useState(false)
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/stats?password=${encodeURIComponent(password)}`)
      if (res.status === 401) {
        setError('Wrong password')
        setLoading(false)
        return
      }
      const data = await res.json()
      setStats(data)
      setAuthed(true)
    } catch {
      setError('Failed to load stats')
    }
    setLoading(false)
  }

  const card: React.CSSProperties = {
    background: 'var(--bg-surface)',
    border: '0.5px solid var(--border)',
    borderRadius: '10px',
    padding: '16px',
  }

  const labelStyle: React.CSSProperties = {
    fontFamily: 'var(--font-mono)',
    fontSize: '10px',
    color: 'var(--text-ghost)',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    marginBottom: '8px',
  }

  if (!authed) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ background: 'var(--bg-surface)', border: '0.5px solid var(--border)', borderRadius: '12px', padding: '32px', width: '100%', maxWidth: '320px' }}>
          <div style={{ fontSize: '24px', marginBottom: '12px', textAlign: 'center' }}>🔒</div>
          <h1 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px', textAlign: 'center' }}>
            Analytics
          </h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            placeholder="Password"
            style={{ width: '100%', padding: '9px 12px', background: 'var(--bg-elevated)', border: '0.5px solid var(--border)', borderRadius: '7px', fontSize: '13px', color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', outline: 'none', boxSizing: 'border-box', marginBottom: '10px' }}
          />
          {error && <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#f87171', marginBottom: '10px' }}>{error}</p>}
          <button
            onClick={handleLogin}
            disabled={loading}
            style={{ width: '100%', padding: '10px', background: 'var(--amber)', color: 'var(--bg-base)', border: 'none', borderRadius: '7px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}
          >
            {loading ? 'Loading...' : 'View stats →'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 24px 80px', minHeight: '100vh' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: '4px' }}>
          attah.dev — analytics
        </h1>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-ghost)' }}>
          Privacy-first · No cookies · Your data only
        </p>
      </div>

      {/* TOP METRICS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '20px' }}>
        {[
          { label: 'Today', value: stats.todayCount },
          { label: 'Last 7 days', value: stats.weekCount },
          { label: 'Last 30 days', value: stats.monthCount },
        ].map((m) => (
          <div key={m.label} style={card}>
            <div style={labelStyle}>{m.label}</div>
            <div style={{ fontSize: '36px', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>{m.value}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-ghost)', marginTop: '4px' }}>pageviews</div>
          </div>
        ))}
      </div>

      {/* TOP PAGES + RIGHT */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
        <div style={card}>
          <div style={labelStyle}>Top pages</div>
          {stats.topPages.length === 0 ? (
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-ghost)' }}>No data yet</div>
          ) : stats.topPages.map(([page, count]: [string, number]) => (
            <div key={page} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '0.5px solid var(--border)', fontSize: '12px' }}>
              <span style={{ color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px' }}>{page}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--amber)', flexShrink: 0, marginLeft: '8px' }}>{count}</span>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={card}>
            <div style={labelStyle}>Top referrers</div>
            {stats.topReferrers.length === 0 ? (
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-ghost)' }}>No referrers yet</div>
            ) : stats.topReferrers.map(([ref, count]: [string, number]) => (
              <div key={ref} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '0.5px solid var(--border)', fontSize: '12px' }}>
                <span style={{ color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '160px' }}>{ref}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--amber)', flexShrink: 0 }}>{count}</span>
              </div>
            ))}
          </div>

          <div style={card}>
            <div style={labelStyle}>Devices</div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {stats.devices.map(([device, count]: [string, number]) => (
                <div key={device} style={{ padding: '4px 10px', background: 'var(--bg-elevated)', border: '0.5px solid var(--border)', borderRadius: '6px', fontSize: '11px' }}>
                  <span style={{ color: 'var(--text-secondary)', textTransform: 'capitalize' }}>{device}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--amber)', marginLeft: '6px' }}>{count}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={card}>
            <div style={labelStyle}>Countries</div>
            {stats.countries.map(([country, count]: [string, number]) => (
              <div key={country} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '0.5px solid var(--border)', fontSize: '12px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>{country}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--amber)' }}>{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RECENT */}
      <div style={card}>
        <div style={labelStyle}>Recent pageviews</div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
            <thead>
              <tr>
                {['Page', 'Country', 'Device', 'Browser', 'Time'].map((h) => (
                  <th key={h} style={{ padding: '6px 10px', fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-ghost)', textAlign: 'left', borderBottom: '0.5px solid var(--border)', fontWeight: 400, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {stats.recent.map((row: any) => (
                <tr key={row.id} style={{ borderBottom: '0.5px solid var(--border)' }}>
                  <td style={{ padding: '8px 10px', color: 'var(--text-secondary)', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.pathname}</td>
                  <td style={{ padding: '8px 10px', color: 'var(--text-dim)' }}>{row.country || '—'}</td>
                  <td style={{ padding: '8px 10px', color: 'var(--text-dim)', textTransform: 'capitalize' }}>{row.device || '—'}</td>
                  <td style={{ padding: '8px 10px', color: 'var(--text-dim)' }}>{row.browser || '—'}</td>
                  <td style={{ padding: '8px 10px', fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-ghost)', whiteSpace: 'nowrap' }}>
                    {new Date(row.ts).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}