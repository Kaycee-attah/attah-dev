import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  const [expRes, eduRes] = await Promise.all([
    supabaseAdmin
      .from('experience_entries')
      .select('*')
      .order('sort_order', { ascending: true }),
    supabaseAdmin
      .from('education_entries')
      .select('*'),
  ])

  if (expRes.error) return NextResponse.json({ error: expRes.error.message }, { status: 500 })
  if (eduRes.error) return NextResponse.json({ error: eduRes.error.message }, { status: 500 })

  return NextResponse.json({
    experiences: expRes.data,
    education: eduRes.data?.[0] || null,
  })
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const table = body.type === 'education' ? 'education_entries' : 'experience_entries'
  const { type, ...data } = body

  const { data: inserted, error } = await supabaseAdmin
    .from(table)
    .insert(data)
    .select()
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ entry: inserted }, { status: 201 })
}

export async function PATCH(req: NextRequest) {
  const { id, type, ...updates } = await req.json()
  const table = type === 'education' ? 'education_entries' : 'experience_entries'

  const { data, error } = await supabaseAdmin
    .from(table)
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ entry: data })
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  const type = searchParams.get('type')
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })

  const table = type === 'education' ? 'education_entries' : 'experience_entries'
  const { error } = await supabaseAdmin.from(table).delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}