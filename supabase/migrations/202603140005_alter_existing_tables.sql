-- Adds additional pending columns required by API/UI flows.

ALTER TABLE public.network_functions
  ADD COLUMN IF NOT EXISTS helm_release_name TEXT,
  ADD COLUMN IF NOT EXISTS namespace TEXT DEFAULT 'ngcmcp';

ALTER TABLE public.network_slices
  ADD COLUMN IF NOT EXISTS sst INT,
  ADD COLUMN IF NOT EXISTS sd TEXT;

ALTER TABLE public.sessions
  ADD COLUMN IF NOT EXISTS amf_ue_ngap_id BIGINT,
  ADD COLUMN IF NOT EXISTS ran_ue_ngap_id BIGINT;

ALTER TABLE public.subscribers
  ADD COLUMN IF NOT EXISTS suspension_reason TEXT,
  ADD COLUMN IF NOT EXISTS notes TEXT;

ALTER TABLE public.alarms
  ADD COLUMN IF NOT EXISTS managed_object_class TEXT,
  ADD COLUMN IF NOT EXISTS managed_object_instance TEXT,
  ADD COLUMN IF NOT EXISTS event_type TEXT DEFAULT 'equipment_alarm';

ALTER TABLE public.cdr_records
  ADD COLUMN IF NOT EXISTS visited_network TEXT,
  ADD COLUMN IF NOT EXISTS cause_for_record_closing TEXT;

ALTER TABLE public.edge_clusters
  ADD COLUMN IF NOT EXISTS api_server_url TEXT,
  ADD COLUMN IF NOT EXISTS tls_ca_cert_ref TEXT;

ALTER TABLE public.performance_metrics
  ALTER COLUMN labels SET DEFAULT '{}'::jsonb;

CREATE INDEX IF NOT EXISTS idx_perf_metrics_labels ON public.performance_metrics USING GIN(labels);
