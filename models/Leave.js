const mongoose = require("mongoose");

const leaveSchema = new mongoose.Schema({
  reason: {
    type: String,
    required: true,
  },
  date: [{ type: String }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  institute: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "InstituteAdmin",
  },
  staff: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Staff",
  },
  status: {
    type: String,
    default: "Request",
  },
  attach: {
    type: String
  },
  leave_type: {
    type: String
  },
  granted_on: {
    type: Date
  }
});

const Leave = mongoose.model("Leave", leaveSchema);

module.exports = Leave;
