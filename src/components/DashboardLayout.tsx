// src/components/DashboardLayout.tsx
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Menu, Sun, Moon } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-black text-white">
      {/* Sidebar fixe */}
      <Sidebar className="w-64 border-r border-gray-800 bg-gray-950">
        <SidebarContent className="p-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent mb-8">
            KOLScan
          </h2>

          <SidebarGroup>
            <SidebarGroupLabel className="text-gray-400 text-xs uppercase">Filtres</SidebarGroupLabel>
            <SidebarGroupContent className="space-y-3 mt-3">
              <Select defaultValue="all">
                <SelectTrigger className="bg-gray-900 border-gray-800">
                  <SelectValue placeholder="Période" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">7 jours</SelectItem>
                  <SelectItem value="30d">30 jours</SelectItem>
                  <SelectItem value="all">Tout le temps</SelectItem>
                </SelectContent>
              </Select>

              <Select defaultValue="all">
                <SelectTrigger className="bg-gray-900 border-gray-800">
                  <SelectValue placeholder="Chaîne" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes</SelectItem>
                  <SelectItem value="solana">Solana</SelectItem>
                  <SelectItem value="eth">Ethereum</SelectItem>
                  <SelectItem value="base">Base</SelectItem>
                </SelectContent>
              </Select>

              <Input placeholder="Rechercher @KOL..." className="bg-gray-900 border-gray-800" />
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup className="mt-10">
            <SidebarGroupLabel className="text-gray-400 text-xs uppercase">Navigation</SidebarGroupLabel>
            <SidebarMenu className="mt-3 space-y-1">
              <SidebarMenuItem>
                <SidebarMenuButton className="w-full justify-start text-gray-300 hover:text-white">
                  Leaderboard
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton className="w-full justify-start text-gray-300 hover:text-white">
                  Top Calls
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton className="w-full justify-start text-gray-300 hover:text-white">
                  Analytics
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        <header className="h-16 border-b border-gray-800 bg-black/50 backdrop-blur flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Menu className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-semibold">Dashboard</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon">
              <Search className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Sun className="w-5 h-5" />
            </Button>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}