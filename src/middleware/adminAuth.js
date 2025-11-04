import dotenv from "dotenv";
dotenv.config();

export const verifyAdmin = (req, res, next) => {
  const token = req.headers["x-admin-token"];

  if (!token || token !== process.env.ADMIN_TOKEN) {
    return res.status(401).json({ success: false, error: "Unauthorized admin access." });
  }

  next();
};
