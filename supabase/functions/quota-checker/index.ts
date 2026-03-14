import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async () => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const { data: sessions, error: sessionsError } = await supabase
    .from("charging_sessions")
    .select("*")
    .eq("status", "active")
    .not("quota_allocated_mb", "is", null);

  if (sessionsError) {
    return new Response(JSON.stringify({ error: sessionsError.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  let exhausted = 0;
  for (const charging of sessions ?? []) {
    const allocated = Number(charging.quota_allocated_mb ?? 0);
    const used = Number(charging.quota_used_mb ?? 0);
    if (allocated <= 0) continue;

    const usedPct = used / allocated;
    if (usedPct >= 1.0) {
      await supabase.from("charging_sessions").update({ status: "quota_exhausted" }).eq("id", charging.id);
      await supabase
        .from("sessions")
        .update({ status: "terminated", end_time: new Date().toISOString() })
        .eq("id", charging.session_id);
      exhausted += 1;
    } else if (usedPct >= 0.9) {
      await supabase.from("anomaly_alerts").insert({
        tenant_id: charging.tenant_id,
        entity_type: "charging_session",
        entity_id: charging.id,
        anomaly_type: "quota_usage_high",
        severity: "warning",
        score: usedPct,
        details: {
          quota_usage_pct: +(usedPct * 100).toFixed(2),
          threshold_pct: 90,
        },
        detected_at: new Date().toISOString(),
      });
    }
  }

  return new Response(JSON.stringify({ checked: sessions?.length ?? 0, exhausted }), {
    headers: { "Content-Type": "application/json" },
  });
});
