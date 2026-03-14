import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async () => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const { data: alertRules, error: rulesError } = await supabase
    .from("alerts")
    .select("*")
    .eq("is_active", true);

  if (rulesError) {
    return new Response(JSON.stringify({ error: rulesError.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!alertRules?.length) {
    return new Response("No active alerts", { status: 200 });
  }

  const alarmsToInsert: Array<Record<string, unknown>> = [];

  for (const rule of alertRules) {
    const condition = (rule.condition ?? {}) as {
      metric_name?: string;
      metric?: string;
      operator?: ">" | "<" | ">=" | "<=";
      op?: ">" | "<" | ">=" | "<=";
      threshold?: number;
      value?: number;
      duration_minutes?: number;
    };
    const metricName = condition.metric_name ?? condition.metric;
    const operator = condition.operator ?? condition.op ?? ">";
    const threshold = Number(condition.threshold ?? condition.value ?? 0);
    const durationMinutes = Number(condition.duration_minutes ?? 5);

    if (!metricName) continue;

    const since = new Date(Date.now() - durationMinutes * 60 * 1000).toISOString();
    const { data: metrics } = await supabase
      .from("performance_metrics")
      .select("metric_value")
      .eq("tenant_id", rule.tenant_id)
      .eq("entity_id", rule.entity_id)
      .eq("metric_name", metricName)
      .gte("recorded_at", since)
      .order("recorded_at", { ascending: false })
      .limit(10);

    if (!metrics?.length) continue;

    const avg = metrics.reduce((sum, item) => sum + Number(item.metric_value ?? 0), 0) / metrics.length;
    const breached =
      (operator === ">" && avg > threshold) ||
      (operator === ">=" && avg >= threshold) ||
      (operator === "<" && avg < threshold) ||
      (operator === "<=" && avg <= threshold);

    if (!breached) continue;

    const { data: existing } = await supabase
      .from("alarms")
      .select("id")
      .eq("tenant_id", rule.tenant_id)
      .eq("source_entity_id", rule.entity_id)
      .eq("alarm_type", `threshold:${metricName}`)
      .eq("status", "active")
      .maybeSingle();

    if (!existing) {
      alarmsToInsert.push({
        tenant_id: rule.tenant_id,
        alarm_type: `threshold:${metricName}`,
        severity: rule.severity ?? "warning",
        source_entity_type: rule.entity_type,
        source_entity_id: rule.entity_id,
        description: `${metricName} ${operator} ${threshold} (avg: ${avg.toFixed(2)})`,
        status: "active",
      });
    }
  }

  if (alarmsToInsert.length > 0) {
    await supabase.from("alarms").insert(alarmsToInsert);
  }

  return new Response(JSON.stringify({ evaluated: alertRules.length, triggered: alarmsToInsert.length }), {
    headers: { "Content-Type": "application/json" },
  });
});
