export interface CreateSubmissionInput {
  name: string;
  organization?: string;
  category: string;
  address: string;
  barangay?: string;
  phone?: string;
  hours?: string;
  cost?: "free" | "with_fee" | "depends";
  description?: string;
  submitterName?: string;
  submitterEmail?: string;
}

export interface Submission {
  id: string;
  name: string;
  organization: string | null;
  category: string;
  address: string;
  barangay: string | null;
  phone: string | null;
  hours: string | null;
  cost: string;
  description: string | null;
  submitterName: string | null;
  submitterEmail: string | null;
  status: string;
  reviewedAt: string | null;
  createdAt: string;
}