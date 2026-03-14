"use client";

import Link from "next/link";
import { useSession } from "@/hooks/useSession";
import { getRoleLabel } from "@/lib/roles";

export function Header() {
  const { data } = useSession();
  const role = data?.profile?.role;

  return (
    <header className="sticky top-0 z-30 border-b border-[var(--color-border)] bg-[var(--color-surface)]/95 backdrop-blur-md">
      <div className="flex items-center justify-between gap-4 px-4 py-3 lg:px-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-ink-muted)]">NextGen Mobile Core</p>
          <p className="text-sm text-[var(--color-ink)]">Live tenant-aware operations center</p>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {role ? (
            <span className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-1.5 text-xs font-medium text-[var(--color-ink-muted)]">
              {getRoleLabel(role)}
            </span>
          ) : null}
          <span className="flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-1.5 text-xs text-[var(--color-ink)]">
            <span className="pulse-dot inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            Platform healthy
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Link href="/app/settings/profile" className="rounded-lg border border-[var(--color-border)] px-3 py-1.5 text-[var(--color-ink-muted)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-ink)]">
            Profile
          </Link>
          <Link href="/api/auth/logout" className="btn-dark-visible px-3 py-1.5 text-white">
            Logout
          </Link>
        </div>
      </div>
    </header>
  );
}
