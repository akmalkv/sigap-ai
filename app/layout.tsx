import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Portal Sigap AI",
  description: "Sistem Pemantauan Kerusakan Bangunan BNPB",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${inter.className} bg-background text-gray-800`}>
        {children}
      </body>
    </html>
  );
}