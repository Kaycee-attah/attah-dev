'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { experiencePageData } from '@/lib/data/experience'

gsap.registerPlugin(ScrollTrigger)

interface ExperienceEntry {
  id: string
  role: string
  company: string
  location: string
  period: string
  status: 'current' | 'completed' | 'hardware'
  status_label: string
  bullets: string[]
  stack: string[]
  stack_lit: boolean
  sort_order: number
}

interface EducationEntry {
  id: string
  degree: string
  school: string
  period: string
  status: string
  gpa: string
  gpa_max: string
  tags: string[]
}

const STATUS_STYLES: Record<string, { bg: string; border: string; color: string }> = {
  current: {
    bg: 'rgba(34,197,94,0.1)',
    border: 'rgba(34,197,94,0.25)',
    color: '#4ade80',
  },
  completed: {
    bg: 'rgba(245,158,11,0.08)',
    border: 'rgba(245,158,11,0.2)',
    color: '#f59e0b',
  },
  hardware: {
    bg: 'rgba(168,85,247,0.08)',
    border: 'rgba(168,85,247,0.2)',
    color: '#c084fc',
  },
}

export default function ExperiencePage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [experiences, setExperiences] = useState<ExperienceEntry[]>([])
  const [education, setEducation] = useState<EducationEntry | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/experience')
      .then((r) => r.json())
      .then((data) => {
        setExperiences(data.experiences || [])
        setEducation(data.education || null)
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    const el = containerRef.current
    if (!el || loading) return

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.exp-entry').forEach((entry) => {
        gsap.fromTo(
          entry,
          { opacity: 0, x: 32 },
          {
            opacity: 1,
            x: 0,
            duration: 0.6,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: entry,
              start: 'top 88%',
              end: 'bottom 20%',
              toggleActions: 'play reverse play reverse',
            },
          }
        )
      })

      gsap.fromTo(
        '.timeline-line',
        { scaleY: 0, transformOrigin: 'top center' },
        {
          scaleY: 1,
          duration: 1.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.timeline-wrapper',
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play reverse play reverse',
          },
        }
      )

      gsap.fromTo(
        '.edu-section',
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.edu-section',
            start: 'top 88%',
            toggleActions: 'play reverse play reverse',
          },
        }
      )
    }, el)

    return () => ctx.revert()
  }, [loading])

  return (
    <div
      ref={containerRef}
      style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}
    >
      {/* ── PAGE HEADER ───────────────────────────────────────── */}
      <div style={{ padding: '52px 0 44px', borderBottom: '0.5px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <span style={{ width: '32px', height: '1px', background: 'var(--amber)', display: 'inline-block' }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--amber)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Experience
          </span>
        </div>
        <h1 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text-primary)', lineHeight: 1.0 }}>
          {experiencePageData.title}{' '}
          <em style={{ fontStyle: 'italic', fontWeight: 300, color: 'var(--text-muted)' }}>
            {experiencePageData.titleEm}
          </em>
        </h1>
      </div>

      {/* ── TIMELINE ─────────────────────────────────────────── */}
      <div className="timeline-wrapper" style={{ padding: '48px 0', position: 'relative' }}>

        {loading ? (
          <div style={{ padding: '48px', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-ghost)' }}>
            Loading...
          </div>
        ) : (
          <>
            {/* VERTICAL LINE */}
            <div
              className="timeline-line"
              style={{
                position: 'absolute',
                left: '19px',
                top: '48px',
                bottom: '48px',
                width: '1px',
                background: 'linear-gradient(to bottom, var(--amber) 0%, var(--border) 40%, var(--border) 100%)',
              }}
            />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {experiences.map((exp) => {
                const statusStyle = STATUS_STYLES[exp.status] || STATUS_STYLES.completed

                return (
                  <div
                    key={exp.id}
                    className="exp-entry"
                    style={{ display: 'grid', gridTemplateColumns: '40px 1fr', gap: '24px', paddingBottom: '28px', position: 'relative' }}
                  >
                    {/* NODE */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '4px', position: 'relative', zIndex: 1 }}>
                      <div
                        style={{
                          width: '14px',
                          height: '14px',
                          borderRadius: '50%',
                          border: `2px solid ${exp.status === 'current' ? 'var(--amber)' : exp.status === 'hardware' ? '#a855f7' : 'var(--border-hover)'}`,
                          background: exp.status === 'current' ? 'var(--amber)' : 'var(--bg-base)',
                          flexShrink: 0,
                        }}
                      />
                    </div>

                    {/* CARD */}
                    <div style={{ background: 'var(--bg-surface)', border: '0.5px solid var(--border)', borderRadius: '12px', overflow: 'hidden', transition: 'border-color var(--transition)' }}>
                      {/* CARD HEADER */}
                      <div style={{ padding: '18px 20px 16px', borderBottom: '0.5px solid var(--border)', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
                        <div>
                          <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '3px', letterSpacing: '-0.01em' }}>
                            {exp.role}
                          </div>
                          <div style={{ fontSize: '13px', color: 'var(--amber)', fontWeight: 600, marginBottom: '2px' }}>
                            {exp.company}
                          </div>
                          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-ghost)' }}>
                            {exp.location}
                          </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px', flexShrink: 0 }}>
                          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-ghost)', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>
                            {exp.period}
                          </div>
                          <div
                            style={{
                              padding: '3px 10px',
                              borderRadius: '10px',
                              fontFamily: 'var(--font-mono)',
                              fontSize: '9px',
                              letterSpacing: '0.05em',
                              textTransform: 'uppercase',
                              whiteSpace: 'nowrap',
                              background: statusStyle.bg,
                              border: `0.5px solid ${statusStyle.border}`,
                              color: statusStyle.color,
                            }}
                          >
                            {exp.status_label}
                          </div>
                        </div>
                      </div>

                      {/* CARD BODY */}
                      <div style={{ padding: '16px 20px 18px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                          {exp.bullets.map((bullet, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '12px', lineHeight: 1.65, color: 'var(--text-dim)' }}>
                              <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--amber)', flexShrink: 0, marginTop: '6px', opacity: 0.5 }} />
                              <span dangerouslySetInnerHTML={{ __html: bullet }} />
                            </div>
                          ))}
                        </div>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                          {exp.stack.map((tag) => (
                            <span
                              key={tag}
                              style={{
                                padding: '3px 9px',
                                border: exp.stack_lit ? '0.5px solid rgba(245,158,11,0.2)' : '0.5px solid var(--border)',
                                borderRadius: '3px',
                                fontFamily: 'var(--font-mono)',
                                fontSize: '10px',
                                color: exp.stack_lit ? 'rgba(245,158,11,0.7)' : 'var(--text-ghost)',
                                background: 'var(--bg-elevated)',
                              }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}

              {/* ── EDUCATION DIVIDER ──────────────────────────── */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '8px 0 20px' }}>
                <div style={{ flex: 1, height: '0.5px', background: 'var(--border)' }} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-whisper)', letterSpacing: '0.07em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                  Education
                </span>
                <div style={{ flex: 1, height: '0.5px', background: 'var(--border)' }} />
              </div>

              {/* ── EDUCATION ENTRY ───────────────────────────── */}
              {education && (
                <div className="edu-section" style={{ display: 'grid', gridTemplateColumns: '40px 1fr', gap: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', paddingTop: '4px', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
                    <div style={{ width: '14px', height: '14px', borderRadius: '50%', border: '2px solid #6366f1', background: 'var(--bg-base)', flexShrink: 0 }} />
                  </div>

                  <div style={{ background: 'var(--bg-surface)', border: '0.5px solid var(--border)', borderRadius: '12px', padding: '18px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
                    <div>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '3px 10px', background: 'rgba(245,158,11,0.08)', border: '0.5px solid rgba(245,158,11,0.2)', borderRadius: '10px', fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--amber)', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '8px' }}>
                        🎓 {education.status}
                      </div>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '2px' }}>
                        {education.degree}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-dim)', marginBottom: '10px' }}>
                        {education.school} &nbsp;·&nbsp; {education.period}
                      </div>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {education.tags.map((tag) => (
                          <span key={tag} style={{ padding: '2px 8px', border: '0.5px solid var(--border)', borderRadius: '3px', fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--text-ghost)' }}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontSize: '32px', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)', lineHeight: 1 }}>
                        {education.gpa}
                        <span style={{ fontSize: '16px', color: 'var(--amber)' }}>/{education.gpa_max}</span>
                      </div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--text-ghost)', letterSpacing: '0.05em', marginTop: '2px' }}>
                        CGPA
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}