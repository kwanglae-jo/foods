import Image from "next/image";
import Link from "next/link";
import TrackedLink from "./TrackedLink";

const NAV_LINKS = [
  { href: "/#space", label: "헤리티지" },
  { href: "/#menu", label: "메뉴" },
  { href: "/about", label: "회사소개" },
  { href: "/press", label: "보도자료" },
  { href: "/#inquiry", label: "가맹점" },
];

export default function Nav() {
  return (
    <header className="nav">
      <div className="container nav__inner">
        <Link href="/" className="nav__logo">
          <Image src="/logo.png" alt="샤브광" width={28} height={28} priority />
          샤브광
        </Link>
        <nav className="nav__links">
          {NAV_LINKS.map((link) => (
            <TrackedLink key={link.label} href={link.href} gtmLabel={link.label}>
              {link.label}
            </TrackedLink>
          ))}
        </nav>
        <TrackedLink href="/#inquiry" className="nav__cta" gtmLabel="제휴 문의">
          제휴 문의
        </TrackedLink>
      </div>
    </header>
  );
}
