import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
const { phase1Questions } = await import('@/lib/data/business-builder')

export async function POST(req: NextRequest) {
  try {
    const {
      systemPrompt,
      userMessage,
      action,
      sessionId,
      // Lead capture
      name,
      email,
      phone,
      phase1Answers,
      phase2Answers,
      results,
    } = await req.json()

    // ── TRACK ANALYTICS EVENT ──────────────────────────────────
    if (action === 'track') {
      await supabaseAdmin.from('productiq_analytics').insert({
        event: userMessage, // reusing userMessage field for event name
        session_id: sessionId,
        metadata: phase1Answers || {},
      })
      return NextResponse.json({ success: true }, { status: 200 })
    }

    // ── SAVE LEAD ──────────────────────────────────────────────
    if (action === 'save_lead') {
      const { data, error } = await supabaseAdmin
        .from('productiq_leads')
        .insert({
          name,
          email,
          phone: phone || null,
          phase1_answers: phase1Answers || {},
          phase2_answers: phase2Answers || {},
          results: results || {},
          status: 'new',
        })
        .select()
        .single()

      if (error) {
        console.error('Supabase insert error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      // Send email notification to Attah
      await notifyAttah({ name, email, phone, phase1Answers, phase2Answers, results })

      return NextResponse.json({ success: true, lead: data }, { status: 200 })
    }

    // ── GENERATE AI RESPONSE ───────────────────────────────────
    if (!systemPrompt || !userMessage) {
      return NextResponse.json(
        { error: 'systemPrompt and userMessage are required.' },
        { status: 400 }
      )
    }

    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey) {
      console.error('GROQ_API_KEY is not set')
      return NextResponse.json(
        { error: 'API key not configured.' },
        { status: 500 }
      )
    }

    const groqResponse = await fetch(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userMessage },
          ],
          max_tokens: 2048,
          temperature: 0.7,
        }),
      }
    )

    const data = await groqResponse.json()

    if (!groqResponse.ok) {
      console.error('Groq API error:', data)
      return NextResponse.json(
        { error: data.error?.message || 'Groq API error.' },
        { status: 500 }
      )
    }

    const text = data.choices?.[0]?.message?.content || ''

    if (!text) {
      return NextResponse.json(
        { error: 'No response generated.' },
        { status: 500 }
      )
    }

    const clean = text.replace(/```json|```/g, '').trim()
    return NextResponse.json({ text: clean }, { status: 200 })

  } catch (error) {
    console.error('ProductIQ route error:', error)
    return NextResponse.json(
      { error: 'Failed to generate response.' },
      { status: 500 }
    )
  }
}

// ── EMAIL NOTIFICATION ─────────────────────────────────────────
async function notifyAttah({
  name,
  email,
  phone,
  phase1Answers,
  phase2Answers,
  results,
}: {
  name: string
  email: string
  phone?: string
  phase1Answers: Record<string, string>
  phase2Answers: Record<string, string>
  results: Record<string, unknown>
}) {
  try {
    const { Resend } = await import('resend')
    const resend = new Resend(process.env.RESEND_API_KEY)

    const getQuestion = (id: string) => 
    phase1Questions.find(q => q.id === id)?.question || id

    const phase1Html = Object.entries(phase1Answers)
    .map(([k, v]) => `
        <tr>
        <td colspan="2" style="padding:10px 0 3px;font-size:12px;color:#9ca3af;font-style:italic;border-top:0.5px solid #1f2230;">
            ${getQuestion(k)}
        </td>
        </tr>
        <tr>
        <td style="padding:0 0 8px;font-size:13px;color:#f59e0b;font-weight:700;">→</td>
        <td style="padding:0 0 8px;font-size:13px;color:#e5e7eb;">${v}</td>
        </tr>
    `)
    .join('')

    const phase2Html = Object.entries(phase2Answers)
    .map(([k, v]) => `
        <tr>
        <td colspan="2" style="padding:10px 0 3px;font-size:12px;color:#9ca3af;font-style:italic;border-top:0.5px solid #1f2230;">
            ${k.replace(/_/g, ' ')}
        </td>
        </tr>
        <tr>
        <td style="padding:0 0 8px;font-size:13px;color:#60a5fa;font-weight:700;">→</td>
        <td style="padding:0 0 8px;font-size:13px;color:#e5e7eb;">${v}</td>
        </tr>
    `)
    .join('')

    const res = results as {
      businessName?: { recommended?: string }
      platform?: { recommendation?: string }
      attahNote?: string
    }

    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: process.env.RESEND_TO_EMAIL!,
      replyTo: email,
      subject: `[ProductIQ] New lead — ${name} · ${res.businessName?.recommended || 'Strategy ready'}`,
      html: `
        <div style="font-family:monospace;max-width:600px;margin:0 auto;padding:32px;background:#0d0f14;color:#e5e7eb;border-radius:8px;">
          <h1 style="font-size:20px;font-weight:700;color:#f9fafb;margin:0 0 4px;">New ProductIQ Lead</h1>
          <p style="font-size:12px;color:#4b5280;margin:0 0 24px;">Someone completed your business strategy tool</p>

          <div style="background:#080a0e;border:1px solid #1f2230;border-radius:8px;padding:16px;margin-bottom:20px;">
            <p style="font-size:11px;color:#4b5280;text-transform:uppercase;letter-spacing:0.06em;margin:0 0 10px;">Contact details</p>
            <p style="font-size:14px;font-weight:700;color:#f9fafb;margin:0 0 4px;">${name}</p>
            <p style="font-size:13px;color:#f59e0b;margin:0 0 4px;">${email}</p>
            ${phone ? `<p style="font-size:12px;color:#9ca3af;margin:0;">${phone}</p>` : ''}
          </div>

          <div style="background:#080a0e;border:1px solid #1f2230;border-radius:8px;padding:16px;margin-bottom:20px;">
            <p style="font-size:11px;color:#4b5280;text-transform:uppercase;letter-spacing:0.06em;margin:0 0 10px;">Phase 1 answers</p>
            <table style="width:100%;border-collapse:collapse;">${phase1Html}</table>
          </div>

          ${phase2Html ? `
          <div style="background:#080a0e;border:1px solid #1f2230;border-radius:8px;padding:16px;margin-bottom:20px;">
            <p style="font-size:11px;color:#4b5280;text-transform:uppercase;letter-spacing:0.06em;margin:0 0 10px;">Phase 2 answers</p>
            <table style="width:100%;border-collapse:collapse;">${phase2Html}</table>
          </div>` : ''}

          <div style="background:#080a0e;border:1px solid rgba(245,158,11,0.2);border-radius:8px;padding:16px;margin-bottom:20px;">
            <p style="font-size:11px;color:#f59e0b;text-transform:uppercase;letter-spacing:0.06em;margin:0 0 10px;">Generated strategy</p>
            <p style="font-size:13px;font-weight:700;color:#f9fafb;margin:0 0 4px;">Recommended name: ${res.businessName?.recommended || '—'}</p>
            <p style="font-size:12px;color:#9ca3af;margin:0 0 12px;">Platform: ${res.platform?.recommendation || '—'}</p>
            <p style="font-size:12px;color:#6b7280;font-style:italic;line-height:1.6;">${res.attahNote || ''}</p>
          </div>

          <div style="display:flex;gap:12px;margin-top:20px;">
            <a href="mailto:${email}" style="padding:10px 20px;background:#f59e0b;color:#0d0f14;border-radius:6px;font-size:13px;font-weight:700;text-decoration:none;">Reply to ${name} →</a>
            <a href="https://calendly.com/attahkelechi97/free-20-min-product-strategy-call" style="padding:10px 20px;background:transparent;color:#d1d5db;border:1px solid #1f2230;border-radius:6px;font-size:13px;text-decoration:none;">Send Calendly link</a>
          </div>
        </div>
      `,
    })
  } catch (err) {
    console.error('Failed to send lead notification email:', err)
    // Don't throw — email failure shouldn't block lead save
  }
}