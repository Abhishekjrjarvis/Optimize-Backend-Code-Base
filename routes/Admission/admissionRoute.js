const express = require('express')
const router = express.Router()
const Admission = require('../../controllers/Admission/admissionController')
const catchAsync = require('../../Utilities/catchAsync')
const { isLoggedIn, isApproved } = require('../../middleware')
const multer = require('multer')
const upload = multer({ dest: "uploads/" });

router.post('/ins/:id/staff/:sid', isLoggedIn, isApproved, catchAsync(Admission.retrieveAdmissionAdminHead))

router.get('/:aid/dashboard/query', catchAsync(Admission.retrieveAdmissionDetailInfo))

router.patch('/:aid/info/update', catchAsync(Admission.fetchAdmissionQuery))

router.post('/:aid/new/application', catchAsync(Admission.retrieveAdmissionNewApplication))

// router.get('/:id/application', catchAsync(Admission.fetchAdmissionApplicationArray))

router.post('/:uid/user/:aid/apply', upload.array('file'), catchAsync(Admission.retrieveAdmissionReceievedApplication))

router.post('/:sid/student/:aid/select', catchAsync(Admission.retrieveAdmissionSelectedApplication))

router.post('/:sid/student/:aid/pay/offline/confirm', catchAsync(Admission.payOfflineAdmissionFee))

module.exports = router