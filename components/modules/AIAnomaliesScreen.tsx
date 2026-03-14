"use client";

import { useState } from "react";
import { AppRouteView } from "@/components/shared/AppRouteView";
import { useApi } from "@/hooks/useApi";
import { extractItems } from "@/components/modules/module-utils";
import { AnomalyTimeline } from "@/components/ai/AnomalyTimeline";
import type { AnomalyAlert } from "@/types";
import { StatusBadge } from "@/components/ui/StatusBadge";

export function AIAnomaliesScreen() {
  const anomalies = useApi<unknown>("/api/ai/anomalies?limit=100");
  const rows = extractItems(anomalies.data) as unknown as AnomalyAlert[];
  const [filter, setFilter] = useState<"all" | "critical" | "warning" | "info">("all");

  const filtered = filter === "all" ? rows : rows.filter((row) => row.severity === filter);

  return (
    <div className="space-y-4">
      <AppRouteView
        title="AI Anomalies"
        description="Detect, triage, and resolve anomalies with timeline context."
        endpoint="/api/ai/anomalies"
        routePath="/app/ai/anomalies"
      />

      <section className="surface-card p-4">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          {(["all", "critical", "warning", "info"] as const).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setFilter(value)}
              className={`rounded-lg border px-3 py-1 text-sm ${filter === value ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white text-slate-700"}`}
            >
              {value}
            </button>
          ))}
        </div>

        <div className="space-y-2">
          {filtered.length ? (
            filtered.map((row) => (
              <div key={row.id} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium text-slate-800">{row.anomaly_type}</p>
                  <StatusBadge status={row.severity} />
                </div>
                <p className="text-xs text-slate-500">{row.entity_type} · score {row.score ?? "-"}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-500">No anomalies for this filter.</p>
          )}
        </div>
      </section>

      <AnomalyTimeline anomalies={filtered.slice(0, 25)} />
    </div>
  );
}
