import { SiteShell, SunWatermark } from "@/components/SiteShell";

export function AboutPage() {
  return (
    <SiteShell>
      <div className="relative mx-auto w-full max-w-3xl px-4 py-16">
        <SunWatermark className="pointer-events-none absolute -right-16 -top-8 size-72 opacity-10" />
        <h1 className="text-4xl text-foreground">About Kaagapay</h1>
        <p className="mt-4 text-base text-muted-foreground">
          <strong className="text-foreground">Kaagapay</strong> is a free directory of social services in Silang, Cavite and across Region 4A. Our goal is to make finding help faster — from health centers, legal aid, food assistance, to mental health hotlines.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {[
            { title: "Kasama",       desc: "Built by the community, for the community.", color: "text-navy" },
            { title: "Konektado",    desc: "Direct phone numbers, addresses, and directions.", color: "text-flagred" },
            { title: "Para sa Lahat",desc: "Free to use, no account required.", color: "text-gold" },
          ].map((p) => (
            <div key={p.title} className="rounded-xl border-[1.5px] border-border bg-card p-5 shadow-card">
              <p className={`font-bold ${p.color}`}>{p.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{p.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-12">
          <h2 className="text-xl text-foreground">How we verify information</h2>
          <p className="mt-3 text-m text-muted-foreground">
            Every submission goes through a review by our volunteer team. We verify the address, phone number, and operating hours before publishing. If you find incorrect details, you can report them on each resource's page.
          </p>
        </div>
      </div>
    </SiteShell>
  );
}
