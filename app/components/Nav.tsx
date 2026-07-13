export default function Nav() {
  return (
    <header className="nav">
      <div className="container nav__inner">
        <a href="#" className="nav__logo">
          샤브광
        </a>
        <nav className="nav__links">
          <a href="#space">헤리티지</a>
          <a href="#menu">메뉴</a>
          <a href="#space">공간</a>
          <a href="#inquiry">가맹점</a>
        </nav>
        <a href="#inquiry" className="nav__cta">
          제휴 문의
        </a>
      </div>
    </header>
  );
}
