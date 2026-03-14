"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Brush,
} from "recharts";
import { useState } from "react";
import { ChartPanel } from "@/components/ui/ChartPanel";

type DataPoint = {
  time: string;
  sessions: number;
  peak?: number;
};

type Props = {
  data?: DataPoint[];
  title?: string;
  loading?: boolean;
};

const DEMO_DATA: DataPoint[] = [
  { time: "00:00", sessions: 1820, peak: 2100 },
  { time: "02:00", sessions: 1340, peak: 1600 },
  { time: "04:00", sessions: 980, peak: 1200 },
  { time: "06:00", sessions: 2100, peak: 2400 },
  { time: "08:00", sessions: 3600, peak: 4000 },
  { time: "10:00", sessions: 5240, peak: 5800 },
  { time: "12:00", sessions: 6100, peak: 6600 },
  { time: "14:00", sessions: 5800, peak: 6300 },
  { time: "16:00", sessions: 6400, peak: 7000 },
  { time: "18:00", sessions: 7200, peak: 7800 },
  { time: "20:00", sessions: 5900, peak: 6500 },
  { time: "22:00", sessions: 3400, peak: 3900 },
];

const RANGES = ["6H", "12H", "24H", "7D"] as const;

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
          <span style={{ color: "var(--color-ink)", fontWeight: 700 }}>{p.value.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
}

export function SessionCountChart({ data, title = "Session Count", loading = false }: Props) {
  const [range, setRange] = useState<(typeof RANGES)[number]>("24H");
  const chartData = data ?? DEMO_DATA;
  const total = chartData.reduce((s, d) => s + d.sessions, 0);
  const maxSessions = Math.max(...chartData.map((d) => d.sessions));
  const avgSessions = Math.round(total / chartData.length);

  if (loading) {
    return (
      <div className="chart-panel viz-panel animate-pulse">
        <div className="h-4 w-32 rounded bg-white/5 mb-4" />
        <div className="h-48 rounded bg-white/5" />
      </div>
    );
  }

  return (
    <ChartPanel
      title={title}
      value={
        <>
          <span>{(total / 1000).toFixed(1)}K</span>
          <span className="chart-delta up ml-2">↑ 12.4%</span>
        </>
      }
      actions={
        <div className="flex items-center gap-1.5">
          {RANGES.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRange(r)}
              className={`viz-range-btn ${range === r ? "active" : ""}`}
            >
              {r}
            </button>
          ))}
        </div>
      }
    >
      <div className="flex gap-4 mb-4 flex-wrap">
        <span className="text-xs" style={{ color: "var(--color-ink-dim)" }}>
          Peak: <strong style={{ color: "var(--color-ink)" }}>{maxSessions.toLocaleString()}</strong>
        </span>
        <span className="text-xs" style={{ color: "var(--color-ink-dim)" }}>
          Avg: <strong style={{ color: "var(--color-ink)" }}>{avgSessions.toLocaleString()}</strong>
        </span>
      </div>

      <div className="w-full h-[220px] -ml-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 8, right: 8, bottom: 0, left: -12 }}>
            <defs>
              <linearGradient id="grad-sessions" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="grad-peak" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="time" tick={{ fill: "var(--color-ink-dim)", fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis
              tick={{ fill: "var(--color-ink-dim)", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${(v / 1000).toFixed(1)}K`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(59,130,246,0.06)", stroke: "rgba(59,130,246,0.2)" }} />
            <Area
              type="monotone"
              dataKey="peak"
              name="Peak"
              stroke="#06b6d4"
              strokeWidth={1.5}
              fill="url(#grad-peak)"
              strokeDasharray="4 3"
            />
            <Area
              type="monotone"
              dataKey="sessions"
              name="Sessions"
              stroke="#3b82f6"
              strokeWidth={2.5}
              fill="url(#grad-sessions)"
              dot={false}
              activeDot={{ r: 6, fill: "#3b82f6", stroke: "#0e1520", strokeWidth: 2 }}
              isAnimationActive
              animationDuration={800}
            />
            <Brush dataKey="time" height={24} stroke="rgba(59,130,246,0.3)" fill="rgba(14,21,32,0.9)" travellerWidth={10} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </ChartPanel>
  );
}
