import express from "express";
import { recordDailyTap, getUserStreak } from "../controllers/streakController.js";

const router = express.Router();

router.post("/tap", recordDailyTap);
router.get("/:email", getUserStreak);

export default router;
