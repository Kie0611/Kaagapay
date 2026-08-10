export type Category =
  | "health"
  | "legal_aid"
  | "food_relief"
  | "livelihood"
  | "mental_health"
  | "education"
  | "housing"
  | "family";

export type Cost = "free" | "with_fee" | "depends";

export type Status = "active" | "inactive" | "pending" | "rejected";

export interface Resource {
  id: string;
  name: string;
  organization: string | null;
  category: Category;
  address: string;
  barangay: string | null;
  city: string;
  province: string;
  phone: string | null;
  hours: string | null;
  website: string | null;
  cost: Cost;
  description: string | null;
  lat: string | null;
  lng: string | null;
  status: Status;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ResourceFilters {
  category?: Category;
  city?: string;
  barangay?: string;
  cost?: Cost;
  q?: string;
}

export interface CategoryWithCount {
  category: Category;
  count: number;
}