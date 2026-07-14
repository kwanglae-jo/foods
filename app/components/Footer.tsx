import Image from "next/image";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <Image src="/logo.png" alt="샤브광" width={32} height={32} />
          샤브광
        </div>
        <div className="footer__links">
          <a href="#">개인정보처리방침</a>
          <a href="#">이용약관</a>
          <a href="#">투자</a>
          <a href="/#inquiry">문의</a>
        </div>
        <p className="footer__line">
          상호명: (주)샤브광 | 대표: 홍길동 | 사업자등록번호: 000-00-00000
        </p>
        <p className="footer__line">
          주소: 서울특별시 강남구 테헤란로 000 | 문의: 000-0000-0000 | 이메일:
          contact@shabugwang.example.com
        </p>
        <p className="footer__copyright">© 2026 샤브광. 빛나는 맛의 예술.</p>
      </div>
    </footer>
  );
}
