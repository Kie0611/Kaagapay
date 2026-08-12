import { Link } from "@tanstack/react-router";
import { Clock, MapPin, Phone, Navigation, Star } from "lucide-react";
import { COST_LABELS, categoryLabel, mapsUrl } from "../lib/kaagapay";
import { cn } from "../lib/utils";

export type ResourceCardProps = {
  id: string;
  name: string;
  organization: string;
  category: string;
  barangay: string;
  distance?: number | null;
  hours: string;
  cost: string;
  phone: string;
  lat: number;
  lng: number;
  compact?: boolean;
};

export function ResourceCard(props: ResourceCardProps) {
  const {
    id, name, organization, category, barangay,
    distance, hours, cost, phone, lat, lng, compact,
  } = props;

  return (
    <article
      className={cn(
        "card-lift flex flex-col rounded-xl border-[1.5px] border-border bg-card shadow-card",
        compact ? "p-3.5" : "p-5",
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <Link
          to="/resources/$id"
          params={{ id }}
          className={cn(
            "font-bold leading-snug text-foreground hover:text-navy",
            compact ? "text-sm" : "text-base",
          )}
        >
          {name}
        </Link>
        <span className={cn("cat-badge", `cat-${category}`)}>
          {categoryLabel(category)}
        </span>
      </div>

      {/* Organization */}
      <p className="mt-1 text-xs font-medium text-muted-foreground">{organization}</p>

      {/* Meta */}
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <MapPin className="size-3.5 text-navy" />
          {barangay}
          {typeof distance === "number" && (
            <span className="text-navy">· {distance.toFixed(1)} km</span>
          )}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Clock className="size-3.5 text-navy" />
          {hours}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Star className="size-3.5 text-gold" />
          {COST_LABELS[cost] ?? cost}
        </span>
      </div>

      {/* Actions */}
      <div className="mt-4 flex gap-2">
        <a
          href={`tel:${phone}`}
          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-navy px-3 py-2 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          <Phone className="size-3.5" /> Call
        </a>
        <a
          href={mapsUrl(lat, lng)}
          target="_blank"
          rel="noreferrer"
          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border bg-secondary px-3 py-2 text-xs font-semibold text-navy transition-colors hover:bg-border/60"
        >
          <Navigation className="size-3.5" /> Directions
        </a>
      </div>
    </article>
  );
}

export function EmptyState({ title, message }: { title: string; message: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card px-6 py-16 text-center">
      <div className="mb-3 text-4xl">🔍</div>
      <p className="font-bold text-foreground">{title}</p>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{message}</p>
    </div>
  );
}