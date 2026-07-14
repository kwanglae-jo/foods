import type { Metadata } from "next";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import Reveal from "../components/Reveal";

export const metadata: Metadata = {
  title: "회사소개 | 샤브광",
  description:
    "정직한 재료와 한결같은 맛으로 만들어가는 프리미엄 샤브샤브 브랜드, 샤브광을 소개합니다.",
};

const VALUES = [
  {
    num: "01",
    title: "정직한 재료",
    desc: "산지 직송 채소와 검증된 육류만을 사용해 믿을 수 있는 한 그릇을 완성합니다.",
  },
  {
    num: "02",
    title: "한결같은 맛",
    desc: "표준화된 레시피와 육수 제조 공정으로 어느 매장에서나 동일한 품질을 약속합니다.",
  },
  {
    num: "03",
    title: "상생하는 가맹",
    desc: "투명한 정산과 지속적인 메뉴 개발 지원으로 가맹점과 함께 성장합니다.",
  },
];

const HISTORY = [
  { year: "2023", text: "샤브광 1호점 서울 강남 오픈" },
  { year: "2024", text: "프랜차이즈 사업 개시, 표준 가맹 시스템 구축" },
  { year: "2025", text: "전국 가맹점 30호점 돌파, 지역 농가 협업 시작" },
  { year: "2026", text: "시그니처 육수 4종 리뉴얼 및 브랜드 아이덴티티 개편" },
];

export default function AboutPage() {
  return (
    <main>
      <Nav />

      <section className="section page-header">
        <div className="container">
          <Reveal>
            <p className="eyebrow">ABOUT US</p>
            <h1 className="section-title">샤브광 이야기</h1>
            <p className="section-subtitle">
              정직한 재료와 한결같은 맛으로 만들어가는 프리미엄 샤브샤브
              브랜드입니다.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section philosophy">
        <div className="container">
          <Reveal>
            <p className="eyebrow">OUR VALUES</p>
            <h2 className="section-title">핵심 가치</h2>
            <div className="divider" />
          </Reveal>
          <div className="philosophy-grid">
            {VALUES.map((v, i) => (
              <Reveal key={v.num} delay={i * 0.1}>
                <div className="philosophy-card hover-lift">
                  <div className="philosophy-card__num">{v.num}</div>
                  <h3 className="philosophy-card__title">{v.title}</h3>
                  <p className="philosophy-card__desc">{v.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section news">
        <div className="container">
          <Reveal>
            <p className="eyebrow">HISTORY</p>
            <h2 className="section-title">샤브광 연혁</h2>
            <div className="divider" />
          </Reveal>
          <div className="news-list">
            {HISTORY.map((h, i) => (
              <Reveal key={h.year} delay={i * 0.06}>
                <div className="news-item hover-shift">
                  <span className="news-item__date">{h.year}</span>
                  <span className="news-item__text">{h.text}</span>
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
