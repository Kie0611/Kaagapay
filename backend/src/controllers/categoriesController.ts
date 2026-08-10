import { Request, Response } from "express";
import * as queries from "../db/queries"

export const getCategoriesWithCount = async (req: Request, res: Response) => {
  try {
    const categories = await queries.getCategoriesWithCount();
    res.status(200).json(categories);
  } catch (error) {
    console.log("Failed to get categories:", error);
    res.status(500).json({ error: "Error getting categories"});
  }
};