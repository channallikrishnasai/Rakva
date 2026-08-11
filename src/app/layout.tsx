import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Navigation, Footer } from "@/components/layout";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "RAKVA — Disaster Intelligence & Recovery Planning",
  description:
    "AI-powered platform that detects damage, determines what should be addressed first, and explains why.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-navy-950 font-sans">
        <Navigation />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
