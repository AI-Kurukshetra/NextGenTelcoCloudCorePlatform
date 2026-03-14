"use client";

import { useState } from "react";

type NodeStatus = "operational" | "degraded" | "failed" | "maintenance";

type NetworkNode = {
  id: string;
  name: string;
  type: string;
  status: NodeStatus;
  latency?: number;
  load?: number;
  region?: string;
};

type Props = {
  nodes?: NetworkNode[];
  loading?: boolean;
};

const DEMO_NODES: NetworkNode[] = [
  { id: "amf-01", name: "AMF-01", type: "AMF", status: "operational", latency: 2.1, load: 68, region: "EU-West" },
  { id: "smf-01", name: "SMF-01", type: "SMF", status: "operational", latency: 1.8, load: 75, region: "EU-West" },
  { id: "upf-01", name: "UPF-01", type: "UPF", status: "degraded", latency: 24.5, load: 91, region: "EU-West" },
  { id: "ausf-01", name: "AUSF-01", type: "AUSF", status: "operational", latency: 3.2, load: 44, region: "US-East" },
  { id: "nrf-01", name: "NRF-01", type: "NRF", status: "operational", latency: 1.4, load: 32, region: "US-East" },
  { id: "pcf-01", name: "PCF-01", type: "PCF", status: "maintenance", latency: 0, load: 0, region: "US-East" },
  { id: "udr-01", name: "UDR-01", type: "UDR", status: "operational", latency: 2.7, load: 58, region: "APAC" },
  { id: "nssf-01", name: "NSSF-01", type: "NSSF", status: "failed", latency: 0, load: 0, region: "APAC" },
];

const STATUS_CONFIG: Record<NodeStatus, { color: string; bg: string; dot: string; label: string }> = {
  operational: {
    color: "#10b981",
    bg: "rgba(16,185,129,0.1)",
    dot: "#10b981",
    label: "Operational",
  },
  degraded: {
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.1)",
    dot: "#f59e0b",
    label: "Degraded",
  },
  failed: {
    color: "#f43f5e",
    bg: "rgba(244,63,94,0.1)",
    dot: "#f43f5e",
    label: "Failed",
  },
  maintenance: {
    color: "#8b5cf6",
    bg: "rgba(139,92,246,0.1)",
    dot: "#8b5cf6",
    label: "Maintenance",
  },
};

function LoadBar({ value, color }: { value: number; color: string }) {
  const pct = Math.min(100, Math.max(0, value));
  const barColor = pct > 85 ? "#f43f5e" : pct > 70 ? "#f59e0b" : color;
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full" style={{ background: "rgba(99,155,255,0.1)" }}>
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: barColor }}
        />
      </div>
      <span style={{ fontSize: "0.65rem", color: barColor, width: "2.5rem", textAlign: "right" }}>{pct}%</span>
    </div>
  );
}

export function NetworkHealthGrid({ nodes, loading = false }: Props) {
  const [filter, setFilter] = useState<NodeStatus | "all">("all");
  const allNodes = nodes ?? DEMO_NODES;
  const filtered = filter === "all" ? allNodes : allNodes.filter((n) => n.status === filter);

  const counts = {
    operational: allNodes.filter((n) => n.status === "operational").length,
    degraded: allNodes.filter((n) => n.status === "degraded").length,
    failed: allNodes.filter((n) => n.status === "failed").length,
    maintenance: allNodes.filter((n) => n.status === "maintenance").length,
  };

  if (loading) {
    return (
      <div className="chart-panel animate-pulse">
        <div className="h-4 w-40 rounded bg-white/5 mb-6" />
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-20 rounded-xl bg-white/5" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="chart-panel viz-panel">
      <div className="chart-header">
        <div>
          <p className="chart-title">Network Functions Health</p>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="chart-value">{counts.operational}</span>
            <span style={{ color: "var(--color-ink-dim)", fontSize: "0.875rem" }}>/ {allNodes.length} healthy</span>
          </div>
        </div>
        <div className="flex gap-1.5">
          {(["all", "operational", "degraded", "failed", "maintenance"] as const).map((f) => {
            const cfg = f === "all" ? null : STATUS_CONFIG[f];
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className="px-2 py-1 rounded-lg text-[0.65rem] font-semibold uppercase tracking-wider transition-all"
                style={{
                  background: filter === f ? (cfg?.bg ?? "rgba(59,130,246,0.15)") : "transparent",
                  color: filter === f ? (cfg?.color ?? "var(--color-primary)") : "var(--color-ink-dim)",
                  border: `1px solid ${filter === f ? (cfg?.color ?? "var(--color-primary)") + "40" : "transparent"}`,
                }}
              >
                {f === "all" ? `All (${allNodes.length})` : f}
              </button>
            );
          })}
        </div>
      </div>

      {/* Summary dots */}
      <div className="flex gap-4 mb-4">
        {(Object.entries(counts) as [NodeStatus, number][]).map(([status, count]) => {
          const cfg = STATUS_CONFIG[status];
          return (
            <div key={status} className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ background: cfg.dot }} />
              <span style={{ fontSize: "0.7rem", color: "var(--color-ink-dim)" }}>{count} {cfg.label}</span>
            </div>
          );
        })}
      </div>

      {/* Node grid */}
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 xl:grid-cols-4">
        {filtered.map((node) => {
          const cfg = STATUS_CONFIG[node.status];
          return (
            <div
              key={node.id}
              className="rounded-2xl p-3 transition-all cursor-default group"
              style={{
                background: cfg.bg,
                border: `1px solid ${cfg.color}25`,
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-2">
                <div
                  className="rounded-lg px-2 py-0.5 text-[0.62rem] font-bold uppercase tracking-widest"
                  style={{ background: `${cfg.color}20`, color: cfg.color }}
                >
                  {node.type}
                </div>
                <span
                  className="w-2 h-2 rounded-full"
                  style={{
                    background: cfg.dot,
                    boxShadow: node.status === "operational" ? `0 0 6px ${cfg.dot}` : "none",
                    animation: node.status === "operational" ? "blink 2s ease-in-out infinite" : "none",
                  }}
                />
              </div>
              <p className="font-semibold text-sm mb-1" style={{ color: "var(--color-ink)" }}>{node.name}</p>
              {node.region && (
                <p style={{ fontSize: "0.65rem", color: "var(--color-ink-dim)", marginBottom: "0.5rem" }}>{node.region}</p>
              )}
              {node.status !== "failed" && node.status !== "maintenance" && (
                <>
                  <p style={{ fontSize: "0.65rem", color: "var(--color-ink-dim)", marginBottom: "0.25rem" }}>
                    Latency: <strong style={{ color: cfg.color }}>{node.latency}ms</strong>
                  </p>
                  <p style={{ fontSize: "0.65rem", color: "var(--color-ink-dim)", marginBottom: "0.35rem" }}>Load</p>
                  <LoadBar value={node.load ?? 0} color={cfg.color} />
                </>
              )}
              {(node.status === "failed" || node.status === "maintenance") && (
                <p style={{ fontSize: "0.7rem", color: cfg.color, fontWeight: 600 }}>{cfg.label}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
