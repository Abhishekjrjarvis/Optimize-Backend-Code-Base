const bcrypt = require('bcryptjs')
const Admin = require('../../models/superAdmin')
const InstituteAdmin = require('../../models/InstituteAdmin')
const User = require('../../models/User')
const Notification = require('../../models/notification')
const axios = require("axios");
const {
  uploadDocFile,
} = require("../../S3Configuration");
const fs = require("fs");
const util = require("util");
const unlinkFile = util.promisify(fs.unlink);
const smartPhrase = require('../../smartRecoveryPhrase')


var AdminOTP = "";

const generateAdminOTP = async (mob) => {
  let rand1 = Math.floor(Math.random() * 9) + 1;
  let rand2 = Math.floor(Math.random() * 9) + 1;
  let rand3 = Math.floor(Math.random() * 9) + 1;
  let rand4 = Math.floor(Math.random() * 9) + 1;
  AdminOTP = `${rand1}${rand2}${rand3}${rand4}`;
  const data = axios
    .post(
      `http://mobicomm.dove-sms.com//submitsms.jsp?user=Mithkal&key=4c3168d558XX&mobile=+91${mob}&message=Welcome to Qviple, Your Qviple account verification OTP is ${AdminOTP} Mithkal Minds Pvt Ltd.&senderid=QVIPLE&accusage=6`
    )
    .then((res) => {
      if ((res && res.data.includes("success")) || res.data.includes("sent")) {
        console.log("messsage Sent Successfully");
      } else {
        console.log("something went wrong");
      }
    })
    .catch(() => {});
};



exports.getAdmin = async(req, res) =>{
    try {
        const admins = await Admin.find({})
        .select('id')
        res.status(200).send({ message: 'Success', admins });
    } catch(e) {
        console.log(`Error`, e.message);
    }
}

exports.getSuperAdmin = async(req, res) =>{
    res.render('SuperAdmin')
}


exports.sendOtpToAdmin = async(req, res) =>{
    try{
        generateAdminOTP(req.body.adminPhoneNumber).then((data) =>{
            res.status(200).send({ message: 'OTP send', adminPhoneNumber: req.body.adminPhoneNumber})
        })
    }
    catch{

    }
}


exports.getVerifySuperAdmin = async(req, res) =>{
    try{
        if (req.body.adminCode && req.body.adminCode === `${AdminOTP}`) {
            var adminStatus = "Verified";
            res.status(200).send({ message: 'Verified', status: adminStatus})
          } else {
            res.status(404).send({ message: 'Invalid OTP'})
          }
    }
    catch(e){
      console.log(e)
    }
}





exports.updateSuperAdmin = async(req, res) =>{
  try {
        const file = req.file;
        const results = await uploadDocFile(file);
        const genPassword = bcrypt.genSaltSync(12);
        const hashPassword = bcrypt.hashSync(adminPassword, genPassword);
        const admin = new Admin({ ...req.body });
        admin.adminAadharCard = results.key;
        admin.adminPassword = hashPassword
        admin.photoId = "1";
        await Promise.all([admin.save()]);
        await unlinkFile(file.path);
        res.status(201).send({ message: "Admin", admin });
  } catch (e) {
    console.log(`Error`, e);
  }
}


exports.retrieveRecoveryPhrase = async(req, res) =>{
  try{
    const adminPhrase = smartPhrase()
    if(adminPhrase){
      res.status(200).send({ message: 'Success', adminPhrase})
    }
    else{
      res.status(404).send({ message: 'Failure'})
    }
  }
  catch{

  }
}


exports.getAll = async(req, res) =>{
    try{
        const { id } = req.params;
        const admin = await Admin.findById({ _id: id }).populate({
            path: "ApproveInstitute",
            populate: {
            path: "financeDepart",
            },
        })
        .populate("RejectInstitute")
        .populate("instituteList")
        .populate("users")
        .populate({
            path: "instituteIdCardBatch",
            populate: {
                path: "institute",
            },
        })
        .populate({
            path: "reportList",
            populate: {
                path: "reportInsPost",
                populate: {
                    path: "institute",
                },
            },
            })
            .populate({
                path: "instituteIdCardBatch",
                populate: {
                   path: "ApproveStudent",
                },
            })
            .populate("blockedUsers")
            .populate({
                path: "reportList",
                populate: {
                    path: "reportBy",
                },
            }).populate({
                path: "reportList",
                populate: {
                    path: "reportUserPost",
                    populate: {
                      path: "user",
                },
            },
            })
            .populate("idCardPrinting")
            .populate("idCardPrinted")
            .populate({
                path: "feedbackList",
                populate: {
                    path: "user",
                },
            });
        res.status(200).send({ message: "Admin Detail", admin });       
    }
    catch{

    }
}


exports.getApproveIns = async(req, res) =>{
    try {
        const { aid, id } = req.params;
        const { referalPercentage, insFreeLastDate, insPaymentLastDate, userID, status} = req.body;

        const admin = await Admin.findById({ _id: aid });
        const institute = await InstituteAdmin.findById({ _id: id });
        const user = await User.findById({ _id: userID });
        const rInstitute = await InstituteAdmin.findById({ _id: userID });
        const notify = await new Notification({});
    
        admin.ApproveInstitute.push(institute);
        admin.instituteList.pull(id);
        institute.insFreeLastDate = insFreeLastDate;
        institute.insPaymentLastDate = insPaymentLastDate;
        institute.status = status;

        if (user) {
          admin.referals.push(user);
          user.InstituteReferals.push(institute);
          user.referalPercentage = user.referalPercentage + parseInt(referalPercentage);
          institute.AllUserReferral.push(user);
          await user.save();
          await institute.save();

        } else if (rInstitute) {
          admin.referalsIns.push(rInstitute);
          rInstitute.instituteReferral.push(institute);
          rInstitute.referalPercentage = rInstitute.referalPercentage + parseInt(referalPercentage);
          institute.AllInstituteReferral.push(rInstitute);
          await rInstitute.save();
          await institute.save();
        }

        notify.notifyContent = "Approval For Super Admin is successfull";
        notify.notifySender = aid;
        notify.notifyReceiever = id;
        institute.iNotify.push(notify);
        notify.institute = institute;
        notify.notifyByInsPhoto = institute;
        await institute.save();
        await notify.save();
        await admin.save();
        res.status(200).send({
          message: `Congrats for Approval ${institute.insName}`,
          admin,
          institute,
        });
      } catch (e) {console.log('Error', e.message)}
}


exports.getRejectIns = async(req, res) =>{
    try {
        const { aid, id } = req.params;
        const { rejectReason, status } = req.body;

        const admin = await Admin.findById({ _id: aid });
        const institute = await InstituteAdmin.findById({ _id: id });
        const notify = await new Notification({});

        admin.RejectInstitute.push(institute);
        admin.instituteList.pull(id);
        institute.status = status;
        institute.rejectReason = rejectReason;
        notify.notifyContent = `Rejected from Super Admin Contact at connect@qviple.com`;
        notify.notifySender = aid;
        notify.notifyReceiever = id;
        institute.iNotify.push(notify);
        notify.institute = institute;
        notify.notifyByInsPhoto = institute;

        await admin.save();
        await institute.save();
        await notify.save();
        res.status(200).send({
          message: `Application Rejected ${institute.insName}`,
          admin,
          institute,
        });
      } catch {
        console.log(
          `Error`, e.message
        );
      }
}


exports.getReferralIns = async(req, res) =>{
    try {
        const institute = await InstituteAdmin.find({});
        res.status(200).send({ message: "institute detail", institute });
    } catch(e) {
        console.log(
          `Error`, e.message
        );
    }
}


exports.getReferralUser = async(req, res) =>{
    try {
      const user = await User.find({});
      res.status(200).send({ message: "User Referal Data", user });
    } catch(e) {
      console.log(`Error`, e.message);
    }
}


exports.retrieveLandingPageCount = async(req, res) =>{
  try{
    const admin = await Admin.findById({_id: `${process.env.S_ADMIN_ID}`})
    .select('instituteCount userCount studentCount staffCount')
    res.status(200).send({ message: 'Success', admin})
  }
  catch{

  }
}