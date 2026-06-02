import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status')
  const page = parseInt(searchParams.get('page') || '1')
  const limit = 20
  const offset = (page - 1) * limit

  let query = supabaseAdmin
    .from('productiq_leads')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (status && status !== 'all') {
    query = query.eq('status', status)
  }

  const { data, error, count } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ leads: data, total: count }, { status: 200 })
}

export async function PATCH(req: NextRequest) {
  const {
    id, status, notes,
    calendly_clicked, called,
    became_client, revenue,
  } = await req.json()

  const updateData: Record<string, unknown> = {}
  if (status !== undefined) updateData.status = status
  if (notes !== undefined) updateData.notes = notes
  if (calendly_clicked !== undefined) updateData.calendly_clicked = calendly_clicked
  if (called !== undefined) updateData.called = called
  if (became_client !== undefined) updateData.became_client = became_client
  if (revenue !== undefined) updateData.revenue = revenue

  const { error } = await supabaseAdmin
    .from('productiq_leads')
    .update(updateData)
    .eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true }, { status: 200 })
}