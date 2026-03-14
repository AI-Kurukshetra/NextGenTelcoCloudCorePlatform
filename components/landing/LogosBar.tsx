const logos = ["Orion Telecom", "NovaCore", "BlueWave CSP", "EdgeCarrier", "Metro5G", "SkySpan Mobile"];

export function LogosBar() {
  return (
    <section className="container pb-12">
      <p className="mb-3 text-center text-sm font-medium text-slate-500">Trusted by operators in 20+ countries</p>
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white py-3">
        <div className="marquee-track">
          {[...logos, ...logos].map((logo, index) => (
            <div key={`${logo}-${index}`} className="mx-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5 text-sm text-slate-700">
              {logo}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
