'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useFadeUp, useStaggerAnimation } from '@/lib/useGSAP'
import {
  fullAboutData,
  storyChapters,
  aboutValues,
  aboutPageStats,
  coreStack,
  about_page_currentStatus,
} from '@/lib/data/about'


export default function AboutPage() {
  const heroRef = useFadeUp({ y: 32, duration: 0.7 })
  const chaptersRef = useStaggerAnimation(
    '.chapter-item',
    { opacity: 0, y: 24 },
    { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out', stagger: 0.12 },
    { start: 'top 85%' }
  )
  const sidebarRef = useStaggerAnimation(
    '.sidebar-card',
    { opacity: 0, x: 24 },
    { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out', stagger: 0.1 },
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

      {/* ── PAGE HERO ─────────────────────────────────────────── */}
      <div
        ref={heroRef}
        style={{
          padding: '52px 0 44px',
          borderBottom: '0.5px solid var(--border)',
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          gap: '40px',
          alignItems: 'flex-end',
        }}
        className="about-hero-grid"
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
              About
            </span>
          </div>

          {/* TITLE */}
          <h1
            style={{
              fontSize: 'clamp(36px, 5vw, 52px)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: 'var(--text-primary)',
              lineHeight: 1.0,
              marginBottom: '14px',
            }}
          >
            {fullAboutData.title}{' '}
            <em
              style={{
                fontStyle: 'italic',
                fontWeight: 300,
                color: 'var(--text-muted)',
              }}
            >
              {fullAboutData.titleEm}
            </em>
          </h1>

          {/* INTRO */}
          <p
            style={{
              fontSize: '15px',
              lineHeight: 1.75,
              color: 'var(--text-dim)',
              maxWidth: '480px',
            }}
          >
            {fullAboutData.intro}
          </p>
        </div>

        {/* PROFILE */}
        <div
        style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '10px',
        }}
        >
        {/* CIRCULAR PHOTO */}
        <div
            style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            border: '2px solid var(--border-hover)',
            overflow: 'hidden',
            position: 'relative',
            flexShrink: 0,
            }}
        >
           <Image
                src={fullAboutData.photoPath}
                alt={fullAboutData.photoAlt}
                fill
                style={{
                    objectFit: 'cover',
                    objectPosition: 'center top',
                }}
            />
        </div>

        {/* NAME + ROLE */}
        <div style={{ textAlign: 'center' }}>
            <p
            style={{
                fontSize: '14px',
                fontWeight: 700,
                color: 'var(--text-primary)',
                marginBottom: '2px',
            }}
            >
            {fullAboutData.name}
            </p>
            <p
            style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                color: 'var(--amber)',
                marginBottom: '2px',
            }}
            >
            {fullAboutData.role}
            </p>
            <p
            style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                color: 'var(--text-ghost)',
            }}
            >
            {fullAboutData.location}
            </p>
        </div>

        {/* STATS GRID */}
        <div
            style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '8px',
            width: '180px',
            }}
        >
            {aboutPageStats.map((stat) => (
            <div
                key={stat.label}
                style={{
                background: 'var(--bg-surface)',
                border: '0.5px solid var(--border)',
                borderRadius: '8px',
                padding: '10px 12px',
                }}
            >
                <div
                style={{
                    fontSize: '20px',
                    fontWeight: 800,
                    letterSpacing: '-0.02em',
                    color: 'var(--text-primary)',
                    lineHeight: 1,
                }}
                >
                {stat.num}
                <span style={{ fontSize: '12px', color: 'var(--amber)' }}>
                    {stat.unit}
                </span>
                </div>
                <div
                style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '9px',
                    color: 'var(--text-ghost)',
                    marginTop: '2px',
                }}
                >
                {stat.label}
                </div>
            </div>
            ))}
        </div>
        </div>
      </div>

      {/* ── BODY ─────────────────────────────────────────────── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 260px',
          gap: '48px',
          padding: '48px 0 80px',
          alignItems: 'start',
        }}
        className="about-body-grid"
      >

        {/* ── CHAPTERS ───────────────────────────────────────── */}
        <div ref={chaptersRef}>
          {storyChapters.map((chapter, index) => (
            <div
              key={chapter.id}
              className="chapter-item"
              style={{
                padding: '24px 0',
                borderBottom:
                  index < storyChapters.length - 1
                    ? '0.5px solid var(--border)'
                    : 'none',
                display: 'grid',
                gridTemplateColumns: '48px 1fr',
                gap: '20px',
              }}
            >
              {/* CHAPTER NUMBER */}
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  color: 'var(--text-whisper)',
                  paddingTop: '4px',
                  letterSpacing: '0.04em',
                }}
              >
                {chapter.chapter}
              </div>

              {/* CHAPTER CONTENT */}
              <div>
                <h2
                  style={{
                    fontSize: '16px',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    letterSpacing: '-0.01em',
                    marginBottom: '10px',
                    lineHeight: 1.3,
                  }}
                >
                  {chapter.title}
                </h2>
                <p
                  style={{
                    fontSize: '14px',
                    lineHeight: 1.8,
                    color: 'var(--text-dim)',
                  }}
                  dangerouslySetInnerHTML={{
                    __html: chapter.body.replace(
                      chapter.highlight,
                      `<strong style="color:var(--text-secondary)">${chapter.highlight}</strong>`
                    ),
                  }}
                />

                {/* CTA on last chapter */}
                {index === storyChapters.length - 1 && (
                  <div
                    style={{
                      display: 'flex',
                      gap: '10px',
                      marginTop: '20px',
                    }}
                  >
                    <Link href="/projects" className="btn-primary">
                      View projects
                    </Link>
                    <a
                      href="/cv/attah-kelechi-cv.pdf"
                      download
                      className="btn-secondary"
                    >
                      Download CV
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* ── SIDEBAR ────────────────────────────────────────── */}
        <div
          ref={sidebarRef}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            position: 'sticky',
            top: '88px',
          }}
        >

          {/* STATUS */}
          <div
            className="sidebar-card"
            style={{
              background: 'rgba(34,197,94,0.04)',
              border: '0.5px solid rgba(34,197,94,0.15)',
              borderRadius: '10px',
              padding: '14px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                marginBottom: '10px',
              }}
            >
              <span className="avail-dot" />
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  color: 'var(--text-secondary)',
                }}
              >
                Right now
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
              }}
            >
              {about_page_currentStatus.map((item) => (
                <div
                  key={item}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '7px',
                    fontSize: '11px',
                    color: 'var(--text-dim)',
                  }}
                >
                  <span
                    style={{
                      color: '#4ade80',
                      fontWeight: 700,
                      fontSize: '11px',
                    }}
                  >
                    ✓
                  </span>
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* VALUES */}
          <div
            className="sidebar-card"
            style={{
              background: 'var(--bg-surface)',
              border: '0.5px solid var(--border)',
              borderRadius: '10px',
              overflow: 'hidden',
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
              What I believe
            </div>
            <div
              style={{
                padding: '12px 14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              {aboutValues.map((value) => (
                <div
                  key={value.id}
                  style={{
                    display: 'flex',
                    gap: '10px',
                    alignItems: 'flex-start',
                  }}
                >
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '6px',
                      background: 'var(--bg-elevated)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '13px',
                      flexShrink: 0,
                    }}
                  >
                    {value.icon}
                  </div>
                  <div>
                    <p
                      style={{
                        fontSize: '12px',
                        fontWeight: 700,
                        color: 'var(--text-secondary)',
                        marginBottom: '2px',
                      }}
                    >
                      {value.title}
                    </p>
                    <p
                      style={{
                        fontSize: '11px',
                        color: 'var(--text-ghost)',
                        lineHeight: 1.5,
                      }}
                    >
                      {value.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CORE STACK */}
          <div
            className="sidebar-card"
            style={{
              background: 'var(--bg-surface)',
              border: '0.5px solid var(--border)',
              borderRadius: '10px',
              overflow: 'hidden',
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
              Core stack
            </div>
            <div
              style={{
                padding: '12px 14px',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '6px',
              }}
            >
              {coreStack.map((tag) => (
                <span
                  key={tag.label}
                  style={{
                    padding: '3px 9px',
                    border: tag.active
                      ? '0.5px solid rgba(245,158,11,0.2)'
                      : '0.5px solid var(--border)',
                    borderRadius: '4px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '9px',
                    color: tag.active
                      ? 'var(--amber)'
                      : 'var(--text-ghost)',
                    background: tag.active
                      ? 'rgba(245,158,11,0.06)'
                      : 'var(--bg-elevated)',
                  }}
                >
                  {tag.label}
                </span>
              ))}
            </div>
          </div>

        </div>
        {/* ── END SIDEBAR ──────────────────────────────────── */}

      </div>
    </div>
  )
}