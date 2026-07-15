import type { Metadata } from "next";
import { getAdminProfile } from "../../lib/admin-auth";
import AdminTopbar from "../components/admin/AdminTopbar";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getAdminProfile();
  return (
    <>
      {profile && <AdminTopbar profile={profile} />}
      {children}
    </>
  );
}
