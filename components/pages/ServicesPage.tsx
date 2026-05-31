'use client'

import Link from 'next/link'
import { useFadeUp, useStaggerAnimation } from '@/lib/useGSAP'
import {
  servicesData,
  availabilityItems,
  betaSlots,
  services,
  howItWorks,
  bookingStats,
  bookingOptions,
} from '@/lib/data/services'

export default function ServicesPage() {
  const heroRef = useFadeUp({ y: 32, duration: 0.7 })
  const cardsRef = useStaggerAnimation(
    '.svc-card',
    { opacity: 0, y: 24 },
    { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', stagger: 0.1 },
    { start: 'top 88%' }
  )
  const stepsRef = useStaggerAnimation(
    '.how-step',
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out', stagger: 0.08 },
    { start: 'top 88%' }
  )

  const openSlots = betaSlots.total - betaSlots.taken
  const slots = Array.from({ length: betaSlots.total }, (_, i) => ({
    num: i + 1,
    taken: i < betaSlots.taken,
  }))

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
          alignItems: 'center',
        }}
        className="services-hero-grid"
      >
        <div>
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
              Services
            </span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(32px, 5vw, 48px)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: 'var(--text-primary)',
              lineHeight: 1.0,
              marginBottom: '12px',
            }}
          >
            {servicesData.title}{' '}
            <em
              style={{
                fontStyle: 'italic',
                fontWeight: 300,
                color: 'var(--text-muted)',
              }}
            >
              {servicesData.titleEm}
            </em>
          </h1>

          <p
            style={{
              fontSize: '15px',
              lineHeight: 1.75,
              color: 'var(--text-dim)',
              maxWidth: '480px',
            }}
          >
            {servicesData.description}
          </p>
        </div>

        {/* AVAILABILITY CARD */}
        <div
          style={{
            background: 'rgba(34,197,94,0.04)',
            border: '0.5px solid rgba(34,197,94,0.15)',
            borderRadius: '10px',
            padding: '14px 18px',
            flexShrink: 0,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '7px',
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
              Currently available for
            </span>
          </div>
          {availabilityItems.map((item) => (
            <div
              key={item}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '7px',
                fontSize: '11px',
                color: 'var(--text-dim)',
                padding: '3px 0',
              }}
            >
              <span style={{ color: '#4ade80', fontWeight: 700, fontSize: '10px' }}>
                ✓
              </span>
              {item}
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '48px 0 80px' }}>

        {/* ── BETA BANNER ──────────────────────────────────────── */}
        {openSlots > 0 && (
          <div
            style={{
              background: 'rgba(245,158,11,0.04)',
              border: '0.5px solid rgba(245,158,11,0.2)',
              borderRadius: '12px',
              padding: '20px 24px',
              marginBottom: '32px',
              display: 'grid',
              gridTemplateColumns: '1fr auto',
              gap: '24px',
              alignItems: 'center',
            }}
            className="beta-banner-grid"
          >
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '8px',
                }}
              >
                <span
                  style={{
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    background: 'var(--amber)',
                    display: 'inline-block',
                    animation: 'pulse-dot 2s infinite',
                  }}
                />
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    color: 'var(--amber)',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                  }}
                >
                  Beta slots — {openSlots} of {betaSlots.total} available
                </span>
              </div>
              <h2
                style={{
                  fontSize: '16px',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  letterSpacing: '-0.01em',
                  marginBottom: '6px',
                }}
              >
                First clients get a discounted rate
              </h2>
              <p
                style={{
                  fontSize: '13px',
                  color: 'var(--text-dim)',
                  lineHeight: 1.65,
                  maxWidth: '520px',
                }}
              >
                {betaSlots.description}
              </p>
            </div>

            {/* SLOT INDICATORS */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                minWidth: '160px',
                flexShrink: 0,
              }}
            >
              {slots.map((slot) => (
                <div
                  key={slot.num}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 12px',
                    background: 'var(--bg-elevated)',
                    border: '0.5px solid var(--border)',
                    borderRadius: '7px',
                    opacity: slot.taken ? 0.4 : 1,
                  }}
                >
                  <span
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: slot.taken ? 'var(--border-hover)' : 'var(--amber)',
                      display: 'inline-block',
                      flexShrink: 0,
                    }}
                  />
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '10px',
                      color: 'var(--text-secondary)',
                      flex: 1,
                    }}
                  >
                    Slot {slot.num}
                  </span>
                  <span
                    style={{
                      padding: '2px 7px',
                      borderRadius: '3px',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '9px',
                      background: slot.taken
                        ? 'var(--bg-base)'
                        : 'rgba(245,158,11,0.1)',
                      border: `0.5px solid ${slot.taken ? 'var(--border)' : 'rgba(245,158,11,0.2)'}`,
                      color: slot.taken ? 'var(--text-whisper)' : 'var(--amber)',
                    }}
                  >
                    {slot.taken ? 'Taken' : 'Open'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── SERVICE CARDS ─────────────────────────────────────── */}
        <div
          ref={cardsRef}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '16px',
            marginBottom: '48px',
          }}
          className="services-cards-grid"
        >
          {services.map((svc) => (
            <div
              key={svc.id}
              className="svc-card"
              style={{
                background: 'var(--bg-surface)',
                border: `0.5px solid ${svc.featured ? 'rgba(245,158,11,0.25)' : 'var(--border)'}`,
                borderRadius: '12px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* TOP */}
              <div
                style={{
                  padding: '20px 20px 16px',
                  borderBottom: '0.5px solid var(--border)',
                }}
              >
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    background: svc.iconBg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '17px',
                    marginBottom: '12px',
                  }}
                >
                  {svc.icon}
                </div>
                <div
                  style={{
                    fontSize: '15px',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    letterSpacing: '-0.01em',
                    marginBottom: '4px',
                  }}
                >
                  {svc.name}
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    color: 'var(--text-ghost)',
                  }}
                >
                  {svc.sub}
                </div>
              </div>

              {/* MID */}
              <div
                style={{
                  padding: '16px 20px',
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div
                  style={{
                    fontSize: svc.priceUnit ? '24px' : '18px',
                    fontWeight: 800,
                    letterSpacing: '-0.02em',
                    color: svc.priceUnit ? 'var(--text-primary)' : 'var(--text-muted)',
                    lineHeight: 1,
                    marginBottom: '2px',
                  }}
                >
                  {svc.price}
                  {svc.priceUnit && (
                    <span
                      style={{
                        fontSize: '13px',
                        color: 'var(--text-ghost)',
                        fontWeight: 400,
                      }}
                    >
                      {' '}{svc.priceUnit}
                    </span>
                  )}
                </div>

                {/* Beta price note on featured card */}
                {svc.featured && openSlots > 0 && (
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '10px',
                      color: 'var(--amber)',
                      marginBottom: '10px',
                    }}
                  >
                    ↓ {betaSlots.discountedPrice} for beta clients · {openSlots} slot{openSlots !== 1 ? 's' : ''} left
                  </div>
                )}

                <p
                  style={{
                    fontSize: '12px',
                    color: 'var(--text-dim)',
                    lineHeight: 1.65,
                    marginBottom: '12px',
                    marginTop: svc.featured && openSlots > 0 ? '0' : '10px',
                    flex: 1,
                  }}
                >
                  {svc.description}
                </p>

                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '5px',
                  }}
                >
                  {svc.features.map((feat) => (
                    <div
                      key={feat}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '7px',
                        fontSize: '11px',
                        color: 'var(--text-dim)',
                        lineHeight: 1.5,
                      }}
                    >
                      <span
                        style={{
                          width: '4px',
                          height: '4px',
                          borderRadius: '50%',
                          background: 'var(--amber)',
                          flexShrink: 0,
                          marginTop: '5px',
                          opacity: 0.6,
                        }}
                      />
                      {feat}
                    </div>
                  ))}
                </div>
              </div>

              {/* BOTTOM CTA */}
              <div
                style={{
                  padding: '14px 20px',
                  borderTop: '0.5px solid var(--border)',
                }}
              >
                {svc.id === 'contact' ? (
                  <Link
                    href="/contact"
                    className={svc.ctaStyle === 'primary' ? 'btn-primary' : 'btn-secondary'}
                    style={{ display: 'block', textAlign: 'center', fontSize: '13px' }}
                  >
                    {svc.cta}
                  </Link>
                ) : (
                  <a
                    href={
                      svc.id === 'code-review'
                        ? bookingOptions.find((b) => b.id === 'calendly')?.href
                        : '/contact'
                    }
                    target={svc.id === 'code-review' ? '_blank' : undefined}
                    rel={svc.id === 'code-review' ? 'noopener noreferrer' : undefined}
                    style={{
                      display: 'block',
                      textAlign: 'center',
                      padding: '11px',
                      borderRadius: '7px',
                      fontSize: '13px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      textDecoration: 'none',
                      background: svc.ctaStyle === 'primary' ? 'var(--amber)' : 'transparent',
                      color: svc.ctaStyle === 'primary' ? 'var(--bg-base)' : 'var(--text-secondary)',
                      border: svc.ctaStyle === 'primary' ? 'none' : '0.5px solid var(--border)',
                      transition: 'opacity var(--transition)',
                    }}
                  >
                    {svc.cta}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* ── HOW IT WORKS ─────────────────────────────────────── */}
        <div style={{ marginBottom: '48px' }}>
          <h2
            style={{
              fontSize: '18px',
              fontWeight: 700,
              color: 'var(--text-primary)',
              letterSpacing: '-0.015em',
              marginBottom: '20px',
            }}
          >
            How the code review works
          </h2>
          <div
            ref={stepsRef}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '12px',
            }}
            className="how-steps-grid"
          >
            {howItWorks.map((item) => (
              <div
                key={item.step}
                className="how-step"
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
                    fontSize: '10px',
                    color: 'var(--text-whisper)',
                    marginBottom: '8px',
                    letterSpacing: '0.04em',
                  }}
                >
                  {item.step}
                </div>
                <div
                  style={{
                    fontSize: '13px',
                    fontWeight: 700,
                    color: 'var(--text-secondary)',
                    marginBottom: '6px',
                  }}
                >
                  {item.title}
                </div>
                <div
                  style={{
                    fontSize: '11px',
                    color: 'var(--text-ghost)',
                    lineHeight: 1.65,
                  }}
                >
                  {item.desc}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── BOOK CTA ─────────────────────────────────────────── */}
        <div
          style={{
            background: 'var(--bg-surface)',
            border: '0.5px solid rgba(245,158,11,0.15)',
            borderRadius: '12px',
            padding: '28px',
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            gap: '32px',
            alignItems: 'center',
          }}
          className="book-cta-grid"
        >
          <div>
            <h2
              style={{
                fontSize: '20px',
                fontWeight: 800,
                color: 'var(--text-primary)',
                letterSpacing: '-0.02em',
                marginBottom: '8px',
              }}
            >
              Ready to get started?
            </h2>
            <p
              style={{
                fontSize: '13px',
                color: 'var(--text-dim)',
                lineHeight: 1.65,
                maxWidth: '440px',
                marginBottom: '16px',
              }}
            >
              Pick how you want to reach me. All three options go to the
              same place — me, reading your message personally.
            </p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {bookingOptions.map((option) => (
                <a
                  key={option.id}
                  href={option.href}
                  target={option.href.startsWith('http') ? '_blank' : undefined}
                  rel={option.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '7px',
                    fontSize: '13px',
                    fontWeight: 700,
                    textDecoration: 'none',
                    whiteSpace: 'nowrap',
                    background:
                      option.style === 'primary'
                        ? 'var(--amber)'
                        : option.style === 'whatsapp'
                        ? 'transparent'
                        : 'transparent',
                    color:
                      option.style === 'primary'
                        ? 'var(--bg-base)'
                        : option.style === 'whatsapp'
                        ? '#25d366'
                        : 'var(--text-secondary)',
                    border:
                      option.style === 'primary'
                        ? 'none'
                        : option.style === 'whatsapp'
                        ? '0.5px solid rgba(37,211,102,0.2)'
                        : '0.5px solid var(--border)',
                    transition: 'opacity var(--transition)',
                  }}
                >
                  {option.label}
                </a>
              ))}
            </div>
          </div>

          {/* STATS */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              flexShrink: 0,
            }}
          >
            {bookingStats.map((stat) => (
              <div
                key={stat.label}
                style={{
                  background: 'var(--bg-elevated)',
                  border: '0.5px solid var(--border)',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  textAlign: 'center',
                  minWidth: '90px',
                }}
              >
                <div
                  style={{
                    fontSize: '22px',
                    fontWeight: 800,
                    color: 'var(--text-primary)',
                    letterSpacing: '-0.02em',
                    lineHeight: 1,
                  }}
                >
                  {stat.num}
                  <span style={{ fontSize: '13px', color: 'var(--amber)' }}>
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

      <style>{`
        @media (max-width: 768px) {
          .services-hero-grid { grid-template-columns: 1fr !important; }
          .services-cards-grid { grid-template-columns: 1fr !important; }
          .how-steps-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .book-cta-grid { grid-template-columns: 1fr !important; }
          .beta-banner-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

    </div>
  )
}