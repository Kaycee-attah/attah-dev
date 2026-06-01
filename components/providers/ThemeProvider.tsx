'use client'

import { createContext, useContext, useEffect, useState } from 'react'

// ─── TYPES ──────────────────────────────────────────────────
type Theme = 'dark' | 'light'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

// ─── CONTEXT ────────────────────────────────────────────────
const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  toggleTheme: () => {},
})

// ─── PROVIDER COMPONENT ─────────────────────────────────────
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('theme') as Theme | null
    const preferred = stored ?? 'dark'
    setTheme(preferred)
    document.documentElement.classList.toggle('light', preferred === 'light')
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    localStorage.setItem('theme', next)
    document.documentElement.classList.toggle('light', next === 'light')
  }

  if (!mounted) return null

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

// ─── HOOK ────────────────────────────────────────────────────
export const useTheme = () => useContext(ThemeContext)

