"use client";

import Link from "next/link";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { TimeSeriesChart } from "@/components/monitoring/TimeSeriesChart";
import { ActiveAlarmsWidget } from "@/components/dashboard/ActiveAlarmsWidget";
import { useApi } from "@/hooks/useApi";
import { AppRouteView } from "@/components/shared/AppRouteView";
import { asNumber, asText, extractItems, statusOf } from "@/components/modules/module-utils";

export function MonitoringScreen() {
  const health = useApi<Record<string, unknown>>("/api/monitoring/health");
  const metrics = useApi<unknown>("/api/monitoring/metrics/summary");
  const alarms = useApi<unknown>("/api/faults/alarms?limit=12");

  const metricRows = extractItems(metrics.data);
  const alarmRows = extractItems(alarms.data);

  const nfActive = asNumber(((health.data as Record<string, unknown> | null)?.network_functions as Record<string, unknown> | undefined)?.active);
  const alarmsActive = asNumber(((health.data as Record<string, unknown> | null)?.alarms as Record<string, unknown> | undefined)?.active);
  const sessionsActive = asNumber(((health.data as Record<string, unknown> | null)?.sessions as Record<string, unknown> | undefined)?.active);

  return (
    <div className="space-y-4">
      <AppRouteView
        title="Monitoring"
        description="Observe metrics, alarms, logs, and traces in one operational workspace."
        endpoint="/api/monitoring/health"
        routePath="/app/monitoring"
      />

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Active NFs"
          value={nfActive}
          delta="Operational"
          trend="up"
          accentColor="#10b981"
        />
        <MetricCard
          title="Active Alarms"
          value={alarmsActive}
          delta={alarmsActive > 0 ? `${alarmsActive} need review` : undefined}
          trend={alarmsActive > 0 ? "down" : "neutral"}
          accentColor="#f43f5e"
        />
        <MetricCard
          title="Live Sessions"
          value={sessionsActive.toLocaleString()}
          delta="Real-time"
          trend="neutral"
          accentColor="#3b82f6"
        />
        <MetricCard
          title="Alerting"
          value="Configured"
          accentColor="#8b5cf6"
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <TimeSeriesChart
          title="Metric Trend"
          series={[
            { key: "value", label: "Value", color: "#3b82f6", fillId: "ts-val" },
            { key: "min", label: "Min", color: "#06b6d4", fillId: "ts-min" },
            { key: "max", label: "Max", color: "#8b5cf6", fillId: "ts-max" },
          ]}
          valueKey="value"
          loading={metrics.loading}
        />
        <ActiveAlarmsWidget
          alarms={alarmRows.length ? (alarmRows as Parameters<typeof ActiveAlarmsWidget>[0]["alarms"]) : undefined}
          loading={alarms.loading}
        />
      </section>

      {metricRows.length > 0 && (
        <section className="chart-panel viz-panel p-4">
          <div className="chart-header">
            <p className="chart-title">Metric Snapshot</p>
            <Link href="/app/monitoring/logs" className="text-xs font-semibold text-[var(--color-primary)] hover:underline">
              Open logs
            </Link>
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4 mt-4">
            {metricRows.slice(0, 8).map((row) => {
              const name = asText(row.metric_name);
              const value = asNumber(row.metric_value);
              const unit = asText(row.unit, "");
              return (
                <div
                  key={`${name}-${asText(row.recorded_at)}`}
                  className="rounded-xl p-3 transition-colors border border-transparent hover:border-[rgba(99,155,255,0.15)]"
                  style={{ background: "rgba(255,255,255,0.02)" }}
                >
                  <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-ink-dim)]">{name}</p>
                  <p className="mt-1 text-lg font-bold text-[var(--color-ink)]">{value.toFixed(2)} {unit}</p>
                  <div className="mt-2 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(99,155,255,0.1)" }}>
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${Math.min(100, value)}%`,
                        background: value > 85 ? "#f43f5e" : value > 70 ? "#f59e0b" : "#3b82f6",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
