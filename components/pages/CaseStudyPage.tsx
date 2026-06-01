'use client'

import Link from 'next/link'
import { useFadeUp, useStaggerAnimation } from '@/lib/useGSAP'
import { fuegeCaseStudy } from '@/lib/data/casestudies'

type CaseStudy = typeof fuegeCaseStudy & {
  permission?: string
  screenshots: Array<{
    id: string
    path?: string
    caption: string
  }>
}

export default function CaseStudyPage({ study }: { study: CaseStudy }) {
  const heroRef = useFadeUp({ y: 32, duration: 0.7 })
  const metricsRef = useStaggerAnimation(
    '.metric-card',
    { opacity: 0, y: 20, scale: 0.96 },
    { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: 'back.out(1.2)', stagger: 0.08 },
    { start: 'top 88%' }
  )
  const challengesRef = useStaggerAnimation(
    '.challenge-card',
    { opacity: 0, y: 24 },
    { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', stagger: 0.12 },
    { start: 'top 85%' }
  )

  return (
    <div
      style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 24px',
      }}
    >

      {/* ── BACK LINK ─────────────────────────────────────────── */}
      <div
        style={{
          padding: '20px 0',
          borderBottom: '0.5px solid var(--border)',
        }}
      >
        <Link
          href="/projects"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: 'var(--text-ghost)',
            textDecoration: 'none',
            letterSpacing: '0.03em',
          }}
        >
          ← Back to projects
        </Link>
      </div>

      {/* ── HERO ──────────────────────────────────────────────── */}
      <div
        ref={heroRef}
        style={{
          padding: '48px 0 40px',
          borderBottom: '0.5px solid var(--border)',
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          gap: '40px',
          alignItems: 'flex-start',
        }}
        className="cs-hero-grid"
      >
        <div>
          {/* LABEL */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '10px',
            }}
          >
            <span
              style={{
                width: '32px',
                height: '1px',
                background: 'var(--amber)',
                display: 'inline-block',
              }}
            />
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: 'var(--amber)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}
            >
              Case study
            </span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(32px, 5vw, 52px)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: 'var(--text-primary)',
              lineHeight: 1.0,
              marginBottom: '6px',
            }}
          >
            {study.name}
          </h1>

          <p
            style={{
              fontSize: '18px',
              fontWeight: 300,
              fontStyle: 'italic',
              color: 'var(--text-muted)',
              marginBottom: '16px',
            }}
          >
            {study.tagline}
          </p>

          <p
            style={{
              fontSize: '15px',
              lineHeight: 1.75,
              color: 'var(--text-dim)',
              maxWidth: '560px',
              marginBottom: '24px',
            }}
          >
            {study.overview}
          </p>

          {/* CTA LINKS */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {study.liveUrl !== '#' && (
              <a
                href={study.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
                style={{ fontSize: '13px' }}
              >
                ↗ View live
              </a>
            )}
            {study.githubUrl !== '#' && (
              <a
                href={study.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
                style={{ fontSize: '13px' }}
              >
                GitHub
              </a>
            )}
          </div>
        </div>

        {/* META CARD */}
        <div
          style={{
            background: 'var(--bg-surface)',
            border: '0.5px solid var(--border)',
            borderRadius: '10px',
            overflow: 'hidden',
            minWidth: '200px',
            flexShrink: 0,
          }}
        >
          <div
            style={{
              padding: '10px 14px',
              borderBottom: '0.5px solid var(--border)',
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              color: 'var(--text-ghost)',
              letterSpacing: '0.07em',
              textTransform: 'uppercase',
            }}
          >
            Project details
          </div>
          <div style={{ padding: '12px 14px' }}>
            {[
              { label: 'Role',     value: study.role     },
              { label: 'Timeline', value: study.timeline  },
              { label: 'Status',   value: study.status    },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2px',
                  marginBottom: '10px',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '9px',
                    color: 'var(--text-whisper)',
                    letterSpacing: '0.07em',
                    textTransform: 'uppercase',
                  }}
                >
                  {item.label}
                </span>
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: 'var(--text-secondary)',
                  }}
                >
                  {item.value}
                </span>
              </div>
            ))}

            {/* STACK */}
            <div style={{ marginBottom: '4px' }}>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '9px',
                  color: 'var(--text-whisper)',
                  letterSpacing: '0.07em',
                  textTransform: 'uppercase',
                  display: 'block',
                  marginBottom: '6px',
                }}
              >
                Stack
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {study.stack.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      padding: '2px 7px',
                      border: '0.5px solid var(--border)',
                      borderRadius: '3px',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '9px',
                      color: 'var(--text-ghost)',
                      background: 'var(--bg-elevated)',
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* PERMISSION NOTE */}
            {'permission' in study && (
              <div
                style={{
                  marginTop: '12px',
                  paddingTop: '10px',
                  borderTop: '0.5px solid var(--border)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '9px',
                  color: 'var(--text-whisper)',
                  lineHeight: 1.5,
                }}
              >
                {(study as typeof fuegeCaseStudy & { permission: string }).permission}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── METRICS ───────────────────────────────────────────── */}
      <div style={{ padding: '40px 0', borderBottom: '0.5px solid var(--border)' }}>
        <h2
          style={{
            fontSize: '13px',
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-ghost)',
            letterSpacing: '0.07em',
            textTransform: 'uppercase',
            marginBottom: '16px',
          }}
        >
          By the numbers
        </h2>
        <div
          ref={metricsRef}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '12px',
          }}
          className="cs-metrics-grid"
        >
          {study.metrics.map((metric) => (
            <div
              key={metric.label}
              className="metric-card"
              style={{
                background: 'var(--bg-surface)',
                border: '0.5px solid var(--border)',
                borderRadius: '10px',
                padding: '16px',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '2px',
                  background: 'var(--amber)',
                  opacity: 0.5,
                }}
              />
              <div
                style={{
                  fontSize: 'clamp(22px, 3vw, 32px)',
                  fontWeight: 800,
                  letterSpacing: '-0.03em',
                  color: 'var(--text-primary)',
                  lineHeight: 1,
                  marginBottom: '4px',
                }}
              >
                {metric.value}
              </div>
              <div
                style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: 'var(--text-secondary)',
                  marginBottom: '3px',
                }}
              >
                {metric.label}
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  color: 'var(--text-ghost)',
                }}
              >
                {metric.sub}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── BODY ──────────────────────────────────────────────── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 260px',
          gap: '48px',
          padding: '40px 0 80px',
          alignItems: 'start',
        }}
        className="cs-body-grid"
      >

        {/* ── MAIN CONTENT ──────────────────────────────────── */}
        <div>

          {/* THE PROBLEM */}
          <div style={{ marginBottom: '40px' }}>
            <h2
              style={{
                fontSize: '18px',
                fontWeight: 700,
                color: 'var(--text-primary)',
                letterSpacing: '-0.01em',
                marginBottom: '12px',
              }}
            >
              The problem
            </h2>
            <p
              style={{
                fontSize: '14px',
                lineHeight: 1.85,
                color: 'var(--text-dim)',
                borderLeft: '2px solid var(--amber)',
                paddingLeft: '16px',
              }}
            >
              {study.problem}
            </p>
          </div>

          {/* CHALLENGES */}
          <div style={{ marginBottom: '40px' }}>
            <h2
              style={{
                fontSize: '18px',
                fontWeight: 700,
                color: 'var(--text-primary)',
                letterSpacing: '-0.01em',
                marginBottom: '16px',
              }}
            >
              Challenges & solutions
            </h2>
            <div
              ref={challengesRef}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              {study.challenges.map((challenge, index) => (
                <div
                  key={challenge.id}
                  className="challenge-card"
                  style={{
                    background: 'var(--bg-surface)',
                    border: '0.5px solid var(--border)',
                    borderRadius: '10px',
                    overflow: 'hidden',
                  }}
                >
                  {/* CHALLENGE HEADER */}
                  <div
                    style={{
                      padding: '12px 16px',
                      borderBottom: '0.5px solid var(--border)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '10px',
                        color: 'var(--text-whisper)',
                      }}
                    >
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <h3
                      style={{
                        fontSize: '14px',
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                        letterSpacing: '-0.01em',
                      }}
                    >
                      {challenge.title}
                    </h3>
                  </div>

                  {/* CHALLENGE BODY */}
                  <div style={{ padding: '16px' }}>
                    <div style={{ marginBottom: '12px' }}>
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '9px',
                          color: '#f87171',
                          letterSpacing: '0.07em',
                          textTransform: 'uppercase',
                          display: 'block',
                          marginBottom: '5px',
                        }}
                      >
                        Problem
                      </span>
                      <p
                        style={{
                          fontSize: '13px',
                          lineHeight: 1.75,
                          color: 'var(--text-dim)',
                        }}
                      >
                        {challenge.problem}
                      </p>
                    </div>

                    <div style={{ marginBottom: '12px' }}>
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '9px',
                          color: '#4ade80',
                          letterSpacing: '0.07em',
                          textTransform: 'uppercase',
                          display: 'block',
                          marginBottom: '5px',
                        }}
                      >
                        Solution
                      </span>
                      <p
                        style={{
                          fontSize: '13px',
                          lineHeight: 1.75,
                          color: 'var(--text-dim)',
                        }}
                      >
                        {challenge.solution}
                      </p>
                    </div>

                    <div
                      style={{
                        padding: '10px 12px',
                        background: 'var(--bg-elevated)',
                        border: '0.5px solid var(--border)',
                        borderLeft: '2px solid #4ade80',
                        borderRadius: '0 6px 6px 0',
                      }}
                    >
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '9px',
                          color: '#4ade80',
                          letterSpacing: '0.07em',
                          textTransform: 'uppercase',
                          display: 'block',
                          marginBottom: '3px',
                        }}
                      >
                        Outcome
                      </span>
                      <p
                        style={{
                          fontSize: '12px',
                          color: 'var(--text-secondary)',
                          fontWeight: 600,
                        }}
                      >
                        {challenge.outcome}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* LEARNINGS */}
          <div>
            <h2
              style={{
                fontSize: '18px',
                fontWeight: 700,
                color: 'var(--text-primary)',
                letterSpacing: '-0.01em',
                marginBottom: '14px',
              }}
            >
              What I learned
            </h2>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              {study.learnings.map((learning, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    gap: '12px',
                    alignItems: 'flex-start',
                    padding: '12px 14px',
                    background: 'var(--bg-surface)',
                    border: '0.5px solid var(--border)',
                    borderRadius: '8px',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '10px',
                      color: 'var(--amber)',
                      flexShrink: 0,
                      paddingTop: '2px',
                    }}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <p
                    style={{
                      fontSize: '13px',
                      lineHeight: 1.7,
                      color: 'var(--text-dim)',
                    }}
                  >
                    {learning}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ── SCREENSHOTS ──────────────────────────────────────── */}
<div style={{ marginTop: '40px' }}>
  <h2
    style={{
      fontSize: '18px',
      fontWeight: 700,
      color: 'var(--text-primary)',
      letterSpacing: '-0.01em',
      marginBottom: '16px',
    }}
  >
    Screenshots
  </h2>
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '12px',
    }}
    className="screenshots-grid"
  >
    {study.screenshots.map((shot) => (
      shot.path && (
        <div
          key={shot.id}
          style={{
            border: '0.5px solid var(--border)',
            borderRadius: '8px',
            overflow: 'hidden',
            background: 'var(--bg-surface)',
          }}
        >
          <div
            style={{
              width: '100%',
              height: '200px',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <img
              src={shot.path}
              alt={shot.caption}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'top',
                display: 'block',
              }}
            />
          </div>
          <div
            style={{
              padding: '8px 12px',
              borderTop: '0.5px solid var(--border)',
            }}
          >
            <p
              style={{
                fontSize: '11px',
                color: 'var(--text-dim)',
                lineHeight: 1.4,
              }}
            >
              {shot.caption}
            </p>
          </div>
        </div>
      )
    ))}
  </div>
</div>

        </div>

        {/* ── SIDEBAR ──────────────────────────────────────────── */}
        <div
          style={{
            position: 'sticky',
            top: '88px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >

          

          {/* MORE PROJECTS */}
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
                letterSpacing: '0.07em',
                textTransform: 'uppercase',
                marginBottom: '10px',
              }}
            >
              More case studies
            </div>
            <Link
              href={study.id === 'fuege' ? '/projects/hms' : '/projects/fuege'}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '2px',
                padding: '10px 12px',
                background: 'var(--bg-elevated)',
                border: '0.5px solid var(--border)',
                borderRadius: '6px',
                textDecoration: 'none',
                marginBottom: '8px',
              }}
            >
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  color: 'var(--text-secondary)',
                }}
              >
                {study.id === 'fuege' ? 'Oneflare HMS' : 'Fuege'}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  color: 'var(--amber)',
                }}
              >
                {study.id === 'fuege'
                  ? 'Hotel Management System →'
                  : '3D Furniture Customizer →'}
              </span>
            </Link>
            <Link
              href="/projects"
              style={{
                display: 'block',
                textAlign: 'center',
                padding: '8px',
                borderRadius: '6px',
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                color: 'var(--text-ghost)',
                border: '0.5px solid var(--border)',
                textDecoration: 'none',
              }}
            >
              All projects →
            </Link>
          </div>

        </div>

      </div>

      <style>{`
        @media (max-width: 768px) {
          .cs-hero-grid { grid-template-columns: 1fr !important; }
          .cs-metrics-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .cs-body-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

    </div>
  )
}