import { notFound, redirect } from "next/navigation";
import { requireAdminProfile } from "../../../../../lib/admin-auth";
import { getAdminPressItemById, listAdminPressItems, toPressItem } from "../../../../../lib/press";
import { getAdjacentItems, getRelatedItems } from "../../../../../lib/press-types";
import PressDetailView from "../../../../components/press/PressDetailView";

export default async function AdminPressPreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  try {
    await requireAdminProfile("editor");
  } catch {
    redirect("/admin/login");
  }

  const { id } = await params;
  const [record, allRecords] = await Promise.all([getAdminPressItemById(id), listAdminPressItems()]);
  if (!record) notFound();

  const item = toPressItem(record);
  const all = allRecords.map(toPressItem);
  const { prev, next } = getAdjacentItems(all, item.id);
  const related = getRelatedItems(all, item, 3);

  return (
    <main>
      <PressDetailView item={item} related={related} prev={prev} next={next} isPreview />
    </main>
  );
}
