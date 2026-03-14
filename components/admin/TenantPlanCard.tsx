type Tenant = {
  id: string;
  name: string;
  plan: string;
  is_active?: boolean;
};

type TenantUsage = {
  subscribers: number;
  network_functions: number;
  slices: number;
  limits?: {
    subscribers: number | null;
    network_functions: number | null;
    slices: number | null;
  };
};

type Props = {
  tenant: Tenant;
  usage: TenantUsage;
};

export function TenantPlanCard({ tenant, usage }: Props) {
  function pct(current: number, limit: number | null | undefined) {
    if (!limit || limit <= 0) return 0;
    return Math.min(100, Math.round((current / limit) * 100));
  }

  return (
    <section className="surface-card p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Tenant Plan</p>
      <h3 className="mt-1 text-base font-semibold text-slate-900">{tenant.name}</h3>
      <p className="text-sm text-slate-600">
        Plan: <span className="font-semibold text-slate-800">{tenant.plan}</span> · {tenant.is_active === false ? "Suspended" : "Active"}
      </p>

      <div className="mt-4 space-y-3">
        {[
          { label: "Subscribers", value: usage.subscribers, limit: usage.limits?.subscribers ?? null },
          { label: "Network Functions", value: usage.network_functions, limit: usage.limits?.network_functions ?? null },
          { label: "Slices", value: usage.slices, limit: usage.limits?.slices ?? null },
        ].map((item) => (
          <div key={item.label}>
            <div className="mb-1 flex items-center justify-between text-xs text-slate-600">
              <span>{item.label}</span>
              <span>
                {item.value} / {item.limit ?? "∞"}
              </span>
            </div>
            <div className="h-2 rounded-full bg-slate-200">
              <div className="h-full rounded-full bg-sky-600" style={{ width: `${pct(item.value, item.limit)}%` }} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
