"use client";

import { useCallback } from "react";
import { useApi } from "@/hooks/useApi";
import { useRealtimeThreatAlerts } from "@/hooks/useRealtime";
import { asText, extractItems } from "@/components/modules/module-utils";
import { StatusBadge } from "@/components/ui/StatusBadge";

export function ThreatFeed() {
  const threats = useApi<unknown>("/api/security/threats?limit=25");
  const refreshThreats = threats.refresh;
  const tenantId = process.env.NEXT_PUBLIC_DEMO_TENANT_ID ?? null;

  const refresh = useCallback(() => {
    void refreshThreats();
  }, [refreshThreats]);

  useRealtimeThreatAlerts(tenantId, refresh);
  const rows = extractItems(threats.data);

  return (
    <section className="surface-card p-4">
      <h3 className="text-base font-semibold text-slate-900">Threat Feed</h3>
      <div className="mt-3 space-y-2">
        {rows.length ? (
          rows.map((row) => (
            <div key={asText(row.id)} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
              <div className="flex items-center justify-between gap-2">
                <p className="truncate font-medium text-slate-800">{asText(row.description, asText(row.threat_type))}</p>
                <StatusBadge status={asText(row.severity, "warning")} />
              </div>
              <p className="text-xs text-slate-500">{asText(row.occurred_at, asText(row.created_at))}</p>
            </div>
          ))
        ) : (
          <p className="text-sm text-slate-500">No threat alerts yet.</p>
        )}
      </div>
    </section>
  );
}
