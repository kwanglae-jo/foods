import InquiryForm from "./components/InquiryForm";
import Reveal from "./components/Reveal";
import AnimatedStat from "./components/AnimatedStat";
import Hero from "./components/Hero";
import Nav from "./components/Nav";
import Footer from "./components/Footer";

const PHILOSOPHY = [
  {
    num: "01",
    title: "공간",
    desc: "호텔 라운지를 연상케 하는 고급스러운 인테리어와 프라이빗한 다이닝 공간으로 특별한 순간을 완성합니다.",
  },
  {
    num: "02",
    title: "맛",
    desc: "최상급 한우와 신선한 제철 채소, 그리고 오랜 시간 끓여낸 비법 육수가 만들어내는 깊은 풍미의 향연.",
  },
  {
    num: "03",
    title: "운영",
    desc: "체계적인 매장 관리 시스템과 전문적인 서비스 교육을 통해 언제나 최고 수준의 다이닝 경험을 제공합니다.",
  },
];

const MENU = [
  {
    tone: "clear",
    name: "오리지널 맑은 육수",
    desc: "깔끔하고 깊은 감칠맛의 정석",
  },
  {
    tone: "spicy",
    name: "얼큰 육수",
    desc: "칼칼하고 시원한 한국적인 매운맛",
  },
  {
    tone: "mala",
    name: "마라 육수",
    desc: "알싸하고 중독적인 마라의 풍미",
  },
  {
    tone: "tomato",
    name: "토마토 육수",
    desc: "새콤달콤한 이국적인 매력",
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
  { value: "38", suffix: "+", label: "가맹 예정 수" },
  { value: "72", suffix: "%", label: "재방문율" },
  { value: "4,500", suffix: "만", label: "평균 창업 비용" },
  { value: "2", suffix: "개월", label: "평균 오픈 소요기간" },
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
      <Nav />
      <Hero />

      {/* Philosophy */}
      <section className="section philosophy" id="space">
        <div className="container">
          <Reveal>
            <p className="eyebrow">THE FOUNDATION</p>
            <h2 className="section-title">세 가지 압도적 기준</h2>
            <div className="divider" />
          </Reveal>
          <div className="philosophy-grid">
            {PHILOSOPHY.map((p, i) => (
              <Reveal key={p.num} delay={i * 0.1}>
                <div className="philosophy-card hover-lift">
                  <div className="philosophy-card__num">{p.num}</div>
                  <h3 className="philosophy-card__title">{p.title}</h3>
                  <p className="philosophy-card__desc">{p.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Menu */}
      <section className="section menu" id="menu">
        <div className="container">
          <Reveal>
            <div className="menu-header">
              <div>
                <p className="eyebrow">SIGNATURE BROTHS</p>
                <h2 className="section-title section-title--left">
                  다채로운 육수의 향연
                </h2>
              </div>
              <p className="menu-header__intro">
                취향에 따라 선택할 수 있는 네 가지 시그니처 육수.
              </p>
            </div>
          </Reveal>
          <div className="menu-grid">
            {MENU.map((m, i) => (
              <Reveal key={m.name} delay={i * 0.08}>
                <div className={`menu-card menu-card--${m.tone} hover-lift`}>
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
            <p className="eyebrow">BRAND NEWS</p>
            <h2 className="section-title">샤브광 소식</h2>
            <div className="divider" />
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
            <p className="eyebrow">FRANCHISE</p>
            <h2 className="section-title">가맹 절차 안내</h2>
            <div className="divider" />
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
          <div className="numbers-panel">
            <div className="numbers-grid">
              {NUMBERS.map((n, i) => (
                <Reveal key={n.label} delay={i * 0.1}>
                  <div className="stat">
                    <div className="stat__value">
                      <AnimatedStat value={n.value} />
                      <span className="stat__suffix">{n.suffix}</span>
                    </div>
                    <div className="stat__label">{n.label}</div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section faq">
        <div className="container">
          <Reveal>
            <p className="eyebrow">FAQ</p>
            <h2 className="section-title">자주 묻는 질문</h2>
            <div className="divider" />
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

      {/* Inquiry */}
      <section className="section inquiry" id="inquiry">
        <div className="container">
          <Reveal>
            <div className="inquiry-card">
              <h2 className="section-title">가맹 상담 문의</h2>
              <p className="section-subtitle">
                희망 지역과 연락처를 남겨주시면 담당자가 빠르게 연락드립니다
              </p>
              <InquiryForm />
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </main>
  );
}
