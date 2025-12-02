// src/lib/supabase.ts
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Si on est en build (ssr) et que les vars sont pas définies → on retourne un client vide qui ne crashe pas
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase env vars missing – using dummy client for build')
  // @ts-ignore
  export const supabase = {
    from: () => ({ select: () => ({ order: () => Promise.resolve({ data: [], error: null }) }) }),
  }
} else {
  export const supabase = typeof window !== 'undefined' 
    ? createBrowserSupabaseClient() // client côté navigateur
    : createClient(supabaseUrl, supabaseAnonKey) // client côté serveur
}