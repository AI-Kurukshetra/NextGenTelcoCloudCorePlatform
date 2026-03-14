import Image from "next/image";

const useCases = [
  "Enterprise Private 5G",
  "IoT Connectivity and Massive Sensor Fleets",
  "URLLC for Industrial Automation",
  "eMBB for Broadband Expansion",
];

const differentiators = [
  "Born cloud-native architecture",
  "AI-first control loops",
  "Open package marketplace",
  "Intent-Based Networking workflows",
];

export function UseCasesSection() {
  return (
    <section className="container pb-12">
      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="surface-card p-5">
          <h2 className="text-2xl font-semibold text-slate-900">Architecture Overview</h2>
          <p className="mt-2 text-sm text-slate-600">
            Service-based telecom core architecture built on Kubernetes microservices with observability, policy, and billing layers integrated.
          </p>
          <div className="image-frame mt-4">
            <Image
              src="/visuals/telecom-architecture.svg"
              alt="Microservices architecture for AMF, SMF, UPF, PCF and orchestration"
              width={1200}
              height={780}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
        <div className="space-y-4">
          <div className="surface-card p-5">
            <h3 className="text-lg font-semibold text-slate-900">Use Cases</h3>
            <div className="mt-3 grid gap-2">
              {useCases.map((item) => (
                <div key={item} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="surface-card p-5">
            <h3 className="text-lg font-semibold text-slate-900">Differentiators</h3>
            <div className="mt-3 grid gap-2">
              {differentiators.map((item) => (
                <div key={item} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
