// src/app/dashboard/page.tsx
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/server";
import { Crown } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = createClient();
  const { data: kols } = await supabase.from("kols").select("*").order("score", { ascending: false });

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-4xl font-bold text-green-400">82.3%</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">Winrate moyen (+100%)</p>
            </CardContent>
          </Card>
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-4xl font-bold text-cyan-400">{kols?.length || 0}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">KOLs trackés</p>
            </CardContent>
          </Card>
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-4xl font-bold text-purple-400">1 842</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">Calls analysés</p>
            </CardContent>
          </Card>
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-4xl font-bold text-yellow-400">+1 267%</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">Meilleur ROI moyen</p>
            </CardContent>
          </Card>
        </div>

        {/* Leaderboard */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-2xl">Top KOLs</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-gray-800">
                  <TableHead>Rank</TableHead>
                  <TableHead>KOL</TableHead>
                  <TableHead className="text-right">Winrate</TableHead>
                  <TableHead className="text-right">Calls</TableHead>
                  <TableHead className="text-right">ROI</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {kols?.slice(0, 10).map((kol: any, i: number) => (
                  <TableRow key={kol.id} className="border-gray-800">
                    <TableCell className="font-bold text-xl">
                      {i === 0 && <Crown className="inline w-6 h-6 text-yellow-500" />}
                      {i === 1 && <Crown className="inline w-6 h-6 text-gray-400" />}
                      {i === 2 && <Crown className="inline w-6 h-6 text-orange-600" />}
                      {i > 2 && `#${i + 1}`}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={kol.avatar_url} />
                          <AvatarFallback>{kol.display_name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{kol.display_name}</p>
                          <p className="text-sm text-gray-500">@{kol.username}</p>
                        </div>
                        <Badge variant="outline" className="border-purple-500 text-purple-400">
                          {kol.badge || "💎"}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-bold text-green-400">{kol.winrate}%</TableCell>
                    <TableCell className="text-right">{kol.calls}</TableCell>
                    <TableCell className="text-right font-bold text-cyan-400">{kol.avg_roi}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}