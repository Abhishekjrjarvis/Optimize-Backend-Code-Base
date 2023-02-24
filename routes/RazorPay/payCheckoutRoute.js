const express = require("express");
const router = express.Router();
const Razor = require("../../controllers/RazorPay/pay");
const { isLoggedIn } = require("../../middleware");

router.get(
  "/merchant/author/:id",
  isLoggedIn,
  Razor.institute_merchant_replace
);

router.get("/get/keys", isLoggedIn, Razor.renderKeys);

router.post("/checkout", Razor.checkoutRazorPayment);

router.post("/verify", Razor.verifyRazorPayment);

router.get("/history/by", Razor.fetchPaymentHistoryQueryBy);

router.get("/history/to", Razor.fetchPaymentHistoryQueryTo);

router.get("/one/:pid", isLoggedIn, Razor.fetchPaymentOneHistory);

module.exports = router;
