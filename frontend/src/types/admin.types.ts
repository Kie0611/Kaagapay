export interface LoginCredentials {
  username: string;
  password: string;
}

export interface DashboardStats {
  totalResources: number;
  pendingSubmissions: number;
  categoriesCount: number;
  barangaysCount: number;
}

// re-export Submission from submission types to keep admin imports clean
export type { Submission } from "./submission.types";