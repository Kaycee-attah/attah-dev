import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email } = body

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required.' },
        { status: 400 }
      )
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address.' },
        { status: 400 }
      )
    }

    // ── NOTIFY ATTAH OF NEW SUBSCRIBER ──────────────────────
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: process.env.RESEND_TO_EMAIL!,
      subject: `[attah.dev] New newsletter subscriber — ${email}`,
      html: `
        <div style="font-family:monospace;max-width:560px;margin:0 auto;padding:32px;background:#0d0f14;color:#e5e7eb;border-radius:8px;">
          <h1 style="font-size:18px;font-weight:700;color:#f9fafb;margin:0 0 16px;">
            New subscriber
          </h1>
          <div style="background:#080a0e;border:1px solid #1f2230;border-radius:6px;padding:14px 16px;">
            <p style="font-size:13px;color:#f59e0b;margin:0;">${email}</p>
          </div>
          <p style="font-size:11px;color:#2d3148;margin:16px 0 0;">
            Via the blog newsletter strip on attah.dev
          </p>
        </div>
      `,
    })

    // ── SEND WELCOME EMAIL TO SUBSCRIBER ────────────────────
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: email,
      subject: "You're subscribed — Attah Kelechi's blog",
      html: `
        <div style="font-family:monospace;max-width:560px;margin:0 auto;padding:32px;background:#0d0f14;color:#e5e7eb;border-radius:8px;">
          <div style="margin-bottom:24px;">
            <h1 style="font-size:18px;font-weight:700;color:#f9fafb;margin:0 0 8px;">
              You're in.
            </h1>
            <p style="font-size:13px;color:#6b7280;line-height:1.7;margin:0;">
              Thanks for subscribing. I'll email you when I publish a new post — no spam, one email per post, unsubscribe any time.
            </p>
          </div>

          <div style="background:#080a0e;border:1px solid #1f2230;border-left:2px solid #f59e0b;border-radius:0 6px 6px 0;padding:14px 16px;margin-bottom:24px;">
            <p style="font-size:11px;color:#4b5280;text-transform:uppercase;letter-spacing:0.06em;margin:0 0 6px;">Coming soon</p>
            <p style="font-size:13px;color:#e5e7eb;font-weight:600;margin:0 0 4px;">How I built a custom NLP parser without any libraries</p>
            <p style="font-size:11px;color:#6b7280;margin:0;">Backend · ~8 min read</p>
          </div>

          <p style="font-size:12px;color:#6b7280;margin:0 0 16px;">
            While you wait, the free tools are live:
          </p>
          <a href="https://attah.dev/tools" style="font-size:11px;color:#f59e0b;text-decoration:none;">
            WCAG checker + NLP demo →
          </a>

          <div style="margin-top:32px;padding-top:16px;border-top:1px solid #1f2230;">
            <p style="font-size:11px;color:#2d3148;margin:0;">
              attah.dev · Osun, Nigeria · You subscribed at attah.dev/blog
            </p>
          </div>
        </div>
      `,
    })

    return NextResponse.json(
      { success: true, message: 'Subscribed successfully.' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Newsletter error:', error)
    return NextResponse.json(
      { error: 'Failed to subscribe. Please try again.' },
      { status: 500 }
    )
  }
}