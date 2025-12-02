import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { UserNav } from "@/components/ui/user-nav";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PlatformHub",
  description: "Manage your projects and platforms in one place",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased bg-white dark:bg-zinc-950`}>
        <AuthProvider>
          <div className="min-h-screen">
            {/* Minimal Header */}
            <header className="sticky top-0 z-50 h-14 border-b border-zinc-100 dark:border-zinc-800/50 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-sm">
              <div className="h-full px-6 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2.5">
                  <div className="h-7 w-7 rounded-md bg-zinc-800 dark:bg-zinc-200 flex items-center justify-center">
                    <span className="text-white dark:text-zinc-800 font-semibold text-xs">P</span>
                  </div>
                  <span className="font-medium text-zinc-800 dark:text-zinc-200">PlatformHub</span>
                </Link>
                <UserNav />
              </div>
            </header>
            {children}
          </div>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
