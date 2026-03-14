"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  Brush,
} from "recharts";
import { useState } from "react";
import { ChartPanel } from "@/components/ui/ChartPanel";

export type TimeSeriesDataPoint = {
  time: string;
  [key: string]: string | number;
};

type SeriesConfig = {
  key: string;
  label: string;
  color: string;
  fillId?: string;
};

type Props = {
  title?: string;
  data?: TimeSeriesDataPoint[];
  series?: SeriesConfig[];
  valueKey?: string;
  unit?: string;
  loading?: boolean;
  variant?: "line" | "area";
};

const DEMO_DATA: TimeSeriesDataPoint[] = [
  { time: "00:00", value: 42, min: 38, max: 52 },
  { time: "02:00", value: 38, min: 34, max: 48 },
  { time: "04:00", value: 35, min: 30, max: 44 },
  { time: "06:00", value: 58, min: 50, max: 68 },
  { time: "08:00", value: 72, min: 62, max: 84 },
  { time: "10:00", value: 85, min: 78, max: 92 },
  { time: "12:00", value: 92, min: 85, max: 98 },
  { time: "14:00", value: 88, min: 80, max: 95 },
  { time: "16:00", value: 95, min: 88, max: 102 },
  { time: "18:00", value: 102, min: 94, max: 110 },
  { time: "20:00", value: 78, min: 70, max: 86 },
  { time: "22:00", value: 55, min: 48, max: 62 },
];

function CustomTooltip({
  active,
  payload,
  label,
  series,
}: {
  active?: boolean;
  payload?: Array<{ value: number; name: string; color: string }>;
  label?: string;
  series: SeriesConfig[];
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="custom-tooltip viz-tooltip">
      <p className="label">{label}</p>
      {payload.map((p) => {
        const cfg = series.find((s) => s.key === p.name) ?? { label: p.name, color: p.color };
        return (
          <div key={p.name} className="value-row mt-1">
            <span
              className="inline-block w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ background: cfg.color }}
            />
            <span style={{ color: "var(--color-ink-muted)", fontSize: "0.75rem" }}>{cfg.label}:</span>
            <span style={{ color: "var(--color-ink)", fontWeight: 700 }}>{p.value}</span>
          </div>
        );
      })}
    </div>
  );
}

export function TimeSeriesChart({
  title = "Metric Trend",
  data,
  series = [{ key: "value", label: "Value", color: "#3b82f6", fillId: "ts-val" }],
  valueKey = "value",
  unit = "",
  loading = false,
  variant = "area",
}: Props) {
  const [range, setRange] = useState<"6H" | "12H" | "24H" | "7D">("24H");
  const chartData = data ?? DEMO_DATA;
  const values = chartData.map((d) => Number(d[valueKey]));
  const maxVal = Math.max(...values);
  const avgVal = values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;

  if (loading) {
    return (
      <div className="chart-panel viz-panel animate-pulse">
        <div className="h-4 w-40 rounded bg-white/5 mb-4" />
        <div className="h-48 rounded bg-white/5" />
      </div>
    );
  }

  return (
    <ChartPanel
      title={title}
      value={
        <>
          <span>{avgVal.toFixed(1)}</span>
          {unit && (
            <span className="text-sm font-medium ml-1" style={{ color: "var(--color-ink-dim)" }}>
              {unit}
            </span>
          )}
          <span className="chart-delta up ml-2">↑ 5.2%</span>
        </>
      }
      actions={
        <div className="flex items-center gap-1.5">
          {(["6H", "12H", "24H", "7D"] as const).map((r) => (
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
      <div className="flex gap-4 mb-4 text-xs" style={{ color: "var(--color-ink-dim)" }}>
        <span>Peak: <strong style={{ color: "var(--color-ink)" }}>{maxVal.toFixed(1)}</strong></span>
        <span>Avg: <strong style={{ color: "var(--color-ink)" }}>{avgVal.toFixed(1)}</strong></span>
      </div>

      <div className="w-full h-[220px] -ml-1">
        <ResponsiveContainer width="100%" height="100%">
          {variant === "area" ? (
            <AreaChart data={chartData} margin={{ top: 8, right: 8, bottom: 0, left: -12 }}>
              <defs>
                {series.map((s) => (
                  <linearGradient key={s.key} id={s.fillId ?? `ts-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={s.color} stopOpacity="0.35" />
                    <stop offset="100%" stopColor={s.color} stopOpacity="0" />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="time"
                tick={{ fill: "var(--color-ink-dim)", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "var(--color-ink-dim)", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                content={<CustomTooltip series={series} />}
                cursor={{ fill: "rgba(59,130,246,0.06)", stroke: "rgba(59,130,246,0.2)" }}
              />
              {series.map((s) => (
                <Area
                  key={s.key}
                  type="monotone"
                  dataKey={s.key}
                  name={s.key}
                  stroke={s.color}
                  strokeWidth={2}
                  fill={`url(#${s.fillId ?? `ts-${s.key}`})`}
                  dot={false}
                  activeDot={{ r: 5, fill: s.color, stroke: "var(--color-surface)", strokeWidth: 2 }}
                  isAnimationActive
                  animationDuration={600}
                />
              ))}
              <Brush
                dataKey="time"
                height={24}
                stroke="rgba(59,130,246,0.3)"
                fill="rgba(14,21,32,0.9)"
                travellerWidth={10}
              />
            </AreaChart>
          ) : (
            <LineChart data={chartData} margin={{ top: 8, right: 8, bottom: 0, left: -12 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="time"
                tick={{ fill: "var(--color-ink-dim)", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "var(--color-ink-dim)", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                content={<CustomTooltip series={series} />}
                cursor={{ fill: "rgba(59,130,246,0.06)", stroke: "rgba(59,130,246,0.2)" }}
              />
              {series.map((s) => (
                <Line
                  key={s.key}
                  type="monotone"
                  dataKey={s.key}
                  name={s.key}
                  stroke={s.color}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 5, fill: s.color, stroke: "var(--color-surface)", strokeWidth: 2 }}
                  isAnimationActive
                  animationDuration={600}
                />
              ))}
              <Brush
                dataKey="time"
                height={24}
                stroke="rgba(59,130,246,0.3)"
                fill="rgba(14,21,32,0.9)"
                travellerWidth={10}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </ChartPanel>
  );
}
