import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  // ── EVENT COUNTS ────────────────────────────────────────────
  const { data: events } = await supabaseAdmin
    .from('productiq_analytics')
    .select('event, device')

  const counts: Record<string, number> = {
    page_view: 0,
    phase1_start: 0,
    phase1_complete: 0,
    phase2_complete: 0,
    gate_reached: 0,
    gate_submitted: 0,
    results_viewed: 0,
    calendly_click: 0,
    question_drop: 0,
  }

  const deviceCounts = { mobile: 0, desktop: 0, tablet: 0, unknown: 0 }

  events?.forEach((e) => {
    if (counts[e.event] !== undefined) counts[e.event]++
    const d = (e.device || 'unknown') as keyof typeof deviceCounts
    if (deviceCounts[d] !== undefined) deviceCounts[d]++
    else deviceCounts.unknown++
  })

  // ── LEADS ───────────────────────────────────────────────────
  const { data: leads } = await supabaseAdmin
    .from('productiq_leads')
    .select('*')

  const totalLeads = leads?.length || 0

  const byStatus: Record<string, number> = {
    new: 0, contacted: 0, in_progress: 0, closed: 0,
  }

  const budgetDist: Record<string, number> = {}
  const timelineDist: Record<string, number> = {}
  const businessTypes: Record<string, number> = {}
  let phoneProvided = 0
  let calendlyClicked = 0
  let becameClient = 0
  let totalRevenue = 0
  let totalCompletionTime = 0
  let completionTimeCount = 0

  // This week
  const weekAgo = new Date()
  weekAgo.setDate(weekAgo.getDate() - 7)
  let thisWeek = 0

  // Today
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  let today_count = 0

  leads?.forEach((lead) => {
    // Status
    if (byStatus[lead.status] !== undefined) byStatus[lead.status]++

    // Phone provided
    if (lead.phone) phoneProvided++

    // Calendly clicked
    if (lead.calendly_clicked) calendlyClicked++

    // Became client
    if (lead.became_client) becameClient++

    // Revenue
    if (lead.revenue) totalRevenue += lead.revenue

    // Completion time
    if (lead.completion_time_seconds) {
      totalCompletionTime += lead.completion_time_seconds
      completionTimeCount++
    }

    // Budget distribution
    const budget = lead.phase1_answers?.budget
    if (budget) budgetDist[budget] = (budgetDist[budget] || 0) + 1

    // Timeline distribution
    const timeline = lead.phase1_answers?.timeline
    if (timeline) timelineDist[timeline] = (timelineDist[timeline] || 0) + 1

    // Business type (first 3 words of business answer)
    const business = lead.phase1_answers?.business
    if (business) {
      const shortBusiness = business.split(' ').slice(0, 4).join(' ')
      businessTypes[shortBusiness] = (businessTypes[shortBusiness] || 0) + 1
    }

    // Time periods
    const createdAt = new Date(lead.created_at)
    if (createdAt >= weekAgo) thisWeek++
    if (createdAt >= today) today_count++
  })

  // ── QUESTION DROP-OFF ────────────────────────────────────────
  const questionAnswerCounts: Record<string, number> = {}
  for (let i = 1; i <= 8; i++) {
    const count = events?.filter(e => e.event === `phase1_q${i}_answer`).length || 0
    questionAnswerCounts[`q${i}`] = count
  }

  // ── MOST COMMON ANSWERS PER QUESTION ────────────────────────
  const commonAnswers: Record<string, Record<string, number>> = {}
  leads?.forEach((lead) => {
    Object.entries(lead.phase1_answers || {}).forEach(([key, val]) => {
      if (!commonAnswers[key]) commonAnswers[key] = {}
      const v = val as string
      commonAnswers[key][v] = (commonAnswers[key][v] || 0) + 1
    })
  })

  const topAnswers: Record<string, Array<{ answer: string; count: number }>> = {}
  Object.entries(commonAnswers).forEach(([key, vals]) => {
    topAnswers[key] = Object.entries(vals)
      .map(([answer, count]) => ({ answer, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3)
  })

  return NextResponse.json({
    events: counts,
    totalLeads,
    thisWeek,
    today: today_count,
    byStatus,
    deviceCounts,
    budgetDist,
    timelineDist,
    businessTypes,
    phoneProvidedRate: totalLeads > 0 ? Math.round((phoneProvided / totalLeads) * 100) : 0,
    calendlyClickRate: totalLeads > 0 ? Math.round((calendlyClicked / totalLeads) * 100) : 0,
    clientConversionRate: totalLeads > 0 ? Math.round((becameClient / totalLeads) * 100) : 0,
    totalRevenue,
    avgCompletionTime: completionTimeCount > 0
      ? Math.round(totalCompletionTime / completionTimeCount)
      : 0,
    questionAnswerCounts,
    topAnswers,
  })
}