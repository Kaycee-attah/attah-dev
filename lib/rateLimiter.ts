// ─── RATE LIMITER ─────────────────────────────────────────────
// In-memory rate limiter using a Map.
// Resets on server restart — designed to prevent burst abuse,
// not track limits across days.
//
// Usage:
//   const result = rateLimit(ip, 'productiq', 5, 60 * 60 * 1000)
//   if (!result.allowed) return 429 response

interface RateLimitEntry {
  count: number
  resetAt: number
}

// Store: key = `${identifier}:${ip}`, value = entry
const store = new Map<string, RateLimitEntry>()

// Clean up expired entries every 10 minutes
// Prevents memory leak on long-running servers
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of store.entries()) {
    if (entry.resetAt < now) store.delete(key)
  }
}, 10 * 60 * 1000)

/**
 * Check and increment rate limit for a given IP and identifier.
 *
 * @param ip          - The client IP address
 * @param identifier  - Which route/action (e.g. 'productiq', 'commit')
 * @param limit       - Max requests allowed in the window
 * @param windowMs    - Time window in milliseconds
 * @returns           - { allowed: boolean, remaining: number, resetAt: number }
 */
export function rateLimit(
  ip: string,
  identifier: string,
  limit: number,
  windowMs: number
): { allowed: boolean; remaining: number; resetAt: number } {
  const key = `${identifier}:${ip}`
  const now = Date.now()

  const entry = store.get(key)

  // No entry or window expired — start fresh
  if (!entry || entry.resetAt < now) {
    store.set(key, { count: 1, resetAt: now + windowMs })
    return { allowed: true, remaining: limit - 1, resetAt: now + windowMs }
  }

  // Within window — check count
  if (entry.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt }
  }

  // Within window and under limit — increment
  entry.count++
  store.set(key, entry)

  return {
    allowed: true,
    remaining: limit - entry.count,
    resetAt: entry.resetAt,
  }
}

/**
 * Get the client IP from a Next.js request.
 * Handles Vercel's x-forwarded-for header.
 */
export function getClientIp(req: Request): string {
  const forwarded = (req.headers as Headers).get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  return 'unknown'
}

// ─── RATE LIMIT CONFIGS ───────────────────────────────────────
// Central place to manage all rate limits across the app

export const RATE_LIMITS = {
  productiq: {
    limit: 5,              // 5 complete sessions
    windowMs: 60 * 60 * 1000, // per hour
    message: 'You have reached the limit of 5 ProductIQ sessions per hour. Please try again later.',
  },
  commit: {
    limit: 10,             // 10 requests
    windowMs: 60 * 60 * 1000, // per hour
    message: 'You have reached the limit of 10 commit generations per hour. Please try again later.',
  },
} as const