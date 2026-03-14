type Recommendation = {
  id: string;
  title: string;
  description: string;
  recommendation_type?: string;
  status: string;
};

type Props = {
  recommendation: Recommendation;
  onApply: () => void;
  onDismiss: () => void;
};

export function OptimizationCard({ recommendation, onApply, onDismiss }: Props) {
  const actionable = recommendation.status === "pending";

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{recommendation.recommendation_type ?? "optimization"}</p>
      <h3 className="mt-1 text-base font-semibold text-slate-900">{recommendation.title}</h3>
      <p className="mt-1 text-sm text-slate-600">{recommendation.description}</p>

      <div className="mt-3 flex gap-2">
        <button type="button" onClick={onApply} disabled={!actionable} className="btn-dark-visible px-3 py-1.5 text-sm disabled:opacity-50">
          Apply
        </button>
        <button
          type="button"
          onClick={onDismiss}
          disabled={!actionable}
          className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-700 disabled:opacity-50"
        >
          Dismiss
        </button>
      </div>
    </article>
  );
}
