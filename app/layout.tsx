import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "Daily Wrap - 어제 하루, 한눈에",
  description:
    "매일 아침, 어제 하루 동안 있었던 정치/경제/사회 뉴스를 AI가 자동으로 요약하여 제공하는 뉴스 큐레이션 서비스",
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
