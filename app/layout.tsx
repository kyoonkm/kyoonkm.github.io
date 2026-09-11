import type { Metadata } from "next";
import { Instrument_Sans, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";

/**
 * Satoshi carries the display voice — name, thesis, section headings —
 * self-hosted from public/fonts rather than Fontshare's CDN, so the page does
 * not block first paint on a third-party request. Instrument Sans carries body
 * and UI.
 */
const satoshi = localFont({
  src: [
    { path: "../public/fonts/Satoshi-400.woff2", weight: "400", style: "normal" },
    { path: "../public/fonts/Satoshi-500.woff2", weight: "500", style: "normal" },
    { path: "../public/fonts/Satoshi-700.woff2", weight: "700", style: "normal" },
  ],
  display: "swap",
  variable: "--font-satoshi",
});

/* Body voice: more grip than Geist at small sizes, and it sits under Satoshi
   without competing with it. */
const bodySans = Instrument_Sans({
  variable: "--font-body",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kayoon Kim",
  description:
    "Kayoon Kim — researcher in human–AI interaction, social agents and responsible AI at ELLIS Institute Tübingen.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head>
        <link rel="icon" href="/favicon.png" sizes="16x16" type="image/png" />
      </head>
      <body
        className={`${bodySans.variable} ${geistMono.variable} ${satoshi.variable} antialiased`}
      >
        {children}
      </body>
      <GoogleAnalytics gaId="G-ZMKTLB83TF" />
    </html>
  );
}
