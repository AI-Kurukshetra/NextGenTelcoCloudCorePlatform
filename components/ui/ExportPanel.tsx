"use client";

import { useState } from "react";

type BillingExport = {
  id: string;
  export_type: string;
  status: string;
  created_at: string;
  row_count?: number | null;
  file_url?: string | null;
};

type Props = {
  exportType: string;
  onExport: (params: { date_from?: string; date_to?: string; format: "csv" | "json" }) => Promise<void> | void;
  recentExports: BillingExport[];
};

export function ExportPanel({ exportType, onExport, recentExports }: Props) {
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [format, setFormat] = useState<"csv" | "json">("csv");

  return (
    <section className="surface-card p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Export Panel</p>
      <h3 className="mt-1 text-base font-semibold text-slate-900">{exportType} Export</h3>

      <div className="mt-3 grid gap-2 sm:grid-cols-3">
        <input type="date" value={dateFrom} onChange={(event) => setDateFrom(event.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        <input type="date" value={dateTo} onChange={(event) => setDateTo(event.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        <select value={format} onChange={(event) => setFormat(event.target.value as "csv" | "json")} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="csv">CSV</option>
          <option value="json">JSON</option>
        </select>
      </div>

      <button
        type="button"
        onClick={() => onExport({ date_from: dateFrom || undefined, date_to: dateTo || undefined, format })}
        className="btn-dark-visible mt-3 px-3 py-1.5 text-sm"
      >
        Export
      </button>

      <div className="mt-4 space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Recent Exports</p>
        {recentExports.length ? (
          recentExports.slice(0, 8).map((entry) => (
            <div key={entry.id} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
              <p className="font-medium text-slate-800">{entry.export_type}</p>
              <p className="text-xs text-slate-500">
                {entry.status} · rows: {entry.row_count ?? 0} · {entry.created_at}
              </p>
            </div>
          ))
        ) : (
          <p className="text-sm text-slate-500">No recent exports.</p>
        )}
      </div>
    </section>
  );
}
