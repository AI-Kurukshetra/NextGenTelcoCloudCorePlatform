import { BillingInvoiceDetailScreen } from "@/components/modules/BillingInvoiceDetailScreen";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function BillingInvoiceDetailPage({ params }: Props) {
  const { id } = await params;
  return <BillingInvoiceDetailScreen invoiceId={id} />;
}
