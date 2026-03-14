"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useApi } from "@/hooks/useApi";
import { extractItems, asText } from "@/components/modules/module-utils";
import { StatusBadge } from "@/components/ui/StatusBadge";

export function IncidentList() {
  const { data, loading, error, refresh } = useApi<unknown>("/api/faults/incidents");
  const [statusFilter, setStatusFilter] = useState<"all" | "open" | "investigating" | "resolved">("all");

  const incidents = useMemo(() => {
    const items = extractItems(data);
    if (statusFilter === "all") return items;
    return items.filter((item) => asText(item.status, "unknown").toLowerCase() === statusFilter);
  }, [data, statusFilter]);

  return (
    <section className="surface-card p-4 md:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--color-ink-muted)]">Fault Management</p>
          <h1 className="mt-1 text-2xl font-semibold text-[var(--color-ink)]">Incidents</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          {(["all", "open", "investigating", "resolved"] as const).map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={
                statusFilter === status
                  ? "btn-dark-visible px-3 py-1.5 text-xs uppercase tracking-[0.08em]"
                  : "btn-ghost px-3 py-1.5 text-xs uppercase tracking-[0.08em]"
              }
            >
              {status}
            </button>
          ))}
          <button type="button" onClick={() => void refresh()} className="btn-surface px-3 py-1.5 text-xs">
            Refresh
          </button>
        </div>
      </div>

      {error ? <p className="mt-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p> : null}

      <div className="mt-4 space-y-3">
        {loading ? <p className="text-sm text-[var(--color-ink-muted)]">Loading incidents…</p> : null}
        {!loading && incidents.length === 0 ? <p className="text-sm text-[var(--color-ink-muted)]">No incidents found for the selected filter.</p> : null}
        {incidents.map((incident) => {
          const id = asText(incident.id, "-");
          const title = asText(incident.title, `Incident ${id}`);
          const summary = asText(incident.description, "No summary provided.");
          const status = asText(incident.status, "unknown");
          const severity = asText(incident.severity, "info");

          return (
            <article key={id} className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-[var(--color-ink)]">{title}</p>
                  <p className="text-xs text-[var(--color-ink-dim)]">{id}</p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={severity} />
                  <StatusBadge status={status} />
                </div>
              </div>
              <p className="mt-2 text-sm text-[var(--color-ink-muted)]">{summary}</p>
              <div className="mt-3 flex items-center justify-between gap-2 text-xs text-[var(--color-ink-dim)]">
                <span>Updated {asText(incident.updated_at, asText(incident.created_at, "-"))}</span>
                <Link href={`/app/faults/incidents/${id}`} className="font-semibold text-[var(--color-primary)] hover:underline">
                  Open detail
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
