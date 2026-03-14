import type { Invoice } from "@/types";
import { StatusBadge } from "@/components/ui/StatusBadge";

type LineItem = {
  id: string;
  description: string;
  quantity: number;
  unit_price: number;
  amount: number;
};

type Props = {
  invoice: Invoice & { line_items?: LineItem[] };
};

export function InvoiceDetail({ invoice }: Props) {
  return (
    <section className="surface-card p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Invoice</p>
          <h2 className="text-xl font-semibold text-slate-900">{invoice.invoice_number}</h2>
          <p className="text-sm text-slate-600">
            {invoice.period_start} → {invoice.period_end}
          </p>
        </div>
        <div className="text-right">
          <StatusBadge status={invoice.status} />
          <p className="mt-1 text-lg font-semibold text-slate-900">
            {invoice.currency} {Number(invoice.total ?? 0).toFixed(2)}
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {(invoice.line_items ?? []).length ? (
          invoice.line_items?.map((item) => (
            <div key={item.id} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
              <div className="flex items-center justify-between gap-2">
                <p className="font-medium text-slate-800">{item.description}</p>
                <p className="text-slate-700">
                  {item.quantity} × {item.unit_price.toFixed(2)} = {item.amount.toFixed(2)}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-slate-500">No line items available for this invoice.</p>
        )}
      </div>
    </section>
  );
}
