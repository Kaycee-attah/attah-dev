'use client'

import Image from 'next/image'
import Link from 'next/link'
import { stackTags, socialLinks, codeLines, heroData } from '@/lib/data/hero'
import { useFadeUp, useStaggerAnimation } from '@/lib/useGSAP'


// ─── HERO COMPONENT ───────────────────────────────────────────
export default function Hero() {
  const sectionRef = useFadeUp({ y: 40, duration: 3.0 })
    const stackRef = useStaggerAnimation(
    '.skill-tag',
    { opacity: 0, y: 16 },
    { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out', stagger: 0.3 },
    { start: 'top 90%' }
    )

  return (
    <section
      ref={sectionRef}
      style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '56px 24px 0',
        position: 'relative',
        overflow: 'hidden',
      }}
    >

      {/* ── AMBIENT GLOW ───────────────────────────────────── */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '-60px',
          right: '-40px',
          width: '420px',
          height: '320px',
          background: 'radial-gradient(ellipse, rgba(245,158,11,0.08) 0%, transparent 68%)',
          pointerEvents: 'none',
        }}
      />

      {/* ── TOP ROW — left content + right photo/code ──────── */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '40px',
          gap: '32px',
        }}
      >

        {/* ── LEFT COLUMN ──────────────────────────────────── */}
        <div style={{ maxWidth: '520px' }}>

          {/* TAG */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              color: 'var(--amber)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: '20px',
            }}
          >
            <span
              style={{
                width: '20px',
                height: '1.5px',
                background: 'var(--amber)',
                display: 'inline-block',
                flexShrink: 0,
              }}
            />
            Frontend Developer
          </div>

          {/* NAME */}
          <h1
            style={{
              fontSize: 'clamp(48px, 7vw, 72px)',
              fontWeight: 800,
              lineHeight: 1.0,
              letterSpacing: '-0.03em',
              color: 'var(--text-primary)',
              marginBottom: '16px',
            }}
          >
            Attah
            <br />
            <em
              style={{
                fontStyle: 'italic',
                fontWeight: 300,
                color: 'var(--text-muted)',
              }}
            >
              Kelechi.
            </em>
          </h1>

          {/* DESCRIPTION */}
          <p
            style={{
              fontSize: '15px',
              lineHeight: 1.75,
              color: 'var(--text-muted)',
              fontWeight: 400,
              marginBottom: '32px',
              maxWidth: '460px',
            }}
          >
            I build{' '}
            <strong
              style={{
                color: 'var(--text-secondary)',
                fontWeight: 600,
              }}
            >
              fast, accessible, production-grade interfaces
            </strong>
            {' '}— from 3D furniture configurators and fintech
            dashboards to demographic intelligence APIs.
            Based in Nigeria, built for the world.
          </p>

          {/* CTA BUTTONS */}
          <div
            style={{
              display: 'flex',
              gap: '10px',
              flexWrap: 'wrap',
            }}
          >
            <Link
              href="/projects"
              className="btn-primary"
            >
              View Projects
            </Link>
            <a
            
              href="/cv/attah-kelechi-cv.pdf"
              download
              className="btn-secondary"
            >
              Download CV
            </a>

            <Link
              href="/contact"
              className="btn-secondary"
            >
              Contact Me
            </Link>
          </div>

        </div>
        {/* ── END LEFT COLUMN ────────────────────────────── */}

        {/* ── RIGHT COLUMN — photo + code card ────────────── */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: '14px',
            flexShrink: 0,
          }}
          className="hero-right"
        >

          {/* PHOTO */}
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '10px',
              border: '1px solid var(--border-hover)',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <Image
              src={heroData.photoPath}
              alt={heroData.photoAlt}
              fill
              style={{
                objectFit: 'cover',
                objectPosition: 'center top',
              }}
              priority
            />
          </div>

          {/* CODE CARD */}
          <div
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              overflow: 'hidden',
              width: '200px',
            }}
          >
            {/* TRAFFIC LIGHT BAR */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '8px 12px',
                background: 'var(--bg-overlay)',
                borderBottom: '0.5px solid var(--border)',
              }}
            >
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444', opacity: 0.8, display: 'inline-block' }} />
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#f59e0b', opacity: 0.8, display: 'inline-block' }} />
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', opacity: 0.8, display: 'inline-block' }} />
              <span
                style={{
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  color: 'var(--text-ghost)',
                }}
              >
                attah.ts
              </span>
            </div>

            {/* CODE LINES */}
            <div
              style={{
                padding: '12px 14px',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                lineHeight: 1.9,
              }}
            >
              {codeLines.map((line, lineIndex) => (
                <div key={lineIndex}>
                  {line.map((token, tokenIndex) => (
                    <span
                      key={tokenIndex}
                      style={{ color: token.color }}
                    >
                      {token.text}
                    </span>
                  ))}
                </div>
              ))}
              {/* BLINKING CURSOR */}
              <span
                style={{
                  display: 'inline-block',
                  width: '6px',
                  height: '12px',
                  background: 'var(--amber)',
                  verticalAlign: '-2px',
                  marginLeft: '1px',
                  animation: 'blink 1s steps(1) infinite',
                }}
              />
            </div>

          </div>
          {/* ── END CODE CARD ──────────────────────────────── */}

        </div>
        {/* ── END RIGHT COLUMN ─────────────────────────────── */}

      </div>
      {/* ── END TOP ROW ──────────────────────────────────────── */}

      {/* ── DIVIDER WITH AMBER ACCENT ────────────────────────── */}
      <div
        style={{
          height: '0.5px',
          background: 'var(--border)',
          marginBottom: '0',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: '80px',
            height: '1px',
            background: 'var(--amber)',
          }}
        />
      </div>

      {/* ── BOTTOM ROW — stack tags + socials ────────────────── */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '20px 0',
        }}
      >

        {/* STACK TAGS */}
        <div
          ref={stackRef}
          style={{
            display: 'flex',
            gap: '7px',
            flexWrap: 'wrap',
            maxWidth: '500px',
          }}
        >
          {stackTags.map((tag) => (
            <span
              key={tag.label}
              className={`skill-tag${tag.active ? ' active' : ''}`}
            >
              {tag.label}
            </span>
          ))}
        </div>

        {/* SOCIALS */}
        <div
          style={{
            display: 'flex',
            gap: '16px',
            alignItems: 'center',
          }}
          className="hero-socials"
        >
          {socialLinks.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target={social.href.startsWith('http') ? '_blank' : undefined}
              rel={social.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              style={{
                fontSize: '12px',
                color: 'var(--text-ghost)',
                fontFamily: 'var(--font-mono)',
                textDecoration: 'none',
                transition: 'color var(--transition)',
              }}
            >
              {social.label}
            </a>
          ))}
        </div>

      </div>
      {/* ── END BOTTOM ROW ───────────────────────────────────── */}

      {/* ── FOOTER STRIP ─────────────────────────────────────── */}
      <div
        style={{
          borderTop: '0.5px solid var(--border)',
          padding: '13px 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >

        {/* LEFT — location */}
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: 'var(--text-faint)',
            margin: 0,
          }}
        >
          Osun, Nigeria · Open to remote · NYSC PPA
        </p>

        {/* RIGHT — scroll indicator */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <div
            style={{
              width: '1px',
              height: '18px',
              background: 'var(--border)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                background: 'var(--amber)',
                animation: 'scrollDown 2s ease-in-out infinite',
              }}
            />
          </div>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              color: 'var(--text-faint)',
              letterSpacing: '0.07em',
              textTransform: 'uppercase',
            }}
          >
            Scroll
          </span>
        </div>

      </div>
      {/* ── END FOOTER STRIP ─────────────────────────────────── */}

    </section>
  )
}