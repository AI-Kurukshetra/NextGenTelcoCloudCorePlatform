import { StatusBadge } from "@/components/ui/StatusBadge";

type Cluster = {
  id: string;
  name: string;
  region_id?: string | null;
  node_count?: number | null;
  status: string;
  last_heartbeat?: string | null;
};

type Props = {
  cluster: Cluster;
};

export function EdgeClusterCard({ cluster }: Props) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-slate-900">{cluster.name}</h3>
        <StatusBadge status={cluster.status} />
      </div>
      <p className="mt-1 text-xs text-slate-500">Region: {cluster.region_id ?? "n/a"}</p>
      <p className="text-xs text-slate-500">Nodes: {cluster.node_count ?? 0}</p>
      <p className="text-xs text-slate-500">Heartbeat: {cluster.last_heartbeat ?? "-"}</p>
    </article>
  );
}
