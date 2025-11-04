import mongoose from "mongoose";

const streakSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    currentStreak: {
      type: Number,
      default: 0,
    },
    longestStreak: {
      type: Number,
      default: 0,
    },
    totalTaps: {
      type: Number,
      default: 0,
    },
    lastTapDate: {
      type: Date,
      default: null,
    },
    heartFillPercentage: {
      type: Number,
      default: 0,
    },
    milestones: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Streak", streakSchema);
