"use client";

import { AppRouteView } from "@/components/shared/AppRouteView";
import { useApi } from "@/hooks/useApi";
import { TopologyMap } from "@/components/topology/TopologyMap";
import { NetworkLinkCard } from "@/components/topology/NetworkLinkCard";
import type { TopologyMapData } from "@/types";

export function TopologyScreen() {
  const topology = useApi<TopologyMapData>("/api/topology/map");
  const data = topology.data;

  return (
    <div className="space-y-4">
      <AppRouteView
        title="Topology"
        description="Interactive map of regions, links, network functions, and edge clusters."
        endpoint="/api/topology/map"
        routePath="/app/topology"
      />

      {data ? <TopologyMap data={data} /> : <p className="text-sm text-slate-500">Loading topology map…</p>}

      <section className="surface-card p-4">
        <h3 className="text-base font-semibold text-slate-900">Network Links</h3>
        <div className="mt-3 grid gap-2">
          {(data?.links ?? []).length ? (
            data?.links.map((link) => <NetworkLinkCard key={link.id} link={link} />)
          ) : (
            <p className="text-sm text-slate-500">No topology links available.</p>
          )}
        </div>
      </section>
    </div>
  );
}
