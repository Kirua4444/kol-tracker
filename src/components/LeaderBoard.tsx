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
  const res = await fetch(`${process.env.NEXT_PUBLIC_VERCEL_URL || 'http://localhost:3000'}/api/kols`, {
    next: { revalidate: 60 }, // refresh toutes les minutes
  });
  return res.json();
}

export default async function LeaderBoard() {
  const kols = await getKols();

  return (
    <div className="min-h-screen bg-black text-white px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-5xl font-bold text-center mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Top Crypto KOLs Tracker
        </h1>
        <p className="text-center text-gray-400 mb-12 text-lg">
          Live accuracy & ROI • 100 % réelles 🔥
        </p>

        <Card className="bg-zinc-950 border-zinc-800 rounded-2xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-zinc-800">
                <TableHead className="text-gray-400">Rank</TableHead>
                <TableHead className="text-gray-400">KOL</TableHead>
                <TableHead className="text-right text-gray-400">Accuracy</TableHead>
                <TableHead className="text-right text-gray-400">Calls</TableHead>
                <TableHead className="text-right text-gray-400">Avg ROI</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {kols.map((kol, index) => (
                <TableRow key={kol.id} className="border-zinc-800 hover:bg-zinc-900/70 transition-all">
                  <TableCell className="font-bold text-2xl text-purple-400">#{index + 1}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-4">
                      <Avatar className="w-14 h-14 ring-2 ring-zinc-700">
                        <AvatarImage src={kol.avatar_url} />
                        <AvatarFallback>{kol.display_name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-bold text-xl">{kol.display_name}</p>
                        <p className="text-sm text-gray-500">@{kol.username}</p>
                      </div>
                      <Badge variant="outline" className="ml-4 border-purple-600 text-purple-400 text-lg px-3 py-1">
                        {kol.badge}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-right text-3xl font-bold text-green-400">{kol.accuracy}%</TableCell>
                  <TableCell className="text-right text-gray-300 text-lg">{kol.calls}</TableCell>
                  <TableCell className="text-right text-3xl font-bold text-green-400">{kol.roi}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
}