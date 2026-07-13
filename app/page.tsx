import InquiryForm from "./components/InquiryForm";
import Reveal from "./components/Reveal";
import AnimatedStat from "./components/AnimatedStat";
import Hero from "./components/Hero";

const PHILOSOPHY = [
  {
    num: "01",
    title: "공간",
    subtitle: "혼자여도 편안한, 함께여도 자연스러운",
    desc: "1인 좌석부터 테이블석까지, 원목 소재와 은은한 조명으로 오래 머무르고 싶은 공간을 설계했습니다.",
  },
  {
    num: "02",
    title: "맛",
    subtitle: "정성으로 우려낸 깊은 육수",
    desc: "12시간 우려낸 육수와 매일 들여오는 신선한 재료로, 인공 조미료 없이도 깊은 맛을 냅니다.",
  },
  {
    num: "03",
    title: "운영",
    subtitle: "1인 사장님도 편안하게",
    desc: "표준화된 조리 프로세스와 본사의 물류·교육 지원으로 초보 창업자도 안정적으로 운영합니다.",
  },
];

const MENU = [
  {
    tone: "clear",
    name: "샤브광 오리지널",
    desc: "가다랑어와 다시마로 12시간 우려낸 담백한 육수. 재료 본연의 맛을 살린 샤브광의 시그니처입니다.",
  },
  {
    tone: "spicy",
    name: "얼큰 샤브",
    desc: "고추장과 고춧가루로 얼큰하게, 자극적이지 않으면서도 깊은 국물맛을 자랑합니다.",
  },
  {
    tone: "mala",
    name: "마라 샤브",
    desc: "사천식 마라향과 얼얼한 매운맛. 마라를 처음 접하는 분도 부담 없이 즐길 수 있습니다.",
  },
  {
    tone: "tomato",
    name: "토마토 샤브",
    desc: "토마토의 상큼함을 더한 산뜻한 육수. 가볍게 즐기고 싶은 날 부담 없는 한 끼입니다.",
  },
];

const NEWS = [
  { date: "2026.07", text: "샤브광, 신메뉴 '토마토 샤브' 출시" },
  { date: "2026.06", text: "샤브광, 가맹점 25호점 돌파" },
  { date: "2026.05", text: "샤브광, 상반기 우수 가맹점 3곳 선정" },
  { date: "2026.04", text: "샤브광, 지역 농가와 협업한 신선육수팩 공급 시작" },
  { date: "2026.03", text: "샤브광, 봄맞이 고객 감사 이벤트 진행" },
];

const STEPS = [
  { n: "1", title: "창업 상담", desc: "온라인 문의 접수" },
  { n: "2", title: "상권 조사", desc: "희망 지역 상권 분석" },
  { n: "3", title: "점포 선정", desc: "입지 확인 및 계약 검토" },
  { n: "4", title: "인테리어 디자인", desc: "설계 및 견적 산출" },
  { n: "5", title: "가맹 계약", desc: "계약 체결 및 일정 협의" },
  { n: "6", title: "인테리어 착공", desc: "공사 진행 및 현장 점검" },
  { n: "7", title: "운영 교육", desc: "조리·매장 운영 실습 교육" },
  { n: "8", title: "그랜드 오픈", desc: "매장 오픈 및 초기 운영 지원" },
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
      <Hero />

      {/* Philosophy */}
      <section className="section philosophy">
        <div className="container">
          <Reveal>
            <h2 className="section-title">샤브광이 만드는 세 가지 기준</h2>
            <p className="section-subtitle">
              공간, 맛, 운영 — 세 가지가 맞물려야 오래가는 브랜드가 됩니다
            </p>
          </Reveal>
          <div className="philosophy-grid">
            {PHILOSOPHY.map((p, i) => (
              <Reveal key={p.num} delay={i * 0.1}>
                <div className="philosophy-card hover-lift">
                  <div className="philosophy-card__num">{p.num}</div>
                  <h3 className="philosophy-card__title">{p.title}</h3>
                  <p className="philosophy-card__subtitle">{p.subtitle}</p>
                  <p className="philosophy-card__desc">{p.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Menu */}
      <section className="section menu">
        <div className="container">
          <Reveal>
            <h2 className="section-title">샤브광 시그니처 메뉴</h2>
            <p className="section-subtitle">
              매일 우려내는 육수로, 취향에 맞는 한 그릇을 완성합니다
            </p>
          </Reveal>
          <div className="menu-grid">
            {MENU.map((m, i) => (
              <Reveal key={m.name} delay={i * 0.08}>
                <div className="menu-card hover-lift">
                  <div className={`menu-card__swatch menu-card__swatch--${m.tone}`} />
                  <h3 className="menu-card__name">{m.name}</h3>
                  <p className="menu-card__desc">{m.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* News */}
      <section className="section news">
        <div className="container">
          <Reveal>
            <h2 className="section-title">샤브광 소식</h2>
          </Reveal>
          <div className="news-list">
            {NEWS.map((n, i) => (
              <Reveal key={n.date + n.text} delay={i * 0.06}>
                <div className="news-item hover-shift">
                  <span className="news-item__date">{n.date}</span>
                  <span className="news-item__text">{n.text}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="section process">
        <div className="container">
          <Reveal>
            <h2 className="section-title">가맹 절차 안내</h2>
          </Reveal>
          <div className="process-grid">
            {STEPS.map((step, i) => (
              <Reveal key={step.n} delay={(i % 4) * 0.08}>
                <div className="step hover-lift">
                  <div className="step__circle">{step.n}</div>
                  <div>
                    <h3 className="step__title">{step.title}</h3>
                    <p className="step__desc">{step.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Numbers */}
      <section className="section numbers">
        <div className="container">
          <div className="numbers-grid">
            {NUMBERS.map((n, i) => (
              <Reveal key={n.label} delay={i * 0.1}>
                <div className="stat">
                  <div className="stat__value">
                    <AnimatedStat value={n.value} />
                  </div>
                  <div className="stat__label">{n.label}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Inquiry */}
      <section className="section inquiry" id="inquiry">
        <div className="container">
          <Reveal>
            <h2 className="section-title">가맹 상담 문의</h2>
            <p className="section-subtitle">
              희망 지역과 연락처를 남겨주시면 담당자가 빠르게 연락드립니다
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <InquiryForm />
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="section faq">
        <div className="container">
          <Reveal>
            <h2 className="section-title">자주 묻는 질문</h2>
          </Reveal>
          <div className="faq-list">
            {FAQS.map((f, i) => (
              <Reveal key={f.q} delay={i * 0.06}>
                <div className="faq-item hover-shift">
                  <p className="faq-item__q">{f.q}</p>
                  <p className="faq-item__a">{f.a}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section final-cta">
        <div className="container">
          <Reveal>
            <h2 className="final-cta__title">지금, 샤브광과 함께 시작하세요</h2>
            <p className="final-cta__subtitle">
              희망 지역을 남기시면 담당자가 맞춤 상담을 도와드립니다
            </p>
            <a href="#inquiry" className="btn-primary">
              가맹 상담 문의하기
            </a>
          </Reveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p className="footer__brand">샤브광 가맹본부</p>
        <p className="footer__line">
          상호명: (주)샤브광 | 대표: 홍길동 | 사업자등록번호: 000-00-00000
        </p>
        <p className="footer__line">
          주소: 서울특별시 강남구 테헤란로 000 | 문의: 000-0000-0000
        </p>
        <p className="footer__line">이메일: contact@shabugwang.example.com</p>
        <p className="footer__line">© 2026 샤브광. All rights reserved.</p>
      </footer>
    </main>
  );
}
