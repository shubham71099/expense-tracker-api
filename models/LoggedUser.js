const mongoose = require("mongoose");

const LoggedUserSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  loginTime: { type: Date, default: Date.now },
});

const LoggedUser = mongoose.model("LoggedUser", LoggedUserSchema);
module.exports = LoggedUser;
