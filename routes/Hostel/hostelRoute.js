const express = require("express");
const router = express.Router();
const Hostel = require("../../controllers/Hostel/hostelController");
const catchAsync = require("../../Utilities/catchAsync");
const { isLoggedIn, isApproved } = require("../../middleware");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.post(
  "/ins/:id/staff/:sid",
  catchAsync(Hostel.renderActivateHostelQuery)
);

router.get("/:hid/dashboard/query", catchAsync(Hostel.renderHostelDashQuery));

router.post(
  "/:hid/new/hostel/unit",
  catchAsync(Hostel.renderHostelNewUnitQuery)
);

router.get(
  "/:hid/all/hostel/unit",
  catchAsync(Hostel.renderAllHostelUnitQuery)
);

router.get(
  "/:huid/one/hostel/unit/query",
  catchAsync(Hostel.renderOneHostelUnitQuery)
);

router.post(
  "/:huid/one/hostel/unit/new/room",
  catchAsync(Hostel.renderOneHostelUnitNewRoomQuery)
);

router.get(
  "/:huid/one/hostel/unit/all/room",
  catchAsync(Hostel.renderOneHostelUnitAllRoomQuery)
);

router.get(
  "/:hrid/one/hostel/room/query",
  catchAsync(Hostel.renderOneHostelRoomQuery)
);

router.get(
  "/:hid/all/fee/structure",
  catchAsync(Hostel.renderHostelAllFeeStructure)
);

router.get("/:hid/all/wardens", catchAsync(Hostel.renderHostelAllWardenQuery));

router.get(
  "/:hid/all/hostelities",
  catchAsync(Hostel.renderHostelAllHostalitiesQuery)
);

router.patch(
  "/:hid/new/existing/rules/regulation",
  catchAsync(Hostel.renderHostelNewExistingRulesQuery)
);

router.patch(
  "/:hid/new/existing/form/query",
  catchAsync(Hostel.renderHostelNewExistingFormQuery)
);

router.post(
  "/:aid/new/application",
  catchAsync(Hostel.renderNewHostelApplicationQuery)
);

router.post(
  "/:uid/user/:aid/apply",
  catchAsync(Hostel.renderHostelReceievedApplication)
);

router.get(
  "/:hid/all/ongoing/application",
  catchAsync(Hostel.renderHostelAllApplication)
);

router.get(
  "/:hid/all/completed/application",
  catchAsync(Hostel.renderHostelAllCompletedApplication)
);

router.get(
  "/:id/application/list/array",
  catchAsync(Hostel.renderSearchHostelApplicationQuery)
);

router.get(
  "/:aid/application/query",
  catchAsync(Hostel.renderOneHostelApplicationQuery)
);

router.post(
  "/:sid/student/:aid/select",
  catchAsync(Hostel.renderHostelSelectedQuery)
);

router.post(
  "/:sid/student/pay/mode/:aid/apply/status/:statusId",
  catchAsync(Hostel.renderHostelPayMode)
);

router.post(
  "/:sid/student/:aid/pay/offline/confirm",
  catchAsync(Hostel.renderPayOfflineHostelFee)
);

router.post(
  "/:sid/student/:aid/pay/refund",
  catchAsync(Hostel.renderCancelHostelRefundApplicationQuery)
);

router.patch(
  "/:aid/application/complete",
  catchAsync(Hostel.renderCompleteHostelApplication)
);

router.get(
  "/:hid/all/remaining/array",
  catchAsync(Hostel.renderHostelRemainingArray)
);

router.post(
  "/student/:aid/allot/bed",
  catchAsync(Hostel.renderAllotHostedBedQuery)
);

router.post(
  "/:hid/paid/remaining/fee/:sid/student/:appId",
  catchAsync(Hostel.renderPaidRemainingFeeStudentQuery)
);

router.patch(
  "/:hid/paid/remaining/fee/:sid/student/:appId/refund/by",
  catchAsync(Hostel.renderPaidRemainingFeeStudentRefundBy)
);

router.patch(
  "/:statusId/status/cancel/app/:aid/student/:sid",
  catchAsync(Hostel.renderStudentCancelHostelAdmissionMode)
);

router.get("/:hid/all/receipts/by", catchAsync(Hostel.renderAllReceiptsQuery));

router.patch(
  "/:hid/one/receipts/:rid/status",
  catchAsync(Hostel.renderOneReceiptStatus)
);

router.patch(
  "/:sid/re/apply/receipts/:rid",
  catchAsync(Hostel.renderOneHostelReceiptReApply)
);

router.post(
  "/:aid/select/student/mode/:sid",
  catchAsync(Hostel.renderAdminSelectMode)
);

router.post(
  "/:aid/cancel/select/student/:sid",
  catchAsync(Hostel.renderAdminStudentCancelSelectQuery)
);

router.patch(
  "/:sid/go/offline/receipt/:appId",
  catchAsync(Hostel.renderStudentGoOfflineHostelReceiptQuery)
);

router.get(
  "/:huid/request/application",
  catchAsync(Hostel.renderHostelUnitAllReceievedApplication)
);

router.get(
  "/:huid/selected/application",
  catchAsync(Hostel.renderHostelUnitAllSelectedApplication)
);

router.get(
  "/:huid/confirmed/application",
  catchAsync(Hostel.renderHostelUnitAllConfirmedApplication)
);

router.get(
  "/:huid/allotted/application",
  catchAsync(Hostel.renderHostelUnitAllAllottedApplication)
);

router.get(
  "/:huid/cancelled/application",
  catchAsync(Hostel.renderHostelUnitAllCancelledApplication)
);

router.post(
  "/:sid/student/:aid/cancel/app",
  catchAsync(Hostel.renderHostelCancelApplication)
);

router.post(
  "/:sid/student/:huid/cancel/app/renewal",
  catchAsync(Hostel.renderHostelCancelApplicationRenewal)
);

router.post(
  "/:sid/student/:huid/select/renewal",
  catchAsync(Hostel.renderHostelSelectedRenewalQuery)
);

router.post(
  "/:sid/student/pay/mode/:rid/apply/renewal",
  catchAsync(Hostel.renderHostelPayModeRenewal)
);

router.post(
  "/:sid/student/:huid/pay/offline/confirm/renewal/:aid",
  catchAsync(Hostel.renderPayOfflineHostelFeeRenewal)
);

router.post(
  "/student/:aid/allot/bed/:huid/renewal",
  catchAsync(Hostel.renderAllotHostedBedRenewalQuery)
);

router.post(
  "/:sid/student/:aid/pay/refund/:huid/renewal",
  catchAsync(Hostel.renderCancelHostelRefundRenewalApplicationQuery)
);

router.get(
  "/:sid/all/renewals",
  catchAsync(Hostel.renderHostelAllStudentRenewalQuery)
);

router.get(
  "/:sid/all/roommates/query",
  catchAsync(Hostel.renderHostelAllStudentRoommatesQuery)
);

module.exports = router;
