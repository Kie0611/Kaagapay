import { useQuery } from "@tanstack/react-query";
import {
  fetchResources,
  fetchResourceById,
  fetchCategories
} from "../api/resources";
import type { ResourceFilters } from "../types/resource.types";

export function useResources(filters: ResourceFilters = {}) {
  return useQuery({
    queryKey: ["resource", filters],
    queryFn: () => fetchResources(filters), // () => means like do this later when you need to fetch data
  });
}

export function useResource(id: string) {
  return useQuery({
    queryKey: ["resources", id],
    queryFn: () => fetchResourceById(id),
    enabled: !!id, // !! Only execute the query when id exists (converts it to boolean)
  });
}

 export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });
}