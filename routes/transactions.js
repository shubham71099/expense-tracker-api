const express = require("express");
const Transaction = require("../models/Transaction");
const populateUserId = require("../middlewares/auth");
const router = express.Router();
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;

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

router.delete("/:id", async (req, res) => {
  try {
    const userId = req.userId;
    const transactionId = req.params.id;

    if (!ObjectId.isValid(transactionId)) {
      return res.status(400).json({ message: "Invalid transaction ID format" });
    }

    const transaction = await Transaction.findOne({
      _id: transactionId,
      userId: userId,
    });

    if (!transaction) {
      return res
        .status(404)
        .json({ message: "Transaction not found or not authorized" });
    }

    await Transaction.deleteOne({ _id: transactionId });
    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    console.error("Error in delete transaction:", error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
