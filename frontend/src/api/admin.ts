import { apiClient } from "./client";
import type { Resource } from "../types/resource.types";
import type {
  Submission,
  DashboardStats,
  LoginCredentials,
} from "../types/admin.types";

export async function loginAdmin(credentials: LoginCredentials) {
  const { data } = await apiClient.post<{token: string}>("/admin/login", credentials);
  return data;
}

export async function fetchAdminResources() {
  const { data } = await apiClient.get<Resource[]>("/admin/resources");
  return data;
}

export async function postAdminResource(data: Partial<Resource>) {
  const { data: resource } = await apiClient.post<Resource>("/admin/resources", data);
  return resource;
}

export async function putAdminResource(id: string, data: Partial<Resource>) {
  const { data: resource } = await apiClient.put<Resource>(`/admin/resources/${id}`, data);
  return resource;
}

export async function patchResourceStatus(id: string, status: string) {
  const { data } = await apiClient.patch<Resource>(`/admin/resources/${id}/status`, { status });
  return data;
}

export async function fetchAdminSubmissions() {
  const { data } = await apiClient.get<Submission[]>("/admin/submissions");
  return data;
}

export async function patchApproveSubmission(id: string) {
  const { data } = await apiClient.patch<Resource>(`/admin/submissions/${id}/approve`);
  return data;
}
 
export async function patchRejectSubmission(id: string) {
  const { data } = await apiClient.patch<Submission>(`/admin/submissions/${id}/reject`);
  return data;
}

export async function fetchAdminStats() {
  const { data } = await apiClient.get<DashboardStats>("/admin/stats");
  return data;
}
 