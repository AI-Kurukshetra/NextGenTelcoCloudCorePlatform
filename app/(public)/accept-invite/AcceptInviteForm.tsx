"use client";

import { type FormEvent, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

export function AcceptInviteForm() {
  const params = useSearchParams();
  const router = useRouter();
  const token = useMemo(() => params.get("token") ?? "", [params]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function acceptInvite(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch(`/api/admin/users/invite/${token}/accept`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          full_name: fullName || undefined,
        }),
      });
      const body = await response.json();
      if (!response.ok) {
        setMessage(body?.message ?? "Failed to accept invite.");
        setLoading(false);
        return;
      }
      setMessage("Invite accepted. Redirecting to dashboard...");
      setTimeout(() => router.push("/app/dashboard"), 1200);
    } catch (acceptError) {
      setMessage(acceptError instanceof Error ? acceptError.message : "Failed to accept invite.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container py-12">
      <section className="mesh-bg mx-auto max-w-xl rounded-[24px] border border-sky-100 p-6 md:p-8">
        <h1 className="text-3xl font-semibold text-slate-900">Accept Invitation</h1>
        <p className="mt-2 text-sm text-slate-700">Complete setup to join your tenant workspace.</p>

        <form className="mt-6 space-y-3" onSubmit={acceptInvite}>
          <input value={token} readOnly className="w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-2 text-sm text-slate-600" />
          <input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email" className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2" />
          <input required type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password (min 8 chars)" className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2" />
          <input value={fullName} onChange={(event) => setFullName(event.target.value)} placeholder="Full name (optional)" className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2" />
          <button disabled={loading || !token} className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">
            {loading ? "Accepting..." : "Accept Invite"}
          </button>
        </form>

        {message ? <p className="mt-3 text-sm text-slate-700">{message}</p> : null}
      </section>
    </main>
  );
}
