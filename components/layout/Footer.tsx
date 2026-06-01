import Link from 'next/link'

// ─── FOOTER LINKS ────────────────────────────────────────────
const footerLinks = [
  { label: 'Projects',   href: '/projects'   },
  { label: 'Experience', href: '/experience' },
  { label: 'Tools',      href: '/tools'      },
  { label: 'Blog',       href: '/blog'       },
  { label: 'Services',   href: '/services'   },
  { label: 'Contact',    href: '/contact'    },
]

const socialLinks = [
  { label: 'GitHub',   href: 'https://github.com/Kaycee-attah'              },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/kelechi-attah'        },
  { label: 'Email',    href: 'mailto:attahkelechi97@gmail.com'              },
]

// ─── FOOTER COMPONENT ────────────────────────────────────────
export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer
      style={{
        borderTop: '0.5px solid var(--border)',
        background: 'var(--bg-surface)',
        marginTop: 'auto',
      }}
    >
      {/* MAIN FOOTER CONTENT */}
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '48px 24px 32px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '32px',
        }}
        className="footer-grid"
      >

        {/* COLUMN 1 — Brand */}
        <div>
          <Link
            href="/"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '16px',
              fontWeight: 500,
              color: 'var(--text-primary)',
              textDecoration: 'none',
              display: 'inline-block',
              marginBottom: '12px',
            }}
          >
            attah<span style={{ color: 'var(--amber)' }}>.dev</span>
          </Link>
          <p
            style={{
              fontSize: '13px',
              color: 'var(--text-dim)',
              lineHeight: 1.7,
              maxWidth: '240px',
              margin: 0,
            }}
          >
            Frontend Developer building production-grade web applications.
            Based in Osun, Nigeria.
          </p>
        </div>

        {/* COLUMN 2 — Navigation */}
        <div>
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              color: 'var(--text-ghost)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: '14px',
            }}
          >
            Navigation
          </p>
          <ul
            style={{
              listStyle: 'none',
              margin: 0,
              padding: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            {footerLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  style={{
                    fontSize: '13px',
                    color: 'var(--text-dim)',
                    textDecoration: 'none',
                    transition: 'color var(--transition)',
                  }}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* COLUMN 3 — Connect */}
        <div>
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              color: 'var(--text-ghost)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: '14px',
            }}
          >
            Connect
          </p>
          <ul
            style={{
              listStyle: 'none',
              margin: 0,
              padding: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            {socialLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  target={link.href.startsWith('http') ? '_blank' : undefined}
                  rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  style={{
                    fontSize: '13px',
                    color: 'var(--text-dim)',
                    textDecoration: 'none',
                    transition: 'color var(--transition)',
                  }}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* BOTTOM BAR */}
      <div
        style={{
          borderTop: '0.5px solid var(--border)',
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '8px',
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: 'var(--text-whisper)',
            margin: 0,
          }}
        >
          © {currentYear} Attah Kelechi · Built with Next.js & Tailwind CSS · Deployed on Vercel
        </p>
        <a
          href="#top"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: 'var(--text-whisper)',
            textDecoration: 'none',
            transition: 'color var(--transition)',
          }}
        >
          Back to top ↑
        </a>
      </div>
    </footer>
  )
}