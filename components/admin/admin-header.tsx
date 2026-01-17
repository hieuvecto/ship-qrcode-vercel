import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ship, User, LogOut } from "lucide-react";
import { vi } from "@/locales/vi";
import Link from "next/link";
import { SignOutButton } from "./sign-out-button";

const SKIP_AUTH = process.env.SKIP_AUTH === "true";

export async function AdminHeader() {
  const session = await getServerSession(authOptions);

  // Use mock user in development mode
  const userName = SKIP_AUTH
    ? "Admin (Dev Mode)"
    : session?.user?.name || "Admin";

  return (
    <header className="border-b bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Ship className="h-6 w-6 text-blue-600" />
          <h1 className="text-xl font-bold">{vi.admin.dashboard}</h1>
          {SKIP_AUTH && (
            <span className="rounded bg-yellow-100 px-2 py-1 text-xs font-semibold text-yellow-800">
              DEV MODE
            </span>
          )}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2">
              <User className="h-5 w-5" />
              <span className="hidden sm:inline">{userName}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              {vi.admin.welcomeBack}, {userName}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {SKIP_AUTH ? (
              <DropdownMenuItem asChild>
                <Link href="/" className="flex w-full items-center gap-2">
                  <LogOut className="h-4 w-4" />
                  {vi.common.back}
                </Link>
              </DropdownMenuItem>
            ) : (
              <SignOutButton />
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
