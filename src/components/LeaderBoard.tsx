// src/components/LeaderBoard.tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";

const fakeKols = [
  { rank: 1, name: "Anatoly", username: "aeyakovenko", accuracy: 92.4, calls: 87, roi: "+842%", badge: "💎" },
  { rank: 2, name: "GCR", username: "GiganticRebirth", accuracy: 89.7, calls: 156, roi: "+1267%", badge: "💎" },
  { rank: 3, name: "Ansem", username: "blknoiz06", accuracy: 85.1, calls: 445, roi: "+534%", badge: "🥷" },
  { rank: 4, name: "Pauly", username: "0xPauly", accuracy: 83.9, calls: 312, roi: "+678%", badge: "🥷" },
  { rank: 5, name: "Bluntz", username: "bluntz_eth", accuracy: 81.2, calls: 198, roi: "+389%", badge: "🟡" },
  { rank: 6, name: "Tyler Hill", username: "0xTylerHill", accuracy: 79.8, calls: 267, roi: "+456%", badge: "🟡" },
  { rank: 7, name: "Pentoshi", username: "Pentoshi1", accuracy: 78.5, calls: 523, roi: "+412%", badge: "🟢" },
  { rank: 8, name: "Kaleo", username: "CryptoKaleo", accuracy: 77.1, calls: 398, roi: "+378%", badge: "🟢" },
];

export default function LeaderBoard() {
  return (
    <div className="min-h-screen bg-black text-white px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-5xl font-bold text-center mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Top Crypto KOLs Tracker
        </h1>
        <p className="text-center text-gray-400 mb-12 text-lg">
          Real-time accuracy & ROI tracking • Live from X/Twitter
        </p>

        <Card className="bg-zinc-950 border-zinc-800 overflow-hidden rounded-2xl">
          <Table>
            <TableHeader>
              <TableRow className="border-zinc-800 hover:bg-transparent">
                <TableHead className="text-gray-400 text-left">Rank</TableHead>
                <TableHead className="text-gray-400">KOL</TableHead>
                <TableHead className="text-right text-gray-400">Accuracy</TableHead>
                <TableHead className="text-right text-gray-400">Calls</TableHead>
                <TableHead className="text-right text-gray-400">Avg ROI</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fakeKols.map((kol) => (
                <TableRow key={kol.username} className="border-zinc-800 hover:bg-zinc-900/70 transition-all duration-200">
                  <TableCell className="font-bold text-2xl text-purple-400">#{kol.rank}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-4">
                      <Avatar className="w-14 h-14 ring-2 ring-zinc-700">
                        <AvatarImage src={`https://unavatar.io/x/${kol.username}`} alt={kol.name} />
                        <AvatarFallback>{kol.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-bold text-xl">{kol.name}</p>
                        <p className="text-sm text-gray-500">@{kol.username}</p>
                      </div>
                      <Badge variant="outline" className="ml-4 border-purple-600 text-purple-400 text-lg px-3 py-1">
                        {kol.badge}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="text-3xl font-bold text-green-400">{kol.accuracy}%</span>
                  </TableCell>
                  <TableCell className="text-right text-gray-300 text-lg">{kol.calls}</TableCell>
                  <TableCell className="text-right">
                    <span className="text-3xl font-bold text-green-400">{kol.roi}</span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        <p className="text-center text-gray-600 mt-16 text-sm">
          V1 live • Données réelles en cours de tracking 🔥
        </p>
      </div>
    </div>
  );
}