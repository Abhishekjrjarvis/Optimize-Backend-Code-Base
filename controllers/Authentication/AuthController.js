// ==================ALL ROUTES ADDED TO SWAGGER=====================================================

const Admin = require("../../models/superAdmin");
const InstituteAdmin = require("../../models/InstituteAdmin");
const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const Post = require('../../models/Post')
const {
  getFileStream,
  uploadDocFile,
  uploadFile,
} = require("../../S3Configuration");
const fs = require("fs");
const util = require("util");
const unlinkFile = util.promisify(fs.unlink);
const axios = require("axios");
const jwt = require("jsonwebtoken");
const usernameGenerator = require('./AuthFunction')
const Referral = require('../../models/QCoins/Referral')
const SupportChat = require('../../models/Chat/SupportChat')



function generateAccessToken(username, userId, userPassword) {
  return jwt.sign({ username, userId, userPassword }, process.env.TOKEN_SECRET, { expiresIn: "1y", });
}

function generateAccessInsToken(name, insId, insPassword) {
  return jwt.sign({ name, insId, insPassword }, process.env.TOKEN_SECRET, { expiresIn: "1y", });
}

function generateAccessAdminToken(adminUserName, adminId, adminPassword) {
  return jwt.sign({ adminUserName, adminId, adminPassword }, process.env.TOKEN_SECRET, { expiresIn: "1y", });
}



exports.getRegisterIns = async (req, res) => {
  try {
    const admins = await Admin.findById({ _id: `${process.env.S_ADMIN_ID}` });
    const existInstitute = await InstituteAdmin.findOne({
      name: req.body.name,
    });
    const existAdmin = await Admin.findOne({ adminUserName: req.body.name });
    const existUser = await User.findOne({ username: req.body.name });
    if (existAdmin) {
      res.status(200).send({ message: "Username already exists" });
    } else if (existUser) {
      res.status(200).send({ message: "Username already exists" });
    } else {
      if (existInstitute) {
        res.send({ message: "Institute Existing with this Username" });
      } else {
        const institute = new InstituteAdmin({ ...req.body });
        if(req.body.userId !== ''){
          const user = await User.findOne({ username: req.body.userId })
          if(user){
          var refCoins = new Referral({referralEarnStatus: 'Earned'})
          refCoins.referralBy = institute._id
          institute.referralArray.push(refCoins._id)
          institute.initialReferral = user._id
          refCoins.referralTo = user._id
          user.referralArray.push(refCoins._id)
          user.referralStatus = 'Granted'
          user.paymentStatus = 'Not Paid'
          await Promise.all([ refCoins.save(), user.save()])
          }
        }
        institute.photoId = "1";
        institute.coverId = "2";
        admins.instituteList.push(institute);
        admins.requestInstituteCount += 1
        await Promise.all([admins.save(), institute.save()]);
        res.status(201).send({ message: "Institute", institute });
        const uInstitute = await InstituteAdmin.findOne({ isUniversal: 'Universal'})
        if(uInstitute && uInstitute.posts.length >=1){
        uInstitute.posts.forEach(async (ele) => {
          institute.posts.push(ele)
        })
        await institute.save()
        }
      }
    }
  } catch (e) {
    console.log(`Error`, e);
  }
};

exports.getDocIns = async (req, res) => {
  try {
    const key = req.params.key;
    const readStream = getFileStream(key);
    readStream.pipe(res);
  } catch {
    console.log(`Error`, e.message);
  }
};

exports.getUpDocIns = async (req, res) => {
  try {
    const id = req.params.id;
    const file = req.file;
    const results = await uploadDocFile(file);
    const institute = await InstituteAdmin.findById({ _id: id });
    institute.insDocument = results.key;
    await institute.save();
    await unlinkFile(file.path);
    res.status(200).send({ message: "Uploaded" });
  } catch (e) {
    console.log(`Error`, e.message);
  }
};


exports.getPassIns = async (req, res) => {
  try {
    const { id } = req.params;
    const { insPassword, insRePassword } = req.body;
    const institute = await InstituteAdmin.findById({ _id: id });
    const admin = await Admin.findById({_id: `${process.env.S_ADMIN_ID}`})
    const genPass = bcrypt.genSaltSync(12);
    const hashPass = bcrypt.hashSync(insPassword, genPass);
    if (insPassword === insRePassword) {
      institute.insPassword = hashPass;
      await institute.save();
      const token = generateAccessInsToken(institute?.name, institute?._id, institute?.insPassword);
      res.json({ token: `Bearer ${token}`, institute: institute, login: true});
    } else {
      res.send({ message: "Invalid Combination", login: false });
    }
  } catch (e) {
    console.log(`Error`, e.message);
  }
};

var OTP = "";

var r_date = new Date();
var r_l_date = new Date(r_date);
r_l_date.setDate(r_l_date.getDate() + 21);
var r_l_day = r_l_date.getDate();
var r_l_month = r_l_date.getMonth() + 1;
var r_l_year = r_l_date.getFullYear();
if (r_l_month < 10) {
  r_l_month = `0${r_l_month}`;
}
var rDate = `${r_l_year}-${r_l_month}-${r_l_day}`;

const generateOTP = async (mob) => {
  let rand1 = Math.floor(Math.random() * 9) + 1;
  let rand2 = Math.floor(Math.random() * 9) + 1;
  let rand3 = Math.floor(Math.random() * 9) + 1;
  let rand4 = Math.floor(Math.random() * 9) + 1;
  OTP = `${rand1}${rand2}${rand3}${rand4}`;
  const data = axios
    .post(
      `http://mobicomm.dove-sms.com//submitsms.jsp?user=Mithkal&key=4c3168d558XX&mobile=+91${mob}&message=Welcome to Qviple, Your Qviple account verification OTP is ${OTP} Mithkal Minds Pvt Ltd.&senderid=QVIPLE&accusage=6`
    )
    .then((res) => {
      if ((res && res.data.includes("success")) || res.data.includes("sent")) {
        console.log("messsage Sent Successfully", res.data);
      } else {
        console.log("something went wrong");
      }
    });
};

exports.getOtpAtUser = async (req, res) => {
  try {
    const { userPhoneNumber, status } = req.body;
    if (userPhoneNumber) {
      if (status === "Not Verified") {
        generateOTP(userPhoneNumber).then((data) => {
          res.status(200).send({
            message: "code will be send to registered mobile number",
            userPhoneNumber,
          });
        });
      } else {
        res.send({ message: "User will be verified..." });
      }
    } else {
      res.send({ message: "Invalid Phone No." });
    }
  } catch (e) {
    console.log(`Error`, e.message);
  }
};

var InsOTP = "";

const generateInsOTP = async (mob) => {
  let rand1 = Math.floor(Math.random() * 9) + 1;
  let rand2 = Math.floor(Math.random() * 9) + 1;
  let rand3 = Math.floor(Math.random() * 9) + 1;
  let rand4 = Math.floor(Math.random() * 9) + 1;
  InsOTP = `${rand1}${rand2}${rand3}${rand4}`;
  const data = axios
    .post(
      `http://mobicomm.dove-sms.com//submitsms.jsp?user=Mithkal&key=4c3168d558XX&mobile=+91${mob}&message=Welcome to Qviple, Your Qviple account verification OTP is ${InsOTP} Mithkal Minds Pvt Ltd.&senderid=QVIPLE&accusage=6`
    )
    .then((res) => {
      if ((res && res.data.includes("success")) || res.data.includes("sent")) {
        console.log("messsage Sent Successfully", res.data);
      } else {
        console.log("something went wrong");
      }
    })
    .catch(() => {});
};

exports.getOtpAtIns = async (req, res) => {
  try {
    const { insPhoneNumber, status } = req.body;
    if (insPhoneNumber) {
      if (status === "Not Verified") {
        generateInsOTP(insPhoneNumber).then((data) => {
          res.status(200).send({
            message: "code will be send to registered mobile number",
            insPhoneNumber,
          });
        });
      } else {
        res.send({ message: "Institute Phone Number will be verified..." });
      }
    } else {
      res.send({ message: "Invalid Phone No." });
    }
  } catch {
    console.log(`SomeThing Went Wrong at this EndPoint(/ins-detail)`);
  }
};

exports.verifyOtpByUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (req.body.userOtpCode && req.body.userOtpCode === OTP) {
      var userStatus = "approved";
      res.send({ message: "OTP verified", id, userStatus });
    } else {
      res.send({ message: "Invalid OTP" });
    }
  } catch (e) {
    console.log(`Error`, e.message);
  }
};

exports.verifyOtpByIns = async (req, res) => {
  try {
    const { id } = req.params;
    if (req.body.insOtpCode && req.body.insOtpCode === `${InsOTP}`) {
      console.log("Valid OTP");
      var insMobileStatus = "approved";
      res.send({ message: "OTP verified", id, insMobileStatus });
    } else {
      res.send({ message: "Invalid OTP" });
    }
  } catch {
    console.log(
      `SomeThing Went Wrong at this EndPoint(/ins-detail-verify/:id)`
    );
  }
};

var date = new Date();
var p_date = date.getDate();
var p_month = date.getMonth() + 1;
var p_year = date.getFullYear();
if (p_month <= 10) {
  p_month = `0${p_month}`;
}
var c_date = `${p_year}-${p_month}-${p_date}`;

exports.profileByUser = async (req, res) => {
  try {
    const { id } = req.params;
    const admins = await Admin.findById({ _id: `${process.env.S_ADMIN_ID}` });
    const { userLegalName, userGender, userDateOfBirth, username } = req.body;
    const existAdmin = await Admin.findOne({ adminUserName: username });
    const existInstitute = await InstituteAdmin.findOne({ name: username });
    const existUser = await User.findOne({ username: username });
    if (existAdmin) {
      res.status(200).send({ message: "Username already exists" });
    } else if (existInstitute) {
      res.status(200).send({ message: "Username already exists" });
    } else {
      if (existUser) {
        res.send({ message: "Username already exists" });
      } else {
        const width = 200;
        const height = 200;
        const file = req.file;
        const results = await uploadFile(file, width, height);
        const user = new User({
          userLegalName: userLegalName,
          userGender: userGender,
          userDateOfBirth: userDateOfBirth,
          username: username,
          userStatus: "Approved",
          userPhoneNumber: id,
          photoId: "0",
          coverId: "2",
          createdAt: c_date,
          remindLater: rDate,
        });
        user.profilePhoto = results.key;
        admins.users.push(user);
        admins.userCount += 1
        await Promise.all([admins.save(), user.save()]);
        await unlinkFile(file.path);
        res.status(200).send({ message: "Profile Successfully Created...", user });
        const uInstitute = await InstituteAdmin.findOne({ isUniversal: 'Universal'})
        .populate({ path: 'posts' })
        if(uInstitute && uInstitute.posts && uInstitute.posts.length >=1){
        const post = await Post.find({ _id: { $in: uInstitute.posts }, postStatus: 'Anyone'})
        post.forEach(async (ele) => {
          user.userPosts.push(ele)
        })
        await user.save()
        }
      }
    }
  } catch (e) {
    console.log(`Error`, e);
  }
};

exports.getUserPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { userPassword, userRePassword } = req.body;
    const admin = await Admin.findById({_id: `${process.env.S_ADMIN_ID}`})
    const user = await User.findById({ _id: id });
    const genUserPass =  bcrypt.genSaltSync(12);
    const hashUserPass =  bcrypt.hashSync(
      req.body.userPassword,
      genUserPass
    );
    if (user) {
      if (userPassword === userRePassword) {
        user.userPassword = hashUserPass;
        await user.save();
        const token = generateAccessToken(user?.username, user?._id, user?.userPassword);
        res.json({ token: `Bearer ${token}`, user: user});
      } else {
        res.send({ message: "Invalid Password Combination" });
      }
    } else {
      res.send({ message: "Invalid User" });
    }
  } catch (e) {
    console.log(`Error`, e.message);
  }
};

exports.forgotPasswordSendOtp = async (req, res) => {
  try {
    const { username } = req.body;
    const user = await User.findOne({ username: username });
    const institute = await InstituteAdmin.findOne({ name: username });
    if (user) {
      generateOTP(user.userPhoneNumber).then((data) => {
        res.status(200).send({
          message: "code will be send to registered mobile number",
          user,
        });
      });
    } else if (institute) {
      generateOTP(institute.insPhoneNumber).then((data) => {
        res.status(200).send({
          message: "code will be send to registered mobile number",
          institute,
        });
      });
    } else {
      res.status(200).send({ message: "Invalid Username" });
    }
  } catch (e) {
    console.log(`Error`, e.message);
  }
};

exports.forgotPasswordVerifyOtp = async (req, res) => {
  try {
    const { fid } = req.params;
    const user = await User.findById({ _id: fid });
    const institute = await InstituteAdmin.findById({ _id: fid });
    if (user) {
      if (req.body.userOtpCode && req.body.userOtpCode === OTP) {
        res.status(200).send({ message: "Otp verified", user });
      } else {
        console.log("Invalid OTP By User F");
      }
    } else if (institute) {
      if (req.body.userOtpCode && req.body.userOtpCode === OTP) {
        res.status(200).send({ message: "Otp verified", institute });
      } else {
        console.log("Invalid OTP By Institute F");
      }
    } else {
    }
  } catch (e) {
    console.log(`Error`, e.message);
  }
};

exports.getNewPassword = async (req, res) => {
  try {
    const { rid } = req.params;
    const { userPassword, userRePassword } = req.body;
    const user = await User.findById({ _id: rid });
    const institute = await InstituteAdmin.findById({ _id: rid });
    const genUserPass = bcrypt.genSaltSync(12);
    const hashUserPass = bcrypt.hashSync(
      req.body.userPassword,
      genUserPass
    );
    if (user) {
      if (userPassword === userRePassword) {
        user.userPassword = hashUserPass;
        await user.save();
        res
          .status(200)
          .send({ message: "Password Changed Successfully", user });
      } else {
        res.status(200).send({ message: "Invalid Password Combination" });
      }
    } else if (institute) {
      if (userPassword === userRePassword) {
        institute.insPassword = hashUserPass;
        await institute.save();
        res
          .status(200)
          .send({ message: "Password Changed Successfully", institute });
      } else {
        res.status(200).send({ message: "Invalid Password Combination" });
      }
    } else {
    }
  } catch (e) {
    console.log(`Error`, e.message);
  }
};

module.exports.getLogin = async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if(token == null){
      res.status(401).send({ message: 'Invalid Token'})
    }
    else{
      jwt.verify(token, `${process.env.TOKEN_SECRET}`, function(err, decoded) {
        if (err) {
            res.status(401).send({ message: 'UnAuthorized User', status: false})
        }
        else {
            res.status(200).send({ message: 'Authorized User', status: true, token: token, user: decoded.userId, institute: decoded.insId, admin: decoded.adminId})
        }
    });
    }
  } catch (e) {
    console.log(`Error`, e);
  }
};



module.exports.authentication = async (req, res) => {
  var d_date = new Date();
  var d_a_date = d_date.getDate();
  var d_a_month = d_date.getMonth() + 1;
  var d_a_year = d_date.getFullYear();
  if (d_a_month <= 10) {
    d_a_month = `0${d_a_month}`;
  }
  var deactivate_date = `${d_a_year}-${d_a_month}-${d_a_date}`;
  try {
    const { insUserName, insPassword } = req.body;
    const institute = await InstituteAdmin.findOne({ name: `${insUserName}` })
    const user = await User.findOne({ username: `${insUserName}` })
    const admin = await Admin.findOne({ adminUserName: `${insUserName}` })
    
    if (institute) {
      const checkPass = bcrypt.compareSync(insPassword, institute.insPassword);
      if (checkPass) {
        const token = generateAccessInsToken(institute?.name, institute?._id, institute?.insPassword);
        res.json({ token: `Bearer ${token}`, institute: institute, login: true});
      } else {
        res.send({ message: "Invalid Credentials", login: false });
      }
    } else if (admin) {
      const checkAdminPass = bcrypt.compareSync(
        insPassword,
        admin.adminPassword
      );
      if (checkAdminPass) {
        const token = generateAccessAdminToken(admin?.username, admin?._id, admin?.userPassword);
        res.json({ token: `Bearer ${token}`, admin: admin, login: true });
      } else {
        res.send({ message: "Invalid Credentials", login: false });
      }
    } else {
      if (user) {
        const checkUserPass = bcrypt.compareSync(
          insPassword,
          user.userPassword
        );
        if (checkUserPass) {
          if (
            user.activeStatus === "Deactivated" &&
            user.activeDate <= deactivate_date
          ) {
            user.activeStatus = "Activated";
            user.activeDate = "";
            await user.save();
            const token = generateAccessToken(user?.username, user?._id, user?.userPassword);
            res.json({
              token: `Bearer ${token}`,
              user: user,
              login: true
            });
          } else if (user.activeStatus === "Activated") {
            const token = generateAccessToken(user?.username, user?._id, user?.userPassword);
            res.json({
              token: `Bearer ${token}`,
              user: user,
              login: true
            });
          } else {
            res.status(401).send({ message: 'Unauthorized', login: false})
          }
        } else {
          res.send({ message: "Invalid Credentials", login: false });
        }
      } else {
        res.send({ message: "Invalid End User", login: false });
      }
    }
  } catch (e) {
    console.log(`Error`, e.message);
  }
};

module.exports.authenticationGoogle = async (req, res) =>{
  try{
    const { email } = req.body
    const user = await User.findOne({ userEmail: email})
    if(user){
      res.status(200).send({ message: 'successfully signed In', sign_in: true, user: user})
    }
    else{
      res.status(400).send({ message: 'Failed to signed In', sign_in: false})
    }
  }
  catch(e){
    console.log(e)
  }
}

module.exports.getLogout = async (req, res) => {
  try {
    res.clearCookie("SessionID", { path: "/" });
    res.status(200).send({ message: "Successfully Logout" });
  } catch (e) {
    console.log(`Error`, e.message);
  }
};
