const tiers = [
  {
    name: "Starter",
    value: "$999/mo",
    caps: "Up to 10K subscribers",
    extras: "10 NFs, 5 slices",
  },
  {
    name: "Growth",
    value: "$4,999/mo",
    caps: "Up to 100K subscribers",
    extras: "50 NFs, 25 slices",
  },
  {
    name: "Enterprise",
    value: "Custom",
    caps: "Unlimited scale",
    extras: "Dedicated support + custom roadmap",
  },
];

export function PricingSection() {
  return (
    <section className="container pb-12">
      <h2 className="text-2xl font-semibold text-slate-900">Pricing</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        {tiers.map((tier) => (
          <div key={tier.name} className="surface-card p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">{tier.name}</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{tier.value}</p>
            <p className="mt-2 text-sm text-slate-700">{tier.caps}</p>
            <p className="text-sm text-slate-500">{tier.extras}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
