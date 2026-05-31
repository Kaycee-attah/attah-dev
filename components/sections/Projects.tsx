'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useFadeUp } from '@/lib/useGSAP'
import { featuredProjects } from '@/lib/data/projects'

// ─── TAB TYPES ────────────────────────────────────────────────
type TabId = 'overview' | 'code' | 'challenges' | 'outcome'

const tabs: { id: TabId; label: string }[] = [
  { id: 'overview',   label: 'Overview'   },
  { id: 'code',       label: 'Code'       },
  { id: 'challenges', label: 'Challenges' },
  { id: 'outcome',    label: 'Outcome'    },
]

// ─── PROJECTS COMPONENT ───────────────────────────────────────
export default function Projects() {
  const ref = useFadeUp({ y: 32, duration: 1.1 })
  const [activeProject, setActiveProject] = useState(0)
  const [activeTab, setActiveTab] = useState<TabId>('overview')

  const project = featuredProjects[activeProject]

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
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          marginBottom: '32px',
        }}
      >
        <div>
          
          <h2
            style={{
              fontSize: 'clamp(28px, 4vw, 36px)',
              fontWeight: 800,
              letterSpacing: '-0.025em',
              color: 'var(--text-primary)',
              lineHeight: 1.1,
            }}
          >
            Projects that{' '}
            <em
              style={{
                fontStyle: 'italic',
                fontWeight: 300,
                color: 'var(--text-muted)',
              }}
            >
              shipped.
            </em>
          </h2>
        </div>

        {/* VIEW ALL LINK */}
        <Link
          href="/projects"
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
          View all 13 projects →
        </Link>
      </div>

      {/* ── MAIN PANEL ───────────────────────────────────────── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '240px 1fr',
          border: '0.5px solid var(--border)',
          borderRadius: '12px',
          overflow: 'hidden',
        }}
        className="projects-panel"
      >

        {/* ── LEFT — project list ──────────────────────────── */}
        <div
          style={{
            background: 'var(--bg-surface)',
            borderRight: '0.5px solid var(--border)',
          }}
        >
          {featuredProjects.map((proj, index) => (
            <button
              key={proj.id}
              onClick={() => {
                setActiveProject(index)
                setActiveTab('overview')
              }}
              style={{
                width: '100%',
                padding: '20px',
                textAlign: 'left',
                background: activeProject === index
                  ? 'var(--bg-base)'
                  : 'transparent',
                border: 'none',
                borderBottom: '0.5px solid var(--border)',
                borderLeft: activeProject === index
                  ? '2px solid var(--amber)'
                  : '2px solid transparent',
                cursor: 'pointer',
                transition: 'background var(--transition)',
              }}
            >
              {/* PROJECT NUMBER */}
              <p
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  color: 'var(--text-whisper)',
                  marginBottom: '6px',
                  letterSpacing: '0.04em',
                }}
              >
                {proj.number}
              </p>

              {/* PROJECT NAME */}
              <p
                style={{
                  fontSize: '13px',
                  fontWeight: 700,
                  color: activeProject === index
                    ? 'var(--text-primary)'
                    : 'var(--text-dim)',
                  marginBottom: '4px',
                  lineHeight: 1.3,
                }}
              >
                {proj.name}
              </p>

              {/* PROJECT TYPE */}
              <p
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  color: activeProject === index
                    ? 'var(--amber)'
                    : 'var(--text-whisper)',
                  marginBottom: '8px',
                }}
              >
                {proj.type}
              </p>

              {/* STACK TAGS */}
              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                {proj.stack.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      padding: '2px 7px',
                      background: 'var(--bg-elevated)',
                      border: '0.5px solid var(--border-subtle)',
                      borderRadius: '3px',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '9px',
                      color: activeProject === index
                        ? 'var(--text-ghost)'
                        : 'var(--text-whisper)',
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>
        {/* ── END LEFT ─────────────────────────────────────── */}

        {/* ── RIGHT — tabs + content ───────────────────────── */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            background: 'var(--bg-base)',
          }}
        >

          {/* TABS */}
          <div
            style={{
              display: 'flex',
              borderBottom: '0.5px solid var(--border)',
              background: 'var(--bg-surface)',
            }}
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '14px 20px',
                  fontSize: '12px',
                  fontWeight: 500,
                  color: activeTab === tab.id
                    ? 'var(--text-primary)'
                    : 'var(--text-ghost)',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: activeTab === tab.id
                    ? '2px solid var(--amber)'
                    : '2px solid transparent',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-sans)',
                  transition: 'color var(--transition)',
                  whiteSpace: 'nowrap',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* CONTENT AREA */}
          <div style={{ padding: '24px', flex: 1 }}>

            {/* ── OVERVIEW TAB ─────────────────────────────── */}
            {activeTab === 'overview' && (
              <div>
                {/* HEADER */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    marginBottom: '16px',
                    gap: '16px',
                  }}
                >
                  <div>
                    <h3
                      style={{
                        fontSize: '20px',
                        fontWeight: 800,
                        color: 'var(--text-primary)',
                        letterSpacing: '-0.01em',
                        marginBottom: '4px',
                      }}
                    >
                      {project.overview.title}
                    </h3>
                    <p
                      style={{
                        fontSize: '12px',
                        color: 'var(--text-dim)',
                        fontFamily: 'var(--font-mono)',
                      }}
                    >
                      {project.overview.subtitle}
                    </p>
                  </div>

                  {/* LINKS */}
                  <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                    {project.liveUrl !== '#' && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary"
                        style={{ fontSize: '11px', padding: '7px 14px' }}
                      >
                        ↗ Live Demo
                      </a>
                    )}
                    {project.githubUrl !== '#' && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-secondary"
                        style={{ fontSize: '11px', padding: '7px 14px' }}
                      >
                        GitHub
                      </a>
                    )}
                  </div>
                </div>

                {/* DESCRIPTION */}
                <p
                  style={{
                    fontSize: '13px',
                    lineHeight: 1.8,
                    color: 'var(--text-dim)',
                    marginBottom: '16px',
                    maxWidth: '560px',
                  }}
                >
                  {project.overview.description}
                </p>

                {/* METRICS */}
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {project.overview.metrics.map((metric) => (
                    <div
                      key={metric.label}
                      style={{
                        padding: '10px 14px',
                        background: 'var(--bg-surface)',
                        border: '0.5px solid var(--border)',
                        borderRadius: '8px',
                        textAlign: 'center',
                        minWidth: '80px',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '18px',
                          fontWeight: 800,
                          color: 'var(--text-primary)',
                          lineHeight: 1,
                          marginBottom: '4px',
                          letterSpacing: '-0.02em',
                        }}
                      >
                        {metric.value}
                        <span style={{ fontSize: '12px', color: 'var(--amber)' }}>
                          {metric.unit}
                        </span>
                      </div>
                      <div
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '9px',
                          color: 'var(--text-ghost)',
                          letterSpacing: '0.05em',
                        }}
                      >
                        {metric.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── CODE TAB ─────────────────────────────────── */}
            {activeTab === 'code' && (
              <div
                style={{
                  background: 'var(--bg-surface)',
                  border: '0.5px solid var(--border)',
                  borderRadius: '8px',
                  overflow: 'hidden',
                }}
              >
                {/* CODE BAR */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '9px 14px',
                    background: 'var(--bg-elevated)',
                    borderBottom: '0.5px solid var(--border)',
                  }}
                >
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444', opacity: 0.7, display: 'inline-block' }} />
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#f59e0b', opacity: 0.7, display: 'inline-block' }} />
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', opacity: 0.7, display: 'inline-block' }} />
                  <span
                    style={{
                      marginLeft: 'auto',
                      marginRight: 'auto',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '10px',
                      color: 'var(--text-ghost)',
                    }}
                  >
                    {project.code.filename}
                  </span>
                </div>

                {/* CODE BODY */}
                <div
                  style={{
                    padding: '16px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    lineHeight: 1.85,
                    overflowX: 'auto',
                  }}
                >
                  {project.code.lines.map((line, lineIndex) => (
                    <div key={lineIndex} style={{ minHeight: '1.85em' }}>
                      {line.tokens.map((token, tokenIndex) => (
                        <span
                          key={tokenIndex}
                          style={{ color: token.color }}
                        >
                          {token.text}
                        </span>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── CHALLENGES TAB ───────────────────────────── */}
            {activeTab === 'challenges' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

                {/* PROBLEM */}
                <div
                  style={{
                    padding: '16px',
                    background: 'var(--bg-surface)',
                    border: '0.5px solid var(--border)',
                    borderLeft: '2px solid #ef4444',
                    borderRadius: '0 8px 8px 0',
                  }}
                >
                  <p
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '10px',
                      color: '#f87171',
                      letterSpacing: '0.07em',
                      textTransform: 'uppercase',
                      marginBottom: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <span
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: '#ef4444',
                        display: 'inline-block',
                      }}
                    />
                    {project.challenges.problem.title}
                  </p>
                  <p
                    style={{
                      fontSize: '13px',
                      lineHeight: 1.75,
                      color: 'var(--text-dim)',
                    }}
                  >
                    {project.challenges.problem.text}
                  </p>
                </div>

                {/* SOLUTION */}
                <div
                  style={{
                    padding: '16px',
                    background: 'var(--bg-surface)',
                    border: '0.5px solid var(--border)',
                    borderLeft: '2px solid var(--green)',
                    borderRadius: '0 8px 8px 0',
                  }}
                >
                  <p
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '10px',
                      color: 'var(--green-text)',
                      letterSpacing: '0.07em',
                      textTransform: 'uppercase',
                      marginBottom: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <span
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: 'var(--green)',
                        display: 'inline-block',
                      }}
                    />
                    {project.challenges.solution.title}
                  </p>
                  <p
                    style={{
                      fontSize: '13px',
                      lineHeight: 1.75,
                      color: 'var(--text-dim)',
                    }}
                  >
                    {project.challenges.solution.text}
                  </p>
                </div>

              </div>
            )}

            {/* ── OUTCOME TAB ──────────────────────────────── */}
            {activeTab === 'outcome' && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '10px',
                }}
              >
                {project.outcome.map((item) => (
                  <div
                    key={item.label}
                    style={{
                      padding: '14px',
                      background: 'var(--bg-surface)',
                      border: '0.5px solid var(--border)',
                      borderRadius: '8px',
                    }}
                  >
                    <p
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '9px',
                        color: 'var(--text-ghost)',
                        letterSpacing: '0.07em',
                        textTransform: 'uppercase',
                        marginBottom: '6px',
                      }}
                    >
                      {item.label}
                    </p>
                    <p
                      style={{
                        fontSize: '12px',
                        lineHeight: 1.65,
                        color: 'var(--text-dim)',
                      }}
                    >
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            )}

          </div>
          {/* ── END CONTENT AREA ─────────────────────────── */}

        </div>
        {/* ── END RIGHT ────────────────────────────────────── */}

      </div>
      {/* ── END MAIN PANEL ───────────────────────────────────── */}

    </section>
  )
}