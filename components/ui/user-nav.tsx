"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import Link from "next/link";

export function UserNav() {
  const router = useRouter();
  const { user, loading, signOut } = useAuth();

  const handleLogout = async () => {
    const { error } = await signOut();
    if (error) {
      toast.error("Failed to sign out");
    } else {
      toast.success("Signed out");
      router.push("/login");
    }
  };

  if (loading) {
    return (
      <div className="h-8 w-8 rounded-full bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
    );
  }

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link href="/login">
          <Button variant="ghost" size="sm" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
            Sign in
          </Button>
        </Link>
        <Link href="/signup">
          <Button size="sm" className="bg-zinc-800 hover:bg-zinc-700 dark:bg-zinc-200 dark:hover:bg-zinc-300 dark:text-zinc-800 text-sm">
            Sign up
          </Button>
        </Link>
      </div>
    );
  }

  const initials = user.email
    .split("@")[0]
    .slice(0, 2)
    .toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="h-8 w-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-300 text-xs font-medium hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors focus:outline-none focus:ring-1 focus:ring-zinc-300 dark:focus:ring-zinc-600">
          {initials}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48" align="end">
        <div className="px-2 py-1.5">
          <p className="text-sm font-medium truncate">{user.email.split("@")[0]}</p>
          <p className="text-xs text-zinc-500 truncate">{user.email}</p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href="/dashboard">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Dashboard
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleLogout} className="text-zinc-600 dark:text-zinc-400 cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
