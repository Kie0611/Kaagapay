import { Request, Response } from "express";
import jwt from "jsonwebtoken";

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

export const getAllResources = async () => {};
export const createResource = async () => {};
export const getPendingSubmissions = async () => {};
export const getDashboardStats = async () => {};
export const updateResource = async () => {};
export const toggleResourceStatus = async () => {};
export const approveSubmission = async () => {};
export const rejectSubmission = async () => {};