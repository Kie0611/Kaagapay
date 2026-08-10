import { apiClient } from "./client";
import type { CreateSubmissionInput, Submission } from "../types/submission.types";

export async function postSubmission(data: CreateSubmissionInput) {
  const { data: submission } = await apiClient.post<Submission>("/submissions", data);
  return submission;
}