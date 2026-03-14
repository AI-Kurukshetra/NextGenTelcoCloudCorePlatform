import Link from "next/link";

const quickLinks = [
  { href: "/features", label: "Features" },
  { href: "/docs", label: "API Docs" },
  { href: "/status", label: "Status" },
  { href: "/contact", label: "Contact" },
];

export function FooterSection() {
  return (
    <section className="container pb-10">
      <div className="surface-card grid gap-4 p-5 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <p className="text-sm font-semibold text-slate-900">Built for trust, transparency, and human-in-the-loop control.</p>
          <p className="mt-1 text-sm text-slate-600">Explainable AI controls, confidence cues, and safe rollback flows are included across modules.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {quickLinks.map((link) => (
            <Link key={link.href} href={link.href} className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
