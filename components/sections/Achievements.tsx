'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useFadeUp } from '@/lib/useGSAP'
import { achievements, achievementsData } from '@/lib/data/achievements'

gsap.registerPlugin(ScrollTrigger)

// ─── COUNT UP HOOK ────────────────────────────────────────────
function useCountUp(target: number, duration: number, start: boolean) {
  const [count, setCount] = useState(0)
  const frameRef = useRef<number>(0)

  useEffect(() => {
    if (!start) {
      setCount(0)
      return
    }

    const isDecimal = target % 1 !== 0
    const startTime = performance.now()

    const tick = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = eased * target
      setCount(
        isDecimal
          ? Math.round(current * 100) / 100
          : Math.floor(current)
      )
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick)
      } else {
        setCount(target)
      }
    }

    frameRef.current = requestAnimationFrame(tick)
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
    }
  }, [start, target, duration])

  return count
}

// ─── ACHIEVEMENT CARD ─────────────────────────────────────────
function AchievementCard({
  achievement,
  isVisible,
}: {
  achievement: typeof achievements[0]
  isVisible: boolean
}) {
  const count = useCountUp(achievement.number, 1800, isVisible)
  const isDecimal = achievement.number % 1 !== 0

  return (
    <div
      className="achievement-card"
      style={{
        background: 'var(--bg-surface)',
        border: '0.5px solid var(--border)',
        borderRadius: '12px',
        padding: '20px',
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
  const sectionRef = useFadeUp({ y: 32, duration: 0.7 })
  const gridRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = gridRef.current
    if (!el) return

    const ctx = gsap.context(() => {
      // Stagger cards in
      gsap.fromTo(
        el.querySelectorAll('.achievement-card'),
        { opacity: 0, y: 20, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          ease: 'back.out(1.2)',
          stagger: 0.07,
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            end: 'bottom 20%',
            toggleActions: 'play reverse play reverse',
            // Trigger count up when section enters
            onEnter: () => {
              setIsVisible(false)
              setTimeout(() => setIsVisible(true), 50)
            },
            onEnterBack: () => {
              setIsVisible(false)
              setTimeout(() => setIsVisible(true), 50)
            },
            onLeave: () => setIsVisible(false),
            onLeaveBack: () => setIsVisible(false),
          },
        }
      )
    }, el)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '80px 24px',
      }}
    >
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

      <div
        ref={gridRef}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '12px',
        }}
        className="achievements-grid"
      >
        {achievements.map((achievement) => (
          <AchievementCard
            key={achievement.id}
            achievement={achievement}
            isVisible={isVisible}
          />
        ))}
      </div>
    </section>
  )
}