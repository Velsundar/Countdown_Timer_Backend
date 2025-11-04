import express from "express";
import { getCountdown, setEventDate } from "../controllers/countdownController.js";

const router = express.Router();

router.get("/:event", getCountdown);
router.post("/", setEventDate); // optional admin endpoint

export default router;
