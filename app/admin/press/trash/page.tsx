import { redirect } from "next/navigation";
import { requireAdminProfile } from "../../../../lib/admin-auth";
import AdminTrashListClient from "../../../components/admin/AdminTrashListClient";

export default async function AdminTrashPage() {
  try {
    await requireAdminProfile("admin");
  } catch {
    redirect("/admin/press");
  }

  return (
    <main>
      <section className="section page-header" style={{ paddingBottom: 24 }}>
        <div className="container" style={{ textAlign: "left" }}>
          <p className="eyebrow" style={{ textAlign: "left" }}>
            ADMIN
          </p>
          <h1 className="section-title section-title--left">휴지통</h1>
        </div>
      </section>
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <AdminTrashListClient />
        </div>
      </section>
    </main>
  );
}
