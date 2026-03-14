"use client";

type NetworkState = {
  snapshot_at?: string;
  network_functions?: unknown[];
  slices?: unknown[];
  sessions?: unknown[];
  metrics?: unknown[];
};

type SimulationResult = {
  baseline?: Record<string, number>;
  projected?: Record<string, number>;
  delta?: Record<string, number>;
};

type Props = {
  currentState: NetworkState;
  onSimulate: (payload: { action: string; parameters: Record<string, unknown> }) => Promise<void> | void;
  simulationResult?: SimulationResult | null;
};

export function DigitalTwinPanel({ currentState, onSimulate, simulationResult }: Props) {
  return (
    <section className="surface-card p-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Current State</p>
          <h3 className="mt-1 text-base font-semibold text-slate-900">Network Snapshot</h3>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
              NFs: {currentState.network_functions?.length ?? 0}
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
              Slices: {currentState.slices?.length ?? 0}
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
              Sessions: {currentState.sessions?.length ?? 0}
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
              Metrics: {currentState.metrics?.length ?? 0}
            </div>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Simulation</p>
          <h3 className="mt-1 text-base font-semibold text-slate-900">What-if Analysis</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" onClick={() => onSimulate({ action: "Scale UPF by 2x", parameters: {} })} className="btn-dark-visible px-3 py-1.5 text-sm">
              Scale UPF
            </button>
            <button
              type="button"
              onClick={() => onSimulate({ action: "Increase Slice Bandwidth", parameters: { baseline_throughput_mbps: 1200 } })}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-700"
            >
              Increase Bandwidth
            </button>
          </div>
        </div>
      </div>

      {simulationResult ? (
        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Projected Delta</p>
          <pre className="mt-2 overflow-auto text-xs text-slate-700">{JSON.stringify(simulationResult, null, 2)}</pre>
        </div>
      ) : null}
    </section>
  );
}
