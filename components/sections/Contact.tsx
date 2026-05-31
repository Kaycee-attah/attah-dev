'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useReveal } from '@/lib/useReveal'
import {
  contactData,
  reasonPills,
  subjectOptions,
  directContacts,
  socialLinks,
} from '@/lib/data/contact'

export default function Contact() {
  const ref = useReveal()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: '',
  })
  const [status, setStatus] = useState<
    'idle' | 'sending' | 'success' | 'error'
  >('idle')
  const [charCount, setCharCount] = useState(0)

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.message) return
    setStatus('sending')

    // We'll wire up Resend in the API route later
    // For now simulate a successful send
    setTimeout(() => {
      setStatus('success')
      setFormData({ name: '', email: '', company: '', subject: '', message: '' })
      setCharCount(0)
    }, 1200)
  }

  return (
    <section
      ref={ref}
      className="reveal"
      style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '80px 24px',
      }}
    >

      {/* ── HEADER ───────────────────────────────────────────── */}
      <div style={{ marginBottom: '40px' }}>
        <h2
          style={{
            fontSize: 'clamp(28px, 4vw, 36px)',
            fontWeight: 800,
            letterSpacing: '-0.025em',
            color: 'var(--text-primary)',
            lineHeight: 1.1,
            marginBottom: '12px',
          }}
        >
          {contactData.title}{' '}
          <em
            style={{
              fontStyle: 'italic',
              fontWeight: 300,
              color: 'var(--text-muted)',
            }}
          >
            {contactData.titleEm}
          </em>
        </h2>

        <p
          style={{
            fontSize: '14px',
            lineHeight: 1.75,
            color: 'var(--text-dim)',
            maxWidth: '520px',
            marginBottom: '20px',
          }}
        >
          {contactData.description}
        </p>

        {/* REASON PILLS */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
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
          display: 'grid',
          gridTemplateColumns: '1fr 320px',
          gap: '32px',
          alignItems: 'start',
        }}
        className="contact-grid"
      >

        {/* ── FORM ─────────────────────────────────────────── */}
        <div>
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              color: 'var(--text-ghost)',
              letterSpacing: '0.06em',
              marginBottom: '20px',
            }}
          >
            All fields marked * are required
          </p>

          {/* SUCCESS STATE */}
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
              <div
                style={{
                  fontSize: '24px',
                  marginBottom: '10px',
                }}
              >
                ✓
              </div>
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
              <p
                style={{
                  fontSize: '12px',
                  color: 'var(--text-ghost)',
                }}
              >
                I&apos;ll get back to you within 24 hours.
              </p>
            </div>
          ) : (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
              }}
            >

              {/* NAME + EMAIL */}
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
                    Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Your full name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
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
                      transition: 'border-color var(--transition)',
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
                    Email *
                  </label>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
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
                      transition: 'border-color var(--transition)',
                    }}
                  />
                </div>
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
                      transition: 'border-color var(--transition)',
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
                  rows={5}
                  placeholder="Tell me about the role, project, or whatever's on your mind."
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
                    transition: 'border-color var(--transition)',
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

              {/* SUBMIT ROW */}
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
                    cursor:
                      status === 'sending' ? 'not-allowed' : 'pointer',
                  }}
                >
                  {status === 'sending' ? 'Sending...' : 'Send message →'}
                </button>
              </div>

            </div>
          )}
        </div>
        {/* ── END FORM ─────────────────────────────────────── */}

        {/* ── RIGHT SIDE ───────────────────────────────────── */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}
        >

          {/* DIRECT CONTACTS */}
          {directContacts.map((contact) => (
            <a
              key={contact.id}
              href={contact.href}
              target={contact.href.startsWith('http') ? '_blank' : undefined}
              rel={contact.href.startsWith('http') ? 'noopener noreferrer' : undefined}
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
                <p
                  style={{
                    fontSize: '11px',
                    color: 'var(--text-ghost)',
                  }}
                >
                  {contact.sub}
                </p>
              </div>
              <span style={{ color: 'var(--text-whisper)' }}>→</span>
            </a>
          ))}

          {/* DIVIDER */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <div
              style={{ flex: 1, height: '0.5px', background: 'var(--border)' }}
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
              style={{ flex: 1, height: '0.5px', background: 'var(--border)' }}
            />
          </div>

          {/* SOCIALS */}
          <div
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
              <p
                style={{
                  fontSize: '11px',
                  color: 'var(--text-ghost)',
                }}
              >
                Last updated May 2026
              </p>
            </div>
          </a>

          {/* RESPONSE TIME */}
          <div
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
            <p
              style={{
                fontSize: '12px',
                color: 'var(--text-dim)',
              }}
            >
              Typically replies within{' '}
              <strong
                style={{
                  color: 'var(--text-secondary)',
                  fontWeight: 600,
                }}
              >
                24 hours
              </strong>
            </p>
          </div>

        </div>
        {/* ── END RIGHT SIDE ───────────────────────────────── */}

      </div>
      {/* ── END MAIN LAYOUT ──────────────────────────────────── */}

    </section>
  )
}