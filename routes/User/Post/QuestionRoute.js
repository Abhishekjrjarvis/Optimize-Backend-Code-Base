const express = require("express");
const router = express.Router();
const Question = require("../../../controllers/User/Post/QuestionController");
const catchAsync = require("../../../Utilities/catchAsync");
const { isLoggedIn } = require("../../../middleware");

const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.post("/:id/text", isLoggedIn, upload.array("file"), catchAsync(Question.postQuestionText));

router.delete(
  "/:id/deleted/:pid",
  isLoggedIn,
  catchAsync(Question.postQuestionDelete)
);

router.get("/like/:aid", isLoggedIn, catchAsync(Question.answerLike));

router.get("/save/:pid", isLoggedIn, catchAsync(Question.postQuestionSave));

router
  .route("/answer/:id")
  .get(isLoggedIn, catchAsync(Question.getQuestionAnswer))
  .post(isLoggedIn, upload.array("file"), catchAsync(Question.postQuestionAnswer));

router
  .route("/answer/reply/:rid")
  .get(isLoggedIn, catchAsync(Question.getAnswerReply))
  .post(isLoggedIn, catchAsync(Question.postAnswerReply));


router.get("/answer/save/:aid", isLoggedIn, catchAsync(Question.questionAnswerSave));

module.exports = router;