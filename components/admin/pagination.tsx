"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { vi } from "@/locales/vi";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  total: number;
}

export function Pagination({ currentPage, totalPages, total }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    router.push(`/admin?${params.toString()}`);
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-muted-foreground">
        {vi.admin.page} {currentPage} {vi.admin.of} {totalPages} ({total} {vi.admin.totalBoats.toLowerCase()})
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage <= 1}
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          {vi.admin.previous}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage >= totalPages}
        >
          {vi.admin.next}
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
