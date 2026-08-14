import { Link, useParams } from "react-router-dom";
import { BadgeCheck, Clock, Flag, Globe, MapPin, Navigation, Phone, SearchX, Wallet } from "lucide-react";
import { ResourceCard } from "@/components/ResourceCard";
import { ResourceMap } from "@/components/ResourceMap";
import { SiteShell } from "@/components/SiteShell";
import { COST_LABELS, categoryLabel, mapsUrl } from "@/lib/kaagapay";
import type { Resource } from "@/lib/kaagapay";

// Replace with useResource(id) and useResources() hooks later
const MOCK_RESOURCE: Resource | null = null;
const MOCK_ALL: Resource[] = [];

export function ResourceDetailPage() {
  const { id } = useParams<{ id: string }>();

  const isLoading = false;
  const resource  = MOCK_RESOURCE;
  const all       = MOCK_ALL;

  if (isLoading) {
    return (
      <SiteShell>
        <div className="mx-auto max-w-5xl px-4 py-20 text-sm text-muted-foreground">Loading...</div>
      </SiteShell>
    );
  }

  if (!resource) {
    return (
      <SiteShell>
        <div className="mx-auto max-w-2xl px-4 py-20 text-center">
          <SearchX className="mx-auto size-12 text-muted-foreground" />
          <h1 className="mt-4 text-2xl text-foreground">Service not found</h1>
          <p className="mt-2 text-sm text-muted-foreground">It may have been removed or the link is incorrect.</p>
          <Link
            to="/resources"
            className="mt-6 inline-block rounded-lg bg-navy px-5 py-3 text-sm font-semibold text-primary-foreground"
          >
            Back to list
          </Link>
        </div>
      </SiteShell>
    );
  }

  const related = all.filter((r) => r.category === resource.category && r.id !== resource.id).slice(0, 3);

  const info = [
    { icon: MapPin,   label: "Address", value: resource.address },
    { icon: Phone,    label: "Phone",   value: resource.phone },
    { icon: Clock,    label: "Hours",   value: resource.hours },
    { icon: Globe,    label: "Website", value: resource.website || "None" },
    { icon: Wallet,   label: "Cost",    value: COST_LABELS[resource.cost] ?? resource.cost },
  ];

  return (
    <SiteShell>
      <div className="mx-auto w-full max-w-5xl px-4 py-10">
        <nav className="flex flex-wrap items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <Link to="/" className="hover:text-navy">Home</Link>
          <span>/</span>
          <Link to="/resources" className="hover:text-navy">Services</Link>
          <span>/</span>
          <span className="text-foreground">{resource.name}</span>
        </nav>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <h1 className="text-3xl text-foreground">{resource.name}</h1>
          <span className={`cat-badge cat-${resource.category}`}>{categoryLabel(resource.category)}</span>
          {resource.verified && (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-success">
              <BadgeCheck className="size-4" /> Verified
            </span>
          )}
        </div>
        <p className="mt-1 text-sm font-medium text-muted-foreground">{resource.organization}</p>
        <p className="mt-4 max-w-3xl text-sm text-foreground/80">{resource.description}</p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {info.map((i) => (
            <div key={i.label} className="rounded-xl border-[1.5px] border-border bg-card p-4 shadow-card">
              <i.icon className="size-4 text-navy" />
              <p className="mt-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{i.label}</p>
              <p className="text-sm font-semibold text-foreground">{i.value}</p>
            </div>
          ))}
        </div>

        <section className="mt-10">
          <h2 className="text-xl text-foreground">Contact</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href={`tel:${resource.phone}`}
              className="inline-flex items-center gap-2 rounded-lg bg-navy px-6 py-3.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
            >
              <Phone className="size-4" /> Call {resource.phone}
            </a>
            <a
              href={mapsUrl(resource.lat, resource.lng)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-6 py-3.5 text-sm font-semibold text-navy hover:bg-secondary"
            >
              <Navigation className="size-4" /> Open in Google Maps
            </a>
          </div>
          <ResourceMap
            resources={[resource]}
            center={[resource.lat, resource.lng]}
            zoom={16}
            className="mt-5 h-72 overflow-hidden rounded-xl border-[1.5px] border-border bg-card shadow-card"
          />
          <button
            type="button"
            className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-flagred hover:underline"
          >
            <Flag className="size-3.5" /> Report incorrect info
          </button>
        </section>

        {related.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xl text-foreground">Related services</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <ResourceCard key={r.id} {...r} />
              ))}
            </div>
          </section>
        )}
      </div>
    </SiteShell>
  );
}