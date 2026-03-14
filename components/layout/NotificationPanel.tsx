/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useApi } from "@/hooks/useApi";
import { StatusBadge } from "@/components/ui/StatusBadge";

export function NotificationPanel() {
  const { data } = useApi<unknown>("/api/faults/alarms?limit=6");
  const alerts = Array.isArray((data as any)?.items)
    ? ((data as any).items as Array<Record<string, unknown>>)
    : Array.isArray(data)
      ? (data as Array<Record<string, unknown>>)
      : [];

  return (
    <div className="space-y-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-muted)]">Live Alert Feed</p>
        <p className="mt-1 text-sm text-[var(--color-ink)]">Realtime telecom fault and health signals.</p>
      </div>

      {alerts.length ? (
        alerts.slice(0, 5).map((alert) => (
          <div key={String(alert.id)} className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm">
            <div className="flex items-center justify-between gap-2">
              <p className="font-medium text-[var(--color-ink)]">{String(alert.alarm_type ?? "Alarm")}</p>
              <StatusBadge status={String(alert.severity ?? "info")} />
            </div>
            <p className="mt-1 text-xs text-[var(--color-ink-muted)]">{String(alert.raised_at ?? alert.created_at ?? "-")}</p>
          </div>
        ))
      ) : (
        <p className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-3 text-sm text-[var(--color-ink-muted)]">No active alerts.</p>
      )}
    </div>
  );
}
