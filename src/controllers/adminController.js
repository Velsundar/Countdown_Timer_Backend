import User from "../models/User.js";
import Streak from "../models/Streak.js";
import Event from "../models/Event.js";
export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const streaks = await Streak.find();

    const totalTaps = streaks.reduce((sum, s) => sum + s.totalTaps, 0);
    const avgHeart = streaks.length
      ? streaks.reduce((sum, s) => sum + s.heartFillPercentage, 0) / streaks.length
      : 0;

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalTaps,
        avgHeartFill: avgHeart.toFixed(2),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Error fetching dashboard stats." });
  }
};
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Error fetching users." });
  }
};

export const updateEvent = async (req, res) => {
  try {
        console.log("Request body for admin update user",req?.body)

    const { name, date, description } = req.body;
    if (!["engagement", "marriage"].includes(name)) {
      return res.status(400).json({ success: false, error: "Invalid event name." });
    }

    const updated = await Event.findOneAndUpdate(
      { name },
      { 
        $set: {
          date, 
          description 
        }
      },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json({ success: true, message: "Event updated.", data: updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Error updating event." });
  }
};
