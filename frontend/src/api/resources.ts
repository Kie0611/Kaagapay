import { apiClient } from "./client";
import type {
  Resource, 
  ResourceFilters,
  CategoryWithCount,
} from "../types/resource.types";

export async function fetchResources(filters: ResourceFilters = {}) {
  const { data } = await apiClient.get<Resource[]>("/resources", {
    params: filters, // Takes whatever is inside filters and send it as query parameters.
  });
  return data;
}

export async function fetchResourceById(id: string) {
  const { data } = await apiClient.get<Resource>(`/resources/${id}`);
  return data;
}

export async function fetchCategories() {
  const { data } = await apiClient.get<CategoryWithCount>("/categories");
  return data;
}