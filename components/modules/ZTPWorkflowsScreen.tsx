"use client";

import { useState } from "react";
import { AppRouteView } from "@/components/shared/AppRouteView";
import { useApi } from "@/hooks/useApi";
import { asText, extractItems } from "@/components/modules/module-utils";
import { StatusBadge } from "@/components/ui/StatusBadge";

export function ZTPWorkflowsScreen() {
  const workflows = useApi<unknown>("/api/ai/ztp/workflows?limit=50");
  const jobs = useApi<unknown>("/api/orchestration/jobs?limit=20");
  const [message, setMessage] = useState("");

  const workflowRows = extractItems(workflows.data);
  const jobRows = extractItems(jobs.data);

  async function trigger(workflowType: string) {
    setMessage("");
    const response = await fetch("/api/ai/ztp/trigger", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        workflow_type: workflowType,
        parameters: {},
      }),
    });
    const body = await response.json();
    if (!response.ok) {
      setMessage(body?.message ?? "Failed to trigger workflow.");
      return;
    }
    setMessage(`Workflow triggered. Job ${body?.data?.id ?? ""}`);
    await jobs.refresh();
  }

  return (
    <div className="space-y-4">
      <AppRouteView
        title="ZTP Workflows"
        description="Run zero-touch provisioning templates and track orchestration progress."
        endpoint="/api/ai/ztp/workflows"
        routePath="/app/orchestration/ztp"
      />

      <section className="surface-card p-4">
        <h3 className="text-base font-semibold text-slate-900">Workflow Templates</h3>
        <div className="mt-3 grid gap-2 md:grid-cols-2">
          {workflowRows.length ? (
            workflowRows.map((row) => (
              <div key={asText(row.id)} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                <p className="text-sm font-medium text-slate-800">{asText(row.name)}</p>
                <p className="text-xs text-slate-500">{asText(row.target_type, "target")}</p>
                <button type="button" onClick={() => void trigger(asText(row.name))} className="btn-dark-visible mt-2 px-3 py-1.5 text-sm">
                  Trigger
                </button>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-500">No workflow templates found.</p>
          )}
        </div>
      </section>

      <section className="surface-card p-4">
        <h3 className="text-base font-semibold text-slate-900">Recent Jobs</h3>
        <div className="mt-3 space-y-2">
          {jobRows.length ? (
            jobRows.map((row) => (
              <div key={asText(row.id)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium text-slate-800">{asText(row.job_type)}</p>
                  <StatusBadge status={asText(row.status, "queued")} />
                </div>
                <p className="text-xs text-slate-500">{asText(row.created_at)}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-500">No jobs yet.</p>
          )}
        </div>
      </section>

      {message ? <p className="text-sm text-slate-700">{message}</p> : null}
    </div>
  );
}
