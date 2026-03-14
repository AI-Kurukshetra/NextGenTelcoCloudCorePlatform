export type Role =
  | "super_admin"
  | "tenant_admin"
  | "network_engineer"
  | "billing_manager"
  | "readonly_viewer"
  | "api_service";

export type TenantScopedRecord = {
  id: string;
  tenant_id: string;
  created_at?: string;
  updated_at?: string;
};

export type ApiEnvelope<T> = {
  ok: boolean;
  message?: string;
  data?: T;
  error?: {
    code: string;
    details?: unknown;
  };
};

export type SessionContext = {
  userId: string | null;
  tenantId: string | null;
  role: Role;
  email: string | null;
};

export type DashboardSnapshot = {
  subscribers: number;
  networkFunctions: number;
  sessions: number;
  activeAlarms: number;
  averageLatencyMs: number;
  throughputMbps: number;
};

export type NavItem = {
  title: string;
  href: string;
  description?: string;
  /** Hide from nav unless user has admin access (tenant_admin or super_admin) */
  adminOnly?: boolean;
};

export type PlatformFeature = {
  title: string;
  description: string;
  href: string;
  api?: string[];
};

export interface RoamingProfile {
  id: string;
  tenant_id: string;
  subscriber_id: string;
  allowed_countries: string[];
  data_limit_mb: number | null;
  voice_limit_minutes: number | null;
  sms_limit?: number | null;
  roaming_tier?: "standard" | "premium" | "none";
  created_at: string;
  updated_at: string;
}

export interface OrchestrationJob {
  id: string;
  tenant_id: string;
  job_type: string;
  target_type: string | null;
  target_id: string | null;
  payload: Record<string, unknown>;
  status: "queued" | "running" | "completed" | "failed" | "cancelled" | string;
  result?: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface AnomalyAlert {
  id: string;
  tenant_id: string;
  entity_type: string;
  entity_id: string;
  anomaly_type: string;
  severity: "info" | "warning" | "critical" | string;
  score: number | null;
  details: Record<string, unknown> | null;
  detected_at: string;
}

export interface AiPrediction {
  id: string;
  tenant_id: string;
  prediction_type: string;
  entity_type: string;
  entity_id: string;
  predicted_value: number | null;
  confidence: number | null;
  predicted_for: string | null;
  metadata: Record<string, unknown> | null;
}

export interface NetworkLink {
  id: string;
  source_data_center_id?: string | null;
  target_data_center_id?: string | null;
  source_region_id?: string | null;
  target_region_id?: string | null;
  link_type?: string;
  bandwidth_mbps?: number | null;
  bandwidth_gbps?: number | null;
  latency_ms?: number | null;
  status: "active" | "degraded" | "down" | string;
  created_at?: string;
  last_checked_at?: string | null;
}

export interface TopologyMapData {
  regions: Array<{ id: string; name: string; code: string; cloud_provider: string; country: string }>;
  data_centers: Array<{ id: string; region_id: string; name: string; latitude?: number; longitude?: number }>;
  links: NetworkLink[];
  network_functions: Array<{ id: string; name: string; nf_type: string; status: string; region_id?: string | null }>;
  edge_clusters: Array<{ id: string; name: string; region_id?: string | null; status: string; node_count?: number }>;
}

export interface Invoice {
  id: string;
  tenant_id: string;
  invoice_number: string;
  period_start: string;
  period_end: string;
  subtotal: number;
  tax: number;
  total: number;
  currency: string;
  status: string;
  generated_at: string;
}
