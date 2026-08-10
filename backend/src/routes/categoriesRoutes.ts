import express from "express";
import { getCategoriesWithCount } from "../controllers/categoriesController";

const router = express.Router();

router.get("/", getCategoriesWithCount);

export default router