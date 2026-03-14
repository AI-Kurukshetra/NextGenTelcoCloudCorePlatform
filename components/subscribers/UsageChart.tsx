"use client";

import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useApi } from "@/hooks/useApi";

type TimelinePoint = {
  date: string;
  bytes: number;
  duration_seconds: number;
  charge: number;
  sessions: number;
};

type UsagePayload = {
  summary?: {
    total_bytes?: number;
    total_charge?: number;
    total_sessions?: number;
  };
  timeline?: TimelinePoint[];
};

type Props = {
  subscriberId: string;
};

export function UsageChart({ subscriberId }: Props) {
  const { data, loading } = useApi<UsagePayload>(`/api/subscribers/${subscriberId}/usage`);
  const timeline = useMemo(() => data?.timeline ?? [], [data?.timeline]);
  const summary = data?.summary ?? {};

  return (
    <section className="surface-card p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-semibold text-slate-900">30-Day Usage</h3>
          <p className="text-xs text-slate-600">
            Sessions: {summary.total_sessions ?? 0} · Charge: ${(summary.total_charge ?? 0).toFixed(2)}
          </p>
        </div>
      </div>

      <div className="h-64 w-full">
        {loading ? (
          <p className="text-sm text-slate-500">Loading usage…</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={timeline}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="bytes" fill="#2563eb" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </section>
  );
}
