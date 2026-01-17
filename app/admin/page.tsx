import { getBoats, getTotalBoatCount } from "@/actions/boats";
import { SearchBar } from "@/components/admin/search-bar";
import { BoatTable } from "@/components/admin/boat-table";
import { Pagination } from "@/components/admin/pagination";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { vi } from "@/locales/vi";
import { Ship } from "lucide-react";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface AdminPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
  }>;
}

function BoatTableSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-64 w-full" />
    </div>
  );
}

function StatsCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">{vi.admin.boatList}</CardTitle>
            <CardDescription>
              Quản lý danh sách tàu cá và tạo mã QR
            </CardDescription>
          </div>
          <Skeleton className="h-16 w-24 rounded-lg" />
        </div>
      </CardHeader>
      <CardContent>
        <SearchBar />
      </CardContent>
    </Card>
  );
}

async function StatsCard() {
  const totalBoats = await getTotalBoatCount();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">{vi.admin.boatList}</CardTitle>
            <CardDescription>
              Quản lý danh sách tàu cá và tạo mã QR
            </CardDescription>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-2">
            <Ship className="h-5 w-5 text-blue-600" />
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{totalBoats}</p>
              <p className="text-xs text-blue-600">{vi.admin.totalBoats}</p>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <SearchBar />
      </CardContent>
    </Card>
  );
}

async function BoatList({ page, search }: { page: number; search?: string }) {
  const limit = 20;
  const { boats, total, totalPages } = await getBoats(page, limit, search);

  return (
    <>
      <BoatTable boats={boats} />
      <Pagination currentPage={page} totalPages={totalPages} total={total} />
    </>
  );
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const search = params.search;

  return (
    <div className="space-y-6">
      {/* Stats Card */}
      <Suspense fallback={<StatsCardSkeleton />}>
        <StatsCard />
      </Suspense>

      {/* Boat List */}
      <Card>
        <CardContent className="pt-6">
          <Suspense fallback={<BoatTableSkeleton />}>
            <BoatList page={page} search={search} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
