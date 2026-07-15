import Image from "next/image";
import Link from "next/link";
import { SITE_CONFIG } from "../../lib/site-config";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <Image src="/logo.png" alt="샤브광" width={32} height={32} />
          {SITE_CONFIG.brandName}
        </div>
        <div className="footer__links">
          <a href="#">개인정보처리방침</a>
          <a href="#">이용약관</a>
          <a href="#">투자</a>
          <Link href="/press">뉴스룸</Link>
          <Link href="/#inquiry">문의</Link>
        </div>
        <p className="footer__line">
          상호명: {SITE_CONFIG.legalName} | 대표: {SITE_CONFIG.ceoName} | 사업자등록번호:{" "}
          {SITE_CONFIG.businessRegistrationNumber}
        </p>
        <p className="footer__line">
          주소: {SITE_CONFIG.address} | 문의: {SITE_CONFIG.phone} | 이메일: {SITE_CONFIG.email}
        </p>
        <p className="footer__copyright">© 2026 {SITE_CONFIG.brandName}. 빛나는 맛의 예술.</p>
      </div>
    </footer>
  );
}
