import User from "../models/User.js";

export const createOrFetchUser = async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        error: "Name and email are required.",
      });
    }

    let user = await User.findOne({ email });

    if (user) {
      user.lastVisit = new Date();
      user.totalVisits += 1;
      await user.save();

      return res.status(200).json({
        success: true,
        message: "Welcome back!",
        data: user,
      });
    }

    user = await User.create({
      name,
      email,
      phone,
      firstVisit: new Date(),
      lastVisit: new Date(),
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully!",
      data: user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      error: "Server error while creating or fetching user.",
    });
  }
};

export const getUserByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      error: "Server error while fetching user.",
    });
  }
};
