'use client'

import { useState } from 'react'

interface SpecificityToken {
  token: string
  type: 'id' | 'class' | 'pseudo-class' | 'attribute' | 'element' | 'pseudo-element' | 'universal'
  contribution: [number, number, number]
}

interface SpecificityResult {
  selector: string
  score: [number, number, number]
  tokens: SpecificityToken[]
}

function parseSpecificity(selector: string): SpecificityResult {
  const tokens: SpecificityToken[] = []
  let ids = 0, classes = 0, elements = 0
  const s = selector.trim()
  const parts = s.split(/\s*([>+~\s])\s*/).filter(Boolean)

  for (const part of parts) {
    if ([' ', '>', '+', '~'].includes(part.trim()) || part.trim() === '') continue

    const idMatches = part.match(/#[a-zA-Z_-][a-zA-Z0-9_-]*/g) || []
    for (const m of idMatches) { ids++; tokens.push({ token: m, type: 'id', contribution: [1, 0, 0] }) }

    const classMatches = part.match(/\.[a-zA-Z_-][a-zA-Z0-9_-]*/g) || []
    for (const m of classMatches) { classes++; tokens.push({ token: m, type: 'class', contribution: [0, 1, 0] }) }

    const attrMatches = part.match(/\[[^\]]+\]/g) || []
    for (const m of attrMatches) { classes++; tokens.push({ token: m, type: 'attribute', contribution: [0, 1, 0] }) }

    const pseudoElementMatches = part.match(/::[\w-]+/g) || []
    for (const m of pseudoElementMatches) { elements++; tokens.push({ token: m, type: 'pseudo-element', contribution: [0, 0, 1] }) }

    const strippedPseudo = part.replace(/::[\w-]+/g, '')
    const pseudoClassMatches = strippedPseudo.match(/:[\w-]+(\([^)]*\))?/g) || []
    for (const m of pseudoClassMatches) {
      if (!m.startsWith(':where')) { classes++ }
      tokens.push({ token: m, type: 'pseudo-class', contribution: m.startsWith(':where') ? [0, 0, 0] : [0, 1, 0] })
    }

    const stripped = part
      .replace(/#[a-zA-Z_-][a-zA-Z0-9_-]*/g, '')
      .replace(/\.[a-zA-Z_-][a-zA-Z0-9_-]*/g, '')
      .replace(/\[[^\]]+\]/g, '')
      .replace(/::[\w-]+/g, '')
      .replace(/:[\w-]+(\([^)]*\))?/g, '')
      .trim()

    if (stripped && stripped !== '*') {
      const tagMatches = stripped.match(/[a-zA-Z][a-zA-Z0-9-]*/g) || []
      for (const m of tagMatches) { elements++; tokens.push({ token: m, type: 'element', contribution: [0, 0, 1] }) }
    }
    if (stripped === '*') tokens.push({ token: '*', type: 'universal', contribution: [0, 0, 0] })
  }

  return { selector, score: [ids, classes, elements], tokens }
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

export default function SpecificityTool() {
  const [selectorInput, setSelectorInput] = useState('.nav > ul li.active:hover')
  const [multiMode, setMultiMode] = useState(false)
  const [multiInput, setMultiInput] = useState('.card .title\n#hero h1.lead\nh1 + p.intro')

  const singleResult = parseSpecificity(selectorInput)
  const multiResults = multiInput.split('\n').filter(s => s.trim()).map(parseSpecificity)

  return (
    <div style={{ padding: '24px' }}>
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
            <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-ghost)', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: '6px' }}>
              CSS selector
            </label>
            <input
              type="text"
              value={selectorInput}
              onChange={(e) => setSelectorInput(e.target.value)}
              placeholder=".nav > ul li.active"
              style={{ width: '100%', padding: '10px 13px', background: 'var(--bg-elevated)', border: '0.5px solid var(--border)', borderRadius: '8px', fontSize: '13px', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', outline: 'none', marginBottom: '16px' }}
            />

            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-ghost)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '8px' }}>
              Specificity score
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
              {[
                { label: 'IDs', val: singleResult.score[0], color: '#185FA5' },
                { label: 'Classes', val: singleResult.score[1], color: '#534AB7' },
                { label: 'Elements', val: singleResult.score[2], color: '#3B6D11' },
                { label: 'Total', val: `(${singleResult.score.join(',')})`, color: 'var(--text-primary)' },
              ].map((item) => (
                <div key={item.label} style={{ background: 'var(--bg-elevated)', border: '0.5px solid var(--border)', borderRadius: '8px', padding: '10px 8px', textAlign: 'center' }}>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: item.color, lineHeight: 1 }}>{item.val}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--text-ghost)', marginTop: '3px' }}>{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-ghost)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '8px' }}>
              Token breakdown
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', maxHeight: '280px', overflowY: 'auto' }}>
              {singleResult.tokens.length === 0 ? (
                <div style={{ padding: '20px', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-whisper)' }}>
                  Type a selector to see breakdown
                </div>
              ) : singleResult.tokens.map((token, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '7px 10px', background: 'var(--bg-elevated)', border: '0.5px solid var(--border)', borderRadius: '7px' }}>
                  <code style={{ fontSize: '12px', color: TYPE_COLORS[token.type], fontFamily: 'var(--font-mono)', minWidth: '80px' }}>{token.token}</code>
                  <span style={{ flex: 1, fontSize: '11px', color: 'var(--text-ghost)' }}>{TYPE_LABELS[token.type]}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-secondary)' }}>+({token.contribution.join(',')})</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }} className="spec-grid">
          <div>
            <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-ghost)', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: '6px' }}>
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
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-ghost)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '8px' }}>
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
                    <code style={{ flex: 1, fontSize: '12px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{result.selector}</code>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-primary)', flexShrink: 0 }}>({result.score.join(',')})</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}