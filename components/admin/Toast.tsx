'use client'

import { useEffect, useState } from 'react'

export type ToastType = 'success' | 'error' | 'loading'

export interface ToastMessage {
  id: string
  type: ToastType
  message: string
}

interface ToastProps {
  toasts: ToastMessage[]
  removeToast: (id: string) => void
}

export function Toast({ toasts, removeToast }: ToastProps) {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        zIndex: 9999,
        pointerEvents: 'none',
      }}
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>
  )
}

function ToastItem({ toast, onRemove }: { toast: ToastMessage; onRemove: (id: string) => void }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true))

    if (toast.type !== 'loading') {
      const timer = setTimeout(() => {
        setVisible(false)
        setTimeout(() => onRemove(toast.id), 300)
      }, 3500)
      return () => clearTimeout(timer)
    }
  }, [toast.id, toast.type, onRemove])

  const colors = {
    success: {
      bg: 'rgba(74,222,128,0.08)',
      border: 'rgba(74,222,128,0.25)',
      icon: '✓',
      iconColor: '#4ade80',
    },
    error: {
      bg: 'rgba(239,68,68,0.08)',
      border: 'rgba(239,68,68,0.25)',
      icon: '✗',
      iconColor: '#f87171',
    },
    loading: {
      bg: 'rgba(245,158,11,0.08)',
      border: 'rgba(245,158,11,0.25)',
      icon: '·',
      iconColor: '#f59e0b',
    },
  }

  const style = colors[toast.type]

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '12px 16px',
        background: '#0d0f14',
        border: `0.5px solid ${style.border}`,
        borderRadius: '8px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
        minWidth: '260px',
        maxWidth: '360px',
        pointerEvents: 'auto',
        transform: visible ? 'translateX(0)' : 'translateX(120%)',
        opacity: visible ? 1 : 0,
        transition: 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1), opacity 0.3s ease',
      }}
    >
      <div
        style={{
          width: '22px',
          height: '22px',
          borderRadius: '50%',
          background: style.bg,
          border: `0.5px solid ${style.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: toast.type === 'loading' ? '18px' : '11px',
          fontWeight: 700,
          color: style.iconColor,
          flexShrink: 0,
        }}
      >
        {toast.type === 'loading' ? (
          <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>⟳</span>
        ) : style.icon}
      </div>

      <span style={{ fontSize: '13px', color: '#e5e7eb', lineHeight: 1.4, flex: 1 }}>
        {toast.message}
      </span>

      {toast.type !== 'loading' && (
        <button
          onClick={() => {
            setVisible(false)
            setTimeout(() => onRemove(toast.id), 300)
          }}
          style={{
            background: 'none',
            border: 'none',
            color: '#4b5280',
            cursor: 'pointer',
            fontSize: '14px',
            padding: '0',
            lineHeight: 1,
            flexShrink: 0,
          }}
        >
          ×
        </button>
      )}
    </div>
  )
}

// ── HOOK ──────────────────────────────────────────────────────
export function useToast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const addToast = (message: string, type: ToastType = 'success'): string => {
    const id = Math.random().toString(36).slice(2)
    setToasts((prev) => [...prev, { id, type, message }])
    return id
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  const updateToast = (id: string, message: string, type: ToastType) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, message, type } : t))
    )
    if (type !== 'loading') {
      setTimeout(() => removeToast(id), 3500)
    }
  }

  const toast = {
    success: (message: string) => addToast(message, 'success'),
    error: (message: string) => addToast(message, 'error'),
    loading: (message: string) => {
      const id = addToast(message, 'loading')
      return {
        success: (msg: string) => updateToast(id, msg, 'success'),
        error: (msg: string) => updateToast(id, msg, 'error'),
      }
    },
  }

  return { toasts, removeToast, toast }
}

// ── CONFIRM MODAL ─────────────────────────────────────────────
interface ConfirmModalProps {
  isOpen: boolean
  title: string
  message: string
  confirmLabel?: string
  onConfirm: () => void
  onCancel: () => void
  loading?: boolean
}

export function ConfirmModal({
  isOpen,
  title,
  message,
  confirmLabel = 'Delete',
  onConfirm,
  onCancel,
  loading = false,
}: ConfirmModalProps) {
  if (!isOpen) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9998,
        padding: '24px',
      }}
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--bg-surface)',
          border: '0.5px solid var(--border)',
          borderRadius: '12px',
          padding: '24px',
          width: '100%',
          maxWidth: '400px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        }}
      >
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'rgba(239,68,68,0.1)',
            border: '0.5px solid rgba(239,68,68,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            marginBottom: '16px',
          }}
        >
          🗑️
        </div>

        <div
          style={{
            fontSize: '16px',
            fontWeight: 700,
            color: 'var(--text-primary)',
            marginBottom: '8px',
            letterSpacing: '-0.01em',
          }}
        >
          {title}
        </div>

        <p
          style={{
            fontSize: '13px',
            color: 'var(--text-dim)',
            lineHeight: 1.65,
            marginBottom: '24px',
          }}
        >
          {message}
        </p>

        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <button
            onClick={onCancel}
            disabled={loading}
            style={{
              padding: '9px 18px',
              background: 'transparent',
              border: '0.5px solid var(--border)',
              borderRadius: '7px',
              fontSize: '13px',
              color: 'var(--text-dim)',
              cursor: 'pointer',
              fontFamily: 'var(--font-sans)',
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            style={{
              padding: '9px 18px',
              background: loading ? 'rgba(239,68,68,0.3)' : 'rgba(239,68,68,0.9)',
              border: 'none',
              borderRadius: '7px',
              fontSize: '13px',
              fontWeight: 700,
              color: '#fff',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'var(--font-sans)',
              minWidth: '80px',
            }}
          >
            {loading ? 'Deleting...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}