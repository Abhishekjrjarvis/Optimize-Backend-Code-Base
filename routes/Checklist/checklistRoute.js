const express = require("express");
const router = express.Router();
const checklist = require("../../controllers/Checklist/index");
const { isLoggedIn } = require("../../middleware");
const catchAsync = require("../../Utilities/catchAsync");

router
  .route("/:cid")
  .get(catchAsync(checklist.getOneChecklist))
  .patch(isLoggedIn, catchAsync(checklist.updateChecklist));
router
  .route("/department/:did")
  .post(isLoggedIn, catchAsync(checklist.createChecklist));
router
  .route("/:cid/assign-student/:sid")
  .patch(isLoggedIn, catchAsync(checklist.studentAssignChecklist));
router
  .route("/department/:did/all")
  .get(isLoggedIn, catchAsync(checklist.getAllChecklistDepartment));
router
  .route("/class/:cid/all")
  .get(isLoggedIn, catchAsync(checklist.getAllChecklistClass));
router
  .route("/view/:did")
  .get(isLoggedIn, catchAsync(checklist.viewDepartment));

router
  .route("/:cid/destroy/:did")
  .delete(catchAsync(checklist.renderChecklistDeleteQuery));

module.exports = router;
