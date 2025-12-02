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
  // Use mock data during static build to avoid invalid fetch URLs
  if (process.env.NEXT_PHASE === "phase-production-build") {
    return [
      { id: 1, username: "aeyakovenko", display_name: "Anatoly", avatar_url: "https://unavatar.io/x/aeyakovenko", badge: "💎", accuracy: 93.5, calls: 87, roi: "+842%" },
      { id: 2, username: "GiganticRebirth", display_name: "GCR", avatar_url: "https://unavatar.io/x/GiganticRebirth", badge: "💎", accuracy: 91.2, calls: 156, roi: "+1267%" },
      { id: 3, username: "CryptoFlow", display_name: "Flow", avatar_url: "https://unavatar.io/x/CryptoFlow", badge: "⭐", accuracy: 88.9, calls: 203, roi: "+954%" },
      { id: 4, username: "Luna", display_name: "Luna", avatar_url: "https://unavatar.io/x/Luna", badge: "⭐", accuracy: 85.3, calls: 298, roi: "+712%" },
      { id: 5, username: "Trader", display_name: "Trader", avatar_url: "https://unavatar.io/x/Trader", badge: "", accuracy: 82.1, calls: 401, roi: "+523%" },
    ];
  }
  try {
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NEXT_PUBLIC_API_URL
      ? process.env.NEXT_PUBLIC_API_URL
      : "http://localhost:3000";

    const res = await fetch(`${baseUrl}/api/kols`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error("fetch failed");
    const data = await res.json();
    return data;
  } catch (error) {
    console.warn("Using fallback KOLs data", error);
    return [
      { id: 1, username: "aeyakovenko", display_name: "Anatoly", avatar_url: "https://unavatar.io/x/aeyakovenko", badge: "💎", accuracy: 93.5, calls: 87, roi: "+842%" },
      { id: 2, username: "GiganticRebirth", display_name: "GCR", avatar_url: "https://unavatar.io/x/GiganticRebirth", badge: "💎", accuracy: 91.2, calls: 156, roi: "+1267%" },
      { id: 3, username: "CryptoFlow", display_name: "Flow", avatar_url: "https://unavatar.io/x/CryptoFlow", badge: "⭐", accuracy: 88.9, calls: 203, roi: "+954%" },
      { id: 4, username: "Luna", display_name: "Luna", avatar_url: "https://unavatar.io/x/Luna", badge: "⭐", accuracy: 85.3, calls: 298, roi: "+712%" },
      { id: 5, username: "Trader", display_name: "Trader", avatar_url: "https://unavatar.io/x/Trader", badge: "", accuracy: 82.1, calls: 401, roi: "+523%" },
    ];
  }
}

export default async function LeaderBoard() {
  const kols = await getKols();

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">KOL Tracker</h1>
        <p className="text-gray-400 mb-8">Top Cryptocurrency Influencers Leaderboard</p>

        <Card className="border-gray-800 bg-gray-900">
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
                  <TableRow key={kol.id} className="border-gray-800 hover:bg-gray-800/50">
                    <TableCell className="font-semibold text-gray-300">{index + 1}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={kol.avatar_url} alt={kol.username} />
                          <AvatarFallback>{kol.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{kol.display_name}</p>
                          <p className="text-sm text-gray-400">@{kol.username}</p>
                        </div>
                        {kol.badge && <Badge variant="secondary" className="ml-2">{kol.badge}</Badge>}
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-green-400 font-semibold">{kol.accuracy}%</TableCell>
                    <TableCell className="text-right text-gray-300">{kol.calls}</TableCell>
                    <TableCell className="text-right text-blue-400 font-semibold">{kol.roi}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </div>
  );
}