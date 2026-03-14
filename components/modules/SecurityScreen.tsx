"use client";

import { useCallback } from "react";
import { AppRouteView } from "@/components/shared/AppRouteView";
import { useApi } from "@/hooks/useApi";
import { useRealtimeThreatAlerts } from "@/hooks/useRealtime";
import { asText, extractItems } from "@/components/modules/module-utils";
import { StatusBadge } from "@/components/ui/StatusBadge";

export function SecurityScreen() {
  const threats = useApi<unknown>("/api/security/threats?limit=20");
  const policies = useApi<unknown>("/api/security/policies?limit=10");
  const refreshThreats = threats.refresh;
  const refreshPolicies = policies.refresh;
  const tenantId = process.env.NEXT_PUBLIC_DEMO_TENANT_ID ?? null;

  const refreshAll = useCallback(() => {
    void refreshThreats();
    void refreshPolicies();
  }, [refreshPolicies, refreshThreats]);

  useRealtimeThreatAlerts(tenantId, refreshAll);

  const threatRows = extractItems(threats.data);
  const policyRows = extractItems(policies.data);

  return (
    <div className="space-y-4">
      <AppRouteView
        title="Security"
        description="Live threat feed, security policies, and zero-trust control surface."
        endpoint="/api/security/policies"
        routePath="/app/security"
      />

      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="surface-card p-4">
          <h3 className="mb-3 text-base font-semibold text-slate-900">Live Threat Feed</h3>
          <div className="space-y-2">
            {threatRows.length ? (
              threatRows.slice(0, 12).map((row) => (
                <div key={asText(row.id)} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-medium text-slate-800">{asText(row.description, asText(row.threat_type))}</p>
                    <StatusBadge status={asText(row.severity, "warning")} />
                  </div>
                  <p className="text-xs text-slate-500">{asText(row.occurred_at, asText(row.created_at))}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">No threat alerts yet.</p>
            )}
          </div>
        </div>

        <div className="surface-card p-4">
          <h3 className="mb-3 text-base font-semibold text-slate-900">Policy Coverage</h3>
          <div className="space-y-2">
            {policyRows.length ? (
              policyRows.slice(0, 10).map((row) => (
                <div key={asText(row.id)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate font-medium text-slate-800">{asText(row.name)}</p>
                    <StatusBadge status={row.is_active ? "active" : "inactive"} />
                  </div>
                  <p className="text-xs text-slate-500">{asText(row.policy_type, "policy")}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">No security policies configured.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
