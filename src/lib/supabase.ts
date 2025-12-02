// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

// On récupère les variables d’environnement
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Si on est en build Vercel et que les clés sont pas encore là → on retourne un client "dummy" qui ne crashe pas
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase keys missing during build – returning dummy client')
  const dummy = {
    from: () => ({
      select: () => ({
        order: () => Promise.resolve({ data: [], error: null }),
        eq: () => dummy.from().select(),
        // on ajoute quelques méthodes bidon pour éviter les erreurs
      }),
    }),
  }
  // @ts-ignore
  globalThis.supabaseClient = dummy
  export const supabase = dummy
} else {
  const client = createClient(supabaseUrl, supabaseAnonKey)
  globalThis.supabaseClient = client
  export const supabase = client
}

// Export par défaut aussi (au cas où)
export default supabase