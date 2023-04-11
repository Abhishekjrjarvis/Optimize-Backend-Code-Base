const mongoose = require("mongoose");

const seatingSchema = new mongoose.Schema({
  seat_block_name: {
    type: String,
    required: true,
  },
  seat_block_class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
  },
  seat_block_staff: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Staff",
  },
  seat_valid_staff: {
    type: String,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  seat_exam_paper_array: [
    {
      subjectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subject",
      },
      subjectName: { type: String, required: true },
      totalMarks: { type: Number, required: true },
      date: { type: String, required: true },
      startTime: { type: String, required: true },
      endTime: { type: String, required: true },
      duration: { type: String, default: 0 },
      subjectMasterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubjectMaster",
      },
      from: { type: String },
      to: { type: String },
    },
  ],
  exam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Exam",
  },
});

module.exports = mongoose.model("Seating", seatingSchema);
