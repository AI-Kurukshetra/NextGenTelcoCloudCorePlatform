"use client";

import { useMemo } from "react";
import { ComplianceReportList } from "@/components/compliance/ComplianceReportList";
import { useApi } from "@/hooks/useApi";
import { extractItems } from "@/components/modules/module-utils";

export default function ComplianceReportsPage() {
  const { data, loading, error } = useApi<unknown>("/api/compliance/reports");
  const reports = useMemo(() => extractItems(data), [data]);

  return (
    <div className="space-y-4">
      {loading ? <p className="text-sm text-[var(--color-ink-muted)]">Loading reports…</p> : null}
      {error ? <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p> : null}
      <ComplianceReportList reports={reports as never[]} />
    </div>
  );
}
