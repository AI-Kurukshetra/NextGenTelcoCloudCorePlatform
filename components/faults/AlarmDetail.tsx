"use client";

import { useMemo, useState } from "react";
import { useApi } from "@/hooks/useApi";
import { asText, extractItems } from "@/components/modules/module-utils";
import { StatusBadge } from "@/components/ui/StatusBadge";

type Props = {
  alarmId: string;
};

export function AlarmDetail({ alarmId }: Props) {
  const { data, loading, error, refresh } = useApi<unknown>(`/api/faults/alarms/${alarmId}`);
  const [busyAction, setBusyAction] = useState<"ack" | "escalate" | null>(null);
  const [actionError, setActionError] = useState("");

  const alarm = useMemo(() => {
    const rows = extractItems(data);
    return rows[0] ?? null;
  }, [data]);

  async function triggerAction(action: "acknowledge" | "escalate") {
    setActionError("");
    setBusyAction(action === "acknowledge" ? "ack" : "escalate");
    try {
      const response = await fetch(`/api/faults/alarms/${alarmId}/${action}`, { method: "POST" });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.message ?? `Unable to ${action} alarm.`);
      }
      await refresh();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : `Unable to ${action} alarm.`);
    } finally {
      setBusyAction(null);
    }
  }

  return (
    <section className="surface-card p-4 md:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--color-ink-muted)]">Alarm</p>
          <h1 className="mt-1 text-2xl font-semibold text-[var(--color-ink)]">{alarm ? asText(alarm.title, `Alarm ${alarmId}`) : `Alarm ${alarmId}`}</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => void triggerAction("acknowledge")}
            disabled={busyAction !== null}
            className="btn-surface px-3 py-1.5 text-sm disabled:opacity-50"
          >
            {busyAction === "ack" ? "Acknowledging…" : "Acknowledge"}
          </button>
          <button
            type="button"
            onClick={() => void triggerAction("escalate")}
            disabled={busyAction !== null}
            className="btn-dark-visible px-3 py-1.5 text-sm disabled:opacity-50"
          >
            {busyAction === "escalate" ? "Escalating…" : "Escalate"}
          </button>
        </div>
      </div>

      {loading ? <p className="mt-4 text-sm text-[var(--color-ink-muted)]">Loading alarm detail…</p> : null}
      {error ? <p className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p> : null}
      {actionError ? <p className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{actionError}</p> : null}

      {alarm ? (
        <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_300px]">
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-4">
            <p className="text-sm text-[var(--color-ink-muted)]">{asText(alarm.description, "No alarm context available.")}</p>
            <div className="mt-3 grid gap-2 text-sm text-[var(--color-ink-muted)] sm:grid-cols-2">
              <p><span className="font-semibold text-[var(--color-ink)]">Probable Cause:</span> {asText(alarm.probable_cause, "Unknown")}</p>
              <p><span className="font-semibold text-[var(--color-ink)]">Specific Problem:</span> {asText(alarm.specific_problem, "Unknown")}</p>
              <p><span className="font-semibold text-[var(--color-ink)]">Correlation ID:</span> {asText(alarm.correlation_id, "n/a")}</p>
              <p><span className="font-semibold text-[var(--color-ink)]">Raised At:</span> {asText(alarm.created_at, "-")}</p>
            </div>
          </div>

          <aside className="space-y-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-ink-muted)]">Current Status</p>
            <div className="flex items-center gap-2">
              <StatusBadge status={asText(alarm.severity, "info")} />
              <StatusBadge status={asText(alarm.status, "active")} />
            </div>
            <p className="text-xs text-[var(--color-ink-dim)]">Last update: {asText(alarm.updated_at, "-")}</p>
          </aside>
        </div>
      ) : null}
    </section>
  );
}
