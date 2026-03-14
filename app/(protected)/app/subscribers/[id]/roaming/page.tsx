import { SubscriberRoamingScreen } from "@/components/modules/SubscriberRoamingScreen";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function SubscriberRoamingPage({ params }: Props) {
  const { id } = await params;
  return <SubscriberRoamingScreen subscriberId={id} />;
}
