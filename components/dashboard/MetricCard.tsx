"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

type Trend = "up" | "down" | "neutral";

type Props = {
  title: string;
  value: string | number;
  unit?: string;
  delta?: string;
  trend?: Trend;
  icon?: ReactNode;
  accentColor?: string;
  sparklineData?: number[];
  loading?: boolean;
};

function MiniSparkline({ data, color }: { data: number[]; color: string }) {
  if (!data || data.length < 2) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 80;
  const h = 32;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * h;
    return `${x},${y}`;
  });
  const pathD = `M${pts.join(" L")}`;
  const areaD = `M${pts[0]} L${pts.join(" L")} L${w},${h} L0,${h} Z`;

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
      <defs>
        <linearGradient id={`sg-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaD} fill={`url(#sg-${color})`} />
      <path d={pathD} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={pts[pts.length - 1].split(",")[0]} cy={pts[pts.length - 1].split(",")[1]} r="3" fill={color} />
    </svg>
  );
}

const trendColors: Record<Trend, string> = {
  up: "var(--color-emerald)",
  down: "var(--color-rose)",
  neutral: "var(--color-cyan)",
};

const trendBg: Record<Trend, string> = {
  up: "rgba(16,185,129,0.12)",
  down: "rgba(244,63,94,0.12)",
  neutral: "rgba(6,182,212,0.1)",
};

const trendArrow: Record<Trend, string> = {
  up: "↑",
  down: "↓",
  neutral: "→",
};

export function MetricCard({
  title,
  value,
  unit,
  delta,
  trend = "neutral",
  icon,
  accentColor = "var(--color-primary)",
  sparklineData,
  loading = false,
}: Props) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      el.style.setProperty("--mouse-x", `${x}%`);
      el.style.setProperty("--mouse-y", `${y}%`);
    };
    el.addEventListener("mousemove", handleMove);
    return () => el.removeEventListener("mousemove", handleMove);
  }, []);

  if (loading) {
    return (
      <div className="kpi-tile animate-pulse">
        <div className="h-3 w-24 rounded-full bg-white/5 mb-3" />
        <div className="h-8 w-16 rounded-full bg-white/5 mb-2" />
        <div className="h-3 w-12 rounded-full bg-white/5" />
      </div>
    );
  }

  return (
    <div
      ref={cardRef}
      className="kpi-tile fade-in-up group"
      style={
        {
          "--accent": accentColor,
          "--mouse-x": "50%",
          "--mouse-y": "50%",
          background: `radial-gradient(circle at var(--mouse-x) var(--mouse-y), rgba(59,130,246,0.04) 0%, transparent 60%), var(--color-surface)`,
        } as React.CSSProperties
      }
    >
      {/* Top row: icon + badge */}
      <div className="flex items-start justify-between mb-3">
        <div
          className="flex items-center justify-center w-9 h-9 rounded-xl"
          style={{ background: `${accentColor}18`, border: `1px solid ${accentColor}30` }}
        >
          {icon ?? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="2.2">
              <path d="M3 12h4l3-8 4 16 3-8h4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>

        {delta && (
          <span
            className="chart-delta"
            style={{
              backgroundColor: trendBg[trend],
              color: trendColors[trend],
              borderColor: `${trendColors[trend]}30`,
              fontSize: "0.7rem",
            }}
          >
            <span>{trendArrow[trend]}</span>
            {delta}
          </span>
        )}
      </div>

      {/* Value */}
      <div className="flex items-baseline gap-1.5 mb-0.5">
        <span
          className="font-bold tracking-tight leading-none"
          style={{ fontSize: "clamp(1.5rem,2.5vw,2rem)", color: "var(--color-ink)" }}
        >
          {value}
        </span>
        {unit && (
          <span className="text-xs font-medium" style={{ color: "var(--color-ink-dim)" }}>
            {unit}
          </span>
        )}
      </div>

      {/* Title */}
      <p
        className="text-[0.7rem] font-semibold uppercase tracking-widest mb-3"
        style={{ color: "var(--color-ink-dim)" }}
      >
        {title}
      </p>

      {/* Sparkline */}
      {sparklineData && (
        <div className="mt-1 opacity-70 group-hover:opacity-100 transition-opacity">
          <MiniSparkline data={sparklineData} color={accentColor} />
        </div>
      )}

      {/* Bottom accent line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-0.5 rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)` }}
      />
    </div>
  );
}
