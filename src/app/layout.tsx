// src/app/layout.tsx
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="bg-black text-white min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}