"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback } from "react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { ThroughputChart } from "@/components/dashboard/ThroughputChart";
import { SessionCountChart } from "@/components/dashboard/SessionCountChart";
import { LatencyGauge } from "@/components/dashboard/LatencyGauge";
import { SliceUtilizationBar } from "@/components/dashboard/SliceUtilizationBar";
import { NetworkHealthGrid } from "@/components/dashboard/NetworkHealthGrid";
import { ActiveAlarmsWidget } from "@/components/dashboard/ActiveAlarmsWidget";
import { TopSubscribersTable } from "@/components/dashboard/TopSubscribersTable";
import { useApi } from "@/hooks/useApi";
import { useRealtimeAlarms, useRealtimeNFStatus, useRealtimeSessions } from "@/hooks/useRealtime";
import { AppRouteView } from "@/components/shared/AppRouteView";
import { asNumber, asText, extractItems, statusOf } from "@/components/modules/module-utils";

const dashboardGuideSteps = [
  {
    id: "kpi",
    title: "Scan KPI tiles first",
    description: "Read sessions, NF count, and critical alarms before running changes.",
    href: "/app/dashboard",
  },
  {
    id: "alerts",
    title: "Triage alerts and incidents",
    description: "Resolve critical alarms before automation so remediation is safe.",
    href: "/app/monitoring/alerts",
  },
  {
    id: "nf",
    title: "Validate network function health",
    description: "Confirm AMF/SMF/UPF status and versions before scale or config updates.",
    href: "/app/network-functions",
  },
  {
    id: "subscribers",
    title: "Check subscriber impact",
    description: "Review affected IMSI/MSISDN users before policy or slice actions.",
    href: "/app/subscribers",
  },
  {
    id: "ai",
    title: "Apply AI actions with review",
    description: "Use confidence and 'Why this?' details, then confirm as human governor.",
    href: "/app/ai/intent",
  },
  {
    id: "billing",
    title: "Verify billing outcomes",
    description: "Validate CDR and credit impact after operational adjustments.",
    href: "/app/billing",
  },
] as const;

export function DashboardScreen() {
  const health = useApi<Record<string, unknown>>("/api/monitoring/health");
  const sessions = useApi<Record<string, unknown>>("/api/sessions/stats");
  const nf = useApi<unknown>("/api/network-functions?limit=8");
  const alarms = useApi<unknown>("/api/faults/alarms?limit=8");
  const subs = useApi<unknown>("/api/subscribers?limit=6");
  const refreshHealth = health.refresh;
  const refreshSessions = sessions.refresh;
  const refreshNf = nf.refresh;
  const refreshAlarms = alarms.refresh;
  const refreshSubs = subs.refresh;
  const tenantId = process.env.NEXT_PUBLIC_DEMO_TENANT_ID ?? null;

  const refreshAll = useCallback(() => {
    void refreshHealth();
    void refreshSessions();
    void refreshNf();
    void refreshAlarms();
    void refreshSubs();
  }, [refreshAlarms, refreshHealth, refreshNf, refreshSessions, refreshSubs]);

  useRealtimeAlarms(tenantId, refreshAll);
  useRealtimeNFStatus(tenantId, refreshAll);
  useRealtimeSessions(tenantId, refreshAll);

  const nfRows = extractItems(nf.data);
  const alarmRows = extractItems(alarms.data);
  const subRows = extractItems(subs.data);

  const activeSessions = asNumber((sessions.data as Record<string, unknown> | null)?.active);
  const totalSessions = asNumber((sessions.data as Record<string, unknown> | null)?.total);
  const totalNf = asNumber(((health.data as Record<string, unknown> | null)?.network_functions as Record<string, unknown> | undefined)?.total);
  const criticalAlarms = asNumber(((health.data as Record<string, unknown> | null)?.alarms as Record<string, unknown> | undefined)?.critical);

  return (
    <div className="space-y-4">
      <AppRouteView
        title="Dashboard"
        description="Realtime KPI and health overview for the mobile core platform."
        endpoint="/api/monitoring/health"
        routePath="/app/dashboard"
      />

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Active Sessions"
          value={activeSessions.toLocaleString()}
          unit={`/ ${totalSessions.toLocaleString()} total`}
          delta="↑ 8.2%"
          trend="up"
          accentColor="#3b82f6"
        />
        <MetricCard
          title="Network Functions"
          value={totalNf.toLocaleString()}
          unit="4G/5G Core"
          delta="↔ stable"
          trend="neutral"
          accentColor="#06b6d4"
        />
        <MetricCard
          title="Critical Alarms"
          value={criticalAlarms.toLocaleString()}
          delta={criticalAlarms > 0 ? `⚠ ${criticalAlarms} need attention` : undefined}
          trend={criticalAlarms > 0 ? "down" : "neutral"}
          accentColor="#f43f5e"
        />
        <MetricCard
          title="Automation"
          value="Ready"
          delta="AI enabled"
          trend="up"
          accentColor="#10b981"
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <ThroughputChart loading={health.loading} />
        <SessionCountChart loading={sessions.loading} />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <LatencyGauge value={42} title="Avg Latency" unit="ms" loading={health.loading} />
        <SliceUtilizationBar loading={health.loading} />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <NetworkHealthGrid loading={nf.loading} />
        <ActiveAlarmsWidget alarms={alarmRows.length ? (alarmRows as Parameters<typeof ActiveAlarmsWidget>[0]["alarms"]) : undefined} loading={alarms.loading} />
      </section>

      <section>
        <TopSubscribersTable subscribers={subRows.length ? (subRows as Parameters<typeof TopSubscribersTable>[0]["subscribers"]) : undefined} loading={subs.loading} />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="dark-mesh relative overflow-hidden rounded-[24px] border border-sky-900/40 p-4 text-white md:p-5">
          <div className="absolute -right-14 -top-14 h-36 w-36 rounded-full bg-cyan-300/25 blur-3xl" />
          <div className="absolute -bottom-10 right-8 h-28 w-28 rounded-full bg-emerald-300/20 blur-2xl" />

          <p className="text-xs uppercase tracking-[0.16em] text-cyan-100">Operator Playbook</p>
          <h3 className="mt-1 text-xl font-semibold">How to use this dashboard</h3>
          <p className="mt-1 text-sm text-slate-100">
            Follow this sequence for trust-first, human-controlled operations and faster incident recovery.
          </p>

          <div className="mt-4 grid gap-2">
            {dashboardGuideSteps.map((step, idx) => (
              <div key={step.id} className={`glass-panel rounded-xl p-2.5 fade-in-up delay-${(idx % 4) + 1}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="pulse-dot mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-cyan-200/20 text-xs font-semibold text-cyan-100">
                      {idx + 1}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-white">{step.title}</p>
                      <p className="text-xs text-slate-200">{step.description}</p>
                    </div>
                  </div>
                  <Link
                    href={step.href}
                    className="rounded border border-white/30 bg-white/10 px-2 py-1 text-xs font-semibold text-white hover:bg-white/20"
                  >
                    Open
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => window.dispatchEvent(new Event("ngcmcp:open-walkthrough"))}
              className="rounded-lg bg-white px-3 py-1.5 text-sm font-semibold text-slate-900"
            >
              Start Guided Walkthrough
            </button>
            <Link
              href="/docs"
              className="rounded-lg border border-white/40 px-3 py-1.5 text-sm font-semibold text-white hover:bg-white/10"
            >
              Read Documentation
            </Link>
          </div>
        </div>

        <aside className="surface-card p-4">
          <p className="text-xs uppercase tracking-[0.15em] text-[var(--color-ink-muted)]">Interaction Map</p>
          <h3 className="mt-1 text-base font-semibold text-[var(--color-ink)]">Navigate with clarity</h3>
          <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
            Use quick links for deep dives, then return to dashboard to verify KPI movement and alarm reduction.
          </p>

          <div className="image-frame mt-3 float-y">
            <Image
              src="/visuals/module-console.svg"
              alt="Platform module console visualization"
              width={1024}
              height={640}
              className="h-auto w-full object-cover"
              priority
            />
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <Link href="/app/monitoring" className="kpi-tile lift-card text-xs font-semibold text-[var(--color-ink)] hover:text-[var(--color-primary)]">
              Monitoring
            </Link>
            <Link href="/app/network-functions" className="kpi-tile lift-card text-xs font-semibold text-[var(--color-ink)] hover:text-[var(--color-primary)]">
              Network Functions
            </Link>
            <Link href="/app/subscribers" className="kpi-tile lift-card text-xs font-semibold text-[var(--color-ink)] hover:text-[var(--color-primary)]">
              Subscribers
            </Link>
            <Link href="/app/ai/intent" className="kpi-tile lift-card text-xs font-semibold text-[var(--color-ink)] hover:text-[var(--color-primary)]">
              AI Intent
            </Link>
          </div>
        </aside>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <div className="surface-card p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-base font-semibold text-[var(--color-ink)]">Network Function Snapshot</h3>
            <Link href="/app/network-functions" className="text-xs font-semibold text-[var(--color-ink-muted)] hover:text-[var(--color-primary)]">
              Open module
            </Link>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {nfRows.length ? (
              nfRows.slice(0, 6).map((row) => (
                <div key={asText(row.id)} className="rounded-lg border border-slate-200 bg-white p-3">
                  <p className="truncate text-sm font-semibold text-slate-900">{asText(row.name)}</p>
                  <p className="text-xs text-slate-500">{asText(row.nf_type)} · {asText(row.generation)}</p>
                  <div className="mt-2">
                    <StatusBadge status={statusOf(row)} />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">No network functions available.</p>
            )}
          </div>
        </div>

        <div className="surface-card p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-base font-semibold text-[var(--color-ink)]">Recent Alarm Feed</h3>
            <Link href="/app/monitoring/alerts" className="text-xs font-semibold text-[var(--color-ink-muted)] hover:text-[var(--color-primary)]">
              Manage alerts
            </Link>
          </div>
          <div className="space-y-2">
            {alarmRows.length ? (
              alarmRows.slice(0, 6).map((row) => (
                <div key={asText(row.id)} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-medium text-slate-800">{asText(row.alarm_type, "Alarm")}</p>
                    <StatusBadge status={statusOf(row)} />
                  </div>
                  <p className="text-xs text-slate-500">{asText(row.raised_at, asText(row.created_at))}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">No active alarms.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
