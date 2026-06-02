'use client'

import { useState, useCallback } from 'react'

type CommitType = 'auto' | 'feat' | 'fix' | 'refactor' | 'chore' | 'docs' | 'style' | 'test' | 'perf' | 'ci' | 'build' | 'revert'

interface CommitResult {
  type: string
  scope: string
  subject: string
  body: string[]
  breaking: boolean
  breakingDescription: string
  fullMessage: string
}

const TYPE_COLORS: Record<string, string> = {
  feat: '#4ade80',
  fix: '#f87171',
  refactor: '#60a5fa',
  chore: '#9ca3af',
  docs: '#c084fc',
  style: '#f59e0b',
  test: '#34d399',
  perf: '#fb923c',
  ci: '#67e8f9',
  build: '#a78bfa',
  revert: '#f43f5e',
}

const COMMIT_TYPES: CommitType[] = [
  'auto', 'feat', 'fix', 'refactor', 'chore',
  'docs', 'style', 'test', 'perf', 'ci', 'build', 'revert',
]

const TYPE_DESCRIPTIONS: Record<string, string> = {
  feat: 'New feature',
  fix: 'Bug fix',
  refactor: 'Code restructure',
  chore: 'Maintenance',
  docs: 'Documentation',
  style: 'Formatting only',
  test: 'Tests',
  perf: 'Performance',
  ci: 'CI/CD changes',
  build: 'Build system',
  revert: 'Revert commit',
}

export default function CommitGenerator() {
  const [mode, setMode] = useState<'diff' | 'describe'>('describe')
  const [input, setInput] = useState('')
  const [typeOverride, setTypeOverride] = useState<CommitType>('auto')
  const [scopeOverride, setScopeOverride] = useState('')
  const [includeBody, setIncludeBody] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<CommitResult | null>(null)
  const [editedMessage, setEditedMessage] = useState('')
  const [copied, setCopied] = useState(false)
  const [regenerating, setRegenerating] = useState(false)

  const generate = useCallback(async (shortOnly = false) => {
    if (!input.trim() || input.trim().length < 10) {
      setError('Please provide more detail before generating.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/commit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input,
          mode,
          typeOverride,
          scopeOverride,
          includeBody: shortOnly ? false : includeBody,
        }),
      })

      const data = await res.json()

      if (res.status === 429) {
        setError(data.error || 'Too many requests. Please try again in an hour.')
        return
      }

      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.')
        return
      }

      setResult(data.commit)
      setEditedMessage(data.commit.fullMessage)
    } catch {
      setError('Failed to connect. Please try again.')
    } finally {
      setLoading(false)
      setRegenerating(false)
    }
  }, [input, mode, typeOverride, scopeOverride, includeBody])

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(editedMessage)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [editedMessage])

  const handleRegenerate = useCallback(() => {
    setRegenerating(true)
    generate()
  }, [generate])

  const handleMakeShorter = useCallback(() => {
    setRegenerating(true)
    generate(true)
  }, [generate])

  const typeColor = result ? (TYPE_COLORS[result.type] || 'var(--amber)') : 'var(--amber)'

  return (
    <div style={{ padding: '24px' }}>
      {/* MODE TOGGLE */}
      <div style={{ display: 'flex', gap: '0', border: '0.5px solid var(--border)', borderRadius: '8px', overflow: 'hidden', width: 'fit-content', marginBottom: '20px' }}>
        {[
          { key: 'describe', label: 'Describe changes' },
          { key: 'diff', label: 'Paste git diff' },
        ].map((tab, i, arr) => (
          <button
            key={tab.key}
            onClick={() => { setMode(tab.key as 'diff' | 'describe'); setResult(null); setError('') }}
            style={{
              padding: '8px 18px',
              fontSize: '12px',
              fontFamily: 'var(--font-mono)',
              border: 'none',
              borderRight: i < arr.length - 1 ? '0.5px solid var(--border)' : 'none',
              background: mode === tab.key ? 'var(--amber)' : 'var(--bg-elevated)',
              color: mode === tab.key ? 'var(--bg-base)' : 'var(--text-ghost)',
              cursor: 'pointer',
              fontWeight: mode === tab.key ? 700 : 400,
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }} className="commit-grid">

        {/* LEFT — INPUT */}
        <div>
          <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-ghost)', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: '6px' }}>
            {mode === 'diff' ? 'Git diff output' : 'What did you change?'}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={10}
            placeholder={mode === 'diff'
              ? 'Paste your git diff here...\n\ndiff --git a/components/Dropdown.tsx b/components/Dropdown.tsx\n@@ -12,6 +12,14 @@\n+  useEffect(() => {\n+    document.addEventListener(\'mousedown\', handleClick)\n+  }, [])'
              : 'Describe what you changed in plain English...\n\nExamples:\n— Fixed the dropdown not closing when clicking outside\n— Added dark mode toggle to the navbar\n— Refactored the auth flow to use a custom hook\n— Updated dependencies and fixed security vulnerabilities'
            }
            style={{ width: '100%', padding: '12px 14px', background: 'var(--bg-elevated)', border: '0.5px solid var(--border)', borderRadius: '8px', fontSize: mode === 'diff' ? '11px' : '13px', color: 'var(--text-primary)', fontFamily: mode === 'diff' ? 'var(--font-mono)' : 'var(--font-sans)', outline: 'none', resize: 'vertical', lineHeight: 1.65, boxSizing: 'border-box' }}
          />

          {/* CONFIG */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '12px', marginBottom: '14px' }}>
            <div>
              <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-ghost)', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: '5px' }}>
                Commit type
              </label>
              <select
                value={typeOverride}
                onChange={(e) => setTypeOverride(e.target.value as CommitType)}
                style={{ width: '100%', padding: '8px 10px', background: 'var(--bg-elevated)', border: '0.5px solid var(--border)', borderRadius: '7px', fontSize: '12px', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', outline: 'none' }}
              >
                <option value="auto">Auto-detect</option>
                {COMMIT_TYPES.filter(t => t !== 'auto').map(t => (
                  <option key={t} value={t}>{t} — {TYPE_DESCRIPTIONS[t]}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-ghost)', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: '5px' }}>
                Scope override
              </label>
              <input
                type="text"
                value={scopeOverride}
                onChange={(e) => setScopeOverride(e.target.value)}
                placeholder="e.g. auth, navbar, api"
                style={{ width: '100%', padding: '8px 10px', background: 'var(--bg-elevated)', border: '0.5px solid var(--border)', borderRadius: '7px', fontSize: '12px', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-dim)', cursor: 'pointer', marginBottom: '14px' }}>
            <input
              type="checkbox"
              checked={includeBody}
              onChange={(e) => setIncludeBody(e.target.checked)}
            />
            Include body with bullet points
          </label>

          <button
            onClick={() => generate()}
            disabled={loading || !input.trim()}
            style={{
              width: '100%',
              padding: '11px',
              background: (loading || !input.trim()) ? 'var(--bg-elevated)' : 'var(--amber)',
              color: (loading || !input.trim()) ? 'var(--text-whisper)' : 'var(--bg-base)',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 700,
              cursor: (loading || !input.trim()) ? 'not-allowed' : 'pointer',
              fontFamily: 'var(--font-sans)',
            }}
          >
            {loading ? 'Generating...' : 'Generate commit message →'}
          </button>

          {error && (
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#f87171', marginTop: '8px', lineHeight: 1.5 }}>
              {error}
            </p>
          )}

          {/* TYPE REFERENCE */}
          <div style={{ marginTop: '20px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-ghost)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '8px' }}>
              Commit type reference
            </div>
            <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
              {Object.entries(TYPE_DESCRIPTIONS).map(([type, desc]) => (
                <div
                  key={type}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '3px 8px',
                    background: 'var(--bg-elevated)',
                    border: '0.5px solid var(--border)',
                    borderRadius: '4px',
                  }}
                >
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: TYPE_COLORS[type] || 'var(--text-secondary)' }}>{type}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-whisper)' }}>{desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT — OUTPUT */}
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-ghost)', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: '8px' }}>
            Generated commit
          </div>

          {/* VS CODE STYLE OUTPUT BOX */}
          <div style={{ background: '#0d0f14', border: `0.5px solid ${result ? 'rgba(245,158,11,0.2)' : 'var(--border)'}`, borderRadius: '8px', overflow: 'hidden', marginBottom: '10px' }}>
            {/* TITLE BAR */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 12px', background: '#080a0e', borderBottom: '0.5px solid rgba(255,255,255,0.06)' }}>
              <div style={{ display: 'flex', gap: '5px' }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#ef4444', opacity: 0.7, display: 'inline-block' }} />
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#f59e0b', opacity: 0.7, display: 'inline-block' }} />
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', opacity: 0.7, display: 'inline-block' }} />
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#4b5280' }}>COMMIT_EDITMSG</span>
              {result && (
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: '#4ade80' }}>editable</span>
              )}
            </div>

            {/* CONTENT */}
            {!result && !loading ? (
              <div style={{ padding: '24px 16px', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#2d3148', lineHeight: 1.7 }}>
                Your commit message will appear here.<br />
                Describe your changes and click generate.
              </div>
            ) : loading ? (
              <div style={{ padding: '24px 16px', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#4b5280' }}>
                Generating...
              </div>
            ) : (
              <textarea
                value={editedMessage}
                onChange={(e) => setEditedMessage(e.target.value)}
                rows={10}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  background: 'transparent',
                  border: 'none',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                  color: '#e5e7eb',
                  lineHeight: 1.85,
                  resize: 'none',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            )}
          </div>

          {/* PARSED PREVIEW */}
          {result && !loading && (
            <div style={{ background: 'var(--bg-elevated)', border: '0.5px solid var(--border)', borderRadius: '8px', padding: '10px 14px', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: typeColor, fontWeight: 700 }}>
                  {result.type}
                </span>
                {result.scope && (
                  <>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-ghost)' }}>(</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#c084fc' }}>{result.scope}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-ghost)' }}>)</span>
                  </>
                )}
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-ghost)' }}>:</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-primary)' }}>{result.subject}</span>
                {result.breaking && (
                  <span style={{ padding: '2px 6px', background: 'rgba(239,68,68,0.1)', border: '0.5px solid rgba(239,68,68,0.3)', borderRadius: '3px', fontFamily: 'var(--font-mono)', fontSize: '9px', color: '#f87171' }}>
                    BREAKING
                  </span>
                )}
              </div>
            </div>
          )}

          {/* ACTION BUTTONS */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {result && (
              <>
                <button
                  onClick={handleMakeShorter}
                  disabled={regenerating}
                  style={{ flex: 1, padding: '9px', background: 'var(--bg-elevated)', border: '0.5px solid var(--border)', borderRadius: '7px', fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)', cursor: 'pointer' }}
                >
                  {regenerating ? '...' : 'Make it shorter'}
                </button>
                <button
                  onClick={handleRegenerate}
                  disabled={regenerating}
                  style={{ flex: 1, padding: '9px', background: 'var(--bg-elevated)', border: '0.5px solid var(--border)', borderRadius: '7px', fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)', cursor: 'pointer' }}
                >
                  {regenerating ? '...' : '↺ Regenerate'}
                </button>
              </>
            )}
            <button
              onClick={handleCopy}
              disabled={!result && !editedMessage}
              style={{
                flex: result ? 1 : 'auto',
                width: result ? 'auto' : '100%',
                padding: '9px 16px',
                background: copied ? 'rgba(74,222,128,0.1)' : (result ? 'var(--amber)' : 'var(--bg-elevated)'),
                color: copied ? '#4ade80' : (result ? 'var(--bg-base)' : 'var(--text-whisper)'),
                border: copied ? '0.5px solid rgba(74,222,128,0.3)' : 'none',
                borderRadius: '7px',
                fontSize: '12px',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                cursor: result ? 'pointer' : 'not-allowed',
              }}
            >
              {copied ? '✓ Copied' : '⎘ Copy'}
            </button>
          </div>

          {result && (
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-whisper)', marginTop: '8px', textAlign: 'right' }}>
              Click the commit message above to edit before copying
            </p>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .commit-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}