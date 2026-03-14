"use client";

import { useMemo, useState } from "react";
import { GDPRRequestForm } from "@/components/compliance/GDPRRequestForm";
import { useApi } from "@/hooks/useApi";
import { extractItems, asText } from "@/components/modules/module-utils";
import { StatusBadge } from "@/components/ui/StatusBadge";

export default function ComplianceGdprPage() {
  const { data, loading, error, refresh } = useApi<unknown>("/api/compliance/gdpr/requests");
  const [submitError, setSubmitError] = useState("");

  const requests = useMemo(() => extractItems(data), [data]);

  async function submitRequest(payload: {
    requester_email: string;
    request_type: "access" | "deletion" | "portability";
    subscriber_id?: string;
  }) {
    setSubmitError("");
    const response = await fetch("/api/compliance/gdpr/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const body = await response.json();
    if (!response.ok) {
      setSubmitError(body?.message ?? "Failed to submit GDPR request.");
      return;
    }
    await refresh();
  }

  return (
    <div className="space-y-4">
      <GDPRRequestForm onSubmit={submitRequest} />
      {submitError ? <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{submitError}</p> : null}
      {error ? <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p> : null}

      <section className="surface-card p-4">
        <h2 className="text-base font-semibold text-slate-900">Request History</h2>
        <div className="mt-3 space-y-2">
          {loading ? <p className="text-sm text-slate-500">Loading requests…</p> : null}
          {!loading && requests.length === 0 ? <p className="text-sm text-slate-500">No requests submitted yet.</p> : null}
          {requests.map((row) => (
            <div key={asText(row.id)} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
              <div className="flex items-center justify-between gap-2">
                <p className="font-medium text-slate-800">{asText(row.requester_email)}</p>
                <StatusBadge status={asText(row.status, "pending")} />
              </div>
              <p className="text-xs text-slate-500">{asText(row.request_type)} · {asText(row.created_at)}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
