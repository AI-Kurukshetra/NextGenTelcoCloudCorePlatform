import type { AiPrediction } from "@/types";

type Props = {
  prediction: AiPrediction;
};

export function AIPredictionCard({ prediction }: Props) {
  const confidence = Math.round((prediction.confidence ?? 0) * 100);

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{prediction.prediction_type}</p>
      <h3 className="mt-1 text-base font-semibold text-slate-900">
        {prediction.entity_type} · {prediction.entity_id}
      </h3>
      <p className="mt-1 text-sm text-slate-600">Predicted Value: {prediction.predicted_value ?? "-"}</p>

      <div className="mt-3 h-2 rounded-full bg-slate-200">
        <div className="h-full rounded-full bg-sky-600" style={{ width: `${Math.max(0, Math.min(100, confidence))}%` }} />
      </div>
      <p className="mt-1 text-xs text-slate-600">Confidence: {confidence}%</p>
    </article>
  );
}
