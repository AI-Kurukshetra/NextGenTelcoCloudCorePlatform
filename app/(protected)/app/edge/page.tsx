"use client";

import Link from "next/link";
import { useMemo } from "react";
import { EdgeClusterCard } from "@/components/edge/EdgeClusterCard";
import { useApi } from "@/hooks/useApi";
import { extractItems, asText } from "@/components/modules/module-utils";

export default function EdgePage() {
  const { data, loading, error } = useApi<unknown>("/api/edge/clusters");
  const clusters = useMemo(() => extractItems(data), [data]);

  return (
    <section className="space-y-4">
      <div className="surface-card p-4 md:p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--color-ink-muted)]">Edge Operations</p>
        <h1 className="mt-1 text-2xl font-semibold text-[var(--color-ink)]">Clusters</h1>
      </div>
      {loading ? <p className="text-sm text-[var(--color-ink-muted)]">Loading clusters…</p> : null}
      {error ? <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p> : null}
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {clusters.map((row) => {
          const id = asText(row.id);
          return (
            <div key={id} className="space-y-2">
              <EdgeClusterCard cluster={row as never} />
              <Link href={`/app/edge/${id}`} className="btn-ghost w-full px-3 py-1.5 text-xs font-semibold">
                Open Cluster
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
}
