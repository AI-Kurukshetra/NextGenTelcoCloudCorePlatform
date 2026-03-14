import Link from "next/link";

export function CTASection() {
  return (
    <section className="container pb-8">
      <div className="dark-mesh relative overflow-hidden rounded-[24px] border border-sky-900/50 p-8 text-white">
        <h2 className="text-3xl font-semibold">Ready to modernize your core?</h2>
        <p className="mt-2 max-w-2xl text-slate-200">
          Get production-ready cloud-native core operations with secure multi-tenant architecture and API-first workflows.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/signup" className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-900">
            Get Started
          </Link>
          <Link href="/contact" className="rounded-xl border border-white/40 px-5 py-3 text-sm font-semibold text-white">
            Talk to Sales
          </Link>
        </div>
      </div>
    </section>
  );
}
