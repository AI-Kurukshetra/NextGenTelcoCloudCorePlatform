"use client";

import { useMemo, useState } from "react";
import { useApi } from "@/hooks/useApi";
import { asText, extractItems } from "@/components/modules/module-utils";
import { StatusBadge } from "@/components/ui/StatusBadge";

type Props = {
  incidentId: string;
};

export function IncidentDetail({ incidentId }: Props) {
  const { data, loading, error, refresh } = useApi<unknown>(`/api/faults/incidents/${incidentId}`);
  const [actionError, setActionError] = useState("");
  const [busy, setBusy] = useState(false);

  const incident = useMemo(() => {
    const rows = extractItems(data);
    return rows[0] ?? null;
  }, [data]);

  async function resolveIncident() {
    setActionError("");
    setBusy(true);
    try {
      const response = await fetch(`/api/faults/incidents/${incidentId}/resolve`, { method: "POST" });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.message ?? "Failed to resolve incident.");
      }
      await refresh();
    } catch (resolveError) {
      setActionError(resolveError instanceof Error ? resolveError.message : "Failed to resolve incident.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="surface-card p-4 md:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--color-ink-muted)]">Incident</p>
          <h1 className="mt-1 text-2xl font-semibold text-[var(--color-ink)]">{incident ? asText(incident.title, incidentId) : `Incident ${incidentId}`}</h1>
        </div>
        <button type="button" onClick={resolveIncident} disabled={busy} className="btn-dark-visible px-3 py-1.5 text-sm disabled:opacity-50">
          {busy ? "Resolving…" : "Mark Resolved"}
        </button>
      </div>

      {loading ? <p className="mt-4 text-sm text-[var(--color-ink-muted)]">Loading incident detail…</p> : null}
      {error ? <p className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p> : null}
      {actionError ? <p className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{actionError}</p> : null}

      {incident ? (
        <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_300px]">
          <div className="space-y-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-4">
            <p className="text-sm text-[var(--color-ink-muted)]">{asText(incident.description, "No description available.")}</p>
            <div className="grid gap-2 text-sm text-[var(--color-ink-muted)] sm:grid-cols-2">
              <p><span className="font-semibold text-[var(--color-ink)]">Owner:</span> {asText(incident.owner, "Unassigned")}</p>
              <p><span className="font-semibold text-[var(--color-ink)]">Service:</span> {asText(incident.service_name, "Core")}</p>
              <p><span className="font-semibold text-[var(--color-ink)]">Started:</span> {asText(incident.created_at, "-")}</p>
              <p><span className="font-semibold text-[var(--color-ink)]">Updated:</span> {asText(incident.updated_at, "-")}</p>
            </div>
          </div>

          <aside className="space-y-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-ink-muted)]">Current State</p>
            <div className="flex items-center gap-2">
              <StatusBadge status={asText(incident.severity, "info")} />
              <StatusBadge status={asText(incident.status, "open")} />
            </div>
            <p className="text-xs text-[var(--color-ink-dim)]">Correlation ID: {asText(incident.correlation_id, "n/a")}</p>
          </aside>
        </div>
      ) : null}
    </section>
  );
}
