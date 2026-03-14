import type { AnomalyAlert } from "@/types";
import { StatusBadge } from "@/components/ui/StatusBadge";

type Props = {
  anomalies: AnomalyAlert[];
};

export function AnomalyTimeline({ anomalies }: Props) {
  return (
    <section className="surface-card p-4">
      <h3 className="text-base font-semibold text-slate-900">Anomaly Timeline</h3>
      <div className="mt-3 space-y-2">
        {anomalies.length ? (
          anomalies.map((anomaly) => (
            <div key={anomaly.id} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium text-slate-800">{anomaly.anomaly_type}</p>
                <StatusBadge status={anomaly.severity} />
              </div>
              <p className="text-xs text-slate-500">
                {anomaly.entity_type} · score {anomaly.score ?? "-"} · {anomaly.detected_at}
              </p>
            </div>
          ))
        ) : (
          <p className="text-sm text-slate-500">No anomalies detected.</p>
        )}
      </div>
    </section>
  );
}
