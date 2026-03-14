import { AdminTenantDetailScreen } from "@/components/modules/AdminTenantDetailScreen";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function AdminTenantDetailPage({ params }: Props) {
  const { id } = await params;
  return <AdminTenantDetailScreen tenantId={id} />;
}
