import type { Metadata } from "next";
import type { ReactNode } from "react";
import { CookieBanner } from "@/components/landing/CookieBanner";
import { PublicFooter } from "@/components/shared/PublicFooter";
import { PublicHeader } from "@/components/shared/PublicHeader";

export const metadata: Metadata = {
  title: "NGCMCP — Cloud-Native 5G Mobile Core Platform",
  description:
    "Deploy, manage, and scale your 5G/4G mobile core on any cloud with AI automation and real-time observability.",
  openGraph: {
    title: "NGCMCP — Cloud-Native 5G Mobile Core Platform",
    description: "The modern SaaS control plane for 5G core networks.",
    url: "https://ngcmcp.com",
    siteName: "NGCMCP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NGCMCP — Cloud-Native 5G Mobile Core Platform",
    description: "Deploy and manage 5G core NFs from a unified SaaS control plane.",
  },
};

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <PublicHeader />
      <div id="main-content">{children}</div>
      <PublicFooter />
      <CookieBanner />
    </div>
  );
}
