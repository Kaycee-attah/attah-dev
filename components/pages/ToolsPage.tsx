'use client'

import { useState, useCallback } from 'react'
import { useFadeUp, useStaggerAnimation } from '@/lib/useGSAP'

// ─── WCAG HELPERS ─────────────────────────────────────────────

function hexToRgb(hex: string): [number, number, number] | null {
  const clean = hex.replace('#', '')
  if (clean.length !== 3 && clean.length !== 6) return null
  const full =
    clean.length === 3
      ? clean
          .split('')
          .map((c) => c + c)
          .join('')
      : clean
  const num = parseInt(full, 16)
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255]
}

function linearize(c: number): number {
  const s = c / 255
  return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
}

function relativeLuminance(rgb: [number, number, number]): number {
  const [r, g, b] = rgb.map(linearize)
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function contrastRatio(fg: string, bg: string): number | null {
  const fgRgb = hexToRgb(fg)
  const bgRgb = hexToRgb(bg)
  if (!fgRgb || !bgRgb) return null
  const L1 = relativeLuminance(fgRgb)
  const L2 = relativeLuminance(bgRgb)
  const lighter = Math.max(L1, L2)
  const darker = Math.min(L1, L2)
  return (lighter + 0.05) / (darker + 0.05)
}

function isValidHex(hex: string): boolean {
  return /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(hex)
}

// ─── NLP API URL ──────────────────────────────────────────────
// Update this when you deploy to Render
const NLP_API_URL =
  'https://resourceful-eagerness-production-d7dd.up.railway.app'

// ─── TOOLS PAGE ───────────────────────────────────────────────
export default function ToolsPage() {
  const heroRef = useFadeUp({ y: 32, duration: 0.7 })
  const toolsRef = useStaggerAnimation(
    '.tool-section',
    { opacity: 0, y: 28 },
    { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', stagger: 0.15 },
    { start: 'top 88%' }
  )

  // ── WCAG STATE ──────────────────────────────────────────────
  const [fg, setFg] = useState('#f9fafb')
  const [bg, setBg] = useState('#0d0f14')

  const ratio = contrastRatio(fg, bg)
  const ratioFixed = ratio ? Math.round(ratio * 100) / 100 : null

  const passes = {
    aaSmall: ratio ? ratio >= 4.5 : false,
    aaLarge: ratio ? ratio >= 3 : false,
    aaaSmall: ratio ? ratio >= 7 : false,
    aaaLarge: ratio ? ratio >= 4.5 : false,
  }

  // ── NLP STATE ───────────────────────────────────────────────
  const [query, setQuery] = useState('show me women over 30 in Lagos')
  const [nlpResult, setNlpResult] = useState<Record<string, unknown> | null>({
    gender: 'female',
    minAge: 30,
    location: 'Lagos',
    country: 'Nigeria',
  })
  const [nlpStatus, setNlpStatus] = useState<'idle' | 'waking' | 'loading' | 'success' | 'error'
  >('idle')
  const [responseTime, setResponseTime] = useState<number | null>(486)

  const exampleQueries = [
    'women under 25 in Abuja',
    'men over 40 in Kano',
    'people in Lagos',
    'women in Nigeria',
  ]

  const runQuery = useCallback(async () => {
    if (!query.trim()) return
    setNlpStatus('waking')
    setNlpResult(null)
    setResponseTime(null)

    const start = performance.now()

    try {
      // First try a quick ping to check if server is awake
      setNlpStatus('loading')
      const res = await fetch(
        `${NLP_API_URL}/api/query?q=${encodeURIComponent(query)}`,
        { signal: AbortSignal.timeout(60000) }
      )

      const elapsed = Math.round(performance.now() - start)
      setResponseTime(elapsed)

      if (!res.ok) throw new Error(`HTTP ${res.status}`)

      const data = await res.json()
      setNlpResult(data)
      setNlpStatus('success')
    } catch (err) {
      setNlpStatus('error')
    }
  }, [query])

  const getTagColor = (key: string) => {
    if (key === 'gender') return { bg: 'rgba(192,132,252,0.1)', border: 'rgba(192,132,252,0.2)', color: '#c084fc' }
    if (key.includes('age') || key.includes('Age') || key.includes('min') || key.includes('max')) return { bg: 'rgba(96,165,250,0.1)', border: 'rgba(96,165,250,0.2)', color: '#60a5fa' }
    return { bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.2)', color: '#f59e0b' }
  }

  return (
    <div
      style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 24px',
      }}
    >

      {/* ── PAGE HERO ─────────────────────────────────────────── */}
      <div
        ref={heroRef}
        style={{
          padding: '52px 0 44px',
          borderBottom: '0.5px solid var(--border)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '10px',
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
            Free tools
          </span>
        </div>

        <h1
          style={{
            fontSize: 'clamp(32px, 5vw, 48px)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            color: 'var(--text-primary)',
            lineHeight: 1.0,
            marginBottom: '12px',
          }}
        >
          Built from{' '}
          <em
            style={{
              fontStyle: 'italic',
              fontWeight: 300,
              color: 'var(--text-muted)',
            }}
          >
            real problems.
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
          Two tools I built because I needed them myself. Free, no
          sign-up, no limits. The WCAG checker came from verifying 21
          colour pairs by hand. The NLP demo came from building a query
          engine with zero budget.
        </p>
      </div>

      {/* ── TOOLS ─────────────────────────────────────────────── */}
      <div
        ref={toolsRef}
        style={{ padding: '40px 0 80px', display: 'flex', flexDirection: 'column', gap: '32px' }}
      >

        {/* ════════════════════════════════════════════════════ */}
        {/* TOOL 1 — WCAG CONTRAST CHECKER                      */}
        {/* ════════════════════════════════════════════════════ */}
        <div
          className="tool-section"
          style={{
            background: 'var(--bg-surface)',
            border: '0.5px solid var(--border)',
            borderRadius: '12px',
            overflow: 'hidden',
          }}
        >
          {/* HEADER */}
          <div
            style={{
              padding: '16px 20px',
              borderBottom: '0.5px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '10px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'rgba(251,113,133,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                }}
              >
                ♿
              </div>
              <div>
                <div
                  style={{
                    fontSize: '15px',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    letterSpacing: '-0.01em',
                  }}
                >
                  WCAG contrast checker
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    color: 'var(--text-ghost)',
                    marginTop: '1px',
                  }}
                >
                  Verify colour pair accessibility · WCAG AA &amp; AAA
                </div>
              </div>
            </div>
            <span
              style={{
                padding: '3px 10px',
                borderRadius: '4px',
                fontFamily: 'var(--font-mono)',
                fontSize: '9px',
                letterSpacing: '0.05em',
                background: 'rgba(34,197,94,0.08)',
                border: '0.5px solid rgba(34,197,94,0.2)',
                color: '#4ade80',
              }}
            >
              Free · No sign-up · Browser only
            </span>
          </div>

          {/* BODY */}
          <div style={{ padding: '24px' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '24px',
              }}
              className="wcag-grid"
            >

              {/* LEFT — INPUTS */}
              <div>
                {/* FOREGROUND */}
                <div style={{ marginBottom: '16px' }}>
                  <label
                    style={{
                      display: 'block',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '10px',
                      color: 'var(--text-ghost)',
                      letterSpacing: '0.07em',
                      textTransform: 'uppercase',
                      marginBottom: '6px',
                    }}
                  >
                    Foreground colour
                  </label>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '6px',
                        background: isValidHex(fg) ? fg : 'var(--bg-elevated)',
                        border: '0.5px solid var(--border)',
                        flexShrink: 0,
                        cursor: 'pointer',
                        position: 'relative',
                        overflow: 'hidden',
                      }}
                    >
                      <input
                        type="color"
                        value={isValidHex(fg) ? fg : '#f9fafb'}
                        onChange={(e) => setFg(e.target.value)}
                        style={{
                          position: 'absolute',
                          inset: 0,
                          opacity: 0,
                          cursor: 'pointer',
                          width: '100%',
                          height: '100%',
                        }}
                      />
                    </div>
                    <input
                      type="text"
                      value={fg}
                      onChange={(e) => setFg(e.target.value)}
                      placeholder="#000000"
                      style={{
                        flex: 1,
                        padding: '9px 12px',
                        background: 'var(--bg-elevated)',
                        border: `0.5px solid ${isValidHex(fg) ? 'var(--border)' : 'rgba(239,68,68,0.4)'}`,
                        borderRadius: '7px',
                        fontSize: '13px',
                        color: 'var(--text-primary)',
                        fontFamily: 'var(--font-mono)',
                        outline: 'none',
                      }}
                    />
                  </div>
                </div>

                {/* BACKGROUND */}
                <div style={{ marginBottom: '16px' }}>
                  <label
                    style={{
                      display: 'block',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '10px',
                      color: 'var(--text-ghost)',
                      letterSpacing: '0.07em',
                      textTransform: 'uppercase',
                      marginBottom: '6px',
                    }}
                  >
                    Background colour
                  </label>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '6px',
                        background: isValidHex(bg) ? bg : 'var(--bg-elevated)',
                        border: '0.5px solid var(--border)',
                        flexShrink: 0,
                        cursor: 'pointer',
                        position: 'relative',
                        overflow: 'hidden',
                      }}
                    >
                      <input
                        type="color"
                        value={isValidHex(bg) ? bg : '#0d0f14'}
                        onChange={(e) => setBg(e.target.value)}
                        style={{
                          position: 'absolute',
                          inset: 0,
                          opacity: 0,
                          cursor: 'pointer',
                          width: '100%',
                          height: '100%',
                        }}
                      />
                    </div>
                    <input
                      type="text"
                      value={bg}
                      onChange={(e) => setBg(e.target.value)}
                      placeholder="#ffffff"
                      style={{
                        flex: 1,
                        padding: '9px 12px',
                        background: 'var(--bg-elevated)',
                        border: `0.5px solid ${isValidHex(bg) ? 'var(--border)' : 'rgba(239,68,68,0.4)'}`,
                        borderRadius: '7px',
                        fontSize: '13px',
                        color: 'var(--text-primary)',
                        fontFamily: 'var(--font-mono)',
                        outline: 'none',
                      }}
                    />
                  </div>
                </div>

                {/* PREVIEW STRIP */}
                <div
                  style={{
                    height: '52px',
                    borderRadius: '8px',
                    border: '0.5px solid var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    fontWeight: 500,
                    background: isValidHex(bg) ? bg : 'var(--bg-elevated)',
                    color: isValidHex(fg) ? fg : 'var(--text-primary)',
                    marginBottom: '8px',
                  }}
                >
                  The quick brown fox jumps
                </div>
                <p
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    color: 'var(--text-whisper)',
                  }}
                >
                  Click the colour swatch to use a colour picker
                </p>
              </div>

              {/* RIGHT — RESULTS */}
              <div>
                {/* RATIO */}
                <div
                  style={{
                    background: 'var(--bg-elevated)',
                    border: '0.5px solid var(--border)',
                    borderRadius: '10px',
                    padding: '16px',
                    marginBottom: '12px',
                  }}
                >
                  <div
                    style={{
                      fontSize: 'clamp(28px, 4vw, 40px)',
                      fontWeight: 800,
                      letterSpacing: '-0.03em',
                      color: 'var(--text-primary)',
                      lineHeight: 1,
                      marginBottom: '4px',
                    }}
                  >
                    {ratioFixed ?? '—'}
                    <span style={{ fontSize: '18px', color: 'var(--amber)', marginLeft: '2px' }}>
                      {ratioFixed ? ':1' : ''}
                    </span>
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '10px',
                      color: 'var(--text-ghost)',
                      marginBottom: '12px',
                    }}
                  >
                    Contrast ratio
                  </div>

                  {/* PASS/FAIL BADGES */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '6px',
                    }}
                  >
                    {[
                      { label: 'AA Normal', pass: passes.aaSmall, req: '4.5:1' },
                      { label: 'AA Large', pass: passes.aaLarge, req: '3:1' },
                      { label: 'AAA Normal', pass: passes.aaaSmall, req: '7:1' },
                      { label: 'AAA Large', pass: passes.aaaLarge, req: '4.5:1' },
                    ].map((item) => (
                      <div
                        key={item.label}
                        style={{
                          padding: '7px 10px',
                          borderRadius: '6px',
                          background: item.pass
                            ? 'rgba(34,197,94,0.08)'
                            : 'rgba(239,68,68,0.08)',
                          border: `0.5px solid ${item.pass ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '6px',
                        }}
                      >
                        <span
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '9px',
                            color: item.pass ? '#4ade80' : '#f87171',
                            letterSpacing: '0.03em',
                          }}
                        >
                          {item.label}
                        </span>
                        <span
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '10px',
                            fontWeight: 700,
                            color: item.pass ? '#4ade80' : '#f87171',
                          }}
                        >
                          {item.pass ? '✓' : '✗'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* EXPLAINER */}
                <div
                  style={{
                    background: 'var(--bg-elevated)',
                    border: '0.5px solid var(--border)',
                    borderRadius: '10px',
                    padding: '12px 14px',
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '10px',
                      color: 'var(--text-ghost)',
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      marginBottom: '8px',
                    }}
                  >
                    What the levels mean
                  </div>
                  {[
                    { level: 'AA Normal', desc: '4.5:1 min · body text and UI' },
                    { level: 'AA Large', desc: '3:1 min · 18pt+ or 14pt bold' },
                    { level: 'AAA Normal', desc: '7:1 min · enhanced contrast' },
                    { level: 'AAA Large', desc: '4.5:1 min · enhanced large' },
                  ].map((item) => (
                    <div
                      key={item.level}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        gap: '8px',
                        fontSize: '11px',
                        color: 'var(--text-ghost)',
                        padding: '3px 0',
                        borderBottom: '0.5px solid var(--border)',
                      }}
                    >
                      <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>
                        {item.level}
                      </span>
                      <span>{item.desc}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════ */}
        {/* TOOL 2 — NLP QUERY TESTER                           */}
        {/* ════════════════════════════════════════════════════ */}
        <div
          className="tool-section"
          style={{
            background: 'var(--bg-surface)',
            border: '0.5px solid var(--border)',
            borderRadius: '12px',
            overflow: 'hidden',
          }}
        >
          {/* HEADER */}
          <div
            style={{
              padding: '16px 20px',
              borderBottom: '0.5px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '10px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'rgba(96,165,250,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                }}
              >
                ⚙
              </div>
              <div>
                <div
                  style={{
                    fontSize: '15px',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    letterSpacing: '-0.01em',
                  }}
                >
                  NLP query tester
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    color: 'var(--text-ghost)',
                    marginTop: '1px',
                  }}
                >
                  Plain English → SQL filters · Insighta Labs API
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <span
                style={{
                  padding: '3px 10px',
                  borderRadius: '4px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '9px',
                  letterSpacing: '0.05em',
                  background: 'rgba(245,158,11,0.08)',
                  border: '0.5px solid rgba(245,158,11,0.2)',
                  color: 'var(--amber)',
                }}
              >
                Live API
              </span>
              <span
                style={{
                  padding: '3px 10px',
                  borderRadius: '4px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '9px',
                  letterSpacing: '0.05em',
                  background: 'rgba(34,197,94,0.08)',
                  border: '0.5px solid rgba(34,197,94,0.2)',
                  color: '#4ade80',
                }}
              >
                Free · No sign-up
              </span>
            </div>
          </div>

          {/* BODY */}
          <div style={{ padding: '24px' }}>

            {/* INPUT ROW */}
            <div
              style={{
                display: 'flex',
                gap: '8px',
                marginBottom: '12px',
              }}
            >
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && runQuery()}
                placeholder='Try: "show me women over 30 in Lagos"'
                style={{
                  flex: 1,
                  padding: '11px 14px',
                  background: 'var(--bg-elevated)',
                  border: '0.5px solid var(--border)',
                  borderRadius: '8px',
                  fontSize: '13px',
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-sans)',
                  outline: 'none',
                }}
              />
              <button
                onClick={runQuery}
                disabled={nlpStatus === 'loading' || nlpStatus === 'waking'}
                className="btn-primary"
                style={{
                  padding: '11px 20px',
                  fontSize: '13px',
                  whiteSpace: 'nowrap',
                  opacity:
                    nlpStatus === 'loading' || nlpStatus === 'waking'
                      ? 0.7
                      : 1,
                  cursor:
                    nlpStatus === 'loading' || nlpStatus === 'waking'
                      ? 'not-allowed'
                      : 'pointer',
                }}
              >
                {nlpStatus === 'waking'
                  ? 'Waking server...'
                  : nlpStatus === 'loading'
                  ? 'Running...'
                  : 'Run query →'}
              </button>
            </div>

            {/* EXAMPLE PILLS */}
            <div
              style={{
                display: 'flex',
                gap: '6px',
                flexWrap: 'wrap',
                marginBottom: '16px',
              }}
            >
              {exampleQueries.map((ex) => (
                <button
                  key={ex}
                  onClick={() => setQuery(ex)}
                  style={{
                    padding: '4px 12px',
                    background: 'var(--bg-elevated)',
                    border: '0.5px solid var(--border)',
                    borderRadius: '20px',
                    fontSize: '11px',
                    color: 'var(--text-ghost)',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-mono)',
                    transition: 'border-color var(--transition)',
                  }}
                >
                  {ex}
                </button>
              ))}
            </div>

            {/* RESULT BOX */}
            <div
              style={{
                background: 'var(--bg-elevated)',
                border: '0.5px solid var(--border)',
                borderRadius: '8px',
                overflow: 'hidden',
              }}
            >
              {/* RESULT BAR */}
              <div
                style={{
                  padding: '8px 14px',
                  borderBottom: '0.5px solid var(--border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    color: 'var(--text-ghost)',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                  }}
                >
                  {nlpStatus === 'waking'
                    ? 'Waking server (~30s first request)...'
                    : nlpStatus === 'loading'
                    ? 'Parsing query...'
                    : nlpStatus === 'error'
                    ? 'Error — server may be sleeping'
                    : 'Parsed filters'}
                </span>
                {responseTime !== null && nlpStatus !== 'error' && (
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '10px',
                      color: '#4ade80',
                    }}
                  >
                    ⚡ {responseTime}ms
                  </span>
                )}
              </div>

              {/* RESULT BODY */}
              <div
                style={{
                  padding: '14px 16px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                  lineHeight: 1.9,
                  minHeight: '80px',
                }}
              >
                {nlpStatus === 'waking' || nlpStatus === 'loading' ? (
                  <div style={{ color: 'var(--text-ghost)' }}>
                    {nlpStatus === 'waking'
                      ? '// Waking up server — free tier sleeps after 15min of inactivity...'
                      : '// Parsing your query...'}
                  </div>
                ) : nlpStatus === 'error' ? (
                  <div style={{ color: '#f87171' }}>
                    // Error reaching the API. The server may be sleeping or unavailable.
                  </div>
                ) : nlpResult ? (
                  Object.entries(nlpResult).map(([key, value]) => (
                    <div key={key}>
                      <span style={{ color: '#60a5fa' }}>{key}</span>
                      <span style={{ color: 'var(--text-ghost)' }}>: </span>
                      <span
                        style={{
                          color:
                            typeof value === 'number'
                              ? '#fca5a1'
                              : '#86efac',
                        }}
                      >
                        {typeof value === 'string'
                          ? `"${value}"`
                          : String(value)}
                      </span>
                    </div>
                  ))
                ) : (
                  <div style={{ color: 'var(--text-whisper)' }}>
                    // Run a query to see parsed filters
                  </div>
                )}
              </div>

              {/* PARSED TAGS */}
              {nlpResult && nlpStatus === 'success' && (
                <div
                  style={{
                    padding: '10px 14px',
                    borderTop: '0.5px solid var(--border)',
                    display: 'flex',
                    gap: '6px',
                    flexWrap: 'wrap',
                  }}
                >
                  {Object.entries(nlpResult).map(([key, value]) => {
                    const colors = getTagColor(key)
                    return (
                      <span
                        key={key}
                        style={{
                          padding: '3px 10px',
                          borderRadius: '4px',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '10px',
                          background: colors.bg,
                          border: `0.5px solid ${colors.border}`,
                          color: colors.color,
                        }}
                      >
                        {key}: {String(value)}
                      </span>
                    )
                  })}
                </div>
              )}

              {/* COLD START NOTE */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 14px',
                  background: 'rgba(245,158,11,0.03)',
                  borderTop: '0.5px solid rgba(245,158,11,0.1)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  color: 'var(--text-ghost)',
                }}
              >
                ⚡ First request may take ~30s — free tier server sleeps after 15min of inactivity
              </div>
            </div>

          </div>
        </div>

      </div>

      <style>{`
        @media (max-width: 768px) {
          .wcag-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

    </div>
  )
}