import { redirect } from "next/navigation";
import { requireAdminProfile } from "../../../../lib/admin-auth";
import { listAdminPressItems } from "../../../../lib/press";
import PressForm from "../../../components/admin/PressForm";

export default async function NewPressPage() {
  let role: "admin" | "editor" = "editor";
  try {
    const profile = await requireAdminProfile("editor");
    role = profile.role;
  } catch {
    redirect("/admin/login");
  }

  const otherItems = await listAdminPressItems();

  return (
    <main>
      <section className="section page-header" style={{ paddingBottom: 24 }}>
        <div className="container" style={{ textAlign: "left" }}>
          <p className="eyebrow" style={{ textAlign: "left" }}>
            ADMIN
          </p>
          <h1 className="section-title section-title--left">보도자료 신규 작성</h1>
        </div>
      </section>
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <PressForm mode="new" role={role} otherItems={otherItems} />
        </div>
      </section>
    </main>
  );
}
