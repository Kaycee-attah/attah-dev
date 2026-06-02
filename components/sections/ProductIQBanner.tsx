'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export default function ProductIQBanner() {
  const bannerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!bannerRef.current) return
    gsap.fromTo(
      bannerRef.current,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', delay: 0.8 }
    )
  }, [])

  return (
    <div
      ref={bannerRef}
      style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 24px',
        opacity: 0,
      }}
    >
      <Link
        href="/tools/business-builder"
        style={{ textDecoration: 'none', display: 'block' }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            padding: '14px 20px',
            background: 'rgba(245,158,11,0.04)',
            border: '0.5px solid rgba(245,158,11,0.15)',
            borderRadius: '10px',
            cursor: 'pointer',
            transition: 'border-color var(--transition), background var(--transition)',
            flexWrap: 'wrap',
          }}
          className="productiq-banner"
        >
          {/* LEFT */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(245,158,11,0.1)',
                border: '0.5px solid rgba(245,158,11,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                flexShrink: 0,
              }}
            >
              🧠
            </div>
            <div>
              <div
                style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  marginBottom: '1px',
                }}
              >
                Not sure what to build for your business?
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  color: 'var(--text-ghost)',
                }}
              >
                ProductIQ → Free personalised product strategy in 5 minutes
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              flexShrink: 0,
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                padding: '3px 8px',
                borderRadius: '3px',
                background: 'rgba(74,222,128,0.08)',
                border: '0.5px solid rgba(74,222,128,0.2)',
                color: '#4ade80',
              }}
            >
              Free · No sign-up
            </span>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '13px',
                color: 'var(--amber)',
              }}
            >
              →
            </span>
          </div>
        </div>
      </Link>

      <style>{`
        .productiq-banner:hover {
          border-color: rgba(245,158,11,0.35) !important;
          background: rgba(245,158,11,0.07) !important;
        }
      `}</style>
    </div>
  )
}