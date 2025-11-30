import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Metaverse Marketplace",
  description: "NFT Marketplace",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* NFT Marketplace Navigation - from tutorial _app.js */}
        <nav className="border-b p-6 bg-white shadow-lg">
          <p className="text-4xl font-bold text-gray-900">
            Metaverse Marketplace
          </p>
          <div className="flex mt-4 space-x-6">
            <Link
              href="/"
              className="text-pink-500 hover:text-pink-600 font-semibold"
            >
              Home
            </Link>
            <Link
              href="/create-nft"
              className="text-pink-500 hover:text-pink-600 font-semibold"
            >
              Sell NFT
            </Link>
            <Link
              href="/my-nfts"
              className="text-pink-500 hover:text-pink-600 font-semibold"
            >
              My NFTs
            </Link>
            <Link
              href="/dashboard"
              className="text-pink-500 hover:text-pink-600 font-semibold"
            >
              Dashboard
            </Link>
          </div>
        </nav>

        {/* Page content */}
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}
