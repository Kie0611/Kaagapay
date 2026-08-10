import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  loginAdmin,
  fetchAdminResources,
  fetchAdminSubmissions,
  fetchAdminStats,
  postAdminResource,
  putAdminResource,
  patchResourceStatus,
  patchApproveSubmission,
  patchRejectSubmission,
} from "../api/admin";
import type { Resource } from "../types/resource.types";
import type { LoginCredentials } from "../types/admin.types";

export function useLogin() {
  return useMutation({
    mutationFn: (credentials: LoginCredentials) => loginAdmin(credentials),
    onSuccess: (data) => {
      localStorage.setItem("kaagapay-token", data.token);
    },
  });
}

export function useAdminResources() {
  return useQuery({
    queryKey: ["admin", "resources"],
    queryFn:  fetchAdminResources,
  });
}

export function useAdminSubmissions() {
  return useQuery({
    queryKey: ["admin", "submissions"],
    queryFn:  fetchAdminSubmissions,
  });
}

export function useAdminStats() {
  return useQuery({
    queryKey: ["admin", "stats"],
    queryFn:  fetchAdminStats,
  });
}

export function useCreateResource() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Resource>) => postAdminResource(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "resources"] });
      queryClient.invalidateQueries({ queryKey: ["resources"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
    },
  });
}

export function useUpdateResource() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Resource> }) =>
      putAdminResource(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "resources"] });
      queryClient.invalidateQueries({ queryKey: ["resources"] });
    },
  });
}

export function useUpdateResourceStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
    patchResourceStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "resources"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
    },
  });
}

export function useApproveSubmission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => patchApproveSubmission(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "submissions"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "resources"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
    },
  });
}

export function useRejectSubmission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => patchRejectSubmission(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "submissions"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
    },
  });
}