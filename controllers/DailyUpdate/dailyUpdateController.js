const Subject = require("../../../models/Subject");
const SubjectUpdate = require("../../../models/SubjectUpdate");
const { uploadPostImageFile, deleteFile } = require("../../S3Configuration");

exports.getAlldailyUpdate = async (req, res) => {
  try {
    if (!req.params.sid) throw "Please send subject id to perform task";
    const getPage = req.query.page ? parseInt(req.query.page) : 1;
    const itemPerPage = req.query.limit ? parseInt(req.query.limit) : 10;
    const dropItem = (getPage - 1) * itemPerPage;
    const subject = await Subject.findById(req.params.sid)
      .populate({
        path: "dailyUpdate",
        select: "updateDate updateDescription upadateImage createdAt",
        skip: dropItem,
        limit: itemPerPage,
      })
      .select("dailyUpdate")
      .lean()
      .exec();
    res.status(200).send({
      message: "all daily subject update list",
      dailyUpdate: subject?.dailyUpdate,
    });
  } catch (e) {
    res.status(200).send({
      message: e,
    });
  }
};

exports.createDailyUpdate = async (req, res) => {
  try {
    if (!req.params.sid) throw "Please send subject id to perform task";
    const subject = await Subject.findById(req.params.sid);
    const dailyUpdate = new SubjectUpdate({
      subject: req.params.sid,
      updateDate: req.body?.updateDate,
      updateDescription: req.body?.updateDescription,
    });
    if (req?.files) {
      for (let file of req?.files) {
        const results = await uploadPostImageFile(file);
        dailyUpdate?.upadateImage?.push(results.Key);
      }
    }
    subject.dailyUpdate?.push(dailyUpdate._id);
    await Promise.all([dailyUpdate.save(), subject.save()]);
    res.status(201).send({
      message: "Daily updates created successfully 👍",
      dailyUpdate,
    });
  } catch (e) {
    res.status(200).send({
      message: e,
    });
  }
};

exports.editDailyUpdate = async (req, res) => {
  try {
    if (!req.params.uid) throw "Please send daily update id to perform task";
    const dailyUpdate = await SubjectUpdate.findById(req.params.uid);
    if (req.body?.updateDescription) {
      dailyUpdate.updateDescription = req.body?.updateDescription;
    }
    if (req.body?.deleteImage?.length) {
      for (let dimage of req.body?.deleteImage) {
        await deleteFile(dimage);
        dailyUpdate?.upadateImage?.pull(dimage);
      }
    }
    if (req?.files) {
      for (let file of req.files) {
        const results = await uploadPostImageFile(file);
        answer.answerImage.push(results.Key);
        await unlinkFile(file.path);
      }
    }

    await dailyUpdate.save();
    res.status(201).send({
      message: "Daily updates edited successfully 👍",
    });
  } catch (e) {
    res.status(200).send({
      message: e,
    });
  }
};