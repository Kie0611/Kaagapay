import { Request, Response } from "express";
import * as queries from "../db/queries";
import { createSubmissionSchema } from "../types/submission.schema";

export const createSubmission = async (req: Request, res: Response) => {
  // Validate the request body against the Zod schema
  const result = createSubmissionSchema.safeParse(req.body);

  // If validation fails, return 400 with the exact field errors
  if (!result.success) {
    return res.status(400).json({
      error: "Invalid submission data",
      details: result.error.flatten().fieldErrors,
    });
  }

  try {
    const submission = await queries.createSubmission(result.data);
    return res.status(201).json(submission);
  } catch (error) {
    console.log("Failed to create submission:", error);
    return res.status(500).json({ error: "Error creating submission" });
  }
};