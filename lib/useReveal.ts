import { useEffect, useRef } from 'react'

export function useReveal() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          } else {
            // Only reset if completely out of view
            // rootMargin pushes the boundary so this
            // only fires when element is well outside viewport
            entry.target.classList.remove('visible')
          }
        })
      },
      {
        threshold: 0,
        // Large negative bottom margin means element must be
        // fully above OR fully below viewport before resetting
        rootMargin: '0px 0px -10% 0px',
      }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return ref
}