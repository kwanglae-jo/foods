"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { AdminProfile } from "../../../lib/admin-auth";

export default function AdminTopbar({ profile }: { profile: AdminProfile }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  const links = [
    { href: "/admin/press", label: "목록" },
    { href: "/admin/press/new", label: "신규 작성" },
    { href: "/admin/press/trash", label: "휴지통" },
  ];

  return (
    <div className="admin-topbar">
      <div className="container admin-topbar__inner">
        <nav className="admin-topbar__nav" aria-label="관리자 메뉴">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={pathname === link.href ? "is-active" : undefined}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="admin-topbar__user">
          <span>
            {profile.displayName ?? profile.email} · {profile.role === "admin" ? "관리자" : "편집자"}
          </span>
          <button type="button" className="btn-outline" onClick={handleLogout}>
            로그아웃
          </button>
        </div>
      </div>
    </div>
  );
}
