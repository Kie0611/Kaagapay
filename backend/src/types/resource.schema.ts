import { z } from "zod";

export const createResourceSchema = z.object({
  name:         z.string().min(1, "Name is required"),
  organization: z.string().optional(),
  category:     z.enum(["health", "legal_aid", "food_relief", "livelihood",
                      "mental_health", "education", "housing", "childen_and_family"]),
  address:      z.string().min(1, "Address is required"),
  barangay:     z.string().optional(),
  city:         z.string().optional(),
  province:     z.string().optional(),
  phone:        z.string().optional(),
  hours:        z.string().optional(),
  website:      z.string().url().optional(),
  cost:         z.enum(["free", "with_fee", "depends"]).default("free"),
  description:  z.string().optional(),
  lat:          z.string().optional(),
  lng:          z.string().optional(),
  verified:     z.boolean().optional(),
});

export type CreateResourceInput = z.infer<typeof createResourceSchema>;