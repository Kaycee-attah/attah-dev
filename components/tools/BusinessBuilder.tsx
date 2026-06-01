'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import {
  phase1Questions,
  phase2SystemPrompt,
  resultsSystemPrompt,
} from '@/lib/data/business-builder'

// ─── TYPES ────────────────────────────────────────────────────
type Phase = 'intro' | 'phase1' | 'transition' | 'phase2' | 'generating' | 'results'

interface FollowUpQuestion {
  id: string
  observation: string
  question: string
  options: string[]
  placeholder: string
}

interface Results {
  businessName: {
    recommended: string
    alternatives: string[]
    reasoning: string
  }
  platform: {
    recommendation: string
    reasoning: string
    developerMistake: string
  }
  monetisation: Array<{ period: string; action: string }>
  firstThreeToBuild: Array<{ number: string; title: string; description: string }>
  unfairAdvantage: string
  attahNote: string
}

// ─── HELPERS ──────────────────────────────────────────────────
async function callClaude(systemPrompt: string, userMessage: string): Promise<string> {
  const response = await fetch('/api/productiq', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ systemPrompt, userMessage }),
  })

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`)
  }

  const data = await response.json()
  const clean = (data.text || '').replace(/```json|```/g, '').trim()
  return clean
}

// ─── SHARED STYLES ────────────────────────────────────────────
const cardStyle = {
  background: 'var(--bg-surface)',
  border: '0.5px solid var(--border)',
  borderRadius: '12px',
  overflow: 'hidden',
} as const

const labelStyle = {
  display: 'block',
  fontFamily: 'var(--font-mono)',
  fontSize: '9px',
  color: 'var(--text-ghost)',
  letterSpacing: '0.06em',
  textTransform: 'uppercase' as const,
  marginBottom: '4px',
}

// ─── BUSINESS BUILDER ─────────────────────────────────────────
export default function BusinessBuilder() {
  const [phase, setPhase] = useState<Phase>('intro')
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [currentAnswer, setCurrentAnswer] = useState('')
  const [otherText, setOtherText] = useState('')

  // Phase 2
  const [followUps, setFollowUps] = useState<FollowUpQuestion[]>([])
  const [currentFollowUp, setCurrentFollowUp] = useState(0)
  const [followUpAnswers, setFollowUpAnswers] = useState<Record<string, string>>({})
  const [followUpAnswer, setFollowUpAnswer] = useState('')
  const [followUpOther, setFollowUpOther] = useState('')
  const [chatMessages, setChatMessages] = useState<Array<{
    type: 'agent' | 'user'
    text: string
    isTyping?: boolean
  }>>([])
  const [isTyping, setIsTyping] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  // Results
  const [results, setResults] = useState<Results | null>(null)
  const [error, setError] = useState('')

  // Scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages, isTyping])

  // ── PHASE 1 HANDLERS ────────────────────────────────────────
  const currentQuestion = phase1Questions[currentQ]

  const handleOptionSelect = (option: string) => {
    setCurrentAnswer(option)
    setOtherText('')
  }

  const handlePhase1Next = () => {
    const finalAnswer = otherText.trim() || currentAnswer
    if (!finalAnswer) return

    const newAnswers = { ...answers, [currentQuestion.id]: finalAnswer }
    setAnswers(newAnswers)
    setCurrentAnswer('')
    setOtherText('')

    if (currentQ < phase1Questions.length - 1) {
      setCurrentQ(currentQ + 1)
    } else {
      setPhase('transition')
      setTimeout(() => startPhase2(newAnswers), 3000)
    }
  }

  const handlePhase1Back = () => {
    if (currentQ > 0) {
      setCurrentQ(currentQ - 1)
      const prevQ = phase1Questions[currentQ - 1]
      setCurrentAnswer(answers[prevQ.id] || '')
    }
  }

  // ── PHASE 2 HANDLERS ────────────────────────────────────────
  const startPhase2 = useCallback(async (phase1Answers: Record<string, string>) => {
    setPhase('phase2')
    setIsTyping(true)

    try {
      const systemPrompt = phase2SystemPrompt(phase1Answers)
      const raw = await callClaude(systemPrompt, 'Generate the follow-up questions now.')
      const parsed = JSON.parse(raw)
      const questions: FollowUpQuestion[] = parsed.questions

      setFollowUps(questions)
      setIsTyping(false)

      // Show first question as chat message
      setChatMessages([
        {
          type: 'agent',
          text: `${questions[0].observation} **${questions[0].question}**`,
        },
      ])
    } catch (e) {
      setError('Something went wrong generating follow-up questions. Please try again.')
      setIsTyping(false)
    }
  }, [])

  const handleFollowUpAnswer = async () => {
    const finalAnswer = followUpOther.trim() || followUpAnswer
    if (!finalAnswer) return

    const question = followUps[currentFollowUp]
    const newFollowUpAnswers = { ...followUpAnswers, [question.id]: finalAnswer }
    setFollowUpAnswers(newFollowUpAnswers)

    // Add user message to chat
    setChatMessages((prev) => [...prev, { type: 'user', text: finalAnswer }])
    setFollowUpAnswer('')
    setFollowUpOther('')

    if (currentFollowUp < followUps.length - 1) {
      // Show next question
      setIsTyping(true)
      await new Promise((r) => setTimeout(r, 1200))
      setIsTyping(false)

      const nextQ = followUps[currentFollowUp + 1]
      setChatMessages((prev) => [
        ...prev,
        {
          type: 'agent',
          text: `${nextQ.observation} **${nextQ.question}**`,
        },
      ])
      setCurrentFollowUp(currentFollowUp + 1)
    } else {
      // All follow-ups done — generate results
      setIsTyping(true)
      await new Promise((r) => setTimeout(r, 800))
      setIsTyping(false)

      setChatMessages((prev) => [
        ...prev,
        {
          type: 'agent',
          text: "Perfect. I have everything I need. Give me a moment to put together your complete product strategy...",
        },
      ])

      await new Promise((r) => setTimeout(r, 2000))
      generateResults({ ...answers, ...newFollowUpAnswers })
    }
  }

  const generateResults = async (allAnswers: Record<string, string>) => {
    setPhase('generating')
    try {
      const systemPrompt = resultsSystemPrompt(allAnswers)
      const raw = await callClaude(systemPrompt, 'Generate the complete product strategy now.')
      const parsed = JSON.parse(raw)
      setResults(parsed)
      setPhase('results')
    } catch (e) {
      setError('Something went wrong generating your strategy. Please try again.')
      setPhase('phase2')
    }
  }

  const resetAll = () => {
    setPhase('intro')
    setCurrentQ(0)
    setAnswers({})
    setCurrentAnswer('')
    setOtherText('')
    setFollowUps([])
    setCurrentFollowUp(0)
    setFollowUpAnswers({})
    setFollowUpAnswer('')
    setFollowUpOther('')
    setChatMessages([])
    setResults(null)
    setError('')
  }

  // ── RENDER ──────────────────────────────────────────────────
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>

      {/* ── BACK NAV ─────────────────────────────────────────── */}
      <div style={{ padding: '20px 0', borderBottom: '0.5px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/tools" style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-ghost)', textDecoration: 'none' }}>
          ← All tools
        </Link>
        {phase !== 'intro' && phase !== 'results' && (
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-whisper)' }}>
            {phase === 'phase1' ? `Phase 1 of 3 — Foundation · Q${currentQ + 1} of 8` :
             phase === 'transition' ? 'Analysing your answers...' :
             phase === 'phase2' ? `Phase 2 of 3 — Deep dive · Q${currentFollowUp + 1} of ${followUps.length}` :
             'Generating your strategy...'}
          </span>
        )}
      </div>

      {/* ── INTRO ────────────────────────────────────────────── */}
      {phase === 'intro' && (
        <div style={{ padding: '52px 0 80px', maxWidth: '640px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
            <span style={{ width: '32px', height: '1px', background: 'var(--amber)', display: 'inline-block' }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--amber)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Free tool</span>
          </div>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text-primary)', lineHeight: 1.0, marginBottom: '6px' }}>
            ProductIQ
          </h1>
          <h2 style={{ fontSize: 'clamp(20px, 3vw, 28px)', fontWeight: 300, fontStyle: 'italic', color: 'var(--text-muted)', letterSpacing: '-0.02em', marginBottom: '16px' }}>
            What should you build?
          </h2>
          <p style={{ fontSize: '15px', lineHeight: 1.75, color: 'var(--text-dim)', marginBottom: '28px' }}>
            Answer 8 questions about your business. Get a personalised product strategy — platform recommendation, business name ideas, monetisation roadmap, and your first 3 things to build. Powered by AI, reviewed through the lens of someone who builds these things in production.
          </p>

          {/* HOW IT WORKS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '32px' }}>
            {[
              { phase: '01', label: 'Foundation', desc: '8 questions about your business — fast, structured', color: 'var(--amber)' },
              { phase: '02', label: 'Deep dive', desc: 'AI-generated follow-up questions specific to your situation', color: '#60a5fa' },
              { phase: '03', label: 'Your strategy', desc: 'A complete product brief — view only, personalised to you', color: '#4ade80' },
            ].map((step) => (
              <div key={step.phase} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '12px 16px', background: 'var(--bg-surface)', border: '0.5px solid var(--border)', borderRadius: '8px' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: step.color, fontWeight: 700, flexShrink: 0 }}>{step.phase}</span>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1px' }}>{step.label}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-ghost)' }}>{step.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setPhase('phase1')}
            style={{ padding: '14px 32px', background: 'var(--amber)', color: 'var(--bg-base)', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}
          >
            Start — it takes 5 minutes →
          </button>
        </div>
      )}

      {/* ── PHASE 1 ──────────────────────────────────────────── */}
      {phase === 'phase1' && currentQuestion && (
        <div style={{ padding: '32px 0 80px', display: 'grid', gridTemplateColumns: '1fr 280px', gap: '28px', alignItems: 'start' }} className="builder-grid">

          {/* LEFT */}
          <div>
            {/* STEP BAR */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0', marginBottom: '24px' }}>
              {phase1Questions.map((_, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{
                    width: '24px', height: '24px', borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 700,
                    flexShrink: 0,
                    background: i < currentQ ? 'var(--bg-elevated)' : i === currentQ ? 'var(--amber)' : 'var(--bg-elevated)',
                    color: i < currentQ ? '#4ade80' : i === currentQ ? 'var(--bg-base)' : 'var(--text-whisper)',
                    border: i < currentQ ? '1px solid rgba(74,222,128,0.3)' : i === currentQ ? 'none' : '0.5px solid var(--border)',
                  }}>
                    {i < currentQ ? '✓' : i + 1}
                  </div>
                  {i < phase1Questions.length - 1 && (
                    <div style={{ width: '20px', height: '1px', background: i < currentQ ? 'rgba(74,222,128,0.3)' : 'var(--border)' }} />
                  )}
                </div>
              ))}
            </div>

            {/* QUESTION CARD */}
            <div style={{ ...cardStyle, padding: '24px', marginBottom: '12px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--text-ghost)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '6px' }}>
                Question {currentQuestion.number} of 8
              </div>
              <h2 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.01em', marginBottom: '5px', lineHeight: 1.3 }}>
                {currentQuestion.question}
              </h2>
              <p style={{ fontSize: '12px', color: 'var(--text-ghost)', marginBottom: '18px', lineHeight: 1.55 }}>
                {currentQuestion.hint}
              </p>

              {/* TEXTAREA */}
              {currentQuestion.type === 'textarea' && (
                <textarea
                  value={currentAnswer}
                  onChange={(e) => setCurrentAnswer(e.target.value)}
                  rows={4}
                  placeholder={currentQuestion.placeholder}
                  style={{ width: '100%', padding: '12px 14px', background: 'var(--bg-elevated)', border: '0.5px solid var(--border)', borderRadius: '8px', fontSize: '13px', color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', outline: 'none', resize: 'none', lineHeight: 1.6, boxSizing: 'border-box' }}
                />
              )}

              {/* OPTIONS */}
              {currentQuestion.type === 'options' && (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginBottom: '10px' }} className="opts-grid">
                    {currentQuestion.options.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => handleOptionSelect(opt)}
                        style={{
                          padding: '9px 12px',
                          background: currentAnswer === opt ? 'rgba(245,158,11,0.06)' : 'var(--bg-elevated)',
                          border: `0.5px solid ${currentAnswer === opt ? 'rgba(245,158,11,0.3)' : 'var(--border)'}`,
                          borderRadius: '7px',
                          fontSize: '12px',
                          color: currentAnswer === opt ? 'var(--text-primary)' : 'var(--text-dim)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          textAlign: 'left',
                          fontFamily: 'var(--font-sans)',
                          transition: 'all var(--transition)',
                        }}
                      >
                        <span style={{ width: '13px', height: '13px', borderRadius: '50%', border: `1.5px solid ${currentAnswer === opt ? 'var(--amber)' : 'var(--border-hover)'}`, background: currentAnswer === opt ? 'var(--amber)' : 'transparent', flexShrink: 0 }} />
                        {opt}
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={otherText}
                    onChange={(e) => { setOtherText(e.target.value); setCurrentAnswer('') }}
                    placeholder={currentQuestion.placeholder}
                    style={{ width: '100%', padding: '9px 12px', background: 'var(--bg-elevated)', border: `0.5px solid ${otherText ? 'rgba(245,158,11,0.3)' : 'var(--border)'}`, borderRadius: '7px', fontSize: '12px', color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', outline: 'none', boxSizing: 'border-box' }}
                  />
                </>
              )}

              {/* NAV */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {currentQ > 0 && (
                    <button onClick={handlePhase1Back} style={{ padding: '8px 14px', background: 'transparent', color: 'var(--text-ghost)', border: '0.5px solid var(--border)', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
                      ← Back
                    </button>
                  )}
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-whisper)' }}>
                    {currentQ + 1} of 8
                  </span>
                </div>
                <button
                  onClick={handlePhase1Next}
                  disabled={!currentAnswer && !otherText.trim()}
                  style={{
                    padding: '10px 22px',
                    background: (currentAnswer || otherText.trim()) ? 'var(--amber)' : 'var(--bg-elevated)',
                    color: (currentAnswer || otherText.trim()) ? 'var(--bg-base)' : 'var(--text-whisper)',
                    border: 'none',
                    borderRadius: '7px',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: (currentAnswer || otherText.trim()) ? 'pointer' : 'not-allowed',
                    fontFamily: 'var(--font-sans)',
                    transition: 'all var(--transition)',
                  }}
                >
                  {currentQ === phase1Questions.length - 1 ? 'Finish →' : 'Next →'}
                </button>
              </div>
            </div>

            {error && (
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#f87171', marginTop: '8px' }}>{error}</p>
            )}
          </div>

          {/* RIGHT SIDEBAR */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', position: 'sticky', top: '88px' }}>
            <div style={cardStyle}>
              <div style={{ padding: '10px 14px', borderBottom: '0.5px solid var(--border)', fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--text-ghost)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Your answers so far
              </div>
              <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '7px' }}>
                {phase1Questions.slice(0, currentQ).map((q) => (
                  <div key={q.id}>
                    <div style={labelStyle}>{q.id}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                      {answers[q.id]}
                    </div>
                  </div>
                ))}
                {currentQ < phase1Questions.length && (
                  <div>
                    <div style={labelStyle}>{currentQuestion.id}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-whisper)' }}>Answering now...</div>
                  </div>
                )}
              </div>
            </div>

            <div style={{ padding: '12px 14px', border: '0.5px dashed var(--border)', borderRadius: '10px', textAlign: 'center' }}>
              <div style={{ fontSize: '18px', color: 'var(--text-whisper)', marginBottom: '5px' }}>🔒</div>
              <div style={{ fontSize: '11px', color: 'var(--text-ghost)', lineHeight: 1.5, marginBottom: '5px' }}>Your product strategy unlocks after all questions.</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--amber)' }}>{currentQ} of 8 answered</div>
            </div>
          </div>
        </div>
      )}

      {/* ── TRANSITION ───────────────────────────────────────── */}
      {phase === 'transition' && (
        <div style={{ padding: '80px 24px', textAlign: 'center', maxWidth: '520px', margin: '0 auto' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'rgba(245,158,11,0.1)', border: '1.5px solid rgba(245,158,11,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '22px' }}>
            ⚡
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: '8px' }}>
            Good. Now let me go deeper.
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-dim)', lineHeight: 1.7, marginBottom: '20px' }}>
            Based on what you've told me, I have a few more specific questions. These are different — they're based on your actual situation, not a generic template.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', textAlign: 'left' }}>
            {Object.entries(answers).slice(0, 4).map(([key, val]) => (
              <div key={key} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', padding: '8px 12px', background: 'var(--bg-surface)', border: '0.5px solid var(--border)', borderRadius: '6px', fontSize: '12px', color: 'var(--text-dim)' }}>
                <span style={{ color: '#4ade80', fontWeight: 700, flexShrink: 0 }}>✓</span>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{val}</span>
              </div>
            ))}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', background: 'var(--bg-surface)', border: '0.5px solid rgba(96,165,250,0.2)', borderRadius: '6px', fontSize: '12px', color: '#60a5fa' }}>
              <span>→</span>
              <span>Generating your follow-up questions...</span>
            </div>
          </div>
        </div>
      )}

      {/* ── PHASE 2 ──────────────────────────────────────────── */}
      {phase === 'phase2' && (
        <div style={{ padding: '28px 0 80px', display: 'grid', gridTemplateColumns: '1fr 280px', gap: '28px', alignItems: 'start' }} className="builder-grid">

          {/* CHAT */}
          <div style={cardStyle}>
            {/* CHAT HEADER */}
            <div style={{ padding: '12px 16px', borderBottom: '0.5px solid var(--border)', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(245,158,11,0.1)', border: '1.5px solid rgba(245,158,11,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, color: 'var(--amber)', flexShrink: 0 }}>AK</div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>Attah Kelechi</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'var(--font-mono)', fontSize: '9px', color: '#4ade80' }}>
                  <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#4ade80', display: 'inline-block', animation: 'pulse-dot 2s infinite' }} />
                  Active now
                </div>
              </div>
              <div style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--text-whisper)' }}>
                Phase 2 of 3 · {currentFollowUp + 1}/{followUps.length} questions
              </div>
            </div>

            {/* PROGRESS */}
            <div style={{ height: '2px', background: 'var(--border)' }}>
              <div style={{ height: '100%', background: '#60a5fa', width: `${((currentFollowUp) / Math.max(followUps.length, 1)) * 100}%`, transition: 'width 0.3s ease' }} />
            </div>

            {/* MESSAGES */}
            <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', minHeight: '320px', maxHeight: '400px', overflowY: 'auto' }}>
              {chatMessages.map((msg, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start', gap: '8px', alignItems: 'flex-start' }}>
                  {msg.type === 'agent' && (
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(245,158,11,0.1)', border: '0.5px solid rgba(245,158,11,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontSize: '8px', fontWeight: 700, color: 'var(--amber)', flexShrink: 0, marginTop: '2px' }}>AK</div>
                  )}
                  <div style={{
                    padding: '10px 14px',
                    borderRadius: msg.type === 'agent' ? '2px 12px 12px 12px' : '12px 12px 2px 12px',
                    background: msg.type === 'agent' ? 'var(--bg-elevated)' : 'rgba(245,158,11,0.08)',
                    border: `0.5px solid ${msg.type === 'agent' ? 'var(--border)' : 'rgba(245,158,11,0.2)'}`,
                    maxWidth: '82%',
                    fontSize: '13px',
                    color: msg.type === 'agent' ? 'var(--text-secondary)' : 'var(--amber)',
                    lineHeight: 1.6,
                  }}
                    dangerouslySetInnerHTML={{
                      __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<strong style="color:var(--text-primary)">$1</strong>'),
                    }}
                  />
                </div>
              ))}

              {isTyping && (
                <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(245,158,11,0.1)', border: '0.5px solid rgba(245,158,11,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontSize: '8px', fontWeight: 700, color: 'var(--amber)', flexShrink: 0 }}>AK</div>
                  <div style={{ padding: '12px 16px', background: 'var(--bg-elevated)', border: '0.5px solid var(--border)', borderRadius: '2px 12px 12px 12px', display: 'flex', gap: '4px', alignItems: 'center' }}>
                    {[0, 1, 2].map((i) => (
                      <span key={i} style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--text-ghost)', display: 'inline-block', animation: `typing-dot 1.2s infinite ${i * 0.2}s` }} />
                    ))}
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* INPUT */}
            {!isTyping && followUps.length > 0 && currentFollowUp < followUps.length && (
              <div style={{ padding: '14px 16px', borderTop: '0.5px solid var(--border)' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--text-whisper)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Pick one or type your own
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '10px' }}>
                  {followUps[currentFollowUp]?.options.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => { setFollowUpAnswer(opt); setFollowUpOther('') }}
                      style={{
                        padding: '9px 12px',
                        background: followUpAnswer === opt ? 'rgba(96,165,250,0.06)' : 'var(--bg-elevated)',
                        border: `0.5px solid ${followUpAnswer === opt ? 'rgba(96,165,250,0.3)' : 'var(--border)'}`,
                        borderRadius: '7px',
                        fontSize: '12px',
                        color: followUpAnswer === opt ? 'var(--text-primary)' : 'var(--text-dim)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        textAlign: 'left',
                        fontFamily: 'var(--font-sans)',
                      }}
                    >
                      <span style={{ width: '12px', height: '12px', borderRadius: '50%', border: `1.5px solid ${followUpAnswer === opt ? '#60a5fa' : 'var(--border-hover)'}`, background: followUpAnswer === opt ? '#60a5fa' : 'transparent', flexShrink: 0 }} />
                      {opt}
                    </button>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    value={followUpOther}
                    onChange={(e) => { setFollowUpOther(e.target.value); setFollowUpAnswer('') }}
                    placeholder={followUps[currentFollowUp]?.placeholder || 'Or tell me in your own words...'}
                    style={{ flex: 1, padding: '9px 12px', background: 'var(--bg-elevated)', border: `0.5px solid ${followUpOther ? 'rgba(96,165,250,0.3)' : 'var(--border)'}`, borderRadius: '7px', fontSize: '12px', color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', outline: 'none' }}
                  />
                  <button
                    onClick={handleFollowUpAnswer}
                    disabled={!followUpAnswer && !followUpOther.trim()}
                    style={{
                      padding: '9px 18px',
                      background: (followUpAnswer || followUpOther.trim()) ? '#60a5fa' : 'var(--bg-elevated)',
                      color: (followUpAnswer || followUpOther.trim()) ? '#fff' : 'var(--text-whisper)',
                      border: 'none',
                      borderRadius: '7px',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: (followUpAnswer || followUpOther.trim()) ? 'pointer' : 'not-allowed',
                      fontFamily: 'var(--font-sans)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {currentFollowUp === followUps.length - 1 ? 'Finish →' : 'Send →'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT SIDEBAR */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', position: 'sticky', top: '88px' }}>
            <div style={{ ...cardStyle, border: '0.5px solid rgba(96,165,250,0.2)' }}>
              <div style={{ padding: '10px 14px', borderBottom: '0.5px solid var(--border)', fontFamily: 'var(--font-mono)', fontSize: '9px', color: '#60a5fa', letterSpacing: '0.06em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#60a5fa', display: 'inline-block', animation: 'pulse-dot 2s infinite' }} />
                Brief building...
              </div>
              <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '7px' }}>
                {Object.entries(answers).slice(0, 4).map(([key, val]) => (
                  <div key={key}>
                    <div style={labelStyle}>{key}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{val}</div>
                  </div>
                ))}
                {Object.entries(followUpAnswers).map(([key, val]) => (
                  <div key={key}>
                    <div style={{ ...labelStyle, color: '#60a5fa' }}>{key}</div>
                    <div style={{ fontSize: '11px', color: '#60a5fa', lineHeight: 1.4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{val}</div>
                  </div>
                ))}
                <div>
                  <div style={labelStyle}>Status</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-whisper)' }}>
                    {currentFollowUp + 1} of {followUps.length} deep-dive questions left
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── GENERATING ───────────────────────────────────────── */}
      {phase === 'generating' && (
        <div style={{ padding: '80px 24px', textAlign: 'center', maxWidth: '480px', margin: '0 auto' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'rgba(245,158,11,0.1)', border: '1.5px solid rgba(245,158,11,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '22px' }}>
            ⚡
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: '8px' }}>
            Building your product strategy...
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-dim)', lineHeight: 1.7 }}>
            Analysing everything you've told me and putting together a strategy that's specific to your situation. This takes about 15 seconds.
          </p>
        </div>
      )}

      {/* ── RESULTS ──────────────────────────────────────────── */}
      {phase === 'results' && results && (
        <div
          style={{ padding: '32px 0 80px' }}
          onCopy={(e) => e.preventDefault()}
          onContextMenu={(e) => e.preventDefault()}
        >
          {/* VIEW ONLY NOTICE */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', background: 'var(--bg-surface)', border: '0.5px solid var(--border)', borderRadius: '7px', marginBottom: '20px', fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-ghost)', userSelect: 'none' }}>
            🔒 This strategy is view-only and personalised to your specific answers. It cannot be copied or downloaded.
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }} className="results-grid">

            {/* BUSINESS NAME — FULL WIDTH */}
            <div style={{ ...cardStyle, gridColumn: 'span 2' }}>
              <div style={{ padding: '12px 16px', borderBottom: '0.5px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-ghost)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Business name recommendations</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', padding: '2px 8px', borderRadius: '3px', background: 'rgba(245,158,11,0.1)', border: '0.5px solid rgba(245,158,11,0.2)', color: 'var(--amber)' }}>3 options</span>
              </div>
              <div style={{ padding: '16px' }}>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
                  <span style={{ padding: '6px 14px', borderRadius: '5px', fontSize: '14px', fontWeight: 700, background: 'rgba(245,158,11,0.1)', border: '0.5px solid rgba(245,158,11,0.3)', color: 'var(--amber)' }}>
                    {results.businessName.recommended}
                  </span>
                  {results.businessName.alternatives.map((name) => (
                    <span key={name} style={{ padding: '6px 14px', borderRadius: '5px', fontSize: '13px', background: 'var(--bg-elevated)', border: '0.5px solid var(--border)', color: 'var(--text-dim)' }}>
                      {name}
                    </span>
                  ))}
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-dim)', lineHeight: 1.65 }}>
                  {results.businessName.reasoning}
                </p>
              </div>
            </div>

            {/* PLATFORM */}
            <div style={cardStyle}>
              <div style={{ padding: '12px 16px', borderBottom: '0.5px solid var(--border)' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-ghost)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Platform recommendation</span>
              </div>
              <div style={{ padding: '14px 16px' }}>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: '10px', fontWeight: 600 }}>
                  {results.platform.recommendation}
                </p>
                <p style={{ fontSize: '12px', color: 'var(--text-dim)', lineHeight: 1.6, marginBottom: '10px' }}>
                  {results.platform.reasoning}
                </p>
                <div style={{ padding: '10px 12px', background: 'var(--bg-elevated)', borderLeft: '2px solid var(--amber)', borderRadius: '0 6px 6px 0', fontSize: '11px', color: 'var(--text-dim)', lineHeight: 1.6 }}>
                  <strong style={{ color: 'var(--text-secondary)', display: 'block', marginBottom: '3px' }}>What most developers get wrong:</strong>
                  {results.platform.developerMistake}
                </div>
              </div>
            </div>

            {/* MONETISATION */}
            <div style={cardStyle}>
              <div style={{ padding: '12px 16px', borderBottom: '0.5px solid var(--border)' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-ghost)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Monetisation roadmap</span>
              </div>
              <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {results.monetisation.map((item) => (
                  <div key={item.period} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', padding: '3px 8px', borderRadius: '3px', background: 'var(--bg-elevated)', border: '0.5px solid var(--border)', color: 'var(--text-ghost)', whiteSpace: 'nowrap', flexShrink: 0, marginTop: '2px' }}>
                      {item.period}
                    </span>
                    <span style={{ fontSize: '12px', color: 'var(--text-dim)', lineHeight: 1.5 }}>{item.action}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* FIRST 3 */}
            <div style={{ ...cardStyle, gridColumn: 'span 2' }}>
              <div style={{ padding: '12px 16px', borderBottom: '0.5px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-ghost)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>First 3 things to build</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', padding: '2px 8px', borderRadius: '3px', background: 'rgba(74,222,128,0.08)', border: '0.5px solid rgba(74,222,128,0.2)', color: '#4ade80' }}>In order</span>
              </div>
              <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {results.firstThreeToBuild.map((item) => (
                  <div key={item.number} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--amber)', flexShrink: 0, marginTop: '2px', fontWeight: 700 }}>{item.number}</span>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '2px' }}>{item.title}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-dim)', lineHeight: 1.6 }}>{item.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* UNFAIR ADVANTAGE */}
          <div style={{ background: 'var(--bg-surface)', border: '0.5px solid rgba(245,158,11,0.15)', borderRadius: '10px', padding: '16px', marginBottom: '12px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--amber)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '7px' }}>⚡ Your unfair advantage</div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.7, fontStyle: 'italic' }}>"{results.unfairAdvantage}"</p>
          </div>

          {/* ATTAH'S NOTE */}
          <div style={{ background: 'rgba(245,158,11,0.03)', border: '0.5px solid rgba(245,158,11,0.12)', borderRadius: '10px', padding: '16px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(245,158,11,0.1)', border: '1.5px solid rgba(245,158,11,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, color: 'var(--amber)', flexShrink: 0 }}>AK</div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>Attah Kelechi</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--text-ghost)' }}>Frontend Engineer · Product Strategist</div>
              </div>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-dim)', lineHeight: 1.8 }}>
              {results.attahNote}
            </p>
          </div>

          {/* CTA */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <a
              href="https://calendly.com/attahkelechi97/free-20-min-product-strategy-call"
                target="_blank"
                rel="noopener noreferrer"
              style={{ flex: 1, minWidth: '200px', display: 'block', textAlign: 'center', padding: '14px', background: 'var(--amber)', color: 'var(--bg-base)', borderRadius: '8px', fontSize: '14px', fontWeight: 700, textDecoration: 'none', fontFamily: 'var(--font-sans)' }}
            >
              Let's build this together → Book a free 20min call
            </a>
            <button
              onClick={resetAll}
              style={{ padding: '14px 20px', background: 'transparent', color: 'var(--text-secondary)', border: '0.5px solid var(--border)', borderRadius: '8px', fontSize: '13px', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}
            >
              Start over
            </button>
          </div>

        </div>
      )}

      <style>{`
        @keyframes typing-dot {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-4px); opacity: 1; }
        }
        @media (max-width: 768px) {
          .builder-grid { grid-template-columns: 1fr !important; }
          .results-grid { grid-template-columns: 1fr !important; }
          .opts-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}