// src/components/LeaderBoard.tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";

type Kol = {
  id: number;
  username: string;
  display_name: string;
  avatar_url: string;
  badge: string;
  accuracy: number;
  calls: number;
  roi: string;
};

async function getKols(): Promise<Kol[]> {
  try {
    // URL relative fonctionne sur serveur (build, dev, prod inclus Vercel)
    const res = await fetch("/api/kols", {
      next: { revalidate: 60 }, // refresh toutes les 60 secondes
    });

    if (!res.ok) throw new Error("fetch failed");

    const data = await res.json();
    return data;
  } catch (error) {
    // Fallback propre si jamais ça plante (build Vercel, clés manquantes, etc.)
    console.warn("Using fallback KOLs data", error);
    return [
      { id: 1, username: "aeyakovenko", display_name: "Anatoly", avatar_url: "https://unavatar.io/x/aeyakovenko", badge: "💎", accuracy: 93.5, calls: 87, roi: "+842%" },
      { id: 2, username: "GiganticRebirth", display_name: "GCR", avatar_url: "https://unavatar.io/x/GiganticRebirth", badge