import { AlarmDetail } from "@/components/faults/AlarmDetail";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function FaultAlarmDetailPage({ params }: Props) {
  const { id } = await params;
  return <AlarmDetail alarmId={id} />;
}
