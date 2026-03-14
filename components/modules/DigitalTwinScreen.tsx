"use client";

import { useState } from "react";
import { AppRouteView } from "@/components/shared/AppRouteView";
import { useApi } from "@/hooks/useApi";
import { DigitalTwinPanel } from "@/components/ai/DigitalTwinPanel";

type TwinState = {
  snapshot_at?: string;
  network_functions?: unknown[];
  slices?: unknown[];
  sessions?: unknown[];
  metrics?: unknown[];
};

export function DigitalTwinScreen() {
  const state = useApi<TwinState>("/api/ai/digital-twin/state");
  const [simulation, setSimulation] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState("");

  async function runSimulation(payload: { action: string; parameters: Record<string, unknown> }) {
    setError("");
    const response = await fetch("/api/ai/digital-twin/simulate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const body = await response.json();
    if (!response.ok) {
      setError(body?.message ?? "Simulation failed.");
      return;
    }
    setSimulation(body?.data ?? body);
  }

  return (
    <div className="space-y-4">
      <AppRouteView
        title="Digital Twin"
        description="Run safe what-if simulations before making production changes."
        endpoint="/api/ai/digital-twin/state"
        routePath="/app/ai/digital-twin"
      />

      <DigitalTwinPanel currentState={state.data ?? {}} onSimulate={runSimulation} simulationResult={simulation} />
      {error ? <p className="text-sm text-rose-700">{error}</p> : null}
    </div>
  );
}
