import { EdgeNodeList } from "@/components/edge/EdgeNodeList";
import { AppRouteView } from "@/components/shared/AppRouteView";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EdgeClusterDetailPage({ params }: Props) {
  const { id } = await params;

  return (
    <section className="space-y-4">
      <AppRouteView
        title="Edge Cluster Detail"
        description="Inspect edge cluster health and runtime context."
        endpoint={`/api/edge/clusters/${id}`}
        routePath={`/app/edge/${id}`}
      />

      <section className="surface-card p-4">
        <h2 className="text-base font-semibold text-slate-900">Nodes</h2>
        <div className="mt-3">
          <EdgeNodeList clusterId={id} />
        </div>
      </section>
    </section>
  );
}
