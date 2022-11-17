require("dotenv").config();
const paytm = require("paytmchecksum");
const https = require("https");
const Student = require("../../../models/Student");
const Finance = require("../../../models/Finance");
const User = require("../../../models/User");
const Admin = require("../../../models/superAdmin");
const InstituteAdmin = require("../../../models/InstituteAdmin");
const StudentNotification = require("../../../models/Marks/StudentNotification");
const invokeMemberTabNotification = require('../../../Firebase/MemberTab')
const Department = require('../../../models/Department')
const Participate = require('../../../models/ParticipativeEvent/participate')
const { v4: uuidv4 } = require("uuid");

exports.processParticipateEventPayment = async (req, res, next) => {
  const { amount, uid, eid, sid, nid, name, value } = req.body;

  var params = {};

  /* initialize an array */
  params["MID"] = process.env.PAYTM_MID;
  params["WEBSITE"] = process.env.PAYTM_WEBSITE;
  params["CHANNEL_ID"] = process.env.PAYTM_CHANNEL_ID;
  params["INDUSTRY_TYPE_ID"] = process.env.PAYTM_INDUSTRY_TYPE;
  params["ORDER_ID"] = "oid" + uuidv4();
  params["CUST_ID"] = process.env.PAYTM_CUST_ID;
  params["TXN_AMOUNT"] = amount;
  params[
    "CALLBACK_URL"
  ] = `${process.env.CALLBACK_URLS}/v1/participate/callback/${uid}/event/${eid}/student/${sid}/status/${nid}/q${name}/value/${value}`;

  let paytmChecksum = paytm.generateSignature(
    params,
    process.env.PAYTM_MERCHANT_KEY
  );
  paytmChecksum
    .then(function (checksum) {
      let paytmParams = {
        ...params,
        CHECKSUMHASH: checksum,
      };

      res.status(200).json({
        paytmParams,
      });
    })
    .catch(function (error) {
      console.log(error);
    });
};

// Paytm Callback
exports.paytmParticipateEventResponse = (req, res, next) => {
  const { uid, eid, sid, nid, name, value } = req.params;

  let paytmChecksum = req.body.CHECKSUMHASH;
  delete req.body.CHECKSUMHASH;

  let isVerifySignature = paytm.verifySignature(
    req.body,
    process.env.PAYTM_MERCHANT_KEY,
    paytmChecksum
  );
  if (isVerifySignature) {
    var paytmParams = {};

    paytmParams.body = {
      mid: req.body.MID,
      orderId: req.body.ORDERID,
    };

    paytm
      .generateSignature(
        JSON.stringify(paytmParams.body),
        process.env.PAYTM_MERCHANT_KEY
      )
      .then(function (checksum) {
        paytmParams.head = {
          signature: checksum,
        };
        var post_data = JSON.stringify(paytmParams);

        var options = {
          /* for Staging */
          // hostname: "securegw-stage.paytm.in",
          /* for Production */
          hostname: 'securegw.paytm.in',
          port: 443,
          path: "/v3/order/status",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Content-Length": post_data.length,
          },
        };
        var response = "";
        var post_req = https.request(options, function (post_res) {
          post_res.on("data", function (chunk) {
            response += chunk;
          });

          post_res.on("end", function () {
            let { body } = JSON.parse(response);
            let status = body.resultInfo.resultStatus;
            let price = body.txnAmount;
            if (status === "TXN_SUCCESS") {
              addPayment(body, uid, sid, eid);
              studentPaymentUpdated(uid, sid, eid, nid, price, value);
              res.redirect(`${process.env.FRONT_REDIRECT_URL}/q/${name}/memberstab`);
            } else {
              res.redirect(`${process.env.FRONT_REDIRECT_URL}/q/${name}/feed`);
            }
            // res.redirect(`${req.protocol}://${req.get("host")}/order/${body.orderId}`)
          });
        });
        post_req.write(post_data);
        post_req.end();
      });
  } else {
    console.log("Checksum Mismatched");
  }
};

const addPayment = async (data, userId, studentId, event) => {
  try {
    const user_query = await User.findById({ _id: userId });
    const student_query = await Student.findById({_id: studentId})
    const event_query = await Participate.findById({_id: event})
    const admission_payment_query = new AdmissionPayment(data);
    admission_payment_query.userId = user_query._id;
    admission_payment_query.studentId = student_query._id;
    admission_payment_query.eventId = event_query._id;
    user_query.admissionPayList.push(admission_payment_query._id);
    await Promise.all([ 
      user_query.save(),
      admission_payment_query.save()
    ])
  } catch (e) {
    console.log("Admission Payment Failed!", e);
  }
};

const studentPaymentUpdated = async (userId, studentId, eventId, notifyId, tx_amount, value) => {
  try {
    const student = await Student.findById({_id: studentId})
    const user = await User.findById({_id: userId})
    const event = await Participate.findById({_id: eventId})
    const admin = await Admin.findById({_id: `${process.env.S_ADMIN_ID}`})
    const depart = await Department.findById({_id: `${event.department}`})
    const ins = await InstituteAdmin.findById({_id: `${depart.institute}`})
    const finance = await Finance.findById({_id: `${institute?.financeDepart[0]}`})
    const status = await StudentNotification.findById({_id: notifyId})
    const notify = new StudentNotification({})
    depart.onlineFee += parseInt(value)
    event.online_fee += parseInt(value)
    finance.financeParticipateEventBalance += parseInt(value)
    finance.financeTotalBalance += parseInt(value)
    admin.returnAmount += parseInt(tx_amount)
    ins.adminRepayAmount += parseInt(value)
    status.event_payment_status = 'Paid'
    event.event_fee.push({
        student: student._id,
        fee_status: 'Paid'
    })
    event.paid_participant += 1
    notify.notifyContent = `${student.studentFirstName} ${student.studentMiddleName ? `${student.studentMiddleName} ` : ""} ${student.studentLastName} your transaction is successfull for ${event.event_name} ${parseInt(value)}`;
    notify.notifySender = depart._id
    notify.notifyReceiever = user._id;
    user.activity_tab.push(notify._id);
    notify.user = user._id;
    notify.notifyByStudentPhoto = student._id;
    notify.notifyType = "Student";
    notify.notifyCategory = "Participate Event";
    notify.redirectIndex = 13;
    student.notification.push(notify._id);
    await Promise.all([
      student.save(),
      user.save(),
      event.save(),
      finance.save(),
      ins.save(),
      admin.save(),
      status.save(),
      depart.save(),
      notify.save()
    ])
    invokeMemberTabNotification(
        "Student Activity",
        notify,
        "Payment Successfull",
        user._id,
        user.deviceToken,
        "Student",
        notify
    );
  } catch(e) {
    console.log(e)
  }
};