'use client'

import Link from 'next/link'
import { useFadeUp, useStaggerAnimation } from '@/lib/useGSAP'
import { storyBeats, numbers, currentStatus, interestTags } from '@/lib/data/about'


// ─── ABOUT COMPONENT ──────────────────────────────────────────
export default function About() {
  const ref = useFadeUp({ y: 32, duration: 0.7 })
    const storyRef = useStaggerAnimation(
    '.story-beat',
    { opacity: 0, x: -24 },
    { opacity: 1, x: 0, duration: 0.9, ease: 'power2.out', stagger: 0.12 },
    { start: 'top 85%' }
    )
    const numbersRef = useStaggerAnimation(
    '.number-card',
    { opacity: 0, y: 20, scale: 0.95 },
    { opacity: 1, y: 0, scale: 1, duration: 1.3, ease: 'back.out(1.4)', stagger: 0.1 },
    { start: 'top 85%' }
    )

  return (
    <section
      ref={ref}
      style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '80px 24px',
      }}
    >

      {/* ── SECTION HEADER ───────────────────────────────────── */}
      
      <div
        style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginBottom: '40px',
        }}
        >
        <Link
            href="/about"
            style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: 'var(--text-ghost)',
            letterSpacing: '0.03em',
            border: '0.5px solid var(--border)',
            padding: '7px 14px',
            borderRadius: '6px',
            background: 'var(--bg-surface)',
            textDecoration: 'none',
            transition: 'color var(--transition), border-color var(--transition)',
            }}
        >
            Full story →
        </Link>
      </div>

      {/* ── MAIN LAYOUT — two columns ────────────────────────── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '48px',
          alignItems: 'start',
        }}
        className="about-grid"
      >

        {/* ── LEFT — statement + story beats ───────────────── */}
        <div>

          {/* STATEMENT */}
          <h2
            style={{
              fontSize: 'clamp(24px, 3.5vw, 32px)',
              fontWeight: 800,
              letterSpacing: '-0.025em',
              color: 'var(--text-primary)',
              lineHeight: 1.1,
              marginBottom: '24px',
            }}
          >
            Engineer by training,
            <br />
            <em
              style={{
                fontStyle: 'italic',
                fontWeight: 300,
                color: 'var(--text-muted)',
              }}
            >
              builder
            </em>
            {' '}by{' '}
            <span style={{ color: 'var(--amber)', fontStyle: 'normal' }}>
              instinct.
            </span>
          </h2>

          {/* STORY BEATS */}
          <div
            ref={storyRef}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              marginBottom: '28px',
            }}
          >
            {storyBeats.map((beat) => (
              <div
                key={beat.id}
                className="story-beat"
                style={{
                  display: 'flex',
                  gap: '14px',
                  alignItems: 'flex-start',
                  padding: '14px 16px',
                  background: 'var(--bg-surface)',
                  border: '0.5px solid var(--border)',
                  borderRadius: '10px',
                  transition: 'border-color var(--transition)',
                }}
              >
                {/* ICON */}
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    flexShrink: 0,
                    borderRadius: '8px',
                    background: beat.iconBg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '15px',
                    marginTop: '1px',
                  }}
                >
                  {beat.icon}
                </div>

                {/* TEXT */}
                <div>
                  <p
                    style={{
                      fontSize: '13px',
                      fontWeight: 700,
                      color: 'var(--text-secondary)',
                      marginBottom: '3px',
                    }}
                  >
                    {beat.title}
                  </p>
                  <p
                    style={{
                      fontSize: '12px',
                      lineHeight: 1.65,
                      color: 'var(--text-dim)',
                      margin: 0,
                    }}
                  >
                    {beat.text}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA BUTTONS */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <Link href="/about" className="btn-primary">
              Read full story →
            </Link>
            <a
              href="/cv/attah-kelechi-cv.pdf"
              download
              className="btn-secondary"
            >
              Download CV
            </a>
          </div>

        </div>
        {/* ── END LEFT ─────────────────────────────────────── */}

        {/* ── RIGHT — numbers + status + tags ──────────────── */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >

          {/* NUMBER CARDS GRID */}
          <div
            ref={numbersRef}
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '10px',
            }}
          >
            {numbers.map((item) => (
              <div
                key={item.label}
                className="number-card"
                style={{
                  padding: '16px',
                  background: 'var(--bg-surface)',
                  border: '0.5px solid var(--border)',
                  borderRadius: '10px',
                  transition: 'border-color var(--transition)',
                }}
              >
                {/* NUMBER */}
                <div
                  style={{
                    fontSize: '36px',
                    fontWeight: 800,
                    letterSpacing: '-0.03em',
                    color: 'var(--text-primary)',
                    lineHeight: 1,
                    marginBottom: '4px',
                  }}
                >
                  {item.num}
                  <span
                    style={{
                      fontSize: '20px',
                      color: 'var(--amber)',
                    }}
                  >
                    {item.unit}
                  </span>
                </div>

                {/* LABEL */}
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    color: 'var(--text-ghost)',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    marginBottom: '3px',
                  }}
                >
                  {item.label}
                </div>

                {/* SUB */}
                <div
                  style={{
                    fontSize: '11px',
                    color: 'var(--text-faint)',
                  }}
                >
                  {item.sub}
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT NOW BLOCK */}
          <div
            style={{
              background: 'var(--bg-surface)',
              border: '0.5px solid var(--border)',
              borderRadius: '10px',
              overflow: 'hidden',
            }}
          >
            {/* HEADER */}
            <div
              style={{
                padding: '10px 14px',
                borderBottom: '0.5px solid var(--border)',
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                color: 'var(--text-ghost)',
                letterSpacing: '0.07em',
                textTransform: 'uppercase',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span className="avail-dot" />
              Right now
            </div>

            {/* STATUS ITEMS */}
            <div
              style={{
                padding: '10px 14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              {currentStatus.map((item) => (
                <div
                  key={item.key}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '8px',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '10px',
                      color: 'var(--text-ghost)',
                      letterSpacing: '0.04em',
                      minWidth: '64px',
                      flexShrink: 0,
                      paddingTop: '1px',
                    }}
                  >
                    {item.key}
                  </span>
                  <span
                    style={{
                      fontSize: '12px',
                      color: 'var(--text-muted)',
                      lineHeight: 1.5,
                    }}
                  >
                    <strong
                      style={{
                        color: 'var(--text-secondary)',
                        fontWeight: 600,
                      }}
                    >
                      {item.value}
                    </strong>
                    {' '}· {item.detail}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* INTEREST TAGS */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '7px',
            }}
          >
            {interestTags.map((tag) => (
              <span
                key={tag.label}
                style={{
                  padding: '5px 12px',
                  borderRadius: '20px',
                  fontSize: '11px',
                  border: tag.active
                    ? '0.5px solid rgba(245, 158, 11, 0.2)'
                    : '0.5px solid var(--border)',
                  color: tag.active
                    ? 'var(--text-secondary)'
                    : 'var(--text-dim)',
                  background: tag.active
                    ? 'var(--amber-glow)'
                    : 'var(--bg-surface)',
                }}
              >
                {tag.label}
              </span>
            ))}
          </div>

        </div>
        {/* ── END RIGHT ────────────────────────────────────── */}

      </div>
      {/* ── END MAIN LAYOUT ──────────────────────────────────── */}

    </section>
  )
}