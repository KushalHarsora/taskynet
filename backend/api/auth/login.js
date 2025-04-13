const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../../model/taskModel");

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

router.post("/", async (req, res) => {
  const values = req.body;

  try {

    const user = await User.findOne({ email: values.email });
    if (!user) {
      return res.status(401).json({ message: "User Not Found" });
    }

    const isMatch = await bcrypt.compare(values.password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 24 * 60 * 60 * 1000,
    }).json({ message: "Login successful", name: user.name }).status(200);

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
