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

const DESCRIPTION =
  "Kayoon Kim — researcher in human–AI interaction, social agents and responsible AI at ELLIS Institute Tübingen.";
const SITE = "https://kyoonkm.github.io";

/* Without these, a link pasted into LinkedIn, Slack or email rendered as a
   bare URL with no title card. */
export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: "Kayoon Kim",
  description: DESCRIPTION,
  openGraph: {
    type: "profile",
    url: SITE,
    siteName: "Kayoon Kim",
    title: "Kayoon Kim — human–AI interaction, social agents, responsible AI",
    description: DESCRIPTION,
    images: [
      {
        url: "/og-kayoon-kim.png",
        width: 1200,
        height: 627,
        alt: "Kayoon Kim. Studying society with AI agents and ML, for better human decisions.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kayoon Kim — human–AI interaction, social agents, responsible AI",
    description: DESCRIPTION,
    images: ["/og-kayoon-kim.png"],
  },
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
