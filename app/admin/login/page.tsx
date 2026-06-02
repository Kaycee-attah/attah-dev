'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })

    if (res.ok) {
      router.push('/admin')
      router.refresh()
    } else {
      setError('Invalid password.')
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-base)',
        padding: '24px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '360px',
        }}
      >
        {/* LOGO */}
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '16px',
            fontWeight: 500,
            color: 'var(--text-primary)',
            marginBottom: '32px',
            textAlign: 'center',
          }}
        >
          attah<span style={{ color: 'var(--amber)' }}>.dev</span>
          <span
            style={{
              display: 'block',
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              color: 'var(--text-ghost)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginTop: '4px',
            }}
          >
            Admin
          </span>
        </div>

        {/* CARD */}
        <div
          style={{
            background: 'var(--bg-surface)',
            border: '0.5px solid var(--border)',
            borderRadius: '12px',
            padding: '28px',
          }}
        >
          <h1
            style={{
              fontSize: '18px',
              fontWeight: 700,
              color: 'var(--text-primary)',
              letterSpacing: '-0.01em',
              marginBottom: '4px',
            }}
          >
            Sign in
          </h1>
          <p
            style={{
              fontSize: '13px',
              color: 'var(--text-ghost)',
              marginBottom: '24px',
            }}
          >
            Enter your admin password to continue
          </p>

          <form onSubmit={handleLogin}>
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
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                autoFocus
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  background: 'var(--bg-elevated)',
                  border: `0.5px solid ${error ? 'rgba(239,68,68,0.4)' : 'var(--border)'}`,
                  borderRadius: '8px',
                  fontSize: '13px',
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-sans)',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
              {error && (
                <p
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    color: '#f87171',
                    marginTop: '6px',
                  }}
                >
                  {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !password}
              style={{
                width: '100%',
                padding: '11px',
                background: password && !loading ? 'var(--amber)' : 'var(--bg-elevated)',
                color: password && !loading ? 'var(--bg-base)' : 'var(--text-whisper)',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 700,
                cursor: password && !loading ? 'pointer' : 'not-allowed',
                fontFamily: 'var(--font-sans)',
              }}
            >
              {loading ? 'Signing in...' : 'Sign in →'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}