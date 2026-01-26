import User from "../models/User.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendOTPEmail } from "../utils/sendEmail.js"
import jwt from "jsonwebtoken";

// REGISTER
export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "User registered successfully",
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// LOGIN
export const loginUser = async (req, res) => {
  console.log("JWT_SECRET:", process.env.JWT_SECRET);

  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    // 🔐 Generate OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    await sendOTPEmail(user.email, otp);
    user.otp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000; // 5 minutes
    await user.save();   // 🔴 THIS WAS MISSING

    console.log("OTP (debug):", otp);

    res.status(200).json({
      message: "OTP sent to email",
      userId: user._id,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { userId, otp } = req.body;

    const user = await User.findById(userId);

    // 🔐 OTP VALIDATION
    if (
      !user ||
      user.otp !== String(otp) ||
      user.otpExpires < Date.now()
    ) {
      return res.status(401).json({ message: "Invalid or expired OTP" });
    }

    // 🔐 CLEAR OTP
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    // 🔐 GENERATE JWT
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // 🔐 SEND RESPONSE (THIS WAS MISSING / BROKEN)
    return res.status(200).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
      },
    });

  } catch (error) {
    console.error("VERIFY OTP ERROR:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};