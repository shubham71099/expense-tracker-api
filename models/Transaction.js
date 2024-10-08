const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  account: { type: String, required: true },
  category: { type: String, required: true },
  date: { type: Date, required: true },
  note: { type: String, required: false },
  type: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
});

const Transaction = mongoose.model("Transaction", TransactionSchema);
module.exports = Transaction;
