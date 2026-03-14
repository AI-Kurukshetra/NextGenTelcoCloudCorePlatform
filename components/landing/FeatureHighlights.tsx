const highlights = [
  {
    title: "5G Standalone Core",
    detail: "AMF, SMF, UPF, PCF, UDM, AUSF, NRF, NSSF with cloud-native lifecycle controls.",
  },
  {
    title: "Network Slicing",
    detail: "Design eMBB, URLLC, and IoT slices with policy and subscriber assignment controls.",
  },
  {
    title: "AI-Powered Optimization",
    detail: "Intent-based automation, anomaly surfacing, and predictive maintenance recommendations.",
  },
  {
    title: "Multi-Cloud Deployment",
    detail: "Operate across AWS, Azure, GCP, on-prem, and edge clusters from one control plane.",
  },
  {
    title: "Real-Time Analytics",
    detail: "Live metrics, alarms, traces, and audit context for NOC and network engineering teams.",
  },
  {
    title: "Zero-Touch Provisioning",
    detail: "Automated deployment pipelines for CNF/VNF rollout and self-heal orchestration.",
  },
];

export function FeatureHighlights() {
  return (
    <section className="container pb-12">
      <h2 className="text-2xl font-semibold text-slate-900">Feature Highlights</h2>
      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {highlights.map((item, idx) => (
          <article key={item.title} className={`surface-card lift-card p-4 fade-in-up delay-${(idx % 4) + 1}`}>
            <p className="text-base font-semibold text-slate-900">{item.title}</p>
            <p className="mt-1 text-sm text-slate-600">{item.detail}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
