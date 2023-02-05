exports.dynamic_designation = (name, title, cTitle) => {
  const array = [
    {
      type: "DHEAD",
      e_text: `you got the designation of ${name} as ${title}`,
      h_text: `आपको ${name} का पदनाम ${title} मिला है`,
      m_text: `तुम्हाला ${name} चे नाव ${title} असे मिळाले आहे`,
      extension: ".png",
      content: "SMS_Assests/department-role.png",
    },
    {
      type: "CLASS",
      e_text: `you got the designation of ${name} as ${title}`,
      h_text: `आपको ${name} का पदनाम ${title} मिला है`,
      m_text: `तुम्हाला ${name} चे पद ${title} असे मिळाले आहे`,
      extension: ".png",
      content: "SMS_Assests/class-role.png",
    },
    {
      type: "SUBJECT",
      e_text: `you got the designation of ${name} of ${cTitle} as ${title}`,
      h_text: `आपको ${cTitle} के ${name} का पदनाम ${title} मिला है`,
      m_text: `तुम्हाला ${cTitle} पैकी ${name} चे पद ${title} असे मिळाले आहे.`,
      extension: ".png",
      content: "SMS_Assests/subject-role.png",
    },
    {
      type: "FINANCE",
      e_text: "you got the designation of as Finance Manager",
      h_text: "आपको वित्त व्यवस्थापक के रूप में पदनाम मिला है |",
      m_text: "तुम्हाला वित्त व्यवस्थापक म्हणून पद मिळाले आहे",
      extension: ".png",
      content: "SMS_Assests/finance-role.png",
    },
    {
      type: "ADMISSION",
      e_text: "you got the designation of Admission Admin",
      h_text: "आपको प्रवेश व्यवस्थापक का पदनाम मिला है",
      m_text: "तुम्हाला Admission Admin हे पद मिळाले आहे",
      extension: ".png",
      content: "SMS_Assests/admission-role.png",
    },
    {
      type: "SPORTSHEAD",
      e_text: "you got the designation as Sport & Arts Head",
      h_text: "आपको खेल और कला प्रमुख प्रशिक्षक के रूप में पदनाम मिला है |",
      m_text: "तुम्हाला क्रीडा आणि कला मुख्य प्रशिक्षक म्हणून पद मिळाले आहे.",
      extension: ".png",
      content: "SMS_Assests/sport-head-role.png",
    },
    {
      type: "SPORTSCLASS",
      e_text: `you got the designation of ${name} as Class Head`,
      h_text: `आपको प्रशिक्षक के रूप में ${name} का पदनाम मिला है |`,
      m_text: `तुम्हाला ${name} चे प्रशिक्षक म्हणून पद मिळाले आहे`,
      extension: ".png",
      content: "SMS_Assests/sport-class-role.png",
    },
    {
      type: "LIBRARY",
      e_text: "you got the designation of as Library Head",
      h_text: "आपको लाइब्रेरी हेड का पदनाम मिला है",
      m_text: "तुम्हाला ग्रंथालय प्रमुख म्हणून पद मिळाले आहे",
      extension: ".png",
      content: "SMS_Assests/library-role.png",
    },
    {
      type: "TRANSPORT",
      e_text: "you got the designation of Transportation Manager",
      h_text: "आपको परिवहन प्रबंधक का पद मिला है",
      m_text: "तुम्हाला परिवहन व्यवस्थापक हे पद मिळाले आहे",
      extension: ".png",
      content: "SMS_Assests/transport-role.png",
    },
  ];
  return array;
};
