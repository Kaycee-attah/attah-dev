import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function getStats() {
  const now = new Date()
  const today = new Date(now)
  today.setHours(0, 0, 0, 0)
  const weekAgo = new Date(now)
  weekAgo.setDate(weekAgo.getDate() - 7)
  const monthAgo = new Date(now)
  monthAgo.setDate(monthAgo.getDate() - 30)

  const [
    { data: todayViews },
    { data: weekViews },
    { data: monthViews },
    { data: topPages },
    { data: topReferrers },
    { data: devices },
    { data: countries },
    { data: recent },
  ] = await Promise.all([
    supabaseAdmin
      .from('pageviews')
      .select('id', { count: 'exact' })
      .gte('ts', today.toISOString()),
    supabaseAdmin
      .from('pageviews')
      .select('id', { count: 'exact' })
      .gte('ts', weekAgo.toISOString()),
    supabaseAdmin
      .from('pageviews')
      .select('id', { count: 'exact' })
      .gte('ts', monthAgo.toISOString()),
    supabaseAdmin.rpc('top_pages', { limit_n: 10 }),
    supabaseAdmin.rpc('top_referrers', { limit_n: 10 }),
    supabaseAdmin.rpc('device_breakdown', {}),
    supabaseAdmin.rpc('top_countries', { limit_n: 10 }),
    supabaseAdmin
      .from('pageviews')
      .select('*')
      .order('ts', { ascending: false })
      .limit(20),
  ])

  return {
    todayCount: todayViews?.length ?? 0,
    weekCount: weekViews?.length ?? 0,
    monthCount: monthViews?.length ?? 0,
    topPages: topPages ?? [],
    topReferrers: topReferrers ?? [],
    devices: devices ?? [],
    countries: countries ?? [],
    recent: recent ?? [],
  }
}

export default async function StatsPage() {
  // Basic auth check
  const headersList = await headers()
  const auth = headersList.get('authorization')
  const expected = `Basic ${Buffer.from(
    `${process.env.STATS_USER}:${process.env.STATS_PASSWORD}`
  ).toString('base64')}`

  if (auth !== expected) {
    return new Response('Unauthorized', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="Stats"' },
    }) as any
  }

  const stats = await getStats()

  const statCardStyle = {
    background: 'var(--bg-surface)',
    border: '0.5px solid var(--border)',
    borderRadius: '10px',
    padding: '16px',
  }

  const labelStyle = {
    fontFamily: 'var(--font-mono)',
    fontSize: '10px',
    color: 'var(--text-ghost)',
    letterSpacing: '0.06em',
    textTransform: 'uppercase' as const,
    marginBottom: '6px',
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 24px 80px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: '4px' }}>
          attah.dev — analytics
        </h1>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-ghost)' }}>
          Privacy-first · No cookies · Your data
        </p>
      </div>

      {/* METRICS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '24px' }}>
        {[
          { label: 'Today', value: stats.todayCount },
          { label: 'Last 7 days', value: stats.weekCount },
          { label: 'Last 30 days', value: stats.monthCount },
        ].map((m) => (
          <div key={m.label} style={statCardStyle}>
            <div style={labelStyle}>{m.label}</div>
            <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>
              {m.value}
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-ghost)', marginTop: '4px' }}>
              pageviews
            </div>
          </div>
        ))}
      </div>

      {/* TOP PAGES + REFERRERS */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
        <div style={statCardStyle}>
          <div style={labelStyle}>Top pages</div>
          {stats.recent
            .reduce((acc: Array<{pathname: string, count: number}>, row: any) => {
              const existing = acc.find(r => r.pathname === row.pathname)
              if (existing) existing.count++
              else acc.push({ pathname: row.pathname, count: 1 })
              return acc
            }, [])
            .sort((a, b) => b.count - a.count)
            .slice(0, 8)
            .map((page) => (
              <div key={page.pathname} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '0.5px solid var(--border)', fontSize: '12px' }}>
                <span style={{ color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px' }}>
                  {page.pathname}
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--amber)', flexShrink: 0 }}>
                  {page.count}
                </span>
              </div>
            ))}
        </div>

        <div style={statCardStyle}>
          <div style={labelStyle}>Devices</div>
          {stats.recent
            .reduce((acc: Array<{device: string, count: number}>, row: any) => {
              const existing = acc.find(r => r.device === row.device)
              if (existing) existing.count++
              else acc.push({ device: row.device || 'unknown', count: 1 })
              return acc
            }, [])
            .sort((a, b) => b.count - a.count)
            .map((d) => (
              <div key={d.device} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '0.5px solid var(--border)', fontSize: '12px' }}>
                <span style={{ color: 'var(--text-secondary)', textTransform: 'capitalize' }}>{d.device}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--amber)' }}>{d.count}</span>
              </div>
            ))}

          <div style={{ ...labelStyle, marginTop: '20px' }}>Countries</div>
          {stats.recent
            .reduce((acc: Array<{country: string, count: number}>, row: any) => {
              const c = row.country || 'Unknown'
              const existing = acc.find(r => r.country === c)
              if (existing) existing.count++
              else acc.push({ country: c, count: 1 })
              return acc
            }, [])
            .sort((a, b) => b.count - a.count)
            .slice(0, 5)
            .map((c) => (
              <div key={c.country} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '0.5px solid var(--border)', fontSize: '12px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>{c.country}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--amber)' }}>{c.count}</span>
              </div>
            ))}
        </div>
      </div>

      {/* RECENT PAGEVIEWS */}
      <div style={statCardStyle}>
        <div style={labelStyle}>Recent pageviews</div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
            <thead>
              <tr>
                {['Page', 'Country', 'Device', 'Browser', 'Time'].map(h => (
                  <th key={h} style={{ padding: '6px 10px', fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-ghost)', textAlign: 'left', borderBottom: '0.5px solid var(--border)', fontWeight: 400, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {h}
                  </th>
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