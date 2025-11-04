import express from "express";
import { createOrFetchUser,getUserByEmail } from "../controllers/UserController.js";


const router = express.Router();

router.post("/", createOrFetchUser);
router.get("/:email", getUserByEmail);

export default router;
