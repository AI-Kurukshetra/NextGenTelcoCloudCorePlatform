import { redirect } from "next/navigation";
import { MFASetup } from "@/components/auth/MFASetup";
import { SSOButton } from "@/components/auth/SSOButton";
import { AdminTenantDetailScreen } from "@/components/modules/AdminTenantDetailScreen";
import { AdminScreen } from "@/components/modules/AdminScreen";
import { AIAnomaliesScreen } from "@/components/modules/AIAnomaliesScreen";
import { AIPredictionsScreen } from "@/components/modules/AIPredictionsScreen";
import { AIScreen } from "@/components/modules/AIScreen";
import { BillingInvoiceDetailScreen } from "@/components/modules/BillingInvoiceDetailScreen";
import { BillingInvoicesScreen } from "@/components/modules/BillingInvoicesScreen";
import { BillingScreen } from "@/components/modules/BillingScreen";
import { ConfigurationsScreen } from "@/components/modules/ConfigurationsScreen";
import { DashboardScreen } from "@/components/modules/DashboardScreen";
import { DigitalTwinScreen } from "@/components/modules/DigitalTwinScreen";
import { MonitoringScreen } from "@/components/modules/MonitoringScreen";
import { NetworkFunctionsScreen } from "@/components/modules/NetworkFunctionsScreen";
import { OrchestrationScreen } from "@/components/modules/OrchestrationScreen";
import { SecurityScreen } from "@/components/modules/SecurityScreen";
import { SettingsScreen } from "@/components/modules/SettingsScreen";
import { SubscriberRoamingScreen } from "@/components/modules/SubscriberRoamingScreen";
import { SubscriberUsageScreen } from "@/components/modules/SubscriberUsageScreen";
import { SubscribersScreen } from "@/components/modules/SubscribersScreen";
import { TopologyScreen } from "@/components/modules/TopologyScreen";
import { ZTPWorkflowsScreen } from "@/components/modules/ZTPWorkflowsScreen";
import { AppRouteView } from "@/components/shared/AppRouteView";
import { ApiKeyManager } from "@/components/shared/ApiKeyManager";
import { BillingExportPanel } from "@/components/shared/BillingExportPanel";
import { IntentConsole } from "@/components/shared/IntentConsole";
import { appRouteRegistry, fallbackRouteMeta } from "@/lib/app-routes";

type Props = {
  params: Promise<{ slug?: string[] }>;
};

function resolveMeta(slug: string[]) {
  const fullPath = `/app/${slug.join("/")}`;

  if (appRouteRegistry[fullPath]) {
    return { meta: appRouteRegistry[fullPath], fullPath };
  }

  if (slug.length > 1) {
    const dynamicPath = `/app/${slug.slice(0, -1).join("/")}/[id]`;
    if (appRouteRegistry[dynamicPath]) {
      return { meta: appRouteRegistry[dynamicPath], fullPath };
    }
  }

  return { meta: fallbackRouteMeta, fullPath };
}

function resolveEndpoint(endpoint: string | undefined, slug: string[]) {
  if (!endpoint) return undefined;
  if (!endpoint.includes("[id]")) return endpoint;
  const id = slug.at(-1);
  return id ? endpoint.replace("[id]", id) : undefined;
}

export default async function ProtectedRoutePage({ params }: Props) {
  const { slug = [] } = await params;

  if (!slug.length) {
    redirect("/app/dashboard");
  }

  const section = slug[0];
  const isRootSection = slug.length === 1;

  const { meta, fullPath } = resolveMeta(slug);
  const endpoint = resolveEndpoint(meta.endpoint, slug);

  const specialScreens = {
    dashboard: section === "dashboard" && isRootSection ? <DashboardScreen /> : null,
    networkFunctions: section === "network-functions" && isRootSection ? <NetworkFunctionsScreen /> : null,
    subscribers: section === "subscribers" && isRootSection ? <SubscribersScreen /> : null,
    monitoring: section === "monitoring" && isRootSection ? <MonitoringScreen /> : null,
    billing: section === "billing" && isRootSection ? <BillingScreen /> : null,
    admin: section === "admin" && isRootSection ? <AdminScreen /> : null,
    ai: section === "ai" && isRootSection ? <AIScreen /> : null,
    security: section === "security" && isRootSection ? <SecurityScreen /> : null,
    orchestration: section === "orchestration" && isRootSection ? <OrchestrationScreen /> : null,
    settings: section === "settings" && isRootSection ? <SettingsScreen /> : null,
  };

  const customScreen =
    (fullPath === "/app/topology" ? <TopologyScreen /> : null) ??
    (fullPath === "/app/configurations" ? <ConfigurationsScreen /> : null) ??
    (fullPath === "/app/ai/digital-twin" ? <DigitalTwinScreen /> : null) ??
    (fullPath === "/app/ai/predictions" ? <AIPredictionsScreen /> : null) ??
    (fullPath === "/app/ai/anomalies" ? <AIAnomaliesScreen /> : null) ??
    (fullPath === "/app/billing/invoices" ? <BillingInvoicesScreen /> : null) ??
    (slug[0] === "billing" && slug[1] === "invoices" && slug[2] ? <BillingInvoiceDetailScreen invoiceId={slug[2]} /> : null) ??
    (slug[0] === "subscribers" && slug[1] && slug[2] === "roaming" ? <SubscriberRoamingScreen subscriberId={slug[1]} /> : null) ??
    (slug[0] === "subscribers" && slug[1] && slug[2] === "usage" ? <SubscriberUsageScreen subscriberId={slug[1]} /> : null) ??
    (slug[0] === "admin" && slug[1] === "tenants" && slug[2] ? <AdminTenantDetailScreen tenantId={slug[2]} /> : null) ??
    (fullPath === "/app/orchestration/ztp" ? <ZTPWorkflowsScreen /> : null) ??
    specialScreens.dashboard ??
    specialScreens.networkFunctions ??
    specialScreens.subscribers ??
    specialScreens.monitoring ??
    specialScreens.billing ??
    specialScreens.admin ??
    specialScreens.ai ??
    specialScreens.security ??
    specialScreens.orchestration ??
    specialScreens.settings;

  return (
    <div className="space-y-4">
      {customScreen ?? <AppRouteView title={meta.title} description={meta.description} endpoint={endpoint} createHref={meta.createHref} routePath={fullPath} />}

      {fullPath === "/app/ai/intent" ? <IntentConsole /> : null}
      {fullPath === "/app/settings/api-keys" ? <ApiKeyManager /> : null}
      {fullPath === "/app/billing/exports" ? <BillingExportPanel /> : null}
      {fullPath === "/app/settings/mfa" ? <MFASetup title="Multi-Factor Authentication" /> : null}
      {fullPath === "/app/settings/sso" ? <SSOButton title="Configure SAML / OAuth SSO" /> : null}
    </div>
  );
}
