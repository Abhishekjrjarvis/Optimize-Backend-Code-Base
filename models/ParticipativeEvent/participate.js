const mongoose = require("mongoose");

const participateEventSchema = new mongoose.Schema({
  event_name: {
    type: String,
    required: true,
  },
  event_date: {
    type: String,
    required: true,
  },
  event_fee: {
    type: Number,
    default: 0,
  },
  event_about: {
    type: String,
  },
  event_classes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
    },
  ],
  event_app_last_date: {
    type: String,
    required: true,
  },
  event_fee_critiria: {
    type: String,
    default: "No",
  },
  event_checklist_critiria: {
    type: String,
    default: "No",
  },
  event_ranking_critiria: {
    type: String,
    default: "No",
  },
  department: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
    },
  ],
  created_at: {
    type: Date,
    default: Date.now,
  },
  event_fee_array: [
    {
      student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
      },
      fee_status: { type: String, default: "Not Paid" },
    },
  ],
  event_checklist: [
    {
      student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "student",
      },
      checklist_status: { type: String, default: "Not Alloted" },
    },
  ],
  event_rank: [
    {
      student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "student",
      },
      rank_title: { type: String, default: "Participant" },
      points: { type: Number, default: 5 },
    },
  ],
  online_fee: {
    type: Number,
    default: 0,
  },
  paid_participant: {
    type: Number,
    default: 0,
  },
  assigned_checklist_count: {
    type: Number,
    default: 0,
  },
  event_status: {
    type: String,
    default: "Ongoing",
  },
  result_notification: {
    type: String,
    default: "Not Declare",
  },
  apply_student: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
    },
  ],
  apply_student_count: {
    type: Number,
    default: 0,
  },
  event_manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "EventManager",
  },
});

module.exports = mongoose.model("Participate", participateEventSchema);
