import cron from "node-cron";
import User from "../models/User.js";
import Streak from "../models/Streak.js";
import { sendEmail } from "./emailServices.js";

// Run every day at 9 AM IST
cron.schedule("0 9 * * *", async () => {
  console.log("🕘 Running daily reminder job...");
  const users = await User.find({ notificationPreference: true });

  for (const user of users) {
    const streak = await Streak.findOne({ userId: user._id });
    if (!streak) continue;

    const now = new Date();
    const lastTap = new Date(
      streak.lastTapDate.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    );
    const diffDays = Math.floor(
      (now - lastTap) / (1000 * 60 * 60 * 24)
    );

    if (diffDays >= 1) {
      const subject = "💖 Don’t forget your daily heart tap!";
      const html = `
        <h2>Hi ${user.name},</h2>
        <p>Your heart is waiting for today’s tap! Keep your streak alive 💪</p>
        <p>Current streak: ${streak.currentStreak} days</p>
        <br/>
        <small>— Mrge Timer</small>
      `;
      await sendEmail(user.email, subject, html);
    }
  }
});
