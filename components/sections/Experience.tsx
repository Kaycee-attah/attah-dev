'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { conversations } from '@/lib/data/experience'

gsap.registerPlugin(ScrollTrigger)

export default function Experience() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const ctx = gsap.context(() => {

      // Heading fades up
      gsap.fromTo(
        '.exp-heading',
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.exp-heading',
            start: 'top 88%',
            toggleActions: 'play reverse play reverse',
          },
        }
      )

      // Each Q&A pair — question slides from right, answer from left
      gsap.utils.toArray<HTMLElement>('.exp-pair').forEach((pair) => {
        const question = pair.querySelector('.exp-question')
        const answer = pair.querySelector('.exp-answer')
        const divider = pair.querySelector('.exp-divider')

        if (question) {
          gsap.fromTo(
            question,
            { opacity: 0, x: 24 },
            {
              opacity: 1,
              x: 0,
              duration: 0.5,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: pair,
                start: 'top 88%',
                toggleActions: 'play reverse play reverse',
              },
            }
          )
        }

        if (answer) {
          gsap.fromTo(
            answer,
            { opacity: 0, x: -24 },
            {
              opacity: 1,
              x: 0,
              duration: 0.5,
              delay: 0.25,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: pair,
                start: 'top 88%',
                toggleActions: 'play reverse play reverse',
              },
            }
          )
        }

        if (divider) {
          gsap.fromTo(
            divider,
            { opacity: 0 },
            {
              opacity: 1,
              duration: 0.4,
              delay: 0.45,
              scrollTrigger: {
                trigger: pair,
                start: 'top 88%',
                toggleActions: 'play reverse play reverse',
              },
            }
          )
        }
      })

      // Status pill fades up last
      gsap.fromTo(
        '.exp-status-pill',
        { opacity: 0, y: 12 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.exp-status-pill',
            start: 'top 92%',
            toggleActions: 'play reverse play reverse',
          },
        }
      )

    }, el)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '80px 24px',
      }}
    >

      {/* ── HEADING ──────────────────────────────────────────── */}
      <div className="exp-heading" style={{ marginBottom: '48px' }}>
        <h2
          style={{
            fontSize: 'clamp(28px, 4vw, 40px)',
            fontWeight: 800,
            letterSpacing: '-0.025em',
            color: 'var(--text-primary)',
            lineHeight: 1.1,
            marginBottom: '8px',
          }}
        >
          The{' '}
          <em style={{ fontStyle: 'italic', fontWeight: 300, color: 'var(--text-muted)' }}>
            journey,
          </em>
        </h2>
        <h2
          style={{
            fontSize: 'clamp(28px, 4vw, 40px)',
            fontWeight: 800,
            letterSpacing: '-0.025em',
            color: 'var(--text-primary)',
            lineHeight: 1.1,
            marginBottom: '12px',
          }}
        >
          in their words.
        </h2>
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: 'var(--text-ghost)',
            letterSpacing: '0.06em',
          }}
        >
          // scroll to read the conversation
        </p>
      </div>

      {/* ── CONVERSATION ─────────────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0',
          maxWidth: '720px',
          margin: '0 auto',
        }}
      >
        {conversations.map((convo, index) => (
          <div
            key={convo.id}
            className="exp-pair"
            style={{ marginBottom: '24px' }}
          >

            {/* ── QUESTION — right aligned ──────────────── */}
            <div
              className="exp-question"
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                marginBottom: '10px',
              }}
            >
              <div
                style={{
                  background: 'rgba(245,158,11,0.08)',
                  border: '0.5px solid rgba(245,158,11,0.2)',
                  borderRadius: '16px 16px 2px 16px',
                  padding: '10px 16px',
                  maxWidth: '72%',
                }}
              >
                <p
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '9px',
                    color: 'rgba(245,158,11,0.5)',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    marginBottom: '4px',
                    textAlign: 'right',
                  }}
                >
                  Recruiter
                </p>
                <p
                  style={{
                    fontSize: '13px',
                    color: 'var(--amber)',
                    lineHeight: 1.5,
                    textAlign: 'right',
                  }}
                >
                  {convo.question}
                </p>
              </div>
            </div>

            {/* ── ANSWER — left aligned ─────────────────── */}
            <div
              className="exp-answer"
              style={{
                display: 'flex',
                justifyContent: 'flex-start',
                gap: '10px',
              }}
            >
              {/* AVATAR */}
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-hover)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px',
                  fontWeight: 700,
                  color: 'var(--amber)',
                  flexShrink: 0,
                  marginTop: '2px',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                AK
              </div>

              {/* ANSWER BUBBLE */}
              <div
                style={{
                  background: 'var(--bg-surface)',
                  border: '0.5px solid var(--border)',
                  borderRadius: '2px 16px 16px 16px',
                  padding: '12px 16px',
                  maxWidth: '78%',
                }}
              >
                <p
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '9px',
                    color: 'var(--text-ghost)',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    marginBottom: '6px',
                  }}
                >
                  Attah Kelechi
                </p>

                <p
                  style={{
                    fontSize: '13px',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.7,
                    marginBottom: convo.stack.length > 0 ? '10px' : '0',
                  }}
                  dangerouslySetInnerHTML={{
                    __html: convo.highlights.reduce(
                      (text, highlight) =>
                        text.replace(
                          highlight,
                          `<span style="color:var(--amber)">${highlight}</span>`
                        ),
                      convo.answer
                    ),
                  }}
                />

                {convo.stack.length > 0 && (
                  <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                    {convo.stack.map((tag) => (
                      <span
                        key={tag}
                        style={{
                          padding: '2px 8px',
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
                )}
              </div>
            </div>

            {/* ── DIVIDER ───────────────────────────────── */}
            {index < conversations.length - 1 && (
              <div
                className="exp-divider"
                style={{
                  height: '0.5px',
                  background: 'var(--border)',
                  margin: '20px 0 0',
                }}
              />
            )}

          </div>
        ))}

        {/* ── STATUS PILL ──────────────────────────────────── */}
        <div
          className="exp-status-pill"
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '8px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '7px',
              padding: '7px 16px',
              border: '0.5px solid var(--border)',
              borderRadius: '24px',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              color: 'var(--text-ghost)',
            }}
          >
            <span className="avail-dot" />
            Currently open to full-time roles and NYSC PPA
          </div>
        </div>

      </div>
    </section>
  )
}