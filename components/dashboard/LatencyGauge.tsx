"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  value?: number; // 0-100
  title?: string;
  unit?: string;
  thresholds?: { warn: number; critical: number };
  loading?: boolean;
};

function getColor(value: number, warn: number, critical: number) {
  if (value >= critical) return { stroke: "#f43f5e", glow: "rgba(244,63,94,0.5)", text: "#f43f5e", label: "Critical" };
  if (value >= warn) return { stroke: "#f59e0b", glow: "rgba(245,158,11,0.5)", text: "#f59e0b", label: "Warning" };
  return { stroke: "#10b981", glow: "rgba(16,185,129,0.5)", text: "#10b981", label: "Healthy" };
}

const SIZE = 160;
const STROKE = 12;
const R = (SIZE - STROKE) / 2;
const CIRC = 2 * Math.PI * R;
// Arc spans 220 degrees (starts at 200° and ends at 160° clockwise = 220°)
const ARC = (220 / 360) * CIRC;
const GAP = CIRC - ARC;

export function LatencyGauge({
  value = 42,
  title = "Avg Latency",
  unit = "ms",
  thresholds = { warn: 60, critical: 80 },
  loading = false,
}: Props) {
  const [animated, setAnimated] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const start = performance.now();
    const duration = 1200;
    const target = Math.min(100, Math.max(0, value));
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      setAnimated(ease * target);
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [value]);

  const color = getColor(animated, thresholds.warn, thresholds.critical);
  const offset = ARC - (animated / 100) * ARC;

  if (loading) {
    return (
      <div className="chart-panel animate-pulse flex flex-col items-center">
        <div className="w-40 h-40 rounded-full bg-white/5 mb-3" />
        <div className="h-3 w-24 rounded bg-white/5" />
      </div>
    );
  }

  return (
    <div className="chart-panel viz-panel flex flex-col items-center">
      <div className="chart-header w-full">
        <div>
          <p className="chart-title">{title}</p>
        </div>
        <span
          className="text-[0.65rem] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider"
          style={{
            background: `${color.stroke}18`,
            color: color.stroke,
            border: `1px solid ${color.stroke}30`,
          }}
        >
          {color.label}
        </span>
      </div>

      {/* SVG Gauge */}
      <div className="relative flex items-center justify-center my-4" style={{ width: SIZE, height: SIZE }}>
        <svg
          width={SIZE}
          height={SIZE}
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          style={{ transform: "rotate(160deg)", filter: `drop-shadow(0 0 10px ${color.glow})` }}
        >
          {/* Track */}
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={R}
            fill="none"
            stroke="rgba(99,155,255,0.1)"
            strokeWidth={STROKE}
            strokeDasharray={`${ARC} ${GAP}`}
            strokeLinecap="round"
          />
          {/* Warn threshold tick */}
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={R}
            fill="none"
            stroke={`rgba(245,158,11,0.5)`}
            strokeWidth={STROKE * 1.2}
            strokeDasharray={`2 ${CIRC - 2}`}
            strokeDashoffset={-(ARC - (thresholds.warn / 100) * ARC)}
            strokeLinecap="round"
          />
          {/* Critical threshold tick */}
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={R}
            fill="none"
            stroke={`rgba(244,63,94,0.7)`}
            strokeWidth={STROKE * 1.2}
            strokeDasharray={`2 ${CIRC - 2}`}
            strokeDashoffset={-(ARC - (thresholds.critical / 100) * ARC)}
            strokeLinecap="round"
          />
          {/* Active arc */}
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={R}
            fill="none"
            stroke={color.stroke}
            strokeWidth={STROKE}
            strokeDasharray={`${ARC} ${GAP}`}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 0.05s linear, stroke 0.3s ease" }}
          />
        </svg>

        {/* Center display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ paddingTop: "12px" }}>
          <span
            className="font-bold tabular-nums"
            style={{ fontSize: "2.25rem", letterSpacing: "-0.04em", color: color.text, lineHeight: 1 }}
          >
            {Math.round(animated)}
          </span>
          <span className="text-sm font-semibold mt-0.5" style={{ color: "var(--color-ink-dim)" }}>
            {unit}
          </span>
        </div>
      </div>

      {/* Threshold legend */}
      <div className="flex gap-4 text-[0.7rem]">
        <span style={{ color: "#10b981" }}>● Normal &lt;{thresholds.warn}{unit}</span>
        <span style={{ color: "#f59e0b" }}>● Warn &lt;{thresholds.critical}{unit}</span>
        <span style={{ color: "#f43f5e" }}>● Crit ≥{thresholds.critical}{unit}</span>
      </div>

      {/* Progress bar */}
      <div className="w-full mt-3 h-1.5 rounded-full" style={{ background: "rgba(99,155,255,0.08)" }}>
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${animated}%`, background: `linear-gradient(90deg, #10b981, ${color.stroke})` }}
        />
      </div>
    </div>
  );
}
