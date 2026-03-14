import { SubscriberUsageScreen } from "@/components/modules/SubscriberUsageScreen";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function SubscriberUsagePage({ params }: Props) {
  const { id } = await params;
  return <SubscriberUsageScreen subscriberId={id} />;
}
