'use client'

import { useState, useEffect, useRef } from 'react'
import type { Metadata } from 'next'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  contactData,
  reasonPills,
  subjectOptions,
  directContacts,
  socialLinks,
} from '@/lib/data/contact'

gsap.registerPlugin(ScrollTrigger)

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: '',
  })
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'
  >('idle')
  const [charCount, setCharCount] = useState(0)
  const heroRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLDivElement>(null)
  const rightRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const hero = heroRef.current
    const form = formRef.current
    const right = rightRef.current
    if (!hero || !form || !right) return

    const ctx = gsap.context(() => {
      // Hero animates in on load
      gsap.fromTo(
        hero.querySelectorAll('.hero-animate'),
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
          stagger: 0.1,
        }
      )

      // Form slides in from left
      gsap.fromTo(
        form,
        { opacity: 0, x: -32 },
        {
          opacity: 1,
          x: 0,
          duration: 0.7,
          ease: 'power2.out',
          delay: 0.3,
          scrollTrigger: {
            trigger: form,
            start: 'top 88%',
            toggleActions: 'play reverse play reverse',
          },
        }
      )

      // Right cards stagger in from right
      gsap.fromTo(
        right.querySelectorAll('.contact-card-item'),
        { opacity: 0, x: 32 },
        {
          opacity: 1,
          x: 0,
          duration: 0.5,
          ease: 'power2.out',
          stagger: 0.08,
          delay: 0.4,
          scrollTrigger: {
            trigger: right,
            start: 'top 88%',
            toggleActions: 'play reverse play reverse',
          },
        }
      )
    })

    return () => ctx.revert()
  }, [])

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.message) return
    setStatus('sending')

    try {
        const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        })

        const data = await res.json()

        if (!res.ok) throw new Error(data.error || 'Failed to send')

        setStatus('success')
        setFormData({ name: '', email: '', company: '', subject: '', message: '' })
        setCharCount(0)
    } catch (err) {
        setStatus('error')
    }
  }

  return (
    <div>

      {/* ── PAGE HERO ─────────────────────────────────────────── */}
      <div
        ref={heroRef}
        style={{
          borderBottom: '0.5px solid var(--border)',
          padding: '48px 24px 40px',
          maxWidth: '1200px',
          margin: '0 auto',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* GLOW */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: '-60px',
            right: '-40px',
            width: '400px',
            height: '300px',
            background:
              'radial-gradient(ellipse, rgba(245,158,11,0.06) 0%, transparent 68%)',
            pointerEvents: 'none',
          }}
        />

        {/* LABEL */}
        <div
          className="hero-animate"
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
            Contact
          </span>
        </div>

        {/* TITLE */}
        <h1
          className="hero-animate"
          style={{
            fontSize: 'clamp(32px, 5vw, 48px)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            color: 'var(--text-primary)',
            lineHeight: 1.0,
            marginBottom: '12px',
          }}
        >
          Let&apos;s build something{' '}
          <em
            style={{
              fontStyle: 'italic',
              fontWeight: 300,
              color: 'var(--text-muted)',
            }}
          >
            together.
          </em>
        </h1>

        {/* DESCRIPTION */}
        <p
          className="hero-animate"
          style={{
            fontSize: '14px',
            lineHeight: 1.75,
            color: 'var(--text-dim)',
            maxWidth: '520px',
            marginBottom: '20px',
          }}
        >
          Whether you&apos;re hiring, have a project in mind, or just want
          to connect —{' '}
          <strong style={{ color: 'var(--text-secondary)' }}>
            I&apos;d love to hear from you.
          </strong>{' '}
          I&apos;m currently open to full-time roles, NYSC PPA placements,
          and select freelance work.
        </p>

        {/* REASON PILLS */}
        <div
          className="hero-animate"
          style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}
        >
          {reasonPills.map((pill) => (
            <div
              key={pill.label}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 13px',
                borderRadius: '20px',
                fontSize: '12px',
                border: pill.active
                  ? '0.5px solid rgba(245,158,11,0.25)'
                  : '0.5px solid var(--border)',
                color: pill.active
                  ? 'var(--text-secondary)'
                  : 'var(--text-dim)',
                background: pill.active
                  ? 'rgba(245,158,11,0.06)'
                  : 'var(--bg-surface)',
              }}
            >
              <span
                style={{
                  width: '5px',
                  height: '5px',
                  borderRadius: '50%',
                  background: pill.active
                    ? 'var(--amber)'
                    : 'var(--border-hover)',
                  display: 'inline-block',
                  flexShrink: 0,
                }}
              />
              {pill.label}
            </div>
          ))}
        </div>
      </div>

      {/* ── MAIN LAYOUT ──────────────────────────────────────── */}
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '36px 24px 80px',
          display: 'grid',
          gridTemplateColumns: '1fr 360px',
          gap: '32px',
          alignItems: 'start',
        }}
        className="contact-page-grid"
      >

        {/* ── FORM ───────────────────────────────────────────── */}
        <div ref={formRef}>
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              color: 'var(--text-ghost)',
              letterSpacing: '0.04em',
              marginBottom: '6px',
            }}
          >
            Send me a message
          </p>
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              color: 'var(--text-whisper)',
              letterSpacing: '0.04em',
              marginBottom: '24px',
            }}
          >
            All fields marked * are required
          </p>

          {status === 'success' ? (
            <div
              style={{
                padding: '24px',
                background: 'rgba(34,197,94,0.06)',
                border: '0.5px solid rgba(34,197,94,0.2)',
                borderRadius: '10px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '24px', marginBottom: '10px' }}>✓</div>
              <p
                style={{
                  fontSize: '14px',
                  fontWeight: 700,
                  color: '#4ade80',
                  marginBottom: '4px',
                }}
              >
                Message sent!
              </p>
              <p style={{ fontSize: '12px', color: 'var(--text-ghost)' }}>
                I&apos;ll get back to you within 24 hours.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

              {/* NAME + EMAIL */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '16px',
                }}
                className="form-row"
              >
                {[
                  { key: 'name', label: 'Name *', type: 'text', placeholder: 'Your full name' },
                  { key: 'email', label: 'Email *', type: 'email', placeholder: 'your@email.com' },
                ].map((field) => (
                  <div key={field.key}>
                    <label
                      style={{
                        display: 'block',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '10px',
                        color: 'var(--text-ghost)',
                        letterSpacing: '0.07em',
                        textTransform: 'uppercase',
                        marginBottom: '6px',
                      }}
                    >
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      placeholder={field.placeholder}
                      value={formData[field.key as keyof typeof formData]}
                      onChange={(e) =>
                        setFormData({ ...formData, [field.key]: e.target.value })
                      }
                      style={{
                        width: '100%',
                        padding: '11px 14px',
                        background: 'var(--bg-surface)',
                        border: '0.5px solid var(--border)',
                        borderRadius: '8px',
                        fontSize: '13px',
                        color: 'var(--text-primary)',
                        fontFamily: 'var(--font-sans)',
                        outline: 'none',
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* COMPANY + SUBJECT */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '16px',
                }}
                className="form-row"
              >
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '10px',
                      color: 'var(--text-ghost)',
                      letterSpacing: '0.07em',
                      textTransform: 'uppercase',
                      marginBottom: '6px',
                    }}
                  >
                    Company
                  </label>
                  <input
                    type="text"
                    placeholder="Optional"
                    value={formData.company}
                    onChange={(e) =>
                      setFormData({ ...formData, company: e.target.value })
                    }
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      background: 'var(--bg-surface)',
                      border: '0.5px solid var(--border)',
                      borderRadius: '8px',
                      fontSize: '13px',
                      color: 'var(--text-primary)',
                      fontFamily: 'var(--font-sans)',
                      outline: 'none',
                    }}
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '10px',
                      color: 'var(--text-ghost)',
                      letterSpacing: '0.07em',
                      textTransform: 'uppercase',
                      marginBottom: '6px',
                    }}
                  >
                    Subject *
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      background: 'var(--bg-surface)',
                      border: '0.5px solid var(--border)',
                      borderRadius: '8px',
                      fontSize: '13px',
                      color: formData.subject
                        ? 'var(--text-primary)'
                        : 'var(--text-faint)',
                      fontFamily: 'var(--font-sans)',
                      outline: 'none',
                      cursor: 'pointer',
                      appearance: 'none',
                    }}
                  >
                    <option value="" disabled>
                      What&apos;s this about?
                    </option>
                    {subjectOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* MESSAGE */}
              <div>
                <label
                  style={{
                    display: 'block',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    color: 'var(--text-ghost)',
                    letterSpacing: '0.07em',
                    textTransform: 'uppercase',
                    marginBottom: '6px',
                  }}
                >
                  Message *
                </label>
                <textarea
                  rows={6}
                  placeholder="Tell me about the role, project, or whatever's on your mind. The more detail the better — I'll respond thoughtfully."
                  value={formData.message}
                  onChange={(e) => {
                    setFormData({ ...formData, message: e.target.value })
                    setCharCount(e.target.value.length)
                  }}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    background: 'var(--bg-surface)',
                    border: '0.5px solid var(--border)',
                    borderRadius: '8px',
                    fontSize: '13px',
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-sans)',
                    outline: 'none',
                    resize: 'none',
                    lineHeight: 1.6,
                  }}
                />
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    marginTop: '4px',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '9px',
                      color: 'var(--text-whisper)',
                    }}
                  >
                    {charCount} / 1000
                  </span>
                </div>
              </div>

              {/* SUBMIT */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '12px',
                }}
              >
                <p
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    color: 'var(--text-whisper)',
                  }}
                >
                  ✉ Powered by Resend · Goes straight to my inbox
                </p>
                <button
                  onClick={handleSubmit}
                  disabled={status === 'sending'}
                  className="btn-primary"
                  style={{
                    opacity: status === 'sending' ? 0.7 : 1,
                    cursor: status === 'sending' ? 'not-allowed' : 'pointer',
                  }}
                >
                  {status === 'sending' ? 'Sending...' : 'Send message →'}
                </button>
              </div>

            </div>
          )}

          {status === 'error' && (
            <div
                style={{
                padding: '12px 16px',
                background: 'rgba(239,68,68,0.06)',
                border: '0.5px solid rgba(239,68,68,0.2)',
                borderRadius: '8px',
                marginBottom: '16px',
                }}
            >
                <p style={{ fontSize: '13px', color: '#f87171' }}>
                Something went wrong. Please try again or email me directly.
                </p>
            </div>
         )}
        </div>

        {/* ── RIGHT SIDE ─────────────────────────────────────── */}
        <div
          ref={rightRef}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}
        >

          {/* AVAILABILITY CARD */}
          <div
            className="contact-card-item"
            style={{
              padding: '14px 16px',
              background: 'rgba(34,197,94,0.04)',
              border: '0.5px solid rgba(34,197,94,0.15)',
              borderRadius: '10px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '10px',
              }}
            >
              <span className="avail-dot" />
              <span
                style={{
                  fontSize: '13px',
                  fontWeight: 700,
                  color: 'var(--text-secondary)',
                }}
              >
                Currently available for
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
              }}
            >
              {[
                'Full-time frontend roles',
                'NYSC PPA placement',
                'Freelance / contract work',
                'Remote-first positions',
              ].map((item) => (
                <div
                  key={item}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '12px',
                    color: 'var(--text-dim)',
                  }}
                >
                  <span
                    style={{
                      color: '#4ade80',
                      fontSize: '11px',
                      fontWeight: 700,
                    }}
                  >
                    ✓
                  </span>
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* DIRECT CONTACTS */}
          {directContacts.map((contact) => (
            <a
              key={contact.id}
              href={contact.href}
              target={contact.href.startsWith('http') ? '_blank' : undefined}
              rel={
                contact.href.startsWith('http')
                  ? 'noopener noreferrer'
                  : undefined
              }
              className="contact-card-item"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '14px 16px',
                background: 'var(--bg-surface)',
                border: '0.5px solid var(--border)',
                borderRadius: '10px',
                textDecoration: 'none',
                transition: 'border-color var(--transition)',
              }}
            >
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: contact.colorBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  color: contact.color,
                  flexShrink: 0,
                }}
              >
                {contact.icon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '9px',
                    color: 'var(--text-ghost)',
                    letterSpacing: '0.07em',
                    textTransform: 'uppercase',
                    marginBottom: '2px',
                  }}
                >
                  {contact.label}
                </p>
                <p
                  style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: 'var(--text-secondary)',
                    marginBottom: '1px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {contact.value}
                </p>
                <p style={{ fontSize: '11px', color: 'var(--text-ghost)' }}>
                  {contact.sub}
                </p>
              </div>
              <span style={{ color: 'var(--text-whisper)' }}>→</span>
            </a>
          ))}

          {/* DIVIDER */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                flex: 1,
                height: '0.5px',
                background: 'var(--border)',
              }}
            />
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '9px',
                color: 'var(--text-whisper)',
                letterSpacing: '0.07em',
                textTransform: 'uppercase',
              }}
            >
              Find me on
            </span>
            <div
              style={{
                flex: 1,
                height: '0.5px',
                background: 'var(--border)',
              }}
            />
          </div>

          {/* SOCIALS */}
          <div
            className="contact-card-item"
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '8px',
            }}
          >
            {socialLinks.map((social) => (
              <a
                key={social.id}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 12px',
                  background: 'var(--bg-surface)',
                  border: '0.5px solid var(--border)',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  transition: 'border-color var(--transition)',
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
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    fontWeight: 700,
                    color: 'var(--text-ghost)',
                    flexShrink: 0,
                  }}
                >
                  {social.label.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p
                    style={{
                      fontSize: '11px',
                      fontWeight: 600,
                      color: 'var(--text-muted)',
                    }}
                  >
                    {social.label}
                  </p>
                  <p
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '9px',
                      color: 'var(--text-ghost)',
                    }}
                  >
                    {social.handle}
                  </p>
                </div>
              </a>
            ))}
          </div>

          {/* CV DOWNLOAD */}
          <a
            href={contactData.cvPath}
            download
            className="contact-card-item"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              padding: '14px 16px',
              background: 'rgba(245,158,11,0.03)',
              border: '0.5px solid rgba(245,158,11,0.12)',
              borderRadius: '10px',
              textDecoration: 'none',
              transition: 'border-color var(--transition)',
            }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'rgba(245,158,11,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                color: 'var(--amber)',
                flexShrink: 0,
              }}
            >
              ↓
            </div>
            <div>
              <p
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '9px',
                  color: 'var(--text-ghost)',
                  letterSpacing: '0.07em',
                  textTransform: 'uppercase',
                  marginBottom: '2px',
                }}
              >
                Resume
              </p>
              <p
                style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: 'var(--text-secondary)',
                  marginBottom: '1px',
                }}
              >
                Download CV — PDF
              </p>
              <p style={{ fontSize: '11px', color: 'var(--text-ghost)' }}>
                Last updated May 2026
              </p>
            </div>
          </a>

          {/* RESPONSE TIME */}
          <div
            className="contact-card-item"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 14px',
              background: 'var(--bg-surface)',
              border: '0.5px solid var(--border)',
              borderRadius: '8px',
            }}
          >
            <span style={{ fontSize: '16px' }}>⚡</span>
            <p style={{ fontSize: '12px', color: 'var(--text-dim)' }}>
              Typically replies within{' '}
              <strong
                style={{ color: 'var(--text-secondary)', fontWeight: 600 }}
              >
                24 hours
              </strong>
            </p>
          </div>

        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .contact-page-grid {
            grid-template-columns: 1fr !important;
          }
          .form-row {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

    </div>
  )
}