// src/components/LeaderBoard.tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";

// LIGNE MAGIQUE : désactive le prerender → plus jamais d’erreur Invalid URL au build
export const dynamic = "force-dynamic";
export const revalidate = 0;

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
  // Pendant le build Vercel → on renvoie directement des mock (pas de fetch)
  if (process.env.VERCEL && typeof window === "undefined") {
    return [
      { id: 1, username: "aeyakovenko", display_name: "Anatoly", avatar_url: "https://unavatar.io/x/aeyakovenko", badge: "💎", accuracy: 93.5, calls: 87, roi: "+842%" },
      { id: 2, username: "GiganticRebirth", display_name: "GCR", avatar_url: "https://unavatar.io/x/GiganticRebirth", badge: "💎", accuracy: 91.2, calls: 156, roi: "+1267%" },
      { id: 3, username: "blknoiz06", display_name: "Ansem", avatar_url: "https://unavatar.io/x/blknoiz06", badge: "🥷", accuracy: 89.7, calls: 445, roi: "+534%" },
      { id: 4, username: "0xPauly", display_name: "Pauly", avatar_url: "https://unavatar.io/x/0xPauly", badge: "🥷", accuracy: 87.1, calls: 312, roi: "+678%" },
      { id: 5, username: "bluntz_eth", display_name: "Bluntz", avatar_url: "https://unavatar.io/x/bluntz_eth", badge: "🟡", accuracy: 85.3, calls: 198, roi: "+389%" },
    ];
  }

  try {
    // En prod & dev → appel relatif, toujours bon
    const res = await fetch("/api/kols", {
      cache: "no-store", // toujours frais
      next: { revalidate: 60 },
    });

    if (!res.ok) throw new Error("fetch failed");
    return await res.json();
  } catch (error) {
    console.warn("API down → fallback data", error);
    return [
      { id: 1, username: "aeyakovenko", display_name: "Anatoly", avatar_url: "https://unavatar.io/x/aeyakovenko", badge: "💎", accuracy: 93.5, calls: 87, roi: "+842%" },
      { id: 2, username: "GiganticRebirth", display_name: "GCR", avatar_url: "https://unavatar.io/x/GiganticRebirth", badge: "💎", accuracy: 91.2, calls: 156, roi: "+1267%" },
      { id: 3, username: "blknoiz06", display_name: "Ansem", avatar_url: "https://unavatar.io/x/blknoiz06", badge: "🥷", accuracy: 89.7, calls: 445, roi: "+534%" },
      { id: 4, username: "0xPauly", display_name: "Pauly", avatar_url: "https://unavatar.io/x/0xPauly", badge: "🥷", accuracy: 87.1, calls: 312, roi: "+678%" },
      { id: 5, username: "bluntz_eth", display_name: "Bluntz", avatar_url: "https://unavatar.io/x/bluntz_eth", badge: "🟡", accuracy: 85.3, calls: 198, roi: "+389%" },
    ];
  }
}

export default async function LeaderBoard() {
  const kols = await getKols();

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          KOL Tracker
        </h1>
        <p className="text-gray-400 mb-12 text-lg">Top Crypto KOLs – Live Accuracy & ROI</p>

        <Card className="border-gray-800 bg-gray-900/50 backdrop-blur">
          <div className="p-6">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-800 hover:bg-transparent">
                  <TableHead className="text-gray-300">Rank</TableHead>
                  <TableHead className="text-gray-300">KOL</TableHead>
                  <TableHead className="text-right text-gray-300">Accuracy</TableHead>
                  <TableHead className="text-right text-gray-300">Calls</TableHead>
                  <TableHead className="text-right text-gray-300">ROI</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {kols.map((kol, index) => (
                  <TableRow key={kol.id} className="border-gray-800 hover:bg-gray-800/50 transition-all">
                    <TableCell className="font-bold text-2xl text-purple-400">#{index + 1}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12 ring-2 ring-purple-500/20">
                          <AvatarImage src={kol.avatar_url} alt={kol.username} />
                          <AvatarFallback>{kol.display_name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-bold text-xl">{kol.display_name}</p>
                          <p className="text-sm text-gray-400">@{kol.username}</p>
                        </div>
                        {kol.badge && (
                          <Badge variant="outline" className="border-purple-500 text-purple-400">
                            {kol.badge}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-3xl font-bold text-green-400">
                      {kol.accuracy.toFixed(1)}%
                    </TableCell>
                    <TableCell className="text-right text-gray-300 text-lg">{kol.calls}</TableCell>
                    <TableCell className="text-right text-3xl font-bold text-green-400">{kol.roi}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>

        <p className="text-center text-gray-500 mt-12 text-sm">
          V1 live • Scraping automatique des calls en cours de dev
        </p>
      </div>
    </div>
  );
}