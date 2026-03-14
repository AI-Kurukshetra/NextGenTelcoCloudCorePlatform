"use client";

import { useState } from "react";
import { AppRouteView } from "@/components/shared/AppRouteView";
import { useApi } from "@/hooks/useApi";
import { TenantPlanCard } from "@/components/admin/TenantPlanCard";

type Props = {
  tenantId: string;
};

type Tenant = {
  id: string;
  name: string;
  plan: string;
  is_active?: boolean;
  max_subscribers?: number | null;
  max_network_functions?: number | null;
};

type Usage = {
  subscribers: number;
  network_functions: number;
  slices: number;
};

export function AdminTenantDetailScreen({ tenantId }: Props) {
  const tenant = useApi<Tenant>(`/api/admin/tenants/${tenantId}`);
  const usage = useApi<Usage>(`/api/admin/tenants/${tenantId}/usage`);
  const [plan, setPlan] = useState("growth");
  const [message, setMessage] = useState("");

  async function updatePlan() {
    setMessage("");
    const response = await fetch(`/api/admin/tenants/${tenantId}/plan`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan }),
    });
    const body = await response.json();
    if (!response.ok) {
      setMessage(body?.message ?? "Failed to update plan.");
      return;
    }
    setMessage("Tenant plan updated.");
    await tenant.refresh();
  }

  async function suspendTenant() {
    setMessage("");
    const response = await fetch(`/api/admin/tenants/${tenantId}/suspend`, { method: "POST" });
    const body = await response.json();
    if (!response.ok) {
      setMessage(body?.message ?? "Failed to suspend tenant.");
      return;
    }
    setMessage("Tenant suspended.");
    await tenant.refresh();
  }

  return (
    <div className="space-y-4">
      <AppRouteView
        title="Tenant Detail"
        description="Plan controls and resource usage for this tenant."
        endpoint={`/api/admin/tenants/${tenantId}`}
        routePath="/app/admin/tenants/[id]"
      />

      {tenant.data && usage.data ? (
        <TenantPlanCard
          tenant={tenant.data}
          usage={{
            subscribers: usage.data.subscribers ?? 0,
            network_functions: usage.data.network_functions ?? 0,
            slices: usage.data.slices ?? 0,
            limits: {
              subscribers: tenant.data.max_subscribers ?? null,
              network_functions: tenant.data.max_network_functions ?? null,
              slices: null,
            },
          }}
        />
      ) : (
        <p className="text-sm text-slate-500">Loading tenant details…</p>
      )}

      <section className="surface-card p-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <select value={plan} onChange={(event) => setPlan(event.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
            <option value="starter">Starter</option>
            <option value="growth">Growth</option>
            <option value="enterprise">Enterprise</option>
          </select>
          <button type="button" onClick={() => void updatePlan()} className="btn-dark-visible px-3 py-1.5 text-sm">
            Change Plan
          </button>
        </div>
        <button type="button" onClick={() => void suspendTenant()} className="mt-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-sm font-semibold text-rose-700">
          Suspend Tenant
        </button>
        {message ? <p className="mt-2 text-sm text-slate-700">{message}</p> : null}
      </section>
    </div>
  );
}
