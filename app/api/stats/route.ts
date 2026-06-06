import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const password = searchParams.get('password')

  if (password !== process.env.STATS_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const now = new Date()
  const today = new Date(now)
  today.setHours(0, 0, 0, 0)
  const weekAgo = new Date(now)
  weekAgo.setDate(weekAgo.getDate() - 7)
  const monthAgo = new Date(now)
  monthAgo.setDate(monthAgo.getDate() - 30)

  const [
    { count: todayCount },
    { count: weekCount },
    { count: monthCount },
    { data: recent },
  ] = await Promise.all([
    supabaseAdmin.from('pageviews').select('*', { count: 'exact', head: true }).gte('ts', today.toISOString()),
    supabaseAdmin.from('pageviews').select('*', { count: 'exact', head: true }).gte('ts', weekAgo.toISOString()),
    supabaseAdmin.from('pageviews').select('*', { count: 'exact', head: true }).gte('ts', monthAgo.toISOString()),
    supabaseAdmin.from('pageviews').select('*').order('ts', { ascending: false }).limit(100),
  ])

  const pageCounts: Record<string, number> = {}
  const deviceCounts: Record<string, number> = {}
  const countryCounts: Record<string, number> = {}
  const referrerCounts: Record<string, number> = {}

  for (const row of recent || []) {
    pageCounts[row.pathname] = (pageCounts[row.pathname] || 0) + 1
    deviceCounts[row.device || 'unknown'] = (deviceCounts[row.device || 'unknown'] || 0) + 1
    countryCounts[row.country || 'Unknown'] = (countryCounts[row.country || 'Unknown'] || 0) + 1
    if (row.referrer) {
      try {
        const host = new URL(row.referrer).hostname
        referrerCounts[host] = (referrerCounts[host] || 0) + 1
      } catch {
        referrerCounts[row.referrer] = (referrerCounts[row.referrer] || 0) + 1
      }
    }
  }

  return NextResponse.json({
    todayCount: todayCount ?? 0,
    weekCount: weekCount ?? 0,
    monthCount: monthCount ?? 0,
    topPages: Object.entries(pageCounts).sort(([, a], [, b]) => b - a).slice(0, 10),
    topReferrers: Object.entries(referrerCounts).sort(([, a], [, b]) => b - a).slice(0, 8),
    devices: Object.entries(deviceCounts).sort(([, a], [, b]) => b - a),
    countries: Object.entries(countryCounts).sort(([, a], [, b]) => b - a).slice(0, 8),
    recent: (recent || []).slice(0, 30),
  })
}