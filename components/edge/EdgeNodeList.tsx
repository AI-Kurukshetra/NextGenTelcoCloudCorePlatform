"use client";

import { useApi } from "@/hooks/useApi";
import { asText, extractItems } from "@/components/modules/module-utils";
import { StatusBadge } from "@/components/ui/StatusBadge";

type Props = {
  clusterId: string;
};

export function EdgeNodeList({ clusterId }: Props) {
  const { data } = useApi<unknown>(`/api/edge/clusters/${clusterId}/nodes`);
  const rows = extractItems(data);

  return (
    <div className="space-y-2">
      {rows.length ? (
        rows.map((row) => (
          <div key={asText(row.id)} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
            <div className="flex items-center justify-between gap-2">
              <p className="font-medium text-slate-800">{asText(row.hostname, asText(row.id))}</p>
              <StatusBadge status={asText(row.status, "offline")} />
            </div>
            <p className="text-xs text-slate-500">
              IP: {asText(row.ip_address, "-")} · CPU: {asText(row.cpu_cores, "-")} · Memory: {asText(row.memory_gb, "-")} GB
            </p>
          </div>
        ))
      ) : (
        <p className="text-sm text-slate-500">No edge nodes found.</p>
      )}
    </div>
  );
}
