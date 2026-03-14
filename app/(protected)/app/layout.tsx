import type { ReactNode } from "react";
import { Header } from "@/components/layout/Header";
import { MobileNav } from "@/components/layout/MobileNav";
import { NotificationPanel } from "@/components/layout/NotificationPanel";
import { AppWalkthrough } from "@/components/onboarding/AppWalkthrough";
import { Sidebar } from "@/components/layout/Sidebar";
import { ToastProvider } from "@/components/ui/ToastProvider";

export default function ProtectedAppLayout({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <div className="min-h-screen lg:flex">
        <Sidebar />
        <div className="flex min-h-screen flex-1 flex-col bg-[var(--color-bg)] bg-[radial-gradient(ellipse_80%_50%_at_30%_10%,rgba(59,130,246,0.08)_0%,transparent_50%)]">
          <MobileNav />
          <Header />
          <main id="main-content" className="flex-1 p-4 lg:p-6">
            {children}
          </main>
        </div>
        <aside className="hidden w-80 border-l border-[var(--color-border)] bg-[var(--color-surface)]/95 p-4 xl:block">
          <NotificationPanel />
        </aside>
      </div>
      <AppWalkthrough />
    </ToastProvider>
  );
}
