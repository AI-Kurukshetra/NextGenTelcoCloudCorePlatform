"use client";

import { useState } from "react";

type Payload = {
  requester_email: string;
  request_type: "access" | "deletion" | "portability";
  subscriber_id?: string;
};

type Props = {
  onSubmit: (payload: Payload) => Promise<void> | void;
};

export function GDPRRequestForm({ onSubmit }: Props) {
  const [email, setEmail] = useState("");
  const [requestType, setRequestType] = useState<Payload["request_type"]>("access");
  const [subscriberId, setSubscriberId] = useState("");

  return (
    <section className="surface-card p-4">
      <h3 className="text-base font-semibold text-slate-900">GDPR Request</h3>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="requester@example.com" className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        <select value={requestType} onChange={(event) => setRequestType(event.target.value as Payload["request_type"])} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="access">Access</option>
          <option value="deletion">Deletion</option>
          <option value="portability">Portability</option>
        </select>
      </div>
      <input value={subscriberId} onChange={(event) => setSubscriberId(event.target.value)} placeholder="Subscriber UUID (optional)" className="mt-3 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
      <button
        type="button"
        onClick={() => onSubmit({ requester_email: email, request_type: requestType, subscriber_id: subscriberId || undefined })}
        className="btn-dark-visible mt-3 px-3 py-1.5 text-sm"
      >
        Submit GDPR Request
      </button>
    </section>
  );
}
