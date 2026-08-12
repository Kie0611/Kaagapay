import { z } from "zod";

// Categories 
export const CATEGORIES = [
  { value: "health",       label: "Health",             emoji: "🏥", pin: "#185fa5" },
  { value: "legal_aid",    label: "Legal Aid",          emoji: "⚖️", pin: "#8b5a00" },
  { value: "food_relief",  label: "Food & Relief",      emoji: "🍚", pin: "#1a6b3c" },
  { value: "livelihood",   label: "Livelihood",         emoji: "💼", pin: "#5b2d9e" },
  { value: "mental_health",label: "Mental Health",      emoji: "🧠", pin: "#9b1c1c" },
  { value: "education",    label: "Education",          emoji: "📚", pin: "#7c3aed" },
  { value: "housing",      label: "Housing",            emoji: "🏠", pin: "#b45309" },
  { value: "family",       label: "Children & Family",  emoji: "👨‍👩‍👧", pin: "#2563eb" },
] as const;

export type CategoryValue = (typeof CATEGORIES)[number]["value"];

export const CATEGORY_VALUES = CATEGORIES.map((c) => c.value) as [
  CategoryValue,
  ...CategoryValue[],
];

export function categoryLabel(value: string) {
  return CATEGORIES.find((c) => c.value === value)?.label ?? value;
}
export function categoryEmoji(value: string) {
  return CATEGORIES.find((c) => c.value === value)?.emoji ?? "📍";
}
export function categoryPinColor(value: string) {
  return CATEGORIES.find((c) => c.value === value)?.pin ?? "#0b2d6e";
}

// Cost

export const COST_LABELS: Record<string, string> = {
  free:     "Free",
  with_fee: "With fee",
  depends:  "Depends",
};

// Barangays

export const BARANGAYS = [
  "Poblacion",
  "Biga",
  "Munisipyo",
  "Bucal",
  "Hoyo",
  "Iba",
  "Lalaan I",
  "Lucsuhin",
  "Malabag",
  "Munting Ilog",
  "Pooc I",
  "Tibig",
  "Imus, Cavite",
  "Online",
];

// Map

export const SILANG_CENTER: [number, number] = [14.2273, 120.9741];

export function mapsUrl(lat: number, lng: number) {
  return `https://maps.google.com/?q=${lat},${lng}`;
}

// Types 

export type Resource = {
  id: string;
  name: string;
  organization: string;
  category: CategoryValue;
  address: string;
  barangay: string;
  city: string;
  province: string;
  phone: string;
  hours: string;
  cost: "free" | "with_fee" | "depends";
  description: string;
  website: string | null;
  lat: number;
  lng: number;
  status: "active" | "inactive" | "pending" | "rejected";
  verified: boolean;
  submitter_name: string | null;
  submitter_email: string | null;
  created_at: string;
  updated_at: string;
};

// Zod Schema 

export const resourceSchema = z.object({
  name:            z.string().min(3, "Service name must be at least 3 characters."),
  organization:    z.string().min(2, "Organization name is required."),
  category:        z.enum(CATEGORY_VALUES, { error: "Please select a category.", }),
  address:         z.string().min(5, "A complete address is required."),
  barangay:        z.string().min(2, "Please enter a barangay."),
  phone:           z.string().min(7, "A valid phone number is required."),
  hours:           z.string().min(3, "Please enter operating hours, e.g. Monday–Friday 8AM–5PM."),
  cost:            z.enum(["free", "with_fee", "depends"]),
  description:     z.string().min(20, "Please provide a description (at least 20 characters)."),
  lat:             z.coerce.number().min(-90).max(90),
  lng:             z.coerce.number().min(-180).max(180),
  submitter_name:  z.string().max(120).optional().or(z.literal("")),
  submitter_email: z.string().email("Invalid email address.").optional().or(z.literal("")),
});

export type ResourceInput = z.infer<typeof resourceSchema>;

// Utilities

export function haversineKm(a: [number, number], b: [number, number]) {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(b[0] - a[0]);
  const dLng = toRad(b[1] - a[1]);
  const lat1 = toRad(a[0]);
  const lat2 = toRad(b[0]);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return 2 * R * Math.asin(Math.sqrt(h));
}

const DAY_TOKENS: Record<string, number[]> = {
  "monday–friday":   [1, 2, 3, 4, 5],
  "monday-friday":   [1, 2, 3, 4, 5],
  "mon–fri":         [1, 2, 3, 4, 5],
  "mon-fri":         [1, 2, 3, 4, 5],
  "monday–thursday": [1, 2, 3, 4],
  "mon–thu":         [1, 2, 3, 4],
  // keep tagalog tokens for legacy data
  "lunes–biyernes":  [1, 2, 3, 4, 5],
  "lunes-biyernes":  [1, 2, 3, 4, 5],
  "lunes–huwebes":   [1, 2, 3, 4],
};

export function isOpenNow(hours: string, now = new Date()) {
  const h = hours.toLowerCase();
  if (h.includes("24/7")) return true;
  const days = Object.entries(DAY_TOKENS).find(([token]) => h.includes(token))?.[1];
  if (!days) return false;
  if (!days.includes(now.getDay())) return false;
  const times = h.match(/(\d{1,2})\s*(am|pm)/g);
  if (!times || times.length < 2) return false;
  const parse = (t: string) => {
    const n = parseInt(t, 10);
    const pm = t.includes("pm");
    return (pm && n !== 12 ? n + 12 : !pm && n === 12 ? 0 : n) * 60;
  };
  const mins = now.getHours() * 60 + now.getMinutes();
  return mins >= parse(times[0]) && mins <= parse(times[times.length - 1]);
}