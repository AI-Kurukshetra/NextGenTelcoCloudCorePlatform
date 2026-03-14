import { AppRouteView } from "@/components/shared/AppRouteView";

export default function AIModelsPage() {
  return (
    <AppRouteView
      title="Model Registry"
      description="Track model versions, artifacts, and deployment state."
      endpoint="/api/ai/models"
      routePath="/app/ai/models"
    />
  );
}
