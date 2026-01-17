"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { vi } from "@/locales/vi";

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useState(searchParams.get("search") || "");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);

    if (search.trim()) {
      params.set("search", search.trim());
      params.set("page", "1"); // Reset to first page
    } else {
      params.delete("search");
    }

    startTransition(() => {
      router.push(`/admin?${params.toString()}`);
    });
  };

  const handleClear = () => {
    setSearch("");
    const params = new URLSearchParams(searchParams);
    params.delete("search");
    params.set("page", "1");

    startTransition(() => {
      router.push(`/admin?${params.toString()}`);
    });
  };

  return (
    <form onSubmit={handleSearch} className="flex gap-2">
      <div className="relative flex-1">
        <Input
          type="text"
          placeholder={vi.admin.searchPlaceholder}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pr-10"
        />
        {search && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 p-0"
            onClick={handleClear}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Button type="submit" disabled={isPending}>
        <Search className="mr-2 h-4 w-4" />
        {vi.common.search}
      </Button>
    </form>
  );
}
