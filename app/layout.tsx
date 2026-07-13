import type { Metadata } from "next";
import "./globals.css";

const title = "샤브광 가맹점 모집 | 1인샤브샤브 전문 브랜드";
const description =
  "작은 매장, 낮은 창업비용, 확실한 아이템 — 1인샤브샤브 전문 브랜드 샤브광 가맹 상담을 신청하세요.";

export const metadata: Metadata = {
  metadataBase: new URL("https://foods-kwangkwang.vercel.app"),
  title,
  description,
  openGraph: {
    title,
    description,
    type: "website",
    locale: "ko_KR",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "샤브광" }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
