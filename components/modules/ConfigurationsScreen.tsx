"use client";

import { useState } from "react";
import { AppRouteView } from "@/components/shared/AppRouteView";
import { ConfigVersionHistory } from "@/components/ui/ConfigVersionHistory";
import { useApi } from "@/hooks/useApi";
import { asText, extractItems } from "@/components/modules/module-utils";

type ConfigRow = {
  id: string;
  name: string;
  version?: number;
  config?: Record<string, unknown>;
  previous_value?: Record<string, unknown> | null;
  description?: string;
  updated_at?: string;
};

export function ConfigurationsScreen() {
  const configs = useApi<unknown>("/api/configurations?limit=100");
  const rows = extractItems(configs.data) as ConfigRow[];
  const [selected, setSelected] = useState<ConfigRow | null>(null);
  const [message, setMessage] = useState("");

  async function rollback(id: string) {
    setMessage("");
    const response = await fetch(`/api/configurations/${id}/rollback`, { method: "POST" });
    const body = await response.json();
    if (!response.ok) {
      setMessage(body?.message ?? "Rollback failed.");
      return;
    }
    setMessage("Rollback applied.");
    await configs.refresh();
  }

  return (
    <div className="space-y-4">
      <AppRouteView
        title="Configurations"
        description="Versioned configuration management with rollback support."
        endpoint="/api/configurations"
        routePath="/app/configurations"
      />

      <section className="surface-card p-4">
        <h3 className="text-base font-semibold text-slate-900">Configuration Registry</h3>
        <div className="mt-3 space-y-2">
          {rows.length ? (
            rows.map((row) => (
              <button
                key={row.id}
                type="button"
                onClick={() => setSelected(row)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-left"
              >
                <p className="text-sm font-medium text-slate-800">{row.name}</p>
                <p className="text-xs text-slate-500">Version {row.version ?? 1} · {asText(row.updated_at)}</p>
              </button>
            ))
          ) : (
            <p className="text-sm text-slate-500">No configurations found.</p>
          )}
        </div>
      </section>

      {selected ? (
        <section className="surface-card p-4">
          <div className="mb-3 flex items-center justify-between gap-2">
            <h3 className="text-base font-semibold text-slate-900">{selected.name}</h3>
            <button type="button" onClick={() => rollback(selected.id)} className="btn-dark-visible px-3 py-1.5 text-sm">
              Rollback
            </button>
          </div>
          <ConfigVersionHistory config={selected} />
          {message ? <p className="mt-3 text-sm text-slate-700">{message}</p> : null}
        </section>
      ) : null}
    </div>
  );
}
