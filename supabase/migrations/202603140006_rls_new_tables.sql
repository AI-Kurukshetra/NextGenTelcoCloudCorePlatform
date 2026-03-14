-- Ensures RLS and tenant-isolation policies exist for pending tables.

DO $$
DECLARE
  tbl TEXT;
BEGIN
  FOREACH tbl IN ARRAY ARRAY[
    'billing_exports',
    'billing_invoices',
    'billing_invoice_items',
    'metrics_stream',
    'training_datasets',
    'model_deployments',
    'model_metrics',
    'package_installs',
    'data_access_logs',
    'data_centers',
    'availability_zones',
    'network_links',
    'edge_workloads',
    'mfa_devices',
    'login_attempts',
    'device_sessions',
    'service_accounts',
    'sla_agreements',
    'ztp_workflows',
    'traffic_policies',
    'nf_health',
    'session_qos',
    'imsi_records',
    'imei_devices',
    'tenant_plans'
  ] LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', tbl);
  END LOOP;
END
$$;

DO $$
DECLARE
  tbl TEXT;
BEGIN
  FOREACH tbl IN ARRAY ARRAY[
    'billing_exports',
    'billing_invoices',
    'billing_invoice_items',
    'metrics_stream',
    'training_datasets',
    'model_deployments',
    'model_metrics',
    'package_installs',
    'data_access_logs',
    'data_centers',
    'availability_zones',
    'network_links',
    'edge_workloads',
    'mfa_devices',
    'login_attempts',
    'device_sessions',
    'service_accounts',
    'sla_agreements',
    'ztp_workflows',
    'traffic_policies',
    'nf_health',
    'session_qos',
    'imsi_records',
    'imei_devices'
  ] LOOP
    EXECUTE format('DROP POLICY IF EXISTS tenant_isolation_%I ON public.%I', tbl, tbl);
    EXECUTE format(
      'CREATE POLICY tenant_isolation_%I ON public.%I FOR ALL USING (tenant_id = public.current_tenant_id()) WITH CHECK (tenant_id = public.current_tenant_id())',
      tbl,
      tbl
    );
  END LOOP;
END
$$;

DROP POLICY IF EXISTS tenant_plans_read_all ON public.tenant_plans;
CREATE POLICY tenant_plans_read_all ON public.tenant_plans FOR SELECT USING (TRUE);
