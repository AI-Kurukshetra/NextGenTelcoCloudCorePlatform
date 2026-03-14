"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { appNav } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { useSession } from "@/hooks/useSession";
import { canAccessAdmin } from "@/lib/roles";

export function MobileNav() {
  const pathname = usePathname();
  const { data } = useSession();
  const showAdmin = canAccessAdmin(data?.profile?.role);
  const navItems = appNav.filter((item) => !(item.adminOnly && !showAdmin)).slice(0, 10);

  return (
    <div className="sticky top-0 z-20 block border-b border-[var(--color-border)] bg-[var(--color-surface)]/95 p-2 backdrop-blur lg:hidden">
      <div className="flex gap-2 overflow-x-auto">
        {navItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "whitespace-nowrap rounded-full border px-3 py-1 text-xs font-semibold transition-colors",
                active
                  ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
                  : "border-[var(--color-border)] bg-[var(--color-surface-2)] text-[var(--color-ink)] hover:border-[var(--color-border-hover)]",
              )}
            >
              {item.title}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
