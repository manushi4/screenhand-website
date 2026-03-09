import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "ScreenHand — Give AI Hands",
  description:
    "Native desktop control for AI agents. See, click, type, drag — everything a human can do, now your AI can too.",
  openGraph: {
    title: "ScreenHand — Give AI Hands",
    description:
      "Native desktop control for AI agents. 82 MCP tools for complete desktop automation.",
    images: ["/assets/hero.webp"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ScreenHand — Give AI Hands",
    description: "Native desktop control for AI agents.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} antialiased bg-black text-white`}
      >
        <SmoothScroll />
        {children}
        <div className="noise-overlay" aria-hidden="true" />
      </body>
    </html>
  );
}
