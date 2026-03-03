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
