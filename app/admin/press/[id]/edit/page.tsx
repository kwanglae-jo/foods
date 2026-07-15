import { notFound, redirect } from "next/navigation";
import { requireAdminProfile } from "../../../../../lib/admin-auth";
import { getAdminPressItemById, listAdminPressItems } from "../../../../../lib/press";
import PressForm from "../../../../components/admin/PressForm";

export default async function EditPressPage({ params }: { params: Promise<{ id: string }> }) {
  let role: "admin" | "editor" = "editor";
  try {
    const profile = await requireAdminProfile("editor");
    role = profile.role;
  } catch {
    redirect("/admin/login");
  }

  const { id } = await params;
  const [item, allItems] = await Promise.all([getAdminPressItemById(id), listAdminPressItems()]);
  if (!item) notFound();

  const otherItems = allItems.filter((i) => i.id !== id);

  return (
    <main>
      <section className="section page-header" style={{ paddingBottom: 24 }}>
        <div className="container" style={{ textAlign: "left" }}>
          <p className="eyebrow" style={{ textAlign: "left" }}>
            ADMIN
          </p>
          <h1 className="section-title section-title--left">보도자료 수정</h1>
        </div>
      </section>
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <PressForm mode="edit" role={role} initial={item} otherItems={otherItems} />
        </div>
      </section>
    </main>
  );
}
