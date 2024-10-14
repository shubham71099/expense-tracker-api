const express = require("express");
const User = require("../models/user");
const populateUserId = require("../middlewares/auth");
const router = express.Router();

router.use(populateUserId);

router.get("/profile", async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({
      email: user.email,
      name: user.name,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/profile", async (req, res) => {
  try {
    const userId = req.userId;
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser._id.toString() !== userId) {
      return res
        .status(400)
        .json({ message: "Email is already in use by another account." });
    }

    const user = await User.findOneAndUpdate(
      { _id: userId },
      { name, email },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "Profile updated successfully",
      email: user.email,
      name: user.name,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;