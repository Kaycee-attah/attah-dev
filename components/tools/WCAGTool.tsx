'use client'

import { useState } from 'react'

function hexToRgb(hex: string): [number, number, number] | null {
  const clean = hex.replace('#', '')
  if (clean.length !== 3 && clean.length !== 6) return null
  const full = clean.length === 3
    ? clean.split('').map((c) => c + c).join('')
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

export default function WCAGTool() {
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

  return (
    <div style={{ padding: '24px' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '24px',
        }}
        className="wcag-grid"
      >
        {/* LEFT */}
        <div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-ghost)', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: '6px' }}>
              Foreground colour
            </label>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '6px', background: isValidHex(fg) ? fg : 'var(--bg-elevated)', border: '0.5px solid var(--border)', flexShrink: 0, cursor: 'pointer', position: 'relative', overflow: 'hidden' }}>
                <input type="color" value={isValidHex(fg) ? fg : '#f9fafb'} onChange={(e) => setFg(e.target.value)} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%' }} />
              </div>
              <input type="text" value={fg} onChange={(e) => setFg(e.target.value)} placeholder="#000000" style={{ flex: 1, padding: '9px 12px', background: 'var(--bg-elevated)', border: `0.5px solid ${isValidHex(fg) ? 'var(--border)' : 'rgba(239,68,68,0.4)'}`, borderRadius: '7px', fontSize: '13px', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', outline: 'none' }} />
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-ghost)', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: '6px' }}>
              Background colour
            </label>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '6px', background: isValidHex(bg) ? bg : 'var(--bg-elevated)', border: '0.5px solid var(--border)', flexShrink: 0, cursor: 'pointer', position: 'relative', overflow: 'hidden' }}>
                <input type="color" value={isValidHex(bg) ? bg : '#0d0f14'} onChange={(e) => setBg(e.target.value)} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%' }} />
              </div>
              <input type="text" value={bg} onChange={(e) => setBg(e.target.value)} placeholder="#ffffff" style={{ flex: 1, padding: '9px 12px', background: 'var(--bg-elevated)', border: `0.5px solid ${isValidHex(bg) ? 'var(--border)' : 'rgba(239,68,68,0.4)'}`, borderRadius: '7px', fontSize: '13px', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', outline: 'none' }} />
            </div>
          </div>

          <div style={{ height: '52px', borderRadius: '8px', border: '0.5px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 500, background: isValidHex(bg) ? bg : 'var(--bg-elevated)', color: isValidHex(fg) ? fg : 'var(--text-primary)', marginBottom: '8px' }}>
            The quick brown fox jumps
          </div>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-whisper)' }}>
            Click the colour swatch to use a colour picker
          </p>
        </div>

        {/* RIGHT */}
        <div>
          <div style={{ background: 'var(--bg-elevated)', border: '0.5px solid var(--border)', borderRadius: '10px', padding: '16px', marginBottom: '12px' }}>
            <div style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text-primary)', lineHeight: 1, marginBottom: '4px' }}>
              {ratioFixed ?? '—'}
              <span style={{ fontSize: '18px', color: 'var(--amber)', marginLeft: '2px' }}>
                {ratioFixed ? ':1' : ''}
              </span>
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-ghost)', marginBottom: '12px' }}>
              Contrast ratio
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
              {[
                { label: 'AA Normal', pass: passes.aaSmall },
                { label: 'AA Large', pass: passes.aaLarge },
                { label: 'AAA Normal', pass: passes.aaaSmall },
                { label: 'AAA Large', pass: passes.aaaLarge },
              ].map((item) => (
                <div key={item.label} style={{ padding: '7px 10px', borderRadius: '6px', background: item.pass ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)', border: `0.5px solid ${item.pass ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: item.pass ? '#4ade80' : '#f87171' }}>{item.label}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, color: item.pass ? '#4ade80' : '#f87171' }}>{item.pass ? '✓' : '✗'}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: 'var(--bg-elevated)', border: '0.5px solid var(--border)', borderRadius: '10px', padding: '12px 14px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-ghost)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '8px' }}>
              What the levels mean
            </div>
            {[
              { level: 'AA Normal', desc: '4.5:1 min · body text and UI' },
              { level: 'AA Large', desc: '3:1 min · 18pt+ or 14pt bold' },
              { level: 'AAA Normal', desc: '7:1 min · enhanced contrast' },
              { level: 'AAA Large', desc: '4.5:1 min · enhanced large' },
            ].map((item) => (
              <div key={item.level} style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', fontSize: '11px', color: 'var(--text-ghost)', padding: '3px 0', borderBottom: '0.5px solid var(--border)' }}>
                <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>{item.level}</span>
                <span>{item.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}