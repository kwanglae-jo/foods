import InquiryForm from "./components/InquiryForm";

const STRENGTHS = [
  {
    num: "01",
    title: "1인 전용 샤브샤브 모델",
    desc: "소형 매장 기반의 1인 샤브샤브 콘셉트로 회전율과 효율이 높습니다",
  },
  {
    num: "02",
    title: "표준화된 레시피 및 소스",
    desc: "본사에서 육수·소스를 표준 공급해 맛의 편차 없이 운영 가능합니다",
  },
  {
    num: "03",
    title: "낮은 창업 비용",
    desc: "소형 평수로도 창업 가능해 초기 투자 부담을 줄였습니다",
  },
  {
    num: "04",
    title: "운영 교육 및 관리 지원",
    desc: "오픈 전 교육부터 오픈 후 운영 관리까지 본사가 함께합니다",
  },
];

const STEPS = [
  { n: "1", title: "상담 신청", desc: "온라인 문의 접수" },
  { n: "2", title: "상담 및 입지 확인", desc: "희망 지역 상권 분석" },
  { n: "3", title: "계약 체결", desc: "가맹 계약 및 일정 협의" },
  { n: "4", title: "인테리어 및 교육", desc: "공사와 운영 교육 진행" },
  { n: "5", title: "오픈", desc: "매장 그랜드 오픈" },
];

const NUMBERS = [
  { value: "38", label: "가맹 매장 수" },
  { value: "72%", label: "재방문율" },
  { value: "4,500만원", label: "평균 창업 비용" },
  { value: "2개월", label: "평균 오픈 소요기간" },
];

const FAQS = [
  {
    q: "Q. 창업 경험이 없어도 가능한가요?",
    a: "A. 네, 오픈 전후 체계적인 운영 교육을 제공하여 초보 창업자도 안정적으로 운영하실 수 있습니다.",
  },
  {
    q: "Q. 1인 운영도 가능한가요?",
    a: "A. 네, 샤브광은 1인 운영을 고려한 소형 매장 구조와 조리 프로세스로 설계되어 있습니다.",
  },
  {
    q: "Q. 창업 비용은 어느 정도인가요?",
    a: "A. 매장 평수와 지역에 따라 상이하며, 상담을 통해 정확한 견적을 안내해 드립니다.",
  },
  {
    q: "Q. 상담 신청 후 얼마나 걸리나요?",
    a: "A. 문의 접수 후 영업일 기준 1~2일 내 담당자가 연락드립니다.",
  },
];

export default function Home() {
  return (
    <main>
      {/* Hero */}
      <section className="hero">
        <div className="hero__bg" aria-hidden />
        <div className="hero__inner">
          <span className="badge">샤브광 가맹점 모집</span>
          <h1 className="hero__title">샤브광에서 1인샤브를 즐겨보세요</h1>
          <p className="hero__subtitle">
            작은 매장, 낮은 창업비용, 확실한 아이템 — 1인샤브샤브 전문 브랜드 샤브광과
            함께하세요
          </p>
          <a href="#inquiry" className="btn-primary">
            가맹 상담 문의하기
          </a>
        </div>
      </section>

      {/* Strengths */}
      <section className="section strengths">
        <div className="container">
          <h2 className="section-title">샤브광 가맹의 장점</h2>
          <div className="strength-grid">
            {STRENGTHS.map((s) => (
              <div className="strength-card" key={s.num}>
                <div className="strength-card__num">{s.num}</div>
                <h3 className="strength-card__title">{s.title}</h3>
                <p className="strength-card__desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="section process">
        <div className="container">
          <h2 className="section-title">가맹 절차 안내</h2>
          <div className="process-grid">
            {STEPS.map((step) => (
              <div className="step" key={step.n}>
                <div className="step__circle">{step.n}</div>
                <div>
                  <h3 className="step__title">{step.title}</h3>
                  <p className="step__desc">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Numbers */}
      <section className="section numbers">
        <div className="container">
          <div className="numbers-grid">
            {NUMBERS.map((n) => (
              <div className="stat" key={n.label}>
                <div className="stat__value">{n.value}</div>
                <div className="stat__label">{n.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Inquiry */}
      <section className="section inquiry" id="inquiry">
        <div className="container">
          <h2 className="section-title">가맹 상담 문의</h2>
          <p className="section-subtitle">
            희망 지역과 연락처를 남겨주시면 담당자가 빠르게 연락드립니다
          </p>
          <InquiryForm />
        </div>
      </section>

      {/* FAQ */}
      <section className="section faq">
        <div className="container">
          <h2 className="section-title">자주 묻는 질문</h2>
          <div className="faq-list">
            {FAQS.map((f) => (
              <div className="faq-item" key={f.q}>
                <p className="faq-item__q">{f.q}</p>
                <p className="faq-item__a">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section final-cta">
        <div className="container">
          <h2 className="final-cta__title">지금, 샤브광과 함께 시작하세요</h2>
          <p className="final-cta__subtitle">
            희망 지역을 남기시면 담당자가 맞춤 상담을 도와드립니다
          </p>
          <a href="#inquiry" className="btn-primary">
            가맹 상담 문의하기
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p className="footer__brand">샤브광 가맹본부</p>
        <p className="footer__line">
          문의: 000-0000-0000 | 이메일: contact@shabugwang.example.com
        </p>
        <p className="footer__line">© 2026 샤브광. All rights reserved.</p>
      </footer>
    </main>
  );
}
