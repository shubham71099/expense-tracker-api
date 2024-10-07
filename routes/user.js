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

module.exports = router;
