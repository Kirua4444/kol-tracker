// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KOL Tracker",
  description: "Top Crypto KOLs accuracy & ROI tracker",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="bg-black text-white min-h-screen">
        {children}
      </body>
    </html>
  );
}