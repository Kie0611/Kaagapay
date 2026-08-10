import express from "express";
import { getAllResources, getResourceById } from "../controllers/resourcesController";

const router = express.Router();

router.get("/", getAllResources);
router.get("/:id", getResourceById);

export default router