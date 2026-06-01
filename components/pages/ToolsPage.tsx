'use client'

import { useState, useCallback } from 'react'
import { useFadeUp, useStaggerAnimation } from '@/lib/useGSAP'
import { toolsData } from '@/lib/data/tools'

// ─── WCAG HELPERS ─────────────────────────────────────────────
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

// ─── CSS SPECIFICITY HELPERS ──────────────────────────────────
interface SpecificityToken {
  token: string
  type: 'id' | 'class' | 'pseudo-class' | 'attribute' | 'element' | 'pseudo-element' | 'combinator' | 'universal'
  contribution: [number, number, number]
}

interface SpecificityResult {
  selector: string
  score: [number, number, number]
  tokens: SpecificityToken[]
}

function parseSpecificity(selector: string): SpecificityResult {
  const tokens: SpecificityToken[] = []
  let ids = 0
  let classes = 0
  let elements = 0

  const s = selector.trim()

  // Split on combinators first but keep track
  const parts = s.split(/\s*([>+~\s])\s*/).filter(Boolean)

  for (const part of parts) {
    if ([' ', '>', '+', '~'].includes(part.trim()) || part.trim() === '') {
      if (part.trim()) tokens.push({ token: part.trim(), type: 'combinator', contribution: [0, 0, 0] })
      continue
    }

    // Parse each simple selector in the part
    // IDs
    const idMatches = part.match(/#[a-zA-Z_-][a-zA-Z0-9_-]*/g) || []
    for (const m of idMatches) {
      ids++
      tokens.push({ token: m, type: 'id', contribution: [1, 0, 0] })
    }

    // Classes
    const classMatches = part.match(/\.[a-zA-Z_-][a-zA-Z0-9_-]*/g) || []
    for (const m of classMatches) {
      classes++
      tokens.push({ token: m, type: 'class', contribution: [0, 1, 0] })
    }

    // Attribute selectors
    const attrMatches = part.match(/\[[^\]]+\]/g) || []
    for (const m of attrMatches) {
      classes++
      tokens.push({ token: m, type: 'attribute', contribution: [0, 1, 0] })
    }

    // Pseudo-elements (::before etc) — count as element
    const pseudoElementMatches = part.match(/::[\w-]+/g) || []
    for (const m of pseudoElementMatches) {
      elements++
      tokens.push({ token: m, type: 'pseudo-element', contribution: [0, 0, 1] })
    }

    // Pseudo-classes (:hover, :nth-child etc) — count as class
    // Remove pseudo-elements first to avoid double matching
    const strippedPseudo = part.replace(/::[\w-]+/g, '')
    const pseudoClassMatches = strippedPseudo.match(/:[\w-]+(\([^)]*\))?/g) || []
    for (const m of pseudoClassMatches) {
      // :not, :is, :has, :where are special — :where contributes 0
      if (m.startsWith(':where')) {
        tokens.push({ token: m, type: 'pseudo-class', contribution: [0, 0, 0] })
      } else if (m.startsWith(':not') || m.startsWith(':is') || m.startsWith(':has')) {
        classes++
        tokens.push({ token: m, type: 'pseudo-class', contribution: [0, 1, 0] })
      } else {
        classes++
        tokens.push({ token: m, type: 'pseudo-class', contribution: [0, 1, 0] })
      }
    }

    // Elements (tag names) — strip everything else first
    const stripped = part
      .replace(/#[a-zA-Z_-][a-zA-Z0-9_-]*/g, '')
      .replace(/\.[a-zA-Z_-][a-zA-Z0-9_-]*/g, '')
      .replace(/\[[^\]]+\]/g, '')
      .replace(/::[\w-]+/g, '')
      .replace(/:[\w-]+(\([^)]*\))?/g, '')
      .trim()

    if (stripped && stripped !== '*' && stripped !== '') {
      const tagMatches = stripped.match(/[a-zA-Z][a-zA-Z0-9-]*/g) || []
      for (const m of tagMatches) {
        elements++
        tokens.push({ token: m, type: 'element', contribution: [0, 0, 1] })
      }
    }

    if (stripped === '*') {
      tokens.push({ token: '*', type: 'universal', contribution: [0, 0, 0] })
    }
  }

  return {
    selector,
    score: [ids, classes, elements],
    tokens: tokens.filter(t => t.type !== 'combinator'),
  }
}

const TYPE_COLORS: Record<string, string> = {
  id: '#185FA5',
  class: '#534AB7',
  'pseudo-class': '#534AB7',
  attribute: '#854F0B',
  element: '#3B6D11',
  'pseudo-element': '#3B6D11',
  universal: 'var(--text-ghost)',
}

const TYPE_LABELS: Record<string, string> = {
  id: 'ID',
  class: 'class',
  'pseudo-class': 'pseudo-class',
  attribute: 'attribute',
  element: 'element',
  'pseudo-element': 'pseudo-element',
  universal: 'universal',
}

// ─── TANSTACK HELPERS ─────────────────────────────────────────
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

// ── JSON to TypeScript interface converter ───────────────────
function jsonToInterface(json: string, name: string): string | null {
  try {
    const parsed = JSON.parse(json)
    return buildInterface(parsed, name)
  } catch {
    return null
  }
}

function buildInterface(obj: unknown, name: string): string {
  if (Array.isArray(obj)) {
    if (obj.length === 0) return `type ${name} = unknown[]`
    return buildInterface(obj[0], name) + '[]'
  }
  if (typeof obj !== 'object' || obj === null) return ''

  const lines: string[] = [`interface ${name} {`]
  for (const [key, val] of Object.entries(obj as Record<string, unknown>)) {
    lines.push(`  ${key}: ${inferType(val, key)}`)
  }
  lines.push('}')
  return lines.join('\n')
}

function inferType(val: unknown, key: string): string {
  if (val === null) return 'null'
  if (Array.isArray(val)) {
    if (val.length === 0) return 'unknown[]'
    return `${inferType(val[0], key)}[]`
  }
  if (typeof val === 'object') {
    const nested = capitalize(key)
    const lines = [`{`]
    for (const [k, v] of Object.entries(val as Record<string, unknown>)) {
      lines.push(`    ${k}: ${inferType(v, k)}`)
    }
    lines.push('  }')
    return lines.join('\n  ')
  }
  return typeof val
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

// ── Syntax highlighter ────────────────────────────────────────
function highlightTS(code: string): React.ReactNode[] {
  const lines = code.split('\n')
  return lines.map((line, lineIdx) => {
    const tokens: React.ReactNode[] = []
    let remaining = line
    let keyIdx = 0

    while (remaining.length > 0) {
      // Comments
      const commentMatch = remaining.match(/^(\/\/.*)/)
      if (commentMatch) {
        tokens.push(<span key={keyIdx++} style={{ color: '#6b7280', fontStyle: 'italic' }}>{commentMatch[1]}</span>)
        remaining = remaining.slice(commentMatch[1].length)
        continue
      }

      // Strings
      const stringMatch = remaining.match(/^(['"`][^'"`\n]*['"`])/)
      if (stringMatch) {
        tokens.push(<span key={keyIdx++} style={{ color: '#4ade80' }}>{stringMatch[1]}</span>)
        remaining = remaining.slice(stringMatch[1].length)
        continue
      }

      // Numbers
      const numMatch = remaining.match(/^(\b\d+\b)/)
      if (numMatch) {
        tokens.push(<span key={keyIdx++} style={{ color: '#fb923c' }}>{numMatch[1]}</span>)
        remaining = remaining.slice(numMatch[1].length)
        continue
      }

      // Keywords
      const kwMatch = remaining.match(/^(\b(?:import|export|from|function|return|const|let|var|type|interface|extends|implements|async|await|true|false|null|undefined|void|default)\b)/)
      if (kwMatch) {
        tokens.push(<span key={keyIdx++} style={{ color: '#c084fc' }}>{kwMatch[1]}</span>)
        remaining = remaining.slice(kwMatch[1].length)
        continue
      }

      // Types (PascalCase words)
      const typeMatch = remaining.match(/^(\b[A-Z][a-zA-Z0-9]*\b)/)
      if (typeMatch) {
        tokens.push(<span key={keyIdx++} style={{ color: '#fb923c' }}>{typeMatch[1]}</span>)
        remaining = remaining.slice(typeMatch[1].length)
        continue
      }

      // Function calls
      const fnMatch = remaining.match(/^(\b[a-z][a-zA-Z0-9]*(?=\())/)
      if (fnMatch) {
        tokens.push(<span key={keyIdx++} style={{ color: '#60a5fa' }}>{fnMatch[1]}</span>)
        remaining = remaining.slice(fnMatch[1].length)
        continue
      }

      // Punctuation/operators
      const punctMatch = remaining.match(/^([{}()[\]:,.<>|&=+\-*/?!])/)
      if (punctMatch) {
        tokens.push(<span key={keyIdx++} style={{ color: '#67e8f9' }}>{punctMatch[1]}</span>)
        remaining = remaining.slice(1)
        continue
      }

      // Everything else
      tokens.push(<span key={keyIdx++} style={{ color: '#e5e7eb' }}>{remaining[0]}</span>)
      remaining = remaining.slice(1)
    }

    return (
      <div key={lineIdx} style={{ minHeight: '1.85em' }}>
        {tokens}
      </div>
    )
  })
}

// ── Hook generator ────────────────────────────────────────────
function generateHook(
  endpoint: string,
  method: HttpMethod,
  typeName: string,
  queryKeyName: string,
  paginated: boolean,
  enabledFlag: boolean,
  includeStaleTime: boolean,
  queryParams: string,
  generatedInterface: string | null,
): string {
  const isQuery = method === 'GET'
  const hookName = `use${capitalize(queryKeyName)}`
  const fetchFnName = `fetch${capitalize(queryKeyName)}`
  const mutFnName = `${method === 'POST' ? 'create' : method === 'DELETE' ? 'delete' : 'update'}${typeName}`

  const pathParams = (endpoint.match(/:([a-zA-Z_][a-zA-Z0-9_]*)/g) || []).map(p => p.slice(1))

  const parsedQueryParams = queryParams
    .split('\n')
    .map(l => l.trim())
    .filter(Boolean)
    .map(l => {
      const [name, type] = l.split(':').map(s => s.trim())
      return { name, type: type || 'string' }
    })

  const allPathArgs = pathParams.map(p => `${p}: string`)
  const allQueryArgs = parsedQueryParams.map(p => `${p.name}: ${p.type}`)
  const paginatedArg = paginated && isQuery ? ['page: number = 1'] : []
  const enabledArg = enabledFlag ? ['enabled = true'] : []

  const allArgs = [...allPathArgs, ...allQueryArgs, ...paginatedArg, ...enabledArg].join(', ')

  const queryKeyItems = [
    `'${queryKeyName}'`,
    ...pathParams,
    ...parsedQueryParams.map(p => p.name),
    ...(paginated && isQuery ? ['page'] : []),
  ].join(', ')

  const fetchArgs = [
    ...pathParams,
    ...parsedQueryParams.map(p => p.name),
    ...(paginated && isQuery ? ['page'] : []),
  ].join(', ')

  const interfaceBlock = generatedInterface
    ? `${generatedInterface}\n\n`
    : ''

  if (isQuery) {
    return `${interfaceBlock}import { useQuery } from '@tanstack/react-query'
import type { ${typeName} } from '@/types'

export function ${hookName}(${allArgs}) {
  return useQuery<${typeName}${paginated ? '[]' : ''}>({
    queryKey: [${queryKeyItems}],
    queryFn: () => ${fetchFnName}(${fetchArgs}),${includeStaleTime ? "\n    staleTime: 5 * 60 * 1000," : ''}${enabledFlag ? '\n    enabled,' : ''}
  })
}`
  } else {
    const bodyType = method === 'DELETE' ? 'string' : `Partial<${typeName}>`
    const bodyArg = method === 'DELETE' ? 'id' : 'data'

    return `${interfaceBlock}import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { ${typeName} } from '@/types'

export function ${hookName}() {
  const queryClient = useQueryClient()

  return useMutation<${typeName}, Error, ${bodyType}>({
    mutationFn: (${bodyArg}) => ${mutFnName}(${bodyArg}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['${queryKeyName}'] })
    },
  })
}`
  }
}

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

  // ── SPECIFICITY STATE ────────────────────────────────────────
  const [selectorInput, setSelectorInput] = useState('.nav > ul li.active:hover')
  const [multiMode, setMultiMode] = useState(false)
  const [multiInput, setMultiInput] = useState('.card .title\n#hero h1.lead\nh1 + p.intro')

  const singleResult = parseSpecificity(selectorInput)
  const multiResults = multiInput
    .split('\n')
    .filter(s => s.trim())
    .map(parseSpecificity)

  // ── TANSTACK STATE ────────────────────────────────────────────
  const [endpoint, setEndpoint] = useState('/api/users/:id/orders')
const [method, setMethod] = useState<HttpMethod>('GET')
const [typeName, setTypeName] = useState('Order')
const [queryKeyName, setQueryKeyName] = useState('userOrders')
const [paginated, setPaginated] = useState(true)
const [enabledFlag, setEnabledFlag] = useState(false)
const [includeStaleTime, setIncludeStaleTime] = useState(true)
const [queryParams, setQueryParams] = useState('')
const [responseJson, setResponseJson] = useState('')
const [requestBodyJson, setRequestBodyJson] = useState('')
const [generatedInterface, setGeneratedInterface] = useState<string | null>(null)
const [copied, setCopied] = useState(false)

const generatedHook = generateHook(
  endpoint, method, typeName, queryKeyName,
  paginated, enabledFlag, includeStaleTime,
  queryParams, generatedInterface,
)

  const copyHook = useCallback(() => {
    navigator.clipboard.writeText(generatedHook)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [generatedHook])

  const toolHeaderStyle = {
    padding: '16px 20px',
    borderBottom: '0.5px solid var(--border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap' as const,
    gap: '10px',
  }

  const badgeStyle = {
    padding: '3px 10px',
    borderRadius: '4px',
    fontFamily: 'var(--font-mono)',
    fontSize: '9px',
    letterSpacing: '0.05em',
    background: 'rgba(34,197,94,0.08)',
    border: '0.5px solid rgba(34,197,94,0.2)',
    color: '#4ade80',
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>

      {/* ── PAGE HERO ─────────────────────────────────────────── */}
      <div
        ref={heroRef}
        style={{
          padding: '52px 0 44px',
          borderBottom: '0.5px solid var(--border)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
          <span style={{ width: '32px', height: '1px', background: 'var(--amber)', display: 'inline-block' }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--amber)', letterSpacing: '0.1em', textTransform: 'uppercase' as const }}>
            Free tools
          </span>
        </div>
        <h1 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text-primary)', lineHeight: 1.0, marginBottom: '12px' }}>
          {toolsData.title}{' '}
          <em style={{ fontStyle: 'italic', fontWeight: 300, color: 'var(--text-muted)' }}>
            {toolsData.titleEm}
          </em>
        </h1>
        <p style={{ fontSize: '15px', lineHeight: 1.75, color: 'var(--text-dim)', maxWidth: '520px' }}>
          {toolsData.description}
        </p>
      </div>

      {/* ── TOOLS ─────────────────────────────────────────────── */}
      <div ref={toolsRef} style={{ padding: '40px 0 80px', display: 'flex', flexDirection: 'column', gap: '32px' }}>

        {/* ══════════════════════════════════════════════════════ */}
        {/* TOOL 1 — WCAG                                         */}
        {/* ══════════════════════════════════════════════════════ */}
        <div className="tool-section" style={{ background: 'var(--bg-surface)', border: '0.5px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
          <div style={toolHeaderStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(211,75,90,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '16px' }}>♿</span>
              </div>
              <div>
                <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>WCAG contrast checker</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-ghost)', marginTop: '1px' }}>Verify colour pair accessibility · WCAG AA &amp; AAA</div>
              </div>
            </div>
            <span style={badgeStyle}>Free · No sign-up · Browser only</span>
          </div>

          <div style={{ padding: '24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }} className="wcag-grid">
              <div>
                {/* FOREGROUND */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-ghost)', letterSpacing: '0.07em', textTransform: 'uppercase' as const, marginBottom: '6px' }}>Foreground colour</label>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '6px', background: isValidHex(fg) ? fg : 'var(--bg-elevated)', border: '0.5px solid var(--border)', flexShrink: 0, cursor: 'pointer', position: 'relative', overflow: 'hidden' }}>
                      <input type="color" value={isValidHex(fg) ? fg : '#f9fafb'} onChange={(e) => setFg(e.target.value)} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%' }} />
                    </div>
                    <input type="text" value={fg} onChange={(e) => setFg(e.target.value)} placeholder="#000000" style={{ flex: 1, padding: '9px 12px', background: 'var(--bg-elevated)', border: `0.5px solid ${isValidHex(fg) ? 'var(--border)' : 'rgba(239,68,68,0.4)'}`, borderRadius: '7px', fontSize: '13px', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', outline: 'none' }} />
                  </div>
                </div>
                {/* BACKGROUND */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-ghost)', letterSpacing: '0.07em', textTransform: 'uppercase' as const, marginBottom: '6px' }}>Background colour</label>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '6px', background: isValidHex(bg) ? bg : 'var(--bg-elevated)', border: '0.5px solid var(--border)', flexShrink: 0, cursor: 'pointer', position: 'relative', overflow: 'hidden' }}>
                      <input type="color" value={isValidHex(bg) ? bg : '#0d0f14'} onChange={(e) => setBg(e.target.value)} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%' }} />
                    </div>
                    <input type="text" value={bg} onChange={(e) => setBg(e.target.value)} placeholder="#ffffff" style={{ flex: 1, padding: '9px 12px', background: 'var(--bg-elevated)', border: `0.5px solid ${isValidHex(bg) ? 'var(--border)' : 'rgba(239,68,68,0.4)'}`, borderRadius: '7px', fontSize: '13px', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', outline: 'none' }} />
                  </div>
                </div>
                {/* PREVIEW */}
                <div style={{ height: '52px', borderRadius: '8px', border: '0.5px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 500, background: isValidHex(bg) ? bg : 'var(--bg-elevated)', color: isValidHex(fg) ? fg : 'var(--text-primary)', marginBottom: '8px' }}>
                  The quick brown fox jumps
                </div>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-whisper)' }}>Click the colour swatch to use a colour picker</p>
              </div>

              <div>
                <div style={{ background: 'var(--bg-elevated)', border: '0.5px solid var(--border)', borderRadius: '10px', padding: '16px', marginBottom: '12px' }}>
                  <div style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text-primary)', lineHeight: 1, marginBottom: '4px' }}>
                    {ratioFixed ?? '—'}
                    <span style={{ fontSize: '18px', color: 'var(--amber)', marginLeft: '2px' }}>{ratioFixed ? ':1' : ''}</span>
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-ghost)', marginBottom: '12px' }}>Contrast ratio</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                    {[
                      { label: 'AA Normal', pass: passes.aaSmall, req: '4.5:1' },
                      { label: 'AA Large', pass: passes.aaLarge, req: '3:1' },
                      { label: 'AAA Normal', pass: passes.aaaSmall, req: '7:1' },
                      { label: 'AAA Large', pass: passes.aaaLarge, req: '4.5:1' },
                    ].map((item) => (
                      <div key={item.label} style={{ padding: '7px 10px', borderRadius: '6px', background: item.pass ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)', border: `0.5px solid ${item.pass ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: item.pass ? '#4ade80' : '#f87171', letterSpacing: '0.03em' }}>{item.label}</span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, color: item.pass ? '#4ade80' : '#f87171' }}>{item.pass ? '✓' : '✗'}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ background: 'var(--bg-elevated)', border: '0.5px solid var(--border)', borderRadius: '10px', padding: '12px 14px' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-ghost)', letterSpacing: '0.06em', textTransform: 'uppercase' as const, marginBottom: '8px' }}>What the levels mean</div>
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
        </div>

        {/* ══════════════════════════════════════════════════════ */}
        {/* TOOL 2 — CSS SPECIFICITY                              */}
        {/* ══════════════════════════════════════════════════════ */}
        <div className="tool-section" style={{ background: 'var(--bg-surface)', border: '0.5px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
          <div style={toolHeaderStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(127,119,221,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>
                ⚡
              </div>
              <div>
                <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>CSS specificity calculator</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-ghost)', marginTop: '1px' }}>Paste any selector · instant token breakdown</div>
              </div>
            </div>
            <span style={badgeStyle}>Free · No sign-up · Browser only</span>
          </div>

          <div style={{ padding: '24px' }}>
            {/* MODE TOGGLE */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              {['Single selector', 'Multiple selectors'].map((label, i) => (
                <button
                  key={label}
                  onClick={() => setMultiMode(i === 1)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: 500,
                    fontFamily: 'var(--font-sans)',
                    border: (multiMode ? i === 1 : i === 0) ? 'none' : '0.5px solid var(--border)',
                    background: (multiMode ? i === 1 : i === 0) ? 'var(--amber)' : 'var(--bg-elevated)',
                    color: (multiMode ? i === 1 : i === 0) ? 'var(--bg-base)' : 'var(--text-dim)',
                    cursor: 'pointer',
                  }}
                >
                  {label}
                </button>
              ))}
            </div>

            {!multiMode ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }} className="spec-grid">
                <div>
                  <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-ghost)', letterSpacing: '0.07em', textTransform: 'uppercase' as const, marginBottom: '6px' }}>CSS selector</label>
                  <input
                    type="text"
                    value={selectorInput}
                    onChange={(e) => setSelectorInput(e.target.value)}
                    placeholder=".nav > ul li.active"
                    style={{ width: '100%', padding: '10px 13px', background: 'var(--bg-elevated)', border: '0.5px solid var(--border)', borderRadius: '8px', fontSize: '13px', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', outline: 'none', marginBottom: '16px' }}
                  />

                  {/* SCORE */}
                  <div style={{ marginBottom: '14px' }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-ghost)', letterSpacing: '0.06em', textTransform: 'uppercase' as const, marginBottom: '8px' }}>Specificity score</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                      {[
                        { label: 'IDs', val: singleResult.score[0], color: '#185FA5' },
                        { label: 'Classes', val: singleResult.score[1], color: '#534AB7' },
                        { label: 'Elements', val: singleResult.score[2], color: '#3B6D11' },
                        { label: 'Total', val: `(${singleResult.score.join(',')})`, color: 'var(--text-primary)' },
                      ].map((item) => (
                        <div key={item.label} style={{ background: 'var(--bg-elevated)', border: '0.5px solid var(--border)', borderRadius: '8px', padding: '10px 8px', textAlign: 'center' }}>
                          <div style={{ fontSize: '20px', fontWeight: 800, color: item.color, lineHeight: 1 }}>{item.val}</div>
                          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--text-ghost)', marginTop: '3px' }}>{item.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-ghost)', letterSpacing: '0.06em', textTransform: 'uppercase' as const, marginBottom: '8px' }}>Token breakdown</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', maxHeight: '280px', overflowY: 'auto' }}>
                    {singleResult.tokens.length === 0 ? (
                      <div style={{ padding: '20px', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-whisper)' }}>
                        Type a selector to see breakdown
                      </div>
                    ) : singleResult.tokens.map((token, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '7px 10px', background: 'var(--bg-elevated)', border: '0.5px solid var(--border)', borderRadius: '7px' }}>
                        <code style={{ fontSize: '12px', color: TYPE_COLORS[token.type], fontFamily: 'var(--font-mono)', minWidth: '80px' }}>{token.token}</code>
                        <span style={{ flex: 1, fontSize: '11px', color: 'var(--text-ghost)' }}>{TYPE_LABELS[token.type]}</span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-secondary)' }}>
                          +({token.contribution.join(',')})
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }} className="spec-grid">
                <div>
                  <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-ghost)', letterSpacing: '0.07em', textTransform: 'uppercase' as const, marginBottom: '6px' }}>
                    Selectors (one per line)
                  </label>
                  <textarea
                    value={multiInput}
                    onChange={(e) => setMultiInput(e.target.value)}
                    rows={8}
                    placeholder={'.nav > ul li\n#hero h1\nh1 + p.intro'}
                    style={{ width: '100%', padding: '10px 13px', background: 'var(--bg-elevated)', border: '0.5px solid var(--border)', borderRadius: '8px', fontSize: '12px', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', outline: 'none', resize: 'none', lineHeight: 1.7 }}
                  />
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-ghost)', letterSpacing: '0.06em', textTransform: 'uppercase' as const, marginBottom: '8px' }}>
                    Results — sorted by specificity
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', maxHeight: '280px', overflowY: 'auto' }}>
                    {[...multiResults]
                      .sort((a, b) => {
                        for (let i = 0; i < 3; i++) {
                          if (b.score[i] !== a.score[i]) return b.score[i] - a.score[i]
                        }
                        return 0
                      })
                      .map((result, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', background: 'var(--bg-elevated)', border: '0.5px solid var(--border)', borderRadius: '7px' }}>
                          <code style={{ flex: 1, fontSize: '12px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {result.selector}
                          </code>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-primary)', flexShrink: 0 }}>
                            ({result.score.join(',')})
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════ */}
        {/* TOOL 3 — TANSTACK QUERY HOOK GENERATOR                */}
        {/* ══════════════════════════════════════════════════════ */}
        <div className="tool-section" style={{ background: 'var(--bg-surface)', border: '0.5px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
        <div style={toolHeaderStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(29,158,117,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>⚙</div>
            <div>
                <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>TanStack Query hook generator</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-ghost)', marginTop: '1px' }}>Paste endpoint + Swagger JSON · get a fully typed hook</div>
            </div>
            </div>
            <span style={badgeStyle}>Free · No sign-up · Browser only</span>
        </div>

        <div style={{ padding: '24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }} className="tanstack-grid">

            {/* LEFT — INPUTS */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

                {/* ENDPOINT */}
                <div>
                <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-ghost)', letterSpacing: '0.07em', textTransform: 'uppercase' as const, marginBottom: '5px' }}>Endpoint URL</label>
                <input type="text" value={endpoint} onChange={(e) => setEndpoint(e.target.value)} placeholder="/api/users/:id/orders" style={{ width: '100%', padding: '9px 12px', background: 'var(--bg-elevated)', border: '0.5px solid var(--border)', borderRadius: '8px', fontSize: '13px', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', outline: 'none' }} />
                </div>

                {/* METHOD */}
                <div>
                <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-ghost)', letterSpacing: '0.07em', textTransform: 'uppercase' as const, marginBottom: '5px' }}>HTTP method</label>
                <div style={{ display: 'flex', border: '0.5px solid var(--border)', borderRadius: '8px', overflow: 'hidden' }}>
                    {(['GET', 'POST', 'PUT', 'PATCH', 'DELETE'] as HttpMethod[]).map((m, i, arr) => (
                    <button key={m} onClick={() => setMethod(m)} style={{ flex: 1, padding: '8px 4px', fontSize: '11px', fontFamily: 'var(--font-mono)', border: 'none', borderRight: i < arr.length - 1 ? '0.5px solid var(--border)' : 'none', background: method === m ? 'var(--amber)' : 'var(--bg-elevated)', color: method === m ? 'var(--bg-base)' : 'var(--text-ghost)', cursor: 'pointer', fontWeight: method === m ? 700 : 400 }}>
                        {m}
                    </button>
                    ))}
                </div>
                </div>

                {/* TYPE + KEY */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                    <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-ghost)', letterSpacing: '0.07em', textTransform: 'uppercase' as const, marginBottom: '5px' }}>Type name</label>
                    <input type="text" value={typeName} onChange={(e) => setTypeName(e.target.value)} placeholder="User" style={{ width: '100%', padding: '8px 10px', background: 'var(--bg-elevated)', border: '0.5px solid var(--border)', borderRadius: '7px', fontSize: '12px', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', outline: 'none' }} />
                </div>
                <div>
                    <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-ghost)', letterSpacing: '0.07em', textTransform: 'uppercase' as const, marginBottom: '5px' }}>Query key</label>
                    <input type="text" value={queryKeyName} onChange={(e) => setQueryKeyName(e.target.value)} placeholder="users" style={{ width: '100%', padding: '8px 10px', background: 'var(--bg-elevated)', border: '0.5px solid var(--border)', borderRadius: '7px', fontSize: '12px', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', outline: 'none' }} />
                </div>
                </div>

                {/* QUERY PARAMS */}
                <div>
                <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-ghost)', letterSpacing: '0.07em', textTransform: 'uppercase' as const, marginBottom: '5px' }}>
                    Query params <span style={{ color: 'var(--text-whisper)', textTransform: 'none' as const, letterSpacing: 0 }}>— one per line as name: type</span>
                </label>
                <textarea
                    value={queryParams}
                    onChange={(e) => setQueryParams(e.target.value)}
                    rows={3}
                    placeholder={'status: string\nlimit: number\nsearch: string'}
                    style={{ width: '100%', padding: '8px 10px', background: 'var(--bg-elevated)', border: '0.5px solid var(--border)', borderRadius: '7px', fontSize: '11px', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', outline: 'none', resize: 'none', lineHeight: 1.7 }}
                />
                </div>

                {/* RESPONSE JSON */}
                <div>
                <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-ghost)', letterSpacing: '0.07em', textTransform: 'uppercase' as const, marginBottom: '5px' }}>
                    Response JSON <span style={{ color: 'var(--text-whisper)', textTransform: 'none' as const, letterSpacing: 0 }}>— paste from Swagger</span>
                </label>
                <textarea
                    value={responseJson}
                    onChange={(e) => {
                    setResponseJson(e.target.value)
                    const iface = jsonToInterface(e.target.value, typeName)
                    setGeneratedInterface(iface)
                    }}
                    rows={4}
                    placeholder={'{\n  "id": 1,\n  "name": "John",\n  "email": "john@example.com"\n}'}
                    style={{ width: '100%', padding: '8px 10px', background: 'var(--bg-elevated)', border: `0.5px solid ${responseJson && !generatedInterface ? 'rgba(239,68,68,0.4)' : 'var(--border)'}`, borderRadius: '7px', fontSize: '11px', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', outline: 'none', resize: 'none', lineHeight: 1.7 }}
                />
                {responseJson && !generatedInterface && (
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#f87171', marginTop: '4px' }}>Invalid JSON — check syntax</p>
                )}
                {generatedInterface && (
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#4ade80', marginTop: '4px' }}>✓ Interface generated from JSON</p>
                )}
                </div>

                {/* REQUEST BODY — only for POST/PUT/PATCH */}
                {['POST', 'PUT', 'PATCH'].includes(method) && (
                <div>
                    <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-ghost)', letterSpacing: '0.07em', textTransform: 'uppercase' as const, marginBottom: '5px' }}>
                    Request body JSON <span style={{ color: 'var(--text-whisper)', textTransform: 'none' as const, letterSpacing: 0 }}>— paste from Swagger</span>
                    </label>
                    <textarea
                    value={requestBodyJson}
                    onChange={(e) => setRequestBodyJson(e.target.value)}
                    rows={3}
                    placeholder={'{\n  "name": "string",\n  "email": "string"\n}'}
                    style={{ width: '100%', padding: '8px 10px', background: 'var(--bg-elevated)', border: '0.5px solid var(--border)', borderRadius: '7px', fontSize: '11px', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', outline: 'none', resize: 'none', lineHeight: 1.7 }}
                    />
                </div>
                )}

                {/* OPTIONS */}
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' as const }}>
                {[
                    { label: 'Paginated', val: paginated, set: setPaginated, show: method === 'GET' },
                    { label: 'Enabled flag', val: enabledFlag, set: setEnabledFlag, show: true },
                    { label: 'staleTime', val: includeStaleTime, set: setIncludeStaleTime, show: method === 'GET' },
                ].filter(o => o.show).map((opt) => (
                    <label key={opt.label} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-dim)', cursor: 'pointer' }}>
                    <input type="checkbox" checked={opt.val} onChange={(e) => opt.set(e.target.checked)} />
                    {opt.label}
                    </label>
                ))}
                </div>
            </div>

            {/* RIGHT — OUTPUT */}
            <div style={{ background: '#0d0f14', border: '0.5px solid var(--border)', borderRadius: '8px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 14px', borderBottom: '0.5px solid rgba(255,255,255,0.06)', background: '#080a0e' }}>
                <div style={{ display: 'flex', gap: '5px' }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444', opacity: 0.7, display: 'inline-block' }} />
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#f59e0b', opacity: 0.7, display: 'inline-block' }} />
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', opacity: 0.7, display: 'inline-block' }} />
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#4b5280' }}>
                    use{capitalize(queryKeyName || 'hook')}.ts
                </span>
                <button
                    onClick={copyHook}
                    style={{ display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'var(--font-mono)', fontSize: '10px', color: copied ? '#4ade80' : '#f59e0b', background: 'none', border: 'none', cursor: 'pointer', padding: '2px 0' }}
                >
                    {copied ? '✓ Copied' : '⎘ Copy'}
                </button>
                </div>
                <div style={{ padding: '14px 16px', fontFamily: 'var(--font-mono)', fontSize: '11px', lineHeight: 1.85, overflowX: 'auto', overflowY: 'auto', maxHeight: '480px', flex: 1 }}>
                {highlightTS(generatedHook)}
                </div>
            </div>

            </div>
        </div>
        </div>

      </div>

      <style>{`
        @media (max-width: 768px) {
          .wcag-grid, .spec-grid, .tanstack-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

    </div>
  )
}