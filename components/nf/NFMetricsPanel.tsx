"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { ChartPanel } from "@/components/ui/ChartPanel";

type MetricPoint = {
  name: string;
  value: number;
  unit?: string;
  status?: "healthy" | "warning" | "critical";
};

type Props = {
  title?: string;
  data?: MetricPoint[];
  loading?: boolean;
};

const DEMO_DATA: MetricPoint[] = [
  { name: "CPU", value: 42, unit: "%", status: "healthy" },
  { name: "Memory", value: 68, unit: "%", status: "healthy" },
  { name: "Network", value: 85, unit: "%", status: "warning" },
  { name: "Disk", value: 22, unit: "%", status: "healthy" },
  { name: "Connections", value: 91, unit: "%", status: "critical" },
];

const STATUS_COLORS = {
  healthy: "#10b981",
  warning: "#f59e0b",
  critical: "#f43f5e",
} as const;

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: MetricPoint; color: string }>;
}) {
  if (!active || !payload?.length) return null;
  const p = payload[0].payload;
  return (
    <div className="custom-tooltip viz-tooltip">
      <p className="label">{p.name}</p>
      <div className="value-row mt-1">
        <span
          className="inline-block w-2.5 h-2.5 rounded-full flex-shrink-0"
          style={{
            background: p.status ? STATUS_COLORS[p.status] : "#3b82f6",
          }}
        />
        <span style={{ color: "var(--color-ink-muted)", fontSize: "0.75rem" }}>Value:</span>
        <span style={{ color: "var(--color-ink)", fontWeight: 700 }}>
          {p.value}{p.unit ?? ""}
        </span>
      </div>
    </div>
  );
}

export function NFMetricsPanel({
  title = "NF Metrics",
  data,
  loading = false,
}: Props) {
  const chartData = data ?? DEMO_DATA;

  if (loading) {
    return (
      <div className="chart-panel viz-panel animate-pulse">
        <div className="h-4 w-32 rounded bg-white/5 mb-4" />
        <div className="h-40 rounded bg-white/5" />
      </div>
    );
  }

  return (
    <ChartPanel
      title={title}
      value={`${chartData.length} metrics`}
      subtitle="Resource utilization by category"
    >
      <div className="w-full h-[200px] -ml-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 4, right: 20, bottom: 4, left: 8 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis
              type="number"
              domain={[0, 100]}
              tick={{ fill: "var(--color-ink-dim)", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${v}%`}
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fill: "var(--color-ink-dim)", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              width={60}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(59,130,246,0.06)" }} />
            <Bar
              dataKey="value"
              radius={[0, 6, 6, 0]}
              maxBarSize={20}
              isAnimationActive
              animationDuration={600}
            >
              {chartData.map((entry, i) => (
                <Cell
                  key={`cell-${i}`}
                  fill={
                    entry.status
                      ? STATUS_COLORS[entry.status]
                      : `hsl(${210 + i * 30}, 70%, 55%)`
                  }
                  opacity={0.85}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartPanel>
  );
}
