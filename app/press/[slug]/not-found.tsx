import Nav from "../../components/Nav";
import Footer from "../../components/Footer";
import TrackedLink from "../../components/TrackedLink";

export default function PressNotFound() {
  return (
    <main>
      <Nav />
      <section className="section page-header">
        <div className="container">
          <p className="eyebrow">404</p>
          <h1 className="section-title">보도자료를 찾을 수 없습니다</h1>
          <p className="section-subtitle">
            요청하신 콘텐츠가 삭제되었거나 잘못된 주소일 수 있습니다.
          </p>
          <TrackedLink href="/press" className="btn-primary" gtmLabel="뉴스룸으로 돌아가기">
            뉴스룸으로 돌아가기
          </TrackedLink>
        </div>
      </section>
      <Footer />
    </main>
  );
}
