import { redirect } from "next/navigation";
import { requireAdminProfile } from "../../../lib/admin-auth";
import AdminPressListClient from "../../components/admin/AdminPressListClient";

export default async function AdminPressListPage() {
  let role: "admin" | "editor" = "editor";
  try {
    const profile = await requireAdminProfile("editor");
    role = profile.role;
  } catch {
    redirect("/admin/login");
  }

  return (
    <main>
      <section className="section page-header" style={{ paddingBottom: 24 }}>
        <div className="container" style={{ textAlign: "left" }}>
          <p className="eyebrow" style={{ textAlign: "left" }}>
            ADMIN
          </p>
          <h1 className="section-title section-title--left">보도자료 관리</h1>
        </div>
      </section>
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <AdminPressListClient role={role} />
        </div>
      </section>
    </main>
  );
}
