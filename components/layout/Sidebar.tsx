"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { appNavGroups } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { useSession } from "@/hooks/useSession";
import { canAccessAdmin } from "@/lib/roles";

const iconByTitle: Record<string, string> = {
  Dashboard: "DS",
  "Network Functions": "NF",
  Slices: "SL",
  Subscribers: "SU",
  Sessions: "SE",
  Policies: "PO",
  Billing: "BL",
  Monitoring: "MO",
  Faults: "FT",
  Security: "SC",
  Compliance: "CP",
  Orchestration: "OR",
  Edge: "ED",
  AI: "AI",
  Marketplace: "MP",
  Topology: "TP",
  Configurations: "CF",
  Admin: "AD",
  Settings: "ST",
};

type HealthData = {
  status?: string;
  network_functions?: { total?: number; active?: number; degraded?: number };
  alarms?: { critical?: number; active?: number };
  checked_at?: string;
};

function SidebarLiveStatus() {
  const [health, setHealth] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const res = await fetch("/api/monitoring/health", { cache: "no-store" });
        const json = await res.json();
        const data = (json?.data ?? json) as HealthData;
        setHealth(data);
      } catch {
        setHealth(null);
      } finally {
        setLoading(false);
      }
    };

    void fetchHealth();
    const interval = setInterval(fetchHealth, 12_000); // poll every 12s
    return () => clearInterval(interval);
  }, []);

  const critical = health?.alarms?.critical ?? 0;
  const nfTotal = health?.network_functions?.total ?? 0;
  const nfActive = health?.network_functions?.active ?? nfTotal;
  const isHealthy = critical === 0 && (nfTotal === 0 || nfActive >= nfTotal);

  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3.5 py-3.5">
      <div className="flex items-center gap-2">
        <span
          className={cn(
            "status-dot flex-shrink-0 rounded-full",
            loading ? "animate-pulse bg-[var(--color-ink-dim)]" : isHealthy ? "bg-emerald-500" : "bg-amber-500",
          )}
        />
        <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--color-ink-muted)]">
          Realtime status
        </p>
      </div>
      <p className="mt-1.5 text-sm text-[var(--color-ink)]">
        {loading ? (
          <span className="text-[var(--color-ink-dim)]">Checking…</span>
        ) : critical > 0 ? (
          <>{critical} critical alarm{critical !== 1 ? "s" : ""} need attention.</>
        ) : nfTotal > 0 ? (
          <>Primary modules operational ({nfActive}/{nfTotal} NFs active).</>
        ) : (
          <>All primary modules operational.</>
        )}
      </p>
      <p className="mt-2 text-[10px] text-[var(--color-ink-dim)]">
        Updated {loading ? "—" : new Date().toLocaleTimeString()}
      </p>
    </div>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const { data } = useSession();
  const role = data?.profile?.role;
  const showAdmin = canAccessAdmin(role);

  const filteredGroups = appNavGroups.map((group) => ({
    ...group,
    items: group.items.filter((item) => !(item.adminOnly && !showAdmin)),
  })).filter((g) => g.items.length > 0);

  return (
    <aside className="sidebar-dark hidden w-[15.5rem] shrink-0 flex-col border-r border-[var(--color-border)] lg:flex xl:w-[16.5rem]">
      {/* Brand */}
      <Link
        href="/app/dashboard"
        className="sidebar-brand mx-3 mt-4 mb-5 block rounded-2xl border border-[var(--color-border)] px-4 py-4 transition-colors hover:border-[var(--color-border-hover)]"
      >
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--color-ink-muted)]">
          NGCMCP
        </p>
        <p className="mt-1 text-base font-semibold text-[var(--color-ink)]">Control Plane</p>
        <p className="mt-1.5 text-xs text-[var(--color-ink-muted)]">5G/4G Core Operations</p>
      </Link>

      {/* Navigation */}
      <nav className="flex-1 space-y-5 overflow-y-auto px-3 pb-4 pr-2">
        {filteredGroups.map((group) => (
          <div key={group.label}>
            <p className="mb-2 px-2.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--color-ink-dim)]">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "group flex items-center gap-2.5 rounded-lg border px-2.5 py-2 text-sm font-medium transition-all duration-200",
                      active
                        ? "border-[var(--color-primary)]/40 bg-[var(--color-primary)]/12 text-[var(--color-ink)]"
                        : "border-transparent text-[var(--color-ink-muted)] hover:border-[var(--color-border)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-ink)]",
                    )}
                  >
                    <span
                      className={cn(
                        "inline-flex h-6 w-7 shrink-0 items-center justify-center rounded-md text-[10px] font-semibold",
                        active
                          ? "bg-[var(--color-primary)]/20 text-[var(--color-primary)]"
                          : "bg-[var(--color-surface-3)] text-[var(--color-ink-dim)] group-hover:bg-[var(--color-surface-3)] group-hover:text-[var(--color-ink-muted)]",
                      )}
                    >
                      {iconByTitle[item.title] ?? "··"}
                    </span>
                    <span className="truncate">{item.title}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Live status */}
      <div className="border-t border-[var(--color-border)] px-3 py-4">
        <SidebarLiveStatus />
      </div>
    </aside>
  );
}
