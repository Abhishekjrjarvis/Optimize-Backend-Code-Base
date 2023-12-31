const mongoose = require("mongoose");

const repaySchema = new mongoose.Schema({
  repayAmount: {
    type: Number,
    default: 0,
  },
  repayStatus: {
    type: String,
    default: "Pending",
  },
  message: {
    type: String,
  },
  txnId: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  institute: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "InstituteAdmin",
  },
  bank_account: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BankAccount",
    },
  ],
  bank_account_count: {
    type: Number,
    default: 0,
  },
  excel_attach: {
    type: String,
  },
  settlement_date: {
    type: String,
  },
});

module.exports = mongoose.model("RePay", repaySchema);
