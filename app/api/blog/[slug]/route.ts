import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  const { data, error } = await supabase
  .from('blog_posts')
  .select('id, title, slug, status')

console.log('All posts:', { count: data?.length, posts: data, error: error?.message })

if (error || !data || data.length === 0) {
  return NextResponse.json({ error: 'Post not found', debug: { error: error?.message } }, { status: 404 })
}

return NextResponse.json({ posts: data })
}