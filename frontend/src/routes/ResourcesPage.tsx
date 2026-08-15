import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { List, Map as MapIcon } from "lucide-react";
import { EmptyState, ResourceCard } from "@/components/ResourceCard";
import { ResourceMap } from "@/components/ResourceMap";
import { SiteShell } from "@/components/SiteShell";
import { BARANGAYS, CATEGORIES, SILANG_CENTER, haversineKm, isOpenNow } from "@/lib/kaagapay";
import { useResources } from "@/hooks/useResources";

export function ResourcesPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const qParam        = searchParams.get("q") ?? "";
  const catParam      = searchParams.get("category") ?? "";
  const barangayParam = searchParams.get("barangay") ?? "";

  // All state declared before the hook so they're available as hook arguments
  const [view, setView]             = useState<"list" | "map">("list");
  const [q, setQ]                   = useState(qParam);
  const [debouncedQ, setDebouncedQ] = useState(qParam);
  const [categories, setCategories] = useState<string[]>(catParam ? [catParam] : []);
  const [barangay, setBarangay]     = useState(barangayParam);
  const [freeOnly, setFreeOnly]     = useState(false);
  const [openNow, setOpenNow]       = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Wait 400ms after user stops typing before firing a request
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQ(q), 400);
    return () => clearTimeout(timer);
  }, [q]);

  // Hook re-fetches automatically whenever these filter values change
  const { data: raw = [], isLoading } = useResources({
    q:        debouncedQ.trim() || undefined,
    category: categories[0] || undefined,
    barangay: barangay || undefined,
    cost:     freeOnly ? "free" : undefined,
  });

  // openNow filter stays client-side — backend doesn't know the user's local time
  const filtered = openNow ? raw.filter((r) => isOpenNow(r.hours)) : raw;

  // Distance calculation and sorting
  const origin = userLocation ?? SILANG_CENTER;
  const results = filtered
    .map((r) => ({
      ...r,
      distance: haversineKm(origin, [Number(r.lat), Number(r.lng)]),
    }))
    .sort((a, b) => a.distance - b.distance);

  function locate() {
    navigator.geolocation?.getCurrentPosition(
      (pos) => setUserLocation([pos.coords.latitude, pos.coords.longitude]),
      () => setUserLocation(SILANG_CENTER),
    );
  }

  function toggleCategory(value: string) {
    setCategories((prev) =>
      prev.includes(value) ? prev.filter((c) => c !== value) : [...prev, value],
    );
  }

  function clearFilters() {
    setQ("");
    setDebouncedQ("");
    setCategories([]);
    setBarangay("");
    setFreeOnly(false);
    setOpenNow(false);
    setSearchParams({});
  }

  const filters = (
    <aside className="rounded-xl border-[1.5px] border-border bg-card p-5 shadow-card">
      <p className="text-sm font-bold text-foreground">Filters</p>

      <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Category
      </p>
      <div className="mt-2 grid gap-1.5">
        {CATEGORIES.map((c) => {
          const Icon = c.icon;
          return (
            <label
              key={c.value}
              className="flex cursor-pointer items-center gap-2 text-sm text-foreground"
            >
              <input
                type="checkbox"
                checked={categories.includes(c.value)}
                onChange={() => toggleCategory(c.value)}
                className="size-4 accent-navy"
              />
              <Icon className="size-3.5 shrink-0 text-navy" />
              <span>{c.label}</span>
            </label>
          );
        })}
      </div>

      <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Barangay
      </p>
      <select
        value={barangay}
        onChange={(e) => setBarangay(e.target.value)}
        className="mt-2 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-navy"
      >
        <option value="">All</option>
        {BARANGAYS.map((b) => (
          <option key={b} value={b}>{b}</option>
        ))}
      </select>

      <div className="mt-5 grid gap-2">
        <label className="flex items-center justify-between text-sm font-medium text-foreground">
          Free only
          <input
            type="checkbox"
            checked={freeOnly}
            onChange={(e) => setFreeOnly(e.target.checked)}
            className="size-4 accent-navy"
          />
        </label>
        <label className="flex items-center justify-between text-sm font-medium text-foreground">
          Open now
          <input
            type="checkbox"
            checked={openNow}
            onChange={(e) => setOpenNow(e.target.checked)}
            className="size-4 accent-navy"
          />
        </label>
      </div>

      <button
        type="button"
        onClick={clearFilters}
        className="mt-5 w-full rounded-lg border border-border bg-secondary px-3 py-2 text-xs font-semibold text-navy hover:bg-border/60"
      >
        Clear filters
      </button>
    </aside>
  );

  return (
    <SiteShell>
      <div className="mx-auto w-full max-w-7xl px-4 py-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl text-foreground">Services</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {isLoading ? "Loading..." : `${results.length} results near you`}
            </p>
          </div>
          <div className="inline-flex rounded-full border border-border bg-card p-1 shadow-card">
            {(["list", "map"] as const).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setView(v)}
                className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                  view === v
                    ? "bg-navy text-primary-foreground"
                    : "text-muted-foreground hover:text-navy"
                }`}
              >
                {v === "list" ? <List className="size-3.5" /> : <MapIcon className="size-3.5" />}
                {v === "list" ? "List" : "Map"}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search services, organizations, or barangays..."
            className="w-full rounded-lg border border-input bg-card px-4 py-3 text-sm outline-none focus:border-navy"
          />
        </div>

        {view === "list" ? (
          <div className="mt-6 grid gap-6 lg:grid-cols-[260px_1fr]">
            <div>{filters}</div>
            <div>
              {isLoading ? (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-48 animate-pulse rounded-xl bg-secondary" />
                  ))}
                </div>
              ) : results.length === 0 ? (
                <EmptyState
                  title="No services found"
                  message="Try removing some filters or searching with different keywords."
                />
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {results.map((r) => (
                    <ResourceCard key={r.id} {...r} />
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="mt-6 grid gap-4 lg:grid-cols-[340px_1fr]">
            <div className="hidden max-h-[70vh] overflow-y-auto pr-1 lg:block">
              <div className="grid gap-3">
                {results.length === 0 ? (
                  <EmptyState title="No results" message="Try different filters." />
                ) : (
                  results.map((r) => <ResourceCard key={r.id} {...r} compact />)
                )}
              </div>
            </div>
            <div className="relative">
              <ResourceMap
                resources={results}
                userLocation={userLocation}
                onLocate={locate}
                showControls={true}
                showLegend={true}
                className="h-[70vh] overflow-hidden rounded-xl border-[1.5px] border-border bg-card shadow-card"
              />
              <button
                type="button"
                onClick={() => setDrawerOpen((v) => !v)}
                className="absolute bottom-4 left-1/2 z-[600] -translate-x-1/2 rounded-full bg-navy px-5 py-2.5 text-xs font-semibold text-primary-foreground shadow-lift lg:hidden"
              >
                {drawerOpen ? "Hide list" : `Show ${results.length} services`}
              </button>
              {drawerOpen && (
                <div className="absolute inset-x-0 bottom-0 z-[600] max-h-[55%] overflow-y-auto rounded-t-2xl border-t-[1.5px] border-border bg-card p-4 shadow-lift lg:hidden">
                  <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-border" />
                  <div className="grid gap-3">
                    {results.map((r) => (
                      <ResourceCard key={r.id} {...r} compact />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </SiteShell>
  );
}