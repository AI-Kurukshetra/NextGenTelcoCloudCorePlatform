"use client";

import { useEffect, useState } from "react";

type StatusComponent = {
  id: string;
  name: string;
  status: string;
};

type Incident = {
  id: string;
  title: string;
  status: string;
  severity?: string;
  created_at?: string;
};

export default function StatusPage() {
  const [components, setComponents] = useState<StatusComponent[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const response = await fetch("/api/public/status", { cache: "no-store" });
        const body = await response.json();
        if (!response.ok) {
          setError(body?.message ?? "Failed to load status.");
          return;
        }
        setComponents(body?.data?.components ?? []);
        setIncidents(body?.data?.recent_incidents ?? []);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Failed to load status.");
      }
    }
    void load();
  }, []);

  return (
    <main className="container py-12">
      <section className="mesh-bg overflow-hidden rounded-[24px] border border-sky-100 p-6 md:p-8">
        <h1 className="text-3xl font-semibold text-slate-900">Platform Status</h1>
        <p className="mt-2 text-slate-700">Live health indicators for API, database, auth, and edge services.</p>

        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {components.length ? (
            components.map((item, index) => (
              <div key={item.id} className={`surface-card fade-in-up delay-${(index % 4) + 1} p-4`}>
                <p className="text-sm font-semibold text-slate-900">{item.name}</p>
                <p className={`mt-1 text-sm ${item.status === "operational" ? "text-emerald-700" : item.status === "degraded" ? "text-amber-700" : "text-rose-700"}`}>
                  {item.status}
                </p>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-500">Loading service status…</p>
          )}
        </div>

        <div className="mt-6">
          <h2 className="text-xl font-semibold text-slate-900">Recent Incidents</h2>
          <div className="mt-3 space-y-2">
            {incidents.length ? (
              incidents.map((incident) => (
                <div key={incident.id} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
                  <p className="font-medium text-slate-800">{incident.title}</p>
                  <p className="text-xs text-slate-500">
                    {incident.status} · {incident.severity ?? "-"} · {incident.created_at ?? "-"}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">No recent incidents.</p>
            )}
          </div>
        </div>

        {error ? <p className="mt-4 text-sm text-rose-700">{error}</p> : null}
      </section>
    </main>
  );
}
