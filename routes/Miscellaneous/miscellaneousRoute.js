const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../../middleware");
const catchAsync = require("../../Utilities/catchAsync");
const All = require("../../controllers/Miscellaneous/miscellaneousController");

// All Staff Data
// isLoggedIn, isValidKey
router.get("/staff/list/data", isLoggedIn, catchAsync(All.getAllStaff));

// All Student Data
router.get("/student/list/data", isLoggedIn, catchAsync(All.getAllStudent));

// All User Data
router.get("/user/list/data", isLoggedIn, catchAsync(All.getAllUser));

// All Playlist Data
router.get("/playlist/list/data", isLoggedIn, catchAsync(All.getAllPlaylist));

// All Fees Data
router.get("/fee/list/payment", isLoggedIn, catchAsync(All.getAllFee));

// All Checklist Data
router.get(
  "/checklist/list/payment",
  isLoggedIn,
  catchAsync(All.getAllChecklist)
);

// All Institute Data
router.get("/institute/list/data", isLoggedIn, catchAsync(All.getAllInstitute));

// All Payment Data
router.get("/payment/day", isLoggedIn, catchAsync(All.getAllPayments));

// All Batch Data
router.get("/batch/list/data", isLoggedIn, catchAsync(All.getAllBatch));

// All Video Data
router.get("/video/list/data", isLoggedIn, catchAsync(All.getAllVideo));



module.exports = router;
