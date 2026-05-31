'use client'

import { useReveal } from '@/lib/useReveal'
import { skillGroups, skillsData } from '@/lib/data/skills'

export default function Skills() {
  const ref = useReveal()

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

      {/* ── HEADING ──────────────────────────────────────────── */}
      <div style={{ marginBottom: '40px' }}>
        <h2
          style={{
            fontSize: 'clamp(28px, 4vw, 36px)',
            fontWeight: 800,
            letterSpacing: '-0.025em',
            color: 'var(--text-primary)',
            lineHeight: 1.1,
          }}
        >
          {skillsData.title}{' '}
          <em
            style={{
              fontStyle: 'italic',
              fontWeight: 300,
              color: 'var(--text-muted)',
            }}
          >
            {skillsData.titleEm}
          </em>
        </h2>
      </div>

      {/* ── BENTO GRID ───────────────────────────────────────── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '12px',
        }}
        className="skills-grid"
      >
        {skillGroups.map((group, groupIndex) => (
          <div
            key={group.id}
            style={{
              background: 'var(--bg-surface)',
              border: '0.5px solid var(--border)',
              borderRadius: '12px',
              overflow: 'hidden',
              // First group spans 2 columns — featured
              gridColumn: groupIndex === 0 ? 'span 2' : 'span 1',
            }}
            className={groupIndex === 0 ? 'skills-featured' : ''}
          >

            {/* CARD HEADER */}
            <div
              style={{
                padding: '14px 16px 10px',
                borderBottom: '0.5px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: group.color,
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  color: 'var(--text-ghost)',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                }}
              >
                {group.label}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  color: 'var(--text-whisper)',
                  marginLeft: 'auto',
                }}
              >
                {group.skills.length} skills
              </span>
            </div>

            {/* SKILLS LIST */}
            <div style={{ padding: '14px 16px' }}>
              {group.skills.map((skill) => (
                <div
                  key={skill.name}
                  style={{ marginBottom: '10px' }}
                >
                  {/* SKILL NAME + LEVEL */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '5px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '12px',
                        color: 'var(--text-secondary)',
                        fontWeight: 500,
                      }}
                    >
                      {skill.name}
                    </span>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '10px',
                        color: 'var(--text-whisper)',
                      }}
                    >
                      {skill.level}%
                    </span>
                  </div>

                  {/* PROGRESS BAR */}
                  <div
                    style={{
                      height: '3px',
                      background: 'var(--border)',
                      borderRadius: '2px',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        width: `${skill.level}%`,
                        background: group.color,
                        borderRadius: '2px',
                        opacity: 0.7,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

          </div>
        ))}
      </div>

    </section>
  )
}