"use client";

import { signOut } from "next-auth/react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { LogOut } from "lucide-react";
import { vi } from "@/locales/vi";

export function SignOutButton() {
  return (
    <DropdownMenuItem
      onClick={() => signOut({ callbackUrl: "/admin/login" })}
      className="cursor-pointer"
    >
      <LogOut className="mr-2 h-4 w-4" />
      {vi.common.logout}
    </DropdownMenuItem>
  );
}
