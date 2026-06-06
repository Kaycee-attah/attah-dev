import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createHash } from 'crypto'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

function getDevice(ua: string): string {
  if (/mobile|android|iphone|ipod/i.test(ua)) return 'mobile'
  if (/tablet|ipad/i.test(ua)) return 'tablet'
  return 'desktop'
}

function getBrowser(ua: string): string {
  if (/edg\//i.test(ua)) return 'Edge'
  if (/chrome/i.test(ua)) return 'Chrome'
  if (/firefox/i.test(ua)) return 'Firefox'
  if (/safari/i.test(ua)) return 'Safari'
  if (/opera|opr/i.test(ua)) return 'Opera'
  return 'Other'
}

export async function POST(req: NextRequest) {
  try {
    const { pathname, referrer } = await req.json()

    if (!pathname) {
      return NextResponse.json({ error: 'pathname required' }, { status: 400 })
    }

    // Get headers
    const ua = req.headers.get('user-agent') || ''
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      req.headers.get('x-real-ip') ||
      'unknown'
    const country = req.headers.get('x-vercel-ip-country') || null
    const city = req.headers.get('x-vercel-ip-city') || null

    // Privacy-first visitor ID — daily rotating hash, no stored IP
    const salt = process.env.ANALYTICS_SALT || 'default-salt'
    const today = new Date().toISOString().slice(0, 10)
    const visitorId = createHash('sha256')
      .update(`${ip}${ua}${salt}${today}`)
      .digest('hex')
      .slice(0, 16)

    // Session ID — hourly rotating
    const hour = new Date().toISOString().slice(0, 13)
    const sessionId = createHash('sha256')
      .update(`${ip}${ua}${salt}${hour}`)
      .digest('hex')
      .slice(0, 16)

    // Filter bots
    if (/bot|crawler|spider|scraper|lighthouse|headless/i.test(ua)) {
      return NextResponse.json({ ok: true })
    }

    const device = getDevice(ua)
    const browser = getBrowser(ua)

    const { error } = await supabase.from('pageviews').insert({
      pathname,
      referrer: referrer || null,
      country,
      city,
      device,
      browser,
      visitor_id: visitorId,
      session_id: sessionId,
    })

    if (error) {
      console.error('Analytics insert error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Analytics route error:', err)
    return NextResponse.json({ error: 'Failed to track' }, { status: 500 })
  }
}