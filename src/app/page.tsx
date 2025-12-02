// src/app/page.tsx
import LeaderBoard from "@/components/LeaderBoard";

// CES DEUX LIGNES SONT OBLIGATOIRES
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function Home() {
  return <LeaderBoard />;
}