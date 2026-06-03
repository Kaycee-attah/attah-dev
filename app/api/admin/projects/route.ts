import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('projects')
    .select('*')
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('GET projects error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ projects: data })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Ensure array fields are arrays
    const payload = {
      ...body,
      stack: Array.isArray(body.stack) ? body.stack : [],
      metrics: Array.isArray(body.metrics) ? body.metrics : [],
    }

    const { data, error } = await supabaseAdmin
      .from('projects')
      .insert(payload)
      .select()
      .single()

    if (error) {
      console.error('POST projects error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ project: data }, { status: 201 })
  } catch (err) {
    console.error('POST projects exception:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, ...updates } = body
console.log('PATCH id:', id, 'type:', typeof id)

    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 })
    }

    // Ensure array fields are arrays
    const payload = {
      ...updates,
      stack: Array.isArray(updates.stack) ? updates.stack : [],
      metrics: Array.isArray(updates.metrics) ? updates.metrics : [],
    }

    const { data, error } = await supabaseAdmin
      .from('projects')
      .update(payload)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('PATCH projects error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ project: data })
  } catch (err) {
    console.error('PATCH projects exception:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 })
    }

    const { error } = await supabaseAdmin
      .from('projects')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('DELETE projects error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('DELETE projects exception:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}