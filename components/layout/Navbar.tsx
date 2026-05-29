'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Sun, Moon, Menu, X } from 'lucide-react'
import { useTheme } from '@/components/providers/ThemeProvider'

// ─── NAVIGATION LINKS ────────────────────────────────────────
const navLinks = [
  { label: 'Projects',   href: '/projects'   },
  { label: 'Experience', href: '/experience' },
  { label: 'Skills',     href: '/skills'     },
  { label: 'Blog',       href: '/blog'       },
  { label: 'Contact',    href: '/contact'    },
]

// ─── NAVBAR COMPONENT ────────────────────────────────────────
export default function Navbar() {
  const { theme, toggleTheme } = useTheme()
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Add shadow when user scrolls down
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        borderBottom: `0.5px solid var(--border)`,
        background: scrolled
          ? 'rgba(13, 15, 20, 0.95)'
          : 'var(--bg-base)',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        transition: 'background 0.3s ease, backdrop-filter 0.3s ease',
      }}
    >
      <nav
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 24px',
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* LOGO */}
        <Link
          href="/"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '14px',
            fontWeight: 500,
            color: 'var(--text-primary)',
            textDecoration: 'none',
            letterSpacing: '-0.01em',
          }}
        >
          attah<span style={{ color: 'var(--amber)' }}>.dev</span>
        </Link>

        {/* DESKTOP LINKS */}
        <ul
          style={{
            display: 'flex',
            gap: '28px',
            listStyle: 'none',
            margin: 0,
            padding: 0,
          }}
          className="desktop-nav"
        >
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                style={{
                  fontSize: '13px',
                  color: pathname === link.href
                    ? 'var(--text-primary)'
                    : 'var(--text-dim)',
                  textDecoration: 'none',
                  transition: 'color var(--transition)',
                  fontWeight: pathname === link.href ? 600 : 400,
                }}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* RIGHT SIDE */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>

          {/* AVAILABLE BADGE */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '7px',
              padding: '6px 13px',
              border: '0.5px solid var(--border-hover)',
              borderRadius: '24px',
              fontSize: '12px',
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-mono)',
              letterSpacing: '0.02em',
            }}
            className="desktop-nav"
          >
            <span className="avail-dot" />
            Available for hire
          </div>

          {/* THEME TOGGLE */}
          <button
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              border: '0.5px solid var(--border-hover)',
              background: 'var(--bg-surface)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--text-dim)',
              transition: 'border-color var(--transition), color var(--transition)',
              flexShrink: 0,
            }}
          >
            {theme === 'dark'
              ? <Sun size={16} />
              : <Moon size={16} />
            }
          </button>

          {/* MOBILE HAMBURGER */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              border: '0.5px solid var(--border-hover)',
              background: 'var(--bg-surface)',
              display: 'none',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--text-dim)',
            }}
            className="mobile-menu-btn"
          >
            {menuOpen ? <X size={16} /> : <Menu size={16} />}
          </button>

        </div>
      </nav>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div
          style={{
            borderTop: '0.5px solid var(--border)',
            background: 'var(--bg-surface)',
            padding: '16px 24px 24px',
          }}
        >
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  style={{
                    display: 'block',
                    padding: '10px 0',
                    fontSize: '15px',
                    color: pathname === link.href
                      ? 'var(--text-primary)'
                      : 'var(--text-dim)',
                    textDecoration: 'none',
                    fontWeight: pathname === link.href ? 600 : 400,
                    borderBottom: '0.5px solid var(--border-subtle)',
                  }}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* MOBILE AVAILABLE BADGE */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '7px',
              marginTop: '16px',
              padding: '6px 13px',
              border: '0.5px solid var(--border-hover)',
              borderRadius: '24px',
              fontSize: '12px',
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-mono)',
            }}
          >
            <span className="avail-dot" />
            Available for hire
          </div>
        </div>
      )}
    </header>
  )
}