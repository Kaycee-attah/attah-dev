'use client'

import { useState } from 'react'
import Link from 'next/link'
import { allProjects, projectFilters } from '@/lib/data/projects'
import { useStaggerAnimation } from '@/lib/useGSAP'

export default function ProjectsPage() {
  const [activeFilter, setActiveFilter] = useState('All')

  const filtered = activeFilter === 'All'
    ? allProjects
    : allProjects.filter((p) => p.category === activeFilter)

  const gridRef = useStaggerAnimation(
    '.project-card',
    { opacity: 0, y: 24 },
    { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', stagger: 0.07 },
    { start: 'top 90%' }
  )

  return (
    <div
      style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '60px 24px 80px',
      }}
    >

      {/* ── HEADER ─────────────────────────────────────────── */}
      <div style={{ marginBottom: '40px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '8px',
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
            Projects
          </span>
        </div>

        <h1
          style={{
            fontSize: 'clamp(32px, 5vw, 52px)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            color: 'var(--text-primary)',
            lineHeight: 1.0,
            marginBottom: '16px',
          }}
        >
          Things I&apos;ve{' '}
          <em
            style={{
              fontStyle: 'italic',
              fontWeight: 300,
              color: 'var(--text-muted)',
            }}
          >
            shipped.
          </em>
        </h1>

        <p
          style={{
            fontSize: '15px',
            lineHeight: 1.75,
            color: 'var(--text-dim)',
            maxWidth: '520px',
          }}
        >
          13 projects across frontend, backend, IoT, and everything in
          between. From 3D furniture configurators to demographic
          intelligence APIs.
        </p>
      </div>

      {/* ── FILTERS ────────────────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          flexWrap: 'wrap',
          marginBottom: '32px',
        }}
      >
        {projectFilters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            style={{
              padding: '7px 16px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: 500,
              fontFamily: 'var(--font-sans)',
              border: activeFilter === filter
                ? 'none'
                : '0.5px solid var(--border)',
              background: activeFilter === filter
                ? 'var(--amber)'
                : 'var(--bg-surface)',
              color: activeFilter === filter
                ? 'var(--bg-base)'
                : 'var(--text-dim)',
              cursor: 'pointer',
              transition: 'all var(--transition)',
            }}
          >
            {filter}
          </button>
        ))}

        <span
          style={{
            marginLeft: 'auto',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: 'var(--text-ghost)',
            alignSelf: 'center',
          }}
        >
          {filtered.length} project{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* ── PROJECTS GRID ──────────────────────────────────── */}
      <div
        ref={gridRef}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '12px',
        }}
        className="projects-page-grid"
      >
        {filtered.map((project) => (
          <div
            key={project.id}
            className="project-card"
            style={{
              background: 'var(--bg-surface)',
              border: `0.5px solid ${project.featured ? 'var(--border-hover)' : 'var(--border)'}`,
              borderRadius: '12px',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              transition: 'border-color var(--transition), transform 0.15s ease',
            }}
          >

            {/* CARD HEADER */}
            <div
              style={{
                padding: '16px 16px 12px',
                borderBottom: '0.5px solid var(--border)',
                background: project.featured
                  ? 'var(--bg-elevated)'
                  : 'var(--bg-surface)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  marginBottom: '8px',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    color: 'var(--text-whisper)',
                  }}
                >
                  {project.number}
                </span>
                {project.featured && (
                  <span
                    style={{
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '9px',
                      background: 'rgba(245,158,11,0.1)',
                      border: '0.5px solid rgba(245,158,11,0.2)',
                      color: 'var(--amber)',
                    }}
                  >
                    Featured
                  </span>
                )}
              </div>

              <h3
                style={{
                  fontSize: '14px',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  letterSpacing: '-0.01em',
                  marginBottom: '4px',
                  lineHeight: 1.3,
                }}
              >
                {project.name}
              </h3>

              <p
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  color: 'var(--amber)',
                }}
              >
                {project.type}
              </p>
            </div>

            {/* CARD BODY */}
            <div
              style={{
                padding: '14px 16px',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <p
                style={{
                  fontSize: '12px',
                  lineHeight: 1.65,
                  color: 'var(--text-dim)',
                  marginBottom: '12px',
                  flex: 1,
                }}
              >
                {project.description}
              </p>

              {/* METRICS */}
              {project.metrics.length > 0 && (
                <div
                  style={{
                    display: 'flex',
                    gap: '8px',
                    flexWrap: 'wrap',
                    marginBottom: '12px',
                  }}
                >
                  {project.metrics.map((metric) => (
                    <div
                      key={metric.label}
                      style={{
                        padding: '4px 10px',
                        background: 'var(--bg-elevated)',
                        border: '0.5px solid var(--border)',
                        borderRadius: '6px',
                        textAlign: 'center',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '13px',
                          fontWeight: 700,
                          color: 'var(--text-primary)',
                          lineHeight: 1,
                          marginBottom: '2px',
                        }}
                      >
                        {metric.value}
                      </div>
                      <div
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '9px',
                          color: 'var(--text-ghost)',
                        }}
                      >
                        {metric.label}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* STACK TAGS */}
              <div
                style={{
                  display: 'flex',
                  gap: '5px',
                  flexWrap: 'wrap',
                  marginBottom: '14px',
                }}
              >
                {project.stack.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      padding: '3px 8px',
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

              {/* LINKS */}
              <div
                style={{
                  display: 'flex',
                  gap: '8px',
                  marginTop: 'auto',
                }}
              >
                {project.liveUrl !== '#' && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary"
                    style={{
                      fontSize: '11px',
                      padding: '7px 14px',
                    }}
                  >
                    ↗ Live
                  </a>
                )}
                {project.githubUrl !== '#' && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary"
                    style={{
                      fontSize: '11px',
                      padding: '7px 14px',
                    }}
                  >
                    GitHub
                  </a>
                )}
                {project.liveUrl === '#' && project.githubUrl === '#' && (
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '10px',
                      color: 'var(--text-whisper)',
                      alignSelf: 'center',
                    }}
                  >
                    Private / Company project
                  </span>
                )}
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* RESPONSIVE GRID CSS */}
      <style>{`
        @media (max-width: 768px) {
          .projects-page-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (min-width: 769px) and (max-width: 1024px) {
          .projects-page-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>

    </div>
  )
}