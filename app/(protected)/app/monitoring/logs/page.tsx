import { AppRouteView } from "@/components/shared/AppRouteView";

export default function MonitoringLogsPage() {
  return (
    <AppRouteView
      title="Log Explorer"
      description="Filter and inspect distributed platform logs."
      endpoint="/api/monitoring/logs"
      routePath="/app/monitoring/logs"
    />
  );
}
