import { notFound } from 'next/navigation'
import Link from 'next/link'
import { supabaseAdmin } from '@/lib/supabase'
import { phase1Questions } from '@/lib/data/business-builder'

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const { data: lead, error } = await supabaseAdmin
    .from('productiq_leads')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !lead) notFound()

  const getQuestion = (questionId: string) =>
    phase1Questions.find((q) => q.id === questionId)?.question || questionId

  const results = lead.results as {
    businessName?: { recommended?: string; alternatives?: string[]; reasoning?: string }
    platform?: { recommendation?: string; reasoning?: string; developerMistake?: string }
    monetisation?: Array<{ period: string; action: string }>
    firstThreeToBuild?: Array<{ number: string; title: string; description: string }>
    unfairAdvantage?: string
    attahNote?: string
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 24px 80px' }}>

      {/* BACK */}
      <div style={{ marginBottom: '24px' }}>
        <Link
          href="/admin/productiq"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: 'var(--text-ghost)',
            textDecoration: 'none',
          }}
        >
          ← Back to all leads
        </Link>
      </div>

      {/* HEADER */}
      <div
        style={{
          background: 'var(--bg-surface)',
          border: '0.5px solid var(--border)',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '16px',
          flexWrap: 'wrap',
        }}
      >
        <div>
          <h1
            style={{
              fontSize: '22px',
              fontWeight: 700,
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em',
              marginBottom: '4px',
            }}
          >
            {lead.name}
          </h1>
          <a
            href={`mailto:${lead.email}`}
            style={{ fontSize: '14px', color: 'var(--amber)', textDecoration: 'none' }}
          >
            {lead.email}
          </a>
          {lead.phone && (
            <div style={{ fontSize: '13px', color: 'var(--text-ghost)', marginTop: '2px' }}>
              {lead.phone}
            </div>
          )}
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              color: 'var(--text-whisper)',
              marginTop: '6px',
            }}
          >
            {new Date(lead.created_at).toLocaleDateString('en-GB', {
              day: 'numeric', month: 'long', year: 'numeric',
              hour: '2-digit', minute: '2-digit',
            })}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <a
            href={`mailto:${lead.email}`}
            className="btn-primary"
            style={{ fontSize: '12px', padding: '8px 16px' }}
          >
            ✉ Email {lead.name.split(' ')[0]}
          </a>
          {lead.phone && (
            <a
              href={`https://wa.me/${lead.phone.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
              style={{ fontSize: '12px', padding: '8px 16px' }}
            >
              WhatsApp
            </a>
          )}
          <a
            href="https://calendly.com/attahkelechi97/free-20-min-product-strategy-call"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
            style={{ fontSize: '12px', padding: '8px 16px' }}
          >
            Send Calendly link
          </a>
        </div>
      </div>

      {/* PHASE 1 ANSWERS */}
      <div
        style={{
          background: 'var(--bg-surface)',
          border: '0.5px solid var(--border)',
          borderRadius: '12px',
          overflow: 'hidden',
          marginBottom: '16px',
        }}
      >
        <div
          style={{
            padding: '12px 16px',
            borderBottom: '0.5px solid var(--border)',
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            color: 'var(--text-ghost)',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
          }}
        >
          Phase 1 — Foundation answers
        </div>
        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {Object.entries(lead.phase1_answers || {}).map(([key, val]) => (
            <div key={key}>
              <div
                style={{
                  fontSize: '12px',
                  color: 'var(--text-ghost)',
                  fontStyle: 'italic',
                  marginBottom: '4px',
                }}
              >
                {getQuestion(key)}
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px',
                }}
              >
                <span style={{ color: 'var(--amber)', fontWeight: 700, flexShrink: 0 }}>→</span>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{val as string}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PHASE 2 ANSWERS */}
      {Object.keys(lead.phase2_answers || {}).length > 0 && (
        <div
          style={{
            background: 'var(--bg-surface)',
            border: '0.5px solid var(--border)',
            borderRadius: '12px',
            overflow: 'hidden',
            marginBottom: '16px',
          }}
        >
          <div
            style={{
              padding: '12px 16px',
              borderBottom: '0.5px solid var(--border)',
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              color: '#60a5fa',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
            }}
          >
            Phase 2 — Deep dive answers
          </div>
          <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {Object.entries(lead.phase2_answers || {}).map(([key, val]) => (
              <div key={key}>
                <div
                  style={{
                    fontSize: '12px',
                    color: 'var(--text-ghost)',
                    fontStyle: 'italic',
                    marginBottom: '4px',
                  }}
                >
                  {key.replace(/_/g, ' ')}
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <span style={{ color: '#60a5fa', fontWeight: 700, flexShrink: 0 }}>→</span>
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{val as string}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* GENERATED STRATEGY */}
      {results && (
        <>
          {/* NAME */}
          <div
            style={{
              background: 'var(--bg-surface)',
              border: '0.5px solid rgba(245,158,11,0.2)',
              borderRadius: '12px',
              overflow: 'hidden',
              marginBottom: '16px',
            }}
          >
            <div
              style={{
                padding: '12px 16px',
                borderBottom: '0.5px solid var(--border)',
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                color: 'var(--amber)',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
              }}
            >
              Recommended business name
            </div>
            <div style={{ padding: '16px' }}>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
                <span
                  style={{
                    padding: '6px 14px',
                    borderRadius: '5px',
                    fontSize: '16px',
                    fontWeight: 700,
                    background: 'rgba(245,158,11,0.1)',
                    border: '0.5px solid rgba(245,158,11,0.3)',
                    color: 'var(--amber)',
                  }}
                >
                  {results.businessName?.recommended}
                </span>
                {results.businessName?.alternatives?.map((name) => (
                  <span
                    key={name}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '5px',
                      fontSize: '13px',
                      background: 'var(--bg-elevated)',
                      border: '0.5px solid var(--border)',
                      color: 'var(--text-dim)',
                    }}
                  >
                    {name}
                  </span>
                ))}
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-dim)', lineHeight: 1.65 }}>
                {results.businessName?.reasoning}
              </p>
            </div>
          </div>

          {/* PLATFORM */}
          <div
            style={{
              background: 'var(--bg-surface)',
              border: '0.5px solid var(--border)',
              borderRadius: '12px',
              overflow: 'hidden',
              marginBottom: '16px',
            }}
          >
            <div
              style={{
                padding: '12px 16px',
                borderBottom: '0.5px solid var(--border)',
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                color: 'var(--text-ghost)',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
              }}
            >
              Platform recommendation
            </div>
            <div style={{ padding: '16px' }}>
              <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
                {results.platform?.recommendation}
              </p>
              <p style={{ fontSize: '13px', color: 'var(--text-dim)', lineHeight: 1.65, marginBottom: '10px' }}>
                {results.platform?.reasoning}
              </p>
              <div
                style={{
                  padding: '10px 12px',
                  background: 'var(--bg-elevated)',
                  borderLeft: '2px solid var(--amber)',
                  borderRadius: '0 6px 6px 0',
                  fontSize: '12px',
                  color: 'var(--text-dim)',
                  lineHeight: 1.6,
                }}
              >
                <strong style={{ color: 'var(--text-secondary)', display: 'block', marginBottom: '3px' }}>
                  What most developers get wrong:
                </strong>
                {results.platform?.developerMistake}
              </div>
            </div>
          </div>

          {/* MONETISATION + FIRST 3 */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px',
              marginBottom: '16px',
            }}
          >
            <div
              style={{
                background: 'var(--bg-surface)',
                border: '0.5px solid var(--border)',
                borderRadius: '12px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  padding: '12px 16px',
                  borderBottom: '0.5px solid var(--border)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  color: 'var(--text-ghost)',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                }}
              >
                Monetisation roadmap
              </div>
              <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {results.monetisation?.map((item) => (
                  <div key={item.period} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '9px',
                        padding: '3px 8px',
                        borderRadius: '3px',
                        background: 'var(--bg-elevated)',
                        border: '0.5px solid var(--border)',
                        color: 'var(--text-ghost)',
                        whiteSpace: 'nowrap',
                        flexShrink: 0,
                        marginTop: '2px',
                      }}
                    >
                      {item.period}
                    </span>
                    <span style={{ fontSize: '12px', color: 'var(--text-dim)', lineHeight: 1.5 }}>
                      {item.action}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div
              style={{
                background: 'var(--bg-surface)',
                border: '0.5px solid var(--border)',
                borderRadius: '12px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  padding: '12px 16px',
                  borderBottom: '0.5px solid var(--border)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  color: 'var(--text-ghost)',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                }}
              >
                First 3 things to build
              </div>
              <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {results.firstThreeToBuild?.map((item) => (
                  <div key={item.number} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '11px',
                        color: 'var(--amber)',
                        fontWeight: 700,
                        flexShrink: 0,
                        marginTop: '1px',
                      }}
                    >
                      {item.number}
                    </span>
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '2px' }}>
                        {item.title}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-dim)', lineHeight: 1.5 }}>
                        {item.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* UNFAIR ADVANTAGE */}
          <div
            style={{
              background: 'rgba(245,158,11,0.04)',
              border: '0.5px solid rgba(245,158,11,0.15)',
              borderRadius: '10px',
              padding: '14px 16px',
              marginBottom: '16px',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '9px',
                color: 'var(--amber)',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                marginBottom: '6px',
              }}
            >
              ⚡ Unfair advantage
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.7, fontStyle: 'italic' }}>
              "{results.unfairAdvantage}"
            </p>
          </div>

          {/* ATTAH'S NOTE */}
          <div
            style={{
              background: 'var(--bg-surface)',
              border: '0.5px solid var(--border)',
              borderRadius: '10px',
              padding: '16px',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '9px',
                color: 'var(--text-ghost)',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                marginBottom: '8px',
              }}
            >
              Attah's note
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-dim)', lineHeight: 1.8 }}>
              {results.attahNote}
            </p>
          </div>
        </>
      )}

    </div>
  )
}