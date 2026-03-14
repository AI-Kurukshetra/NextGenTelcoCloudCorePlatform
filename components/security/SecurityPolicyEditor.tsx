"use client";

import { useState } from "react";

type SecurityPolicy = {
  name: string;
  policy_type: string;
  rules: Record<string, unknown>;
  is_active: boolean;
};

type Props = {
  policy?: SecurityPolicy;
  onSave: (policy: SecurityPolicy) => Promise<void> | void;
};

export function SecurityPolicyEditor({ policy, onSave }: Props) {
  const [name, setName] = useState(policy?.name ?? "");
  const [type, setType] = useState(policy?.policy_type ?? "firewall");
  const [rules, setRules] = useState(JSON.stringify(policy?.rules ?? { allow: [], deny: [] }, null, 2));
  const [active, setActive] = useState(policy?.is_active ?? true);

  return (
    <section className="surface-card p-4">
      <h3 className="text-base font-semibold text-slate-900">Security Policy Editor</h3>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Policy name" className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        <select value={type} onChange={(event) => setType(event.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="firewall">Firewall</option>
          <option value="rate_limit">Rate Limit</option>
          <option value="ip_allowlist">IP Allowlist</option>
          <option value="zero_trust">Zero Trust</option>
          <option value="mtls">mTLS</option>
        </select>
      </div>
      <textarea value={rules} onChange={(event) => setRules(event.target.value)} className="mt-3 min-h-28 w-full rounded-lg border border-slate-200 p-3 font-mono text-xs" />
      <label className="mt-3 flex items-center gap-2 text-sm text-slate-700">
        <input type="checkbox" checked={active} onChange={(event) => setActive(event.target.checked)} />
        Active
      </label>
      <button
        type="button"
        onClick={() =>
          onSave({
            name,
            policy_type: type,
            rules: JSON.parse(rules || "{}"),
            is_active: active,
          })
        }
        className="btn-dark-visible mt-3 px-3 py-1.5 text-sm"
      >
        Save Policy
      </button>
    </section>
  );
}
