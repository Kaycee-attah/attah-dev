import { createClient } from '@supabase/supabase-js'

// ─── SUPABASE CLIENT ──────────────────────────────────────────
// Used server-side only via API routes
// Never expose service_role key to the browser

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Server-side client — full access, bypasses RLS
// Use this in API routes only
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

// Client-side client — limited access
// Use this in components if needed
export const supabase = createClient(supabaseUrl, supabaseAnonKey)