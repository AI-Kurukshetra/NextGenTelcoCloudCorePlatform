"use client";

import { useMemo, useState } from "react";
import type { TopologyMapData } from "@/types";
import { StatusBadge } from "@/components/ui/StatusBadge";

type Props = {
  data: TopologyMapData;
};

type Point = { x: number; y: number };

export function TopologyMap({ data }: Props) {
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(data.regions[0]?.id ?? null);

  const points = useMemo(() => {
    const map = new Map<string, Point>();
    const total = Math.max(1, data.regions.length);
    data.regions.forEach((region, index) => {
      const angle = (index / total) * Math.PI * 2;
      map.set(region.id, {
        x: 380 + Math.cos(angle) * 230,
        y: 200 + Math.sin(angle) * 140,
      });
    });
    return map;
  }, [data.regions]);

  const dcToRegion = useMemo(() => {
    return new Map(data.data_centers.map((dc) => [dc.id, dc.region_id]));
  }, [data.data_centers]);

  const selectedRegion = data.regions.find((region) => region.id === selectedRegionId) ?? null;
  const selectedNf = data.network_functions.filter((nf) => nf.region_id === selectedRegionId);
  const selectedClusters = data.edge_clusters.filter((cluster) => cluster.region_id === selectedRegionId);

  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_300px]">
      <div className="surface-card overflow-hidden p-3 md:p-4">
        <svg viewBox="0 0 760 420" className="h-[420px] w-full rounded-xl bg-[radial-gradient(circle_at_10%_10%,rgba(59,130,246,0.15),transparent_35%),linear-gradient(180deg,#0c1320_0%,#101f35_100%)]">
          <defs>
            <linearGradient id="topology-link" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.8" />
            </linearGradient>
          </defs>

          {data.links.map((link) => {
            const srcRegionId = link.source_region_id ?? (link.source_data_center_id ? dcToRegion.get(link.source_data_center_id) : null);
            const dstRegionId = link.target_region_id ?? (link.target_data_center_id ? dcToRegion.get(link.target_data_center_id) : null);
            const src = points.get(srcRegionId ?? "");
            const dst = points.get(dstRegionId ?? "");
            if (!src || !dst) return null;
            const color =
              link.status === "down" ? "#ef4444" : link.status === "degraded" ? "#f59e0b" : "url(#topology-link)";
            return (
              <line
                key={link.id}
                x1={src.x}
                y1={src.y}
                x2={dst.x}
                y2={dst.y}
                stroke={color}
                strokeWidth={2.5}
                strokeDasharray={link.status === "degraded" ? "7 5" : undefined}
                opacity={0.9}
              />
            );
          })}

          {data.regions.map((region) => {
            const point = points.get(region.id);
            if (!point) return null;
            const selected = region.id === selectedRegionId;
            return (
              <g key={region.id} onClick={() => setSelectedRegionId(region.id)} className="cursor-pointer">
                <circle
                  cx={point.x}
                  cy={point.y}
                  r={selected ? 22 : 18}
                  fill={selected ? "#22d3ee" : "#1d4ed8"}
                  opacity={selected ? 1 : 0.85}
                />
                <text x={point.x} y={point.y - 30} textAnchor="middle" fill="#dbeafe" fontSize={11} fontWeight={600}>
                  {region.name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <aside className="surface-card p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Region Detail</p>
        {selectedRegion ? (
          <>
            <h3 className="mt-1 text-base font-semibold text-slate-900">{selectedRegion.name}</h3>
            <p className="text-xs text-slate-600">
              {selectedRegion.cloud_provider} · {selectedRegion.country} · {selectedRegion.code}
            </p>

            <div className="mt-3 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Network Functions</p>
              {selectedNf.length ? (
                selectedNf.map((nf) => (
                  <div key={nf.id} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium text-slate-800">{nf.name}</p>
                      <StatusBadge status={nf.status} />
                    </div>
                    <p className="text-xs text-slate-500">{nf.nf_type}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500">No NFs in this region.</p>
              )}
            </div>

            <div className="mt-3 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Edge Clusters</p>
              {selectedClusters.length ? (
                selectedClusters.map((cluster) => (
                  <div key={cluster.id} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium text-slate-800">{cluster.name}</p>
                      <StatusBadge status={cluster.status} />
                    </div>
                    <p className="text-xs text-slate-500">Nodes: {cluster.node_count ?? 0}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500">No clusters in this region.</p>
              )}
            </div>
          </>
        ) : (
          <p className="mt-2 text-sm text-slate-500">Select a region to inspect details.</p>
        )}
      </aside>
    </div>
  );
}
