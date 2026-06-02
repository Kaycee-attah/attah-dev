import { NextRequest, NextResponse } from 'next/server'
import { rateLimit, getClientIp, RATE_LIMITS } from '@/lib/rateLimiter'

const COMMIT_SYSTEM_PROMPT = `You are an expert at writing conventional commit messages for software projects.

Your job is to generate a properly formatted conventional commit message based on either:
1. A git diff showing exactly what changed in the code
2. A plain English description of what was changed

CONVENTIONAL COMMIT FORMAT:
<type>(<scope>): <subject>

<body>

RULES:
- type must be one of: feat, fix, refactor, chore, docs, style, test, perf, ci, build, revert
- scope is optional but recommended — it's the area of the codebase affected (e.g. auth, dropdown, api, navbar)
- subject must be lowercase, no period at the end, max 72 characters
- subject must be in imperative mood ("add feature" not "added feature" or "adds feature")
- body is optional but should be included when the change needs explanation
- body bullet points start with "- " and explain WHAT and WHY, not HOW
- if it's a breaking change add "BREAKING CHANGE: <description>" at the end

AUTO-DETECT RULES:
- If the change adds new functionality → feat
- If the change fixes a bug → fix
- If the change restructures code without changing behavior → refactor
- If the change updates dependencies, config, or tooling → chore
- If the change only affects documentation → docs
- If the change only affects formatting/whitespace → style
- If the change adds or updates tests → test
- If the change improves performance → perf

SCOPE AUTO-DETECTION:
- Look at file paths or component names in the diff
- Use the most specific relevant scope
- If multiple unrelated files changed, omit scope

Return ONLY valid JSON, no other text:
{
  "type": "fix",
  "scope": "dropdown",
  "subject": "close on outside click",
  "body": ["add document-level mousedown listener", "use ref.current.contains() to check click target", "clean up listener on unmount via useEffect return"],
  "breaking": false,
  "breakingDescription": "",
  "fullMessage": "fix(dropdown): close on outside click\\n\\n- add document-level mousedown listener\\n- use ref.current.contains() to check click target\\n- clean up listener on unmount via useEffect return"
}`

export async function POST(req: NextRequest) {
  try {
    const { input, mode, typeOverride, scopeOverride, includeBody } = await req.json()

    if (!input || input.trim().length < 10) {
      return NextResponse.json(
        { error: 'Please provide more detail — at least 10 characters.' },
        { status: 400 }
      )
    }

    // ── RATE LIMITING ────────────────────────────────────────────
    const ip = getClientIp(req)
    const { allowed, resetAt } = rateLimit(
      ip,
      'commit',
      RATE_LIMITS.commit.limit,
      RATE_LIMITS.commit.windowMs,
    )

    if (!allowed) {
      return NextResponse.json(
        {
          error: RATE_LIMITS.commit.message,
          resetAt: new Date(resetAt).toISOString(),
        },
        { status: 429 }
      )
    }

    // ── TRUNCATE LARGE DIFFS ─────────────────────────────────────
    const truncatedInput = input.length > 6000
      ? input.slice(0, 6000) + '\n\n[diff truncated for length]'
      : input

    const userMessage = `
Mode: ${mode === 'diff' ? 'Git diff' : 'Plain English description'}
${typeOverride !== 'auto' ? `Force type: ${typeOverride}` : ''}
${scopeOverride ? `Force scope: ${scopeOverride}` : ''}
${!includeBody ? 'Generate subject line only — no body.' : 'Include body with bullet points.'}

Input:
${truncatedInput}
`

    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured.' },
        { status: 500 }
      )
    }

    const groqResponse = await fetch(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: COMMIT_SYSTEM_PROMPT },
            { role: 'user', content: userMessage },
          ],
          max_tokens: 512,
          temperature: 0.3,
        }),
      }
    )

    const data = await groqResponse.json()

    if (!groqResponse.ok) {
      return NextResponse.json(
        { error: data.error?.message || 'Failed to generate commit message.' },
        { status: 500 }
      )
    }

    const text = data.choices?.[0]?.message?.content || ''
    const clean = text.replace(/```json|```/g, '').trim()

    try {
      const parsed = JSON.parse(clean)
      return NextResponse.json({ commit: parsed }, { status: 200 })
    } catch {
      return NextResponse.json(
        { error: 'Failed to parse commit message. Please try again.' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Commit generator error:', error)
    return NextResponse.json(
      { error: 'Failed to generate commit message.' },
      { status: 500 }
    )
  }
}