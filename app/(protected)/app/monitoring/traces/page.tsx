"use client";

import { useMemo } from "react";
import { TraceWaterfall } from "@/components/monitoring/TraceWaterfall";
import { useApi } from "@/hooks/useApi";
import { extractItems, asText } from "@/components/modules/module-utils";

type Trace = { id: string; trace_name?: string; duration_ms?: number | null };
type Span = { id: string; span_name?: string; service_name?: string; duration_ms?: number | null; parent_span_id?: string | null };

function toNumber(value: unknown): number | null {
  if (value == null) return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

export default function MonitoringTracesPage() {
  const { data, loading, error } = useApi<unknown>("/api/monitoring/traces");

  const traces = useMemo(() => extractItems(data), [data]);
  const firstTrace = traces[0] ?? null;

  const traceForWaterfall = useMemo((): Trace | null => {
    if (!firstTrace) return null;
    return {
      id: asText(firstTrace.id ?? firstTrace.trace_id, "unknown"),
      trace_name: asText(firstTrace.trace_name ?? firstTrace.name, "-") || undefined,
      duration_ms: toNumber(firstTrace.duration_ms ?? firstTrace.duration),
    };
  }, [firstTrace]);

  const spans = useMemo((): Span[] => {
    if (!firstTrace?.spans || !Array.isArray(firstTrace.spans)) return [];
    return (firstTrace.spans as Record<string, unknown>[]).map((s, i) => ({
      id: asText(s.id ?? s.span_id, `span-${i}`),
      span_name: asText(s.span_name ?? s.name, "-") || undefined,
      service_name: asText(s.service_name, "-") || undefined,
      duration_ms: toNumber(s.duration_ms ?? s.duration),
      parent_span_id: asText(s.parent_span_id, "") || null,
    }));
  }, [firstTrace]);

  return (
    <section className="space-y-4">
      <div className="surface-card p-4 md:p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--color-ink-muted)]">Distributed Tracing</p>
        <h1 className="mt-1 text-2xl font-semibold text-[var(--color-ink)]">Trace Waterfall</h1>
        <p className="mt-1 text-sm text-[var(--color-ink-muted)]">Analyze end-to-end request timelines across platform services.</p>
      </div>

      {loading ? <p className="text-sm text-[var(--color-ink-muted)]">Loading traces…</p> : null}
      {error ? <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p> : null}

      {traceForWaterfall ? (
        <TraceWaterfall trace={traceForWaterfall} spans={spans} />
      ) : !loading ? (
        <p className="surface-card p-4 text-sm text-[var(--color-ink-muted)]">No trace records available yet.</p>
      ) : null}
    </section>
  );
}
