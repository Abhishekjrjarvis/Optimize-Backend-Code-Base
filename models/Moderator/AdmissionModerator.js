const mongoose = require("mongoose");

const admissionModeratorSchema = new mongoose.Schema({
  access_role: {
    type: String,
    required: true,
  },
  access_staff: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Staff",
    required: true,
  },
  access_application: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "NewApplication",
    },
  ],
  active_tab: {
    role: { type: String },
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  permission: {
    allow: { type: Boolean, default: true },
    bound: [],
    addons: [],
  },
  admission: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admission",
  },
  hostel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hostel",
  },
});

module.exports = mongoose.model("AdmissionModerator", admissionModeratorSchema);
