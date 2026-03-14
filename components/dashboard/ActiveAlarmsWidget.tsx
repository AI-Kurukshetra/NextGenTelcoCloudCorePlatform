"use client";

import { useState, useEffect } from "react";

type Alarm = {
  id: string;
  alarm_type: string;
  severity: "critical" | "major" | "minor" | "warning" | "info";
  source?: string;
  raised_at?: string;
  created_at?: string;
  description?: string;
  status?: "active" | "acknowledged" | "resolved";
};

type Props = {
  alarms?: Alarm[];
  loading?: boolean;
};

const DEMO_ALARMS: Alarm[] = [
  {
    id: "a1",
    alarm_type: "High CPU Usage",
    severity: "critical",
    source: "UPF-01",
    raised_at: new Date(Date.now() - 3 * 60000).toISOString(),
    description: "CPU utilization exceeded 95% for 5 minutes",
    status: "active",
  },
  {
    id: "a2",
    alarm_type: "Packet Loss Spike",
    severity: "major",
    source: "GNB-03",
    raised_at: new Date(Date.now() - 8 * 60000).toISOString(),
    description: "Packet loss rate: 4.2% on N3 interface",
    status: "active",
  },
  {
    id: "a3",
    alarm_type: "NF Discovery Failure",
    severity: "minor",
    source: "NRF-01",
    raised_at: new Date(Date.now() - 15 * 60000).toISOString(),
    description: "NSSF deregistered from NRF",
    status: "acknowledged",
  },
  {
    id: "a4",
    alarm_type: "Slice Capacity Warning",
    severity: "warning",
    source: "SMF-01",
    raised_at: new Date(Date.now() - 22 * 60000).toISOString(),
    description: "mMTC slice at 92% capacity",
    status: "active",
  },
  {
    id: "a5",
    alarm_type: "Certificate Expiry",
    severity: "info",
    source: "AUSF-01",
    raised_at: new Date(Date.now() - 60 * 60000).toISOString(),
    description: "TLS cert expiring in 7 days",
    status: "acknowledged",
  },
];

const SEV_CONFIG = {
  critical: { color: "#f43f5e", bg: "rgba(244,63,94,0.1)", border: "rgba(244,63,94,0.25)", icon: "●", dot: "#f43f5e" },
  major: { color: "#f97316", bg: "rgba(249,115,22,0.1)", border: "rgba(249,115,22,0.25)", icon: "◆", dot: "#f97316" },
  minor: { color: "#f59e0b", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.25)", icon: "▲", dot: "#f59e0b" },
  warning: { color: "#eab308", bg: "rgba(234,179,8,0.1)", border: "rgba(234,179,8,0.25)", icon: "⚠", dot: "#eab308" },
  info: { color: "#06b6d4", bg: "rgba(6,182,212,0.08)", border: "rgba(6,182,212,0.2)", icon: "ℹ", dot: "#06b6d4" },
};

function timeAgo(iso: string) {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 3600)}h ago`;
}

export function ActiveAlarmsWidget({ alarms, loading = false }: Props) {
  const [, setTick] = useState(0);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 30000);
    return () => clearInterval(id);
  }, []);

  const allAlarms = alarms ?? DEMO_ALARMS;
  const critical = allAlarms.filter((a) => a.severity === "critical").length;
  const active = allAlarms.filter((a) => a.status === "active").length;

  if (loading) {
    return (
      <div className="chart-panel animate-pulse">
        <div className="h-4 w-32 rounded bg-white/5 mb-5" />
        {[...Array(4)].map((_, i) => <div key={i} className="h-14 rounded-xl bg-white/5 mb-2" />)}
      </div>
    );
  }

  return (
    <div className="chart-panel viz-panel">
      <div className="chart-header">
        <div>
          <p className="chart-title">Active Alarms</p>
          <div className="flex items-baseline gap-1.5">
            <p
              className="chart-value"
              style={{ color: critical > 0 ? "#f43f5e" : "var(--color-ink)" }}
            >
              {active}
            </p>
            <span style={{ fontSize: "0.875rem", color: "var(--color-ink-dim)" }}>/ {allAlarms.length} total</span>
          </div>
          {critical > 0 && <span className="chart-delta down">⚠ {critical} critical</span>}
        </div>
        <div
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs"
          style={{ background: "rgba(244,63,94,0.1)", border: "1px solid rgba(244,63,94,0.2)" }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: "#f43f5e", animation: "blink 1.2s ease-in-out infinite" }}
          />
          <span style={{ color: "#f43f5e", fontWeight: 600, fontSize: "0.7rem" }}>LIVE</span>
        </div>
      </div>

      {/* Severity summary */}
      <div className="flex gap-3 mb-4 flex-wrap">
        {(["critical", "major", "minor", "warning", "info"] as const).map((s) => {
          const count = allAlarms.filter((a) => a.severity === s).length;
          const cfg = SEV_CONFIG[s];
          if (!count) return null;
          return (
            <div key={s} className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full" style={{ background: cfg.dot }} />
              <span style={{ fontSize: "0.65rem", color: "var(--color-ink-dim)" }}>
                <strong style={{ color: cfg.color }}>{count}</strong> {s}
              </span>
            </div>
          );
        })}
      </div>

      {/* Alarm list */}
      <div className="space-y-2">
        {allAlarms.map((alarm) => {
          const cfg = SEV_CONFIG[alarm.severity] ?? SEV_CONFIG.info;
          const isExpanded = expanded === alarm.id;
          return (
            <div
              key={alarm.id}
              className="rounded-2xl overflow-hidden cursor-pointer transition-all"
              style={{
                background: isExpanded ? cfg.bg : "rgba(255,255,255,0.02)",
                border: `1px solid ${isExpanded ? cfg.border : "rgba(99,155,255,0.08)"}`,
              }}
              onClick={() => setExpanded(isExpanded ? null : alarm.id)}
            >
              <div className="flex items-center gap-3 px-3 py-2.5">
                <span style={{ color: cfg.color, fontSize: "0.75rem", flexShrink: 0 }}>{cfg.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold truncate" style={{ color: "var(--color-ink)" }}>{alarm.alarm_type}</p>
                    <span style={{ fontSize: "0.65rem", color: "var(--color-ink-dim)", whiteSpace: "nowrap" }}>
                      {timeAgo(alarm.raised_at ?? alarm.created_at ?? new Date().toISOString())}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    {alarm.source && (
                      <span
                        className="px-1.5 py-0.5 rounded text-[0.6rem] font-mono font-semibold"
                        style={{ background: "rgba(99,155,255,0.1)", color: "var(--color-ink-muted)" }}
                      >
                        {alarm.source}
                      </span>
                    )}
                    <span
                      className="px-1.5 py-0.5 rounded-full text-[0.6rem] font-bold uppercase"
                      style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}
                    >
                      {alarm.severity}
                    </span>
                    {alarm.status === "acknowledged" && (
                      <span
                        className="px-1.5 py-0.5 rounded-full text-[0.6rem] font-semibold"
                        style={{ background: "rgba(139,92,246,0.12)", color: "#8b5cf6" }}
                      >
                        ACK
                      </span>
                    )}
                  </div>
                </div>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--color-ink-dim)"
                  strokeWidth="2"
                  style={{ transform: isExpanded ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s", flexShrink: 0 }}
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </div>
              {isExpanded && alarm.description && (
                <div className="px-3 pb-3">
                  <div
                    className="rounded-xl px-3 py-2 text-xs"
                    style={{ background: "rgba(0,0,0,0.2)", color: "var(--color-ink-muted)", fontFamily: "JetBrains Mono, monospace" }}
                  >
                    {alarm.description}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
