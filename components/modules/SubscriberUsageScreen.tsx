"use client";

import { AppRouteView } from "@/components/shared/AppRouteView";
import { UsageChart } from "@/components/subscribers/UsageChart";

type Props = {
  subscriberId: string;
};

export function SubscriberUsageScreen({ subscriberId }: Props) {
  return (
    <div className="space-y-4">
      <AppRouteView
        title="Subscriber Usage"
        description="Daily traffic and charging trend for this subscriber."
        endpoint={`/api/subscribers/${subscriberId}/usage`}
        routePath="/app/subscribers/[id]/usage"
      />
      <UsageChart subscriberId={subscriberId} />
    </div>
  );
}
