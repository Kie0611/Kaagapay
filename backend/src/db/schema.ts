import {
  pgTable,
  pgEnum,
  uuid,
  varchar,
  text,
  boolean,
  numeric,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

//  Enums 
export const categoryEnum = pgEnum("category_type", [
  "health",               // kalusugan
  "legal_aid",            // Legal Aid
  "food_relief",          // Pagkain
  "livelihood",           // Kabuhayan
  "mental_health",        // Mental Health
  "education",            // Edukasyon
  "housing",              // Pabahay
  "childen_and_family",   // Pamilya
]);

export const costEnum = pgEnum("cost_type", [
  "free",     // Libre
  "with_fee", // May Bayad
  "depends",   // Depende
]);

export const statusEnum = pgEnum("status_type", [
  "active",
  "inactive",
  "pending",
  "approved",
  "rejected",
]);

// Resources 

export const resources = pgTable( "resources", {
    id: uuid("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    name:         varchar("name", { length: 255 }).notNull(),
    organization: varchar("organization", { length: 255 }),
    category: categoryEnum("category").notNull(),
    address:  text("address").notNull(),
    barangay: varchar("barangay", { length: 100 }),
    city:     varchar("city", { length: 100 }).notNull().default("Silang"),
    province: varchar("province", { length: 100 }).notNull().default("Cavite"),
    phone:   varchar("phone", { length: 50 }),
    hours:   varchar("hours", { length: 255 }),
    website: varchar("website", { length: 255 }),
    cost:        costEnum("cost").notNull().default("free"),
    description: text("description"),

    // Coordinates for Leaflet map pins
    lat: numeric("lat", { precision: 10, scale: 7 }),
    lng: numeric("lng", { precision: 10, scale: 7 }),
    status:   statusEnum("status").notNull().default("active"),
    verified: boolean("verified").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .default(sql`now()`),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .default(sql`now()`),
  },
  (table) => [
    index("idx_resources_category").on(table.category),
    index("idx_resources_status").on(table.status),
    index("idx_resources_city").on(table.city),
  ]
);

// Submissions 

export const submissions = pgTable( "submissions", {
    id: uuid("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),

    // Resource info — mirrors resources table (no lat/lng until admin approves)
    name:         varchar("name", { length: 255 }).notNull(),
    organization: varchar("organization", { length: 255 }),
    category:     categoryEnum("category").notNull(),
    address:      text("address").notNull(),
    barangay:     varchar("barangay", { length: 100 }),
    phone:        varchar("phone", { length: 50 }),
    hours:        varchar("hours", { length: 255 }),
    cost:         costEnum("cost").notNull().default("free"),
    description:  text("description"),

    // Who submitted it (optional — anonymous allowed)
    submitterName:  varchar("submitter_name", { length: 255 }),
    submitterEmail: varchar("submitter_email", { length: 255 }),

    // Review fields
    status:     statusEnum("status").notNull().default("pending"),
    reviewedAt: timestamp("reviewed_at", { withTimezone: true }),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .default(sql`now()`),
  },
  (table) => [
    index("idx_submissions_status").on(table.status),
  ]
);


// Types

export type Resource      = typeof resources.$inferSelect;
export type NewResource   = typeof resources.$inferInsert;
export type Submission    = typeof submissions.$inferSelect;
export type NewSubmission = typeof submissions.$inferInsert;

export type Category = typeof categoryEnum.enumValues[number];
export type Cost     = typeof costEnum.enumValues[number];
export type Status   = typeof statusEnum.enumValues[number];