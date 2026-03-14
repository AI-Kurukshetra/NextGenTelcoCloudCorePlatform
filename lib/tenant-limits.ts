import { createSupabaseAdminClient } from "@/lib/supabase/server";

const PLAN_LIMITS: Record<string, { subscribers: number; network_functions: number; slices: number }> = {
  starter: { subscribers: 10_000, network_functions: 10, slices: 5 },
  growth: { subscribers: 100_000, network_functions: 50, slices: 25 },
  enterprise: { subscribers: Number.POSITIVE_INFINITY, network_functions: Number.POSITIVE_INFINITY, slices: Number.POSITIVE_INFINITY },
};

type LimitResource = "subscribers" | "network_functions" | "slices";

export async function checkTenantLimit(tenantId: string, resource: LimitResource) {
  const supabase = createSupabaseAdminClient();

  const { data: tenant } = await supabase.from("tenants").select("plan").eq("id", tenantId).maybeSingle();
  const planCode = tenant?.plan ?? "starter";
  const limit = PLAN_LIMITS[planCode]?.[resource] ?? PLAN_LIMITS.starter[resource];
  const table = resource === "slices" ? "network_slices" : resource;

  const { count } = await supabase.from(table).select("*", { count: "exact", head: true }).eq("tenant_id", tenantId);
  const current = count ?? 0;

  return {
    allowed: current < limit,
    current,
    limit,
    plan: planCode,
  };
}
