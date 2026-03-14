"use client";

import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Brush,
  ReferenceLine,
} from "recharts";
import { useState } from "react";
import { ChartPanel } from "@/components/ui/ChartPanel";

type DataPoint = {
  time: string;
  downlink: number;
  uplink: number;
  total?: number;
};

type Props = {
  data?: DataPoint[];
  title?: string;
  loading?: boolean;
};

const DEMO_DATA: DataPoint[] = [
  { time: "00:00", downlink: 12.4, uplink: 4.2 },
  { time: "02:00", downlink: 8.1, uplink: 2.8 },
  { time: "04:00", downlink: 5.6, uplink: 1.9 },
  { time: "06:00", downlink: 18.2, uplink: 6.1 },
  { time: "08:00", downlink: 32.5, uplink: 11.4 },
  { time: "10:00", downlink: 45.8, uplink: 16.2 },
  { time: "12:00", downlink: 52.3, uplink: 19.8 },
  { time: "14:00", downlink: 48.1, uplink: 17.3 },
  { time: "16:00", downlink: 56.7, uplink: 21.4 },
  { time: "18:00", downlink: 61.2, uplink: 23.6 },
  { time: "20:00", downlink: 44.3, uplink: 15.8 },
  { time: "22:00", downlink: 28.9, uplink: 9.4 },
].map((d) => ({ ...d, total: d.downlink + d.uplink }));

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number; name: string; color: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="custom-tooltip viz-tooltip">
      <p className="label">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="value-row mt-1">
          <span className="inline-block w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: p.color }} />
          <span style={{ color: "var(--color-ink-muted)", fontSize: "0.75rem" }}>{p.name}:</span>
          <span style={{ color: "var(--color-ink)", fontWeight: 700 }}>{p.value.toFixed(1)} Gbps</span>
        </div>
      ))}
    </div>
  );
}

const METRICS = [
  { key: "downlink", label: "Downlink", color: "#3b82f6", fillId: "tg-dl" },
  { key: "uplink", label: "Uplink", color: "#10b981", fillId: "tg-ul" },
];

export function ThroughputChart({ data, title = "Network Throughput", loading = false }: Props) {
  const [activeMetric, setActiveMetric] = useState<string | null>(null);
  const chartData = data ?? DEMO_DATA;
  const peakDown = Math.max(...chartData.map((d) => d.downlink));
  const peakUp = Math.max(...chartData.map((d) => d.uplink));
  const avgTotal = chartData.reduce((s, d) => s + (d.total ?? 0), 0) / chartData.length;

  if (loading) {
    return (
      <div className="chart-panel viz-panel animate-pulse">
        <div className="h-4 w-40 rounded bg-white/5 mb-4" />
        <div className="h-52 rounded bg-white/5" />
      </div>
    );
  }

  return (
    <ChartPanel
      title={title}
      value={
        <>
          <span style={{ fontSize: "1rem", color: "var(--color-ink-muted)", fontWeight: 500 }}>{avgTotal.toFixed(1)} Gbps</span>
          <span className="chart-delta up ml-2">↑ 8.2%</span>
        </>
      }
      actions={
        <div className="flex items-center gap-2">
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs"
            style={{
              background: "rgba(59,130,246,0.08)",
              border: "1px solid rgba(59,130,246,0.2)",
            }}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span style={{ color: "var(--color-ink-muted)" }}>Live</span>
          </div>
        </div>
      }
    >
      <div className="grid grid-cols-3 gap-3 mb-4">
        {[
          { label: "Peak DL", value: `${peakDown.toFixed(1)} Gbps`, color: "#3b82f6" },
          { label: "Peak UL", value: `${peakUp.toFixed(1)} Gbps`, color: "#10b981" },
          { label: "Avg Total", value: `${avgTotal.toFixed(1)} Gbps`, color: "var(--color-ink-muted)" },
        ].map((s) => (
          <div
            key={s.label}
            className="text-center rounded-xl py-2 px-3 transition-colors"
            style={{ background: "rgba(255,255,255,0.02)" }}
          >
            <p style={{ fontSize: "0.65rem", color: "var(--color-ink-dim)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              {s.label}
            </p>
            <p style={{ fontSize: "0.9rem", fontWeight: 700, color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mb-4 flex-wrap">
        {METRICS.map((m) => (
          <button
            key={m.key}
            type="button"
            onClick={() => setActiveMetric(activeMetric === m.key ? null : m.key)}
            className={`viz-range-btn ${activeMetric === m.key || activeMetric === null ? "active" : ""}`}
          >
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm" style={{ background: m.color }} />
              {m.label}
            </span>
          </button>
        ))}
      </div>

      <div className="w-full h-[240px] -ml-1">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 8, right: 8, bottom: 0, left: -12 }}>
            <defs>
              <linearGradient id="tg-dl" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.15" />
              </linearGradient>
              <linearGradient id="tg-ul" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.15" />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="time" tick={{ fill: "var(--color-ink-dim)", fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "var(--color-ink-dim)", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}G`} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(59,130,246,0.06)", stroke: "rgba(59,130,246,0.2)" }} />
            <ReferenceLine y={avgTotal} stroke="rgba(139,92,246,0.4)" strokeDasharray="4 4" strokeWidth={1} />
            <Bar
              dataKey="downlink"
              name="Downlink"
              fill="url(#tg-dl)"
              radius={[6, 6, 0, 0]}
              opacity={activeMetric === "uplink" ? 0.2 : 1}
              maxBarSize={28}
              isAnimationActive
              animationDuration={600}
            />
            <Bar
              dataKey="uplink"
              name="Uplink"
              fill="url(#tg-ul)"
              radius={[6, 6, 0, 0]}
              opacity={activeMetric === "downlink" ? 0.2 : 1}
              maxBarSize={28}
              isAnimationActive
              animationDuration={600}
            />
            <Line
              type="monotone"
              dataKey="total"
              name="Total"
              stroke="#8b5cf6"
              strokeWidth={2}
              dot={false}
              strokeDasharray="5 3"
              opacity={0.9}
            />
            <Brush dataKey="time" height={24} stroke="rgba(59,130,246,0.3)" fill="rgba(14,21,32,0.9)" travellerWidth={10} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </ChartPanel>
  );
}
