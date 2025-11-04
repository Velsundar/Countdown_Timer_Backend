import express from "express";
import { getDashboardStats, getAllUsers, updateEvent } from "../controllers/adminController.js";
import { verifyAdmin } from "../middleware/adminAuth.js";

const router = express.Router();

router.get("/stats", verifyAdmin, getDashboardStats);
router.get("/users", verifyAdmin, getAllUsers);
router.put("/events", verifyAdmin, updateEvent);

export default router;
