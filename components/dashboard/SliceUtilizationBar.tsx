"use client";

import { useEffect, useState } from "react";
import { ChartPanel } from "@/components/ui/ChartPanel";

type SliceData = {
  id: string;
  name: string;
  type: string;
  used: number;
  capacity: number;
  subscribers?: number;
  color?: string;
};

type Props = {
  slices?: SliceData[];
  loading?: boolean;
};

const SLICE_COLORS = ["#3b82f6", "#06b6d4", "#10b981", "#8b5cf6", "#f59e0b", "#f43f5e"];

const DEMO_SLICES: SliceData[] = [
  { id: "embb-01", name: "eMBB Premium", type: "eMBB", used: 78, capacity: 100, subscribers: 12400 },
  { id: "urllc-01", name: "URLLC Slice-A", type: "URLLC", used: 45, capacity: 100, subscribers: 3200 },
  { id: "mmtc-01", name: "mMTC IoT Grid", type: "mMTC", used: 92, capacity: 100, subscribers: 84000 },
  { id: "embb-02", name: "eMBB Standard", type: "eMBB", used: 61, capacity: 100, subscribers: 8900 },
  { id: "urllc-02", name: "URLLC V2X", type: "URLLC", used: 34, capacity: 100, subscribers: 1500 },
];

function AnimatedBar({ pct, color, delay }: { pct: number; color: string; delay: number }) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setWidth(pct), 100 + delay);
    return () => clearTimeout(t);
  }, [pct, delay]);

  const alertColor = pct > 90 ? "#f43f5e" : pct > 75 ? "#f59e0b" : color;

  return (
    <div className="relative h-3 w-full rounded-full overflow-hidden" style={{ background: "rgba(99,155,255,0.08)" }}>
      <div
        className="absolute inset-y-0 left-0 rounded-full"
        style={{
          width: `${width}%`,
          background: `linear-gradient(90deg, ${color}aa, ${alertColor})`,
          boxShadow: pct > 90 ? `0 0 8px ${alertColor}` : "none",
          transition: "width 0.9s cubic-bezier(0.22,1,0.36,1)",
        }}
      />
      {pct > 90 && (
        <div
          className="absolute inset-y-0 rounded-full"
          style={{
            left: `${width - 3}%`,
            width: "6px",
            background: alertColor,
            opacity: 0.7,
            animation: "blink 1s ease-in-out infinite",
          }}
        />
      )}
    </div>
  );
}

const TYPE_COLORS: Record<string, string> = {
  eMBB: "#3b82f6",
  URLLC: "#10b981",
  mMTC: "#8b5cf6",
};

export function SliceUtilizationBar({ slices, loading = false }: Props) {
  const allSlices = (slices ?? DEMO_SLICES).map((s, i) => ({
    ...s,
    color: TYPE_COLORS[s.type] ?? SLICE_COLORS[i % SLICE_COLORS.length],
  }));

  const avgUtil = Math.round(allSlices.reduce((s, sl) => s + sl.used, 0) / allSlices.length);
  const critical = allSlices.filter((s) => s.used > 90).length;

  if (loading) {
    return (
      <div className="chart-panel animate-pulse">
        <div className="h-4 w-36 rounded bg-white/5 mb-6" />
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-12 rounded-xl bg-white/5 mb-2" />
        ))}
      </div>
    );
  }

  return (
    <ChartPanel
      title="Slice Utilization"
      value={`${avgUtil}%`}
      badge={
        <>
          <span className="chart-delta neutral ml-1">↔ {allSlices.length} slices</span>
          {critical > 0 && <span className="chart-delta down ml-1">⚠ {critical} overload</span>}
        </>
      }
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-4 text-xs" style={{ color: "var(--color-ink-dim)" }}>
          <span><span className="w-2 h-2 rounded-full inline-block mr-1.5 align-middle" style={{ background: "#10b981" }} />Healthy &lt;75%</span>
          <span><span className="w-2 h-2 rounded-full inline-block mr-1.5 align-middle" style={{ background: "#f59e0b" }} />Warn 75-90%</span>
          <span><span className="w-2 h-2 rounded-full inline-block mr-1.5 align-middle" style={{ background: "#f43f5e" }} />Critical &gt;90%</span>
        </div>
        <svg width="48" height="48" viewBox="0 0 52 52" className="flex-shrink-0">
          <circle cx="26" cy="26" r="20" fill="none" stroke="rgba(99,155,255,0.1)" strokeWidth="8" />
          <circle
            cx="26" cy="26" r="20"
            fill="none"
            stroke={avgUtil > 85 ? "#f43f5e" : avgUtil > 70 ? "#f59e0b" : "#3b82f6"}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${(avgUtil / 100) * 125.7} 125.7`}
            transform="rotate(-90 26 26)"
            style={{ transition: "stroke-dasharray 1s ease", filter: "drop-shadow(0 0 6px rgba(59,130,246,0.5))" }}
          />
          <text x="26" y="30" textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--color-ink)">{avgUtil}%</text>
        </svg>
      </div>

      <div className="space-y-3">
        {allSlices.map((slice, i) => (
          <div
            key={slice.id}
            className="group rounded-2xl p-3.5 transition-all cursor-pointer border border-transparent hover:border-[rgba(99,155,255,0.15)] hover:shadow-[0_0_20px_-8px_rgba(59,130,246,0.4)]"
            style={{
              background: "rgba(255,255,255,0.02)",
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ background: slice.color, boxShadow: `0 0 6px ${slice.color}80` }}
                />
                <span className="font-semibold text-sm" style={{ color: "var(--color-ink)" }}>{slice.name}</span>
                <span
                  className="px-1.5 py-0.5 rounded text-[0.6rem] font-bold uppercase"
                  style={{ background: `${slice.color}18`, color: slice.color }}
                >
                  {slice.type}
                </span>
              </div>
              <div className="flex items-center gap-3 text-[0.7rem]">
                {slice.subscribers && (
                  <span style={{ color: "var(--color-ink-dim)" }}>
                    {slice.subscribers.toLocaleString()} subs
                  </span>
                )}
                <span
                  className="font-bold tabular-nums"
                  style={{
                    color: slice.used > 90 ? "#f43f5e" : slice.used > 75 ? "#f59e0b" : slice.color,
                    minWidth: "2.5rem",
                    textAlign: "right",
                  }}
                >
                  {slice.used}%
                </span>
              </div>
            </div>
            <AnimatedBar pct={slice.used} color={slice.color} delay={i * 80} />
          </div>
        ))}
      </div>
    </ChartPanel>
  );
}
