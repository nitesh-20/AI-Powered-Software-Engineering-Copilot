import { Router } from "express";
import {
  analyzeRepository,
  submitRepository
} from "../controllers/repositoryController.js";

const router = Router();

router.post("/", submitRepository);
router.post("/analyze", analyzeRepository);

export default router;
