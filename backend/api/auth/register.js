const express = require("express");
const bcrypt = require("bcryptjs");
const { User } = require("../../model/taskModel");

const router = express.Router();

router.post("/", async (req, res) => {
  const values = req.body;
  
  try {
    const user = await User.findOne({ email: values.email });
    if (user) {
      return res.status(401).json({ message: "User Already exits kindly login" });
    }

    const hashedPassword = await bcrypt.hash(values.password, 10);

    const newUser = new User({
      name: values.name,
      email: values.email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();
    if (!savedUser) {
      return res.status(400).json({ message: "Failed to create user" });
    }

    res.json({ message: "Register successful" }).status(200);
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
