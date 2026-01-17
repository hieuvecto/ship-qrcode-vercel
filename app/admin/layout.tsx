import { AdminHeader } from "@/components/admin/admin-header";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <main className="container mx-auto py-6 px-4">{children}</main>
    </div>
  );
}
