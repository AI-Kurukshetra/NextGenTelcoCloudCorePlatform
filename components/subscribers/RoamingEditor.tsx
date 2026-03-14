"use client";

import { useMemo, useState } from "react";
import type { RoamingProfile } from "@/types";

type Props = {
  profile: RoamingProfile | null;
  onSave: (profile: Partial<RoamingProfile>) => Promise<void> | void;
};

const countryOptions = [
  "IN",
  "DE",
  "SG",
  "US",
  "GB",
  "AE",
  "JP",
  "AU",
  "FR",
  "ES",
  "IT",
  "BR",
];

export function RoamingEditor({ profile, onSave }: Props) {
  const [selected, setSelected] = useState<string[]>(profile?.allowed_countries ?? []);
  const [dataLimit, setDataLimit] = useState<number>(profile?.data_limit_mb ?? 1024);
  const [voiceLimit, setVoiceLimit] = useState<number>(profile?.voice_limit_minutes ?? 100);
  const [smsLimit, setSmsLimit] = useState<number>(profile?.sms_limit ?? 100);

  const sorted = useMemo(() => [...countryOptions].sort(), []);

  function toggleCountry(country: string) {
    setSelected((prev) => (prev.includes(country) ? prev.filter((item) => item !== country) : [...prev, country]));
  }

  return (
    <section className="surface-card p-4">
      <h3 className="text-base font-semibold text-slate-900">Roaming Profile</h3>
      <p className="mt-1 text-sm text-slate-600">Select countries and usage limits for roaming control.</p>

      <div className="mt-3 grid gap-2 sm:grid-cols-3">
        {sorted.map((country) => (
          <button
            key={country}
            type="button"
            onClick={() => toggleCountry(country)}
            className={`rounded-lg border px-3 py-1.5 text-sm ${selected.includes(country) ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white text-slate-700"}`}
          >
            {country}
          </button>
        ))}
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <label className="text-sm text-slate-700">
          Data Limit (MB)
          <input
            type="number"
            min={0}
            max={10000}
            value={dataLimit}
            onChange={(event) => setDataLimit(Number(event.target.value))}
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
          />
        </label>
        <label className="text-sm text-slate-700">
          Voice Limit (min)
          <input
            type="number"
            min={0}
            value={voiceLimit}
            onChange={(event) => setVoiceLimit(Number(event.target.value))}
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
          />
        </label>
        <label className="text-sm text-slate-700">
          SMS Limit
          <input
            type="number"
            min={0}
            value={smsLimit}
            onChange={(event) => setSmsLimit(Number(event.target.value))}
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
          />
        </label>
      </div>

      <button
        type="button"
        onClick={() =>
          onSave({
            allowed_countries: selected,
            data_limit_mb: dataLimit,
            voice_limit_minutes: voiceLimit,
            sms_limit: smsLimit,
          })
        }
        className="btn-dark-visible mt-4 px-3 py-1.5 text-sm"
      >
        Save Roaming Policy
      </button>
    </section>
  );
}
