import express from "express";
import { submitResource } from "../controllers/submissionController";

const router = express.Router();

router.post("/", submitResource);

export default router