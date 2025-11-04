import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";
import connectDB from "./src/config/database.js";
import userRoutes from "./src/routes/User.js";
import streakRoutes from "./src/routes/Streaks.js";
import countdownRoutes from "./src/routes/Countdowns.js";
import adminRoutes from "./src/routes/admins.js";
import "./src/utils/reminderJobs.js";
import { apiLimiter } from "./src/middleware/rateLimiter.js";
import { errorHandler } from "./src/middleware/errorHandler.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(compression());
app.use(express.json());
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use("/api", apiLimiter);
app.use("/api/users", userRoutes);
app.use("/api/streaks", streakRoutes);
app.use("/api/countdowns", countdownRoutes);
app.use("/api/admin", adminRoutes);
app.use(errorHandler);
app.use(helmet());

// Connect to Database
connectDB();

// Sample route
app.get("/", (req, res) => {
  res.send("Wedding Countdown API is running 🎉");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
