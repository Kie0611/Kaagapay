import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { categoryPinColor, mapsUrl, SILANG_CENTER } from "../lib/kaagapay";
import type { Resource } from "../lib/kaagapay";

interface ResourceMapProps {
  resources: Resource[];
}

export function ResourceMap({ resources }: ResourceMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markersRef = useRef<L.CircleMarker[]>([]);
  const [locating, setLocating] = useState(false);

  // Init map once
  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const map = L.map(mapRef.current, { zoomControl: false }).setView(
      SILANG_CENTER,
      14,
    );

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '© <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    // Custom zoom controls position
    L.control.zoom({ position: "bottomright" }).addTo(map);

    mapInstance.current = map;

    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, []);

  // Re-render pins when resources change
  useEffect(() => {
    const map = mapInstance.current;
    if (!map) return;

    // Remove old markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    resources.forEach((r) => {
      if (!r.lat || !r.lng) return;

      const marker = L.circleMarker([Number(r.lat), Number(r.lng)], {
        radius: 10,
        fillColor: categoryPinColor(r.category),
        color: "#ffffff",
        weight: 2,
        fillOpacity: 1,
      }).addTo(map);

      marker.bindPopup(
        `<div style="min-width:180px;font-family:system-ui,sans-serif">
          <p style="font-size:13px;font-weight:700;margin:0 0 2px">${r.name}</p>
          <p style="font-size:11px;color:#6b7280;margin:0 0 8px">${r.barangay ?? ""}, ${r.city} · ${r.hours ?? ""}</p>
          <div style="display:flex;gap:6px">
            <a href="tel:${r.phone}"
               style="flex:1;text-align:center;background:#0b2d6e;color:#fff;
                      padding:6px 0;border-radius:7px;font-size:12px;
                      font-weight:600;text-decoration:none">
              📞 Call
            </a>
            <a href="${mapsUrl(Number(r.lat), Number(r.lng))}" target="_blank"
               style="flex:1;text-align:center;background:#f7a800;color:#0b2d6e;
                      padding:6px 0;border-radius:7px;font-size:12px;
                      font-weight:600;text-decoration:none">
              🗺 Directions
            </a>
          </div>
        </div>`,
        { maxWidth: 220 },
      );

      markersRef.current.push(marker);
    });
  }, [resources]);

  // Near Me
  function handleLocate() {
    const map = mapInstance.current;
    if (!map || !navigator.geolocation) return;

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const latlng: [number, number] = [coords.latitude, coords.longitude];

        L.circleMarker(latlng, {
          radius: 9,
          fillColor: "#4285f4",
          color: "#fff",
          weight: 2.5,
          fillOpacity: 1,
        })
          .addTo(map)
          .bindPopup("You are here")
          .openPopup();

        map.setView(latlng, 15);
        setLocating(false);
      },
      () => setLocating(false),
    );
  }

  return (
    <div className="relative h-full w-full">
      <div ref={mapRef} className="h-full w-full" />

      {/* Near Me button */}
      <button
        onClick={handleLocate}
        disabled={locating}
        className="absolute left-3 top-3 z-[400] inline-flex items-center gap-1.5 rounded-lg
                   bg-card px-3 py-2 text-xs font-semibold text-navy shadow-card
                   border border-border hover:bg-secondary disabled:opacity-60 transition-colors"
      >
        {locating ? "Locating…" : "📍 Near Me"}
      </button>

      {/* Category legend */}
      <div className="absolute bottom-10 left-3 z-[400] rounded-xl border border-border
                      bg-card/95 p-3 shadow-card backdrop-blur">
        <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          Legend
        </p>
        <div className="flex flex-col gap-1.5">
          {[
            { color: "#185fa5", label: "Health" },
            { color: "#5b2d9e", label: "Livelihood" },
            { color: "#1a6b3c", label: "Food & Relief" },
            { color: "#9b1c1c", label: "Mental Health" },
            { color: "#8b5a00", label: "Legal Aid" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <div
                className="size-2.5 rounded-full ring-1 ring-white"
                style={{ background: item.color }}
              />
              <span className="text-[10px] text-muted-foreground">
                {item.label}
              </span>
            </div>
          ))}
          <div className="flex items-center gap-2">
            <div className="size-2.5 rounded-full bg-[#4285f4] ring-1 ring-white" />
            <span className="text-[10px] text-muted-foreground">You</span>
          </div>
        </div>
      </div>

      {/* OSM attribution override (already added by leaflet but style tweak) */}
    </div>
  );
}