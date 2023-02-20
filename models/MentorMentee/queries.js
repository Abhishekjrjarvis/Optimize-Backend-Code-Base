const mongoose = require("mongoose");

const querySchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
  },
  raised_on: {
    type: Date,
    default: Date.now,
  },
  query_status: {
    type: String,
    default: "UnSolved",
  },
  query: {
    type: String,
  },
  remark: {
    type: String,
  },
  remark_by: {
    type: String,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  mentor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Mentor",
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
  },
});

module.exports = mongoose.model("Queries", querySchema);