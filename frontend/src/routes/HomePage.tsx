import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { ResourceCard } from "@/components/ResourceCard";
import { SiteShell, SunWatermark } from "@/components/SiteShell";
import { BARANGAYS, CATEGORIES } from "@/lib/kaagapay";
import { useResources, useCategories } from "@/hooks/useResources";

export function HomePage() {
  const navigate = useNavigate();
  const { data: resources = [], isLoading } = useResources();
  const { data: categoriesWithCount = [] } = useCategories();
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [barangay, setBarangay] = useState("");

  const counts = CATEGORIES.map((c) => ({
    ...c,
    count: categoriesWithCount.find((cc) => cc.category === c.value)?.count ?? 0,
  }));

  function search(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (q)        params.set("q", q);
    if (category) params.set("category", category);
    if (barangay) params.set("barangay", barangay);
    navigate(`/resources?${params.toString()}`);
  }

  return (
    <SiteShell>
      <section className="relative overflow-hidden bg-card">
        <SunWatermark className="pointer-events-none absolute -right-16 -top-16 size-105 opacity-10" />
        <div className="relative mx-auto w-full max-w-7xl px-4 py-16 sm:py-24">
          <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-navy">
            🇵🇭 Silang, Cavite · Region 4A
          </span>
          <h1 className="mt-5 max-w-3xl text-4xl leading-tight text-foreground sm:text-5xl">
            Find the help you need, right now
          </h1>
          <p className="mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
            A community directory of free and affordable services — health, legal aid, food,
            livelihood, and more. Connect with the right agency in just a few clicks.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/resources"
              className="rounded-lg bg-navy px-5 py-3 text-sm font-semibold text-primary-foreground shadow-card hover:opacity-90"
            >
              Search for Help
            </Link>
            <Link
              to="/about"
              className="rounded-lg border border-border bg-card px-5 py-3 text-sm font-semibold text-navy hover:bg-secondary"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto -mt-8 w-full max-w-7xl px-4">
        <form
          onSubmit={search}
          className="grid gap-3 rounded-xl border-[1.5px] border-border bg-card p-4 shadow-card md:grid-cols-[2fr_1fr_1fr_auto]"
        >
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="What kind of help are you looking for?"
            className="rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-navy"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-navy"
          >
            <option value="">All categories</option>
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
          <select
            value={barangay}
            onChange={(e) => setBarangay(e.target.value)}
            className="rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-navy"
          >
            <option value="">All barangays</option>
            {BARANGAYS.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-navy px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
          >
            <Search className="size-4" /> Search
          </button>
        </form>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-14">
        <h2 className="text-2xl text-foreground">Service Categories</h2>
        <p className="mt-1 text-sm text-muted-foreground">Choose the type of help you need.</p>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {counts.map((c) => {
            const Icon = c.icon;
            return (
              <Link
                key={c.value}
                to={`/resources?category=${c.value}`}
                className="card-lift rounded-xl border-[1.5px] border-border bg-card p-5 shadow-card"
              >
                <Icon className="size-7 text-navy" />
                <p className="mt-3 font-bold text-foreground">{c.label}</p>
                <p className="text-xs font-medium text-muted-foreground">{c.count} services</p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 pb-14">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl text-foreground">Latest Services</h2>
            <p className="mt-1 text-sm text-muted-foreground">Newly added to the directory.</p>
          </div>
          <Link to="/resources" className="text-sm font-semibold text-navy hover:text-flagred">
            View all →
          </Link>
        </div>
        {isLoading ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-48 animate-pulse rounded-xl bg-secondary" />
            ))}
          </div>
        ) : resources.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-card py-16 text-center">
            <p className="text-sm text-muted-foreground">No resources yet — check back soon.</p>
          </div>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {resources.slice(0, 6).map((r) => (
              <ResourceCard key={r.id} {...r} />
            ))}
          </div>
        )}
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 pb-16">
        <div className="gradient-red flex flex-col items-start gap-4 rounded-xl px-6 py-10 text-white sm:flex-row sm:items-center sm:justify-between sm:px-10">
          <div>
            <h2 className="text-2xl text-white">Know a service we don&apos;t have yet?</h2>
            <p className="mt-2 max-w-xl text-sm text-white/85">
              Help expand the directory. Submit the details and our volunteer team will review it before publishing.
            </p>
          </div>
          <Link
            to="/submit"
            className="shrink-0 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-flagred hover:bg-white/90"
          >
            Submit a Resource
          </Link>
        </div>
      </section>
    </SiteShell>
  );
}