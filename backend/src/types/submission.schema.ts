import { z } from "zod";

export const createSubmissionSchema = z.object({
  name:           z.string().min(1, "Name is required"),
  organization:   z.string().optional(),
  category:       z.enum(["health", "legal_aid", "food_relief", "livelihood",
                          "mental_health", "education", "housing", "childen_and_family"]),
  address:        z.string().min(1, "Address is required"),
  barangay:       z.string().optional(),
  phone:          z.string().optional(),
  hours:          z.string().optional(),
  cost:           z.enum(["free", "with_fee", "depends"]).default("free"),
  description:    z.string().optional(),
  submitterName:  z.string().optional(),
  submitterEmail: z.email().optional(),
});

export type CreateSubmissionInput = z.infer<typeof createSubmissionSchema>;