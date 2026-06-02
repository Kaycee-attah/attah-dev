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
    // Slide in
    requestAnimationFrame(() => setVisible(true))

    // Auto-dismiss after 3.5s for success/error
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
      {/* ICON */}
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
          animation: toast.type === 'loading' ? 'spin 1s linear infinite' : 'none',
        }}
      >
        {toast.type === 'loading' ? (
          <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>⟳</span>
        ) : style.icon}
      </div>

      {/* MESSAGE */}
      <span
        style={{
          fontSize: '13px',
          color: '#e5e7eb',
          lineHeight: 1.4,
          flex: 1,
        }}
      >
        {toast.message}
      </span>

      {/* CLOSE */}
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
    // Auto-dismiss after update
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