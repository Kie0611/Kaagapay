import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ success: false, error: "Unauthorized" });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!);
    (req as any).admin = payload;
    next();
  } catch {
    return res.status(401).json({ success: false, error: "Invalid or expired token" });
  }
};