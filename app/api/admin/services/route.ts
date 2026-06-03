import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('services')
    .select('*')
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('GET services error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ services: data })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const payload = {
      ...body,
      features: Array.isArray(body.features) ? body.features : [],
    }
    const { data, error } = await supabaseAdmin
      .from('services')
      .insert(payload)
      .select()
      .single()

    if (error) {
      console.error('POST services error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ service: data }, { status: 201 })
  } catch (err) {
    console.error('POST services exception:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 })
    }

    const payload = {
      ...updates,
      features: Array.isArray(updates.features) ? updates.features : [],
    }

    const { data, error } = await supabaseAdmin
      .from('services')
      .update(payload)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('PATCH services error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ service: data })
  } catch (err) {
    console.error('PATCH services exception:', err)
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
      .from('services')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('DELETE services error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('DELETE services exception:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}