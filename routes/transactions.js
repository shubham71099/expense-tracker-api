const express = require("express");
const Transaction = require("../models/Transaction");
const populateUserId = require("../middlewares/auth");
const router = express.Router();

router.use(populateUserId);

router.post("/", async (req, res) => {
  try {
    const { amount, account, category, date, note, type } = req.body;
    const userId = req.userId;
    const transaction = new Transaction({
      amount,
      account,
      category,
      date,
      note,
      type,
      userId,
    });
    await transaction.save();
    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const userId = req.userId;
    const startDate = new Date(req.query.startDate);
    const endDate = new Date(req.query.endDate);
    const transactions = await Transaction.find({
      userId,
      date: {
        $gte: startDate,
        $lt: endDate,
      },
    });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
