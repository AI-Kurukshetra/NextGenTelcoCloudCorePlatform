import { StatusBadge } from "@/components/ui/StatusBadge";

type Report = {
  id: string;
  report_name?: string;
  report_type?: string;
  status: string;
  generated_at?: string;
  file_url?: string | null;
};

type Props = {
  reports: Report[];
};

export function ComplianceReportList({ reports }: Props) {
  return (
    <section className="surface-card p-4">
      <h3 className="text-base font-semibold text-slate-900">Compliance Reports</h3>
      <div className="mt-3 space-y-2">
        {reports.length ? (
          reports.map((report) => (
            <div key={report.id} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
              <div className="flex items-center justify-between gap-2">
                <p className="font-medium text-slate-800">{report.report_name ?? report.report_type ?? report.id}</p>
                <StatusBadge status={report.status} />
              </div>
              <p className="text-xs text-slate-500">{report.generated_at ?? "-"}</p>
            </div>
          ))
        ) : (
          <p className="text-sm text-slate-500">No reports generated yet.</p>
        )}
      </div>
    </section>
  );
}
