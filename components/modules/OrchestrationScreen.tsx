"use client";

import { useCallback } from "react";
import Link from "next/link";
import { AppRouteView } from "@/components/shared/AppRouteView";
import { useApi } from "@/hooks/useApi";
import { useRealtimeOrchestrationJobs } from "@/hooks/useRealtime";
import { asNumber, asText, extractItems } from "@/components/modules/module-utils";
import { StatusBadge } from "@/components/ui/StatusBadge";

export function OrchestrationScreen() {
  const jobs = useApi<unknown>("/api/orchestration/jobs?limit=30");
  const ztp = useApi<unknown>("/api/ai/ztp/workflows?limit=10");
  const refreshJobs = jobs.refresh;
  const refreshZtp = ztp.refresh;
  const tenantId = process.env.NEXT_PUBLIC_DEMO_TENANT_ID ?? null;

  const refreshAll = useCallback(() => {
    void refreshJobs();
    void refreshZtp();
  }, [refreshJobs, refreshZtp]);

  useRealtimeOrchestrationJobs(tenantId, refreshAll);

  const jobRows = extractItems(jobs.data);
  const ztpRows = extractItems(ztp.data);

  return (
    <div className="space-y-4">
      <AppRouteView
        title="Orchestration"
        description="Track deployment, scale, heal, and zero-touch provisioning jobs in real-time."
        endpoint="/api/orchestration/jobs"
        routePath="/app/orchestration"
      />

      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="surface-card p-4">
          <h3 className="mb-3 text-base font-semibold text-slate-900">Recent Jobs</h3>
          <div className="space-y-2">
            {jobRows.length ? (
              jobRows.slice(0, 15).map((row) => (
                <div key={asText(row.id)} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-medium text-slate-800">{asText(row.job_type, "job")} · {asText(row.target_type, "-")}</p>
                    <StatusBadge status={asText(row.status, "queued")} />
                  </div>
                  <p className="text-xs text-slate-500">
                    Progress: {asNumber(row.progress_pct, row.status === "completed" ? 100 : 0)}% · {asText(row.created_at)}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">No orchestration jobs yet.</p>
            )}
          </div>
        </div>

        <div className="surface-card p-4">
          <div className="mb-3 flex items-center justify-between gap-2">
            <h3 className="text-base font-semibold text-slate-900">ZTP Workflows</h3>
            <Link href="/app/orchestration/ztp" className="text-xs font-semibold text-slate-600 hover:text-slate-900">
              Open ZTP
            </Link>
          </div>
          <div className="space-y-2">
            {ztpRows.length ? (
              ztpRows.slice(0, 10).map((row) => (
                <div key={asText(row.id)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate font-medium text-slate-800">{asText(row.name)}</p>
                    <StatusBadge status={asText(row.status, "idle")} />
                  </div>
                  <p className="text-xs text-slate-500">{asText(row.target_type, "target")}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">No ZTP workflows yet.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
