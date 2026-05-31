'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register ScrollTrigger plugin once
gsap.registerPlugin(ScrollTrigger)

// ─── TYPES ────────────────────────────────────────────────────
interface AnimateFromProps {
  opacity?: number
  y?: number
  x?: number
  scale?: number
  rotation?: number
}

interface AnimateToProps {
  opacity?: number
  y?: number
  x?: number
  scale?: number
  rotation?: number
  duration?: number
  ease?: string
  stagger?: number
  delay?: number
}

interface ScrollTriggerConfig {
  trigger?: Element | string
  start?: string
  end?: string
  scrub?: boolean | number
  toggleActions?: string
  markers?: boolean
}

// ─── MAIN HOOK ────────────────────────────────────────────────
// Use this to animate a container and its children on scroll
export function useScrollAnimation() {
  const ref = useRef<HTMLDivElement>(null)

  const animateFrom = (
    targets: string | Element | Element[],
    from: AnimateFromProps,
    to: AnimateToProps,
    scrollConfig?: ScrollTriggerConfig
  ) => {
    const el = ref.current
    if (!el) return

    const resolvedTargets =
      typeof targets === 'string'
        ? el.querySelectorAll(targets)
        : targets

    gsap.fromTo(resolvedTargets, from, {
      ...to,
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        end: 'bottom 20%',
        toggleActions: 'play reverse play reverse',
        ...scrollConfig,
      },
    })
  }

  const cleanup = () => {
    const el = ref.current
    if (!el) return
    ScrollTrigger.getAll()
      .filter((t) => t.vars.trigger === el)
      .forEach((t) => t.kill())
  }

  return { ref, animateFrom, cleanup }
}

// ─── STAGGER HOOK ─────────────────────────────────────────────
// Use this to stagger children of a container
export function useStaggerAnimation(
  childSelector: string,
  from: AnimateFromProps,
  to: AnimateToProps & { stagger?: number },
  scrollConfig?: ScrollTriggerConfig
) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const children = el.querySelectorAll(childSelector)
    if (children.length === 0) return

    const ctx = gsap.context(() => {
      gsap.fromTo(children, from, {
        ...to,
        stagger: to.stagger ?? 0.1,
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          end: 'bottom 20%',
          toggleActions: 'play reverse play reverse',
          ...scrollConfig,
        },
      })
    }, el)

    return () => ctx.revert()
  }, [])

  return ref
}

// ─── SIMPLE FADE UP ───────────────────────────────────────────
// Convenience hook for the most common animation
export function useFadeUp(
  config?: {
    y?: number
    duration?: number
    delay?: number
    start?: string
  }
) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        {
          opacity: 0,
          y: config?.y ?? 32,
        },
        {
          opacity: 1,
          y: 0,
          duration: config?.duration ?? 0.7,
          delay: config?.delay ?? 0,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: config?.start ?? 'top 88%',
            end: 'bottom 20%',
            toggleActions: 'play reverse play reverse',
          },
        }
      )
    }, el)

    return () => ctx.revert()
  }, [])

  return ref
}