import { Request, Response } from "express";
import * as queries from "../db/queries"
import { Category, Cost } from "../db/schema";

export const getAllResources = async (req: Request, res: Response) => {
  try {
    const { category, city, barangay, cost, q } = req.query;

    const resources = await queries.getAllResources({
      category: category as Category,
      city:     city as string,
      barangay: barangay as string,
      cost:     cost as Cost,
      q:        q as string,
    });

    res.status(200).json(resources);
  } catch (error) {
    console.log("Failed to get resources:", error);
    res.status(500).json({ error: "Error getting resources"});
  }
};

export const getResourceById = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params;
    const resource = await queries.getResourceById(id);
    
    if(!resource) return res.status(404).json({ error: "Resource not found" });

    res.status(200).json(resource)
  } catch (error) {
    console.log("Failed to get resource", error);
    res.status(500).json({ error: "Error getting resource" });
  }
};

