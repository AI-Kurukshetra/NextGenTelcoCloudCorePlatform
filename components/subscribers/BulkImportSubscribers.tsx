"use client";

import { useMemo, useState } from "react";

type Row = {
  imsi: string;
  msisdn?: string;
  status?: string;
  plan?: string;
};

export function BulkImportSubscribers() {
  const [raw, setRaw] = useState("");
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const preview = useMemo(() => {
    const lines = raw.split(/\r?\n/).filter(Boolean);
    if (lines.length <= 1) return [];
    const headers = lines[0].split(",").map((item) => item.trim().toLowerCase());
    return lines.slice(1, 6).map((line) => {
      const cols = line.split(",").map((item) => item.trim());
      return headers.reduce<Record<string, string>>((acc, header, index) => {
        acc[header] = cols[index] ?? "";
        return acc;
      }, {});
    });
  }, [raw]);

  async function importRows() {
    setLoading(true);
    setResult("");
    try {
      const lines = raw.split(/\r?\n/).filter(Boolean);
      if (lines.length <= 1) {
        setResult("Please provide CSV with a header and at least one row.");
        setLoading(false);
        return;
      }

      const headers = lines[0].split(",").map((item) => item.trim().toLowerCase());
      const rows: Row[] = lines.slice(1).map((line) => {
        const cols = line.split(",").map((item) => item.trim());
        const mapped = headers.reduce<Record<string, string>>((acc, header, index) => {
          acc[header] = cols[index] ?? "";
          return acc;
        }, {});
        return {
          imsi: mapped.imsi ?? "",
          msisdn: mapped.msisdn ?? "",
          status: mapped.status ?? "active",
          plan: mapped.plan ?? "starter",
        };
      });

      const response = await fetch("/api/subscribers/bulk-import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ records: rows }),
      });
      const body = await response.json();
      if (!response.ok) {
        setResult(body?.message ?? "Import failed.");
      } else {
        const imported = body?.data?.imported ?? 0;
        const total = body?.data?.total_rows ?? rows.length;
        setResult(`Imported ${imported} of ${total} rows.`);
      }
    } catch (error) {
      setResult(error instanceof Error ? error.message : "Import failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="surface-card p-4">
      <h3 className="text-base font-semibold text-slate-900">Bulk Import Subscribers</h3>
      <p className="mt-1 text-sm text-slate-600">Paste CSV (`imsi,msisdn,status,plan`) to import in one action.</p>

      <textarea
        value={raw}
        onChange={(event) => setRaw(event.target.value)}
        placeholder={"imsi,msisdn,status,plan\n404451234500001,919876540100,active,growth"}
        className="mt-3 min-h-32 w-full rounded-xl border border-slate-200 p-3 text-sm"
      />

      <div className="mt-3">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Preview</p>
        <div className="mt-2 space-y-1">
          {preview.length ? (
            preview.map((row, index) => (
              <pre key={index} className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-xs text-slate-700">
                {JSON.stringify(row)}
              </pre>
            ))
          ) : (
            <p className="text-sm text-slate-500">No preview rows.</p>
          )}
        </div>
      </div>

      <button type="button" onClick={importRows} disabled={loading} className="btn-dark-visible mt-3 px-3 py-1.5 text-sm">
        {loading ? "Importing…" : "Import Subscribers"}
      </button>

      {result ? <p className="mt-2 text-sm text-slate-700">{result}</p> : null}
    </section>
  );
}
