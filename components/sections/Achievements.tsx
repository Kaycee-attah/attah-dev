'use client'

import { useEffect, useRef, useState } from 'react'
import { useReveal } from '@/lib/useReveal'
import { achievements, achievementsData } from '@/lib/data/achievements'

// ─── COUNT UP HOOK ────────────────────────────────────────────
function useCountUp(target: number, duration: number, start: boolean) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!start) return

    const isDecimal = target % 1 !== 0
    const startTime = performance.now()

    const tick = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      // Ease out cubic — fast start, slow finish
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = eased * target
      setCount(isDecimal
        ? Math.round(current * 100) / 100
        : Math.floor(current)
      )
      if (progress < 1) requestAnimationFrame(tick)
      else setCount(target)
    }

    requestAnimationFrame(tick)
  }, [start, target, duration])

  return count
}

// ─── ACHIEVEMENT CARD ─────────────────────────────────────────
function AchievementCard({
  achievement,
  index,
  isVisible,
}: {
  achievement: typeof achievements[0]
  index: number
  isVisible: boolean
}) {
  const count = useCountUp(
    achievement.number,
    1800,
    isVisible
  )

  const isDecimal = achievement.number % 1 !== 0

  return (
    <div
      style={{
        background: 'var(--bg-surface)',
        border: '0.5px solid var(--border)',
        borderRadius: '12px',
        padding: '20px',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(16px)',
        transition: `opacity 0.5s ease ${index * 0.08}s, transform 0.5s ease ${index * 0.08}s`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* ACCENT LINE */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: achievement.color,
          opacity: 0.6,
        }}
      />

      {/* NUMBER */}
      <div
        style={{
          fontSize: 'clamp(28px, 3.5vw, 40px)',
          fontWeight: 800,
          letterSpacing: '-0.03em',
          color: 'var(--text-primary)',
          lineHeight: 1,
          marginBottom: '6px',
        }}
      >
        {isDecimal ? count.toFixed(2) : count}
        <span
          style={{
            fontSize: 'clamp(16px, 2vw, 22px)',
            color: achievement.color,
            marginLeft: '2px',
          }}
        >
          {achievement.unit}
        </span>
      </div>

      {/* LABEL */}
      <p
        style={{
          fontSize: '13px',
          fontWeight: 600,
          color: 'var(--text-secondary)',
          marginBottom: '4px',
          lineHeight: 1.3,
        }}
      >
        {achievement.label}
      </p>

      {/* SUB */}
      <p
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '10px',
          color: 'var(--text-ghost)',
          lineHeight: 1.4,
        }}
      >
        {achievement.sub}
      </p>

    </div>
  )
}

// ─── ACHIEVEMENTS COMPONENT ───────────────────────────────────
export default function Achievements() {
  const sectionRef = useReveal()
  const gridRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = gridRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
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
          {achievementsData.title}{' '}
          <em
            style={{
              fontStyle: 'italic',
              fontWeight: 300,
              color: 'var(--text-muted)',
            }}
          >
            {achievementsData.titleEm}
          </em>
        </h2>
      </div>

      {/* ── GRID ─────────────────────────────────────────────── */}
      <div
        ref={gridRef}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '12px',
        }}
        className="achievements-grid"
      >
        {achievements.map((achievement, index) => (
          <AchievementCard
            key={achievement.id}
            achievement={achievement}
            index={index}
            isVisible={isVisible}
          />
        ))}
      </div>

    </section>
  )
}