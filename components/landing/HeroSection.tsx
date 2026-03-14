import Image from "next/image";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="container pt-10 pb-12">
      <div className="mesh-bg relative overflow-hidden rounded-[26px] border border-sky-100 p-7 shadow-[0_32px_74px_-58px_rgba(8,47,73,0.85)] md:p-10">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="fade-in-up space-y-6">
            <p className="inline-flex rounded-full border border-sky-200 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-800">
              Cloud-Native Telecom Core
            </p>
            <h1 className="text-4xl font-bold leading-tight text-slate-900 md:text-5xl">
              Cloud-Native 5G Core.
              <br />
              Built for Modern CSPs.
            </h1>
            <p className="max-w-2xl text-lg text-slate-700">
              Deploy, manage, monitor, and monetize your 4G/5G mobile core with real-time observability, policy automation, and multi-cloud orchestration.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/signup" className="btn-dark-visible px-5 py-3 text-sm">
                Start Free Trial
              </Link>
              <Link href="/contact" className="btn-surface px-5 py-3 text-sm">
                Book a Demo
              </Link>
            </div>
            <div className="grid gap-2 sm:grid-cols-3">
              <div className="kpi-tile fade-in-up delay-1">
                <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Availability</p>
                <p className="mt-1 text-xl font-semibold text-slate-900">99.99%</p>
              </div>
              <div className="kpi-tile fade-in-up delay-2">
                <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Live Sessions</p>
                <p className="mt-1 text-xl font-semibold text-slate-900">1.24M</p>
              </div>
              <div className="kpi-tile fade-in-up delay-3">
                <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Alerts MTTR</p>
                <p className="mt-1 text-xl font-semibold text-slate-900">8m</p>
              </div>
            </div>
          </div>

          <div className="fade-in-up delay-2">
            <div className="image-frame float-y">
              <Image
                src="/visuals/telecom-hero.svg"
                alt="NGCMCP dashboard and network intelligence visual"
                width={1200}
                height={760}
                className="h-full w-full object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
