const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const LoggedUser = require("../models/LoggedUser");
const populateUserId = require("../middlewares/auth");

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { email, password, name } = req.body;
    let user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ message: "Email is already in use, please login." });
    }

    user = new User({ email, password, name });
    await user.save();

    return res.status(200).json({ message: "User registered successfully." });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Account does not exist, please register first." });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect email or password." });
    }

    const loggedInCount = await LoggedUser.countDocuments({ userId: user._id });
    if (loggedInCount >= 2) {
      return res.status(400).json({ 
        message: "Already Logged in on 2 devices. Please log out from one." 
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "365d",
    });

    const newLoggedUser = new LoggedUser({ userId: user._id });
    await newLoggedUser.save();

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/logout",populateUserId, async (req, res) => {
  try {
    const userId = req.userId;

    const result = await LoggedUser.findOneAndDelete({ userId });

    if (!result) {
      return res.status(400).json({ message: "No logged in sessions found for this user." });
    }

    return res.json({ message: "Logged out successfully." });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});


module.exports = router;
