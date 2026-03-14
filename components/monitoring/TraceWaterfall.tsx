type Trace = {
  id: string;
  trace_name?: string;
  duration_ms?: number | null;
};

type Span = {
  id: string;
  span_name?: string;
  service_name?: string;
  duration_ms?: number | null;
  parent_span_id?: string | null;
};

type Props = {
  trace: Trace;
  spans: Span[];
};

export function TraceWaterfall({ trace, spans }: Props) {
  const total = Math.max(1, Number(trace.duration_ms ?? spans.reduce((sum, span) => sum + Number(span.duration_ms ?? 0), 0)));

  return (
    <section className="surface-card p-4">
      <h3 className="text-base font-semibold text-slate-900">{trace.trace_name ?? trace.id}</h3>
      <div className="mt-3 space-y-2">
        {spans.length ? (
          spans.map((span) => {
            const width = Math.max(4, Math.round((Number(span.duration_ms ?? 0) / total) * 100));
            return (
              <div key={span.id} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                <div className="mb-1 flex items-center justify-between gap-2">
                  <p className="text-sm font-medium text-slate-800">{span.service_name ?? "service"} · {span.span_name ?? span.id}</p>
                  <p className="text-xs text-slate-500">{Number(span.duration_ms ?? 0).toFixed(2)} ms</p>
                </div>
                <div className="h-2 rounded-full bg-slate-200">
                  <div className="h-full rounded-full bg-cyan-600" style={{ width: `${width}%` }} />
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-sm text-slate-500">No spans available.</p>
        )}
      </div>
    </section>
  );
}
