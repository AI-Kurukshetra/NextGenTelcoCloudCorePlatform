"use client";

type ConfigRecord = {
  id: string;
  name: string;
  version?: number;
  config?: Record<string, unknown>;
  previous_value?: Record<string, unknown> | null;
  description?: string | null;
  updated_at?: string;
};

type Props = {
  config: ConfigRecord;
};

function pretty(value: unknown) {
  return JSON.stringify(value ?? {}, null, 2);
}

export function ConfigVersionHistory({ config }: Props) {
  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Current Version</p>
        <p className="mt-1 text-sm font-semibold text-slate-900">v{config.version ?? 1}</p>
        {config.updated_at ? <p className="text-xs text-slate-500">Updated: {config.updated_at}</p> : null}
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-rose-700">Previous</p>
          <pre className="max-h-64 overflow-auto text-xs text-slate-700">{pretty(config.previous_value)}</pre>
        </div>
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700">Current</p>
          <pre className="max-h-64 overflow-auto text-xs text-slate-700">{pretty(config.config)}</pre>
        </div>
      </div>
    </div>
  );
}
