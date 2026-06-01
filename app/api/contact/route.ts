import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, company, subject, message } = body

    // ── VALIDATION ──────────────────────────────────────────
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email and message are required.' },
        { status: 400 }
      )
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address.' },
        { status: 400 }
      )
    }

    // ── SEND TO ATTAH ────────────────────────────────────────
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: process.env.RESEND_TO_EMAIL!,
      replyTo: email,
      subject: `[attah.dev] ${subject || 'New message'} — from ${name}`,
      html: `
        <div style="font-family:monospace;max-width:560px;margin:0 auto;padding:32px;background:#0d0f14;color:#e5e7eb;border-radius:8px;">
          <div style="margin-bottom:24px;padding-bottom:16px;border-bottom:1px solid #1f2230;">
            <h1 style="font-size:18px;font-weight:700;color:#f9fafb;margin:0 0 4px;">
              New message from attah.dev
            </h1>
            <p style="font-size:12px;color:#4b5280;margin:0;">
              Via the contact form
            </p>
          </div>

          <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
            <tr>
              <td style="padding:8px 0;font-size:11px;color:#4b5280;width:100px;text-transform:uppercase;letter-spacing:0.06em;">From</td>
              <td style="padding:8px 0;font-size:13px;color:#f9fafb;">${name}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;font-size:11px;color:#4b5280;width:100px;text-transform:uppercase;letter-spacing:0.06em;">Email</td>
              <td style="padding:8px 0;font-size:13px;color:#f59e0b;">${email}</td>
            </tr>
            ${company ? `
            <tr>
              <td style="padding:8px 0;font-size:11px;color:#4b5280;width:100px;text-transform:uppercase;letter-spacing:0.06em;">Company</td>
              <td style="padding:8px 0;font-size:13px;color:#f9fafb;">${company}</td>
            </tr>` : ''}
            <tr>
              <td style="padding:8px 0;font-size:11px;color:#4b5280;width:100px;text-transform:uppercase;letter-spacing:0.06em;">Subject</td>
              <td style="padding:8px 0;font-size:13px;color:#f9fafb;">${subject || '—'}</td>
            </tr>
          </table>

          <div style="background:#080a0e;border:1px solid #1f2230;border-radius:6px;padding:16px;margin-bottom:24px;">
            <p style="font-size:11px;color:#4b5280;text-transform:uppercase;letter-spacing:0.06em;margin:0 0 8px;">Message</p>
            <p style="font-size:13px;color:#e5e7eb;line-height:1.75;margin:0;white-space:pre-wrap;">${message}</p>
          </div>

          <p style="font-size:11px;color:#2d3148;margin:0;">
            Reply directly to this email to respond to ${name}.
          </p>
        </div>
      `,
    })

    // ── SEND CONFIRMATION TO SENDER ──────────────────────────
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: email,
      subject: `Got your message, ${name.split(' ')[0]} — Attah Kelechi`,
      html: `
        <div style="font-family:monospace;max-width:560px;margin:0 auto;padding:32px;background:#0d0f14;color:#e5e7eb;border-radius:8px;">
          <div style="margin-bottom:24px;">
            <h1 style="font-size:18px;font-weight:700;color:#f9fafb;margin:0 0 8px;">
              Got your message.
            </h1>
            <p style="font-size:13px;color:#6b7280;line-height:1.7;margin:0;">
              Hey ${name.split(' ')[0]}, thanks for reaching out. I've received your message and will get back to you within 24 hours.
            </p>
          </div>

          <div style="background:#080a0e;border:1px solid #1f2230;border-left:2px solid #f59e0b;border-radius:0 6px 6px 0;padding:14px 16px;margin-bottom:24px;">
            <p style="font-size:11px;color:#4b5280;text-transform:uppercase;letter-spacing:0.06em;margin:0 0 6px;">Your message</p>
            <p style="font-size:12px;color:#9ca3af;line-height:1.65;margin:0;white-space:pre-wrap;">${message.slice(0, 200)}${message.length > 200 ? '...' : ''}</p>
          </div>

          <p style="font-size:12px;color:#6b7280;line-height:1.7;margin:0 0 8px;">
            While you wait, feel free to check out my projects or tools:
          </p>
          <div style="display:flex;gap:8px;">
            <a href="https://attah.dev/projects" style="font-size:11px;color:#f59e0b;text-decoration:none;">Projects →</a>
            &nbsp;&nbsp;
            <a href="https://attah.dev/tools" style="font-size:11px;color:#f59e0b;text-decoration:none;">Free tools →</a>
          </div>

          <div style="margin-top:32px;padding-top:16px;border-top:1px solid #1f2230;">
            <p style="font-size:11px;color:#2d3148;margin:0;">
              attah.dev · Osun, Nigeria
            </p>
          </div>
        </div>
      `,
    })

    return NextResponse.json(
      { success: true, message: 'Message sent successfully.' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Failed to send message. Please try again.' },
      { status: 500 }
    )
  }
}