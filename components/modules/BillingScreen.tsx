"use client";

import Link from "next/link";
import { useApi } from "@/hooks/useApi";
import { AppRouteView } from "@/components/shared/AppRouteView";
import { asNumber, asText, extractItems } from "@/components/modules/module-utils";

export function BillingScreen() {
  const summary = useApi<Record<string, unknown>>("/api/billing/summary");
  const cdr = useApi<unknown>("/api/billing/cdr?limit=12");
  const credits = useApi<unknown>("/api/billing/credits?limit=8");

  const cdrRows = extractItems(cdr.data);
  const creditRows = extractItems(credits.data);

  const totalCharges = asNumber((summary.data as Record<string, unknown> | null)?.total_charges);
  const totalCredit = asNumber((summary.data as Record<string, unknown> | null)?.total_credit_balance);
  const activeCharging = asNumber((summary.data as Record<string, unknown> | null)?.active_charging_sessions);

  return (
    <div className="space-y-4">
      <AppRouteView
        title="Billing Overview"
        description="Track charging, revenue, and balance health across tenants and subscribers."
        endpoint="/api/billing/summary"
        routePath="/app/billing"
      />

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="kpi-tile">
          <p className="text-xs uppercase tracking-[0.14em] text-[var(--color-ink-muted)]">Total Charges</p>
          <p className="mt-1 text-2xl font-semibold text-[var(--color-ink)]">${totalCharges.toFixed(2)}</p>
        </div>
        <div className="kpi-tile">
          <p className="text-xs uppercase tracking-[0.14em] text-[var(--color-ink-muted)]">Total Credit Balance</p>
          <p className="mt-1 text-2xl font-semibold text-emerald-400">${totalCredit.toFixed(2)}</p>
        </div>
        <div className="kpi-tile">
          <p className="text-xs uppercase tracking-[0.14em] text-[var(--color-ink-muted)]">Active Charging Sessions</p>
          <p className="mt-1 text-2xl font-semibold text-sky-400">{activeCharging}</p>
        </div>
        <div className="kpi-tile">
          <p className="text-xs uppercase tracking-[0.14em] text-[var(--color-ink-muted)]">Actions</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <Link href="/app/billing/records" className="rounded border border-[var(--color-border)] px-2 py-1 text-xs font-semibold text-[var(--color-ink)] hover:border-[var(--color-border-hover)] hover:text-[var(--color-primary)]">
              CDR Records
            </Link>
            <Link href="/app/billing/exports" className="rounded border border-[var(--color-border)] px-2 py-1 text-xs font-semibold text-[var(--color-ink)] hover:border-[var(--color-border-hover)] hover:text-[var(--color-primary)]">
              Export
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <div className="surface-card p-4">
          <h3 className="mb-3 text-base font-semibold text-[var(--color-ink)]">Recent CDR Records</h3>
          <div className="space-y-2">
            {cdrRows.length ? (
              cdrRows.slice(0, 8).map((row) => (
                <div key={asText(row.id)} className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2 text-sm">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-mono text-xs text-[var(--color-ink-muted)]">{asText(row.id)}</p>
                    <p className="font-semibold text-[var(--color-ink)]">${asNumber(row.charge_amount).toFixed(2)}</p>
                  </div>
                  <p className="mt-1 text-xs text-[var(--color-ink-dim)]">Subscriber: {asText(row.subscriber_id, "n/a")}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-[var(--color-ink-muted)]">No CDR records available.</p>
            )}
          </div>
        </div>

        <div className="surface-card p-4">
          <h3 className="mb-3 text-base font-semibold text-[var(--color-ink)]">Credit Balances</h3>
          <div className="space-y-2">
            {creditRows.length ? (
              creditRows.slice(0, 8).map((row) => (
                <div key={asText(row.id)} className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2 text-sm">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-mono text-xs text-[var(--color-ink-muted)]">{asText(row.subscriber_id, "subscriber")}</p>
                    <p className="font-semibold text-emerald-400">${asNumber(row.balance_amount).toFixed(2)}</p>
                  </div>
                  <p className="mt-1 text-xs text-[var(--color-ink-dim)]">Currency: {asText(row.balance_currency, "USD")}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-[var(--color-ink-muted)]">No credit balances available.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
