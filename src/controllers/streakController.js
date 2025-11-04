import Streak from "../models/Streak.js";
import User from "../models/User.js";
import { sendEmail } from "../utils/emailServices.js"; // Add at top

const FILL_INCREMENT = 3.33; // each tap adds ~3.33% (30 taps = full heart)

export const recordDailyTap = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, error: "Email required." });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found." });
    }

    // Find or create streak entry
    let streak = await Streak.findOne({ userId: user._id });
    const now = new Date();
    const todayIST = new Date(
      now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    );
    const todayDateOnly = todayIST.toISOString().split("T")[0]; // YYYY-MM-DD

    if (!streak) {
      streak = await Streak.create({
        userId: user._id,
        currentStreak: 1,
        longestStreak: 1,
        totalTaps: 1,
        lastTapDate: todayIST,
        heartFillPercentage: FILL_INCREMENT,
        milestones: []
      });

      return res.status(201).json({
        success: true,
        message: "First tap recorded! 🎉",
        data: streak
      });
    }

    // Check if already tapped today (IST)
    const lastTapIST = new Date(
      streak.lastTapDate.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    );
    const lastTapDateOnly = lastTapIST.toISOString().split("T")[0];

    if (lastTapDateOnly === todayDateOnly) {
      return res.status(400).json({
        success: false,
        error: "You have already tapped today! Come back tomorrow ❤️"
      });
    }

    // Check if yesterday’s tap exists (to continue streak)
    const yesterday = new Date(todayIST);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayDateOnly = yesterday.toISOString().split("T")[0];

    if (lastTapDateOnly === yesterdayDateOnly) {
      streak.currentStreak += 1;
    } else {
      streak.currentStreak = 1; // reset streak
    }

    streak.longestStreak = Math.max(streak.longestStreak, streak.currentStreak);
    streak.totalTaps += 1;
    streak.lastTapDate = todayIST;
    streak.heartFillPercentage = Math.min(
      100,
      streak.heartFillPercentage + FILL_INCREMENT
    );

    // milestone logic
    const newMilestones = [];
    if (streak.currentStreak === 7 && !streak.milestones.includes("7days")) {
      newMilestones.push("7days");
    }
    if (streak.currentStreak === 14 && !streak.milestones.includes("14days")) {
      newMilestones.push("14days");
    }
    if (streak.currentStreak === 21 && !streak.milestones.includes("21days")) {
      newMilestones.push("21days");
    }
    if (streak.currentStreak === 30 && !streak.milestones.includes("30days")) {
      newMilestones.push("30days");
    }
    if (
      streak.heartFillPercentage >= 100 &&
      !streak.milestones.includes("100percent")
    ) {
      newMilestones.push("100percent");
    }

    streak.milestones = [...new Set([...streak.milestones, ...newMilestones])];

    if (newMilestones.length > 0) {
      let subject = "🎉 You unlocked a milestone!";
      let html = `
    <h2>Hi ${user.name} 💖</h2>
    <p>Congratulations! You've unlocked these new milestones:</p>
    <ul>${newMilestones.map(m => `<li>${m}</li>`).join("")}</ul>
    <p>Keep up your streak and spread more love every day!</p>
    <br/>
    <h4>Regards,</h4>
    <br/>
    <small>—- Sundaravel ❤️ Ranjitha</small>
  `;

      sendEmail(user.email, subject, html);
    }
    if (streak.heartFillPercentage >= 100 && !streak.milestones.includes("100percent")) {
      const subject = "💯 Your heart is full!";
      const html = `
    <h2>Hi ${user.name} 💘</h2>
    <p>Your heart is now <strong>100% full</strong> with love!</p>
    <p>We’re so proud of your consistency — take a moment to celebrate!</p>
    <br/>
    <small>— Mrge Timer 💍</small>
  `;
      sendEmail(user.email, subject, html);
    }

    await streak.save();

    res.status(200).json({
      success: true,
      message: "Tap recorded successfully 💖",
      data: streak
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, error: "Server error while recording tap." });
  }
};

// GET /api/streaks/:email — fetch user streak
export const getUserStreak = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ success: false, error: "User not found." });

    const streak = await Streak.findOne({ userId: user._id });
    if (!streak)
      return res.status(200).json({
        success: true,
        data: {
          currentStreak: 0,
          longestStreak: 0,
          totalTaps: 0,
          heartFillPercentage: 0,
          milestones: []
        }
      });

    res.status(200).json({ success: true, data: streak });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, error: "Server error while fetching streak." });
  }
};
