import type { Metadata } from "next";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import Reveal from "../components/Reveal";

export const metadata: Metadata = {
  title: "보도자료 | 샤브광",
  description: "샤브광의 소식을 다양한 매체 보도자료로 만나보세요.",
};

const PRESS = [
  {
    date: "2026.07",
    source: "푸드투데이",
    text: "샤브광, 프리미엄 샤브 다이닝 새 기준 제시하며 가맹 확장",
  },
  {
    date: "2026.05",
    source: "창업경제신문",
    text: "1인 운영 가능한 소형 매장 모델로 주목받는 샤브광",
  },
  {
    date: "2026.03",
    source: "외식산업뉴스",
    text: "샤브광, 지역 농가 상생 프로젝트로 신선육수팩 공급 확대",
  },
  {
    date: "2025.11",
    source: "프랜차이즈타임즈",
    text: "샤브광, 전국 가맹점 30호점 돌파 기념 인터뷰",
  },
  {
    date: "2025.08",
    source: "매일창업",
    text: "낮은 초기 비용으로 시작하는 샤브샤브 창업, 샤브광이 답이다",
  },
];

export default function PressPage() {
  return (
    <main>
      <Nav />

      <section className="section page-header">
        <div className="container">
          <Reveal>
            <p className="eyebrow">PRESS</p>
            <h1 className="section-title">보도자료</h1>
            <p className="section-subtitle">
              샤브광의 소식을 다양한 매체에서 만나보세요.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section news">
        <div className="container">
          <div className="news-list">
            {PRESS.map((p, i) => (
              <Reveal key={p.date + p.text} delay={i * 0.06}>
                <div className="news-item hover-shift">
                  <span className="news-item__date">{p.date}</span>
                  <span className="news-item__text">
                    [{p.source}] {p.text}
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
