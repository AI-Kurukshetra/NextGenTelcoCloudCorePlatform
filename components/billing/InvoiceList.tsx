import Link from "next/link";
import type { Invoice } from "@/types";
import { StatusBadge } from "@/components/ui/StatusBadge";

type Props = {
  invoices: Invoice[];
};

export function InvoiceList({ invoices }: Props) {
  if (!invoices.length) {
    return <p className="text-sm text-slate-500">No invoices found.</p>;
  }

  return (
    <div className="space-y-2">
      {invoices.map((invoice) => (
        <div key={invoice.id} className="rounded-xl border border-slate-200 bg-white p-3">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-sm font-semibold text-slate-900">{invoice.invoice_number}</p>
              <p className="text-xs text-slate-500">
                {invoice.period_start} → {invoice.period_end}
              </p>
            </div>
            <div className="text-right">
              <StatusBadge status={invoice.status} />
              <p className="mt-1 text-sm font-semibold text-slate-900">
                {invoice.currency} {Number(invoice.total ?? 0).toFixed(2)}
              </p>
            </div>
          </div>
          <div className="mt-2">
            <Link href={`/app/billing/invoices/${invoice.id}`} className="text-xs font-semibold text-[var(--color-primary)] hover:text-[var(--color-primary)] hover:underline">
              Open invoice
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
