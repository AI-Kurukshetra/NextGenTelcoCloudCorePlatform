"use client";

import { AppRouteView } from "@/components/shared/AppRouteView";
import { useApi } from "@/hooks/useApi";
import { extractItems } from "@/components/modules/module-utils";
import { AIPredictionCard } from "@/components/ai/AIPredictionCard";
import type { AiPrediction } from "@/types";

export function AIPredictionsScreen() {
  const predictions = useApi<unknown>("/api/ai/predictions?limit=50");
  const rows = extractItems(predictions.data) as unknown as AiPrediction[];

  return (
    <div className="space-y-4">
      <AppRouteView
        title="AI Predictions"
        description="Confidence-ranked forecasts with explainability signals."
        endpoint="/api/ai/predictions"
        routePath="/app/ai/predictions"
      />

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {rows.length ? (
          rows.map((row) => <AIPredictionCard key={row.id} prediction={row} />)
        ) : (
          <p className="text-sm text-slate-500">No predictions available yet.</p>
        )}
      </section>
    </div>
  );
}
