// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

// On désactive totalement le SSR pour ce fichier (c’est la ligne magique)
export const dynamic = 'force-dynamic'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Si les clés sont pas là (build Vercel), on retourne un client qui renvoie des données mock
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase env missing → returning mock data')
  export const supabase = {
    from: () => ({
      select: () => ({
        order: () => Promise.resolve({ data: [], error: null }),
      }),
    }),
  } as any
} else {
  export const supabase = createClient(supabaseUrl, supabaseAnonKey)
}