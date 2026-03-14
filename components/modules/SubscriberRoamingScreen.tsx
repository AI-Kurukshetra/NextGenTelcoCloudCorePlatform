"use client";

import { useState } from "react";
import { AppRouteView } from "@/components/shared/AppRouteView";
import { useApi } from "@/hooks/useApi";
import { RoamingEditor } from "@/components/subscribers/RoamingEditor";
import type { RoamingProfile } from "@/types";

type Props = {
  subscriberId: string;
};

export function SubscriberRoamingScreen({ subscriberId }: Props) {
  const profile = useApi<RoamingProfile | null>(`/api/subscribers/${subscriberId}/roaming`);
  const [message, setMessage] = useState("");

  async function save(payload: Partial<RoamingProfile>) {
    setMessage("");
    const response = await fetch(`/api/subscribers/${subscriberId}/roaming`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const body = await response.json();
    if (!response.ok) {
      setMessage(body?.message ?? "Failed to update roaming profile.");
      return;
    }
    setMessage("Roaming profile updated.");
    await profile.refresh();
  }

  return (
    <div className="space-y-4">
      <AppRouteView
        title="Subscriber Roaming"
        description="Manage roaming access and usage limits."
        endpoint={`/api/subscribers/${subscriberId}/roaming`}
        routePath="/app/subscribers/[id]/roaming"
      />
      <RoamingEditor profile={profile.data ?? null} onSave={(payload) => void save(payload)} />
      {message ? <p className="text-sm text-slate-700">{message}</p> : null}
    </div>
  );
}
