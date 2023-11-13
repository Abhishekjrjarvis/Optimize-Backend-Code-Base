const mongoose = require("mongoose");

const otpCodeSchema = new mongoose.Schema({
  otp_number: {
    type: String,
  },
  otp_email: {
    type: String,
  },
  otp_code: {
    type: String,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  otp_qid: {
    type: String
  }
});

module.exports = mongoose.model("OTPCode", otpCodeSchema);
