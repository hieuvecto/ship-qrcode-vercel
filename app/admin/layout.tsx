import { AdminHeader } from "@/components/admin/admin-header";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={<div className="h-16 border-b bg-white" />}>
        <AdminHeader />
      </Suspense>
      <main className="container mx-auto py-6 px-4">
        <Suspense fallback={<Skeleton className="h-96 w-full" />}>
          {children}
        </Suspense>
      </main>
    </div>
  );
}
