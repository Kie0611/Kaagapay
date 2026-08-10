import { resourceLimits } from "node:worker_threads";
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
import { eq, and, ilike, SQL, count, countDistinct } from "drizzle-orm";

export interface GetResourcesFilters {
  category?: Category;
  city?: string;
  barangay?: string;
  cost?: Cost;
  q?: string; // keyword search on name
}
 
// Resources - Public
 
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

// Resources - Admin

export async function createResource(data: NewResource) {
  const [resource] = await db.insert(resources).values(data).returning();
  return resource;
};

export async function updateResource(id: string, data: Partial<NewResource>) {
  const [resource] = await db
    .update(resources)
    .set({
      ...data,
      updatedAt: new Date()
    })
    .where(eq(resources.id, id))
    .returning();

  return resource;
};

export async function updateResourceStatus(id: string, status: Status) {
  const [resource] = await db
    .update(resources)
    .set({
      status,
      updatedAt: new Date()
    })
    .where(eq(resources.id, id))
    .returning();

  return resource;
};

// Categories

export async function getCategoriesWithCount() {
  return db
    .select({
      category: resources.category,
      count: count(),
    })
    .from(resources)
    .where(eq(resources.status, "active"))
    .groupBy(resources.category);
};


// Submissions - Public

export async function createSubmission(data: NewSubmission) {
  const [submission] = await db.insert(submissions).values(data).returning();
  return submission;
};

// Submissions - Admin

export async function getPendingSubmissions() {
  return db
    .select()
    .from(submissions)
    .where(eq(submissions.status, "pending"))
    .orderBy(submissions.createdAt);
};

export async function updateSubmissionStatus(id: string, status: Status) {
  const [submission] = await db
    .update(submissions)
    .set({
      status,
      reviewedAt: new Date()
    })
    .where(eq(submissions.id, id))
    .returning()

  return submission;
}

// Admin

export async function getAdminResources() {
  return db.select().from(resources).orderBy(resources.createdAt);
};

export async function getAdminStats() {
  const [resourceStats] = await db
    .select({
      totalResources: count(),
      categoriesCount: countDistinct(resources.category),
      barangaysCount: countDistinct(resources.barangay),
    })
    .from(resources)
    .where(eq(resources.status, "active"));

  const [submissionStats] = await db
    .select({ pendingSubmissions: count() })
    .from(submissions)
    .where(eq(submissions.status, "pending"));

  return {
    totalResources:     resourceStats.totalResources,
    pendingSubmissions: submissionStats.pendingSubmissions,
    categoriesCount:    resourceStats.categoriesCount,
    barangaysCount:     resourceStats.barangaysCount,
  };
}

export async function approveSubmission(id: string) {
  const [submission] = await db
    .select()
    .from(submissions)
    .where(eq(submissions.id, id))
    .limit(1);
 
  if (!submission) return null;
 
  const [resource] = await db
    .insert(resources)
    .values({
      name:         submission.name,
      organization: submission.organization,
      category:     submission.category,
      address:      submission.address,
      barangay:     submission.barangay,
      phone:        submission.phone,
      hours:        submission.hours,
      cost:         submission.cost,
      description:  submission.description,
      status:       "approved",
      verified:     false, 
    })
    .returning();
 
  await db
    .update(submissions)
    .set({ status: "active", reviewedAt: new Date() })
    .where(eq(submissions.id, id));
 
  return resource;
}