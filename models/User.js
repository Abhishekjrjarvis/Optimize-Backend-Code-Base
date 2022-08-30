const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userPhoneNumber: { type: Number, maxlength: 10 },
  userEmail: { type: String, unique: true },
  userPassword: { type: String, minlength: 10 },
  userStatus: { type: String, default: "Not Verified" },
  username: { type: String, required: true, unique: true },
  userLegalName: { type: String },
  userDateOfBirth: { type: String },
  userGender: { type: String },
  userAddress: { type: String },
  userBio: { type: String },
  userPassword: { type: String },
  userAbout: { type: String },
  userCity: { type: String },
  userState: { type: String },
  userCountry: { type: String },
  userHobbies: { type: String },
  userEducation: { type: String },
  referalPercentage: { type: Number, default: 0 },
  profilePhoto: { type: String },
  google_avatar: { type: String },
  profileCoverPhoto: { type: String },
  photoId: { type: String },
  coverId: { type: String },
  isSubjectTeacher: { type: String, default: "No" },
  userPosts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
  staff: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Staff",
    },
  ],
  userFollowers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  userFollowing: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  userCircle: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  student: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
    },
  ],
  userInstituteFollowing: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InstituteAdmin",
    },
  ],
  InstituteReferals: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InstituteAdmin",
    },
  ],
  announcement: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserAnnouncement",
    },
  ],
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Role",
  },
  addUser: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  addUserInstitute: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InstituteAdmin",
    },
  ],
  activeStatus: {
    type: String,
    default: "Activated",
  },
  activeDate: {
    type: String,
  },
  followerCount: {
    type: Number,
    default: 0,
  },
  followingUICount: {
    type: Number,
    default: 0,
  },
  circleCount: {
    type: Number,
    default: 0,
  },
  postCount: {
    type: Number,
    default: 0,
  },
  videoLike: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
    },
  ],
  videoSave: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
    },
  ],
  watchLater: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
    },
  ],
  playlistJoin: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Playlist",
    },
  ],
  playlistPayment: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PlaylistPayment",
    },
  ],
  videoPurchase: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
    },
  ],
  applicationPaymentList: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DepartmentApplication",
    },
  ],
  admissionPaymentList: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DepartmentApplication",
    },
  ],
  transferInstitute: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InstituteAdmin",
    },
  ],
  support: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserSupport",
    },
  ],
  createdAt: {
    type: String,
  },
  remindLater: {
    type: String,
  },
  appliedForApplication: [
    {
      appName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "DepartmentApplication",
      },
      appUpdates: [
        {
          notificationType: { type: Number },
          notification: { type: String },
          actonBtnText: { type: String },
          deActBtnText: { type: String },
        },
      ],
    },
  ],
  preAppliedStudent: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PreAppliedStudent",
    },
  ],
  uNotify: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Notification",
    },
  ],
  displayPersonArray: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DisplayPerson",
    },
  ],
  starAnnouncement: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InsAnnouncement",
    },
  ],
  recoveryMail: {
    type: String,
  },
  qvipleAccount: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
  },
  isSubjectChat: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
    },
  ],
  isAdmin: {
    type: Boolean,
    required: true,
    default: false,
  },
  recentChat: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
    },
  ],
  deviceToken: {
    type: String,
  },
  referralArray: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Referral",
    },
  ],
  userCommission: {
    type: Number,
    default: 0,
  },
  userEarned: {
    type: Number,
    default: 0,
  },
  referralStatus: {
    type: String,
    default: "Not Granted",
  },
  ageRestrict: {
    type: String,
    default: "No",
  },
  paymentStatus: {
    type: String,
    default: "Not Paid",
  },
  supportChat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SupportChat",
  },
  questionCount: {
    type: Number,
    default: 0,
  },
  answerQuestionCount: {
    type: Number,
    default: 0,
  },
  poll_Count: {
    type: Number,
    default: 0,
  },
  answered_query: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Answer",
    },
  ],
  user_birth_privacy: {
    type: String,
    default: 'Every one'
  },
  user_address_privacy: {
    type: String,
    default: 'Every one'
  },
  user_circle_privacy: {
    type: String,
    default: 'Every one'
  },
  tag_privacy: {
    type: String,
    default: 'Every one'
  },
  user_saved_post: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
  tag_post: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
  applicationStatus: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Status",
    },
  ],
  applyApplication: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "NewApplication",
    },
  ],
  created_at: {
    type: Date,
    default: Date.now
  }
});

userSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Post.deleteMany({
      _id: {
        $in: doc.userPosts,
      },
    });
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
