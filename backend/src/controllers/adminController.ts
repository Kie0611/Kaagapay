import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import * as queries from "../db/queries";
import { createResourceSchema } from "../types/resource.schema";

export const login = (req:Request, res:Response) => {
  const { username, password } = req.body;

  if (
    username !== process.env.ADMIN_USERNAME ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    return res.status(401).json({ success: false, error: "Invalid credentials" });
  }

  const token = jwt.sign({ username }, process.env.JWT_SECRET!, {
    expiresIn: "1d",
  });

  return res.json({ success: true, data: { token } });
}

export const getAdminResources = async (req:Request, res:Response) => {
  try {
    const resources = await queries.getAdminResources();
    res.status(200).json(resources);
  } catch (error) {
    console.log("Failed to get resources:", error);
    res.status(500).json({ error: "Error getting resources" });
  }
};

export const createResource = async (req:Request, res:Response) => {
  const result = createResourceSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      error: "Invalid submission data",
      details: result.error.flatten().fieldErrors,
    });
  }

  try {
    const resource = await queries.createResource(result.data);
    return res.status(201).json(resource);
  } catch (error) {
    console.log("Failed to create resource:", error);
    return res.status(500).json({ error: "Error creating resource" });
  }

};


export const getPendingSubmissions = async (req:Request, res:Response) => {
  try {
    const submissions = await queries.getPendingSubmissions();
    return res.status(200).json(submissions);
  } catch (error) {
    console.log("Failed to get submissions:", error);
    return res.status(500).json({ error: "Error getting submissions" });
  }
};


export const getDashboardStats = async (req:Request, res:Response) => {
  try {
    const stats = await queries.getAdminStats();
    res.status(200).json(stats);
  } catch (error) {
    console.log("Failed to get stats:", error);
    return res.status(500).json({ error: "Error getting stats" });
  }
};

export const updateResource = async (req:Request<{ id: string }>, res:Response) => {
  try {
    const { id } = req.params;
    const result = createResourceSchema.partial().safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        error: "Invalid submission data",
        details: result.error.flatten().fieldErrors,
      });
    }

    const existingResource = await queries.getResourceById(id);

    if (!existingResource) return res.status(404).json({ error: "Resource not found" });

    const resource = await queries.updateResource(id, result.data);

    res.status(200).json(resource);
  } catch (error) {
    console.log("Failed to update resource:", error);
    return res.status(500).json({ error: "Error updating resource" });
  }
};

export const updateResourceStatus = async (req:Request<{ id: string }>, res:Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const existingResource = await queries.getResourceById(id);

    if (!existingResource) return res.status(404).json({ error: "Resource not found" });

    const resource = await queries.updateResourceStatus(id, status);

    res.status(200).json(resource);
  } catch (error) {
    console.log("Failed to update resource status:", error);
    return res.status(500).json({ error: "Error updating resource status" });
  }
}

export const approveSubmission = async (req:Request<{ id: string }>, res:Response) => {
  try {
    const { id } = req.params;
    
    const submission = await queries.approveSubmission(id);

    if (!submission) return res.status(404).json("Submission not found");

    res.status(200).json(submission);
  } catch (error) {
    console.log("Failed to approve submission:", error);
    return res.status(500).json({ error: "Error approving submission" });
  }
};

export const rejectSubmission = async (req:Request<{ id: string }>, res:Response) => {
  try {
    const { id } = req.params;

    const submission = await queries.updateSubmissionStatus(id, "rejected")

    if (!submission) return res.status(404).json("Submission not found");

    res.status(200).json(submission);
  } catch (error) {
    console.log("Failed to reject  submission:", error);
    return res.status(500).json({ error: "Error rejecting  submission" });
  }
};
