import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  const { data, error } = await supabaseAdmin
  .from('blog_posts')
  .select('*')
  .eq('slug', slug)
  .eq('status', 'published')
  .limit(1)


if (error || !data || data.length === 0) {
  return NextResponse.json({ error: 'Post not found', debug: { error: error?.message } }, { status: 404 })
}

return NextResponse.json({ posts: data })
}