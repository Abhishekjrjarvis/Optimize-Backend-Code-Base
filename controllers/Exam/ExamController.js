const Department = require("../../models/Department");
const ClassMaster = require("../../models/ClassMaster");
const Class = require("../../models/Class");
const SubjectMaster = require("../../models/SubjectMaster");
const Subject = require("../../models/Subject");
const Batch = require("../../models/Batch");
const Exam = require("../../models/Exam");
const Student = require("../../models/Student");
const SubjectMarks = require("../../models/Marks/SubjectMarks");
const Behaviour = require("../../models/Behaviour");
const FinalReport = require("../../models/Marks/FinalReport");
const StudentNotification = require("../../models/Marks/StudentNotification");

exports.getClassMaster = async (req, res) => {
  try {
    const classMaster = await ClassMaster.find({
      department: { $eq: req.params.did },
    })
      .select("className classDivision")
      .populate({
        path: "classDivision",
        match: { batch: { $eq: `${req.params.bid}` } },
        select: "_id",
      })
      .lean()
      .exec();
    res.status(200).send({ classMaster });
  } catch {}
};

exports.getSubjectMaster = async (req, res) => {
  try {
    const classMaster = await ClassMaster.findById(req.params.cmid)
      .populate({
        path: "classDivision",
        match: { batch: { $eq: `${req.params.bid}` } },
        populate: {
          path: "subject",
          populate: {
            path: "subjectMasterName",
            select: "subjectName _id",
          },
          select: "_id",
        },
        select: "_id",
      })
      .select("_id")
      .lean()
      .exec();
    const arr = [];
    classMaster.classDivision?.forEach((sub) => {
      sub.subject?.forEach((subject) => {
        arr.push(subject);
      });
    });

    const arr1 = [];
    for (let i = 0; i < arr?.length; i++) {
      const subjectObject = {
        subjectName: arr[i].subjectMasterName.subjectName,
        _id: arr[i].subjectMasterName._id,
        ids: [arr[i]._id],
      };
      for (let j = i + 1; j < arr?.length; j++) {
        if (arr[i].subjectMasterName._id === arr[j].subjectMasterName._id) {
          subjectObject.ids.push(arr[j]._id);
          arr.splice(j, 1);
        }
      }
      arr1.push(subjectObject);
    }
    res.status(200).send({ classMaster: arr1 });
  } catch {}
};

exports.createExam = async (req, res) => {
  try {
    const batch = await Batch.findById(req.params.bid).select(
      "department _id exams"
    );
    const department = await Department.findById(batch.department).select(
      "exams _id"
    );
    const exam = new Exam(req.body);
    batch.exams.push(exam._id);
    department.exams.push(exam._id);
    exam.department = department._id;
    exam.batch = batch._id;

    for (let cid of req.body.allclasses) {
      for (let sub of req.body.allsubject) {
        for (let subId of sub.subjectIds) {
          const subject = await Subject.findById(subId).select("class exams");
          if (String(subject.class) === cid) {
            const classes = await Class.findById(cid).select(
              "ApproveStudent exams _id"
            );
            if (classes.exams.includes(exam._id)) {
            } else {
              classes.exams.push(exam._id);
              exam.class.push(cid);
              await classes.save();
            }
            for (let stu of classes.ApproveStudent) {
              const student = await Student.findById(stu);
              if (student.exams.includes(exam._id)) {
              } else {
                student.exams.push(exam._id);
              }
              const subjectMarks1 = await SubjectMarks.findOne({
                subject: subject._id,
                student: student._id,
              });
              if (subjectMarks1) {
                if (exam.examType === "Final") {
                  const otherWeightage = 0;
                  for (let weihtage of subjectMarks1?.marks) {
                    if (weihtage.examType === "Other") {
                      otherWeightage += weihtage.examWeight;
                    }
                  }
                  subjectMarks1.marks.push({
                    examId: exam._id,
                    examName: exam.examName,
                    examType: exam.examType,
                    examWeight: otherWeightage,
                    totalMarks: sub.totalMarks,
                    date: sub.date,
                    startTime: sub.startTime,
                    endTime: sub.endTime,
                  });
                } else {
                  subjectMarks1.marks.push({
                    examId: exam._id,
                    examName: exam.examName,
                    examType: exam.examType,
                    examWeight: exam.examWeight,
                    totalMarks: sub.totalMarks,
                    date: sub.date,
                    startTime: sub.startTime,
                    endTime: sub.endTime,
                  });
                }
                await subjectMarks1.save();
              } else {
                let weight = 0;
                if (exam.examType === "Final") {
                  weight = 100;
                }
                const subjectMarks = new SubjectMarks({
                  subject: subject._id,
                  subjectName: sub.subjectName,
                  student: student._id,
                });
                subjectMarks.marks.push({
                  examId: exam._id,
                  examName: exam.examName,
                  examType: exam.examType,
                  examWeight: weight < 1 ? exam.examWeight : weight,
                  totalMarks: sub.totalMarks,
                  date: sub.date,
                  startTime: sub.startTime,
                  endTime: sub.endTime,
                });
                student.subjectMarks.push(subjectMarks._id);
                await subjectMarks.save();
              }
              const notify = new StudentNotification({});
              notify.notifyContent = `New ${exam.examName} Exam is created for ${sub.subjectName} , check your members tab`;
              notify.notifySender = department._id;
              notify.notifyReceiever = student._id;
              student.notification.push(notify._id);
              notify.notifyByDepartPhoto = department._id;
              await Promise.all([student.save(), notify.save()]);
            }
            subject.exams.push(exam._id);
            await subject.save();
            exam.subjects.push({
              subjectId: subject._id,
              subjectName: sub.subjectName,
              totalMarks: sub.totalMarks,
              date: sub.date,
              startTime: sub.startTime,
              endTime: sub.endTime,
              subjectMasterId: sub._id,
            });
          }
        }
      }
    }
    await Promise.all([exam.save(), batch.save(), department.save()]);
    res.status(201).send({ message: "Exam is created" });
  } catch (e) {
    console.log(e);
  }
};

exports.allExam = async (req, res) => {
  const exam = await Exam.find({
    department: { $eq: `${req.params.did}` },
  }).select("examName examWeight createdAt examType");
  res.status(200).send({ exam });
};

exports.examById = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.eid).select("class subjects");
    const masterids = [];
    for (let cid of exam.class) {
      const classes = await Class.findById(cid).select("masterClassName _id");
      masterids.push(classes.masterClassName);
    }
    for (let i = 0; i < masterids.length; i++) {
      for (let j = i + 1; j < masterids.length; j++) {
        if (String(masterids[i]) === String(masterids[j])) {
          masterids.splice(j, 1);
        }
      }
    }
    const subjectids = [];

    for (let sub of exam.subjects) {
      subjectids.push(sub.subjectMasterId);
    }

    for (let i = 0; i < subjectids.length; i++) {
      for (let j = i + 1; j < subjectids.length; j++) {
        if (String(subjectids[i]) === String(subjectids[j])) {
          subjectids.splice(j, 1);
        }
      }
    }

    const classMaster = await ClassMaster.find({
      _id: { $in: masterids },
    }).select("className _id");

    const subjectMaster = await SubjectMaster.find({
      _id: { $in: subjectids },
    }).select("subjectName _id");
    res.status(200).send({ classMaster, subjectMaster });
  } catch (e) {
    console.log(e);
  }
};

exports.allExamSubjectTeacher = async (req, res) => {
  try {
    const subjectTeacher = await Subject.findById(req.params.sid)
      .select("exams _id")
      .populate({
        path: "exams",
        // match: {
        //   subjects: {
        //     subjectId: { $eq: mongoose.mongo.ObjectId(req.params.sid) },
        //   },
        // },
        select: "examName examType examWeight subjects",
      });
    const subject = [];

    subjectTeacher?.exams.forEach((exam) => {
      exam.subjects.forEach((sub) => {
        if (String(sub.subjectId) === req.params.sid) {
          subject.push({
            _id: exam._id,
            examName: exam.examName,
            examType: exam.examType,
            examWeight: exam.examWeight,
            totalMarks: sub.totalMarks,
          });
        }
      });
    });

    res.status(200).send({ subject });
  } catch (e) {
    console.log(e);
  }
};

exports.allStudentInSubjectTeacher = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.sid)
      .populate({
        path: "class",
        populate: {
          path: "ApproveStudent",
          select: "_id",
        },
        select: "_id",
      })
      .select("_id")
      .lean()
      .exec();
    const students = [];
    for (let studentId of subject?.class?.ApproveStudent) {
      const student = await Student.findById(studentId)
        .populate({
          path: "subjectMarks",
          match: { subject: { $eq: req.params.sid } },
        })
        .select(
          "studentFirstName studentMiddleName studentLastName studentROLLNO studentProfilePhoto subjectMarks"
        )
        .lean()
        .exec();

      student?.subjectMarks[0]?.marks.forEach((onemarks) => {
        if (onemarks.examId === req.params.eid) {
          students.push({
            _id: student._id,
            studentFirstName: student.studentFirstName,
            studentMiddleName: student?.studentMiddleName,
            studentLastName: student?.studentLastName,
            studentProfilePhoto: student.studentProfilePhoto,
            studentROLLNO: student.studentROLLNO,
            obtainMarks: onemarks.obtainMarks,
          });
        }
      });
    }
    res.status(200).send({ students });
  } catch (e) {
    console.log(e);
  }
};

exports.allStudentMarksBySubjectTeacher = async (req, res) => {
  try {
    const { examId, marks } = req.body;
    for (let studt of marks) {
      const student = await Student.findById(studt.studentId)
        .populate({
          path: "subjectMarks",
          match: {
            subject: { $eq: req.params.sid },
          },
        })
        .select("subjectMarks _id");

      const subjectMarks1 = await SubjectMarks.findById(
        student?.subjectMarks[0]?._id
      );
      for (let marks of subjectMarks1.marks) {
        if (marks.examId === examId) {
          marks.obtainMarks = studt.obtainMarks;
          await subjectMarks1.save();
        }
      }
    }

    res.status(200).send({ message: "updated" });
  } catch (e) {
    console.log(e);
  }
};

exports.allExamInStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.sid)
      .populate({
        path: "studentClass",
        populate: {
          path: "exams",
          // populate: {
          //   path: "subjects",
          //   // select: "subjectId",
          //   // match: { subjectId: { $in: student1.studentClass.subject } },
          // },
          select: "examName examType examWeight subjects",
        },
        select: "exams subject",
      })
      .select("studentClass");
    const exams = [];
    student?.studentClass?.exams.forEach((exam) => {
      const examObj = {
        _id: exam._id,
        examName: exam.examName,
        examType: exam.examType,
        examWeight: exam.examWeight,
        subject: 0,
      };
      exam.subjects?.forEach((sub) => {
        if (student?.studentClass?.subject.includes(String(sub.subjectId))) {
          examObj.subject = examObj.subject + 1;
        }
      });
      exams.push(examObj);
    });
    res.status(200).send({ exams });
  } catch (e) {
    console.log(e);
  }
};

exports.oneExamAllSubjectInStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.sid)
      .populate({
        path: "subjectMarks",
      })
      .select("_id");

    const subjects = [];
    student?.subjectMarks.forEach((submarks) => {
      submarks.marks.forEach((exammarks) => {
        if (exammarks.examId === req.params.eid) {
          subjects.push({
            _id: submarks.subject,
            subjectName: submarks.subjectName,
            obtainMarks: exammarks.obtainMarks,
            totalMarks: exammarks.totalMarks,
            date: exammarks.date,
            startTime: exammarks.startTime,
            endTime: exammarks.endTime,
          });
        }
      });
    });
    res.status(200).send({ subjects });
  } catch (e) {
    console.log(e);
  }
};

exports.oneClassSettings = async (req, res) => {
  try {
    const classes = await Class.findById(req.params.cid).select(
      "finalReportsSettings"
    );
    res.status(200).send({ classes });
  } catch (e) {
    console.log(e);
  }
};
exports.oneStudentBehaviourClassTeacher = async (req, res) => {
  try {
    const student = await Student.findById(req.params.sid)
      .populate({
        path: "studentClass",
        select: "_id",
      })
      .select("_id studentBehaviour studentClass");

    const classes = await Class.findById(student.studentClass._id).select(
      "studentBehaviour _id"
    );
    const behaviour = new Behaviour({ ...req.body });
    behaviour.studentName = student._id;
    classes.studentBehaviour.push(behaviour._id);
    student.studentBehaviour = behaviour._id;
    behaviour.className = classes._id;
    await Promise.all([classes.save(), student.save(), behaviour.save()]);
    res.status(201).send({
      message: "behaviour is done",
    });
  } catch (e) {
    console.log(e);
  }
};

exports.oneStudentGraceMarksClassTeacher = async (req, res) => {
  try {
    const student = await Student.findById(req.params.sid)
      .populate({
        path: "subjectMarks",
        select: "_id subject",
      })
      .select("_id");

    for (let subject of req.body.allsubjects) {
      for (let subjectmarks of student.subjectMarks) {
        if (String(subjectmarks.subject) === subject._id) {
          const subjectMarks = await SubjectMarks.findById(subjectmarks._id);
          subjectMarks.graceMarks = subject.graceMarks;
          await subjectMarks.save();
        }
      }
    }
    res.status(200).send({ message: "updated grace marks" });
  } catch (e) {
    console.log(e);
  }
};

exports.oneStudentReportCardClassTeacher = async (req, res) => {
  try {
    const student = await Student.findById(req.params.sid)
      .populate({
        path: "subjectMarks",
      })
      .select("_id ");

    const subjects = [];
    const total = {
      finalTotal: 0,
      otherTotal: 0,
      graceTotal: 0,
      allSubjectTotal: 0,
    };
    student?.subjectMarks.forEach((submarks) => {
      const obj = {
        _id: submarks.subject,
        subjectName: submarks.subjectName,
        finalTotalMarks: 0,
        finalObtainMarks: 0,
        otherTotalMarks: 0,
        otherObtainMarks: 0,
        subjectWiseTotal: submarks.graceMarks,
        graceMarks: submarks.graceMarks,
      };
      submarks?.marks.forEach((eachmarks) => {
        if (eachmarks.examType === "Other") {
          obj.otherTotalMarks = obj.otherTotalMarks + eachmarks.totalMarks;
          obj.otherObtainMarks = obj.otherObtainMarks + eachmarks.obtainMarks;

          obj.subjectWiseTotal =
            obj.subjectWiseTotal +
            (eachmarks.obtainMarks * eachmarks.examWeight) / 100;
        } else {
          obj.finalTotalMarks = eachmarks.totalMarks;
          obj.finalObtainMarks = eachmarks.obtainMarks;
          obj.subjectWiseTotal =
            obj.subjectWiseTotal +
            (eachmarks.obtainMarks * eachmarks.examWeight) / 100;
        }
      });
      total.finalTotal = total.finalTotal + obj.finalObtainMarks;
      total.otherTotal = total.otherTotal + obj.otherObtainMarks;
      total.graceTotal = total.graceTotal + submarks.graceMarks;
      total.allSubjectTotal = total.allSubjectTotal + obj.subjectWiseTotal;
      subjects.push(obj);
    });
    const totalPercantage =
      (total.allSubjectTotal * 100) / (100 * subjects.length);

    res.status(200).send({ subjects, total, totalPercantage });
  } catch (e) {
    console.log(e);
  }
};

exports.oneStudentAllYearAttendance = async (req, res) => {
  try {
    const student1 = await Student.findById(req.params.sid).populate({
      path: "studentClass",
      select: "classStartDate",
    });
    const student = await Student.findById(req.params.sid)
      .populate({
        path: "attendDate",
        match: {
          attendDate: {
            $gte: `${student1.studentClass.classStartDate}`,
            $lte: `${req.query.date}`,
          },
        },
        select: "_id presentStudent attendDate",
      })
      .select("_id attendDate");
    const attendance = {
      totalPresent: 0,
      totalAttendance: student?.attendDate?.length,
      attendancePercentage: 0,
    };
    student?.attendDate?.forEach((attend) => {
      if (attend.presentStudent.includes(req.params.sid)) {
        attendance.totalPresent += 1;
      }
    });
    attendance.attendancePercentage = Math.round(
      (attendance.totalPresent * 100) / attendance.totalAttendance
    );
    res.status(200).send({ attendance });
  } catch (e) {
    console.log(e);
  }
};

exports.oneStudentBehaviourReportCard = async (req, res) => {
  try {
    const student = await Student.findById(req.params.sid)
      .populate({
        path: "studentBehaviour",
        select: "improvements ratings lackIn",
      })
      .select("_id studentBehaviour");
    res.status(200).send({ student: student.studentBehaviour });
  } catch (e) {
    console.log(e);
  }
};

exports.oneStudentReportCardFinalize = async (req, res) => {
  try {
    const student = await Student.findById(req.params.sid).select(
      "_id finalReport finalReportStatus studentClass"
    );
    if (student.finalReportStatus === "Yes") {
      throw "Report card is already finalize";
    }
    const finalize = new FinalReport({
      student: student._id,
      classId: student.studentClass,
      totalFinalExam: req.body.totalFinalExam,
      totalOtherExam: req.body.totalOtherExam,
      totalGraceExam: req.body.totalGraceExam,
      totalTotalExam: req.body.totalTotalExam,
      totalPercentage: req.body.totalPercentage,
      attendance: req.body.attendance,
      attendanceTotal: req.body.attendanceTotal,
      attendancePercentage: req.body.attendancePercentage,
      behaviourStar: req.body.behaviourStar,
      behaviourImprovement: req.body.behaviourImprovement,
      behaviourLack: req.body.behaviourLack,
    });
    student.finalReport.push(finalize._id);
    student.finalReportStatus = "Yes";
    req.body?.subjects?.forEach((subject) => {
      if (!subject.finalExamObtain || !subject.finalExamTotal) {
        throw "Final Exam Marks is not updated";
      }
      finalize.subjects.push({
        subject: subject._id,
        subjectName: subject.subjectName,
        finalExamTotal: subject.finalExamTotal,
        finalExamObtain: subject.finalExamObtain,
        otherExamTotal: subject.otherExamTotal,
        otherExamObtain: subject.otherExamObtain,
        graceMarks: subject.graceMarks,
        totalMarks: subject.totalMarks,
        obtainTotalMarks: subject.obtainTotalMarks,
      });
    });
    await Promise.all([finalize.save(), student.save()]);
    res.status(201).send({ message: "Finalize successfully" });
  } catch (e) {
    res.status(424).send({ message: e });
  }
};

exports.oneStudentReportCardFinalizeGraceUpdate = async (req, res) => {
  try {
    const student = await Student.findById(req.params.sid)
      .populate({
        path: "subjectMarks",
        select: "subject _id",
      })
      .select("_id subjectMarks finalReport finalReportStatus");
    if (student.finalReportStatus !== "Yes") {
      throw "Grace marks is not updated because final report is not done";
    }
    const finalize = await FinalReport.findById(student.finalReport[0]);
    for (bodysubject of req.body?.subjects) {
      for (submark of student?.subjectMarks) {
        if (String(submark.subject) === bodysubject._id) {
          const subjectMarks = await SubjectMarks.findById(submark._id).select(
            "graceMarks"
          );
          const prevGrace = subjectMarks.graceMarks;
          subjectMarks.graceMarks = bodysubject.graceMarks;
          for (finalSubject of finalize.subjects) {
            if (bodysubject._id === String(finalSubject.subject)) {
              finalSubject.graceMarks = bodysubject.graceMarks;
              if (prevGrace >= bodysubject.graceMarks) {
                finalSubject.obtainTotalMarks -=
                  prevGrace - bodysubject.graceMarks;
                finalize.totalGraceExam -= prevGrace - bodysubject.graceMarks;
                finalize.totalTotalExam -= prevGrace - bodysubject.graceMarks;
              } else {
                finalSubject.obtainTotalMarks +=
                  bodysubject.graceMarks - prevGrace;
                finalize.totalGraceExam += bodysubject.graceMarks - prevGrace;
                finalize.totalTotalExam += bodysubject.graceMarks - prevGrace;
              }
            }
          }
          await subjectMarks.save();
        }
      }
    }
    finalize.totalPercentage = Math.round(
      (finalize.totalTotalExam * 100) / (100 * finalize.subjects?.length)
    );
    await Promise.all([finalize.save()]);
    res.status(200).send({ finalize });
  } catch (e) {
    res.status(424).send({ message: e });
  }
};