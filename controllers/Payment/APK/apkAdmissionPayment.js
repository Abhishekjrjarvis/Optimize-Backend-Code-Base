require("dotenv").config();
const PaytmChecksum = require("paytmchecksum");
const https = require("https");
const Student = require("../../../models/Student");
const Finance = require("../../../models/Finance");
const User = require("../../../models/User");
const Admin = require("../../../models/superAdmin");
const InstituteAdmin = require("../../../models/InstituteAdmin");
const Notification = require("../../../models/notification");
const Status = require('../../../models/Admission/status')
const NewApplication = require('../../../models/Admission/NewApplication')
const Admission = require('../../../models/Admission/Admission')
const { v4: uuidv4 } = require("uuid");




exports.generateAdmissionTxnToken = async(req, res) => {
    const { amount, uid, aid, sid, statusId, value } = req.body;
var paytmParams = {};

paytmParams.body = {
 "requestType"  : "Payment",
 "mid"   : process.env.PAYTM_MID,
 "websiteName"  : process.env.PAYTM_MERCHANT_KEY,
 "orderId"   : "oid" + uuidv4(),
 "callbackUrl"  : `https://qviple.com/api/v1/verify/admission/${uid}/apply/${aid}/student/${sid}/status/${statusId}/value/${value}`,
 "txnAmount"  : {
 "value"  : amount,
 "currency" : "INR",
 },
 "userInfo"  : {
 "custId"  : process.env.PAYTM_CUST_ID,
 },
};


PaytmChecksum.generateSignature(JSON.stringify(paytmParams.body), process.env.PAYTM_MERCHANT_KEY).then(function(checksum){

 paytmParams.head = {
  "signature" : checksum
 };

 var post_data = JSON.stringify(paytmParams);

 var options = {

 /* for Staging */
//  hostname: 'securegw-stage.paytm.in',

 /* for Production */
 hostname: 'securegw.paytm.in',

 port: 443,
 path: `/theia/api/v1/initiateTransaction?mid=${process.env.PAYTM_MID}&orderId=${paytmParams.body.orderId}`,
 method: 'POST',
 headers: {
 'Content-Type': 'application/json',
 'Content-Length': post_data.length
 }
 };

 var response = ""; 
 var post_req = https.request(options, function(post_res) {
 post_res.on('data', function (chunk) {
  response += chunk;
 });
        
 post_res.on('end', function(){
        res.send({signature: JSON.parse(response), oid: paytmParams.body.orderId, mid: paytmParams.body.mid})
 });
 });

 post_req.write(post_data);
 post_req.end();
});
}


exports.paytmVerifyAdmissionResponseStatus = async(req, res) =>{
    const { uid, aid, sid, statusId, value } = req.params;
var paytmParams = {};
paytmParams.body = {
    "mid" : `${req.body.mid}`,
    "orderId" : `${req.body.orderId}`,
};

PaytmChecksum.generateSignature(JSON.stringify(paytmParams.body), process.env.PAYTM_MERCHANT_KEY).then(function(checksum){
    paytmParams.head = {
        "signature"	: checksum
    };

    var post_data = JSON.stringify(paytmParams);

    var options = {

        /* for Staging */
        // hostname: 'securegw-stage.paytm.in',

        /* for Production */
        hostname: 'securegw.paytm.in',

        port: 443,
        path: '/v3/order/status',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': post_data.length
        }
    };

    var response = "";
    var post_req = https.request(options, function(post_res) {
        post_res.on('data', function (chunk) {
            response += chunk;
        });

        post_res.on('end', async function(){
            let { body } = JSON.parse(response);
            let status = body.resultInfo.resultStatus;
            let price = body.txnAmount;
            // TXN_SUCCESS
            // PENDING
            if (status === "TXN_SUCCESS") {
                await addPayment(body, uid, sid, aid);
                await studentPaymentUpdated(uid, sid, aid, statusId, price, value);
                res.status(200).send({ message: 'Payment Successfull 🎉✨🎉✨'})
              } else {
                res.status(402).send({ message: 'Payment Required'})
              }
        });
    });

    post_req.write(post_data);
    post_req.end();
});

}

const addPayment = async (data, userId, studentId, apply) => {
    try {
      const user_query = await User.findById({ _id: userId });
      const student_query = await Student.findById({_id: studentId})
      const apply_query = await NewApplication.findById({_id: apply})
      const admission_payment_query = new AdmissionPayment(data);
      admission_payment_query.userId = user_query._id;
      admission_payment_query.studentId = student_query._id;
      admission_payment_query.applicationId = apply_query._id;
      user_query.admissionPayList.push(admission_payment_query._id);
      admission_payment_query.payName = apply_query.applicationName
      await Promise.all([ 
        user_query.save(),
        admission_payment_query.save()
      ])
    } catch (e) {
      console.log("Admission Payment Failed!", e);
    }
  };
  
  const studentPaymentUpdated = async (userId, studentId, applyId, statusId, tx_amount, value) => {
    try {
      const student = await Student.findById({_id: studentId})
      const user = await User.findById({_id: userId})
      const apply = await NewApplication.findById({_id: applyId})
      const admin = await Admin.findById({_id: `${process.env.S_ADMIN_ID}`})
      const admission = await Admission.findById({_id: `${apply.admissionAdmin}`})
      const ins = await InstituteAdmin.findById({_id: `${admission.institute}`})
      const finance = await Finance.findById({_id: `${institute?.financeDepart[0]}`})
      const status = await Status.findById({_id: statusId})
      const aStatus = new Status({})
      const notify = new Notification({})
      student.admissionPaymentStatus.push({
        applicationId: apply._id,
        status: 'online',
        installment: 'No Installment',
        fee: parseInt(value)
      })
      if(student.admissionRemainFeeCount >= value){
        student.admissionRemainFeeCount -= value
      }
      admission.onlineFee += parseInt(value)
      apply.onlineFee += parseInt(value)
      apply.collectedFeeCount += parseInt(value)
      finance.financeAdmissionBalance += parseInt(value)
      finance.financeTotalBalance += parseInt(value)
      admin.returnAmount += parseInt(tx_amount)
      ins.adminRepayAmount += parseInt(value)
      apply.selectedApplication.splice({
        student: student._id,
        fee_remain: apply.admissionFee,
      })
      apply.confirmedApplication.push({
        student: student._id,
        fee_remain: apply.admissionFee >= parseInt(value) ? apply.admissionFee - parseInt(value) : 0,
        payment_status: 'online',
        paid_status: ((apply.admissionFee - parseInt(value)) == 0) ? 'Paid' : 'Not Paid'
      })
      apply.confirmCount += 1
      aStatus.content = `Welcome to Institute ${ins.insName}, ${ins.insDistrict}.
      Your seat has been confirmed, You will be alloted your class shortly, Stay Update!`
      aStatus.applicationId = apply._id
      user.applicationStatus.push(aStatus._id)
      status.payMode = 'online',
      status.isPaid = 'Paid'
      notify.notifyContent = `${student.studentFirstName} 
      ${student.studentMiddleName ? `${student.studentMiddleName} ` : ""} 
      ${student.studentLastName} your transaction is successfull for Admission Fee ${parseInt(value)}`;
      notify.notify_hi_content = `${student.studentFirstName} 
      ${student.studentMiddleName ? `${student.studentMiddleName} ` : ""} 
      ${student.studentLastName} प्रवेश शुल्क ${parseInt(value)} के लिए आपका लेन-देन सफल है |`
      notify.notify_mr_content = `प्रवेश शुल्कासाठी ${student.studentFirstName} 
      ${student.studentMiddleName ? `${student.studentMiddleName} ` : ""} 
      ${student.studentLastName} तुमचा व्यवहार यशस्वी झाला आहे ${parseInt(value)}`
      notify.notifySender = admission._id
      notify.notifyReceiever = user._id;
      ins.iNotify.push(notify._id);
      notify.institute = ins._id;
      user.uNotify.push(notify._id);
      notify.user = user._id;
      notify.notifyByStudentPhoto = student._id;
      await Promise.all([
        student.save(),
        user.save(),
        apply.save(),
        finance.save(),
        ins.save(),
        admin.save(),
        status.save(),
        aStatus.save(),
        admission.save(),
        notify.save()
      ])
    } catch(e) {
      console.log(e)
    }
  };