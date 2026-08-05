import { db } from "./index";
import {
  resources,
  submissions,
  type Resource,
  type NewResource,
  type Submission,
  type NewSubmission,
  type Category,
  type Cost,
  type Status
} from "./schema";
import { eq, and, ilike, SQL } from "drizzle-orm";

export interface GetResourcesFilters {
  category?: Category;
  city?: string;
  barangay?: string;
  cost?: Cost;
  q?: string; // keyword search on name
}
 
// Resources 
 
export async function getAllResources(filters: GetResourcesFilters = {}) {
  const conditions: SQL[] = [
    eq(resources.status, "active"), // always only return active resources
  ];
 
  if (filters.category) {
    conditions.push(eq(resources.category, filters.category));
  }
 
  if (filters.city) {
    conditions.push(eq(resources.city, filters.city));
  }
 
  if (filters.barangay) {
    conditions.push(eq(resources.barangay, filters.barangay));
  }
 
  if (filters.cost) {
    conditions.push(eq(resources.cost, filters.cost));
  }
 
  if (filters.q) {
    conditions.push(ilike(resources.name, `%${filters.q}%`));
  }
 
  return db
    .select()
    .from(resources)
    .where(and(...conditions))
    .orderBy(resources.createdAt);
};

export async function getResourceById(id: string) {
  const [resource] = await db.select().from(resources).where(and(eq(resources.id, id), eq(resources.status, "active"))).limit(1);
  return resource;
};

