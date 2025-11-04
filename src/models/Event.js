import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      enum: ["engagement", "marriage"],
      unique: true,
    },
    date: {
      type: Date,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Event", eventSchema);
