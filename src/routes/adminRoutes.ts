import express from "express";
import {
  login,
  getAllResources,
  createResource,
  getPendingSubmissions,
  getDashboardStats,
  updateResource,
  toggleResourceStatus,
  approveSubmission,
  rejectSubmission,
} from "../controllers/adminController";

const router = express.Router();

router.post("/login", login);

router.get("/resources", getAllResources);
router.post("/resources", createResource);

router.get("/submissions", getPendingSubmissions);

router.get("/stats", getDashboardStats);

router.patch("/resources/:id/status", toggleResourceStatus);
router.put("/resources/:id", updateResource);

router.patch("/submissions/:id/approve", approveSubmission);
router.patch("/submissions/:id/reject", rejectSubmission);

export default router;