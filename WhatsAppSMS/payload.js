const axios = require("axios");
const { dynamic_designation } = require("./designation");
var dLink =
  "https://play.google.com/store/apps/details?id=com.mithakalminds.qviple";

// "ADSIS" --> Add Direct Student From Institute Side
// "ASCAS" --> Add Student In Confirmed From Admission Side
// "ADMIS" --> Add Direct Mentor / Staff From Institute Side

const payload_type_content = (
  mob,
  sName,
  iName,
  cName,
  type,
  value,
  paid,
  remain,
  lang
) => {
  if (type === "ADSIS") {
    var text = `Hello, ${sName} Welcome to ${iName}. You are studying in class ${cName} . Login to your account with following below steps:
1. Download app 'Qviple Community To Learn' from play store click on the link: ${dLink}
2. Open App and enter your Mobile no. (${mob})
3. Verify Mobile no. with otp
4. Select your Existing account & proceed to login`;

    var hext = `नमस्कार, ${sName} ${iName} में आपका स्वागत है। आप कक्षा ${cName} में पढ़ रहे हैं। निम्नलिखित चरणों के साथ अपने खाते में प्रवेश करें:
1. प्ले स्टोर से ऐप 'क्विपल कम्युनिटी टू लर्न' डाउनलोड करें या डाउनलोड करने के लिए लिंक पर क्लिक करें: ${dLink}
2. ऐप खोलें और अपना मोबाइल नंबर (${mob}) दर्ज करें। 
3. मोबाइल नंबर OTP के साथ सत्यापित करें।
4. अपने मौजूदा खाते का चयन करें और आपको डैशबोर्ड पर भेज दिया जाएगा |`;

    var mext = `नमस्कार, ${sName} ${iName} मध्ये आपले स्वागत आहे. तुम्ही ${cName} वर्गात शिकत आहात. खालील चरणांसह तुमच्या खात्यात लॉग इन करा:
1. प्ले स्टोअरवरून 'Qviple Community To Learn' अॅप डाउनलोड करा लिंकवर क्लिक करा: ${dLink}
2. अॅप उघडा आणि तुमचा मोबाईल क्रमांक टाका. (${mob})
3. मोबाईल क्रमांक OTP सह सत्यापित करा. 
4. तुमचे खाते निवडा आणि लॉगिन करा.`;
    var message =
      lang === "en" ? text : lang === "hi" ? hext : lang === "mt" ? mext : "";
    if (value === "College/Polytechnic") {
      var content = "SMS_Assests/Add_Student_College.png";
      var extension = ".png";
    } else if (value === "School") {
      var content = "SMS_Assests/Add_Student_School.jpeg";
      var extension = ".jpeg";
    } else {
      var content = "";
      var extension = "";
    }
  } else if (type === "ASCAS") {
    var text = `Hello ${sName},
Welcome to ${iName}.
Your admission has been confirmed with fees of Rs.${paid}${
      remain > 0 ? ` Rs.${remain} is remaining` : ""
    }.
Login to your account with following below steps:
1. Download app 'Qviple Community To Learn' from play store click on the link: ${dLink}
2. Open App and enter your Mobile no. (${mob})
3. Verify Mobile no. with otp
4. Select your Existing account & proceed to login`;

    var hext = `नमस्कार ${sName},
${iName} में आपका स्वागत है।
रु.${paid} के शुल्क के साथ आपके प्रवेश की पुष्टि हो गई है ${
      remain > 0 ? ` रु.${remain} शेष है` : ""
    }.
निम्नलिखित चरणों के साथ अपने खाते में प्रवेश करें:
1. प्ले स्टोर से ऐप 'क्विपल कम्युनिटी टू लर्न' डाउनलोड करें या डाउनलोड करने के लिए लिंक पर क्लिक करें: ${dLink}
2. ऐप खोलें और अपना मोबाइल नंबर (${mob}) दर्ज करें। 
3. मोबाइल नंबर OTP के साथ सत्यापित करें।
4. अपने मौजूदा खाते का चयन करें और आपको डैशबोर्ड पर भेज दिया जाएगा |`;

    var mext = `नमस्कार ${sName},
    ${iName} मध्ये आपले स्वागत आहे.
    तुमचा प्रवेश Rs.${paid} च्या शुल्कासह निश्चित झाला आहे ${
      remain > 0 ? ` Rs.${remain} बाकी आहे` : ""
    }.
    खालील चरणांसह तुमच्या खात्यात लॉग इन करा:
1. प्ले स्टोअरवरून 'Qviple Community To Learn' अॅप डाउनलोड करा लिंकवर क्लिक करा: ${dLink}
2. अॅप उघडा आणि तुमचा मोबाईल क्रमांक टाका. (${mob})
3. मोबाईल क्रमांक OTP सह सत्यापित करा. 
4. तुमचे खाते निवडा आणि लॉगिन करा.`;
    var message =
      lang === "en" ? text : lang === "hi" ? hext : lang === "mt" ? mext : "";
    if (value === "College/Polytechnic") {
      var content = "SMS_Assests/Add_Student_College.png";
      var extension = ".png";
    } else if (value === "School") {
      var content = "SMS_Assests/Add_Student_School.jpeg";
      var extension = ".jpeg";
    } else {
      var content = "";
      var extension = "";
    }
  } else if (type === "ADMIS") {
    var text = `Hello, ${sName} Welcome to ${iName}. Login to your account with following below steps:
1. Download app 'Qviple Community To Learn' from play store click on the link: ${dLink}
2. Open App and enter your Mobile no. (${mob})
3. Verify Mobile no. with otp
4. Select your Existing account & proceed to login`;

    var hext = `नमस्कार, ${sName} ${iName} में आपका स्वागत है। नीचे दिए गए चरणों का पालन करके अपने खाते में प्रवेश करें.
1. प्ले स्टोर से ऐप 'क्विपल कम्युनिटी टू लर्न' डाउनलोड करें या डाउनलोड करने के लिए लिंक पर क्लिक करें: ${dLink}
2. ऐप खोलें और अपना मोबाइल नंबर (${mob}) दर्ज करें। 
3. मोबाइल नंबर OTP के साथ सत्यापित करें।
4. अपने मौजूदा खाते का चयन करें और आपको डैशबोर्ड पर भेज दिया जाएगा |`;

    var mext = `नमस्कार, ${sName} ${iName} मध्ये आपले स्वागत आहे. खालील चरणांसह तुमच्या खात्यात लॉग इन करा.
1. प्ले स्टोअरवरून 'Qviple Community To Learn' अॅप डाउनलोड करा लिंकवर क्लिक करा: ${dLink}
2. अॅप उघडा आणि तुमचा मोबाईल क्रमांक टाका. (${mob})
3. मोबाईल क्रमांक OTP सह सत्यापित करा. 
4. तुमचे खाते निवडा आणि लॉगिन करा.`;
    var message =
      lang === "en" ? text : lang === "hi" ? hext : lang === "mt" ? mext : "";
    var content = "SMS_Assests/Institute_Add_Staff.jpeg";
    var extension = ".jpeg";
  }
  return { content: content, extension: extension, message: message };
};

exports.whats_app_sms_payload = (
  margs,
  sargs,
  iargs,
  cargs,
  targs,
  vargs,
  pargs,
  rargs,
  largs
) => {
  try {
      if(process.env.IS_GLOBAL == true){
        const content = payload_type_content(
          margs,
          sargs,
          iargs,
          cargs,
          targs,
          vargs,
          pargs,
          rargs,
          largs
        );
        if (
          content.content &&
          content.extension &&
          content.message
        ) {
          const url = `https://web-wapp.in/api/send.php?number=91${margs}&type=media&message=${content.message}&media_url=${process.env.CDN_LINK}${content.content}&filename=${process.env.SMS_FILE_TYPE}${content.extension}&instance_id=${process.env.SMS_INSTANCE_ID}&access_token=${process.env.SMS_INSTANCE_TOKEN}`;
          const encodeURL = encodeURI(url)
          axios
            .post(encodeURL)
            .then((res) => {
              console.log("Sended Successfully");
            })
            .catch((e) => {
              console.log("SMS API Bug", e);
            });
          return true;
        } else {
          return false;
        }
      }
      else{

      }
  } catch (e) {
    console.log(e);
  }
};

const designation_alarm = (mob, type, lang, name, title, cTitle) => {
  try {
    if(process.env.IS_GLOBAL == true){
    const value = dynamic_designation(name, title, cTitle);
    var valid = "";
    for (var val of value) {
      if (`${type}` === `${val?.type}`) {
        valid = val;
      }
    }
    var message =
      lang === "en"
        ? valid?.e_text
        : lang === "hi"
        ? valid?.h_text
        : lang === "mt"
        ? valid?.m_text
        : "";
      const url = `https://web-wapp.in/api/send.php?number=91${mob}&type=media&message=${message}&media_url=${process.env.CDN_LINK}${valid.content}&filename=${process.env.SMS_FILE_TYPE}${valid.extension}&instance_id=${process.env.SMS_INSTANCE_ID}&access_token=${process.env.SMS_INSTANCE_TOKEN}`;
      const encodeUrl = encodeURI(url)
      axios
        .post(encodeUrl)
        .then((res) => {
          console.log("Sended Successfully");
        })
        .catch((e) => {
          console.log("SMS API Bug", e.message);
        });
      return true;
    }
    else{

    }
  } catch (e) {
    console.log(e);
  }
};

// console.log(designation_alarm(8787264007, "ADMISSION", "en", "", "", ""));

// const url = `https://web-wapp.in/api/send.php?number=917007023972&type=text&message=Hello&instance_id=63D7C834B820F&access_token=91e482f7e128d555b2eca66109b2ce29`;