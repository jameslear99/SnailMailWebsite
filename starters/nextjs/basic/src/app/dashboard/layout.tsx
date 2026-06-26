"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { TopNav } from "@/components/dashboard/TopNav";
import { LoadingState } from "@/components/ui/Feedback";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/cn";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { ready, loadingProfile, user, accounts } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const onOnboarding = pathname === "/dashboard/onboarding";

  useEffect(() => {
    if (!ready) return;
    if (!user) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }
    if (!loadingProfile && accounts.length === 0 && !onOnboarding) {
      router.replace("/dashboard/onboarding");
    }
  }, [ready, loadingProfile, user, accounts.length, onOnboarding, pathname, router]);

  if (!ready || (user && loadingProfile)) {
    return (
      <div className="flex min-h-full items-center justify-center">
        <LoadingState label="Loading your workspace…" />
      </div>
    );
  }

  if (!user) return null;

  // While redirecting an account-less user to onboarding.
  if (accounts.length === 0 && !onOnboarding) return null;

  // Onboarding renders without the full chrome.
  if (onOnboarding) {
    return <div className="min-h-full bg-background">{children}</div>;
  }

  return (
    <div className="min-h-full lg:grid lg:grid-cols-[260px_1fr]">
      {/* Desktop sidebar */}
      <aside className="hidden lg:block">
        <div className="sticky top-0 h-screen">
          <Sidebar />
        </div>
      </aside>

      {/* Mobile sidebar drawer */}
      {sidebarOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-surface-inverse/40" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-72">
            <Sidebar onNavigate={() => setSidebarOpen(false)} />
          </div>
        </div>
      ) : null}

      <div className={cn("flex min-h-screen flex-col")}>
        <TopNav onOpenSidebar={() => setSidebarOpen(true)} />
        <main className="flex-1 bg-background px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
