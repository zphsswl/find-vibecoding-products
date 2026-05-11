import type { Metadata } from "next";
import { Noto_Sans_SC, Noto_Serif_SC } from "next/font/google";
import "./globals.css";
import { AnalyticsTracker } from "@/components/analytics-tracker";
import { SiteHeader } from "@/components/site-header";

const sans = Noto_Sans_SC({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans"
});

const serif = Noto_Serif_SC({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-serif"
});

export const metadata: Metadata = {
  title: "Vibe Coding Gallery",
  description: "A curated archive for discovering, browsing, and evaluating vibe coding projects."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN" className={`${sans.variable} ${serif.variable}`}>
      <body className="antialiased">
        <SiteHeader />
        <AnalyticsTracker />
        {children}
      </body>
    </html>
  );
}
