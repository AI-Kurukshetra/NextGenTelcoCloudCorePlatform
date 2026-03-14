import { IncidentDetail } from "@/components/faults/IncidentDetail";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function FaultIncidentDetailPage({ params }: Props) {
  const { id } = await params;
  return <IncidentDetail incidentId={id} />;
}
