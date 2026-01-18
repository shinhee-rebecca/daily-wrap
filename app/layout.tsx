import type { Metadata, Viewport } from "next";
import {
  Playfair_Display,
  Source_Serif_4,
  Noto_Serif_KR,
  Cormorant_Garamond,
} from "next/font/google";
import "./globals.css";

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-headline",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const sourceSerif4 = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-body-en",
  display: "swap",
  weight: ["400", "500"],
});

const notoSerifKR = Noto_Serif_KR({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["400", "500", "600"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://dailywrap.kr";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Daily Wrap - 어제 하루, 한눈에",
    template: "%s | Daily Wrap",
  },
  description:
    "매일 아침, 어제 하루 동안 있었던 정치/경제/사회 뉴스를 AI가 자동으로 요약하여 제공하는 뉴스 큐레이션 서비스입니다. 바쁜 직장인을 위한 프리미엄 뉴스 브리핑.",
  keywords: [
    "뉴스 요약",
    "AI 뉴스",
    "데일리 브리핑",
    "정치 뉴스",
    "경제 뉴스",
    "사회 뉴스",
    "뉴스 큐레이션",
    "Daily Wrap",
  ],
  authors: [{ name: "Daily Wrap Team" }],
  creator: "Daily Wrap",
  publisher: "Daily Wrap",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: siteUrl,
    siteName: "Daily Wrap",
    title: "Daily Wrap - 어제 하루, 한눈에",
    description:
      "매일 아침, 어제 하루 동안 있었던 정치/경제/사회 뉴스를 AI가 자동으로 요약하여 제공하는 뉴스 큐레이션 서비스입니다.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Daily Wrap - AI 뉴스 큐레이션 서비스",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Daily Wrap - 어제 하루, 한눈에",
    description:
      "매일 아침, 어제 하루 동안 있었던 정치/경제/사회 뉴스를 AI가 자동으로 요약하여 제공하는 뉴스 큐레이션 서비스입니다.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
  alternates: {
    canonical: siteUrl,
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0f",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${playfairDisplay.variable} ${sourceSerif4.variable} ${notoSerifKR.variable} ${cormorantGaramond.variable}`}
    >
      <body className="antialiased">{children}</body>
    </html>
  );
}
