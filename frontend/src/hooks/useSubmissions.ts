import { useMutation, useQueryClient } from "@tanstack/react-query"; 
import { postSubmission } from "../api/submissions";
import type { CreateSubmissionInput } from "../types/submission.types";

export function useCreateSubmission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSubmissionInput) => postSubmission(data),

    // admin's pending list is now stale — invalidate it 
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "submissions"] }); // "Cached list may be outdated. Get fresh data."
      queryClient.invalidateQueries({ queryKey: ["admin", "stats"] }); 
    },
  });
}