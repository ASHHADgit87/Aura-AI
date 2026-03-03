import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "24h" });
};

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      username: name,
      email,
      password: hashedPassword,
    });

    const token = generateToken(user._id);
    res.json({
      success: true,
      token,
      user: { name: user.username, email: user.email },
    });
  } catch (error) {
    res.json({ success: false, message: "Registration failed" });
  }
};

// src/controllers/authController.js

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = generateToken(user._id);
      res.json({
        success: true,
        token,
        user: { name: user.username, email: user.email }, 
      });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};