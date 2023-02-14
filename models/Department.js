const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema({
  dName: { type: String, required: true },
  dTitle: { type: String, required: true },
  dEmail: { type: String },
  dPhoneNumber: { type: Number, minlength: 10 },
  dOperatingAdmin: { type: String },
  dStudentRepr: { type: String },
  dVision: { type: String },
  dMission: { type: String },
  dAbout: { type: String },
  dStaffTotal: { type: Number },
  dStudentTotal: { type: Number },
  dAwards: { type: String },
  dSpeaker: { type: String },
  dStudentPresident: { type: String },
  dAdminClerk: { type: String },
  dVicePrinciple: { type: String },
  photoId: { type: String, default: "1" },
  photo: { type: String },
  coverId: { type: String, default: "2" },
  cover: { type: String },
  departmentClassMasters: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ClassMaster",
    },
  ],
  departmentSubjectMasters: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubjectMaster",
    },
  ],

  departmentSelectBatch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Batch",
  },
  userBatch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Batch",
  },
  institute: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "InstituteAdmin",
  },
  dHead: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Staff",
  },
  batches: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Batch",
    },
  ],
  exams: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
    },
  ],
  checklists: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Checklist",
    },
  ],
  fees: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Fees",
    },
  ],
  departmentChatGroup: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Staff",
    },
  ],

  holiday: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Holiday",
    },
  ],
  class: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
    },
  ],
  ApproveStudent: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
    },
  ],
  studentComplaint: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Complaint",
    },
  ],
  idCardField: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Field",
    },
  ],
  classMasterCount: {
    type: Number,
    default: 0,
  },
  subjectMasterCount: {
    type: Number,
    default: 0,
  },
  classCount: {
    type: Number,
    default: 0,
  },
  batchCount: {
    type: Number,
    default: 0,
  },
  staffCount: {
    type: Number,
    default: 0,
  },
  studentCount: {
    type: Number,
    default: 0,
  },
  displayPersonList: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DisplayPerson",
    },
  ],
  activeTimeDayWise: [
    {
      day: String,
      from: String,
      to: String,
      half: String,
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  activeTimeDateWise: [
    {
      day: String,
      date: {
        type: Date,
      },
      from: String,
      to: String,
      half: String,
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  election_event: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Election",
    },
  ],
  election_event_count: {
    type: Number,
    default: 0,
  },
  participate_event: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Participate",
    },
  ],
  participate_event_count: {
    type: Number,
    default: 0,
  },
  onlineFee: {
    type: Number,
    default: 0,
  },
  election_date_setting: {
    end_date: { type: Number, default: 3 },
    select_date: { type: Number, default: 2 },
    campaign_date: { type: Number, default: 1 },
    campaign_last_date: { type: Number, default: 6 },
    vote_date: { type: Number, default: 1 },
    result_date: { type: Number, default: 1 },
  },
  fees_structures: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FeeStructure",
    },
  ],
  fees_structures_count: {
    type: Number,
    default: 0,
  },
});

const Department = mongoose.model("Department", departmentSchema);

module.exports = Department;
