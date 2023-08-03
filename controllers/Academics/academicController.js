const Subject = require("../../models/Subject");
const Chapter = require("../../models/Academics/Chapter");
const ChapterTopic = require("../../models/Academics/ChapterTopic");

exports.renderOneSubjectAllChapterQuery = async (req, res) => {
  try {
    const { sid } = req.params;
    const { search } = req.query;
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const skip = (page - 1) * limit;
    if (!sid)
      return res.status(200).send({
        message: "Their is a bug need to fixed immediately",
        access: false,
      });
    var valid_subject = await Subject.findById({ _id: sid }).select("chapter");
    if (search) {
      var all_chapter = await Chapter.find({
        $and: [
          {
            _id: { $in: valid_subject?.chapter },
          },
        ],
        $or: [
          {
            chapter_name: { $regex: search, $options: "i" },
          },
        ],
      });
    } else {
      var all_chapter = await Chapter.find({
        _id: { $in: valid_subject?.chapter },
      })
        .limit(limit)
        .skip(skip);
    }
    if (all_chapter?.length > 0) {
      res.status(200).send({
        message: "Explore One Subject All Chapter",
        access: true,
        all_chapter: all_chapter,
      });
    } else {
      res.status(200).send({
        message: "You're lost in space",
        access: false,
        all_chapter: [],
      });
    }
  } catch (e) {
    console.log(e);
  }
};

exports.renderOneSubjectAllTopicQuery = async (req, res) => {
  try {
    const { cid } = req.params;
    const { search } = req.query;
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const skip = (page - 1) * limit;
    if (!cid)
      return res.status(200).send({
        message: "Their is a bug need to fixed immediately",
        access: false,
      });
    var valid_chapter = await Chapter.findById({ _id: cid }).select("topic");
    if (search) {
      var all_topic = await ChapterTopic.find({
        $and: [
          {
            _id: { $in: valid_chapter?.topic },
          },
        ],
        $or: [
          {
            topic_name: { $regex: search, $options: "i" },
          },
        ],
      });
    } else {
      var all_topic = await ChapterTopic.find({
        _id: { $in: valid_chapter?.topic },
      })
        .limit(limit)
        .skip(skip);
    }
    if (all_topic?.length > 0) {
      res.status(200).send({
        message: "Explore One Subject All Topics",
        access: true,
        all_topic: all_topic,
      });
    } else {
      res.status(200).send({
        message: "You're lost in space",
        access: false,
        all_topic: [],
      });
    }
  } catch (e) {
    console.log(e);
  }
};

exports.renderEditOneChapterTopicQuery = async (req, res) => {
  try {
    const { ctid } = req.params;
    if (!ctid)
      return res.status(200).send({
        message: "Their is a bug need to fixed immediately",
        access: false,
      });
    await ChapterTopic.findByIdAndUpdate(ctid, req.body);
    res
      .status(200)
      .send({ message: "Explore Edited Topic Query", access: true });
    const valid_topic = await ChapterTopic.findById({ _id: ctid });
    valid_topic.topic_edited_status = "(Edited)";
    await valid_topic.save();
  } catch (e) {
    console.log(e);
  }
};

exports.renderNewOneChapterTopicQuery = async (sid, chapter_array) => {
  try {
    if (sid) {
      var valid_subject = await Subject.findById({ _id: sid });
      for (var val of chapter_array) {
        var new_chapter = new Chapter({
          chapter_name: val?.chapter_name,
        });
        for (var ref of val?.topic_array) {
          var new_topic = new ChapterTopic({
            topic_name: ref?.topic_name,
            topic_last_date: ref?.topic_last_date,
          });
          new_chapter.topic.push(new_topic?._id);
          new_chapter.topic_count += 1;
          new_topic.subject = valid_subject?._id;
          new_topic.chapter = new_chapter?._id;
          await new_topic.save();
        }
        valid_subject.chapter.push(new_chapter?._id);
        valid_subject.chapter_count += 1;
        await new_chapter.save();
      }
      await valid_subject.save();
    }
  } catch (e) {
    console.log(e);
  }
};

exports.renderAddNewLectureQuery = async (req, res) => {
  try {
    const { sid, subId } = req.params;
    const { arr, rec_status } = req.body;
    if (!sid)
      return res.status(200).send({
        message: "Their is a bug need to fixed immediatley",
        access: false,
      });

    var one_subject = await Subject.findById({ _id: subId });
    var valid_subject = await SubjectUpdate.findById({ _id: sid });
    var all_topic = await ChapterTopic.find({ _id: { $in: arr } });
    for (var val of all_topic) {
      valid_subject.daily_topic.push({
        topic: val?._id,
        status: rec_status,
      });
      if (`${rec_status}` === "Lecture") {
        one_subject.lecture_analytic.lecture_complete += 1;
      } else if (`${rec_status}` === "Practical") {
        one_subject.practical_analytic.practical_complete += 1;
      } else if (`${rec_status}` === "Tutorial") {
        one_subject.tutorial_analytic.tutorial_complete += 1;
      } else {
      }
    }

    await valid_subject.save();
    res
      .status(200)
      .send({ message: "Explore New / Add Lecture Query", access: true });
  } catch (e) {
    console.log(e);
  }
};

exports.renderTopicStatusQuery = async (req, res) => {
  // try{
  //   const {}
  // }
  // catch(e){
  //   console.log(e)
  // }
};
