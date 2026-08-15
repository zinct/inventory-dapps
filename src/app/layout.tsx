import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { WalletButton } from "@/components/WalletButton";
import { AppProviders } from "@/providers/AppProviders";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Stellar Inventory",
  description: "Decentralized inventory management on Stellar Soroban",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-white antialiased`}
      >
        <AppProviders>
          <header className="border-b border-neutral-200">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
                  Stellar Soroban
                </p>
                <h1 className="text-xl font-semibold text-black">Inventory DApp</h1>
              </div>
              <WalletButton />
            </div>
          </header>
          <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
        </AppProviders>
      </body>
    </html>
  );
}
