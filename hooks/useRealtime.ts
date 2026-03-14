"use client";

import { useEffect } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type RealtimeOptions = {
  channel: string;
  table: string;
  event?: "*" | "INSERT" | "UPDATE" | "DELETE";
  tenantId?: string | null;
  onEvent: (payload: unknown) => void;
};

function useRealtimeSubscription({ channel, table, event = "*", tenantId, onEvent }: RealtimeOptions) {
  useEffect(() => {
    try {
      const client = createSupabaseBrowserClient();
      const realtimeChannel = client
        .channel(channel)
        .on(
          "postgres_changes",
          {
            event,
            schema: "public",
            table,
            filter: tenantId ? `tenant_id=eq.${tenantId}` : undefined,
          },
          onEvent,
        )
        .subscribe();

      return () => {
        void client.removeChannel(realtimeChannel);
      };
    } catch {
      return () => {};
    }
  }, [channel, event, onEvent, table, tenantId]);
}

export function useRealtime(options: RealtimeOptions) {
  useRealtimeSubscription(options);
}

export function useRealtimeAlarms(tenantId: string | null | undefined, onEvent: () => void) {
  useRealtimeSubscription({
    channel: `alarms:${tenantId ?? "default"}`,
    table: "alarms",
    event: "INSERT",
    tenantId,
    onEvent: () => onEvent(),
  });
}

export function useRealtimeNFStatus(tenantId: string | null | undefined, onEvent: () => void) {
  useRealtimeSubscription({
    channel: `nf_status:${tenantId ?? "default"}`,
    table: "network_functions",
    event: "UPDATE",
    tenantId,
    onEvent: () => onEvent(),
  });
}

export function useRealtimeSessions(tenantId: string | null | undefined, onEvent: () => void) {
  useRealtimeSubscription({
    channel: `sessions:${tenantId ?? "default"}`,
    table: "sessions",
    event: "*",
    tenantId,
    onEvent: () => onEvent(),
  });
}

export function useRealtimeThreatAlerts(tenantId: string | null | undefined, onEvent: () => void) {
  useRealtimeSubscription({
    channel: `threats:${tenantId ?? "default"}`,
    table: "threat_alerts",
    event: "INSERT",
    tenantId,
    onEvent: () => onEvent(),
  });
}

export function useRealtimeOrchestrationJobs(tenantId: string | null | undefined, onEvent: () => void) {
  useRealtimeSubscription({
    channel: `orch_jobs:${tenantId ?? "default"}`,
    table: "orchestration_jobs",
    event: "UPDATE",
    tenantId,
    onEvent: () => onEvent(),
  });
}
