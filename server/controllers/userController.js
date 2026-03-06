import User from "../models/user.js";
export const getMe = async (req, res) => {
  try {
    if (!req.user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.json({
      success: true,
      user: {
        name: req.user.username,
        email: req.user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findOne();

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "No user found to delete" });
    }

    await User.findByIdAndDelete(user._id);

    res.json({ success: true, message: "Account deleted successfully" });
  } catch (error) {
    console.error("Delete Error:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Server Error: Could not delete account",
      });
  }
};
