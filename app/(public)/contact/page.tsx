"use client";

import Image from "next/image";
import { type FormEvent, useState } from "react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  async function submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await fetch("/api/public/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, company, phone, message }),
      });
      const body = await response.json();
      if (!response.ok) {
        setError(body?.message ?? "Failed to submit request.");
        setLoading(false);
        return;
      }
      setSubmitted(true);
      setName("");
      setEmail("");
      setCompany("");
      setPhone("");
      setMessage("");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Failed to submit request.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container py-12">
      <section className="mesh-bg overflow-hidden rounded-[24px] border border-sky-100 p-6 md:p-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_0.95fr]">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900 md:text-4xl">Book a Demo</h1>
            <p className="mt-2 text-slate-700">Share your telecom modernization goals and we will prepare a product walkthrough tailored to your architecture.</p>

            <form className="mt-6 space-y-3" onSubmit={submitForm}>
              <input required value={name} onChange={(event) => setName(event.target.value)} placeholder="Full Name" className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2" />
              <input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Work Email" className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2" />
              <input required value={company} onChange={(event) => setCompany(event.target.value)} placeholder="Company" className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2" />
              <input value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="Phone (optional)" className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2" />
              <textarea value={message} onChange={(event) => setMessage(event.target.value)} placeholder="What are you looking to modernize?" className="min-h-28 w-full rounded-xl border border-slate-200 bg-white px-4 py-2" />
              <button disabled={loading} className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
                {loading ? "Submitting..." : "Submit"}
              </button>
            </form>
            {submitted ? <p className="mt-3 text-sm text-emerald-700">Thanks. Demo request received.</p> : null}
            {error ? <p className="mt-3 text-sm text-rose-700">{error}</p> : null}
          </div>

          <div className="image-frame float-y-slow">
            <Image src="/visuals/telecom-hero.svg" alt="Product demo visual" width={1200} height={760} className="h-full w-full object-cover" />
          </div>
        </div>
      </section>
    </main>
  );
}
