// src/app/api/kols/route.ts
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export async function GET() {
  if (!supabaseUrl || !supabaseAnonKey) {
    // Build Vercel → on renvoie des données mock
    return NextResponse.json([
      { id: 1, username: "aeyakovenko", display_name: "Anatoly", avatar_url: "https://unavatar.io/x/aeyakovenko", badge: "💎", accuracy: 93.5, calls: 87, roi: "+842%" },
      { id: 2, username: "GiganticRebirth", display_name: "GCR", avatar_url: "https://unavatar.io/x/GiganticRebirth", badge: "💎", accuracy: 91.2, calls: 156, roi: "+1267%" },
      // ... tu peux en mettre 5-6 pour le build
    ])
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey)
  const { data } = await supabase.from('kols').select('*').order('id')

  // On ajoute les stats temporaires (on passera aux vraies plus tard)
  const enriched = (data || []).map((kol: any, i: number) => ({
    ...kol,
    accuracy: (92 - i * 1.3).toFixed(1),
    calls: 380 + i * 27,
    roi: `+${(1350 - i * 110)}%`,
  }))

  return NextResponse.json(enriched)
}
