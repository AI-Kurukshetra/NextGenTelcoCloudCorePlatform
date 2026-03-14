import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async (req) => {
  const payload = await req.json();
  const session = payload.record ?? payload.new ?? payload;

  if (session.status !== "terminated") {
    return new Response("skip", { status: 200 });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const totalBytes = Number(session.bytes_uplink ?? 0) + Number(session.bytes_downlink ?? 0);
  const totalMb = totalBytes / (1024 * 1024);
  const ratePerMb = 0.001;
  const chargeAmount = +(totalMb * ratePerMb).toFixed(6);

  const durationSeconds = session.end_time && session.start_time
    ? Math.max(
      0,
      Math.floor(
        (new Date(session.end_time).getTime() - new Date(session.start_time).getTime()) / 1000,
      ),
    )
    : 0;

  await supabase.from("cdr_records").insert({
    tenant_id: session.tenant_id,
    subscriber_id: session.subscriber_id,
    session_id: session.id,
    start_time: session.start_time,
    end_time: session.end_time,
    duration_seconds: durationSeconds,
    bytes_uplink: Number(session.bytes_uplink ?? 0),
    bytes_downlink: Number(session.bytes_downlink ?? 0),
    charge_amount: chargeAmount,
    charge_currency: "USD",
    service_type: "data",
  });

  const { data: existing } = await supabase
    .from("credit_balances")
    .select("id,balance_amount")
    .eq("tenant_id", session.tenant_id)
    .eq("subscriber_id", session.subscriber_id)
    .maybeSingle();

  if (existing?.id) {
    await supabase
      .from("credit_balances")
      .update({
        balance_amount: Number(existing.balance_amount ?? 0) - chargeAmount,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existing.id);
  }

  return new Response(JSON.stringify({ charged: chargeAmount }), {
    headers: { "Content-Type": "application/json" },
  });
});
