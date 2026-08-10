import express from "express";
import {
  login,
  getAdminResources,
  createResource,
  getPendingSubmissions,
  getDashboardStats,
  updateResource,
  approveSubmission,
  rejectSubmission,
} from "../controllers/adminController";
import { requireAuth } from "../middleware/auth";

const router = express.Router();

router.post("/login", login);

router.get("/resources", requireAuth, getAdminResources);
router.post("/resources", requireAuth, createResource);

router.get("/submissions", requireAuth, getPendingSubmissions);

router.get("/stats", requireAuth, getDashboardStats);

router.put("/resources/:id", requireAuth, updateResource);

router.patch("/submissions/:id/approve", requireAuth, approveSubmission);
router.patch("/submissions/:id/reject", requireAuth, rejectSubmission);

export default router;