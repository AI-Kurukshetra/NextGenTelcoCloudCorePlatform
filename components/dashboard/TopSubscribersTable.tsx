"use client";

import { useState } from "react";

type Subscriber = {
  id: string;
  imsi?: string;
  msisdn?: string;
  name?: string;
  data_used_gb?: number;
  sessions?: number;
  status?: string;
  slice?: string;
  revenue?: number;
};

type Props = {
  subscribers?: Subscriber[];
  loading?: boolean;
};

const DEMO_DATA: Subscriber[] = [
  { id: "1", name: "Ali Hassan", msisdn: "+971-50-1234567", data_used_gb: 145.2, sessions: 24, status: "active", slice: "eMBB", revenue: 280 },
  { id: "2", name: "Priya Sharma", msisdn: "+91-98-7654321", data_used_gb: 98.7, sessions: 18, status: "active", slice: "eMBB", revenue: 190 },
  { id: "3", name: "Carlos Rivera", msisdn: "+1-555-0192", data_used_gb: 87.3, sessions: 31, status: "active", slice: "URLLC", revenue: 165 },
  { id: "4", name: "Fatima Al-Zahra", msisdn: "+966-55-9876543", data_used_gb: 74.8, sessions: 12, status: "active", slice: "eMBB", revenue: 140 },
  { id: "5", name: "Jun Wei", msisdn: "+86-138-0000-1234", data_used_gb: 62.1, sessions: 9, status: "idle", slice: "mMTC", revenue: 95 },
  { id: "6", name: "Amara Osei", msisdn: "+233-24-888-9999", data_used_gb: 54.4, sessions: 15, status: "active", slice: "eMBB", revenue: 108 },
];

const STATUS_STYLES: Record<string, { color: string; bg: string }> = {
  active: { color: "#10b981", bg: "rgba(16,185,129,0.12)" },
  idle: { color: "#f59e0b", bg: "rgba(245,158,11,0.12)" },
  suspended: { color: "#f43f5e", bg: "rgba(244,63,94,0.12)" },
};

const SLICE_COLORS: Record<string, string> = {
  eMBB: "#3b82f6",
  URLLC: "#10b981",
  mMTC: "#8b5cf6",
};

function DataBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = (value / max) * 100;
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1 rounded-full" style={{ background: "rgba(99,155,255,0.08)" }}>
        <div
          className="h-full rounded-full"
          style={{ width: `${pct}%`, background: color, transition: "width 0.8s ease" }}
        />
      </div>
      <span style={{ fontSize: "0.7rem", color: "var(--color-ink-muted)", minWidth: "3rem", textAlign: "right" }}>
        {value.toFixed(1)} GB
      </span>
    </div>
  );
}

function Avatar({ name }: { name: string }) {
  const initials = name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  const hue = (name.charCodeAt(0) * 37 + name.charCodeAt(1) * 17) % 360;
  return (
    <div
      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
      style={{
        background: `hsl(${hue}, 60%, 18%)`,
        border: `1px solid hsl(${hue}, 60%, 30%)`,
        color: `hsl(${hue}, 80%, 70%)`,
      }}
    >
      {initials}
    </div>
  );
}

export function TopSubscribersTable({ subscribers, loading = false }: Props) {
  const [sortKey, setSortKey] = useState<"data_used_gb" | "sessions" | "revenue">("data_used_gb");
  const rows = [...(subscribers ?? DEMO_DATA)].sort((a, b) => (b[sortKey] ?? 0) - (a[sortKey] ?? 0));
  const maxData = Math.max(...rows.map((r) => r.data_used_gb ?? 0));

  if (loading) {
    return (
      <div className="chart-panel animate-pulse">
        <div className="h-4 w-40 rounded bg-white/5 mb-5" />
        {[...Array(5)].map((_, i) => <div key={i} className="h-12 rounded-xl bg-white/5 mb-2" />)}
      </div>
    );
  }

  return (
    <div className="chart-panel viz-panel">
      <div className="chart-header">
        <div>
          <p className="chart-title">Top Subscribers</p>
          <p className="chart-value">{rows.length}</p>
          <span className="chart-delta neutral">↔ By {sortKey.replace(/_/g, " ")}</span>
        </div>
        <div className="flex gap-1">
          {(["data_used_gb", "sessions", "revenue"] as const).map((k) => (
            <button
              key={k}
              onClick={() => setSortKey(k)}
              className="px-2 py-1 rounded-lg text-[0.65rem] font-semibold transition-all"
              style={{
                background: sortKey === k ? "rgba(59,130,246,0.18)" : "transparent",
                color: sortKey === k ? "#3b82f6" : "var(--color-ink-dim)",
                border: `1px solid ${sortKey === k ? "rgba(59,130,246,0.3)" : "transparent"}`,
              }}
            >
              {k === "data_used_gb" ? "Data" : k === "sessions" ? "Sessions" : "Revenue"}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-1.5">
        {/* Header */}
        <div
          className="grid gap-2 px-3 pb-1"
          style={{ gridTemplateColumns: "1fr 5fr 3fr 2.5rem", fontSize: "0.625rem", color: "var(--color-ink-dim)", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}
        >
          <span>#</span><span>Subscriber</span><span>Data Usage</span><span>Sess</span>
        </div>

        {rows.map((sub, i) => {
          const statusCfg = STATUS_STYLES[sub.status ?? "active"] ?? STATUS_STYLES.active;
          const sliceColor = SLICE_COLORS[sub.slice ?? ""] ?? "#3b82f6";
          return (
            <div
              key={sub.id}
              className="grid items-center gap-2 rounded-xl px-3 py-2.5 transition-all cursor-default group"
              style={{
                gridTemplateColumns: "1fr 5fr 3fr 2.5rem",
                background: "rgba(255,255,255,0.02)",
                border: "1px solid transparent",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "rgba(59,130,246,0.05)";
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(59,130,246,0.12)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.02)";
                (e.currentTarget as HTMLElement).style.borderColor = "transparent";
              }}
            >
              <span style={{ fontSize: "0.7rem", color: "var(--color-ink-dim)", fontWeight: 700 }}>#{i + 1}</span>
              <div className="flex items-center gap-2 min-w-0">
                <Avatar name={sub.name ?? sub.id} />
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: "var(--color-ink)" }}>{sub.name ?? sub.msisdn}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span
                      className="px-1.5 py-0.5 rounded text-[0.55rem] font-bold uppercase"
                      style={{ background: `${sliceColor}18`, color: sliceColor }}
                    >
                      {sub.slice}
                    </span>
                    <span
                      className="px-1.5 py-0.5 rounded-full text-[0.55rem] font-semibold uppercase"
                      style={{ background: statusCfg.bg, color: statusCfg.color }}
                    >
                      {sub.status}
                    </span>
                  </div>
                </div>
              </div>
              <DataBar value={sub.data_used_gb ?? 0} max={maxData} color={sliceColor} />
              <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--color-ink-muted)", textAlign: "right" }}>
                {sub.sessions}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
