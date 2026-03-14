"use client";

import { AppRouteView } from "@/components/shared/AppRouteView";
import { useApi } from "@/hooks/useApi";
import { InvoiceDetail } from "@/components/billing/InvoiceDetail";
import type { Invoice } from "@/types";

type Props = {
  invoiceId: string;
};

export function BillingInvoiceDetailScreen({ invoiceId }: Props) {
  const invoice = useApi<Invoice & { line_items?: Array<{ id: string; description: string; quantity: number; unit_price: number; amount: number }> }>(
    `/api/billing/invoices/${invoiceId}`,
  );

  return (
    <div className="space-y-4">
      <AppRouteView
        title="Invoice Detail"
        description="Line item and total breakdown for this invoice."
        endpoint={`/api/billing/invoices/${invoiceId}`}
        routePath="/app/billing/invoices/[id]"
      />
      {invoice.data ? <InvoiceDetail invoice={invoice.data} /> : <p className="text-sm text-slate-500">Loading invoice…</p>}
    </div>
  );
}
