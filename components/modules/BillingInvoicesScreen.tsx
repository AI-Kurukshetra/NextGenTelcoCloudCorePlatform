"use client";

import { AppRouteView } from "@/components/shared/AppRouteView";
import { useApi } from "@/hooks/useApi";
import { extractItems } from "@/components/modules/module-utils";
import { InvoiceList } from "@/components/billing/InvoiceList";
import type { Invoice } from "@/types";

export function BillingInvoicesScreen() {
  const invoices = useApi<unknown>("/api/billing/invoices?limit=100");
  const rows = extractItems(invoices.data) as unknown as Invoice[];

  async function generateInvoice() {
    const end = new Date();
    const start = new Date(Date.now() - 30 * 24 * 3600 * 1000);
    await fetch("/api/billing/invoices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        period_start: start.toISOString(),
        period_end: end.toISOString(),
        currency: "USD",
        tax_rate_pct: 18,
      }),
    });
    await invoices.refresh();
  }

  return (
    <div className="space-y-4">
      <AppRouteView
        title="Billing Invoices"
        description="Generate invoice cycles and inspect issued records."
        endpoint="/api/billing/invoices"
        routePath="/app/billing/invoices"
      />

      <section className="surface-card p-4">
        <button type="button" onClick={() => void generateInvoice()} className="btn-dark-visible px-3 py-1.5 text-sm">
          Generate Invoice
        </button>
        <div className="mt-3">
          <InvoiceList invoices={rows} />
        </div>
      </section>
    </div>
  );
}
