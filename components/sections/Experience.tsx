'use client'

import { useEffect, useRef, useState } from 'react'
import { useReveal } from '@/lib/useReveal'
import { conversations } from '@/lib/data/experience'

export default function Experience() {
  const sectionRef = useReveal()
  const [visiblePairs, setVisiblePairs] = useState<number[]>([])
  const pairRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
  const observers: IntersectionObserver[] = []

  pairRefs.current.forEach((el, index) => {
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Scrolling down — reveal this pair and all before it
            setVisiblePairs((prev) => {
              const next = new Set(prev)
              for (let i = 0; i <= index; i++) next.add(i)
              return Array.from(next)
            })
          } else {
            // Element left viewport — check if it left from the top
            // (meaning user scrolled UP past it)
            const rect = entry.boundingClientRect
            const isAboveViewport = rect.bottom < 0

            if (isAboveViewport) {
              // Left from top — keep it visible (already scrolled past)
            } else {
              // Left from bottom — user scrolled UP, remove this
              // pair and everything after it
              setVisiblePairs((prev) =>
                prev.filter((i) => i < index)
              )
            }
          }
        })
      },
      { threshold: 0.15 }
    )

    observer.observe(el)
    observers.push(observer)
  })

  return () => observers.forEach((o) => o.disconnect())
}, [])

  return (
    <section
      ref={sectionRef}
      className="reveal"
      style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '80px 24px',
      }}
    >

      {/* ── HEADING ──────────────────────────────────────────── */}
      <div style={{ marginBottom: '48px' }}>
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
          <em
            style={{
              fontStyle: 'italic',
              fontWeight: 300,
              color: 'var(--text-muted)',
            }}
          >
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
        {conversations.map((convo, index) => {
          const isVisible = visiblePairs.includes(index)

          return (
            <div
              key={convo.id}
              ref={(el) => { pairRefs.current[index] = el }}
              style={{ marginBottom: '24px' }}
            >

              {/* ── QUESTION — right aligned ──────────────── */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  marginBottom: '10px',
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible
                    ? 'translateX(0)'
                    : 'translateX(20px)',
                  transition: 'opacity 0.4s ease, transform 0.4s ease',
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
                style={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  gap: '10px',
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible
                    ? 'translateX(0)'
                    : 'translateX(-20px)',
                  transition:
                    'opacity 0.4s ease 0.3s, transform 0.4s ease 0.3s',
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

                  {/* Answer text with highlights */}
                  <p
                    style={{
                      fontSize: '13px',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.7,
                      marginBottom:
                        convo.stack.length > 0 ? '10px' : '0',
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

                  {/* Stack tags */}
                  {convo.stack.length > 0 && (
                    <div
                      style={{
                        display: 'flex',
                        gap: '5px',
                        flexWrap: 'wrap',
                      }}
                    >
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

              {/* ── DIVIDER between pairs ─────────────────── */}
              {index < conversations.length - 1 && (
                <div
                  style={{
                    height: '0.5px',
                    background: 'var(--border)',
                    margin: '20px 0 0',
                    opacity: isVisible ? 1 : 0,
                    transition: 'opacity 0.4s ease 0.5s',
                  }}
                />
              )}

            </div>
          )
        })}

        {/* ── STATUS PILL ──────────────────────────────────── */}
        <div
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