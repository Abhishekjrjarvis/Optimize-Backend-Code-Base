const express = require("express");
const router = express.Router();
const Landing = require("../../controllers/LandingPage/index");
const catchAsync = require("../../Utilities/catchAsync");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

// Get Touch
router.post("/get-touch", catchAsync(Landing.uploadGetTouchDetail));

// Career
router.post(
  "/career-detail",
  upload.single("file"),
  catchAsync(Landing.uploadUserCareerDetail)
);

router.post(
  "/ins/:id/activate",
  catchAsync(Landing.renderActivateLandingCareerQuery)
);

router.get(
  "/one/career/:lcid",
  catchAsync(Landing.renderOneLandingCareerQuery)
);

router.post(
  "/one/career/:lcid/new/vacancy",
  catchAsync(Landing.renderCareerNewVacancyQuery)
);

router.get(
  "/one/career/:lcid/all/vacancy",
  catchAsync(Landing.renderAllLandingCareerVacancyQuery)
);

router.patch(
  "/one/vacancy/:vid/status",
  catchAsync(Landing.renderOneVacancyStatusQuery)
);

router.patch(
  "/one/vacancy/:vid/apply",
  catchAsync(Landing.renderOneVacancyApplyQuery)
);

router.get(
  "/one/vacancy/:vid/query",
  catchAsync(Landing.renderOneVacancyQuery)
);

router.get(
  "/one/vacancy/:vid/all/applications",
  catchAsync(Landing.renderOneVacancyAllApplicationsQuery)
);

router.patch(
  "/one/app/schedule/:acid",
  catchAsync(Landing.renderOneVacancyOneApplicationScheduleQuery)
);

module.exports = router;
