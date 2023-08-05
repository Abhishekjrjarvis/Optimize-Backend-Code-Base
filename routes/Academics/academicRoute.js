const express = require("express");
const router = express.Router();
const Academic = require("../../controllers/Academics/academicController");
const catchAsync = require("../../Utilities/catchAsync");

router.get(
  "/:sid/all/chapter",
  catchAsync(Academic.renderOneSubjectAllChapterQuery)
);

router.get(
  "/:cid/all/topic",
  catchAsync(Academic.renderOneSubjectAllTopicQuery)
);

router.patch(
  "/edit/one/:ctid/topic/query",
  catchAsync(Academic.renderEditOneChapterTopicQuery)
);

router.post(
  "/edit/:sid/new/lecture/:subId/query",
  catchAsync(Academic.renderAddNewLectureQuery)
);

router.post(
  "/edit/:sid/new/lecture/:subId/query",
  catchAsync(Academic.renderAddNewLectureQuery)
);

router.patch("/:tid/status/query", catchAsync(Academic.renderTopicStatusQuery));

router.get(
  "/:tid/one/topic/query",
  catchAsync(Academic.renderOneTopicProfileQuery)
);

module.exports = router;
