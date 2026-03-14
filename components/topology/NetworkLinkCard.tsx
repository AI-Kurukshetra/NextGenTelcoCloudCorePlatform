import type { NetworkLink } from "@/types";
import { StatusBadge } from "@/components/ui/StatusBadge";

type Props = {
  link: NetworkLink;
  sourceName?: string;
  targetName?: string;
};

export function NetworkLinkCard({ link, sourceName, targetName }: Props) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-semibold text-slate-900">
          {sourceName ?? link.source_region_id ?? link.source_data_center_id ?? "Source"} →{" "}
          {targetName ?? link.target_region_id ?? link.target_data_center_id ?? "Target"}
        </p>
        <StatusBadge status={link.status} />
      </div>
      <p className="mt-1 text-xs text-slate-500">
        {link.link_type ?? "link"} · {(link.bandwidth_gbps ?? (link.bandwidth_mbps ? link.bandwidth_mbps / 1000 : null)) ?? "-"} Gbps ·{" "}
        {link.latency_ms ?? "-"} ms
      </p>
    </article>
  );
}
