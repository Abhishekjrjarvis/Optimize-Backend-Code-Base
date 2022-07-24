const InstituteAdmin = require("../../models/InstituteAdmin");
const User = require("../../models/User");
const Staff = require("../../models/Staff");
const Post = require("../../models/Post");
const Notification = require("../../models/notification");
const InsAnnouncement = require("../../models/InsAnnouncement");
const Student = require("../../models/Student");
const Comment = require("../../models/Comment");
const Department = require("../../models/Department");
const InsDocument = require("../../models/Document/InsDocument");
const Admin = require("../../models/superAdmin");
const Report = require("../../models/Report");
const Batch = require("../../models/Batch");
const InstituteSupport = require("../../models/InstituteSupport");
const Complaint = require("../../models/Complaint");
const Transfer = require("../../models/Transfer");
const DisplayPerson = require("../../models/DisplayPerson");
const Finance = require("../../models/Finance");
const Library = require("../../models/Library");
const Subject = require("../../models/Subject");
const AdmissionAdmin = require("../../models/AdmissionAdmin");
const Class = require("../../models/Class");
const Leave = require("../../models/Leave");
const ClassMaster = require("../../models/ClassMaster");
const SubjectMaster = require("../../models/SubjectMaster");
const ReplyAnnouncement = require("../../models/ReplyAnnouncement");
const invokeFirebaseNotification = require("../../Firebase/firebase");
const {
  getFileStream,
  uploadDocFile,
  uploadVideo,
  uploadFile,
} = require("../../S3Configuration");
const fs = require("fs");
const util = require("util");
const unlinkFile = util.promisify(fs.unlink);

exports.getAllIns = async (req, res) => {
  try {
    const institute = await InstituteAdmin.find({});
    res.status(200).send({ message: "All Institute List", institute });
  } catch (e) {
    console.log(`Error`, e.message);
  }
};

exports.getOneIns = async (req, res) => {
  try {
    const { id } = req.params;
    const institute = await InstituteAdmin.findById({ _id: id })
      .populate({
        path: "posts",
        populate: {
          path: "comment",
          populate: {
            path: "institutes",
          },
        },
      })
      .populate({
        path: "announcement",
        select: "insAnnTitle insAnnPhoto insAnnDescription insAnnVisibility",
      })
      .populate("staff")
      .populate({
        path: "ApproveStaff",
        populate: {
          path: "user",
        },
      })
      .populate({
        path: "depart",
        populate: {
          path: "dHead",
        },
      })
      .populate("followers")
      .populate("following")
      .populate("classRooms")
      .populate("student")
      .populate("ApproveStudent")
      .populate({
        path: "saveInsPost",
        populate: {
          path: "institute",
        },
      })
      .populate({
        path: "posts",
        populate: {
          path: "insLike",
        },
      })
      .populate("userFollowersList")
      .populate({
        path: "posts",
        populate: {
          path: "insUserLike",
        },
      })
      .populate("financeDepart")
      .populate("sportDepart")
      .populate("addInstitute")
      .populate("addInstituteUser")
      .populate({
        path: "leave",
        populate: {
          path: "staff",
        },
      })
      .populate({
        path: "transfer",
        populate: {
          path: "staff",
        },
      })
      .populate({
        path: "studentComplaints",
        populate: {
          path: "student",
        },
      })
      .populate({
        path: "groupConversation",
      })
      .populate("idCardField")
      .populate("idCardBatch")
      .populate("AllUserReferral")
      .populate("AllInstituteReferral")
      .populate("instituteReferral")
      .populate({
        path: "supportIns",
        populate: {
          path: "institute",
        },
      })
      .populate({
        path: "posts",
        populate: {
          path: "comment",
          populate: {
            path: "instituteUser",
          },
        },
      })
      .populate("userReferral")
      .populate("insAdmissionAdmin");
    res.status(200).send({ message: "Your Institute", institute });
  } catch (e) {
    console.log(`Error`, e.message);
  }
};

exports.getDashOneQuery = async (req, res) => {
  try {
    const { id } = req.params;
    const institute = await InstituteAdmin.findById({ _id: id })
      .select(
        "insName name insAbout photoId status insProfilePhoto financeDetailStatus financeStatus financeDepart unlockAmount accessFeature activateStatus"
      )
      .populate({
        path: 'supportChat',
        populate: {
          path: 'latestMessage'
        }
      })
      .populate({
        path: 'supportChat',
        populate: {
          path: 'message'
        }
      })
      .lean()
      .exec();
    res.status(200).send({ message: "limit Ins Data", institute });
  } catch {}
};

exports.getProfileOneQuery = async (req, res) => {
  try {
    const { id } = req.params;
    const institute = await InstituteAdmin.findById({ _id: id })
      .select(
        "insName status photoId insProfilePhoto accessFeature coverId insRegDate departmentCount announcementCount admissionCount insType insMode insAffiliated insAchievement joinedCount staffCount studentCount insProfileCoverPhoto followersCount name followingCount postCount insAbout insEmail insAddress insEstdDate createdAt insPhoneNumber insAffiliated insAchievement insOperatingAdmin insPrinciple insTrusty insStudentPresident insAdminClerk"
      )
      .lean()
      .exec();
    res.status(200).send({ message: "Limit Post Ins", institute });
  } catch {}
};

exports.getSettingPersonal = async (req, res) => {
  try {
    const { id } = req.params;
    const institute = await InstituteAdmin.findById({ _id: id })
      .select(
        "insName name photoId insProfilePhoto insEmail status insAddress insMode insType insAbout insAffiliated insAchievement insEstdDate createdAt insEditableText insEditableTexts insPhoneNumber"
      )
      .lean()
      .exec();
    if (institute) {
      res.status(200).send({ message: "Success", institute });
    } else {
      res.status(404).send({ message: "Failure" });
    }
  } catch {}
};

exports.getSwitchAccounts = async (req, res) => {
  try {
    const { id } = req.params;
    const institute = await InstituteAdmin.findById({ _id: id })
      .populate({
        path: "addInstituteUser",
        select: "userLegalName username photoId profilePhoto",
      })
      .populate({
        path: "addInstitute",
        select: "insName name photoId insProfilePhoto",
      })
      .select("_id")
      .lean()
      .exec();
    if (institute) {
      res.status(200).send({ message: "Success", institute });
    } else {
      res.status(404).send({ message: "Failure" });
    }
  } catch {}
};

exports.getCQCoins = async (req, res) => {
  try {
    const { id } = req.params;
    const institute = await InstituteAdmin.findById({ _id: id })
      .select(
        "insFreeLastData insPaymentLastDate insType insFreeCredit referalPercentage transferCredit rejectReason -insPassword"
      )
      .populate({
        path: "ApproveStudent",
        select: "studentFirstName",
      })
      .populate({
        path: "instituteReferral",
        select: "insName name photoId insProfilePhoto",
      })
      .populate({
        path: "userReferral",
        select: "userLegalName username photoId profilePhoto",
      })
      .lean()
      .exec();
    if (institute) {
      res.status(200).send({ message: "Success", institute });
    } else {
      res.status(404).send({ message: "Failure" });
    }
  } catch {}
};

exports.getAnnouncementArray = async (req, res) => {
  try {
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const { id } = req.params;
    const skip = (page - 1) * limit;
    const institute = await InstituteAdmin.findById({ _id: id }).populate({
      path: "announcement",
    });
    const announcement = await InsAnnouncement.find({
      _id: { $in: institute.announcement },
    })
      .select(
        "insAnnPhoto photoId insAnnTitle insAnnVisibilty insAnnDescription createdAt"
      )
      .populate({
        path: "reply",
        select: "replyText createdAt replyAuthorAsUser replyAuthorAsIns",
      })
      .populate({
        path: "institute",
        select: "insName name photoId insProfilePhoto",
      })
      .sort("-createdAt")
      .limit(limit)
      .skip(skip);
    res.status(200).send({ message: "all announcement list", announcement });
  } catch (e) {
    console.log(e);
  }
};

exports.getAllPostIns = async (req, res) => {
  try {
    const { id } = req.params;
    const institute = await InstituteAdmin.findById({ _id: id });
    res.render("post", { institute });
  } catch (e) {
    console.log(`Error`, e.message);
  }
};

exports.getNotificationIns = async (req, res) => {
  try {
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const id = req.params.id;
    const skip = (page - 1) * limit;
    const institute = await InstituteAdmin.findById({ _id: id }).populate({
      path: "iNotify",
    });

    const notify = await Notification.find({ _id: { $in: institute.iNotify } })
      .populate({
        path: "notifyByInsPhoto",
        select: "photoId insProfilePhoto",
      })
      .populate({
        path: "notifyByPhoto",
        select: "photoId profilePhoto",
      })
      .populate({
        path: "notifyByStaffPhoto",
        select: "photoId staffProfilePhoto",
      })
      .populate({
        path: "notifyByStudentPhoto",
        select: "photoId studentProfilePhoto",
      })
      .populate({
        path: "notifyByDepartPhoto",
        select: "photoId photo",
      })
      .sort("-notifyTime")
      .limit(limit)
      .skip(skip);
    res.status(200).send({ message: "Notification send", notify });
  } catch (e) {
    console.log("Error", e.message);
  }
};

exports.getNotifyReadIns = async (req, res) => {
  try {
    const { rid } = req.params;
    const read = await Notification.findById({ _id: rid });
    read.notifyReadStatus = "Read";
    await read.save();
    res.status(200).send({ message: "updated" });
  } catch (e) {
    console.log("Error", e.message);
  }
};

exports.getDeleteNotifyIns = async (req, res) => {
  try {
    const { id, nid } = req.params;
    const institute = await InstituteAdmin.findByIdAndUpdate(id, {
      $pull: { iNotify: nid },
    });
    const notify = await Notification.findByIdAndDelete({ _id: nid });
    res.status(200).send({ message: "Deleted" });
  } catch (e) {
    console.log("Error", e.message);
  }
};

exports.getHideNotifyIns = async (req, res) => {
  try {
    const { id, nid } = req.params;
    const notify = await Notification.findById({ _id: nid });
    notify.notifyVisibility = "hide";
    await notify.save();
    res.status(200).send({ message: "Hide" });
  } catch (e) {
    console.log("Error", e.message);
  }
};

exports.getCreatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const institute = await InstituteAdmin.findById({ _id: id });
    const post = new Post({ ...req.body });
    post.imageId = "1";
    institute.posts.push(post);
    post.institute = institute._id;
    await institute.save();
    await post.save();
    res.status(200).send({ message: "Your Institute", institute });
  } catch (e) {
    console.log(`Error`, e.message);
  }
};

exports.getUploadPostImage = async (req, res) => {
  try {
    const { id } = req.params;
    const file = req.file;
    const results = await uploadDocFile(file);
    const institute = await InstituteAdmin.findById({ _id: id });
    const post = new Post({ ...req.body });
    post.imageId = "0";
    post.CreateImage = results.Key;
    institute.posts.push(post);
    post.institute = institute._id;
    await institute.save();
    await post.save();
    await unlinkFile(file.path);
    res.status(200).send({ message: "Your Institute", institute });
  } catch (e) {
    console.log(`Error`, e.message);
  }
};

exports.getRetreivePostImage = async (req, res) => {
  try {
    const key = req.params.key;
    const readStream = getFileStream(key);
    readStream.pipe(res);
  } catch (e) {
    console.log(`Error`, e.message);
  }
};

exports.getUploadVideoIns = async (req, res) => {
  try {
    const { id } = req.params;
    const file = req.file;
    const results = await uploadVideo(file);
    const institute = await InstituteAdmin.findById({ _id: id });
    const post = new Post({ ...req.body });
    post.CreateVideo = results.Key;
    post.imageId = "1";
    institute.posts.push(post);
    post.institute = institute._id;
    await institute.save();
    await post.save();
    await unlinkFile(file.path);
    res.status(200).send({ message: "Your Institute", institute });
  } catch (e) {
    console.log(`Error`, e.message);
  }
};

exports.getUpdateVisibilityPostIns = async (req, res) => {
  try {
    const { id, uid } = req.params;
    const { CreatePostStatus } = req.body;
    const post = await Post.findById({ _id: uid });
    post.CreatePostStatus = CreatePostStatus;
    await post.save();
    res.status(200).send({ message: "visibility change", post });
  } catch (e) {
    console.log(`Error`, e.message);
  }
};

exports.getDeletePostIns = async (req, res) => {
  try {
    const { id, uid } = req.params;
    await InstituteAdmin.findByIdAndUpdate(id, { $pull: { posts: uid } });
    await InstituteAdmin.findByIdAndUpdate(id, { $pull: { saveInsPost: uid } });
    await Post.findByIdAndDelete({ _id: uid });
    res.status(200).send({ message: "deleted Post" });
  } catch (e) {
    console.log(`Error`, e.message);
  }
};

exports.getUpdatePhone = async (req, res) => {
  try {
    const { id } = req.params;
    const { insPhoneNumber } = req.body;
    const institute = await InstituteAdmin.findById({ _id: id });
    institute.insPhoneNumber = insPhoneNumber;
    await institute.save();
    res.status(200).send({ message: "Mobile No Updated", institute });
  } catch (e) {
    console.log(`Error`, e.message);
  }
};

exports.getUpdatePersonalIns = async (req, res) => {
  try {
    const { id } = req.params;
    const institute = await InstituteAdmin.findByIdAndUpdate(id, req.body);
    await institute.save();
    res.status(200).send({ message: "Personal Info Updated" });
  } catch {}
};

exports.getUpdateDisplayIns = async (req, res) => {
  try {
    const { id } = req.params;
    const institute = await InstituteAdmin.findById({ _id: id });
    institute.insOperatingAdmin = req.body.insOperatingAdmin;
    institute.insPrinciple = req.body.insPrinciple;
    institute.insStudentPresident = req.body.insStudentPresident;
    institute.insTrusty = req.body.insTrusty;
    institute.insAdminClerk = req.body.insAdminClerk;
    await institute.save();
    res
      .status(200)
      .send({ message: "Institute Profile Display Updated", institute });
  } catch (e) {
    console.log(`Error`, e.message);
  }
};

exports.getUpdateProfileAboutIns = async (req, res) => {
  try {
    const { id } = req.params;
    const institute = await InstituteAdmin.findById({ _id: id });
    institute.insEstdDate = req.body.insEstdDate;
    institute.insAffiliated = req.body.insAffiliated;
    institute.insAchievement = req.body.insAchievement;
    institute.insEditableText = req.body.insEditableText;
    institute.insEditableTexts = req.body.insEditableTexts;
    await institute.save();
    res
      .status(200)
      .send({ message: "Institute Profile About Updated", institute });
  } catch (e) {
    console.log(`Error`, e.message);
  }
};

exports.getUpdateProfileAboutImageIns = async (req, res) => {
  try {
    const key = req.params.key;
    const readStream = getFileStream(key);
    readStream.pipe(res);
  } catch (e) {
    console.log(`Error`, e.message);
  }
};

exports.getUploadProfileAboutIns = async (req, res) => {
  try {
    const { id } = req.params;
    const file = req.file;
    const width = 200;
    const height = 200;
    const results = await uploadFile(file, width, height);
    const institute = await InstituteAdmin.findById({ _id: id });
    institute.insProfilePhoto = results.key;
    institute.photoId = "0";

    await institute.save();
    await unlinkFile(file.path);
    res.status(200).send({ message: "Successfully photo change" });
  } catch (e) {
    console.log(`Error`, e.message);
  }
};

exports.getUpdateAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const institute = await InstituteAdmin.findById({ _id: id });
    const announcements = new InsAnnouncement({ ...req.body });
    institute.announcement.unshift(announcements._id);
    institute.announcementCount += 1;
    announcements.institute = institute._id;
    for (let file of req.files) {
      const insDocument = new InsDocument({});
      insDocument.documentType = file.mimetype;
      insDocument.documentName = file.originalname;
      insDocument.documentEncoding = file.encoding;
      insDocument.documentSize = file.size;
      const results = await uploadDocFile(file);
      insDocument.documentKey = results.Key;
      announcements.announcementDocument.push(insDocument._id);
      await insDocument.save();
      await unlinkFile(file.path);
    }
    await Promise.all([institute.save(), announcements.save()]);
    res.status(200).send({ message: "Successfully Created", announcements });
  } catch (e) {
    console.log(`Error`, e);
  }
};

exports.getAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const announcement = await InsAnnouncement.findById({ _id: id })
      .populate({
        path: "institute",
        select: "insName photoId insProfilePhoto",
      })
      .lean()
      .exec();
    res.status(200).send({ message: "Announcement Detail", announcement });
  } catch (e) {
    console.log(`Error`, e.message);
  }
};

exports.getBonafideCertificate = async (req, res) => {
  try {
    const { id } = req.params;
    const { sid, studentReason, studentCertificateDate } = req.body;
    const student = await Student.findById({ _id: sid });
    student.studentReason = studentReason;
    student.studentCertificateDate = studentCertificateDate;
    await student.save();
    res.status(200).send({ message: "student certificate ready", student });
  } catch (e) {
    console.log(`Error`, e.message);
  }
};

exports.getSchoolLeavingCertificate = async (req, res) => {
  try {
    const {
      sid,
      studentLeavingInsDate,
      studentLeavingStudy,
      studentLeavingRemark,
      studentLeavingBehaviour,
      studentLeavingReason,
      studentBookNo,
      studentCertificateNo,
    } = req.body;
    const student = await Student.findById({ _id: sid });
    student.studentLeavingReason = studentLeavingReason;
    student.studentLeavingInsDate = studentLeavingInsDate;
    student.studentLeavingStudy = studentLeavingStudy;
    student.studentLeavingBehaviour = studentLeavingBehaviour;
    student.studentLeavingRemark = studentLeavingRemark;
    student.studentBookNo = studentBookNo;
    student.studentCertificateNo = studentCertificateNo;
    await student.save();
    res
      .status(200)
      .send({ message: "student leaving certificate ready", student });
  } catch (e) {
    console.log(`Error`, e.message);
  }
};

exports.staffJoiningIns = async (req, res) => {
  try {
    const { uid, id } = req.params;
    const institute = await InstituteAdmin.findById({ _id: id });
    const user = await User.findById({ _id: uid });
    // const staffData = await new Staff({ ...req.body });
    // institute.staff.push(staffData);
    // user.staff.push(staffData);
    // institute.joinedPost.push(user);
    // if (institute.userFollowersList.includes(uid)) {
    //   res.status(200).send({ message: "You Already Following This Institute" });
    // } else {
    //   user.userInstituteFollowing.push(id);
    //   institute.userFollowersList.push(uid);
    // }
    // staffData.institute = institute;
    // staffData.user = user;
    // await user.save();
    // await institute.save();
    // await staffData.save();
    res.status(200).send({ message: "staff code" });
  } catch (e) {
    console.log(
      `SomeThing Went Wrong at this EndPoint(/search/:uid/insdashboard/data/:id)`,
      e
    );
  }
};

exports.fillStaffJoinFormIns = async (req, res) => {
  try {
    const { iid, sid } = req.params;
    const staff = await Staff.findById({ _id: sid });
    const institute = await InstituteAdmin.findById({ _id: iid });
    const notify = await new Notification({});
    staff.staffFirstName = req.body.staffFirstName;
    staff.staffMiddleName = req.body.staffMiddleName;
    staff.staffLastName = req.body.staffLastName;
    staff.staffDOB = req.body.staffDOB;
    staff.staffGender = req.body.staffGender;
    staff.staffNationality = req.body.staffNationality;
    staff.staffMTongue = req.body.staffMTongue;
    staff.staffCast = req.body.staffCast;
    staff.staffCastCategory = req.body.staffCastCategory;
    staff.staffReligion = req.body.staffReligion;
    staff.staffBirthPlace = req.body.staffBirthPlace;
    staff.staffDistrict = req.body.staffDistrict;
    staff.staffState = req.body.staffState;
    staff.staffAddress = req.body.staffAddress;
    staff.staffPhoneNumber = req.body.staffPhoneNumber;
    staff.staffAadharNumber = req.body.staffAadharNumber;
    staff.staffQualification = req.body.staffQualification;
    staff.staffDocuments = req.body.staffDocuments;
    staff.staffAadharCard = req.body.staffAadharCard;
    staff.photoId = "1";
    notify.notifyContent = `${staff.staffFirstName}${
      staff.staffMiddleName ? ` ${staff.staffMiddleName}` : ""
    } ${staff.staffLastName} has been applied for role of Staff`;
    notify.notifySender = sid;
    notify.notifyReceiever = institute._id;
    institute.iNotify.push(notify);
    notify.institute = institute;
    notify.notifyByStaffPhoto = staff;
    await staff.save();
    await institute.save();
    await notify.save();
    res.status(200).send({ message: "Staff Info", staff });
  } catch (e) {
    console.log(`Error`, e.message);
  }
};

exports.updateFollowIns = async (req, res) => {
  try {
    var institute_session = req.tokenData && req.tokenData.insId;
    const institutes = await InstituteAdmin.findById({
      _id: institute_session,
    });
    const sinstitute = await InstituteAdmin.findById({
      _id: req.body.followId,
    });

    if (institutes.status === "Approved" && sinstitute.status === "Approved") {
      if (institutes.following.includes(req.body.followId)) {
        res
          .status(200)
          .send({ message: "You Already Following This Institute" });
      } else {
        const notify = await new Notification({});
        sinstitute.followers.push(institute_session);
        institutes.following.push(req.body.followId);
        institutes.followingCount += 1;
        sinstitute.followersCount += 1;
        notify.notifyContent = `${institutes.insName} started to following you`;
        notify.notifyReceiever = sinstitute._id;
        sinstitute.iNotify.push(notify._id);
        notify.institute = sinstitute._id;
        notify.notifyByInsPhoto = institutes._id;
        await Promise.all([
          institutes.save(),
          sinstitute.save(),
          notify.save(),
        ]);
        res.status(200).send({ message: "Following This Institute" });
        if (sinstitute.isUniversal === "Not Assigned") {
          const post = await Post.find({
            $and: [{ author: sinstitute._id, postStatus: "Anyone" }],
          });
          post.forEach(async (pt) => {
            institutes.posts.push(pt);
          });
          await institutes.save();
        } else {
        }
      }
    } else {
      res
        .status(200)
        .send({ message: "Institute is Not Approved, you will not follow" });
    }
  } catch (e) {
    console.log(`Error`, e.message);
  }
};

exports.removeFollowIns = async (req, res) => {
  try {
    var institute_session = req.tokenData && req.tokenData.insId;
    const institutes = await InstituteAdmin.findById({
      _id: institute_session,
    });
    const sinstitute = await InstituteAdmin.findById({
      _id: req.body.followId,
    });

    if (institutes.status === "Approved" && sinstitute.status === "Approved") {
      if (institutes.following.includes(req.body.followId)) {
        sinstitute.followers.pull(institute_session);
        institutes.following.pull(req.body.followId);
        institutes.followingCount -= 1;
        sinstitute.followersCount -= 1;
        await Promise.all([sinstitute.save(), institutes.save()]);
        res.status(200).send({ message: "UnFollow This Institute" });
        if (sinstitute.isUniversal === "Not Assigned") {
          const post = await Post.find({
            $and: [{ author: sinstitute._id, postStatus: "Anyone" }],
          });
          post.forEach(async (pt) => {
            institutes.posts.pull(pt);
          });
          await institutes.save();
        } else {
        }
      } else {
        res
          .status(200)
          .send({ message: "You Already UnFollow This Institute" });
      }
    } else {
      res
        .status(200)
        .send({ message: "Institute is Not Approved, you will not follow" });
    }
  } catch (e) {
    console.log(`Error`, e.message);
  }
};

exports.updateApproveStaff = async (req, res) => {
  var staffDate = new Date();
  var joinDate = `${staffDate.getFullYear()}-${
    staffDate.getMonth() < 10
      ? `0${staffDate.getMonth() + 1}`
      : staffDate.getMonth() + 1
  }-${
    staffDate.getDate() < 10 ? `0${staffDate.getDate()}` : staffDate.getDate()
  }`;
  try {
    const { id, sid, uid } = req.params;
    const institute = await InstituteAdmin.findById({ _id: id });
    const admins = await Admin.findById({ _id: `${process.env.S_ADMIN_ID}` });
    const notify = await new Notification({});
    const staffs = await Staff.findById({ _id: sid });
    const user = await User.findById({ _id: uid });
    staffs.staffStatus = req.body.status;
    institute.ApproveStaff.push(staffs._id);
    institute.staffCount += 1;
    admins.staffArray.push(staffs._id);
    admins.staffCount += 1;
    institute.staff.pull(sid);
    institute.joinedUserList.push(user._id);
    staffs.staffROLLNO = institute.ApproveStaff.length;
    staffs.staffJoinDate = joinDate;
    notify.notifyContent = `Congrats ${staffs.staffFirstName} ${
      staffs.staffMiddleName ? `${staffs.staffMiddleName}` : ""
    } ${staffs.staffLastName} for joined as a staff at ${institute.insName}`;
    notify.notifySender = id;
    notify.notifyReceiever = user._id;
    institute.iNotify.push(notify._id);
    notify.institute = institute._id;
    user.uNotify.push(notify._id);
    notify.user = user._id;
    notify.notifyByStaffPhoto = staffs._id;
    // invokeFirebaseNotification(
    //   "Staff Approval",
    //   notify,
    //   institute.insName,
    //   user._id,
    //   user.deviceToken
    // );
    await Promise.all([
      staffs.save(),
      institute.save(),
      admins.save(),
      user.save(),
      notify.save(),
    ]);
    res.status(200).send({
      message: `Welcome To The Institute ${staffs.staffFirstName} ${staffs.staffLastName}`,
      institute: institute.ApproveStaff,
    });
    if (institute.isUniversal === "Not Assigned") {
      const post = await Post.find({ author: institute._id });
      post.forEach(async (pt) => {
        if (user.userPosts.length >= 1 && user.userPosts.includes(String(pt))) {
        } else {
          user.userPosts.push(pt);
        }
      });
      await user.save();
    } else {
    }
  } catch (e) {
    console.log(`Error`, e.message);
  }
};

exports.updateRejectStaff = async (req, res) => {
  try {
    const { id, sid, uid } = req.params;
    const institute = await InstituteAdmin.findById({ _id: id });
    const staffs = await Staff.findById({ _id: sid });
    const user = await User.findById({ _id: uid });
    staffs.staffStatus = req.body.status;
    institute.staff.pull(sid);
    notify.notifyContent = `your request for the role of staff is rejected contact at connect@qviple.com`;
    notify.notifySender = id;
    notify.notifyReceiever = user._id;
    user.uNotify.push(notify);
    notify.user = user;
    notify.notifyPid = "1";
    notify.notifyPhoto = institute.insProfilePhoto;
    await institute.save();
    await staffs.save();
    await user.save();
    await notify.save();
    res.status(200).send({
      message: `Application Rejected ${staffs.staffFirstName} ${staffs.staffLastName}`,
      institute,
    });
  } catch (e) {
    console.log(`Error`, e.message);
  }
};

exports.getNewDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const { sid } = req.body;
    const staff = await Staff.findById({ _id: sid }).populate({
      path: "user",
    });
    const user = await User.findById({ _id: `${staff.user._id}` });
    const institute = await InstituteAdmin.findById({ _id: id });
    const department = await new Department({ ...req.body });
    const notify = await new Notification({});
    institute.depart.push(department._id);
    institute.departmentCount += 1;
    department.institute = institute._id;
    staff.staffDepartment.push(department._id);
    staff.staffDesignationCount += 1;
    staff.recentDesignation = req.body.dTitle;
    department.dHead = staff._id;
    department.staffCount += 1;
    if (
      department.departmentChatGroup.length >= 1 &&
      department.departmentChatGroup.includes(`${staff._id}`)
    ) {
    } else {
      department.departmentChatGroup.push(staff._id);
    }
    notify.notifyContent = `you got the designation of ${department.dName} as Head`;
    notify.notifySender = id;
    notify.notifyReceiever = user._id;
    user.uNotify.push(notify._id);
    notify.user = user._id;
    notify.notifyByInsPhoto = institute._id;
    // invokeFirebaseNotification(
    //   "Designation Allocation",
    //   notify,
    //   institute.insName,
    //   user._id,
    //   user.deviceToken
    // );
    await Promise.all([
      institute.save(),
      staff.save(),
      department.save(),
      user.save(),
      notify.save(),
    ]);
    res.status(200).send({
      message: "Successfully Created Department",
      department: department._id,
    });
  } catch (e) {
    console.log(`Error`, e);
  }
};

exports.getNewStaffJoinCodeIns = async (req, res) => {
  try {
    const { id } = req.params;
    const { code } = req.body;
    const institute = await InstituteAdmin.findById({ _id: id });
    institute.staffJoinCode = code;
    await institute.save();
    res
      .status(200)
      .send({
        message: "staff joining code",
        institute: institute.staffJoinCode,
      });
  } catch (e) {
    console.log(`Error`, e.message);
  }
};

exports.AddAccountByIns = async (req, res) => {
  try {
    const { id, iid } = req.params;
    const institute = await InstituteAdmin.findById({ _id: id });
    const instituteNew = await InstituteAdmin.findById({ _id: iid });
    institute.addInstitute.push(instituteNew);
    instituteNew.addInstitute.push(institute);
    await institute.save();
    await instituteNew.save();
    res.status(200).send({ message: "Added", institute, instituteNew });
  } catch (e) {
    console.log(`Error`, e.message);
  }
};

exports.AddAccountByUser = async (req, res) => {
  try {
    const { id, iid } = req.params;
    const institute = await InstituteAdmin.findById({ _id: id });
    const user = await User.findById({ _id: iid });
    institute.addInstituteUser.push(user);
    user.addUserInstitute.push(institute);
    await institute.save();
    await user.save();
    res.status(200).send({ message: "Added", institute, user });
  } catch (e) {
    console.log(`Error`, e.message);
  }
};

exports.reportPostByUser = async (req, res) => {
  try {
    const { id, uid } = req.params;
    const { reportStatus } = req.body;
    const user = await User.findById({ _id: id });
    const post = await Post.findById({ _id: uid });
    const admin = await Admin.findById({ _id: `${process.env.S_ADMIN_ID}` });
    const report = new Report({ reportStatus: reportStatus });
    admin.reportList.push(report);
    report.reportInsPost = post;
    report.reportBy = user;
    await admin.save();
    await report.save();
    res.status(200).send({ message: "reported", report: reportStatus });
  } catch (e) {
    console.log(`Error`, e.message);
  }
};

exports.sendForPrintID = async (req, res) => {
  try {
    const { id, bid } = req.params;
    const { status } = req.body;
    const institute = await InstituteAdmin.findById({ _id: id });
    const batch = await Batch.findById({ _id: bid });
    const admin = await Admin.findById({ _id: `62596c3a47690fe0d371f5b4` });
    const notify = await new Notification({});
    admin.idCardPrinting.push(batch);
    batch.idCardStatus = status;
    notify.notifyContent = `Id Card for ${batch.batchName} is send for Printing`;
    notify.notifySender = admin._id;
    notify.notifyReceiever = id;
    institute.iNotify.push(notify);
    notify.institute = institute;
    notify.notifyPid = "1";
    notify.notifyByInsPhoto = institute;
    await admin.save();
    await batch.save();
    await institute.save();
    await notify.save();
    res.status(200).send({ message: "Send for Printing", admin, batch });
  } catch (e) {
    console.log(`Error`, e.message);
  }
};

exports.unSendForPrintID = async (req, res) => {
  try {
    const { id, bid } = req.params;
    const institute = await InstituteAdmin.findById({ _id: id });
    const batch = await Batch.findById({ _id: bid });
    const admin = await Admin.findById({ _id: `62596c3a47690fe0d371f5b4` });
    const notify = await new Notification({});
    admin.idCardPrinting.pull(batch);
    batch.idCardStatus = "";
    notify.notifyContent = `Id Card for ${batch.batchName} is not send for Printing Contact at connect@qviple.com`;
    notify.notifySender = admin._id;
    notify.notifyReceiever = id;
    institute.iNotify.push(notify);
    notify.institute = institute;
    notify.notifyByInsPhoto = institute;
    await admin.save();
    await batch.save();
    await institute.save();
    await notify.save();
    res.status(200).send({ message: "Un Send for Printing", admin, batch });
  } catch (e) {
    console.log(`Error`, e.message);
  }
};

exports.printedBySuperAdmin = async (req, res) => {
  try {
    const { id, bid } = req.params;
    const { status } = req.body;
    const institute = await InstituteAdmin.findById({ _id: id });
    const batch = await Batch.findById({ _id: bid });
    const admin = await Admin.findById({ _id: `62596c3a47690fe0d371f5b4` });
    const notify = await new Notification({});
    admin.idCardPrinted.push(batch);
    admin.idCardPrinting.pull(batch);
    batch.idCardStatus = status;
    notify.notifyContent = `Id Card for ${batch.batchName} is being Printed`;
    notify.notifySender = admin._id;
    notify.notifyReceiever = id;
    institute.iNotify.push(notify);
    notify.institute = institute;
    notify.notifyByInsPhoto = institute;
    await admin.save();
    await batch.save();
    await institute.save();
    await notify.save();
    res.status(200).send({ message: "Id Card Printed", admin, batch });
  } catch (e) {
    console.log(`Error`, e.message);
  }
};

exports.requestForSupportIns = async (req, res) => {
  try {
    const { id } = req.params;
    const institute = await InstituteAdmin.findById({ _id: id });
    const support = await new InstituteSupport({ ...req.body });
    institute.supportIns.push(support);
    support.institute = institute;
    await institute.save();
    await support.save();
    res.status(200).send({ message: "Successfully Updated", institute });
  } catch (e) {
    console.log(`Error`, e.message);
  }
};

exports.replyBySuperAdmin = async (req, res) => {
  try {
    const { id, sid } = req.params;
    const { queryReply } = req.body;
    const institute = await InstituteAdmin.findById({ _id: id });
    const reply = await InstituteSupport.findById({ _id: sid });
    const notify = new Notification({});
    reply.queryReply = queryReply;
    notify.notifyContent = `${reply.body} ${reply.queryReply}`;
    notify.notifyReceiever = id;
    institute.iNotify.push(notify);
    notify.institute = institute;
    notify.notifyByInsPhoto = institute;
    await reply.save();
    await institute.save();
    await notify.save();
    res.status(200).send({ message: "reply", reply });
  } catch (e) {
    console.log(`Error`, e.message);
  }
};

exports.complaintReportAtIns = async (req, res) => {
  try {
    const { id, iid } = req.params;
    const { status } = req.body;
    const complaint = await Complaint.findById({ _id: id });
    const institute = await InstituteAdmin.findById({ _id: iid });
    institute.studentComplaints.push(complaint);
    complaint.institute = institute;
    complaint.complaintInsStatus = status;
    await institute.save();
    await complaint.save();
    res
      .status(200)
      .send({ message: "Report To Institute", complaint, institute });
  } catch (e) {
    console.log(`Error`, e.message);
  }
};

exports.transferRequestByStaff = async (req, res) => {
  try {
    const { sid, id } = req.params;
    const staff = await Staff.findById({ _id: sid });
    const institute = await InstituteAdmin.findById({ _id: id });
    const transfer = await new Transfer({ ...req.body });
    const notify = await new Notification({});
    institute.transfer.push(transfer);
    transfer.institute = institute;
    staff.staffTransfer.push(transfer);
    transfer.staff = staff;
    notify.notifyContent = `${staff.staffFirstName}${
      staff.staffMiddleName ? ` ${staff.staffMiddleName}` : ""
    } ${staff.staffLastName} request for transfer at ${institute.insName}`;
    notify.notifySender = sid;
    notify.notifyReceiever = id;
    institute.iNotify.push(notify);
    notify.institute = institute;
    notify.notifyByStaffPhoto = staff;
    await staff.save();
    await transfer.save();
    await institute.save();
    await notify.save();
    res
      .status(200)
      .send({ message: "request to transfer", transfer, staff, institute });
  } catch (e) {
    console.log(`Error`, e.message);
  }
};

exports.grantedTransferByIns = async (req, res) => {
  try {
    const { id, sid, ssid, eid } = req.params;
    const { status } = req.body;
    var institute = await InstituteAdmin.findById({ _id: id }).populate({
      path: "depart",
      populate: {
        path: "batches",
        populate: {
          path: "batchStaff",
        },
      },
    });
    var staffNew = await Staff.findById({ _id: sid });
    var transfer = await Transfer.findById({ _id: eid });
    var transferStaff = await Staff.findById({ _id: ssid })
      .populate("staffDepartment")
      .populate("staffClass")
      .populate("staffSubject")
      .populate("financeDepartment")
      .populate("library")
      .populate("staffAdmissionAdmin");
    // .populate("sportDepartment")
    // .populate("staffSportClass")
    // .populate("elearning")
    transfer.transferStatus = status;
    await transfer.save();
    for (let i = 0; i < transferStaff.staffDepartment.length; i++) {
      const department = await Department.findById({
        _id: transferStaff.staffDepartment[i]._id,
      });
      staffNew.staffDepartment.push(department);
      department.dHead = staffNew;
      transferStaff.staffDepartment.pull(department);
      await staffNew.save();
      await department.save();
      await transferStaff.save();
    }
    for (let i = 0; i < transferStaff.staffClass.length; i++) {
      const classes = await Class.findById({
        _id: transferStaff.staffClass[i]._id,
      });
      staffNew.staffClass.push(classes);
      classes.classTeacher = staffNew;
      transferStaff.staffClass.pull(classes);
      await staffNew.save();
      await classes.save();
      await transferStaff.save();
    }
    for (let i = 0; i < transferStaff.staffSubject.length; i++) {
      const subject = await Subject.findById({
        _id: transferStaff.staffSubject[i]._id,
      });
      staffNew.staffSubject.push(subject);
      subject.subjectTeacherName = staffNew;
      transferStaff.staffSubject.pull(subject);
      await staffNew.save();
      await subject.save();
      await transferStaff.save();
    }
    for (let i = 0; i < transferStaff.financeDepartment.length; i++) {
      const finance = await Finance.findById({
        _id: transferStaff.financeDepartment[i]._id,
      });
      staffNew.financeDepartment.push(finance);
      finance.financeHead = staffNew;
      transferStaff.financeDepartment.pull(finance);
      await staffNew.save();
      await finance.save();
      await transferStaff.save();
    }
    // for (let i = 0; i < transferStaff.sportDepartment.length; i++) {
    //   const sport = await Sport.findById({
    //     _id: transferStaff.sportDepartment[i]._id,
    //   });
    //   staffNew.sportDepartment.push(sport);
    //   sport.sportHead = staffNew;
    //   transferStaff.sportDepartment.pull(sport);
    //   await staffNew.save();
    //   await sport.save();
    //   await transferStaff.save();
    // }
    // for (let i = 0; i < transferStaff.staffSportClass.length; i++) {
    //   const sportClass = await SportClass.findById({
    //     _id: transferStaff.staffSportClass[i]._id,
    //   });
    //   staffNew.staffSportClass.push(sportClass);
    //   sportClass.sportClassHead = staffNew;
    //   transferStaff.staffSportClass.pull(sportClass);
    //   await staffNew.save();
    //   await sportClass.save();
    //   await transferStaff.save();
    // }
    // for (let i = 0; i < transferStaff.elearning.length; i++) {
    //   const elearn = await ELearning.findById({
    //     _id: transferStaff.elearning[i]._id,
    //   });
    //   staffNew.elearning.push(elearn);
    //   elearn.elearningHead = staffNew;
    //   transferStaff.elearning.pull(elearn);
    //   await staffNew.save();
    //   await elearn.save();
    //   await transferStaff.save();
    // }
    for (let i = 0; i < transferStaff.library.length; i++) {
      const libr = await Library.findById({
        _id: transferStaff.library[i]._id,
      });
      staffNew.library.push(libr);
      libr.libraryHead = staffNew;
      transferStaff.library.pull(libr);
      await staffNew.save();
      await libr.save();
      await transferStaff.save();
    }
    for (let i = 0; i < transferStaff.staffAdmissionAdmin.length; i++) {
      const sAdmin = await AdmissionAdmin.findById({
        _id: transferStaff.staffAdmissionAdmin[i]._id,
      });
      staffNew.staffAdmissionAdmin.push(sAdmin);
      sAdmin.adAdminNameHead = staffNew;
      transferStaff.staffAdmissionAdmin.pull(sAdmin);
      await staffNew.save();
      await sAdmin.save();
      await transferStaff.save();
    }
    if (
      institute.ApproveStaff.length >= 1 &&
      institute.ApproveStaff.includes(String(transferStaff._id))
    ) {
      institute.ApproveStaff.pull(transferStaff._id);
      transferStaff.institute = "";
      await institute.save();
      await transferStaff.save();
    } else {
      console.log("Not To Leave");
    }
    for (let i = 0; i < institute.depart.length; i++) {
      const depart = await Department.findById({
        _id: institute.depart[i]._id,
      });
      depart.departmentChatGroup.pull(transferStaff);
      depart.departmentChatGroup.push(staffNew);
      await depart.save();
    }
    for (let i = 0; i < institute.depart.length; i++) {
      for (let j = 0; j < i.batches.length; j++) {
        const batchData = await Batch.findById({ _id: i.batches[j]._id });
        batchData.batchStaff.pull(transferStaff);
        batchData.batchStaff.push(staffNew);
        staffNew.batches = batchData;
        await batchData.save();
        await staffNew.save();
      }
    }
    res
      .status(200)
      .send({ message: "Transfer Granted", staffNew, transferStaff, transfer });
  } catch (e) {
    console.log(`Error`, e.message);
  }
};

exports.RejectTransferByIns = async (req, res) => {
  try {
    const { id, sid, eid } = req.params;
    const { status } = req.body;
    const institute = await InstituteAdmin.findById({ _id: id });
    const transfer = await Transfer.findById({ _id: eid });
    const staff = await Staff.findById({ _id: sid }).populate({
      path: "user",
      select: "userLegalName",
    });
    const user = await User.findById({ _id: `${staff.user._id}` });
    const notify = new Notification({});
    transfer.transferStatus = status;
    notify.notifyContent = `Your Transfer Request Rejected (not granted) By ${institute.insName}`;
    notify.notifySender = id;
    notify.notifyReceiever = user._id;
    user.uNotify.push(notify);
    notify.user = user;
    notify.notifyByStaffPhoto = staff;
    await transfer.save();
    await user.save();
    await notify.save();
    res.status(200).send({ message: "Transfer Not Granted", transfer });
  } catch (e) {
    console.log(`Error`, e.message);
  }
};

exports.leaveRequestByStaff = async (req, res) => {
  try {
    const { sid, id } = req.params;
    const staff = await Staff.findById({ _id: sid });
    const institute = await InstituteAdmin.findById({ _id: id });
    const leave = await new Leave({ ...req.body });
    const notify = await new Notification({});
    institute.leave.push(leave);
    leave.institute = institute;
    staff.staffLeave.push(leave);
    leave.staff = staff;
    notify.notifyContent = `${staff.staffFirstName}${
      staff.staffMiddleName ? ` ${staff.staffMiddleName}` : ""
    } ${staff.staffLastName} requested for a leave check application`;
    notify.notifySender = sid;
    notify.notifyReceiever = id;
    institute.iNotify.push(notify);
    notify.institute = institute;
    notify.notifyByStaffPhoto = staff;
    await staff.save();
    await leave.save();
    await institute.save();
    await notify.save();
    res
      .status(200)
      .send({ message: "request to leave", leave, staff, institute });
  } catch (e) {
    console.log(`Error`, e.message);
  }
};

exports.grantedLeaveByIns = async (req, res) => {
  try {
    const { id, sid, eid } = req.params;
    const { status } = req.body;
    const institute = await InstituteAdmin.findById({ _id: id });
    const staff = await Staff.findById({ _id: sid }).populate({
      path: "user",
    });
    const user = await User.findById({ _id: `${staff.user._id}` });
    const leave = await Leave.findById({ _id: eid });
    const notify = await new Notification({});
    leave.leaveStatus = status;
    notify.notifyContent = `Your Leave request has been Approved by ${institute.insName}`;
    notify.notifySender = id;
    notify.notifyReceiever = user._id;
    user.uNotify.push(notify);
    notify.user = user;
    notify.notifyByStaffPhoto = staff;
    await leave.save();
    await user.save();
    await notify.save();
    res.status(200).send({ message: "Leave Granted", leave });
  } catch (e) {
    console.log(`Error`, e.message);
  }
};

exports.RejectLeaveByIns = async (req, res) => {
  try {
    const { id, sid, eid } = req.params;
    const { status } = req.body;
    const institute = await InstituteAdmin.findById({ _id: id });
    const staff = await Staff.findById({ _id: sid }).populate({
      path: "user",
    });
    const user = await User.findById({ _id: `${staff.user._id}` });
    const leave = await Leave.findById({ _id: eid });
    const notify = await new Notification({});
    leave.leaveStatus = status;
    notify.notifyContent = `Your Leave request has been Rejected by ${institute.insName}`;
    notify.notifySender = id;
    notify.notifyReceiever = user._id;
    user.uNotify.push(notify);
    notify.user = user;
    notify.notifyByStaffPhoto = staff;
    await leave.save();
    await user.save();
    await notify.save();
    res.status(200).send({ message: "Leave Not Granted", leave });
  } catch (e) {
    console.log(`Error`, e.message);
  }
};

exports.fillStaffForm = async (req, res) => {
  var staffDate = new Date();
  var joinDate = `${staffDate.getFullYear()}-${
    staffDate.getMonth() < 10
      ? `0${staffDate.getMonth() + 1}`
      : staffDate.getMonth() + 1
  }-${
    staffDate.getDate() < 10 ? `0${staffDate.getDate()}` : staffDate.getDate()
  }`;
  try {
    const { uid, id } = req.params;
    const institute = await InstituteAdmin.findById({ _id: id });
    const user = await User.findById({ _id: uid });
    const staff = new Staff({ ...req.body });
    for (let file of req.files) {
      let count = 1;
      if (count === 1) {
        const width = 200;
        const height = 200;
        const results = await uploadFile(file, width, height);
        staff.photoId = "0";
        staff.staffProfilePhoto = results.key;
        count = count + 1;
      } else if (count === 2) {
        const results = await uploadDocFile(file);
        staff.staffAadharFrontCard = results.key;
        count = count + 1;
      } else {
        const results = await uploadDocFile(file);
        staff.staffAadharBackCard = results.key;
      }
      await unlinkFile(file.path);
    }
    const notify = await new Notification({});
    institute.staff.push(staff._id);
    user.staff.push(staff._id);
    institute.joinedPost.push(user._id);
    if (institute.userFollowersList.includes(uid)) {
    } else {
      user.userInstituteFollowing.push(id);
      user.followingUICount += 1;
      institute.userFollowersList.push(uid);
      institute.followersCount += 1;
    }
    staff.institute = institute._id;
    staff.staffApplyDate = joinDate;
    staff.user = user._id;
    notify.notifyContent = `${staff.staffFirstName}${
      staff.staffMiddleName ? ` ${staff.staffMiddleName}` : ""
    } ${staff.staffLastName} has been applied for role of Staff`;
    notify.notifySender = staff._id;
    notify.notifyReceiever = institute._id;
    institute.iNotify.push(notify._id);
    notify.institute = institute._id;
    notify.notifyByStaffPhoto = staff._id;
    await Promise.all([
      staff.save(),
      institute.save(),
      user.save(),
      notify.save(),
    ]);
    res.status(201).send({ message: "Staff form is applied", staff });
  } catch (e) {
    console.log(e);
  }
};

exports.fillStudentForm = async (req, res) => {
  try {
    const { uid, id } = req.params;
    const institute = await InstituteAdmin.findById({ _id: id });
    const user = await User.findById({ _id: uid });
    const student = new Student({ ...req.body });
    const classes = await Class.findOne({ classCode: req.body.studentCode });
    for (let file of req.files) {
      let count = 1;
      if (count === 1) {
        const width = 200;
        const height = 200;
        const results = await uploadFile(file, width, height);
        student.photoId = "0";
        student.studentProfilePhoto = results.key;
        count = count + 1;
      } else if (count === 2) {
        const results = await uploadDocFile(file);
        student.studentAadharFrontCard = results.key;
        count = count + 1;
      } else {
        const results = await uploadDocFile(file);
        student.studentAadharBackCard = results.key;
      }
      await unlinkFile(file.path);
    }
    const notify = await new Notification({});
    institute.student.push(student._id);
    user.student.push(student._id);
    institute.joinedPost.push(user._id);
    classes.student.push(student._id);
    student.studentClass = classes._id;
    if (institute.userFollowersList.includes(uid)) {
    } else {
      user.userInstituteFollowing.push(id);
      user.followingUICount += 1;
      institute.userFollowersList.push(uid);
      institute.followersCount += 1;
    }
    student.institute = institute._id;
    student.user = user._id;
    notify.notifyContent = `${student.studentFirstName}${
      student.studentMiddleName ? ` ${student.studentMiddleName}` : ""
    } ${student.studentLastName} has been applied for role of student`;
    notify.notifySender = student._id;
    notify.notifyReceiever = institute._id;
    institute.iNotify.push(notify._id);
    notify.institute = institute._id;
    notify.notifyByStudentPhoto = student._id;
    await Promise.all([
      student.save(),
      institute.save(),
      user.save(),
      classes.save(),
      notify.save(),
    ]);
    res.status(201).send({ message: "student form is applied", student });
  } catch (e) {
    console.log(e);
  }
};

exports.retrievePendingStaffList = async (req, res) => {
  try {
    const { id } = req.params;
    const staffIns = await InstituteAdmin.findById({ _id: id })
      .select("insName")
      .populate({
        path: "staff",
        select:
          "staffFirstName staffMiddleName staffLastName photoId staffProfilePhoto staffPhoneNumber staffApplyDate",
        populate: {
          path: "user",
          select: "userLegalName userEmail",
        },
      })
      .lean()
      .exec();
    if (staffIns) {
      res.status(200).send({ message: "Success", staffIns });
    } else {
      res.status(404).send({ message: "Failure" });
    }
  } catch {}
};

exports.retrieveApproveStaffList = async (req, res) => {
  try {
    const { id } = req.params;
    const staffIns = await InstituteAdmin.findById({ _id: id })
      .select("insName")
      .populate({
        path: "ApproveStaff",
        select:
          "staffFirstName staffMiddleName recentDesignation staffLastName photoId staffProfilePhoto staffPhoneNumber staffJoinDate staffROLLNO",
        populate: {
          path: "user",
          select: "userLegalName userEmail",
        },
      })
      .lean()
      .exec();
    if (staffIns) {
      res.status(200).send({ message: "Success", staffIns });
    } else {
      res.status(404).send({ message: "Failure" });
    }
  } catch {}
};

exports.retrieveApproveStudentList = async (req, res) => {
  try {
    const { id } = req.params;
    const studentIns = await InstituteAdmin.findById({ _id: id })
      .select("insName")
      .populate({
        path: "ApproveStudent",
        select:
          "studentFirstName studentMiddleName studentLastName photoId studentProfilePhoto studentPhoneNumber studentGRNO studentROLLNO studentAdmissionDate",
        populate: {
          path: "user",
          select: "userLegalName userEmail",
        },
      })
      .populate({
        path: "ApproveStudent",
        select:
          "studentFirstName studentMiddleName studentLastName photoId studentProfilePhoto studentPhoneNumber studentGRNO studentROLLNO studentAdmissionDate",
        populate: {
          path: "studentClass",
          select: "className classStatus",
        },
      })
      .lean()
      .exec();
    if (studentIns) {
      res.status(200).send({ message: "Success", studentIns });
    } else {
      res.status(404).send({ message: "Failure" });
    }
  } catch {}
};

exports.getFullStaffInfo = async (req, res) => {
  try {
    const { id } = req.params;
    const staff = await Staff.findById({ _id: id })
      .select(
        "staffFirstName staffDesignationCount staffMiddleName staffDepartment staffClass staffSubject staffLastName photoId staffProfilePhoto staffDOB staffGender staffNationality staffMotherName staffMTongue staffCast staffCastCategory staffReligion staffBirthPlace staffDistrict staffState staffAddress staffPhoneNumber staffAadharNumber staffQualification staffDocuments staffAadharFrontCard staffAadharBackCard staffStatus staffROLLNO staffPhoneNumber"
      )
      .populate({
        path: "user",
        select: "userLegalName userEmail",
      })
      .populate({
        path: "institute",
        select: "insName",
      })
      .lean()
      .exec();
    if (staff) {
      res.status(200).send({ message: "Staff Data To Member", staff });
    } else {
      res.status(404).send({ message: "Failure" });
    }
  } catch (e) {
    console.log(e);
  }
};

exports.getFullStudentInfo = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.findById({ _id: id })
      .select(
        "studentFirstName studentMiddleName studentLastName photoId studentProfilePhoto studentDOB studentGender studentNationality studentMotherName studentMTongue studentCast studentCastCategory studentReligion studentBirthPlace studentDistrict studentState studentAddress studentPhoneNumber studentAadharNumber studentParentsName studentParentsPhoneNumber studentDocuments studentAadharFrontCard studentAadharBackCard studentStatus studentGRNO studentROLLNO"
      )
      .populate({
        path: "user",
        select: "userLegalName userEmail",
      })
      .populate({
        path: "institute",
        select: "insName",
      })
      .populate({
        path: "studentClass",
        select: "className classStatus",
      })
      .lean()
      .exec();
    if (student) {
      res.status(200).send({ message: "Student Data To Member", student });
    } else {
      res.status(404).send({ message: "Failure" });
    }
  } catch {}
};

exports.retrieveDepartmentList = async (req, res) => {
  try {
    const { id } = req.params;
    const institute = await InstituteAdmin.findById({ _id: id })
      .select("insName")
      .populate({
        path: "depart",
        select: "dName photo photoId dTitle",
        populate: {
          path: "dHead",
          select:
            "staffFirstName staffMiddleName staffLastName photoId staffProfilePhoto",
        },
      })
      .lean()
      .exec();
    if (institute) {
      res.status(200).send({ message: "Success", institute });
    } else {
      res.status(404).send({ message: "Failure" });
    }
  } catch {}
};

exports.getOneDepartment = async (req, res) => {
  try {
    const { did } = req.params;
    if(did === 'undefined'){

    }
    else{
    const department = await Department.findById({ _id: did })
      .select(
        "dName dAbout dTitle dEmail staffCount studentCount classCount dPhoneNumber photoId photo dSpeaker dVicePrinciple dAdminClerk dOperatingAdmin dStudentPresident"
      )
      .populate({
        path: "dHead",
        select:
          "staffFirstName staffMiddleName staffLastName photoId staffProfilePhoto",
      })
      .populate({
        path: "batches",
        select: "batchName batchStatus createdAt",
      })
      .populate({
        path: "departmentSelectBatch",
        select: "batchName batchStatus createdAt ApproveStudent",
        populate: {
          path: "classroom",
          select: "className classTitle",
          populate: {
            path: "ApproveStudent",
            select:
              "studentFirstName studentMiddleName studentLastName photoId studentProfilePhoto",
          },
        },
      })
      .populate({
        path: "displayPersonList",
        select: "displayTitle createdAt",
        populate: {
          path: "displayUser",
          select: "userLegalName username photoId profilePhoto",
        },
      })
      .lean()
      .exec();
    if (department) {
      res.status(200).send({ message: "Success", department });
    } else {
      res.status(404).send({ message: "Failure" });
    }
    } 
  } catch (e) {
    console.log(e)
  }
};

exports.retrieveCurrentBatchData = async (req, res) => {
  try {
    const { bid } = req.params;
    const batches = await Batch.findById({ _id: bid })
      .select("batchName batchStatus createdAt")
      .populate({
        path: "ApproveStudent",
        select: "studentFirstName studentLastName",
      })
      .lean()
      .exec();
    if (batches) {
      res.status(200).send({ message: "Success", batches });
    } else {
      res.status(404).send({ message: "Failure" });
    }
  } catch {}
};

exports.retrieveClassMaster = async (req, res) => {
  try {
    const { did } = req.params;
    const classMaster = await ClassMaster.find({ department: did })
      .select("className classTitle classDivision")
      .populate({
        path: "department",
        select: "dName",
      })
      .lean()
      .exec();
    if (classMaster) {
      res.status(200).send({ message: "ClassMaster Are here", classMaster });
    } else {
      res.status(404).send({ message: "Failure" });
    }
  } catch {}
};

exports.retrieveNewClass = async (req, res) => {
  var classRandomCodeHandler = () => {
    const c_1 = Math.floor(Math.random() * 9) + 1;
    const c_2 = Math.floor(Math.random() * 9) + 1;
    const c_3 = Math.floor(Math.random() * 9) + 1;
    const c_4 = Math.floor(Math.random() * 9) + 1;
    var r_class_code = `${c_1}${c_2}${c_3}${c_4}`;
    return r_class_code;
  };

  var result = classRandomCodeHandler();
  try {
    // console.log(req.body)
    const { id, did, bid } = req.params;
    const { sid, classTitle, classHeadTitle, mcId, classCode } = req.body;
    const institute = await InstituteAdmin.findById({ _id: id });
    const masterClass = await ClassMaster.findById({ _id: mcId });
    const mCName = masterClass.className;
    const batch = await Batch.findById({ _id: bid });
    const staff = await Staff.findById({ _id: sid }).populate({
      path: "user",
    });
    const user = await User.findById({ _id: `${staff.user._id}` });
    const depart = await Department.findById({ _id: did }).populate({
      path: "dHead",
    });
    if (institute.classCodeList.includes(`${result}`)) {
      // res.status(404).send({ message: 'Something wrong with autogenerated code'})
    } else {
      const notify = await new Notification({});
      const classRoom = await new Class({
        masterClassName: mcId,
        className: mCName,
        classTitle: classTitle,
        classHeadTitle: classHeadTitle,
        classCode: `${result}`,
      });
      institute.classCodeList.push(`${result}`);
      institute.classRooms.push(classRoom._id);
      classRoom.institute = institute._id;
      batch.classroom.push(classRoom._id);
      batch.classCount += 1;
      masterClass.classDivision.push(classRoom._id);
      masterClass.classCount += 1;
      if (
        depart.departmentChatGroup.length >= 1 &&
        depart.departmentChatGroup.includes(`${staff._id}`)
      ) {
      } else {
        depart.departmentChatGroup.push(staff._id);
      }
      classRoom.batch = batch._id;
      // batch.batchStaff.push(staff._id);
      // staff.batches = batch._id;
      staff.staffClass.push(classRoom._id);
      staff.staffDesignationCount += 1;
      staff.recentDesignation = classHeadTitle;
      classRoom.classTeacher = staff._id;
      depart.class.push(classRoom._id);
      depart.classCount += 1;
      classRoom.department = depart._id;
      notify.notifyContent = `you got the designation of ${classRoom.className} as Class Teacher`;
      notify.notifySender = id;
      notify.notifyReceiever = user._id;
      user.uNotify.push(notify._id);
      notify.user = user._id;
      notify.notifyByInsPhoto = institute._id;
      // invokeFirebaseNotification(
      //   "Designation Allocation",
      //   notify,
      //   institute.insName,
      //   user._id,
      //   user.deviceToken
      // );
      await Promise.all([
        institute.save(),
        batch.save(),
        masterClass.save(),
        staff.save(),
        classRoom.save(),
        depart.save(),
        user.save(),
        notify.save(),
      ]);
      res.status(200).send({
        message: "Successfully Created Class",
        classRoom: classRoom._id,
      });
    }
  } catch (e) {
    console.log(e);
  }
};

exports.retrieveNewSubject = async (req, res) => {
  try {
    const { id, cid, bid, did } = req.params;
    const { sid, subjectTitle, subjectName, msid } = req.body;
    const institute = await InstituteAdmin.findById({ _id: id });
    const classes = await Class.findById({ _id: cid }).populate({
      path: "classTeacher",
    });
    const subjectMaster = await SubjectMaster.findById({ _id: msid });
    // const batch = await Batch.findById({ _id: bid });
    const staff = await Staff.findById({ _id: sid }).populate({
      path: "user",
    });
    const user = await User.findById({ _id: `${staff.user._id}` });
    const depart = await Department.findById({ _id: did }).populate({
      path: "dHead",
    });
    const notify = await new Notification({});
    const subject = await new Subject({
      subjectTitle: subjectTitle,
      subjectName: subjectMaster.subjectName,
      subjectMasterName: subjectMaster._id,
    });
    classes.subject.push(subject._id);
    classes.subjectCount += 1;
    subjectMaster.subjects.push(subject._id);
    subjectMaster.subjectCount += 1;
    subject.class = classes._id;
    // if (String(classes.classTeacher._id) === String(staff._id)) {
    // } else {
    //   batch.batchStaff.push(staff._id);
    //   staff.batches = batch._id;
    // }
    if (
      depart.departmentChatGroup.length >= 1 &&
      depart.departmentChatGroup.includes(`${staff._id}`)
    ) {
    } else {
      depart.departmentChatGroup.push(staff._id);
      await depart.save();
    }
    staff.staffSubject.push(subject._id);
    staff.staffDesignationCount += 1;
    staff.recentDesignation = subjectTitle;
    user.isSubjectTeacher = "Yes";
    user.isSubjectChat.push(subject._id);
    subject.subjectTeacherName = staff._id;
    notify.notifyContent = `you got the designation of ${subject.subjectName} as Subject Teacher`;
    notify.notifySender = id;
    notify.notifyReceiever = user._id;
    user.uNotify.push(notify._id);
    notify.user = user._id;
    notify.notifyByInsPhoto = institute._id;
    // invokeFirebaseNotification(
    //   "Designation Allocation",
    //   notify,
    //   depart.dName,
    //   user._id,
    //   user.deviceToken
    // );
    await Promise.all([
      subjectMaster.save(),
      classes.save(),
      // batch.save(),
      staff.save(),
      subject.save(),
      depart.save(),
      user.save(),
      notify.save(),
    ]);
    res.status(200).send({
      message: "Successfully Created Subject",
      subject,
    });
  } catch (e) {
    console.log(e);
  }
};

exports.retrieveSubjectMaster = async (req, res) => {
  try {
    const { did } = req.params;
    const subjectMaster = await SubjectMaster.find({ department: did })
      .select("subjectName subjects")
      .lean()
      .exec();
    if (subjectMaster) {
      res
        .status(200)
        .send({ message: "SubjectMaster Are here", subjectMaster });
    } else {
      res.status(404).send({ message: "Failure" });
    }
  } catch {}
};

exports.retrieveClassArray = async (req, res) => {
  try {
    const { bid } = req.params;
    const batch = await Batch.findById({ _id: bid })
      .select("batchName batchStatus")
      .populate({
        path: "classroom",
        select:
          "className classDisplayPerson classStatus classAbout classTitle classCode photoId photo coverId cover",
        populate: {
          path: "classTeacher",
          select:
            "staffFirstName staffMiddleName staffLastName photoId staffProfilePhoto",
        },
      })
      .lean()
      .exec();
    if (batch) {
      res.status(200).send({ message: "Classes Are here", batch });
    } else {
      res.status(404).send({ message: "Failure" });
    }
  } catch (e) {
    console.log(e);
  }
};

exports.retrieveClassProfileSubject = async (req, res) => {
  try {
    const { cid } = req.params;
    const classes = await Class.findById({ _id: cid })
      .select(
        "className classTitle classHeadTitle classAbout subjectCount studentCount photoId photo coverId cover classStatus"
      )
      .populate({
        path: "classTeacher",
        select:
          "staffFirstName staffMiddleName staffLastName photoId staffProfilePhoto",
      })
      .populate({
        path: "batch",
        select: "batchName",
      })
      .populate({
        path: "department",
        select: "staffCount",
      })
      .populate({
        path: "displayPersonList",
        select: "displayTitle createdAt",
        populate: {
          path: "displayUser",
          select: "userLegalName username photoId profilePhoto",
        },
      })
      .lean()
      .exec();
    if (classes) {
      res.status(200).send({ message: "create class data", classes });
    } else {
      res.status(404).send({ message: "Failure" });
    }
  } catch {}
};

exports.retrieveClassSubject = async (req, res) => {
  try {
    const { cid } = req.params;
    const classes = await Class.findById({ _id: cid })
      .select("className classTitle classHeadTitle classAbout classStatus")
      .populate({
        path: "subject",
        select: "subjectName subjectTitle subjectStatus",
      })
      .lean()
      .exec();
    if (classes) {
      res.status(200).send({ message: "create class data", classes });
    } else {
      res.status(404).send({ message: "Failure" });
    }
  } catch {}
};

exports.fetchOneStaffDepartmentInfo = async (req, res) => {
  try {
    const { did } = req.params;
    const department = await Department.findById({ _id: did })
      .select(
        "dName dTitle photoId photo coverId staffCount classCount studentCount cover dAbout dEmail dPhoneNumber dSpeaker dVicePrinciple dAdminClerk dStudentPresident"
      )
      .populate({
        path: "dHead",
        select:
          "staffFirstName staffMiddleName staffLastName photoId staffProfilePhoto",
      })
      .populate({
        path: "institute",
        select: "insName",
      })
      .populate({
        path: "userBatch",
        select: "batchName batchStatus createdAt classCount",
        populate: {
          path: "classroom",
          select: "className classTitle classStatus",
        },
      })
      .populate({
        path: "displayPersonList",
        select: "displayTitle createdAt",
        populate: {
          path: "displayUser",
          select: "userLegalName username photoId profilePhoto",
        },
      })
      .lean()
      .exec();
    if (department) {
      res.status(200).send({ message: "Department Profile Data", department });
    } else {
      res.status(404).send({ message: "Failure" });
    }
  } catch {
    console.log(`SomeThing Went Wrong at this EndPoint(/staffdepartment/:did)`);
  }
};

exports.updateOneStaffDepartmentInfo = async (req, res) => {
  try {
    const { did } = req.params;
    const { dAbout, dEmail, dPhoneNumber } = req.body;
    const departmentInfo = await Department.findById({ _id: did });
    departmentInfo.dAbout = dAbout;
    departmentInfo.dEmail = dEmail;
    departmentInfo.dPhoneNumber = dPhoneNumber;
    await Promise.all([departmentInfo.save()]);
    res.status(200).send({ message: "Department Info Updates" });
  } catch (e) {
    console.log(e);
  }
};

exports.updateOneStaffClassInfo = async (req, res) => {
  try {
    const { cid } = req.params;
    const { classAbout } = req.body;
    const classInfo = await Class.findById({ _id: cid });
    classInfo.classAbout = classAbout;
    await classInfo.save();
    res.status(200).send({ message: "Class Info Updated", classInfo });
  } catch {}
};

exports.allStaffDepartmentClassList = async (req, res) => {
  try {
    const { bid } = req.params;
    const batch = await Batch.findById({ _id: bid })
      .select("batchName batchStatus")
      .populate({
        path: "classroom",
        select: "className classTitle classStatus photoId photo coverId cover",
      })
      .lean()
      .exec();
    if (batch) {
      res.status(200).send({ message: "Success", batch });
    } else {
      res.status(404).send({ message: "Failure" });
    }
  } catch {}
};

exports.retrieveNewBatch = async (req, res) => {
  try {
    const { did, id } = req.params;
    const department = await Department.findById({ _id: did });
    const institute = await InstituteAdmin.findById({ _id: id });
    const batch = await new Batch({ ...req.body });
    department.batches.push(batch);
    department.batchCount += 1;
    batch.department = department;
    batch.institute = institute;
    await Promise.all([department.save(), batch.save()]);
    res.status(200).send({ message: "batch data", batch: batch._id });
  } catch {}
};

exports.retrieveNewClassMaster = async (req, res) => {
  try {
    const { id, did } = req.params;
    const { className } = req.body;
    const institute = await InstituteAdmin.findById({ _id: id });
    const department = await Department.findById({ _id: did });
    const classroomMaster = await new ClassMaster({
      className: className,
      institute: institute._id,
      department: did,
    });
    department.departmentClassMasters.push(classroomMaster._id);
    department.classMasterCount += 1;
    await Promise.all([classroomMaster.save(), department.save()]);
    res.status(200).send({
      message: "Successfully Created MasterClasses",
      classroomMaster,
    });
  } catch {}
};

exports.retrieveNewSubjectMaster = async (req, res) => {
  try {
    const { id, did, bid } = req.params;
    const { subjectName } = req.body;
    const institute = await InstituteAdmin.findById({ _id: id });
    const departmentData = await Department.findById({ _id: did });
    const subjectMaster = await new SubjectMaster({
      subjectName: subjectName,
      institute: institute._id,
      department: did,
    });
    departmentData.departmentSubjectMasters.push(subjectMaster._id);
    departmentData.subjectMasterCount += 1;
    await Promise.all([departmentData.save(), subjectMaster.save()]);
    res.status(200).send({
      message: "Successfully Created Master Subject",
      subjectMaster,
    });
  } catch {}
};

exports.retrieveCurrentSelectBatch = async (req, res) => {
  try {
    const { did, bid } = req.params;
    const department = await Department.findById({ _id: did });
    const batches = await Batch.findById({ _id: bid });
    department.departmentSelectBatch = batches._id;
    department.userBatch = batches._id;
    await department.save();
    res
      .status(200)
      .send({
        message: "Batch Detail Data",
        batches: batches._id,
        department: department.departmentSelectBatch,
      });
  } catch (e) {
    console.log(e);
  }
};

exports.retrieveClass = async (req, res) => {
  try {
    const { cid } = req.params;
    const classes = await Class.findById({ _id: cid })
      .select(
        "className classTitle classCode classStartDate classStatus studentCount photoId photo coverId cover subjectCount classAbout classDisplayPerson classStudentTotal"
      )
      .populate({
        path: "subject",
        select: "subjectName subjectTitle subjectStatus",
      })
      .populate({
        path: "batch",
        select: "batchName batchStatus",
      })
      .populate({
        path: "classTeacher",
        select:
          "staffFirstName staffMiddleName staffLastName photoId studentProfilePhoto",
      })
      .populate({
        path: "department",
        select: "dName",
      })
      .populate({
        path: "displayPersonList",
        select: "displayTitle createdAt",
        populate: {
          path: "displayUser",
          select: "userLegalName username photoId profilePhoto",
        },
      })
      .lean()
      .exec();
    if (classes) {
      res.status(200).send({ message: "Class Profile Data", classes });
    } else {
      res.status(404).send({ message: "Failure" });
    }
  } catch {
    console.log(`SomeThing Went Wrong at this EndPoint(/staffclass/:sid)`);
  }
};

exports.retrieveSubject = async (req, res) => {
  try {
    const { suid } = req.params;
    const subData = await Subject.findById({ _id: suid })
      .select("subjectName subjectStatus subjectTitle")
      .populate({
        path: "class",
        select: "className classStatus",
        populate: {
          path: "ApproveStudent",
          select:
            "studentFirstName studentMiddleName studentLastName photoId studentProfilePhoto studentROLLNO",
        },
      })
      .lean()
      .exec();
    if (subData) {
      res
        .status(200)
        .send({ message: " Subject same as class catalog", subData });
    } else {
      res.status(404).send({ message: "Failure" });
    }
  } catch {}
};

exports.retrieveStaffCode = async (req, res) => {
  try {
    const { id } = req.params;
    const institute = await InstituteAdmin.findById({ _id: id })
      .select("staffJoinCode insName")
      .lean()
      .exec();
    if (institute) {
      res.status(200).send({ message: "Success", institute });
    } else {
      res.status(404).send({ message: "Failure" });
    }
  } catch (e) {}
};

exports.retrieveStudentCode = async (req, res) => {
  try {
    const { id } = req.params;
    const institute = await InstituteAdmin.findById({ _id: id })
      .select("classCodeList insName")
      .lean()
      .exec();
    if (institute) {
      res.status(200).send({ message: "Success", institute });
    } else {
      res.status(404).send({ message: "Failure" });
    }
  } catch {}
};

exports.replyAnnouncement = async (req, res) => {
  try {
    var institute_session = req.tokenData && req.tokenData.insId;
    var user_session = req.tokenData && req.tokenData.userId;
    const { aid } = req.params;
    const institute = await InstituteAdmin.findOne({ _id: institute_session });
    const user = await User.findOne({ _id: user_session });
    var replyAnn = await InsAnnouncement.findById({ _id: aid });
    var replyData = new ReplyAnnouncement({ ...req.body });
    replyAnn.reply.push(replyData._id);

    if (institute) {
      replyData.replyAuthorAsIns = institute._id;
      await Promise.all([replyData.save(), replyAnn.save()]);
      res.status(200).send({ message: "Reply" });
    } else if (user) {
      replyData.replyAuthorAsUser = user._id;
      await Promise.all([replyData.save(), replyAnn.save()]);
      res.status(200).send({ message: "Reply" });
    } else {
    }
  } catch {}
};

exports.retrieveStaffProfileStatus = async (req, res) => {
  try {
    const { sid } = req.params;
    const staff = await Staff.findById({ _id: sid })
      .select("staffStatus")
      .lean()
      .exec();
    if (staff) {
      res.status(200).send({ message: "Success", staff });
    } else {
      res.status(404).send({ message: "Failure" });
    }
  } catch {}
};

exports.retrieveStudentProfileStatus = async (req, res) => {
  try {
    const { sid } = req.params;
    const student = await Student.findById({ _id: sid })
      .select("studentStatus")
      .lean()
      .exec();
    if (student) {
      res.status(200).send({ message: "Success", student });
    } else {
      res.status(404).send({ message: "Failure" });
    }
  } catch {}
};

exports.retrieveDisplayPersonArray = async (req, res) => {
  try {
    const { id } = req.params;
    const institute = await InstituteAdmin.findById({ _id: id })
      .select("id")
      .populate({
        path: "displayPersonList",
        select: "displayTitle createdAt",
        populate: {
          path: "displayUser",
          select: "userLegalName username photoId profilePhoto",
        },
      })
      .lean()
      .exec();
    if (institute) {
      res.status(200).send({ message: "Success", institute });
    } else {
      res.status(404).send({ message: "Failure" });
    }
  } catch {}
};

exports.updateDisplayPersonArray = async (req, res) => {
  try {
    const { id } = req.params;
    const institute = await InstituteAdmin.findById({ _id: id });
    const user = await User.findById({ _id: `${req.body.displayUser}` });
    const notify = new Notification({});
    const display = new DisplayPerson({});

    display.displayTitle = req.body.displayTitle;
    display.displayUser = user._id;
    institute.displayPersonList.push(display._id);
    display.displayBy = institute._id;
    user.displayPersonArray.push(display._id);

    notify.notifyContent = `Congrats 🎉 for ${req.body.displayTitle} of the ${institute.insName}`;
    notify.notifySender = institute._id;
    notify.notifyReceiever = user._id;
    user.uNotify.push(notify._id);
    notify.user = user._id;
    notify.notifyByPhoto = user._id;
    await Promise.all([
      institute.save(),
      display.save(),
      user.save(),
      notify.save(),
    ]);
    res.status(200).send({ message: "Success", display });
  } catch (e) {
    console.log(e);
  }
};

exports.updateDisplayPersonIns = async (req, res) => {
  try {
    const { did } = req.params;
    const display = await DisplayPerson.findById({ _id: did });
    display.displayTitle = req.body.displayTitle;
    display.displayUser = req.body.displayUser;
    await Promise.all([display.save()]);
    res.status(200).send({ message: "update Display Person" });
  } catch (e) {}
};

exports.deleteDisplayPersonArray = async (req, res) => {
  try {
    const { id, did, uid } = req.params;
    await InstituteAdmin.findByIdAndUpdate(id, {
      $pull: { displayPersonList: did },
    });
    await User.findByIdAndUpdate(uid, { $pull: { displayPersonArray: did } });
    await DisplayPerson.findByIdAndDelete({ _id: did });
    res.status(200).send({ message: "Deleted" });
  } catch {}
};

exports.retrieveStarAnnouncementArray = async (req, res) => {
  try {
    const { aid } = req.params;
    var institute_session = req.tokenData && req.tokenData.insId;
    var user_session = req.tokenData && req.tokenData.userId;
    const insAnn = await InsAnnouncement.findById({ _id: aid });
    if (institute_session) {
      var institute = await InstituteAdmin.findById({ _id: institute_session });
      if (
        insAnn.starList.length >= 1 &&
        insAnn.starList.includes(String(institute._id))
      ) {
        insAnn.starList.pull(institute._id);
        institute.starAnnouncement.pull(insAnn._id);
        await Promise.all([insAnn.save(), institute.save()]);
        res.status(200).send({ message: "Remove from Star By Ins" });
      } else {
        insAnn.starList.push(institute._id);
        institute.starAnnouncement.push(insAnn._id);
        await Promise.all([insAnn.save(), institute.save()]);
        res.status(200).send({ message: "Added to Star By Ins" });
      }
    } else if (user_session) {
      var user = await User.findById({ _id: user_session });
      if (
        insAnn.starList.length >= 1 &&
        insAnn.starList.includes(String(user._id))
      ) {
        insAnn.starList.pull(user._id);
        user.starAnnouncement.pull(insAnn._id);
        await Promise.all([insAnn.save(), user.save()]);
        res.status(200).send({ message: "Remove from Star By User" });
      } else {
        insAnn.starList.push(user._id);
        user.starAnnouncement.push(insAnn._id);
        await Promise.all([insAnn.save(), user.save()]);
        res.status(200).send({ message: "Added to Star By User" });
      }
    } else {
    }
  } catch (e) {
    console.log(e);
  }
};

exports.retrieveAllStarArray = async (req, res) => {
  try {
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const { id } = req.params;
    const skip = (page - 1) * limit;
    const institute = await InstituteAdmin.findById({ _id: id }).populate({
      path: "starAnnouncement",
    });
    const announcement = await InsAnnouncement.find({
      _id: { $in: institute.starAnnouncement },
    })
      .select(
        "insAnnTitle insAnnPhoto insAnnDescription insAnnVisibility createdAt"
      )
      .populate({
        path: "reply",
        select: "replyText replyAuthorByIns replyAuthorByUser createdAt",
      })
      .populate({
        path: "institute",
        select: "insName photoId insProfilePhoto",
      })
      .sort("-createdAt")
      .limit(limit)
      .skip(skip);
    res.status(200).send({ message: "Success", announcement });
  } catch (e) {
    console.log(e);
  }
};

exports.retrieveAllStarAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const institute = await InstituteAdmin.findById({ _id: id })
      .select("id")
      .populate({
        path: "starAnnouncement",
        select:
          "insAnnTitle insAnnPhoto insAnnDescription insAnnVisibility createdAt",
        populate: {
          path: "reply",
          select: "replyText replyAuthorByIns replyAuthorByUser createdAt",
        },
      })
      .populate({
        path: "starAnnouncement",
        select:
          "insAnnTitle insAnnPhoto insAnnDescription insAnnVisibility createdAt",
        populate: {
          path: "institute",
          select: "insName photoId insProfilePhoto",
        },
      })
      .lean()
      .exec();
    res.status(200).send({ message: "Success", institute });
  } catch {}
};

exports.retrieveRecoveryMailIns = async (req, res) => {
  try {
    const { id } = req.params;
    const { recoveryMail } = req.body;
    const institute = await InstituteAdmin.findById({ _id: id });
    institute.recoveryMail = recoveryMail;
    await Promise.all([institute.save()]);
    res.status(200).send({ message: "Success", mail: institute.recoveryMail });
  } catch {}
};

exports.retrieveInsFollowersArray = async (req, res) => {
  try {
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const { id } = req.params;
    const skip = (page - 1) * limit;
    const institute = await InstituteAdmin.findById({ _id: id })
      .populate({ path: "followers" })
      .populate({ path: "userFollowersList" });

    const followers = await InstituteAdmin.find({
      _id: { $in: institute.followers },
    })
      .select("insName photoId insProfilePhoto name")
      .limit(limit)
      .skip(skip);

    const uFollowers = await User.find({
      _id: { $in: institute.userFollowersList },
    })
      .select("userLegalName photoId profilePhoto username")
      .limit(limit)
      .skip(skip);
    res
      .status(200)
      .send({
        message: "Followers List",
        iFollowers: followers,
        uFollowers: uFollowers,
      });
  } catch (e) {
    console.log(e);
  }
};

exports.retrieveInsFollowingArray = async (req, res) => {
  try {
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const { id } = req.params;
    const skip = (page - 1) * limit;

    const institute = await InstituteAdmin.findById({ _id: id }).populate({
      path: "following",
    });

    const following = await InstituteAdmin.find({
      _id: { $in: institute.following },
    })
      .select("insName photoId insProfilePhoto name")
      .limit(limit)
      .skip(skip);

    res.status(200).send({ message: "Following List", following: following });
  } catch {}
};

exports.retrieveDepartmentAllBatch = async (req, res) => {
  try {
    const { did } = req.params;
    const department = await Department.findById({ _id: did })
      .select("id")
      .populate({
        path: "batches",
        select: "batchName batchStatus createdAt",
      })
      .populate({
        path: "departmentSelectBatch",
        select: "batchName batchStatus createdAt",
      })
      .lean()
      .exec();
    if (department) {
      res
        .status(200)
        .send({
          message: "Success",
          departmentActiveBatch: department.departmentSelectBatch,
          allBatch: department.batches,
        });
    } else {
      res.status(404).send({ message: "Failure" });
    }
  } catch (e) {
    console.log(e);
  }
};

exports.retrieveApproveStudentRequest = async (req, res) => {
  var date = new Date();
  var p_date = date.getDate();
  var p_month = date.getMonth() + 1;
  var p_year = date.getFullYear();
  if (p_month <= 10) {
    p_month = `0${p_month}`;
  }
  var c_date = `${p_year}-${p_month}-${p_date}`;
  try {
    const { id, sid, cid, did, bid } = req.params;
    const institute = await InstituteAdmin.findById({ _id: id });
    const admins = await Admin.findById({ _id: `${process.env.S_ADMIN_ID}` });
    const student = await Student.findById({ _id: sid }).populate({
      path: "user",
    });
    const user = await User.findById({ _id: `${student.user._id}` });
    const classes = await Class.findById({ _id: cid });
    const depart = await Department.findById({ _id: did });
    const batch = await Batch.findById({ _id: bid });
    const notify = await new Notification({});
    student.studentStatus = req.body.status;
    institute.ApproveStudent.push(student._id);
    admins.studentArray.push(student._id);
    admins.studentCount += 1;
    institute.student.pull(sid);
    institute.studentCount += 1
    if (c_date <= institute.insFreeLastDate) {
      institute.insFreeCredit = institute.insFreeCredit + 1;
    }
    classes.ApproveStudent.push(student._id);
    classes.studentCount += 1;
    classes.student.pull(sid);
    student.studentGRNO = classes.ApproveStudent.length;
    student.studentROLLNO = classes.ApproveStudent.length;
    student.studentClass = classes._id;
    student.studentAdmissionDate = c_date;
    depart.ApproveStudent.push(student._id);
    depart.studentCount += 1;
    student.department = depart._id;
    batch.ApproveStudent.push(student._id);
    student.batches = batch._id;
    notify.notifyContent = `${student.studentFirstName}${
      student.studentMiddleName ? ` ${student.studentMiddleName}` : ""
    } ${student.studentLastName} joined as a Student of Class ${
      classes.className
    } of ${batch.batchName}`;
    notify.notifySender = cid;
    notify.notifyReceiever = user._id;
    institute.iNotify.push(notify._id);
    notify.institute = institute._id;
    user.uNotify.push(notify._id);
    notify.user = user._id;
    notify.notifyByStudentPhoto = student._id;
    // invokeFirebaseNotification(
    //   "Student Approval",
    //   notify,
    //   institute.insName,
    //   user._id,
    //   user.deviceToken
    // );
    await Promise.all([
      admins.save(),
      classes.save(),
      depart.save(),
      batch.save(),
      student.save(),
      institute.save(),
      user.save(),
      notify.save(),
    ]);
    res.status(200).send({
      message: `Welcome To The Institute ${student.studentFirstName} ${student.studentLastName}`,
      classes: classes._id,
    });
  } catch (e) {
    console.log(e);
  }
};

exports.retrieveRejectStudentRequest = async (req, res) => {
  try {
    const { id, sid, cid } = req.params;
    const institute = await InstituteAdmin.findById({ _id: id });
    const student = await Student.findById({ _id: sid });
    const classes = await Class.findById({ _id: cid });
    student.studentStatus = req.body.status;
    institute.student.pull(sid);
    classes.student.pull(sid);
    await Promise.all([institute.save(), classes.save(), student.save()]);
    res.status(200).send({
      message: `Application Rejected ${student.studentFirstName} ${student.studentLastName}`,
      classes: classes._id,
    });
  } catch (e) {
    console.log(e);
  }
};

exports.retrievePendingRequestArray = async (req, res) => {
  try {
    const { cid } = req.params;
    const classes = await Class.findById({ _id: cid })
      .select("className classStatus classTitle")
      .populate({
        path: "student",
        select:
          "studentFirstName studentMiddleName studentLastName photoId studentProfilePhoto",
      })
      .lean()
      .exec();
    res.status(200).send({ message: "Pending Request", classes });
  } catch (e) {
    console.log(e);
  }
};

exports.retrieveApproveCatalogArray = async (req, res) => {
  try {
    const { cid } = req.params;
    const currentDate = new Date();
    const currentDateLocalFormat = currentDate.toISOString().split("-");
    const day =
      +currentDateLocalFormat[2].split("T")[0] > 9
        ? +currentDateLocalFormat[2].split("T")[0]
        : `0${+currentDateLocalFormat[2].split("T")[0]}`;
    const month =
      +currentDateLocalFormat[1] > 9
        ? +currentDateLocalFormat[1]
        : `0${+currentDateLocalFormat[1]}`;
    const year = +currentDateLocalFormat[0];
    // const regExpression = new RegExp(`${day}\/${month}\/${year}$`);
    const classes = await Class.findById({ _id: cid })
      .select("className classStatus classTitle")
      .populate({
        path: "ApproveStudent",
        select: "leave",
        populate: {
          path: "leave",
          match: {
            date: { $in: [`${day}/${month}/${year}`] },
          },
          select: "date",
        },
      })
      .populate({
        path: "ApproveStudent",
        select: "studentFirstName studentMiddleName studentLastName photoId studentProfilePhoto studentROLLNO",
        populate: {
          path: "user",
          select: "userLegalName username",
        },
      })
      .lean()
      .exec();
    res.status(200).send({ message: "Approve catalog", classes });
  } catch (e) {
    console.log(e);
  }
};

exports.retrieveDepartmentStaffArray = async (req, res) => {
  try {
    const { did } = req.params;
    const department = await Department.findById({ _id: did })
      .select("dName")
      .populate({
        path: "departmentChatGroup",
        select:
          "staffFirstName staffMiddleName staffLastName photoId staffProfilePhoto staffROLLNO",
      });
    res.status(200).send({ message: "Department Staff List", department });
  } catch {}
};

exports.retrieveInstituteTwoArray = async (req, res) => {
  try {
    const { id } = req.params;
    const institute = await InstituteAdmin.findById({ _id: id }).select(
      "id followers following"
    );
    res.status(200).send({ message: "2-List Array", institute });
  } catch {}
};

exports.retrieveOneAnnouncement = async (req, res) => {
  try {
    const { aid } = req.params;
    const announcement = await InsAnnouncement.findById({ _id: aid })
      .select(
        "insAnnTitle insAnnDescription insAnnPhoto insAnnVisibilty starList createdAt"
      )
      .populate({
        path: "reply",
        select: "replyText createdAt",
        populate: {
          path: "replyAuthorAsIns",
          select: "insName name photoId insProfilePhoto",
        },
      })
      .populate({
        path: "institute",
        select: "insName name photoId insProfilePhoto",
      })
      .populate({
        path: "reply",
        select: "replyText createdAt",
        populate: {
          path: "replyAuthorAsUser",
          select: "userLegalName username photoId profilePhoto",
        },
      })
      .populate({
        path: "announcementDocument",
        select: "documentType documentName documentKey",
      });
    res.status(200).send({ message: "One Announcement", announcement });
  } catch (e) {
    console.log(e);
  }
};

exports.updateDepartmentDisplayPersonArray = async (req, res) => {
  try {
    const { did } = req.params;
    const department = await Department.findById({ _id: did });
    const user = await User.findById({ _id: `${req.body.displayUser}` });
    const notify = new Notification({});
    const display = new DisplayPerson({});

    display.displayTitle = req.body.displayTitle;
    display.displayUser = user._id;
    department.displayPersonList.push(display._id);
    display.displayBy = department._id;
    user.displayPersonArray.push(display._id);

    notify.notifyContent = `Congrats 🎉 for ${req.body.displayTitle} of the ${department.dName}`;
    notify.notifySender = department._id;
    notify.notifyReceiever = user._id;
    user.uNotify.push(notify._id);
    notify.user = user._id;
    notify.notifyByPhoto = user._id;
    await Promise.all([
      department.save(),
      display.save(),
      user.save(),
      notify.save(),
    ]);
    res.status(200).send({ message: "Success", display });
  } catch (e) {
    console.log(e);
  }
};

exports.updateClassDisplayPersonArray = async (req, res) => {
  try {
    const { cid } = req.params;
    const classes = await Class.findById({ _id: cid });
    const user = await User.findById({ _id: `${req.body.displayUser}` });
    const notify = new Notification({});
    const display = new DisplayPerson({});

    display.displayTitle = req.body.displayTitle;
    display.displayUser = user._id;
    classes.displayPersonList.push(display._id);
    display.displayBy = classes._id;
    user.displayPersonArray.push(display._id);

    notify.notifyContent = `Congrats 🎉 for ${req.body.displayTitle} of the ${classes.className}`;
    notify.notifySender = classes._id;
    notify.notifyReceiever = user._id;
    user.uNotify.push(notify._id);
    notify.user = user._id;
    notify.notifyByPhoto = user._id;
    await Promise.all([
      classes.save(),
      display.save(),
      user.save(),
      notify.save(),
    ]);
    res.status(200).send({ message: "Success", display });
  } catch (e) {
    console.log(e);
  }
};
