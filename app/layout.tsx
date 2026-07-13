import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "샤브광 가맹점 모집 | 1인샤브샤브 전문 브랜드",
  description:
    "작은 매장, 낮은 창업비용, 확실한 아이템 — 1인샤브샤브 전문 브랜드 샤브광 가맹 상담을 신청하세요.",
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
